/**
 * Alex intro video — plays the HeyGen presentation in an overlay.
 * Picks the video matching the active site language (sv/en).
 */

(function () {
  'use strict';

  var VIDEO_SRC = {
    sv: 'media/alex-intro-sv.mp4',
    en: 'media/alex-intro-en.mp4'
  };

  function init() {
    var btn = document.getElementById('alex-video-btn');
    var overlay = document.getElementById('video-overlay');
    var video = document.getElementById('alex-intro-video');
    var closeBtn = document.getElementById('video-close');
    if (!btn || !overlay || !video) return;

    function open() {
      var lang = window.SkylandLang ? window.SkylandLang.getCurrentLang() : 'sv';
      var src = VIDEO_SRC[lang] || VIDEO_SRC.sv;

      // Stop any active voice call before playing the intro
      if (window.SkylandVoice && typeof window.SkylandVoice.stop === 'function') {
        window.SkylandVoice.stop();
      }

      if (video.getAttribute('src') !== src) {
        video.setAttribute('src', src);
      }
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* user gesture edge case */ });
    }

    function close() {
      video.pause();
      overlay.hidden = true;
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) close();
    });
    video.addEventListener('ended', close);
  }

  window.SkylandIntroVideo = { init: init };

  // Self-init on DOM ready (independent of app.js)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
