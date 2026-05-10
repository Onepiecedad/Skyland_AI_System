-- =============================================================================
-- Skyland AI System – Initial Schema Migration
-- TICKET-002: Database schema for sessions, interactions, prospects, knowledge_base
-- 
-- Prerequisites:
--   Enable pgvector extension in Supabase Dashboard BEFORE running this migration:
--   Database → Extensions → vector → Enable
--
-- This migration is idempotent (CREATE TABLE IF NOT EXISTS).
-- All timestamps use timestamptz. All JSONB fields default to '{}'.
-- =============================================================================

-- Enable pgvector (will no-op if already enabled via Dashboard)
CREATE EXTENSION IF NOT EXISTS vector;

-- -----------------------------------------------------------------------------
-- sessions: Binds a visitor to all their activity via session_uuid.
-- The session_uuid is generated client-side and persisted in localStorage.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_uuid    uuid        UNIQUE NOT NULL,
    created_at      timestamptz DEFAULT now(),
    last_active_at  timestamptz DEFAULT now(),
    user_agent      text,
    entry_module    text,
    metadata        jsonb       DEFAULT '{}'::jsonb
);

-- -----------------------------------------------------------------------------
-- interactions: Individual visitor actions (voice call, form view, page view).
-- Always tied to a session. Cascade-deletes when session is purged.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interactions (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_uuid    uuid        NOT NULL
                                REFERENCES sessions(session_uuid) ON DELETE CASCADE,
    type            text        NOT NULL
                                CHECK (type IN ('voice', 'form', 'view')),
    payload         jsonb       DEFAULT '{}'::jsonb,
    created_at      timestamptz DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- prospects: Lead data from Void (form intake). Consent and retention are
-- GDPR requirements — retention_until defaults to 30 days from creation.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prospects (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_uuid    uuid        NOT NULL
                                REFERENCES sessions(session_uuid) ON DELETE CASCADE,
    name            text,
    email           text,
    company         text,
    website         text,
    phone           text,
    message         text,
    score           integer     DEFAULT 0,
    consent_given   boolean     DEFAULT false,
    retention_until timestamptz DEFAULT now() + interval '30 days',
    created_at      timestamptz DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- knowledge_base: RAG content for the voice agent and AI-powered responses.
-- Embeddings are OpenAI text-embedding-ada-002 (1536 dimensions).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_base (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    title           text        NOT NULL,
    content         text        NOT NULL,
    category        text        CHECK (category IN ('service', 'faq', 'case_study', 'tech')),
    embedding       vector(1536),
    metadata        jsonb       DEFAULT '{}'::jsonb,
    created_at      timestamptz DEFAULT now()
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Fast lookup by session_uuid (the system's primary correlation key)
CREATE INDEX IF NOT EXISTS idx_sessions_session_uuid
    ON sessions (session_uuid);

CREATE INDEX IF NOT EXISTS idx_interactions_session_uuid
    ON interactions (session_uuid);

CREATE INDEX IF NOT EXISTS idx_prospects_session_uuid
    ON prospects (session_uuid);

-- Approximate nearest-neighbor search for RAG retrieval
-- ivfflat requires at least some rows to build lists; start with lists=100
-- and rebuild after populating knowledge_base if needed.
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding
    ON knowledge_base
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
