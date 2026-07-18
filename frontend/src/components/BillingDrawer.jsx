import { AnimatePresence, motion } from "framer-motion";
import { X, Crown, Zap, Sparkles, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/billing.api";
import api from "../utils/axios";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "₹199",
    credits: 500,
    icon: Zap,
    color: "#3b82f6",
    features: ["500 AI Credits", "Code Generation", "PDF & PPT Creation", "Web Search"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    credits: 1000,
    icon: Crown,
    color: "#0891b2",
    popular: true,
    features: ["1000 AI Credits", "Everything in Starter", "Image Generation", "Priority Processing"],
  },
];

export default function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector(state => state.user);
  const creditPct = ((userData?.credits || 0) / (userData?.totalCredits || 1)) * 100;

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount, currency: data.order.currency,
        name: "Zen AI", description: `${data.plan.name} Plan`,
        order_id: data.order.id,
        handler: async (response) => {
          try { const { data: d } = await api.post("/api/billing/verify-payment", response); console.log(d); }
          catch (e) { console.log(e); }
        },
        theme: { color: "#0891b2" },
      };
      new window.Razorpay(options).open();
    } catch (e) { console.log(e); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40" style={{ background: "#0f172a" }} />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-50 h-screen w-[400px] flex flex-col overflow-hidden"
            style={{ background: "#ffffff", borderLeft: "1px solid rgba(0,0,0,0.07)", boxShadow: "-8px 0 32px rgba(0,0,0,0.1)" }}>

            {/* Aurora accent */}
            <div className="absolute top-0 right-0 w-[250px] h-[200px] pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(8,145,178,0.06) 0%, transparent 70%)", filter: "blur(30px)" }} />

            {/* Header */}
            <div className="relative flex items-center justify-between p-5 shrink-0"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles size={15} style={{ color: "#0891b2" }} />
                  <h2 className="text-[17px] font-bold" style={{ color: "#0f172a" }}>Billing</h2>
                </div>
                <p className="text-[12.5px]" style={{ color: "#94a3b8" }}>Plans & Credits</p>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all duration-150"
                style={{ background: "#f1f5f9", color: "#64748b" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#1e293b"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}>
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* Current plan */}
              <div className="rounded-2xl p-4"
                style={{ background: "rgba(8,145,178,0.04)", border: "1px solid rgba(8,145,178,0.14)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider mb-0.5" style={{ color: "#94a3b8" }}>Current Plan</p>
                    <h3 className="text-[19px] font-bold gradient-text">{userData?.plan ?? "Free"}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.16)" }}>
                    <Crown size={18} style={{ color: "#0891b2" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11.5px] mb-2" style={{ color: "#94a3b8" }}>
                    <span>Credits used</span>
                    <span style={{ color: "#64748b" }}>{userData?.credits || 0} / {userData?.totalCredits || 0}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #0891b2, #0d9488)", boxShadow: "0 0 6px rgba(8,145,178,0.3)" }}
                      initial={{ width: 0 }} animate={{ width: `${Math.min(creditPct, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }} />
                  </div>
                </div>
              </div>

              {/* Plan cards */}
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div key={plan.id}
                    className="rounded-2xl p-5 relative overflow-hidden transition-all duration-250 plan-card"
                    style={{
                      background: plan.popular ? "rgba(8,145,178,0.03)" : "#ffffff",
                      border: plan.popular ? "1.5px solid rgba(8,145,178,0.2)" : "1px solid rgba(0,0,0,0.08)",
                    }}>

                    {plan.popular && (
                      <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
                        style={{ background: "radial-gradient(circle, rgba(8,145,178,0.06), transparent 70%)", filter: "blur(16px)" }} />
                    )}

                    {plan.popular && (
                      <span className="absolute right-4 top-4 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "linear-gradient(135deg, #0891b2, #0d9488)", color: "#fff", boxShadow: "0 2px 8px rgba(8,145,178,0.3)" }}>
                        Most Popular
                      </span>
                    )}

                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${plan.color}0f`, border: `1px solid ${plan.color}25` }}>
                        <Icon size={16} style={{ color: plan.color }} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold" style={{ color: "#0f172a" }}>{plan.name}</h3>
                        <p className="text-[22px] font-extrabold mt-0.5 gradient-text">{plan.price}</p>
                        <p className="text-[11.5px]" style={{ color: "#94a3b8" }}>{plan.credits} Credits</p>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-[12.5px]" style={{ color: "#64748b" }}>
                          <Check size={12} style={{ color: plan.color, flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button onClick={() => handleUpgrade(plan.id)}
                      className="w-full py-2.5 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-all duration-200"
                      style={plan.popular ? {
                        background: "linear-gradient(135deg, #0891b2, #0d9488)",
                        color: "#fff",
                        boxShadow: "0 4px 14px rgba(8,145,178,0.3)",
                      } : {
                        background: "#f8fafc",
                        color: "#64748b",
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                      onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#1e293b"; } }}
                      onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#64748b"; } }}>
                      Upgrade to {plan.name}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-5 shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <p className="text-[11px] text-center" style={{ color: "#cbd5e1" }}>
                Credits renew on upgrade · Secure payment via Razorpay
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}