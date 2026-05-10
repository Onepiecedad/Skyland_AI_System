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

## V07 — Language Detection & Switcher

- **`app/lang.js`**: Priority chain: URL `?lang=` → localStorage → `navigator.language` → default `sv`
- **`app/i18n.js`**: Delegates to `SkylandLang`, default changed `en` → `sv`
- **SV/EN buttons** in header replace single toggle
- Agent routing: `SkylandLang.getAgentId()` → proxy → ElevenLabs signed URL

---

## V08 — Conversation Starters

### Starter → Variant 1 override architecture

1. `lang.js` contains `STARTER_RESPONSES[lang][starterText]` → Variant 1 firstMessage
2. `getStarterResponse()` returns override text or `null` (→ Variant 2 default)
3. `voice.js` passes `sessionConfig.overrides.agent.firstMessage` to SDK
4. "Vad kan ni hjälpa mig med?" / "What can you help me with?" → `null` (too circular)
5. "Vanlig konversation" button → `null` → Variant 2

### SDK 1.4.0 quirk (critical)

The correct SDK key is **`overrides`**, NOT `conversationConfigOverride`.

```javascript
// WRONG — SDK silently ignores this:
sessionConfig.conversationConfigOverride = { agent: { firstMessage: text } };

// CORRECT — SDK 1.4.0 maps this to conversation_config_override in WebSocket:
sessionConfig.overrides = { agent: { firstMessage: text } };
```

### ElevenLabs agent config required

Both agents must have `platform_settings.overrides.conversation_config_override.agent.first_message: true` enabled in Security tab. Without this, SDK throws error on override attempt.

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

### Alex verbosity tendency

**Observed:** Alex sometimes combines confirmation + transition + solution + question in the same turn (4 sentences). The 2-sentence hard rule in the prompt reduces but doesn't fully eliminate this.

**Action:** Evaluate after 10+ production calls whether this is a real problem or acceptable conversational flow. If persistent, consider adding explicit `WAIT` markers between confirmation and next question in the prompt.
