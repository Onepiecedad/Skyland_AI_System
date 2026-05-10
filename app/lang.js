/**
 * Skyland Language & Agent Routing
 *
 * Language priority (on page load):
 *   1. URL param ?lang=sv or ?lang=en (wins always, syncs to localStorage)
 *   2. localStorage 'skyland_lang' (if valid)
 *   3. navigator.language (sv/sv-* → sv, en/en-* → en)
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
   */
  function detectLang() {
    // 1. URL parameter ?lang= (always wins if present)
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (urlLang && VALID_LANGS.indexOf(urlLang) !== -1) {
      // Sync to localStorage so the choice persists
      if (urlLang !== localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, urlLang);
      }
      return urlLang;
    }

    // 2. localStorage
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGS.indexOf(stored) !== -1) {
      return stored;
    }

    // 3. Browser language (explicit sv and en detection)
    var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang === 'sv' || browserLang.startsWith('sv-')) {
      return 'sv';
    }
    if (browserLang === 'en' || browserLang.startsWith('en-')) {
      return 'en';
    }

    // 4. Default
    return 'sv';
  }

  /**
   * Get current language. Initializes from detection if not yet stored.
   */
  function getCurrentLang() {
    var detected = detectLang();
    // Ensure localStorage is always in sync
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== detected) {
      localStorage.setItem(STORAGE_KEY, detected);
    }
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
