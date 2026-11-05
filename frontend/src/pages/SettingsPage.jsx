import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User, Shield, Key, Bell, Moon, Sun, Save, CheckCircle2,
  Cpu, Sliders, Lock
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { setUserData } from "../redux/user.slice";

export default function SettingsPage() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(userData?.name || "Zen Developer");
  const [modelPref, setModelPref] = useState("gemini");
  const [agentPref, setAgentPref] = useState("auto");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (userData) {
      dispatch(setUserData({ ...userData, name }));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-black/[0.06]">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#0891b2]/10 text-[#0891b2]">
            Preferences & Configuration
          </span>
          <h1 className="text-2xl font-bold text-[#0f172a] mt-1">User & Workspace Settings</h1>
          <p className="text-[13px] text-[#64748b]">Configure your profile, AI provider routing, and security options.</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-w-4xl">
          {saved && (
            <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13px] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#10b981]" />
              Settings updated successfully!
            </div>
          )}

          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-white border border-black/[0.07] shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-black/[0.06]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0891b2]/10 text-[#0891b2]">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">Profile Information</h3>
                <p className="text-[12px] text-[#64748b]">Your identity on the Zen AI platform.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-medium text-[#475569] mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-[13.5px] outline-none focus:border-[#0891b2]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#475569] mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={userData?.email || "developer@zen.ai"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-[#f8fafc] text-[#94a3b8] text-[13.5px] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* AI Model Preferences Card */}
          <div className="p-6 rounded-2xl bg-white border border-black/[0.07] shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-black/[0.06]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#8b5cf6]/10 text-[#8b5cf6]">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">AI Provider & Orchestrator Preferences</h3>
                <p className="text-[12px] text-[#64748b]">Select your preferred default models and autonomous routing defaults.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-medium text-[#475569] mb-1">Default AI Model</label>
                <select
                  value={modelPref}
                  onChange={(e) => setModelPref(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-[13.5px] bg-white outline-none focus:border-[#0891b2]"
                >
                  <option value="gemini">Google Gemini 2.5 Flash (Balanced & Multimodal)</option>
                  <option value="groq">Groq Llama 3.3 70B (Ultra-Low Latency)</option>
                  <option value="deepseek">DeepSeek Chat V3 (High Reasoning Density)</option>
                  <option value="openrouter">OpenRouter Auto-Routing</option>
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#475569] mb-1">Default Agent Mode</label>
                <select
                  value={agentPref}
                  onChange={(e) => setAgentPref(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-[13.5px] bg-white outline-none focus:border-[#0891b2]"
                >
                  <option value="auto">Auto (Intelligent Supervisor Routing)</option>
                  <option value="coding">Coding Agent (Monaco Studio Focus)</option>
                  <option value="research">Research Agent (Deep Synthesis)</option>
                  <option value="data">Data Analysis Agent</option>
                  <option value="document">Document Agent (PDF/PPT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#0891b2] to-[#0d9488] shadow-md shadow-[#0891b2]/25 cursor-pointer border-none hover:opacity-95 transition"
            >
              <Save size={15} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
