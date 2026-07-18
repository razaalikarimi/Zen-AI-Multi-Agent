import { useDispatch, useSelector } from "react-redux";
import { FaGoogle } from "react-icons/fa";
import ArtifactPanel from "../components/ArtifactPanel";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { Zap, Cpu, Globe, Code2, Shield, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FEATURES = [
  { icon: Zap, label: "Multi-Agent AI", desc: "Specialized agents for code, search, images & more" },
  { icon: Code2, label: "Artifact Studio", desc: "Live code preview with Monaco editor" },
  { icon: Globe, label: "Web Intelligence", desc: "Real-time search & web analysis" },
  { icon: Shield, label: "Secure & Private", desc: "Your conversations, fully encrypted" },
];

function GridPattern() {
  const cols = 12, rows = 8;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.15 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "32px",
        padding: "24px",
        height: "100%",
      }}>
        {Array.from({ length: cols * rows }).map((_, i) => (
          <motion.div key={i}
            className="w-[3px] h-[3px] rounded-full"
            style={{ background: "#0891b2" }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>
    </div>
  );
}

function Home() {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const login = async (token) => {
    try {
      const { data } = await api.post(`/api/auth/login`, { token });
      dispatch(setUserData(data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    await login(token);
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "#f0f4f8", position: "relative" }}>
      {/* Aurora blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {/* Main app behind */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <ChatArea />
        <ArtifactPanel />
      </div>

      {/* Login overlay */}
      <AnimatePresence>
        {!userData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex">

            {/* Left: branding */}
            <motion.div
              initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
              style={{ background: "linear-gradient(145deg, #e0f2fe 0%, #f0fdfa 50%, #ecfdf5 100%)", borderRight: "1px solid rgba(0,0,0,0.07)" }}
            >
              <GridPattern />
              <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-30"
                style={{ background: "radial-gradient(circle, #bae6fd, transparent 70%)", filter: "blur(80px)" }} />
              <div className="absolute bottom-[-80px] right-[-60px] w-[380px] h-[380px] rounded-full opacity-25"
                style={{ background: "radial-gradient(circle, #99f6e4, transparent 70%)", filter: "blur(70px)" }} />

              {/* Logo */}
              <div className="relative z-10 p-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #0891b2, #0d9488)", boxShadow: "0 4px 16px rgba(8,145,178,0.3)" }}>
                    <Cpu size={18} className="text-white" />
                  </div>
                  <span className="text-[18px] font-bold tracking-tight gradient-text">Zen AI</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ color: "#0891b2", background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.2)" }}>
                    Beta
                  </span>
                </div>
              </div>

              {/* Hero text */}
              <div className="relative z-10 flex-1 flex flex-col justify-center px-12">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
                  <h1 className="text-[42px] font-bold leading-[1.15] tracking-tight mb-4" style={{ color: "#0f172a" }}>
                    The next-gen
                    <span className="block gradient-text">multi-agent AI</span>
                    <span style={{ color: "#0f172a" }}>platform</span>
                  </h1>
                  <p className="text-[15px] leading-relaxed max-w-[380px] mb-10" style={{ color: "#64748b" }}>
                    One interface. Infinite intelligence. Specialized AI agents that code, search, create images, and generate documents.
                  </p>

                  <div className="space-y-4">
                    {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                      <motion.div key={label}
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.35 + i * 0.08, duration: 0.5 }}
                        className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.18)" }}>
                          <Icon size={14} style={{ color: "#0891b2" }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: "#1e293b" }}>{label}</p>
                          <p className="text-[12px]" style={{ color: "#94a3b8" }}>{desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="relative z-10 p-10">
                 <p className="text-[11px]" style={{ color: "#94a3b8" }}>© 2025 Zen AI · Powered by multi-agent architecture</p>
              </div>
            </motion.div>

            {/* Right: login form */}
            <motion.div
              initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex-1 flex items-center justify-center relative"
              style={{ background: "rgba(240,244,248,0.9)", backdropFilter: "blur(20px)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[400px] h-[400px] rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(8,145,178,0.07), transparent 70%)", filter: "blur(30px)" }} />
              </div>

              <div className="relative z-10 w-full max-w-[400px] px-6">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #0891b2, #0d9488)" }}>
                    <Cpu size={16} className="text-white" />
                  </div>
                  <span className="text-[16px] font-bold gradient-text">Zen AI</span>
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.55 }}
                  className="rounded-2xl p-8"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05)",
                  }}>
                  <div className="mb-7">
                    <h2 className="text-[22px] font-bold tracking-tight" style={{ color: "#0f172a" }}>Welcome back</h2>
                    <p className="text-[13.5px] mt-1" style={{ color: "#64748b" }}>Sign in to continue to Zen AI</p>
                  </div>

                  {/* Google */}
                  <button onClick={handleGoogleLogin}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-[13.5px] font-semibold border transition-all duration-200 cursor-pointer mb-3"
                    style={{ background: "#f8fafc", borderColor: "rgba(0,0,0,0.1)", color: "#1e293b" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "rgba(8,145,178,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}>
                    <FaGoogle size={15} style={{ color: "#ef4444", flexShrink: 0 }} />
                    <span className="flex-1 text-center">Continue with Google</span>
                    <ArrowRight size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                  </button>

                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.07)" }} />
                    <span className="text-[11px]" style={{ color: "#94a3b8" }}>or</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.07)" }} />
                  </div>

                  {/* Dev bypass */}
                  <button onClick={() => login("mock-user-token")}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[13px] font-semibold border-none cursor-pointer btn-primary">
                    <Zap size={14} />
                    Quick Demo Login
                  </button>

                  <p className="text-[11px] text-center mt-5 leading-relaxed" style={{ color: "#94a3b8" }}>
                    By continuing, you agree to our{" "}
                    <span style={{ color: "#0891b2", cursor: "pointer" }}>Terms</span>{" "}
                    and{" "}
                    <span style={{ color: "#0891b2", cursor: "pointer" }}>Privacy Policy</span>.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;