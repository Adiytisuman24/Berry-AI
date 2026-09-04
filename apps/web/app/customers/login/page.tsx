"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag, Watch, Headphones, Sparkles, Lock } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav@berry.in");
  const [password, setPassword] = useState("••••••••••••");
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/customers/home");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col lg:flex-row font-sans">
      {/* Left Brand Visual Side */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-purple-50 via-[#FAF5FF] to-white border-r border-slate-100">
        {/* Floating Commerce Objects */}
        <div className="absolute top-12 right-16 w-14 h-14 rounded-2xl bg-white shadow-sm border border-purple-100 flex items-center justify-center text-xl animate-bounce duration-1000">
          👟
        </div>
        <div className="absolute top-1/3 left-10 w-12 h-12 rounded-2xl bg-white shadow-sm border border-purple-100 flex items-center justify-center text-lg animate-pulse">
          🎧
        </div>
        <div className="absolute bottom-24 right-20 w-12 h-12 rounded-2xl bg-white shadow-sm border border-purple-100 flex items-center justify-center text-lg">
          ⌚
        </div>
        <div className="absolute bottom-1/3 right-10 w-10 h-10 rounded-2xl bg-white shadow-sm border border-purple-100 flex items-center justify-center text-base animate-pulse">
          📱
        </div>

        {/* Top Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/20 text-xl">
            🫐
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">berry</span>
            <div className="text-[10px] text-slate-500 font-medium -mt-1">Shop Smarter. Live Bigger.</div>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="my-auto py-12 max-w-md z-10 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 border border-purple-200 flex items-center justify-center text-3xl shadow-sm">
            {isFocused === "password" ? "👀" : isFocused === "email" ? "😊" : "🫐"}
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Your personal shopping agent.
          </h1>

          <p className="text-lg font-handwritten text-purple-700 text-2xl">
            "Find less. Decide better. Live a little more."
          </p>

          <p className="text-slate-500 text-sm leading-relaxed">
            Tell Berry what you want. It searches connected merchants, optimizes the cart, and prepares the checkout. <strong>You decide when money moves.</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 z-10 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Razorpay Secured • Human-Controlled Financial Boundaries</span>
        </div>
      </div>

      {/* Right Form Card Side */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back.
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Continue where you left off.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused("email")}
                onBlur={() => setIsFocused(null)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAF8] border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs text-purple-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused("password")}
                onBlur={() => setIsFocused(null)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAF8] border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            onClick={() => router.push("/customers/home")}
            className="w-full py-3 px-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-slate-500">
            New to Berry?{" "}
            <Link href="/customers/signup" className="text-purple-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
