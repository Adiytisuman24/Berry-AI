"use client";

import React, { useState } from "react";

const EVENTS = [
  { id: "EVT-8921", service: "Go Gateway", event: "ORDER_CREATED", details: "Created order_Q3w8zKj92Pld for ₹14,999", time: "2 mins ago", level: "INFO" },
  { id: "EVT-8920", service: "Razorpay Webhook", event: "PAYMENT_CAPTURED", details: "Signature verified SHA256", time: "2 mins ago", level: "INFO" },
  { id: "EVT-8919", service: "Rust Ledger", event: "BLOCK_MINITED", details: "Block #1042 cryptographic proof written", time: "2 mins ago", level: "INFO" },
  { id: "EVT-8918", service: "Python Agent", event: "INTENT_RESOLVED", details: "Matched query to 'Aether Sound Pro'", time: "3 mins ago", level: "INFO" },
  { id: "EVT-8917", service: "Policy Engine", event: "GUARDRAIL_CHECK", details: "Checked spend ₹14,999 <= ₹25,000 [PASS]", time: "3 mins ago", level: "INFO" },
  { id: "EVT-8916", service: "Merchant Webhook", event: "STOCK_DECREMENT", details: "Product p1 stock decremented to 11", time: "3 mins ago", level: "INFO" },
];

export default function AdminEvents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">System Event Stream &amp; Audit Logs</h1>
          <p className="text-sm text-black/50 mt-1">Immutable time-series log of all microservice actions and agent decisions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/[0.05] flex justify-between items-center">
          <h2 className="font-bold text-base text-black">Live Event Feed</h2>
          <span className="text-xs text-black/40">Filtered: All Services</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 text-black/40 font-semibold border-b border-black/[0.05]">
                <th className="py-3.5 px-5">Event ID</th>
                <th className="py-3.5 px-5">Source Microservice</th>
                <th className="py-3.5 px-5">Action Type</th>
                <th className="py-3.5 px-5">Payload Summary</th>
                <th className="py-3.5 px-5">Level</th>
                <th className="py-3.5 px-5">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-black/80 font-medium">
              {EVENTS.map((e) => (
                <tr key={e.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-black/40">{e.id}</td>
                  <td className="py-3.5 px-5 font-bold text-black">{e.service}</td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-[#5B4DFB]">{e.event}</td>
                  <td className="py-3.5 px-5 text-black/70">{e.details}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {e.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-black/40">{e.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
