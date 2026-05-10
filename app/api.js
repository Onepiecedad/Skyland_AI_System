/**
 * Skyland API Fetch Wrapper
 *
 * All outgoing HTTP calls to n8n / FastAPI go through this wrapper.
 * It automatically attaches the session UUID as X-Session-ID header,
 * ensuring every backend event can be correlated to a visitor session.
 */

(function () {
  'use strict';

  /**
   * Wrapper around native fetch() that injects the session UUID header.
   *
   * @param {string} url - The endpoint to call
   * @param {RequestInit} [options={}] - Standard fetch options
   * @returns {Promise<Response>}
   */
  function apiFetch(url, options) {
    options = options || {};
    options.headers = options.headers || {};

    // Attach session UUID — the sacred binding key (AGENT.md rule 4)
    var session = window.SkylandSession ? window.SkylandSession.get() : null;
    if (session && session.id) {
      options.headers['X-Session-ID'] = session.id;
    } else {
      console.warn('[API] No active session — request sent without X-Session-ID');
    }

    return fetch(url, options);
  }

  // Expose on window for vanilla JS consumption
  window.SkylandAPI = {
    fetch: apiFetch
  };
})();
