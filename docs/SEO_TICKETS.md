# Skyland AI Solutions — SEO/AI-sök: handlingsplan med tickets

Version 1.0 · 2026-09-03 · Repo: `Onepiecedad/Skyland_AI_System` (sajten ligger i `app/`, Netlify publish = `app`)

Detta dokument är självbärande. En agent ska kunna köra ticket för ticket utan att ställa frågor. Strategin och motiveringen finns i `docs/SEO_HANDLINGSPLAN.md`; här är bara utförandet.

---

## Låsta beslut

Dessa är beslutade och ska inte omprövas av den som utför.

| Beslut | Värde |
|---|---|
| Formellt namn | **Skyland AI Solutions** — överallt i maskinläsbara fält (title, schema, footer, GBP, LinkedIn, register). Logotypens ordbild får förbli som den är. |
| Undersidornas design | Enkla statiska sidor. Samma varumärke (färger, typsnitt, header, footer) men **utan** bg-shader, korsnavigation, guidad tur, röstagent och dashboard. |
| Språk | **Endast svenska** på alla undersidor. Engelska finns kvar enbart på startsidan via befintlig i18n. Inga `/en/`-URL:er, ingen hreflang. |
| Case | Tre stycken: **Hasselblads Livs**, **MarinMekaniker**, **Cold Experience**. Joakim har kundernas tillåtelse att formulera texterna. Varje namngivet citat mejlas till kunden för ett skriftligt ja innan publicering. |
| Startsidan | Rörs inte utom där en ticket uttryckligen säger det (footer, nav-länkar, JSON-LD). Ingen designändring. |

---

## Nuläge (verifierat 2026-09-03, efter merge av PR #27)

Klart:
- Canonical, `og:url` och JSON-LD `url` pekar på `https://skylandai.se/`
- `netlify.toml` med `publish = "app"` och forcerad 301 från `skyland-ai-os.netlify.app/*`
- `app/robots.txt` (allt tillåtet, explicita block för OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Bingbot, Googlebot, plus `Sitemap:`-rad)
- `app/sitemap.xml` med två URL:er, svarar 200 med `content-type: application/xml`
- Google Search Console: domain property verifierad, sitemap inskickad, indexering begärd. Google-selected canonical = `https://skylandai.se/`. Senaste crawl 28 aug 2026 (före ändringen), omcrawl väntar.

Kvar:
- Bing Webmaster Tools, IndexNow, Google Business Profile, LinkedIn
- Allt innehåll: en enda indexerbar URL finns i dag
- Inga interna länkar (nav är `<button>` utan `href`)

---

## Designspec för undersidor

Gäller alla nya sidor. Syftet är visuell samhörighet med startsidan utan dess tyngd.

**Ingen** av dessa laddas på en undersida: `bg-shader.js`, `guide.js`, `voice.js`, `void.js`, `dashboard.js`, `intro-video.js`, `app.js`, `i18n.js`, `lang.js`, ElevenLabs-klienten. Undersidor är statisk HTML plus en delad CSS-fil. `tracker.js` får laddas om SCC-telemetrin ska mäta undersidor — bekräfta med Joakim, annars utelämnas även den.

Designtokens (hämtade ur `app/styles.css`, ska återanvändas exakt):

```
--bg:#101414; --bg-deep:#040505; --surface:#1c2020; --surface-low:#181c1c;
--primary:#43e19b; --primary-c:#0cc481;
--on-bg:#e0e3e2; --on-surface-var:#bbcabe; --outline-var:#3c4a41;
```

Typsnitt: brödtext `'Inter', system-ui, sans-serif`. Rubriker och logotyp `'Manrope', sans-serif`. Etiketter/kicker `'Space Grotesk', monospace`. Laddas från samma Google Fonts-URL som `index.html` använder i dag.

Layout: `max-width: 760px`, centrerad, `padding: 96px 24px 80px` (96 px toppmarginal för den fixerade headern). Radavstånd 1.7. Brödtext 17 px. H1 32 px, H2 21 px i `--primary-c`.

Header: samma markup som `index.html` (fixerad, blur, grön underkant, logotyp `Skyland` + `AI Solutions`) men **utan** språkväxlaren, och logotypen är en `<a href="/">`.

Footer: ny, delad, på undersidor **och** på startsidan (se SEO-11).

---

## Fas 0 — resterande, manuellt (Joakim)

