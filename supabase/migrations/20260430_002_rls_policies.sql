-- =============================================================================
-- Skyland AI System – Row Level Security Policies
-- TICKET-004: RLS for sessions, interactions, prospects, knowledge_base
--
-- Security model:
--   - anon role:          DENIED on all tables (belt-and-suspenders)
--   - authenticated role: DENIED on all tables (no user auth in this system)
--   - service_role:       FULL ACCESS (bypasses RLS automatically in Supabase)
--
-- All data access flows through the FastAPI proxy using the service_role key.
-- The anon key is safe to embed in frontend code because RLS blocks everything.
-- =============================================================================

-- Enable RLS on every table
ALTER TABLE sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Deny all access for the anon role
-- service_role bypasses RLS automatically — no explicit allow policy needed.
-- -----------------------------------------------------------------------------
CREATE POLICY "deny_all_anon_sessions"
    ON sessions FOR ALL TO anon USING (false);

CREATE POLICY "deny_all_anon_interactions"
    ON interactions FOR ALL TO anon USING (false);

CREATE POLICY "deny_all_anon_prospects"
    ON prospects FOR ALL TO anon USING (false);

CREATE POLICY "deny_all_anon_knowledge_base"
    ON knowledge_base FOR ALL TO anon USING (false);

-- -----------------------------------------------------------------------------
-- Deny all access for the authenticated role (no user login in this system)
-- -----------------------------------------------------------------------------
CREATE POLICY "deny_all_authenticated_sessions"
    ON sessions FOR ALL TO authenticated USING (false);

CREATE POLICY "deny_all_authenticated_interactions"
    ON interactions FOR ALL TO authenticated USING (false);

CREATE POLICY "deny_all_authenticated_prospects"
    ON prospects FOR ALL TO authenticated USING (false);

CREATE POLICY "deny_all_authenticated_knowledge_base"
    ON knowledge_base FOR ALL TO authenticated USING (false);
