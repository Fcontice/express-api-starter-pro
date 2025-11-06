import createError from "http-errors";
import OpenAI from "openai";

/**
 * Flexible AI Route
 * Supports OpenAI, Hugging Face, or local Ollama.
 * Extend by adding new providers in the switch below.
 */
export const runAIModel = async (req, res, next) => {
  try {
    const { prompt, model = "gpt-4o-mini", provider = "openai" } = req.body;
    if (!prompt) throw createError(400, "Missing 'prompt' field.");

    let responseText;

    switch (provider.toLowerCase()) {
      case "openai": {
        if (!process.env.OPENAI_API_KEY)
          throw createError(500, "OpenAI API key missing.");
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await client.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
        });
        responseText = completion.choices[0]?.message?.content?.trim();
        break;
      }

      case "huggingface": {
        if (!process.env.HUGGINGFACE_API_KEY)
          throw createError(500, "Hugging Face API key missing.");
        const resp = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
          }
        );
        const data = await resp.json();
        responseText = Array.isArray(data)
          ? data[0]?.generated_text
          : data?.generated_text;
        break;
      }

      case "ollama": {
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

      default:
        throw createError(400, `Unknown provider: ${provider}`);
    }

    res.json({
      provider,
      model,
      prompt,
      response: responseText || "(empty response)",
    });
  } catch (err) {
    next(err);
  }
};
