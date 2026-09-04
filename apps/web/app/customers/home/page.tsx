"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  ArrowRight,
  Heart,
  Star,
  Home,
  MessageSquare,
  FileText,
  CreditCard,
  Bookmark,
  Compass,
  User,
  Settings,
  Flame,
  Smartphone,
  Shirt,
  Footprints,
  Headphones,
  Armchair,
  Sparkles,
  Trophy,
  MoreHorizontal,
  ChevronRight,
  ArrowUp,
  X,
  Check,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function CustomerHomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
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
      badgeType: "popular",
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
      badgeType: "value",
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
      badgeType: "new",
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
      badge: null,
      category: "Electronics",
      matchScore: 85,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    },
  ]);

  const loadProducts = () => {
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
            reviewsCount: "950",
            badge: p.id.includes("nimbus") ? "Popular" : "Best Match",
            badgeType: "popular",
            category: p.category || "Footwear",
            matchScore: p.match_score || 94,
            image: p.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
          }));
          setProducts(formatted);
        }
      })
      .catch(() => {});
  };

  // Fetch live products and subscribe to SSE Nervous System
  useEffect(() => {
    loadProducts();

    try {
      const es = new EventSource(`${API_BASE}/api/v1/events/stream`);
      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.event === "PRODUCT_CREATED" || parsed.event === "INVENTORY_UPDATED") {
            loadProducts();
          }
        } catch (_) {}
      };
      return () => es.close();
    } catch (_) {}
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customers/chat?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      router.push(`/customers/chat?q=${encodeURIComponent(chatInput)}`);
    }
  };

  const handlePromptClick = (prompt: string) => {
    router.push(`/customers/chat?q=${encodeURIComponent(prompt)}`);
  };

  const toggleSave = (id: string) => {
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans text-slate-800">
      {/* 1. Fixed Left Sidebar (240px) */}
      <aside className="w-60 bg-white border-r border-slate-100 p-5 flex flex-col justify-between hidden lg:flex shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/20 text-xl">
              🫐
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">berry</span>
              <div className="text-[10px] text-slate-400 font-medium -mt-1">Shop Smarter. Live Bigger.</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/customers/home"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] font-semibold text-xs shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              href="/customers/chat"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Berry</span>
            </Link>

            <Link
              href="/customers/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-xs transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Orders</span>
            </Link>

            <Link
              href="/customers/wallet"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-xs transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Wallet & Payments</span>
            </Link>

            <Link
              href="/customers/saved"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-xs transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </Link>

            <Link
              href="/customers/discover"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-xs transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            <Link
              href="/customers/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-xs transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Bottom Cards */}
        <div className="space-y-4">
          {/* Berry Pro Promo Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-50 via-[#FAF5FF] to-white border border-purple-100/80 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start">
              <span className="font-handwritten text-xl text-slate-800 font-bold leading-none">
                Good choices<br />brighter tomorrows
              </span>
              <span className="text-xl">😊</span>
            </div>
            <div className="mt-4 pt-2">
              <div className="text-[11px] font-bold text-slate-900">Berry Pro</div>
              <div className="text-[10px] text-slate-500">Unlock exclusive perks</div>
              <button className="mt-2.5 w-full py-1.5 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-sm">
                <span>Upgrade</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* User Profile Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Aarav Mehta"
                  className="w-full h-full object-cover"
                />
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
        </div>
      </aside>

      {/* 2. Main Scrollable Dashboard Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="px-6 lg:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 bg-[#F8F9FB]/90 backdrop-blur-md">
          {/* Omni-Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything... or just ask Berry"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-xs lg:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 shadow-sm transition-all"
              />
            </div>
          </form>

          {/* Right Header Badges */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 relative hover:bg-slate-50 transition-colors shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2"></span>
            </button>

            {/* Wallet Balance Pill */}
            <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
                  💳
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold leading-none">Available Balance</div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">₹ 1,24,350</div>
                </div>
              </div>
              <button
                onClick={() => router.push("/customers/wallet")}
                className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-transform active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Add Money</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body Grid */}
        <div className="px-6 lg:px-8 pb-12 flex-1 space-y-6">
          {/* Main Hero Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Big Hero Banner (8 Cols) */}
            <div className="lg:col-span-8 bg-gradient-to-r from-[#D7E3EE] via-[#E4ECF4] to-[#F1F3F6] rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm border border-slate-200/40 min-h-[260px]">
              {/* Architecture/lifestyle background photo overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-90 pointer-events-none hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
                  alt="Minimal luxury lifestyle"
                  className="w-full h-full object-cover object-left mask-image-linear"
                  style={{ maskImage: "linear-gradient(to right, transparent, black)" }}
                />
              </div>

              <div className="max-w-md z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider backdrop-blur-sm">
                  <span>MEET BERRY</span>
                  <span className="text-purple-600">+</span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Your personal<br />shopping agent.
                </h1>

                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  Find. Compare. Decide. Buy.<br />
                  All in one conversation.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => router.push("/customers/chat")}
                    className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-transform active:scale-95"
                  >
                    <span>Chat with Berry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Handwritten Quote in Hero */}
              <div className="z-10 pt-4">
                <span className="font-handwritten text-2xl text-slate-800 font-bold block">
                  Less search. More living. ~
                </span>
              </div>
            </div>

            {/* Right "Today's Vibe" Card (4 Cols) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#FFF9F3] via-[#FFFDFB] to-white rounded-3xl p-6 flex flex-col justify-between border border-amber-100/60 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <span>☀️ Today's vibe</span>
                  <span>✨</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Sun, 24 Aug</span>
              </div>

              <div className="my-auto py-4 space-y-2">
                <div className="font-handwritten text-3xl font-bold text-slate-800">
                  Hey Aarav!
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                  "Great choices today lead to a better you tomorrow."
                </p>
              </div>

              <div className="flex justify-end">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-50">
                  <img
                    src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&auto=format&fit=crop&q=80"
                    alt="Potted plant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Category Icons Row */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto py-2 scrollbar-none">
            {[
              { label: "Trending", icon: <Flame className="w-4 h-4 text-orange-600" />, bg: "bg-orange-100" },
              { label: "Mobiles", icon: <Smartphone className="w-4 h-4 text-slate-700" />, bg: "bg-slate-100" },
              { label: "Fashion", icon: <Shirt className="w-4 h-4 text-emerald-700" />, bg: "bg-emerald-100" },
              { label: "Footwear", icon: <Footprints className="w-4 h-4 text-stone-700" />, bg: "bg-stone-100" },
              { label: "Electronics", icon: <Headphones className="w-4 h-4 text-indigo-700" />, bg: "bg-indigo-100" },
              { label: "Home & Living", icon: <Armchair className="w-4 h-4 text-amber-700" />, bg: "bg-amber-100" },
              { label: "Beauty", icon: <Sparkles className="w-4 h-4 text-pink-700" />, bg: "bg-pink-100" },
              { label: "Sports", icon: <Trophy className="w-4 h-4 text-blue-700" />, bg: "bg-blue-100" },
              { label: "More", icon: <MoreHorizontal className="w-4 h-4 text-purple-700" />, bg: "bg-purple-100" },
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => router.push(`/customers/discover?category=${cat.label}`)}
                className="flex flex-col items-center gap-2 min-w-[70px] group"
              >
                <div className={`w-12 h-12 rounded-full ${cat.bg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-purple-600">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          {/* Main Two-Column Row: Products on Left (8 Cols), Integrated Chat on Right (4 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Trending Products & Promo Mini-Banners */}
            <div className="lg:col-span-8 space-y-6">
              {/* Section Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Trending for you</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </h2>
                  <p className="text-xs text-slate-400">Picked by Berry, just for you.</p>
                </div>
                <button
                  onClick={() => router.push("/customers/discover")}
                  className="text-xs font-semibold text-purple-600 hover:underline"
                >
                  See all
                </button>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/customers/chat?q=Tell me about ${encodeURIComponent(p.name)}`)}
                    className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    {/* Image & Badges */}
                    <div className="relative aspect-square w-full rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center mb-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badge */}
                      {p.badge && (
                        <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                          p.badgeType === "popular"
                            ? "bg-orange-50 text-orange-600 border border-orange-200"
                            : p.badgeType === "value"
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-purple-50 text-purple-600 border border-purple-200"
                        }`}>
                          {p.badge}
                        </span>
                      )}

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(p.id);
                        }}
                        className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm absolute top-2 right-2 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            savedItems.includes(p.id) ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-purple-600">
                        {p.name}
                      </h3>

                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900">
                          ₹ {p.price.toLocaleString()}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹ {p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-700">{p.rating}</span>
                        <span>({p.reviewsCount})</span>
                      </div>

                      {p.matchScore && (
                        <div className="pt-1.5 border-t border-slate-50 text-[10px] font-semibold text-purple-700 flex items-center gap-1">
                          <span>Berry match: {p.matchScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 3 Mini Promo Banners Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-50 rounded-3xl p-4 flex justify-between items-center border border-purple-200/60 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-purple-950">Up to 50% off</div>
                    <div className="text-[10px] text-slate-600">On top brands</div>
                    <button
                      onClick={() => router.push("/customers/discover")}
                      className="mt-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/80 overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80"
                      alt="Sneaker"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-4 flex justify-between items-center border border-emerald-200/60 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-emerald-950">Smart picks</div>
                    <div className="text-[10px] text-slate-600">for a brighter you.</div>
                    <button
                      onClick={() => router.push("/customers/discover")}
                      className="mt-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/80 overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=100&auto=format&fit=crop&q=80"
                      alt="Plant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-4 flex justify-between items-center border border-amber-200/60 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-amber-950">Buy together</div>
                    <div className="text-[10px] text-slate-600">Save more</div>
                    <button
                      onClick={() => router.push("/customers/discover")}
                      className="mt-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <span>View Bundles</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/80 overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&auto=format&fit=crop&q=80"
                      alt="Bag"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Integrated "Chat with Berry" Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[460px]">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-base shadow-sm">
                      🫐
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Chat with Berry</h3>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online</span>
                  </span>
                </div>

                {/* Subtitle Message */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tell me what you need. I'll handle the rest — from finding the best options to getting it for you.
                </p>

                {/* Suggestion Prompt Chips */}
                <div className="space-y-2 pt-1">
                  {[
                    "Find running shoes under ₹7,000",
                    "Compare iPhone 15 and 16",
                    "Get me a birthday gift for my sister",
                    "Show me today's best deals",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full p-2.5 rounded-2xl bg-[#FAFAF8] hover:bg-purple-50 text-left text-xs font-medium text-slate-700 hover:text-purple-700 border border-slate-100 transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate">{prompt}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Input Field */}
              <form onSubmit={handleChatSubmit} className="pt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Berry anything..."
                    className="w-full pl-4 pr-12 py-3 rounded-full bg-[#FAFAF8] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
