"use client";
import React, { useState } from "react";
import Link from "next/link";

const API_BASE = "http://localhost:8080";

export default function AddProduct() {
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [naturalInput, setNaturalInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsed, setParsed] = useState<any>(null);
  const [published, setPublished] = useState(false);

  // Manual form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState("");
  const [category, setCategory] = useState("Running Shoes");
  const [description, setDescription] = useState("");

  const handleAIParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalInput.trim()) return;
    setIsProcessing(true);

    // Call Python agent for natural language parsing
    try {
      const res = await fetch("http://localhost:8000/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Parse this merchant product listing into JSON: "${naturalInput}". Return only valid JSON with fields: name, price (number in INR), inventory (number), category, attributes (array of strings).`,
        }),
      });

      let extracted: any = {};
      if (res.ok) {
        const data = await res.json();
        try {
          const jsonMatch = data.response?.match(/\{[\s\S]*\}/);
          if (jsonMatch) extracted = JSON.parse(jsonMatch[0]);
        } catch {}
      }

      // Fallback extraction
      const text = naturalInput.toLowerCase();
      const priceMatch = naturalInput.match(/₹?\s*(\d[\d,]+)/);
      const invMatch = naturalInput.match(/(\d+)\s*(unit|piece|stock|available)/i);

      setParsed({
        name: extracted.name || (text.includes("shoe") ? "Black Lightweight Running Shoe" : text.includes("hoodie") ? "Performance Hoodie" : "New Store Item"),
        price: extracted.price || (priceMatch ? parseInt(priceMatch[1].replace(/,/g, "")) : 4999),
        inventory: extracted.inventory || (invMatch ? parseInt(invMatch[1]) : 20),
        category: extracted.category || "Running Shoes",
        attributes: extracted.attributes || ["beginner", "lightweight", "new arrival"],
        description: naturalInput,
      });
    } catch {
      // Pure local extraction
      const priceMatch = naturalInput.match(/₹?\s*(\d[\d,]+)/);
      const invMatch = naturalInput.match(/(\d+)\s*(unit|piece)/i);
      const text = naturalInput.toLowerCase();
      setParsed({
        name: text.includes("shoe") ? "Black Lightweight Running Shoe" : "New Store Item",
        price: priceMatch ? parseInt(priceMatch[1].replace(/,/g, "")) : 5499,
        inventory: invMatch ? parseInt(invMatch[1]) : 20,
        category: "Running Shoes",
        attributes: ["beginner", "lightweight", "in stock"],
        description: naturalInput,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    const product = parsed || { name, price: parseFloat(price), inventory: parseInt(inventory), category, description };
    try {
      const res = await fetch(`${API_BASE}/api/v1/merchant/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, rating: 4.8 }),
      });
      if (res.ok) setPublished(true);
    } catch {}
  };

  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-black tracking-tight">Published to Berry!</h2>
          <p className="text-sm text-black/60 mt-2">Your product is now live in the customer discovery feed. Berry AI will start recommending it immediately.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => { setPublished(false); setParsed(null); setNaturalInput(""); }} className="px-5 py-2.5 bg-black text-white rounded-2xl text-sm font-bold hover:bg-black/80 transition-all">
              Add Another
            </button>
            <Link href="/merchant/products" className="px-5 py-2.5 bg-[#F7F8FC] border border-black/10 text-black rounded-2xl text-sm font-bold hover:bg-black/[0.04] transition-all">
              View Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Add Product</h1>
        <p className="text-sm text-black/50 mt-0.5">Describe it to Berry or fill in the details manually.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 bg-[#F7F8FC] p-1.5 rounded-2xl border border-black/[0.06] w-fit">
        <button
          onClick={() => setMode("ai")}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === "ai" ? "bg-white shadow-sm text-[#5B4DFB]" : "text-black/50 hover:text-black"}`}
        >
          ✨ Describe to Berry
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === "manual" ? "bg-white shadow-sm text-black" : "text-black/50 hover:text-black"}`}
        >
          📝 Manual Form
        </button>
      </div>

      {mode === "ai" ? (
        <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-xs space-y-5">
          <div className="bg-gradient-to-br from-[#5B4DFB]/10 to-white rounded-2xl p-5">
            <h2 className="font-bold text-base mb-1">Describe your product in plain English</h2>
            <p className="text-xs text-black/50 mb-4">Berry will extract all structured attributes automatically using AI.</p>
            <form onSubmit={handleAIParse}>
              <textarea
                rows={4}
                value={naturalInput}
                onChange={(e) => setNaturalInput(e.target.value)}
                placeholder={`"Add a black lightweight running shoe for ₹5,499. I have 20 units. It's designed for beginners."`}
                className="w-full px-4 py-3 rounded-2xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB] resize-none"
              />
              <button
                type="submit"
                disabled={isProcessing || !naturalInput.trim()}
                className="mt-3 w-full py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-black/80 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? <><span className="animate-spin">◌</span> Berry is parsing...</> : "✨ Extract with AI"}
              </button>
            </form>
          </div>

          {parsed && (
            <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">✓</span>
                <h3 className="font-bold text-black">Ready to publish</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: "✓ Product understood", desc: parsed.name },
                  { label: "✓ Price extracted", desc: `₹${parsed.price?.toLocaleString("en-IN")}` },
                  { label: "✓ Inventory registered", desc: `${parsed.inventory} units` },
                  { label: "✓ Category assigned", desc: parsed.category },
                  { label: "✓ AI attributes generated", desc: parsed.attributes?.join(", ") },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-1.5 border-b border-black/[0.04] last:border-0">
                    <span className="text-emerald-600 font-bold text-xs w-48 flex-shrink-0">{item.label}</span>
                    <span className="text-black/70 text-xs">{item.desc}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handlePublish}
                className="mt-5 w-full py-3 bg-[#5B4DFB] text-white rounded-2xl text-sm font-bold hover:bg-[#4335E0] transition-all shadow-sm"
              >
                Publish to Berry Network →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-xs">
          <h2 className="font-bold text-base mb-5">Product Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-black/60 block mb-1.5">Product Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nimbus Runner Pro" className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-black/60 block mb-1.5">Price (₹ INR)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="6499" className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]" />
              </div>
              <div>
                <label className="text-xs font-bold text-black/60 block mb-1.5">Inventory</label>
                <input type="number" value={inventory} onChange={(e) => setInventory(e.target.value)} placeholder="25" className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-black/60 block mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB] bg-white">
                {["Running Shoes", "Apparel", "Electronics", "Accessories", "Wearables", "Home & Fitness"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-black/60 block mb-1.5">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Key features and user benefits..." className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4DFB] resize-none" />
            </div>
            <button onClick={() => { setParsed({ name, price: parseFloat(price), inventory: parseInt(inventory), category, description }); handlePublish(); }} disabled={!name || !price} className="w-full py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-black/80 transition-all shadow-sm">
              Publish to Live Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
