"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const RECENT_TXN = [
  { id: "BRY-1042", customer: "Aarav S.", merchant: "Berry Store", amount: 6998, status: "Success", time: "2 mins ago" },
  { id: "BRY-1041", customer: "Riya M.", merchant: "UrbanFit", amount: 3499, status: "Success", time: "5 mins ago" },
  { id: "BRY-1040", customer: "Kunal P.", merchant: "TechStore", amount: 24999, status: "Success", time: "12 mins ago" },
  { id: "BRY-1039", customer: "Neha K.", merchant: "SneakerHub", amount: 5499, status: "Failed", time: "18 mins ago" },
  { id: "BRY-1038", customer: "Aditya R.", merchant: "HomeKart", amount: 2999, status: "Success", time: "24 mins ago" },
];

const MERCHANT_NETWORK = [
  { name: "Berry Store", initial: "B", category: "Footwear & Sports", status: "Online", products: 124 },
  { name: "UrbanFit", initial: "U", category: "Fashion & Lifestyle", status: "Online", products: 86 },
  { name: "TechStore", initial: "T", category: "Electronics", status: "Online", products: 54 },
  { name: "HomeKart", initial: "H", category: "Home & Living", status: "Online", products: 38 },
  { name: "Glow&Co", initial: "G", category: "Beauty & Personal Care", status: "Setup", products: 12 },
];

