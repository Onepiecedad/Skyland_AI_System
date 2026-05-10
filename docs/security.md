# Skyland AI System – Security Model

## Overview

All persistent data in the Skyland AI System is stored in Supabase (PostgreSQL + pgvector). Access control is enforced at two levels:

1. **Supabase API keys** – determine which role a request authenticates as
2. **Row Level Security (RLS)** – enforces per-row access rules based on role

## Role Access Matrix

| Role | Access Level | Where Used |
|------|-------------|------------|
| `service_role` | **Full access** — bypasses RLS entirely | FastAPI proxy, n8n workflows (server-side only) |
| `anon` | **No access** — RLS denies all operations | Frontend JS (safe to expose) |
| `authenticated` | **No access** — RLS denies all operations | Not used (no user auth in this system) |

## How RLS Works in This Project

Every table has RLS enabled with explicit deny-all policies for both `anon` and `authenticated` roles. The `service_role` bypasses RLS automatically — this is a Supabase built-in behavior, not a policy we define.

This means:

- **Frontend → Supabase direct** = blocked. Even if someone extracts the anon key from frontend code, they cannot read or write any data.
- **Frontend → FastAPI proxy → Supabase** = allowed. The proxy authenticates with the service_role key, which is never exposed to the browser.
- **n8n → Supabase** = allowed. n8n workflows use the service_role key stored as an environment variable on the n8n server.

## Key Handling Rules

### service_role key

> ⚠️ **The service_role key MUST NEVER appear in frontend code, browser DevTools, or any client-accessible location.**

- Stored as environment variable on FastAPI server (`SUPABASE_SERVICE_ROLE_KEY`)
- Stored as credential in n8n (`supabase-service-role`)
- Never committed to version control
- Never logged in plaintext

### anon key

The anon key is **safe to embed in frontend JavaScript**. It is designed to be public. With RLS deny-all policies in place, it provides zero data access. Its only purpose is to identify which Supabase project the request targets.

If you see the anon key in source code or network requests, this is expected and not a security issue.

## Tables Protected

| Table | Contains | Sensitivity |
|-------|----------|-------------|
| `sessions` | Visitor session metadata, user agents | Low–Medium |
| `interactions` | Visitor actions (voice, form, view) | Medium |
| `prospects` | PII: names, emails, phone numbers, messages | **High** |
| `knowledge_base` | Public-facing content and embeddings | Low |

## GDPR Considerations

- `prospects` table has a `retention_until` column defaulting to 30 days from creation
- Consent must be captured (`consent_given = true`) before processing personal data
- Right to erasure: delete the session row and all related data cascades via FK constraints
- Voice recording disclosure is handled by the voice agent's first utterance (see POD section 7)

## Verification Checklist

When the Supabase project is provisioned, verify:

| Test | Expected Result |
|------|-----------------|
| `SELECT * FROM sessions` with anon key | Empty result or RLS error |
| `SELECT * FROM sessions` with service_role key | Returns rows |
| `INSERT INTO sessions (session_uuid) VALUES (gen_random_uuid())` with service_role | Succeeds |
| `INSERT INTO sessions (session_uuid) VALUES (gen_random_uuid())` with anon key | Denied |
| `INSERT INTO interactions (session_uuid, type) VALUES ('non-existent', 'form')` | FK constraint error |
| `SELECT embedding <=> '[0.1,0.2,...]' FROM knowledge_base` | Runs without error (pgvector) |
