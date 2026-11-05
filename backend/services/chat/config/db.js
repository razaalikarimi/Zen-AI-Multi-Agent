import mongoose from "mongoose";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("chat-db");

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/zen_chat";
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    logger.info("MongoDB connected successfully for Chat Service");
  } catch (error) {
    logger.warn("MongoDB connection warning for Chat Service", { error: error.message });
  }
};

export default connectDB;
