/**
 * Skyland site navigation — Cross Swap Navigation, porterad från SCC:s
 * FocusNavigator (2026-09-01). Fem paneler, alltid monterade: en i mitten
 * (synlig), fyra grannar parkerade utanför skärmen åt sina håll. En
 * navigation = mitten byter plats med vald granne; båda glider. Dragbart
 * navigationskors (minimap), kantpilar med grannens namn på desktop,
 * piltangenter, kant-swipe med trackpad, touch-swipe i fyra riktningar på mobil.
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

  // Glidningen kostar: varje panel i rörelse tvingar omräkning av
  // page-glass backdrop-filter, och WebGL-shadern ritar samtidigt. Uppmätt i
  // preview: 17 fps / värsta bildruta 252 ms utan avlastning, 36 fps / 100 ms
  // med. Därför pausas båda under swappen och återställs när den är klar.
  let swapTimer = null;
  function beginSwapPerf() {
    // Bara WebGL-bakgrunden pausas. Att även slå av glasets backdrop-filter
    // gav ~4 fps till men syntes som ett ryck i första bildrutan (glaset bytte
    // utseende precis när rörelsen startade), så det är borttaget.
    if (window.SkylandBG && typeof window.SkylandBG.pause === 'function') window.SkylandBG.pause();
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => {
      if (window.SkylandBG && typeof window.SkylandBG.resume === 'function') window.SkylandBG.resume();
    }, 880);
  }

  // Panelen är inte alltid den som scrollar — på mobil är det .page-glass.
  // Nollställs bara panelen kommer man tillbaka till en sida som ligger kvar
  // halvvägs nerskrollad, med toppen av innehållet gömt under headern.
  function resetScroll(page) {
    page.scrollTop = 0;
    const glass = page.querySelector('.page-glass');
    if (glass) glass.scrollTop = 0;
  }

  function navigate(dir) {
    const now = Date.now();
    if (now - cooldown < 620) return;
    cooldown = now;
    if (layout.center === 'flux' && window.SkylandVoice) window.SkylandVoice.stop();
    const incoming = layout[dir];
    markLearned(dir);
    beginSwapPerf();
    // Nollställ scrollen INNAN panelen börjar röra sig — görs den efteråt
    // hoppar innehållet synligt medan skivan glider in.
    resetScroll(pages[incoming]);
    layout = { ...layout, center: incoming, [dir]: layout.center };
    applyLayout();
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
  // Sidorna reserverar en remsa i underkant åt navigationskorset. Är korset
  // ihopfällt behövs bara plats för den lilla knappen, och kortet får växa in
  // i resten — annars står 45 px oanvända på varje sida. Läget sparas så att
  // det överlever en omladdning.
  const COLLAPSE_KEY = 'skyland_cross_collapsed';
  function setCollapsed(on, persist) {
    minimap.hidden = on;
    collapsedBtn.hidden = !on;
    document.body.classList.toggle('fnav-is-collapsed', on);
    if (persist) { try { localStorage.setItem(COLLAPSE_KEY, on ? '1' : '0'); } catch (e) { /* ignore */ } }
  }
  minimap.querySelector('.fnav-collapse').addEventListener('click', () => setCollapsed(true, true));
  collapsedBtn.addEventListener('click', () => setCollapsed(false, true));
  try { if (localStorage.getItem(COLLAPSE_KEY) === '1') setCollapsed(true, false); } catch (e) { /* ignore */ }

  // Kantpilarna lär ut svepet på mobil. När en riktning väl använts slutar den
  // pulsa och blir en svag vilogöd — fyra saker som blinkar i evighet är brus
  // för den som redan kan sajten. Sparas per webbläsare.
  // sessionStorage, inte localStorage: inlärningen gäller det här besöket.
  // Med localStorage slocknade pilarna för alltid så fort man svept åt alla
  // fyra håll en gång — för den som använder sajten dagligen syntes de aldrig
  // igen. Nu bjuder de in på nytt varje gång man kommer tillbaka.
  const LEARNED_KEY = 'skyland_swipe_learned';
  let learned = new Set();
  try { learned = new Set(JSON.parse(sessionStorage.getItem(LEARNED_KEY) || '[]')); } catch (e) { /* ignore */ }
  try { localStorage.removeItem(LEARNED_KEY); } catch (e) { /* rensar det gamla permanenta läget */ }
  function applyLearned() {
    DIRECTIONS.forEach(d => edges[d].classList.toggle('is-learned', learned.has(d)));
  }
  function markLearned(dir) {
    if (learned.has(dir)) return;
    learned.add(dir);
    try { sessionStorage.setItem(LEARNED_KEY, JSON.stringify([...learned])); } catch (e) { /* ignore */ }
    applyLearned();
  }
  applyLearned();

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
  // Ett svep som råkar starta på ett kort ska byta sida — inte också trycka på
  // kortet. Vakten ligger först i capture-fasen och äter den klicken.
  let swipeGuardUntil = 0;
  document.addEventListener('click', (e) => {
    if (Date.now() < swipeGuardUntil) { e.stopPropagation(); e.preventDefault(); }
  }, true);

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

  // ── Tvåfingersswipe på styrplattan: navigerar i alla fyra riktningar ──
  // Respekterar sidans egen scroll: vertikal swipe navigerar först när den
  // aktiva panelen inte kan scrolla vidare åt det hållet (kontaktsidan m.fl.
  // ska kunna scrollas internt utan att korset hoppar). Gesten ackumuleras och
  // nollställs vid paus, så en lång svep ger EN navigation — inte fem.
  const SWIPE_THRESHOLD = 90;   // hur bestämd gesten måste vara
  const SWIPE_RESET_MS = 260;   // paus som avslutar en gest
  const SCROLL_EPS = 2;         // tolerans för "längst upp/ner"
  let accX = 0, accY = 0, lastWheelAt = 0, gestureConsumed = false;

  function canScroll(el, dir) {
    if (!el) return false;
    // Ett element med overflow:hidden har högt scrollHeight men rör sig aldrig.
    // Utan den här kontrollen blockerar det vertikal navigation för alltid.
    const oy = getComputedStyle(el).overflowY;
    if (oy !== 'auto' && oy !== 'scroll' && oy !== 'overlay') return false;
    if (dir === 'down') return el.scrollHeight - el.clientHeight - el.scrollTop > SCROLL_EPS;
    if (dir === 'up') return el.scrollTop > SCROLL_EPS;
    return false;
  }

  window.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (now - lastWheelAt > SWIPE_RESET_MS) { accX = 0; accY = 0; gestureConsumed = false; }
    lastWheelAt = now;
    if (gestureConsumed) return;

    // Scroll inuti ett eget scrollande element (t.ex. formulärkortet) lämnas ifred
    const page = pages[layout.center];
    const inner = e.target.closest ? e.target.closest('.page-glass, textarea') : null;
    const scroller = (inner && inner.scrollHeight > inner.clientHeight) ? inner : page;

    accX += e.deltaX;
    accY += e.deltaY;
    const horiz = Math.abs(accX) > Math.abs(accY);

    if (horiz) {
      if (Math.abs(accX) < SWIPE_THRESHOLD) return;
      e.preventDefault();
      gestureConsumed = true;
      navigate(accX > 0 ? 'right' : 'left');
    } else {
      const dir = accY > 0 ? 'down' : 'up';
      if (canScroll(scroller, dir)) return;      // sidan scrollar själv först
      if (Math.abs(accY) < SWIPE_THRESHOLD) return;
      e.preventDefault();
      gestureConsumed = true;
      navigate(dir);
    }
  }, { passive: false });

  // ── Touch-swipe (mobil) — samma kors som allt annat, alla fyra riktningar ──
  // Tre saker gör gesten stabil i stället för svajig:
  //  1. Axellås: den dominerande riktningen måste vara TOUCH_AXIS gånger den
  //     andra, annars händer ingenting. En diagonal ska inte gissa åt ett håll.
  //  2. Sträcka ELLER fart: en lugn svep måste gå TOUCH_MIN px, men en snärt
  //     räcker på TOUCH_FLICK px om farten är över TOUCH_FLICK_V px/ms.
  //  3. Scrolläget läses vid touchstart, inte vid touchend. Läses det efteråt
  //     har fingret redan scrollat panelen till kanten, och samma svep som
  //     scrollade skulle också byta sida — det var det som kändes ryckigt.
  const TOUCH_MIN = 56;
  const TOUCH_FLICK = 30;
  const TOUCH_FLICK_V = 0.45;
  const TOUCH_AXIS = 1.25;
  const TOUCH_MAX_MS = 800;
  // Fält och länkar äger sina egna gester; korset håller sig undan där.
  const OWN_GESTURE = 'input,textarea,select,a[href],.fnav-minimap,.lang-switch';

  let touch = null;

  function scrollerFor(target) {
    const inner = target && target.closest ? target.closest('.page-glass, textarea') : null;
    return (inner && inner.scrollHeight > inner.clientHeight) ? inner : pages[layout.center];
  }
  function tourIsOpen() {
    const o = document.getElementById('tour-overlay');
    return !!o && !o.hidden;
  }

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1 || tourIsOpen()) { touch = null; return; }
    const t = e.touches[0];
    const scroller = scrollerFor(e.target);
    touch = {
      x: t.clientX, y: t.clientY, at: Date.now(),
      free: !(e.target.closest && e.target.closest(OWN_GESTURE)),
      canUp: canScroll(scroller, 'up'), canDown: canScroll(scroller, 'down'),
    };
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) touch = null;      // nyp/zoom är inte navigation
  }, { passive: true });
  document.addEventListener('touchcancel', () => { touch = null; }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const t = touch;
    touch = null;
    if (!t || !t.free) return;
    const dx = e.changedTouches[0].clientX - t.x;
    const dy = e.changedTouches[0].clientY - t.y;
    const dt = Math.max(1, Date.now() - t.at);
    if (dt > TOUCH_MAX_MS) return;               // långsamt drag är ingen svep

    const ax = Math.abs(dx), ay = Math.abs(dy);
    const horiz = ax >= ay;
    const main = horiz ? ax : ay;
    const cross = horiz ? ay : ax;
    if (main < cross * TOUCH_AXIS) return;       // för diagonal — gissa inte
    if (main < TOUCH_MIN && !(main >= TOUCH_FLICK && main / dt >= TOUCH_FLICK_V)) return;

    const dir = horiz ? (dx < 0 ? 'right' : 'left') : (dy < 0 ? 'down' : 'up');
    // Vertikalt: panelen får scrolla färdigt först.
    if (!horiz && (dir === 'down' ? t.canDown : t.canUp)) return;
    swipeGuardUntil = Date.now() + 450;          // svepet ska inte också klicka
    navigate(dir);
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
