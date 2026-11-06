import mongoose from "mongoose";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("chat-db");

let isConnected = false;

const connectDB = async () => {
  const mongoUrl =
    process.env.MONGODB_URL ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/zen_chat";

  try {
    mongoose.set("bufferCommands", false);
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    isConnected = true;
    logger.info("MongoDB connected successfully for Chat Service");
  } catch (error) {
    isConnected = false;
    logger.warn("MongoDB connection warning for Chat Service", { error: error.message });
  }
};

export const getDBStatus = () => isConnected;
export default connectDB;
