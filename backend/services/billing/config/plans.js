export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    amount: 0,
    credits: 100,
    validity: 30,
    features: ["100 Free Credits", "Standard Response Speed", "Access to Basic Agents", "Community Support"],
  },
  starter: {
    id: "starter",
    name: "Starter",
    amount: 199,
    credits: 500,
    validity: 30,
    features: ["500 AI Credits", "Code Generation & Artifacts", "PDF & Presentation Agents", "Real-Time Web Search"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    amount: 499,
    credits: 1000,
    validity: 30,
    popular: true,
    features: [
      "1,000 AI Credits",
      "Everything in Starter",
      "Priority Multi-Agent Orchestration",
      "High-Res Image Generation",
      "Dedicated Document Analysis",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    amount: 1499,
    credits: 5000,
    validity: 30,
    features: [
      "5,000 AI Credits",
      "Everything in Pro",
      "Unlimited Knowledge Base Storage",
      "Dedicated High-Throughput Queue",
      "Custom Model Fine-Tuning & Priority Support",
    ],
  },
};

export default PLANS;
