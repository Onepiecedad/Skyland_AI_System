// ─── Aetheric Background: Official @paper-design/shaders MeshGradient ───
// Using the ACTUAL library that powers the 21st.dev demo
// Loaded via ESM from jsDelivr CDN
(async function () {
  const container = document.getElementById('bg-shader-container');
  if (!container) return;

  // Dynamic ESM import from CDN
  const { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } =
    await import('https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.0.76/+esm');

  const uniforms = {
    u_colors: [
      getShaderColorFromString('#010201'),   // near-pure black
      getShaderColorFromString('#021008'),   // black with green whisper
      getShaderColorFromString('#032010'),   // dark forest bridge
      getShaderColorFromString('#064830'),   // subtle emerald presence
    ],
    u_colorsCount: 4,
    u_distortion: 0.8,     // calm, simple shapes
    u_swirl: 0.1,          // gentle flow
    u_grainMixer: 0,       // clean
    u_grainOverlay: 0,     // clean
    u_fit: 2,        // cover
    u_scale: 1,
    u_rotation: 0,
    u_offsetX: 0,
    u_offsetY: 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
  };

  const shaderMount = new ShaderMount(
    container,
    meshGradientFragmentShader,
    uniforms,
    undefined,  // webGlContextAttributes
    0.3,        // speed (slow flowing)
    0           // starting frame
  );

  // Expose pause/resume so video playback can free up the GPU
  window.SkylandBG = {
    pause() {
      if (typeof shaderMount.setSpeed === 'function') shaderMount.setSpeed(0);
    },
    resume() {
      if (typeof shaderMount.setSpeed === 'function') shaderMount.setSpeed(0.3);
    }
  };
})();
