import { getLLMService } from "../services/llm/index.js";

async function test() {
  const llm = await getLLMService();
  const reply = await llm.generateReply([], "Hello, can you help me code?");
  console.log("AI:", reply);
}

test().catch(console.error);
