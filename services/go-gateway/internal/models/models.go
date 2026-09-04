package models

import "time"

type UserProfile struct {
	ID                 string           `json:"id"`
	Name               string           `json:"name"`
	Email              string           `json:"email"`
	Phone              string           `json:"phone"`
	Location           string           `json:"location"`
	FinancialContext   FinancialContext `json:"financial_context"`
	PurchasingBoundary PolicyRule       `json:"purchasing_boundary"`
	Permissions        BerryPermissions `json:"permissions"`
}

type FinancialContext struct {
	CibilScoreDemo int    `json:"cibil_score_demo"` // Clearly marked demo
	BankNameDemo   string `json:"bank_name_demo"`
	BankLast4Demo  string `json:"bank_last4_demo"`
	UpiIDDemo      string `json:"upi_id_demo"`
	IsSandbox      bool   `json:"is_sandbox"`
}

type PolicyRule struct {
	PerTransactionLimit float64  `json:"per_transaction_limit"`
	DailySpendingLimit  float64  `json:"daily_spending_limit"`
	TodaySpend          float64  `json:"today_spend"`
	AvailableBudget     float64  `json:"available_budget"`
	AskBeforePurchase   bool     `json:"ask_before_purchase"`
	AllowedCategories   []string `json:"allowed_categories"`
	RestrictedGoods     []string `json:"restricted_goods"`
	Currency            string   `json:"currency"`
}

type BerryPermissions struct {
	DiscoverProducts       bool `json:"discover_products"`
	BuildCarts             bool `json:"build_carts"`
	SuggestPurchases       bool `json:"suggest_purchases"`
	ApplyEligibleOffers    bool `json:"apply_eligible_offers"`
	RequestPayment         bool `json:"request_payment"`
	ExecutePaymentWithAuth bool `json:"execute_payment_with_auth"`
	RequireHumanGateAlways bool `json:"require_human_gate_always"`
}

type AIProductProfile struct {
	Category        string   `json:"category"`
	BestFor         string   `json:"best_for"`
	UseCases        string   `json:"use_cases"`
	PriceTier       string   `json:"price_tier"`
	FrequentlyWith  string   `json:"frequently_bought_with"`
	SearchTags      []string `json:"search_tags"`
	ReadinessScore  int      `json:"readiness_score"`
}

type Product struct {
	ID             string            `json:"id"`
	Name           string            `json:"name"`
	Price          float64           `json:"price"`
	Category       string            `json:"category"`
	Brand          string            `json:"brand"`
	Rating         float64           `json:"rating"`
	Description    string            `json:"description"`
	Inventory      int               `json:"inventory"`
	MatchScore     int               `json:"match_score,omitempty"`
	Reasoning      string            `json:"reasoning,omitempty"`
	CrossSellItems []string          `json:"cross_sell_items,omitempty"`
	ImageURL       string            `json:"image_url,omitempty"`
	AIProfile      *AIProductProfile `json:"ai_profile,omitempty"`
	CreatedAt      time.Time         `json:"created_at"`
}

type CartItem struct {
	Product  Product `json:"product"`
	Quantity int     `json:"quantity"`
	IsAddon  bool    `json:"is_addon"`
}

type Cart struct {
	ID       string     `json:"id"`
	UserID   string     `json:"user_id"`
	Items    []CartItem `json:"items"`
	Subtotal float64    `json:"subtotal"`
	Discount float64    `json:"discount"`
	Total    float64    `json:"total"`
}

type PolicyDecision struct {
	IsAllowed           bool      `json:"is_allowed"`
	RequiresUserConsent bool      `json:"requires_user_consent"`
	AuthorizedLimit     float64   `json:"authorized_limit"`
	RequestedAmount     float64   `json:"requested_amount"`
	Difference          float64   `json:"difference"`
	CategoryAllowed     bool      `json:"category_allowed"`
	Reason              string    `json:"reason"`
	PaymentAttempted    bool      `json:"payment_attempted"`
	MoneyMoved          float64   `json:"money_moved"`
	Timestamp           time.Time `json:"timestamp"`
}

type Transaction struct {
	ID                string          `json:"id"`
	UserID            string          `json:"user_id"`
	Intent            string          `json:"intent"`
	Cart              Cart            `json:"cart"`
	PolicyResult      PolicyDecision  `json:"policy_result"`
	AuthStatus        string          `json:"auth_status"` // "AWAITING_APPROVAL", "APPROVED", "REJECTED", "BLOCKED"
	RazorpayOrderID   string          `json:"razorpay_order_id,omitempty"`
	RazorpayPaymentID string          `json:"razorpay_payment_id,omitempty"`
	Status            string          `json:"status"` // "CREATED", "POLICY_APPROVED", "USER_APPROVED", "PAYMENT_SUCCESS", "BLOCKED"
	CreatedAt         time.Time       `json:"created_at"`
	AuditEvents       []TimelineEvent `json:"audit_events"`
	PassportID        string          `json:"passport_id,omitempty"`
}

