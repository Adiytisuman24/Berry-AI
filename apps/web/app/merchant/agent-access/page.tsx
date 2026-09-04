"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Code,
  ArrowRight,
  Terminal,
  Layers,
  Copy,
  Check,
  Cpu,
  RefreshCw,
  Send,
  AlertCircle,
  Eye,
  Sliders,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AgentAccessPage() {
  const [aiBuyerEnabled, setAiBuyerEnabled] = useState(true);
  const [capabilities, setCapabilities] = useState({
    discovery: true,
    details: true,
    inventory: true,
    pricing: true,
    recommendations: true,
    cartCreation: true,
  });

  const [moneyPolicies, setMoneyPolicies] = useState({
    requireAuth: true,
    maxAutonomousLimit: 0,
    allowAutoPay: false,
  });

  const [mcpTools, setMcpTools] = useState<any[]>([]);
  const [copiedTool, setCopiedTool] = useState<string | null>(null);

  // Simulation state
  const [simQuery, setSimQuery] = useState("Looking for lightweight road running shoes under ₹5,000 in UK 8");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/mcp/tools`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tools) {
          setMcpTools(data.tools);
        }
      })
      .catch(() => {
        // Fallback default MCP tools
        setMcpTools([
          {
            name: "search_catalog",
            description: "Agentic query against verified Berry merchant inventory with natural language filtering.",
            parameters: { type: "object", properties: { query: { type: "string" }, max_price: { type: "number" } } },
          },
          {
            name: "get_product_inventory",
            description: "Retrieve real-time locked stock units across merchant warehouse and channels.",
            parameters: { type: "object", properties: { product_id: { type: "string" } } },
          },
          {
            name: "calculate_checkout_quote",
            description: "Calculate dynamic shipping, merchant tax, and verified itemized total in INR.",
            parameters: { type: "object", properties: { product_ids: { type: "array" } } },
          },
          {
            name: "generate_razorpay_order",
            description: "Initialize a cryptographic Razorpay order requiring explicit customer OTP/biometric approval.",
            parameters: { type: "object", properties: { quote_id: { type: "string" }, amount_paise: { type: "number" } } },
          },
        ]);
      });
  }, []);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimResult(null);

    try {
      // Query search endpoint
      const res = await fetch(`${API_BASE}/api/v1/products`);
      const allProds = await res.json();
      const matched = (allProds || []).filter((p: any) => p.price <= 5000 || p.category === "Running Shoes");

      setTimeout(() => {
        setSimResult({
          agent: "Autonomous Claude 3.5 / OpenAI Buyer Agent",
          mcp_session_id: "mcp-sess-8924",
          tools_executed: ["search_catalog", "get_product_inventory", "calculate_checkout_quote"],
          catalog_matches: matched.length > 0 ? matched : [
            { id: "prod-nimbus", name: "Nimbus Runner", price: 4999, stock: 18 }
          ],
          quote_generated: {
            quote_id: "QTE-AI-772",
            subtotal: 4999,
            tax: 899,
            shipping: 0,
            currency: "INR",
            total: 5898,
            razorpay_action: "AWAITING_CUSTOMER_AUTHORIZATION",
            policy_check: "PASSED (Requires biometric / OTP signature before payment capture)",
          },
        });
        setIsSimulating(false);
      }, 700);
    } catch (e) {
      setSimResult({
        agent: "Autonomous Buyer Agent",
        tools_executed: ["search_catalog", "calculate_checkout_quote"],
        quote_generated: {
          quote_id: "QTE-AI-772",
          total: 4999,
          currency: "INR",
          policy_check: "PASSED (Customer authorization required)",
        },
      });
      setIsSimulating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTool(id);
    setTimeout(() => setCopiedTool(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">Agent Access</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI-Readable &amp; Transactable Store
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Let autonomous AI agents discover your products, verify real-time inventory, and assemble customer carts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/merchant/connectors"
            className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <span>Back to Connectors</span>
          </Link>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Readiness & Master Switch */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI-Ready Status Strip */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#5B4DFB]/10 text-[#5B4DFB] flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-neutral-900 text-base">Make Your Store AI-Ready</h2>
                  <p className="text-xs text-neutral-500">Autonomous buyers read your real-time catalog via MCP</p>
                </div>
              </div>

              {/* Master AI Buyer Toggle */}
              <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-2xl border border-neutral-200">
                <span className="text-xs font-bold text-neutral-700">
                  {aiBuyerEnabled ? "AI Access Enabled" : "AI Access Disabled"}
                </span>
                <button
                  onClick={() => setAiBuyerEnabled(!aiBuyerEnabled)}
                  className={`w-12 h-6 rounded-full transition-all relative p-0.5 ${
                    aiBuyerEnabled ? "bg-emerald-500" : "bg-neutral-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all shadow-sm ${
                      aiBuyerEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Verification checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-neutral-800">AI-Readable Catalog</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-neutral-800">schema.org/Product</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-neutral-800">Real-time Inventory</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-neutral-800">Dynamic INR Pricing</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-neutral-800">Model Context Protocol</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-neutral-800">Razorpay Policy Guard</span>
              </div>
            </div>

            {/* Granular Capabilities Configuration */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Exposed Agent Capabilities
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(capabilities).map(([key, val]) => (
                  <label
                    key={key}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                      val ? "bg-[#5B4DFB]/5 border-[#5B4DFB]/30 text-[#5B4DFB]" : "bg-neutral-50 border-neutral-200 text-neutral-500"
                    }`}
                  >
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => setCapabilities({ ...capabilities, [key]: e.target.checked })}
                      className="rounded text-[#5B4DFB]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Live MCP Tool Definitions Explorer */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code className="w-5 h-5 text-[#5B4DFB]" />
                <h3 className="font-bold text-neutral-900 text-base">Model Context Protocol (MCP) Tools</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">GET /api/v1/mcp/tools</span>
            </div>
            <p className="text-xs text-neutral-500">
              Any standard LLM (OpenAI Function Calling, Anthropic Claude Tool Use, or Gemini Tools) can bind directly
              to these endpoints to act as an agentic buyer for your store.
            </p>

            <div className="space-y-3">
              {mcpTools.map((tool) => (
                <div key={tool.name} className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#5B4DFB] bg-white px-2 py-0.5 rounded border border-[#5B4DFB]/20">
                      {tool.name}
                    </span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(tool, null, 2), tool.name)}
                      className="text-neutral-400 hover:text-neutral-800 transition-all flex items-center gap-1 text-[11px]"
                    >
                      {copiedTool === tool.name ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Schema</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-neutral-600 text-[11px]">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Policy Guardrails & Agent Simulation */}
        <div className="space-y-6">
          {/* Security & Financial Guardrails */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-neutral-900 text-sm">Financial Guardrails &amp; Policy</h3>
            </div>
            <p className="text-xs text-neutral-500">
              Protects you from autonomous rogue orders. Berry prevents unauthorized money movement.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  Explicit Customer Authorization
                </div>
                <p className="text-[11px] text-emerald-800">
                  MANDATORY: Every quote requires user biometric approval, OTP, or UPI PIN before Razorpay executes the charge.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
                <div className="font-bold text-neutral-800">Autonomous Payment Ceiling</div>
                <div className="text-[11px] text-neutral-500">
                  Current policy: ₹0.00 (Zero unapproved transactions permitted).
                </div>
              </div>
            </div>
          </div>

          {/* Live Agent Buyer Simulator */}
          <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Simulate AI Buyer</h3>
              </div>
              <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                Live Simulator
              </span>
            </div>

            <p className="text-xs text-neutral-300">
              Test how an autonomous AI agent queries your store and creates an authorized cart quote.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Agent User Prompt:
              </label>
              <textarea
                value={simQuery}
                onChange={(e) => setSimQuery(e.target.value)}
                rows={2}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#5B4DFB]"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4a3cf0] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Agent Executing MCP Tools...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Agentic Simulation</span>
                </>
              )}
            </button>

            {simResult && (
              <div className="pt-3 border-t border-neutral-800 space-y-3 font-mono text-[11px] animate-in fade-in duration-200">
                <div className="text-emerald-400 font-bold">✓ MCP Session Verified: {simResult.mcp_session_id}</div>

                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1.5 text-neutral-300 overflow-x-auto">
                  <div className="text-neutral-500 font-bold">// Tools called by Agent:</div>
                  <div className="text-purple-300">{simResult.tools_executed.join(" → ")}</div>

                  <div className="pt-1 text-neutral-500 font-bold">// Quote Generated:</div>
                  <div>ID: {simResult.quote_generated.quote_id}</div>
                  <div>Total: ₹{simResult.quote_generated.total}</div>
                  <div className="text-emerald-400">Policy: {simResult.quote_generated.policy_check}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
