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
  ShieldCheck,
  Plus,
  Lock,
} from "lucide-react";

export default function CustomerWalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(124350);

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
            <Link href="/customers/orders" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <FileText className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link href="/customers/wallet" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] font-semibold text-xs shadow-sm">
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

      {/* Wallet Content */}
      <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6 max-w-4xl">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Payment Context</h1>
            <p className="text-xs text-slate-400">Authorized payment rails and financial boundaries</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            DEMO / SANDBOX DATA
          </span>
        </div>

        {/* Balance Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-purple-950 text-white shadow-xl flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 uppercase font-semibold">Available Sandbox Balance</div>
            <div className="text-4xl font-extrabold tracking-tight">₹ {balance.toLocaleString()}</div>
            <div className="text-xs text-purple-300 pt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Razorpay Test Mode Connected</span>
            </div>
          </div>
          <button
            onClick={() => setBalance(balance + 10000)}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add ₹ 10,000</span>
          </button>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Connected Payment Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-slate-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900">UPI ID</div>
                <div className="text-slate-500">suman@upi</div>
              </div>
              <span className="text-emerald-600 font-bold">● Active</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-slate-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900">HDFC Bank Account</div>
                <div className="text-slate-500">•••• 4821</div>
              </div>
              <span className="text-emerald-600 font-bold">● Active</span>
            </div>
          </div>
        </div>

        {/* Spending Boundaries */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Spending Boundaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <div className="text-slate-500">Per Purchase Ceiling</div>
              <div className="text-lg font-bold text-purple-900 mt-1">₹ 7,000</div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <div className="text-slate-500">Daily Spending Limit</div>
              <div className="text-lg font-bold text-purple-900 mt-1">₹ 25,000</div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <div className="text-slate-500">Approval Requirement</div>
              <div className="text-lg font-bold text-purple-900 mt-1">Always Required ✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
