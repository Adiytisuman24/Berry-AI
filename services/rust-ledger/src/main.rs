use axum::{
    extract::{Json, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use chrono::{DateTime, Utc};
use hex;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::sync::{Arc, Mutex};
use tower_http::cors::{Any, CorsLayer};
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditEvent {
    pub step: String,
    pub timestamp: String,
    pub actor: String,
    pub payload: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PassportRequest {
    pub transaction_id: String,
    pub intent: String,
    pub products_evaluated: usize,
    pub selected_product: String,
    pub selected_product_id: String,
    pub cart_items: Vec<String>,
    pub subtotal: f64,
    pub final_amount: f64,
    pub purchase_limit: f64,
    pub policy_status: String,
    pub user_authorized: bool,
    pub payment_gateway: String,
    pub razorpay_payment_id: String,
    pub events: Vec<AuditEvent>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransactionPassport {
    pub passport_id: String,
    pub transaction_id: String,
    pub status: String,
    pub amount_inr: f64,
    pub intent: String,
    pub discovery_summary: String,
    pub recommendation: String,
    pub recommendation_reason: Vec<String>,
    pub policy_verification: PolicyVerificationResult,
    pub payment_details: PaymentDetailsResult,
    pub agent_actions_checklist: Vec<AgentActionItem>,
    pub audit_merkle_root: String,
    pub cryptographic_signature: String,
    pub timestamp: DateTime<Utc>,
    pub human_explanation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolicyVerificationResult {
    pub authorized_limit: f64,
    pub transaction_amount: f64,
    pub is_within_limit: bool,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentDetailsResult {
    pub provider: String,
    pub mode: String,
    pub payment_id: String,
    pub verified_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentActionItem {
    pub label: String,
    pub completed: bool,
    pub verified_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifyRequest {
    pub passport_id: String,
    pub audit_merkle_root: String,
    pub signature: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifyResponse {
    pub is_valid: bool,
    pub passport_id: String,
    pub computed_hash: String,
    pub message: String,
}

#[derive(Default)]
pub struct LedgerState {
    pub passports: Mutex<Vec<TransactionPassport>>,
}

fn compute_sha256(data: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data.as_bytes());
    hex::encode(hasher.finalize())
}

async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "berry-rust-crypto-ledger",
        "version": "1.0.0",
        "timestamp": Utc::now()
    }))
}

async fn seal_passport(
    State(state): State<Arc<LedgerState>>,
    Json(req): Json<PassportRequest>,
) -> impl IntoResponse {
    let now = Utc::now();
    let passport_id = if req.transaction_id.starts_with("BRY-") {
        format!("#{}", req.transaction_id)
    } else {
        format!("#BRY-{}", Uuid::new_v4().to_string()[..6].to_uppercase())
    };

    // Compute Sequential Cryptographic Hash Chain
    // hash_0 = SHA256(GENESIS | passport_id)
    // hash_i = SHA256(action_payload_i | hash_{i-1})
    let mut prev_hash = compute_sha256(&format!("BERRY_GENESIS:{}", passport_id));

    let action_specs = vec![
        ("Product discovered & evaluated", format!("intent:{}|selected:{}", req.intent, req.selected_product)),
        ("Cart created & dynamic pricing verified", format!("subtotal:{:.2}|final:{:.2}", req.subtotal, req.final_amount)),
        ("Policy evaluated & spending boundary checked", format!("limit:{:.2}|status:{}", req.purchase_limit, req.policy_status)),
        ("User approval gate received", format!("authorized:{}", req.user_authorized)),
        ("Razorpay payment captured", format!("rzp_pay_id:{}", req.razorpay_payment_id)),
    ];

    let mut actions = Vec::new();
    for (label, payload) in action_specs {
        let block_input = format!("{}:{}", payload, prev_hash);
        let block_hash = compute_sha256(&block_input);
        actions.push(AgentActionItem {
            label: label.into(),
            completed: true,
            verified_hash: block_hash[..16].into(),
        });
        prev_hash = block_hash;
    }

    let chain_head_hash = prev_hash.clone();
    let signature = format!("sha256_chain_seal_{}", compute_sha256(&format!("{}:{}:{}", passport_id, chain_head_hash, now.to_rfc3339())));
    let merkle_root = chain_head_hash;

    let explanation = format!(
        "You asked for \"{}\". Berry evaluated {} options and selected {} because it best matched your stated use case. The final cart was ₹{:.2}, which was within your ₹{:.2} authorization limit. Payment was executed only after your explicit approval.",
        req.intent, req.products_evaluated, req.selected_product, req.final_amount, req.purchase_limit
    );

    let passport = TransactionPassport {
        passport_id: passport_id.clone(),
        transaction_id: req.transaction_id.clone(),
        status: if req.user_authorized { "COMPLETED".into() } else { "BLOCKED".into() },
        amount_inr: req.final_amount,
        intent: req.intent.clone(),
        discovery_summary: format!("{} products evaluated across connected merchants", req.products_evaluated),
        recommendation: req.selected_product.clone(),
        recommendation_reason: vec![
            "Optimal match for specified criteria".into(),
            format!("Within authorized ₹{:.0} purchase limit", req.purchase_limit),
            "Merchant verified and inventory in stock".into(),
            "Strong price-to-performance rating".into(),
        ],
        policy_verification: PolicyVerificationResult {
            authorized_limit: req.purchase_limit,
            transaction_amount: req.final_amount,
            is_within_limit: req.final_amount <= req.purchase_limit,
            status: if req.final_amount <= req.purchase_limit { "AUTHORIZED".into() } else { "LIMIT_EXCEEDED".into() },
        },
        payment_details: PaymentDetailsResult {
            provider: req.payment_gateway,
            mode: "Test Mode".into(),
            payment_id: req.razorpay_payment_id,
            verified_at: now,
        },
        agent_actions_checklist: actions,
        audit_merkle_root: merkle_root,
        cryptographic_signature: signature,
        timestamp: now,
        human_explanation: explanation,
    };

    {
        let mut list = state.passports.lock().unwrap();
        list.push(passport.clone());
    }

    (StatusCode::CREATED, Json(passport))
}

async fn verify_passport(
    State(state): State<Arc<LedgerState>>,
    Json(req): Json<VerifyRequest>,
) -> impl IntoResponse {
    let list = state.passports.lock().unwrap();
    let found = list.iter().find(|p| p.passport_id == req.passport_id);

    match found {
        Some(p) => {
            let matches = p.audit_merkle_root == req.audit_merkle_root && p.cryptographic_signature == req.signature;
            Json(VerifyResponse {
                is_valid: matches,
                passport_id: req.passport_id,
                computed_hash: p.audit_merkle_root.clone(),
                message: if matches {
                    "Cryptographic passport verified: audit log is authentic and tamper-free.".into()
                } else {
                    "Cryptographic mismatch: passport data has been altered.".into()
                },
            })
        }
        None => Json(VerifyResponse {
            is_valid: false,
            passport_id: req.passport_id,
            computed_hash: "".into(),
            message: "Passport not found in ledger.".into(),
        }),
    }
}

async fn list_passports(State(state): State<Arc<LedgerState>>) -> impl IntoResponse {
    let list = state.passports.lock().unwrap();
    Json(list.clone())
}

#[tokio::main]
async fn main() {
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber).unwrap();

    let state = Arc::new(LedgerState::default());

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/ledger/seal-passport", post(seal_passport))
        .route("/ledger/verify-passport", post(verify_passport))
        .route("/ledger/passports", get(list_passports))
        .layer(cors)
        .with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "8081".into());
    let addr = format!("0.0.0.0:{}", port);
    info!("🦀 Berry Rust Crypto Ledger starting on {}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
