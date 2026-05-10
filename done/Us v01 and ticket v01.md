# US-V01: Visitor submits inquiry and receives AI-generated response in real time

## Epic

EPIC-V: Void Form Lead Processing

## Status

Open

## Who

A first-time visitor on skylandai.se who has scrolled through Core, Neural, and Flux modules and arrived at the Void module. They are evaluating Skyland and want to ask a specific question or describe a concrete need.

## What

The visitor fills in the Incoming Transmission form (name, email, company, website, phone, message). On submit, the system creates a real lead in Supabase, runs the message through retrieval-augmented generation against Skyland's knowledge base, and displays a personalized AI-generated response in the right-hand panel within 3 seconds. The response references concrete Skyland services, pricing, or case studies relevant to the visitor's query.

## Why

The Void module is where skeptics convert. Visitors who have engaged through the full site arrive here ready to take action. The form must do three things simultaneously:

1. Demonstrate that Skyland's AI actually works (the response itself is the proof)
2. Capture the lead with enough context for Joakim to follow up meaningfully
3. Qualify the lead by what they wrote and how they engaged

If the form returns generic "thanks, we'll be in touch" copy, the entire site's promise collapses. If it returns a specific, intelligent response that references their actual situation, the conversion has effectively happened — Joakim is just confirming details on the follow-up call.

## Acceptance Criteria

- [ ] Form submission creates a row in `prospects` table with all submitted fields, session_uuid, and a calculated lead score
- [ ] The submitted message triggers a knowledge base similarity search returning top 3 relevant chunks
- [ ] An AI-generated response is created using Claude Haiku 4.5 with the matched chunks as context
- [ ] The response is in the same language as the visitor's message (Swedish or English)
- [ ] The response references at least one specific Skyland service, price, or case study from the knowledge base
- [ ] The response is displayed inline in the right-hand panel of the Void module
- [ ] Total response time from submit to displayed response is under 4 seconds
- [ ] Loading state is visible during processing (visitor never sees a frozen UI)
- [ ] The interaction is logged in the `interactions` table with type='form'
- [ ] If the LLM call fails, a templated fallback acknowledgment is shown and the lead is still created
- [ ] If the knowledge base returns no matches above the similarity threshold, the AI response defaults to a generic but warm acknowledgment
- [ ] GDPR consent checkbox must be checked before submit is allowed
- [ ] Submit endpoint enforces rate limiting (max 5 submissions per IP per hour)

## Out of Scope

- Confirmation email to visitor (separate ticket, async post-submission workflow)
- Notification email to Joakim (separate ticket)
- Follow-up scheduling (separate ticket)
- Live dashboard showing lead moving through system (separate epic)
- Multilingual support beyond Swedish/English (post-MVP)
- File attachments in form
- CAPTCHA (honeypot field is sufficient at MVP traffic levels)

## Dependencies

- Tier 1 foundation complete (sessions, prospects, knowledge_base tables exist)
- pgvector extension enabled in Supabase
- OpenAI API key configured for embeddings
- Anthropic API key configured for Claude Haiku 4.5

## Tickets

- TICKET-V01: Populate knowledge base with embedded chunks of Hemsida_3_0.txt
- TICKET-V02: RAG retrieval workflow in n8n
- TICKET-V03: Lead processing workflow in n8n
- TICKET-V04: Wire Void form frontend to lead processing webhook
- TICKET-V05 (separate ticket): Async post-submission workflow
- TICKET-V06 (separate ticket): GDPR consent and hardening

## Notes

The chunking quality directly determines the AI response quality. A poorly chunked knowledge base produces generic-feeling responses that defeat the purpose of the entire module. TICKET-V01 should not be rushed.

The form must feel like the system is working FOR the visitor, not collecting data ABOUT them. The AI response is the gift; the lead capture is the side effect. Copy and UI choices should reflect this hierarchy.

---

# TICKET-V01: Populate knowledge base with embedded chunks of Hemsida_3_0.txt

## Status

Open

## Priority

P0

## Tier

2

## Estimate

2h

## Story Link

US-V01

## Context

The knowledge base table exists in Supabase but is empty. Without it, the RAG workflow has nothing to retrieve from, the form's AI response can only rely on generic LLM training data, and the entire Void module collapses to a smart-sounding chatbot rather than a Skyland-specific demonstration.

The source content is `/docs/content/Hemsida_3_0.txt` — a complete website copy document covering Skyland's services, case studies, pricing, FAQ, founder background, and brand manifest. It is well-written and authoritative. The task is to chunk it semantically, embed each chunk, and insert into the `knowledge_base` table with proper metadata.

This ticket builds the data foundation. Without it, V02 (RAG workflow) cannot be tested.

## Acceptance

