"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sliders,
  Send,
  Zap,
  Bot,
  MessageSquare,
  Globe,
  CreditCard,
  ShoppingBag,
  Activity,
  Layers,
  ArrowUpRight,
  Sparkles,
  Info,
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  type: "marketplace" | "direct" | "conversational" | "agent" | "payment";
  status: "LIVE" | "SANDBOX" | "AVAILABLE" | "ACTION_REQUIRED";
  productsCount: number;
  syncedCount: number;
  pendingCount: number;
  capabilities: {
    inventory: boolean;
    pricing: boolean;
    orders: boolean;
    catalog: boolean;
  };
  lastSynced: string;
  iconBg: string;
  iconText: string;
  iconEmoji: string;
}

const INITIAL_CHANNELS: Channel[] = [
  {
    id: "amazon",
    name: "Amazon IN",
    type: "marketplace",
    status: "LIVE",
    productsCount: 127,
    syncedCount: 124,
    pendingCount: 3,
    capabilities: { inventory: true, pricing: true, orders: true, catalog: true },
    lastSynced: "2 minutes ago",
    iconBg: "bg-[#FF9900]/10 text-[#FF9900]",
    iconText: "AMZ",
    iconEmoji: "🛒",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    type: "marketplace",
    status: "LIVE",
    productsCount: 127,
    syncedCount: 127,
    pendingCount: 0,
    capabilities: { inventory: true, pricing: true, orders: true, catalog: true },
    lastSynced: "4 minutes ago",
    iconBg: "bg-[#2874F0]/10 text-[#2874F0]",
    iconText: "FLP",
    iconEmoji: "🛍️",
  },
  {
    id: "myntra",
    name: "Myntra",
    type: "marketplace",
    status: "LIVE",
    productsCount: 94,
    syncedCount: 94,
    pendingCount: 0,
    capabilities: { inventory: true, pricing: true, orders: true, catalog: true },
    lastSynced: "10 minutes ago",
    iconBg: "bg-[#FF3F6C]/10 text-[#FF3F6C]",
    iconText: "MYN",
    iconEmoji: "👟",
  },
  {
    id: "berry-store",
    name: "Berry Customer Store",
    type: "direct",
    status: "LIVE",
    productsCount: 127,
    syncedCount: 127,
    pendingCount: 0,
    capabilities: { inventory: true, pricing: true, orders: true, catalog: true },
    lastSynced: "Real-time (SSE/Kafka)",
    iconBg: "bg-[#5B4DFB]/10 text-[#5B4DFB]",
    iconText: "BRY",
    iconEmoji: "🫐",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Commerce",
    type: "conversational",
    status: "SANDBOX",
    productsCount: 42,
    syncedCount: 42,
    pendingCount: 0,
    capabilities: { inventory: true, pricing: true, orders: true, catalog: true },
    lastSynced: "1 hour ago",
    iconBg: "bg-[#25D366]/10 text-[#25D366]",
    iconText: "WA",
    iconEmoji: "💬",
  },
  {
    id: "mcp-agent",
    name: "AI Agent Bus (MCP)",
    type: "agent",
    status: "LIVE",
    productsCount: 127,
    syncedCount: 127,
    pendingCount: 0,
    capabilities: { inventory: true, pricing: true, orders: false, catalog: true },
    lastSynced: "Instant (Model Context Protocol)",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    iconText: "MCP",
    iconEmoji: "🤖",
  },
];

const INITIAL_EVENTS = [
  {
    id: "EVT-8941",
    time: "Just now",
    type: "INVENTORY_SYNCED",
    product: "Nimbus Runner v2",
    summary: "Stock 20 -> 18 propagated to Kafka (berry.catalog)",
    consumers: ["Amazon", "Flipkart", "Berry Store"],
    status: "success",
  },
  {
    id: "EVT-8940",
    time: "2 min ago",
    type: "PRICE_UPDATED",
    product: "Trail Pro Flask 750ml",
    summary: "Price ₹1,299 -> ₹1,199 updated across live feeds",
    consumers: ["Amazon", "Flipkart", "Myntra", "Berry Store"],
    status: "success",
  },
  {
    id: "EVT-8939",
    time: "5 min ago",
    type: "CATALOG_MAP_WARN",
    product: "Urban Windcheater Jacket",
    summary: "Amazon category taxonomy requires subcategory verification",
    consumers: ["Amazon Connector"],
    status: "warning",
  },
  {
    id: "EVT-8938",
    time: "12 min ago",
    type: "MCP_TOOL_INVOKED",
    product: "Running Category",
    summary: "AI Buyer query: 'Shoes under ₹5,000' returned 3 items",
    consumers: ["Agentic Gateway"],
    status: "success",
  },
];

