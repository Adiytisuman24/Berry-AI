"use client";
import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, RefreshCw } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function MerchantSettings() {
  const [store, setStore] = useState({
    name: "",
    category: "",
    storeId: "",
    webhookUrl: "",
    razorpayKeyId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [permissions, setPermissions] = useState([
    { label: "Discover products", desc: "Allow Berry to index your catalog for customer search", active: true },
    { label: "Recommend products", desc: "Compute match scores and show to customers", active: true },
    { label: "Suggest cross-sells", desc: "Bundle socks and accessories with main products", active: true },
    { label: "Create customer carts", desc: "Add approved products to cart on customer behalf", active: true },
    { label: "Apply approved discounts", desc: "Apply pre-configured promotional pricing", active: true },
    { label: "Modify base prices", desc: "Allow Berry to change your product base prices", active: false, locked: true },
    { label: "Execute customer payment", desc: "Trigger Razorpay payment on merchant behalf", active: false, locked: true },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/merchant/settings`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setStore({
            name: data.name || data.store_name || "",
            category: data.category || "",
            storeId: data.store_id || data.id || "",
            webhookUrl: data.webhook_url || "",
            razorpayKeyId: data.razorpay_key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          });
        } else {
          // Fallback defaults for demo
          setStore({
            name: "My Berry Store",
            category: "Footwear & Sports",
            storeId: `MERCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            webhookUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/razorpay`,
            razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          });
        }
      })
      .catch(() => {
        setStore({
          name: "My Berry Store",
          category: "Footwear & Sports",
          storeId: `MERCH-DEMO-001`,
          webhookUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/razorpay`,
          razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/v1/merchant/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: store.name,
          category: store.category,
          webhook_url: store.webhookUrl,
        }),
      });
    } catch (_) {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-[#5B4DFB]" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Store Settings</h1>
        <p className="text-sm text-black/50">Configure store details and Berry Agent permissions.</p>
      </div>

      {/* Store Info Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-xs space-y-5">
        <h2 className="font-bold text-base">Store Information</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: "Store Name", key: "name", placeholder: "Your store name" },
            { label: "Category", key: "category", placeholder: "e.g. Footwear & Sports" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <label className="text-xs font-bold text-black/50 w-28 flex-shrink-0">{f.label}</label>
              <input
                value={(store as any)[f.key]}
                onChange={(e) => setStore((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-black/50 w-28 flex-shrink-0">Store ID</label>
            <input
              readOnly
              value={store.storeId}
              className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 text-sm bg-neutral-50 text-black/40 font-mono cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-black/50 w-28 flex-shrink-0">Webhook URL</label>
            <input
              value={store.webhookUrl}
              onChange={(e) => setStore((prev) => ({ ...prev, webhookUrl: e.target.value }))}
              placeholder="https://your-domain/api/webhooks/razorpay"
              className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB] font-mono text-xs"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-black/50 w-28 flex-shrink-0">Razorpay Key</label>
            <input
              readOnly
              value={store.razorpayKeyId ? `${store.razorpayKeyId.substring(0, 16)}...` : "Not configured"}
              className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 text-sm bg-neutral-50 text-black/40 font-mono cursor-not-allowed"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B4DFB] text-white text-sm font-bold hover:bg-[#4335E0] transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          {saved && (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </div>
          )}
        </div>
      </form>

      {/* Berry Agent Permissions */}
      <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-xs">
        <h2 className="font-bold text-base mb-4 flex items-center gap-2">🛡️ Berry Agent Permissions</h2>
        <div className="space-y-3">
          {permissions.map((p, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                p.active ? "bg-[#FAFAF8] border-black/[0.04]" : "bg-red-50/40 border-red-200"
              }`}
            >
              <div>
                <div className="text-sm font-bold text-black flex items-center gap-2">
                  {p.label}
                  {(p as any).locked && (
                    <span className="text-[9px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded font-black">
                      LOCKED OFF
                    </span>
                  )}
                </div>
                <div className="text-xs text-black/50 mt-0.5">{p.desc}</div>
              </div>
              {!(p as any).locked ? (
                <button
                  onClick={() =>
                    setPermissions((prev) =>
                      prev.map((item, idx) => (idx === i ? { ...item, active: !item.active } : item))
                    )
                  }
                  className={`w-10 h-5 rounded-full transition-all relative ${
                    p.active ? "bg-emerald-500" : "bg-black/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      p.active ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              ) : (
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    p.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {p.active ? "✓" : "✕"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
