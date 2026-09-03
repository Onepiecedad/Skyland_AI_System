# Handlingsplan: bli hittad på nätet (SEO + AI-sök) för skylandai.se

Datum: 2026-09-03. Underlag: teknisk kontroll av den live-sajt som serveras just nu, repo `Onepiecedad/Skyland_AI_System`, Matt Diamante-playbooken (31 videor + heytony.ca), Daniel Turner-playbooken, samt Perplexitys och ChatGPTs rekommendationer. De två AI-svaren säger i stort sett samma sak och stämmer med Diamantes metod, så planen nedan är en sammanslagning med en tydlig ordning, inte ännu en lista med råd.

## Vad som faktiskt gäller i dag (kontrollerat 3 sep)

Sajten är ett enda HTML-dokument. Alla fem "sidor" (Hem, Tjänster, Systemet, Demo, Kontakt) lever på `https://skylandai.se/` och byts med JavaScript. `/tjanster` ger 404. Det finns alltså exakt en indexerbar URL på hela domänen, plus integritetspolicyn.

Canonical-taggen pekar på `https://skyland-ai-os.netlify.app/`, inte på `skylandai.se`. Det betyder att vi i dag uttryckligen säger till Google att skylandai.se är en kopia av en Netlify-subdomän och att originalet finns där. Netlify-subdomänen svarar dessutom 200 med identiskt innehåll (samma etag), så det finns två fullständiga kopior av sajten online. Det här är med stor sannolikhet en av orsakerna till att ChatGPT:s webbsökning visade en gammal version: det finns inget som säger åt något index att uppdatera skylandai.se.

`robots.txt` och `sitemap.xml` saknas (båda 404). Det finns ingen `netlify.toml`, inga `_redirects`, inga `_headers`. www-redirecten fungerar (301 till apex), cache-headers är korrekta (max-age=0, must-revalidate), så "gammal version" beror inte på cache i Netlify utan på att inget index har fått anledning att crawla om.

Texten ligger i HTML:en (data-i18n-fälten har svensk standardtext), så innehållet är crawlbart. Det är bra. Men navigationen är knappar utan `href`, så det finns inga interna länkar alls, och det finns inte en enda kundreferens, inget case, inget företagsnamn utöver "Skyland AI Solutions" i schemat, ingen adress utöver Mölndal. Schemat (`ProfessionalService`) är rimligt men pekar också på Netlify-URL:en.

Slutsats: sajten är byggd som en konverteringsmotor och fungerar som en sådan. Som sökobjekt är den i praktiken osynlig, och de få signaler som finns pekar åt fel håll. Det är inte ett innehållsproblem i första hand utan ett strukturproblem, och det går att rätta i rätt ordning.

## Principen bakom prioriteringen

Ordningen styrs av tre saker. Först: ingenting annat spelar roll förrän sökmotorerna kan hitta rätt version av rätt domän, så teknik före innehåll. Sedan: Diamantes tumregel att ranka där man kan ranka. Svenska long-tail-frågor om AI-telefonist, AI-receptionist, automatiserad uppföljning och liknande har nära noll konkurrens; där räcker en ärlig, svarsfullständig sida för att ta position. Slutligen: AI-sökmotorer crowdsourcar. De väger ihop Googles topplista, kataloger, reviews och externa omnämnanden. Du kan inte skriva dig till AI-synlighet enbart på egen domän. Därför kommer externa signaler in redan i vecka två, inte som efterarbete.

Startsidan görs inte om. Den behåller sitt jobb. Vi bygger ett maskinläsbart lager under den.

## Fas 0: stoppa blödningen (denna vecka, 2 till 3 timmar totalt)

Det här är rena fel och tar kortast tid av allt i planen, så det görs först och utan diskussion.

Byt canonical, `og:url` och `url` i JSON-LD till `https://skylandai.se/`. Lägg en 301 från `skyland-ai-os.netlify.app/*` till `skylandai.se/:splat` i `netlify.toml` så Netlify-kopian försvinner ur indexen. Lägg till `robots.txt` som tillåter allt inklusive `OAI-SearchBot`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, `Bingbot` och pekar på sitemap. Lägg till `sitemap.xml` (i dag med en URL, den växer med fas 2). Verifiera domänen i Google Search Console och Bing Webmaster Tools, skicka in sitemap, kör URL Inspection på startsidan och begär indexering. Aktivera IndexNow via Bing (en nyckelfil på domänen; Netlify-deploy kan pinga automatiskt med ett litet script, men manuell inskickning räcker första månaden).

