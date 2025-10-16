# PollApp (my-app)

Next.js polling app using Supabase for auth/data and optional Polly-API integration for public endpoints.

## Features
- Create, edit, and browse polls
- Supabase auth (email/password)
- Optional Polly-API client for `/register`, `/polls`, voting, and results

## Setup
1) Install
```bash
npm install
```

2) Env (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional Polly-API base URL (defaults to http://127.0.0.1:8000)
NEXT_PUBLIC_POLLY_API_BASE_URL=http://127.0.0.1:8000
```

3) Dev
```bash
npm run dev
# open http://localhost:3000
```

## Polly-API Client
In `src/lib/pollyApi.ts`:
- `registerUserViaPolly({ username, password })`
- `fetchPollsViaPolly({ skip?, limit? })`
- `voteOnPollViaPolly(pollId, optionId, accessToken?)`
- `getPollResultsViaPolly(pollId)`

## Structure
- `src/app` – routes/pages
- `src/components` – UI and poll components
- `src/contexts/AuthContext.tsx` – auth provider
- `src/lib/supabase.ts` – Supabase client
- `src/lib/types.ts` – shared types

## Scripts
- `npm run dev` – dev server
- `npm run build && npm start` – production
- `npm run lint` – lint

## License
MIT
