import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Navbar() {
  const { selectedConversation } = useSelector(state => state.conversation);
  const { messages } = useSelector(state => state.message);

  return (
    <div className="h-14 flex items-center justify-between px-5 shrink-0"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
      {/* Left */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
          style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.15)" }}>
          <MessageSquare size={13} style={{ color: "#0891b2" }} />
        </div>

        {selectedConversation ? (
          <motion.h2 key={selectedConversation._id}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[13.5px] font-semibold truncate" style={{ color: "#0f172a" }}>
            {selectedConversation.title}
          </motion.h2>
        ) : (
          <h2 className="text-[13.5px] font-semibold" style={{ color: "#cbd5e1" }}>New Conversation</h2>
        )}

        {messages.length > 0 && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{ color: "#94a3b8", background: "#f1f5f9", border: "1px solid rgba(0,0,0,0.06)" }}>
            {messages.length} msg{messages.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
        <span className="text-[11px] font-medium hidden sm:block" style={{ color: "#10b981" }}>AI Ready</span>
      </div>
    </div>
  );
}