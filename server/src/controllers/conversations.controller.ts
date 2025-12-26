import { Request, Response, NextFunction } from "express";
import { createConversationService } from "../services/conversations.service.js";
import { getMessagesByConversationService } from "../services/messages.service.js";

export async function createConversationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation = await createConversationService();
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function getConversationMessagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const messages = await getMessagesByConversationService(id);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}
