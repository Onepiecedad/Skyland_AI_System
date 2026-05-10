# AGENT INSTRUCTION: TICKET-V04 — Frontend Wire-Up for Void Module

## Sammanhang

V03 är live och verifierad. Webhooken `https://onepiecedad.app.n8n.cloud/webhook/void-submission` accepterar formulärinlämningar, skapar leads i Supabase, genererar AI-svar via GPT-4o-mini med RAG-context, och returnerar svaret inom 5 sekunder.

Det som återstår är att Void-modulen på frontend faktiskt anropar denna webhook, hanterar svaret, och visar AI-responsen för besökaren på ett sätt som matchar Skylands estetik och tonen som POV.md beskriver.

Detta är den sista pusselbiten innan Void-modulen är launchable.

## Din uppgift

Wira `/app/index.html`-formuläret i Void-sektionen mot V03-webhooken. Implementera lifecycle states (idle → submitting → success → error), visa AI-svaret inline i den befintliga AUTOMATED AI RESPONSE-panelen, och säkerställ att GDPR-consent är obligatoriskt innan submit aktiveras.

Allt sker inom samma vy — ingen redirect, ingen popup, ingen "thank you"-sida. Besökaren ska se sitt eget ärende processas i realtid.

## Sammanhang du behöver först

Läs dessa filer i ordning innan du börjar:

1. `/AGENT.md` — beteendekontrakt
2. `/skyland-pod.md` — arkitektur, sektion 4 (Void-modulen specifikt)
3. `/skyland-pov.md` — ton och designprinciper
4. `/app/index.html` — befintlig Void-sektion
5. `/app/styles.css` — befintliga design tokens (glassmorphism, voice states)
6. `/app/session.js` — hur du hämtar session_uuid
7. `/app/api.js` — befintlig fetch wrapper-mönster
8. `/n8n/workflows/void-submission.json` — V03 input/output kontrakt
9. `/scripts/test_v03_results.md` — exempel på riktigt AI-svar för referens

## Kontrakt mot V03

**URL:** `https://onepiecedad.app.n8n.cloud/webhook/void-submission`
**Method:** POST
**Headers:** `Content-Type: application/json`

**Request payload:**
```json
{
  "session_uuid": "uuid v4 från session.js",
  "name": "string",
  "email": "string",
  "company": "string (kan vara tom)",
  "website": "string (kan vara tom)",
  "phone": "string (kan vara tom)",
  "message": "string",
  "consent_given": true
}
```

**Response success (HTTP 200):**
```json
{
  "status": "success",
  "lead_id": "uuid",
  "ai_response": "Naturligt svenska/engelska svar från GPT-4o-mini",
  "best_match_similarity": 0.5867
}
```

**Response error (HTTP 400):**
```json
{
  "status": "error",
  "error_code": "INVALID_INPUT" | "MISSING_CONSENT" | "INTERNAL_ERROR",
  "message": "string"
}
```

## Steg 1: Skapa /app/void.js

Isolera Void-logik från resten av appen i en egen modul, samma mönster som `voice.js`.

```javascript
/**
 * Void module — formulärinlämning med inline AI-svar.
 * Kontraktet mot V03: /n8n/workflows/void-submission.json
 */

const VOID_WEBHOOK_URL = 'https://onepiecedad.app.n8n.cloud/webhook/void-submission';

const STATES = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
};

const ERROR_MESSAGES = {
  INVALID_INPUT: 'Något i formuläret behöver justeras. Kolla att alla fält är ifyllda korrekt.',
  MISSING_CONSENT: 'Du behöver godkänna att vi behandlar dina uppgifter innan vi kan ta emot meddelandet.',
  INTERNAL_ERROR: 'Något krånglade hos oss. Försök igen om en stund eller skicka direkt till joakim@skylandai.se.',
  NETWORK: 'Kunde inte nå servern. Kolla din anslutning och försök igen.',
  TIMEOUT: 'Det tog längre tid än väntat. Joakim får ditt meddelande ändå — vi återkommer inom kort.',
};

// State management, form submission, UI updates
// Implementera enligt steg nedan

export const VoidForm = {
  init(formElement, responseContainer) { /* implement */ },
  getState() { /* implement */ },
};
```

## Steg 2: Uppdatera Void-sektionen i index.html

Den befintliga Void-sektionen i `/app/index.html` har redan formulär-strukturen från Stitch-export. Identifiera:

