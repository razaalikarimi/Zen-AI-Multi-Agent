import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function AiBanner({ message }) {
  const [dismissed, setDismissed] = useState(false);

  if (!message || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 14px", margin: "8px 12px",
          background: "linear-gradient(135deg, rgba(8,145,178,0.08), rgba(13,148,136,0.06))",
          border: "1px solid rgba(8,145,178,0.18)", borderRadius: "10px",
        }}>
        <Sparkles size={13} style={{ color: "#0891b2", flexShrink: 0 }} />
        <p style={{ flex: 1, fontSize: "12px", color: "#0f172a", lineHeight: 1.5 }}>
          {message}
        </p>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#94a3b8", padding: "2px", display: "flex",
          }}>
          <X size={12} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
