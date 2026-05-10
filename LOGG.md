# LOGG — Skyland AI Operating System

Kronologisk utvecklingslogg. Senaste entry överst.

---

## 2026-05-05 — TICKET-V02: RAG Retrieval Workflow ✅

**Scope:** n8n workflow `rag-query` + verifierad pipeline.

### Design-beslut (från Joakim)

1. **Similarity threshold = 0.35** (inte RPC-default 0.5).
2. **Top 3 chunks med similarity-score** synliga i response.
3. **Tom array om top similarity < 0.35.** LLM hanterar fallback med `fallback_reason: "below threshold"`.

### n8n Workflow: `rag-query`

```
Webhook POST /rag-query → Validate Input → IF valid? → Embed Query (OpenAI) → Similarity Search (Supabase RPC) → Format Response → Respond Success
                                          → IF invalid → Respond Error (400)
```

| Fil | Ändring |
|---|---|
| `n8n/workflows/rag-query.json` | **Ny.** 8-nods workflow med input-validering. |
| `scripts/test_rag_pipeline.py` | **Ny.** End-to-end pipeline-test (simulerar n8n-flödet). |
| `scripts/test_rag_results.md` | **Ny.** 8 testqueries, alla korrekt rankade. |

### Verifiering (4 obligatoriska, alla ✅)

| # | Query | Förväntat | Resultat | Status |
|---|---|---|---|---|
| 1 | "vad kostar det" | Pricing FAQ, sim > 0.5 | FAQ: Vad kostar det? sim=0.5518 | ✅ |
| 2 | "har ni jobbat med bilskolor" | Bilskola, sim ~0.4 | Case study: Bilskola sim=0.3937 | ✅ |
| 3 | "qwertyuiop blablabla nonsense" | Tom array, sim < 0.35 | matches=[], sim=0, fallback | ✅ |
| 4 | Tom query | 400 error | error: "query is required" | ✅ |

### N8n MCP

n8n cloud free tier exponerar inte Public API → MCP kan inte styra instansen. Workflow importeras manuellt via n8n UI.
Fixade `N8N_BASE_URL` i `mcp_config.json` (var `n8n.skylandai.se`, ändrat till `onepiecedad.app.n8n.cloud`).

### Manuella steg (alla klara ✅)

- [x] Importera `rag-query.json` i n8n UI
- [x] Sätt n8n env vars: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- [x] Aktivera workflow
- [x] Curl-verifiera live webhook

### Bugfix vid deploy

**Format Response-noden** använde `$input.first().json` som bara hämtade första
Supabase-resultatet istället för alla tre. Fixat till `$input.all().map(item => item.json)`.
Lokal JSON (`n8n/workflows/rag-query.json`) uppdaterad med samma fix.

---

## 2026-05-05 — TICKET-V01: Knowledge Base Populated ✅ CLOSED

**Stängd:** 2026-05-05 14:35. Flyttad till `done/`.

**Scope:** Semantisk chunkning av Hemsida_3_0.txt → embeddings → Supabase pgvector.

28 chunks från det omskrivna Hemsida_3_0.txt, manuellt klassificerade i fyra kategorier:

| Kategori | Antal | Innehåll |
|---|---|---|
| service | 7 | Tjänsteöversikt + 6 detaljerade tjänstbeskrivningar |
| case_study | 4 | Cold Experience, MarinMekaniker, Hasselblads Livs, Norra Hamnens Bilskola |
| faq | 7 | Pris, tid, avsluta, ROI, befintliga system, AI-säkerhet, teknisk nivå |
| tech | 10 | Om Skyland, filosofi, 4 paket, Joakim bio, ICP, process, kontakt |

**Embedding-modell:** `text-embedding-3-small` (1536 dimensioner)

### Verifieringsresultat

| Query | Top Match | Similarity | Status |
|---|---|---|---|
| "vad kostar det" | FAQ: Vad kostar det? | 0.5518 | ✅ |
| "har ni jobbat med bilskolor" | Case study: Norra Hamnens Bilskola | 0.3937 | ✅ |
| "I'm worried about ROI" | FAQ: Hur vet jag om det är värt det? | 0.3516 | ✅ |

**Idempotens:** Verifierad — andra körningen behåller 28 rader utan dubbletter.

| Fil | Ändring |
|---|---|
| `scripts/populate_knowledge_base.py` | **Ny.** Chunkning, embedding, upsert, verifiering |
| `scripts/test_kb_results.md` | **Ny.** Verifieringsrapport |
| `supabase/migrations/20260505_001_kb_search_function.sql` | **Ny.** Unique constraint på title + `match_knowledge_base()` RPC |
| `docs/content/Hemsida_3_0.txt` | Källa — omskriven av Joakim med riktiga case studies och priser |

