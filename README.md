<img width="1837" height="876" alt="image" src="https://github.com/user-attachments/assets/be54df4b-6041-4a44-8756-61fc397a7101" /># Interview Prep — Fullstack AI Interview Platform



A fullstack interview preparation platform (Node.js backend + Vite React frontend) that evaluates mock interviews, stores results, and offers job listings.

This repository contains two main apps:
- `backend/` — Express API, AI integration, jobs seeder, MongoDB models and routers.
- `frontend/` — Vite + React UI with pages for Home, Interview, Profile and charts.

## Highlights
- AI-driven interview evaluation and feedback
- Result history, confidence & knowledge charts, and global rank
- Job listings (seedable via `jobs/jobs.json`) and seeder script
- vapi utilities for interview rooms
- Cloudinary integration for profile upload

## Quick Start (Development)

Prerequisites
- Node.js 18+ and npm or yarn
- MongoDB instance (local or hosted)

1) Clone repository

```bash
git clone <repo-url>
cd "Interview Prep"
```

2) Create env files
```bash
cp .env.example backend/.env.example  # copy to keep as reference
cp .env.example frontend/.env.example
```

Set real values in your local `.env` files (not tracked by git). See `.env.example` for required variables.

3) Backend: install & run

```bash
cd backend
npm install
# start (use whatever script your package.json exposes; commonly:)
npm run dev
# or
node app.js

```

backend Env 
PORT=8080
MONGO_URI=
JWT_SECRET=
NODE_ENV=development

GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
INTERVIEW_AGENT=





4) Frontend: install & run

```bash
cd frontend
npm install
npm run dev
# open the printed Vite URL (usually http://localhost:5173)
```

frontend env 
VITE_VAPI_PUBLIC_KEY

5) Seed Jobs (optional)

The job listings live in `backend/jobs/jobs.json` and can be imported to the database with the seeder script:

```bash
cd backend
# ensure MONGO_URI is set in backend/.env
node jobs/addJobsToDB.js
```

This script uses your configured `MONGO_URI` — set environment variables before running.

## Environment Variables (`.env.example`)

An impressive, production-ready example with comments (placeholders) is provided in `.env.example`. Fill in actual values in your local `.env` files.

- Backend variables

```
# Server
PORT=8080
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/interviewprep?retryWrites=true&w=majority

# Auth
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Cloudinary (for profile uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI / Gemini (if used)
GEMINI_API_KEY=your_gemini_api_key


```

- Frontend variables (Vite - prefixed with `VITE_`)

```
# Vite dev server
VITE_API_BASE_URL=http://localhost:8080/api
```

Notes:
- Keep secrets out of source control. Never commit `.env` files.
- Do NOT copy or overwrite any existing `.env` files in the repo — create local copies.

## Project Structure (summary)

- backend/
  - `app.js` — app launcher and middleware
  - `Controllers/` — route handlers (Authentication.js, Result.js, gemini.js etc.)
  - `Models/` — Mongoose models (userModel, resultModel, jobModel, interviewModel)
  - `Routers/` — Express routers wiring endpoints
  - `integrateAi/` & `Intelligence/` — AI integration and DB helpers
  - `jobs/` — job seeder script and jobs.json
  - `lib/cloudinary.js` — Cloudinary helper

- frontend/
  - `src/Pages/` — main pages (Home, Interview, Complete, Error)
  - `src/Components/` — reusable components (Profile, NavBar, JobCard)
  - `src/utils/` — helpers (LiveKitToken, resumeScanner, gemini utils)
  - `public/` — static assets (VAD models etc.)

## Notes about dependencies

- The repository's `package.json` files may contain packages that are not actively used. Per your request, I have not modified `package.json`. If you want, I can audit and suggest a minimal dependency list in a follow-up.

## Runtime & Deployment tips

- For production, build the frontend and serve static files from a CDN or the backend server.
- Use environment-specific `.env` files in deployment (CI/CD), and keep secrets in a secret manager.

## Troubleshooting

- If the backend cannot connect to MongoDB: verify `MONGO_URI` and network access.
- If file uploads fail: verify Cloudinary credentials.
- If LiveKit rooms fail: verify LiveKit URL and keys.




