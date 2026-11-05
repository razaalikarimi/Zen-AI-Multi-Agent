import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    name: {
      type: String,
      trim: true,
      default: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      default: "https://avatar.iran.liara.run/public/38",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    provider: {
      type: String,
      default: "google.com",
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
      index: true,
    },
    credits: {
      type: Number,
      default: 100,
    },
    totalCredits: {
      type: Number,
      default: 100,
    },
    planExpiresAt: {
      type: Date,
    },
    usage: {
      monthlyTokensUsed: { type: Number, default: 0 },
      totalPromptsSent: { type: Number, default: 0 },
      lastResetDate: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1, role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
