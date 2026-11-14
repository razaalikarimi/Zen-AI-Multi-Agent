import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedConversation } from "../redux/conversation.slice";
import { setMessages, setArtifacts } from "../redux/message.slice";
import {
  Cpu, Layers, Code2, Globe, Shield, FileText, BarChart3, Zap,
  ArrowRight, Search, Play, CheckCircle2, Sliders, Sparkles, Rocket
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const AGENTS = [
  {
    id: "supervisor",
    name: "Supervisor Agent",
    role: "State Router & Meta-Orchestrator",
    category: "Core Engine",
    color: "#0891b2",
    icon: Cpu,
    samplePrompt: "Coordinate a complete technical initiative: design architecture, write core code, and create an executive summary.",
    description: "Evaluates input intent, decomposes complex initiatives into discrete sub-goals, coordinates peer agents, and synthesizes unified responses.",
    capabilities: ["Intent Classification", "Task Decomposition", "Parallel Dispatch", "State Synthesis"],
  },
  {
    id: "planning",
    name: "Planning Agent",
    role: "System Architect",
    category: "Architecture",
    color: "#f59e0b",
    icon: Layers,
    samplePrompt: "Plan a distributed rate limiting architecture for a high-traffic SaaS platform with microservices.",
    description: "Constructs step-by-step milestone execution roadmaps, identifies technical risks, and structures complex engineering initiatives.",
    capabilities: ["Milestone Planning", "Risk Identification", "Architecture Blueprints", "Requirement Breakdown"],
  },
  {
    id: "coding",
    name: "Coding Agent",
    role: "Full-Stack Software Engineer",
    category: "Engineering",
    color: "#8b5cf6",
    icon: Code2,
    samplePrompt: "Build a single-page responsive interactive crypto dashboard in HTML, CSS, and JavaScript with live charting.",
    description: "Generates production-grade multi-file code artifacts with live Monaco Studio preview, algorithmic optimizations, and debugging solutions.",
    capabilities: ["Multi-File Projects", "Monaco Editor Integration", "Client-Side Sandboxing", "Automated Clean Code"],
  },
  {
    id: "research",
    name: "Research Agent",
    role: "Lead Information Synthesizer",
    category: "Intelligence",
    color: "#3b82f6",
    icon: Globe,
    samplePrompt: "Conduct comprehensive research on state-of-the-art vector embedding models and RAG architectures in 2025/2026.",
    description: "Performs deep recursive searches, synthesizes technical literature, and outputs executive briefings with cited sources.",
    capabilities: ["Multi-Query Synthesis", "Citation Generation", "Domain Literature Extraction", "Executive Briefings"],
  },
  {
    id: "review",
    name: "Review & Validation Agent",
    role: "Security & QA Auditor",
    category: "Quality Assurance",
    color: "#10b981",
    icon: Shield,
    samplePrompt: "Review this authentication middleware for OWASP Top 10 vulnerabilities, timing attacks, and JWT expiration flaws.",
    description: "Audits peer agent output for OWASP vulnerabilities, injection risks, style guide conformity, and runtime errors.",
    capabilities: ["OWASP Vulnerability Audit", "Syntax Validation", "Edge Case Testing", "Refinement Suggestions"],
  },
  {
    id: "document",
    name: "Document Agent",
    role: "Executive Document Engine",
    category: "Publishing",
    color: "#ef4444",
    icon: FileText,
    samplePrompt: "Generate a multi-page executive whitepaper on cloud migration best practices and cost optimization.",
    description: "Generates styled PDF document reports and formatted PowerPoint presentation decks with downloadable links.",
    capabilities: ["PDF Report Compilation", "PowerPoint Deck Generation", "Structured Layouts", "Executive Summaries"],
  },
  {
    id: "data",
    name: "Data Analysis Agent",
    role: "Quantitative Analyst",
    category: "Analytics",
    color: "#06b6d4",
    icon: BarChart3,
    samplePrompt: "Analyze customer churn rates across pricing tiers and calculate monthly recurring revenue projections with growth tables.",
    description: "Performs computational reasoning, KPI tracking, CSV parsing, and generates structured markdown data tables.",
    capabilities: ["Tabular Analysis", "KPI Calculation", "Statistical Reasoning", "CSV & Trend Interpretation"],
  },
  {
    id: "search",
    name: "Web Search Agent",
    role: "Real-Time Intelligence Crawler",
    category: "Live Data",
    color: "#ec4899",
    icon: Zap,
    samplePrompt: "What are the latest breakthroughs and regulatory announcements in Artificial Intelligence this week?",
    description: "Crawls the real-time web via Tavily API to fetch current news, documentation, and live data feeds with source links.",
    capabilities: ["Live Internet Search", "Snippet & Source Extraction", "News & Event Tracking", "Fact Verification"],
  },
];

export default function AgentDirectory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Core Engine", "Engineering", "Architecture", "Intelligence", "Analytics", "Publishing", "Live Data"];

  const filteredAgents = AGENTS.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const launchWithPrompt = (prompt, agentId) => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));

    const agentMap = {
      supervisor: "auto",
      planning: "chat",
      coding: "coding",
      research: "search",
      review: "chat",
      document: "pdf",
      data: "chat",
      search: "search",
    };

    const targetAgent = agentMap[agentId] || "auto";
    navigate("/chat", { state: { initialPrompt: prompt, selectedAgent: targetAgent } });
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-black/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#0891b2]/10 text-[#0891b2]">
                Multi-Agent Catalog
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Agent Directory</h1>
            <p className="text-[13px] text-[#64748b]">Explore and deploy the 8 specialized AI agents powering Zen AI platform.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search agents or capabilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl text-[13px] border border-black/[0.08] bg-[#f8fafc] text-[#1e293b] outline-none focus:border-[#0891b2] transition w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-w-7xl">
          {/* Categories pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-[#0891b2] text-white border-[#0891b2]"
                    : "bg-white text-[#64748b] border-black/[0.08] hover:bg-[#f1f5f9]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  className="rounded-2xl p-5 bg-white border border-black/[0.07] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}
                      >
                        <Icon size={18} style={{ color: agent.color }} />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase bg-[#f1f5f9] text-[#64748b]">
                        {agent.category}
                      </span>
                    </div>

                    <h3 className="text-[16px] font-bold text-[#0f172a]">{agent.name}</h3>
                    <p className="text-[12px] font-medium text-[#0891b2] mb-2">{agent.role}</p>
                    <p className="text-[13px] text-[#64748b] leading-relaxed mb-4">{agent.description}</p>

                    <div className="space-y-1.5 mb-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">Capabilities</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((cap) => (
                          <span key={cap} className="text-[10px] px-2 py-0.5 rounded-md bg-[#f8fafc] border border-black/[0.05] text-[#475569]">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => launchWithPrompt(agent.samplePrompt, agent.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-semibold text-white transition cursor-pointer border-none shadow-sm hover:opacity-95"
                    style={{ background: agent.color }}
                  >
                    <Rocket size={13} /> Launch {agent.name.split(" ")[0]}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
