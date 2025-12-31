import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";

import healthRouter from "./routes/health.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import messagesRoutes from "./routes/messages.routes.js";

export function createApp() {
    const app = express();

    const allowedOrigins = [
      "http://localhost:5173",
      "https://ai-chat-agent-six.vercel.app",
    ];

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          return callback(new Error("CORS not allowed"));
        },
      })
    );

    app.use(express.json());

    app.use("/health", healthRouter);
    app.use("/conversations", conversationsRoutes);
    app.use("/messages", messagesRoutes);

    app.get("/", (_req, res) => {
      res.status(200).json({
        status: "ok",
      });
    });

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
