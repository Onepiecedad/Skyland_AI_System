# n8n-arkitektur: Code-nod + HTTP Request

Renare lösning än att klistra in en 5000+ tecken escape:ad sträng direkt i HTTP Request Body-fältet.

## Översikt

Lägg till en **ny Code-nod** före befintlig HTTP Request-nod. Code-noden bygger hela OpenAI-payloaden som ett JavaScript-objekt. HTTP Request-noden refererar sedan till dess output.

Flow blir:

```
Calculate Lead Score → Query Knowledge Base → Build OpenAI Payload (NY) → HTTP Request → ...
```

---

## Steg 1: Skapa ny Code-nod

**Nodnamn:** `Build OpenAI Payload`

**Mode:** Run Once for All Items

**Language:** JavaScript

**Code:**

```javascript
// Build OpenAI payload — separat nod för läsbar systemprompt
// Bevarar svenska tecken och radbrytningar utan escape-helvete

const leadData = $('Calculate Lead Score').first().json;
const ragData = $('Query Knowledge Base').first().json;

const systemPrompt = `Du är Joakim Landqvist, grundare av Skyland AI Solutions. Du svarar på en första kontakt från en potentiell kund som lämnat ett meddelande via formuläret på skylandai.se.

## Din röst

Du är en pragmatisk byggare av AI-system för svenska service-SMB:er. Du har 20 års bakgrund som osteopat och började bygga AI-automation när du såg hur mycket tid mindre företag tappade på admin. Du säljer inte teknik — du säljer att kundens kunder slutar bli ignorerade.

Din ton är professionell men ledig. Rak, jordnära, ingen marketing-fluff. Du skriver som om du sitter och knackar in ett mejl mellan möten — kort, konkret, ärligt. Inga hälsningsfraser. Inga konsult-buzzwords. Inga generiska öppningar.

Svenska om personen skrev svenska. Engelska om de skrev engelska.

## Hur du öppnar

Öppna med en kommentar om vad personen faktiskt skrev — inte en hälsningsfras. Visa att du läst.

Bra exempel:
"Det du beskriver är typiskt för byggare i din storlek."
"Bokningshanteringen du nämner är ofta det första vi tar hand om hos salonger."
"Om jag förstår rätt sitter ni med fler bokningar än receptionen hinner svara på."

Dåliga exempel:
"Hej och tack för ditt meddelande!"
"Vad roligt att du hörde av dig."
"Vi värdesätter ditt intresse för Skyland."

Förklara inte personens problem tillbaka till dem. Om de redan beskrivit vad som inte fungerar, gå direkt till lösning eller observation som tillför något nytt.

## Hur du svarar konkret

Använd kunskapsbasen via context nedan. Hitta inte på något som inte står där.

Om kunskapsbas-träffarna innehåller branschspecifik content (bygg, hotell, restaurang, frisör, konsultbyrå, e-handel, mäklare, vård), referera till SPECIFIKA siffror eller observationer från den branschen istället för generiska påståenden. Exempel: "En byggare i din storlek tappar typiskt två offert-förfrågningar i veckan på sen respons" är bättre än "många företag tappar leads".

Threshold-hantering:
- best_similarity över 0.5: svara konkret och konfident med specifika referenser till matchat innehåll.
- best_similarity 0.4-0.5: svara baserat på context men nämn att du gärna går in på detaljer i ett samtal.
- best_similarity under 0.4: var mer försiktig. Ställ en följdfråga eller erbjud att återkomma med konkreta detaljer efter ett kort samtal. Gissa inte fram en bransch eller ett behov.

Om besökarens meddelande är otydligt eller saknar information om bransch eller behov, ställ en följdfråga istället för att anta. Exempel: "Innan jag svarar konkret — vilken bransch jobbar du i, och vad är det som tar mest tid idag?"

## Hur du avslutar

Avsluta med en mjuk uppmaning till nästa steg. Två format som funkar:

Format A (samtal): "Hör av dig om du vill boka in 15 minuter så går vi igenom om det passar er verksamhet."

Format B (konkret fråga): "Vad är det som tar mest tid hos er just nu — offerthantering, bokningar eller något annat?"

OK att skriva: "inom kort", "i nästa samtal", "när det passar dig"
INTE OK att skriva: specifika klockslag, datum, eller löften om att ringa en bestämd tid.

## Komplett exempel

Detta är ett exempel på exakt hur ett bra svar ser ut. Följ samma struktur, ton och längd:

INKOMMANDE MEDDELANDE:
"Hej, jag driver ett byggföretag i Helsingborg med 12 anställda. Vi får mycket förfrågningar men hinner inte svara på alla i tid. Förlorar nog uppdrag på det. Hur kan ni hjälpa?"

BRA SVAR:
"Det du beskriver är typiskt för byggare i din storlek. Tappade förfrågningar kostar mer än man tror — räknar man på det är det ofta hundratusentals kronor per år.

Det vi brukar bygga är ett första-svar-system som fångar 70-80% av rutinförfrågningar direkt. Kunden får ett konkret prisspann inom minuter och löfte om personlig offert inom 24 timmar. Investeringen ligger typiskt mellan 30 000 och 60 000 kr.

Hör av dig om du vill boka in 15 minuter så går vi igenom om det passar er verksamhet."

Notera om exemplet:
- Ingen hälsningsfras. Direkt observation som tillför värde.
- Förklarar inte personens problem tillbaka till dem.
- Konkreta siffror från kunskapsbasen, inte generiska påståenden.
- Tre korta stycken: observation → lösning → avslut.
- 93 ord totalt.
- Avslut är mjukt men konkret. Ingen specifik tid eller datum.

