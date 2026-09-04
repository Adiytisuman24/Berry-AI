"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Check,
  Save,
  ArrowLeft,
  Key,
  Flame,
} from "lucide-react";

export default function MerchantPermissionsPage() {
  const [maxDiscountPercent, setMaxDiscountPercent] = useState(20);
  const [requireCustomerOtp, setRequireCustomerOtp] = useState(true);
  const [allowAiListingUpdates, setAllowAiListingUpdates] = useState(true);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/merchant" className="text-neutral-400 hover:text-neutral-700 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">Berry Permissions</h1>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Configure autonomous boundaries, financial policies, and agentic authorization guardrails.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-[#5B4DFB] hover:bg-[#4a3cf0] text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Permissions</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Berry agent permissions updated and synced to Policy Engine!</span>
        </div>
      )}

      {/* Emergency Kill Switch */}
      <div className="bg-red-50/60 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Flame className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-red-950">Emergency Kill Switch (Circuit Breaker)</div>
            <p className="text-xs text-red-800/80 mt-0.5">
              Instantly pause all incoming AI buyer queries and external connector syncing across Amazon, Flipkart, and MCP.
            </p>
          </div>
        </div>

        <button
          onClick={() => setEmergencyStop(!emergencyStop)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            emergencyStop
              ? "bg-red-600 text-white shadow-md animate-pulse"
              : "bg-white border border-red-300 text-red-700 hover:bg-red-50"
          }`}
        >
          {emergencyStop ? "CIRCUIT TRIPPED (PAUSED)" : "Arm Kill Switch"}
        </button>
      </div>

      {/* Permission Cards */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 divide-y divide-neutral-100 shadow-2xs">
        {/* 1. Customer Payment Authorization */}
        <div className="p-6 flex items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-neutral-900 text-sm">Mandatory Customer Payment Authorization</h3>
            </div>
            <p className="text-xs text-neutral-500">
              When an AI agent assembles a cart or initiates checkout, the final Razorpay charge ALWAYS requires
              explicit OTP verification or UPI PIN approval from the human customer.
            </p>
          </div>
          <input
            type="checkbox"
            checked={requireCustomerOtp}
            onChange={(e) => setRequireCustomerOtp(e.target.checked)}
            className="rounded text-[#5B4DFB] w-4 h-4 mt-1 cursor-pointer"
          />
        </div>

        {/* 2. Autonomous Discount Guardrail */}
        <div className="p-6 flex items-start justify-between gap-6">
          <div className="space-y-1 flex-1 max-w-lg">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#5B4DFB]" />
              <h3 className="font-bold text-neutral-900 text-sm">Agent Discount Ceiling</h3>
            </div>
            <p className="text-xs text-neutral-500">
              Maximum promotional or bundle discount the Berry conversational engine can offer during live customer bargaining.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="40"
                value={maxDiscountPercent}
                onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
                className="w-48 accent-[#5B4DFB]"
              />
              <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded">
                Max {maxDiscountPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* 3. Cross-Channel Automated Updates */}
        <div className="p-6 flex items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <h3 className="font-bold text-neutral-900 text-sm">Auto-Propagate Verified Product Edits</h3>
            </div>
            <p className="text-xs text-neutral-500">
              When product prices or stock change in Berry, automatically push updates to Amazon, Flipkart, and Myntra connectors via Kafka.
            </p>
          </div>
          <input
            type="checkbox"
            checked={allowAiListingUpdates}
            onChange={(e) => setAllowAiListingUpdates(e.target.checked)}
            className="rounded text-[#5B4DFB] w-4 h-4 mt-1 cursor-pointer"
          />
        </div>

        {/* 4. Payment Rail Scopes */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-neutral-700" />
            <h3 className="font-bold text-neutral-900 text-sm">Razorpay Integration Scopes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-800">orders.create</div>
                <div className="text-[10px] text-neutral-400">Initialize checkout orders</div>
              </div>
              <span className="text-emerald-600 font-bold">Active</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-800">payments.verify</div>
                <div className="text-[10px] text-neutral-400">Cryptographic signature check</div>
              </div>
              <span className="text-emerald-600 font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
