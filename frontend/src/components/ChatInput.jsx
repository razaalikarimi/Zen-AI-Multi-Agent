import { useState, useEffect, useRef } from "react";
import {
  Send, Paperclip, Square, Zap, MessageSquare, Code2,
  Presentation, Image as ImageIcon, Globe, FileText, X, Mic, MicOff,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/message.slice";
import { sendPrompt } from "../features/agent.api";
import { createConversation, updateConversations } from "../features/conversation.api";
import { addConversation, setConvTitle, setSelectedConversation } from "../redux/conversation.slice";

const agents = [
  { id: "auto", icon: Zap, label: "Auto", color: "#f59e0b" },
  { id: "chat", icon: MessageSquare, label: "Chat", color: "#0891b2" },
  { id: "coding", icon: Code2, label: "Code", color: "#8b5cf6" },
  { id: "pdf", icon: FileText, label: "PDF", color: "#ef4444" },
  { id: "ppt", icon: Presentation, label: "Slides", color: "#f97316" },
  { id: "image", icon: ImageIcon, label: "Image", color: "#10b981" },
  { id: "search", icon: Globe, label: "Search", color: "#3b82f6" },
];

const placeholders = {
  auto: "Ask Zen AI anything...",
  chat: "Chat with Zen AI...",
  coding: "Describe the app you want to build...",
  pdf: "Generate a PDF about...",
  ppt: "Create a presentation on...",
  image: "Describe the image you want...",
  search: "Search the web for...",
};

export default function ChatInput({ setBanner }) {
  const [selectedAgent, setSelectedAgent] = useState("auto");
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [focused, setFocused] = useState(false);

  const recognitionRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const { selectedConversation } = useSelector(state => state.conversation);
  const { isLoading } = useSelector(state => state.message);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = true;
    r.continuous = true;
    r.onresult = (e) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
      setValue(t);
    };
    r.onend = () => setIsListening(false);
    recognitionRef.current = r;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) { alert("Speech Recognition not supported"); return; }
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else { recognitionRef.current.start(); setIsListening(true); }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSend = async () => {
    const prompt = value.trim();
    if (!prompt) return;
    dispatch(setIsLoading(true));
    try {
      let conversation = selectedConversation;
      if (!conversation) {
        const nc = await createConversation();
        dispatch(addConversation(nc));
        dispatch(setSelectedConversation(nc));
        conversation = nc;
      }
      if (conversation.title === "New Chat") {
        await updateConversations(conversation._id, prompt.slice(0, 40));
        dispatch(setConvTitle({ conversationId: conversation._id, title: prompt.slice(0, 40) }));
      }
      dispatch(addMessage({ role: "user", content: prompt }));
      setValue("");
      const fd = new FormData();
      fd.append("conversationId", conversation._id);
      fd.append("prompt", prompt);
      fd.append("agent", selectedAgent);
      if (selectedFile) fd.append("file", selectedFile);
      setSelectedFile(null);
      const data = await sendPrompt(fd);
      dispatch(addMessage({ role: "assistant", content: data.answer, images: data.images }));
      if (data.artifacts) dispatch(setArtifacts(data.artifacts));
    } catch (error) {
      setBanner({
        open: true,
        title: error.response?.data?.title || "Something went wrong",
        message: error.response?.data?.message || "Please try again.",
      });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const activeAgent = agents.find(a => a.id === selectedAgent);

  return (
    <div className="shrink-0 px-3 md:px-5 py-4"
      style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "#f8fafc",
          border: focused ? "1.5px solid rgba(8,145,178,0.5)" : "1.5px solid rgba(0,0,0,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(8,145,178,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        }}>

        {/* Agent pills */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-1.5 flex-wrap">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = selectedAgent === agent.id;
            return (
              <button key={agent.id} onClick={() => setSelectedAgent(agent.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11.5px] font-medium border transition-all duration-200 cursor-pointer"
                style={{
                  background: isActive ? `${agent.color}12` : "#ffffff",
                  color: isActive ? agent.color : "#94a3b8",
                  borderColor: isActive ? `${agent.color}30` : "rgba(0,0,0,0.08)",
                  boxShadow: isActive ? `0 2px 8px ${agent.color}20` : "none",
                }}>
                <Icon size={12} />
                {agent.label}
              </button>
            );
          })}
        </div>

        {/* File preview */}
        {selectedFile && (
          <div className="mx-4 mb-2">
            <div className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
              style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}>
              {selectedFile.type === "application/pdf"
                ? <FileText size={14} style={{ color: "#ef4444" }} />
                : selectedFile?.type.startsWith("image/")
                  ? <img src={URL.createObjectURL(selectedFile)} className="h-8 w-8 rounded-md object-cover" alt="" />
                  : null
              }
              <div>
                <p className="text-[12px]" style={{ color: "#1e293b" }}>{selectedFile.name}</p>
                <p className="text-[10px]" style={{ color: "#94a3b8" }}>{Math.ceil(selectedFile.size / 1024)} KB</p>
              </div>
              <button onClick={() => { setSelectedFile(null); fileRef.current.value = ""; }} className="ml-1 cursor-pointer bg-transparent border-none">
                <X size={12} style={{ color: "#94a3b8" }} />
              </button>
            </div>
          </div>
        )}

        {/* Textarea */}
        <textarea ref={textareaRef} value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholders[selectedAgent]}
          disabled={isLoading} rows={2}
          className="w-full bg-transparent outline-none resize-none leading-relaxed disabled:opacity-50"
          style={{ padding: "10px 16px", fontSize: "14px", color: "#1e293b", fontFamily: "Inter, sans-serif", scrollbarWidth: "none" }}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <input ref={fileRef} type="file" hidden accept=".pdf,image/*"
              onChange={e => { const f = e.target.files[0]; if (f) setSelectedFile(f); }} />
            <button onClick={() => fileRef.current.click()}
              className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none transition-all duration-150"
              style={{ color: "#94a3b8" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
              <Paperclip size={14} />
            </button>
            <button onClick={toggleMic}
              className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border-none transition-all duration-150"
              style={{
                background: isListening ? "rgba(239,68,68,0.08)" : "transparent",
                color: isListening ? "#ef4444" : "#94a3b8",
                border: isListening ? "1px solid rgba(239,68,68,0.2)" : "1px solid transparent",
              }}>
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>

            {activeAgent && (
              <div className="flex items-center gap-1 ml-1 px-2 py-1 rounded-full"
                style={{ background: `${activeAgent.color}0d`, border: `1px solid ${activeAgent.color}22` }}>
                <activeAgent.icon size={10} style={{ color: activeAgent.color }} />
                <span className="text-[10px] font-medium" style={{ color: activeAgent.color }}>{activeAgent.label} mode</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] hidden sm:block" style={{ color: "#cbd5e1" }}>Enter ↵ to send</span>
            <button onClick={handleSend}
              disabled={!isLoading && !value.trim()}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-200"
              style={{
                background: isLoading ? "#1e293b" : value.trim() ? "linear-gradient(135deg, #0891b2, #0d9488)" : "#f1f5f9",
                color: isLoading ? "#fff" : value.trim() ? "#fff" : "#cbd5e1",
                boxShadow: value.trim() && !isLoading ? "0 4px 12px rgba(8,145,178,0.35)" : "none",
                cursor: !isLoading && !value.trim() ? "not-allowed" : "pointer",
              }}>
              {isLoading ? <Square size={11} fill="currentColor" /> : <Send size={13} />}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] mt-2" style={{ color: "#e2e8f0" }}>
        Zen AI can make mistakes · Always verify important information
      </p>
    </div>
  );
}