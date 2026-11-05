import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Cpu, MessageSquare, Code2, Database, CreditCard, Sparkles,
  ArrowRight, Clock, Zap, Shield, FileText, ChevronRight
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.conversation);

  const creditsUsed = userData?.credits ?? 100;
  const totalCredits = userData?.totalCredits ?? 100;
  const plan = userData?.plan || "Free";

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#0891b2]/10 text-[#0891b2]">
                Workspace Overview
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0f172a]">
              Welcome back, {userData?.name || "Developer"}
            </h1>
            <p className="text-[13px] text-[#64748b]">
              Your multi-agent AI orchestration hub is operational and ready.
            </p>
          </div>

          <button
            onClick={() => navigate("/chat")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#0891b2] to-[#0d9488] shadow-md shadow-[#0891b2]/25 cursor-pointer border-none hover:opacity-95 transition"
          >
            <Sparkles size={15} /> New Conversation
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-w-6xl">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Active Subscription</span>
                <CreditCard size={16} className="text-[#0891b2]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a] capitalize">{plan} Plan</p>
              <Link to="/billing" className="text-[11px] text-[#0891b2] font-semibold mt-1 inline-flex items-center gap-1 hover:underline">
                Manage Billing <ChevronRight size={12} />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Credits Remaining</span>
                <Zap size={16} className="text-[#f59e0b]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">{creditsUsed} / {totalCredits}</p>
              <div className="h-1.5 rounded-full bg-[#f1f5f9] mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0891b2] to-[#0d9488]"
                  style={{ width: `${Math.min(100, (creditsUsed / totalCredits) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Active Threads</span>
                <MessageSquare size={16} className="text-[#10b981]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a]">{conversations?.length || 0}</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Stored securely in MongoDB</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between text-[#64748b] text-[12px] mb-2 font-medium">
                <span>Agent Status</span>
                <Cpu size={16} className="text-[#8b5cf6]" />
              </div>
              <p className="text-2xl font-extrabold text-[#10b981]">8 Ready</p>
              <Link to="/agents" className="text-[11px] text-[#0891b2] font-semibold mt-1 inline-flex items-center gap-1 hover:underline">
                Inspect Catalog <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div>
            <h3 className="text-[16px] font-bold text-[#0f172a] mb-4">Quick Workspaces</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Link
                to="/chat"
                className="p-5 rounded-2xl bg-white border border-black/[0.07] shadow-sm hover:border-[#0891b2]/40 transition text-decoration-none group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0891b2]/10 text-[#0891b2] flex items-center justify-center mb-3">
                    <MessageSquare size={18} />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#0f172a] group-hover:text-[#0891b2] transition">
                    Multi-Agent Chat
                  </h4>
                  <p className="text-[13px] text-[#64748b] mt-1">
                    Execute real-time queries with autonomous LangGraph supervisor routing.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-semibold text-[#0891b2] mt-4">
                  Open Workspace <ArrowRight size={13} />
                </div>
              </Link>

              <Link
                to="/artifacts"
                className="p-5 rounded-2xl bg-white border border-black/[0.07] shadow-sm hover:border-[#8b5cf6]/40 transition text-decoration-none group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center mb-3">
                    <Code2 size={18} />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#0f172a] group-hover:text-[#8b5cf6] transition">
                    Monaco Artifact Studio
                  </h4>
                  <p className="text-[13px] text-[#64748b] mt-1">
                    Inspect, edit, and preview AI-generated multi-file web applications.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-semibold text-[#8b5cf6] mt-4">
                  Launch Studio <ArrowRight size={13} />
                </div>
              </Link>

              <Link
                to="/knowledge"
                className="p-5 rounded-2xl bg-white border border-black/[0.07] shadow-sm hover:border-[#10b981]/40 transition text-decoration-none group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 text-[#10b981] flex items-center justify-center mb-3">
                    <Database size={18} />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#0f172a] group-hover:text-[#10b981] transition">
                    Knowledge Base (RAG)
                  </h4>
                  <p className="text-[13px] text-[#64748b] mt-1">
                    Upload documents into Qdrant for semantic search and grounded answers.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-semibold text-[#10b981] mt-4">
                  Manage Docs <ArrowRight size={13} />
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="rounded-2xl bg-white border border-black/[0.07] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0f172a]">Recent Conversations</h3>
              <Link to="/chat" className="text-[12px] text-[#0891b2] font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="divide-y divide-black/[0.05]">
              {conversations && conversations.length > 0 ? (
                conversations.slice(0, 5).map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => navigate("/chat")}
                    className="px-6 py-3.5 flex items-center justify-between hover:bg-[#f8fafc] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#f1f5f9] text-[#64748b]">
                        <MessageSquare size={14} />
                      </div>
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#0f172a]">{conv.title}</p>
                        <p className="text-[11px] text-[#94a3b8]">Folder: {conv.folder || "General"}</p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-[#94a3b8]" />
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-[#94a3b8] text-[13px]">
                  No conversation history yet. Start a new chat to begin!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

