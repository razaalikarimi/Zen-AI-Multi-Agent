import { useState } from "react";
import {
  Database, UploadCloud, FileText, Search, Trash2, CheckCircle2,
  Clock, AlertCircle, FileSpreadsheet, FileCode, Plus, ArrowRight
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const INITIAL_DOCS = [
  {
    id: "doc-1",
    name: "Enterprise-Security-Compliance.pdf",
    type: "application/pdf",
    size: "2.4 MB",
    chunks: 48,
    status: "indexed",
    updatedAt: "2025-03-28",
  },
  {
    id: "doc-2",
    name: "API_Architecture_Spec.docx",
    type: "application/docx",
    size: "840 KB",
    chunks: 24,
    status: "indexed",
    updatedAt: "2025-03-29",
  },
  {
    id: "doc-3",
    name: "Customer_Churn_Q1_2025.csv",
    type: "text/csv",
    size: "1.1 MB",
    chunks: 32,
    status: "indexed",
    updatedAt: "2025-03-30",
  },
];

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState(INITIAL_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus("Processing & vectorizing document chunks...");
    setTimeout(() => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type || "text/plain",
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        chunks: Math.floor(Math.random() * 30) + 10,
        status: "indexed",
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setDocuments([newDoc, ...documents]);
      setUploadStatus("Successfully indexed into Qdrant collection!");
      setTimeout(() => setUploadStatus(null), 3000);
    }, 1500);
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const handleSemanticSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          source: documents[0]?.name || "Document",
          snippet: `Context match for "${searchQuery}": Verified cryptographic token validation standards are applied across all internal communication channels.`,
          score: 0.94,
        },
        {
          id: 2,
          source: documents[1]?.name || "Document",
          snippet: `Relevant section: REST and SSE endpoints require correlation IDs for real-time observability and distributed audit logging.`,
          score: 0.88,
        },
      ]);
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-black/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#0891b2]/10 text-[#0891b2]">
                Qdrant Vector Database
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Knowledge Base & RAG Management</h1>
            <p className="text-[13px] text-[#64748b]">
              Ingest PDFs, Word documents, text files, and CSVs with semantic chunking and tenant isolation.
            </p>
          </div>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#0891b2] to-[#0d9488] hover:opacity-95 shadow-md shadow-[#0891b2]/25 cursor-pointer transition">
            <UploadCloud size={16} /> Upload Document
            <input
              type="file"
              hidden
              accept=".pdf,.docx,.txt,.csv,.md"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-w-6xl">
          {uploadStatus && (
            <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13px] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#10b981]" />
              {uploadStatus}
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[#64748b]">Total Ingested Documents</span>
                <Database size={16} className="text-[#0891b2]" />
              </div>
              <p className="text-2xl font-bold text-[#0f172a]">{documents.length}</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Namespaced by user ID</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[#64748b]">Indexed Vector Chunks</span>
                <FileCode size={16} className="text-[#10b981]" />
              </div>
              <p className="text-2xl font-bold text-[#0f172a]">
                {documents.reduce((acc, d) => acc + d.chunks, 0)}
              </p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Chunk size 800 chars / 150 overlap</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[#64748b]">Search Retrieval Latency</span>
                <Clock size={16} className="text-[#f59e0b]" />
              </div>
              <p className="text-2xl font-bold text-[#0f172a]">~45ms</p>
              <p className="text-[11px] text-[#94a3b8] mt-1">Hybrid Dense + Sparse Reranking</p>
            </div>
          </div>

          {/* Semantic Search Sandbox */}
          <div className="p-6 rounded-2xl bg-white border border-black/[0.07] shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-[#0f172a]">Vector Retrieval Query Sandbox</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Test a semantic search query against your indexed vectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSemanticSearch()}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13.5px] border border-black/[0.08] bg-[#f8fafc] text-[#1e293b] outline-none focus:border-[#0891b2] transition"
                />
              </div>
              <button
                onClick={handleSemanticSearch}
                disabled={isSearching}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#0891b2] hover:bg-[#0e7490] transition cursor-pointer border-none"
              >
                {isSearching ? "Searching..." : "Test Query"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">Top Matching Chunks</p>
                {searchResults.map((res) => (
                  <div key={res.id} className="p-4 rounded-xl bg-[#f8fafc] border border-black/[0.05] space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#0891b2]">
                      <span>Source: {res.source}</span>
                      <span>Cosine Similarity: {(res.score * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed">{res.snippet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents Table */}
          <div className="rounded-2xl bg-white border border-black/[0.07] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0f172a]">Indexed Documents</h3>
              <span className="text-[12px] text-[#64748b]">{documents.length} files available</span>
            </div>

            <div className="divide-y divide-black/[0.05]">
              {documents.map((doc) => (
                <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#f8fafc] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0891b2]/10 text-[#0891b2]">
                      {doc.type.includes("pdf") ? <FileText size={18} /> : doc.type.includes("csv") ? <FileSpreadsheet size={18} /> : <FileCode size={18} />}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-[#0f172a]">{doc.name}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-[#94a3b8] mt-0.5">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.chunks} vector chunks</span>
                        <span>•</span>
                        <span>Indexed {doc.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#ecfdf5] text-[#059669]">
                      <CheckCircle2 size={12} /> Indexed
                    </span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fee2e2]/40 transition cursor-pointer border-none bg-transparent"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
