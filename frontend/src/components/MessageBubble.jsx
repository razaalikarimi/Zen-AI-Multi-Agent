import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiExternalLink, FiX } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Cpu, User } from "lucide-react";

function MessageBubble({ role, content, images }) {
  const isUser = role === "user";
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const markdown = (content || "")
    .replace(/```review/gi, "```")
    .replace(/```text/gi, "```")
    .replace(/```[a-zA-Z0-9_-]+\s+id="[^"]*"/g, "```");

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>

      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1"
          style={{
            background: "linear-gradient(135deg, rgba(8,145,178,0.12), rgba(13,148,136,0.12))",
            border: "1px solid rgba(8,145,178,0.2)",
          }}>
          <Cpu size={14} style={{ color: "#0891b2" }} />
        </div>
      )}

      {/* Bubble */}
      <div className="w-fit max-w-[88vw] md:max-w-[70%] px-4 py-3 rounded-2xl break-words overflow-hidden leading-relaxed"
        style={isUser ? {
          background: "linear-gradient(135deg, #0891b2 0%, #0d9488 60%, #059669 100%)",
          border: "none",
          boxShadow: "0 4px 16px rgba(8,145,178,0.25)",
          borderRadius: "18px 18px 4px 18px",
          color: "#ffffff",
        } : {
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.07)",
          borderLeft: "3px solid rgba(8,145,178,0.3)",
          borderRadius: "4px 18px 18px 18px",
          color: "#1e293b",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}>

        {/* Images */}
        {images?.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-3">
            {images.map((img, i) => (
              <img key={i} src={img} loading="lazy"
                onClick={() => setLightboxSrc(img)}
                onError={e => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover cursor-zoom-in hover:opacity-90 transition"
                style={{ border: "1px solid rgba(0,0,0,0.1)" }} />
            ))}
          </div>
        )}

        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-5 mb-3" style={{ color: "#0f172a" }}>{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mt-4 mb-2" style={{ color: "#1e293b" }}>{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mt-3 mb-2" style={{ color: "#1e293b" }}>{children}</h3>,
          p: ({ children }) => <p className="mb-3 whitespace-pre-wrap break-words leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="pl-5 space-y-1 my-2" style={{ listStyleType: "disc" }}>{children}</ul>,
          ol: ({ children }) => <ol className="pl-5 space-y-1 my-2" style={{ listStyleType: "decimal" }}>{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
              <table className="min-w-full">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-[12px] font-semibold"
              style={{ background: "rgba(8,145,178,0.06)", color: "#0891b2", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-[13px]"
              style={{ color: "#475569", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 underline" style={{ color: "#0891b2" }}>
              {children}<FiExternalLink size={11} />
            </a>
          ),
          img: ({ src }) => {
            if (!src) return null;
            return (
              <img src={src} loading="lazy"
                onClick={() => setLightboxSrc(src)}
                onError={e => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover cursor-pointer mt-2"
                style={{ border: "1px solid rgba(0,0,0,0.08)" }} />
            );
          },
          code({ className, children }) {
            const value = String(children)
              .replace(/^\s*```[^\n]*\n/, "").replace(/\n```\s*$/, "").trim();

            if (!className) {
              return (
                <code className="px-1.5 py-0.5 rounded-md text-[13px]"
                  style={{ background: "rgba(8,145,178,0.07)", color: "#0891b2", fontFamily: "monospace" }}>
                  {value}
                </code>
              );
            }

            const language = className.replace("language-", "");
            return (
              <div className="my-4 overflow-hidden rounded-xl"
                style={{ border: "1px solid rgba(0,0,0,0.08)", background: "#f8fafc" }}>
                {/* Code header */}
                <div className="flex items-center justify-between px-4 py-2.5"
                  style={{ background: "#f1f5f9", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#10b981" }} />
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                      {language}
                    </span>
                  </div>
                  <button onClick={() => copyCode(value)}
                    className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md cursor-pointer border-none transition-all duration-150"
                    style={{
                      background: copiedCode === value ? "rgba(16,185,129,0.08)" : "#ffffff",
                      color: copiedCode === value ? "#10b981" : "#64748b",
                      border: `1px solid ${copiedCode === value ? "rgba(16,185,129,0.2)" : "rgba(0,0,0,0.08)"}`,
                    }}>
                    {copiedCode === value ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                <SyntaxHighlighter language={language} style={oneLight} wrapLongLines showLineNumbers
                  customStyle={{ margin: 0, padding: "16px", background: "#f8fafc", fontSize: "13px", lineHeight: "1.65" }}>
                  {value}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}>
          {markdown}
        </ReactMarkdown>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1"
          style={{ background: "#f1f5f9", border: "1px solid rgba(0,0,0,0.08)" }}>
          <User size={14} style={{ color: "#94a3b8" }} />
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightboxSrc(null)}>
          <button type="button" onClick={() => setLightboxSrc(null)}
            className="absolute top-5 right-5 rounded-full p-2 border-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.9)", color: "#1e293b" }}>
            <FiX size={20} />
          </button>
          <img src={lightboxSrc} onClick={e => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain"
            style={{ border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }} />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;