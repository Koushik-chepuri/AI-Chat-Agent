export type LLMMessage = {
  role: "system" | "user" | "ai";
  content: string;
};

export interface LLMService {
  generateReply(history: LLMMessage[], userMessage: string): Promise<string>;
}
