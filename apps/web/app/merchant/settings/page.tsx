"use client";
import React from "react";

export default function MerchantSettings() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Store Settings</h1>
        <p className="text-sm text-black/50">Configure store details and Berry Agent permissions.</p>
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-xs space-y-4">
        <h2 className="font-bold text-base">Store Information</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: "Store Name", value: "Runner.co" },
            { label: "Category", value: "Footwear & Sports" },
            { label: "Store ID", value: "MERCH-RUNNER-901" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <label className="text-xs font-bold text-black/50 w-28">{f.label}</label>
              <input defaultValue={f.value} className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]" />
            </div>
          ))}
        </div>
      </div>

      {/* Berry Agent Permissions */}
      <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-xs">
        <h2 className="font-bold text-base mb-4 flex items-center gap-2">🛡️ Berry Agent Permissions</h2>
        <div className="space-y-3">
          {[
            { label: "Discover products", desc: "Allow Berry to index your catalog for customer search", active: true },
            { label: "Recommend products", desc: "Compute match scores and show to customers", active: true },
            { label: "Suggest cross-sells", desc: "Bundle socks and accessories with main products", active: true },
            { label: "Create customer carts", desc: "Add approved products to cart on customer behalf", active: true },
            { label: "Apply approved discounts", desc: "Apply pre-configured promotional pricing", active: true },
            { label: "Modify base prices", desc: "Allow Berry to change your product base prices", active: false, locked: true },
            { label: "Execute customer payment", desc: "Trigger Razorpay payment on merchant behalf", active: false, locked: true },
          ].map((p, i) => (
            <div key={i} className={`flex items-center justify-between p-3.5 rounded-2xl border ${p.active ? "bg-[#FAFAF8] border-black/[0.04]" : "bg-red-50/40 border-red-200"}`}>
              <div>
                <div className="text-sm font-bold text-black flex items-center gap-2">
                  {p.label}
                  {p.locked && <span className="text-[9px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded font-black">LOCKED OFF</span>}
                </div>
                <div className="text-xs text-black/50 mt-0.5">{p.desc}</div>
              </div>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                {p.active ? "✓" : "✕"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
