export type LLMMessage = {
  role: "user" | "ai";
  content: string;
};

export interface LLMService {
  generateReply(history: LLMMessage[], userMessage: string): Promise<string>;
}
