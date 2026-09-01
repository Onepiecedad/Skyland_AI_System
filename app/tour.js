/**
 * Guidad rundtur (2026-09-01). Autostart vid första besöket: Alex hälsar
 * välkommen, varje steg byter sida, spotlightar nav-knappen och läser en kort
 * förklaring — med förgenererat ljud i Alex riktiga röst (svenska). Engelska
 * får samma tur i text. Hoppa över avslutar direkt; localStorage-flaggan
 * skyland_tour_done gör att turen aldrig återkommer oombedd.
 */
(function () {
  'use strict';

  var FLAG = 'skyland_tour_done';

  var TEXTS = {
    sv: {
      skip: 'Hoppa över', next: 'Nästa', start: 'Ta rundturen', done: 'Klart — utforska själv',
      steps: [
        { page: 'core', title: 'Välkommen till Skyland', text: 'Jag är Alex, Skylands AI-assistent. Ge mig en halv minut så visar jag vad som finns här — eller hoppa över och utforska själv.', audio: null },
        { page: 'neural', title: 'Tjänster', text: 'Här är det vi sköter åt våra kunder: röstagenter, annonser och leads, hemsidor och automatisk uppföljning. Du köper resultat, inte verktyg.', audio: 'media/tour/tjanster.mp3' },
        { page: 'dashboard', title: 'Skyland-systemet', text: 'Det här är produkten — ett eget command center som svarar, bokar och följer upp åt dig. Det du ser är din egen session, live.', audio: 'media/tour/system.mp3' },
        { page: 'flux', title: 'Prova mig', text: 'På demosidan kan du prata med mig på riktigt. Klicka på orben och ställ en fråga, så svarar jag och kan boka ett möte direkt.', audio: 'media/tour/demo.mp3' },
        { page: 'void', title: 'Kontakt & bokning', text: 'Här bokar du ett kostnadsfritt samtal med Joakim, eller skriver till oss — formuläret svarar på sekunder. Välkommen till Skyland.', audio: 'media/tour/kontakt.mp3' }
      ]
    },
    en: {
      skip: 'Skip', next: 'Next', start: 'Take the tour', done: 'Done — explore freely',
      steps: [
        { page: 'core', title: 'Welcome to Skyland', text: "I'm Alex, Skyland's AI assistant. Give me half a minute and I'll show you around — or skip and explore on your own.", audio: null },
        { page: 'neural', title: 'Services', text: 'This is what we run for our clients: voice agents, ads and leads, websites and automatic follow-up. You buy results, not tools.', audio: null },
        { page: 'dashboard', title: 'The Skyland system', text: 'This is the product — your own command center that answers, books and follows up for you. What you see is your own session, live.', audio: null },
        { page: 'flux', title: 'Try me', text: 'On the demo page you can actually talk to me. Click the orb, ask a question, and I can book a meeting right away.', audio: null },
        { page: 'void', title: 'Contact & booking', text: 'Book a free call with Joakim here, or write to us — the form answers in seconds. Welcome to Skyland.', audio: null }
      ]
    }
  };

  var overlay, spotlight, bubble, titleEl, textEl, progressEl, nextBtn, skipBtn, audioEl;
  var t, stepIdx = 0, audioAllowed = false;

  function lang() {
    try {
      if (window.SkylandLang) return window.SkylandLang.getCurrentLang();
      return localStorage.getItem('skyland_lang') || 'sv';
    } catch (e) { return 'sv'; }
  }

  function markDone() {
    try { localStorage.setItem(FLAG, '1'); } catch (e) { /* privat läge */ }
  }

  function positionSpotlight(step) {
    var target = document.querySelector('.site-nav-btn[data-page="' + step.page + '"]');
    if (!target || stepIdx === 0) { spotlight.style.display = 'none'; return; }
    var r = target.getBoundingClientRect();
    spotlight.style.display = 'block';
    spotlight.style.left = (r.left - 6) + 'px';
    spotlight.style.top = (r.top - 6) + 'px';
    spotlight.style.width = (r.width + 12) + 'px';
    spotlight.style.height = (r.height + 12) + 'px';
  }

  function playAudio(step) {
    if (!audioAllowed || !step.audio || lang() !== 'sv') return;
    try {
      audioEl.src = step.audio;
      audioEl.play().catch(function () { /* blockerad — texten räcker */ });
    } catch (e) { /* ignore */ }
  }

  function renderStep() {
    var step = t.steps[stepIdx];
    if (window.SkylandNav) window.SkylandNav.showPage(step.page);
    titleEl.textContent = step.title;
    textEl.textContent = step.text;
    progressEl.textContent = (stepIdx + 1) + ' / ' + t.steps.length;
    nextBtn.textContent = stepIdx === 0 ? t.start : (stepIdx === t.steps.length - 1 ? t.done : t.next);
    skipBtn.textContent = t.skip;
    skipBtn.style.display = stepIdx === t.steps.length - 1 ? 'none' : '';
    // Vänta in sidbytet innan spotlight mäts
    requestAnimationFrame(function () { positionSpotlight(step); });
    playAudio(step);
  }

  function stopTour() {
    markDone();
    overlay.hidden = true;
    try { audioEl.pause(); } catch (e) { /* ignore */ }
    if (window.SkylandNav) window.SkylandNav.showPage('core');
  }

  function next() {
    audioAllowed = true; // klicket är gesten som låser upp ljud
    if (stepIdx >= t.steps.length - 1) {
      markDone();
      overlay.hidden = true;
      try { audioEl.pause(); } catch (e) { /* ignore */ }
      // Stanna på kontaktsidan — naturligt slut
      return;
    }
    stepIdx += 1;
    renderStep();
  }

  function start() {
    overlay = document.getElementById('tour-overlay');
    spotlight = document.getElementById('tour-spotlight');
    bubble = document.getElementById('tour-bubble');
    titleEl = document.getElementById('tour-title');
    textEl = document.getElementById('tour-text');
    progressEl = document.getElementById('tour-progress');
    nextBtn = document.getElementById('tour-next');
    skipBtn = document.getElementById('tour-skip');
    audioEl = document.getElementById('tour-audio');
    if (!overlay) return;

    t = TEXTS[lang()] || TEXTS.sv;
    stepIdx = 0;
    nextBtn.addEventListener('click', next);
    skipBtn.addEventListener('click', stopTour);
    window.addEventListener('resize', function () { if (!overlay.hidden) positionSpotlight(t.steps[stepIdx]); });
    overlay.hidden = false;
    renderStep();
    if (window.SkylandTracker && window.SkylandTracker.track) {
      try { window.SkylandTracker.track('tour_start', {}); } catch (e) { /* ignore */ }
    }
  }

  window.SkylandTour = {
    maybeStart: function () {
      var seen = null;
      try { seen = localStorage.getItem(FLAG); } catch (e) { /* privat läge */ }
      if (seen) return;
      if (location.hash && location.hash !== '#core') return; // djuplänk — stör inte
      setTimeout(start, 900);
    },
    start: function () { stepIdx = 0; start(); }
  };
})();
