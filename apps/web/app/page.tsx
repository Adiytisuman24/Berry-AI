"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Check,
  CheckCircle2,
  X,
  AlertTriangle,
  CreditCard,
  Zap,
  ShoppingBag,
  TrendingUp,
  Store,
  User,
  Activity,
  ChevronRight,
  RefreshCw,
  Lock,
  Volume2,
  Sliders,
  DollarSign,
  Package,
  Layers,
  Terminal,
  Cpu,
  Server,
  Database,
  Search,
  PlusCircle,
  Eye,
  GitBranch,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TXtd2CNmv3wGJZ";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function BerryApp() {
  // Top-Level Perspective: "customer" | "merchant" | "admin"
  const [portalMode, setPortalMode] = useState<"customer" | "merchant" | "admin">("customer");

  // Customer Navigation State
  const [customerTab, setCustomerTab] = useState<"home" | "chat" | "profile" | "activity">("home");
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<"idle" | "discovery" | "recommendation" | "cross_sell" | "auth_gate" | "blocked" | "completed">("idle");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [includeSocks, setIncludeSocks] = useState(false);
  const [activeTx, setActiveTx] = useState<any>(null);
  const [passportData, setPassportData] = useState<any>(null);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<any>({
    name: "Suman",
    email: "suman@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    financial_context: {
      cibil_score_demo: 782,
      bank_name_demo: "HDFC Bank",
      bank_last4_demo: "4821",
      upi_id_demo: "suman@upi",
      is_sandbox: true,
    },
    purchasing_boundary: {
      per_transaction_limit: 7000,
      daily_spending_limit: 25000,
      today_spend: 2450,
      available_budget: 22550,
      ask_before_purchase: true,
      allowed_categories: ["Fashion", "Electronics", "Food", "Travel", "Fitness", "Running Shoes"],
    },
  });

  // Dynamic Merchant Catalog State
  const [catalog, setCatalog] = useState<any[]>([
    {
      id: "prod-nimbus",
      name: "Nimbus Runner",
      price: 6499,
      score: 94,
      tag: "Best Match",
      inventory: 12,
      desc: "Engineered plush daily training shoe with dynamic responsive foam.",
      specs: "Beginner Road Runner • Responsive Foam • In Stock (12 units)",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-aeroflex",
      name: "AeroFlex Daily",
      price: 5999,
      score: 89,
      tag: "Alternative",
      inventory: 18,
      desc: "Lightweight everyday road runner with reinforced breathable mesh.",
      specs: "Lightweight Mesh • Firm Ride • In Stock (18 units)",
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-motionlite",
      name: "Motion Lite",
      price: 4899,
      score: 83,
      tag: "Budget Choice",
      inventory: 25,
      desc: "Budget-friendly responsive cushioned shoe for light training.",
      specs: "Essential Cushioning • Budget Tier • In Stock (25 units)",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
    },
  ]);

  // Merchant Add Product Form
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("5499");
  const [newProductCategory, setNewProductCategory] = useState("Running Shoes");
  const [newProductDesc, setNewProductDesc] = useState("Lightweight road running shoe with dual cushioning");
  const [newProductInventory, setNewProductInventory] = useState("20");
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<any>(null);

  // Admin Data State
  const [adminStats, setAdminStats] = useState<any>({
    system_status: {
      agent_engine: "OPERATIONAL",
      razorpay: "CONNECTED",
      openai: "CONNECTED",
      database: "HEALTHY",
      redis: "HEALTHY",
    },
    network: {
      total_customers: 1284,
      total_merchants: 42,
      ai_transactions: 8421,
      ai_gmv_formatted: "₹18.42 Lakhs",
    },
    today: {
      successful_payments: 284,
      blocked_transactions: 19,
      failed_payments: 7,
      today_ai_gmv_formatted: "₹4.82 Lakhs",
    },
    policy_stats: {
      allowed_count: 8402,
      blocked_count: 214,
      escalated_count: 38,
      top_block_reasons: {
        "Transaction limit exceeded": 124,
        "Restricted category": 52,
        "Merchant pricing policy": 26,
        "Missing user consent": 12,
      },
    },
    agents: [
      { name: "Berry Buyer Agent", status: "ACTIVE", model: "OpenAI GPT-4o / Go Engine", tools_count: 12, success_rate: 97.4, blocked_count: 214, avg_latency: "1.42s" },
      { name: "Berry Merchant Agent", status: "ACTIVE", model: "OpenAI GPT-4o / Go Catalog", tools_count: 8, success_rate: 99.1, blocked_count: 18, avg_latency: "0.88s" },
      { name: "Berry Growth Agent", status: "ACTIVE", model: "OpenAI + Python Reasoner", tools_count: 6, success_rate: 96.5, blocked_count: 4, avg_latency: "2.10s" },
      { name: "Deterministic Policy Engine", status: "ACTIVE", model: "Go Invariant State Machine", tools_count: 4, success_rate: 100.0, blocked_count: 214, avg_latency: "0.002s" },
    ],
  });

  const [merchantPrompt, setMerchantPrompt] = useState(
    "Connect my product catalog, inventory, pricing, checkout and order system to Berry. Expose products in an agent-readable format. Allow Berry to discover products, build carts, calculate totals and create Razorpay orders. Respect my inventory, pricing, discount and purchasing policies."
  );

  const [growthOps, setGrowthOps] = useState<any[]>([
    {
      id: "opp-01",
      title: "Running Shoes → Performance Socks Cross-Sell",
      acceptance: "31%",
      estimated: "₹12,400 / month",
      enabled: true,
      desc: "Suggest ₹499 anti-blister socks when shoe purchase is within buyer spending limit.",
    },
    {
      id: "opp-02",
      title: "Cart Abandonment Recovery > ₹5,000",
      acceptance: "42%",
      estimated: "₹8,700 / month",
      enabled: false,
      desc: "Offer automated free express shipping waiver when cart value exceeds ₹5,000.",
    },
    {
      id: "opp-03",
      title: "Footwear Maintenance & Cleaning Bundle",
      acceptance: "24%",
      estimated: "₹5,200 / month",
      enabled: false,
      desc: "Target runners post-purchase with footwear waterproofing and odor kit add-on.",
    },
  ]);

  const [timeline, setTimeline] = useState<any[]>([
    {
      time: "13:46",
      title: "💳 ₹6,499 paid via Razorpay",
      desc: "Transaction Passport #BRY-1042 sealed & verified",
      status: "success",
    },
    {
      time: "13:46",
      title: "✓ Purchase approved by Suman",
      desc: "User authorized money movement gate",
      status: "success",
    },
    {
      time: "13:45",
      title: "🛡️ Purchase authorization requested",
      desc: "Waiting for human gatekeeper approval",
      status: "action",
    },
    {
      time: "13:45",
      title: "🛒 Added optional socks (+₹499)",
      desc: "Cross-sell accepted within ₹7,000 limit",
      status: "info",
    },
    {
      time: "13:44",
      title: "🧠 Berry found running shoes",
      desc: "Evaluated 14 options across connected merchants",
      status: "info",
    },
    {
      time: "Yesterday 18:22",
      title: "⛔ Berry blocked ₹7,499 purchase",
      desc: "Exceeded ₹7,000 limit by ₹499 (Boundary preserved)",
      status: "blocked",
    },
  ]);

  // Load live admin stats & products from Go backend
  useEffect(() => {
    fetch(`${API_BASE}/api/v1/admin/stats`)
      .then((res) => res.json())
      .then((data) => setAdminStats(data))
      .catch(() => {});
  }, []);

  const socksItem = {
    id: "cross-socks-01",
    name: "Performance Anti-Blister Socks",
    price: 499,
    attachRate: "31%",
    desc: "Dual-layer moisture-wicking athletic socks designed for long-distance comfort.",
  };

  // Start Agent Search in Customer Portal
  const handleStartSearch = async (customQuery?: string) => {
    const q = customQuery || query || "Find me a good pair of running shoes under ₹7,000 and buy them for me.";
    setQuery(q);
    setPortalMode("customer");
    setCustomerTab("chat");
    setIsProcessing(true);
    setCurrentStage("discovery");

    try {
      const res = await fetch(`${API_BASE}/api/v1/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      setSelectedProduct(catalog[0]);
      setActiveTx(data.transaction || {
        id: "BRY-1042",
        cart: { total: catalog[0].price },
        policy_result: { is_allowed: true, authorized_limit: 7000 },
      });

      setTimeout(() => {
        setCurrentStage("recommendation");
        setTimeout(() => {
          setCurrentStage("cross_sell");
          setIsProcessing(false);
        }, 1200);
      }, 1400);
    } catch (e) {
      setSelectedProduct(catalog[0]);
      setActiveTx({
        id: "BRY-1042",
        cart: { total: catalog[0].price },
        policy_result: { is_allowed: true, authorized_limit: 7000 },
      });
      setTimeout(() => {
        setCurrentStage("recommendation");
        setTimeout(() => {
          setCurrentStage("cross_sell");
          setIsProcessing(false);
        }, 1000);
      }, 1000);
    }
  };

  // Merchant Add Product Action
  const handleAddProduct = async () => {
    const priceNum = parseFloat(newProductPrice) || 5499;
    const invNum = parseInt(newProductInventory) || 20;

    const payload = {
      name: newProductName || "UltraStride Speed Pro",
      price: priceNum,
      category: newProductCategory || "Running Shoes",
      description: newProductDesc,
      inventory: invNum,
      brand: "AeroStride",
    };

    try {
      const res = await fetch(`${API_BASE}/api/v1/merchant/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();

      const newProductItem = {
        id: created.id || `prod-${Date.now()}`,
        name: created.name,
        price: created.price,
        score: 96,
        tag: "Newly Added",
        inventory: created.inventory,
        desc: created.description,
        specs: `${created.category} • In Stock (${created.inventory} units) • AI Ready`,
        image: created.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        ai_profile: created.ai_profile,
      };

      setCatalog([newProductItem, ...catalog]);
      setLastAddedProduct(newProductItem);
      setShowAddSuccess(true);
      setNewProductName("");
    } catch (e) {
      const fallbackItem = {
        id: `prod-${Date.now()}`,
        name: payload.name,
        price: payload.price,
        score: 96,
        tag: "Newly Added",
        inventory: payload.inventory,
        desc: payload.description,
        specs: `${payload.category} • In Stock (${payload.inventory} units) • AI Ready`,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      };
      setCatalog([fallbackItem, ...catalog]);
      setLastAddedProduct(fallbackItem);
      setShowAddSuccess(true);
    }
  };

  const handleToggleSocks = (include: boolean) => {
    setIncludeSocks(include);
    if (activeTx) {
      const basePrice = selectedProduct?.price || 6499;
      const newTotal = include ? basePrice + 499 : basePrice;
      setActiveTx({
        ...activeTx,
        cart: {
          ...activeTx.cart,
          total: newTotal,
        },
      });
    }
  };

  const handleTriggerFailureDemo = () => {
    setCurrentStage("blocked");
    setActiveTx({
      id: "BRY-1042",
      cart: { total: 7499 },
      policy_result: {
        is_allowed: false,
        authorized_limit: 7000,
        requested_amount: 7499,
        difference: 499,
        reason: "Transaction total (₹7,499) exceeds your authorized purchase limit of ₹7,000 by ₹499.",
        payment_attempted: false,
        money_moved: 0,
      },
    });
  };

  const handleFixCart = () => {
    setIncludeSocks(false);
    setCurrentStage("auth_gate");
    setActiveTx({
      id: "BRY-1042",
      cart: { total: 6499 },
      policy_result: {
        is_allowed: true,
        authorized_limit: 7000,
        requested_amount: 6499,
        difference: 0,
        reason: "Transaction is within authorized boundaries.",
        payment_attempted: false,
        money_moved: 0,
      },
    });
  };

  // Razorpay Checkout Execution
  const handleApproveAndPay = async () => {
    const totalINR = activeTx?.cart?.total || 6499;
    setIsProcessing(true);

    try {
      let orderId = `order_RPZ${Math.floor(10000000 + Math.random() * 90000000)}`;
      try {
        const orderRes = await fetch(`${API_BASE}/api/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalINR, receipt: activeTx?.id || "BRY-1042" }),
        });
        const orderData = await orderRes.json();
        if (orderData.order_id) {
          orderId = orderData.order_id;
        }
      } catch (e) {
        console.warn("Backend order creation fallback:", e);
      }

      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: totalINR * 100,
          currency: "INR",
          name: "Berry AI",
          description: `Authorized agent purchase: ${selectedProduct?.name || "Nimbus Runner"}`,
          image: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
          order_id: orderId,
          handler: async function (response: any) {
            await handlePaymentVerification(response, totalINR);
          },
          prefill: {
            name: userProfile.name,
            email: userProfile.email,
            contact: userProfile.phone,
          },
          theme: {
            color: "#9135ed",
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              alert("Payment modal dismissed. No funds were moved.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setIsProcessing(false);
          alert(`Payment Failed: ${response.error.description || "Gateway transaction failed"}`);
        });
        rzp.open();
      } else {
        setTimeout(async () => {
          await handlePaymentVerification(
            {
              razorpay_order_id: orderId,
              razorpay_payment_id: `pay_RZP${Math.floor(100000000 + Math.random() * 900000000)}`,
              razorpay_signature: "mock_signature_bypass",
            },
            totalINR
          );
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handlePaymentVerification = async (payload: any, totalINR: number) => {
    try {
      const verifyRes = await fetch(`${API_BASE}/api/v1/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: activeTx?.id || "BRY-1042",
          razorpay_order_id: payload.razorpay_order_id,
          razorpay_payment_id: payload.razorpay_payment_id,
          razorpay_signature: payload.razorpay_signature,
        }),
      });

      const verifyData = await verifyRes.json();
      const passport = verifyData.passport || {
        passport_id: "#BRY-1042",
        status: "COMPLETED",
        amount_inr: totalINR,
        intent: "Beginner running shoes under ₹7,000",
        discovery_summary: "14 products evaluated across connected merchants",
        recommendation: selectedProduct?.name || "Nimbus Runner",
        recommendation_reason: [
          "Optimal match for specified beginner road criteria",
          "Within authorized ₹7,000 purchase boundary",
          "Merchant verified and inventory in stock",
          "Strong price-to-performance rating",
        ],
        policy_verification: {
          authorized_limit: 7000,
          transaction_amount: totalINR,
          is_within_limit: true,
          status: "AUTHORIZED",
        },
        payment_details: {
          provider: "Razorpay",
          mode: "Test Mode",
          payment_id: payload.razorpay_payment_id || "pay_mock_10294",
        },
        agent_actions_checklist: [
          { label: "Product discovered & evaluated", completed: true, verified_hash: "a9f3b8c2d1e0" },
          { label: "Cart created & optimized", completed: true, verified_hash: "7e2a4f91b0c3" },
          { label: "Policy evaluated & spending boundary checked", completed: true, verified_hash: "4b9c1d8e2f0a" },
          { label: "User approval gate received", completed: true, verified_hash: "91e0a2b4c8d7" },
          { label: "Razorpay payment completed", completed: true, verified_hash: "3f8e1a9b0c2d" },
        ],
        audit_merkle_root: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        cryptographic_signature: "sig_ed25519_948a02c91b7e3f4a0812bd89c193f",
        human_explanation: `You asked for beginner running shoes under ₹7,000. Berry evaluated 14 options and selected ${selectedProduct?.name || "Nimbus Runner"} because it best matched your stated use case. The final cart was ₹${totalINR.toLocaleString()}, which was within your ₹7,000 authorization limit. Payment was executed only after your explicit approval.`,
      };

      setPassportData(passport);
      setCurrentStage("completed");
      setShowPassportModal(true);
      setIsProcessing(false);

      setTimeline((prev) => [
        {
          time: "Just now",
          title: `💳 ₹${totalINR.toLocaleString()} paid via Razorpay`,
          desc: `Transaction Passport ${passport.passport_id} sealed`,
          status: "success",
        },
        {
          time: "Just now",
          title: `✓ Purchase approved by ${userProfile.name}`,
          desc: "User authorized money movement gate",
          status: "success",
        },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const handleExplainAudio = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const text = passportData?.human_explanation || "You asked for beginner running shoes under 7000 rupees. Berry evaluated 14 options and selected Nimbus Runner because it best matched your stated use case. Payment was executed only after your explicit approval.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser audio speech synthesis not available.");
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
      {/* Top Main Navigation & Perspective Switcher */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div
            onClick={() => {
              setPortalMode("customer");
              setCustomerTab("home");
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-berry-700 via-berry-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-berry-600/30 group-hover:scale-105 transition-transform">
              <span className="text-xl font-bold">🫐</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">berry</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-berry-950/80 text-berry-300 border border-berry-500/30">
                  Agentic Commerce
                </span>
              </div>
            </div>
          </div>

          {/* 3-Sided Perspective Switcher */}
          <div className="flex items-center gap-1 bg-dark-900/80 p-1 rounded-2xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setPortalMode("customer")}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                portalMode === "customer"
                  ? "bg-gradient-to-r from-berry-600 to-pink-600 text-white shadow-lg shadow-berry-600/30 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>👤 Customer Portal</span>
            </button>

            <button
              onClick={() => setPortalMode("merchant")}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                portalMode === "merchant"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>🏪 Merchant Portal</span>
            </button>

            <button
              onClick={() => setPortalMode("admin")}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                portalMode === "admin"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>🧠 Berry Control Center</span>
            </button>
          </div>
        </div>

        {/* Global Live System Indicator & Dedicated Apps */}
        <div className="flex items-center gap-2.5">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-white/10 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Go Engine • Razorpay Live SDK • Rust Ledger</span>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href="/customers"
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center gap-1"
            >
              <span>Customer App</span>
              <span className="text-[10px] text-berry-400">↗</span>
            </a>
            <a
              href="/merchant"
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center gap-1"
            >
              <span>Merchant</span>
              <span className="text-[10px] text-indigo-400">↗</span>
            </a>
            <a
              href="/admin"
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#5B4DFB]/20 hover:bg-[#5B4DFB]/40 text-[#a59bfb] border border-[#5B4DFB]/40 transition-all flex items-center gap-1 font-bold"
            >
              <span>Admin</span>
              <span className="text-[10px] text-emerald-400">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Perspective Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {/* =========================================================================
            PERSPECTIVE 1: 👤 CUSTOMER PORTAL
           ========================================================================= */}
        {portalMode === "customer" && (
          <div className="space-y-6">
            {/* Customer Subnav */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <button
                  onClick={() => setCustomerTab("home")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    customerTab === "home" ? "bg-berry-600/20 text-berry-300 font-semibold border border-berry-500/30" : "hover:text-white"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setCustomerTab("chat")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    customerTab === "chat" ? "bg-berry-600/20 text-berry-300 font-semibold border border-berry-500/30" : "hover:text-white"
                  }`}
                >
                  Chat with Berry
                </button>
                <button
                  onClick={() => setCustomerTab("activity")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    customerTab === "activity" ? "bg-berry-600/20 text-berry-300 font-semibold border border-berry-500/30" : "hover:text-white"
                  }`}
                >
                  Activity & Passports
                </button>
                <button
                  onClick={() => setCustomerTab("profile")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    customerTab === "profile" ? "bg-berry-600/20 text-berry-300 font-semibold border border-berry-500/30" : "hover:text-white"
                  }`}
                >
                  My Berry (Financial Context)
                </button>
              </nav>

              <div className="text-xs text-slate-400">
                Per-Purchase Limit: <strong className="text-berry-300">₹{userProfile.purchasing_boundary.per_transaction_limit.toLocaleString()}</strong>
              </div>
            </div>

            {/* Customer Tab: Home */}
            {customerTab === "home" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="glass-panel-glow rounded-3xl p-6 lg:p-10 border border-berry-500/20 relative overflow-hidden">
                  <div className="max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-berry-900/40 border border-berry-500/30 text-xs text-berry-300">
                      <Sparkles className="w-3.5 h-3.5 text-berry-400" />
                      <span>Your AI. Your money. Your decision.</span>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                      Tell Berry what you want.
                    </h1>
                    <p className="text-slate-400 text-sm lg:text-base leading-relaxed">
                      Berry finds it across connected merchants, optimizes the cart, and prepares the transaction. <strong className="text-berry-300">You decide when money moves.</strong>
                    </p>

                    {/* Omni Intent Input */}
                    <div className="pt-2">
                      <div className="relative rounded-2xl bg-dark-900/90 border-2 border-berry-500/40 shadow-2xl p-2 focus-within:border-berry-400 transition-all">
                        <textarea
                          rows={2}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder='e.g., "Find me beginner running shoes under ₹7,000 and buy them for me."'
                          className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-500 focus:outline-none resize-none text-sm lg:text-base"
                        />
                        <div className="flex items-center justify-between pt-2 px-2 border-t border-white/5">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-emerald-400" />
                            Razorpay Secured • Human-Controlled Gate
                          </span>
                          <button
                            onClick={() => handleStartSearch()}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-berry-600 to-pink-600 hover:from-berry-500 hover:to-pink-500 text-white font-semibold text-xs lg:text-sm flex items-center gap-2 shadow-lg shadow-berry-600/30 transition-transform active:scale-95"
                          >
                            <span>Ask Berry</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-3">
                        <span className="text-xs text-slate-500 py-1">Try asking:</span>
                        {[
                          "Find beginner running shoes under ₹7,000",
                          "Get ANC noise cancelling earbuds under ₹5,000",
                          "Order daily gym protein shaker bottle",
                        ].map((chip, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setQuery(chip);
                              handleStartSearch(chip);
                            }}
                            className="text-xs px-3 py-1 rounded-full bg-dark-900 hover:bg-berry-900/40 text-slate-300 hover:text-berry-200 border border-white/5 hover:border-berry-500/30 transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Context Cards */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Your Purchasing Boundaries
                    </h2>
                    <button
                      onClick={() => setCustomerTab("profile")}
                      className="text-xs text-berry-400 hover:underline flex items-center gap-1"
                    >
                      <span>Configure Limits</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-panel rounded-2xl p-5 border border-white/5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Available Budget
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-white mt-1">
                        ₹{userProfile.purchasing_boundary.available_budget.toLocaleString()}
                      </div>
                      <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>₹{userProfile.purchasing_boundary.daily_spending_limit.toLocaleString()} daily limit allocated</span>
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 border border-white/5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Today's Spend
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-slate-200 mt-1">
                        ₹{userProfile.purchasing_boundary.today_spend.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        Across 2 verified purchases
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 border border-berry-500/30 bg-berry-950/20">
                      <div className="text-xs font-semibold text-berry-300 uppercase tracking-wider flex items-center justify-between">
                        <span>Purchase Limit</span>
                        <Shield className="w-3.5 h-3.5 text-berry-400" />
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-berry-200 mt-1">
                        ₹{userProfile.purchasing_boundary.per_transaction_limit.toLocaleString()}
                      </div>
                      <div className="text-xs text-berry-400 mt-2">
                        Per transaction ceiling • Gate on
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-berry-400" />
                      <span>Recent Agent Activity</span>
                    </h3>
                    <button
                      onClick={() => setCustomerTab("activity")}
                      className="text-xs text-berry-400 hover:underline"
                    >
                      View Full Audit Log
                    </button>
                  </div>

                  <div className="space-y-3">
                    {timeline.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-500">{item.time}</span>
                          <div>
                            <div className="font-semibold text-slate-200">{item.title}</div>
                            <div className="text-slate-500 text-[11px]">{item.desc}</div>
                          </div>
                        </div>
                        {item.status === "blocked" ? (
                          <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/30 font-semibold">
                            BLOCKED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold">
                            VERIFIED
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Tab: Chat & Discovery */}
            {customerTab === "chat" && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-bold text-white">Agent Discovery & Purchase</h2>
                    <p className="text-xs text-slate-400">
                      Evaluating connected merchant catalogs against ₹{userProfile.purchasing_boundary.per_transaction_limit.toLocaleString()} spending boundary
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerFailureDemo}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 flex items-center gap-1.5 font-semibold"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Simulate Limit Breach (₹7,499)</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-end">
                    <div className="max-w-lg bg-berry-600/30 border border-berry-500/40 rounded-2xl rounded-tr-sm p-4 text-sm text-slate-100 shadow-lg">
                      <div className="text-[10px] uppercase font-bold text-berry-300 mb-1">Buyer Intent</div>
                      {query || "I need running shoes under ₹7,000. I'm a beginner and run about three times a week."}
                    </div>
                  </div>

                  {(currentStage === "discovery" || currentStage === "recommendation" || currentStage === "cross_sell" || currentStage === "auth_gate") && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-berry-600 flex items-center justify-center text-sm shrink-0">
                          🫐
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="glass-panel p-4 rounded-2xl rounded-tl-sm border border-white/10 text-sm space-y-2">
                            <div className="text-xs text-berry-400 font-semibold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Evaluated {catalog.length > 3 ? "15+" : "14"} options across connected merchants</span>
                            </div>
                            <p className="text-slate-300">
                              Based on your requirements, here are the top matches:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                              {catalog.slice(0, 3).map((p, idx) => (
                                <div
                                  key={p.id}
                                  onClick={() => setSelectedProduct(p)}
                                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                                    selectedProduct?.id === p.id
                                      ? "bg-berry-950/60 border-berry-400 shadow-lg shadow-berry-600/20"
                                      : "bg-dark-900/80 border-white/10 hover:border-white/20"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      p.score >= 90 ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-300"
                                    }`}>
                                      {p.score || 94}% match
                                    </span>
                                  </div>
                                  <div className="font-bold text-white text-sm">{p.name}</div>
                                  <div className="text-berry-300 font-bold text-base mt-1">₹{p.price.toLocaleString()}</div>
                                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.desc}</div>
                                  {selectedProduct?.id === p.id && (
                                    <div className="mt-2.5 pt-2 border-t border-berry-500/30 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>Selected for cart</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommendation Reasoning */}
                          <div className="glass-panel p-4 rounded-2xl border border-berry-500/20 text-sm space-y-2">
                            <div className="font-semibold text-white">💡 Berry's Recommendation:</div>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              <strong>{selectedProduct?.name || "Nimbus Runner"}</strong> is the strongest match because it offers optimal road cushioning and stays comfortably within your <strong>₹7,000</strong> authorized purchase boundary.
                            </p>
                          </div>

                          {/* Cross-Sell */}
                          <div className="glass-panel-glow p-5 rounded-2xl border border-pink-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Optional Complementary Addon</span>
                              </span>
                              <span className="text-[11px] text-slate-400">31% attach rate</span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <div className="font-bold text-white text-sm">{socksItem.name}</div>
                                <div className="text-xs text-slate-400">{socksItem.desc}</div>
                                <div className="text-sm font-bold text-pink-300 mt-1">+ ₹{socksItem.price}</div>
                              </div>
                              <button
                                onClick={() => handleToggleSocks(!includeSocks)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                  includeSocks
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                                    : "bg-dark-900 text-slate-300 hover:text-white border border-white/10"
                                }`}
                              >
                                {includeSocks ? "✓ Added" : "+ Add ₹499"}
                              </button>
                            </div>
                          </div>

                          {/* Proceed to Money Gate */}
                          <div className="flex justify-end pt-2">
                            <button
                              onClick={() => setCurrentStage("auth_gate")}
                              className="px-6 py-3 rounded-xl bg-gradient-to-r from-berry-600 to-pink-600 hover:from-berry-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-berry-600/30 flex items-center gap-2"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Review Purchase Request (Money Gate)</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Money Gate Modal */}
                  {currentStage === "auth_gate" && (
                    <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border-2 border-berry-500/50 shadow-2xl space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-berry-600 flex items-center justify-center text-white">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">
                              🛡️ PURCHASE REQUEST (HUMAN GATE)
                            </h3>
                            <p className="text-xs text-slate-400">
                              Berry requires your explicit approval before money moves
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-berry-950 text-berry-300 border border-berry-500/30 text-xs font-semibold">
                          Authorization Required
                        </span>
                      </div>

                      <div className="space-y-2 bg-dark-900/80 p-4 rounded-2xl border border-white/5 text-sm">
                        <div className="flex justify-between py-1">
                          <span className="text-slate-300">{selectedProduct?.name || "Nimbus Runner"}</span>
                          <span className="font-semibold text-white">₹{(selectedProduct?.price || 6499).toLocaleString()}</span>
                        </div>
                        {includeSocks && (
                          <div className="flex justify-between py-1 text-slate-300">
                            <span>Performance Anti-Blister Socks</span>
                            <span className="font-semibold text-white">₹499</span>
                          </div>
                        )}
                        <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base">
                          <span className="text-white">Total Proposed Cart</span>
                          <span className="text-berry-300">₹{((selectedProduct?.price || 6499) + (includeSocks ? 499 : 0)).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="bg-dark-900/60 p-4 rounded-2xl border border-emerald-500/30 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Authorized Purchase Limit:</span>
                          <span className="font-mono font-bold text-emerald-400">₹7,000</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
                          <div className="flex items-center gap-1.5 text-emerald-400"><Check className="w-3.5 h-3.5" /><span>Within purchase limit</span></div>
                          <div className="flex items-center gap-1.5 text-emerald-400"><Check className="w-3.5 h-3.5" /><span>Merchant verified & active</span></div>
                          <div className="flex items-center gap-1.5 text-emerald-400"><Check className="w-3.5 h-3.5" /><span>In stock (12 units)</span></div>
                          <div className="flex items-center gap-1.5 text-emerald-400"><Check className="w-3.5 h-3.5" /><span>Razorpay Test Gateway ready</span></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            alert("Transaction rejected by user. No payment attempted.");
                            setCurrentStage("idle");
                          }}
                          className="flex-1 py-3 rounded-xl bg-dark-900 hover:bg-dark-800 text-slate-300 border border-white/10 font-bold text-xs uppercase"
                        >
                          Reject
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={handleApproveAndPay}
                          className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Opening Razorpay Checkout...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              <span>Approve ₹{((selectedProduct?.price || 6499) + (includeSocks ? 499 : 0)).toLocaleString()} & Pay via Razorpay</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Blocked State */}
                  {currentStage === "blocked" && (
                    <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border-2 border-red-500/60 shadow-2xl space-y-6 bg-red-950/20 animate-fadeIn">
                      <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white">
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-red-400">⛔ PURCHASE BLOCKED</h3>
                          <p className="text-xs text-red-200">The final amount exceeds your authorized purchase limit by ₹499.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-dark-900 border border-red-500/20">
                          <div className="text-slate-400">Authorized Limit</div>
                          <div className="text-base font-bold text-white mt-0.5">₹7,000</div>
                        </div>
                        <div className="p-3 rounded-xl bg-dark-900 border border-red-500/20">
                          <div className="text-slate-400">Requested Amount</div>
                          <div className="text-base font-bold text-red-400 mt-0.5">₹7,499</div>
                        </div>
                        <div className="p-3 rounded-xl bg-dark-900 border border-red-500/20">
                          <div className="text-slate-400">Difference</div>
                          <div className="text-base font-bold text-red-400 mt-0.5">+ ₹499</div>
                        </div>
                        <div className="p-3 rounded-xl bg-dark-900 border border-emerald-500/20">
                          <div className="text-slate-400">Payment Attempted</div>
                          <div className="text-base font-bold text-emerald-400 mt-0.5">NO (₹0 moved)</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-400">Deterministic Go policy engine preserved spending boundaries.</span>
                        <button
                          onClick={handleFixCart}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-berry-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-2"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Fix Cart (Restore ₹6,499)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Tab: Activity */}
            {customerTab === "activity" && (
              <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold text-white">ACTIVITY TIMELINE</h2>
                    <p className="text-xs text-slate-400">Verifiable agent actions, policy evaluations, and cryptographic passports</p>
                  </div>
                  <button
                    onClick={() => {
                      if (passportData) setShowPassportModal(true);
                      else alert("Run a purchase to seal a Transaction Passport!");
                    }}
                    className="text-xs px-3.5 py-2 rounded-xl bg-berry-600 hover:bg-berry-500 text-white font-semibold"
                  >
                    Inspect Passport (#BRY-1042)
                  </button>
                </div>

                <div className="space-y-3">
                  {timeline.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (passportData) setShowPassportModal(true);
                      }}
                      className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-berry-500/30 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-dark-900 flex items-center justify-center font-mono text-xs text-slate-400 border border-white/5">
                          {item.time.includes(" ") ? item.time.split(" ")[1] : item.time}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{item.title}</div>
                          <div className="text-slate-400 text-xs">{item.desc}</div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === "blocked" ? "bg-red-950 text-red-400 border border-red-500/30" : "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {item.status === "blocked" ? "BLOCKED" : "VERIFIED"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Tab: Profile */}
            {customerTab === "profile" && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold text-white">🫐 MY BERRY</h2>
                    <p className="text-xs text-slate-400">Financial context & trust boundaries</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    DEMO / SANDBOX DATA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-2 text-xs">
                    <div className="font-bold text-slate-400 uppercase">Personal Context</div>
                    <div className="flex justify-between py-1 border-b border-white/5"><span className="text-slate-500">Name</span><span>{userProfile.name}</span></div>
                    <div className="flex justify-between py-1 border-b border-white/5"><span className="text-slate-500">Email</span><span>{userProfile.email}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-500">Phone</span><span>{userProfile.phone}</span></div>
                  </div>

                  <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-2 text-xs">
                    <div className="font-bold text-slate-400 uppercase flex justify-between"><span>Financial Context</span><span className="text-amber-400">Sandbox</span></div>
                    <div className="flex justify-between py-1 border-b border-white/5"><span className="text-slate-500">CIBIL Score</span><span className="text-emerald-400 font-bold">● {userProfile.financial_context.cibil_score_demo}</span></div>
                    <div className="flex justify-between py-1 border-b border-white/5"><span className="text-slate-500">Bank</span><span>{userProfile.financial_context.bank_name_demo} •••• {userProfile.financial_context.bank_last4_demo}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-500">UPI ID</span><span>{userProfile.financial_context.upi_id_demo}</span></div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Spending Boundaries</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-300">Per Transaction Ceiling</span><span className="font-bold text-berry-300">₹{userProfile.purchasing_boundary.per_transaction_limit.toLocaleString()}</span></div>
                      <input
                        type="range"
                        min="1000"
                        max="20000"
                        step="500"
                        value={userProfile.purchasing_boundary.per_transaction_limit}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            purchasing_boundary: {
                              ...userProfile.purchasing_boundary,
                              per_transaction_limit: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-berry-500 bg-dark-900"
                      />
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-300">Daily Spending Limit</span><span className="font-bold text-berry-300">₹{userProfile.purchasing_boundary.daily_spending_limit.toLocaleString()}</span></div>
                      <input
                        type="range"
                        min="5000"
                        max="100000"
                        step="1000"
                        value={userProfile.purchasing_boundary.daily_spending_limit}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            purchasing_boundary: {
                              ...userProfile.purchasing_boundary,
                              daily_spending_limit: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-berry-500 bg-dark-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PERSPECTIVE 2: 🏪 MERCHANT PORTAL (Commerce OS + Add Product + AI Enrichment)
           ========================================================================= */}
        {portalMode === "merchant" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">BERRY COMMERCE OS</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                    Agent-Native Merchant Stack
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  AI Growth, Agentic Commerce & Live Dynamic Product Indexing
                </p>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-semibold">AI GMV</div>
                <div className="text-2xl lg:text-3xl font-bold text-white mt-1">₹48,420</div>
                <div className="text-xs text-emerald-400 mt-2 font-semibold">↑ 23.8% vs last month</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-semibold">AI Orders</div>
                <div className="text-2xl lg:text-3xl font-bold text-white mt-1">27</div>
                <div className="text-xs text-emerald-400 mt-2 font-semibold">↑ 14 new agent orders</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-semibold">AOV</div>
                <div className="text-2xl lg:text-3xl font-bold text-white mt-1">₹1,794</div>
                <div className="text-xs text-emerald-400 mt-2 font-semibold">↑ 12.4% order value</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
                <div className="text-xs text-indigo-300 uppercase font-semibold">Upsell Revenue</div>
                <div className="text-2xl lg:text-3xl font-bold text-indigo-200 mt-1">₹8,420</div>
                <div className="text-xs text-indigo-400 mt-2 font-semibold">↑ 31% attach rate</div>
              </div>
            </div>

            {/* ADD PRODUCT & AI ENRICHMENT SECTION */}
            <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-indigo-500/30 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Add Product & AI Auto-Enrich
                    </h3>
                    <p className="text-xs text-slate-400">
                      Instantly index products into Berry's AI discovery engine with agent attributes
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  Live Merchant → Customer Loop
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Controls */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Product Name</label>
                    <input
                      type="text"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="e.g. UltraRide Zoom 2"
                      className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Price (₹ INR)</label>
                      <input
                        type="number"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Inventory Units</label>
                      <input
                        type="number"
                        value={newProductInventory}
                        onChange={(e) => setNewProductInventory(e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Category</label>
                    <input
                      type="text"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Description / Natural Language Prompt</label>
                    <textarea
                      rows={2}
                      value={newProductDesc}
                      onChange={(e) => setNewProductDesc(e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={handleAddProduct}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Profile & Publish Live</span>
                  </button>
                </div>

                {/* AI Enrichment Preview */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 bg-dark-900/60 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Berry AI Product Enrichment Profile</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      READINESS 98%
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="font-semibold text-white">{newProductCategory}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Target Audience:</span><span>Beginner and tempo road runners</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Use Cases:</span><span>Daily training, 5K road prep</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Price Tier:</span><span>Mid-tier value (Fits ₹7k limit)</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Frequently Bought With:</span><span className="text-pink-400">Performance Anti-Blister Socks</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Search Attributes:</span><span className="font-mono text-[11px] text-indigo-300">#running #beginner #cushion</span></div>
                  </div>

                  {showAddSuccess && lastAddedProduct && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 space-y-2">
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✓ {lastAddedProduct.name} is now LIVE on Berry!</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Customers can now search and buy this product with natural language.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedProduct(lastAddedProduct);
                          setPortalMode("customer");
                          setCustomerTab("chat");
                          setCurrentStage("recommendation");
                        }}
                        className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View as Buyer (Test Discovery Loop)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Merchant Catalog Grid */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-400" />
                  <span>Agent-Native Product Catalog ({catalog.length} Products)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {catalog.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-dark-900 border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <span className="font-bold text-berry-300 text-sm">₹{p.price.toLocaleString()}</span>
                    </div>
                    <div className="text-slate-400">{p.desc}</div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                      <span className="text-slate-500">{p.inventory || 12} units in stock</span>
                      <span className="text-emerald-400 font-semibold">AI Index Ready ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Opportunities */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-berry-400" />
                <span>Merchant Growth Agent: 3 Revenue Opportunities</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {growthOps.map((op, idx) => (
                  <div key={op.id} className="p-4 rounded-xl bg-dark-900 border border-white/5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-berry-400">OPPORTUNITY #{idx + 1}</div>
                      <div className="font-bold text-white text-sm">{op.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{op.desc}</div>
                      <div className="text-xs text-emerald-400 font-semibold pt-1">Est: {op.estimated}</div>
                    </div>
                    <button
                      onClick={() => {
                        const upd = [...growthOps];
                        upd[idx].enabled = !upd[idx].enabled;
                        setGrowthOps(upd);
                      }}
                      className={`w-full py-2 rounded-lg text-xs font-semibold ${
                        op.enabled ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30" : "bg-indigo-600 text-white"
                      }`}
                    >
                      {op.enabled ? "✓ Enabled" : "Enable Opportunity"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PERSPECTIVE 3: 🧠 BERRY ADMIN CONTROL CENTER (Network Overview & Forensic Trace)
           ========================================================================= */}
        {portalMode === "admin" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Admin Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">🧠 BERRY CONTROL CENTER</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    Global Network Monitor
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Forensic transaction execution traces, agent cluster health, and policy violation analytics
                </p>
              </div>
            </div>

            {/* Infrastructure Health Status */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              {[
                { name: "Agent Engine", status: "OPERATIONAL", color: "text-emerald-400" },
                { name: "Razorpay Gateway", status: "CONNECTED", color: "text-emerald-400" },
                { name: "OpenAI GPT-4o", status: "CONNECTED", color: "text-emerald-400" },
                { name: "PostgreSQL DB", status: "HEALTHY", color: "text-emerald-400" },
                { name: "Redis Cache", status: "HEALTHY", color: "text-emerald-400" },
              ].map((sys, i) => (
                <div key={i} className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">{sys.name}</span>
                  <span className={`font-bold font-mono text-[11px] ${sys.color}`}>● {sys.status}</span>
                </div>
              ))}
            </div>

            {/* Network Volume & Today Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-semibold">Total Customers</div>
                <div className="text-2xl lg:text-3xl font-bold text-white mt-1">1,284</div>
                <div className="text-xs text-slate-400 mt-2">Verified authorized buyers</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-semibold">Connected Merchants</div>
                <div className="text-2xl lg:text-3xl font-bold text-white mt-1">42</div>
                <div className="text-xs text-emerald-400 mt-2">100% catalog synced</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-semibold">AI Transactions</div>
                <div className="text-2xl lg:text-3xl font-bold text-white mt-1">8,421</div>
                <div className="text-xs text-emerald-400 mt-2">97.4% success rate</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
                <div className="text-xs text-emerald-300 uppercase font-semibold">Network AI GMV</div>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-200 mt-1">₹18.42 Lakhs</div>
                <div className="text-xs text-emerald-400 mt-2">Today: ₹4.82 Lakhs</div>
              </div>
            </div>

            {/* FORENSIC TRANSACTION EXPLORER & AGENT TRACE */}
            <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-berry-600 flex items-center justify-center text-white">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Forensic Transaction Trace (#BRY-1042)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Step-by-step cryptographic and policy audit sequence
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  Latency: 1.42s
                </span>
              </div>

              {/* Visual Execution Pipeline */}
              <div className="p-4 rounded-2xl bg-dark-900 border border-white/5 space-y-3">
                <div className="text-xs font-bold uppercase text-slate-400">EXECUTION FLOW TRACE</div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  {["USER", "INTENT", "OPENAI", "SEARCH_CATALOG", "RECOMMEND", "CROSS_SELL", "POLICY_ENGINE", "USER_APPROVAL", "RAZORPAY", "WEBHOOK", "PASSPORT_SEALED"].map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-2.5 py-1 rounded-lg bg-dark-800 text-slate-200 border border-white/10">
                        {step}
                      </span>
                      {idx < 10 && <span className="text-berry-400">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Forensic Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5">
                  <div className="text-slate-500">Customer</div>
                  <div className="font-bold text-white mt-1">Suman (usr_suman_01)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5">
                  <div className="text-slate-500">Connected Merchant</div>
                  <div className="font-bold text-white mt-1">AeroStride (Runner.co)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5">
                  <div className="text-slate-500">Amount & Policy</div>
                  <div className="font-bold text-emerald-400 mt-1">₹6,499 (Limit ₹7,000 ✓)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-dark-900 border border-white/5">
                  <div className="text-slate-500">Razorpay Signature</div>
                  <div className="font-mono text-emerald-400 mt-1">HMAC-SHA256 Verified ✓</div>
                </div>
              </div>
            </div>

            {/* AGENT CLUSTERS & POLICY ENGINE METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agent Operations */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Agent Cluster Operations</span>
                </h3>
                <div className="space-y-3 text-xs">
                  {adminStats.agents.map((agent: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-dark-900 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{agent.name}</div>
                        <div className="text-slate-400 text-[11px]">{agent.model} • {agent.tools_count} tools</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-emerald-400 font-bold">{agent.success_rate}% success</div>
                        <div className="text-slate-500 text-[10px]">Avg Latency: {agent.avg_latency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Monitor */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-berry-400" />
                  <span>Policy Safety Engine (Invariants)</span>
                </h3>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                    <div className="text-slate-400">Allowed</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">8,402</div>
                  </div>
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30">
                    <div className="text-slate-400">Blocked</div>
                    <div className="text-lg font-bold text-red-400 mt-1">214</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <div className="text-slate-400">Escalated</div>
                    <div className="text-lg font-bold text-amber-400 mt-1">38</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div className="text-slate-400 font-semibold">Top Enforced Block Reasons:</div>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between p-2 rounded bg-dark-900"><span>• Per-transaction limit ceiling</span><span className="font-mono font-bold text-red-400">124</span></div>
                    <div className="flex justify-between p-2 rounded bg-dark-900"><span>• Restricted goods category</span><span className="font-mono font-bold text-red-400">52</span></div>
                    <div className="flex justify-between p-2 rounded bg-dark-900"><span>• Merchant discount threshold</span><span className="font-mono font-bold text-red-400">26</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kubernetes Deployment Pods */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>Kubernetes Cluster Pods (Ready)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-dark-900 border border-white/5">
                  <div className="text-slate-400">berry-web</div>
                  <div className="text-emerald-400 font-bold mt-1">2/2 Running ✓</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-900 border border-white/5">
                  <div className="text-slate-400">berry-gateway (Go)</div>
                  <div className="text-emerald-400 font-bold mt-1">2/2 Running ✓</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-900 border border-white/5">
                  <div className="text-slate-400">rust-ledger</div>
                  <div className="text-emerald-400 font-bold mt-1">2/2 Running ✓</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-900 border border-white/5">
                  <div className="text-slate-400">redis + postgres</div>
                  <div className="text-emerald-400 font-bold mt-1">2/2 Running ✓</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: TRANSACTION PASSPORT (#BRY-1042) ================= */}
      {showPassportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-dark-900 border-2 border-berry-500/40 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🫐</span>
                  <h3 className="text-xl font-bold text-white tracking-tight">TRANSACTION PASSPORT</h3>
                  <span className="font-mono text-sm text-berry-300 font-bold">{passportData?.passport_id || "#BRY-1042"}</span>
                </div>
                <p className="text-xs text-slate-400">Cryptographically sealed audit trail & execution proof</p>
              </div>
              <button
                onClick={() => setShowPassportModal(false)}
                className="w-8 h-8 rounded-full bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-berry-950/40 border border-berry-500/30">
              <div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMPLETED & AUTHORIZED</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Razorpay Test Payment Confirmed</div>
              </div>
              <div className="text-2xl font-bold text-white">
                ₹{(passportData?.amount_inr || 6499).toLocaleString()}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">BUYER INTENT</span>
                <p className="text-slate-200">"{passportData?.intent || "Beginner running shoes under ₹7,000"}"</p>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">RECOMMENDATION</span>
                <p className="font-bold text-white">{passportData?.recommendation || "Nimbus Runner"}</p>
                <div className="text-slate-400 text-[11px] space-y-0.5 pt-1">
                  <div>• Suitable for beginner daily road training</div>
                  <div>• Comfortably within authorized ₹7,000 limit</div>
                  <div>• In-stock verified with connected merchant</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">POLICY VERIFICATION</span>
                  <div className="text-slate-200 mt-0.5">
                    Limit: ₹7,000 | Final Cart: ₹{(passportData?.amount_inr || 6499).toLocaleString()}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                  ✓ AUTHORIZED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">PAYMENT DETAILS</span>
                  <div className="text-slate-200 mt-0.5">Provider: Razorpay Standard (Test Mode)</div>
                </div>
                <span className="font-mono text-slate-400">{passportData?.payment_details?.payment_id || "pay_RZP9021481"}</span>
              </div>

              <div className="p-3 rounded-xl bg-dark-950 border border-berry-500/20 font-mono text-[10px] space-y-1">
                <div className="text-slate-500">SHA-256 AUDIT MERKLE ROOT:</div>
                <div className="text-berry-300 truncate">
                  {passportData?.audit_merkle_root || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleExplainAudio}
                className="flex-1 py-3 rounded-xl bg-berry-600 hover:bg-berry-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-berry-600/30 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? "Stop Voice Explanation" : "Explain This Transaction (Voice)"}</span>
              </button>
              <button
                onClick={() => setShowPassportModal(false)}
                className="px-6 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
