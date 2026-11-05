import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: String,
    content: String,
  },
  { _id: false }
);

const artifactSchema = new mongoose.Schema(
  {
    id: Number,
    type: String,
    title: String,
    files: [fileSchema],
    createdAt: String,
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    reasoning: {
      type: String,
      default: "",
    },
    agent: {
      type: String,
      default: "auto",
    },
    images: [
      {
        type: String,
      },
    ],
    artifacts: [artifactSchema],
    sources: [
      {
        title: String,
        url: String,
        snippet: String,
      },
    ],
    feedback: {
      rating: { type: Number, enum: [1, -1] },
      comment: String,
    },
    tokenUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      estimatedCostUSD: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
