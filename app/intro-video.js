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

    // Filmen hämtas INTE vid sidstart. Tidigare laddades båda klippen
    // (3,3 + 4,8 MB) fullt ut för varje besökare i samma sekund som sidan
    // öppnades, oavsett om någon någonsin klickade — 8,3 MB per besök och
    // huvudtråd upptagen med att buffra video medan hero-sidan skulle måla.
    // Nu laddas klippet när DESS sida blir aktiv (app.js skickar skyland:page),
    // eller när någon rör kortet, vilket som kommer först. Den som scrollat
    // dit och tittar en sekund har klippet cachat innan klicket, så
    // "startar direkt"-egenskapen finns kvar för dem det gäller.
    var loaded = false;
    function ensureLoaded() {
      if (loaded) return;
      loaded = true;
      video.preload = 'auto';
      video.setAttribute('src', src);
      video.load();
    }
    var ownPage = card.closest('.page');
    var ownId = ownPage ? ownPage.id : null;
    if (ownId) {
      window.addEventListener('skyland:page', function (e) {
        if (e.detail && e.detail.page === ownId) ensureLoaded();
      });
      // Sidan var redan aktiv när skriptet kördes (direktlänk med #hash).
      if (window.SkylandNav && typeof window.SkylandNav.current === 'function' && window.SkylandNav.current() === ownId) ensureLoaded();
    }
    card.addEventListener('pointerenter', ensureLoaded, { once: true });
    card.addEventListener('touchstart', ensureLoaded, { once: true, passive: true });

    function start() {
      ensureLoaded();
      // One face talking at a time
      if (activeCard && activeCard !== card && activeCard.__reset) {
        activeCard.__reset();
      }
      // Don't talk over a live voice call
      if (window.SkylandVoice && typeof window.SkylandVoice.stop === 'function') {
        window.SkylandVoice.stop();
      }
      card.classList.add('playing');
      var glass = card.closest('.page-glass');
      if (glass) glass.classList.add('video-active');
      activeCard = card;
      pauseBg();
      video.currentTime = 0;
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* ignore */ });
    }

    function reset() {
      video.pause();
      // Tillbaka till POSTERBILDEN, inte videons första bildruta. Tidigare
      // spolades bara currentTime till 0 med antagandet "first frame ==
      // poster" — det gäller inte längre sedan postrarna byttes till bildrutor
      // ur mitten av filmerna (öppen blick). load() försätter elementet i
      // utgångsläget så poster-attributet visas igen; filen är cachad så
      // nästa uppspelning startar direkt ändå.
      try {
        video.currentTime = 0;
        video.load();
      } catch (e) { /* not seekable yet */ }
      card.classList.remove('playing');
      var glassEl = card.closest('.page-glass');
      if (glassEl) glassEl.classList.remove('video-active');
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
