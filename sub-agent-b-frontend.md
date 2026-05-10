# SUB-AGENT B INSTRUCTION: Voice Frontend (Flux Module)

## Your Role and Branch

You work exclusively on branch: **`feature/voice-frontend-flux`**

You wire the Flux module on the Skyland frontend to start voice conversations via the FastAPI proxy and `@elevenlabs/client` SDK. Sub-Agent A handles the backend — do NOT touch backend code.

## Architecture

```
User clicks "Start" → POST /voice/signed-url → receives wss:// URL
                    → Conversation.startSession({ signedUrl }) → direct audio to ElevenLabs
```

The proxy only provides the signed URL. All audio flows directly between the browser and ElevenLabs — no audio passes through the proxy.

## Context You Need First

Read these files in order:
1. `/AGENT.md` — behavior contract
2. `/proxy/README.md` — Frontend Integration Contract (what you build against)
3. `/app/index.html` — Flux module UI structure
4. `/app/app.js` — navigation and session init
5. `/app/session.js` — how to get session UUID: `SkylandSession.get().id`

## SDK: @elevenlabs/client

**Package:** `@elevenlabs/client` (replaces deprecated `@11labs/client`)
**CDN:** `https://cdn.jsdelivr.net/npm/@elevenlabs/client@latest/dist/browser.min.js`

Since the frontend is vanilla JS (no bundler), load via CDN script tag.

### Key API

```javascript
import { Conversation } from '@elevenlabs/client';

const conversation = await Conversation.startSession({
  signedUrl: 'wss://...',       // from proxy
  connectionType: 'websocket',  // or 'webrtc'
  onConnect: () => {},
  onDisconnect: () => {},
  onModeChange: ({ mode }) => {},  // 'speaking' | 'listening'
  onStatusChange: ({ status }) => {}, // 'connecting' | 'connected' | 'disconnected'
  onMessage: (message) => {},
  onError: (error) => {},
});

await conversation.endSession();
const id = conversation.getId();
await conversation.setVolume({ volume: 0.5 });
```

**The SDK handles getUserMedia, audio capture, and playback internally.**
You do NOT need to manage AudioContext, PCM frames, or ScriptProcessorNode.

## Your Scope

**You build:**
- `/app/voice.js` — voice module
- UI states in Flux module: Idle → Connecting → Listening → Speaking → Disconnected → Error
- Start/stop button that triggers voice session
- Error mapping from proxy HTTP errors to user-friendly messages

**You do NOT build:**
- Audio capture/playback code (SDK handles this)
- Backend code
- ElevenLabs tools/RAG/Cal.com integration

## Step 1: Add SDK Script Tag

In `/app/index.html`, add before app.js:

```html
<script src="https://cdn.jsdelivr.net/npm/@elevenlabs/client@latest/dist/browser.min.js"></script>
```

Verify the global is available: `window.ElevenLabsClient.Conversation` or similar.
If the CDN bundle exposes a different global, adapt accordingly. Do NOT guess — check.

## Step 2: Create /app/voice.js

Structure:

```javascript
/**
 * Voice client for the Flux module.
 * Fetches signed URL from proxy, then connects directly to ElevenLabs.
 *
 * Backend contract: /proxy/README.md
 * SDK: @elevenlabs/client (Conversation.startSession)
 */

const PROXY_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://proxy.skylandai.se';

const STATES = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  LISTENING: 'listening',
  SPEAKING: 'speaking',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
};

const ERROR_MESSAGES = {
  400: 'Session error, please reload the page',
  502: 'Voice unavailable, try the form instead',
  503: 'Voice unavailable, try the form instead',
};
```

### Flow:

1. User clicks start button
2. `POST ${PROXY_BASE}/voice/signed-url` with `{ session_uuid: SkylandSession.get().id }`
3. On success: `Conversation.startSession({ signedUrl, connectionType: 'websocket', ... })`
4. Map SDK callbacks to UI state updates
5. On end: `conversation.endSession()`
6. Clean up UI state

### Callback → State mapping:

| SDK callback | UI State |
|---|---|
| (before startSession) | CONNECTING |
| onConnect | LISTENING |
| onModeChange → 'speaking' | SPEAKING |
| onModeChange → 'listening' | LISTENING |
| onDisconnect | DISCONNECTED |
| onError | ERROR |

## Step 3: UI Integration

Update Flux section in `/app/index.html`:

- IDLE: "Start Conversation" button (green, matches HUD aesthetic)
- CONNECTING: pulsing indicator + "Connecting..."
- LISTENING: active indicator + "Listening..."
- SPEAKING: different indicator + "Dana is speaking..."
- DISCONNECTED: "Conversation ended" + restart button
- ERROR: error message + retry button

Match dark green-on-black HUD aesthetic. No new design language.

## Step 4: Wire Into app.js

When Flux module activates via navigation, show the voice start button.
When user navigates away, call `endSession()` if conversation is active.
NEVER auto-start voice on page load — always require user click.

## Acceptance Criteria

- [ ] `/app/voice.js` exists with voice module
- [ ] `@elevenlabs/client` loaded via CDN in index.html
- [ ] POST to proxy `/voice/signed-url` with session UUID
- [ ] `Conversation.startSession()` called with signed URL
- [ ] All UI states implemented (idle, connecting, listening, speaking, disconnected, error)
- [ ] HTTP error codes mapped to user-friendly messages
- [ ] `endSession()` called on navigation away or stop
- [ ] No ElevenLabs credentials in frontend code
- [ ] Proxy URL configurable (localhost vs production)
- [ ] Works end-to-end with proxy on localhost:8000

## When Stuck

Surface to master agent immediately if:
- CDN bundle doesn't expose expected globals
- `Conversation.startSession()` signature differs from docs
- SDK requires bundler and won't work via CDN script tag
- Microphone permission flow doesn't work as expected

Do NOT improvise SDK behavior. Stop and report.
