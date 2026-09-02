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
      hero_desc: "We're all four — and we remove your problems: missed customers, evening admin and leads that never become business. You get the result. We handle the rest.",
      hero_tag: "FEWER MISSED CUSTOMERS · LESS ADMIN · MORE BUSINESS FROM WHAT YOU ALREADY HAVE",

      // Neural
      neural_h1: "Most companies buy AI tools.<br/>Then nothing happens.",
      neural_sub: "The tools sit unused. The team doesn't trust it.<br/>Nobody saved a single hour.",
      neural_box: "We don't sell tools.<br/>We build systems that work.",
      flow_find: "Find it",
      flow_build: "Build it",
      flow_deploy: "Deploy it",
      flow_use: "Use it",
      neural_tag: "THE PROBLEM GOES AWAY. YOU KEEP THE RESULT.",

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
      kontakt_to_system: "Watch your lead card build on The System →",
      nav_hem: "Home",
      nav_tjanster: "Services",
      nav_system: "The System",
      nav_demo: "Demo",
      nav_kontakt: "Contact",
      path1_title: "We run it for you",
      path1_desc: "We take care of what costs you customers and time: calls, leads, website and follow-up. You get the results.",
      path1_cta: "See the services →",
      path2_title: "Your own Skyland system",
      path2_desc: "See what the system actually does: response times, leads, bookings, time saved and ROI — all in a system you own.",
      path2_cta: "See the system →",
      svc_kicker: "SERVICES — PROBLEMS WE REMOVE",
      svc_h1: "You don't need more software.<br/>You need fewer problems.",
      svc_sub: "Four things that cost service businesses money every week — and what happens when they're gone.",
      svc1_t: "Stop losing customers who call",
      svc1_d: "When you can't answer, the customer still gets help right away, day and night. More calls become customers.",
      svc2_t: "Get rid of the repetitive work",
      svc2_d: "Calls, bookings, replies and reminders eat hours every week. We remove it — you get the hours back.",
      svc3_t: "Fill empty capacity",
      svc3_d: "Empty slots cost money. We keep the right customers coming — all the way to a booked meeting. More of your capacity becomes revenue.",
      svc4_t: "Stop leads going cold",
      svc4_d: "A slow reply costs business. Every lead is followed up to an outcome — more of what you already have becomes business.",
      consent_text: "I agree that Skyland AI Solutions processes my personal data in accordance with the <a href=\"/integritetspolicy.html\" id=\"void-privacy-link\" target=\"_blank\" rel=\"noopener\">privacy policy</a>. My message creates a ticket in Skyland's CRM.",
      scan_toggle_show: "Show AI analysis",
      scan_title: "LEAD PROFILE SCAN",
      scan_status: "NODE_ACTIVE",
      ai_response_title: "AUTOMATED AI RESPONSE",
      ai_response_body: "Hello Alex, thanks for reaching out. Based on your profile at TechFlow, we recommend starting with the Neural module for your automated fleet integration...",
            sector_value: "AI Automation",

      // Flux intro (live demo copy)
      flux_kicker: "LIVE DEMO — VOICE AGENT",
      flux_video_cta: "Watch Alex introduce herself",
      flux_h1: "The customer calls.<br/>You can't answer.",
      flux_desc: "You're working, driving or asleep. The customer wants an answer now — or they call the next company. Alex answers right away and books a meeting. Try it yourself: tap the orb and talk to her.",
      flux_how: "Click the orb or pick a question below. Your browser will ask for microphone access.",

      // Void intro (smart form copy)
      void_kicker: "CONTACT & BOOKING",
      void_video_cta: "Watch Alex explain the form",
      void_h2: "What problem would you like gone?",
      void_sub: "Tell us what's costing you time or money — too few customers, too much admin, leads that disappear. You get a first answer right away, and an honest assessment of what you'd gain by solving it.",
      void_hint: "Describe your business and what eats your time.",

      // Dashboard (visitor-facing SCC view)
      dash_kicker: "THE SKYLAND SYSTEM — YOUR OWN COMMAND CENTER",
      dash_h1: "See what you're getting back. Live.",
      dash_desc: "This is your session, live — the same dashboard we run our clients' systems on. Talk to Alex or use the form and watch leads, replies, bookings and ROI happen in real time. The technology stays in the background. The result is right here.",
      dash_card_title: "YOUR LEAD CARD",
      dash_timeline_title: "EVENTS",
      dash_empty: "No lead card yet. Try the voice agent or the form and watch the card build itself here — in real time.",
      dash_empty_voice: "Talk to Alex",
      dash_empty_form: "Fill out the form",
      dash_ev_form: "Form received — AI answered instantly",
      dash_ev_voice: "Voice conversation with Alex",
      dash_more: "Show the full answer",
      dash_less: "Show less",
      dash_continue: "Continue the conversation with Alex",
      dash_score: "LEAD SCORE",
      dash_what_title: "As a customer, you get the same thing:",
      dash_what_1: "Every lead in one place — forms, voice calls, email",
      dash_what_2: "AI responses and call summaries logged per customer",
      dash_what_3: "Automatic scoring and prioritization, no manual triage",
      dash_ai_label: "AI RESPONSE SENT",
            dash_summary_label: "CALL SUMMARY",
      dash_desc_short: "This is your session, live. Talk to Alex or use the form and watch it happen here in real time: leads, replies, bookings, ROI. The same system our clients use.",
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
      dash_ag4_d: "Reminders and next steps created automatically — nothing falls through the cracks.",
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
      hero_desc: "Vi är alla fyra — och vi tar bort dina problem: missade kunder, kvällsadmin och leads som aldrig blir affär. Du får resultatet. Vi sköter resten.",
      hero_tag: "FÄRRE MISSADE KUNDER · MINDRE ADMIN · MER AFFÄR UR DET DU REDAN HAR",

      // Neural
      neural_h1: "De flesta företag köper AI-verktyg.<br/>Sen händer ingenting.",
      neural_sub: "Verktygen ligger oanvända. Teamet litar inte på det.<br/>Ingen sparade en enda timme.",
      neural_box: "Vi säljer inte verktyg.<br/>Vi bygger system som fungerar.",
      flow_find: "Hitta",
      flow_build: "Bygg",
      flow_deploy: "Driftsätt",
      flow_use: "Använd",
      neural_tag: "PROBLEMET FÖRSVINNER. DU BEHÅLLER RESULTATET.",

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
      path1_desc: "Vi tar hand om det som kostar kunder och tid: samtal, leads, hemsida och uppföljning. Du får resultaten.",
      path1_cta: "Se tjänsterna →",
      path2_title: "Ditt eget Skyland-system",
      path2_desc: "Se vad systemet faktiskt gör: svarstider, leads, bokningar, sparad tid och ROI — samlat i ett system du äger.",
      path2_cta: "Se systemet →",
      svc_kicker: "TJÄNSTER — PROBLEM VI TAR BORT",
      svc_h1: "Du behöver inte fler verktyg.<br/>Du behöver färre problem.",
      svc_sub: "Fyra saker som kostar tjänsteföretag pengar varje vecka — och vad som händer när de försvinner.",
      svc1_t: "Sluta tappa kunder som ringer",
      svc1_d: "När du inte kan svara får kunden ändå hjälp direkt, dygnet runt. Fler samtal blir kunder.",
      svc2_t: "Få bort det repetitiva",
      svc2_d: "Samtal, bokningar, svar och påminnelser äter timmar varje vecka. Vi tar bort det — du får timmarna tillbaka.",
      svc3_t: "Fyll tom kapacitet",
      svc3_d: "Tomma tider kostar pengar varje vecka. Vi fyller på med rätt kunder — hela vägen till bokat möte. Mer av din kapacitet blir intäkt.",
      svc4_t: "Låt inga leads kallna",
      svc4_d: "Ett sent svar kostar affärer. Varje lead följs upp tills det har ett utfall — mer av det du redan har blir affär.",
      consent_text: "Jag godkänner att Skyland AI Solutions behandlar mina personuppgifter enligt <a href=\"/integritetspolicy.html\" id=\"void-privacy-link\" target=\"_blank\" rel=\"noopener\">integritetspolicyn</a>. Mitt meddelande skapar ett ärende i Skylands CRM.",
      scan_toggle_show: "Visa AI-analys",
      scan_title: "LEAD-PROFILSKANNING",
      scan_status: "NOD_AKTIV",
      ai_response_title: "AUTOMATISKT AI-SVAR",
      ai_response_body: "Hej Alex, tack för att du hörde av dig. Baserat på din profil på TechFlow rekommenderar vi att börja med Neural-modulen för er automatiserade flotteintegration...",
            sector_value: "AI-automatisering",

      // Flux intro (live demo copy)
      flux_kicker: "LIVE DEMO — RÖSTAGENT",
      flux_video_cta: "Se Alex presentera sig",
      flux_h1: "Kunden ringer.<br/>Du kan inte svara.",
      flux_desc: "Du jobbar, kör bil eller sover. Kunden vill ha svar nu — annars ringer de vidare. Alex svarar direkt och bokar möte. Prova själv: tryck på orben och prata med henne.",
      flux_how: "Klicka på orben eller välj en fråga nedan. Webbläsaren ber om mikrofonåtkomst.",

      // Void intro (smart form copy)
      void_kicker: "KONTAKT & BOKA",
      void_video_cta: "Se Alex förklara formuläret",
      void_h2: "Vilket problem vill du bli av med?",
      void_sub: "Skriv vad som kostar dig tid eller pengar — för få kunder, för mycket admin, leads som försvinner. Du får ett första svar direkt och en ärlig bedömning av vad du kan vinna på att lösa det.",
      void_hint: "Beskriv din verksamhet och vad som tar mest tid.",

      // Dashboard (visitor-facing SCC view)
      dash_kicker: "SKYLAND-SYSTEMET — DITT EGET COMMAND CENTER",
      dash_h1: "Se vad du får tillbaka. Live.",
      dash_desc: "Det här är din session, live — samma dashboard vi driver våra kunders system med. Prata med Alex eller använd formuläret och se leads, svar, bokningar och ROI hända i realtid. Tekniken finns i bakgrunden. Resultatet finns här.",
      dash_card_title: "DITT LEAD-KORT",
      dash_timeline_title: "HÄNDELSER",
      dash_empty: "Inget lead-kort än. Testa röstagenten eller formuläret och se kortet byggas här — i realtid.",
      dash_empty_voice: "Prata med Alex",
      dash_empty_form: "Fyll i formuläret",
      dash_ev_form: "Formulär mottaget — AI svarade direkt",
      dash_ev_voice: "Röstsamtal med Alex",
      dash_more: "Visa hela svaret",
      dash_less: "Visa mindre",
      dash_continue: "Fortsätt konversationen med Alex",
      dash_score: "LEAD SCORE",
      dash_what_title: "Som kund får du samma sak:",
      dash_what_1: "Alla leads på ett ställe — formulär, röstsamtal, mejl",
      dash_what_2: "AI-svar och samtalssammanfattningar loggade per kund",
      dash_what_3: "Automatisk score och prioritering, ingen manuell sortering",
      dash_ai_label: "AI-SVAR SKICKAT",
            dash_summary_label: "SAMTALSSAMMANFATTNING",
      dash_desc_short: "Det här är din session, live. Prata med Alex eller använd formuläret och se det hända här i realtid: leads, svar, bokningar, ROI. Samma system som våra kunder använder.",
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
      dash_ag4_d: "Påminnelser och nästa steg skapas automatiskt — inget faller mellan stolarna.",
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
