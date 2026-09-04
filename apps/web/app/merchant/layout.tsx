"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Boxes,
  ShoppingBag,
  Users,
  BarChart3,
  TrendingUp,
  Share2,
  Bot,
  CreditCard,
  Settings,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Store,
  User,
  Cpu,
  ArrowUpRight,
  Send,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: any;
  href: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "HOME",
    items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/merchant" }],
  },
  {
    title: "COMMERCE",
    items: [
      { label: "Products", icon: Package, href: "/merchant/products" },
      { label: "Add Product", icon: PlusCircle, href: "/merchant/add-product" },
      { label: "Inventory", icon: Boxes, href: "/merchant/inventory" },
      { label: "Orders", icon: ShoppingBag, href: "/merchant/orders" },
      { label: "Customers", icon: Users, href: "/merchant/customers" },
    ],
  },
  {
    title: "GROWTH",
    items: [
      { label: "Growth with Berry", icon: TrendingUp, href: "/merchant/growth", badge: "New" },
      { label: "Analytics", icon: BarChart3, href: "/merchant/analytics" },
    ],
  },
  {
    title: "DISTRIBUTION",
    items: [
      { label: "Connectors", icon: Share2, href: "/merchant/connectors" },
      { label: "Agent Access", icon: Bot, href: "/merchant/agent-access" },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Payouts", icon: CreditCard, href: "/merchant/payouts" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Store Settings", icon: Settings, href: "/merchant/settings" },
      { label: "Berry Permissions", icon: ShieldCheck, href: "/merchant/permissions" },
    ],
  },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { sender: "berry", text: "Hello! I'm your Berry Merchant Intelligence Agent. I'm actively monitoring your conversion rates and inventory levels." },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    const userText = chatMsg;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatMsg("");

    setTimeout(() => {
      let reply = "Based on your active catalog, running shoes have a 31% attach rate with performance socks. I recommend keeping stock above 15 units.";
      if (userText.toLowerCase().includes("sales") || userText.toLowerCase().includes("increase")) {
        reply = "You can activate the 3 automated growth opportunities under 'Growth with Berry' to boost monthly AI-assisted GMV by estimated ₹26,300.";
      }
      setMessages((prev) => [...prev, { sender: "berry", text: reply }]);
    }, 600);
  };

  return (
    <div className="flex h-screen bg-[#F7F8FC] text-[#111111] font-sans antialiased overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-black/[0.07] flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍇</span>
            <div>
              <div className="font-black text-base tracking-tight text-black leading-tight">berry</div>
              <div className="text-[10px] text-black/40 font-medium leading-tight">Merchant OS</div>
            </div>
          </div>
          <p className="text-[10px] text-black/40 mt-1.5 italic">Sell Smarter. Reach Further.</p>
        </div>

        {/* Nav with Section Groups */}
        <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-black tracking-wider text-black/40 uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/merchant" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all group ${
                        isActive
                          ? "bg-[#5B4DFB]/10 text-[#5B4DFB] font-bold"
                          : "text-black/60 hover:bg-black/[0.04] hover:text-black font-medium"
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isActive ? "text-[#5B4DFB]" : "text-black/50 group-hover:text-black"
                        }`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-[#5B4DFB] text-white px-1.5 py-0.5 rounded-full font-black uppercase">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Store info */}
        <div className="border-t border-black/[0.06] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#5B4DFB] text-white text-xs font-black flex items-center justify-center">
            R
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-black leading-tight truncate">Runner.co</div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-black/50 font-medium">Catalog Synced</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Universal Cross-Portal Top Bar */}
        <header className="h-14 bg-white border-b border-black/[0.07] px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-black/40 font-semibold uppercase tracking-wider">Switch Portal:</span>
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
              <Link
                href="/customers"
                className="px-2.5 py-1 text-xs font-semibold rounded-lg text-black/60 hover:text-black hover:bg-white transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-black/50" />
                <span>Customer</span>
              </Link>
              <Link
                href="/merchant"
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-[#5B4DFB] shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-[#5B4DFB]" />
                <span>Merchant</span>
              </Link>
              <Link
                href="/admin"
                className="px-2.5 py-1 text-xs font-semibold rounded-lg text-black/60 hover:text-black hover:bg-white transition-all flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-black/50" />
                <span>Admin</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-black/60 hover:text-black flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-all"
            >
              <span>🫐 3-in-1 Platform Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Razorpay Live Sync</span>
            </div>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Right AI Sales Assistant Panel */}
      <aside className="w-72 flex-shrink-0 bg-white border-l border-black/[0.07] flex flex-col h-full hidden lg:flex">
        <div className="px-5 pt-5 pb-3 border-b border-black/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🫐</span>
              <span className="text-sm font-bold text-black">AI Merchant Copilot</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
              Active
            </span>
          </div>
          <p className="text-[11px] text-black/40 mt-1">Growth &amp; inventory optimization</p>
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-3 border-b border-black/[0.06] space-y-1.5">
          <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Quick Inquiries:</div>
          {[
            "How can I increase my sales?",
            "Which products are trending?",
            "Create a discount campaign",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setChatMsg(prompt)}
              className="w-full text-left text-xs text-black/70 hover:text-[#5B4DFB] hover:bg-[#5B4DFB]/5 px-2.5 py-1.5 rounded-lg transition-all"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl ${
                m.sender === "user"
                  ? "bg-black text-white ml-4 rounded-tr-xs"
                  : "bg-neutral-100 text-black/80 mr-2 rounded-tl-xs"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Chat input */}
        <form onSubmit={handleSendChat} className="p-3 border-t border-black/[0.06]">
          <div className="flex items-center gap-1.5 bg-neutral-100 border border-black/[0.08] rounded-xl px-3 py-1.5 focus-within:border-[#5B4DFB] focus-within:bg-white transition-all">
            <input
              type="text"
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              placeholder="Ask Merchant Copilot..."
              className="flex-1 bg-transparent text-xs text-black placeholder:text-black/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatMsg.trim()}
              className="p-1 rounded-lg bg-[#5B4DFB] hover:bg-[#4839EB] disabled:opacity-30 text-white transition-all"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
