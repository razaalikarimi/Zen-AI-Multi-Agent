import MessageBubble from "./MessageBubble";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Zap, Code2, Globe, ImageIcon, FileText } from "lucide-react";

function NeuralPulse() {
  return (
    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
      {[0, 0.45, 0.9].map((delay, i) => (
        <motion.span key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(8,145,178,0.3)" }}
          initial={{ scale: 0.3, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay, ease: "easeOut" }} />
      ))}
      <motion.span
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: "linear-gradient(135deg, #0891b2, #0d9488)", boxShadow: "0 0 10px rgba(8,145,178,0.4)" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}

const THINKING_LABELS = ["Thinking", "Analyzing", "Reasoning", "Generating"];

function GeneratingIndicator() {
  const [labelIndex, setLabelIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setLabelIndex(prev => (prev + 1) % THINKING_LABELS.length), 1800);
    return () => clearInterval(interval);
  }, []);
  const label = THINKING_LABELS[labelIndex];
  return (
    <div className="flex items-center gap-3 py-1">
      <NeuralPulse />
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={label} className="flex"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}>
            {label.split("").map((ch, i) => (
              <motion.span key={i} className="text-[13px] font-medium tracking-wide"
                style={{ color: "#94a3b8" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}>
                {ch}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  { icon: Code2, label: "Build a REST API", color: "#8b5cf6" },
  { icon: Globe, label: "Search latest AI news", color: "#3b82f6" },
  { icon: FileText, label: "Write a business plan PDF", color: "#ef4444" },
  { icon: ImageIcon, label: "Generate a logo design", color: "#10b981" },
  { icon: Zap, label: "Explain quantum computing", color: "#f59e0b" },
];

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 text-center px-6">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }} className="relative">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(8,145,178,0.1), rgba(13,148,136,0.1))",
            border: "1px solid rgba(8,145,178,0.18)",
            boxShadow: "0 8px 24px rgba(8,145,178,0.12)",
          }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              stroke="url(#grad2)" strokeWidth="1.5" fill="none" />
            <path d="M8 12h8M12 8v8" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="grad2" x1="2" y1="2" x2="22" y2="22">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {[0, 0.7].map((d, i) => (
          <motion.div key={i} className="absolute inset-0 rounded-2xl"
            style={{ border: "1px solid rgba(8,145,178,0.2)" }}
            animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: d, ease: "easeOut" }} />
        ))}
      </motion.div>

      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }} className="space-y-2">
        <h1 className="text-[22px] font-bold tracking-tight gradient-text">Zen AI</h1>
        <p className="text-[15px] font-medium" style={{ color: "#64748b" }}>Your multi-agent AI assistant</p>
        <p className="text-[13px] leading-relaxed max-w-[300px]" style={{ color: "#94a3b8" }}>
          Code · Search · Create images · Generate PDFs & slides
        </p>
      </motion.div>

      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-2 max-w-[420px]">
        {SUGGESTIONS.map(({ icon: Icon, label, color }, i) => (
          <motion.button key={label}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer border-none transition-all duration-200"
            style={{ background: "#ffffff", color: "#64748b", border: `1px solid rgba(0,0,0,0.08)`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.color = color; e.currentTarget.style.borderColor = `${color}28`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; }}>
            <Icon size={12} />
            {label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

export default function MessageList() {
  const bottomRef = useRef(null);
  const { messages, isLoading } = useSelector(state => state.message);
  const { selectedConversation } = useSelector(state => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (selectedConversation?.title === "New Chat") return;
    const get = async () => {
      const data = await getMessages(selectedConversation?._id);
      dispatch(setMessages(data));
      const latest = [...data].reverse().find(m => m.artifacts?.length > 0);
      if (latest) dispatch(setArtifacts(latest.artifacts));
    };
    get();
  }, [selectedConversation?._id]);

  return (
    <div className="flex-1 overflow-y-auto py-6 px-4 md:px-6 space-y-5"
      style={{ background: "transparent" }}>
      {messages.length === 0 && !isLoading ? (
        <EmptyState />
      ) : (
        <>
          {messages.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}>
              <MessageBubble role={msg.role} content={msg.content} images={msg?.images || []} />
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <GeneratingIndicator />
            </motion.div>
          )}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}