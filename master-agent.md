# MASTER AGENT INSTRUCTION: ElevenLabs Voice Integration (Dana)

## Your Role

You are the master agent for this work session. You do NOT write code yourself. You coordinate two sub-agents working in parallel, verify their deliverables, and report status to Joakim.

Your responsibilities:
1. Read project context and confirm understanding
2. Set up feature branches for parallel work
3. Run the SDK verification step (this MUST happen before sub-agents implement audio handling)
4. Distribute the two sub-agent instructions
5. Verify deliverables against acceptance criteria
6. Coordinate merge order
7. Surface blockers and decisions to Joakim

## Context You Need First

Read these files in order:
1. `/AGENT.md` — your behavior contract and hard rules
2. `/skyland-pod.md` — full architecture, sections 3, 6, 8 specifically
3. `/proxy/main.py` and `/proxy/requirements.txt` — current proxy state
4. `/app/index.html`, `/app/app.js`, `/app/session.js` — current frontend state
5. The two sub-agent instructions you will distribute (see below)

## Project Constants (Pass These To Sub-Agents Verbatim)

```
ELEVENLABS_AGENT_ID:    TDgRNcUoUC1GHVKK0bHH
CAL_EVENT_TYPE_ID:      2268872          # 15 Min Meeting with Joakim
CAL_USERNAME:           joakim-landqvist-yrcioq
N8N_BASE_URL:           https://onepiecedad.app.n8n.cloud
SUPABASE_URL:           ${SUPABASE_URL}  # see .env
SUPABASE_REGION:        eu-north-1 (Stockholm)
```

API keys are env vars only. Never hardcode. Never paste into chat. Never let a sub-agent see actual key values.

## Step 1: Branch Setup

Create two feature branches from `main`:

```
feature/voice-backend-proxy
feature/voice-frontend-flux
```

Confirm both branches exist before proceeding. Both sub-agents will work in parallel on their respective branches.

## Step 2: SDK Verification (Critical, Do This Yourself)

This MUST happen before either sub-agent implements audio handling. The result is a contract both sub-agents must build against.

Run these steps yourself:

1. In a clean Python 3.12 venv: `pip install elevenlabs>=1.0.0`
2. Inspect the SDK:
   ```bash
   python -c "from elevenlabs.conversational_ai.conversation import Conversation; help(Conversation)"
   python -c "import elevenlabs; print(elevenlabs.__version__)"
   ```
3. Read official docs: https://elevenlabs.io/docs/conversational-ai/overview
4. Identify and document:
   - Constructor signature for Conversation class
   - How `agent_id` is passed
   - How the WebSocket session is initiated
   - Audio frame format (PCM 16kHz 16-bit? Opus? Other?)
   - How transcripts and tool calls are surfaced
   - How graceful disconnect is handled
5. Write findings to `/docs/sdk-elevenlabs-notes.md` in this format:

```markdown
# ElevenLabs Conversational AI SDK Notes

**SDK version verified:** [version]
**Verified on:** [date]
**Reference docs:** https://elevenlabs.io/docs/conversational-ai/overview

## Conversation class
[Constructor signature, key methods]

## Session lifecycle
[How to start, how to end, what events fire]

## Audio format
- Format: [PCM/Opus/etc]
- Sample rate: [Hz]
- Bit depth: [bits]
- Channels: [mono/stereo]
- Frame size: [bytes or samples]

## Transcripts and events
[How transcripts surface, what types of events to expect]

## Tool calls
[How agent tool calls surface to the host application]

## Open questions
[Anything still unclear after verification]
```

If the SDK API differs significantly from the rough sketch in the sub-agent instructions, surface to Joakim before distributing the instructions. Don't let sub-agents build against guesses.

## Step 3: Distribute Sub-Agent Instructions

Once SDK is verified:

- Hand `/docs/instructions/sub-agent-a-backend.md` to Sub-Agent A on the `feature/voice-backend-proxy` branch
- Hand `/docs/instructions/sub-agent-b-frontend.md` to Sub-Agent B on the `feature/voice-frontend-flux` branch

