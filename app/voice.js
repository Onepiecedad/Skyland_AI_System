/**
 * Voice client for the Flux module.
 *
 * Flow:
 *   1. User clicks orb → POST /voice/signed-url with session UUID
 *   2. Proxy returns signed wss:// URL (API key stays server-side)
 *   3. ElevenLabs SDK connects directly for audio
 *   4. SDK handles mic capture, audio playback, WebSocket lifecycle
 *
 * Backend contract: /proxy/README.md
 * SDK: @elevenlabs/client v1.4.0 (IIFE via CDN → window.ElevenLabsClient)
 */

(function () {
  'use strict';

  var PROXY_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://skyland-voice-proxy.fly.dev';

  var STATES = {
    IDLE: 'idle',
    CONNECTING: 'connecting',
    LISTENING: 'listening',
    SPEAKING: 'speaking',
    DISCONNECTED: 'disconnected',
    ERROR: 'error',
  };

  var ERROR_MESSAGES = {
    400: 'Session error — reload the page',
    502: 'Voice link unavailable — try the form instead',
    503: 'Voice link unavailable — try the form instead',
  };

  // --- Internal state ---
  var currentState = STATES.IDLE;
  var conversation = null;

  // --- DOM refs (resolved on init) ---
  var orbWrap = null;
  var voiceLabelH2 = null;
  var voiceLabelP = null;
  var linkBadge = null;
  var linkText = null;
  var linkDot = null;
  var endBtn = null;

  // --- State machine ---

  function setState(newState, detail) {
    currentState = newState;
    updateUI(newState, detail);
  }

  function updateUI(state, detail) {
    if (!orbWrap) return;

    // Remove all state classes from orb
    orbWrap.classList.remove('voice-idle', 'voice-connecting', 'voice-listening', 'voice-speaking', 'voice-error');

    switch (state) {
      case STATES.IDLE:
        orbWrap.classList.add('voice-idle');
        voiceLabelH2.textContent = 'Start Conversation';
        voiceLabelP.textContent = 'CLICK TO CONNECT';
        linkText.textContent = 'LINK STANDBY';
        linkDot.classList.remove('active');
        endBtn.style.display = 'none';
        break;

      case STATES.CONNECTING:
        orbWrap.classList.add('voice-connecting');
        voiceLabelH2.textContent = 'Connecting...';
        voiceLabelP.textContent = 'ESTABLISHING VOICE LINK';
        linkText.textContent = 'CONNECTING';
        linkDot.classList.remove('active');
        endBtn.style.display = 'none';
        break;

      case STATES.LISTENING:
        orbWrap.classList.add('voice-listening');
        voiceLabelH2.textContent = 'Listening...';
        voiceLabelP.textContent = 'AWAITING VOICE COMMAND';
        linkText.textContent = 'LINK ACTIVE';
        linkDot.classList.add('active');
        endBtn.style.display = '';
        break;

      case STATES.SPEAKING:
        orbWrap.classList.add('voice-speaking');
        voiceLabelH2.textContent = 'Alex is speaking...';
        voiceLabelP.textContent = 'AGENT RESPONSE';
        linkText.textContent = 'LINK ACTIVE';
        linkDot.classList.add('active');
        endBtn.style.display = '';
        break;

      case STATES.DISCONNECTED:
        orbWrap.classList.add('voice-idle');
        voiceLabelH2.textContent = 'Conversation ended';
        voiceLabelP.textContent = 'CLICK TO RECONNECT';
        linkText.textContent = 'LINK CLOSED';
        linkDot.classList.remove('active');
        endBtn.style.display = 'none';
        break;

      case STATES.ERROR:
        orbWrap.classList.add('voice-error');
        voiceLabelH2.textContent = detail || 'Connection error';
        voiceLabelP.textContent = 'CLICK TO RETRY';
        linkText.textContent = 'LINK ERROR';
        linkDot.classList.remove('active');
        endBtn.style.display = 'none';
        break;
    }
  }

  // --- Proxy communication ---

  async function fetchSignedUrl() {
    var session = window.SkylandSession.get();
    if (!session || !session.id) {
      throw new Error('No session — reload the page');
    }

    var resp = await fetch(PROXY_BASE + '/voice/signed-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_uuid: session.id,
        agent_id: window.SkylandLang ? window.SkylandLang.getAgentId() : undefined
      }),
    });

    if (!resp.ok) {
      var msg = ERROR_MESSAGES[resp.status] || 'Voice link unavailable';
      throw new Error(msg);
    }

    var data = await resp.json();
    return data.signed_url;
  }

  // --- Voice session lifecycle ---

  var starterPanel = null;

  function showStarters() {
    if (starterPanel) starterPanel.classList.remove('hidden');
  }

  function hideStarters() {
    if (starterPanel) starterPanel.classList.add('hidden');
  }

  async function startVoice(starterText) {
    if (currentState === STATES.CONNECTING || currentState === STATES.LISTENING || currentState === STATES.SPEAKING) {
      return; // Already active
    }

    hideStarters();
    setState(STATES.CONNECTING);

    try {
      // 1. Get signed URL from proxy
      var signedUrl = await fetchSignedUrl();

      // 2. Build session config
      var sessionConfig = {
        signedUrl: signedUrl,

        onConnect: function () {
          console.log('[VOICE] Connected to ElevenLabs');
          setState(STATES.LISTENING);
        },

        onDisconnect: function () {
          console.log('[VOICE] Disconnected from ElevenLabs');
          conversation = null;
          setState(STATES.DISCONNECTED);
          showStarters();
        },

        onModeChange: function (data) {
          // data.mode is 'speaking' or 'listening'
          if (data.mode === 'speaking') {
            setState(STATES.SPEAKING);
          } else if (data.mode === 'listening') {
            setState(STATES.LISTENING);
          }
        },

        onError: function (error) {
          console.error('[VOICE] SDK error:', error);
          conversation = null;
          setState(STATES.ERROR, 'Voice error — try again');
          showStarters();
        },

        onMessage: function (message) {
          // Transcripts arrive here — log for now, wire to chat panel later
          console.log('[VOICE] Message:', message);
        },
      };

      // 3. Add first_message override if starter was clicked
      if (starterText) {
        sessionConfig.conversationConfigOverride = {
          agent: {
            firstMessage: starterText
          }
        };
        console.log('[VOICE] Starter override:', starterText);
      }

      // 4. Start ElevenLabs conversation via SDK
      var Conversation = window.ElevenLabsClient.Conversation;
      conversation = await Conversation.startSession(sessionConfig);

      console.log('[VOICE] Session started, id:', conversation.getId());

    } catch (err) {
      console.error('[VOICE] Start failed:', err);
      conversation = null;
      setState(STATES.ERROR, err.message || 'Connection failed');
      showStarters();
    }
  }

  async function stopVoice() {
    if (conversation) {
      try {
        await conversation.endSession();
      } catch (err) {
        console.warn('[VOICE] End session error:', err);
      }
      conversation = null;
    }
    setState(STATES.DISCONNECTED);
    showStarters();
  }

  // --- Initialization ---

  function init() {
    // Verify SDK loaded
    if (!window.ElevenLabsClient || !window.ElevenLabsClient.Conversation) {
      console.error('[VOICE] @elevenlabs/client SDK not loaded');
      return;
    }

    // Resolve DOM refs
    var fluxPage = document.getElementById('flux');
    if (!fluxPage) return;

    orbWrap = fluxPage.querySelector('.orb-wrap');
    voiceLabelH2 = fluxPage.querySelector('.voice-label h2');
    voiceLabelP = fluxPage.querySelector('.voice-label p');
    linkBadge = fluxPage.querySelector('.link-badge');
    linkText = fluxPage.querySelector('.link-text');
    linkDot = fluxPage.querySelector('.link-dot');
    endBtn = fluxPage.querySelector('.end-btn');
    starterPanel = document.getElementById('starter-panel');

    if (!orbWrap || !voiceLabelH2) {
      console.error('[VOICE] Flux DOM elements not found');
      return;
    }

    // Set initial state
    setState(STATES.IDLE);

    // Wire starter button click handlers
    if (starterPanel) {
      var starterBtns = starterPanel.querySelectorAll('.starter-btn');
      starterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var text = btn.textContent.trim();
          var lang = window.SkylandLang ? window.SkylandLang.getCurrentLang() : 'sv';
          var agentId = window.SkylandLang ? window.SkylandLang.getAgentId() : null;
          console.log('[VOICE] Starter clicked:', text, '| lang:', lang, '| agent:', agentId);
          startVoice(text);
        });
      });

      // "Regular conversation" button — start without override
      var openBtn = document.getElementById('starter-open');
      if (openBtn) {
        openBtn.addEventListener('click', function () {
          var lang = window.SkylandLang ? window.SkylandLang.getCurrentLang() : 'sv';
          var agentId = window.SkylandLang ? window.SkylandLang.getAgentId() : null;
          console.log('[VOICE] Regular conversation | lang:', lang, '| agent:', agentId);
          startVoice(null);
        });
      }
    }

    // Wire orb click (fallback — starts without starter)
    orbWrap.style.cursor = 'pointer';
    orbWrap.addEventListener('click', function () {
      if (currentState === STATES.IDLE || currentState === STATES.DISCONNECTED || currentState === STATES.ERROR) {
        startVoice(null);
      }
    });

    if (endBtn) {
      endBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        stopVoice();
      });
    }

    console.log('[VOICE] Module initialized with conversation starters');
  }

  // --- Public API ---

  window.SkylandVoice = {
    init: init,
    start: startVoice,
    stop: stopVoice,
    getState: function () { return currentState; },
  };
})();
