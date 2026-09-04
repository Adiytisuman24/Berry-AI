package models

import (
	"fmt"
)

type TransactionState string

const (
	StateCreated               TransactionState = "CREATED"
	StatePolicyCheck           TransactionState = "POLICY_CHECK"
	StatePassed                TransactionState = "PASSED"
	StateBlocked               TransactionState = "BLOCKED"
	StateAwaitingAuthorization TransactionState = "AWAITING_AUTHORIZATION"
	StateApproved              TransactionState = "APPROVED"
	StatePaymentPending        TransactionState = "PAYMENT_PENDING"
	StateSuccess               TransactionState = "SUCCESS"
	StateFailed                TransactionState = "FAILED"
)

var validTransitions = map[TransactionState][]TransactionState{
	StateCreated:               {StatePolicyCheck, StateFailed},
	StatePolicyCheck:           {StatePassed, StateBlocked, StateFailed},
	StateBlocked:               {StateCreated, StateFailed},
	StatePassed:                {StateAwaitingAuthorization, StateApproved, StateFailed},
	StateAwaitingAuthorization: {StateApproved, StateBlocked, StateFailed},
	StateApproved:              {StatePaymentPending, StateSuccess, StateFailed},
	StatePaymentPending:        {StateSuccess, StateFailed},
	StateSuccess:               {}, // Terminal
	StateFailed:                {}, // Terminal
}

func ValidateTransition(current, target TransactionState) error {
	allowed, exists := validTransitions[current]
	if !exists {
		return fmt.Errorf("unknown transaction state: %s", current)
	}

	for _, next := range allowed {
		if next == target {
			return nil
		}
	}

	return fmt.Errorf("illegal state transition from %s to %s", current, target)
}
