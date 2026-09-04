package policy

import (
	"testing"

	"berry-gateway/internal/models"
)

func TestPolicyEngineInvariants(t *testing.T) {
	boundary := models.PolicyRule{
		PerTransactionLimit: 7000.0,
		DailySpendingLimit:  25000.0,
		TodaySpend:          2450.0,
		AskBeforePurchase:   true,
		AllowedCategories:   []string{"Fashion", "Fitness", "running shoes"},
		Currency:            "INR",
	}

	// Case 1: Within limit (₹6,499 <= ₹7,000)
	d1 := CheckPolicy(6499.0, "running shoes", boundary)
	if !d1.IsAllowed {
		t.Errorf("Expected ₹6,499 to be allowed, got blocked: %s", d1.Reason)
	}
	if !d1.RequiresUserConsent {
		t.Errorf("Expected human gatekeeper consent to be required")
	}

	// Case 2: Within limit with cross-sell (₹6,998 <= ₹7,000)
	d2 := CheckPolicy(6998.0, "running shoes", boundary)
	if !d2.IsAllowed {
		t.Errorf("Expected ₹6,998 to be allowed, got blocked: %s", d2.Reason)
	}

	// Case 3: Exceeds per-transaction limit (₹7,499 > ₹7,000 -> Blocked by ₹499)
	d3 := CheckPolicy(7499.0, "running shoes", boundary)
	if d3.IsAllowed {
		t.Errorf("Expected ₹7,499 to be BLOCKED")
	}
	if d3.Difference != 499.0 {
		t.Errorf("Expected difference of ₹499.00, got ₹%.2f", d3.Difference)
	}
	if d3.PaymentAttempted || d3.MoneyMoved != 0 {
		t.Errorf("Safety violation: Payment attempted or money moved during blocked transaction")
	}

	// Case 4: Disallowed category
	d4 := CheckPolicy(1500.0, "Crypto Mining", boundary)
	if d4.IsAllowed {
		t.Errorf("Expected disallowed category to be blocked")
	}
}
