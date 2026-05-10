"""Validate incoming session UUIDs.

Keeps the regex pattern strict to UUIDv4 — the only version Skyland generates.
"""

import re

UUID_V4_PATTERN = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


def is_valid_session_uuid(value: str) -> bool:
    """Return True if *value* is a valid v4 UUID string."""
    return bool(UUID_V4_PATTERN.match(value))