### SEO-1 · Bing Webmaster Tools
**Typ:** manuell · **Tid:** 10 min · **Beroende:** inget

Logga in på bing.com/webmasters med samma Google-konto. Välj "Import from Google Search Console" och godkänn. Verifiera att skylandai.se dyker upp. Skicka in `https://skylandai.se/sitemap.xml` under Sitemaps.

**Klart när:** skylandai.se listas i Bing WMT och sitemapen är inskickad.

---

### SEO-2 · IndexNow-nyckel och ping vid deploy
**Typ:** manuellt + kod · **Tid:** 20 min · **Beroende:** SEO-1

1. I Bing WMT under IndexNow, generera en nyckel (32 tecken hex).
2. Skapa `app/<nyckeln>.txt` som innehåller enbart nyckelsträngen.
3. Verifiera att `https://skylandai.se/<nyckeln>.txt` svarar 200 med `content-type: text/plain`.
4. Lägg ett litet ping-script som körs efter deploy och POSTar ändrade URL:er till `https://api.indexnow.org/indexnow` med JSON-body `{host, key, keyLocation, urlList}`. Enklast som ett npm-script eller en Netlify build-plugin-hook. Om det blir krångligt: hoppa över automatiken första månaden och skicka in URL:er manuellt i Bing WMT när nya sidor publiceras.

**Klart när:** nyckelfilen svarar 200 och ett testanrop mot IndexNow returnerar 200 eller 202.

---

### SEO-3 · Google Business Profile
**Typ:** manuell · **Tid:** 45 min · **Beroende:** SEO-8 (Om-sidan ska finnas att länka till)

Skapa profil för Skyland AI Solutions. Kategori: "Företagskonsult" som primär, "Programvaruföretag" som sekundär. Adress: Mölndal (dölj gatuadressen om du jobbar hemifrån, använd serviceområde i stället). Serviceområden: Mölndal, Göteborg, Kungsbacka, Partille, Härryda, Lerum, Kungälv.

Tjänstemenyn är det 99 % missar. Lägg upp en tjänst per rad med **exakt keyword som namn** och en beskrivning på upp till 300 tecken som innehåller keyword + Mölndal + Göteborg:
- AI-telefonist
- AI-receptionist
- Automatiserad leaduppföljning
- AI-kundservice
- Processautomation för småföretag
- CRM-integration

Beskrivningen av företaget ska vara **identisk** med första stycket på `/om-skyland/`. Webbadress: `https://skylandai.se/`. Lägg upp 3–5 foton.

**Klart när:** profilen är verifierad och publicerad, tjänstemenyn ifylld.

---

### SEO-4 · LinkedIn-företagssida
**Typ:** manuell · **Tid:** 20 min · **Beroende:** SEO-8

Skapa/uppdatera företagssidan. Namn exakt "Skyland AI Solutions". Om-texten identisk med `/om-skyland/`. Bransch: IT-tjänster och IT-konsulting. Plats: Mölndal. Webbplats: `https://skylandai.se/`. Länka den från Joakims personliga profil.

**Klart när:** sidan är publicerad och namnet matchar schemat på sajten exakt.

---

## Fas 1 — entiteten Skyland (kod)

### SEO-5 · Delad sidmall och CSS för undersidor
**Typ:** kod · **Beroende:** inget · **Blockerar:** SEO-6 till SEO-10

Skapa `app/page.css` enligt designspecen ovan. Skapa en mall som alla undersidor följer:

```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>[SIDANS TITLE]</title>
  <meta name="description" content="[155–160 tecken]"/>
  <link rel="canonical" href="https://skylandai.se/[SÖKVÄG]"/>
  <meta name="theme-color" content="#101414"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="Skyland AI Solutions"/>
  <meta property="og:title" content="[SAMMA SOM TITLE]"/>
  <meta property="og:description" content="[SAMMA SOM DESCRIPTION]"/>
  <meta property="og:url" content="https://skylandai.se/[SÖKVÄG]"/>
  <meta property="og:locale" content="sv_SE"/>
  <script type="application/ld+json">[SIDANS SCHEMA]</script>
  <link rel="stylesheet" href="/page.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@300;400;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet"/>
</head>
<body>
  <header>[logotyp som länk till /]</header>
  <main>
    <nav class="crumbs">[BreadcrumbList, synlig]</nav>
    <h1>[H1]</h1>
    [INNEHÅLL]
  </main>
  [FOOTER — se SEO-11]
</body>
</html>
```

