import { env } from "../../config/env.js";
import type { LLMService } from "./llm.interface.ts";
import { MockLLMService } from "./mock-llm.service.js";
import { OllamaLLMService } from "./ollama-llm.service.js";

async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${env.OLLAMA_BASE_URL}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function getLLMService(): Promise<LLMService> {
  if (env.USE_MOCK_LLM === "true") return new MockLLMService();

  const ok = await isOllamaAvailable();
  if (ok) return new OllamaLLMService();

  console.warn("Ollama not detected. Falling back to MockLLMService.");
  return new MockLLMService();
}
