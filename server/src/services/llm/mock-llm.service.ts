import type { LLMService, LLMMessage } from "./llm.interface.ts";

export class MockLLMService implements LLMService {
  async generateReply(_: LLMMessage[], userMessage: string): Promise<string> {
    const q = userMessage.toLowerCase();

    if (q.includes("shipping")) {
      return "We process orders within 24–48 hours. Standard shipping takes 5–7 business days, and express shipping takes 2–3 business days within India.";
    }

    if (q.includes("return") || q.includes("refund")) {
      return "Returns are accepted within 14 days of delivery. Refunds are processed within 5 business days after inspection.";
    }

    if (q.includes("support")) {
      return "Our support team is available Monday to Friday, 9:00 AM to 6:00 PM IST.";
    }

    return "This is a mock response. Only predefined FAQs are supported. Run the app locally with Ollama for full AI responses.";
  }
}

