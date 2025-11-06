import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import fs from "fs";
import { connectDB } from "./src/config/db.js";
import logger from "./src/config/logger.js";
import { apiLimiter } from "./src/middleware/rateLimiter.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import aiRoutes from "./src/routes/ai.routes.js";

dotenv.config();

// 🧪 Load .env.test automatically in test mode
if (process.env.NODE_ENV === "test" && fs.existsSync(".env.test")) {
  dotenv.config({ path: ".env.test" });
  console.log("🧪 Loaded .env.test for testing");
} else {
  dotenv.config();
}

// Validate critical env vars early
["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
app.disable("x-powered-by");
connectDB();

// Security and performance middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

// CORS configuration
const origins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim());
const useCredentials = origins && origins.length > 0;
app.use(
  cors({
    origin: origins?.length ? origins : undefined,
    credentials: useCredentials,
  })
);

// JSON + cookies
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

// Swagger docs
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Error handler
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

// Export for testing
export default app;
