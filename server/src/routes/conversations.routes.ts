import { Router } from "express";
import {
  createConversationController,
  getConversationMessagesController,
  listConversationsController,
} from "../controllers/conversations.controller.js";

const router = Router();

router.post("/", createConversationController);
router.get("/", listConversationsController);
router.get("/:id/messages", getConversationMessagesController);

export default router;
