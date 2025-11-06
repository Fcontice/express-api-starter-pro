import { Router } from "express";
import { runAIModel } from "../controllers/ai.controller.js";
import { validate } from "../middleware/validate.js";
import { aiRunSchema } from "../validation/ai.schema.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * @route POST /api/ai/run
 * @body { provider: "openai" | "huggingface" | "ollama", model?: string, prompt: string }
 */
router.post("/run", requireAuth, validate(aiRunSchema), runAIModel);

export default router;
