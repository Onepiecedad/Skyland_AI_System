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

  /**
   * Variant 1 firstMessage overrides — keyed by starter button text.
   * When a visitor clicks a starter, Alex opens with a contextual greeting
   * instead of the generic Variant 2 ("Vad kan jag hjälpa dig med?").
   */
  var STARTER_RESPONSES = {
    sv: {
      'Vad kan ni hjälpa mig med?':
        'Välkommen till Skyland. Jag förstår att du vill veta vad vi kan hjälpa till med. Är det okej om jag ställer ett par korta frågor först, så kan vi ge dig ett bättre svar?',
      'Hur mycket kostar det?':
        'Välkommen till Skyland. Jag förstår att du undrar över våra priser. Är det okej om jag ställer ett par korta frågor först, så kan vi ge dig ett bättre svar?',
      'Hur fungerar processen?':
        'Välkommen till Skyland. Jag förstår att du vill veta hur vår process ser ut. Är det okej om jag ställer ett par korta frågor först, så kan vi ge dig ett bättre svar?',
      'Vilka företag har ni jobbat med?':
        'Välkommen till Skyland. Jag förstår att du vill höra om företagen vi jobbat med. Är det okej om jag ställer ett par korta frågor först, så kan vi ge dig ett bättre svar?'
    },
    en: {
      'What can you help me with?':
        'Welcome to Skyland. I understand you want to know what we can help with. Is it okay if I ask a couple of quick questions first, so we can give you a better answer?',
      'How much does it cost?':
        'Welcome to Skyland. I understand you\'re curious about our pricing. Is it okay if I ask a couple of quick questions first, so we can give you a better answer?',
      'How does the process work?':
        'Welcome to Skyland. I understand you want to know how our process works. Is it okay if I ask a couple of quick questions first, so we can give you a better answer?',
      'Which companies have you worked with?':
        'Welcome to Skyland. I understand you want to hear about the companies we\'ve worked with. Is it okay if I ask a couple of quick questions first, so we can give you a better answer?'
    }
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

  /**
   * Get Variant 1 firstMessage override for a starter button text.
   * Returns null if starterText is not in the mapping (fallback to default).
   */
  function getStarterResponse(starterText) {
    var lang = getCurrentLang();
    var responses = STARTER_RESPONSES[lang];
    if (responses && responses[starterText]) {
      return responses[starterText];
    }
    return null;
  }

  // Initialize on load — set localStorage if not yet set
  getCurrentLang();

  // Expose globally
  window.SkylandLang = {
    getCurrentLang: getCurrentLang,
    setLang: setLang,
    getAgentId: getAgentId,
    getStarterResponse: getStarterResponse,
    AGENT_IDS: AGENT_IDS
  };
})();
