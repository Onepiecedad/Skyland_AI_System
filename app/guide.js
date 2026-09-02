/**
 * Rundturen — etapp 1–3.
 *
 * Den pratar inte om sajten, den pekar på nästa sak besökaren kan göra och
 * flyttar ljuset när hen gjort den. Tre regler bär hela funktionen:
 *
 *   1. En sak lyser i taget. Två samtidiga pulser läses som ingen.
 *   2. Rundturen blockerar aldrig. Går besökaren åt annat håll följer den med.
 *   3. Riktningen frågas av navigationen vid varje rendering. Korset roterar
 *      när man flyttar sig — en hårdkodad "svep uppåt" pekar fel redan i
 *      andra steget.
 *
 * Två sorters steg. På sidorna man passerar är nästa handling ett svep, och
 * pillret ligger stilla i tumzonen med kaskaden åt fingrets håll. På Kontakt
 * och Demo är nästa handling något på sidan — då lyser själva elementet upp
 * och pillret ställer sig intill det och säger vad det är. Vilket element
 * det är räknas ut vid varje rendering, så ljuset flyttar sig av sig självt
 * genom formuläret medan besökaren fyller i det.
 */
(function () {
  'use strict';

  var KEY = 'skyland_guide_v1';

  var STEPS = [
    { page: 'core', type: 'swipe', next: 'neural' },
    { page: 'neural', type: 'swipe', next: 'void' },
    { page: 'void', type: 'point', pick: pickVoid },
    { page: 'dashboard', type: 'point', pick: pickDash, next: 'flux' },
    { page: 'flux', type: 'point', pick: pickFlux },
  ];

  // Att hämta in sidan till höger görs genom att dra fingret åt vänster.
  // Pilen visar fingrets väg, inte var sidan ligger.
  var FINGER = { right: 'left', left: 'right', down: 'up', up: 'down' };
  var ROT = { up: 0, right: 90, down: 180, left: 270 };

  var el = null, active = false, focused = null, raf = 0;

  function lang() {
    return (document.documentElement.lang || 'sv').slice(0, 2) === 'en' ? 'en' : 'sv';
  }
  function stepFor(page) {
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i].page === page) return STEPS[i];
    return null;
  }

  /* ── Vad lyser på Kontakt ────────────────────────────────────────────────
     Samma ordning och samma trösklar som void.js validerar mot, annars
     pekar rundturen på ett fält som formuläret redan är nöjt med. Är
     ärendet skickat är nästa handling inte längre i formuläret utan i
     knappen som följer det in i Systemet. */
  function pickVoid() {
    var status = document.getElementById('void-status');
    if (status && status.dataset.state === 'busy') return null;

    var goto = document.getElementById('void-goto-dash');
    if (goto) return { el: goto, sv: 'Följ ärendet in i Systemet', en: 'Follow the case into the system' };

    var form = document.getElementById('contact-form');
    if (!form) return null;
    function f(n) { return form.querySelector('[name="' + n + '"]'); }
    function v(n) { var e = f(n); return e ? e.value.trim() : ''; }

    if (v('name').length < 2) return { el: f('name'), sv: 'Börja här: ditt namn', en: 'Start here: your name' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email')))
      return { el: f('email'), sv: 'Din e-post — svaret går hit', en: 'Your email — the answer lands here' };
    if (v('message').length < 30)
      return { el: f('message'), sv: 'Beskriv problemet med egna ord', en: 'Describe the problem in your words' };
    var c = document.getElementById('void-consent');
    if (c && !c.checked)
      return { el: c.closest('.void-consent') || c, sv: 'Godkänn, så tar vi emot det', en: 'Tick the box and we can take it' };
    return { el: form.querySelector('.transmit-btn'), sv: 'Tryck skicka — svar direkt', en: 'Hit send — answer comes straight back' };
  }

  /* ── Vad lyser i Systemet ────────────────────────────────────────────────
     Ledtråden ner till svaret är redan ett ljus. Ligger den uppe håller
     rundturen tyst — två pulser samtidigt läses som ingen. När svaret är
     läst är nästa handling knappen som tar samtalet vidare till Alex med
     kontexten kvar; finns inget ärende alls är nästa handling ett svep. */
  function pickDash() {
    if (document.querySelector('#dashboard .dash-cue.is-on')) return null;
    var cont = document.querySelector('#dashboard .dash-continue');
    if (cont) return { el: cont, sv: 'Fortsätt hos Alex — hon har ärendet', en: 'Continue with Alex — she has the case' };
    return 'swipe';
  }

  /* ── Vad lyser på Demo ───────────────────────────────────────────────────
     Orben är hela sidans handling. Har samtalet börjat är rundturen slut:
     det finns inget nästa steg att peka på, och en puls under ett pågående
     samtal drar bara uppmärksamhet från Alex. */
  var BUSY = ['voice-connecting', 'voice-listening', 'voice-speaking'];
  function pickFlux() {
    var orb = document.querySelector('#flux .orb-wrap');
    if (!orb) return null;
    for (var i = 0; i < BUSY.length; i++) if (orb.classList.contains(BUSY[i])) { stop(); return null; }
    return { el: orb, round: true, sv: 'Tryck på orben och prata med Alex', en: 'Tap the orb and talk to Alex' };
  }

  function build() {
    if (el) return;
    el = document.createElement('div');
    el.className = 'guide';
    var chev = '<svg viewBox="0 0 24 14" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11 12 3l8.5 8"/></svg>';
    el.innerHTML =
      '<div class="guide-pill">' +
        '<span class="guide-arrow sw-cas">' + chev + chev + chev + '</span>' +
        '<span class="guide-t1"></span>' +
        '<button type="button" class="guide-skip" aria-label="Avsluta">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
          'stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>';
    el.querySelector('.guide-skip').addEventListener('click', stop);
    document.body.appendChild(el);
  }

  function clearFocus() {
    if (focused) { focused.classList.remove('guide-focus', 'is-round'); focused = null; }
  }

  function hide() {
    clearFocus();
    if (el) { el.classList.remove('is-on'); el.classList.remove('guide--point'); }
  }

  /* Pillret ställer sig ovanför det som lyser, eller under om det inte får
     plats mellan elementet och headern. Höjden mäts efter att texten är satt
     — den varierar med språk och radbrytning. */
  function anchor(target) {
    var r = target.getBoundingClientRect();
    el.style.bottom = 'auto';
    el.style.top = '0px';
    var h = el.offsetHeight;
    var top = r.top - h - 12;
    if (top < 118) top = r.bottom + 12;
    top = Math.min(top, window.innerHeight - h - 14);
    el.style.top = Math.round(Math.max(8, top)) + 'px';
  }

  function render() {
    if (!active) return;
    if (window.SkylandNav && window.SkylandNav.mode === 'scroll') { stop(); return; }
    var cur = window.SkylandNav ? window.SkylandNav.current() : null;
    var step = cur ? stepFor(cur) : null;
    if (!step) { hide(); return; }
    var l = lang();

    var hit = step.type === 'point' ? step.pick() : 'swipe';
    if (hit === 'swipe') {
      var dir = step.next ? window.SkylandNav.directionTo(step.next) : null;
      if (!dir) { hide(); return; }
      build();
      clearFocus();
      el.classList.remove('guide--point');
      el.style.top = '';
      el.style.bottom = '';
      el.querySelector('.guide-t1').textContent = l === 'en' ? 'Swipe this way' : 'Svep hitåt';
      // Yttre elementet vrider pilen, den inre svg:n far framåt i sin egen
      // vridna axel — då räcker en enda rörelse för alla fyra riktningar.
      el.querySelector('.guide-arrow').style.transform = 'rotate(' + ROT[FINGER[dir]] + 'deg)';
    } else {
      if (!hit || !hit.el) { hide(); return; }
      build();
      if (focused !== hit.el) { clearFocus(); focused = hit.el; }
      focused.classList.add('guide-focus');
      focused.classList.toggle('is-round', !!hit.round);
      el.classList.add('guide--point');
      el.querySelector('.guide-t1').textContent = hit[l];
      anchor(hit.el);
    }

    el.querySelector('.guide-skip').setAttribute('aria-label',
      l === 'en' ? 'End the tour' : 'Avsluta rundturen');
    requestAnimationFrame(function () { if (el) el.classList.add('is-on'); });
  }

  function schedule() {
    if (!active || raf) return;
    raf = requestAnimationFrame(function () { raf = 0; render(); });
  }

  function start() {
    active = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    render();
  }

  function stop() {
    active = false;
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    clearFocus();
    if (el) {
      el.classList.remove('is-on');
      var gone = el; el = null;
      setTimeout(function () { if (gone.parentNode) gone.parentNode.removeChild(gone); }, 500);
    }
  }

  window.addEventListener('skyland:page', function () {
    render();
    setTimeout(render, 940);
  });
  // Formuläret ändrar vad som är nästa handling vid varje tangenttryck, och
  // svaret från servern byter ut hela steget. Båda måste flytta ljuset.
  window.addEventListener('skyland:void', schedule);
  document.addEventListener('input', schedule, true);
  document.addEventListener('change', schedule, true);
  document.addEventListener('click', function () { setTimeout(schedule, 260); setTimeout(schedule, 760); }, true);
  // Ledtråden i Systemet slocknar när svaret scrollas fram — då är knappen
  // vidare till Alex nästa handling, och rundturen ska hinna se det.
  document.addEventListener('scroll', schedule, true);
  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);

  try { if (sessionStorage.getItem(KEY)) { active = true; } } catch (e) {}
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { if (active) render(); });
  } else if (active) { render(); }

  window.SkylandGuide = { start: start, stop: stop, isActive: function () { return active; } };
})();
