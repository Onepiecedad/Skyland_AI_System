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
      voice_idle_h2: "Start Conversation",
      voice_idle_sub: "CLICK TO CONNECT",
      voice_connecting_h2: "Connecting...",
      voice_connecting_sub: "ESTABLISHING VOICE LINK",
      voice_speaking_h2: "Alex is speaking...",
      voice_speaking_sub: "AGENT RESPONSE",
      voice_ended_h2: "Conversation ended",
      voice_ended_sub: "CLICK TO RECONNECT",
      voice_error_h2: "Connection error",
      voice_error_sub: "CLICK TO RETRY",
      link_standby: "LINK STANDBY",
      link_connecting: "CONNECTING",
      link_closed: "LINK CLOSED",
      link_error: "LINK ERROR",
      voice_err_400: "Session error — reload the page",
      voice_err_unavailable: "Voice link unavailable — try the form instead",
      chat_placeholder: "Type technical command...",
      starter_1: "What can you help me with?",
      starter_2: "How much does it cost?",
      starter_3: "How does the process work?",
      starter_4: "Which companies have you worked with?",
      starter_open: "Or start a regular conversation \u2192",

      // Void
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
      scan_toggle_show: "Show AI analysis",
      scan_title: "LEAD PROFILE SCAN",
      scan_status: "NODE_ACTIVE",
      ai_response_title: "AUTOMATED AI RESPONSE",
      ai_response_body: "Hello Alex, thanks for reaching out. Based on your profile at TechFlow, we recommend starting with the Neural module for your automated fleet integration...",
            sector_value: "AI Automation",

      // Flux intro (live demo copy)
      flux_kicker: "LIVE DEMO — VOICE AGENT",
      flux_h1: "Meet Alex. She answers when you can't.",
      flux_desc: "Alex is Skyland's AI voice agent — trained on our knowledge base of services, pricing, processes and customer cases. She answers questions, qualifies your needs and can book a video call straight into our calendar. The same technology can answer your company's phone: no missed calls, no phone queue, no follow-up three days later.",
      flux_how: "Click the orb or pick a question below. Talk to her like you would to a human — end with the red button. Your browser will ask for microphone access.",

      // Void intro (smart form copy)
      void_kicker: "LIVE DEMO — SMART FORM",
      void_h2: "A form that answers immediately.",
      void_sub: "Standard contact forms are black holes — a reply arrives days later, if at all. This form is read by an AI connected to our knowledge base: you get a relevant answer in seconds, tailored to what you write. At the same time a lead card is created in our dashboard — see the next page.",
      void_hint: "Describe your business and what eats your time. Hit send — the AI response appears in the panel within seconds.",

      // Dashboard (visitor-facing SCC view)
      dash_kicker: "LIVE DEMO — COMMAND CENTER",
      dash_h1: "Your journey, seen from our side.",
      dash_desc: "This is a view from Skyland Command Center — the same dashboard we use to run our customers' systems. When you submitted the form or talked to Alex, a lead card was created automatically. Here is yours, in real time.",
      dash_card_title: "YOUR LEAD CARD",
      dash_timeline_title: "EVENTS",
      dash_empty: "No lead card yet. Try the voice agent or the form and watch the card build itself here — in real time.",
      dash_empty_voice: "Talk to Alex",
      dash_empty_form: "Fill out the form",
      dash_ev_form: "Form received — AI answered instantly",
      dash_ev_voice: "Voice conversation with Alex",
      dash_score: "LEAD SCORE",
      dash_what_title: "As a customer, you get the same thing:",
      dash_what_1: "Every lead in one place — forms, voice calls, email",
      dash_what_2: "AI responses and call summaries logged per customer",
      dash_what_3: "Automatic scoring and prioritization, no manual triage",
      dash_ai_label: "AI RESPONSE SENT",
      dash_summary_label: "CALL SUMMARY",
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
      voice_idle_h2: "Starta konversation",
      voice_idle_sub: "KLICKA FÖR ATT ANSLUTA",
      voice_connecting_h2: "Ansluter...",
      voice_connecting_sub: "UPPRÄTTAR RÖSTLÄNK",
      voice_speaking_h2: "Alex pratar...",
      voice_speaking_sub: "AGENTSVAR",
      voice_ended_h2: "Konversationen avslutad",
      voice_ended_sub: "KLICKA FÖR ATT ÅTERANSLUTA",
      voice_error_h2: "Anslutningsfel",
      voice_error_sub: "KLICKA FÖR ATT FÖRSÖKA IGEN",
      link_standby: "LÄNK STANDBY",
      link_connecting: "ANSLUTER",
      link_closed: "LÄNK STÄNGD",
      link_error: "LÄNKFEL",
      voice_err_400: "Sessionsfel — ladda om sidan",
      voice_err_unavailable: "Röstlänken är otillgänglig — testa formuläret istället",
      chat_placeholder: "Skriv tekniskt kommando...",
      starter_1: "Vad kan ni hjälpa mig med?",
      starter_2: "Hur mycket kostar det?",
      starter_3: "Hur fungerar processen?",
      starter_4: "Vilka företag har ni jobbat med?",
      starter_open: "Eller starta vanlig konversation \u2192",

      // Void
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
      scan_toggle_show: "Visa AI-analys",
      scan_title: "LEAD-PROFILSKANNING",
      scan_status: "NOD_AKTIV",
      ai_response_title: "AUTOMATISKT AI-SVAR",
      ai_response_body: "Hej Alex, tack för att du hörde av dig. Baserat på din profil på TechFlow rekommenderar vi att börja med Neural-modulen för er automatiserade flotteintegration...",
            sector_value: "AI-automatisering",

      // Flux intro (live demo copy)
      flux_kicker: "LIVE DEMO — RÖSTAGENT",
      flux_h1: "Möt Alex. Hon svarar när du inte kan.",
      flux_desc: "Alex är Skylands AI-röstagent — tränad på vår kunskapsbas med tjänster, priser, processer och kundcase. Hon svarar på frågor, kvalificerar ditt behov och kan boka ett videosamtal direkt i kalendern. Samma teknik kan svara i ditt företags telefon: inga missade samtal, ingen telefonkö, ingen återkoppling tre dagar senare.",
      flux_how: "Klicka på orben eller välj en fråga nedan. Prata med henne som med en människa — avsluta med röda knappen. Webbläsaren frågar efter mikrofonåtkomst.",

      // Void intro (smart form copy)
      void_kicker: "LIVE DEMO — SMART FORMULÄR",
      void_h2: "Ett formulär som svarar direkt.",
      void_sub: "Vanliga kontaktformulär är svarta hål — svaret kommer efter dagar, om alls. Det här formuläret läses av en AI kopplad till vår kunskapsbas: du får ett relevant svar på sekunder, anpassat efter det du skriver. Samtidigt skapas ett lead-kort i vår dashboard — se nästa sida.",
      void_hint: "Beskriv din verksamhet och vad som tar mest tid. Skicka — AI-svaret dyker upp i panelen inom några sekunder.",

      // Dashboard (visitor-facing SCC view)
      dash_kicker: "LIVE DEMO — COMMAND CENTER",
      dash_h1: "Din resa, sedd från vår sida.",
      dash_desc: "Det här är en vy ur Skyland Command Center — samma dashboard vi använder för att driva våra kunders system. När du skickade formuläret eller pratade med Alex skapades ett lead-kort automatiskt. Här är ditt, i realtid.",
      dash_card_title: "DITT LEAD-KORT",
      dash_timeline_title: "HÄNDELSER",
      dash_empty: "Inget lead-kort än. Testa röstagenten eller formuläret och se kortet byggas här — i realtid.",
      dash_empty_voice: "Prata med Alex",
      dash_empty_form: "Fyll i formuläret",
      dash_ev_form: "Formulär mottaget — AI svarade direkt",
      dash_ev_voice: "Röstsamtal med Alex",
      dash_score: "LEAD SCORE",
      dash_what_title: "Som kund får du samma sak:",
      dash_what_1: "Alla leads på ett ställe — formulär, röstsamtal, mejl",
      dash_what_2: "AI-svar och samtalssammanfattningar loggade per kund",
      dash_what_3: "Automatisk score och prioritering, ingen manuell sortering",
      dash_ai_label: "AI-SVAR SKICKAT",
      dash_summary_label: "SAMTALSSAMMANFATTNING",
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

  /**
   * Translate a key in the current language.
   * Falls back to English, then to the provided fallback string.
   */
  function t(key, fallback) {
    var lang = getStoredLang();
    var table = translations[lang] || translations.en;
    if (table[key] !== undefined) return table[key];
    if (translations.en[key] !== undefined) return translations.en[key];
    return fallback !== undefined ? fallback : key;
  }

  // Expose globally
  window.SkylandI18n = {
    setLang,
    getLang: getStoredLang,
    t: t,
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
