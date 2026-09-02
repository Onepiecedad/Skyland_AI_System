/**
 * Rundturen — etapp 1.
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
 * Etapp 1 täcker Hem → Tjänster → Kontakt. Kontaktsidan, Systemet och Alex
 * hakar på i etapp 2 och 3 genom att lägga till steg i STEPS.
 */
(function () {
  'use strict';

  var KEY = 'skyland_guide_v1';

  var STEPS = [
    { page: 'core', next: 'neural',
      sv: ['Svep hitåt', 'Vilka problem vi tar bort'],
      en: ['Swipe this way', 'The problems we remove'] },
    { page: 'neural', next: 'void',
      sv: ['Svep hitåt', 'Berätta vad som kostar dig tid'],
      en: ['Swipe this way', "Tell us what's costing you time"] },
  ];

  // Att hämta in sidan till höger görs genom att dra fingret åt vänster.
  // Pilen visar fingrets väg, inte var sidan ligger.
  var FINGER = { right: 'left', left: 'right', down: 'up', up: 'down' };
  var ROT = { up: 0, right: 90, down: 180, left: 270 };

  var el = null, active = false;

  function lang() {
    return (document.documentElement.lang || 'sv').slice(0, 2) === 'en' ? 'en' : 'sv';
  }
  function stepFor(page) {
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i].page === page) return STEPS[i];
    return null;
  }

  function build() {
    if (el) return;
    el = document.createElement('div');
    el.className = 'guide';
    el.innerHTML =
      '<div class="guide-pill">' +
        '<span class="guide-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 19V5"/><path d="M5.5 11.5 12 5l6.5 6.5"/></svg></span>' +
        '<span class="guide-t1"></span><span class="guide-t2"></span>' +
        '<button type="button" class="guide-skip" aria-label="Avsluta">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
          'stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>';
    el.querySelector('.guide-skip').addEventListener('click', stop);
    document.body.appendChild(el);
  }

  function render() {
    if (!active) return;
    var cur = window.SkylandNav ? window.SkylandNav.current() : null;
    var step = cur ? stepFor(cur) : null;
    if (!step) { if (el) el.classList.remove('is-on'); return; }
    var dir = window.SkylandNav.directionTo(step.next);
    if (!dir) { if (el) el.classList.remove('is-on'); return; }

    build();
    var l = lang(), txt = step[l];
    var finger = FINGER[dir];
    el.querySelector('.guide-t1').textContent = txt[0];
    el.querySelector('.guide-t2').textContent = txt[1];
    el.querySelector('.guide-skip').setAttribute('aria-label', l === 'en' ? 'End the tour' : 'Avsluta rundturen');
    var arrow = el.querySelector('.guide-arrow');
    // Yttre elementet vrider pilen, den inre svg:n far framåt i sin egen
    // vridna axel — då räcker en enda rörelse för alla fyra riktningar.
    arrow.style.transform = 'rotate(' + ROT[finger] + 'deg)';
    requestAnimationFrame(function () { if (el) el.classList.add('is-on'); });
  }

  function start() {
    active = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    render();
  }

  function stop() {
    active = false;
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    if (el) {
      el.classList.remove('is-on');
      var gone = el; el = null;
      setTimeout(function () { if (gone.parentNode) gone.parentNode.removeChild(gone); }, 500);
    }
  }

  window.addEventListener('skyland:page', render);
  try { if (sessionStorage.getItem(KEY)) { active = true; } } catch (e) {}
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { if (active) render(); });
  } else if (active) { render(); }

  window.SkylandGuide = { start: start, stop: stop, isActive: function () { return active; } };
})();
