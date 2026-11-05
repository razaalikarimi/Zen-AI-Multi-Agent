import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaGoogle } from "react-icons/fa";
import { Cpu, Zap, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginWithToken = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data.user));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await loginWithToken(token);
    } catch (err) {
      setError(err.message || "Google authentication failed");
    }
  };

  const handleDemoLogin = async () => {
    await loginWithToken("mock-user-token");
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    // Fast login demo bypass for local development
    await loginWithToken("mock-user-token");
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#e2e8f0]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 text-decoration-none mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#0891b2] to-[#0d9488] shadow-lg shadow-[#0891b2]/30">
            <Cpu size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Zen AI</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
        <p className="text-[13px] text-[#94a3b8] mt-1">Sign in to your multi-agent AI workspace</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#111827] py-8 px-6 shadow-2xl rounded-2xl border border-white/[0.08] sm:px-10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#fee2e2]/10 border border-[#ef4444]/20 text-[#ef4444] text-[13px]">
              {error}
            </div>
          )}

          {/* Social Sign-In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-[13.5px] font-semibold bg-[#1e293b] text-white hover:bg-[#334155] border border-white/[0.1] transition cursor-pointer"
          >
            <FaGoogle size={15} className="text-[#ef4444]" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[11px] text-[#64748b] uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-medium text-[#94a3b8] mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="email"
                  required
                  placeholder="developer@zen.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13.5px] bg-[#1e293b]/70 border border-white/[0.08] text-white outline-none focus:border-[#0891b2] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[12.5px] font-medium text-[#94a3b8]">Password</label>
                <Link to="/forgot-password" className="text-[11.5px] text-[#0891b2] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13.5px] bg-[#1e293b]/70 border border-white/[0.08] text-white outline-none focus:border-[#0891b2] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#0891b2] to-[#0d9488] shadow-lg shadow-[#0891b2]/30 hover:brightness-110 transition cursor-pointer border-none"
            >
              {loading ? "Authenticating..." : "Sign In with Email"}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-[#38bdf8] bg-[#0891b2]/10 border border-[#0891b2]/20 hover:bg-[#0891b2]/20 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap size={14} /> Quick Demo Login (Developer Role)
          </button>

          <p className="text-[12px] text-center text-[#94a3b8]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#0891b2] font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

