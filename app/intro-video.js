/**
 * Alex "floating face" videos — frameless, blended into the background.
 * Any element with class .alex-face and a data-video attribute becomes a
 * click-to-talk face: poster (first video frame) until click, then the
 * video plays in place. Clicking again, or video end, resets to poster.
 *
 * The WebGL background shader is paused during playback to keep the
 * video smooth (window.SkylandBG exposed by bg-shader.js).
 */

(function () {
  'use strict';

  var activeCard = null;

  function pauseBg() {
    if (window.SkylandBG && typeof window.SkylandBG.pause === 'function') {
      window.SkylandBG.pause();
    }
  }

  function resumeBg() {
    if (window.SkylandBG && typeof window.SkylandBG.resume === 'function') {
      window.SkylandBG.resume();
    }
  }

  function setupCard(card) {
    var video = card.querySelector('video');
    var src = card.getAttribute('data-video');
    if (!video || !src) return;

    function start() {
      // One face talking at a time
      if (activeCard && activeCard !== card && activeCard.__reset) {
        activeCard.__reset();
      }
      // Don't talk over a live voice call
      if (window.SkylandVoice && typeof window.SkylandVoice.stop === 'function') {
        window.SkylandVoice.stop();
      }
      if (video.getAttribute('src') !== src) {
        video.setAttribute('src', src);
      }
      card.classList.add('playing');
      activeCard = card;
      pauseBg();
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* ignore */ });
    }

    function reset() {
      video.pause();
      card.classList.remove('playing');
      video.removeAttribute('src');
      video.load(); // back to poster
      if (activeCard === card) {
        activeCard = null;
        resumeBg();
      }
    }

    card.__reset = reset;

    card.addEventListener('click', function () {
      if (card.classList.contains('playing')) reset();
      else start();
    });
    video.addEventListener('ended', reset);
  }

  function init() {
    document.querySelectorAll('.alex-face[data-video]').forEach(setupCard);
  }

  window.SkylandIntroVideo = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