- Form-elementet (eventuellt med id eller specifik klass)
- Input-fälten: NAME, EMAIL, COMPANY, WEBSITE, PHONE, PAYLOAD [MESSAGE]
- TRANSMIT-knappen
- Den högra panelen med AUTOMATED AI RESPONSE-rubrik (där svaret ska visas)
- LEAD PROFILE SCAN-panelen (visar input-data efter submit som sammanfattning)

Lägg till två element som saknas:

**1. GDPR consent-checkbox** ovanför TRANSMIT-knappen:

```html
<label class="void-consent">
  <input type="checkbox" id="void-consent" required>
  <span>
    Jag godkänner att Skyland AI Solutions behandlar mina personuppgifter 
    enligt <a href="#" id="void-privacy-link">integritetspolicyn</a>. 
    Mitt meddelande skapar ett ärende i Skylands CRM.
  </span>
</label>
```

**2. AI Response-container** med initialt tomt state:

Den AUTOMATED AI RESPONSE-panelen har troligen en placeholder-text just nu. Säkerställ att den har ett id eller klass som void.js kan uppdatera, exempelvis:

```html
<div class="void-ai-response" id="void-ai-response" data-state="idle">
  <p class="void-placeholder">Inväntar inkommande transmission...</p>
</div>
```

## Steg 3: Implementera form-submission i void.js

```javascript
async function handleSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  // Validera consent
  const consentBox = document.getElementById('void-consent');
  if (!consentBox.checked) {
    setState(STATES.ERROR, ERROR_MESSAGES.MISSING_CONSENT);
    return;
  }
  
  // Validera obligatoriska fält klient-side innan POST
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const message = formData.get('message')?.trim();
  
  if (!name || name.length < 2) {
    setState(STATES.ERROR, 'Namn behöver vara minst 2 tecken.');
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setState(STATES.ERROR, 'E-post ser inte rätt ut.');
    return;
  }
  if (!message || message.length < 10) {
    setState(STATES.ERROR, 'Meddelandet behöver vara minst 10 tecken så vi förstår vad det gäller.');
    return;
  }
  
  setState(STATES.SUBMITTING);
  
  const payload = {
    session_uuid: getSessionUUID(), // från session.js
    name: name,
    email: email,
    company: formData.get('company')?.trim() || '',
    website: formData.get('website')?.trim() || '',
    phone: formData.get('phone')?.trim() || '',
    message: message,
    consent_given: true,
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(VOID_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (data.status === 'success') {
      setState(STATES.SUCCESS, data.ai_response);
      updateLeadProfileScan(payload);
    } else {
      const errorMessage = ERROR_MESSAGES[data.error_code] || data.message || ERROR_MESSAGES.INTERNAL_ERROR;
      setState(STATES.ERROR, errorMessage);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      setState(STATES.ERROR, ERROR_MESSAGES.TIMEOUT);
    } else {
      setState(STATES.ERROR, ERROR_MESSAGES.NETWORK);
    }
  }
}
```

## Steg 4: UI States och visning av AI-svar

