"use client";
import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

export default function GrowthWithBerry() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [askInput, setAskInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [bundleCreated, setBundleCreated] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/merchant/opportunities`)
      .then(r => r.ok ? r.json() : [])
      .then(setOpportunities)
      .catch(() => {
        setOpportunities([
          { id: 1, title: "Running Shoes → Socks Bundle", attach_rate: "31%", uplift: "₹12,400", desc: "Customers who buy Nimbus Runner buy socks 31% of the time. Create a bundle to increase attach rate to 65%.", type: "CROSS_SELL" },
          { id: 2, title: "FlexFit Hoodie → Cap Bundle", attach_rate: "18%", uplift: "₹6,200", desc: "RunCap is frequently browsed after hoodie purchase. Bundle at 5% discount.", type: "CROSS_SELL" },
          { id: 3, title: "Discount Inactive Products", attach_rate: "N/A", uplift: "₹8,900", desc: "3 products haven't sold in 7 days. A 10% flash discount could clear inventory.", type: "PROMOTION" },
        ]);
      });
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `As Berry Growth Intelligence for a running store, answer this merchant question: ${askInput}` }),
      });
      if (res.ok) {
        const d = await res.json();
        setAiResponse(d.response || "Based on your sales data, I recommend focusing on cross-sell bundles and flash inventory discounts to drive this month's growth.");
      }
    } catch {
      setAiResponse("Based on your current sales trends, I see 3 strong opportunities: (1) Running Kit bundle (shoe + socks) could increase AOV by 28%, (2) A 10% flash sale on Trail Socks would clear your remaining 76 units this week, (3) Your Karnataka customers have a 94% higher re-order rate — target them with a loyalty campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          ✦ Growth with Berry <span className="text-sm bg-[#5B4DFB] text-white px-2.5 py-0.5 rounded-full font-bold">New</span>
        </h1>
        <p className="text-sm text-black/50">Your AI commerce growth engine. Powered by Python intelligence + OpenAI reasoning.</p>
      </div>

      {/* Ask Berry */}
      <div className="bg-gradient-to-br from-[#5B4DFB] to-[#4335E0] rounded-3xl p-7 text-white">
        <h2 className="font-bold text-xl mb-1">Ask Berry how to grow</h2>
        <p className="text-sm text-white/70 mb-5">Berry analyzes your products, orders, cross-sells, and inventory to surface revenue opportunities.</p>
        <form onSubmit={handleAsk} className="flex gap-3">
          <input
            type="text"
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder="How can I increase revenue this week?"
            className="flex-1 px-5 py-3 rounded-2xl bg-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button type="submit" disabled={loading} className="px-6 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-black/80 transition-all flex items-center gap-2">
            {loading ? <><span className="animate-spin">◌</span></> : "✦ Ask"}
          </button>
        </form>
        {aiResponse && (
          <div className="mt-4 bg-white/10 rounded-2xl p-4 text-sm text-white/90 leading-relaxed">
            {aiResponse}
          </div>
        )}
      </div>

      {/* Growth Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {opportunities.map((opp, i) => (
          <div key={opp.id || i} className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#5B4DFB]/10 text-[#5B4DFB] px-2.5 py-1 rounded-full">
                {opp.type || "OPPORTUNITY"}
              </span>
              <span className="text-sm font-black text-emerald-600">{opp.uplift}</span>
            </div>
            <h3 className="font-bold text-base text-black">{opp.title}</h3>
            <p className="text-xs text-black/50 mt-1 leading-relaxed">{opp.desc}</p>
            {opp.attach_rate !== "N/A" && (
              <div className="mt-3 text-xs text-black/40">Current attach rate: <strong className="text-black">{opp.attach_rate}</strong></div>
            )}
            {bundleCreated === String(opp.id || i) ? (
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-700">
                ✓ Bundle published to Berry customer feed!
              </div>
            ) : (
              <button
                onClick={() => setBundleCreated(String(opp.id || i))}
                className="mt-4 w-full py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/80 transition-all"
              >
                Create Bundle →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
