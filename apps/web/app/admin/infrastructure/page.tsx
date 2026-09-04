"use client";

import React from "react";

export default function AdminInfrastructure() {
  const services = [
    { name: "Go API Gateway", port: "8080", runtime: "Go 1.23", status: "Healthy", cpu: "1.2%", memory: "18 MB", goroutines: 32 },
    { name: "Rust Settlement Engine", port: "8081", runtime: "Rust / Tokio", status: "Healthy", cpu: "0.4%", memory: "8 MB", threads: 8 },
    { name: "Python OpenAI Agent", port: "8000", runtime: "Python 3.12 / FastAPI", status: "Healthy", cpu: "2.1%", memory: "42 MB", workers: 4 },
    { name: "Next.js 14 Web App", port: "3000", runtime: "Node.js / React 18", status: "Healthy", cpu: "3.5%", memory: "110 MB", routes: 24 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Infrastructure &amp; Runtime Metrics</h1>
          <p className="text-sm text-black/50 mt-1">Resource utilization, process health, and daemon telemetry across active runtimes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.name} className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-base text-black">{s.name}</h3>
                <p className="text-xs text-black/40 font-mono">Port :{s.port} • {s.runtime}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                {s.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-black/[0.05] text-center">
              <div className="p-2.5 bg-neutral-50 rounded-xl">
                <div className="text-[10px] text-black/40 font-medium">CPU Usage</div>
                <div className="text-sm font-bold text-black mt-0.5">{s.cpu}</div>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl">
                <div className="text-[10px] text-black/40 font-medium">Memory RSS</div>
                <div className="text-sm font-bold text-[#5B4DFB] mt-0.5">{s.memory}</div>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl">
                <div className="text-[10px] text-black/40 font-medium">Threads / Routines</div>
                <div className="text-sm font-bold text-emerald-600 mt-0.5">{s.goroutines || s.threads || s.workers || s.routes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
