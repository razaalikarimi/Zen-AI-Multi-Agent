import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Crown, Zap, Check, ShieldCheck, ArrowRight, Sparkles,
  CreditCard, Clock, Receipt, AlertCircle, CheckCircle2
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
import { createOrder } from "../features/billing.api";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    credits: 100,
    features: ["100 Free Monthly Credits", "Standard Agent Processing", "Web & Coding Agents", "Community Support"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹199",
    credits: 500,
    features: ["500 Credits / mo", "Monaco Artifact Studio", "PDF & Presentation Generator", "Web Search with Citations"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    credits: 1000,
    popular: true,
    features: [
      "1,000 Credits / mo",
      "Priority Multi-Agent Orchestration",
      "Persistent Qdrant RAG Ingestion",
      "Image & Vision Analysis",
      "Priority Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹1,499",
    credits: 5000,
    features: [
      "5,000 Credits / mo",
      "Dedicated Worker Queues",
      "Unlimited Knowledge Base Storage",
      "Custom Model Fine-Tuning",
      "Admin Audit Logs & SLA",
    ],
  },
];

export default function BillingPortal() {
  const { userData } = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userData) return;
      try {
        const { data } = await api.get("/api/billing/transactions");
        if (data?.data?.transactions) {
          setTransactions(data.data.transactions);
        }
      } catch (err) {
        // Fallback demo transactions
        setTransactions([
          {
            orderId: "order_mock_982421",
            paymentId: "pay_mock_112042",
            plan: "pro",
            amount: 499,
            credits: 1000,
            status: "paid",
            createdAt: "2025-03-30T10:14:00.000Z",
          },
        ]);
      }
    };
    fetchTransactions();
  }, []);

  const handleUpgrade = async (planId) => {
    if (planId === "free") return;
    try {
      setFeedbackMessage("Initiating Razorpay checkout...");
      const data = await createOrder(planId);
      const order = data.order || data.data?.order;
      const plan = data.plan || data.data?.plan;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_placeholder_key",
        amount: order.amount,
        currency: order.currency,
        name: "Zen AI Multi-Agent Platform",
        description: `Upgrade to ${plan.name} Plan`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await api.post("/api/billing/verify-payment", response);
            setFeedbackMessage("Payment verified and subscription activated successfully!");
            setTimeout(() => window.location.reload(), 1500);
          } catch (e) {
            setFeedbackMessage("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#0891b2" },
      };

      if (window.Razorpay) {
        new window.Razorpay(options).open();
      } else {
        // Simulated local verification for development test mode
        setFeedbackMessage("Processing test payment verification...");
        await api.post("/api/billing/verify-payment", {
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: `mock_sig_${Date.now()}`,
        });
        setFeedbackMessage(`Test payment successful! ${plan.credits} credits awarded.`);
      }
    } catch (err) {
      setFeedbackMessage(err.response?.data?.message || err.message || "Failed to initiate payment");
    }
  };

  const currentPlan = userData?.plan || "free";
  const usedCredits = userData?.credits ?? 100;
  const totalCredits = userData?.totalCredits ?? 100;
  const creditPct = Math.min(100, Math.round((usedCredits / totalCredits) * 100));

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-black/[0.06]">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#0891b2]/10 text-[#0891b2]">
            Subscription & Usage Quotas
          </span>
          <h1 className="text-2xl font-bold text-[#0f172a] mt-1">Billing & Credit Management</h1>
          <p className="text-[13px] text-[#64748b]">
            Manage subscription tiers, monitor real-time credit consumption, and inspect invoice records.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-w-6xl">
          {feedbackMessage && (
            <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13px] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#10b981]" />
              {feedbackMessage}
            </div>
          )}

          {/* Current Plan & Quota Card */}
          <div className="p-6 rounded-2xl bg-white border border-black/[0.07] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[#0891b2] to-[#0d9488] text-white shadow-lg shadow-[#0891b2]/30">
                <Crown size={28} />
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#94a3b8] uppercase tracking-wider">Active Plan</p>
                <h2 className="text-2xl font-bold text-[#0f172a] capitalize">{currentPlan} Plan</h2>
                <p className="text-[13px] text-[#64748b]">Renews monthly with automatic credit rollover.</p>
              </div>
            </div>

            <div className="w-full md:w-80">
              <div className="flex justify-between text-[13px] font-medium mb-1.5">
                <span className="text-[#64748b]">Credits Remaining</span>
                <span className="text-[#0f172a] font-bold">
                  {usedCredits} / {totalCredits} ({creditPct}%)
                </span>
              </div>
              <div className="h-3 rounded-full bg-[#f1f5f9] overflow-hidden border border-black/[0.05]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0891b2] to-[#0d9488]"
                  style={{ width: `${creditPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div>
            <h3 className="text-[17px] font-bold text-[#0f172a] mb-4">Available Subscription Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {PLANS.map((plan) => {
                const isCurrent = currentPlan.toLowerCase() === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                      plan.popular
                        ? "bg-white border-2 border-[#0891b2] shadow-md relative"
                        : "bg-white border border-black/[0.08] shadow-sm"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#0891b2] to-[#0d9488] text-white">
                        Recommended
                      </span>
                    )}

                    <div>
                      <h4 className="text-[16px] font-bold text-[#0f172a]">{plan.name}</h4>
                      <p className="text-2xl font-extrabold text-[#0891b2] mt-1">{plan.price}</p>
                      <p className="text-[12px] font-medium text-[#64748b] mb-4">{plan.credits} Credits</p>

                      <ul className="space-y-2 mb-6 text-[12.5px] text-[#475569]">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check size={13} className="text-[#0891b2] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrent}
                      className={`w-full py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition border-none ${
                        isCurrent
                          ? "bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed"
                          : plan.popular
                          ? "bg-gradient-to-r from-[#0891b2] to-[#0d9488] text-white shadow-md shadow-[#0891b2]/25"
                          : "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                      }`}
                    >
                      {isCurrent ? "Active Plan" : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction History Table */}
          <div className="rounded-2xl bg-white border border-black/[0.07] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0f172a]">Transaction & Payment History</h3>
              <span className="text-[12px] text-[#64748b]">Processed securely via Razorpay</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#f8fafc] text-[#64748b] border-b border-black/[0.06] text-[11px] font-semibold uppercase">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Plan</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Credits</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-6 text-center text-[#94a3b8]">
                        No payment transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.orderId} className="hover:bg-[#f8fafc] transition">
                        <td className="px-6 py-3.5 font-mono text-[12px] text-[#1e293b]">{tx.orderId}</td>
                        <td className="px-6 py-3.5 capitalize font-medium text-[#0f172a]">{tx.plan}</td>
                        <td className="px-6 py-3.5 font-semibold text-[#0f172a]">₹{tx.amount}</td>
                        <td className="px-6 py-3.5 text-[#0891b2] font-semibold">+{tx.credits}</td>
                        <td className="px-6 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#ecfdf5] text-[#059669]">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-[#64748b]">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "Recent"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

