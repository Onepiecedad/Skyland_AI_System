# Skyland AI Proxy

FastAPI proxy that issues signed ElevenLabs WebSocket URLs. The frontend connects directly to ElevenLabs for voice — no audio passes through this proxy.

It also accepts post-call reports on `/voice/call-ended` and forwards them to n8n for Supabase ingestion.

## Requirements

- Python 3.12+

## Local setup

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit with real keys
```

## Run locally

```bash
uvicorn main:app --reload --port 8000
```

## Test

```bash
curl http://localhost:8000/health
# → {"status":"ok","version":"0.4.0"}

curl -X POST http://localhost:8000/voice/signed-url \
  -H "Content-Type: application/json" \
  -d '{"session_uuid":"550e8400-e29b-41d4-a716-446655440000"}'
# → {"signed_url":"wss://..."}

curl -X POST http://localhost:8000/voice/call-ended \
  -H "Content-Type: application/json" \
  -d '{"session_uuid":"550e8400-e29b-41d4-a716-446655440000","conversation_id":"conv_123","transcript":"Hej","source":"browser_sdk"}'
# → {"status":"accepted"}
```

## Docker

```bash
docker build -t skyland-proxy .
docker run -p 8000:8000 --env-file .env skyland-proxy
```

---

## Frontend Integration Contract

This contract defines what frontend clients must implement to start a voice session.

### Endpoint

```
POST /voice/signed-url
```

**Dev:** `http://localhost:8000/voice/signed-url`
**Prod:** `https://proxy.skylandai.se/voice/signed-url`

### Request

```json
{
  "session_uuid": "<uuid v4>"
}
```

### Success Response (200)

```json
{
  "signed_url": "wss://..."
}
```

The signed URL is valid for ~15 minutes. Frontend must connect promptly.

### Error Responses

| Status | Meaning | Frontend action |
|--------|---------|-----------------|
| 400    | Invalid session UUID or no agent configured | Show "Session error, please reload" |
| 502    | ElevenLabs API unreachable | Show "Voice unavailable, try the form" |
| 503    | Server misconfigured (missing API key) | Show "Voice unavailable, try the form" |

### Frontend Flow

1. User clicks "Start conversation"
2. Request mic permission (`getUserMedia`)
3. `POST /voice/signed-url` with session UUID from `SkylandSession.get().id`
4. Receive `signed_url` from response
5. Connect to ElevenLabs via `@elevenlabs/client` SDK using `signed_url`
6. Audio flows directly between browser and ElevenLabs (not through this proxy)

### Post-call ingestion

```
POST /voice/call-ended
```

Accepts normalized end-call payloads from ElevenLabs webhooks or browser-side SDK fallback reporting. The proxy validates `session_uuid` when present and forwards the payload to `VOICE_CALL_WEBHOOK_URL`.
