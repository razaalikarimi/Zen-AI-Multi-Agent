import mongoose from "mongoose";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("agent-db");

let isConnected = false;

const connectDB = async () => {
  const mongoUrl =
    process.env.MONGODB_URL ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/zen_agent";

  try {
    mongoose.set("bufferCommands", false);
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    isConnected = true;
    logger.info("MongoDB connected successfully for Agent Service");
  } catch (error) {
    isConnected = false;
    logger.warn("MongoDB connection warning for Agent Service", { error: error.message });
  }
};

export const getDBStatus = () => isConnected;
export default connectDB;
