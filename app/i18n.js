// ─── Skyland i18n — English / Swedish ───
(function () {
  const translations = {
    en: {
      // Hero
      hero_static: "We're not a:",
      hero_spin_1: "Web agency",
      hero_spin_2: "Consulting firm",
      hero_spin_3: "Software developer",
      hero_spin_4: "Marketing agency",
      hero_spin_5: "Web agency",
      hero_desc: "We're all of them: We help companies find the AI solutions that saves them real time and money, then we build it, deploy it, and train your team to use it.",
      hero_tag: "THE INTELLIGENT OPERATING SYSTEM FOR SERVICE SMB'S",

      // Neural
      neural_h1: "Most companies buy AI tools.<br/>Then nothing happens.",
      neural_sub: "The tools sit unused. The team doesn't trust it.<br/>Nobody saved a single hour.",
      neural_box: "We don't sell tools.<br/>We build systems that work.",
      flow_find: "Find it",
      flow_build: "Build it",
      flow_deploy: "Deploy it",
      flow_use: "Use it",
      neural_tag: "NO PILOTS. NO EXPERIMENTS. YOU OWN IT FROM DAY ONE.",

      // Flux
      link_badge: "LINK ACTIVE",
      voice_h2: "Listening...",
      voice_sub: "AWAITING VOICE COMMAND",
      chat_placeholder: "Type technical command...",

      // Void
      void_h2: "Incoming Transmission",
      void_sub: "Initialize secure communication channel.",
      label_name: "NAME",
      label_email: "EMAIL",
      label_company: "COMPANY",
      label_website: "WEBSITE",
      label_phone: "PHONE",
      label_payload: "PAYLOAD [MESSAGE]",
      placeholder_name: "Enter Designation",
      placeholder_email: "network@node.local",
      placeholder_company: "Enter Company",
      placeholder_website: "Enter Website",
      placeholder_phone: "Enter Phone",
      placeholder_message: "Transmit data block...",
      transmit_btn: "TRANSMIT",
      scan_title: "LEAD PROFILE SCAN",
      scan_status: "NODE_ACTIVE",
      ai_response_title: "AUTOMATED AI RESPONSE",
      ai_response_body: "Hello Alex, thanks for reaching out. Based on your profile at TechFlow, we recommend starting with the Neural module for your automated fleet integration...",
      sector_value: "AI Automation",
    },

    sv: {
      // Hero
      hero_static: "Vi är inte en:",
      hero_spin_1: "Webbyrå",
      hero_spin_2: "Konsultfirma",
      hero_spin_3: "Mjukvaruutvecklare",
      hero_spin_4: "Marknadsföringsbyrå",
      hero_spin_5: "Webbyrå",
      hero_desc: "Vi är alla: Vi hjälper företag hitta AI-lösningar som sparar dem tid och pengar, sen bygger vi det, driftsätter det och utbildar ert team.",
      hero_tag: "DET INTELLIGENTA OPERATIVSYSTEMET FÖR TJÄNSTEFÖRETAG",

      // Neural
      neural_h1: "De flesta företag köper AI-verktyg.<br/>Sen händer ingenting.",
      neural_sub: "Verktygen ligger oanvända. Teamet litar inte på det.<br/>Ingen sparade en enda timme.",
      neural_box: "Vi säljer inte verktyg.<br/>Vi bygger system som fungerar.",
      flow_find: "Hitta",
      flow_build: "Bygg",
      flow_deploy: "Driftsätt",
      flow_use: "Använd",
      neural_tag: "INGA PILOTER. INGA EXPERIMENT. NI ÄGER DET FRÅN DAG ETT.",

      // Flux
      link_badge: "LÄNK AKTIV",
      voice_h2: "Lyssnar...",
      voice_sub: "INVÄNTAR RÖSTKOMMANDO",
      chat_placeholder: "Skriv tekniskt kommando...",

      // Void
      void_h2: "Inkommande Transmission",
      void_sub: "Initiera säker kommunikationskanal.",
      label_name: "NAMN",
      label_email: "E-POST",
      label_company: "FÖRETAG",
      label_website: "WEBBPLATS",
      label_phone: "TELEFON",
      label_payload: "MEDDELANDE",
      placeholder_name: "Ange namn",
      placeholder_email: "namn@företag.se",
      placeholder_company: "Ange företag",
      placeholder_website: "Ange webbplats",
      placeholder_phone: "Ange telefon",
      placeholder_message: "Skriv ditt meddelande...",
      transmit_btn: "SKICKA",
      scan_title: "LEAD-PROFILSKANNING",
      scan_status: "NOD_AKTIV",
      ai_response_title: "AUTOMATISKT AI-SVAR",
      ai_response_body: "Hej Alex, tack för att du hörde av dig. Baserat på din profil på TechFlow rekommenderar vi att börja med Neural-modulen för er automatiserade flotteintegration...",
      sector_value: "AI-automatisering",
    },
  };

  function getStoredLang() {
    // Delegate to SkylandLang if available, fallback to localStorage
    if (window.SkylandLang) {
      return window.SkylandLang.getCurrentLang();
    }
    return localStorage.getItem('skyland_lang') || 'sv';
  }

  function setLang(lang) {
    if (window.SkylandLang) {
      // SkylandLang.setLang reloads the page — translations apply on reload
      window.SkylandLang.setLang(lang);
      return;
    }
    localStorage.setItem('skyland_lang', lang);
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateLangButtons(lang);
  }

  function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    // Text content (innerHTML)
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });
  }

  function updateLangButtons(lang) {
    var svBtn = document.getElementById('lang-sv');
    var enBtn = document.getElementById('lang-en');
    if (svBtn) svBtn.classList.toggle('active', lang === 'sv');
    if (enBtn) enBtn.classList.toggle('active', lang === 'en');
    // Legacy single toggle fallback
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'en' ? 'SV' : 'EN';
  }

  // Expose globally
  window.SkylandI18n = {
    setLang,
    getLang: getStoredLang,
    toggle: function () {
      const current = getStoredLang();
      setLang(current === 'en' ? 'sv' : 'en');
    },
    init: function () {
      var lang = getStoredLang();
      document.documentElement.lang = lang;
      applyTranslations(lang);
      updateLangButtons(lang);
    },
  };
})();
