"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";

export default function CustomerSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("Aarav Mehta");
  const [email, setEmail] = useState("aarav@berry.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [limit, setLimit] = useState(7000);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/customers/home");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/20 text-xl">
            🫐
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">berry</span>
            <div className="text-[10px] text-slate-500 font-medium -mt-1">Shop Smarter. Live Bigger.</div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet Berry.
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your personal agent for discovering, deciding and buying.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First name</label>
              <input
                type="text"
                value={name.split(" ")[0]}
                onChange={() => {}}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAFAF8] border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last name</label>
              <input
                type="text"
                value={name.split(" ")[1] || "Mehta"}
                onChange={() => {}}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAFAF8] border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAFAF8] border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAFAF8] border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-600"
              required
            />
          </div>

          {/* Purchasing Boundary Setup */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-900">Your First Purchase Boundary</span>
              <span className="font-bold text-purple-700 text-sm">₹ {limit.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <p className="text-[11px] text-purple-800 leading-relaxed">
              Berry will discover, compare, and build carts, but <strong>will always ask you to approve a purchase before money moves.</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Create my Berry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have Berry?{" "}
          <Link href="/customers/login" className="text-purple-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
