import { env } from "../../config/env.js";
import type { LLMService, LLMMessage } from "./llm.interface.js";
import { STORE_CONTEXT } from "./store-context.js";

export class OllamaLLMService implements LLMService {
  async generateReply(
    aiHistory: LLMMessage[],
    userMessage: string
  ): Promise<string> {
    const prompt = this.buildPrompt(aiHistory, userMessage);

    const res = await fetch(`${env.OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ollama error (${res.status}): ${text}`);
    }

    const data = await res.json();
    const reply = data?.response?.trim();

    if (!reply) throw new Error("Empty response from Ollama");

    return reply;
  }

  private buildPrompt(aiHistory: LLMMessage[], userMessage: string): string {
    let p = "";

    // System context (rules + knowledge)
    p += `System: ${STORE_CONTEXT}\n\n`;

    // ONLY assistant replies as context
    for (const m of aiHistory) {
      p += `AI: ${m.content}\n`;
    }

    // 🔒 HARD RESET BEFORE NEW QUESTION
    p += `\n---\n`;

    // Latest user question ONLY
    p += `User: ${userMessage}\nAI:`;

    return p;
  }
}
