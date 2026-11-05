import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaGoogle } from "react-icons/fa";
import { Cpu, Zap, ArrowRight, Mail, Lock, User } from "lucide-react";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { token: "mock-user-token" });
      dispatch(setUserData({ ...data.user, name }));
      navigate("/chat");
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl font-extrabold text-white">Create Your Account</h2>
        <p className="text-[13px] text-[#94a3b8] mt-1">Get started with 100 free AI orchestration credits</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#111827] py-8 px-6 shadow-2xl rounded-2xl border border-white/[0.08] sm:px-10 space-y-5">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-medium text-[#94a3b8] mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13.5px] bg-[#1e293b]/70 border border-white/[0.08] text-white outline-none focus:border-[#0891b2] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-[#94a3b8] mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13.5px] bg-[#1e293b]/70 border border-white/[0.08] text-white outline-none focus:border-[#0891b2] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-[#94a3b8] mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  type="password"
                  required
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-[12px] text-center text-[#94a3b8]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0891b2] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
