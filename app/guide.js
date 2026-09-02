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
    { page: 'core', next: 'neural' },
    { page: 'neural', next: 'void' },
    { page: 'dashboard', next: 'flux' },
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
        '<span class="guide-arrow sw-cas">' + '<svg viewBox="0 0 24 14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11 12 3l8.5 8"/></svg>' + '<svg viewBox="0 0 24 14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11 12 3l8.5 8"/></svg>' + '<svg viewBox="0 0 24 14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11 12 3l8.5 8"/></svg>' + '</span>' +
        '<span class="guide-t1"></span>' +
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
    var l = lang();
    var finger = FINGER[dir];
    el.querySelector('.guide-t1').textContent = l === 'en' ? 'Swipe this way' : 'Svep hitåt';
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
