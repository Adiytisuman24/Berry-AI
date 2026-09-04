"use client";
import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

export default function MerchantInventory() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/products`).then(r => r.ok ? r.json() : []).then(setProducts).catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Inventory</h1>
        <p className="text-sm text-black/50 mt-0.5">Live stock levels synchronized across the Berry network.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7F8FC] flex items-center justify-center text-xl">👟</div>
              <div>
                <div className="font-bold text-sm text-black">{p.name}</div>
                <div className="text-xs text-black/40">{p.category}</div>
              </div>
            </div>
            <div className={`text-3xl font-black ${p.inventory > 10 ? "text-emerald-600" : p.inventory > 0 ? "text-amber-600" : "text-red-600"}`}>
              {p.inventory}
            </div>
            <div className="text-xs text-black/50 mt-0.5">units available</div>
            <div className="mt-3 h-2 bg-[#F7F8FC] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${p.inventory > 20 ? "bg-emerald-500" : p.inventory > 5 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${Math.min((p.inventory / 50) * 100, 100)}%` }}
              />
            </div>
            {p.inventory <= 5 && (
              <div className="mt-2 text-[10px] text-red-600 font-bold">⚠ Low stock — reorder soon</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
