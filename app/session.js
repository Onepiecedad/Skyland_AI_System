/**
 * Skyland Session Module
 *
 * Assigns a persistent UUID to every visitor session.
 * All downstream systems (form, voice, dashboard, CRM) bind to this ID.
 * UUID persists in localStorage and auto-rotates after 24 hours.
 */

(function () {
  'use strict';

  var STORAGE_KEY_ID = 'skyland_session_id';
  var STORAGE_KEY_TS = 'skyland_session_created_at';
  var MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generate a v4 UUID using the native Web Crypto API.
   * No external dependencies — crypto.randomUUID() is supported
   * in all modern browsers and requires a secure context (HTTPS or localhost).
   */
  function generateSessionId() {
    return crypto.randomUUID();
  }

  /**
   * Read the current session from localStorage.
   * Returns null if no session exists.
   */
  function getSession() {
    var id = localStorage.getItem(STORAGE_KEY_ID);
    var createdAt = localStorage.getItem(STORAGE_KEY_TS);
    if (!id || !createdAt) return null;
    return { id: id, createdAt: createdAt };
  }

  /**
   * Check whether the stored session is older than 24 hours.
   * Treats missing or malformed timestamps as expired to force renewal.
   */
  function isSessionExpired() {
    var createdAt = localStorage.getItem(STORAGE_KEY_TS);
    if (!createdAt) return true;
    var age = Date.now() - new Date(createdAt).getTime();
    return isNaN(age) || age > MAX_AGE_MS;
  }

  /**
   * Persist a fresh session to localStorage.
   */
  function _writeSession(id) {
    var now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_ID, id);
    localStorage.setItem(STORAGE_KEY_TS, now);
    return { id: id, createdAt: now };
  }

  /**
   * Main entry point. Returns the current session or creates a new one.
   * Called once at DOMContentLoaded from app.js.
   */
  function initSession() {
    var existing = getSession();

    if (existing && !isSessionExpired()) {
      console.log('[SESSION] Resumed: ' + existing.id);
      return existing;
    }

    // Expired or missing — rotate
    var session = _writeSession(generateSessionId());
    console.log('[SESSION] Created: ' + session.id);

    // Register new session in backend via n8n webhook (fire-and-forget).
    // Only fires for NEW sessions, not resumed ones — the early return
    // on line 66 handles that case. Failure must never block the frontend.
    if (window.SkylandAPI && window.SkylandAPI.fetch) {
      SkylandAPI.fetch('https://onepiecedad.app.n8n.cloud/webhook/session-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_uuid: session.id,
          user_agent: navigator.userAgent,
          entry_module: location.hash.replace('#', '') || 'core'
        })
      }).catch(function (err) {
        // Webhook failure is a warning, not an error.
        // The frontend operates independently of n8n availability.
        console.warn('[SESSION] Failed to register session:', err.message);
      });
    }

    return session;
  }

  /**
   * Remove session data from localStorage.
   * Useful for testing and future logout flows.
   */
  function clearSession() {
    localStorage.removeItem(STORAGE_KEY_ID);
    localStorage.removeItem(STORAGE_KEY_TS);
    console.log('[SESSION] Cleared');
  }

  // Expose on window for vanilla JS consumption across scripts
  window.SkylandSession = {
    init: initSession,
    get: getSession,
    isExpired: isSessionExpired,
    clear: clearSession
  };
})();
