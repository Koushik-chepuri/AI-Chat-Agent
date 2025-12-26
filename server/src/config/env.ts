import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 4000,

  DATABASE_URL: process.env.DATABASE_URL,

  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL ?? "llama3.1",

  USE_MOCK_LLM: process.env.USE_MOCK_LLM ?? "false",
};
