# Skyland AI System – Project Operations Document (POD)

## 1. What This Is

A website for Skyland AI Solutions that is itself an operational instance of the system being sold. Every visitor becomes a real lead processed through the full stack – voice agent, form intake, CRM creation, automated email, follow-up – with a live dashboard showing their case moving through the system in real time. The site sells by demonstration. The burden of proof lies on the system itself.

## 2. Why It Works

Trust is not built through persuasion. It is built when the hands do what the mouth promised. Twenty years as an osteopath taught the owner this: a client who lies on the table and feels their pain shift does not need a brochure. Skyland's site follows the same logic. It does not say "we build systems that work." It is a system that works, and the visitor feels it.

This inverts how AI consultants typically sell. Instead of case studies and trusted-by logos, the visitor's own session is the case study. Instead of demos booked next week, the demo is now. Instead of qualifying leads in discovery calls, qualification happens in the flow itself – the visitor who talks to the voice agent and submits the form has already self-selected.

Secondary benefit: the site doubles as Skyland's R&D environment. Every visitor is a production test. Edge cases, latency, RAG precision are exposed on internal traffic before reaching paying clients. The stack powering the site is identical to the stack sold to clients, making the site a reference implementation. When a prospect asks "can you build something like this for us?" the answer is "you are standing in it."

## 3. System Architecture

**Frontend:** Built in Stitch 2.0, exported to Google Antigravity. Four modules – Core, Neural, Flux, Void – plus a Dashboard to be built. Dark green-on-black HUD aesthetic. Session UUID assigned on page load, persisted across modules.

**Backend services:**
- **n8n** (self-hosted at n8n.skylandai.se) – workflow orchestration, post-call processing, CRM sync, email triggers, RAG context injection
- **Supabase** (PostgreSQL + pgvector) – data layer, knowledge base embeddings, session tracking, prospects, interactions, outreach log
- **FastAPI proxy** (to be deployed, Render or Fly.io EU region) – WebSocket handler for Retell voice streaming, API key isolation, session binding
- **Retell AI** – voice agent runtime
- **ElevenLabs** – TTS where applicable
- **OpenAI / Claude** – LLM inference for chat, form responses, RAG generation

**Data flow:**
```
Visitor → Frontend (Antigravity)
   ↓
Voice: Frontend ⟷ FastAPI WebSocket ⟷ Retell API
Form: Frontend → n8n webhook → Supabase + LLM + CRM
   ↓
Post-event: FastAPI/n8n → Supabase logging → CRM update → Email scheduler
   ↓
Dashboard: WebSocket/polling from Supabase → Frontend live view (filtered by session UUID)
```

## 4. Module Breakdown

**Core** – Hero. Static. "We're not a software developer. We're all of them. The intelligent nervous system for service SMBs."

**Neural** – Problem framing. "Most companies buy AI tools. Then nothing happens." Four-step process: Find what's worth automating → Build → Deploy → Train.

**Flux** – Live voice agent. Visitor talks to Retell agent with RAG access to Skyland's knowledge base. Agent answers questions on pricing, delivery time, tech stack, can book meetings. Conversation logged to Supabase, transcribed, scored.

**Void** – Form intake. Visitor submits name, email, company, website, phone, message. Inline AI response generated within seconds based on profile. Background: lead card created, scoring runs, follow-up email scheduled.

**Dashboard** (to be built) – Live command-center view filtered by visitor's session UUID. Shows their own case moving through the system: lead created → scored → CRM card → follow-up scheduled. Hexagonal node visualization, real data, real time.

## 5. Knowledge Base

**Schema:**
```sql
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- 'service', 'faq', 'case_study', 'tech'
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops);
```

**Retrieval flow (n8n):** Webhook in → extract query → OpenAI embedding → Supabase similarity search → inject top 3 chunks into system prompt → return.

**Categories to populate:** Services, FAQ, case studies (Hasselblads Livs, Cold Experience, marinmekaniker.nu), tech stack documentation. Structure built first, content filled in second phase.

## 6. Build Order

Dependencies enforce sequence. Do not parallelize across these tiers.

**Tier 1 – Foundation (blocks everything else):**
1. Session UUID system across frontend
2. Supabase schema for knowledge_base, sessions, interactions
3. FastAPI WebSocket proxy for Retell (~100 lines)

**Tier 2 – Module activation:**
4. Form submission n8n workflow (Void): lead creation, scoring, AI response, email schedule
5. RAG retrieval workflow in n8n (required before Flux agent has knowledge)
6. Retell agent configuration with RAG context injection (Flux)

