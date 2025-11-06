import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};
