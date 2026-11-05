import { useState } from "react";
import { Link } from "react-router-dom";
import { Cpu, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
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
        <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
        <p className="text-[13px] text-[#94a3b8] mt-1">Enter your registered email to receive password recovery instructions</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#111827] py-8 px-6 shadow-2xl rounded-2xl border border-white/[0.08] sm:px-10 space-y-5">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-[17px] font-bold text-white">Check Your Inbox</h3>
              <p className="text-[13px] text-[#94a3b8]">
                We have dispatched password reset instructions to <span className="text-white font-medium">{email}</span>.
              </p>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-[13px] text-[#0891b2] hover:underline pt-2">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#0891b2] to-[#0d9488] shadow-lg shadow-[#0891b2]/30 hover:brightness-110 transition cursor-pointer border-none"
              >
                Send Reset Link
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1 text-[12.5px] text-[#94a3b8] hover:text-white transition">
                  <ArrowLeft size={13} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
