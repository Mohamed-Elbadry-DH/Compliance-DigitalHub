# Conformix — Demo & Links

## Fastest: open the demo now (no setup)

Double-click **`Conformix-Demo.html`** (in this `conformix/` folder). It's one self-contained file — the whole app, with Digital Hub sample data, opens in your browser and works fully offline. Font: Poppins. Six screens: Dashboard, Controls, Risk Register (5×5 heat map), Evidence, Tasks, Audits.

To rebuild it after code changes:
```bash
cd frontend
npm install
npm run build:demo      # regenerates the single HTML into frontend/demo/index.html
```

## Get a real public link (share with clients)

The demo is a static site, so any static host gives you a URL in minutes:

**Option A — Netlify Drop (no account/CLI needed, ~1 min):**
1. `cd frontend && npm install && npm run build` → creates a `dist/` folder.
2. Go to https://app.netlify.com/drop and drag the `dist` folder onto the page.
3. You get a public URL like `https://conformix-demo.netlify.app` instantly.

**Option B — Vercel / Netlify from Git (auto-deploy on every change):**
Config files are already included (`vercel.json`, `netlify.toml`). Push this repo to GitHub, connect it in Vercel or Netlify, and every commit redeploys automatically. Build command `npm run build`, output `dist`.

**Option C — GitHub Pages:** run `npm run build`, publish the `dist` folder to a `gh-pages` branch.

> Demo mode is on by default (`VITE_DEMO=true`), so the public link shows Digital Hub data without needing the .NET backend running. When you connect the real backend later, set `VITE_DEMO=false`.

## Run it "for real" (with the .NET backend + database)

This makes login and data come from a real database instead of demo mode.

1. **Start the database** (Docker):
   ```bash
   cd deploy && docker compose up postgres -d
   ```
2. **Run the API** — it auto-creates the schema and seeds Digital Hub (company, frameworks, controls, users) on first start:
   ```bash
   cd backend
   dotnet run --project src/Conformix.Api      # http://localhost:5080/swagger
   ```
3. **Point the frontend at the API** (turn demo mode off):
   ```bash
   cd frontend
   echo "VITE_DEMO=false" > .env
   npm run dev                                  # http://localhost:5173
   ```

**Demo login:** every seeded Digital Hub user shares the password **`Demo123!`**.
Pick a user on the login screen (e.g. Nour Adel = Admin, Hesham Nabil = Executive) — the frontend calls `POST /api/auth/login`, gets a real JWT, and the Controls screen loads live from the database.

> Note: the backend code is complete but was **not compiled in this environment** (no .NET SDK available here). Run `dotnet build` / `dotnet test` in `backend/` on your machine to verify; fix any environment-specific issues that surface there.
