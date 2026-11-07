import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Plus, MessageSquare, LogOut, User, PenSquare, Menu, X, CoinsIcon, Cpu,
  Sparkles, ChevronRight, LayoutDashboard, Code2, Database, BarChart3,
  Settings, ShieldAlert, Layers
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import { createConversation, getConversations } from "../features/conversation.api";
import { addConversation, setConversations, setSelectedConversation } from "../redux/conversation.slice";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
import BillingDrawer from "./BillingDrawer";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { path: "/chat", label: "AI Chat", icon: MessageSquare },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/agents", label: "Agents", icon: Layers },
  { path: "/artifacts", label: "Code Studio", icon: Code2 },
  { path: "/knowledge", label: "Knowledge Base", icon: Database },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/billing", label: "Billing & Plans", icon: CoinsIcon },
  { path: "/settings", label: "Settings", icon: Settings },
];

function CollapsedRail({ onExpand, onNewChat, conversations, selectedConversation, onSelect, userData }) {
  const location = useLocation();
  return (
    <div className="hidden lg:flex flex-col items-center w-[56px] h-screen py-4 gap-1 shrink-0"
      style={{ background: "#ffffff", borderRight: "1px solid rgba(0,0,0,0.07)", boxShadow: "2px 0 8px rgba(0,0,0,0.04)" }}>
      <Link to="/" className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 cursor-pointer text-decoration-none"
        style={{ background: "linear-gradient(135deg, #0891b2, #0d9488)", boxShadow: "0 4px 12px rgba(8,145,178,0.3)" }}>
        <Cpu size={15} className="text-white" />
      </Link>
      <button onClick={onNewChat} title="New Chat"
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer border-none"
        style={{ background: "transparent", color: "#94a3b8" }}>
        <Plus size={16} />
      </button>

      <div className="flex flex-col items-center gap-1 my-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition ${
                isActive ? "bg-[#0891b2]/10 text-[#0891b2]" : "text-[#94a3b8] hover:text-[#0f172a]"
              }`}
            >
              <Icon size={14} />
            </Link>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto w-full px-2 mt-1">
        {conversations.map((chat) => {
          const isActive = selectedConversation?._id === chat._id;
          return (
            <button key={chat._id} onClick={() => onSelect(chat)} title={chat.title}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 border-none cursor-pointer"
              style={{
                background: isActive ? "rgba(8,145,178,0.1)" : "transparent",
                color: isActive ? "#0891b2" : "#94a3b8",
                border: isActive ? "1px solid rgba(8,145,178,0.2)" : "1px solid transparent",
              }}>
              <MessageSquare size={13} />
            </button>
          );
        })}
      </div>
      {userData && (
        <div className="mt-auto">
          <Link to="/settings" className="w-8 h-8 rounded-[8px] flex items-center justify-center text-decoration-none"
            style={{ background: "#f1f5f9", border: "1px solid rgba(0,0,0,0.07)" }}>
            <User size={13} style={{ color: "#94a3b8" }} />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);

  const { userData } = useSelector(state => state.user);
  const { conversations, selectedConversation } = useSelector(state => state.conversation);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await api.get("/api/auth/logout");
      localStorage.removeItem("zen_session");
      dispatch(setUserData(null));
    } catch (error) { 
      localStorage.removeItem("zen_session");
      console.log(error); 
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userData?._id && !userData?.userId) return;
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (error) { console.log(error); }
    };
    fetchConversations();
  }, [userData?._id, userData?.userId]);

  const handleCreateConversation = () => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));
    setMobileOpen(false);
  };

  const handleSelectConversation = async (conversation) => {
    setMobileOpen(false);
    dispatch(setSelectedConversation(conversation));
    const messages = await getMessages(conversation._id);
    dispatch(setMessages(messages));
    dispatch(setArtifacts(messages.artifacts));
  };

  if (collapsed)
    return (
      <CollapsedRail
        onExpand={() => setCollapsed(false)}
        onNewChat={handleCreateConversation}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelect={handleSelectConversation}
        userData={userData}
      />
    );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <Link to="/" className="flex items-center gap-2 flex-1 min-w-0 text-decoration-none">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #0891b2, #0d9488)", boxShadow: "0 4px 10px rgba(8,145,178,0.3)" }}>
            <Cpu size={13} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight gradient-text">Zen AI</span>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
            style={{ color: "#0891b2", background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.15)" }}>
            {userData?.plan ?? "Free"}
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed(true)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md transition-all duration-150 bg-transparent border-none cursor-pointer"
            style={{ color: "#94a3b8" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          <button onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-6 h-6 rounded-md bg-transparent border-none cursor-pointer"
            style={{ color: "#94a3b8" }}>
            <X size={13} />
          </button>
          <button onClick={handleCreateConversation}
            className="flex items-center justify-center w-6 h-6 rounded-md transition-all duration-150 bg-transparent border-none cursor-pointer"
            style={{ color: "#94a3b8" }}>
            <PenSquare size={13} />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <button onClick={handleCreateConversation}
          className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold rounded-xl py-[9px] border-none cursor-pointer transition-all duration-200 btn-primary">
          <Plus size={14} />
          New Conversation
        </button>
      </div>

      {/* Main App Navigation */}
      <div className="px-3 py-1.5 shrink-0 space-y-0.5 border-b border-black/[0.05]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium transition text-decoration-none ${
                isActive
                  ? "bg-[#0891b2]/10 text-[#0891b2] font-semibold"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {userData?.role === "admin" && (
          <Link
            to="/admin"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium transition text-decoration-none ${
              location.pathname === "/admin"
                ? "bg-[#fee2e2] text-[#ef4444] font-semibold"
                : "text-[#ef4444] hover:bg-[#fee2e2]/40"
            }`}
          >
            <ShieldAlert size={14} />
            <span>Admin Console</span>
          </Link>
        )}
      </div>

      {/* Recent Chats Section */}
      <div className="px-4 pt-3 pb-1 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">
          {conversations.length === 0 ? "No threads yet" : "Recent Conversations"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <AnimatePresence>
          {conversations.map((chat, i) => {
            const isActive = selectedConversation?._id === chat._id;
            const isHov = hovered === chat._id;
            return (
              <motion.div key={chat._id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                onClick={() => handleSelectConversation(chat)}
                onMouseEnter={() => setHovered(chat._id)}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2 rounded-[10px] transition-all duration-150"
                style={{
                  background: isActive ? "rgba(8,145,178,0.08)" : isHov ? "rgba(0,0,0,0.03)" : "transparent",
                  border: isActive ? "1px solid rgba(8,145,178,0.18)" : "1px solid transparent",
                }}>
                <div className="flex items-center justify-center shrink-0 w-[24px] h-[24px] rounded-lg"
                  style={{
                    background: isActive ? "rgba(8,145,178,0.12)" : "#f1f5f9",
                    color: isActive ? "#0891b2" : "#94a3b8",
                  }}>
                  <MessageSquare size={11} />
                </div>
                <p className="text-[12px] font-medium truncate flex-1"
                  style={{ color: isActive ? "#0f172a" : "#64748b" }}>
                  {chat.title}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* User Footer */}
      <div className="px-3 py-3 shrink-0 border-t border-black/[0.06]">
        {userData ? (
          <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2">
            <div className="relative shrink-0">
              {!userData?.avatar || imageError ? (
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-[#0891b2]/10 text-[#0891b2]">
                  <User size={13} />
                </div>
              ) : (
                <img src={userData.avatar} alt={userData.name}
                  className="w-8 h-8 rounded-[10px] object-cover border border-[#0891b2]/30"
                  onError={() => setImageError(true)} />
              )}
              <span className="absolute -bottom-px -right-px w-[8px] h-[8px] rounded-full bg-[#10b981] border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold truncate text-[#0f172a]">{userData.name}</p>
              <p className="text-[10.5px] text-[#94a3b8]">{userData.plan || "Free"} Plan • {userData.credits ?? 100} cr</p>
            </div>
            <div className="flex gap-1">
              <Link to="/settings" className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition">
                <Settings size={14} />
              </Link>
              <button onClick={logout}
                className="p-1.5 rounded-lg border-none bg-transparent cursor-pointer text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fee2e2]/40 transition">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold rounded-xl py-[10px] text-white btn-primary text-decoration-none">
            <Sparkles size={13} /> Sign In
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer bg-white border border-black/[0.08] text-[#64748b]">
        <Menu size={15} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        )}
      </AnimatePresence>

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[268px] h-screen shrink-0
        transition-transform duration-250
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-white border-r border-black/[0.07]
      `}>
        <SidebarContent />
      </div>

      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </>
  );
}
