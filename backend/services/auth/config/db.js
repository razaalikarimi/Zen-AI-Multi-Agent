import mongoose from "mongoose";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("auth-db");

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/zen_auth";
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    logger.info("MongoDB connected successfully for Auth Service");
  } catch (error) {
    logger.warn("MongoDB connection warning for Auth Service", { error: error.message });
  }
};

export default connectDB;
