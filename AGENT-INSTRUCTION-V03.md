# AGENT INSTRUCTION: TICKET-V03 — Lead Processing Workflow

## Sammanhang

V01 (kunskapsbas populerad) och V02 (RAG-retrieval-workflow) är klara och live-verifierade. V03 är hjärtat i Void-modulen — det är där en besökares formulärinlämning blir en riktig lead med ett AI-genererat svar som refererar till Skylands faktiska tjänster.

Detta är första gången Claude Haiku 4.5 anropas i Skyland-systemet. Det betyder också att du verifierar att `ANTHROPIC_API_KEY` är korrekt konfigurerad och att kostnaderna är rimliga.

## Din uppgift

Bygg en n8n-workflow `void-submission` som:

1. Tar emot formulärinlämning via webhook
2. Validerar input
3. Skapar prospect-rad i Supabase
4. Beräknar lead score (regelbaserat)
5. Anropar V02 RAG-workflow med besökarens meddelande
6. Genererar AI-svar med Claude Haiku 4.5 baserat på RAG-context
7. Sparar interaction i Supabase
8. Returnerar AI-svar till frontend

Workflow exporteras som JSON till `/n8n/workflows/void-submission.json`.

## Webhook-kontrakt

**URL:** `https://onepiecedad.app.n8n.cloud/webhook/void-submission`
**Method:** POST

**Input payload:**
```json
{
  "session_uuid": "uuid v4 (required)",
  "name": "string (required)",
  "email": "string (required, valid email)",
  "company": "string (optional)",
  "website": "string (optional)",
  "phone": "string (optional)",
  "message": "string (required, min 10 tecken)",
  "consent_given": "boolean (required, must be true)"
}
```

**Output payload (success):**
```json
{
  "status": "success",
  "lead_id": "uuid",
  "ai_response": "Claude-genererat svar i naturligt svenska",
  "best_match_similarity": 0.55
}
```

**Output payload (error):**
```json
{
  "status": "error",
  "error_code": "INVALID_INPUT" | "MISSING_CONSENT" | "DUPLICATE_SUBMISSION" | "INTERNAL_ERROR",
  "message": "Beskrivning av felet"
}
```

## Workflow-struktur (10 noder)

```
Webhook (POST /void-submission)
    ↓
Validate Input (Function/Code node)
    ↓
[IF validation failed] → Respond Error → END
    ↓
Insert Prospect (Supabase HTTP Request)
    ↓
Calculate Lead Score (Function/Code node)
    ↓
Update Prospect Score (Supabase HTTP Request)
    ↓
Query Knowledge Base (HTTP Request to V02 webhook)
    ↓
Generate AI Response (Anthropic API HTTP Request)
    ↓
Insert Interaction (Supabase HTTP Request)
    ↓
Format Response (Function/Code node)
    ↓
Respond to Webhook
```

## Steg 1: Webhook-nod

Path: `void-submission`
Method: POST
Response Mode: responseNode (vi svarar via Respond to Webhook-noden)

## Steg 2: Validate Input (Code-nod)

JavaScript som validerar:

```javascript
const body = $input.first().json.body;
const errors = [];

// Required fields
if (!body.session_uuid) errors.push("session_uuid required");
if (!body.name || body.name.trim().length < 2) errors.push("name required (min 2 chars)");
if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("valid email required");
if (!body.message || body.message.trim().length < 10) errors.push("message required (min 10 chars)");

// UUID format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
if (body.session_uuid && !uuidRegex.test(body.session_uuid)) {
  errors.push("session_uuid must be valid v4 UUID");
}

// GDPR consent
if (body.consent_given !== true) {
  errors.push("consent_given must be true");
}

if (errors.length > 0) {
  return [{
    json: {
      validation_failed: true,
      error_code: body.consent_given !== true ? "MISSING_CONSENT" : "INVALID_INPUT",
      message: errors.join("; ")
    }
  }];
}

// Pass through validated data
return [{
  json: {
    validation_failed: false,
    session_uuid: body.session_uuid,
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    company: (body.company || "").trim(),
    website: (body.website || "").trim(),
    phone: (body.phone || "").trim(),
    message: body.message.trim(),
    consent_given: true
  }
}];
```

## Steg 3: IF Validation Failed

