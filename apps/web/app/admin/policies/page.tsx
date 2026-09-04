"use client";

import React, { useState } from "react";

export default function AdminPolicies() {
  const [maxPerTxn, setMaxPerTxn] = useState(25000);
  const [maxDaily, setMaxDaily] = useState(75000);
  const [require2FAAbove, setRequire2FAAbove] = useState(15000);
  const [autoApproveMerchant, setAutoApproveMerchant] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-black">Autonomous Spending Policies &amp; Guardrails</h1>
        <p className="text-sm text-black/50 mt-1">Deterministic execution rules enforced cryptographically by the Rust engine and Go Gateway.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm space-y-6">
        <h2 className="font-bold text-base text-black">Global Spending Guardrails</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-black mb-1">Max Per-Transaction Limit (INR)</label>
            <input
              type="number"
              value={maxPerTxn}
              onChange={(e) => setMaxPerTxn(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-black/[0.08] rounded-xl text-sm font-bold focus:outline-none focus:border-[#5B4DFB]"
            />
            <p className="text-[11px] text-black/40 mt-1">Autonomous checkout automatically blocks orders above this threshold.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Max Daily Customer Spending Cap (INR)</label>
            <input
              type="number"
              value={maxDaily}
              onChange={(e) => setMaxDaily(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-black/[0.08] rounded-xl text-sm font-bold focus:outline-none focus:border-[#5B4DFB]"
            />
            <p className="text-[11px] text-black/40 mt-1">Aggregate 24-hour limit across all AI shopping agents.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Mandatory User Confirmation (2FA) Threshold (INR)</label>
            <input
              type="number"
              value={require2FAAbove}
              onChange={(e) => setRequire2FAAbove(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-black/[0.08] rounded-xl text-sm font-bold focus:outline-none focus:border-[#5B4DFB]"
            />
            <p className="text-[11px] text-black/40 mt-1">Requires explicit biometric or OTP confirmation above this amount.</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-black/[0.05]">
            <div>
              <div className="text-xs font-bold text-black">Auto-Approve Verified Merchants</div>
              <div className="text-[11px] text-black/40">Allow agents to discover catalog directly</div>
            </div>
            <input
              type="checkbox"
              checked={autoApproveMerchant}
              onChange={(e) => setAutoApproveMerchant(e.target.checked)}
              className="w-4 h-4 accent-[#5B4DFB]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-black/[0.05] flex justify-end">
          <button className="px-6 py-2.5 bg-[#5B4DFB] text-white rounded-xl text-xs font-bold hover:bg-[#4839EB] transition-all shadow-md">
            Save &amp; Propagate to Rust Engine
          </button>
        </div>
      </div>
    </div>
  );
}