Bestäm samtidigt ett namn och håll det: **Skyland AI Solutions** överallt (schema, footer, GBP, LinkedIn, Bolagsverket, Ratsit/Allabolag). Sajten säger i dag "Skyland AI Solutions" i schemat, "Skyland" i logotypen, "Skyland AI System" i reponamnet och "AI SYSTEM" i ordbilden. Det räcker att det formella namnet är konsekvent i alla maskinläsbara ställen; logotypen får vara vad den vill.

Kvitto på att fas 0 fungerar: Search Console visar skylandai.se som indexerad med rätt canonical inom 1 till 2 veckor, Netlify-subdomänen försvinner ur `site:`-sökning.

## Fas 1: entiteten Skyland (vecka 1 till 2)

Målet är att en språkmodell aldrig ska behöva gissa vad Skyland är. Det kräver tre riktiga sidor med egna URL:er, utanför SPA-logiken. Enklast är statiska HTML-filer i `app/` med samma header och styles, utan shader och animationer. De behöver inte vara vackra. De ska vara tydliga.

`/om-skyland/` med ett stycke i klartext: Skyland AI Solutions är ett AI-automationsföretag i Mölndal utanför Göteborg, grundat 2025 av Joakim Landqvist, som bygger AI-telefonister, automatiserad leaduppföljning, smarta kontaktformulär och CRM-integrationer för svenska ägarledda serviceföretag med 2 till 15 anställda. Din bakgrund som osteopat med 20 år av att driva egen verksamhet är en verklig differentiator och ska stå där (The Honest Builder). Organisationsnummer, ort, e-post, länk till LinkedIn. `Organization` + `Person`-schema.

`/kontakt/` som riktig sida med formuläret, telefon, e-post och Cal.com-länk. `/case/` som index med ett stycke per kund, och därunder en sida per case, i första hand Cold Experience och MarinMekaniker eftersom det är där du har verkliga siffror. Varje case följer samma mall: bransch, utgångsläge, vad som byggdes, lanseringsdatum, hur resultatet mättes, vad som är mätt och vad som är uppskattat. Skriv hellre "under mars till augusti 2026 hanterades X förfrågningar automatiskt, svarstid gick från Y till Z" än "100 % korrekt". Be kunden om godkännande med namn och roll. Det är primärdata, och det är det AI-sökmotorer citerar.

Länka nav-knapparna till riktiga URL:er (`<a href>`) även om JavaScript fortfarande fångar klicket på startsidan. Lägg en textfooter på startsidan med länkar till alla undersidor. Då har vi interna länkar och en crawlväg.

Parallellt, samma vecka: Google Business Profile (kategori "Företagskonsult" eller "IT-tjänster", tjänstemenyn ifylld med exakta tjänstenamn plus 300-teckensbeskrivning med Mölndal, Göteborg, Kungsbacka, Partille), Bing Places, LinkedIn-företagssida med samma text som Om-sidan. Alla tre ska säga exakt samma sak som `/om-skyland/`.

## Fas 2: tjänstesidorna som ska ranka (vecka 3 till 6)

Här ligger genomslaget. Fem sidor, en per verklig kundfråga, byggda med Diamantes "Three Kings" (huvudkeyword i title, H1 och första meningen) och answer-first: definitionen i första stycket, sedan hur det fungerar, vad det kostar, när det inte passar, vanliga frågor, länk till case och till kontakt. Varje sida ska vara "answer-complete", alltså pris, tidsram, nivåer och förbehåll på ett ställe, plus minst en egen datapunkt från din drift.

Föreslagen ordning efter var du har starkast bevis och lägst konkurrens:

1. `/ai-telefonist/` (varianter att väva in som H2: AI-receptionist, AI-telefonsvarare, röstagent, missade samtal). Alex är din levande demo, och sidan ska beskriva i text allt hon säger i video.
2. `/automatiserad-uppfoljning/` (leaduppföljning, databasreaktivering, gamla leads, svarstid på webbförfrågan). Detta är Turners inträdesoffer och du har körda kampanjer att hänvisa till.
3. `/ai-kundservice/` (chatt, formulär, kvalificering, WhatsApp).
4. `/ai-for-hantverkare/` som första branschsida, sedan `/ai-for-marinservice/` (MarinMekaniker som case) och `/ai-for-kliniker/` (din egen bransch, Hagabadet och estetikkliniker).
5. `/ai-automation-goteborg/` som enda geografiska sida. Inga fler ortssidor förrän den rankar; kopierade ortssidor är doorway-straff.

