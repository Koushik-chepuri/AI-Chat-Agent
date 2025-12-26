import { createConversation } from "../repositories/conversations.repo.js";

export async function createConversationService() {
    return createConversation();
}
