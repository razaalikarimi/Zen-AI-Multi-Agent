import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Code2, Eye, Download, Copy, Check, Play, SplitSquareVertical,
  Maximize2, FileCode, Plus, Folder, RefreshCw, Sparkles
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { detectLanguage } from "../utils/detectLanguage";

const DEFAULT_PROJECT = {
  title: "Crypto Dashboard Pro",
  files: [
    {
      name: "index.html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zen AI Live Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="dashboard">
    <header>
      <h1>Zen AI Real-Time Metrics</h1>
      <span class="status-badge">Live Operational</span>
    </header>

    <div class="metrics-grid">
      <div class="card">
        <h3>Bitcoin (BTC)</h3>
        <p class="price" id="btcPrice">$94,210.50</p>
        <span class="change positive">+3.42%</span>
      </div>
      <div class="card">
        <h3>Ethereum (ETH)</h3>
        <p class="price" id="ethPrice">$3,420.10</p>
        <span class="change positive">+1.85%</span>
      </div>
      <div class="card">
        <h3>Solana (SOL)</h3>
        <p class="price" id="solPrice">$198.40</p>
        <span class="change positive">+5.12%</span>
      </div>
    </div>

    <div class="actions">
      <button id="refreshBtn" class="btn">Simulate Live Ticker Update</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    },
    {
      name: "style.css",
      content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0b0f19;
  color: #f1f5f9;
  padding: 2.5rem;
}
.dashboard {
  max-width: 900px;
  margin: 0 auto;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1rem;
}
h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}
.status-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}
.card {
  background: #151c2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
}
.card h3 {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}
.price {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #ffffff;
}
.change.positive {
  color: #10b981;
  font-size: 0.8rem;
  font-weight: 600;
}
.btn {
  background: linear-gradient(135deg, #0891b2, #0d9488);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn:hover {
  opacity: 0.9;
}`,
    },
    {
      name: "script.js",
      content: `document.getElementById("refreshBtn").addEventListener("click", () => {
  const btc = (94000 + (Math.random() * 800 - 400)).toFixed(2);
  const eth = (3400 + (Math.random() * 50 - 25)).toFixed(2);
  const sol = (195 + (Math.random() * 10 - 5)).toFixed(2);

  document.getElementById("btcPrice").textContent = "$" + Number(btc).toLocaleString();
  document.getElementById("ethPrice").textContent = "$" + Number(eth).toLocaleString();
  document.getElementById("solPrice").textContent = "$" + Number(sol).toLocaleString();
});`,
    },
  ],
};

export default function ArtifactStudio() {
  const [project, setProject] = useState(DEFAULT_PROJECT);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState("split"); // 'code' | 'preview' | 'split'
  const [copied, setCopied] = useState(false);

  const activeFile = project.files[activeFileIndex] || project.files[0];
  const htmlFile = project.files.find((f) => f.name === "index.html");
  const cssFile = project.files.find((f) => f.name === "style.css");
  const jsFile = project.files.find((f) => f.name === "script.js");

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateFileContent = (newContent) => {
    const updated = [...project.files];
    updated[activeFileIndex] = { ...activeFile, content: newContent };
    setProject({ ...project, files: updated });
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-[#e2e8f0] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Studio Toolbar */}
        <div className="h-14 px-6 bg-[#111827] border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0891b2]/20 border border-[#0891b2]/40 text-[#38bdf8]">
              <Code2 size={16} />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-white">{project.title}</h2>
              <p className="text-[11px] text-[#94a3b8]">Interactive Multi-File Sandbox Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[#1e293b] border border-white/[0.08]">
              <button
                onClick={() => setViewMode("code")}
                className={`px-3 py-1 rounded-lg text-[12px] font-medium transition cursor-pointer border-none ${
                  viewMode === "code" ? "bg-[#0891b2] text-white" : "text-[#94a3b8] hover:text-white bg-transparent"
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`px-3 py-1 rounded-lg text-[12px] font-medium transition cursor-pointer border-none ${
                  viewMode === "split" ? "bg-[#0891b2] text-white" : "text-[#94a3b8] hover:text-white bg-transparent"
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1 rounded-lg text-[12px] font-medium transition cursor-pointer border-none ${
                  viewMode === "preview" ? "bg-[#0891b2] text-white" : "text-[#94a3b8] hover:text-white bg-transparent"
                }`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-white/[0.08] transition cursor-pointer"
            >
              {copied ? <Check size={13} className="text-[#10b981]" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-white/[0.08] transition cursor-pointer"
            >
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Tree (Left Pane) */}
          <div className="w-52 bg-[#0d121f] border-r border-white/[0.08] flex flex-col shrink-0">
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] border-b border-white/[0.06] flex items-center justify-between">
              <span>Files</span>
              <Folder size={13} />
            </div>
            <div className="p-2 space-y-1">
              {project.files.map((file, i) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFileIndex(i)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-medium text-left transition cursor-pointer border-none ${
                    activeFileIndex === i
                      ? "bg-[#0891b2]/20 text-[#38bdf8] border border-[#0891b2]/30"
                      : "text-[#94a3b8] hover:bg-white/[0.04] hover:text-white bg-transparent"
                  }`}
                >
                  <FileCode size={14} />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor Pane */}
          {(viewMode === "code" || viewMode === "split") && (
            <div className={`flex-1 flex flex-col bg-[#0f172a] overflow-hidden ${viewMode === "split" ? "w-1/2 border-r border-white/[0.08]" : "w-full"}`}>
              <div className="px-4 py-2 bg-[#111827] border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#38bdf8]">{activeFile.name}</span>
                <span className="text-[10px] text-[#64748b]">Editable Monaco Sandbox</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor
                  theme="vs-dark"
                  language={detectLanguage(activeFile.name)}
                  value={activeFile.content}
                  onChange={(val) => updateFileContent(val || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: "on",
                    automaticLayout: true,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                  }}
                />
              </div>
            </div>
          )}

          {/* Sandboxed Live Preview Pane */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div className={`flex-1 flex flex-col bg-white overflow-hidden ${viewMode === "split" ? "w-1/2" : "w-full"}`}>
              <div className="px-4 py-2 bg-[#f8fafc] border-b border-black/[0.08] flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#1e293b] flex items-center gap-1.5">
                  <Eye size={13} className="text-[#0891b2]" /> Live Sandboxed Preview
                </span>
                <span className="text-[10px] text-[#94a3b8]">Sandbox Isolation (scripts enabled, same-origin blocked)</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  title="artifact-preview"
                  sandbox="allow-scripts"
                  srcDoc={previewDoc}
                  className="w-full h-full border-none bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
