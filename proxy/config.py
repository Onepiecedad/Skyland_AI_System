"""
Environment configuration for the Skyland FastAPI proxy.

Uses python-dotenv for .env loading. No pydantic-settings dependency —
keeps the surface minimal per AGENT.md rule 3.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# Load proxy/.env first; fall back to project root .env for local dev
_proxy_dir = Path(__file__).resolve().parent
_root_env = _proxy_dir.parent / ".env"

load_dotenv(_proxy_dir / ".env")  # proxy-local (takes precedence)
load_dotenv(_root_env)            # project root fallback (won't override)

# --- Required in production, optional locally ---
ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_AGENT_ID: str = os.getenv("ELEVENLABS_AGENT_ID", "")
N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "")

# --- Server settings ---
PORT: int = int(os.getenv("PORT", "8000"))
ENV: str = os.getenv("ENV", "development")

# --- CORS ---
_DEFAULT_ORIGINS: list[str] = [
    "http://localhost:3000",
    "https://skylandai.se",
    "https://www.skylandai.se",
    "https://skyland-ai-os.netlify.app",
]


def get_allowed_origins() -> list[str]:
    """Return CORS origins from env (comma-separated) or fall back to defaults."""
    raw = os.getenv("ALLOWED_ORIGINS", "")
    if raw.strip():
        return [o.strip() for o in raw.split(",") if o.strip()]
    return _DEFAULT_ORIGINS
