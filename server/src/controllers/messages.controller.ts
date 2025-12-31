import { Request, Response, NextFunction } from "express";
import {
  createUserMessageService,
  generateAssistantReplyService,
} from "../services/messages.service.js";

const MAX_MESSAGE_LENGTH = 2000;

export async function createMessageController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { conversationId, content } = req.body;

    if (typeof conversationId !== "string" || !conversationId.trim()) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    if (typeof content !== "string") {
      return res
        .status(400)
        .json({ error: "Message content must be a string" });
    }

    const trimmed = content.trim();

    if (!trimmed) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return res.status(413).json({
        error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`,
      });
    }

    const userMessage = await createUserMessageService(conversationId, trimmed);
    res
      .status(201)
      .json({ user: userMessage, assistant: null, status: "thinking" });

    generateAssistantReplyService(conversationId, trimmed).catch((err) => {
      console.error("AI reply failed:", err);
    });
  } catch (err) {
    next(err);
  }
}
