/**
 * Dashboard Module — visitor-facing Command Center demo.
 *
 * Shows the visitor their own lead card, built in real time from their
 * session: form submission (with AI response) and voice calls with Alex.
 *
 * Data source: n8n webhook /session-status (POST { session_uuid }).
 * Only returns data for the caller's own session UUID — no keys in frontend.
 * Polls every 6s while the dashboard page is in view.
 */

(function () {
  'use strict';

  var STATUS_WEBHOOK_URL = 'https://onepiecedad.app.n8n.cloud/webhook/session-status';
  var POLL_MS = 6000;

  var pollTimer = null;
  var elEmpty = null;
  var elGrid = null;
  var elTimeline = null;

  function t(key, fallback) {
    if (window.SkylandI18n && typeof window.SkylandI18n.t === 'function') {
      return window.SkylandI18n.t(key, fallback);
    }
    return fallback;
  }

  function fmtTime(iso) {
    if (!iso) return '';
    try {
      var lang = window.SkylandI18n ? window.SkylandI18n.getLang() : 'sv';
      return new Date(iso).toLocaleString(lang === 'sv' ? 'sv-SE' : 'en-GB', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return ''; }
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || '—';
  }

  function render(data) {
    var prospect = data && data.prospect;
    var events = (data && data.events) || [];

    if (!prospect && events.length === 0) {
      if (elEmpty) elEmpty.style.display = '';
      if (elGrid) elGrid.style.display = 'none';
      return;
    }

    if (elEmpty) elEmpty.style.display = 'none';
    if (elGrid) elGrid.style.display = '';

    setText('dash-name', prospect ? prospect.name : null);
    setText('dash-company', prospect ? prospect.company : null);
    setText('dash-email', prospect ? prospect.email : null);
    var scoreEl = document.getElementById('dash-score');
    if (scoreEl) {
      var score = prospect && typeof prospect.score === 'number' ? prospect.score : null;
      scoreEl.textContent = score === null ? '—' : String(score);
      scoreEl.classList.toggle('high', score !== null && score >= 40);
    }

    if (!elTimeline) return;
    elTimeline.innerHTML = '';
    events.forEach(function (ev) {
      var item = document.createElement('div');
      item.className = 'dash-event';

      var head = document.createElement('div');
      head.className = 'dash-event-head';
      var icon = ev.type === 'voice' ? 'mic' : 'edit_note';
      var label = ev.type === 'voice'
        ? t('dash_ev_voice', 'Voice conversation with Alex')
        : t('dash_ev_form', 'Form received — AI answered instantly');
      head.innerHTML =
        '<span class="material-symbols-outlined" style="font-size:15px">' + icon + '</span>' +
        '<span class="dash-event-label"></span>' +
        '<span class="dash-event-time">' + fmtTime(ev.created_at) + '</span>';
      head.querySelector('.dash-event-label').textContent = label;
      item.appendChild(head);

      if (ev.ai_response) {
        var ai = document.createElement('div');
        ai.className = 'dash-event-detail';
        ai.innerHTML = '<span class="dash-event-detail-label">' + t('dash_ai_label', 'AI RESPONSE SENT') + '</span>';
        var p = document.createElement('p');
        p.textContent = ev.ai_response;
        ai.appendChild(p);
        item.appendChild(ai);
      }
      if (ev.summary) {
        var sum = document.createElement('div');
        sum.className = 'dash-event-detail';
        sum.innerHTML = '<span class="dash-event-detail-label">' + t('dash_summary_label', 'CALL SUMMARY') + '</span>';
        var ps = document.createElement('p');
        var dur = ev.duration_seconds ? ' (' + Math.round(ev.duration_seconds / 60 * 10) / 10 + ' min)' : '';
        ps.textContent = ev.summary + dur;
        sum.appendChild(ps);
        item.appendChild(sum);
      }
      elTimeline.appendChild(item);
    });
  }

  async function poll() {
    var session = window.SkylandSession ? window.SkylandSession.get() : null;
    if (!session || !session.id) return;

    try {
      var resp = await fetch(STATUS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_uuid: session.id })
      });
      if (!resp.ok) return;
      var data = await resp.json();
      render(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      // Polling failure is silent — dashboard just stays in current state.
    }
  }

  function startPolling() {
    if (pollTimer) return;
    void poll();
    pollTimer = setInterval(function () {
      if (document.visibilityState === 'visible') void poll();
    }, POLL_MS);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  // ─── Tabs ───
  function initTabs(page) {
    var tabs = page.querySelectorAll('.dash-tab');
    var panels = page.querySelectorAll('.dash-panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        panels.forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-panel') === tab.getAttribute('data-tab'));
        });
      });
    });
  }

  // ─── ROI calculator ───
  function initRoi(page) {
    var hours = page.querySelector('#roi-hours');
    var rate = page.querySelector('#roi-rate');
    if (!hours || !rate) return;

    function fmt(n) {
      return Math.round(n).toLocaleString('sv-SE') + ' kr';
    }

    function update() {
      var h = Number(hours.value);
      var r = Number(rate.value);
      var weekly = h * r;
      var yearly = weekly * 52;
      var hv = page.querySelector('#roi-hours-val');
      var rv = page.querySelector('#roi-rate-val');
      var yv = page.querySelector('#roi-year');
      var wv = page.querySelector('#roi-week');
      if (hv) hv.textContent = h + ' h';
      if (rv) rv.textContent = fmt(r);
      if (yv) yv.textContent = fmt(yearly);
      if (wv) wv.textContent = fmt(weekly);
    }

    hours.addEventListener('input', update);
    rate.addEventListener('input', update);
    update();
  }

  function init() {
    var page = document.getElementById('dashboard');
    if (!page) return;

    elEmpty = document.getElementById('dash-empty');
    elGrid = document.getElementById('dash-grid');
    elTimeline = document.getElementById('dash-timeline');

    initTabs(page);
    initRoi(page);

    // CTA buttons scroll to the referenced page
    page.querySelectorAll('.dash-cta').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = document.getElementById(btn.getAttribute('data-target'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Poll only while the dashboard page is (near) visible
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) startPolling();
          else stopPolling();
        });
      }, { threshold: 0.2 });
      observer.observe(page);
    } else {
      startPolling();
    }
  }

  window.SkylandDashboard = { init: init };
})();