**URL-form:** använd mappar med `index.html`, alltså `app/om-skyland/index.html` → `https://skylandai.se/om-skyland/`. Netlify serverar det utan `.html`-ändelse. Håll efterföljande snedstreck konsekvent i canonical, sitemap och interna länkar.

**Acceptanskriterier:**
- Sidan renderar korrekt utan JavaScript helt avstängt
- Lighthouse Performance ≥ 95 på mobil
- Inga 404 i konsolen
- Ser ut som Skyland: samma gröna primärfärg, samma typsnitt, samma header

---

### SEO-6 · `/om-skyland/`
**Typ:** kod + text · **Beroende:** SEO-5

**Title:** `Om Skyland AI Solutions — AI-automation i Mölndal och Göteborg`
**H1:** `Om Skyland AI Solutions`

Första stycket ska vara en entitetsdefinition i klartext, ordagrant återanvändbar av en språkmodell. Utgå från detta och låt Joakim justera:

> Skyland AI Solutions är ett AI-automationsföretag i Mölndal utanför Göteborg, grundat 2025 av Joakim Landqvist. Vi bygger AI-telefonister, automatiserad leaduppföljning, smarta kontaktformulär och CRM-integrationer åt svenska ägarledda serviceföretag med två till femton anställda.

Därefter, i denna ordning:
- **Vem vi är till för** — ägarledda serviceföretag, konkreta branscher (hantverk, marinservice, kliniker, trafikskolor, besöksnäring)
- **Varför en osteopat bygger AI-system** — Joakims 20 år som manuell terapeut och egenföretagare. Detta är differentiatorn ("The Honest Builder"): han har själv suttit med missade samtal och tomma tider. Skriv det som en kort historia, inte som en meritlista.
- **Så jobbar vi** — vi börjar smått, kör parallellt med det befintliga, du äger allt från dag ett, inga nya inloggningar för personalen
- **Vad vi inte gör** — vi automatiserar inte allt, vi tar två eller tre flöden som faktiskt läcker pengar
- **Fakta** — Skyland AI Solutions drivs under CAJL, org.nr 197707244930, Mölndal, joakim@skylandai.se, länk till LinkedIn

**Schema:** `Organization` med `founder` som `Person` (Joakim Landqvist), `address` (Mölndal, Västra Götaland, SE), `email`, `url`, `sameAs` med LinkedIn-URL:en.

**Acceptanskriterier:** företagsnamnet står exakt "Skyland AI Solutions" i title, H1-området, schema och footer. Ingen mening i schemat som inte också syns i texten.

---

### SEO-7 · `/kontakt/`
**Typ:** kod · **Beroende:** SEO-5

**Title:** `Kontakt — Skyland AI Solutions`
**H1:** `Kontakt`

Innehåll: e-post som `mailto:`-länk, Cal.com-länk (`https://cal.com/joakim-landqvist-yrcioq/15min`) som tydlig knapp, ort, och en rad om vad ett första samtal innebär (15 minuter, gratis, ärlig bedömning, inga förpliktelser).

Kontaktformuläret: **återanvänd inte** `void.js`-flödet här. Antingen ett enkelt formulär som postar till samma SCC-endpoint som startsidan (kolla `app/api.js` för endpoint och payload-form), eller — enklare och fullt godtagbart i version ett — enbart mejl och bokningslänk, med en textlänk till startsidans demo för den som vill testa AI-svaret. Välj det senare om SCC-endpointen kräver sessionslogik från `session.js`.

**Schema:** `ContactPage`.

---

### SEO-8 · `/case/` (index)
**Typ:** kod + text · **Beroende:** SEO-5

**Title:** `Kundcase — AI-system som körs i skarp drift | Skyland AI Solutions`
**H1:** `Kundcase`

Ingress: en mening om att alla siffror kommer från system i drift och att kunderna har godkänt texterna. Därefter tre kort, ett per case, med kundnamn, bransch, en mening om vad som byggdes, en nyckelsiffra och länk till casesidan.

**Schema:** `CollectionPage` + `BreadcrumbList`.

---

### SEO-9 · Casesidor (tre stycken)
**Typ:** kod + text · **Beroende:** SEO-8 · **Blockerad av:** siffror från Joakim (se "Data som krävs" nedan)

`/case/hasselblads-livs/`, `/case/marinmekaniker/`, `/case/cold-experience/`

