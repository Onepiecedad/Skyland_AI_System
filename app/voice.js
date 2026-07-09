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

  /**
   * i18n helper — uses SkylandI18n.t() when available, falls back to English.
   */
  function t(key, fallback) {
    if (window.SkylandI18n && typeof window.SkylandI18n.t === 'function') {
      return window.SkylandI18n.t(key, fallback);
    }
    return fallback;
  }

  function errorMessage(status) {
    if (status === 400) return t('voice_err_400', 'Session error — reload the page');
    return t('voice_err_unavailable', 'Voice link unavailable — try the form instead');
  }

  // --- Internal state ---
  var currentState = STATES.IDLE;
  var conversation = null;
  var callStartedAt = null;
  var transcriptBuffer = [];
  var reportSentForConversationId = null;

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
        voiceLabelH2.textContent = t('voice_idle_h2', 'Start Conversation');
        voiceLabelP.textContent = t('voice_idle_sub', 'CLICK TO CONNECT');
        linkText.textContent = t('link_standby', 'LINK STANDBY');
        linkDot.classList.remove('active');
        endBtn.style.display = 'none';
        break;

      case STATES.CONNECTING:
        orbWrap.classList.add('voice-connecting');
        voiceLabelH2.textContent = t('voice_connecting_h2', 'Connecting...');
        voiceLabelP.textContent = t('voice_connecting_sub', 'ESTABLISHING VOICE LINK');
        linkText.textContent = t('link_connecting', 'CONNECTING');
        linkDot.classList.remove('active');
        endBtn.style.display = 'none';
        break;

      case STATES.LISTENING:
        orbWrap.classList.add('voice-listening');
        voiceLabelH2.textContent = t('voice_h2', 'Listening...');
        voiceLabelP.textContent = t('voice_sub', 'AWAITING VOICE COMMAND');
        linkText.textContent = t('link_badge', 'LINK ACTIVE');
        linkDot.classList.add('active');
        endBtn.style.display = '';
        break;

      case STATES.SPEAKING:
        orbWrap.classList.add('voice-speaking');
        voiceLabelH2.textContent = t('voice_speaking_h2', 'Alex is speaking...');
        voiceLabelP.textContent = t('voice_speaking_sub', 'AGENT RESPONSE');
        linkText.textContent = t('link_badge', 'LINK ACTIVE');
        linkDot.classList.add('active');
        endBtn.style.display = '';
        break;

      case STATES.DISCONNECTED:
        orbWrap.classList.add('voice-idle');
        voiceLabelH2.textContent = t('voice_ended_h2', 'Conversation ended');
        voiceLabelP.textContent = t('voice_ended_sub', 'CLICK TO RECONNECT');
        linkText.textContent = t('link_closed', 'LINK CLOSED');
        linkDot.classList.remove('active');
        endBtn.style.display = 'none';
        break;

      case STATES.ERROR:
        orbWrap.classList.add('voice-error');
        voiceLabelH2.textContent = detail || t('voice_error_h2', 'Connection error');
        voiceLabelP.textContent = t('voice_error_sub', 'CLICK TO RETRY');
        linkText.textContent = t('link_error', 'LINK ERROR');
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

    var resp = await window.SkylandAPI.fetch(PROXY_BASE + '/voice/signed-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_uuid: session.id,
        agent_id: window.SkylandLang ? window.SkylandLang.getAgentId() : undefined
      }),
    });

    if (!resp.ok) {
      var msg = errorMessage(resp.status);
      throw new Error(msg);
    }

    var data = await resp.json();
    return data.signed_url;
  }

  function extractMessageText(message) {
    if (!message) return '';
    if (typeof message === 'string') return message.trim();
    if (typeof message.text === 'string') return message.text.trim();
    if (typeof message.transcript === 'string') return message.transcript.trim();
    if (typeof message.message === 'string') return message.message.trim();
    if (message.content && typeof message.content.text === 'string') return message.content.text.trim();
    return '';
  }

  function buildTranscript() {
    return transcriptBuffer
      .map(function (entry) {
        return entry.role ? (entry.role + ': ' + entry.text) : entry.text;
      })
      .join('\n')
      .trim();
  }

  async function reportCallEnded(source) {
    if (!conversation) return;

    var conversationId = typeof conversation.getId === 'function' ? conversation.getId() : null;
    if (!conversationId || reportSentForConversationId === conversationId) {
      return;
    }

    var session = window.SkylandSession.get();
    var startedAt = callStartedAt ? new Date(callStartedAt) : null;
    var endedAt = new Date();
    var durationSeconds = startedAt ? Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)) : null;

    reportSentForConversationId = conversationId;

    try {
      await window.SkylandAPI.fetch(PROXY_BASE + '/voice/call-ended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_uuid: session ? session.id : null,
          conversation_id: conversationId,
          agent_id: window.SkylandLang ? window.SkylandLang.getAgentId() : undefined,
          started_at: startedAt ? startedAt.toISOString() : null,
          ended_at: endedAt.toISOString(),
          duration_seconds: durationSeconds,
          transcript: buildTranscript(),
          source: source || 'browser_sdk',
          metadata: {
            entry_module: location.hash.replace('#', '') || 'flux'
          }
        })
      });
    } catch (err) {
      console.warn('[VOICE] Failed to report call end:', err.message);
    }
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
      transcriptBuffer = [];
      callStartedAt = Date.now();
      reportSentForConversationId = null;

      // 2. Build session config
      var sessionConfig = {
        signedUrl: signedUrl,

        onConnect: function () {
          console.log('[VOICE] Connected to ElevenLabs');
          setState(STATES.LISTENING);
        },

        onDisconnect: function () {
          console.log('[VOICE] Disconnected from ElevenLabs');
          reportCallEnded('browser_sdk_disconnect');
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
          var text = extractMessageText(message);
          if (text) {
            transcriptBuffer.push({
              role: message.role || message.source || message.type || 'message',
              text: text
            });
          }
          console.log('[VOICE] Message:', message);
        },
      };

      // 3. Add Variant 1 firstMessage override if starter was clicked
      if (starterText && window.SkylandLang) {
        var variant1 = window.SkylandLang.getStarterResponse(starterText);
        if (variant1) {
          sessionConfig.overrides = {
            agent: {
              firstMessage: variant1
            }
          };
          console.log('[VOICE] Variant 1 override for:', starterText);
          console.log('[VOICE] Alex will say:', variant1.substring(0, 60) + '...');
        } else {
          console.warn('[VOICE] No Variant 1 mapping for:', starterText);
        }
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
        await reportCallEnded('browser_sdk_manual_end');
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
