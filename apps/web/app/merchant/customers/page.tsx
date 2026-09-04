"use client";
import React from "react";

const CUSTOMERS = [
  { name: "Aarav S.", orders: 4, gmv: 18420, last: "Today", sessions: 12 },
  { name: "Riya M.", orders: 8, gmv: 31200, last: "Today", sessions: 22 },
  { name: "Kunal P.", orders: 2, gmv: 4299, last: "Yesterday", sessions: 5 },
  { name: "Neha K.", orders: 6, gmv: 21890, last: "2 days ago", sessions: 18 },
  { name: "Aditya R.", orders: 3, gmv: 8540, last: "1 week ago", sessions: 8 },
];

export default function MerchantCustomers() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Customers</h1>
        <p className="text-sm text-black/50">Buyers who interacted with your store via Berry. Commerce data only — no private financial details.</p>
      </div>
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-black/40 uppercase tracking-wider border-b border-black/[0.06]">
              <th className="text-left pb-3">Customer</th>
              <th className="text-left pb-3">Orders</th>
              <th className="text-left pb-3">Total GMV</th>
              <th className="text-left pb-3">Berry Sessions</th>
              <th className="text-left pb-3">Last Purchase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {CUSTOMERS.map((c, i) => (
              <tr key={i} className="hover:bg-[#F7F8FC] transition-all">
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-indigo-300 text-[11px] font-black text-black/70 flex items-center justify-center">
                      {c.name[0]}
                    </div>
                    <span className="font-bold text-sm">{c.name}</span>
                  </div>
                </td>
                <td className="py-3.5 text-sm font-bold">{c.orders}</td>
                <td className="py-3.5 text-sm font-black text-black">₹{c.gmv.toLocaleString("en-IN")}</td>
                <td className="py-3.5 text-xs text-[#5B4DFB] font-bold">{c.sessions} sessions</td>
                <td className="py-3.5 text-xs text-black/50">{c.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
