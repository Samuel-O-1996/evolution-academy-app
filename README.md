# Evolution Academy — Hybrid Front-End

A premium React/Next.js front-end for Evolution Academy Online (Credit Direct).
Screens for Learner, Trainer, and Admin. Connects to Moodle via a secure
server-side proxy.

By default it runs in **demo mode** (sample data) so you can deploy and share a
polished, clickable app immediately. Switch to **live mode** once Moodle has real
courses and per-user auth is in place.

---

## Deploy to Vercel (browser only — no local setup)

### 1. Put this project in a GitHub repo
- Create a new repository on GitHub (e.g. `evolution-academy-app`).
- Upload these files (use github.dev — press `.` on the repo — and drag them in,
  or use "Add file → Upload files").

### 2. Import into Vercel
- Go to vercel.com → **Add New… → Project**.
- Import your `evolution-academy-app` repo.
- Framework preset: **Next.js** (auto-detected). Click **Deploy**.
- In ~1 minute you get a live URL like `evolution-academy-app.vercel.app`.

That's it — the demo app is live and shareable. 🎉

### 3. (Optional now) Add environment variables
Only needed when you switch to live Moodle data. In Vercel →
**Project → Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_DEMO_MODE` | `true` (keep true for now) |
| `MOODLE_URL` | `https://learn.evolutionacademy.com.ng` |
| `MOODLE_TOKEN` | your web-service token |

Redeploy after changing env vars.

---

## Going live (later)

1. **Populate Moodle** — create real courses, add users, enrol them. Until then,
   live mode has nothing to show.
2. **Add auth** — see the security note in `app/api/moodle/route.js`. A learner
   must only be able to fetch their own data. Align this with your Entra SSO plan.
3. **Wire the data** — set `NEXT_PUBLIC_DEMO_MODE=false`, then use the helpers in
   `lib/moodle.js` inside `components/EvolutionAcademy.jsx` to replace the sample
   constants with live fetches. The UI does not change — only the data source.

---

## Project structure

```
app/
  layout.js            root layout
  page.js              renders the app
  globals.css          base styles + Poppins
  api/moodle/route.js  server-side proxy (holds the token, whitelists functions)
components/
  EvolutionAcademy.jsx the full UI (Learner / Trainer / Admin)
lib/
  moodle.js            live-data helpers for when you flip off demo mode
```

## Notes
- The proxy only allows a fixed list of Moodle functions (see `route.js`).
- The token is a **server** env var — it is never sent to the browser.
- Course activities (taking a quiz, submitting work) still happen in themed
  Moodle; this app is the premium shell around it.
