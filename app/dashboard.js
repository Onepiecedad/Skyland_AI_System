/**
 * Dashboard Module — visitor-facing Command Center demo.
 *
 * Shows the visitor their own lead card, built in real time from their
 * session: form submission (with AI response) and voice calls with Alex.
 *
 * Data source: SCC webhook /session-status (POST { session_uuid }).
 * Only returns data for the caller's own session UUID — no keys in frontend.
 * Polls every 6s while the dashboard page is in view.
 */

(function () {
  'use strict';

  var STATUS_WEBHOOK_URL = 'https://scc.skylandai.se/api/v1/webhooks/site/session-status';
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
        item.appendChild(buildDetail(t('dash_ai_label', 'AI RESPONSE SENT'), ev.ai_response));
      }
      if (ev.summary) {
        var dur = ev.duration_seconds ? ' (' + Math.round(ev.duration_seconds / 60 * 10) / 10 + ' min)' : '';
        item.appendChild(buildDetail(t('dash_summary_label', 'CALL SUMMARY'), ev.summary + dur));
      }
      elTimeline.appendChild(item);
    });

    // Vägen vidare: fortsätt ärendet i röstsamtal med Alex, med kontexten kvar.
    if (events.length) {
      var cont = document.createElement('button');
      cont.type = 'button';
      cont.className = 'dash-continue';
      cont.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px">mic</span> ' +
        t('dash_continue', 'Fortsätt konversationen med Alex') + ' →';
      cont.addEventListener('click', function () {
        if (window.SkylandNav) window.SkylandNav.showPage('flux');
        // Sidbytet tar .82s — starta samtalet när Demo står stilla. Blockeras
        // ljudet av webbläsaren är orben nästa tryck, och kontexten följer med
        // ändå eftersom voice.js läser den vid varje samtalsstart.
        if (window.SkylandVoice && window.SkylandVoice.start) {
          setTimeout(function () { window.SkylandVoice.start(); }, 950);
        }
      });
      elTimeline.appendChild(cont);
    }

    updateFade();

    // Djuplänken från formuläret: öppna lead-fliken och scrolla fram svaret.
    if (events.length && sessionStorage.getItem('skyland_show_answer')) {
      try { sessionStorage.removeItem('skyland_show_answer'); } catch (e) {}
      showAnswer();
    }
  }

  // En svarsdetalj: långa texter visas hopfällda med en egen expander i
  // stället för att trycka allt annat ur vyn.
  function buildDetail(label, text) {
    var box = document.createElement('div');
    box.className = 'dash-event-detail';
    box.innerHTML = '<span class="dash-event-detail-label"></span>';
    box.querySelector('.dash-event-detail-label').textContent = label;
    var p = document.createElement('p');
    p.className = 'dash-detail-text';
    p.textContent = text;
    box.appendChild(p);
    if (text.length > 220) {
      p.classList.add('clamped');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dash-more';
      btn.textContent = t('dash_more', 'Visa hela svaret');
      btn.addEventListener('click', function () {
        var open = p.classList.toggle('clamped');
        btn.textContent = open ? t('dash_more', 'Visa hela svaret') : t('dash_less', 'Visa mindre');
        updateFade();
      });
      box.appendChild(btn);
    }
    return box;
  }

  /* ── Landningen från formuläret ─────────────────────────────────────────
     Att hoppa rakt ner till svaret gav besökaren en textmassa utan avsändare:
     man såg AI-svaret men aldrig att det var ens eget namn och företag som
     hade blivit ett lead. Nu landar man överst på kortet — namn, företag,
     poäng — och får en ledtråd om att svaret ligger längre ner. Ledtråden är
     en knapp: den som hellre trycker än sveper kommer fram ändå. Den slocknar
     när svaret är i vyn, och den ligger aldrig kvar längre än tolv sekunder. */
  function flashDetail(detail) {
    detail.classList.add('flash');
    setTimeout(function () { detail.classList.remove('flash'); }, 2400);
  }

  var cueEl = null, cuePanel = null, cueScroll = null, cueTimer = 0;

  function hideCue() {
    if (cueTimer) { clearTimeout(cueTimer); cueTimer = 0; }
    if (cuePanel && cueScroll) cuePanel.removeEventListener('scroll', cueScroll);
    cueScroll = null; cuePanel = null;
    if (cueEl) {
      cueEl.classList.remove('is-on');
      var gone = cueEl; cueEl = null;
      setTimeout(function () { if (gone.parentNode) gone.parentNode.removeChild(gone); }, 400);
    }
  }

  function inView(panel, detail) {
    return detail.getBoundingClientRect().top < panel.getBoundingClientRect().bottom - 56;
  }

  function showCue(panel, detail) {
    hideCue();
    var wrap = document.querySelector('#dashboard .dash-panels');
    if (!wrap) return;
    if (inView(panel, detail)) { flashDetail(detail); return; }
    cueEl = document.createElement('button');
    cueEl.type = 'button';
    cueEl.className = 'dash-cue';
    cueEl.innerHTML = '<span>' + t('dash_cue', 'Svaret ligger längre ner') + '</span>' +
      '<svg viewBox="0 0 24 14" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 3 12 11l8.5-8"/></svg>';
    cueEl.addEventListener('click', function () {
      panel.scrollTo({ top: panel.scrollTop + detail.getBoundingClientRect().top -
        panel.getBoundingClientRect().top - 44, behavior: 'smooth' });
      flashDetail(detail);
      hideCue();
    });
    wrap.appendChild(cueEl);
    requestAnimationFrame(function () { if (cueEl) cueEl.classList.add('is-on'); });

    cuePanel = panel;
    cueScroll = function () {
      if (!cueEl) return;
      if (inView(panel, detail)) { flashDetail(detail); hideCue(); }
    };
    panel.addEventListener('scroll', cueScroll, { passive: true });
    cueTimer = setTimeout(hideCue, 12000);
  }

  function showAnswer() {
    var page = document.getElementById('dashboard');
    if (!page) return;
    var leadTab = page.querySelector('.dash-tab[data-tab="lead"]');
    if (leadTab) leadTab.click();
    setTimeout(function () {
      var panel = page.querySelector('.dash-panel[data-panel="lead"]');
      var detail = elTimeline ? elTimeline.querySelector('.dash-event-detail') : null;
      if (panel) panel.scrollTop = 0;
      if (panel && detail) showCue(panel, detail);
      updateFade();
    }, 180);
  }

  // Scrollskuggan i panelens nederkant: syns bara när det finns mer innehåll.
  var fadeWrap = null;
  function updateFade() {
    var page = document.getElementById('dashboard');
    if (!page) return;
    if (!fadeWrap) fadeWrap = page.querySelector('.dash-panels');
    var p = page.querySelector('.dash-panel.active');
    if (!p || !fadeWrap) return;
    fadeWrap.classList.toggle('has-more', p.scrollHeight - p.clientHeight - p.scrollTop > 8);
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
        var id = btn.getAttribute('data-target');
        if (window.SkylandNav && window.SkylandNav.showPage) { window.SkylandNav.showPage(id); return; }
        var target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    page.querySelectorAll('.dash-panel').forEach(function (p) {
      p.addEventListener('scroll', updateFade, { passive: true });
    });
    page.querySelectorAll('.dash-tab').forEach(function (tb) {
      tb.addEventListener('click', function () { setTimeout(updateFade, 60); });
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