### Miljövariabler som krävs

```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=eyJ...
```

---

## 2026-05-05 — Voice: Signed-URL Proxy + Frontend Live

**Scope:** ElevenLabs Conversational AI — full stack, end-to-end verifierad.

### Backend (Sub-Agent A)

Ersatte den gamla WebSocket-baserade audio-pump-proxyn med en stateless HTTP-endpoint.
Proxyn gör nu **en enda sak**: validerar session UUID, hämtar en signerad URL
från ElevenLabs API, och returnerar den till frontend. Inga API-nycklar exponeras.

| Fil | Ändring |
|---|---|
| `proxy/main.py` | Ny `POST /voice/signed-url` endpoint. Tog bort `/ws/voice` WebSocket. 190→119 rader (−37%) |
| `proxy/config.py` | Dotenv fallback: letar i `proxy/.env` först, sedan root `.env` |
| `proxy/requirements.txt` | Tog bort `websockets`-beroendet |
| `proxy/README.md` | Nytt Frontend Integration Contract (HTTP, inte WebSocket) |

**Verifierat med curl:**

- `POST /voice/signed-url` → 200 + `wss://api.elevenlabs.io/...` ✅
- Invalid UUID → 400 ✅
- Missing API key → 503 ✅
- `/ws/voice` → 404 (borta) ✅
- `/health` → 200 ✅

### Frontend (Sub-Agent B)

Kopplade Flux-modulen till ElevenLabs via `@elevenlabs/client` JS SDK (v1.4.0).
SDK:n hanterar mic-access, audio-capture, playback och WebSocket-livscykel internt —
ingen manuell AudioContext eller PCM-hantering behövs.

| Fil | Ändring |
|---|---|
| `app/voice.js` | **Ny.** Voice-modul: hämtar signed URL → `Conversation.startSession()` → state machine |
| `app/app.js` | Lade till `SkylandVoice.init()` + stoppar voice vid navigation bort från Flux |
| `app/index.html` | Lade till CDN-script för `@elevenlabs/client` + `voice.js` |
| `app/styles.css` | Voice-state CSS: idle pulse, connecting spin, listening glow, speaking bounce, error red |

**UI States:** Idle → Connecting → Listening ↔ Speaking → Disconnected / Error

**End-to-end verifierat i webbläsare:**
Dana svarade på svenska. Orb-animationer, link badge, end-call — allt fungerar.

### Arkitekturbeslut

- **Signed-URL > Audio-pump.** Proxyn är inte en audio-bottleneck. Browser ↔ ElevenLabs direkt.
- **Ingen ElevenLabs Python SDK.** Ett `httpx`-anrop (5 rader) räcker.
- **CDN-laddad JS SDK.** Inget bundler-beroende. IIFE-build via jsDelivr.
- **Dotenv fallback.** `config.py` laddar `proxy/.env` först, faller tillbaka till root `.env`.

### Miljövariabler som krävs

```
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_AGENT_ID=TDgRNcUoUC1GHVKK0bHH
```

---

## 2026-05-04 — Proxy: Scaffold + Fly.io Deploy

FastAPI-proxy scaffoldad med healthcheck, CORS, Docker.
Deployad till Fly.io i Stockholm (arn) region.

| Fil | Ändring |
|---|---|
| `proxy/main.py` | Initial scaffold med `/health`, CORS, env config |
| `proxy/Dockerfile` | Python 3.12, uvicorn |
| `proxy/fly.toml` | Stockholm region, persistent machine |

---

## 2026-05-04 — Supabase: Schema + pgvector

Databas-schema skapat: `sessions`, `interactions`, `prospects`, `knowledge_base`.
pgvector verifierat med test-script.

| Fil | Ändring |
|---|---|
| `supabase/migrations/*.sql` | Tabeller + RLS-policies |
| `scripts/test-pgvector.js` | Embedding-test mot `knowledge_base` |

---

## 2026-04-30 — Frontend: Multi-page App + Session

Fem UI-prototyper integrerade i en multipage-app (Core, Neural, Flux, Void).
Session-management med localStorage-baserade UUID:er (24h expiry).

| Fil | Ändring |
|---|---|
| `app/index.html` | Unified navigation: sidebar med 4 sektioner |
| `app/app.js` | Navigation + routing |
| `app/session.js` | UUID-generation, localStorage-persistens |
| `app/api.js` | `apiFetch` wrapper med session-header injection |
| `app/styles.css` | Komplett designsystem: glassmorphism, HUD-estetik |

---

## 2026-04-30 — n8n: Session-Init Webhook

Webhook-workflow för session-initiering via n8n.

| Fil | Ändring |
|---|---|
| `n8n/workflows/session-init.json` | Clean JSON-definierat workflow |

---
