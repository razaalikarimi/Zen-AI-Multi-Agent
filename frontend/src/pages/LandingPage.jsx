import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cpu, Zap, Code2, Globe, Shield, ArrowRight, Sparkles, CheckCircle2,
  Layers, Database, FileText, BarChart3, ChevronDown, Check, Terminal,
  ExternalLink, Lock, Flame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const AGENT_SHOWCASE = [
  {
    name: "Supervisor Agent",
    role: "Central Orchestrator",
    badge: "LangGraph Coordinator",
    desc: "Intelligently classifies intent, decomposes multi-faceted prompts, and routes state across specialist sub-agents.",
    icon: Cpu,
    color: "#0891b2",
  },
  {
    name: "Planning Agent",
    role: "Engineering Architect",
    badge: "Task Decomposition",
    desc: "Formulates milestone execution plans, breaks down complex initiatives, and identifies technical edge cases.",
    icon: Layers,
    color: "#f59e0b",
  },
  {
    name: "Coding Agent",
    role: "Full-Stack Engineer",
    badge: "Monaco Studio",
    desc: "Generates production-grade multi-file codebases, algorithms, and interactive sandboxed web artifacts.",
    icon: Code2,
    color: "#8b5cf6",
  },
  {
    name: "Research Agent",
    role: "Information Synthesizer",
    badge: "Deep Investigation",
    desc: "Executes multi-source investigations, synthesizes academic literature, and creates citation-backed reports.",
    icon: Globe,
    color: "#3b82f6",
  },
  {
    name: "Review & Validation",
    role: "Security & QA Auditor",
    badge: "Quality Gate",
    desc: "Audits peer agent code for OWASP vulnerabilities, runtime bugs, and structural integrity before response delivery.",
    icon: Shield,
    color: "#10b981",
  },
  {
    name: "Document Agent",
    role: "Content Publisher",
    badge: "PDF & PPTX Engine",
    desc: "Compiles styled multi-page PDF documents and formatted PowerPoint slide decks with high design density.",
    icon: FileText,
    color: "#ef4444",
  },
  {
    name: "Data Analysis Agent",
    role: "Quantitative Analyst",
    badge: "Tabular & Statistics",
    desc: "Parses CSV datasets, calculates metrics and KPIs, and constructs structured markdown tables and visualizations.",
    icon: BarChart3,
    color: "#06b6d4",
  },
  {
    name: "Web Search Agent",
    role: "Real-Time Intelligence",
    badge: "Tavily Crawler",
    desc: "Searches the live web for breaking news, developer documentation, and current events with exact source citations.",
    icon: Zap,
    color: "#ec4899",
  },
];

