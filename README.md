# Acquisitions DevOps - Docker + Neon setup
This project is configured to run in two modes:
- Development: app + Neon Local proxy (ephemeral Neon branches)
- Production: app + Neon Cloud database URL (no Neon Local container)

## Files added
- `Dockerfile`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `.env.development`
- `.env.production`

## 1) Development (local) with Neon Local
In development, the app uses a stable local-style connection string:
- `DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb`

Neon Local creates ephemeral branches automatically on startup and deletes them on shutdown when `DELETE_BRANCH=true`.

### Configure variables
Edit `.env.development` and set:
- `NEON_API_KEY`
- `NEON_PROJECT_ID`
- Optional: `PARENT_BRANCH_ID` (if you want a specific parent branch)
- App secrets such as `ARCJET_KEY` and `JWT_SECRET`

### Start development stack
```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build
```

Services:
- App: `http://localhost:3000`
- Neon Local proxy: `localhost:5432` (inside compose network via `neon-local`)

## 2) Production with Neon Cloud
In production, use your real Neon cloud URL in `.env.production`:
- `DATABASE_URL=postgresql://...neon.tech...`

No Neon Local proxy is started in production.

### Configure variables
Edit `.env.production` and set:
- `DATABASE_URL` (Neon Cloud)
- `ARCJET_KEY`
- `JWT_SECRET`

### Start production stack
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
```

## DATABASE_URL switching between environments
- Development uses `.env.development`:
  - `DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb`
  - `NEON_LOCAL=true`
  - `NEON_LOCAL_FETCH_ENDPOINT=http://neon-local:5432/sql`
- Production uses `.env.production`:
  - `DATABASE_URL=postgresql://<user>:<password>@<endpoint>.neon.tech/neondb?sslmode=require`
  - `NEON_LOCAL=false`

The app reads these variables at runtime and switches behavior automatically.
