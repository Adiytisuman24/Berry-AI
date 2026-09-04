"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = "http://localhost:8080";

export default function MerchantProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/products`);
      if (res.ok) setProducts(await res.json());
    } catch {}
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Products</h1>
          <p className="text-sm text-black/50 mt-0.5">{products.length} active products in your catalog</p>
        </div>
        <Link href="/merchant/add-product" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-black/80 transition-all shadow-sm">
          <span>＋</span> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 bg-[#F7F8FC] border border-black/[0.08] rounded-xl px-4 py-2.5">
            <span className="text-black/30">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent focus:outline-none text-black/70 placeholder:text-black/30"
            />
          </div>
          <button onClick={fetchProducts} className="px-4 py-2.5 bg-[#F7F8FC] border border-black/[0.08] rounded-xl text-sm font-bold hover:bg-black/[0.04] transition-all">
            Refresh
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-black/40 uppercase tracking-wider border-b border-black/[0.06]">
              <th className="text-left pb-3">Product</th>
              <th className="text-left pb-3">Price</th>
              <th className="text-left pb-3">Stock</th>
              <th className="text-left pb-3">Rating</th>
              <th className="text-left pb-3">Berry Status</th>
              <th className="text-left pb-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[#F7F8FC] transition-all">
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F8FC] border border-black/[0.06] flex items-center justify-center text-xl">👟</div>
                    <div>
                      <div className="font-bold text-black text-sm">{p.name}</div>
                      <div className="text-xs text-black/40">{p.category}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 font-bold text-black">₹{p.price?.toLocaleString("en-IN")}</td>
                <td className="py-3.5">
                  <span className={`text-xs font-bold ${p.inventory > 10 ? "text-emerald-600" : p.inventory > 0 ? "text-amber-600" : "text-red-600"}`}>
                    {p.inventory} units
                  </span>
                </td>
                <td className="py-3.5 text-xs font-bold text-amber-600">★ {p.rating || 4.8}</td>
                <td className="py-3.5">
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full">
                    ✓ AI Ready
                  </span>
                </td>
                <td className="py-3.5">
                  <button className="text-xs text-[#5B4DFB] font-bold hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-black/40">
            <div className="text-4xl mb-2">📦</div>
            <p className="font-bold">No products yet</p>
            <Link href="/merchant/add-product" className="text-sm text-[#5B4DFB] font-bold mt-2 inline-block">Add your first product →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
