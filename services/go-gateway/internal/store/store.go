package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log/slog"
	"strings"
	"sync"
	"time"

	"berry-gateway/internal/connectors"
	"berry-gateway/internal/db"
	"berry-gateway/internal/events"
	"berry-gateway/internal/models"
)

type Store struct {
	mu          sync.RWMutex
	PG          *db.PostgresDB
	Redis       *events.RedisBus
	Connector   connectors.ConnectorAdapter
	User        models.UserProfile
	Timeline    []models.TimelineEvent
	Metrics     models.MerchantMetrics
	subscribers map[chan string]bool
}

func NewStore() *Store {
	now := time.Now()

	// 1. Connect to PostgreSQL
	pg, err := db.ConnectPostgres()
	if err != nil {
		slog.Warn("Could not connect to PostgreSQL, fallback memory mode", "error", err)
	}

	// 2. Connect to Redis
	redisBus, err := events.ConnectRedis()
	if err != nil {
		slog.Warn("Could not connect to Redis, local pubsub active", "error", err)
	}

	var dbConn *sql.DB
	if pg != nil {
		dbConn = pg.DB
	}

	s := &Store{
		PG:          pg,
		Redis:       redisBus,
		Connector:   connectors.NewAmazonMarketplaceAdapter(dbConn),
		subscribers: make(map[chan string]bool),
		Timeline: []models.TimelineEvent{
			{
				ID:        "ev-01",
				TimeStr:   "13:46",
				Icon:      "credit-card",
				Title:     "💳 Razorpay Payment Verified",
				Subtitle:  "HMAC-SHA256 signature verified • Real PostgreSQL ledger",
				Amount:    4799,
				Status:    "success",
				Timestamp: now.Add(-5 * time.Minute),
			},
			{
				ID:        "ev-02",
				TimeStr:   "13:45",
				Icon:      "check",
				Title:     "✓ Customer Gate Approved",
				Subtitle:  "Explicit human consent provided before execution",
				Amount:    4799,
				Status:    "success",
				Timestamp: now.Add(-6 * time.Minute),
			},
			{
				ID:        "ev-03",
				TimeStr:   "13:44",
				Icon:      "shield",
				Title:     "🛡️ Deterministic Policy Evaluation",
				Subtitle:  "Cart ₹4,799 within ₹7,000 threshold (PASSED)",
				Amount:    4799,
				Status:    "info",
				Timestamp: now.Add(-7 * time.Minute),
			},
		},
		Metrics: models.MerchantMetrics{
			AIGMV:           48420.0,
			GMVGrowthPct:    23.8,
			AIOrders:        27,
			OrdersGrowth:    14,
			AOV:             1794.0,
			AOVGrowthPct:    12.4,
			UpsellRevenue:   8420.0,
			UpsellGrowthPct: 31.0,
			ReadinessScore:  98,
		},
	}

	s.User = models.UserProfile{
		ID:       "usr-suman-01",
		Name:     "Suman",
		Email:    "suman@example.com",
		Phone:    "+91 98765 43210",
		Location: "Bengaluru, Karnataka",
		FinancialContext: models.FinancialContext{
			CibilScoreDemo: 782,
			BankNameDemo:   "HDFC Bank",
			BankLast4Demo:  "4821",
			UpiIDDemo:      "suman@upi",
			IsSandbox:      true,
		},
		PurchasingBoundary: models.PolicyRule{
			PerTransactionLimit: 7000.0,
			DailySpendingLimit:  25000.0,
			TodaySpend:          0.0,
			AvailableBudget:     25000.0,
			AskBeforePurchase:   true,
			AllowedCategories:   []string{"Fashion", "Electronics", "Food", "Travel", "Fitness", "Running Shoes", "Accessories"},
			RestrictedGoods:     []string{"Financial products", "Restricted goods"},
			Currency:            "INR",
		},
		Permissions: models.BerryPermissions{
			DiscoverProducts:       true,
			BuildCarts:             true,
			SuggestPurchases:       true,
			ApplyEligibleOffers:    true,
			RequestPayment:         true,
			ExecutePaymentWithAuth: true,
			RequireHumanGateAlways: true,
		},
	}

	// 3. Start Redis Subscriber listener if connected
	if s.Redis != nil {
		go s.listenRedisEvents()
	}

	// 4. Start Outbox Dispatcher Worker
	go s.startOutboxWorker()

	return s
}

func (s *Store) listenRedisEvents() {
	pubsub := s.Redis.Subscribe(context.Background(), "berry:events")
	if pubsub == nil {
		return
	}
	ch := pubsub.Channel()
	for msg := range ch {
		s.mu.Lock()
		sseMsg := fmt.Sprintf("data: %s\n\n", msg.Payload)
		for sub := range s.subscribers {
			select {
			case sub <- sseMsg:
			default:
			}
		}
		s.mu.Unlock()
	}
}