const topCategories = [
  { name: "Footwear", pct: 32, color: "#5B4DFB" },
  { name: "Electronics", pct: 18, color: "#818CF8" },
  { name: "Fashion", pct: 16, color: "#A5B4FC" },
  { name: "Home & Living", pct: 12, color: "#C7D2FE" },
  { name: "Sports", pct: 10, color: "#E0E7FF" },
  { name: "Beauty", pct: 8, color: "#EDE9FE" },
  { name: "Others", pct: 4, color: "#F5F3FF" },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [chartRange, setChartRange] = useState("30D");

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/admin/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(setStats)
      .catch(() => {});
    const interval = setInterval(() => {
      fetch(`${API_BASE}/api/v1/admin/stats`).then(r => r.ok ? r.json() : null).then(d => d && setStats(d)).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const gmv = stats?.network?.total_gmv || stats?.total_gmv_inr || 1842990;
  const txns = stats?.network?.ai_transactions || 1284;
  const customers = stats?.network?.total_customers || 892;
  const merchants = stats?.network?.total_merchants || 42;

  return (
    <div className="space-y-5">
      {/* Hero Banner — matches reference */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white relative p-8 min-h-[200px] flex items-center justify-between">
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full inline-block mb-4">
            BERRY CONTROL CENTER
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            A more <span className="text-[#818CF8] italic font-black">open</span><br />
            commerce future.
          </h1>
          <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-xs">
            Real people. Real merchants. Real opportunities.<br />Powered by intelligent agents.
          </p>
        </div>

        {/* Decorative image area */}
        <div className="absolute right-0 top-0 bottom-0 w-64 overflow-hidden opacity-30">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-800" />
          <div className="text-[160px] absolute right-0 top-0 bottom-0 flex items-center select-none opacity-50">🏔️</div>
        </div>

        {/* Handwriting decoration */}
        <div className="absolute top-6 right-72 text-white/25 text-sm font-caveat rotate-6 hidden lg:block">
          More commerce.<br />More people.<br />A brighter tomorrow.
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total GMV", value: `₹${(gmv / 100000).toFixed(2)}L`, delta: "↑ 28%", icon: "₹", color: "text-[#5B4DFB]" },
          { label: "Transactions", value: txns.toLocaleString(), delta: "↑ 32%", icon: "🔄", color: "text-[#5B4DFB]" },
          { label: "Active Customers", value: customers.toLocaleString(), delta: "↑ 18%", icon: "👤", color: "text-[#5B4DFB]" },
          { label: "Active Merchants", value: merchants.toString(), delta: "↑ 27%", icon: "🏪", color: "text-[#5B4DFB]" },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/50">{k.label}</span>
              <span className="text-base">{k.icon}</span>
            </div>
            <div className="text-2xl font-extrabold text-black">{k.value}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-emerald-600 font-bold">{k.delta}</span>
              <div className="flex items-end gap-0.5 h-4 ml-auto">
                {[3, 5, 4, 7, 6, 8, 7, 9, 8, 10].map((h, j) => (
                  <div key={j} className="w-1 rounded-sm bg-[#5B4DFB]" style={{ height: `${h * 2}px`, opacity: 0.3 + (j / 10) * 0.7 }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: GMV Chart + Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* GMV Chart */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-base">GMV &amp; Transactions</h2>
            <div className="flex gap-1.5">
              {["7D", "30D", "3M", "1Y"].map((r) => (
                <button key={r} onClick={() => setChartRange(r)} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${chartRange === r ? "bg-[#5B4DFB] text-white" : "bg-[#F7F8FC] text-black/50 hover:text-black"}`}>{r}</button>
              ))}
            </div>
          </div>

          {/* Chart callout */}
          <div className="mt-4 flex items-start gap-4">
            <div>
              <div className="text-xs text-black/40 mb-0.5">Aug 14</div>
              <div className="font-bold text-black">₹ 1,24,320</div>
              <div className="text-xs text-black/40">42 transactions</div>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#5B4DFB]"></span>GMV (₹)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#C7D2FE]"></span>Transactions</span>
            </div>
          </div>

          {/* Simplified dual bar chart */}
          <div className="mt-6 flex items-end gap-1.5 h-32">
            {[
              [40, 28], [55, 35], [48, 30], [70, 42], [65, 38], [85, 52], [75, 48],
              [95, 58], [88, 55], [110, 68], [105, 62], [130, 80], [120, 75], [142, 88],
            ].map(([gmvH, txH], i) => (
              <div key={i} className="flex-1 flex items-end gap-0.5">
                <div className="flex-1 bg-[#5B4DFB] rounded-t-sm" style={{ height: `${(gmvH / 142) * 100}%`, opacity: 0.6 + (i / 14) * 0.4 }} />
                <div className="flex-1 bg-[#C7D2FE] rounded-t-sm" style={{ height: `${(txH / 88) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-black/30 mt-2">
            <span>Jul 25</span>
            <span>Jul 29</span>
            <span>Aug 06</span>
            <span>Aug 14</span>
            <span>Aug 22</span>
          </div>
        </div>

        {/* Top Categories Donut */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
          <h2 className="font-bold text-base mb-4">Top Categories by GMV</h2>
          {/* Donut placeholder */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {topCategories.reduce((acc, cat, i) => {
                  const offset = acc.offset;
                  const dash = (cat.pct / 100) * 301;
                  const gap = 301 - dash;
                  acc.elements.push(
                    <circle key={i} cx="60" cy="60" r="48" fill="none" stroke={cat.color} strokeWidth="20"
                      strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} />
                  );
                  acc.offset += dash;
                  return acc;
                }, { offset: 0, elements: [] as React.ReactNode[] }).elements}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-extrabold text-base text-black">₹18.4L</div>
                <div className="text-[10px] text-black/40">Total GMV</div>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            {topCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="flex-1 text-black/70">{cat.name}</span>
                <span className="font-bold text-black">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Transactions + Merchant Network */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base">Recent Transactions</h2>
            <Link href="/admin/transactions" className="text-xs font-bold text-[#5B4DFB]">View All →</Link>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[11px] text-black/40 uppercase border-b border-black/[0.06]">
                <th className="text-left pb-2">ID</th>
                <th className="text-left pb-2">Customer</th>
                <th className="text-left pb-2">Merchant</th>
                <th className="text-left pb-2">Amount</th>
                <th className="text-left pb-2">Status</th>
                <th className="text-left pb-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {RECENT_TXN.map((t) => (
                <tr key={t.id} className="hover:bg-[#F7F8FC]">
                  <td className="py-2.5 text-[#5B4DFB] font-bold">{t.id}</td>
                  <td className="py-2.5 font-medium text-black/80">{t.customer}</td>
                  <td className="py-2.5 text-black/60">{t.merchant}</td>
                  <td className="py-2.5 font-black text-black">₹{t.amount.toLocaleString("en-IN")}</td>
                  <td className="py-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === "Success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {t.status === "Success" ? "✓ " : "✕ "}{t.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-black/40">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Merchant Network */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base">Merchant Network</h2>
            <Link href="/admin/merchants" className="text-xs font-bold text-[#5B4DFB]">View All →</Link>
          </div>
          <div className="space-y-3">
            {MERCHANT_NETWORK.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F7F8FC] border border-black/[0.06] flex items-center justify-center font-black text-sm text-black/60">
                  {m.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-black truncate">{m.name}</div>
                  <div className="text-[11px] text-black/40 truncate">{m.category}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <span className={`w-1.5 h-1.5 rounded-full ${m.status === "Online" ? "bg-emerald-500" : "bg-amber-400"}`} />
                    <span className="text-[10px] font-bold text-black/60">{m.status}</span>
                  </div>
                  <div className="text-[10px] text-black/40">{m.products} products</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
