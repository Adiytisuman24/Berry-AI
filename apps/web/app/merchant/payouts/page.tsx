"use client";
import React from "react";

export default function MerchantPayouts() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Payouts</h1>
          <p className="text-sm text-black/50">Razorpay settlement information for your store.</p>
        </div>
        <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full">Demo / Test Mode</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Collected", value: "₹4,82,320", sub: "284 successful payments" },
          { label: "Pending Settlement", value: "₹12,499", sub: "3 orders processing" },
          { label: "Refunded", value: "₹3,599", sub: "2 refunds issued" },
          { label: "Available Balance", value: "₹4,66,222", sub: "Next settlement: 2 days" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-xs">
            <div className="text-xs text-black/50 mb-1">{s.label}</div>
            <div className="text-xl font-extrabold text-black">{s.value}</div>
            <div className="text-[11px] text-black/40 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">💳</div>
          <div>
            <div className="font-bold text-sm">Razorpay Gateway</div>
            <div className="text-xs text-black/50">Test environment — live production keys not enabled</div>
          </div>
          <span className="ml-auto text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
        </div>
        <p className="text-xs text-black/50 leading-relaxed">
          Actual payout infrastructure is managed by Razorpay. This sandbox demonstrates payment settlement flows. Enable production mode with live credentials to receive actual funds.
        </p>
      </div>
    </div>
  );
}
