# PreScribe

PreScribe — AI-powered patient health journey and intelligent clinical case-taking platform built for Smart India Hackathon 2026.

## Deploying to Vercel

Import this repository in Vercel as a Vite project. Vercel will use `npm run build` and publish the `dist` directory.

Set these Production environment variables in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use the project URL and public anon key from Supabase. Do not add server-side secrets such as `GEMINI_API_KEY` to Vercel; Gemini is used only by the Supabase Edge Functions. The included `vercel.json` rewrites browser routes to `index.html`, so refreshing authenticated routes works correctly.
