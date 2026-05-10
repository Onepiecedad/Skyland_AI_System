/**
 * Skyland Language & Agent Routing
 *
 * Language priority (on page load):
 *   1. localStorage 'skyland_lang' (if set)
 *   2. URL param ?lang=sv or ?lang=en
 *   3. navigator.language (sv/sv-SE → sv, everything else → en)
 *   4. Default: sv
 *
 * Exposes: window.SkylandLang
 */
(function () {
  'use strict';

  var AGENT_IDS = {
    sv: 'agent_8701kr69134ge7gvh3a6tcmkhq95',
    en: 'TDgRNcUoUC1GHVKK0bHH'
  };

  var STORAGE_KEY = 'skyland_lang';
  var VALID_LANGS = ['sv', 'en'];

  /**
   * Detect language using priority chain.
   * Only called on first load (before localStorage is set).
   */
  function detectLang() {
    // 1. localStorage
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGS.indexOf(stored) !== -1) {
      return stored;
    }

    // 2. URL parameter ?lang=
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (urlLang && VALID_LANGS.indexOf(urlLang) !== -1) {
      return urlLang;
    }

    // 3. Browser language
    var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang === 'sv' || browserLang.startsWith('sv-')) {
      return 'sv';
    }

    // 4. Default
    return 'sv';
  }

  /**
   * Get current language. Initializes from detection if not yet stored.
   */
  function getCurrentLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGS.indexOf(stored) !== -1) {
      return stored;
    }
    var detected = detectLang();
    localStorage.setItem(STORAGE_KEY, detected);
    return detected;
  }

  /**
   * Set language, persist to localStorage, reload page.
   */
  function setLang(lang) {
    if (VALID_LANGS.indexOf(lang) === -1) {
      console.warn('[LANG] Invalid language:', lang);
      return;
    }
    localStorage.setItem(STORAGE_KEY, lang);
    // Reload to apply all changes cleanly
    window.location.reload();
  }

  /**
   * Get the ElevenLabs agent_id for the current language.
   */
  function getAgentId() {
    return AGENT_IDS[getCurrentLang()];
  }

  // Initialize on load — set localStorage if not yet set
  getCurrentLang();

  // Expose globally
  window.SkylandLang = {
    getCurrentLang: getCurrentLang,
    setLang: setLang,
    getAgentId: getAgentId,
    AGENT_IDS: AGENT_IDS
  };
})();