**Samma mall för alla tre**, i denna ordning:

1. **H1:** `[Kundnamn] — [vad som byggdes i fem ord]`
2. **Faktaruta överst** (detta är vad AI-sök citerar): bransch, ort, vad som byggdes, lanseringsdatum, en till tre nyckelsiffror
3. **Utgångsläget** — vad som läckte, i konkreta ögonblick, inte abstraktioner
4. **Vad vi byggde** — teknik nämnd men underordnad; beskriv vad det gör, inte vilken stack det är
5. **Resultat** — siffror med period och mätmetod. Skriv `Under perioden mars–augusti 2026 …`, aldrig `100 % korrekt`. Varje siffra ska ha en mening om **hur** den mättes.
6. **Vad som är mätt och vad som är uppskattat** — egen underrubrik. Detta är hela trovärdighetsgrejen; hoppa inte över den.
7. **Kundens ord** — citat med namn och roll. Publiceras **först** efter skriftligt ja per mejl.
8. **Länk vidare** till relevant tjänstesida och till `/kontakt/`

**Schema:** `Article` med `datePublished`, `author` (Organization Skyland AI Solutions), `about` (kundens bransch).

**Acceptanskriterier:** ingen siffra på sidan saknar period och mätmetod. Inget citat utan dokumenterat godkännande. Länk från `/case/` till varje sida och tillbaka.

---

### SEO-10 · `llms.txt`
**Typ:** kod · **Tid:** 10 min · **Beroende:** SEO-6 till SEO-9

`app/llms.txt` med företagsbeskrivningen i två meningar och en punktlista över viktiga URL:er. Låg prioritet, ingen förväntan på effekt, men billig.

---

### SEO-11 · Footer och interna länkar
**Typ:** kod · **Beroende:** SEO-6 till SEO-9 · **Rör startsidan**

Detta är den enda ticketen som ändrar `index.html`, och den är viktigare för sök än de flesta andra: utan den finns ingen crawlväg till de nya sidorna.

1. Skapa en delad footer-markup: företagsnamn, kort beskrivning i en mening, länklista (`/om-skyland/`, `/case/`, `/kontakt/`, `/integritetspolicy.html`, senare tjänstesidorna), e-post, ort, copyright.
2. Lägg footern på **alla** undersidor.
3. Lägg samma footer sist på startsidan. Den ska vara nåbar — om scroll-snap-containern gör den oåtkomlig, lägg den utanför `<main>` eller som en sista snap-sektion. Verifiera manuellt att den går att scrolla till på både desktop och mobil.
4. Nav-knapparna i startsidans kors: låt dem förbli knappar men **lägg till riktiga `<a href>`** där en motsvarande undersida finns, med `preventDefault()` i den befintliga klickhanteraren så JavaScript-navigeringen behålls. Crawlern följer href:en, användaren får kvar animationen.

**Acceptanskriterier:** `curl -s https://skylandai.se/ | grep -o 'href="/[^"]*"'` listar alla nya sidor. Startsidan ser likadan ut för en användare som före ändringen.

---

### SEO-12 · Sitemap-rutin
**Typ:** kod · **Beroende:** varje ny sida

`app/sitemap.xml` uppdateras i **samma commit** som varje ny sida läggs till. `lastmod` sätts till dagens datum för den nya URL:en; ändra inte `lastmod` på orörda URL:er. Efter deploy: skicka in sitemapen igen i GSC och kör URL Inspection + Request indexing på den nya sidan. Om IndexNow (SEO-2) är på plats: pinga URL:en.

**Acceptanskriterier:** ingen publicerad sida saknas i sitemapen. Ingen URL i sitemapen svarar annat än 200.

---

## Fas 2 — tjänstesidor (kod + text)

Fem sidor. Bygg dem **en i taget**, i denna ordning, och publicera var och en innan nästa börjar. Ordningen följer var bevisen är starkast och konkurrensen lägst.

### Gemensam mall (gäller SEO-13 till SEO-17)

Struktur i denna ordning, ingen avvikelse:

