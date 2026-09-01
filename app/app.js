/**
 * Skyland site navigation — fem sidor med SCC-stil tabbväxling (2026-09-01).
 * Ersätter den tidigare scroll-snap-navigeringen: en .page är synlig åt gången
 * (.active), växling är omedelbar, hash-routing bevarad. Sid-id:n är oförändrade
 * (core/neural/dashboard/flux/void) så session-, void-, voice-, dashboard- och
 * tracker-modulerna fungerar orörda.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Session UUID must be initialized before anything else —
  // all events (form, voice, dashboard) bind to this ID
  window.SkylandSession.init();

  if (window.SkylandVoice) window.SkylandVoice.init();
  if (window.SkylandI18n) window.SkylandI18n.init();
  if (window.SkylandVoid) window.SkylandVoid.init();
  if (window.SkylandDashboard) window.SkylandDashboard.init();

  const pageIds = ['core', 'neural', 'dashboard', 'flux', 'void'];
  const pages = {};
  pageIds.forEach(id => { pages[id] = document.getElementById(id); });
  const navButtons = Array.from(document.querySelectorAll('.site-nav .site-nav-btn'));
  let currentPageId = null;

  function showPage(pageId) {
    if (!pages[pageId] || pageId === currentPageId) return;
    if (currentPageId === 'flux' && window.SkylandVoice) window.SkylandVoice.stop();
    pageIds.forEach(id => {
      pages[id].classList.toggle('active', id === pageId);
      pages[id].classList.toggle('in-view', id === pageId); // CSS-animationer + tracker
    });
    navButtons.forEach(b => b.classList.toggle('active', b.dataset.page === pageId));
    currentPageId = pageId;
    pages[pageId].scrollTop = 0;
    history.replaceState(null, '', '#' + pageId);
    window.dispatchEvent(new CustomEvent('skyland:page', { detail: { page: pageId } }));
  }
  window.SkylandNav = { showPage, pageIds, current: () => currentPageId };

  navButtons.forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));
  document.querySelector('.logo').addEventListener('click', () => showPage('core'));

  // Alla knappar med data-target (kundvägskorten, dash-cta) byter sida.
  // Capture-fas: dashboard.js egna scrollIntoView-lyssnare blir ofarliga no-ops
  // eftersom sidan redan är synlig när de kör.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-target]');
    if (btn && pageIds.includes(btn.getAttribute('data-target'))) {
      showPage(btn.getAttribute('data-target'));
    }
  }, true);

  // Tangentbord: pilar växlar sida
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (document.getElementById('tour-overlay') && !document.getElementById('tour-overlay').hidden) return;
    const idx = pageIds.indexOf(currentPageId);
    if ((e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'ArrowDown') && idx < pageIds.length - 1) {
      e.preventDefault(); showPage(pageIds[idx + 1]);
    } else if ((e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'ArrowUp') && idx > 0) {
      e.preventDefault(); showPage(pageIds[idx - 1]);
    }
  });

  // Startsida från hash
  const hash = location.hash.replace('#', '');
  showPage(pageIds.includes(hash) ? hash : 'core');

  // --- Smart Portal: Live profile sync ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const field = input.getAttribute('data-field');
        const mirror = document.getElementById('scan-' + field);
        if (mirror) mirror.textContent = input.value || '—';
      });
    });
  }

  // --- Rundturen: autostart vid första besöket ---
  if (window.SkylandTour) window.SkylandTour.maybeStart();
});
