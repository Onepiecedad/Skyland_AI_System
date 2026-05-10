# SUB-AGENT A INSTRUCTION: Voice Backend (Signed URL Endpoint)

## Your Role and Branch

You work exclusively on branch: **`feature/voice-backend-proxy`**

You build one HTTP endpoint on the FastAPI proxy: validate the visitor's session UUID and return a signed ElevenLabs WebSocket URL. The frontend then connects **directly** to ElevenLabs for audio — no audio passes through this proxy.

Sub-Agent B handles the frontend in parallel — do NOT touch frontend code or their branch.

## Context You Need First

Read these files in order:
1. `/AGENT.md` — your behavior contract and hard rules
2. `/skyland-pod.md` — architecture, sections 3, 6, 8
3. `/proxy/main.py` — current proxy state (has WebSocket handler to replace)
4. `/proxy/elevenlabs_client.py` — existing httpx wrapper for ElevenLabs API
5. `/proxy/config.py` — environment variable loading
6. `/proxy/session_validator.py` — UUID validation logic

## Project Constants

```
ELEVENLABS_AGENT_ID:    TDgRNcUoUC1GHVKK0bHH
N8N_BASE_URL:           https://onepiecedad.app.n8n.cloud
SUPABASE_URL:           ${SUPABASE_URL}  # see .env
```

API keys (`ELEVENLABS_API_KEY`) are loaded from environment variables only. Never hardcode. Never commit.

## Architecture Decision

**Signed-URL pattern, not audio proxy.**

The proxy's only job is API key isolation. It calls ElevenLabs' signed-URL endpoint server-side, returns the signed URL to the frontend, and the frontend connects directly to ElevenLabs via their JS SDK. No audio frames pass through this proxy. This gives:
- Lowest possible voice latency (direct browser ↔ ElevenLabs)
- No Python SDK dependency (one httpx GET is sufficient)
- Minimal server load (one HTTP request per call, not sustained WebSocket)

## Your Scope

**You build:**
- HTTP POST endpoint `POST /voice/signed-url`
- Session UUID validation via existing `session_validator.py`
- Signed URL fetch via existing `elevenlabs_client.py`
- Frontend contract documentation in `proxy/README.md`

**You do NOT build:**
- Frontend code
- Audio handling (frontend connects directly to ElevenLabs)
- WebSocket handler (removing the existing one)
- ElevenLabs tools, n8n workflows, Cal.com integration
- Deployment

## Step 1: Replace WebSocket Handler with HTTP Endpoint

Replace the existing `/ws/voice` WebSocket handler in `/proxy/main.py` with a clean HTTP POST endpoint.

**Request:**
```
POST /voice/signed-url
Content-Type: application/json

{
  "session_uuid": "<uuid v4>"
}
```

**Success response (200):**
```json
{
  "signed_url": "wss://api.elevenlabs.io/..."
}
```

**Error responses:**
- `400` — invalid or missing session UUID
- `400` — no agent_id configured
- `502` — ElevenLabs API error
- `503` — ELEVENLABS_API_KEY not set

Implementation notes:
- Use Pydantic `BaseModel` for request/response validation
- Use existing `is_valid_session_uuid()` from `session_validator.py`
- Use existing `ElevenLabsClient.get_signed_url()` from `elevenlabs_client.py`
- Remove all WebSocket imports and the `_INIT_TIMEOUT` constant
- Bump version to `0.4.0`

## Step 2: Clean Up Dependencies

`/proxy/requirements.txt` should contain only what's needed:
```
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
python-dotenv>=1.0.0
httpx>=0.27.0
```

Remove `websockets>=12.0` (no longer used directly — uvicorn[standard] bundles its own).

Do NOT add `elevenlabs` Python SDK. We use httpx directly.

## Step 3: Update Frontend Contract

Replace the description in `/proxy/README.md` and add a Frontend Integration Contract section:

```markdown
## Frontend Integration Contract

This contract defines what frontend clients must implement to start a voice session.

### Endpoint

```
POST /voice/signed-url
```

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
3. `POST /voice/signed-url` with session UUID
4. Receive `signed_url`
5. Connect to ElevenLabs via `@elevenlabs/client` SDK using `signed_url`
6. Audio flows directly between browser and ElevenLabs (not through proxy)
```

## Acceptance Criteria

- [ ] `POST /voice/signed-url` returns signed URL for valid session UUID
- [ ] Returns 400 for invalid/missing session UUID
- [ ] Returns 502 when ElevenLabs API fails
- [ ] Returns 503 when API key is missing
- [ ] Old `/ws/voice` WebSocket handler removed
- [ ] `/health` still returns 200
- [ ] No API keys in responses or logs
- [ ] `proxy/README.md` documents HTTP contract
- [ ] `uvicorn main:app` starts without errors
- [ ] Verified with `curl` end-to-end

## When Done

Report to master agent with:
- curl output for each endpoint (/health, /voice/signed-url with valid UUID, with bad UUID)
- Confirmed `/ws/voice` is gone
- Status of acceptance criteria checklist
