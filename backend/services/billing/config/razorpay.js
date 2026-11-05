import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret";

let razorpayClient = null;
try {
  razorpayClient = new Razorpay({
    key_id,
    key_secret,
  });
} catch (err) {
  console.warn("Razorpay initialization warning:", err.message);
}

export default razorpayClient || {
  orders: {
    create: async ({ amount, currency, receipt }) => ({
      id: `order_mock_${Date.now()}`,
      amount,
      currency,
      receipt,
      status: "created",
    }),
  },
};
