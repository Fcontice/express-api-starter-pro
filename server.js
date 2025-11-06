import dotenv from "dotenv";
import fs from "fs";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/config.js";
import logger from "./src/config/logger.js";
import registerRoutes from "./src/routes/index.js";

// Load envs
if (process.env.NODE_ENV === "test" && fs.existsSync(".env.test")) {
  dotenv.config({ path: ".env.test" });
  console.log("🧪 Loaded .env.test for testing");
} else {
  dotenv.config();
}

// Validate required envs
["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"].forEach((key) => {
  if (env.NODE_ENV !== "test" && !process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(compression({ threshold: 1024 }));

// Routes
registerRoutes(app);

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// Start server
connectDB();
const server = app.listen(env.PORT, () =>
  logger.info(`🚀 Server running on port ${env.PORT}`)
);

// Graceful shutdown
["SIGTERM", "SIGINT"].forEach((signal) =>
  process.on(signal, async () => {
    logger.info(`${signal} received. Shutting down...`);
    await server.close();
    await mongoose.connection.close();
    process.exit(0);
  })
);

export default app;
