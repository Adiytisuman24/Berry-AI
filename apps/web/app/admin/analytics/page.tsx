"use client";

import React from "react";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Macro Commerce Analytics</h1>
          <p className="text-sm text-black/50 mt-1">Platform GMV breakdown, agent conversion velocity, and Razorpay success ratios.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm">
          <h3 className="font-bold text-sm text-black mb-4">Checkout Method Share</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Autonomous Berry Agent</span>
                <span className="text-[#5B4DFB]">78.4%</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5B4DFB] rounded-full" style={{ width: "78.4%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Manual Razorpay Checkout</span>
                <span className="text-black/60">21.6%</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-black/40 rounded-full" style={{ width: "21.6%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm">
          <h3 className="font-bold text-sm text-black mb-4">Payment Success Funnel</h3>
          <div className="space-y-3 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-black/50">Agent Purchase Intent</span>
              <span className="font-bold text-black">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Guardrail Authorization</span>
              <span className="font-bold text-black">98.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Razorpay Order Creation</span>
              <span className="font-bold text-black">98.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Payment Capture &amp; Hash Mined</span>
              <span className="font-bold text-emerald-600">97.8%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm">
          <h3 className="font-bold text-sm text-black mb-4">Category GMV Velocity</h3>
          <div className="space-y-3 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-black/60">Audio &amp; Electronics</span>
              <span className="font-bold text-black">₹3,42,000 (42%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Footwear &amp; Apparel</span>
              <span className="font-bold text-black">₹2,89,500 (36%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">Smart Wearables</span>
              <span className="font-bold text-black">₹1,78,400 (22%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
