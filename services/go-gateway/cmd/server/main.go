package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"berry-gateway/internal/handlers"
	"berry-gateway/internal/payment"
	"berry-gateway/internal/store"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	st := store.NewStore()
	rzp := payment.NewRazorpayService()
	h := handlers.NewHandler(st, rzp)

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-Trace-ID"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health Check
	r.Get("/health", h.Health)

	// Razorpay Standard Checkouts Endpoints (Direct aliases)
	r.Post("/api/create-order", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Amount  float64 `json:"amount"` // in INR or paise
			Receipt string  `json:"receipt"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if req.Amount <= 0 {
			req.Amount = 6499.0
		}
		if req.Receipt == "" {
			req.Receipt = fmt.Sprintf("receipt_%d", time.Now().Unix())
		}

		order, err := rzp.CreateOrder(req.Amount, req.Receipt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(order)
	})

	r.Post("/api/verify-payment", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			OrderID   string `json:"razorpay_order_id"`
			PaymentID string `json:"razorpay_payment_id"`
			Signature string `json:"razorpay_signature"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if req.OrderID == "" || req.PaymentID == "" {
			http.Error(w, "missing order_id or payment_id", http.StatusBadRequest)
			return
		}

		valid := rzp.VerifySignature(req.OrderID, req.PaymentID, req.Signature)
		if !valid {
			http.Error(w, "invalid razorpay signature", http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":    true,
			"order_id":   req.OrderID,
			"payment_id": req.PaymentID,
			"verified":   true,
			"message":    "Razorpay payment verified successfully",
		})
	})

	// API v1 Routes
	r.Route("/api/v1", func(r chi.Router) {
		// Live Realtime SSE Nervous System
		r.Get("/events/stream", h.EventsStream)

		// Buyer & Agent
		r.Get("/profile", h.GetProfile)
		r.Put("/profile/boundary", h.UpdateBoundary)
		r.Get("/products", h.GetProducts)
		r.Post("/agent/chat", h.Chat)
		r.Post("/agent/vision-search", h.VisionSearch)
		r.Post("/cart/toggle-cross-sell", h.ToggleCrossSell)
		r.Post("/transactions/{id}/authorize", h.Authorize)
		r.Post("/payments/verify", h.VerifyPayment)
		r.Get("/activity", h.GetActivity)

		// Demo simulations (Blocked limit gate & 1-click cart fix)
		r.Post("/demo/trigger-limit-failure", h.TriggerLimitFailure)
		r.Post("/demo/fix-cart", h.FixCart)

		// Merchant OS & Growth
		r.Get("/merchant/metrics", h.GetMerchantMetrics)
		r.Post("/merchant/products", h.AddProductHandler)
		r.Post("/merchant/onboard-prompt", h.MerchantOnboardPrompt)
		r.Get("/merchant/opportunities", h.GetMerchantOpportunities)

		// Distribution & Payment Connectors Bus
		r.Get("/mcp/tools", h.GetMCPTools)
		r.Get("/connectors/channels", h.GetChannels)
		r.Post("/connectors/sync-price", h.SyncChannelPrice)

		// Admin Control Center
		r.Get("/admin/stats", h.GetAdminStats)
	})

	server := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	go func() {
		slog.Info("🫐 Berry Go API Gateway running", "port", port, "url", "http://localhost:"+port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("Server listen failed", "error", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	slog.Info("Shutting down Berry Go Gateway...")
}
