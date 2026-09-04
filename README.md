# 🫐 BERRY AI — Enterprise Autonomous Commerce & Financial Agent

### **Your AI. Your money. Your decision.**

> **"The user doesn't operate checkout. They operate intent."**

Berry is an AI-native purchasing agent and commerce platform. Users express intent in natural language; Berry's autonomous agents discover products across verified merchants, optimize carts within strict spending boundaries, request human authorization gates, and execute real **Razorpay Standard Web Checkout** payments backed by a cryptographic **Rust Ledger**.

---

## 🌐 Quick Links & Live Portals

| Portal | URL Route | Description |
| :--- | :--- | :--- |
| **All-in-One Dashboard** | [http://localhost:3000/](http://localhost:3000/) | Live 3-in-1 perspective switcher with instant interactive demos & voice synthesis |
| **👤 Customer Experience** | [http://localhost:3000/customers](http://localhost:3000/customers) | White-first consumer-grade shopping UI with chat, wallet, spending limits, orders & profile |
| **🏪 Merchant Portal** | [http://localhost:3000/merchant](http://localhost:3000/merchant) | Store management, AI natural-language product upload, live stock, orders & growth agent |
| **🧠 Admin Console** | [http://localhost:3000/admin](http://localhost:3000/admin) | Platform oversight, live network telemetry, policy guardrails, ledger audit & infrastructure |

---

## 🏛️ System Architecture

```text
                                  🫐 BERRY AI
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
  CUSTOMER PORTAL               MERCHANT PORTAL                ADMIN CONSOLE
(/customers, /chat)           (/merchant, /products)         (/admin, /telemetry)
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                              Next.js 14 Web App
                                 (Port 3000)
                                       │
                                REST API / JSON
                                       │
                              ┌────────▼────────┐
                              │   GO GATEWAY    │
                              │   (Port 8080)   │
                              │                 │
                              │ • Policy Engine │
                              │ • Razorpay Live │
                              │ • State Machine │
                              └────────┬────────┘
                                       │
                  ┌────────────────────┼────────────────────┐
                  ▼                    ▼                    ▼
           PYTHON AGENT           RUST LEDGER            RAZORPAY
          (FastAPI :8000)       (Actix/Axum :8081)      (Test Mode)
         • OpenAI GPT-4o-mini   • Merkle Hash Tree    • Order Creation
         • Growth Intelligence  • Passport Signatures • Signature Verification
```

## 🚀 Unified One-Click Runner (`./berry.sh`)

Manage all 4 microservices and test suites with a single script:

```bash
chmod +x ./berry.sh

# 1. Check health across Next.js, Go Gateway, Python Vision & Rust Ledger
./berry.sh status

# 2. Run automated multi-portal DB & API test suite
./berry.sh test

# 3. Start or Stop all microservices
./berry.sh start
./berry.sh stop
./berry.sh restart
```

---

## 📷 Multimodal Vision & Shopping Brain

Customers can type in natural language or upload photos (`+ 📷 Upload an image`):
1. **Visual Intent Extraction (`POST /agent/vision-intent`):**
   - OpenAI GPT-4o-mini Vision decomposes the image into structured visual attributes (`category`, `visual_attributes`, `silhouette`, `colorway`, `upper`, `midsole`, `use_case`, `budget`).
   - Pure intent extraction — the LLM does not hallucinate fictional products.
2. **Deterministic Merchant Catalog Search (`POST /api/v1/agent/vision-search`):**
   - Go Gateway searches the **real** merchant database / store.
   - Ranks closest matches (e.g. `Nimbus Runner ₹4,799 (96% match)`, `AeroFlex Daily ₹4,499 (91% match)`, `Velocity Lite ₹5,299 (87% match)`).
   - Generates transparent **"Why Berry likes it"** explanations (`✓ Visual match ✓ Under budget ✓ In stock ✓ Daily-running suitable`).
3. **Conversational Refinement:**
   - Follow-up prompts (`"I like the first one but want more cushioning"`, `"Show me in black"`, `"Find under ₹4,000"`) preserve state and re-rank real products.
4. **Autonomous Purchase Gate:**
   - Clicking *"Select & Buy This"* evaluates spending policies, verifies merchant inventory, launches **Razorpay Standard Web Checkout**, verifies HMAC-SHA256 signature, and seals an immutable **Transaction Passport** on the **Rust Ledger**.

---

## ⚡ Live Nervous System & Kafka Event Backbone

Berry uses a unified event propagation pipeline:
```text
Merchant Publish / Price / Stock
              │
              ▼
        Go API Gateway
              │
      ┌───────┴────────┐
      ▼                ▼
PostgreSQL Store   Kafka Outbox
(Canonical Truth)  (`berry.catalog`, `berry.transactions`, `berry.payments`)
      │                │
      └───────┬────────┘
              ▼
   Server-Sent Events (SSE)
              │
  ┌───────────┼───────────┐
  ▼           ▼           ▼
Customer   Merchant     Admin
Catalog    Dashboard   Telemetry
```

- **Razorpay Key ID**: Configured via `.env` / environment variable (`RAZORPAY_KEY_ID`)
- **Razorpay Key Secret**: Configured securely via `.env` (`RAZORPAY_KEY_SECRET`)
- **OpenAI API**: Connected for live autonomous intent reasoning & natural language catalog ingestion.

---

## 🚀 Running the Platform

### Prerequisites
- Node.js 20+
- Go 1.23+
- Python 3.11+
- Rust / Cargo

### Running All 4 Microservices

1. **Rust Settlement Ledger (Port 8081):**
   ```bash
   cd services/rust-ledger
   cargo run --release
   ```

2. **Python AI Agent (Port 8000):**
   ```bash
   cd services/py-agent
   python3 main.py
   ```

3. **Go API Gateway (Port 8080):**
   ```bash
   cd services/go-gateway
   go run ./cmd/server
   ```

4. **Next.js 14 Frontend (Port 3000):**
   ```bash
   cd apps/web
   npm run dev
   ```

---

## 💳 Razorpay Standard Web Checkout Flow

1. **Order Creation (`POST /api/create-order`):**
   - Calls Razorpay Orders API: `POST https://api.razorpay.com/v1/orders`
   - Payload: `{ amount (paise), currency: "INR", receipt }`
   - Returns: `{ order_id, amount, currency }`

2. **Client-Side Modal Ingestion (`checkout.js`):**
   - Launches native Razorpay checkout overlay with prefilled customer details
   - Dispatches payment handler callback on success

3. **HMAC-SHA256 Signature Verification (`POST /api/verify-payment`):**
   - Verifies `HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)` matches `razorpay_signature`
   - Triggers Rust Settlement Engine to seal an immutable **Transaction Passport**

---

## 📦 Key Sub-Routes Reference

### 👤 Customer Experience (`/customers`)
- `/customers/home` — Personalized shopping feed & active AI agents
- `/customers/chat` — Live conversational agent with progressive narrowing & intent discovery
- `/customers/discover` — Multi-merchant product exploration
- `/customers/orders` — Order history and cryptographically signed Transaction Passports
- `/customers/wallet` — Spending limits, financial boundaries, and card simulation
- `/customers/saved` — Wishlist items and agent price-drop alerts
- `/customers/profile` — Buyer persona and address management
- `/customers/settings` — Agent autonomy rules and security permissions

### 🏪 Merchant Portal (`/merchant`)
- `/merchant` — Overview metrics (GMV, AI conversions, order volume, live chart)
- `/merchant/products` — Catalog management with AI affinity scores
- `/merchant/add-product` — Dual-mode SKU creation (AI single-prompt parser + manual form)
- `/merchant/inventory` — Stock levels and auto-replenishment warnings
- `/merchant/orders` — Order fulfillment tracking
- `/merchant/customers` — Privacy-preserving buyer analytics
- `/merchant/analytics` — Revenue funnels and upsell conversion tracking
- `/merchant/growth` — AI growth engine with live Python suggestions
- `/merchant/integrations` — Webhook health, Razorpay sync, and catalog indexing
- `/merchant/payouts` — Settlement accounts and payout timeline
- `/merchant/settings` — Store configurations and agent selling permissions

### 🧠 Admin Console (`/admin`)
- `/admin` — System overview, platform GMV, transactions, and live agent telemetry
- `/admin/live-network` — Microservice cluster health, latency graphs, and real-time event bus
- `/admin/customers` — Buyer registry and spending pool analytics
- `/admin/merchants` — Connected store partners and webhook monitor
- `/admin/products` — Cross-store universal SKU directory
- `/admin/transactions` — Full transaction ledger with SHA-256 block proofs
- `/admin/agents` — Fleet management, token usage, and inference latencies
- `/admin/policies` — Deterministic spending guardrails and 2FA trigger rules
- `/admin/events` — System audit logs and event streams
- `/admin/infrastructure` — CPU/Memory/Goroutine telemetry across all runtimes
- `/admin/analytics` — Macro commerce growth and funnel velocity
- `/admin/settings` — Gateway keys and global environment controls