1. **H1** som innehåller huvudkeywordet ordagrant
2. **Direktsvar** i första stycket, två till tre meningar, som definierar tjänsten. Huvudkeywordet ska stå i title, i H1 **och** i första meningen ("Three Kings"). Skriv stycket så att det går att lyfta ut och citera ordagrant.
3. **Nyckelpunkter** — tre till fem punkter direkt under ingressen
4. **Så fungerar det** — steg för steg
5. **Vad det kostar** — riktiga intervall, inte "kontakta oss". Prisintervall, vad som ingår, uppstart kontra löpande.
6. **När det passar och när det inte passar** — egen underrubrik. Att skriva ut när något inte passar är det enskilt mest förtroendebyggande på hela sidan.
7. **Vanliga frågor** — fyra till sex frågor med korta, kompletta svar
8. **En egen datapunkt** från drift eller från ett case, med länk till casesidan
9. **CTA** till `/kontakt/`

Varianter vävs in som H2 på **samma** sida, aldrig som separata sidor (kannibalisering). Schema: `Service` + `BreadcrumbList`, plus `FAQPage` **endast** om frågorna faktiskt syns på sidan.

Skrivmetod: AI-intervju, cirka 45 minuter per sida. Prompten är `Jag skriver en sida som besvarar [frågan]. Ställ frågorna du behöver för att skriva den — inkludera min erfarenhet, mina case och mina åsikter. Max tio frågor, en i taget.` Svara i röstläge. Låt AI:n skriva utkastet från svaren. Aldrig "skriv en artikel om X".

---

### SEO-13 · `/ai-telefonist/`
Huvudkeyword: **AI-telefonist**. Varianter som H2: AI-receptionist, AI-telefonsvarare, röstagent, missade samtal, svara på telefon utanför öppettider.
Egen datapunkt: Alex i drift på sajten. All information som Alex säger i videon ska finnas som text på denna sida.
Länkar till: `/case/marinmekaniker/`, `/kontakt/`.

### SEO-14 · `/automatiserad-uppfoljning/`
Huvudkeyword: **automatiserad leaduppföljning**. Varianter: databasreaktivering, gamla leads, svarstid på webbförfrågan, uppföljning som faller mellan stolarna.
Egen datapunkt: Cold Experience.
Länkar till: `/case/cold-experience/`, `/kontakt/`.

### SEO-15 · `/ai-kundservice/`
Huvudkeyword: **AI-kundservice**. Varianter: chatt, smart kontaktformulär, kvalificering, WhatsApp.
Egen datapunkt: void-formuläret på startsidan.

### SEO-16 · `/ai-for-hantverkare/`
Huvudkeyword: **AI för hantverkare**. Branschsida. Konkreta ögonblick: samtal missade uppe på taket, offerter som aldrig följs upp, kunden som ringer nästa firma efter tjugo minuter.
**Först efter att SEO-13 visar visningar i GSC** byggs `/ai-for-marinservice/` och `/ai-for-kliniker/` på samma mall. Bygg dem inte i förväg.

### SEO-17 · `/ai-automation-goteborg/`
Huvudkeyword: **AI-automation Göteborg**. **Enda** geografiska sidan. Genuint unikt innehåll om lokala kunder och lokala förutsättningar, aldrig en mall med utbytt ortsnamn. Fler ortssidor först när denna rankar; kopierade ortssidor är doorway-straff.

---

## Fas 3 — externa signaler (löpande, från nu)

Ingen kod. Mål: två till fyra per månad. Utan detta stannar allt på sida två, oavsett hur bra sidorna är.

