# Tickets V05-V09 (v2): Tvåspråkig Alex med Alexis-baserad konfiguration

**Datum:** 2026-05-09
**Sprint:** Pre-launch sprint 2
**Total uppskattad tid:** 5-8 timmar

## User Story

> Som besökare på skylandai.se vill jag kunna få ett snabbt, naturligt och hjälpsamt röstsamtal med en AI-agent som förstår min bransch och mitt problem, ger mig konkret värde, och låter mig boka ett uppföljningsmöte eller bara få mejl-uppföljning — utan att jag tvingas igenom en pushig säljpitch. Jag vill att samtalet känns mänskligt och responsivt, inte robotaktigt.

## Översikt

Implementering av tvåspråkig voice-agent (svensk Alex + engelsk Alex) baserad på reverse-engineering av ElevenLabs egen Alexis-agent. Inkluderar Alexis-rekommenderade konfiguration: Gemini 2.5 Flash som LLM, eleven_flash_v2_5 som TTS-modell, sex-block-strukturerade prompts, Eager turn-taking, samt språkdetektering, språkväljare och konversationsstartare i Flux-modulen.

**Beroenden:**
- TICKET-V05 → TICKET-V06 (prompts måste vara på plats innan agenter kan konfigureras)
- TICKET-V06 → TICKET-V07 (agent_ids behövs för frontend-routing)
- TICKET-V07 → TICKET-V08 (språkdetektering måste finnas innan startare kan koppla rätt agent)
- TICKET-V08 → TICKET-V09 (allt måste vara byggt innan tester kan köras)

**Princip:** En ticket åt gången. Verifiering INNAN nästa ticket startas. Stoppa och fråga Joakim vid oklarheter.

---

## TICKET-V05: Spara prompts i repo

**Status:** Joakim har godkänt prompts.

**Källfiler:**
- `/mnt/user-data/outputs/alex-prompt-svensk-v6.md`
- `/mnt/user-data/outputs/alex-prompt-english-v2.md`

**Uppdrag:**
1. Hämta båda filerna från outputs-katalogen
2. Spara i repo:t på `/docs/prompts/`:
   - `alex-prompt-svensk-v6.md`
   - `alex-prompt-english-v2.md`
3. Commit med meddelande: "docs: add Alex prompts v6 (sv) and v2 (en) — six-block structure based on Alexis"

**Verifiering:**
- Båda filer finns i repo
- Filerna innehåller exakt det Joakim godkänt (ingen redigering)
- Svenska prompten har svenska tecken (å/ä/ö) intakta

**Tid:** 5 minuter

---

## TICKET-V06: Konfigurera båda ElevenLabs-agenter

**Förkrav:** TICKET-V05 klar.

### Befintliga agent_ids:
- Engelsk Alex: `TDgRNcUoUC1GHVKK0bHH`
- Svensk Alex: `agent_8701kr69134ge7gvh3a6tcmkhq95`

### Steg 1: Backup nuvarande konfiguration

Hämta hela konfigurationen för båda agenter via ElevenLabs MCP. Spara i repo:t som:
- `/docs/backups/alex-en-backup-2026-05-09.json`
- `/docs/backups/alex-sv-backup-2026-05-09.json`

### Steg 2: Uppdatera engelska Alex (TDgRNcUoUC1GHVKK0bHH)

Konfigurera via MCP enligt följande spec:

**System prompt:** hela innehållet från `/docs/prompts/alex-prompt-english-v2.md`, från `# System Prompt: Alex` och nedåt (utan rubriken "# Alex System Prompt — English v2 (Six-Block Structure)" som är meta-info).

**First message:** `"Welcome to Skyland. What can I help you with today?"`

**Language:** English

**LLM:**
- Model: Gemini 2.5 Flash (om tillgängligt — annars Gemini 2.0 Flash som fallback)
- Temperature: 0.3
- LLM cascade: enabled (Alexis-rekommendation)

**Voice settings:**
- Voice: kvinnlig engelsk röst (Joakim har redan vald — verifiera voice_id i nuvarande konfiguration)
- Model: `eleven_flash_v2_5`
- Stability: 0.45
- Similarity boost: 0.75
- Speed: 1.0

**Text normalisation:** `elevenlabs` (post-LLM normaliserare)

**Conversation flow:**
- Turn timeout: 7 sekunder
- Soft timeout: 3.0 sekunder med default filler
- Interruptions: enabled
- Turn eagerness: Eager

**Set timezone:** Europe/Stockholm

