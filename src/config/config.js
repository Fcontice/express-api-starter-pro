import { cleanEnv, str, url, num, bool } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV:      str({ choices: ["development", "test", "production"] }),
  PORT:          num({ default: 5000 }),
  MONGO_URI:     str(),
  JWT_SECRET:    str(),
  JWT_REFRESH_SECRET: str(),
  CORS_ORIGIN:   str({ default: "" }),
  OPENAI_API_KEY:        str({ default: "" }),
  HUGGINGFACE_API_KEY:   str({ default: "" }),
  OLLAMA_API_URL:        url({ default: "http://localhost:11434" }),
});
