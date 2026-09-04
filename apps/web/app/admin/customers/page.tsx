"use client";

import React, { useState } from "react";

const CUSTOMERS = [
  { id: "CUST-001", name: "Aarav Sharma", email: "aarav@berry.ai", spendLimit: 25000, totalSpent: 18420, orders: 4, aiRisk: "Low (12/100)", status: "Active", joined: "Sep 2026" },
  { id: "CUST-002", name: "Riya Mehta", email: "riya@berry.ai", spendLimit: 50000, totalSpent: 31200, orders: 8, aiRisk: "Low (08/100)", status: "Active", joined: "Sep 2026" },
  { id: "CUST-003", name: "Kunal Patel", email: "kunal@berry.ai", spendLimit: 15000, totalSpent: 9999, orders: 2, aiRisk: "Medium (34/100)", status: "Active", joined: "Aug 2026" },
  { id: "CUST-004", name: "Neha Verma", email: "neha@berry.ai", spendLimit: 40000, totalSpent: 26400, orders: 6, aiRisk: "Low (15/100)", status: "Active", joined: "Aug 2026" },
  { id: "CUST-005", name: "Vikram Singh", email: "vikram@berry.ai", spendLimit: 100000, totalSpent: 74200, orders: 14, aiRisk: "Low (05/100)", status: "VIP Active", joined: "Jul 2026" },
];

export default function AdminCustomers() {
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Customer Directory</h1>
          <p className="text-sm text-black/50 mt-1">Autonomous buyer profiles, authorized spending pools, and risk metrics.</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white border border-black/[0.08] rounded-xl text-xs font-medium focus:outline-none focus:border-[#5B4DFB] w-64 shadow-sm"
          />
          <button className="px-4 py-2 bg-[#5B4DFB] text-white text-xs font-bold rounded-xl shadow hover:bg-[#4839EB] transition-all">
            + Provision Account
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Total Registered Buyers</div>
          <div className="text-2xl font-black text-black mt-1">1,428</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">↑ +18.4% this week</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Authorized AI Spending Pool</div>
          <div className="text-2xl font-black text-[#5B4DFB] mt-1">₹4.28 Cr</div>
          <div className="text-[11px] text-black/40 mt-1">Total customer authorizations</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Avg. Customer Spend Limit</div>
          <div className="text-2xl font-black text-black mt-1">₹35,000</div>
          <div className="text-[11px] text-black/40 mt-1">Per transaction rule cap</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/[0.07] shadow-sm">
          <div className="text-xs text-black/40 font-medium">Policy Violation Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">0.02%</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Zero unauthorized leaks</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/[0.05] flex justify-between items-center">
          <h2 className="font-bold text-base text-black">Active Buyer Entities</h2>
          <span className="text-xs text-black/40">{filtered.length} customers found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 text-black/40 font-semibold border-b border-black/[0.05]">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Spend Limit</th>
                <th className="py-3.5 px-5">Total GMV</th>
                <th className="py-3.5 px-5">Orders</th>
                <th className="py-3.5 px-5">Risk Rating</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-black/80 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-black/40">{c.id}</td>
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-black">{c.name}</div>
                    <div className="text-[10px] text-black/40">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-black">₹{c.spendLimit.toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-5 font-bold text-[#5B4DFB]">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-5">{c.orders} txns</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.aiRisk}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button className="px-2.5 py-1 bg-black/[0.05] hover:bg-black hover:text-white rounded-lg text-[11px] font-bold transition-all">
                      Audit
                    </button>
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
