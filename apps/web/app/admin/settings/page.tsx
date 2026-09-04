"use client";

import React, { useState } from "react";

export default function AdminSettings() {
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_test_TXtd2CNmv3wGJZ");
  const [razorpaySecret, setRazorpaySecret] = useState("••••••••••••••••••••••••");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-black">Admin Global Settings</h1>
        <p className="text-sm text-black/50 mt-1">API keys, gateway endpoints, environment overrides, and sandbox security credentials.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm space-y-5">
        <h2 className="font-bold text-base text-black">Payment Gateway Credentials (Razorpay)</h2>
        
        <div>
          <label className="block text-xs font-bold text-black mb-1">Razorpay Key ID (Test)</label>
          <input
            type="text"
            value={razorpayKeyId}
            onChange={(e) => setRazorpayKeyId(e.target.value)}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-black/[0.08] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#5B4DFB]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-black mb-1">Razorpay Key Secret (Test)</label>
          <input
            type="password"
            value={razorpaySecret}
            onChange={(e) => setRazorpaySecret(e.target.value)}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-black/[0.08] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#5B4DFB]"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-black/40">Status: Active &amp; Verified with Razorpay Sandbox</span>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#5B4DFB] text-white rounded-xl text-xs font-bold hover:bg-[#4839EB] transition-all shadow-md"
          >
            {saved ? "✓ Settings Saved" : "Save Gateway Keys"}
          </button>
        </div>
      </div>
    </div>
  );
}
