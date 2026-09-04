"use client";

import React, { useState } from "react";

const MERCHANTS = [
  { id: "MCH-001", name: "Runner.co", category: "Footwear & Athletic", products: 18, gmv: "₹1,42,800", commission: "2.5%", webhook: "Healthy (200 OK)", status: "Verified" },
  { id: "MCH-002", name: "Aura Soundworks", category: "Audio & Electronics", products: 24, gmv: "₹3,18,500", commission: "3.0%", webhook: "Healthy (200 OK)", status: "Verified" },
  { id: "MCH-003", name: "Lumina Labs", category: "Smart Wearables", products: 12, gmv: "₹89,400", commission: "2.8%", webhook: "Healthy (200 OK)", status: "Verified" },
  { id: "MCH-004", name: "Nordic Craft", category: "Minimal Apparel", products: 35, gmv: "₹2,04,200", commission: "2.5%", webhook: "Healthy (200 OK)", status: "Verified" },
];

export default function AdminMerchants() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Merchant Network</h1>
          <p className="text-sm text-black/50 mt-1">Connected commerce partners, API webhook health, and settlement agreements.</p>
        </div>
        <button className="px-4 py-2 bg-[#5B4DFB] text-white text-xs font-bold rounded-xl shadow hover:bg-[#4839EB] transition-all">
          + Onboard Merchant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Active Connected Stores</div>
          <div className="text-2xl font-black text-black mt-1">48</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">100% catalog synced</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Cumulative Network GMV</div>
          <div className="text-2xl font-black text-[#5B4DFB] mt-1">₹7,54,900</div>
          <div className="text-[11px] text-black/40 mt-1">Processed via Razorpay</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Avg Platform Take-Rate</div>
          <div className="text-2xl font-black text-black mt-1">2.7%</div>
          <div className="text-[11px] text-black/40 mt-1">Direct settlement model</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Webhook Sync Latency</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">32ms</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Instant catalog pulse</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/[0.05]">
          <h2 className="font-bold text-base text-black">Registered Store Partners</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 text-black/40 font-semibold border-b border-black/[0.05]">
                <th className="py-3.5 px-5">Merchant ID</th>
                <th className="py-3.5 px-5">Store Name</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Catalog Items</th>
                <th className="py-3.5 px-5">Settled GMV</th>
                <th className="py-3.5 px-5">Take-Rate</th>
                <th className="py-3.5 px-5">Webhook Health</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-black/80 font-medium">
              {MERCHANTS.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-black/40">{m.id}</td>
                  <td className="py-3.5 px-5 font-bold text-black">{m.name}</td>
                  <td className="py-3.5 px-5 text-black/60">{m.category}</td>
                  <td className="py-3.5 px-5">{m.products} products</td>
                  <td className="py-3.5 px-5 font-bold text-black">{m.gmv}</td>
                  <td className="py-3.5 px-5">{m.commission}</td>
                  <td className="py-3.5 px-5">
                    <span className="text-emerald-600 font-bold text-[11px]">{m.webhook}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
