import { Request, Response, NextFunction } from "express";
import { createConversationService } from "../services/conversations.service.js";
import { getMessagesByConversationService } from "../services/messages.service.js";
import { getAllConversationsService } from "../services/conversations.service.js";

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

export async function listConversationsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const conversations = await getAllConversationsService();
    res.json(conversations);
  } catch (err) {
    next(err);
  }
}