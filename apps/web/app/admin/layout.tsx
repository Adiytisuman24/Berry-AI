"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Users,
  Store,
  Package,
  CreditCard,
  Bot,
  ShieldCheck,
  ScrollText,
  Cpu,
  BarChart3,
  Settings,
  ArrowUpRight,
  User,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Live Network", icon: Globe, href: "/admin/live-network" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Merchants", icon: Store, href: "/admin/merchants" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Transactions", icon: CreditCard, href: "/admin/transactions" },
  { label: "Agents", icon: Bot, href: "/admin/agents" },
  { label: "Policies", icon: ShieldCheck, href: "/admin/policies" },
  { label: "Events", icon: ScrollText, href: "/admin/events" },
  { label: "Infrastructure", icon: Cpu, href: "/admin/infrastructure" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#F7F8FC] text-[#111111] font-sans antialiased overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-black/[0.07] flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🫐</span>
            <div>
              <div className="font-black text-base tracking-tight text-black leading-tight">berry</div>
              <div className="text-[10px] text-black/40 font-medium leading-tight">Admin Console</div>
            </div>
          </div>
          <p className="text-[10px] text-black/40 mt-2 italic">Observe. Control. Grow.</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                  isActive
                    ? "bg-[#5B4DFB]/10 text-[#5B4DFB] font-bold"
                    : "text-black/60 hover:bg-black/[0.04] hover:text-black font-medium"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#5B4DFB]" : "text-black/50 group-hover:text-black"}`} />
                <span className="flex-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin profile */}
        <div className="border-t border-black/[0.06] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-black flex items-center justify-center">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-black leading-tight truncate">Platform Admin</div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-black/50 font-medium">Cluster Healthy</span>
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
                className="px-2.5 py-1 text-xs font-semibold rounded-lg text-black/60 hover:text-black hover:bg-white transition-all flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-black/50" />
                <span>Merchant</span>
              </Link>
              <Link
                href="/admin"
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-[#5B4DFB] shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-[#5B4DFB]" />
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
              <span>Go :8080 • Rust :8081 • Python :8000</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
