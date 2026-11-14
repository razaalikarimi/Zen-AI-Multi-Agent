import { useState } from "react";
import {
  BarChart3, TrendingUp, Clock, Zap, Cpu, DollarSign,
  Layers, ArrowUpRight, ShieldCheck, Calendar, Activity
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const STATS_BY_RANGE = {
  "7d": {
    tokens: "245,200",
    tokensChange: "+24.2%",
    invocations: 114,
    latency: "192ms",
    cost: "$0.24",
    agents: [
      { agent: "Coding Agent", calls: 48, tokens: "120,500", pct: 49, color: "#8b5cf6" },
      { agent: "Research Agent", calls: 28, tokens: "62,800", pct: 25, color: "#3b82f6" },
      { agent: "General Chat", calls: 24, tokens: "38,200", pct: 16, color: "#0891b2" },
      { agent: "Document / PDF", calls: 9, tokens: "14,400", pct: 6, color: "#ef4444" },
      { agent: "Data Analysis", calls: 5, tokens: "9,300", pct: 4, color: "#06b6d4" },
    ],
  },
  "30d": {
    tokens: "904,000",
    tokensChange: "+18.4%",
    invocations: 397,
    latency: "210ms",
    cost: "$0.84",
    agents: [
      { agent: "Coding Agent", calls: 142, tokens: "420,500", pct: 45, color: "#8b5cf6" },
      { agent: "Research Agent", calls: 86, tokens: "215,800", pct: 25, color: "#3b82f6" },
      { agent: "General Chat", calls: 110, tokens: "140,200", pct: 15, color: "#0891b2" },
      { agent: "Document / PDF", calls: 35, tokens: "85,400", pct: 10, color: "#ef4444" },
      { agent: "Data Analysis", calls: 24, tokens: "42,100", pct: 5, color: "#06b6d4" },
    ],
  },
  "90d": {
    tokens: "2,845,000",
    tokensChange: "+32.1%",
    invocations: "1,280",
    latency: "205ms",
    cost: "$2.65",
    agents: [
      { agent: "Coding Agent", calls: 520, tokens: "1,280,000", pct: 45, color: "#8b5cf6" },
      { agent: "Research Agent", calls: 310, tokens: "720,000", pct: 25, color: "#3b82f6" },
      { agent: "General Chat", calls: 280, tokens: "460,000", pct: 16, color: "#0891b2" },
      { agent: "Document / PDF", calls: 110, tokens: "245,000", pct: 9, color: "#ef4444" },
      { agent: "Data Analysis", calls: 60, tokens: "140,000", pct: 5, color: "#06b6d4" },
    ],
  },
};

const MODEL_PERFORMANCE = [
  { model: "Google Gemini 2.5 Flash", ttft: "240ms", throughput: "115 tok/s", errorRate: "0.01%" },
  { model: "Groq Llama 3.3 70B", ttft: "180ms", throughput: "240 tok/s", errorRate: "0.04%" },
  { model: "DeepSeek Chat (V3)", ttft: "320ms", throughput: "85 tok/s", errorRate: "0.02%" },
  { model: "OpenAI GPT-4o-mini", ttft: "215ms", throughput: "140 tok/s", errorRate: "0.01%" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const stats = STATS_BY_RANGE[timeRange];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-black/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#0891b2]/10 text-[#0891b2]">
              System Observability & Metrics
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
              <p className="text-2xl font-extrabold text-[#0f172a]">{stats.tokens}</p>
              <div className="flex items-center gap-1 text-[11px] text-[#10b981] mt-1 font-semibold">
                <ArrowUpRight size={13} /> {stats.tokensChange} vs prior period
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Total Agent Invocations</span>
                <Zap size={16} className="text-[#f59e0b]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">{stats.invocations}</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Across 8 specialist nodes</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Avg. Streaming Latency</span>
                <Clock size={16} className="text-[#10b981]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">{stats.latency}</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Time to first token (TTFT)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Estimated Provider Cost</span>
                <DollarSign size={16} className="text-[#8b5cf6]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">{stats.cost}</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Optimized routing</p>
            </div>
          </div>

          {/* Usage by Agent Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-black/[0.07] shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-[#0f172a]">Credit & Token Volume by Specialized Agent ({timeRange.toUpperCase()})</h3>
            <div className="space-y-4 pt-2">
              {stats.agents.map((item) => (
                <div key={item.agent} className="space-y-1.5">
                  <div className="flex justify-between text-[13px] font-medium">
                    <span className="text-[#1e293b]">{item.agent}</span>
                    <span className="text-[#64748b]">
                      {item.calls} runs • {item.tokens} tokens ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Provider Benchmarks */}
          <div className="rounded-2xl bg-white border border-black/[0.07] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06]">
              <h3 className="text-[15px] font-bold text-[#0f172a]">AI Provider Benchmarks & Reliability</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#f8fafc] text-[#64748b] text-[11px] uppercase tracking-wider font-semibold border-b border-black/[0.05]">
                  <tr>
                    <th className="px-6 py-3">Provider / Model</th>
                    <th className="px-6 py-3">Time to First Token (TTFT)</th>
                    <th className="px-6 py-3">Inference Throughput</th>
                    <th className="px-6 py-3">Error Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05] text-[#334155]">
                  {MODEL_PERFORMANCE.map((model) => (
                    <tr key={model.model} className="hover:bg-[#f8fafc] transition">
                      <td className="px-6 py-3.5 font-medium text-[#0f172a]">{model.model}</td>
                      <td className="px-6 py-3.5 text-[#0891b2] font-semibold">{model.ttft}</td>
                      <td className="px-6 py-3.5 text-[#10b981] font-semibold">{model.throughput}</td>
                      <td className="px-6 py-3.5 text-[#64748b]">{model.errorRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
