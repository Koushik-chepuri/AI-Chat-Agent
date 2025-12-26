import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";

import healthRouter from "./routes/health.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import messagesRoutes from "./routes/messages.routes.js";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/health", healthRouter);
    app.use("/conversations", conversationsRoutes);
    app.use("/messages", messagesRoutes);

    // global error handler
    app.use(( err: any, req: Request, res: Response, next: NextFunction ) => {
        console.error("Error:", err);

        const status = typeof err?.status === "number" && err.status >= 400 ? err.status : 500;

        const message = err instanceof Error ? err.message : "Internal server error";

        res.status(status).json({
            error: message
        });
    });

    return app;
}