n8n IF-nod som kollar `{{ $json.validation_failed }}`. Om true → koppla till en Respond Error-nod som returnerar 400 med error_code och message.

## Steg 4: Insert Prospect (Supabase)

HTTP Request-nod:
- Method: POST
- URL: `{{ $env.SUPABASE_URL }}/rest/v1/prospects`
- Headers:
  - `apikey`: `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Authorization`: `Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Content-Type`: `application/json`
  - `Prefer`: `return=representation`
- Body (JSON):
```json
{
  "session_uuid": "{{ $json.session_uuid }}",
  "name": "{{ $json.name }}",
  "email": "{{ $json.email }}",
  "company": "{{ $json.company }}",
  "website": "{{ $json.website }}",
  "phone": "{{ $json.phone }}",
  "message": "{{ $json.message }}",
  "consent_given": true,
  "score": 0
}
```

Output ger tillbaka raden inklusive `id`, som vi använder senare.

## Steg 5: Calculate Lead Score (Code-nod)

Regelbaserad scoring. Transparent och debuggbar.

```javascript
const prospect = $input.first().json[0]; // Supabase returnerar array
const original = $('Validate Input').first().json;

let score = 0;

// Company present
if (original.company && original.company.length > 1) score += 10;

// Website present
if (original.website && original.website.length > 4) score += 10;

// Phone present
if (original.phone && original.phone.length > 5) score += 5;

// Message length signals seriousness
const wordCount = original.message.split(/\s+/).length;
if (wordCount >= 30) score += 15;
else if (wordCount >= 15) score += 10;
else if (wordCount >= 10) score += 5;

// Service mentions in message (case-insensitive)
const msg = original.message.toLowerCase();
const serviceKeywords = ['crm', 'automation', 'voice', 'agent', 'chatbot', 'hemsida', 'integration', 'n8n', 'supabase'];
const matches = serviceKeywords.filter(k => msg.includes(k));
score += matches.length * 5;

// Cap at 100
score = Math.min(score, 100);

return [{
  json: {
    lead_id: prospect.id,
    session_uuid: prospect.session_uuid,
    name: prospect.name,
    email: prospect.email,
    company: prospect.company,
    message: prospect.message,
    score: score
  }
}];
```

## Steg 6: Update Prospect Score (Supabase)

HTTP Request:
- Method: PATCH
- URL: `{{ $env.SUPABASE_URL }}/rest/v1/prospects?id=eq.{{ $json.lead_id }}`
- Headers: samma auth som steg 4
- Body: `{ "score": {{ $json.score }} }`

## Steg 7: Query Knowledge Base (V02)

HTTP Request:
- Method: POST
- URL: `https://onepiecedad.app.n8n.cloud/webhook/rag-query`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "query": "{{ $('Calculate Lead Score').first().json.message }}"
}
```

Output: matches array med top 3 chunks plus best_similarity.

## Steg 8: Generate AI Response (Anthropic)

Detta är det viktigaste steget. HTTP Request:

- Method: POST
- URL: `https://api.anthropic.com/v1/messages`
- Headers:
  - `x-api-key`: `{{ $env.ANTHROPIC_API_KEY }}`
  - `anthropic-version`: `2023-06-01`
  - `Content-Type`: `application/json`
- Body (JSON):