**Tools:** verifiera att alla 6 är kopplade:
- `get_current_time`
- `book_meeting`
- `get_available_slots`
- `query_knowledge_base`
- `end_call` (system)
- `language_detection` (system)

### Steg 3: Uppdatera svenska Alex (agent_8701kr69134ge7gvh3a6tcmkhq95)

Samma config som engelska Alex förutom:

**System prompt:** hela innehållet från `/docs/prompts/alex-prompt-svensk-v6.md`, från `# System Prompt: Alex` och nedåt.

**First message:** `"Välkommen till Skyland. Vad kan jag hjälpa dig med idag?"`

**Language:** Swedish

**Voice:** kvinnlig svensk röst (verifiera voice_id i nuvarande konfiguration)

Alla andra inställningar identiska med engelska.

### Steg 4: Verifiering via readback

Läs tillbaka båda agenterna från ElevenLabs och visa Joakim:
- Båda agent_ids
- Att system prompts börjar med "# System Prompt: Alex" (visa första 200 tecken av varje)
- Att svenska tecken (å/ä/ö) ser korrekta ut i svenska prompten
- Att alla 6 tools är kopplade
- Att LLM, voice, conversation flow är korrekt konfigurerade
- Att timezone är satt
- First message stämmer

### Stoppkriterier:
- Om Gemini 2.5 Flash inte är tillgängligt, stoppa och fråga Joakim om Gemini 2.0 Flash är OK
- Om en tool saknas: stoppa, fråga
- Om svenska tecken ser fel ut: stoppa, fixa encoding
- Om någon nuvarande inställning skulle gå förlorad genom uppdatering (t.ex. en custom inställning): stoppa, fråga

**Output:**
- Båda agenter funktionella med Alexis-baserad konfiguration
- Backup-filer i repo

**Tid:** 45-60 minuter

---

## TICKET-V07: Frontend-språkdetektering och språkväljare

**Förkrav:** TICKET-V06 klar med båda agent_ids verifierade.

### Steg 1: Skapa språkdetekteringsmodul

Skapa fil `/app/lang.js`:

```javascript
// Språkprioritering vid sidladdning:
// 1. localStorage 'skyland_lang' om satt
// 2. URL-parameter ?lang=sv eller ?lang=en
// 3. navigator.language (sv/sv-SE → sv, allt annat → en)
// 4. Default: sv

// Funktioner:
// - getCurrentLang() returns 'sv' | 'en'
// - setLang(lang) sets localStorage and triggers re-render
// - getAgentId() returns rätt agent_id baserat på språk
```

### Steg 2: Lägg till språkväljare i top-bar

I `/app/index.html` eller motsvarande header-sektion:
- Två tydliga knappar: "SV" / "EN"
- Aktivt språk highlightad
- Klick på inaktivt språk: anropa `setLang()`, ladda om sidan eller re-rendera relevanta moduler

### Steg 3: Uppdatera i18n-systemet

Befintlig `/app/i18n.js` ska:
- Läsa språk från `lang.js` istället för egen detektering
- Ladda korrekt språkfil för UI-text
- Uppdatera när språk ändras

### Steg 4: Konfigurera agent-mappning

I `lang.js` eller separat config:
```javascript
const AGENT_IDS = {
  sv: 'agent_8701kr69134ge7gvh3a6tcmkhq95',
  en: 'TDgRNcUoUC1GHVKK0bHH'
};
```

### Steg 5: Verifiering

- Öppna sajten med rensat localStorage
- Verifiera att språkdetektering ger förväntat resultat (svensk webbläsare → svenska, engelsk → engelska)
- Klicka på SV/EN-knappar och verifiera att språk byts och persisterar i localStorage
- Öppna sajten med ?lang=en — verifiera att engelsk laddas
- Öppna sajten igen utan parameter — verifiera att senaste val (engelska) kommer ihåg

### Stoppkriterier:
- Om i18n-systemet redan har språkdetektering som krockar med det nya: stoppa, visa Joakim, diskutera lösning
- Om rendering går sönder vid språkbyte: stoppa, fixa innan vidare

**Output:**
- `/app/lang.js` skapad och fungerande
- Språkväljare synlig i top-bar
- LocalStorage persistens fungerar
- Agent-mappning konfigurerad

**Tid:** 1-2 timmar

---

## TICKET-V08: Konversationsstartare i Flux-modulen

**Förkrav:** TICKET-V07 klar.

### Steg 1: Lägg till UI-knappar i Flux-modulen

