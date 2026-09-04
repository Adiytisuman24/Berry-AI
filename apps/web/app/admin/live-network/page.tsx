"use client";

import React, { useState, useEffect } from "react";


const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminLiveNetwork() {
  const [nodes, setNodes] = useState([
    { id: "NODE-GO-01", service: "Go API Gateway", port: ":8080", status: "Healthy", ping: "4ms", qps: 142, uptime: "99.98%" },
    { id: "NODE-RUST-01", service: "Rust Ledger Engine", port: ":8081", status: "Healthy", ping: "1ms", qps: 310, uptime: "100%" },
    { id: "NODE-PY-01", service: "Python OpenAI Agent", port: ":8000", status: "Healthy", ping: "12ms", qps: 28, uptime: "99.92%" },
    { id: "NODE-WEB-01", service: "Next.js 14 Frontend", port: ":3000", status: "Healthy", ping: "8ms", qps: 220, uptime: "99.99%" },
  ]);

  const [stream, setStream] = useState<string[]>([
    "[15:00:12] Agent #08: Discovered 'Aether Sound Pro' on Store #01",
    "[15:00:19] Policy Engine: Verified spending limit (₹14,999 <= ₹25,000)",
    "[15:00:24] Razorpay Gateway: Created order_Q3w8zKj92Pld with amount ₹14,999",
    "[15:00:31] Rust Ledger: SHA-256 block #1042 minted to chain",
    "[15:00:36] Customer App: WebSocket push notification dispatched to Aarav S.",
  ]);

  useEffect(() => {
    try {
      const es = new EventSource(`${API_BASE}/api/v1/events/stream`);
      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          const time = new Date().toLocaleTimeString();
          let logLine = `[${time}] ${parsed.topic || "berry.commerce"}: ${parsed.event}`;
          if (parsed.data) {
            logLine += ` → ${JSON.stringify(parsed.data).substring(0, 80)}...`;
          }
          setStream((prev) => [logLine, ...prev.slice(0, 15)]);
        } catch (_) {}
      };
      return () => es.close();
    } catch (_) {}
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Live Network Topology</h1>
          <p className="text-sm text-black/50 mt-1">Real-time telemetry and microservice mesh monitoring across Berry's ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-700">Cluster Synchronized</span>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-sm hover:border-[#5B4DFB]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-black/40">{node.id}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                {node.status}
              </span>
            </div>
            <h3 className="font-bold text-base text-black mb-1">{node.service}</h3>
            <p className="text-xs text-black/40 font-mono mb-4">{node.port}</p>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-black/[0.05] text-center">
              <div>
                <div className="text-[10px] text-black/40">Latency</div>
                <div className="text-xs font-bold text-[#5B4DFB]">{node.ping}</div>
              </div>
              <div>
                <div className="text-[10px] text-black/40">Throughput</div>
                <div className="text-xs font-bold text-black">{node.qps} req/s</div>
              </div>
              <div>
                <div className="text-[10px] text-black/40">Uptime</div>
                <div className="text-xs font-bold text-emerald-600">{node.uptime}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Stream & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-black">Live Event Bus Telemetry</h2>
            <span className="text-xs text-black/40 font-mono">Stream: active</span>
          </div>
          <div className="bg-[#0f111a] rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-2 h-72 overflow-y-auto">
            {stream.map((log, i) => (
              <div key={i} className="leading-relaxed border-b border-white/5 pb-1.5 flex items-start gap-2">
                <span className="text-black/40 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-black mb-1">Network Protocols</h2>
            <p className="text-xs text-black/40 mb-4">Active communication channels</p>
            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-xl border border-black/[0.05]">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>gRPC / Internal IPC</span>
                  <span className="text-emerald-600">Active</span>
                </div>
                <p className="text-[11px] text-black/40">Go &lt;-&gt; Rust Ledger fast pipeline</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-black/[0.05]">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>HTTP/2 WebSockets</span>
                  <span className="text-emerald-600">Active</span>
                </div>
                <p className="text-[11px] text-black/40">Frontend live transaction broadcast</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-black/[0.05]">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>Razorpay TLS 1.3 Webhook</span>
                  <span className="text-emerald-600">Active</span>
                </div>
                <p className="text-[11px] text-black/40">Cryptographic payment validation</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90 transition-all">
            Run Network Diagnostic
          </button>
        </div>
      </div>
    </div>
  );
}
