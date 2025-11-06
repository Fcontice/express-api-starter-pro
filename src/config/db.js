import mongoose from "mongoose";
import logger from "./logger.js";
import { env } from "./config.js";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connectDB = async () => {
  try {
    if (env.NODE_ENV === "test") {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      logger.info("🧪 Connected to in-memory MongoDB for testing");
      return;
    }

    const conn = await mongoose.connect(env.MONGO_URI, { maxPoolSize: 20 });
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};