- [ ] All chunks from Hemsida_3_0.txt loaded into Supabase `knowledge_base` table
- [ ] Each chunk has: title, content, category ('service'|'faq'|'case_study'|'tech'), embedding (1536-dim vector), metadata (jsonb with source, chunk_index, etc.)
- [ ] Chunks are semantically self-contained (a chunk about pricing makes sense without surrounding context)
- [ ] Chunk size between 200-500 tokens each
- [ ] Categories distributed approximately as follows:
  - service: 6 chunks (one per Skyland offering)
  - case_study: 4 chunks (one per case)
  - faq: 7 chunks (one per FAQ pair)
  - tech: 4-6 chunks (pricing tiers, founder bio, manifest)
- [ ] Embeddings generated using OpenAI `text-embedding-3-small` model
- [ ] A test similarity query for "vad kostar det" returns the pricing chunk(s) as top match
- [ ] A test similarity query for "har ni jobbat med bilskolor" returns the Norra Hamnens Bilskola case study as top match
- [ ] A test similarity query for "I'm worried about ROI" (English) returns relevant FAQ chunk
- [ ] Script is idempotent — running twice does not duplicate chunks (use upsert by content hash or title+category combo)

## Technical Notes

**Chunking strategy:**

Manual semantic chunking is preferred over automatic length-based splitting for this content. The document has clear logical sections that map to chunks. Read the whole document first, then partition by topic.

Suggested chunking approach (adjust based on actual content):

```
Services (6 chunks):
  - CRM och hemsida
  - AI-agenter och automation
  - Voiceflows och röstlösningar
  - Hemsidor och webbutveckling
  - Prompt engineering och AI-strategi
  - Automation och integrationer

Case studies (4 chunks):
  - Cold Experience
  - Marin Mekaniker
  - Hasselblads Livs
  - Norra Hamnens Bilskola

FAQ (7 chunks):
  Each Q+A pair as a single chunk, title = the question

Tech/About (4-6 chunks):
  - Joakim background (osteopath, gymnastiklärare)
  - Skyland manifest/philosophy
  - Pricing: Starterpaket
  - Pricing: Hemsidor
  - Pricing: Custom builds
  - Pricing: Drift- och säkerhetsavtal
```

**Embedding model:**

Use `text-embedding-3-small` (1536 dimensions, matches the schema). Do NOT use ada-002 (deprecated, worse quality).

```python
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.embeddings.create(
    model="text-embedding-3-small",
    input=chunk_text,
)
embedding = response.data[0].embedding  # list of 1536 floats
```

**Insert pattern:**

```python
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

supabase.table("knowledge_base").upsert({
    "title": chunk_title,
    "content": chunk_content,
    "category": chunk_category,
    "embedding": embedding,
    "metadata": {
        "source": "Hemsida_3_0.txt",
        "chunk_index": i,
        "language": "sv",
    },
}, on_conflict="title").execute()
```

**Source content location:**

The file `Hemsida_3_0.txt` should be placed at `/docs/content/Hemsida_3_0.txt` in the repo if not already there. Joakim has uploaded it; verify its location before starting.

## Definition of Done

- [ ] Script `/scripts/populate_knowledge_base.py` exists and runs cleanly
- [ ] Running the script outputs progress per chunk (e.g., "Inserted 14/23: FAQ - Vad händer om vi inte vill fortsätta?")
- [ ] Final count of rows in `knowledge_base` table matches expected chunk count (around 21-23)
- [ ] Three test queries documented above all return expected top matches
- [ ] Test results saved to `/scripts/test_kb_results.md` for review
- [ ] Script can be re-run safely (verified by running twice, count stays same)

## Files Touched

- `/scripts/populate_knowledge_base.py` (new)
- `/scripts/test_kb_results.md` (new, output from verification)
- `/docs/content/Hemsida_3_0.txt` (verify location, move if needed)

## Dependencies

- Supabase `knowledge_base` table exists (Tier 1 — done)
- pgvector extension enabled (Tier 1 — done)
- OpenAI API key in environment as `OPENAI_API_KEY`
- Supabase service key in environment as `SUPABASE_SERVICE_ROLE_KEY`

## Hard Constraints

- Do NOT chunk by character count or token count alone. Read the document and chunk semantically.
- Do NOT use embedding models other than `text-embedding-3-small`
- Do NOT mix categories in a single chunk (a chunk about Cold Experience case study should not also describe pricing)
- Do NOT include the script's API keys in any file. Load from environment only.
- Do NOT skip the verification queries. Bad chunking is the most common cause of bad RAG, and you will not catch it without testing retrieval explicitly.
- Do NOT proceed to TICKET-V02 (RAG workflow) until verification queries pass.

## When Stuck

Surface to Joakim immediately if:

- The source file Hemsida_3_0.txt is not found or contains different content than described
- Test queries return wrong top matches (this means chunking strategy needs adjustment, not retries)
- pgvector similarity search returns errors (likely RLS or index issue, not chunking)
- A chunk doesn't fit cleanly in any of the four categories — propose a fifth category and surface for approval

## Notes

This is a content task disguised as a coding task. The script is trivial; the chunking decisions are not. Spend 60% of the estimated time reading the source content and deciding chunks, 30% writing the script, 10% verifying retrieval.

If chunking quality is poor, the entire Void module's value collapses. This ticket is the foundation. Do not rush it.
