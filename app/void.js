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

  var VOID_WEBHOOK_URL = 'https://scc.skylandai.se/api/v1/webhooks/site/void-submission';

  var STATES = {
    IDLE: 'idle',
    SUBMITTING: 'submitting',
    SUCCESS: 'success',
    ERROR: 'error'
  };

  // Panelen skrev tidigare sina egna strängar rakt in i DOM:en: knappen sa
  // TRANSMIT oavsett språk (kvar från mallen) och allt annat var svenska även
  // med EN valt. Här ligger båda språken, och tr() slår upp vid varje rendering
  // så att ett språkbyte följer med.
  var T = {
    sv: {
      ai_title: 'AUTOMATISKT AI-SVAR',
      waiting: 'Väntar på ditt meddelande…',
      analyzing: 'Analyserar...',
      step_profile: 'Skapar din profil',
      step_kb: 'Söker i kunskapsbas',
      step_answer: 'Genererar svar',
      registered: 'Ärendet är registrerat. Joakim återkommer personligen inom kort.',
      btn_send: 'SKICKA',
      btn_sending: 'SKICKAR...',
      btn_sent: 'SKICKAT',
      goto_dash: 'SE SVARET I SYSTEMET',
      still: 'Tar lite längre tid än vanligt — svaret kommer',
      err_name: 'Namnet behöver vara minst 2 tecken.',
      err_email: 'E-postadressen ser inte rätt ut.',
      err_message: 'Skriv minst 30 tecken så vi förstår vad det gäller.',
      err_consent: 'Du behöver godkänna att vi behandlar dina uppgifter innan vi kan ta emot meddelandet.',
      err_input: 'Något i formuläret behöver justeras. Kolla att alla fält är ifyllda korrekt.',
      err_internal: 'Något krånglade hos oss. Försök igen om en stund eller skicka direkt till joakim@skylandai.se.',
      err_network: 'Kunde inte nå servern. Kolla din anslutning och försök igen.',
      err_timeout: 'Det tog längre tid än väntat. Joakim får ditt meddelande ändå — vi återkommer inom kort.',
    },
    en: {
      ai_title: 'AUTOMATED AI RESPONSE',
      waiting: 'Waiting for your message…',
      analyzing: 'Analysing...',
      step_profile: 'Building your profile',
      step_kb: 'Searching the knowledge base',
      step_answer: 'Writing the answer',
      registered: 'Your message is logged. Joakim will get back to you personally shortly.',
      btn_send: 'SEND',
      btn_sending: 'SENDING...',
      btn_sent: 'SENT',
      goto_dash: 'SEE THE ANSWER IN THE SYSTEM',
      still: 'Taking a little longer than usual — the answer is coming',
      err_name: 'Your name needs at least 2 characters.',
      err_email: "That email address doesn't look right.",
      err_message: 'Write at least 30 characters so we understand what it is about.',
      err_consent: 'Please accept that we process your details before we can take the message.',
      err_input: 'Something in the form needs adjusting. Check that every field is filled in correctly.',
      err_internal: 'Something went wrong on our end. Try again in a moment, or write straight to joakim@skylandai.se.',
      err_network: 'Could not reach the server. Check your connection and try again.',
      err_timeout: 'That took longer than expected. Joakim gets your message anyway — we will be in touch shortly.',
    }
  };
  function lang() {
    try {
      if (window.SkylandLang && window.SkylandLang.getCurrentLang) return window.SkylandLang.getCurrentLang();
      return localStorage.getItem('skyland_lang') || 'sv';
    } catch (e) { return 'sv'; }
  }
  function tr(key) { return (T[lang()] || T.sv)[key]; }

  var ERROR_KEYS = {
    INVALID_INPUT: 'err_input',
    MISSING_CONSENT: 'err_consent',
    INTERNAL_ERROR: 'err_internal',
    NETWORK: 'err_network',
    TIMEOUT: 'err_timeout'
  };
  function errText(code) { return tr(ERROR_KEYS[code] || 'err_internal'); }

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
      setState(STATES.ERROR, errText('MISSING_CONSENT'));
      return;
    }

    // Client-side validation
    var name = (formData.get('name') || '').trim();
    var email = (formData.get('email') || '').trim();
    var message = (formData.get('message') || '').trim();

    if (!name || name.length < 2) {
      setState(STATES.ERROR, tr('err_name'));
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState(STATES.ERROR, tr('err_email'));
      return;
    }
    if (!message || message.length < 30) {
      setState(STATES.ERROR, tr('err_message'));
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
      // SCC svarar med ett objekt; n8n svarade med array — båda hanteras
      var result = Array.isArray(data) ? data[0] : data;
      if (result && result.status === 'success') {
        // Kontext till resten av kedjan: Systemet-knappen och Alex
        // röstsamtal vet vem besökaren är och vad ärendet gäller.
        try {
          sessionStorage.setItem('skyland_lead_ctx', JSON.stringify({
            name: name,
            company: (formData.get('company') || '').trim(),
            message: message,
            ai_response: result.ai_response || '',
            ts: Date.now()
          }));
        } catch (e) { /* kontexten är aldrig obligatorisk */ }
        setState(STATES.SUCCESS, result.ai_response);
        updateLeadProfileScan(payload);
      } else {
        var errorMessage = (result && (ERROR_KEYS[result.error_code] ? errText(result.error_code) : result.message)) || errText('INTERNAL_ERROR');
        setState(STATES.ERROR, errorMessage);
      }
    })
    .catch(function (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setState(STATES.ERROR, errText('TIMEOUT'));
      } else {
        setState(STATES.ERROR, errText('NETWORK'));
      }
    });
  }

  /* ── Statusraden vid knappen ───────────────────────────────────────────
     AI-panelen som visar arbetet är display:none under 820 px. På mobil
     såg besökaren därför ingenting mellan "SKICKAR..." och svaret — och
     ett valideringsfel syntes inte alls, formuläret bara vägrade. Raden
     nedan ligger direkt under knappen, alltså där tummen och blicken
     redan är, och säger samma sak som panelen: vilket steg som pågår, hur
     långt det har gått, och vad som gick fel när något gör det.
     Mätaren är ärlig så långt den kan vara: backend svarar på 3–12
     sekunder utan att rapportera framsteg, så den går mot 92 % och
     stannar där tills svaret faktiskt kommer. Den ljuger aldrig om att
     vara klar. Dröjer det över 14 sekunder byts texten mot ett besked om
     att det tar längre tid än vanligt, i stället för att låta besökaren
     undra om något har hängt sig. */
  var statusTimers = [];

  function clearStatusTimers() {
    statusTimers.forEach(clearTimeout);
    statusTimers = [];
  }

  function removeStatus() {
    clearStatusTimers();
    var el = document.getElementById('void-status');
    if (el) el.remove();
  }

  function ensureStatus() {
    var el = document.getElementById('void-status');
    if (el) return el;
    if (!submitBtn) return null;
    el = document.createElement('div');
    el.id = 'void-status';
    el.className = 'void-status';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML =
      '<div class="vs-bar"><span class="vs-fill"></span></div>' +
      '<div class="vs-row"><span class="vs-dot"></span><span class="vs-label"></span></div>';
    // Knappen kan ligga i en rad med bokningen (se app.js); raden är då
    // ankaret, annars knappen själv.
    (submitBtn.closest('.void-actions') || submitBtn).insertAdjacentElement('afterend', el);
    return el;
  }

  function startStatusProgress() {
    var el = ensureStatus();
    if (!el) return;
    clearStatusTimers();
    el.dataset.state = 'busy';
    var label = el.querySelector('.vs-label');
    var fill = el.querySelector('.vs-fill');
    label.textContent = tr('step_profile');
    fill.style.transition = 'none';
    fill.style.width = '0%';
    // Reflow så att bredden verkligen börjar om från noll vid ett andra försök.
    void fill.offsetWidth;
    fill.style.transition = 'width 14s cubic-bezier(.16,.8,.3,1)';
    fill.style.width = '92%';
    [[1800, 'step_kb'], [4600, 'step_answer']].forEach(function (step) {
      statusTimers.push(setTimeout(function () { label.textContent = tr(step[1]); }, step[0]));
    });
    statusTimers.push(setTimeout(function () { label.textContent = tr('still'); }, 14000));
  }

  function showStatusError(text) {
    var el = ensureStatus();
    if (!el) return;
    clearStatusTimers();
    el.dataset.state = 'error';
    el.querySelector('.vs-fill').style.width = '0%';
    el.querySelector('.vs-label').textContent = text;
  }

  /**
   * Update UI state for the Void module.
   * All 4 states have distinct visual representations.
   */
  function setState(state, content) {
    currentState = state;
    responseContainer.dataset.state = state;
    // Rundturen pekar på nästa handling i formuläret. Byter formuläret
    // tillstånd byter den handling — då måste ljuset flytta sig direkt.
    try { window.dispatchEvent(new CustomEvent('skyland:void', { detail: { state: state } })); } catch (e) {}

    switch (state) {
      case STATES.IDLE:
        var oldGoto = document.getElementById('void-goto-dash');
        if (oldGoto) oldGoto.remove();
        removeStatus();
        responseContainer.innerHTML =
          '<div class="ai-response-title">' +
            '<span class="material-symbols-outlined" style="font-size:14px">auto_awesome</span>' +
            '<span>' + tr('ai_title') + '</span>' +
          '</div>' +
          '<div class="ai-response-body">' +
            '<p class="void-placeholder">' + tr('waiting') + '</p>' +
          '</div>';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>' + tr('btn_send') + '</span><span class="material-symbols-outlined" style="font-size:16px">send</span>';
          // Re-check consent state
          var cb = document.getElementById('void-consent');
          if (cb) submitBtn.disabled = !cb.checked;
        }
        break;

      case STATES.SUBMITTING:
        responseContainer.innerHTML =
          '<div class="ai-response-title">' +
            '<span class="material-symbols-outlined" style="font-size:14px">auto_awesome</span>' +
            '<span>' + tr('ai_title') + '</span>' +
          '</div>' +
          '<div class="ai-response-body">' +
            '<div class="void-processing">' +
              '<div class="void-pulse"></div>' +
              '<p>' + tr('analyzing') + '</p>' +
              '<p class="void-substep">' + tr('step_profile') + '</p>' +
              '<p class="void-substep">' + tr('step_kb') + '</p>' +
              '<p class="void-substep">' + tr('step_answer') + '</p>' +
            '</div>' +
          '</div>';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>' + tr('btn_sending') + '</span>';
        }
        animateSubsteps();
        startStatusProgress();
        break;

      case STATES.SUCCESS:
        responseContainer.innerHTML =
          '<div class="ai-response-title">' +
            '<span class="material-symbols-outlined" style="font-size:14px">auto_awesome</span>' +
            '<span>' + tr('ai_title') + '</span>' +
          '</div>' +
          '<div class="ai-response-body void-success-body">' +
            '<p class="void-response-text">' + escapeHtml(content) + '</p>' +
            '<div class="void-response-meta">' + tr('registered') + '</div>' +
          '</div>';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>' + tr('btn_sent') + '</span><span class="material-symbols-outlined" style="font-size:16px">check</span>';
        }
        var doneEl = document.getElementById('void-status');
        if (doneEl) {
          clearStatusTimers();
          doneEl.dataset.state = 'done';
          doneEl.querySelector('.vs-fill').style.width = '100%';
          statusTimers.push(setTimeout(removeStatus, 700));
        }
        // AI-svarspanelen är dold på mobil — vägen till svaret måste ligga
        // där man faktiskt är: direkt under skicka-knappen.
        if (submitBtn && !document.getElementById('void-goto-dash')) {
          var gotoBtn = document.createElement('button');
          gotoBtn.type = 'button';
          gotoBtn.id = 'void-goto-dash';
          gotoBtn.className = 'void-goto-dash';
          gotoBtn.innerHTML =
            '<span class="material-symbols-outlined" style="font-size:16px">monitoring</span> ' +
            tr('goto_dash') +
            ' <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>';
          gotoBtn.addEventListener('click', function () {
            try { sessionStorage.setItem('skyland_show_answer', '1'); } catch (e) {}
            if (window.SkylandNav) window.SkylandNav.showPage('dashboard');
          });
          (submitBtn.closest('.void-actions') || submitBtn).insertAdjacentElement('afterend', gotoBtn);
        }
        break;

      case STATES.ERROR:
        responseContainer.innerHTML =
          '<div class="ai-response-title">' +
            '<span class="material-symbols-outlined" style="font-size:14px">auto_awesome</span>' +
            '<span>' + tr('ai_title') + '</span>' +
          '</div>' +
          '<div class="ai-response-body">' +
            '<p class="void-error-text">' + escapeHtml(content) + '</p>' +
          '</div>';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>' + tr('btn_send') + '</span><span class="material-symbols-outlined" style="font-size:16px">send</span>';
          var cb2 = document.getElementById('void-consent');
          if (cb2) submitBtn.disabled = !cb2.checked;
        }
        showStatusError(content);
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
