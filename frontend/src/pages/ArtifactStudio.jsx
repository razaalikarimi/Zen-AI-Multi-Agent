import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import {
  Code2, Eye, Download, Copy, Check, Play, SplitSquareVertical,
  Maximize2, FileCode, Plus, Folder, RefreshCw, Sparkles, ExternalLink
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { detectLanguage } from "../utils/detectLanguage";

const PRESET_PROJECTS = [
  {
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
  },
  {
    title: "Precision Stopwatch Pro",
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Precision Stopwatch</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="display" id="timeDisplay">00:00:00.00</div>
    <div class="controls">
      <button id="startBtn" class="btn primary">Start</button>
      <button id="lapBtn" class="btn secondary">Lap</button>
      <button id="resetBtn" class="btn danger">Reset</button>
    </div>
    <ul id="lapsList" class="laps"></ul>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        content: `body {
  margin: 0;
  background: #090d16;
  font-family: monospace;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.container {
  background: #111827;
  padding: 2.5rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.display {
  font-size: 3rem;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
}
.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.btn {
  padding: 0.6rem 1.4rem;
  border-radius: 0.75rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}
.primary { background: #0891b2; color: #fff; }
.secondary { background: #374151; color: #fff; }
.danger { background: #ef4444; color: #fff; }
.laps {
  list-style: none;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
  font-size: 0.9rem;
  color: #94a3b8;
}
.laps li {
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}`,
      },
      {
        name: "script.js",
        content: `let timer = null;
let startTime = 0;
let elapsedTime = 0;

function format(ms) {
  const d = new Date(ms);
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  const s = String(d.getUTCSeconds()).padStart(2, '0');
  const c = String(Math.floor(d.getUTCMilliseconds() / 10)).padStart(2, '0');
  return \`\${m}:\${s}.\${c}\`;
}

document.getElementById('startBtn').addEventListener('click', function() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    this.textContent = 'Resume';
  } else {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      document.getElementById('timeDisplay').textContent = format(elapsedTime);
    }, 10);
    this.textContent = 'Pause';
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
  elapsedTime = 0;
  document.getElementById('timeDisplay').textContent = '00:00:00.00';
  document.getElementById('startBtn').textContent = 'Start';
  document.getElementById('lapsList').innerHTML = '';
});

document.getElementById('lapBtn').addEventListener('click', () => {
  if (!elapsedTime) return;
  const li = document.createElement('li');
  li.textContent = \`Lap: \${format(elapsedTime)}\`;
  document.getElementById('lapsList').prepend(li);
});`,
      },
    ],
  },
];

export default function ArtifactStudio() {
  const { artifacts } = useSelector((state) => state.message);
  const [project, setProject] = useState(PRESET_PROJECTS[0]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState("split"); // 'code' | 'preview' | 'split'
  const [copied, setCopied] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showAddFile, setShowAddFile] = useState(false);

  // If Redux has active multi-file artifacts generated by the Code Agent, load them!
  useEffect(() => {
    if (artifacts && artifacts.length > 0 && artifacts[0].files && artifacts[0].files.length > 0) {
      setProject({
        title: artifacts[0].title || "Generated Code Artifact",
        files: artifacts[0].files,
      });
      setActiveFileIndex(0);
    }
  }, [artifacts]);

  const activeFile = project.files[activeFileIndex] || project.files[0] || { name: "index.html", content: "" };
  const htmlFile = project.files.find((f) => f.name.endsWith(".html") || f.name === "index.html");
  const cssFile = project.files.find((f) => f.name.endsWith(".css") || f.name === "style.css");
  const jsFile = project.files.find((f) => f.name.endsWith(".js") || f.name === "script.js");

  const previewDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>${cssFile?.content || ""}</style>
</head>
<body>
  ${htmlFile?.content || `<div style="font-family:sans-serif;padding:2rem;color:#333;">Select index.html to render</div>`}
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

  const handleOpenInNewTab = () => {
    const blob = new Blob([previewDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    if (project.files.some((f) => f.name === name)) {
      alert("A file with this name already exists!");
      return;
    }
    const updatedFiles = [...project.files, { name, content: `// File: ${name}\n` }];
    setProject({ ...project, files: updatedFiles });
    setActiveFileIndex(updatedFiles.length - 1);
    setNewFileName("");
    setShowAddFile(false);
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
              <div className="flex items-center gap-2">
                <h2 className="text-[14px] font-bold text-white">{project.title}</h2>
                <select
                  value={project.title}
                  onChange={(e) => {
                    const found = PRESET_PROJECTS.find((p) => p.title === e.target.value);
                    if (found) {
                      setProject(found);
                      setActiveFileIndex(0);
                    }
                  }}
                  className="bg-[#1e293b] text-[#94a3b8] text-[11px] px-2 py-0.5 rounded-md border border-white/[0.08] outline-none cursor-pointer"
                >
                  <option value={project.title}>{project.title}</option>
                  {PRESET_PROJECTS.map((p) => (
                    <option key={p.title} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-[#94a3b8]">Interactive Multi-File Sandbox Studio with Live Monaco Engine</p>
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
              onClick={handleOpenInNewTab}
              title="Open Live Preview in New Tab"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-white/[0.08] transition cursor-pointer"
            >
              <ExternalLink size={13} />
              Open Tab
            </button>

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
          <div className="w-56 bg-[#0d121f] border-r border-white/[0.08] flex flex-col shrink-0">
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] border-b border-white/[0.06] flex items-center justify-between">
              <span>Project Files</span>
              <button
                onClick={() => setShowAddFile(!showAddFile)}
                className="w-5 h-5 rounded flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/[0.08] bg-transparent border-none cursor-pointer"
                title="Add New File"
              >
                <Plus size={13} />
              </button>
            </div>

            {showAddFile && (
              <form onSubmit={handleAddFile} className="p-2 border-b border-white/[0.06]">
                <input
                  type="text"
                  placeholder="e.g. app.js"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  autoFocus
                  className="w-full px-2 py-1 text-[12px] rounded bg-[#1e293b] border border-white/[0.1] text-white outline-none focus:border-[#0891b2]"
                />
              </form>
            )}

            <div className="p-2 space-y-1 overflow-y-auto flex-1">
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

            <div className="p-3 border-t border-white/[0.06] bg-[#090d16] text-[11px] text-[#64748b]">
              <span>💡 Generated by </span>
              <span className="text-[#38bdf8] font-medium">Coding Agent</span>
            </div>
          </div>

          {/* Code Editor Pane */}
          {(viewMode === "code" || viewMode === "split") && (
            <div className={`flex-1 flex flex-col bg-[#0f172a] overflow-hidden ${viewMode === "split" ? "w-1/2 border-r border-white/[0.08]" : "w-full"}`}>
              <div className="px-4 py-2 bg-[#111827] border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#38bdf8]">{activeFile.name}</span>
                <span className="text-[10px] text-[#64748b]">Monaco Editor • TypeScript / HTML / CSS / JS</span>
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
