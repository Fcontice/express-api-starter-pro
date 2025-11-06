import { z } from "zod";

export const aiRunSchema = z.object({
  provider: z.enum(["openai", "huggingface", "ollama"], {
    required_error: "provider is required",
    invalid_type_error: "provider must be one of: openai, huggingface, ollama",
  }),
  model: z.string().min(1).max(100).optional(),
  prompt: z.string().min(1, "prompt cannot be empty").max(4000),
});
