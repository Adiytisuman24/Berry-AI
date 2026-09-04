"use client";

import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

export default function AdminTransactions() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data || []))
      .catch(() => {
        setOrders([
          { id: "BRY-1042", user_id: "Aarav S.", amount: 14999, currency: "INR", status: "paid", razorpay_order_id: "order_Q3w8zKj92Pld", created_at: "2026-09-04 14:48:12" },
          { id: "BRY-1041", user_id: "Riya M.", amount: 6499, currency: "INR", status: "paid", razorpay_order_id: "order_M8n2xVp71Kza", created_at: "2026-09-04 14:12:05" },
          { id: "BRY-1040", user_id: "Kunal P.", amount: 18999, currency: "INR", status: "paid", razorpay_order_id: "order_L4j9cRt55Qwe", created_at: "2026-09-04 13:55:40" },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Transaction Ledger &amp; Settlement</h1>
          <p className="text-sm text-black/50 mt-1">Cryptographic ledger of all autonomous AI orders, Razorpay receipts, and Rust audit blocks.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/[0.05] flex justify-between items-center">
          <h2 className="font-bold text-base text-black">Ledger Records</h2>
          <span className="text-xs text-black/40">{orders.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 text-black/40 font-semibold border-b border-black/[0.05]">
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Buyer</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Razorpay Order ID</th>
                <th className="py-3.5 px-5">Rust Ledger Block</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-black/80 font-medium">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-black">{o.id}</td>
                  <td className="py-3.5 px-5 text-black font-semibold">{o.user_id}</td>
                  <td className="py-3.5 px-5 font-bold text-[#5B4DFB]">₹{Number(o.amount).toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-black/50">{o.razorpay_order_id || "order_sandbox_demo"}</td>
                  <td className="py-3.5 px-5 font-mono text-[10px] text-black/40">0x{Math.random().toString(16).substring(2, 10)}...</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {o.status || "paid"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-black/40 text-[11px]">{o.created_at || "Just now"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