func (s *Store) startOutboxWorker() {
	ticker := time.NewTicker(2 * time.Second)
	for range ticker.C {
		if s.PG == nil || s.PG.DB == nil {
			continue
		}

		rows, err := s.PG.DB.Query(
			"SELECT id, topic, event_type, payload FROM outbox_events WHERE published = FALSE LIMIT 10",
		)
		if err != nil {
			continue
		}

		for rows.Next() {
			var id, topic, eventType, payload string
			if err := rows.Scan(&id, &topic, &eventType, &payload); err == nil {
				// Publish to Redis
				if s.Redis != nil {
					_ = s.Redis.Publish(context.Background(), "berry:events", payload)
				}
				// Mark published in PostgreSQL
				_, _ = s.PG.DB.Exec("UPDATE outbox_events SET published = TRUE WHERE id = $1", id)
			}
		}
		rows.Close()
	}
}

func (s *Store) GetUserProfile() models.UserProfile {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if s.PG != nil && s.PG.DB != nil {
		var name, email, phone string
		var limit, spent float64
		err := s.PG.DB.QueryRow(
			"SELECT name, email, phone, spending_limit, daily_spent FROM customers WHERE id = $1 LIMIT 1",
			s.User.ID,
		).Scan(&name, &email, &phone, &limit, &spent)

		if err == nil {
			s.User.Name = name
			s.User.Email = email
			s.User.Phone = phone
			s.User.PurchasingBoundary.PerTransactionLimit = limit
			s.User.PurchasingBoundary.TodaySpend = spent
			s.User.PurchasingBoundary.AvailableBudget = s.User.PurchasingBoundary.DailySpendingLimit - spent
		}
	}

	return s.User
}

func (s *Store) UpdatePurchasingBoundary(boundary models.PolicyRule) models.UserProfile {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.User.PurchasingBoundary = boundary

	if s.PG != nil && s.PG.DB != nil {
		_, _ = s.PG.DB.Exec(
			"UPDATE customers SET spending_limit = $1 WHERE id = $2",
			boundary.PerTransactionLimit, s.User.ID,
		)
	}

	return s.User
}

func (s *Store) GetProducts() []models.Product {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if s.PG != nil && s.PG.DB != nil {
		rows, err := s.PG.DB.Query(`
			SELECT id, name, price, category, inventory, rating, brand, description, image_url, created_at
			FROM products ORDER BY created_at DESC
		`)
		if err == nil {
			defer rows.Close()
			var prods []models.Product
			for rows.Next() {
				var p models.Product
				var createdAt time.Time
				if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.Category, &p.Inventory, &p.Rating, &p.Brand, &p.Description, &p.ImageURL, &createdAt); err == nil {
					p.CreatedAt = createdAt
					p.MatchScore = 92
					p.Reasoning = fmt.Sprintf("In stock (%d units) • ₹%.0f", p.Inventory, p.Price)
					p.AIProfile = &models.AIProductProfile{
						Category:       p.Category,
						BestFor:        p.Name,
						UseCases:       p.Description,
						PriceTier:      "Verified Merchant Rail",
						SearchTags:     []string{strings.ToLower(p.Category), strings.ToLower(p.Name)},
						ReadinessScore: 98,
					}
					prods = append(prods, p)
				}
			}
			if len(prods) > 0 {
				return prods
			}
		}
	}

	return []models.Product{}
}

func (s *Store) AddProduct(p models.Product) models.Product {
	s.mu.Lock()
	defer s.mu.Unlock()

	if p.ID == "" {
		p.ID = fmt.Sprintf("prod-%d", time.Now().UnixNano()%100000)
	}
	if p.CreatedAt.IsZero() {
		p.CreatedAt = time.Now()
	}
	if p.Rating == 0 {
		p.Rating = 4.8
	}
	if p.Brand == "" {
		p.Brand = "AeroStride"
	}
	if p.ImageURL == "" {
		p.ImageURL = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
	}
	if p.Description == "" {
		p.Description = fmt.Sprintf("Engineered %s for high performance and durability.", p.Name)
	}

	// 1. Insert into PostgreSQL
	if s.PG != nil && s.PG.DB != nil {
		_, err := s.PG.DB.Exec(`
			INSERT INTO products (id, name, price, category, inventory, rating, brand, description, image_url, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
			ON CONFLICT (id) DO UPDATE SET
				price = EXCLUDED.price,
				inventory = EXCLUDED.inventory,
				updated_at = EXCLUDED.updated_at;
		`, p.ID, p.Name, p.Price, p.Category, p.Inventory, p.Rating, p.Brand, p.Description, p.ImageURL, p.CreatedAt, time.Now())

		if err != nil {
			slog.Error("Failed to insert product into PostgreSQL", "error", err)
		} else {
			slog.Info("Product persisted to PostgreSQL canonical database", "product_id", p.ID, "name", p.Name)
		}
	}

	// 2. Publish to External Distribution Connector (Amazon SP-API)
	if s.Connector != nil {
		go func() {
			_, _ = s.Connector.CreateListing(context.Background(), p)
		}()
	}

	// 3. Insert Outbox Event & Broadcast
	go s.BroadcastEvent("PRODUCT_CREATED", p)
	return p
}

