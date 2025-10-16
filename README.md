# ALX_AI_FOR_DEVS_II

Concise monorepo for a polling web app (Next.js frontend) with optional integration to a separate FastAPI backend (Polly-API) for registration and public poll data.

## Overview
- Frontend: `my-app/` (Next.js App Router, Tailwind, Supabase for auth/data)
- Optional external API: Polly-API (FastAPI) for `/register`, `/polls`, voting, and results

## Architecture
- Supabase handles in-app authentication and poll storage for the UI flows
- `src/lib/pollyApi.ts` provides client utilities to call Polly-API endpoints when needed

## Prerequisites
- Node.js 18+
- Supabase project (Anon key + URL)
- Optional: Running Polly-API server (FastAPI) if you want to use those endpoints

## Frontend Setup (my-app)
1) Install deps
```bash
cd my-app
npm install
```

2) Configure env (create `.env.local` in `my-app/`)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional: Polly-API base URL (defaults to http://127.0.0.1:8000)
NEXT_PUBLIC_POLLY_API_BASE_URL=http://127.0.0.1:8000
```

3) Run dev server
```bash
npm run dev
# open http://localhost:3000
```

## Optional Backend (Polly-API)
Follow the instructions in the Polly-API repo to run it locally, then set `NEXT_PUBLIC_POLLY_API_BASE_URL` above.

- Repo: https://github.com/Namujibril/Polly-API
- Key endpoints:
  - `POST /register` – body `{ "username": string, "password": string }`
  - `GET /polls?skip&limit` – returns array of polls
  - `POST /polls/{pollId}/vote` – JSON `{ "option_id": number }` (auth required)
  - `GET /polls/{pollId}/results` – results payload

## Using the Polly API Client (frontend)
Utilities in `my-app/src/lib/pollyApi.ts`:
- `registerUserViaPolly({ username, password })`
- `fetchPollsViaPolly({ skip?, limit? })`
- `voteOnPollViaPolly(pollId, optionId, accessToken?)`
- `getPollResultsViaPolly(pollId)`

Each function performs fetch with timeouts, parses JSON safely, and throws on non-2xx.

## Supabase
- Configured in `my-app/src/lib/supabase.ts`
- Auth context in `my-app/src/contexts/AuthContext.tsx`
- UI protected using `my-app/src/components/withAuth.tsx`

## Scripts
From `my-app/`:
- `npm run dev` – start dev server
- `npm run build && npm start` – production build/start
- `npm run lint` – lint

## License
MIT


