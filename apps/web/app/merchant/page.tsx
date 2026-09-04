"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = "http://localhost:8080";

interface MetricCard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: string;
}

const recentOrders = [
  { id: "BRY-1042", customer: "Aarav S.", initials: "A", product: "Nimbus Runner (1)", amount: "₹ 6,459", status: "Payment Successful", source: "Berry AI", time: "7 mins ago", statusColor: "emerald" },
  { id: "BRY-1041", customer: "Riya M.", initials: "R", product: "FlexFit Hoodie (1)", amount: "₹ 3,999", status: "Processing", source: "Berry AI", time: "5 mins ago", statusColor: "blue" },
  { id: "BRY-1040", customer: "Kunal P.", initials: "K", product: "Trail Socks (2)", amount: "₹ 998", status: "Delivered", source: "Direct", time: "2 hours ago", statusColor: "gray" },
  { id: "BRY-1039", customer: "Neha K.", initials: "N", product: "RunCap (1)", amount: "₹ 1,199", status: "Confirmed", source: "Berry AI", time: "3 hours ago", statusColor: "purple" },
  { id: "BRY-1038", customer: "Aditya R.", initials: "A", product: "Gym Bottle (1)", amount: "₹ 799", status: "Cancelled", source: "Website", time: "5 hours ago", statusColor: "red" },
];

const topProducts = [
  { rank: 1, name: "Nimbus Runner", orders: 142, price: "₹ 6,499", img: "👟" },
  { rank: 2, name: "FlexFit Hoodie", orders: 98, price: "₹ 3,999", img: "👕" },
  { rank: 3, name: "Trail Socks", orders: 76, price: "₹ 499", img: "🧦" },
];

const customerLocations = [
  { state: "Maharashtra", pct: 28 },
  { state: "Delhi", pct: 18 },
  { state: "Karnataka", pct: 12 },
  { state: "Tamil Nadu", pct: 10 },
  { state: "Uttar Pradesh", pct: 8 },
];