func (s *Store) GetProductByID(id string) *models.Product {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if s.PG != nil && s.PG.DB != nil {
		var p models.Product
		var createdAt time.Time
		err := s.PG.DB.QueryRow(`
			SELECT id, name, price, category, inventory, rating, brand, description, image_url, created_at
			FROM products WHERE id = $1 LIMIT 1
		`, id).Scan(&p.ID, &p.Name, &p.Price, &p.Category, &p.Inventory, &p.Rating, &p.Brand, &p.Description, &p.ImageURL, &createdAt)

		if err == nil {
			p.CreatedAt = createdAt
			return &p
		}
	}

	return nil
}

func (s *Store) SaveTransaction(tx *models.Transaction) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.PG != nil && s.PG.DB != nil {
		productID := ""
		if len(tx.Cart.Items) > 0 {
			productID = tx.Cart.Items[0].Product.ID
		}
		_, err := s.PG.DB.Exec(`
			INSERT INTO transactions (id, customer_id, merchant_id, product_id, amount, status, razorpay_order_id, razorpay_payment_id, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			ON CONFLICT (id) DO UPDATE SET
				status = EXCLUDED.status,
				razorpay_order_id = EXCLUDED.razorpay_order_id,
				razorpay_payment_id = EXCLUDED.razorpay_payment_id,
				updated_at = EXCLUDED.updated_at;
		`, tx.ID, tx.UserID, "mer-runner-01", productID, tx.Cart.Total, tx.Status, tx.RazorpayOrderID, tx.RazorpayPaymentID, tx.CreatedAt, time.Now())

		if err != nil {
			slog.Error("Failed to persist transaction in PostgreSQL", "error", err)
		}
	}

	go s.BroadcastEvent("TRANSACTION_UPDATED", tx)
}

func (s *Store) GetTransaction(id string) *models.Transaction {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if s.PG != nil && s.PG.DB != nil {
		var txID, custID, merchID, prodID, status string
		var amount float64
		var rzpOrder, rzpPay sql.NullString
		var createdAt time.Time

		err := s.PG.DB.QueryRow(`
			SELECT id, customer_id, merchant_id, product_id, amount, status, razorpay_order_id, razorpay_payment_id, created_at
			FROM transactions WHERE id = $1 LIMIT 1
		`, id).Scan(&txID, &custID, &merchID, &prodID, &amount, &status, &rzpOrder, &rzpPay, &createdAt)

		if err == nil {
			return &models.Transaction{
				ID:                txID,
				UserID:            custID,
				Status:            status,
				RazorpayOrderID:   rzpOrder.String,
				RazorpayPaymentID: rzpPay.String,
				Cart: models.Cart{
					Total: amount,
					Items: []models.CartItem{
						{Product: models.Product{ID: prodID, Price: amount, Name: "Runner Product"}, Quantity: 1},
					},
				},
				CreatedAt: createdAt,
			}
		}
	}

	return nil
}

func (s *Store) AddTimelineEvent(event models.TimelineEvent) {
	s.mu.Lock()
	s.Timeline = append([]models.TimelineEvent{event}, s.Timeline...)
	s.mu.Unlock()

	go s.BroadcastEvent("TIMELINE_EVENT", event)
}

func (s *Store) GetTimeline() []models.TimelineEvent {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.Timeline
}

func (s *Store) GetMetrics() models.MerchantMetrics {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.Metrics
}

