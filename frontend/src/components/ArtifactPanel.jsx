import { useState } from "react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { FiCode } from "react-icons/fi";
import { detectLanguage } from "../utils/detectLanguage";
import { Code2, Eye, PanelRightClose, PanelRightOpen, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArtifactPanel() {
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { artifacts } = useSelector(state => state.message);
  const artifact = artifacts?.[0];

  if (!artifact) return null;

  const file = artifact?.files?.[activeFile];
  const htmlFile = artifact?.files?.find(f => f.name === "index.html");
  const cssFile = artifact?.files?.find(f => f.name === "style.css");
  const jsFile = artifact?.files?.find(f => f.name === "script.js");
  const canPreview = Boolean(htmlFile);

  const previewDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>${cssFile?.content || ""}</style>
</head>
<body>
${htmlFile?.content || ""}
<script>${jsFile?.content || ""}<\/script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(file?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  /* ── Shared code panel content ── */
  const PanelContent = ({ onClose }) => (
    <div className="flex flex-col h-full" style={{ background: "#ffffff" }}>

      {/* Header */}
      <div className="h-14 px-4 flex items-center gap-3 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#ffffff" }}>
        <button
          onClick={onClose ?? (() => setCollapsed(true))}
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0" style={{ color: "#64748b" }}
        >
          {onClose ? <X size={15} /> : <PanelRightClose size={15} />}
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 rounded-md shrink-0" style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.15)" }}>
            <FiCode size={12} style={{ color: "#0891b2" }} />
          </div>
          <h2 className="text-[13px] font-medium truncate" style={{ color: "#1e293b" }}>{artifact.title}</h2>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Copy button — only in code tab */}
          {tab === "code" && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer"
              style={{ color: "#64748b" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#1e293b"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}

          {canPreview && (
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#f1f5f9", border: "1px solid rgba(0,0,0,0.07)" }}>
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150`}
                style={{ background: tab === "code" ? "linear-gradient(135deg,#0891b2,#0d9488)" : "transparent", color: tab === "code" ? "#fff" : "#64748b" }}
              >
                <Code2 size={11} /> Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150`}
                style={{ background: tab === "preview" ? "linear-gradient(135deg,#0891b2,#0d9488)" : "transparent", color: tab === "preview" ? "#fff" : "#64748b" }}
              >
                <Eye size={11} /> Preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File tabs */}
      <AnimatePresence>
        {tab === "code" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex border-b overflow-x-auto shrink-0" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#f8fafc" }}>
              {artifact.files?.map((f, index) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFile(index)}
                  className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r relative cursor-pointer bg-transparent`}
                  style={{ borderRight: "1px solid rgba(0,0,0,0.04)", color: activeFile === index ? "#0891b2" : "#64748b" }}
                >
                  {f.name}
                  {activeFile === index && (
                    <motion.div layoutId="filetab" className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full" style={{ background: "linear-gradient(90deg,#0891b2,#0d9488)" }} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "preview" && canPreview ? (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-full h-full">
              <iframe title="preview" sandbox="allow-scripts" srcDoc={previewDoc} className="w-full h-full bg-white" />
            </motion.div>
          ) : (
            <motion.div key={`code-${activeFile}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-full h-full">
              <Editor
                theme="light"
                language={detectLanguage(file?.name || "")}
                value={file?.content || ""}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, wordWrap: "on", automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 16 }, lineNumbers: "on", renderLineHighlight: "none" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl text-white text-[12px] font-medium border-none cursor-pointer transition-colors duration-150"
        style={{ background: "linear-gradient(135deg,#0891b2,#0d9488)", boxShadow: "0 4px 16px rgba(8,145,178,0.4)" }}
      >
        <FiCode size={13} />
        View Code
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="mob-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div key="mob-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "easeInOut" }} className="lg:hidden fixed inset-y-0 right-0 z-50 w-[88vw] max-w-[420px] border-l border-white/[0.06] overflow-hidden">
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div key="open" initial={{ width: 0, opacity: 0 }} animate={{ width: "clamp(340px, 38%, 680px)", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} className="hidden lg:flex h-full border-l border-black/[0.06] flex-col overflow-hidden shrink-0">
            <PanelContent />
          </motion.div>
        ) : (
          <motion.div key="collapsed" initial={{ width: 0, opacity: 0 }} animate={{ width: 48, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} className="hidden lg:flex h-full flex-col items-center py-4 gap-3 shrink-0" style={{ borderLeft: "1px solid rgba(0,0,0,0.07)", background: "#ffffff" }}>
            <button onClick={() => setCollapsed(false)} className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none cursor-pointer">
              <PanelRightOpen size={15} />
            </button>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                {artifact.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}