import { createApp } from "./app.js";
import { connectDB } from "./db/postgres.js";
import { env } from "./config/env.js";

async function bootstrap() {
    await connectDB();

    const app = createApp();

    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
}

bootstrap().catch(err => {
    console.error("Failed to start server", err);
    process.exit(1);
});