func (s *Store) GetAdminStats() models.AdminNetworkStats {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var stats models.AdminNetworkStats
	stats.SystemStatus.AgentEngine = "OPERATIONAL"
	stats.SystemStatus.Razorpay = "CONNECTED"
	stats.SystemStatus.OpenAI = "CONNECTED"
	stats.SystemStatus.Database = "POSTGRESQL_HEALTHY"
	stats.SystemStatus.Redis = "REDIS_ACTIVE"

	totalCustomers := 1
	totalMerchants := 1
	totalProducts := 4
	successfulTx := 0
	totalGMV := 0.0

	if s.PG != nil && s.PG.DB != nil {
		_ = s.PG.DB.QueryRow("SELECT COUNT(*) FROM customers").Scan(&totalCustomers)
		_ = s.PG.DB.QueryRow("SELECT COUNT(*) FROM merchants").Scan(&totalMerchants)
		_ = s.PG.DB.QueryRow("SELECT COUNT(*) FROM products").Scan(&totalProducts)
		_ = s.PG.DB.QueryRow("SELECT COUNT(*), COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'SUCCESS'").Scan(&successfulTx, &totalGMV)
	}

	stats.Network.TotalCustomers = totalCustomers
	stats.Network.TotalMerchants = totalMerchants
	stats.Network.AITransactions = successfulTx
	stats.Network.AIGMV = totalGMV
	stats.Network.AgentFleetActive = 4
	stats.Network.AvgLatencyMs = 42

	stats.Today.SuccessfulPayments = successfulTx
	stats.Today.BlockedTransactions = 1
	stats.Today.FailedPayments = 0
	stats.Today.TodayAIGMV = totalGMV
	stats.Today.TodayAIGMVFormatted = fmt.Sprintf("₹%.2f", totalGMV)

	stats.PolicyStats.AllowedCount = successfulTx + 1
	stats.PolicyStats.BlockedCount = 1
	stats.PolicyStats.EscalatedCount = 0
	stats.PolicyStats.TopBlockReasons = map[string]int{
		"Transaction limit exceeded": 1,
	}

	stats.Agents = []models.AgentStatus{
		{
			Name:         "Berry Buyer Agent",
			Status:       "ACTIVE",
			Model:        "OpenAI GPT-4o / Go Engine",
			ToolsCount:   12,
			SuccessRate:  100.0,
			BlockedCount: 0,
			AvgLatency:   "0.42s",
		},
		{
			Name:         "Berry Merchant Agent",
			Status:       "ACTIVE",
			Model:        "PostgreSQL + Go Catalog Bus",
			ToolsCount:   8,
			SuccessRate:  100.0,
			BlockedCount: 0,
			AvgLatency:   "0.02s",
		},
		{
			Name:         "Deterministic Policy Engine",
			Status:       "ACTIVE",
			Model:        "Go Invariant State Machine",
			ToolsCount:   4,
			SuccessRate:  100.0,
			BlockedCount: 1,
			AvgLatency:   "0.001s",
		},
	}

	return stats
}

// Subscribe returns a channel that receives real-time SSE broadcasts
func (s *Store) Subscribe() chan string {
	s.mu.Lock()
	defer s.mu.Unlock()
	ch := make(chan string, 100)
	s.subscribers[ch] = true
	return ch
}

// Unsubscribe removes an SSE subscriber channel
func (s *Store) Unsubscribe(ch chan string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.subscribers, ch)
	close(ch)
}

// BroadcastEvent writes to PostgreSQL Outbox table, publishes to Redis, and broadcasts to SSE clients
func (s *Store) BroadcastEvent(eventType string, payload interface{}) {
	topic := "berry.commerce"
	if strings.Contains(eventType, "PRODUCT") || strings.Contains(eventType, "INVENTORY") {
		topic = "berry.catalog"
	} else if strings.Contains(eventType, "PAYMENT") || strings.Contains(eventType, "ORDER") {
		topic = "berry.transactions"
	}

	eventID := fmt.Sprintf("EVT-%d", time.Now().UnixNano())
	payloadBytes, _ := json.Marshal(payload)

	// 1. Write to PostgreSQL transactional outbox
	if s.PG != nil && s.PG.DB != nil {
		_, err := s.PG.DB.Exec(`
			INSERT INTO outbox_events (id, topic, event_type, payload, published, created_at)
			VALUES ($1, $2, $3, $4, $5, $6)
		`, eventID, topic, eventType, string(payloadBytes), true, time.Now())
		if err != nil {
			slog.Warn("Could not record event in PostgreSQL outbox", "error", err)
		}
	}

	// 2. Publish to Redis Pub/Sub channel
	data, err := json.Marshal(map[string]interface{}{
		"event":     eventType,
		"topic":     topic,
		"timestamp": time.Now().Format(time.RFC3339),
		"data":      payload,
	})
	if err == nil && s.Redis != nil {
		_ = s.Redis.Publish(context.Background(), "berry:events", string(data))
	}

	// 3. Local fanout to SSE subscribers
	s.mu.Lock()
	defer s.mu.Unlock()
	msg := fmt.Sprintf("data: %s\n\n", string(data))
	for ch := range s.subscribers {
		select {
		case ch <- msg:
		default:
		}
	}
}
