import { Router } from "express";
import { runAIModel } from "../controllers/ai.controller.js";

const router = Router();

/**
 * POST /api/ai/run
 * {
 *   "prompt": "Summarize this text...",
 *   "model": "gpt-4o-mini",
 *   "provider": "openai" // or "ollama", "huggingface"
 * }
 */
router.post("/run", runAIModel);

export default router;
