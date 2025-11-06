import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async () => {
  try {
    // 🧪 Skip DB connection during tests
    if (process.env.NODE_ENV === "test") {
      logger.info("🧪 Skipping MongoDB connection in test mode");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,
    });
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};
