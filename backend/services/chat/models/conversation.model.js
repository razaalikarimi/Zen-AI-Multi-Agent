import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    folder: {
      type: String,
      default: "General",
      trim: true,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    agentPreference: {
      type: String,
      default: "auto",
    },
    modelPreference: {
      type: String,
      default: "gemini",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, title: "text" });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