Tell each sub-agent:
- Their branch name
- The path to their instruction file
- The path to the SDK notes file
- The other sub-agent's branch (so they know who to coordinate with on the contract, not by editing each other's files)

Both sub-agents work simultaneously. They share the WebSocket protocol contract documented in the proxy README. Frontend builds against the contract; backend implements the contract.

## Step 4: Monitor Progress

While sub-agents work, you do nothing on code. You observe.

Watch for:
- Sub-agents asking clarification questions — answer with reference to POD/AGENT.md/SDK notes, escalate to Joakim if outside your scope
- Sub-agents going outside their stated scope — stop them, redirect to their instruction
- Sub-agents claiming Done before acceptance criteria are met — verify, do not rubber-stamp

Do NOT:
- Write code yourself
- Edit either sub-agent's branch
- Make architectural decisions without Joakim's input

## Step 5: Verify Deliverables

When each sub-agent reports Done, verify against their acceptance criteria. Do not trust self-reports. Run the actual checks.

For Sub-Agent A (backend):
- [ ] `/proxy/requirements.txt` contains elevenlabs, websockets, httpx
- [ ] `/proxy/voice_handler.py` exists with documented structure
- [ ] `/proxy/main.py` registers `/ws/voice` route
- [ ] `/proxy/.env.example` includes new variables
- [ ] `/proxy/README.md` documents frontend contract
- [ ] `uvicorn main:app` starts without errors
- [ ] `/health` still returns 200
- [ ] `/ws/voice` accepts connections (rejects with proper close codes for invalid input)
- [ ] No API keys committed
- [ ] Audio pump implemented OR explicitly flagged as pending verification with reason

For Sub-Agent B (frontend):
- [ ] WebSocket connection logic exists in Flux module
- [ ] Mic permission flow implemented
- [ ] UI states for Connecting/Listening/Speaking/Disconnected exist
- [ ] Close code error mapping implemented
- [ ] Init message format matches contract
- [ ] No ElevenLabs credentials in frontend bundle
- [ ] Configurable proxy URL (dev vs prod)
- [ ] Audio capture/playback implemented OR explicitly flagged as pending

If either sub-agent has unfinished items, do NOT merge. Report status to Joakim with what's blocking.

## Step 6: Coordinate Merge

Both branches must be ready before merge. If only one is done, hold the merge.

When both are verified Done:
1. Merge `feature/voice-backend-proxy` into main first (frontend depends on contract)
2. Merge `feature/voice-frontend-flux` into main second
3. Update `CHANGELOG.md`:
   ```
   feat(proxy): scaffold ElevenLabs voice handler with session validation
   feat(frontend): wire Flux module to voice WebSocket
   ```
4. Move ticket files from `/docs/tickets/in-progress/` to `/docs/tickets/done/`

Do NOT merge to main without Joakim's explicit go-ahead.

## Step 7: Final Status Report

Write a concise report covering:
- What shipped on each branch
- SDK findings (link to notes file)
- What's verified end-to-end vs assumed
- Open questions for next session
- Recommended next ticket

Examples of what next ticket might be:
- If audio pump is implemented and working: build n8n RAG workflow + tool wiring
- If audio pump is pending: complete pump now that SDK is understood
- If a major SDK surprise was found: re-evaluate architecture before continuing

## Hard Constraints

- Do NOT write code. You coordinate, sub-agents implement.
- Do NOT let sub-agents merge to main. Only Joakim approves merges.
- Do NOT let sub-agents bleed into each other's scope. If Sub-Agent B needs backend changes, surface to Joakim — do not authorize Sub-Agent A to expand scope.
- Do NOT skip the SDK verification step. It is the single most important risk reduction in this session.
- Do NOT touch any Skyland client repo (Hasselblads, Cold Experience, marinmekaniker).
- Do NOT modify Dana's configuration in ElevenLabs dashboard.

## When Stuck

Surface immediately to Joakim with:
- What you discovered
- What sub-agent is blocked on
- What decision is needed and the options
- Your recommendation (with reasoning)

Do not let work stall silently. Do not invent decisions outside your authority.
