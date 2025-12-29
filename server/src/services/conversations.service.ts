import {
  createConversation,
  getAllConversations,
} from "../repositories/conversations.repo.js";

export async function createConversationService() {
  return createConversation();
}

export async function getAllConversationsService() {
  return getAllConversations();
}
