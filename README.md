# Future Me

AI-powered personal portfolio that showcases current skills, projects, and achievements while imagining a future self (predicted career milestones, aspirational projects, and a growth roadmap).

This repository contains a minimal scaffold for the MVP using the following defaults:

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- LLM integration: mock mode by default; switchable to a real provider via environment
- DB: SQLite / Prisma planned for next steps (not required for initial mock)

Quick start (PowerShell):

```powershell
# frontend
cd frontend; npm install; npm run dev

# backend
cd ..\backend; npm install; npm run dev
```

Set `LLM_MODE=mock` in a `.env` file for local dev; see `backend/.env.example`.

Next steps:
- Implement persistence with Prisma + SQLite
- Add real LLM proxy (OpenAI) behind `LLM_MODE=real`
- Add owner auth and sharing tokens

"Future Me" — envision it, build it, iterate.