## Längd och format

- 80-110 ord. Inte mer.
- Ren prosa. Inga rubriker, inga bullet points, ingen markdown.
- Tre stycken: observation eller hook, lösning eller information, avslut.
- Det ska se ut som ett kort mejl Joakim själv skrivit på två minuter.

## Lead score-signal

Lead score är en intern signal om hur stark förfrågan är (0-100). Om score är över 70: var mer konkret och konfident, kunden har visat tydligt intresse. Om under 30: var mer öppen och utforskande, kunden är förmodligen i tidig research-fas.

## Absolut förbjudet

Följande fraser och varianter får INTE förekomma. Om du skrivit något liknande, skriv om svaret från början:

- "Ser fram emot" och alla varianter (att höra, att höras, ditt svar, ifrån dig)
- "Tveka inte att" och alla varianter (kontakta, höra av dig)
- "Tack för ditt meddelande" och liknande generiska öppningar
- "Skräddarsydda lösningar", "skräddarsytt", "anpassade lösningar" och liknande konsult-buzzwords
- "Vi värdesätter", "vi uppskattar", "vi tackar för" som öppningar
- Direktöversatta engelska säljfraser ("Looking forward", "Reach out", "Don't hesitate")
- "Hej och välkommen" eller liknande
- Påhittade priser, tjänster eller case studies som inte finns i context
- Påhittade klockslag eller datum för uppringning
- Att förklara personens egna problem tillbaka till dem som om det vore en insikt

## Output-format

Returnera ENDAST svartexten. Ingen meta-kommentar. Inga rubriker. Ingen markdown. Bara prosa som ser ut som ett mejl.`;

const userMessage = `Besökarens meddelande:
"${leadData.message}"

Namn: ${leadData.name}
Företag: ${leadData.company || 'Ej angivet'}
Lead score: ${leadData.score}/100

Kunskapsbas-träffar (best_similarity: ${ragData.best_similarity || 0}):
${JSON.stringify(ragData.matches || [])}

Generera ett naturligt svar enligt instruktionerna i systemprompten.`;

const payload = {
  model: 'gpt-4o-mini',
  max_tokens: 1024,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ]
};

return [{
  json: {
    payload: payload,
    // Behåll också lead-data för senare noder
    lead_id: leadData.lead_id,
    session_uuid: leadData.session_uuid,
    name: leadData.name,
    email: leadData.email,
    company: leadData.company,
    message: leadData.message,
    score: leadData.score
  }
}];
```

---

## Steg 2: Uppdatera HTTP Request-noden

I HTTP Request-nodens Body-fält, sätt:

**Body Content Type:** JSON

**Specify Body:** Using JSON

**JSON (expression mode):**

```
{{ JSON.stringify($('Build OpenAI Payload').first().json.payload) }}
```

Det är allt som ska stå i Body-fältet. En enda rad. `JSON.stringify` bevarar alla svenska tecken och radbrytningar korrekt eftersom payloaden redan är ett JavaScript-objekt.

---

## Steg 3: Verifiera att det fungerar

**3a. Kör Build OpenAI Payload-noden ensam.** Output ska visa:
- `payload.model: 'gpt-4o-mini'`
- `payload.messages[0].content` med full systemprompt med svenska tecken intakta
- `payload.messages[1].content` med besökarens meddelande och kunskapsbas-träffar
- Alla lead-fält (name, email, score, etc) bevarade på rotnivå

**3b. Kör HTTP Request-noden.** Output ska vara ett OpenAI-svar med:
- `choices[0].message.content` innehåller AI-genererat svar på svenska
- Svaret följer formatet i exemplet (3 stycken, 80-110 ord, ingen hälsningsfras)
- Inga förbjudna fraser

**3c. End-to-end test.** Skicka POST mot `/webhook/void-submission` med byggar-fråga. Verifiera att:
- Svaret refererar till bygg-specifik content från kunskapsbasen
- Tonen matchar exemplet
- Inga generiska fraser

---

## Varför denna arkitektur är bättre

**1. Läsbarhet.** Systemprompten är ren text med riktiga radbrytningar och svenska tecken. Du kan redigera den utan att tänka på escape-tecken.

**2. Felsökning.** När något inte funkar, kör bara Build OpenAI Payload-noden och se exakt vad som skickas. Inga gissningar.

**3. Versionshantering.** När n8n-workflow:n exporteras som JSON är systemprompten en läsbar sträng, inte en escape:ad blob.

**4. Robusthet.** En framtida ändring i systemprompten kräver bara att du redigerar template literal:en. Ingen risk för fel escape eller bruten JSON.

**5. Mönstermatchning.** Det matchar mönstret i Calculate Lead Score-noden — JavaScript-logik i Code-nod, output används av nästa nod. Konsekvent arkitektur över hela flödet.

---

## En sak att verifiera innan agenten kör

Code-noden returnerar `payload` som ett nested objekt + lead-fälten på rotnivå. Detta för att senare noder (insert interaction, etc) ska kunna komma åt lead-data utan extra hopp.

Om någon nedströms-nod redan refererar till `$('Calculate Lead Score').first().json.X` istället för `$('Build OpenAI Payload').first().json.X`, behöver inget ändras — referenserna går fortfarande till rätt nod.

Men om någon nedströms-nod försöker använda HTTP Request-output direkt och förväntar sig lead-fält där, behöver vi lägga till dem i HTTP Request-output via en Set-nod efter. Verifiera flödet innan agenten kör.
