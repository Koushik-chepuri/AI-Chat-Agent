## Features

- Live chat UI with user / AI messages
- Conversation-based message persistence
- Backend API with clean layering (routes, controllers, services)
- Real LLM integration via Ollama
- Deterministic mock fallback when LLM is unavailable
- Graceful error handling and degraded-mode behavior
- Deployed frontend and backend

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + TypeScript + Express
- **Database:** PostgreSQL (via Supabase)
- **LLM (Local):** Ollama
- **Deployments:**
  - Frontend → Vercel
  - Backend → Render

---

## Running the App Locally (Full AI Mode)

Running locally enables **real AI responses** via Ollama.

### Prerequisites

- Node.js (v18+)
- PostgreSQL database (local or Supabase)
- Ollama: https://ollama.com

---

### 1️⃣ Install & start Ollama

```bash
ollama serve
ollama pull llama3
```

### 2️⃣ Backend setup

```bash
cd server
npm install
```
Create a .env file in server/:

```bash
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
OLLAMA_BASE_URL=http://localhost:11434
```

Start backend:
```bash
npm run dev
```

### 3️⃣ Frontend setup
```bash
cd client
npm install
```

Create .env.local in client/:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Start frontend:
```bash
npm run dev
```

Open http://localhost:5173.

---

## Deployed Version

- Frontend: https://ai-chat-agent-six.vercel.app

- Backend: https://ai-chat-agent-1hjv.onrender.com

The deployed version demonstrates:

- UI/UX

- API structure

- Persistence

- Error handling

- Graceful fallback when LLM is unavailable

Since Ollama requires a persistent runtime, real AI responses are enabled when running locally.

---

## Architecture Overview
Backend structure

```bash
src/
├── app.ts              # Express app definition
├── index.ts            # Bootstrap (DB connect + listen)
├── routes/             # HTTP routes
├── controllers/        # Request handling
├── services/
│   └── llm/            # LLM abstraction (Ollama / Mock)
├── repositories/       # DB access layer
├── db/                 # DB connection
└── config/             # Env + config
```

Key design decisions:

- Clear separation between HTTP, business logic, and infrastructure

- LLM access abstracted behind an interface

- Controllers remain thin and testable

- Global error handler for consistent API responses

---

## LLM Notes
Provider

- Primary: Ollama (local inference)

- Fallback: Deterministic mock LLM

Prompting strategy

- System prompt defines the agent as a helpful e-commerce support assistant

- Conversation history is included for contextual replies

- FAQ/domain knowledge is injected into the prompt

Mock behavior

The mock LLM:

- Deterministically answers predefined FAQs (shipping, returns, support)

- Explicitly signals when AI is unavailable

- Prevents fake or misleading “AI-like” behavior

This allows the app to remain functional and honest when the LLM service is unavailable.

## Trade-offs & If I Had More Time

Trade-offs

- LLM inference is not hosted in production due to free-tier VM availability constraints

- Authentication and per-user access control were intentionally omitted

- RLS is not enabled as the database is accessed only via the backend API

If I had more time -

- Host Ollama on a dedicated VM (or GPU instance) for deployed inference

- Add auth and session ownership

- Stream LLM responses for better UX

- Add tests for services and repositories

- Introduce rate limiting and observability
