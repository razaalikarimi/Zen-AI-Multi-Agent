import { useState } from "react";
import {
  BarChart3, TrendingUp, Clock, Zap, Cpu, DollarSign,
  Layers, ArrowUpRight, ShieldCheck, Calendar
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const USAGE_BY_AGENT = [
  { agent: "Coding Agent", calls: 142, tokens: "420,500", pct: 45, color: "#8b5cf6" },
  { agent: "Research Agent", calls: 86, tokens: "215,800", pct: 25, color: "#3b82f6" },
  { agent: "General Chat", calls: 110, tokens: "140,200", pct: 15, color: "#0891b2" },
  { agent: "Document / PDF", calls: 35, tokens: "85,400", pct: 10, color: "#ef4444" },
  { agent: "Data Analysis", calls: 24, tokens: "42,100", pct: 5, color: "#06b6d4" },
];

const MODEL_PERFORMANCE = [
  { model: "Google Gemini 2.5 Flash", ttft: "240ms", throughput: "115 tok/s", errorRate: "0.01%" },
  { model: "Groq Llama 3.3 70B", ttft: "180ms", throughput: "240 tok/s", errorRate: "0.04%" },
  { model: "DeepSeek Chat (V3)", ttft: "320ms", throughput: "85 tok/s", errorRate: "0.02%" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-black/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#0891b2]/10 text-[#0891b2]">
              System Observability
            </span>
            <h1 className="text-2xl font-bold text-[#0f172a] mt-1">Usage & Performance Analytics</h1>
            <p className="text-[13px] text-[#64748b]">Real-time token utilization, model latency, and cost telemetry.</p>
          </div>

          <div className="flex items-center gap-2 bg-[#f1f5f9] p-1 rounded-xl border border-black/[0.06]">
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg text-[12px] font-medium transition cursor-pointer border-none ${
                  timeRange === r ? "bg-white text-[#0f172a] shadow-sm font-semibold" : "text-[#64748b] bg-transparent"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-w-6xl">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Total Tokens Processed</span>
                <Cpu size={16} className="text-[#0891b2]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">904,000</p>
              <div className="flex items-center gap-1 text-[11px] text-[#10b981] mt-1 font-semibold">
                <ArrowUpRight size={13} /> +18.4% vs last period
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Total Agent Invocations</span>
                <Zap size={16} className="text-[#f59e0b]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">397</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Across 8 specialist nodes</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Avg. Streaming Latency</span>
                <Clock size={16} className="text-[#10b981]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">210ms</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Time to first token (TTFT)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Estimated Provider Cost</span>
                <DollarSign size={16} className="text-[#8b5cf6]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">$0.84</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Optimized via Groq/Gemini</p>
            </div>
          </div>

          {/* Usage by Agent Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-black/[0.07] shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-[#0f172a]">Credit & Token Volume by Specialized Agent</h3>
            <div className="space-y-4 pt-2">
              {USAGE_BY_AGENT.map((item) => (
                <div key={item.agent} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#0f172a]">{item.agent}</span>
                    <span className="text-[#64748b]">
                      {item.calls} runs • {item.tokens} tokens ({item.pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Telemetry Table */}
          <div className="rounded-2xl bg-white border border-black/[0.07] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06]">
              <h3 className="text-[15px] font-bold text-[#0f172a]">AI Provider Benchmarks & Reliability</h3>
            </div>
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f8fafc] text-[#64748b] border-b border-black/[0.06] text-[11px] font-semibold uppercase">
                <tr>
                  <th className="px-6 py-3">Provider / Model</th>
                  <th className="px-6 py-3">Time To First Token (TTFT)</th>
                  <th className="px-6 py-3">Inference Throughput</th>
                  <th className="px-6 py-3">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {MODEL_PERFORMANCE.map((m) => (
                  <tr key={m.model} className="hover:bg-[#f8fafc] transition">
                    <td className="px-6 py-3.5 font-semibold text-[#0f172a]">{m.model}</td>
                    <td className="px-6 py-3.5 font-mono text-[#0891b2] font-medium">{m.ttft}</td>
                    <td className="px-6 py-3.5 font-mono text-[#10b981] font-medium">{m.throughput}</td>
                    <td className="px-6 py-3.5 text-[#64748b]">{m.errorRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

