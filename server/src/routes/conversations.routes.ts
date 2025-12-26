import { Router } from "express";
import { createConversationController, getConversationMessagesController } from "../controllers/conversations.controller.js";

const router = Router();

router.post("/", createConversationController);
router.get("/:id/messages", getConversationMessagesController);

export default router;