```json
{
  "model": "claude-haiku-4-5",
  "max_tokens": 1024,
  "system": "Du är Joakim Landqvist, grundare av Skyland AI Solutions. Du svarar på en första kontakt från en potentiell kund som lämnat ett meddelande via formuläret på skylandai.se. Skriv ett varmt, konkret svar i andra person som refererar till deras specifika situation.\n\nTon: rakt, jordnära, ingen marketing-fluff. Svenska om personen skrev svenska, engelska om de skrev engelska. Aldrig 'Hej och välkommen!' eller liknande generiska floskler.\n\nDu har tillgång till Skylands kunskapsbas via context nedan. Använd den för att ge KONKRETA svar — referera till specifika tjänster, paket, priser, case studies. Hitta inte på något som inte står i kunskapsbasen.\n\nOm best_similarity är under 0.4: var mer försiktig, erbjud att Joakim återkommer med detaljer.\nOm best_similarity är 0.4-0.5: svara baserat på context men nämn att du gärna går in på detaljer i ett samtal.\nOm best_similarity är över 0.5: svara konfident och konkret baserat på matchat innehåll.\n\nSvar ska vara 100-200 ord. Avsluta alltid med en mjuk uppmaning till nästa steg — antingen ett 15-minuterssamtal eller en specifik fråga som tar dialogen vidare.",
  "messages": [
    {
      "role": "user",
      "content": "Besökarens meddelande:\n\"{{ $('Calculate Lead Score').first().json.message }}\"\n\nNamn: {{ $('Calculate Lead Score').first().json.name }}\nFöretag: {{ $('Calculate Lead Score').first().json.company }}\n\nKunskapsbas-träffar (best_similarity: {{ $('Query Knowledge Base').first().json.best_similarity }}):\n{{ JSON.stringify($('Query Knowledge Base').first().json.matches) }}\n\nGenerera ett naturligt svar enligt instruktionerna. Returnera ENDAST svartexten, ingen meta-kommentar."
    }
  ]
}
```

## Steg 9: Insert Interaction (Supabase)

HTTP Request:
- Method: POST  
- URL: `{{ $env.SUPABASE_URL }}/rest/v1/interactions`
- Headers: samma auth
- Body:
```json
{
  "session_uuid": "{{ $('Calculate Lead Score').first().json.session_uuid }}",
  "type": "form",
  "payload": {
    "lead_id": "{{ $('Calculate Lead Score').first().json.lead_id }}",
    "score": {{ $('Calculate Lead Score').first().json.score }},
    "best_match_similarity": {{ $('Query Knowledge Base').first().json.best_similarity }},
    "ai_response": "{{ $('Generate AI Response').first().json.content[0].text }}"
  }
}
```

## Steg 10: Format Response (Code-nod)

```javascript
const aiResponseRaw = $('Generate AI Response').first().json;
const ragResult = $('Query Knowledge Base').first().json;
const lead = $('Calculate Lead Score').first().json;

// Anthropic returnerar content som array av blocks
const aiText = aiResponseRaw.content?.[0]?.text || "Tack för ditt meddelande. Vi återkommer inom kort.";

return [{
  json: {
    status: "success",
    lead_id: lead.lead_id,
    ai_response: aiText,
    best_match_similarity: ragResult.best_similarity || 0
  }
}];
```

## Steg 11: Respond to Webhook

- Respond With: First Incoming Item
- Response Code: 200

## Felhantering — Fallbacks

Om något steg misslyckas, returnera ändå ett vettigt svar. Använd n8n's error handling:

**Anthropic API misslyckas:** Returnera templated fallback:
```
"Tack för ditt meddelande, [namn]. Joakim återkommer personligen inom 24 timmar med ett konkret förslag baserat på det du beskrivit."
```

**RAG-query misslyckas:** Fortsätt utan context, låt Claude svara baserat på system prompt + meddelande.

**Supabase insert misslyckas:** Logga felet, returnera generisk acknowledgment till frontend, men säkerställ att leadet skickas till Joakim via mejl-fallback (lägg till TODO-kommentar för senare ticket).

## Hard Constraints

- Workflow exporteras som JSON till `/n8n/workflows/void-submission.json` efter färdigställande
- Inga API-nycklar i JSON-filen — bara `{{ $env.VAR_NAME }}`-referenser
- Workflow får INTE redigeras via n8n GUI efter export. JSON är källan till sanning.
- `consent_given` måste vara true. Skyland samlar inte personuppgifter utan explicit samtycke.
- Lead score är regelbaserat och transparent. Inga LLM-baserade scoring-experiment i V03.
- Claude Haiku 4.5 (`claude-haiku-4-5`), inte tidigare versioner.

## Verifieringssteg

Efter att JSON är genererad och importerad i n8n, kör fyra curl-tester:

**Test 1: Happy path**
```bash
curl -X POST https://onepiecedad.app.n8n.cloud/webhook/void-submission \
  -H "Content-Type: application/json" \
  -d '{
    "session_uuid": "11111111-1111-4111-8111-111111111111",
    "name": "Test Testsson",
    "email": "test@example.com",
    "company": "Test AB",
    "website": "test.se",
    "phone": "+46701234567",
    "message": "Vi driver en bilskola och funderar på automation av bokningar och påminnelser. Vad kostar det?",
    "consent_given": true
  }'
```
Förväntat: status success, ai_response refererar till bilskola-case studies eller pricing FAQ, lead_id returneras.