### SEO-18 · Länkar från kundernas sajter
Be Hasselblads Livs, MarinMekaniker, Cold Experience, Björn Olsson och Food Traktor lägga en mening i sin footer eller på sin om-sida:
> Bokning och kundhantering hanteras av ett system från [Skyland AI Solutions](https://skylandai.se/).

Be aldrig om ankartexten "bästa AI-företag". Ankartext ska vara varumärkesnamnet i 40–50 % av fallen.

### SEO-19 · Register och kataloger
Allabolag, Ratsit, Hitta.se, Eniro, Bolagsfakta. **Exakt** samma företagsnamn och beskrivning som `/om-skyland/` på alla.

### SEO-20 · Lokalpress
Mölndals-Posten och GP:s företagssidor. Vinkeln är **inte** "AI-företag i Mölndal" — det är ointressant. Vinkeln är osteopaten med tjugo år i yrket som byggde ett AI-bolag utan att kunna koda, och vad han såg hos småföretagen på vägen. Skriv pitchen som mejl, max tio rader.

### SEO-21 · Reviews
Be varje kund om ett Google-omdöme via mejl eller SMS, cirka två timmar efter ett avslutat möte, med en uppföljning efter 24 timmar. **Aldrig QR-kod på plats** — Google raderar dem sedan reglerna ändrades. Fem omdömen som nämner tjänsten vid namn gör mer för AI-synligheten än tio artiklar.

---

## Fas 4 — frågeartiklar (från månad 2)

En per vecka, aldrig fler. Startar först när fas 0–2 är i mål.

### SEO-22 · Artikelmall
"Key takeaways" med tre till fem punkter överst, direktsvar i första stycket, konkreta exempel med siffror, priser, när det inte passar, författare och uppdateringsdatum, tre till fem interna länkar. Varje ny artikel länkas från tre gamla plus en tjänstesida.

### SEO-23 · Artikelkö
1. Vad kostar en AI-telefonist för ett litet företag?
2. AI-telefonist eller telefonsvarare — vad är skillnaden?
3. Hur snabbt måste man svara på en webbförfrågan?
4. Vad händer med leads som inte följs upp?
5. När lönar sig AI-automation för en marinservice?
6. Vad kan automatiseras utan att kundupplevelsen blir opersonlig?
7. AI-agent eller vanligt CRM för ett litet företag?

### SEO-24 · Gratisverktyg som lead magnet
Kalkylator för missade samtal: antal missade samtal per vecka × snittvärde per jobb → förlorad intäkt per år. En eftermiddag att bygga i befintlig stack. Värd mer som länkmagnet än fem artiklar. Egen URL, egen sida i sitemapen.

---

## Mätning

Månadsvis, inte oftare.

| Vad | Var | Tolkning |
|---|---|---|
| Klick och visningar | GSC | Visningar är det tidiga kvittot. Ignorera snittposition helt. |
| Sidor position 11–20 | GSC | Lägst hängande frukt: uppdatera sidan, +100 ord, behåll URL, begär omindexering |
| AI-funktioner | GSC:s rapport för generativa AI-funktioner | Global sedan 31 aug 2026 |
| Copilot-citeringar | Bing WMT → AI Performance | Vilka URL:er som citeras och på vilka frågor |
| ChatGPT-trafik | tracker.js / SCC | Filtrera på `utm_source=chatgpt.com` |
| Branded search | GSC | Sökningar på "Skyland AI" — mäter om entiteten fastnar |

Förväntansbild: rörelse månad 3–6, tydligt lyft omkring månad 7. Lova ingenting tidigare, varken till dig själv eller till kunder.

---

## Data som krävs från Joakim innan SEO-9 kan byggas

Per case behövs detta. Utan siffror blir casesidan marknadsföring i stället för bevis, och då citerar ingen AI den.

**Hasselblads Livs**
- Vad byggdes exakt (lagersynk, PIM, annat) och när gick det live
- Antal produkter som synkas, och över vilken period
- Hur avvikelser kontrolleras och hur ofta
- Vad som gjordes manuellt förut, och hur lång tid det tog

**MarinMekaniker**
- Lanseringsdatum för ordersystemet
- Antal ordrar eller bokningar hanterade, och period
- Vad Thomas gjorde förut när en förfrågan kom in
- Eventuell svarstid före och efter

**Cold Experience**
- Lanseringsdatum för WhatsApp-flödet
- Antal förfrågningar hanterade, och period
- Antal språk som hanteras automatiskt
- Svarstid före och efter, om det går att belägga
- Vad "hot lead"-detekteringen faktiskt fångar

För varje siffra: säg om den är **mätt** (finns i databasen) eller **uppskattad** (din bedömning). Båda får publiceras, men de ska märkas olika på sidan.

---

## Körordning i sammandrag

1. SEO-1, SEO-2 (Bing, IndexNow) — kan göras när som helst, gör det i dag
2. SEO-5 (mall och CSS) — blockerar allt annat i fas 1
3. SEO-6, SEO-7 (Om, Kontakt) — kräver ingen kunddata, bygg direkt
4. SEO-3, SEO-4 (GBP, LinkedIn) — så fort Om-texten finns
5. SEO-8, SEO-9 (Case) — så fort siffrorna finns
6. SEO-11, SEO-12 (footer, sitemap) — direkt efter att sidorna finns
7. SEO-13 → SEO-17, en i taget, publicera mellan varje
8. SEO-18 → SEO-21 löpande parallellt från nu
9. SEO-22 → SEO-24 från månad två
