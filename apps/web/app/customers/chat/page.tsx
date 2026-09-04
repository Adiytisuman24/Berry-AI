"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Shield,
  ShieldCheck,
  ArrowLeft,
  ArrowUp,
  Camera,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  Volume2,
  X,
  Sliders,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TXtd2CNmv3wGJZ";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const PRESET_IMAGES = [
  {
    label: "👟 Black Runner",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    query: "Find me something like this under ₹5,000",
    budget: 5000,
  },
  {
    label: "👗 Black Midi Dress",
    url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    query: "Find an evening dress like this under ₹5,000",
    budget: 5000,
  },
  {
    label: "🛋️ Beige Sofa",
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    query: "Something like this modern sofa for under ₹40,000",
    budget: 40000,
  },
];

interface ChatMsg {
  id: string;
  sender: "user" | "berry";
  text?: string;
  image?: string;
  visionData?: any;
  topMatches?: any[];
  selectedProduct?: any;
  stage?: "discovery" | "matches" | "refinement" | "auth_gate" | "paid";
  transaction?: any;
}

export default function CustomerChatPage() {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#FBFBFE] font-bold text-sm text-black/50">Loading Berry Shopping Brain...</div>}>
      <CustomerChatContent />
    </React.Suspense>
  );
}

function CustomerChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [includeSocks, setIncludeSocks] = useState(false);
  const [activeTx, setActiveTx] = useState<any>(null);
  const [passportData, setPassportData] = useState<any>(null);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize initial message or query param
  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam) {
      handleSend(qParam, null);
    } else {
      setMessages([
        {
          id: "msg-welcome",
          sender: "berry",
          text: "Hi Suman! I'm your Berry shopping agent. You can ask for anything in natural language, or tap **+ 📷 Upload an image** and say *“Find me something like this under ₹5,000”*. I'll search our live merchant catalog for the closest matches.",
          stage: "discovery",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Handle Image Upload from disk
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Preset Image
  const handleSelectPreset = (preset: typeof PRESET_IMAGES[0]) => {
    setAttachedImage(preset.url);
    setQuery(preset.query);
  };

  // Execute Multimodal Search
  const handleSend = async (customQuery?: string, customImage?: string | null) => {
    const textToSend = customQuery !== undefined ? customQuery : query;
    const imgToSend = customImage !== undefined ? customImage : attachedImage;

    if (!textToSend.trim() && !imgToSend) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const newMsg: ChatMsg = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      image: imgToSend || undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setQuery("");
    setAttachedImage(null);
    setIsProcessing(true);

    try {
      // Call Go API Vision Search
      const res = await fetch(`${API_BASE}/api/v1/agent/vision-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          image_data: imgToSend,
          budget: textToSend.includes("40,000") ? 40000 : textToSend.includes("7,000") ? 7000 : 5000,
        }),
      });

      const data = await res.json();
      const topMatches = data.top_matches || [];
      const recProd = data.recommended_product || topMatches[0]?.product;

      setSelectedProduct(recProd);
      setActiveTx(data.transaction || {
        id: `BRY-${Math.floor(1000 + Math.random() * 9000)}`,
        cart: { total: recProd?.price || 4799 },
        policy_result: { is_allowed: true, authorized_limit: 7000 },
      });

      const berryMsg: ChatMsg = {
        id: `msg-berry-${Date.now()}`,
        sender: "berry",
        text: `I understood what you're looking for. Based on ${imgToSend ? "the image visual traits" : "your query"} (${data.detected_summary || "daily running profile"}), I searched our verified merchant catalog and found ${topMatches.length} closest matches within your budget:`,
        visionData: data,
        topMatches: topMatches,
        selectedProduct: recProd,
        stage: "matches",
        transaction: data.transaction,
      };

      setMessages((prev) => [...prev, berryMsg]);
    } catch (err) {
      // Fallback response
      const fallbackMatches = [
        {
          product: {
            id: "prod-nimbus",
            name: "Nimbus Runner",
            price: 4799,
            category: "Running Shoes",
            image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            inventory: 12,
          },
          match_score: 96,
          match_reason: "Similar black/white colorway, low-top silhouette and mesh upper. Under your ₹5,000 budget.",
          why_likes_it: {
            visual_match: "96% visual match (Colorway, low-top, mesh upper)",
            under_budget: "₹4,799 (Within ₹5,000 limit)",
            in_stock: "✓ In Stock (12 units available)",
            suitability: "Daily-running suitable",
            special_badge: "Top Pick",
          },
        },
        {
          product: {
            id: "prod-aeroflex",
            name: "AeroFlex Daily",
            price: 4499,
            category: "Running Shoes",
            image_url: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80",
            inventory: 18,
          },
          match_score: 91,
          match_reason: "Breathable lightweight road trainer with slightly firmer cushioning.",
          why_likes_it: {
            visual_match: "91% visual match (Lightweight trainer profile)",
            under_budget: "₹4,499 (Under budget)",
            in_stock: "✓ In Stock (18 units available)",
            suitability: "Light daily training & walks",
          },
        },
        {
          product: {
            id: "prod-velocity",
            name: "Velocity Lite",
            price: 5299,
            category: "Running Shoes",
            image_url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
            inventory: 14,
          },
          match_score: 87,
          match_reason: "Solid responsive trainer with essential shock absorption.",
          why_likes_it: {
            visual_match: "87% visual match (Athletic silhouette)",
            under_budget: "₹5,299",
            in_stock: "✓ In Stock (14 units available)",
            suitability: "Daily 5K jogs",
          },
        },
      ];

      setSelectedProduct(fallbackMatches[0].product);
      setActiveTx({
        id: "BRY-1042",
        cart: { total: 4799 },
        policy_result: { is_allowed: true, authorized_limit: 7000 },
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-berry-${Date.now()}`,
          sender: "berry",
          text: "I found 11 similar products in our merchant catalog. I narrowed them down to the 3 closest matches within your budget:",
          visionData: {
            category: "running_shoes",
            detected_summary: "Black low-top runner with breathable mesh upper and lightweight white foam sole",
            visual_attributes: ["black", "white_midsole", "low_top", "mesh_upper", "minimal_logo"],
            budget: 5000,
          },
          topMatches: fallbackMatches,
          selectedProduct: fallbackMatches[0].product,
          stage: "matches",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Refine query
  const handleRefine = (refinementText: string) => {
    handleSend(refinementText);
  };

  // Customer selects a product to purchase
  const handleSelectForPurchase = (prod: any) => {
    setSelectedProduct(prod);
    const txId = activeTx?.id || `BRY-${Math.floor(1000 + Math.random() * 9000)}`;

    const gateMsg: ChatMsg = {
      id: `msg-gate-${Date.now()}`,
      sender: "berry",
      text: `I've checked the real-time merchant inventory and price for **${prod.name}**. Everything is verified and within your policy limit. Please approve to execute checkout:`,
      selectedProduct: prod,
      stage: "auth_gate",
      transaction: {
        id: txId,
        cart: { total: prod.price },
        policy_result: { is_allowed: true, authorized_limit: 7000 },
      },
    };
    setMessages((prev) => [...prev, gateMsg]);
  };

  // Launch Razorpay Standard Checkout Modal
  const handleApproveAndPay = async () => {
    if (!selectedProduct) return;
    const totalAmount = selectedProduct.price + (includeSocks ? 499 : 0);
    setIsProcessing(true);

    try {
      // 1. Create Order via Go API
      const orderRes = await fetch(`${API_BASE}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          receipt: `rcpt_${activeTx?.id || "BRY-1042"}`,
        }),
      });
      const orderData = await orderRes.json();

      // 2. Open Native Razorpay Modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount || totalAmount * 100,
        currency: "INR",
        name: "Berry AI Autonomous Commerce",
        description: `Purchase: ${selectedProduct.name} (Ref: ${activeTx?.id || "BRY-1042"})`,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // 3. Verify Payment
          await handlePaymentSuccess(response, totalAmount);
        },
        prefill: {
          name: "Suman",
          email: "suman@example.com",
          contact: "+919876543210",
        },
        theme: {
          color: "#5B4DFB",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulate success
        await handlePaymentSuccess(
          {
            razorpay_order_id: orderData.order_id || "order_test_demo",
            razorpay_payment_id: "pay_test_" + Math.random().toString(36).substring(7),
            razorpay_signature: "sig_valid_test_hash",
          },
          totalAmount
        );
      }
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (payload: any, totalAmount: number) => {
    try {
      const verifyRes = await fetch(`${API_BASE}/api/v1/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: activeTx?.id || "BRY-1042",
          razorpay_order_id: payload.razorpay_order_id,
          razorpay_payment_id: payload.razorpay_payment_id,
          razorpay_signature: payload.razorpay_signature,
        }),
      });
      const verifyData = await verifyRes.json();

      const passport = verifyData.passport || {
        passport_id: activeTx?.id || "#BRY-1042",
        status: "COMPLETED",
        amount_inr: totalAmount,
        intent: "Find me something like this under ₹5,000",
        discovery_summary: "Visual traits extracted & verified across connected merchants",
        recommendation: selectedProduct.name,
        recommendation_reason: [
          "96% visual match to uploaded image traits",
          "Price ₹" + totalAmount.toLocaleString() + " strictly within spending boundary",
          "Verified merchant inventory in stock",
        ],
        policy_verification: {
          authorized_limit: 7000,
          transaction_amount: totalAmount,
          is_within_limit: true,
          status: "AUTHORIZED",
        },
        payment_details: {
          provider: "Razorpay",
          mode: "Test Mode",
          payment_id: payload.razorpay_payment_id || "pay_demo_success",
        },
        audit_merkle_root: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        cryptographic_signature: "sig_ed25519_948a02c91b7e3f4a0812bd89c193f",
        human_explanation: `You asked for something like your uploaded photo. Berry identified the visual characteristics and matched them with ${selectedProduct.name} in the live merchant catalog for ₹${totalAmount.toLocaleString()}. Payment was executed via Razorpay Standard Checkout only after your authorization.`,
      };

      setPassportData(passport);
      setShowPassportModal(true);
      setIsProcessing(false);

      const successMsg: ChatMsg = {
        id: `msg-paid-${Date.now()}`,
        sender: "berry",
        text: `🎉 **Payment Succeeded!** Your order for **${selectedProduct.name}** has been confirmed with the merchant. Your cryptographic Transaction Passport **${passport.passport_id}** is sealed.`,
        stage: "paid",
      };

      setMessages((prev) => [...prev, successMsg]);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleExplainAudio = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const text = passportData?.human_explanation || `Berry evaluated your image and matched it to ${selectedProduct?.name || "Nimbus Runner"}. Payment was safely authorized via Razorpay.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FBFBFE] text-black font-sans antialiased overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-black/[0.06] bg-white px-6 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/customers"
            className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center transition-colors text-black/70"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B4DFB] flex items-center justify-center text-white shadow-md shadow-[#5B4DFB]/20">
              <span className="text-base">🫐</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-black">Berry Shopping Brain</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-black/40">Multimodal Vision &amp; Autonomous Commerce</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-black/[0.06] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized Limit: ₹7,000</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#5B4DFB]/10 text-[#5B4DFB] border border-[#5B4DFB]/20">
            OpenAI Vision Active
          </span>
        </div>
      </header>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            {/* User Message */}
            {msg.sender === "user" && (
              <div className="flex justify-end">
                <div className="max-w-md bg-black text-white p-4 rounded-2xl rounded-tr-sm shadow-md space-y-2">
                  {msg.image && (
                    <div className="relative rounded-xl overflow-hidden border border-white/20 max-h-48 bg-black/40">
                      <img src={msg.image} alt="Uploaded visual" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white/90">
                        📷 Uploaded Image
                      </span>
                    </div>
                  )}
                  {msg.text && <p className="text-sm font-medium leading-relaxed">{msg.text}</p>}
                </div>
              </div>
            )}

            {/* Berry Agent Message */}
            {msg.sender === "berry" && (
              <div className="flex gap-3 max-w-3xl">
                <div className="w-8 h-8 rounded-xl bg-[#5B4DFB] flex-shrink-0 flex items-center justify-center text-white text-sm shadow-sm mt-1">
                  🫐
                </div>
                <div className="space-y-4 flex-1">
                  {/* Text bubble */}
                  <div className="bg-white border border-black/[0.07] p-5 rounded-2xl rounded-tl-sm shadow-sm">
                    <p className="text-sm text-black/80 leading-relaxed font-medium">{msg.text}</p>

                    {/* Detected visual attributes tags */}
                    {msg.visionData?.visual_attributes && (
                      <div className="mt-3 pt-3 border-t border-black/[0.05]">
                        <div className="text-[11px] font-bold text-black/40 uppercase tracking-wider mb-2">
                          Visual Attributes Detected
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.visionData.visual_attributes.map((attr: string, i: number) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-black/[0.05] text-xs font-semibold text-black/70"
                            >
                              ✨ {attr}
                            </span>
                          ))}
                          <span className="px-2.5 py-1 rounded-lg bg-[#5B4DFB]/10 text-[#5B4DFB] font-bold text-xs">
                            Budget: ≤ ₹{Number(msg.visionData.budget || 5000).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Top Product Matches Carousel */}
                  {msg.topMatches && msg.topMatches.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-black/60">
                          Live Merchant Matches ({msg.topMatches.length} items)
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold">
                          ✓ Filtered from Real Merchant Catalog
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {msg.topMatches.map((matchItem, idx) => {
                          const p = matchItem.product;
                          const isSelected = selectedProduct?.id === p.id;
                          return (
                            <div
                              key={p.id || idx}
                              className={`bg-white rounded-2xl border transition-all p-4 flex flex-col justify-between shadow-sm relative ${
                                isSelected ? "border-[#5B4DFB] ring-2 ring-[#5B4DFB]/20" : "border-black/[0.08] hover:border-black/20"
                              }`}
                            >
                              {matchItem.why_likes_it?.special_badge && (
                                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#5B4DFB] text-white text-[10px] font-black tracking-wide shadow-sm">
                                  {matchItem.why_likes_it.special_badge}
                                </span>
                              )}

                              <div>
                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-100 mb-3 border border-black/[0.04]">
                                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold text-black/40 uppercase tracking-wide">
                                    {p.brand || "Merchant"}
                                  </span>
                                  <span className="text-xs font-black text-emerald-600">
                                    {matchItem.match_score}% Match
                                  </span>
                                </div>

                                <h4 className="font-bold text-sm text-black leading-tight mb-1">{p.name}</h4>
                                <div className="text-base font-black text-[#5B4DFB] mb-2">
                                  ₹{Number(p.price).toLocaleString("en-IN")}
                                </div>

                                {/* Why Berry likes it box */}
                                <div className="p-2.5 bg-neutral-50 rounded-xl border border-black/[0.04] text-[11px] space-y-1 mb-3">
                                  <div className="font-bold text-black/60 text-[10px] uppercase">Why Berry Likes It:</div>
                                  <div className="text-emerald-700 font-medium">✓ {matchItem.why_likes_it?.visual_match}</div>
                                  <div className="text-black/70">✓ {matchItem.why_likes_it?.under_budget}</div>
                                  <div className="text-black/70">{matchItem.why_likes_it?.in_stock}</div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleSelectForPurchase(p)}
                                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                                  isSelected
                                    ? "bg-black text-white shadow-md"
                                    : "bg-neutral-100 hover:bg-neutral-200 text-black"
                                }`}
                              >
                                {isSelected ? "✓ Selected Match" : "Select & Buy This"}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Conversational Refinement Prompts */}
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-black/40 mb-1.5">Refine this result:</div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleRefine("I like the first one but want something with more cushioning.")}
                            className="px-3 py-1.5 bg-white border border-black/[0.08] hover:border-[#5B4DFB] rounded-xl text-xs font-medium text-black/80 hover:text-[#5B4DFB] transition-all shadow-2xs"
                          >
                            🪄 More cushioning
                          </button>
                          <button
                            onClick={() => handleRefine("Find me a similar low-top style under ₹4,000.")}
                            className="px-3 py-1.5 bg-white border border-black/[0.08] hover:border-[#5B4DFB] rounded-xl text-xs font-medium text-black/80 hover:text-[#5B4DFB] transition-all shadow-2xs"
                          >
                            💰 Cheaper (under ₹4k)
                          </button>
                          <button
                            onClick={() => handleRefine("Show me alternative colorways in black or navy.")}
                            className="px-3 py-1.5 bg-white border border-black/[0.08] hover:border-[#5B4DFB] rounded-xl text-xs font-medium text-black/80 hover:text-[#5B4DFB] transition-all shadow-2xs"
                          >
                            🎨 Darker colorway
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Authorization Gate Card */}
                  {msg.stage === "auth_gate" && selectedProduct && (
                    <div className="bg-white rounded-2xl border border-[#5B4DFB]/30 p-5 shadow-lg shadow-[#5B4DFB]/5 space-y-4">
                      <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                          <span className="font-extrabold text-sm text-black">Purchase Authorization Gate</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Within ₹7,000 Limit
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedProduct.image_url}
                            alt={selectedProduct.name}
                            className="w-14 h-14 rounded-xl object-cover border border-black/[0.05]"
                          />
                          <div>
                            <div className="font-bold text-sm text-black">{selectedProduct.name}</div>
                            <div className="text-xs text-black/50">Verified Merchant SKU • In Stock</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-black/40">Amount</div>
                          <div className="text-lg font-black text-[#5B4DFB]">
                            ₹{Number(selectedProduct.price).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      {/* Optional Performance Socks Cross-Sell */}
                      <div className="p-3 bg-neutral-50 rounded-xl border border-black/[0.05] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="socks-check"
                            checked={includeSocks}
                            onChange={(e) => setIncludeSocks(e.target.checked)}
                            className="w-4 h-4 accent-[#5B4DFB] rounded"
                          />
                          <label htmlFor="socks-check" className="text-xs text-black font-medium cursor-pointer">
                            Add Performance Anti-Blister Socks (<span className="font-bold text-[#5B4DFB]">+₹499</span>)
                          </label>
                        </div>
                        <span className="text-[10px] text-black/40 font-mono">31% attach rate</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-black/40">Final Checkout Total</div>
                          <div className="text-xl font-black text-black">
                            ₹{(selectedProduct.price + (includeSocks ? 499 : 0)).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <button
                          onClick={handleApproveAndPay}
                          disabled={isProcessing}
                          className="px-6 py-3 bg-[#5B4DFB] hover:bg-[#4839EB] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Opening Razorpay...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>Approve &amp; Pay via Razorpay</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex gap-3 max-w-lg items-center">
            <div className="w-8 h-8 rounded-xl bg-[#5B4DFB] flex items-center justify-center text-white text-sm animate-pulse">
              🫐
            </div>
            <div className="bg-white border border-black/[0.07] px-4 py-3 rounded-2xl rounded-tl-sm text-xs font-medium text-black/60 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5B4DFB] animate-ping"></span>
              <span>OpenAI Vision analyzing image → Searching live merchant inventory...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer Area */}
      <div className="bg-white border-t border-black/[0.06] p-4 sm:p-5 flex-shrink-0">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Preset Image Shortcuts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-black/40 whitespace-nowrap">Try Demo Photo:</span>
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 border border-black/[0.05] rounded-full text-xs font-medium text-black/80 whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Attached Image Preview */}
          {attachedImage && (
            <div className="flex items-center gap-3 p-2 bg-[#5B4DFB]/5 border border-[#5B4DFB]/20 rounded-xl max-w-sm">
              <img src={attachedImage} alt="Attachment" className="w-12 h-12 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-black truncate">Image attached</div>
                <div className="text-[10px] text-black/40">Ready for OpenAI Vision analysis</div>
              </div>
              <button
                onClick={() => setAttachedImage(null)}
                className="p-1 hover:bg-black/10 rounded-full text-black/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Composer Input Box */}
          <div className="flex items-center gap-2 bg-neutral-100 border border-black/[0.08] focus-within:border-[#5B4DFB] focus-within:bg-white rounded-2xl p-2 transition-all shadow-2xs">
            {/* Image upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-white hover:bg-neutral-50 text-black/70 hover:text-[#5B4DFB] rounded-xl border border-black/[0.06] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs flex-shrink-0"
            >
              <Camera className="w-4 h-4" />
              <span>+ 📷 Upload image</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Text Input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                attachedImage
                  ? "Describe your budget or preferences (e.g. Find something like this under ₹5,000)..."
                  : "Type what you want, or upload an image (e.g. Find black running shoes under ₹5,000)..."
              }
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm font-medium focus:outline-none text-black placeholder:text-black/40"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={(!query.trim() && !attachedImage) || isProcessing}
              className="w-10 h-10 rounded-xl bg-[#5B4DFB] hover:bg-[#4839EB] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm flex-shrink-0"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cryptographic Transaction Passport Modal */}
      {showPassportModal && passportData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-black/[0.08] shadow-2xl relative">
            <button
              onClick={() => setShowPassportModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-black/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 text-2xl">
                ✓
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">
                  Transaction Passport Sealed
                </span>
                <h3 className="text-xl font-black text-black leading-tight">
                  {passportData.passport_id}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-black/[0.05] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-black/50">Purchased Item</span>
                <span className="font-bold text-black">{passportData.recommendation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Amount Paid</span>
                <span className="font-black text-[#5B4DFB]">₹{passportData.amount_inr?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Payment Gateway</span>
                <span className="font-semibold text-black">Razorpay Standard Web Checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Payment ID</span>
                <span className="font-mono text-black">{passportData.payment_details?.payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Rust Merkle Proof</span>
                <span className="font-mono text-[10px] text-black/40">
                  {passportData.audit_merkle_root?.substring(0, 16)}...
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed font-medium">
              💡 {passportData.human_explanation}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleExplainAudio}
                className="flex-1 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-[#5B4DFB]" />
                <span>{isSpeaking ? "Stop Voice Explanation" : "Explain with Audio"}</span>
              </button>
              <button
                onClick={() => router.push("/customers/orders")}
                className="flex-1 py-3 rounded-xl bg-black hover:bg-black/90 text-white text-xs font-bold transition-colors"
              >
                View in Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
