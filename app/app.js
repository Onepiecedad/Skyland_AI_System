/**
 * Skyland site navigation — Cross Swap Navigation, porterad från SCC:s
 * FocusNavigator (2026-09-01). Fem paneler, alltid monterade: en i mitten
 * (synlig), fyra grannar parkerade utanför skärmen åt sina håll. En
 * navigation = mitten byter plats med vald granne; båda glider. Dragbart
 * navigationskors (minimap), kantpilar med grannens namn på desktop,
 * piltangenter, kant-swipe med trackpad, touch-swipe i sidled på mobil.
 * Sid-id:n oförändrade (core/neural/dashboard/flux/void) så session-, void-,
 * voice-, dashboard- och tracker-modulerna fungerar orörda.
 */
document.addEventListener('DOMContentLoaded', () => {
  window.SkylandSession.init();
  if (window.SkylandVoice) window.SkylandVoice.init();
  if (window.SkylandI18n) window.SkylandI18n.init();
  if (window.SkylandVoid) window.SkylandVoid.init();
  if (window.SkylandDashboard) window.SkylandDashboard.init();

  const PAGE_IDS = ['core', 'neural', 'dashboard', 'flux', 'void'];
  const DIRECTIONS = ['up', 'right', 'down', 'left'];
  const DEFAULT_LAYOUT = { center: 'core', up: 'dashboard', left: 'neural', right: 'flux', down: 'void' };
  const ROLE_OFFSET = {
    center: 'translate(0,0)', up: 'translate(0,-104%)', down: 'translate(0,104%)',
    left: 'translate(-104%,0)', right: 'translate(104%,0)',
  };
  const LAYOUT_KEY = 'skyland_cross_layout';

  const LABELS = {
    sv: { core: 'Hem', neural: 'Tjänster', dashboard: 'Systemet', flux: 'Demo', void: 'Kontakt' },
    en: { core: 'Home', neural: 'Services', dashboard: 'The System', flux: 'Demo', void: 'Contact' },
  };
  function lang() {
    try {
      if (window.SkylandLang) return window.SkylandLang.getCurrentLang();
      return localStorage.getItem('skyland_lang') || 'sv';
    } catch (e) { return 'sv'; }
  }
  const labels = LABELS[lang()] || LABELS.sv;

  const pages = {};
  PAGE_IDS.forEach(id => { pages[id] = document.getElementById(id); });
  const mainEl = document.querySelector('main');

  function loadLayout() {
    try {
      const raw = localStorage.getItem(LAYOUT_KEY);
      if (!raw) return { ...DEFAULT_LAYOUT };
      const p = JSON.parse(raw);
      const vals = [p.center, p.up, p.right, p.down, p.left];
      if (new Set(vals).size === 5 && vals.every(v => PAGE_IDS.includes(v))) return p;
    } catch (e) { /* korrupt → default */ }
    return { ...DEFAULT_LAYOUT };
  }
  let layout = loadLayout();
  let cooldown = 0;

  function roleOf(id) {
    if (layout.center === id) return 'center';
    return DIRECTIONS.find(d => layout[d] === id) || 'up';
  }

  function applyLayout() {
    PAGE_IDS.forEach(id => {
      const role = roleOf(id);
      const isCenter = role === 'center';
      pages[id].style.transform = ROLE_OFFSET[role];
      pages[id].classList.toggle('active', isCenter);
      pages[id].classList.toggle('in-view', isCenter);
      pages[id].setAttribute('aria-hidden', String(!isCenter));
    });
    updateWidget();
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch (e) { /* ignore */ }
    history.replaceState(null, '', '#' + layout.center);
    window.dispatchEvent(new CustomEvent('skyland:page', { detail: { page: layout.center } }));
  }

  function navigate(dir) {
    const now = Date.now();
    if (now - cooldown < 450) return;
    cooldown = now;
    if (layout.center === 'flux' && window.SkylandVoice) window.SkylandVoice.stop();
    const incoming = layout[dir];
    layout = { ...layout, center: incoming, [dir]: layout.center };
    applyLayout();
    pages[incoming].scrollTop = 0;
  }

  function focusPane(id) {
    if (!PAGE_IDS.includes(id) || layout.center === id) return;
    const dir = DIRECTIONS.find(d => layout[d] === id);
    if (dir) navigate(dir);
  }
  window.SkylandNav = { showPage: focusPane, pageIds: PAGE_IDS, current: () => layout.center };

  // ── Kantpilar (desktop) ──
  const CHEV = {
    up: '<polyline points="18 15 12 9 6 15"/>', down: '<polyline points="6 9 12 15 18 9"/>',
    left: '<polyline points="15 18 9 12 15 6"/>', right: '<polyline points="9 18 15 12 9 6"/>',
  };
  const edges = {};
  DIRECTIONS.forEach(dir => {
    const b = document.createElement('button');
    b.className = 'fnav-edge fnav-edge--' + dir;
    b.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + CHEV[dir] + '</svg><span></span>';
    b.addEventListener('click', () => navigate(dir));
    document.body.appendChild(b);
    edges[dir] = b;
  });

  // ── Navigationskorset (dragbart, kollapsbart) ──
  const minimap = document.createElement('div');
  minimap.className = 'fnav-minimap';
  minimap.id = 'fnav-minimap';
  minimap.setAttribute('aria-label', 'Navigationskors');
  minimap.innerHTML =
    '<button class="fnav-drag" title="Dra för att flytta" aria-label="Flytta korset">☰</button>' +
    '<button class="fnav-mini" data-dir="up"></button>' +
    '<button class="fnav-collapse" title="Fäll ihop" aria-label="Dölj korset">–</button>' +
    '<button class="fnav-mini" data-dir="left"></button>' +
    '<button class="fnav-mini fnav-mini--center" data-dir="center"></button>' +
    '<button class="fnav-mini" data-dir="right"></button>' +
    '<button class="fnav-alex" title="Prata med Alex" aria-label="Prata med Alex">✦</button>' +
    '<button class="fnav-mini" data-dir="down"></button>' +
    '<div></div>';
  document.body.appendChild(minimap);
  const collapsedBtn = document.createElement('button');
  collapsedBtn.className = 'fnav-collapsed-btn';
  collapsedBtn.textContent = '✛';
  collapsedBtn.title = 'Visa navigationskorset';
  collapsedBtn.hidden = true;
  document.body.appendChild(collapsedBtn);

  minimap.querySelectorAll('.fnav-mini[data-dir]').forEach(b => {
    if (b.dataset.dir !== 'center') b.addEventListener('click', () => navigate(b.dataset.dir));
  });
  minimap.querySelector('.fnav-alex').addEventListener('click', () => focusPane('flux'));
  minimap.querySelector('.fnav-collapse').addEventListener('click', () => { minimap.hidden = true; collapsedBtn.hidden = false; });
  collapsedBtn.addEventListener('click', () => { collapsedBtn.hidden = true; minimap.hidden = false; });

  function updateWidget() {
    DIRECTIONS.forEach(dir => {
      edges[dir].querySelector('span').textContent = labels[layout[dir]];
      const mini = minimap.querySelector('[data-dir="' + dir + '"]');
      mini.textContent = labels[layout[dir]];
      mini.setAttribute('data-page', layout[dir]);
    });
    const c = minimap.querySelector('[data-dir="center"]');
    c.textContent = labels[layout.center];
    c.setAttribute('data-page', layout.center);
  }

  // Drag (pointer events, position sparas)
  const POS_KEY = 'skyland_cross_pos';
  try {
    const s = localStorage.getItem(POS_KEY);
    if (s) { const p = JSON.parse(s); minimap.style.left = p.x + 'px'; minimap.style.top = p.y + 'px'; minimap.style.bottom = 'auto'; }
  } catch (e) { /* ignore */ }
  let drag = null;
  const dragBtn = minimap.querySelector('.fnav-drag');
  dragBtn.addEventListener('pointerdown', (e) => {
    const r = minimap.getBoundingClientRect();
    drag = { sx: e.clientX, sy: e.clientY, bx: r.left, by: r.top };
    dragBtn.setPointerCapture(e.pointerId);
  });
  dragBtn.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const nx = Math.max(4, Math.min(window.innerWidth - 90, drag.bx + e.clientX - drag.sx));
    const ny = Math.max(4, Math.min(window.innerHeight - 70, drag.by + e.clientY - drag.sy));
    minimap.style.left = nx + 'px'; minimap.style.top = ny + 'px'; minimap.style.bottom = 'auto';
  });
  dragBtn.addEventListener('pointerup', () => {
    if (drag) { const r = minimap.getBoundingClientRect(); try { localStorage.setItem(POS_KEY, JSON.stringify({ x: r.left, y: r.top })); } catch (e) { /* ignore */ } }
    drag = null;
  });

  // ── Klick på data-target (kundvägskorten, dash-cta) ──
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-target]');
    if (btn && PAGE_IDS.includes(btn.getAttribute('data-target'))) focusPane(btn.getAttribute('data-target'));
  }, true);

  // ── Piltangenter ──
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const tourOpen = document.getElementById('tour-overlay') && !document.getElementById('tour-overlay').hidden;
    if (tourOpen) return;
    const map = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left' };
    if (map[e.key]) { e.preventDefault(); navigate(map[e.key]); }
  });

  // ── Trackpad-swipe som börjar vid skärmkant ──
  const EDGE = 36;
  window.addEventListener('wheel', (e) => {
    const w = window.innerWidth, hh = window.innerHeight;
    const nearL = e.clientX < EDGE, nearR = e.clientX > w - EDGE;
    const nearT = e.clientY < EDGE, nearB = e.clientY > hh - EDGE;
    if (!(nearL || nearR || nearT || nearB)) return;
    const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (horiz && (nearL || nearR) && Math.abs(e.deltaX) > 24) { e.preventDefault(); navigate(e.deltaX > 0 ? 'right' : 'left'); }
    else if (!horiz && (nearT || nearB) && Math.abs(e.deltaY) > 24) { e.preventDefault(); navigate(e.deltaY > 0 ? 'down' : 'up'); }
  }, { passive: false });

  // ── Touch-swipe i sidled (mobil) — vertikalt lämnas åt inre scroll ──
  let touch = null;
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x;
    const dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > 2.2 * Math.abs(dy)) navigate(dx < 0 ? 'right' : 'left');
  }, { passive: true });

  // ── Start: hash-djuplänk vinner över sparat läge ──
  const hash = location.hash.replace('#', '');
  if (PAGE_IDS.includes(hash) && layout.center !== hash) {
    const dir = DIRECTIONS.find(d => layout[d] === hash);
    if (dir) layout = { ...layout, center: hash, [dir]: layout.center };
  }
  applyLayout();

  // ── Smart Portal: live-spegling av formulärfälten ──
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

  // ── Rundturen ──
  if (window.SkylandTour) window.SkylandTour.maybeStart();
});
