export type LLMMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface LLMService {
  generateReply(history: LLMMessage[], userMessage: string): Promise<string>;
}
