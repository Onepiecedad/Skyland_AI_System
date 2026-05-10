# V06 Handover — Bilingual Alex Agents

## Completed

| Agent | ID | LLM | TTS | Voice | Prompt |
|-------|----|-----|-----|-------|--------|
| English | `TDgRNcUoUC1GHVKK0bHH` | gemini-2.5-flash | eleven_turbo_v2 | Sarah | v4 (12659 chars) |
| Swedish | `agent_8701kr69134ge7gvh3a6tcmkhq95` | gemini-2.5-flash | eleven_flash_v2_5 | Anna (`1Iztu4UHnTb9SUjJcpS1`) | v8 (12290 chars) |

### Key config (both agents)
- Temperature: 0.3
- Stability: 0.45, Similarity: 0.75, Speed: 1.0
- Turn timeout: 7s, Eagerness: eager, Soft timeout: 3s (LLM-generated)
- Timezone: Europe/Stockholm
- Tools: 6 (get_current_time, book_meeting, get_available_slots, query_knowledge_base, end_call, language_detection)

### TTS restriction discovered
- `eleven_flash_v2_5` is **multilingual** — rejected for `language: en` agents
- `eleven_turbo_v2` is **English-only** — accepted for English agents
- This is enforced by ElevenLabs API validation, not optional

### Backups
- `/docs/backups/alex-en-backup-2026-05-10.json`
- `/docs/backups/alex-sv-backup-2026-05-10.json`

---

## POST-LAUNCH

### ElevenLabs Tests (eval-suite)
**When:** After 10-50 real production conversations.

Design an eval-suite using ElevenLabs' built-in Tests feature. Tests should verify:

1. **Name capture** — Alex asks for and captures visitor name before STEP 3
2. **One-question-at-a-time** — Alex never asks multiple questions in a single turn
3. **No meta-commentary about tools** — Alex never says "let me check our knowledge base" or similar
4. **No hallucination of customer names/prices** — Alex only cites Cold Experience, MarinMekaniker, Hasselblads Livs, Norra Hamnens Bilskola
5. **2-sentence limit** — No turn exceeds 2 sentences

Use **LLM-judge** pattern from Alexis reference (`hallucination_kb` metric). Each test case should include:
- Scenario description
- Expected behavior criteria
- LLM-judge rubric (pass/fail with reasoning)

Reference: ElevenLabs Alexis eval-suite pattern for hallucination detection and compliance scoring.
