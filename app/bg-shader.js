// ─── Aetheric Background: @paper-design/shaders MeshGradient ───
//
// En fullskärms-WebGL-shader som ritar om varje bildruta, hela tiden. På en
// maskin med grafikkrets kostar det nästan ingenting. På en maskin UTAN
// (Googles PageSpeed-maskin, gamla telefoner, billiga laptops) räknas varje
// bildruta på processorn: 13 sekunder blockerad huvudtråd i Lighthouse,
// prestandapoäng 48 medan allt annat låg på 100 (mätt 5 sep 2026).
//
// Därför tre grindar innan shadern startar, och ett stilla fallback i CSS
// (#bg-shader-container.bg-static) som ser ut som shaderns viloläge:
//
//   1. prefers-reduced-motion: reduce  → stilla. Användaren har bett om det,
//      och en bakgrund som rör sig oavbrutet ska lyda (WCAG 2.2.2 / 2.3.3).
//   2. Ingen hårdvaru-WebGL (SwiftShader, llvmpipe, ingen kontext) → stilla.
//      Det är inte att lura mätningen: en maskin utan grafikkrets SKA få
//      den stilla versionen, det är hela poängen.
//   3. Starta först när sidan är målad och läsaren har luft (load + idle),
//      inte i kapplöpning med första målningen.
//
// Plus: pausa när fliken är dold. Ingen ser den, ingen ska betala för den.
//
// window.SkylandBG.pause/resume finns kvar för video-uppspelningen (app.js,
// intro-video.js) och är ofarliga att anropa i stilla läge.

(function () {
  const container = document.getElementById('bg-shader-container');
  if (!container) return;

  const SPEED = 0.3;
  let mount = null;
  let userPaused = false;   // pausad av video, inte av flikbyte

  function goStatic(reason) {
    container.classList.add('bg-static');
    container.setAttribute('data-bg-reason', reason);
  }

  function exposeNoop() {
    window.SkylandBG = { pause() {}, resume() {} };
  }

  // ── Grind 1: reducerad rörelse ─────────────────────────────────────────
  const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (motionQuery && motionQuery.matches) {
    goStatic('reduced-motion');
    exposeNoop();
    return;
  }

  // ── Grind 2: finns det en riktig grafikkrets? ───────────────────────────
  function hasHardwareWebGL() {
    let gl;
    try {
      const canvas = document.createElement('canvas');
      gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
        || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    } catch (_) { return false; }
    if (!gl) return false;   // ingen kontext, eller bara en med "major performance caveat" = mjukvara
    try {
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
      if (/swiftshader|llvmpipe|software|mesa offscreen|microsoft basic render/i.test(renderer)) return false;
    } catch (_) { /* utan tillägget litar vi på caveat-flaggan ovan */ }
    try { const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); } catch (_) {}
    return true;
  }
  if (!hasHardwareWebGL()) {
    goStatic('no-hardware-webgl');
    exposeNoop();
    return;
  }

  // ── Grind 3: efter målning, när läsaren har luft ────────────────────────
  function whenIdle(fn) {
    const go = () => ('requestIdleCallback' in window)
      ? window.requestIdleCallback(fn, { timeout: 2500 })
      : setTimeout(fn, 800);
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  }

  whenIdle(async function start() {
    let lib;
    try {
      lib = await import('https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.76/+esm');
    } catch (_) {
      goStatic('lib-failed');   // CDN nere eller blockerad: stilla, inte svart
      exposeNoop();
      return;
    }
    const { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } = lib;

    const uniforms = {
      u_colors: [
        getShaderColorFromString('#010201'),   // near-pure black
        getShaderColorFromString('#021008'),   // black with green whisper
        getShaderColorFromString('#032010'),   // dark forest bridge
        getShaderColorFromString('#064830'),   // subtle emerald presence
      ],
      u_colorsCount: 4,
      u_distortion: 0.8,
      u_swirl: 0.1,
      u_grainMixer: 0,
      u_grainOverlay: 0,
      u_fit: 2,
      u_scale: 1,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    };

    try {
      mount = new ShaderMount(container, meshGradientFragmentShader, uniforms, undefined, SPEED, 0);
    } catch (_) {
      goStatic('mount-failed');
      exposeNoop();
      return;
    }
    container.classList.remove('bg-static');

    const setSpeed = (v) => { if (mount && typeof mount.setSpeed === 'function') mount.setSpeed(v); };

    // Dold flik: pausa. Synlig igen: fortsätt, om inte videon håller den pausad.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) setSpeed(0);
      else if (!userPaused) setSpeed(SPEED);
    });

    // Byter användaren till reducerad rörelse under besöket: stanna.
    if (motionQuery && typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', (e) => {
        if (e.matches) { setSpeed(0); goStatic('reduced-motion'); }
      });
    }

    window.SkylandBG = {
      pause() { userPaused = true; setSpeed(0); },
      resume() { userPaused = false; if (!document.hidden) setSpeed(SPEED); },
    };
  });
})();