**Test 2: Missing consent**
```bash
curl -X POST .../webhook/void-submission \
  -H "Content-Type: application/json" \
  -d '{"session_uuid":"...", "name":"X", "email":"x@y.se", "message":"Tio ord minst för validering här", "consent_given": false}'
```
Förväntat: status error, error_code MISSING_CONSENT.

**Test 3: Invalid email**
```bash
curl ... -d '{"session_uuid":"...", "name":"X", "email":"notanemail", ...}'
```
Förväntat: status error, error_code INVALID_INPUT.

**Test 4: Verifiera Supabase**
Efter Test 1, kolla att:
- En rad finns i `prospects`-tabellen med matchande session_uuid och score > 0
- En rad finns i `interactions`-tabellen med type='form' och samma session_uuid

## Definition of Done

- [ ] Workflow `void-submission` skapad och exporterad som JSON
- [ ] Workflow importerad i n8n Cloud och aktiverad
- [ ] Webhook-URL verifierad: `https://onepiecedad.app.n8n.cloud/webhook/void-submission`
- [ ] Test 1 (happy path) returnerar AI-svar som refererar till Skylands tjänster
- [ ] Test 2 (no consent) returnerar 400 med MISSING_CONSENT
- [ ] Test 3 (invalid email) returnerar 400 med INVALID_INPUT
- [ ] Test 4 verifierar att data är persisted i Supabase
- [ ] Total körningstid för happy path under 5 sekunder
- [ ] Anthropic API-anrop loggas (för cost tracking)
- [ ] CHANGELOG.md uppdaterad
- [ ] Resultaten dokumenterade i `/scripts/test_v03_results.md`

## Förväntad kostnad per anrop

Claude Haiku 4.5 kostar ungefär:
- Input: $1 per million tokens
- Output: $5 per million tokens

Per formulärinlämning:
- Input: ~800 tokens (system prompt + RAG context + user message) ≈ $0.0008
- Output: ~250 tokens (svarstext) ≈ $0.00125
- Total: ~$0.002 per inlämning

Vid 100 inlämningar per dag: cirka $0.20/dag = $6/månad. Försumbart.

OpenAI embedding (anropas via V02): $0.00002 per inlämning. Helt försumbart.

## Hard Constraints på AI-respons

Tre saker som ALDRIG får hända i Claude-svaret:

1. **Inga påhittade priser, tjänster eller case studies.** Allt måste komma från RAG-context.
2. **Ingen marketing-fluff.** Förbjudna fraser: "Vi erbjuder skräddarsydda lösningar", "Tveka inte att kontakta oss", "Vi ser fram emot att höra från dig". Joakim skriver inte så.
3. **Aldrig påstå att Joakim ringer ett specifikt klockslag eller datum.** Bara generiska "inom kort" eller "i nästa samtal" är OK.

Om du upptäcker att Claude tenderar bryta mot dessa regler under verifiering, justera system prompten för att vara striktare.

## När du är klar

Rapportera:
- Webhook URL
- Resultat av alla fyra tester
- Faktisk responstid (millisekunder) för happy path
- Exempel på AI-svar från Test 1 för bedömning av kvalitet
- Eventuella avvikelser från instruktionen

Avvakta godkännande innan du går vidare till frontend-wire-up (V04).

## När du fastnar

Surface direkt om:
- Anthropic API returnerar 401 (felaktig nyckel) eller 429 (rate limit)
- Claude Haiku-modellen heter inte exakt `claude-haiku-4-5` — verifiera mot https://docs.claude.com
- n8n's expression-syntax inte fungerar som förväntat för specifika nodtyper
- Supabase RLS blockerar något oväntat (service_role bör bypassa, men dubbelkolla)
- AI-svaret är generiskt eller hallucinerar trots RAG-context (kan kräva justering av system prompt)

Visa mig exempel på AI-svar innan du godkänner workflowen som klar. Det är ditt content som genereras — agenten ska inte själv bedöma om kvaliteten är tillräcklig.
