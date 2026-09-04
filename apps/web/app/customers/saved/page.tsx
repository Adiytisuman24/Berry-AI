"use client";

import React from "react";
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
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function CustomerSavedPage() {
  const router = useRouter();

  const savedList = [
    {
      id: "prod-nike-270",
      name: "Nike Air Max 270",
      price: 8995,
      alert: "Price dropped by ₹ 3,000 yesterday!",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-nothing-ear",
      name: "Nothing Ear (a) ANC",
      price: 5999,
      alert: "In stock with connected merchant",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
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
            <Link href="/customers/orders" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <FileText className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link href="/customers/wallet" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <CreditCard className="w-4 h-4" />
              <span>Wallet & Payments</span>
            </Link>
            <Link href="/customers/saved" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] font-semibold text-xs shadow-sm">
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

      <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6 max-w-4xl">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Saved for Later</h1>
            <p className="text-xs text-slate-400">Berry monitors price drops and restocks for your saved products</p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {savedList.length} Items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedList.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-xs text-slate-900">{item.name}</h3>
                <div className="font-extrabold text-sm text-slate-900">₹ {item.price.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">{item.alert}</div>
                <button
                  onClick={() => router.push(`/customers/chat?q=Buy my saved ${encodeURIComponent(item.name)}`)}
                  className="mt-2 text-[11px] text-purple-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Ask Berry to Buy</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
