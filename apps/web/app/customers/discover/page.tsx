"use client";

import React, { useState, useEffect } from "react";
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
  Search,
  Heart,
  Star,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function CustomerDiscoverPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([
    {
      id: "prod-nike-270",
      name: "Nike Air Max 270",
      price: 8995,
      originalPrice: 11995,
      rating: 4.7,
      reviewsCount: "1.2k",
      badge: "Popular",
      category: "Footwear",
      matchScore: 94,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-nothing-ear",
      name: "Nothing Ear (a)",
      price: 5999,
      originalPrice: 7999,
      rating: 4.5,
      reviewsCount: "846",
      badge: "Best Value",
      category: "Electronics",
      matchScore: 91,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-uniqlo-jacket",
      name: "Uniqlo Tech Jacket",
      price: 3999,
      originalPrice: 4999,
      rating: 4.6,
      reviewsCount: "420",
      badge: "New Drop",
      category: "Fashion",
      matchScore: 89,
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-boat-ultima",
      name: "boAt Wave Ultima",
      price: 2499,
      originalPrice: 3999,
      rating: 4.4,
      reviewsCount: "1.1k",
      badge: "Trending",
      category: "Electronics",
      matchScore: 85,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-nimbus-runner",
      name: "Nimbus Runner Pro",
      price: 6499,
      originalPrice: 8499,
      rating: 4.9,
      reviewsCount: "1.8k",
      badge: "Best Match",
      category: "Footwear",
      matchScore: 98,
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-aeroflex-daily",
      name: "AeroFlex Daily Trainer",
      price: 5999,
      originalPrice: 7499,
      rating: 4.7,
      reviewsCount: "920",
      badge: "Trending",
      category: "Footwear",
      matchScore: 92,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
    },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: Math.round(p.price * 1.25),
            rating: p.rating || 4.8,
            reviewsCount: "820",
            badge: "AI Indexed",
            category: p.category || "Footwear",
            matchScore: p.match_score || 94,
            image: p.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
          }));
          setProducts(formatted);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans text-slate-800">
      {/* Fixed Left Sidebar */}
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
            <Link href="/customers/saved" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </Link>
            <Link href="/customers/discover" className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] font-semibold text-xs shadow-sm">
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

      {/* Main Discover Grid */}
      <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Explore Catalog</h1>
            <p className="text-xs text-slate-400">Continuous live feed synced with merchant inventory</p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            {["All", "Footwear", "Electronics", "Fashion"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === cat ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Continuous Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((p) => filter === "All" || p.category.toLowerCase().includes(filter.toLowerCase()))
            .map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/customers/chat?q=Tell me about ${encodeURIComponent(p.name)}`)}
                className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full rounded-2xl bg-slate-50 overflow-hidden mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {p.badge && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 shadow-sm text-purple-700">
                      {p.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSavedItems((prev) => (prev.includes(p.id) ? prev.filter((i) => i !== p.id) : [...prev, p.id]));
                    }}
                    className="w-7 h-7 rounded-full bg-white/90 shadow-sm absolute top-2 right-2 flex items-center justify-center text-slate-400 hover:text-red-500"
                  >
                    <Heart className={`w-3.5 h-3.5 ${savedItems.includes(p.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">₹ {p.price.toLocaleString()}</span>
                    {p.originalPrice && <span className="text-[10px] text-slate-400 line-through">₹ {p.originalPrice.toLocaleString()}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{p.rating}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/customers/chat?q=Should I buy ${encodeURIComponent(p.name)} for ₹${p.price}?`);
                  }}
                  className="mt-3 w-full py-1.5 rounded-full bg-[#FAFAF8] hover:bg-purple-50 text-purple-700 font-semibold text-[11px] border border-slate-100 flex items-center justify-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ask Berry</span>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
