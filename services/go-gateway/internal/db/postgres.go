package db

import (
	"database/sql"
	"fmt"
	"log/slog"
	"os"
	"time"

	_ "github.com/lib/pq"
)

type PostgresDB struct {
	DB *sql.DB
}

func ConnectPostgres() (*PostgresDB, error) {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://apple@localhost:5432/berry_db?sslmode=disable"
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open postgres connection: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		// Try fallback to postgres default db if berry_db is missing
		fallbackStr := "postgres://apple@localhost:5432/postgres?sslmode=disable"
		slog.Warn("Could not connect to primary DB, attempting fallback", "error", err, "fallback", fallbackStr)
		fallbackDB, fallbackErr := sql.Open("postgres", fallbackStr)
		if fallbackErr == nil && fallbackDB.Ping() == nil {
			db = fallbackDB
		} else {
			return nil, fmt.Errorf("failed to ping postgres database: %w", err)
		}
	}

	slog.Info("Connected to PostgreSQL database successfully")
	p := &PostgresDB{DB: db}
	if err := p.Migrate(); err != nil {
		return nil, fmt.Errorf("postgres migration failed: %w", err)
	}

	return p, nil
}

func (p *PostgresDB) Migrate() error {
	schema := `
	CREATE TABLE IF NOT EXISTS merchants (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		store_name TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS customers (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		phone TEXT NOT NULL,
		spending_limit NUMERIC NOT NULL,
		daily_spent NUMERIC DEFAULT 0,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS products (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		price NUMERIC NOT NULL,
		category TEXT NOT NULL,
		inventory INT NOT NULL,
		rating NUMERIC DEFAULT 5.0,
		brand TEXT NOT NULL,
		description TEXT NOT NULL,
		image_url TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS transactions (
		id TEXT PRIMARY KEY,
		customer_id TEXT,
		merchant_id TEXT,
		product_id TEXT,
		amount NUMERIC NOT NULL,
		status TEXT NOT NULL,
		razorpay_order_id TEXT,
		razorpay_payment_id TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS outbox_events (
		id TEXT PRIMARY KEY,
		topic TEXT NOT NULL,
		event_type TEXT NOT NULL,
		payload TEXT NOT NULL,
		published BOOLEAN DEFAULT FALSE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS connector_listings (
		id TEXT PRIMARY KEY,
		channel TEXT NOT NULL,
		product_id TEXT NOT NULL,
		external_listing_id TEXT NOT NULL,
		sync_status TEXT NOT NULL,
		channel_sku TEXT NOT NULL,
		last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	`

	_, err := p.DB.Exec(schema)
	if err != nil {
		return fmt.Errorf("error executing migration: %w", err)
	}

	slog.Info("PostgreSQL tables verified & migrated")
	return p.seedInitialData()
}

func (p *PostgresDB) seedInitialData() error {
	// 1. Seed Customer
	var count int
	err := p.DB.QueryRow("SELECT COUNT(*) FROM customers").Scan(&count)
	if err == nil && count == 0 {
		_, _ = p.DB.Exec(`
			INSERT INTO customers (id, name, email, phone, spending_limit, daily_spent)
			VALUES ('usr-suman-01', 'Suman', 'suman@example.com', '+91 98765 43210', 7000, 0);
		`)
	}

	// 2. Seed Merchant
	err = p.DB.QueryRow("SELECT COUNT(*) FROM merchants").Scan(&count)
	if err == nil && count == 0 {
		_, _ = p.DB.Exec(`
			INSERT INTO merchants (id, name, email, store_name)
			VALUES ('mer-runner-01', 'Runner Co Team', 'partner@runner.co', 'Runner.co Official Store');
		`)
	}

	// 3. Seed Products if empty
	err = p.DB.QueryRow("SELECT COUNT(*) FROM products").Scan(&count)
	if err == nil && count == 0 {
		prods := []struct {
			id, name, category, brand, desc, img string
			price                                 float64
			inventory                             int
		}{
			{
				id:        "prod-nimbus",
				name:      "Nimbus Runner",
				price:     4799,
				category:  "Running Shoes",
				inventory: 18,
				brand:     "AeroStride",
				desc:      "High-responsiveness lightweight daily trainer with breathable athletic upper mesh.",
				img:       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
			},
			{
				id:        "prod-velocity",
				name:      "Velocity Pro Carbon",
				price:     6499,
				category:  "Running Shoes",
				inventory: 8,
				brand:     "AeroStride",
				desc:      "Full-length carbon fiber propulsion plate shoe for tempo runs and half-marathons.",
				img:       "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
			},
			{
				id:        "cross-socks-01",
				name:      "Performance Running Socks (3-Pack)",
				price:     499,
				category:  "Accessories",
				inventory: 45,
				brand:     "AeroStride",
				desc:      "Anti-blister seamless compression socks engineered for long distance daily road running.",
				img:       "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format&fit=crop&q=80",
			},
			{
				id:        "prod-trail-flask",
				name:      "Trail Pro Flask 750ml",
				price:     1199,
				category:  "Accessories",
				inventory: 24,
				brand:     "HydraSpeed",
				desc:      "BPA-free handheld hydration flask with ergonomic grip for marathon runners.",
				img:       "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80",
			},
		}

		for _, pr := range prods {
			_, _ = p.DB.Exec(`
				INSERT INTO products (id, name, price, category, inventory, rating, brand, description, image_url)
				VALUES ($1, $2, $3, $4, $5, 4.9, $6, $7, $8)
				ON CONFLICT (id) DO NOTHING;
			`, pr.id, pr.name, pr.price, pr.category, pr.inventory, pr.brand, pr.desc, pr.img)
		}
		slog.Info("PostgreSQL initial catalog seeded with baseline items")
	}

	return nil
}