Skriv dem med AI-intervjumetoden (45 minuter per sida i röstläge: AI:n ställer max tio frågor, du svarar med din erfarenhet, AI:n skriver utkastet från dina svar). Det ger text som är din, inte generisk. `Service`-schema per sida, `FAQPage` bara där frågorna faktiskt syns på sidan, `BreadcrumbList` överallt. Sitemap uppdateras och skickas in efter varje sida, IndexNow-ping vid deploy.

Engelska versionen: antingen separata URL:er (`/en/...`) med `hreflang`, eller ingen engelsk version alls på undersidorna. Nuvarande lösning (språkbyte med JavaScript på samma URL) är osynlig för sök och ska inte byggas vidare på för nya sidor. Min rekommendation är svenska först, engelska senare om du faktiskt vill ha engelskspråkiga kunder.

## Fas 3: externa signaler (löpande från vecka 2, mål 2 till 4 per månad)

Utan detta stannar allt på sida två. Ordning efter hur lätt det är att få: kundernas egna webbplatser (en mening "Bokning och uppföljning hanteras av ett system från Skyland AI Solutions" med länk, på Cold Experience, MarinMekaniker, Björn Olsson, Food Traktor), företagsregister och kataloger (Allabolag, Ratsit, Hitta, Eniro, Bolagsfakta) med exakt samma namn och beskrivning, lokalpress (Mölndals-Posten, GP:s företagssidor: pitchen är osteopaten som byggde AI-bolag utan att kunna koda, inte "AI-företag"), Företagarna Mölndal och Business Region Göteborg, poddar och gästinlägg hos branschfolk för hantverkare och kliniker.

Be aldrig om ankartexten "bästa AI-företag". Be om en mening som beskriver vad Skyland gör för vilken kundtyp. Ankartext ska vara varumärke i 40 till 50 % av fallen.

Reviews: be varje kund om ett Google-omdöme via mejl eller SMS, aldrig QR-kod på plats. Fem omdömen med text som nämner tjänsten gör mer för AI-synligheten än tio artiklar.

## Fas 4: frågeartiklar (från månad 2, en per vecka, aldrig fler)

Först när fas 0 till 2 sitter. En artikel per verklig kundfråga, tagen från Search Console-queries, People Also Ask och riktiga säljsamtal. Startlista: vad kostar en AI-telefonist för ett litet företag, AI-telefonist eller telefonsvarare, hur snabbt måste man svara på en webbförfrågan, vad händer med leads som inte följs upp, när lönar sig AI-automation för en marinservice, vad kan automatiseras utan att kundupplevelsen blir opersonlig, AI-agent eller vanligt CRM för ett litet företag.

Varje artikel: "Key takeaways"-block med 3 till 5 punkter överst, direkt svar i första stycket, konkreta exempel med siffror, pris, när det inte passar, författare och uppdateringsdatum, 3 till 5 interna länkar (varje ny artikel länkas från tre gamla plus en tjänstesida). Ett gratisverktyg (missade-samtal-kalkylator: antal missade samtal per vecka gånger snittvärde per jobb) är värt mer än fem artiklar som länkmagnet och tar en eftermiddag i SCC-stacken.

`llms.txt` läggs till som en tiominutersgrej i fas 2 när sidorna finns. Ingen prioritet, ingen förväntan.

## Mätning och loop

Månadsvis, inte oftare: klick och visningar i Search Console (ignorera snittposition), sidor med visningar men få klick (position 11 till 20 är lägst hängande frukt: uppdatera, +100 ord, begär omindexering), Search Consoles nya rapport för generativa AI-funktioner (global sedan 31 aug 2026), Bing Webmaster Tools AI Performance för Copilot-citeringar, trafik med `utm_source=chatgpt.com` i tracker.js/SCC, branded searches på "Skyland AI". Förväntansbild: rörelse månad 3 till 6, tydligt lyft omkring månad 7. Visningar är det tidiga kvittot.

## Sammanfattad ordning

Vecka 1: fas 0 komplett, namnbeslut, GSC och Bing verifierade. Vecka 1 till 2: Om, Kontakt, Case-index, första två casen, GBP, LinkedIn, footer med länkar. Vecka 3 till 6: fem tjänstesidor i ordningen ovan, schema, sitemap, IndexNow. Från vecka 2: två till fyra externa omnämnanden per månad, reviews. Från månad 2: en artikel per vecka, kalkylatorn. Månadsvis: mätning och uppdatering av sidor i position 11 till 20.

## Beslut som behövs innan vi kör

Bekräfta namnet Skyland AI Solutions som det formella. Bekräfta att undersidor får vara enkla statiska sidor med samma header men utan shader och animationer. Säg vilka två case som kan få siffror och godkännande först. Säg om engelska ska finnas på undersidorna eller vänta. Allt i fas 0 kan göras direkt i repot och läggas som PR.