export default function MerchantDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { label: "Total Revenue", value: "₹ 4,82,320", delta: "↑ 18%", positive: true, icon: "₹" },
    { label: "AI Driven Orders", value: "284", delta: "↑ 34%", positive: true, icon: "🤖" },
    { label: "Avg. Order Value", value: "₹ 2,890", delta: "↑ 12%", positive: true, icon: "📈" },
    { label: "Conversion Rate", value: "4.8%", delta: "↑ 0.9%", positive: true, icon: "🎯" },
  ]);
  const [liveOrders, setLiveOrders] = useState(recentOrders);
  const [newOrderBadge, setNewOrderBadge] = useState(false);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/merchant/metrics`);
        if (res.ok) {
          // In the real system, this updates from Go API dynamically
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate receiving a new order every 45 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      setNewOrderBadge(true);
      setTimeout(() => setNewOrderBadge(false), 8000);
    }, 45000);
    return () => clearTimeout(t);
  }, []);

  const statusStyle = (color: string) => {
    const map: Record<string, string> = {
      emerald: "bg-emerald-100 text-emerald-700",
      blue: "bg-blue-100 text-blue-700",
      gray: "bg-gray-100 text-gray-600",
      purple: "bg-purple-100 text-purple-700",
      red: "bg-red-100 text-red-700",
    };
    return map[color] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-5">
      {/* Hero Banner — matches reference */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#F0F0FF] to-white border border-black/[0.06] relative p-8 flex items-center justify-between min-h-[200px]">
        <div className="z-10">
          <p className="text-sm text-black/50 font-medium mb-1">Welcome back, Karan! 👋</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-black leading-tight max-w-sm">
            Your products.<br />
            <span className="text-[#5B4DFB]">Now with an AI</span><br />
            sales force.
          </h1>
          <p className="text-sm text-black/60 mt-3 max-w-xs leading-relaxed">
            Berry helps customers discover, choose and buy your products — through conversation, across every channel.
          </p>
          <div className="flex gap-3 mt-5">
            <Link
              href="/merchant/add-product"
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-black/80 transition-all shadow-sm"
            >
              <span>＋</span> Add Product
            </Link>
            <Link
              href="/customers/home"
              className="flex items-center gap-2 bg-white border border-black/10 text-black px-5 py-2.5 rounded-2xl text-sm font-bold hover:border-black/20 transition-all"
            >
              See Live on Customer App ↗
            </Link>
          </div>
        </div>

        {/* Shoe image placeholder */}
        <div className="absolute right-8 top-0 bottom-0 flex items-center opacity-90">
          <div className="text-[120px] select-none" style={{ transform: "rotate(-12deg)" }}>👟</div>
        </div>

        {/* Decorative handwriting */}
        <div className="absolute top-6 right-44 font-caveat text-lg text-black/30 rotate-12 hidden lg:block">
          More eyes.<br />More orders.<br />Less effort.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/50 font-medium">{m.label}</span>
              <button className="text-black/20 hover:text-black/50 text-xs">▾</button>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-black">{m.value}</div>
            <div className={`flex items-center gap-1.5 mt-2`}>
              <span className={`text-xs font-bold ${m.positive ? "text-emerald-600" : "text-red-500"}`}>
                {m.delta}
              </span>
              {/* Mini sparkline bars */}
              <div className="flex items-end gap-0.5 h-4 ml-auto">
                {[3, 5, 4, 7, 6, 8, 7, 9].map((h, j) => (
                  <div
                    key={j}
                    className={`w-1 rounded-sm ${m.positive ? "bg-emerald-400" : "bg-red-300"}`}
                    style={{ height: `${h * 2}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-lg tracking-tight">Recent Orders</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-black/50">Live updates from Berry</span>
              {newOrderBadge && (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full animate-bounce">
                  New order!
                </span>
              )}
            </div>
          </div>
          <Link href="/merchant/orders" className="text-xs font-bold text-[#5B4DFB] hover:underline flex items-center gap-1">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-black/40 uppercase tracking-wider border-b border-black/[0.06]">
                <th className="text-left pb-3">Order ID</th>
                <th className="text-left pb-3">Customer</th>
                <th className="text-left pb-3">Products</th>
                <th className="text-left pb-3">Amount</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Source</th>
                <th className="text-left pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {liveOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F8FC] transition-all">
                  <td className="py-3.5 text-[#5B4DFB] font-bold text-xs">{order.id}</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-200 to-indigo-300 flex items-center justify-center text-[10px] font-black text-black/70">
                        {order.initials}
                      </div>
                      <span className="text-xs font-semibold">{order.customer}</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">👟</span>
                      <span className="text-xs text-black/70">{order.product}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-xs font-bold text-black">{order.amount}</td>
                  <td className="py-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle(order.statusColor)}`}>
                      {order.status === "Payment Successful" ? "✓ " : ""}{order.status}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.source === "Berry AI" ? "text-[#5B4DFB]" : "text-black/50"}`}>
                      {order.source === "Berry AI" ? "✦ " : ""}{order.source}
                    </span>
                  </td>
                  <td className="py-3.5 text-[11px] text-black/40">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Top Products + Sales Overview + Customer Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Products */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base tracking-tight">Top Products</h2>
            <span className="text-xs text-black/40">This month ▾</span>
          </div>
          <div className="space-y-4">
            {topProducts.map((p) => (
              <div key={p.rank} className="flex items-center gap-3">
                <span className="text-sm font-black text-black/30 w-4">{p.rank}</span>
                <div className="w-10 h-10 rounded-xl bg-[#F7F8FC] border border-black/[0.06] flex items-center justify-center text-xl">
                  {p.img}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-black">{p.name}</div>
                  <div className="text-xs text-black/40">{p.orders} orders</div>
                </div>
                <div className="text-sm font-black text-black">{p.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Overview Chart */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-base tracking-tight">Sales Overview</h2>
            <span className="text-xs text-black/40">Last 30 days ▾</span>
          </div>
          <div className="text-2xl font-extrabold text-black mt-3">₹ 4,82,320</div>
          <p className="text-xs text-emerald-600 font-bold">↑ 18% from previous period</p>

          {/* Simplified chart bars */}
          <div className="mt-6 flex items-end gap-1.5 h-24">
            {[28, 42, 35, 65, 80, 55, 70, 90, 72, 110, 85, 128, 100, 142].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-[#5B4DFB]"
                  style={{ height: `${(h / 142) * 100}%`, opacity: i === 13 ? 1 : 0.35 + (i / 13) * 0.5 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-black/30 mt-2">
            <span>Jul 25</span>
            <span>Aug 1</span>
            <span>Aug 8</span>
            <span>Aug 15</span>
            <span>Aug 22</span>
          </div>
        </div>

        {/* Customer Locations */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base tracking-tight">Customer Locations</h2>
            <span className="text-xs text-black/40">All Orders ▾</span>
          </div>
          {/* India map placeholder */}
          <div className="flex items-center justify-center h-28 text-6xl mb-3">🗺️</div>
          <div className="space-y-2">
            {customerLocations.map((loc) => (
              <div key={loc.state} className="flex items-center gap-3">
                <span className="text-xs font-medium text-black/70 w-28">{loc.state}</span>
                <div className="flex-1 h-1.5 bg-[#F7F8FC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5B4DFB] rounded-full"
                    style={{ width: `${(loc.pct / 28) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-black/60 w-8 text-right">{loc.pct}%</span>
              </div>
            ))}
            <p className="text-[10px] text-black/30 italic mt-1">India shops differently. So do we.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
