# Yari Coach — UI Prototype

This repository contains a React + Vite prototype of the Yari Coach UI designed as a client-facing prototype (onboarding, dashboard, workouts, nutrition). Use the files and commands below to run a local preview or create a production preview to share with the client.

## Quick start (dev)

Install dependencies and run the dev server (HMR):

```bash
pnpm install
pnpm run dev
```

Open the app at: http://localhost:8443/

## Build & preview (stable for client review)

Create a production build and preview a static server:

```bash
pnpm run build
pnpm run preview
```

The preview command serves the `dist/` output on the configured `PORT` (default 8443). Use this when sending a stable link to the client.

## What to include when sending to the client
- Figma prototype link (view + comment access)
- This repository's production preview link (or recorded walkthrough)
- A short acceptance checklist (example below)

## Example acceptance checklist
1. Start onboarding → set gender, goal, level
2. Complete onboarding flows (steps 1–8)
3. View Dashboard, open a Workout session and play a tutorial
4. Open Settings and change theme / personal info

## Demo accounts / data
If you want demo accounts or seeded data for easier review, I can add a small demo mode that pre-fills the onboarding answers and lands the reviewer on the dashboard.

## Notes for reviewers
- The app is a front-end prototype — no remote back-end is required. Data is persisted locally with `localStorage` where available.
- Styling uses Tailwind v4 via `@tailwindcss/vite` and React 19.

## Files to look at
- `src/App.tsx` — main app and onboarding flows
- `src/main.tsx` — app entrypoint
- `vite.config.ts` — dev/build server configuration

## Need help?
If you want, I can:
- Create a short 2–3 minute walkthrough video script
- Export assets (icons/images) into a ZIP for the client
- Add a hosted preview on Vercel / Netlify and provide a permanent preview link

---
Created for client handoff — tell me which of the optional extras you want next.
