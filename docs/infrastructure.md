# Infrastructure

> **Configuration:** All deployment-specific URLs and credentials are read from environment variables defined in `.env` (local) or platform secrets (Fly.io, n8n). See `.env.example` for required variables. The Supabase project URL is stored as `SUPABASE_URL`.

## FastAPI Voice Proxy

- **Provider:** Fly.io
- **Region:** arn (Stockholm)
- **URL:** https://skyland-voice-proxy.fly.dev
- **Custom domain:** proxy.skylandai.se (not yet configured)
- **Healthcheck:** GET /health
- **Machine ID:** e822505fe60578, d8d1130a9e5048
- **VM:** shared-cpu-1x, 256MB RAM
- **Config:** auto_stop_machines=false, min_machines_running=1 (no cold starts)
- **Environment variables:**
  - `RETELL_API_KEY` — not yet set (set via `fly secrets set`)
  - `N8N_WEBHOOK_URL` — https://n8n.skylandai.se/webhook
  - `ALLOWED_ORIGINS` — localhost:3000, skylandai.se, www.skylandai.se
  - `ENV` — production

### Deploy

```bash
cd proxy/
fly deploy
```

### Secrets management

```bash
fly secrets set KEY="value"
fly secrets list
```

## Supabase

- **Project:** See `SUPABASE_URL` env variable
- **Region:** eu-north-1 (Stockholm)
- **URL:** `${SUPABASE_URL}`

## n8n

- **Provider:** n8n Cloud
- **URL:** https://n8n.skylandai.se
- **Instance:** onepiecedad.app.n8n.cloud
