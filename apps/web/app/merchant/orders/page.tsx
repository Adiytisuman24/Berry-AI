"use client";
import React, { useState } from "react";

const ORDERS = [
  { id: "BRY-1042", customer: "Aarav S.", product: "Nimbus Runner", amount: 6459, status: "Success", source: "Berry AI", time: "7 mins ago" },
  { id: "BRY-1041", customer: "Riya M.", product: "FlexFit Hoodie", amount: 3999, status: "Processing", source: "Berry AI", time: "5 mins ago" },
  { id: "BRY-1040", customer: "Kunal P.", product: "Trail Socks (2)", amount: 998, status: "Delivered", source: "Direct", time: "2 hrs ago" },
  { id: "BRY-1039", customer: "Neha K.", product: "RunCap", amount: 1199, status: "Confirmed", source: "Berry AI", time: "3 hrs ago" },
  { id: "BRY-1038", customer: "Aditya R.", product: "Gym Bottle", amount: 799, status: "Cancelled", source: "Website", time: "5 hrs ago" },
  { id: "BRY-1037", customer: "Suman M.", product: "Nimbus Runner + Socks", amount: 6998, status: "Success", source: "Berry AI", time: "Yesterday" },
];

const statusColor = (s: string) => {
  const m: Record<string, string> = { Success: "bg-emerald-100 text-emerald-700", Processing: "bg-blue-100 text-blue-700", Delivered: "bg-gray-100 text-gray-600", Confirmed: "bg-purple-100 text-purple-700", Cancelled: "bg-red-100 text-red-700" };
  return m[s] || "bg-gray-100 text-gray-600";
};

export default function MerchantOrders() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Success", "Processing", "Delivered", "Cancelled"];
  const filtered = filter === "All" ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Orders</h1>
        <p className="text-sm text-black/50">All purchases through your Berry-connected store.</p>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === f ? "bg-black text-white" : "bg-white border border-black/10 text-black/60 hover:text-black"}`}>{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-black/40 uppercase tracking-wider border-b border-black/[0.06]">
              <th className="text-left pb-3">Order</th>
              <th className="text-left pb-3">Customer</th>
              <th className="text-left pb-3">Product</th>
              <th className="text-left pb-3">Amount</th>
              <th className="text-left pb-3">Status</th>
              <th className="text-left pb-3">Source</th>
              <th className="text-left pb-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-[#F7F8FC] transition-all">
                <td className="py-3.5 text-[#5B4DFB] font-bold text-xs">{o.id}</td>
                <td className="py-3.5 text-xs font-semibold">{o.customer}</td>
                <td className="py-3.5 text-xs text-black/70">{o.product}</td>
                <td className="py-3.5 text-xs font-black text-black">₹{o.amount.toLocaleString("en-IN")}</td>
                <td className="py-3.5"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor(o.status)}`}>{o.status}</span></td>
                <td className="py-3.5 text-[11px] text-black/50">{o.source === "Berry AI" ? "✦ Berry AI" : o.source}</td>
                <td className="py-3.5 text-[11px] text-black/40">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