I Flux-modulen (`/app/index.html` Flux-sektion + `/app/voice.js`):

Visa fyra knappar INNAN voice call startas:

**Svensk version:**
1. "Vad kan ni hjälpa mig med?"
2. "Hur mycket kostar det?"
3. "Hur fungerar processen?"
4. "Vilka företag har ni jobbat med?"

**Engelsk version:**
1. "What can you help me with?"
2. "How much does it cost?"
3. "How does the process work?"
4. "Which companies have you worked with?"

UI-design: hålls i linje med befintlig Flux-glassmorphism-stil. Knapparna ska se klickbara ut, inte som dekorativa element.

Plus en separat knapp/länk: "Eller starta vanlig konversation →" / "Or start a regular conversation →"

### Steg 2: Implementera klick-logik

När besökaren klickar på en starter:
1. Hämta starter-textens språk-version baserat på `getCurrentLang()`
2. Starta voice session med korrekt agent_id (`getAgentId()`)
3. Skicka starter-texten som conversation override till ElevenLabs SDK

**Teknisk detalj:**
ElevenLabs SDK har två möjliga metoder:
- A) `overrides.agent.first_message` — överskriver Alex första hälsning med starter-frågan från användarens perspektiv
- B) Skicka starter-texten som första user-message efter att session startat

Variant A är cleaner. Verifiera vilket som funkar med befintlig SDK-version.

**OBS:** Alex prompt har redan "Variant 1" och "Variant 2" av konversationsstart. När en starter triggas ska Variant 1-flödet aktiveras automatiskt eftersom kontexten passas in.

### Steg 3: Hantera "vanlig konversation"-knappen

Klick på den knappen → starta voice session utan starter-injection. Alex använder då Variant 2 av sin konversationsstart ("Välkommen till Skyland. Vad kan jag hjälpa dig med idag?").

### Steg 4: Verifiering (utan voice tests än)

- Visa Joakim screenshot eller live-demo av Flux-modulen med knapparna synliga
- Verifiera att svensk version visar svenska starters
- Byt till engelska, verifiera att engelska starters visas
- Klicka på en starter och verifiera (i browser console eller dev tools) att rätt agent_id används och rätt context skickas

### Stoppkriterier:
- Om ElevenLabs SDK inte stöder starter-injection: stoppa, visa Joakim, diskutera fallback
- Om Flux-modulens befintliga voice-flöde är hårdkodat mot gammal Dana agent_id: stoppa, refaktorera

**Output:**
- Knappar synliga i Flux-modulen på båda språken
- Klick triggar voice session med rätt agent + rätt context
- Befintlig "vanlig konversation"-väg fortfarande fungerar

**Tid:** 2-3 timmar

---

## TICKET-V09: End-to-end voice tests

**Förkrav:** TICKET-V05 till V08 klara.

### Uppdrag:

Kör 8 voice tests totalt — 4 svenska + 4 engelska. Joakim utför testerna manuellt på `localhost:8080/#flux`. Agenten dokumenterar resultat.

### Svenska tester (med svensk version av sajten)

**Test 1: Klick på "Vad kan ni hjälpa mig med?"**
- Förväntat: Alex öppnar med Variant 1: "Välkommen till Skyland. Jag förstår att du är intresserad av [vad vi kan hjälpa med]. Är det okej om jag ställer ett par korta frågor först..."
- Verifiera: namn fångas, tre kärnfrågor ställs, query_knowledge_base anropas, värdepresentation följer 10/90 (en lösning åt gången), exit-väg erbjuds

**Test 2: Klick på "Hur mycket kostar det?"**
- Förväntat: Alex bekräftar prisintresse, anropar query_knowledge_base, refererar till spannbaserade priser från KB
- Verifiera: inga påhittade siffror, ärligt om vad priserna beror på, naturliga disfluenser ("alltså", "typ")

**Test 3: Klick på "Hur fungerar processen?"**
- Förväntat: Alex anropar KB, refererar till onboarding-sektionen och process-sektionen
- Verifiera: konkret beskrivning, max 3 meningar per yttrande, varierade formuleringar

**Test 4: "Vanlig konversation" (utan starter)**
- Säg manuellt: "Hej, jag driver en frisörsalong och tappar bokningar"
- Förväntat: Alex använder Variant 2-öppning, ställer kärnfrågor, hittar frisör-content
- Verifiera: branschspecifik content från KB, ingen påhittad case study

### Engelska tester (med engelsk version av sajten)

