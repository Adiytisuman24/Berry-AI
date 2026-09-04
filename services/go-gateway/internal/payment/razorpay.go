package payment

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"math/rand"
	"net/http"
	"os"
	"time"
)

type RazorpayService struct {
	KeyID     string
	KeySecret string
	Client    *http.Client
}

func NewRazorpayService() *RazorpayService {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	if keyID == "" {
		keyID = "rzp_test_TXtd2CNmv3wGJZ"
	}
	if keySecret == "" {
		keySecret = "i4e6AocDmJ76kdJU2OYxuhGM"
	}

	return &RazorpayService{
		KeyID:     keyID,
		KeySecret: keySecret,
		Client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type OrderResponse struct {
	OrderID   string  `json:"order_id"`
	Amount    int64   `json:"amount"` // in paise
	AmountINR float64 `json:"amount_inr"`
	Currency  string  `json:"currency"`
	KeyID     string  `json:"key_id"`
	Receipt   string  `json:"receipt"`
	Status    string  `json:"status"`
}

type RazorpayAPICreateOrderRequest struct {
	Amount   int64             `json:"amount"` // paise
	Currency string            `json:"currency"`
	Receipt  string            `json:"receipt"`
	Notes    map[string]string `json:"notes,omitempty"`
}

type RazorpayAPICreateOrderResponse struct {
	ID        string `json:"id"`
	Entity    string `json:"entity"`
	Amount    int64  `json:"amount"`
	Currency  string `json:"currency"`
	Receipt   string `json:"receipt"`
	Status    string `json:"status"`
	Attempts  int    `json:"attempts"`
	CreatedAt int64  `json:"created_at"`
	Error     *struct {
		Code        string `json:"code"`
		Description string `json:"description"`
	} `json:"error,omitempty"`
}

func GenerateMockPaymentID() string {
	return fmt.Sprintf("pay_RZP%010d", rand.Intn(999999999))
}

// CreateOrder calls Razorpay API POST https://api.razorpay.com/v1/orders
func (s *RazorpayService) CreateOrder(amountINR float64, receipt string) (*OrderResponse, error) {
	amountPaise := int64(amountINR * 100)
	if amountPaise < 100 {
		return nil, fmt.Errorf("amount must be at least 100 paise (₹1.00)")
	}

	reqPayload := RazorpayAPICreateOrderRequest{
		Amount:   amountPaise,
		Currency: "INR",
		Receipt:  receipt,
		Notes: map[string]string{
			"agent":   "Berry AI Purchasing Agent",
			"policy":  "Verified & Human-Authorized",
			"receipt": receipt,
		},
	}

	reqBytes, err := json.Marshal(reqPayload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", "https://api.razorpay.com/v1/orders", bytes.NewBuffer(reqBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	authHeader := base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s:%s", s.KeyID, s.KeySecret)))
	req.Header.Set("Authorization", "Basic "+authHeader)

	slog.Info("Calling Razorpay Create Order API", "amount_paise", amountPaise, "receipt", receipt)

	resp, err := s.Client.Do(req)
	if err != nil {
		slog.Error("Razorpay API network failure", "error", err)
		return nil, fmt.Errorf("payment gateway communication failure: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 400 {
		slog.Error("Razorpay API rejected order creation", "status", resp.StatusCode, "response", string(bodyBytes))
		return nil, fmt.Errorf("razorpay order creation failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var rzpResp RazorpayAPICreateOrderResponse
	if err := json.Unmarshal(bodyBytes, &rzpResp); err != nil {
		return nil, fmt.Errorf("failed to decode razorpay order response: %w", err)
	}

	if rzpResp.ID == "" {
		return nil, fmt.Errorf("razorpay returned empty order id: %s", string(bodyBytes))
	}

	return &OrderResponse{
		OrderID:   rzpResp.ID,
		Amount:    rzpResp.Amount,
		AmountINR: amountINR,
		Currency:  rzpResp.Currency,
		KeyID:     s.KeyID,
		Receipt:   rzpResp.Receipt,
		Status:    rzpResp.Status,
	}, nil
}

// VerifySignature validates HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
func (s *RazorpayService) VerifySignature(orderID, paymentID, signature string) bool {
	if orderID == "" || paymentID == "" || signature == "" {
		return false
	}

	data := orderID + "|" + paymentID
	h := hmac.New(sha256.New, []byte(s.KeySecret))
	h.Write([]byte(data))
	expectedSignature := hex.EncodeToString(h.Sum(nil))

	slog.Info("Verifying Razorpay payment signature cryptographically", "order_id", orderID, "payment_id", paymentID)

	return hmac.Equal([]byte(expectedSignature), []byte(signature))
}
