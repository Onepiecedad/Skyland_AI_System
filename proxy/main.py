"""
Skyland AI System – FastAPI proxy.

Returns signed ElevenLabs WebSocket URLs so the frontend can connect
directly for voice sessions.  API key never leaves the server.
"""

import logging
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import (
    ELEVENLABS_AGENT_ID,
    ELEVENLABS_API_KEY,
    ENV,
    VOICE_CALL_WEBHOOK_URL,
    get_allowed_origins,
)
from elevenlabs_client import ElevenLabsAPIError, ElevenLabsClient
from session_validator import is_valid_session_uuid

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
logger = logging.getLogger("skyland.proxy")

VERSION = "0.4.0"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Log configuration on startup, clean up on shutdown."""
    origins = get_allowed_origins()
    logger.info("Skyland proxy v%s starting  env=%s", VERSION, ENV)
    logger.info("Allowed CORS origins: %s", origins)
    logger.info(
        "ElevenLabs config: api_key=%s  agent_id=%s",
        "SET" if ELEVENLABS_API_KEY else "MISSING",
        ELEVENLABS_AGENT_ID or "MISSING",
    )
    yield
    logger.info("Skyland proxy shutting down")


app = FastAPI(
    title="Skyland AI Proxy",
    version=VERSION,
    docs_url="/docs" if ENV == "development" else None,
    redoc_url=None,
    lifespan=lifespan,
)

# --- CORS (explicit origins, never wildcard) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request / Response models ---


class SignedUrlRequest(BaseModel):
    session_uuid: str
    agent_id: str | None = None


class SignedUrlResponse(BaseModel):
    signed_url: str


class VoiceCallEndedRequest(BaseModel):
    session_uuid: str | None = None
    conversation_id: str | None = None
    agent_id: str | None = None
    started_at: str | None = None
    ended_at: str | None = None
    duration_seconds: int | None = None
    transcript: str | None = None
    summary: str | None = None
    recording_url: str | None = None
    source: str | None = None
    metadata: dict[str, Any] | None = None
    raw_payload: dict[str, Any] | None = None


def _extract_session_uuid(payload: VoiceCallEndedRequest) -> str | None:
    if payload.session_uuid:
        return payload.session_uuid

    metadata = payload.metadata or {}
    raw_payload = payload.raw_payload or {}

    return (
        metadata.get("session_uuid")
        or metadata.get("sessionId")
        or raw_payload.get("session_uuid")
        or raw_payload.get("sessionId")
    )


# --- Routes ---


@app.get("/health")
async def health() -> dict[str, str]:
    """Minimal liveness probe."""
    return {"status": "ok", "version": VERSION}


@app.post("/voice/signed-url", response_model=SignedUrlResponse)
async def voice_signed_url(body: SignedUrlRequest):
    """Return a signed ElevenLabs WebSocket URL for a voice session.

    Frontend calls this once per conversation, receives the signed URL,
    then connects directly to ElevenLabs via their JS SDK.
    The API key never leaves this server.
    """
    # 1. Validate session UUID
    if not is_valid_session_uuid(body.session_uuid):
        raise HTTPException(status_code=400, detail="invalid session uuid")

    # 2. Check server config
    if not ELEVENLABS_API_KEY:
        logger.error("ELEVENLABS_API_KEY not configured")
        raise HTTPException(status_code=503, detail="voice service not configured")

    agent_id = body.agent_id or ELEVENLABS_AGENT_ID
    if not agent_id:
        raise HTTPException(status_code=400, detail="no agent configured")

    logger.info(
        "[VOICE] Signed URL requested: session=%s agent=%s",
        body.session_uuid,
        agent_id,
    )

    # 3. Fetch signed URL from ElevenLabs (server-side, protects API key)
    el_client = ElevenLabsClient(ELEVENLABS_API_KEY)
    try:
        url_data = await el_client.get_signed_url(agent_id)
    except ElevenLabsAPIError as exc:
        logger.error("[VOICE] ElevenLabs API error: %s", exc)
        raise HTTPException(status_code=502, detail="voice service unavailable")

    logger.info("[VOICE] Signed URL issued for session=%s", body.session_uuid)
    return SignedUrlResponse(signed_url=url_data["signed_url"])


@app.post("/voice/call-ended")
async def voice_call_ended(body: VoiceCallEndedRequest):
    """Forward a normalized voice call report to n8n/Supabase ingestion."""
    session_uuid = _extract_session_uuid(body)

    if session_uuid and not is_valid_session_uuid(session_uuid):
        raise HTTPException(status_code=400, detail="invalid session uuid")

    if not VOICE_CALL_WEBHOOK_URL:
        logger.error("VOICE_CALL_WEBHOOK_URL not configured")
        raise HTTPException(status_code=503, detail="voice webhook not configured")

    payload = {
        "session_uuid": session_uuid,
        "conversation_id": body.conversation_id,
        "agent_id": body.agent_id,
        "started_at": body.started_at,
        "ended_at": body.ended_at,
        "duration_seconds": body.duration_seconds,
        "transcript": body.transcript,
        "summary": body.summary,
        "recording_url": body.recording_url,
        "source": body.source or "voice_call_ended",
        "metadata": body.metadata or {},
        "raw_payload": body.raw_payload or {},
    }

    logger.info(
        "[VOICE] Call ended forwarded: session=%s conversation=%s source=%s",
        session_uuid or "MISSING",
        body.conversation_id or "MISSING",
        payload["source"],
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(VOICE_CALL_WEBHOOK_URL, json=payload)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        logger.error("[VOICE] Failed to forward call-ended payload: %s", exc)
        raise HTTPException(status_code=502, detail="voice webhook unavailable")

    return {"status": "accepted"}
