import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const MODELS = [
  { id: "gemini", label: "Gemini 2.0 Flash", provider: "Google" },
  { id: "gemini-pro", label: "Gemini 1.5 Pro", provider: "Google" },
  { id: "groq", label: "Llama 3.1 70B", provider: "Groq" },
  { id: "deepseek", label: "DeepSeek R1", provider: "DeepSeek" },
  { id: "openrouter", label: "Claude 3.5 Sonnet", provider: "OpenRouter" },
];

export default function ModelSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = MODELS.find((m) => m.id === value) || MODELS[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)",
          background: "#f8fafc", cursor: "pointer", fontSize: "12px", fontWeight: 500,
          color: "#1e293b",
        }}>
        <span>{selected.label}</span>
        <span style={{ fontSize: "10px", color: "#94a3b8" }}>({selected.provider})</span>
        <ChevronDown size={11} style={{ color: "#94a3b8" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 999,
          background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)", overflow: "hidden", minWidth: "200px",
        }}>
          {MODELS.map((model) => (
            <button key={model.id}
              onClick={() => { onChange(model.id); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", padding: "9px 14px", border: "none",
                background: model.id === value ? "rgba(8,145,178,0.06)" : "transparent",
                cursor: "pointer", display: "flex", flexDirection: "column", gap: "1px",
              }}>
              <span style={{ fontSize: "12.5px", fontWeight: 500, color: "#0f172a" }}>{model.label}</span>
              <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>{model.provider}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
