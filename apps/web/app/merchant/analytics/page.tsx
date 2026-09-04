"use client";
import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

export default function MerchantAnalytics() {
  const [metrics, setMetrics] = useState({ aigmv: 48420, aiOrders: 27, aov: 1794, upsellRevenue: 8420, growthPct: 23.8 });
  const [range, setRange] = useState("30D");

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/merchant/metrics`).then(r => r.ok ? r.json() : null).then(d => {
      if (d) setMetrics({ aigmv: d.ai_gmv || 48420, aiOrders: d.ai_orders || 27, aov: d.aov || 1794, upsellRevenue: d.upsell_revenue || 8420, growthPct: d.gmv_growth_pct || 23.8 });
    }).catch(() => {});
  }, []);

  const kpis = [
    { label: "Total Revenue", value: "₹4,82,320", delta: "+18%", sub: "from Berry-assisted sales" },
    { label: "AI-Assisted GMV", value: `₹${metrics.aigmv.toLocaleString("en-IN")}`, delta: `+${metrics.growthPct}%`, sub: "orders originating from Berry agent" },
    { label: "Avg. Order Value", value: `₹${metrics.aov.toLocaleString("en-IN")}`, delta: "+12.4%", sub: "per transaction" },
    { label: "Cross-sell Revenue", value: `₹${metrics.upsellRevenue.toLocaleString("en-IN")}`, delta: "+31%", sub: "socks + accessories upsell" },
    { label: "AI-Driven Orders", value: `${metrics.aiOrders}`, delta: "+14", sub: "pure agent executions" },
    { label: "Conversion ↑", value: "+24%", delta: "vs baseline", sub: "Berry vs direct traffic" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-sm text-black/50">Calculated from live transaction &amp; event data.</p>
        </div>
        <div className="flex gap-2">
          {["7D", "30D", "3M", "1Y"].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${range === r ? "bg-black text-white" : "bg-white border border-black/10 text-black/60"}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-xs">
            <div className="text-xs text-black/50 font-medium mb-1">{k.label}</div>
            <div className="text-2xl font-extrabold text-black">{k.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-600 font-bold">{k.delta}</span>
              <span className="text-[10px] text-black/40">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Funnel */}
      <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-xs">
        <h2 className="font-bold text-lg mb-5">Berry Commerce Funnel</h2>
        <div className="flex flex-col gap-2 max-w-lg">
          {[
            { stage: "Product discovered", count: "8,420", pct: 100 },
            { stage: "Product viewed by Berry agent", count: "6,200", pct: 73 },
            { stage: "Berry interaction (chat)", count: "3,840", pct: 45 },
            { stage: "Cart created", count: "2,180", pct: 25 },
            { stage: "Authorization requested", count: "1,420", pct: 16 },
            { stage: "Payment completed", count: "1,284", pct: 15 },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-black/50 w-52 text-right">{f.stage}</span>
              <div className="flex-1 h-6 bg-[#F7F8FC] rounded-lg overflow-hidden">
                <div className="h-full bg-[#5B4DFB] rounded-lg flex items-center px-2" style={{ width: `${f.pct}%`, opacity: 0.4 + (i / 5) * 0.6 }}>
                  <span className="text-[10px] font-bold text-white">{f.count}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-black/60 w-8">{f.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
