# BiggDate

Full-stack Vite + React app with a local Node API that supports Ollama (default) and OpenAI, plus lightweight per-session learning memory.

## Quick Start

1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Add your provider config in `.env`:
   ```env
   AI_PROVIDER=ollama-cloud
   OLLAMA_CLOUD_HOST=https://ollama.com
   OLLAMA_API_KEY=your_key
   OLLAMA_CLOUD_MODEL=gpt-oss:120b
   PORT=8787
   ```

   For local Ollama instead:
   ```env
   AI_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434/v1
   OLLAMA_MODEL=llama3.1:8b
   PORT=8787
   ```

   For OpenAI instead:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-4.1
   PORT=8787
   ```
3. Install deps:
   ```bash
   npm install
   ```
4. Run app + API together:
   ```bash
   npm run dev
   ```

- Web app: http://localhost:5173
- API health: http://localhost:8787/api/health

## Self-learning memory

- Session memory is saved in `data/memory.json`.
- The API updates memory (summary, traits, needs, boundaries, attachment guess, readiness) as conversations progress.
- This memory is injected into future prompts for continuity.

## End-to-end platform APIs

- `POST /api/profile/derive` → derive robust profile JSON from onboarding transcript.
- `POST /api/matches/generate` → structured compatible matches with authenticity + intent signals.
- `POST /api/matches/briefing` → agent briefing + date concierge + pre-date guide.
- `POST /api/intros/request` → request introduction and persist concierge package.
- `POST /api/intros/pass` → persist match pass feedback.
- `POST /api/dates/debrief` → save post-date debrief and generate coaching insight.
- `POST /api/waitlist/join` → waitlist capture for city launch.

Persistent operations data is stored in `data/platform.json`.

## Platform-owned AI credentials

- End users do not provide API keys.
- The backend exclusively uses server environment variables (`OPENAI_API_KEY` or `OLLAMA_API_KEY`) based on `AI_PROVIDER`.
- If `api/health` reports no key loaded, fix deployment env vars on the server.
