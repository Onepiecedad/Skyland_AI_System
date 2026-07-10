/**
 * Alex intro — frameless "floating face" video on the Flux page.
 * The poster (first video frame) blends into the background via a CSS mask.
 * Click the face to make her talk; click again (or video end) resets.
 * Currently the English video is used for both languages.
 */

(function () {
  'use strict';

  var VIDEO_SRC = 'media/alex-intro-en.mp4';

  function init() {
    var card = document.getElementById('alex-media-card');
    var video = document.getElementById('alex-intro-video');
    if (!card || !video) return;

    function start() {
      if (window.SkylandVoice && typeof window.SkylandVoice.stop === 'function') {
        window.SkylandVoice.stop();
      }
      if (video.getAttribute('src') !== VIDEO_SRC) {
        video.setAttribute('src', VIDEO_SRC);
      }
      card.classList.add('playing');
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* ignore */ });
    }

    function reset() {
      video.pause();
      card.classList.remove('playing');
      video.removeAttribute('src');
      video.load(); // back to poster
    }

    card.addEventListener('click', function () {
      if (card.classList.contains('playing')) reset();
      else start();
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
