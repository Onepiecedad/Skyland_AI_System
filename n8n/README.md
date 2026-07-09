# n8n Workflows — Skyland

## Mappstruktur

| Mapp | Status | Användning |
|------|--------|-----------|
| `workflows/` | **Kanonisk källa** | Importeras/pushas till n8n. Använder n8n-credentials (supabaseApi, openAiApi) — inga nycklar i JSON. |
| `credential-deploy/` | OK | Deploy-varianter som använder credential-referenser. |
| `deploy/` | **DEPRECATED — sanerad 2026-07-09** | Innehöll Supabase-nycklar i klartext. Nycklarna är ersatta med `REDACTED_ROTATE_THIS_KEY`. Använd inte dessa filer. |

## ⚠️ Säkerhetsåtgärd krävs (2026-07-09)

`deploy/*.json` låg med Supabase service-nycklar i klartext i repot. Filerna är sanerade, men nycklarna ska betraktas som läckta:

1. **Rotera Supabase-nycklarna** (Dashboard → Settings → API → Reset).
2. Uppdatera n8n-credentialen `supabaseApi` med den nya nyckeln.
3. Uppdatera `SUPABASE_SERVICE_ROLE_KEY` i SCC backend `.env`.

## Placeholders att ersätta vid import

| Placeholder | Var | Värde |
|-------------|-----|-------|
| `<SCC_INTAKE_TOKEN>` | Notify SCC-noder (void-submission, voice-call-ended) | SCC:s API-token (backend `SCC_API_TOKEN`) |
| `<RAG_SHARED_SECRET>` | rag-query "Validate Input" + void-submission "Query Knowledge Base"-header | Valfri lång slumpsträng — samma på båda ställena. Genererar: `openssl rand -hex 32` |

## Ändringar 2026-07-09

- **Notify SCC**: URL bytt från ngrok free-tunnel (`legged-important-bully.ngrok-free.dev`) till `https://scc.skylandai.se/api/v1/leads/intake`. Ngrok-tunneln var en tickande bomb — leads försvann tyst när tunneln dog.
- **Retry**: Alla Supabase/OpenAI HTTP-noder har nu `retryOnFail` (3 försök, 1 s mellanrum).
- **Felisolering (void-submission)**: Query Knowledge Base, Generate AI Response, Update Prospect Score och Insert Interaction har `onError: continueRegularOutput`. Leaden sparas alltid — även om AI-svaret fallerar får besökaren fallback-texten från Format Response.
- **rag-query**: Webhooken kräver nu header `X-Skyland-Key` (shared secret). Utan den svarar workflown UNAUTHORIZED. void-submission skickar headern automatiskt.

## Deploy till n8n

Via API:

```bash
curl -X PUT "https://onepiecedad.app.n8n.cloud/api/v1/workflows/<id>" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @workflows/void-submission.json
```

Eller manuellt: n8n UI → Workflow → Import from File. Ersätt placeholders först.
