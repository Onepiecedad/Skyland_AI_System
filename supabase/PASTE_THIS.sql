-- =============================================================================
-- CLEANUP: Drop existing tables if they exist (from previous incomplete runs)
-- Order matters: drop dependent tables first to avoid FK conflicts
-- =============================================================================
DROP TABLE IF EXISTS knowledge_base CASCADE;
DROP TABLE IF EXISTS prospects CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- =============================================================================
-- Skyland AI System – Initial Schema Migration
-- TICKET-002: Database schema for sessions, interactions, prospects, knowledge_base
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- sessions: Binds a visitor to all their activity via session_uuid.
CREATE TABLE sessions (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_uuid    uuid        UNIQUE NOT NULL,
    created_at      timestamptz DEFAULT now(),
    last_active_at  timestamptz DEFAULT now(),
    user_agent      text,
    entry_module    text,
    metadata        jsonb       DEFAULT '{}'::jsonb
);

-- interactions: Individual visitor actions (voice call, form view, page view).
CREATE TABLE interactions (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_uuid    uuid        NOT NULL
                                REFERENCES sessions(session_uuid) ON DELETE CASCADE,
    type            text        NOT NULL
                                CHECK (type IN ('voice', 'form', 'view')),
    payload         jsonb       DEFAULT '{}'::jsonb,
    created_at      timestamptz DEFAULT now()
);

-- prospects: Lead data from Void (form intake).
CREATE TABLE prospects (
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

-- knowledge_base: RAG content for voice agent and AI responses.
CREATE TABLE knowledge_base (
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
CREATE INDEX idx_sessions_session_uuid ON sessions (session_uuid);
CREATE INDEX idx_interactions_session_uuid ON interactions (session_uuid);
CREATE INDEX idx_prospects_session_uuid ON prospects (session_uuid);
CREATE INDEX idx_knowledge_base_embedding ON knowledge_base
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- =============================================================================
-- Row Level Security
-- =============================================================================
ALTER TABLE sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Deny anon
CREATE POLICY "deny_all_anon_sessions"        ON sessions       FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_anon_interactions"     ON interactions   FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_anon_prospects"        ON prospects      FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_anon_knowledge_base"   ON knowledge_base FOR ALL TO anon USING (false);

-- Deny authenticated
CREATE POLICY "deny_all_auth_sessions"        ON sessions       FOR ALL TO authenticated USING (false);
CREATE POLICY "deny_all_auth_interactions"     ON interactions   FOR ALL TO authenticated USING (false);
CREATE POLICY "deny_all_auth_prospects"        ON prospects      FOR ALL TO authenticated USING (false);
CREATE POLICY "deny_all_auth_knowledge_base"   ON knowledge_base FOR ALL TO authenticated USING (false);
