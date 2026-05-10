"""Thin async wrapper around the ElevenLabs Conversational AI REST API.

Uses httpx — no SDK dependency needed.
Only the signed-URL endpoint is used; the frontend handles the actual
WebSocket audio session directly via the ElevenLabs WebSocket API.
"""

import logging

import httpx

logger = logging.getLogger("skyland.proxy.elevenlabs")

ELEVENLABS_API_BASE = "https://api.elevenlabs.io"
SIGNED_URL_ENDPOINT = f"{ELEVENLABS_API_BASE}/v1/convai/conversation/get-signed-url"

# Timeout for the REST call (generous to handle cold starts)
_TIMEOUT = httpx.Timeout(15.0, connect=5.0)


class ElevenLabsAPIError(Exception):
    """Raised when the ElevenLabs API returns an unexpected response."""

    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(f"ElevenLabs API {status_code}: {detail}")


class ElevenLabsClient:
    """Async client for ElevenLabs Conversational AI endpoints."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def get_signed_url(self, agent_id: str) -> dict:
        """Request a signed WebSocket URL for a conversation session.

        Returns ``{"signed_url": "wss://..."}``

        The signed URL is valid for 15 minutes. The conversation itself
        can last longer, but must be initiated within that window.

        Raises :class:`ElevenLabsAPIError` on non-200 responses.
        """
        headers = {"xi-api-key": self.api_key}
        params = {"agent_id": agent_id}

        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            resp = await client.get(
                SIGNED_URL_ENDPOINT, headers=headers, params=params
            )

        if resp.status_code != 200:
            logger.error(
                "ElevenLabs get-signed-url failed: %s %s",
                resp.status_code,
                resp.text,
            )
            raise ElevenLabsAPIError(resp.status_code, resp.text)

        data = resp.json()
        logger.info("ElevenLabs signed URL created for agent=%s", agent_id)
        return {"signed_url": data["signed_url"]}
