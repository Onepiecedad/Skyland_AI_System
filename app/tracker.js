/**
 * Skyland Tracker — anonymous, first-party telemetry.
 *
 * Privacy by design: no IP logging, no user agent, no fingerprinting,
 * no third parties. Only functional events tied to the session UUID
 * (the same UUID that already binds form/voice/CRM).
 *
 * Events are queued and flushed in batches via sendBeacon/fetch to the
 * n8n track-event webhook, which whitelists types and data fields.
 */

(function () {
  'use strict';

  var TRACK_URL = 'https://onepiecedad.app.n8n.cloud/webhook/track-event';
  var FLUSH_MS = 5000;
  var MAX_BATCH = 20;

  var queue = [];
  var flushTimer = null;
  var seenPages = {};

  function sessionId() {
    var s = window.SkylandSession ? window.SkylandSession.get() : null;
    return s && s.id ? s.id : null;
  }

  function flush() {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    var sid = sessionId();
    if (!sid || queue.length === 0) return;

    var batch = queue.splice(0, MAX_BATCH);
    var payload = JSON.stringify({ session_uuid: sid, events: batch });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(TRACK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(function () { /* telemetry must never break the site */ });
    }
    if (queue.length > 0) scheduleFlush();
  }

  function scheduleFlush() {
    if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_MS);
  }

  function track(type, data) {
    queue.push({ type: type, data: data || {} });
    if (queue.length >= MAX_BATCH) flush();
    else scheduleFlush();
  }

  function debounce(fn, ms) {
    var t = null;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  }

  function init() {
    // Language (once per page load)
    var lang = window.SkylandLang ? window.SkylandLang.getCurrentLang() : 'sv';
    track('lang', { lang: lang });

    // Page views — one per module per page load, when it enters view
    if ('IntersectionObserver' in window) {
      var pageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !seenPages[entry.target.id]) {
            seenPages[entry.target.id] = true;
            track('page_view', { module: entry.target.id });
          }
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('.page').forEach(function (p) { pageObserver.observe(p); });
    }

    // Alex videos — play + completed
    document.querySelectorAll('.alex-face[data-video]').forEach(function (card) {
      var video = card.querySelector('video');
      if (!video) return;
      var name = (card.getAttribute('data-video') || '').split('/').pop();
      video.addEventListener('play', function () { track('video_play', { video: name }); });
      video.addEventListener('ended', function () { track('video_complete', { video: name }); });
    });

    // Conversation starters
    document.querySelectorAll('.starter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        track('starter_click', { starter: (btn.textContent || '').trim() });
      });
    });

    // Voice: voice_start / voice_end are fired from voice.js on the real
    // ElevenLabs SDK lifecycle (onConnect / onDisconnect), not from DOM clicks.
    // The old orb/end-btn click listeners were unreliable — clicking the orb
    // doesn't guarantee a session connects, and the call can end without the
    // end button (hang-up, tab close, SDK disconnect), so those events were
    // routinely missed. See app/voice.js.

    // Form: first interaction + submit
    var form = document.getElementById('contact-form');
    if (form) {
      var formStarted = false;
      form.addEventListener('focusin', function () {
        if (!formStarted) {
          formStarted = true;
          track('form_start', {});
        }
      });
      form.addEventListener('submit', function () { track('form_submit', {}); });
    }

    // ROI calculator — the visitor's own numbers are a strong intent signal
    var roiHours = document.getElementById('roi-hours');
    var roiRate = document.getElementById('roi-rate');
    if (roiHours && roiRate) {
      var sendRoi = debounce(function () {
        track('roi_input', { hours: Number(roiHours.value), rate: Number(roiRate.value) });
      }, 1500);
      roiHours.addEventListener('input', sendRoi);
      roiRate.addEventListener('input', sendRoi);
    }

    // Booking CTA click — highest intent on the site. Matches both Calendly
    // and Cal.com links (the site is migrating to Cal.com), so the booking
    // funnel step fires regardless of which provider the link points to.
    document.querySelectorAll('a[href*="calendly"], a[href*="cal.com"]').forEach(function (a) {
      a.addEventListener('click', function () { track('cta_book_click', {}); });
    });

    // Flush on page hide so the tail of the session isn't lost
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') flush();
    });
    window.addEventListener('pagehide', flush);
  }

  window.SkylandTracker = { track: track };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
