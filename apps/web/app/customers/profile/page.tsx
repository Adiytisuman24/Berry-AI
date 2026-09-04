"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CustomerProfilePage() {
  const [preferences, setPreferences] = useState({
    categories: ["Footwear", "Wearables", "Minimalist Fashion", "Smart Tech"],
    preferredBrands: ["Nike", "Nothing", "Uniqlo", "Apple", "Asics"],
    monthlyBudget: "₹25,000",
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-black/[0.06] px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/customers/home" className="flex items-center gap-2 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🫐</span>
            <span className="font-bold text-xl tracking-tight">berry</span>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-black/40 border-l border-black/10 pl-6 hidden sm:inline">
            Customer Profile
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/customers/wallet"
            className="flex items-center gap-2 bg-white border border-black/[0.08] px-3.5 py-1.5 rounded-full text-xs font-medium shadow-sm hover:border-black/20 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Wallet Context: <strong className="text-black">₹1,24,350</strong></span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold uppercase">Sandbox</span>
          </Link>
          <Link
            href="/customers/home"
            className="text-xs font-semibold px-4 py-2 rounded-full bg-black text-white hover:bg-black/80 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-8 border border-black/[0.06] shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-100 via-indigo-50 to-purple-200 border-2 border-purple-300 flex items-center justify-center text-3xl shadow-inner">
              👤
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Suman Mehta</h1>
                <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  Berry VIP Buyer
                </span>
              </div>
              <p className="text-sm text-black/60 mt-0.5">suman@email.com • +91 98765 43210</p>
              <p className="text-xs text-black/40 mt-1">Authorized Berry Purchasing Agent Client since Sept 2026</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/customers/settings"
              className="px-4 py-2.5 bg-black/[0.04] hover:bg-black/[0.08] text-xs font-bold rounded-2xl transition-all flex items-center gap-2"
            >
              <span>⚙</span> Edit Settings
            </Link>
            <Link
              href="/customers/chat"
              className="px-4 py-2.5 bg-[#5B4DFB] hover:bg-[#4C3EE3] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2"
            >
              <span>🫐</span> Ask Berry
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Financial Profile */}
          <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-5">
              <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
                <span>💳</span> Financial Profile Context
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Demo / Sandbox
              </span>
            </div>

            <div className="space-y-4 flex-1">
              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.04] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-black/50 block">Credit Bureau Assessment (CIBIL)</span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">782</span>
                  <span className="text-[11px] text-emerald-700 font-medium ml-2">Excellent standing</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-black/40 uppercase block">Verified Node</span>
                  <span className="text-xs font-bold text-black/70">Equifax / Experian Mock</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
                <span className="text-xs font-medium text-black/50 block mb-2">Connected Payment Nodes</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-white rounded-xl border border-black/[0.04]">
                    <span className="font-semibold flex items-center gap-2">🏦 HDFC Bank Express •••• 4821</span>
                    <span className="text-emerald-600 font-bold">Auto-Debit Ready</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-white rounded-xl border border-black/[0.04]">
                    <span className="font-semibold flex items-center gap-2">📱 UPI Handle: suman@upi</span>
                    <span className="text-emerald-600 font-bold">Instant Mandate</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                <span className="text-xs font-bold text-purple-900 block mb-1">Berry Safety Boundary</span>
                <p className="text-xs text-purple-800/80 leading-relaxed">
                  Single-item limit: <strong>₹7,000</strong>. Berry can discover and negotiate items up to this amount, but always requires your one-tap biometric / passkey approval before money moves.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Berry Permissions */}
          <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-5">
              <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
                <span>🛡️</span> Berry Agent Permissions
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Active Policy
              </span>
            </div>

            <div className="space-y-3 flex-1 text-xs">
              {[
                { title: "Discover & evaluate merchant inventory", desc: "Allows Berry to crawl registered merchants for deals", active: true },
                { title: "Recommend products with match scores", desc: "Computes personalized match score based on lifestyle", active: true },
                { title: "Build optimized commerce carts", desc: "Bundles items and applies merchant volume discounts", active: true },
                { title: "Suggest verified cross-sells", desc: "Suggests high-affinity companion items (e.g. running socks)", active: true },
                { title: "Create Razorpay payment requests", desc: "Pre-authorizes verified orders with Razorpay gateway", active: true },
                { title: "Execute payments without human approval", desc: "Zero-friction autonomous funds transfer", active: false, alert: "STRICTLY LOCKED" },
              ].map((perm, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    perm.active
                      ? "bg-white border-black/[0.06]"
                      : "bg-red-50/40 border-red-200"
                  }`}
                >
                  <div className="pr-4">
                    <div className="font-bold text-black/90 flex items-center gap-2">
                      <span>{perm.title}</span>
                      {perm.alert && (
                        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                          {perm.alert}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-black/50 mt-0.5">{perm.desc}</div>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        perm.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {perm.active ? "✓" : "✕"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-black/40 mt-4 italic text-center">
              Payment execution always requires your configured authorization policy.
            </p>
          </div>
        </div>

        {/* Section 3: Berry Preferences & Learning */}
        <div className="mt-8 bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-5">
            <div>
              <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
                <span>🎯</span> Berry Learned Preferences
              </h2>
              <p className="text-xs text-black/50 mt-0.5">
                Berry personalizes product queries and rankings using these verified lifestyle attributes.
              </p>
            </div>
            <span className="text-xs font-bold text-[#5B4DFB] bg-purple-50 px-3 py-1 rounded-full">
              98.4% Accuracy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
              <span className="text-xs font-bold text-black/60 uppercase tracking-wider block mb-2">
                Preferred Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {preferences.categories.map((cat, i) => (
                  <span key={i} className="text-xs bg-white border border-black/10 px-2.5 py-1 rounded-lg font-medium shadow-2xs">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
              <span className="text-xs font-bold text-black/60 uppercase tracking-wider block mb-2">
                Brand Affinity
              </span>
              <div className="flex flex-wrap gap-1.5">
                {preferences.preferredBrands.map((brand, i) => (
                  <span key={i} className="text-xs bg-white border border-black/10 px-2.5 py-1 rounded-lg font-medium shadow-2xs">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
              <span className="text-xs font-bold text-black/60 uppercase tracking-wider block mb-2">
                Purchase Guardrails
              </span>
              <div className="space-y-1.5 text-xs text-black/70">
                <div className="flex justify-between">
                  <span>Max single auto-ask:</span>
                  <strong className="text-black">₹7,000</strong>
                </div>
                <div className="flex justify-between">
                  <span>Cross-sell ceiling:</span>
                  <strong className="text-black">15% of cart</strong>
                </div>
                <div className="flex justify-between">
                  <span>Policy engine:</span>
                  <strong className="text-emerald-600 font-bold">Deterministic Go</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
