"use client";

import React from "react";

const AGENTS = [
  { id: "AGT-001", name: "Shopper Core (GPT-4o-mini)", activeSessions: 14, tokensUsed: "142k", avgLatency: "640ms", spendAuthorized: "₹2.4L", status: "Running" },
  { id: "AGT-002", name: "Price Negotiator & Coupon Agent", activeSessions: 8, tokensUsed: "88k", avgLatency: "420ms", spendAuthorized: "₹85k", status: "Running" },
  { id: "AGT-003", name: "Merchant Catalog Sync Agent", activeSessions: 4, tokensUsed: "32k", avgLatency: "210ms", spendAuthorized: "₹0", status: "Idle" },
  { id: "AGT-004", name: "Settlement & Audit Validator", activeSessions: 22, tokensUsed: "190k", avgLatency: "180ms", spendAuthorized: "₹5.1L", status: "Running" },
];

export default function AdminAgents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Autonomous Agent Fleet</h1>
          <p className="text-sm text-black/50 mt-1">LLM inference parameters, token economics, session telemetry, and execution limits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Active Agent Threads</div>
          <div className="text-2xl font-black text-black mt-1">48 concurrent</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">OpenAI API connected</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Avg Agent Decision Latency</div>
          <div className="text-2xl font-black text-[#5B4DFB] mt-1">420ms</div>
          <div className="text-[11px] text-black/40 mt-1">Fast streaming response</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Autonomous Execution Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">94.2%</div>
          <div className="text-[11px] text-black/40 mt-1">Within strict spending guardrails</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Policy Breach Attempts</div>
          <div className="text-2xl font-black text-black mt-1">0</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Deterministic Rust guards</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/[0.05]">
          <h2 className="font-bold text-base text-black">Active Agent Micro-Services</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 text-black/40 font-semibold border-b border-black/[0.05]">
                <th className="py-3.5 px-5">Agent ID</th>
                <th className="py-3.5 px-5">Name &amp; Model</th>
                <th className="py-3.5 px-5">Active Sessions</th>
                <th className="py-3.5 px-5">Token Usage</th>
                <th className="py-3.5 px-5">Avg Latency</th>
                <th className="py-3.5 px-5">Spend Dispatched</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-black/80 font-medium">
              {AGENTS.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-black/40">{a.id}</td>
                  <td className="py-3.5 px-5 font-bold text-black">{a.name}</td>
                  <td className="py-3.5 px-5">{a.activeSessions} sessions</td>
                  <td className="py-3.5 px-5 font-mono">{a.tokensUsed}</td>
                  <td className="py-3.5 px-5 font-bold text-[#5B4DFB]">{a.avgLatency}</td>
                  <td className="py-3.5 px-5 font-bold text-black">{a.spendAuthorized}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {a.status}
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
