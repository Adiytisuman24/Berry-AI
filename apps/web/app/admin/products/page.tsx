"use client";

import React, { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([
          { id: "p1", title: "Aether Sound Pro", price: 14999, category: "Audio", stock: 12, rating: 4.8 },
          { id: "p2", title: "Nimbus Cloud Running Shoe", price: 6499, category: "Footwear", stock: 8, rating: 4.7 },
          { id: "p3", title: "Chronos Carbon Watch", price: 18999, category: "Wearables", stock: 5, rating: 4.9 },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Universal Indexed Catalog</h1>
          <p className="text-sm text-black/50 mt-1">Cross-merchant SKU directory searchable by autonomous AI buying agents.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/[0.05] flex justify-between items-center">
          <h2 className="font-bold text-base text-black">Indexed SKUs</h2>
          <span className="text-xs text-black/40">{products.length} live items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 text-black/40 font-semibold border-b border-black/[0.05]">
                <th className="py-3.5 px-5">SKU ID</th>
                <th className="py-3.5 px-5">Product Title</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Price (INR)</th>
                <th className="py-3.5 px-5">Live Stock</th>
                <th className="py-3.5 px-5">Agent Affinity</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-black/80 font-medium">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-black/40">{p.id}</td>
                  <td className="py-3.5 px-5 font-bold text-black">{p.title}</td>
                  <td className="py-3.5 px-5 text-black/60">{p.category}</td>
                  <td className="py-3.5 px-5 font-bold text-black">₹{Number(p.price).toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-5 font-mono">{p.stock} units</td>
                  <td className="py-3.5 px-5">
                    <span className="text-emerald-600 font-bold">⭐ {p.rating || 4.8} / 5.0</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Discoverable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