type TimelineEvent struct {
	ID        string    `json:"id"`
	TimeStr   string    `json:"time_str"`
	Icon      string    `json:"icon"`
	Title     string    `json:"title"`
	Subtitle  string    `json:"subtitle"`
	Amount    float64   `json:"amount,omitempty"`
	Status    string    `json:"status"` // "success", "blocked", "info", "action"
	Timestamp time.Time `json:"timestamp"`
}

type MerchantMetrics struct {
	AIGMV           float64 `json:"ai_gmv"`
	GMVGrowthPct    float64 `json:"gmv_growth_pct"`
	AIOrders        int     `json:"ai_orders"`
	OrdersGrowth    int     `json:"orders_growth"`
	AOV             float64 `json:"aov"`
	AOVGrowthPct    float64 `json:"aov_growth_pct"`
	UpsellRevenue   float64 `json:"upsell_revenue"`
	UpsellGrowthPct float64 `json:"upsell_growth_pct"`
	ReadinessScore  int     `json:"readiness_score"`
}

type AdminNetworkStats struct {
	SystemStatus struct {
		AgentEngine string `json:"agent_engine"`
		Razorpay    string `json:"razorpay"`
		OpenAI      string `json:"openai"`
		Database    string `json:"database"`
		Redis       string `json:"redis"`
	} `json:"system_status"`
	Network struct {
		TotalCustomers   int     `json:"total_customers"`
		TotalMerchants   int     `json:"total_merchants"`
		AITransactions   int     `json:"ai_transactions"`
		AIGMV            float64 `json:"ai_gmv"`
		AgentFleetActive int     `json:"agent_fleet_active"`
		AvgLatencyMs     int     `json:"avg_latency_ms"`
	} `json:"network"`
	LiveAuditLog []TimelineEvent `json:"live_audit_log"`
	Today struct {
		SuccessfulPayments int     `json:"successful_payments"`
		BlockedTransactions int    `json:"blocked_transactions"`
		FailedPayments     int     `json:"failed_payments"`
		TodayAIGMV         float64 `json:"today_ai_gmv"`
		TodayAIGMVFormatted string `json:"today_ai_gmv_formatted"`
	} `json:"today"`
	PolicyStats struct {
		AllowedCount   int            `json:"allowed_count"`
		BlockedCount   int            `json:"blocked_count"`
		EscalatedCount int            `json:"escalated_count"`
		TopBlockReasons map[string]int `json:"top_block_reasons"`
	} `json:"policy_stats"`
	Agents []AgentStatus `json:"agents"`
}

type AgentStatus struct {
	Name        string  `json:"name"`
	Status      string  `json:"status"`
	Model       string  `json:"model"`
	ToolsCount  int     `json:"tools_count"`
	SuccessRate float64 `json:"success_rate"`
	BlockedCount int    `json:"blocked_count"`
	AvgLatency  string  `json:"avg_latency"`
}

type VisionSearchRequest struct {
	ImageData  string  `json:"image_data,omitempty"`
	Query      string  `json:"query,omitempty"`
	Budget     float64 `json:"budget,omitempty"`
	Refinement string  `json:"refinement,omitempty"`
}

type WhyBerryLikesIt struct {
	VisualMatch  string `json:"visual_match"`
	UnderBudget  string `json:"under_budget"`
	InStock      string `json:"in_stock"`
	Suitability  string `json:"suitability"`
	SpecialBadge string `json:"special_badge,omitempty"`
}

type ProductMatchCard struct {
	Product     Product         `json:"product"`
	MatchScore  int             `json:"match_score"`
	MatchReason string          `json:"match_reason"`
	WhyLikesIt  WhyBerryLikesIt `json:"why_likes_it"`
}

type VisionSearchResponse struct {
	Category           string             `json:"category"`
	DetectedSummary    string             `json:"detected_summary"`
	VisualAttributes   []string           `json:"visual_attributes"`
	UseCase            string             `json:"use_case"`
	Style              string             `json:"style"`
	Budget             float64            `json:"budget"`
	Confidence         float64            `json:"confidence"`
	RefinementApplied  string             `json:"refinement_applied,omitempty"`
	TopMatches         []ProductMatchCard `json:"top_matches"`
	RecommendedProduct Product            `json:"recommended_product"`
	Transaction        *Transaction       `json:"transaction,omitempty"`
}

type OutboxEvent struct {
	ID        string      `json:"id"`
	Topic     string      `json:"topic"`
	EventType string      `json:"event_type"`
	Payload   interface{} `json:"payload"`
	CreatedAt time.Time   `json:"created_at"`
	Status    string      `json:"status"`
}
