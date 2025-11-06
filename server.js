import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";
import { apiLimiter } from "./src/middleware/rateLimiter.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import logger from "./src/config/logger.js";

import registerRoutes from "./src/routes/index.js";
registerRoutes(app);

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();
const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", apiLimiter);


const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server listening on :${PORT}`));
