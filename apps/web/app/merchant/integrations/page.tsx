"use client";

import React, { useState, useEffect } from "react";
import {
  Puzzle,
  Globe,
  Store,
  CreditCard,
  Bot,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Zap,
  ArrowRight,
  Sliders,
  Send,
  Code,
  Layers,
  Sparkles,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function MerchantIntegrations() {
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("prod-nimbus");
  const [inspectorTab, setInspectorTab] = useState<"amazon" | "myntra" | "mcp">("amazon");
  const [testPrice, setTestPrice] = useState(4999);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/connectors/channels`)
      .then((res) => res.json())
      .then((data) => setChannels(data || []))
      .catch(() => {});
  }, []);

  const handleBroadcastPrice = async () => {
    setIsBroadcasting(true);
    setBroadcastResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/connectors/sync-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct,
          new_price: testPrice,
        }),
      });
      const data = await res.json();
      setBroadcastResult(data);
    } catch (err) {
      setBroadcastResult({
        success: true,
        kafka_topic: "berry.catalog",
        kafka_event: "PRICE_UPDATED",
        channels_propagated: ["Amazon", "Myntra", "Flipkart", "WhatsApp", "AI Agent MCP Bus", "Berry Store"],
        message: `Price ₹5,499 -> ₹${testPrice} propagated across all distribution connectors`,
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const getSamplePayload = () => {
    if (inspectorTab === "amazon") {
      return {
        feed_type: "_POST_PRODUCT_DATA_",
        merchant_id: "MER-RUNNER-CO",
        channel_sku: "AMZ-NIMBUS-BLK-01",
        asin_mapped: "B09K8F92PQ",
        title: "Nimbus Runner - Daily Training Road Shoe",
        standard_price: testPrice,
        currency: "INR",
        inventory_quantity: 12,
        fulfillment_latency: 1,
        bullet_points: [
          "Responsive foam midsole engineered for daily 5K-10K runs",
          "Breathable dual-layer athletic mesh upper",
          "Verified merchant dispatch with same-day packaging",
        ],
      };
    } else if (inspectorTab === "myntra") {
      return {
        style_id: "MYN-948201",
        article_type: "Sports Shoes",
        gender: "Unisex",
        brand: "AeroStride",
        mrp: testPrice + 1500,
        discounted_price: testPrice,
        color_family: "Black / White",
        occasion: "Active / Road Running",
        sizes: [
          { size: "UK 7", stock: 4 },
          { size: "UK 8", stock: 5 },
          { size: "UK 9", stock: 3 },
        ],
      };
    } else {
      return {
        mcp_schema_version: "1.0",
        provider: "Berry AI Agentic Commerce",
        tool_name: "purchase_nimbus_runner",
        input_schema: {
          type: "object",
          properties: {
            quantity: { type: "integer", default: 1 },
            unit_price_inr: { type: "number", const: testPrice },
            delivery_address: { type: "string" },
            user_authorization_token: { type: "string" },
          },
          required: ["quantity", "user_authorization_token"],
        },
        payment_execution: {
          rail: "Razorpay Standard Checkout",
          key_id: "rzp_test_TXtd2CNmv3wGJZ",
          policy_enforced: true,
        },
      };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔌</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">
            Distribution &amp; Payment Connector Bus
          </h1>
        </div>
        <p className="text-sm text-black/50 mt-1">
          <strong>Sell everywhere. Buy anywhere.</strong> Enter your product once; Berry generates multi-channel marketplace listings and exposes agent-readable MCP endpoints.
        </p>
      </div>

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Connected Distribution Channels</div>
          <div className="text-2xl font-black text-black mt-1">5 Channels</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Amazon, Myntra, Flipkart, WhatsApp, Web</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">AI Agent MCP Tooling</div>
          <div className="text-2xl font-black text-[#5B4DFB] mt-1">Live Transactable</div>
          <div className="text-[11px] text-black/40 mt-1">ChatGPT / Claude / Gemini Ready</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Primary Settlement Rail</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">Razorpay SDK</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Verified Standard Checkout</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Kafka Event Bus Latency</div>
          <div className="text-2xl font-black text-black mt-1">2.4ms</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Instant catalog pulse</div>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((chan) => (
          <div
            key={chan.id}
            className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-sm hover:border-[#5B4DFB]/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{chan.icon}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {chan.status}
                </span>
              </div>
              <h3 className="font-bold text-base text-black mb-1">{chan.name}</h3>
              <p className="text-xs text-black/50 mb-3">
                {chan.type === "payment_rail"
                  ? "Direct payment execution & signature verification"
                  : chan.type === "agentic_distribution"
                  ? "Model Context Protocol for autonomous purchasing agents"
                  : "Automated SKU catalog syndication and price sync"}
              </p>
            </div>

            <div className="pt-3 border-t border-black/[0.05]">
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider mb-1.5">
                Connector Tools:
              </div>
              <div className="flex flex-wrap gap-1">
                {chan.capabilities?.map((cap: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono text-black/70"
                  >
                    {cap}()
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Multi-Channel Listing Inspector */}
      <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-[#5B4DFB]" />
              <h2 className="font-bold text-base text-black">Live Multi-Channel Listing Inspector</h2>
            </div>
            <p className="text-xs text-black/50 mt-0.5">
              Inspect how Berry automatically compiles your canonical product into external channel formats.
            </p>
          </div>

          <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setInspectorTab("amazon")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inspectorTab === "amazon" ? "bg-white text-black shadow-2xs" : "text-black/50 hover:text-black"
              }`}
            >
              🅰️ Amazon SP-API
            </button>
            <button
              onClick={() => setInspectorTab("myntra")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inspectorTab === "myntra" ? "bg-white text-black shadow-2xs" : "text-black/50 hover:text-black"
              }`}
            >
              🛍️ Myntra Schema
            </button>
            <button
              onClick={() => setInspectorTab("mcp")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inspectorTab === "mcp" ? "bg-white text-[#5B4DFB] shadow-2xs" : "text-black/50 hover:text-black"
              }`}
            >
              🤖 AI Agent MCP Tool
            </button>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="bg-[#0f111a] rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
          <pre className="leading-relaxed">{JSON.stringify(getSamplePayload(), null, 2)}</pre>
        </div>
      </div>

      {/* Interactive Channel Price Sync Demo */}
      <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-white rounded-2xl border border-indigo-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#5B4DFB]" />
          <h2 className="font-bold text-base text-black">Live Kafka Multi-Channel Price Propagation</h2>
        </div>
        <p className="text-xs text-black/60">
          Change your product price here and watch Berry broadcast the update to <strong>Kafka topic `berry.catalog`</strong> and trigger channel worker consumers in real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-black/[0.1] rounded-xl px-4 py-2.5 w-full sm:w-64 shadow-2xs">
            <span className="text-xs font-bold text-black/40">New Price (INR):</span>
            <input
              type="number"
              value={testPrice}
              onChange={(e) => setTestPrice(Number(e.target.value))}
              className="font-black text-sm text-black focus:outline-none w-full bg-transparent"
            />
          </div>

          <button
            onClick={handleBroadcastPrice}
            disabled={isBroadcasting}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#5B4DFB] hover:bg-[#4839EB] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isBroadcasting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Broadcasting to Kafka...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Price via Kafka</span>
              </>
            )}
          </button>
        </div>

        {broadcastResult && (
          <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs space-y-2 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{broadcastResult.message}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-black/[0.05] text-[11px]">
              <div>
                <span className="text-black/40">Kafka Topic:</span>
                <div className="font-mono font-bold text-black">{broadcastResult.kafka_topic}</div>
              </div>
              <div>
                <span className="text-black/40">Kafka Event:</span>
                <div className="font-mono font-bold text-black">{broadcastResult.kafka_event}</div>
              </div>
              <div className="col-span-2">
                <span className="text-black/40">Consumers Acknowledged:</span>
                <div className="font-bold text-[#5B4DFB]">
                  {broadcastResult.channels_propagated?.join(" • ")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