**Test 5: Klick på "How much does it cost?"**
- Förväntat: Engelsk Alex svarar på engelska, refererar till priser
- Verifiera: naturliga engelska disfluenser ("actually", "so", "you know")

**Test 6: Klick på "Which companies have you worked with?"**
- Förväntat: Alex refererar till de fyra riktiga case studies (Cold Experience, MarinMekaniker, Hasselblads Livs, Norra Hamnens Bilskola). Hittar inte på andra.
- Verifiera: ärlig om att vissa branscher saknar färdiga case

**Test 7: "Regular conversation" — engelska**
- Säg: "Hi, I run a small e-commerce store with 3 employees."
- Förväntat: Engelsk Alex använder Variant 2, ställer kärnfrågor på engelska, hittar e-commerce-content

**Test 8: Bokningstest (svenska)**
- Säg igenom hela flödet: kärnfrågor → värde → "ja jag vill boka"
- Förväntat: Alex anropar get_current_time, frågar om preferens, anropar get_available_slots, föreslår två tider, anropar book_meeting när tid bestäms

### Rapport per test:

För varje test, dokumentera:
- Transcript (kopiera från ElevenLabs dashboard)
- Tool-call logs (vilka anrop gjordes, med vilka queries)
- Subjektiv bedömning (1-5):
  - Tonen (jordnära/casual but professional eller stelt/säljigt?)
  - Naturlighet (disfluenser och variation, eller mekaniskt?)
  - Längd på svar (max 3 meningar eller längre?)
  - Trohet mot prompt (följer flödet eller hoppar över steg?)
  - Latens (kändes svaret snabbt eller långsamt?)
- Eventuella anomalier (hallucination, fel språk, krascher, etc)

### Stoppkriterier:

- Om Alex svarar på fel språk: stoppa, dokumentera, prioritera fix
- Om en bokning misslyckas: stoppa, kontrollera Cal.com tools-konfiguration
- Om query_knowledge_base inte anropas när den borde: stoppa, granska prompt-trigger-logik
- Om hallucination upptäcks (påhittade kundnamn eller siffror): stoppa, lägg till skarpare regler i prompten
- Om svaren är konsekvent för långa (mer än 3 meningar): stoppa, granska tone-sektionen

**Output:**
- Komplett testrapport med transkript och bedömningar
- Lista över identifierade buggar/iterationer (om några)
- Rekommendation: launch-redo eller behöver iteration

**Tid:** 1-2 timmar

---

## Sammanfattning av exekveringsordning

```
TICKET-V05 (5 min) — Spara prompts i repo
    ↓
TICKET-V06 (45-60 min) — Konfigurera båda agenterna i ElevenLabs
    ↓ [STOPP — Joakim verifierar agent-konfiguration via readback]
    ↓
TICKET-V07 (1-2h) — Frontend språkdetektering + väljare
    ↓ [STOPP — Joakim verifierar språkbyte fungerar]
    ↓
TICKET-V08 (2-3h) — Konversationsstartare i Flux-modulen
    ↓ [STOPP — Joakim verifierar UI och rätt routing]
    ↓
TICKET-V09 (1-2h) — End-to-end voice tests
    ↓ [STOPP — Joakim läser testrapport, beslutar om launch-redo]
```

**Total uppskattad tid:** 5-8 timmar effektivt arbete + Joakims granskningstid mellan varje ticket.

**Princip:** En ticket åt gången. Verifiering INNAN nästa ticket startas. Inga genvägar. Säg till Joakim om något är oklart eller om något stoppar — fortsätt inte gissa.

---

## Vad som är annorlunda mot V05-V09 v1

1. **TICKET-V06 helt omarbetad** — agenterna existerar redan, behöver inte skapas. Istället: backup, uppdatera config med Alexis-baserade inställningar (Gemini 2.5 Flash, eleven_flash_v2_5, stability 0.45, etc), verifiera tools, sätt timezone.

2. **Voice settings explicit specificerade** — stability, similarity, speed, model_id. Tidigare lämnades dessa öppna.

3. **Conversation flow specificerat** — turn timeout, soft timeout, interruptions, turn eagerness. Detta är viktigt för att uppnå Alexis-känslan av responsivitet.

4. **LLM-byte explicit** — Gemini 2.5 Flash istället för Qwen3.6 (engelska) och GPT-4o (svenska). Konsekvent över språk, snabbare, ElevenLabs egen rekommendation.

5. **Voice tests inkluderar latens-bedömning** — Alexis känns snabb pga co-located stack. Verifiera att Alex också gör det.
