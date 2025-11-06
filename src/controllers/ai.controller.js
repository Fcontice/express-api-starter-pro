/**
 * AI Controller
 * -----------------
 * This route lets users query *any* model they choose.
 * Default example uses OpenAI's Chat Completions API (via the `openai` npm package),
 * but you can easily adapt it for Anthropic, Ollama, HuggingFace, etc.
 */

import createError from "http-errors";

// Optionally import OpenAI SDK (if using OpenAI)
import OpenAI from "openai";

export const runAIModel = async (req, res, next) => {
  try {
    const { prompt, model = "gpt-4o-mini", provider = "openai" } = req.body;

    // Ensure a prompt was sent
    if (!prompt) throw createError(400, "Missing 'prompt' field in request body.");

    let responseText;

    // --- Provider routing logic ---
    switch (provider.toLowerCase()) {
      case "openai": {
        // Check for API key in .env
        if (!process.env.OPENAI_API_KEY)
          throw createError(500, "OpenAI API key not configured.");

        // Initialize client
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // Create chat completion
        const completion = await client.chat.completions.create({
          model, // e.g., gpt-3.5-turbo, gpt-4-turbo, gpt-4o-mini, etc.
          messages: [{ role: "user", content: prompt }],
        });

        responseText = completion.choices[0]?.message?.content?.trim();
        break;
      }

      case "ollama": {
        /**
         * Example for running a *local* Ollama model.
         * Requires `OLLAMA_API_URL` in .env (default http://localhost:11434)
         * and any model pulled locally, e.g., `llama3`, `mistral`, etc.
         */
        const base = process.env.OLLAMA_API_URL || "http://localhost:11434";
        const resp = await fetch(`${base}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, prompt }),
        });
        const data = await resp.json();
        responseText = data?.response;
        break;
      }

      case "huggingface": {
        /**
         * Example using Hugging Face Inference API
         * Requires `HUGGINGFACE_API_KEY` in .env
         */
        if (!process.env.HUGGINGFACE_API_KEY)
          throw createError(500, "Missing Hugging Face API key.");
        const hfModel = model || "gpt2"; // default text model
        const resp = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: prompt }),
        });
        const data = await resp.json();
        responseText = Array.isArray(data)
          ? data[0]?.generated_text
          : data?.generated_text || "No output.";
        break;
      }

      default:
        throw createError(400, `Unknown provider '${provider}'.`);
    }

    // Send back the model response
    res.json({
      provider,
      model,
      prompt,
      response: responseText || "(no response text returned)"
    });

  } catch (err) {
    next(err);
  }
};
