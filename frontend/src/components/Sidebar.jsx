import { useEffect, useState } from "react";
import {
  Plus, MessageSquare, LogOut, User, PenSquare, Menu, X, CoinsIcon, Cpu,
  Sparkles, ChevronRight
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

function CollapsedRail({ onExpand, onNewChat, conversations, selectedConversation, onSelect, userData }) {
  return (
    <div className="hidden lg:flex flex-col items-center w-[56px] h-screen py-4 gap-1 shrink-0"
      style={{ background: "#ffffff", borderRight: "1px solid rgba(0,0,0,0.07)", boxShadow: "2px 0 8px rgba(0,0,0,0.04)" }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 cursor-pointer" onClick={onExpand}
        style={{ background: "linear-gradient(135deg, #0891b2, #0d9488)", boxShadow: "0 4px 12px rgba(8,145,178,0.3)" }}>
        <Cpu size={15} className="text-white" />
      </div>
      <button onClick={onNewChat}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer border-none"
        style={{ background: "transparent", color: "#94a3b8" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(8,145,178,0.06)"; e.currentTarget.style.color = "#0891b2"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
        <Plus size={16} />
      </button>
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
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center"
            style={{ background: "#f1f5f9", border: "1px solid rgba(0,0,0,0.07)" }}>
            <User size={13} style={{ color: "#94a3b8" }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
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
      dispatch(setUserData(null));
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (error) { console.log(error); }
    };
    fetchConversations();
  }, [userData?._id]);

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
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #0891b2, #0d9488)", boxShadow: "0 4px 10px rgba(8,145,178,0.3)" }}>
            <Cpu size={13} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight gradient-text">Zen AI</span>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
            style={{ color: "#0891b2", background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.15)" }}>
            {userData?.plan ?? "Free"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed(true)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md transition-all duration-150 bg-transparent border-none cursor-pointer"
            style={{ color: "#94a3b8" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#475569"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
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
            style={{ color: "#94a3b8" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(8,145,178,0.06)"; e.currentTarget.style.color = "#0891b2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
            <PenSquare size={13} />
          </button>
        </div>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <button onClick={handleCreateConversation}
          className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold rounded-xl py-[9px] border-none cursor-pointer transition-all duration-200 btn-primary">
          <Plus size={14} />
          New Conversation
        </button>
      </div>

      {/* Section label */}
      <div className="px-4 pt-2 pb-1.5 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#cbd5e1" }}>
          {conversations.length === 0 ? "No conversations yet" : "Recent"}
        </p>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <AnimatePresence>
          {conversations.map((chat, i) => {
            const isActive = selectedConversation?._id === chat._id;
            const isHov = hovered === chat._id;
            return (
              <motion.div key={chat._id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                onClick={() => handleSelectConversation(chat)}
                onMouseEnter={() => setHovered(chat._id)}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] transition-all duration-150"
                style={{
                  background: isActive ? "rgba(8,145,178,0.08)" : isHov ? "rgba(0,0,0,0.03)" : "transparent",
                  border: isActive ? "1px solid rgba(8,145,178,0.18)" : "1px solid transparent",
                }}>
                <div className="flex items-center justify-center shrink-0 w-[26px] h-[26px] rounded-lg"
                  style={{
                    background: isActive ? "rgba(8,145,178,0.12)" : "#f1f5f9",
                    color: isActive ? "#0891b2" : "#94a3b8",
                  }}>
                  <MessageSquare size={12} />
                </div>
                <p className="text-[12.5px] font-medium truncate flex-1"
                  style={{ color: isActive ? "#0f172a" : "#64748b" }}>
                  {chat.title}
                </p>
                {isActive && <ChevronRight size={11} style={{ color: "#0891b2", opacity: 0.6 }} />}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px shrink-0" style={{ background: "rgba(0,0,0,0.06)" }} />

      {/* Footer */}
      <div className="px-3 py-3 shrink-0">
        {userData ? (
          <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-150"
            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <div className="relative shrink-0">
              {!userData?.avatar || imageError ? (
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(8,145,178,0.12), rgba(13,148,136,0.12))", border: "1px solid rgba(8,145,178,0.2)" }}>
                  <User size={14} style={{ color: "#0891b2" }} />
                </div>
              ) : (
                <img src={userData.avatar} alt={userData.name}
                  className="w-9 h-9 rounded-[10px] object-cover"
                  style={{ border: "2px solid rgba(8,145,178,0.25)" }}
                  onError={() => setImageError(true)} />
              )}
              <span className="absolute -bottom-px -right-px w-[9px] h-[9px] rounded-full block"
                style={{ background: "#10b981", border: "2px solid #ffffff" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate" style={{ color: "#0f172a" }}>{userData.name}</p>
              <p className="text-[11px] mt-px" style={{ color: "#94a3b8" }}>{userData.plan || "Free Plan"}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setShowBilling(true)}
                className="flex items-center justify-center w-7 h-7 rounded-lg border-none bg-transparent cursor-pointer transition-all duration-150"
                style={{ color: "#f59e0b" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <CoinsIcon size={14} />
              </button>
              <button onClick={logout}
                className="flex items-center justify-center w-7 h-7 rounded-lg border-none bg-transparent cursor-pointer transition-all duration-150"
                style={{ color: "#94a3b8" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
                <LogOut size={13} />
              </button>
            </div>
          </div>
        ) : (
          <button className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold rounded-xl py-[10px] cursor-pointer border-none btn-primary">
            <Sparkles size={13} />
            Sign In
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer"
        style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", color: "#64748b", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <Menu size={15} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} />
        )}
      </AnimatePresence>

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[268px] h-screen shrink-0
        transition-transform duration-250
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        style={{
          background: "#ffffff",
          borderRight: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "2px 0 16px rgba(0,0,0,0.05)",
        }}>
        <SidebarContent />
      </div>

      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </>
  );
}