export default function ConnectorsPage() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [manageTab, setManageTab] = useState<"overview" | "mapping" | "inventory" | "activity">("overview");

  // Sync Everything / Sync Center Modal state
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStepText, setSyncStepText] = useState("");
  const [syncDone, setSyncDone] = useState(false);

  // Add Connector Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [selectedNewConnector, setSelectedNewConnector] = useState("Shopify");
  const [syncRules, setSyncRules] = useState({
    sourceOfTruth: "berry",
    syncPricing: true,
    importOrders: true,
  });

  // Centralized Inventory Demo state inside Detail Modal
  const [invStock, setInvStock] = useState(18);
  const [isUpdatingInv, setIsUpdatingInv] = useState(false);
  const [invBroadcastStatus, setInvBroadcastStatus] = useState<string | null>(null);

  // Selected event inspection
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Handle Sync Everything Flow
  const triggerSyncEverything = () => {
    setIsSyncingAll(true);
    setSyncProgress(15);
    setSyncStepText("Connecting to Kafka cluster (berry.catalog, berry.commerce)...");
    setSyncDone(false);

    setTimeout(() => {
      setSyncProgress(45);
      setSyncStepText("Syncing 127 products to Amazon SP-API feed & Flipkart...");
    }, 800);

    setTimeout(() => {
      setSyncProgress(78);
      setSyncStepText("Updating price matrices and inventory locks across all adapters...");
    }, 1600);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncStepText("All distribution channels and MCP tool feeds fully synchronized!");
      setSyncDone(true);
      setEvents((prev) => [
        {
          id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
          time: "Just now",
          type: "GLOBAL_SYNC_COMPLETE",
          product: "All Catalog (127 items)",
          summary: "Synchronized across Amazon, Flipkart, Myntra, WhatsApp & MCP",
          consumers: ["All Connectors"],
          status: "success",
        },
        ...prev,
      ]);
    }, 2400);
  };

  // Centralized Inventory Update Simulation
  const handleUpdateStock = (newVal: number) => {
    setIsUpdatingInv(true);
    setInvStock(newVal);
    setInvBroadcastStatus("Publishing INVENTORY_UPDATED to Kafka...");

    setTimeout(() => {
      setInvBroadcastStatus(`Broadcasted! Stock ${newVal} verified on Amazon, Flipkart, Myntra & Berry Customer portal.`);
      setIsUpdatingInv(false);
      setEvents((prev) => [
        {
          id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
          time: "Just now",
          type: "INVENTORY_UPDATED",
          product: "Nimbus Runner",
          summary: `Stock set to ${newVal} units. Synced to 4 channels.`,
          consumers: ["Amazon", "Flipkart", "Myntra", "Berry Store"],
          status: "success",
        },
        ...prev,
      ]);
    }, 700);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">Connectors</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5B4DFB]/10 text-[#5B4DFB] border border-[#5B4DFB]/20">
              Omnichannel + Agentic Control Room
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Connect Berry to the places where your products are discovered, sold and paid for.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowAddModal(true);
              setAddStep(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-sm font-semibold flex items-center gap-2 transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Connector</span>
          </button>
          <button
            onClick={triggerSyncEverything}
            disabled={isSyncingAll}
            className="px-4 py-2.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4a3cf0] text-white text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow active:scale-98 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? "animate-spin" : ""}`} />
            <span>{isSyncingAll ? "Syncing..." : "Sync Everything"}</span>
          </button>
        </div>
      </div>

      {/* Connection Health Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Connected</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">5</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Active feeds</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Syncing</div>
          <div className="text-2xl font-black text-[#5B4DFB] mt-1 flex items-center gap-1.5">
            <span>1</span>
            <span className="w-2 h-2 rounded-full bg-[#5B4DFB] animate-ping" />
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">MCP AI Agent Bus</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Attention</div>
          <div className="text-2xl font-black text-amber-500 mt-1">0</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">0 failed feeds</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Products</div>
          <div className="text-2xl font-black text-neutral-900 mt-1">127</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">124 live in sync</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Last Sync</div>
          <div className="text-sm font-black text-neutral-900 mt-2">2 min ago</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">100% healthy</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Next Sync</div>
          <div className="text-sm font-black text-[#5B4DFB] mt-2">Automatic</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Kafka event-driven</div>
        </div>
      </div>

      {/* 1. Connected Channels Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Connected Selling Channels</h2>
            <p className="text-xs text-neutral-500">Distribution surfaces synced automatically from your Berry catalog</p>
          </div>
          <span className="text-xs text-neutral-400 font-medium">1 canonical catalog → 5 endpoints</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {channels.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-xl">
                      {c.iconEmoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm leading-snug">{c.name}</h3>
                      <div className="text-[11px] text-neutral-400 capitalize">{c.type} connector</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      c.status === "LIVE"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : c.status === "SANDBOX"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === "LIVE" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    {c.status}
                  </span>
                </div>

                {/* Counts */}
                <div className="mt-4 grid grid-cols-3 gap-2 bg-neutral-50 p-2.5 rounded-xl text-center">
                  <div>
                    <div className="text-xs font-bold text-neutral-800">{c.productsCount}</div>
                    <div className="text-[10px] text-neutral-400 font-medium">Total</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-600">{c.syncedCount}</div>
                    <div className="text-[10px] text-neutral-400 font-medium">Synced</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-600">{c.pendingCount}</div>
                    <div className="text-[10px] text-neutral-400 font-medium">Pending</div>
                  </div>
                </div>

                {/* Capabilities pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.capabilities.inventory && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Inventory
                    </span>
                  )}
                  {c.capabilities.pricing && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Pricing
                    </span>
                  )}
                  {c.capabilities.orders && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Orders
                    </span>
                  )}
                  {c.capabilities.catalog && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Catalog
                    </span>
                  )}
                </div>

                <div className="mt-4 text-[11px] text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Last synced: {c.lastSynced}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedChannel(c);
                    setManageTab("overview");
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold text-center transition-all"
                >
                  Manage
                </button>
                <button
                  onClick={() => {
                    setSelectedChannel(c);
                    setManageTab("inventory");
                  }}
                  className="py-1.5 px-3 rounded-lg bg-[#5B4DFB]/10 hover:bg-[#5B4DFB]/20 text-[#5B4DFB] text-xs font-bold transition-all flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Sync Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Payment Connections Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Payment Connectors</h2>
          <p className="text-xs text-neutral-500">
            Payment rails protected by Berry&apos;s Policy &amp; Customer Authorization Engine
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Razorpay Main Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0C2340] text-white flex items-center justify-center font-black text-sm tracking-wider">
                  RZP
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-neutral-900 text-base">Razorpay Standard Web Checkout</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ● LIVE
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Primary Payment Gateway (Key ID: rzp_test_TXtd2CNmv3wGJZ)
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-4 h-4" />
                  <span>HMAC-SHA256 Verified</span>
                </div>
                <div className="text-[11px] text-neutral-400">Webhook listening: /api/razorpay-webhook</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Payment Processing
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">UPI, Cards, Netbanking</div>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Order Creation
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">/api/create-order</div>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Webhooks
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">payment.captured</div>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Refunds
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">Policy-controlled</div>
              </div>
            </div>

            {/* Architecture guarantee banner */}
            <div className="mt-5 p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#5B4DFB] flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-purple-950">Berry Policy &amp; Customer Authorization Rule:</span>{" "}
                <span className="text-purple-900/80">
                  AI buyers can discover products and assemble carts, but cannot bypass Berry to charge Razorpay directly.
                  Flow:{" "}
                  <code className="bg-purple-100 px-1 py-0.5 rounded text-[11px] font-mono text-[#5B4DFB]">
                    AI → Berry → Policy Engine → Customer Consent → Razorpay Rail
                  </code>
                </span>
              </div>
            </div>
          </div>

          {/* Payment routing settings */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">Payment Routing</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Default rail for conversational &amp; agentic checkout</p>

              <div className="mt-4 p-3 rounded-xl border border-[#5B4DFB]/30 bg-[#5B4DFB]/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5B4DFB]" />
                  <span className="text-xs font-bold text-neutral-900">Razorpay (Default)</span>
                </div>
                <Check className="w-4 h-4 text-[#5B4DFB]" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Berry Actions Allowed:</div>
                <div className="space-y-1.5 text-xs text-neutral-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#5B4DFB]" />
                    <span>Create payment orders</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#5B4DFB]" />
                    <span>Check payment verification status</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#5B4DFB]" />
                    <span>Require explicit OTP/UPI PIN authorization</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <Link
                href="/merchant/agent-access"
                className="w-full py-2 px-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Configure Agent Access Rules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Activity Log / Event Stream */}
      <section className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-[#5B4DFB]" />
            <h2 className="text-base font-bold text-neutral-900">Connector Activity Log (Kafka Event Stream)</h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Topic: berry.catalog • berry.commerce</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="py-3.5 px-2 hover:bg-neutral-50 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 sm:mt-0 flex-shrink-0 ${
                    ev.status === "success" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">
                      {ev.type}
                    </span>
                    <span className="text-xs font-bold text-neutral-900">{ev.product}</span>
                    <span className="text-[11px] text-neutral-400">• {ev.time}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">{ev.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <div className="flex items-center gap-1">
                  {ev.consumers.map((c, i) => (
                    <span key={i} className="text-[10px] bg-neutral-100 text-neutral-600 font-medium px-2 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sync Everything / Sync Center Modal */}
      {isSyncingAll && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-neutral-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#5B4DFB]/10 text-[#5B4DFB] flex items-center justify-center">
                  <RefreshCw className={`w-5 h-5 ${!syncDone ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    {syncDone ? "Sync Complete!" : "Syncing Omnichannel Connectors..."}
                  </h3>
                  <p className="text-xs text-neutral-400">Broadcasting via Kafka across all adapters</p>
                </div>
              </div>
              {syncDone && (
                <button
                  onClick={() => setIsSyncingAll(false)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-500 flex items-center justify-center text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>Overall Progress</span>
                <span>{syncProgress}%</span>
              </div>
              <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5B4DFB] rounded-full transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>

            {/* Live Counters */}
            <div className="grid grid-cols-4 gap-2 bg-neutral-50 p-3 rounded-2xl text-center">
              <div>
                <div className="text-sm font-black text-neutral-900">127/127</div>
                <div className="text-[10px] text-neutral-400 font-medium">Products</div>
              </div>
              <div>
                <div className="text-sm font-black text-neutral-900">127/127</div>
                <div className="text-[10px] text-neutral-400 font-medium">Inventory</div>
              </div>
              <div>
                <div className="text-sm font-black text-neutral-900">124/127</div>
                <div className="text-[10px] text-neutral-400 font-medium">Pricing</div>
              </div>
              <div>
                <div className="text-sm font-black text-neutral-900">43/43</div>
                <div className="text-[10px] text-neutral-400 font-medium">Orders</div>
              </div>
            </div>

            {/* Live activity message */}
            <div className="p-3 bg-neutral-100/70 rounded-xl text-xs text-neutral-700 font-medium flex items-center gap-2">
              {syncDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#5B4DFB] animate-ping flex-shrink-0" />
              )}
              <span className="truncate">{syncStepText}</span>
            </div>

            {syncDone && (
              <button
                onClick={() => setIsSyncingAll(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold transition-all"
              >
                Close Sync Center
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Connector Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-neutral-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 text-lg">Add a Commerce Connector</h3>
                <p className="text-xs text-neutral-500">Connect a marketplace, storefront, or payment channel</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addStep === 1 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">SELLING CHANNELS</div>
                <div className="grid grid-cols-2 gap-2.5">
                  {["Amazon", "Flipkart", "Myntra", "Shopify Store", "WhatsApp Commerce", "AI Buyer MCP Bus"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedNewConnector(item)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        selectedNewConnector === item
                          ? "border-[#5B4DFB] bg-[#5B4DFB]/5 text-[#5B4DFB]"
                          : "border-neutral-200 hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <span>{item}</span>
                      {selectedNewConnector === item && <Check className="w-3.5 h-3.5 text-[#5B4DFB]" />}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 pt-2">PAYMENTS</div>
                <div className="grid grid-cols-2 gap-2.5">
                  {["Razorpay (Connected)", "Stripe (Sandbox)", "Cash on Delivery", "Custom UPI Gateway"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedNewConnector(item)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        selectedNewConnector === item
                          ? "border-[#5B4DFB] bg-[#5B4DFB]/5 text-[#5B4DFB]"
                          : "border-neutral-200 hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <span>{item}</span>
                      {selectedNewConnector === item && <Check className="w-3.5 h-3.5 text-[#5B4DFB]" />}
                    </button>
                  ))}
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => setAddStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4a3cf0] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {addStep === 2 && (
              <div className="space-y-4">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                  <div className="text-xs font-bold text-neutral-900">Configuring: {selectedNewConnector}</div>
                  <div className="text-[11px] text-neutral-500">Choose synchronization rules for this adapter</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">Inventory Source of Truth</label>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 text-xs cursor-pointer hover:bg-neutral-50">
                        <input
                          type="radio"
                          name="source"
                          checked={syncRules.sourceOfTruth === "berry"}
                          onChange={() => setSyncRules({ ...syncRules, sourceOfTruth: "berry" })}
                        />
                        <span className="font-semibold text-neutral-900">Berry is the source of truth (Recommended)</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 text-xs cursor-pointer hover:bg-neutral-50">
                        <input
                          type="radio"
                          name="source"
                          checked={syncRules.sourceOfTruth === "channel"}
                          onChange={() => setSyncRules({ ...syncRules, sourceOfTruth: "channel" })}
                        />
                        <span className="text-neutral-700">{selectedNewConnector} is the source of truth</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">Pricing &amp; Orders</label>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncRules.syncPricing}
                          onChange={(e) => setSyncRules({ ...syncRules, syncPricing: e.target.checked })}
                          className="rounded text-[#5B4DFB]"
                        />
                        <span>Sync Berry catalog pricing automatically</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncRules.importOrders}
                          onChange={(e) => setSyncRules({ ...syncRules, importOrders: e.target.checked })}
                          className="rounded text-[#5B4DFB]"
                        />
                        <span>Import channel orders into Berry unified order book</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    onClick={() => setAddStep(1)}
                    className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setAddStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4a3cf0] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Connect Adapter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {addStep === 3 && (
              <div className="space-y-5 text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-neutral-900">{selectedNewConnector} Connected</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Catalog, Inventory, Pricing, and Orders hooks configured.
                  </p>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-left text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Catalog Mapping:</span>
                    <span className="font-bold text-emerald-600">✓ Ready</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Inventory Sync:</span>
                    <span className="font-bold text-emerald-600">✓ Berry Outbox</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Orders Bridge:</span>
                    <span className="font-bold text-emerald-600">✓ Webhook Active</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowAddModal(false);
                    triggerSyncEverything();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4a3cf0] text-white text-xs font-bold transition-all shadow"
                >
                  Run First Sync
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connector Detail / Manage Modal */}
      {selectedChannel && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-xl">
                  {selectedChannel.iconEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-neutral-900 text-base">{selectedChannel.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ● LIVE
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">Last synced: {selectedChannel.lastSynced}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedChannel(null)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-500 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-neutral-100 pb-2">
              <button
                onClick={() => setManageTab("overview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  manageTab === "overview" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setManageTab("mapping")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  manageTab === "mapping" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                Catalog Mapping
              </button>
              <button
                onClick={() => setManageTab("inventory")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  manageTab === "inventory" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                Centralized Inventory
              </button>
              <button
                onClick={() => setManageTab("activity")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  manageTab === "activity" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                Failures &amp; Recovery
              </button>
            </div>

            {/* Tab: Overview */}
            {manageTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase">SYNC HEALTH</div>
                    <div className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operational
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase">FEED PROTOCOL</div>
                    <div className="text-sm font-bold text-neutral-800 mt-1 font-mono text-xs">
                      REST + Kafka Consumer
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-neutral-900">Synchronized Entities:</div>
                  <div className="grid grid-cols-2 gap-2 text-neutral-600">
                    <div>• Catalog Schema: <span className="font-semibold text-neutral-900">Auto-mapped</span></div>
                    <div>• Inventory Levels: <span className="font-semibold text-neutral-900">Atomic Outbox</span></div>
                    <div>• Price Matrix: <span className="font-semibold text-neutral-900">Dynamic INR</span></div>
                    <div>• Order Ingestion: <span className="font-semibold text-neutral-900">Instant Webhook</span></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={triggerSyncEverything}
                    className="flex-1 py-2 rounded-xl bg-[#5B4DFB] hover:bg-[#4a3cf0] text-white text-xs font-bold"
                  >
                    Sync Now
                  </button>
                  <button className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-semibold hover:bg-neutral-50">
                    Pause Sync
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Catalog Mapping */}
            {manageTab === "mapping" && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-500">
                  Berry uses an internal canonical product model. Each connected marketplace automatically receives the
                  required taxonomy schema without requiring manual rewrites.
                </p>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
                  <div className="text-xs font-black text-neutral-900 uppercase tracking-wide">
                    Example: Nimbus Runner v2
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-neutral-200">
                      <div className="text-[10px] font-bold text-[#5B4DFB] uppercase">BERRY CANONICAL</div>
                      <div className="font-semibold text-neutral-900 mt-1">Running Shoes</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">Attributes: Lightweight, Dual-mesh, Road</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-neutral-200">
                      <div className="text-[10px] font-bold text-[#FF9900] uppercase">AMAZON SP-API TAXONOMY</div>
                      <div className="font-semibold text-neutral-900 mt-1">Sports &gt; Footwear &gt; Running</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">Feed Type: _POST_PRODUCT_DATA_</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-neutral-200">
                      <div className="text-[10px] font-bold text-[#2874F0] uppercase">FLIPKART ADAPTER</div>
                      <div className="font-semibold text-neutral-900 mt-1">Footwear &gt; Sports Shoes</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">FSN Mapped automatically</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-neutral-200">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">AI AGENT BUS (MCP)</div>
                      <div className="font-semibold text-neutral-900 mt-1">schema.org/Product</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">JSON-LD with realtime quotes</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Centralized Inventory */}
            {manageTab === "inventory" && (
              <div className="space-y-4">
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-950 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    When inventory is modified in Berry, an <code className="font-mono bg-blue-100 px-1 rounded">INVENTORY_UPDATED</code> event
                    fires through Kafka to synchronize Amazon, Flipkart, Myntra, and the Customer storefront in parallel.
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-neutral-900">Nimbus Runner v2 (SKU: RUN-NIM-01)</div>
                      <div className="text-[11px] text-neutral-400">Current Stock in Berry Database: {invStock} units</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStock(Math.max(0, invStock - 1))}
                        disabled={isUpdatingInv}
                        className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-black text-base text-neutral-900">{invStock}</span>
                      <button
                        onClick={() => handleUpdateStock(invStock + 1)}
                        disabled={isUpdatingInv}
                        className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {invBroadcastStatus && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{invBroadcastStatus}</span>
                    </div>
                  )}

                  {/* Channel Sync status matrix */}
                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase">Live Channel Sync Matrix:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2 bg-neutral-50 rounded-lg">
                        <div className="text-[10px] text-neutral-500">Berry Store</div>
                        <div className="text-xs font-bold text-emerald-600">✓ {invStock} units</div>
                      </div>
                      <div className="p-2 bg-neutral-50 rounded-lg">
                        <div className="text-[10px] text-neutral-500">Amazon</div>
                        <div className="text-xs font-bold text-emerald-600">✓ {invStock} units</div>
                      </div>
                      <div className="p-2 bg-neutral-50 rounded-lg">
                        <div className="text-[10px] text-neutral-500">Flipkart</div>
                        <div className="text-xs font-bold text-emerald-600">✓ {invStock} units</div>
                      </div>
                      <div className="p-2 bg-neutral-50 rounded-lg">
                        <div className="text-[10px] text-neutral-500">Myntra</div>
                        <div className="text-xs font-bold text-emerald-600">✓ {invStock} units</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Failures & Recovery */}
            {manageTab === "activity" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">Graceful Failure Handling Demo</h4>
                      <p className="text-xs text-amber-800/90 mt-0.5">
                        If an external marketplace endpoint returns a 503 or transient rate limit, Berry preserves
                        listing integrity, queues the event in the Dead-Letter Queue (DLQ), and alerts you with retry options.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-amber-200/80 text-xs space-y-1">
                    <div className="font-bold text-neutral-900">Amazon Inventory Sync Notice</div>
                    <div className="text-neutral-600">
                      Product: Nimbus Runner • Expected: 18 units • Status: Held safely in Outbox
                    </div>
                    <div className="text-[11px] text-amber-700 font-medium">
                      Reason: Marketplace API temporarily throttling feeds. Berry has NOT corrupted the Amazon listing.
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => alert("Re-publishing event to Amazon connector bus...")}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                    >
                      Retry Sync
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100">
                      View DLQ Telemetry
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Details Inspector Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                  {selectedEvent.id}
                </span>
                <span className="text-xs font-bold text-neutral-900">{selectedEvent.type}</span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 text-neutral-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-neutral-400">Target Product:</span>{" "}
                <span className="font-bold text-neutral-800">{selectedEvent.product}</span>
              </div>
              <div>
                <span className="text-neutral-400">Published To:</span>{" "}
                <span className="font-mono text-neutral-700">Kafka (berry.catalog)</span>
              </div>
              <div>
                <span className="text-neutral-400">Consumers Acknowledged:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedEvent.consumers.map((c: string, idx: number) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium text-[10px]">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-100">
                <span className="text-neutral-400">Log Details:</span>
                <p className="mt-1 text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 font-mono text-[11px]">
                  {selectedEvent.summary}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
