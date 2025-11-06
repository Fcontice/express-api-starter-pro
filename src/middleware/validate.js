import OpenAI from "openai";
import fetch from "node-fetch";
import createError from "http-errors";
import { env } from "../config/config.js";
import logger from "../config/logger.js";

export const runAIModel = async (req, res, next) => {
  try {
    const { provider, model, prompt } = req.body;

    if (!provider || !prompt) {
      throw createError(400, "Provider and prompt are required");
    }

    let output = "";

    switch (provider.toLowerCase()) {
      case "openai": {
        const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
        const completion = await client.chat.completions.create({
          model: model || "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        });
        output = completion.choices[0].message.content.trim();
        break;
      }

      case "huggingface": {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model || "gpt2"}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
          }
        );
        const data = await response.json();
        output = data[0]?.generated_text || "No output generated.";
        break;
      }

      case "ollama": {
        const response = await fetch(`${env.OLLAMA_API_URL}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: model || "mistral", prompt }),
        });
        const data = await response.json();
        output = data.response || "No output generated.";
        break;
      }

      default:
        throw createError(400, `Unsupported provider: ${provider}`);
    }

    res.status(200).json({ provider, model, output });
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
};
