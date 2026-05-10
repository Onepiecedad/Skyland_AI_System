/**
 * Void Module — Formulärinlämning med inline AI-svar.
 *
 * Kontraktet mot V03: /n8n/workflows/void-submission.json
 * Lifecycle: idle → submitting → success → error
 *
 * Inga API-nycklar i frontend. Webhook hanterar allt.
 */

(function () {
  'use strict';

  var VOID_WEBHOOK_URL = 'https://onepiecedad.app.n8n.cloud/webhook/void-submission';

  var STATES = {
    IDLE: 'idle',
    SUBMITTING: 'submitting',
    SUCCESS: 'success',
    ERROR: 'error'
  };

  var ERROR_MESSAGES = {
    INVALID_INPUT: 'Något i formuläret behöver justeras. Kolla att alla fält är ifyllda korrekt.',
    MISSING_CONSENT: 'Du behöver godkänna att vi behandlar dina uppgifter innan vi kan ta emot meddelandet.',
    INTERNAL_ERROR: 'Något krånglade hos oss. Försök igen om en stund eller skicka direkt till joakim@skylandai.se.',
    NETWORK: 'Kunde inte nå servern. Kolla din anslutning och försök igen.',
    TIMEOUT: 'Det tog längre tid än väntat. Joakim får ditt meddelande ändå — vi återkommer inom kort.'
  };

  var currentState = STATES.IDLE;
  var formEl = null;
  var responseContainer = null;
  var submitBtn = null;

  /**
   * Initialize the Void form module.
   * Called from app.js after DOMContentLoaded.
   */
  function init() {
    formEl = document.getElementById('contact-form');
    responseContainer = document.getElementById('void-ai-response');
    if (!formEl || !responseContainer) return;

    submitBtn = formEl.querySelector('.transmit-btn');

    // Bind form submit
    formEl.addEventListener('submit', handleSubmit);

    // Consent checkbox → toggle submit button
    var consentBox = document.getElementById('void-consent');
    if (consentBox && submitBtn) {
      // Initial state: disabled until consent is checked
      submitBtn.disabled = true;

      consentBox.addEventListener('change', function () {
        if (currentState === STATES.IDLE || currentState === STATES.ERROR) {
          submitBtn.disabled = !consentBox.checked;
        }
      });
    }

    // Set initial state
    setState(STATES.IDLE);

    console.log('[VOID] Module initialized');
  }

  /**
   * Handle form submission.
   * Client-side validation → POST to webhook → display response.
   */
  function handleSubmit(event) {
    event.preventDefault();

    if (currentState === STATES.SUBMITTING) return;

    var formData = new FormData(formEl);

    // Validate consent
    var consentBox = document.getElementById('void-consent');
    if (!consentBox || !consentBox.checked) {
      setState(STATES.ERROR, ERROR_MESSAGES.MISSING_CONSENT);
      return;
    }

    // Client-side validation
    var name = (formData.get('name') || '').trim();
    var email = (formData.get('email') || '').trim();
    var message = (formData.get('message') || '').trim();

    if (!name || name.length < 2) {
      setState(STATES.ERROR, 'Namn behöver vara minst 2 tecken.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState(STATES.ERROR, 'E-post ser inte rätt ut.');
      return;
    }
    if (!message || message.length < 30) {
      setState(STATES.ERROR, 'Meddelandet behöver vara minst 30 tecken så vi förstår vad det gäller.');
      return;
    }

    setState(STATES.SUBMITTING);

    // Build payload — website sent as empty string for V03 backwards compat
    var session = window.SkylandSession ? window.SkylandSession.get() : null;
    var payload = {
      session_uuid: session ? session.id : crypto.randomUUID(),
      name: name,
      email: email,
      company: (formData.get('company') || '').trim(),
      website: '',
      phone: (formData.get('phone') || '').trim(),
      message: message,
      consent_given: true
    };

    // POST with 15s timeout
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 25000);

    fetch(VOID_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    .then(function (response) {
      clearTimeout(timeoutId);
      return response.json();
    })
    .then(function (data) {
      // n8n respondWith:allIncomingItems wraps response in array
      var result = Array.isArray(data) ? data[0] : data;
      if (result && result.status === 'success') {
        setState(STATES.SUCCESS, result.ai_response);
        updateLeadProfileScan(payload);
      } else {
        var errorMessage = (result && (ERROR_MESSAGES[result.error_code] || result.message)) || ERROR_MESSAGES.INTERNAL_ERROR;
        setState(STATES.ERROR, errorMessage);
      }
    })
    .catch(function (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setState(STATES.ERROR, ERROR_MESSAGES.TIMEOUT);
      } else {
        setState(STATES.ERROR, ERROR_MESSAGES.NETWORK);
      }
    });
  }

  /**
   * Update UI state for the Void module.
   * All 4 states have distinct visual representations.
   */
  function setState(state, content) {
    currentState = state;
    responseContainer.dataset.state = state;

    switch (state) {
      case STATES.IDLE:
        responseContainer.innerHTML =
          '<div class="ai-response-title">' +
            '<span class="material-symbols-outlined" style="font-size:14px">auto_awesome</span>' +
            '<span>AUTOMATED AI RESPONSE</span>' +
          '</div>' +
          '<div class="ai-response-body">' +
            '<p class="void-placeholder">Inväntar inkommande transmission...</p>' +
          '</div>';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>TRANSMIT</span><span class="material-symbols-outlined" style="font-size:16px">send</span>';
          // Re-check consent state
          var cb = document.getElementById('void-consent');
          if (cb) submitBtn.disabled = !cb.checked;
        }
        break;

      case STATES.SUBMITTING:
        responseContainer.innerHTML =
          '<div class="ai-response-title">' +
            '<span class="material-symbols-outlined" style="font-size:14px">auto_awesome</span>' +
            '<span>AUTOMATED AI RESPONSE</span>' +
          '</div>' +
          '<div class="ai-response-body">' +
            '<div class="void-processing">' +
              '<div class="void-pulse"></div>' +
              '<p>Analyserar...</p>' +
              '<p class="void-substep">Skapar lead-profil</p>' +
              '<p class="void-substep">Söker i kunskapsbas</p>' +
              '<p class="void-substep">Genererar svar</p>' +
            '</div>' +
          '</div>';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>PROCESSING...</span>';
        }
        animateSubsteps();
        break;

      case STATES.SUCCESS:
        responseContainer.innerHTML =
          '<div class="ai-response-title">' +
            '<span class="material-symbols-outlined" style="font-size:14px">auto_awesome</span>' +
            '<span>AUTOMATED AI RESPONSE</span>' +
          '</div>' +
          '<div class="ai-response-body void-success-body">' +
            '<p class="void-response-text">' + escapeHtml(content) + '</p>' +
            '<div class="void-response-meta">Ärendet är registrerat. Joakim återkommer personligen inom kort.</div>' +
          '</div>';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>TRANSMITTED</span><span class="material-symbols-outlined" style="font-size:16px">check</span>';
        }
        break;

      case STATES.ERROR:
        responseContainer.innerHTML =
          '<div class="ai-response-title">' +
            '<span class="material-symbols-outlined" style="font-size:14px">auto_awesome</span>' +
            '<span>AUTOMATED AI RESPONSE</span>' +
          '</div>' +
          '<div class="ai-response-body">' +
            '<p class="void-error-text">' + escapeHtml(content) + '</p>' +
          '</div>';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>TRANSMIT</span><span class="material-symbols-outlined" style="font-size:16px">send</span>';
          var cb2 = document.getElementById('void-consent');
          if (cb2) submitBtn.disabled = !cb2.checked;
        }
        break;
    }
  }

  /**
   * XSS-safe HTML escaping.
   */
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Animate processing substeps with staggered reveal.
   */
  function animateSubsteps() {
    var substeps = document.querySelectorAll('.void-substep');
    substeps.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('active'); }, i * 1200);
    });
  }

  /**
   * Populate Lead Profile Scan panel with submitted data.
   */
  function updateLeadProfileScan(payload) {
    var fields = {
      'scan-name': payload.name,
      'scan-email': payload.email,
      'scan-company': payload.company,
      'scan-phone': payload.phone
    };

    Object.keys(fields).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.textContent = fields[id] || '—';
        if (fields[id]) {
          el.classList.add('void-field-populated');
        }
      }
    });
  }

  // Expose on window for vanilla JS consumption
  window.SkylandVoid = {
    init: init,
    getState: function () { return currentState; }
  };
})();
