"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  MessageSquare,
  FileText,
  CreditCard,
  Bookmark,
  Compass,
  User,
  Settings,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [tab, setTab] = useState("All");

  const orders = [
    {
      id: "#BRY-1042",
      productName: "Nimbus Runner (Daily Road Trainer)",
      addon: "Performance Anti-Blister Socks",
      price: 6499,
      status: "COMPLETED",
      paymentMethod: "Razorpay (Test Mode)",
      date: "04 Sep 2026, 13:46",
      verifiedHash: "e3b0c44298fc1c",
    },
    {
      id: "#BRY-0994",
      productName: "Nothing Ear (a) ANC Earbuds",
      addon: null,
      price: 5999,
      status: "COMPLETED",
      paymentMethod: "Razorpay (Test Mode)",
      date: "02 Sep 2026, 11:20",
      verifiedHash: "4b9c1d8e2f0a1c",
    },
    {
      id: "#BRY-0881",
      productName: "boAt Wave Ultima Smartwatch",
      addon: null,
      price: 2499,
      status: "COMPLETED",
      paymentMethod: "UPI (suman@upi)",
      date: "28 Aug 2026, 17:42",
      verifiedHash: "91e0a2b4c8d7e0",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 p-5 flex flex-col justify-between hidden lg:flex shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2 cursor-pointer" onClick={() => router.push("/customers/home")}>
            <div className="w-9 h-9 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/20 text-xl">
              🫐
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">berry</span>
              <div className="text-[10px] text-slate-400 font-medium -mt-1">Shop Smarter. Live Bigger.</div>
            </div>
          </div>

          <nav className="space-y-1">
            <Link href="/customers/home" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link href="/customers/chat" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Berry</span>
            </Link>
            <Link href="/customers/orders" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] font-semibold text-xs shadow-sm">
              <FileText className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link href="/customers/wallet" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <CreditCard className="w-4 h-4" />
              <span>Wallet & Payments</span>
            </Link>
            <Link href="/customers/saved" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </Link>
            <Link href="/customers/discover" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </Link>
            <Link href="/customers/profile" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Aarav Mehta</div>
              <div className="text-[10px] text-slate-400">aarav@berry.in</div>
            </div>
          </div>
          <Link href="/customers/settings" className="text-slate-400 hover:text-slate-700">
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Orders List */}
      <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Orders & Passports</h1>
            <p className="text-xs text-slate-400">Cryptographically verifiable purchase passports and audit logs</p>
          </div>

          <div className="flex items-center gap-2">
            {["All", "Processing", "Delivered", "Cancelled"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  tab === t ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 max-w-3xl">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold text-xs border border-purple-100">
                  🫐
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{ord.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ {ord.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{ord.productName}</div>
                  <div className="text-[11px] text-slate-400">{ord.date} • {ord.paymentMethod}</div>
                </div>
              </div>

              <div className="text-right space-y-1.5">
                <div className="text-base font-extrabold text-slate-900">₹ {ord.price.toLocaleString()}</div>
                <button
                  onClick={() => router.push(`/customers/chat?q=Show passport for ${ord.id}`)}
                  className="px-3 py-1 rounded-full bg-[#FAFAF8] hover:bg-purple-50 text-purple-700 font-semibold text-[11px] border border-slate-200 flex items-center gap-1 shadow-sm"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Passport Proof</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