```javascript
function setState(state, content = null) {
  const container = document.getElementById('void-ai-response');
  const submitBtn = document.querySelector('.void-submit, [data-action="transmit"]');
  
  container.dataset.state = state;
  
  switch (state) {
    case STATES.IDLE:
      container.innerHTML = '<p class="void-placeholder">Inväntar inkommande transmission...</p>';
      submitBtn.disabled = false;
      submitBtn.textContent = 'TRANSMIT';
      break;
      
    case STATES.SUBMITTING:
      container.innerHTML = `
        <div class="void-processing">
          <div class="void-pulse"></div>
          <p>Analyserar...</p>
          <p class="void-substep">Skapar lead-profil</p>
          <p class="void-substep">Söker i kunskapsbas</p>
          <p class="void-substep">Genererar svar</p>
        </div>
      `;
      submitBtn.disabled = true;
      submitBtn.textContent = 'PROCESSING...';
      animateSubsteps();
      break;
      
    case STATES.SUCCESS:
      container.innerHTML = `
        <div class="void-ai-response-content">
          <div class="void-response-header">AUTOMATED AI RESPONSE</div>
          <p class="void-response-text">${escapeHtml(content)}</p>
          <div class="void-response-meta">Ärendet är registrerat. Joakim återkommer personligen inom kort.</div>
        </div>
      `;
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMITTED';
      break;
      
    case STATES.ERROR:
      container.innerHTML = `
        <div class="void-error">
          <p class="void-error-text">${escapeHtml(content)}</p>
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'TRANSMIT';
      break;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function animateSubsteps() {
  const substeps = document.querySelectorAll('.void-substep');
  substeps.forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), i * 1200);
  });
}
```

## Steg 5: Uppdatera LEAD PROFILE SCAN-panelen

När formuläret submittas ska den högra panelen visa det inskickade datat som "scanning result". Detta är inte bara dekoration — det är besökarens upplevelse av att deras data registreras i systemet.

```javascript
function updateLeadProfileScan(payload) {
  const scanPanel = document.querySelector('.void-lead-profile, [data-section="lead-scan"]');
  if (!scanPanel) return;
  
  scanPanel.dataset.state = 'active';
  
  const fields = scanPanel.querySelectorAll('[data-field]');
  fields.forEach(field => {
    const key = field.dataset.field;
    const value = payload[key];
    if (value) {
      field.textContent = value;
      field.classList.add('void-field-populated');
    }
  });
}
```

Identifiera vilka fält som finns i den befintliga Lead Profile Scan-panelen och säkerställ att de har `data-field`-attribut som matchar payload-nycklarna (`name`, `email`, `company`, `website`, `phone`).

## Steg 6: Lägg till CSS-states i styles.css

Behåll Skylands HUD-estetik. Använd befintliga design tokens där möjligt.

```css
/* Void form states */
.void-consent {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin: 1rem 0;
  font-size: 0.85rem;
  color: var(--text-secondary, #aaa);
}

.void-consent input[type="checkbox"] {
  margin-top: 0.25rem;
}

.void-consent a {
  color: var(--accent-green, #4ade80);
  text-decoration: underline;
}

/* AI response states */
.void-ai-response {
  min-height: 200px;
  padding: 1.5rem;
  /* Behåll befintlig glassmorphism från Stitch-export */
}

.void-ai-response[data-state="idle"] .void-placeholder {
  color: var(--text-muted, #666);
  font-style: italic;
}

.void-ai-response[data-state="submitting"] .void-processing {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.void-pulse {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent-green, #4ade80);
  animation: void-pulse 1.2s ease-in-out infinite;
}

@keyframes void-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.void-substep {
  opacity: 0.3;
  font-size: 0.85rem;
  color: var(--text-secondary, #aaa);
  transition: opacity 0.4s;
}

.void-substep.active {
  opacity: 1;
  color: var(--accent-green, #4ade80);
}

.void-ai-response[data-state="success"] .void-response-text {
  color: var(--text-primary, #fff);
  line-height: 1.6;
  white-space: pre-wrap;
}

.void-response-meta {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted, #666);
  font-style: italic;
}

.void-ai-response[data-state="error"] .void-error-text {
  color: var(--accent-red, #ef4444);
}

.void-field-populated {
  color: var(--accent-green, #4ade80);
}

.void-lead-profile[data-state="active"] {
  /* Subtle glow eller annan indikation */
}
```

Justera färgvariabler om Skyland använder andra namn — håll dig till befintligt design system.

## Steg 7: Wire upp i app.js

I `/app/app.js`, när Void-modulen blir aktiv (via navigation eller scroll), initialisera VoidForm.

```javascript
import { VoidForm } from './void.js';

// Inom routing-logiken eller DOMContentLoaded
const voidForm = document.querySelector('#void-form, form[data-module="void"]');
const voidResponse = document.querySelector('#void-ai-response');
if (voidForm && voidResponse) {
  VoidForm.init(voidForm, voidResponse);
}
```

## Hard Constraints

- Skyland-tonen måste bevaras. Inga emojis i UI-text. Ingen marketing-copy. Inga "Tack för ditt meddelande, vi älskar att höra från dig"-fraser.
- Consent-checkboxen är obligatorisk. TRANSMIT-knappen ska vara disabled tills den är checkad.
- AI-svaret visas inline. Ingen popup, ingen redirect, ingen ny vy.
- Loading-state är synligt och informativt. Besökare ska se att något händer.
- Errors är ärliga och hjälpsamma. "Något krånglade" är OK. "Oops!" är inte OK.
- HTML-escaping av AI-svaret är obligatoriskt. AI kan teoretiskt returnera content som tolkas som HTML, vilket är XSS-risk.
- Timeout efter 15 sekunder. Längre tid betyder att något är trasigt.
- Inga API-nycklar någonstans i frontend.
- Inga tracking-pixlar eller analytics-anrop relaterade till Void-submissions.

## Verifieringssteg

**Test 1: Happy path (browser)**
- Öppna sajten i browser, navigera till Void
- Fyll i alla fält med riktig testdata
- Checka consent
- Klicka TRANSMIT
- Förväntat: loading state visas i 2-5 sekunder, AI-svar visas inline, Lead Profile Scan visar inskickad data

**Test 2: Saknad consent**
- Fyll i formuläret men checka inte consent
- Klicka TRANSMIT
- Förväntat: error-meddelande om consent, ingen webhook-anrop

**Test 3: Klient-side validation**
- Försök submit med tomma obligatoriska fält
- Försök med invalid email
- Förväntat: lokala felmeddelanden, ingen webhook-anrop

**Test 4: Backend-error handling**
- Submitta med valid data men där webhooken returnerar 400
- Förväntat: vänligt felmeddelande, formuläret är fortfarande ifyllt och submit-knappen återgår till idle

**Test 5: Network failure simulation**
- Stäng av internet eller blockera webhook-URL i DevTools Network tab
- Försök submitta
- Förväntat: nätverksfel-meddelande, ingen krasch

**Test 6: Verifiera Supabase**
- Efter framgångsrik submission, kolla Supabase Table Editor
- Förväntat: ny rad i `prospects` med matchande session_uuid
- Förväntat: ny rad i `interactions` med type='form'

**Test 7: Browser compatibility**
- Testa i Chrome, Safari, Firefox
- Förväntat: identiskt beteende i alla tre

**Test 8: Mobile responsiveness**
- Testa i mobile viewport (DevTools)
- Förväntat: formulär läsbart, knapp tappbar, response visas läsbart

## Definition of Done

- [ ] `/app/void.js` skapad och importerad i app.js
- [ ] Consent-checkbox tillagd i HTML
- [ ] AI Response-container har korrekt struktur och id
- [ ] Lead Profile Scan-panelen uppdateras efter submit
- [ ] Alla 4 UI-states implementerade (idle, submitting, success, error)
- [ ] CSS-states tillagda i styles.css i Skyland-estetik
- [ ] HTML-escaping på AI-svar
- [ ] Klient-side validation före webhook-anrop
- [ ] 15-sekunders timeout på fetch
- [ ] Test 1-6 passerade
- [ ] Test 7 (browser compat) verifierad
- [ ] Test 8 (mobile) verifierad
- [ ] Inga ElevenLabs- eller andra credentials i frontend
- [ ] CHANGELOG.md uppdaterad

## När du är klar

Rapportera:
- Browser-tester med screenshot eller beskrivning av varje state
- Exempel på riktigt AI-svar som visades inline (ren text)
- Total responstid från klick till AI-svar synligt (millisekunder)
- Verifiering att Supabase tog emot data
- Eventuella avvikelser från instruktionen

## När du fastnar

Surface direkt om:
- Befintlig Stitch-exporterad HTML-struktur är annorlunda än antaget
- CSS-variabler i styles.css använder andra namn än `--accent-green` etc — anpassa men dokumentera
- Lead Profile Scan-panelen inte har struktur som matchar mappingen i steg 5
- Webhook returnerar oväntat format (kolla mot V03-kontraktet i workflow JSON)
- Mobile-layouten kräver omfattande omarbetning av befintlig CSS

## Efter V04

Sajten har nu en fungerande Void-modul end-to-end. En riktig besökare kan:
- Fylla i formuläret
- Ge consent
- Få AI-svar inom sekunder
- Se sin data registreras
- Bli en lead i Joakims CRM

Det är launchable. Återstående arbete före production-launch:
- Dana RAG-integration (separat ticket)
- Cal.com booking-tools för Dana (separat ticket)
- GDPR privacy policy-sida (separat ticket)
- Frontend-deployment till Netlify/Vercel med riktig domän (separat ticket)
- Skarp DNS-konfiguration för skylandai.se

Ingen av dessa blockerar V04. När V04 är verifierat kan systemet börja ta emot riktig trafik.
