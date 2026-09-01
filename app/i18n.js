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
      label_payload: "MESSAGE",
      placeholder_name: "Your name",
      placeholder_email: "name@company.com",
      placeholder_company: "Your company",
      placeholder_website: "Your website",
      placeholder_phone: "Your phone number",
      placeholder_message: "Write your message...",
      transmit_btn: "SEND",
      kontakt_to_system: "Watch your lead card build on the System page →",
      nav_hem: "Home",
      nav_tjanster: "Services",
      nav_system: "The System",
      nav_demo: "Demo",
      nav_kontakt: "Contact",
      path1_title: "We run it for you",
      path1_desc: "Ads, leads, websites and voice agents as a service. You get the results — we run the systems.",
      path1_cta: "See the services →",
      path2_title: "Your own Skyland system",
      path2_desc: "Your own AI-driven command center that answers, books and follows up — and that you own.",
      path2_cta: "See the system →",
      svc_kicker: "SERVICES — WE RUN IT FOR YOU",
      svc_h1: "You run the business.<br/>We run the systems.",
      svc_sub: "What our clients buy: finished results, not tools to learn.",
      svc1_t: "A voice agent on your phone",
      svc1_d: "Answers, qualifies and books — around the clock. The same technology as Alex on this site.",
      svc2_t: "Ads & leads",
      svc2_d: "Campaigns that keep filling up with customers, handled all the way to a booked meeting.",
      svc3_t: "A website that sells",
      svc3_d: "Built, hosted and wired to our CRM — visitors become tickets, not PDFs in an inbox.",
      svc4_t: "Follow-up that never forgets",
      svc4_d: "Reminders, replies and bookings handled automatically. Every lead gets followed up.",
      consent_text: "I agree that Skyland AI Solutions processes my personal data in accordance with the <a href=\"/integritetspolicy.html\" id=\"void-privacy-link\" target=\"_blank\" rel=\"noopener\">privacy policy</a>. My message creates a ticket in Skyland's CRM.",
      scan_toggle_show: "Show AI analysis",
      scan_title: "LEAD PROFILE",
      scan_status: "LIVE",
      ai_response_title: "AUTOMATED AI RESPONSE",
      ai_response_body: "Hello Alex, thanks for reaching out. Based on your profile at TechFlow, we recommend starting with the Neural module for your automated fleet integration...",
            sector_value: "AI Automation",

      // Flux intro (live demo copy)
      flux_kicker: "LIVE DEMO — VOICE AGENT",
      flux_video_cta: "Watch Alex introduce herself",
      flux_h1: "Meet Alex. She answers when you can't.",
      flux_desc: "Alex is Skyland's AI voice agent — trained on our services, pricing and customer cases. She answers questions, qualifies your needs and books a video call straight into our calendar. The same technology can answer your company's phone: no missed calls, no follow-up three days later.",
      flux_how: "Click the orb or pick a question below. Your browser will ask for microphone access.",

      // Void intro (smart form copy)
      void_kicker: "CONTACT & BOOKING",
      void_video_cta: "Watch Alex explain the form",
      void_h2: "A form that answers immediately.",
      void_sub: "Standard contact forms are black holes — a reply arrives days later, if at all. This form is read by an AI connected to our knowledge base: you get a relevant answer in seconds. At the same time a lead card is created in our command center — see the System page.",
      void_hint: "Describe your business and what takes up most of your time.",

      // Dashboard (visitor-facing SCC view)
      dash_kicker: "THE SKYLAND SYSTEM — YOUR OWN COMMAND CENTER",
      dash_h1: "A system that works while you do something else.",
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
      dash_desc_short: "This is the product: the same dashboard we run our customers' systems with — and what you see is your own session, live. As a subscriber you get your own.",
      dash_tab_lead: "Your lead",
      dash_tab_overview: "Overview",
      dash_tab_agents: "Agents",
      dash_tab_roi: "Your ROI",
      dash_kpi_1_v: "< 30 s",
      dash_kpi_1_l: "response time on every inquiry",
      dash_kpi_2_v: "24/7",
      dash_kpi_2_l: "captures leads while you sleep",
      dash_kpi_3_v: "100%",
      dash_kpi_3_l: "logged — nothing gets forgotten",
      dash_kpi_4_v: "0",
      dash_kpi_4_l: "manual steps to a booked meeting",
      dash_overview_note: "Everything on this page actually happened in your session. The same engine answers our customers' phones, forms and bookings — every day.",
      dash_ag1_t: "Alex — Voice agent",
      dash_ag1_d: "Answers, qualifies and books meetings. Around the clock, no queue.",
      dash_ag2_t: "Form AI",
      dash_ag2_d: "Reads the message and replies in seconds — with knowledge of your industry.",
      dash_ag3_t: "Lead scoring",
      dash_ag3_d: "Prioritizes automatically so you call the right customer first.",
      dash_ag4_t: "Follow-up",
      dash_ag4_d: "Reminders and next steps created automatically — you never have to keep track of who is waiting for an answer.",
      dash_badge_live: "LIVE ON THIS SITE",
      dash_badge_delivery: "IN CUSTOMER DELIVERY",
      dash_roi_hours: "Admin hours per week",
      dash_roi_rate: "Your hourly value (SEK)",
      dash_roi_result_label: "Time you don't invoice, per year",
      dash_roi_week_label: "Every week without a system",
      dash_roi_note: "A system like this often pays for itself in the first month. We build in weeks — not months. You own everything from day one.",
      dash_cta_book: "Book 15 min with Joakim",
      dash_cta_talk: "or talk to Alex →",
      dash_cta_free: "Free · honest assessment · no strings",
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
      kontakt_to_system: "Se ditt lead-kort byggas på Systemet →",
      nav_hem: "Hem",
      nav_tjanster: "Tjänster",
      nav_system: "Systemet",
      nav_demo: "Demo",
      nav_kontakt: "Kontakt",
      path1_title: "Vi sköter det åt dig",
      path1_desc: "Annonser, leads, hemsidor och röstagenter som tjänst. Du får resultaten — vi driver systemen.",
      path1_cta: "Se tjänsterna →",
      path2_title: "Ditt eget Skyland-system",
      path2_desc: "Ett eget AI-drivet command center som svarar, bokar och följer upp — och som du äger.",
      path2_cta: "Se systemet →",
      svc_kicker: "TJÄNSTER — VI SKÖTER DET ÅT DIG",
      svc_h1: "Du driver företaget.<br/>Vi driver systemen.",
      svc_sub: "Det våra kunder köper: färdiga resultat, inte verktyg att lära sig.",
      svc1_t: "Röstagent i din telefon",
      svc1_d: "Svarar, kvalificerar och bokar — dygnet runt. Samma teknik som Alex på den här sajten.",
      svc2_t: "Annonser & leads",
      svc2_d: "Kampanjer som fylls på med kunder, hanterade hela vägen till bokat möte.",
      svc3_t: "Hemsida som säljer",
      svc3_d: "Byggd, driftad och kopplad till vårt CRM — besökare blir ärenden, inte pdf:er i en inkorg.",
      svc4_t: "Uppföljning som aldrig glömmer",
      svc4_d: "Påminnelser, svar och bokningar sköts automatiskt. Varje lead får en uppföljning.",
      consent_text: "Jag godkänner att Skyland AI Solutions behandlar mina personuppgifter enligt <a href=\"/integritetspolicy.html\" id=\"void-privacy-link\" target=\"_blank\" rel=\"noopener\">integritetspolicyn</a>. Mitt meddelande skapar ett ärende i Skylands CRM.",
      scan_toggle_show: "Visa AI-analys",
      scan_title: "LEAD-PROFIL",
      scan_status: "LIVE",
      ai_response_title: "AUTOMATISKT AI-SVAR",
      ai_response_body: "Hej Alex, tack för att du hörde av dig. Baserat på din profil på TechFlow rekommenderar vi att börja med Neural-modulen för er automatiserade flotteintegration...",
            sector_value: "AI-automatisering",

      // Flux intro (live demo copy)
      flux_kicker: "LIVE DEMO — RÖSTAGENT",
      flux_video_cta: "Se Alex presentera sig",
      flux_h1: "Möt Alex. Hon svarar när du inte kan.",
      flux_desc: "Alex är Skylands AI-röstagent — tränad på våra tjänster, priser och kundcase. Hon svarar på frågor, kvalificerar ditt behov och bokar videosamtal direkt i kalendern. Samma teknik kan svara i ditt företags telefon: inga missade samtal, ingen återkoppling tre dagar senare.",
      flux_how: "Klicka på orben eller välj en fråga nedan. Webbläsaren ber om mikrofonåtkomst.",

      // Void intro (smart form copy)
      void_kicker: "KONTAKT & BOKA",
      void_video_cta: "Se Alex förklara formuläret",
      void_h2: "Ett formulär som svarar direkt.",
      void_sub: "Vanliga kontaktformulär är svarta hål — svaret kommer dagar senare, om alls. Det här läses av en AI kopplad till vår kunskapsbas: du får ett relevant svar på sekunder. Samtidigt skapas ett lead-kort i vårt command center — se sidan Systemet.",
      void_hint: "Beskriv din verksamhet och vad som tar mest tid.",

      // Dashboard (visitor-facing SCC view)
      dash_kicker: "SKYLAND-SYSTEMET — DITT EGET COMMAND CENTER",
      dash_h1: "Ett system som jobbar medan du gör annat.",
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
      dash_desc_short: "Det här är produkten: samma dashboard vi driver våra kunders system med — och det du ser är din session, live. Som abonnent får du ett eget.",
      dash_tab_lead: "Ditt lead",
      dash_tab_overview: "Översikt",
      dash_tab_agents: "Agenter",
      dash_tab_roi: "Din ROI",
      dash_kpi_1_v: "< 30 s",
      dash_kpi_1_l: "svarstid på varje förfrågan",
      dash_kpi_2_v: "24/7",
      dash_kpi_2_l: "fångar leads medan du sover",
      dash_kpi_3_v: "100 %",
      dash_kpi_3_l: "loggat — inget glöms bort",
      dash_kpi_4_v: "0",
      dash_kpi_4_l: "manuella steg till bokat möte",
      dash_overview_note: "Allt på den här sidan hände på riktigt i din session. Samma motor svarar i våra kunders telefoner, formulär och bokningar — varje dag.",
      dash_ag1_t: "Alex — Röstagent",
      dash_ag1_d: "Svarar, kvalificerar och bokar möten. Dygnet runt, utan kö.",
      dash_ag2_t: "Formulärs-AI",
      dash_ag2_d: "Läser meddelandet och svarar på sekunder — med kunskap om din bransch.",
      dash_ag3_t: "Lead-scoring",
      dash_ag3_d: "Prioriterar automatiskt så du ringer rätt kund först.",
      dash_ag4_t: "Uppföljning",
      dash_ag4_d: "Påminnelser och nästa steg skapas automatiskt — du behöver inte hålla reda på vem som väntar på svar.",
      dash_badge_live: "LIVE PÅ SAJTEN",
      dash_badge_delivery: "I KUNDLEVERANS",
      dash_roi_hours: "Admin-timmar per vecka",
      dash_roi_rate: "Ditt timvärde (kr)",
      dash_roi_result_label: "Tid du inte fakturerar, per år",
      dash_roi_week_label: "Varje vecka utan system",
      dash_roi_note: "Ett system som det här betalar ofta sig själv första månaden. Vi bygger på veckor — inte månader. Du äger allt från dag ett.",
      dash_cta_book: "Boka 15 min med Joakim",
      dash_cta_talk: "eller prata med Alex →",
      dash_cta_free: "Kostnadsfritt · ärlig bedömning · inga bindningar",
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