**Tier 3 – Visibility and hardening:**
7. Dashboard component with session-bound live updates
8. Rate limiting (per IP and per session)
9. Cleanup routines (test lead retention policy)
10. Fallback states (see section 8)

## 7. GDPR and Compliance

This is not optional. The site creates real personal data records on real people in Sweden.

**Required before launch:**
- Explicit consent checkbox on form submission, language reviewed against GDPR Article 7
- Privacy policy linked from every interaction surface (form, voice, dashboard)
- Retention policy defined and implemented: form submissions purged after defined period unless lead converts
- Right to erasure endpoint – visitor can request deletion via email or self-service
- Data processor agreements verified for all third-party services (Retell, OpenAI, Supabase, ElevenLabs)
- Voice recordings: visitor must be informed before recording starts, with opt-out option that still allows agent interaction
- Cookies/session tracking: cookie banner if any non-essential tracking is used

If voice agent is launched without recording disclosure, this is a compliance violation. Build the disclosure into the voice agent's first utterance.

## 8. Failure Modes and Fallbacks

The site executes real operations. Failures are visible to visitors.

**Retell unavailable:** Flux module degrades to text chat with same RAG-backed agent. Visitor sees "Voice link unavailable, switching to text input."

**n8n webhook timeout:** Form submission queues locally in browser, retries on backoff, surfaces error after three failures with email fallback.

**RAG returns low-confidence results:** Agent responds with "Let me get a human on this" and creates a flagged lead in CRM rather than fabricating.

**Supabase unreachable:** Frontend caches submission, retries. Dashboard shows "syncing" state instead of empty.

**FastAPI proxy down:** Voice module shows offline state. Form module continues working independently.

**LLM API rate limit:** Form responses fall back to a templated acknowledgment. Lead is still created. Real response delivered by email when limit resets.

Every failure path must log to Supabase with session UUID for postmortem.

## 9. Out of Scope

To prevent feature creep:

- No multi-language support at launch (Swedish + English only, English first)
- No payment processing or checkout flow
- No user accounts or login system
- No mobile app
- No public dashboard or analytics for visitors – only the visitor's own session is visible
- No A/B testing infrastructure at launch
- No third-party CRM sync (HubSpot, Salesforce) – Supabase is the CRM until proven insufficient
- No live human handoff in voice agent at launch (post-call routing only)
- No integrations with external calendars beyond Joakim's own
- Do not add chatbots from third-party providers (Intercom, Drift). The agent is the agent.

## 10. Operational Decisions Already Made

- **Real execution over simulation.** Every visitor flow triggers actual operations. Trade-off accepted: API cost and CRM noise in exchange for authentic demonstration.
- **FastAPI proxy + n8n orchestration over n8n-only.** n8n cannot host WebSocket servers. Trade-off accepted: one extra service to maintain.
- **Knowledge base structure first, content second.** Avoids rework when schema changes.
- **Supabase as CRM at launch.** Avoids premature integration complexity.
- **EU hosting where possible.** Latency to Swedish visitors and GDPR data residency.

## 11. Open Decisions

Each requires Joakim's input. Tradeoffs noted.

**Calendar integration target:** Google Calendar via n8n (already integrated, reliable, but tied to Google) versus Cal.com (more flexible, dedicated booking UX, additional service to maintain).

**Voice agent persona:** Swedish-native voice with English fallback (better fit for ICP, smaller voice model selection) versus English-first with Swedish secondary (broader voice options, weaker fit for owner-operated Swedish SMBs).

**Knowledge base authoring surface:** Direct Supabase entry (fast, no extra tooling) versus Notion-to-Supabase sync (better authoring UX, requires sync workflow).

**Lead scoring model:** Rule-based in n8n (transparent, debuggable) versus LLM-based scoring (more nuanced, less predictable, harder to audit).

**Retention period for non-converting leads:** 30 days (aggressive, reduces GDPR exposure) versus 90 days (more time for late conversion, more compliance surface).

## 12. Success Criteria

Targets to define before launch, measured at 30, 60, 90 days post-launch:

- Visitor-to-voice-conversation rate (target: TBD, baseline being established)
- Voice-conversation-to-meeting-booked rate (target: TBD)
- Form-submission-to-qualified-lead rate (target: TBD)
- Latency: voice agent response under 500ms, form AI response under 3 seconds
- Uptime: 99.5% across Retell, n8n, Supabase, FastAPI

Targets are intentionally left blank until baseline traffic exists. Setting numbers without data is theatre.

Failure of the site to convert is not architectural failure if logs show the system worked. It is a pitch, copy, or traffic problem. The system is instrumented enough to tell the difference.
