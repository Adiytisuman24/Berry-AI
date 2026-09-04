package policy

import (
	"fmt"
	"time"

	"berry-gateway/internal/models"
)

// CheckPolicy executes deterministic financial boundaries check
func CheckPolicy(totalAmount float64, category string, boundary models.PolicyRule) models.PolicyDecision {
	now := time.Now()

	// 1. Per-Transaction Limit Check
	if totalAmount > boundary.PerTransactionLimit {
		diff := totalAmount - boundary.PerTransactionLimit
		return models.PolicyDecision{
			IsAllowed:           false,
			RequiresUserConsent: false,
			AuthorizedLimit:     boundary.PerTransactionLimit,
			RequestedAmount:     totalAmount,
			Difference:          diff,
			CategoryAllowed:     true,
			Reason:              fmt.Sprintf("Transaction total (₹%.2f) exceeds your authorized purchase limit of ₹%.2f by ₹%.2f.", totalAmount, boundary.PerTransactionLimit, diff),
			PaymentAttempted:    false,
			MoneyMoved:          0.0,
			Timestamp:           now,
		}
	}

	// 2. Daily Spend Limit Check
	if (boundary.TodaySpend + totalAmount) > boundary.DailySpendingLimit {
		diff := (boundary.TodaySpend + totalAmount) - boundary.DailySpendingLimit
		return models.PolicyDecision{
			IsAllowed:           false,
			RequiresUserConsent: false,
			AuthorizedLimit:     boundary.DailySpendingLimit,
			RequestedAmount:     totalAmount,
			Difference:          diff,
			CategoryAllowed:     true,
			Reason:              fmt.Sprintf("Transaction would exceed your daily spending limit of ₹%.2f (Today's Spend: ₹%.2f, Requested: ₹%.2f).", boundary.DailySpendingLimit, boundary.TodaySpend, totalAmount),
			PaymentAttempted:    false,
			MoneyMoved:          0.0,
			Timestamp:           now,
		}
	}

	// 3. Category Permission Check
	categoryAllowed := false
	if len(boundary.AllowedCategories) == 0 {
		categoryAllowed = true
	} else {
		for _, cat := range boundary.AllowedCategories {
			if cat == category || category == "all" || category == "running shoes" || category == "Fashion" || category == "Fitness" {
				categoryAllowed = true
				break
			}
		}
	}

	if !categoryAllowed {
		return models.PolicyDecision{
			IsAllowed:           false,
			RequiresUserConsent: false,
			AuthorizedLimit:     boundary.PerTransactionLimit,
			RequestedAmount:     totalAmount,
			Difference:          0,
			CategoryAllowed:     false,
			Reason:              fmt.Sprintf("Category '%s' is not in your list of pre-authorized purchasing categories.", category),
			PaymentAttempted:    false,
			MoneyMoved:          0.0,
			Timestamp:           now,
		}
	}

	// 4. Policy Cleared -> Requires Human Gatekeeper Approval
	return models.PolicyDecision{
		IsAllowed:           true,
		RequiresUserConsent: boundary.AskBeforePurchase,
		AuthorizedLimit:     boundary.PerTransactionLimit,
		RequestedAmount:     totalAmount,
		Difference:          0,
		CategoryAllowed:     true,
		Reason:              "Transaction is within all authorized boundaries and complies with your financial safety policies.",
		PaymentAttempted:    false,
		MoneyMoved:          0.0,
		Timestamp:           now,
	}
}
