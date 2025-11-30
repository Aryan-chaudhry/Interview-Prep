Requirements and setup for Gemini + TTS/ASR endpoints

Install dependencies in the backend folder:

```powershell
cd "c:\Interview Prep\backend"
npm install @google/generative-ai @google-cloud/text-to-speech @google-cloud/speech multer
```

Environment variables (add to `backend/.env`):

- `GEMINI_API_KEY` — API key for Google Generative AI (Gemini). If you are using a service account, configure `GOOGLE_APPLICATION_CREDENTIALS` instead and provide a service account JSON with permissions for Cloud Text-to-Speech and Speech-to-Text.
- `GEMINI_MODEL` — optional model name (default: `gemini-pro`).
- `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL` — existing LiveKit credentials used elsewhere in the backend.
- `PORT`, `MONGO_URI` — existing variables used by the app.

Notes:
- The controller uses the `@google/generative-ai` client to generate interview text and `@google-cloud/text-to-speech` to synthesize MP3 audio which is returned as base64.
- The `/api/gemini/asr` endpoint accepts a single multipart `file` upload (audio/webm from the browser) and uses `@google-cloud/speech` to transcribe.
- You must enable the Google Cloud APIs (Text-to-Speech and Speech-to-Text) and provide credentials; set `GOOGLE_APPLICATION_CREDENTIALS` to the service account JSON file path or run `gcloud auth application-default login` in development.

Security:
- Do NOT commit API keys or service account JSON to version control. Keep them in `.env` or set them in your environment securely.

If you want, I can also add a small script to install these deps automatically and update `backend/package.json` to include them in `dependencies`.
