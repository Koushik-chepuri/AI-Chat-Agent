import { Request, Response, NextFunction } from "express";
import { createUserMessageAndReplyService } from "../services/messages.service.js";

const MAX_MESSAGE_LENGTH = 2000;

export async function createMessageController( req: Request, res: Response, next: NextFunction ) {
    try {
        const { conversationId, content } = req.body;

        if (typeof conversationId !== "string" || !conversationId.trim()) {
        return res.status(400).json({ error: "Invalid conversationId" });
        }

        if (typeof content !== "string") {
        return res.status(400).json({ error: "Message content must be a string" });
        }

        if (!content.trim()) {
        return res.status(400).json({ error: "Message cannot be empty" });
        }

        if (content.length > MAX_MESSAGE_LENGTH) {
        return res.status(413).json({
            error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`
        });
        }

        const result = await createUserMessageAndReplyService( conversationId, content.trim() );

        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
}
