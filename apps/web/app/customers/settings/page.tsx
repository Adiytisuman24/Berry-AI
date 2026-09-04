"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CustomerSettingsPage() {
  const [permissions, setPermissions] = useState({
    search: true,
    recommend: true,
    buildCarts: true,
    suggestCrossSells: true,
    preparePurchases: true,
    executeAutonomously: false,
  });

  const [spendingLimit, setSpendingLimit] = useState(7000);
  const [dailyLimit, setDailyLimit] = useState(25000);
  const [notifications, setNotifications] = useState({
    priceDrops: true,
    deals: true,
    orderUpdates: true,
    berrySuggestions: false,
  });

  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

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
            Settings & Permissions
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="text-xs font-semibold px-5 py-2 rounded-full bg-black text-white hover:bg-black/80 transition-all shadow-sm"
          >
            Save Preferences
          </button>
          <Link
            href="/customers/home"
            className="text-xs font-semibold px-4 py-2 rounded-full bg-black/[0.05] hover:bg-black/10 text-black transition-all"
          >
            Done
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        {saveToast && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 text-sm font-semibold animate-bounce">
            <span>✓</span> Policy guardrails and settings successfully updated!
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Agent Settings & Safety Limits</h1>
          <p className="text-sm text-black/50 mt-1">
            Configure how autonomous Berry can be when discovering deals and preparing Razorpay transactions.
          </p>
        </div>

        <div className="space-y-8">
          {/* Berry Permissions (Key Requirement) */}
          <section className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <span>🛡️</span> Berry Autonomous Permissions
                </h2>
                <p className="text-xs text-black/50 mt-0.5">
                  Granular execution rights granted to your Berry purchasing agent.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                Enforced by Go Gateway
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
                <div>
                  <div className="text-sm font-bold text-black/90">Search for products across merchants</div>
                  <div className="text-xs text-black/50">Allow Berry to index inventory and compute price comparisons</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.search}
                    onChange={(e) => setPermissions({ ...permissions, search: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B4DFB]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
                <div>
                  <div className="text-sm font-bold text-black/90">Recommend products with match scores</div>
                  <div className="text-xs text-black/50">Calculates lifestyle fit percentage (e.g. 94% match)</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.recommend}
                    onChange={(e) => setPermissions({ ...permissions, recommend: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B4DFB]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
                <div>
                  <div className="text-sm font-bold text-black/90">Build & optimize carts</div>
                  <div className="text-xs text-black/50">Assemble selected items and negotiate bundle discounts</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.buildCarts}
                    onChange={(e) => setPermissions({ ...permissions, buildCarts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B4DFB]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
                <div>
                  <div className="text-sm font-bold text-black/90">Suggest intelligent cross-sells</div>
                  <div className="text-xs text-black/50">Suggest accessories that stay within your set spending limit</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.suggestCrossSells}
                    onChange={(e) => setPermissions({ ...permissions, suggestCrossSells: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B4DFB]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
                <div>
                  <div className="text-sm font-bold text-black/90">Prepare Razorpay purchases</div>
                  <div className="text-xs text-black/50">Pre-create Razorpay order IDs and seal cryptographic passports</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.preparePurchases}
                    onChange={(e) => setPermissions({ ...permissions, preparePurchases: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B4DFB]"></div>
                </label>
              </div>

              {/* Strict OFF highlight */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/60 border border-red-200">
                <div>
                  <div className="text-sm font-bold text-red-900 flex items-center gap-2">
                    <span>Execute purchases automatically without confirmation</span>
                    <span className="text-[10px] bg-red-200 text-red-900 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                      OFF (Required)
                    </span>
                  </div>
                  <div className="text-xs text-red-800/80 mt-0.5">
                    Berry will NEVER debit money or finalize payments without explicit customer approval modal.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-not-allowed opacity-60">
                  <input
                    type="checkbox"
                    checked={permissions.executeAutonomously}
                    disabled
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Spending Boundaries */}
          <section className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm">
            <h2 className="text-lg font-bold tracking-tight mb-2 flex items-center gap-2">
              <span>💰</span> Spending Limits & Money Gate
            </h2>
            <p className="text-xs text-black/50 mb-6">
              If an order total exceeds this amount, Berry blocks the purchase immediately with the failure audit UI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-black/70 uppercase">Single Item / Cart Limit</label>
                  <span className="text-base font-black text-[#5B4DFB]">₹{spendingLimit.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={spendingLimit}
                  onChange={(e) => setSpendingLimit(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B4DFB]"
                />
                <div className="flex justify-between text-[10px] text-black/40 mt-1">
                  <span>₹1,000</span>
                  <span>₹15,000</span>
                  <span>₹25,000</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-black/[0.04]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-black/70 uppercase">Daily Rolling Ceiling</label>
                  <span className="text-base font-black text-black">₹{dailyLimit.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between text-[10px] text-black/40 mt-1">
                  <span>₹5,000</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>
            </div>
          </section>

          {/* Connected Merchants */}
          <section className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm">
            <h2 className="text-lg font-bold tracking-tight mb-2 flex items-center gap-2">
              <span>🏪</span> Connected Merchants & Feeds
            </h2>
            <p className="text-xs text-black/50 mb-6">
              Merchants whose real-time catalog feeds are authorized for Berry agent crawling and instant checkout.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Apex Athletics", category: "Footwear & Apparel", status: "Active (12 products)" },
                { name: "Nothing Official Store", category: "Audio & Smart Tech", status: "Active (8 products)" },
                { name: "Uniqlo Urban Life", category: "Outerwear & Minimal", status: "Active (15 products)" },
              ].map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.04] text-xs">
                  <div className="font-bold text-sm text-black">{m.name}</div>
                  <div className="text-black/50 mt-0.5">{m.category}</div>
                  <div className="mt-3 text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {m.status}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
