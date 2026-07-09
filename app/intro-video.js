/**
 * Alex intro video — plays inline in the media card on the Flux page.
 * Poster image shows until the visitor clicks play; the video then runs
 * in place (no popup). Language (sv/en) picks the matching file.
 */

(function () {
  'use strict';

  var VIDEO_SRC = {
    sv: 'media/alex-intro-sv.mp4',
    en: 'media/alex-intro-en.mp4'
  };

  function init() {
    var card = document.getElementById('alex-media-card');
    var video = document.getElementById('alex-intro-video');
    var playBtn = document.getElementById('alex-video-btn');
    if (!card || !video || !playBtn) return;

    function start() {
      var lang = window.SkylandLang ? window.SkylandLang.getCurrentLang() : 'sv';
      var src = VIDEO_SRC[lang] || VIDEO_SRC.sv;

      // Stop any active voice call so audio doesn't overlap
      if (window.SkylandVoice && typeof window.SkylandVoice.stop === 'function') {
        window.SkylandVoice.stop();
      }

      if (video.getAttribute('src') !== src) {
        video.setAttribute('src', src);
      }
      video.controls = true;
      card.classList.add('playing');
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* autoplay edge case */ });
    }

    function reset() {
      video.controls = false;
      card.classList.remove('playing');
      video.removeAttribute('src');
      video.load(); // back to poster
    }

    playBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      start();
    });
    card.addEventListener('click', function () {
      if (!card.classList.contains('playing')) start();
    });
    video.addEventListener('ended', reset);
  }

  window.SkylandIntroVideo = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