const PRICING_TIERS = [
  {
    id: "free",
    name: "Free Developer",
    price: "₹0",
    period: "forever",
    credits: "100 credits/mo",
    features: [
      "100 free AI credits per month",
      "Standard agent response speed",
      "Web Search & Chat agents",
      "Community support",
      "Local browser artifact preview",
    ],
    buttonText: "Start Free",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter Pro",
    price: "₹199",
    period: "per month",
    credits: "500 credits/mo",
    features: [
      "500 high-speed AI credits",
      "Full Monaco Code Artifact Studio",
      "PDF & Presentation generation",
      "Real-time Tavily web crawler",
      "Persistent conversation storage",
    ],
    buttonText: "Upgrade to Starter",
    popular: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: "₹499",
    period: "per month",
    credits: "1,000 credits/mo",
    features: [
      "1,000 high-speed AI credits",
      "Priority multi-agent orchestration",
      "Claude-style Artifact Studio with ZIP export",
      "Persistent Qdrant RAG Knowledge Base",
      "High-resolution image generation",
      "Email & chat priority support",
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹1,499",
    period: "per month",
    credits: "5,000 credits/mo",
    features: [
      "5,000 enterprise-grade credits",
      "Dedicated BullMQ high-throughput worker queues",
      "Unlimited vector document indexing",
      "Custom model fine-tuning & BYOK options",
      "Role-based access control & admin audit logs",
      "99.9% uptime SLA & dedicated account architect",
    ],
    buttonText: "Contact Enterprise",
    popular: false,
  },
];

const FAQS = [
  {
    q: "How does the Zen AI Multi-Agent system work?",
    a: "Zen AI utilizes a LangGraph supervisor architecture. When you enter a request, the Supervisor Agent evaluates the goal, decomposes multi-step tasks, and dynamically invokes specialist agents (Coding, Research, Data Analysis, Document, Planning, or Search) before passing output through a Review & Validation agent.",
  },
  {
    q: "How does the Monaco Code Artifact Studio work?",
    a: "When the Coding Agent generates multi-file applications (HTML, CSS, JS, Python), Zen AI automatically parses them into a synchronized project tree. You can inspect and edit the source code inside the integrated Monaco Editor and test it in a live sandboxed preview iframe.",
  },
  {
    q: "Is my proprietary data secure?",
    a: "Yes. Zen AI is built with tenant-isolated MongoDB queries, cryptographic HMAC service-to-service authentication, and user-isolated Qdrant vector namespaces. Your uploaded documents and chat histories are never shared across accounts or used to train third-party models.",
  },
  {
    q: "What AI models are supported?",
    a: "Zen AI features a resilient provider abstraction layer supporting Google Gemini (2.5 Flash & 1.5 Pro), Groq (Llama 3.3 70B), DeepSeek Chat, and OpenRouter, with automatic fallback and rate-limit recovery.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] font-sans selection:bg-[#0891b2] selection:text-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#090d16]/80 border-b border-white/[0.08] px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#0891b2] to-[#0d9488] shadow-lg shadow-[#0891b2]/30">
            <Cpu size={16} className="text-white" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-white">Zen AI</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#0891b2]/10 text-[#0891b2] border border-[#0891b2]/20">
            Enterprise v2.0
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#94a3b8]">
          <a href="#agents" className="hover:text-white transition-colors">Agents</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          {userData ? (
            <Link
              to="/chat"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#0891b2] to-[#0d9488] hover:opacity-95 shadow-lg shadow-[#0891b2]/25 transition"
            >
              Open Workspace <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#94a3b8] hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/chat"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#0891b2] to-[#0d9488] hover:opacity-95 shadow-md shadow-[#0891b2]/20 transition"
              >
                Try Demo <Sparkles size={13} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 lg:px-12 max-w-6xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium bg-[#0891b2]/10 text-[#38bdf8] border border-[#0891b2]/30 mb-6">
          <Sparkles size={13} />
          Autonomous Multi-Agent AI Orchestration
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Intelligence Orchestrated. <br />
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#2dd4bf] to-[#34d399] bg-clip-text text-transparent">
            One Platform. Eight Specialized Agents.
          </span>
        </h1>

        <p className="text-[16px] sm:text-[18px] text-[#94a3b8] max-w-2xl mx-auto mt-6 leading-relaxed">
          From self-healing code generation in a Monaco studio to deep multi-query web research,
          Zen AI coordinates specialized agents in a unified, enterprise-grade architecture.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={() => navigate("/chat")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-[#0891b2] to-[#0d9488] hover:brightness-110 shadow-xl shadow-[#0891b2]/30 transition cursor-pointer"
          >
            Launch AI Workspace <ArrowRight size={16} />
          </button>
          <a
            href="#architecture"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-medium text-[#cbd5e1] bg-[#1e293b]/60 hover:bg-[#1e293b] border border-white/[0.1] transition"
          >
            <Layers size={16} /> View Architecture
          </a>
        </div>

        {/* Live metrics strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          {[
            { label: "Specialized Agents", val: "8 Coordinated" },
            { label: "Streaming Latency", val: "< 350ms TTFT" },
            { label: "Vector Search", val: "Qdrant Hybrid" },
            { label: "Code Studio", val: "Monaco + Preview" },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-xl bg-[#111827]/60 border border-white/[0.06] text-left">
              <p className="text-[20px] font-bold text-white">{m.val}</p>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agents Grid Section */}
      <section id="agents" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-white">8 Specialized Enterprise Agents</h2>
          <p className="text-[#94a3b8] text-[15px] mt-2">
            Each agent has dedicated domain instructions, tool access, and autonomous error recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENT_SHOWCASE.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.name}
                className="p-5 rounded-2xl bg-[#111827]/70 border border-white/[0.07] hover:border-[#0891b2]/40 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}
                    >
                      <Icon size={18} style={{ color: agent.color }} />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/[0.05] text-[#94a3b8]">
                      {agent.badge}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-[12px] font-medium text-[#0891b2] mb-2">{agent.role}</p>
                  <p className="text-[13px] text-[#94a3b8] leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-white">Enterprise Architecture</h2>
          <p className="text-[#94a3b8] text-[15px] mt-2">
            Stateless microservice design with cryptographic HMAC cluster authentication and Redis job queues.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0f172a] border border-white/[0.08] shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl bg-[#1e293b]/40 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3 text-[#38bdf8]">
                <Cpu size={16} />
                <h4 className="font-semibold text-white">API Gateway & Auth</h4>
              </div>
              <p className="text-[13px] text-[#94a3b8] leading-relaxed">
                TLS termination, Helmet headers, Redis token-bucket rate limiting, correlation IDs, and Firebase server-side session validation.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#1e293b]/40 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3 text-[#2dd4bf]">
                <Layers size={16} />
                <h4 className="font-semibold text-white">LangGraph Orchestrator</h4>
              </div>
              <p className="text-[13px] text-[#94a3b8] leading-relaxed">
                Dynamic state router, parallel sub-agent execution, Server-Sent Events (SSE) streaming, and automatic multi-provider fallback.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#1e293b]/40 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3 text-[#a78bfa]">
                <Database size={16} />
                <h4 className="font-semibold text-white">Persistent RAG & Storage</h4>
              </div>
              <p className="text-[13px] text-[#94a3b8] leading-relaxed">
                Qdrant multi-tenant vector collections, BullMQ asynchronous worker queues, MongoDB document storage, and presigned S3 downloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-white">Transparent SaaS Pricing</h2>
          <p className="text-[#94a3b8] text-[15px] mt-2">
            Predictable plans designed for solo developers and enterprise engineering teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-6 rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                tier.popular
                  ? "bg-[#111827] border-2 border-[#0891b2] shadow-xl shadow-[#0891b2]/15 relative"
                  : "bg-[#111827]/60 border border-white/[0.07]"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#0891b2] to-[#0d9488] text-white">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-[17px] font-bold text-white">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                  <span className="text-[12px] text-[#94a3b8]">/{tier.period}</span>
                </div>
                <p className="text-[12px] font-semibold text-[#0891b2] mt-1">{tier.credits}</p>

                <ul className="space-y-2.5 mt-6 mb-8 text-[13px] text-[#cbd5e1]">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check size={14} className="text-[#0891b2] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate("/chat")}
                className={`w-full py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition ${
                  tier.popular
                    ? "bg-gradient-to-r from-[#0891b2] to-[#0d9488] text-white shadow-lg shadow-[#0891b2]/30"
                    : "bg-[#1e293b] text-white hover:bg-[#334155]"
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 lg:px-12 max-w-4xl mx-auto border-t border-white/[0.06]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={faq.q}
                className="rounded-xl bg-[#111827]/70 border border-white/[0.07] overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-[15px] font-medium text-white cursor-pointer bg-transparent border-none"
                >
                  {faq.q}
                  <ChevronDown
                    size={16}
                    className={`text-[#94a3b8] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-4 text-[13.5px] text-[#94a3b8] leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-white/[0.08] py-12 px-6 lg:px-12 bg-[#060911]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-tr from-[#0891b2] to-[#0d9488]">
              <Cpu size={14} className="text-white" />
            </div>
            <span className="text-[15px] font-bold text-white">Zen AI</span>
            <span className="text-[11px] text-[#64748b] ml-2">© 2025 Zen AI Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-[13px] text-[#94a3b8]">
            <Link to="/chat" className="hover:text-white transition">Workspace</Link>
            <Link to="/agents" className="hover:text-white transition">Agents</Link>
            <Link to="/knowledge" className="hover:text-white transition">RAG Docs</Link>
            <Link to="/billing" className="hover:text-white transition">Billing</Link>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#10b981]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </footer>
    </div>
  );
}
