# KUNSKAPSBAS — Skyland AI Solutions

**Källfil:** Detta dokument är källan till sanning för Skylands kunskapsbas i Supabase pgvector — det Alex (röstagenten) och formulär-AI:n på skylandai.se vet om Skyland. När den uppdateras: kör `python3 scripts/populate_knowledge_base.py` så att kunskapsbasen synkas.

**Språk:** Svenska. Skyland säljer till svenska SMB:er. Engelska översättningar görs vid behov av RAG-systemet, inte i denna källa.

**Senast uppdaterad:** 2026-09-06 (omskriven efter vad Skyland faktiskt erbjuder; gamla paketpriser, Norra Hamnens Bilskola och n8n/React-referenser borttagna)
**Format:** Markdown med tydliga sektioner. Varje H2-sektion blir en chunk. Vissa H3-underavdelningar blir egna chunks.
**Författare:** Joakim Landqvist

---

## Skyland AI Solutions — Vilka vi är

Skyland AI Solutions bygger AI-system för svenska ägarstyrda servicebolag som vill skala, automatisera och frigöra tid. Vi är inte en AI-byrå som säljer verktyg. Vi bygger nervsystem.

Skillnaden är att verktyg sitter oanvända. Nervsystem hanterar verkligheten åt dig — bokningar, offerter, kundkontakt, uppföljningar — medan du gör det du faktiskt är bra på.

Skyland grundades av Joakim Landqvist efter nästan 20 år som osteopat och massageterapeut. Vi vet vad det innebär att driva ett servicebolag där varje timme räknas, och varje administrativ uppgift är timmar du inte fakturerar. Det är därför vi bygger system som tar hand om det medan du jobbar.

Vi är baserade i Mölndal/Göteborg och jobbar främst med kunder i västra Sverige, men kan leverera nationellt.

---

## Vår filosofi — Varför Skyland finns

De flesta företag köper AI-verktyg. Sedan händer ingenting. Verktygen sitter oanvända. Teamet litar inte på dem. Ingen sparade en enda timme.

Skyland säljer inte verktyg. Vi bygger system som funkar.

Vi tror på fyra principer:

**Verklig automation, inte demos.** Det vi bygger ska köra produktion från dag ett. Inga pilotprojekt som dör i en mapp.

**Du äger systemet.** Inga lock-ins. Du har koden, du har datan, du har kontrollen. Vi bygger så att vi kan kliva ur när systemet är moget.

**Människan kvar i loopen.** AI gör det repetitiva. Människan gör det relationella. Vi bygger inte system som ersätter ditt omdöme, vi bygger system som låter dig använda det där det betyder något.

**Pragmatism före teknik.** Vi väljer den enklaste tekniken som löser problemet. Färdiga tjänster där de räcker, egen kod där det behövs. Det som funkar och är underhållbart vinner.

---

## Vad vi gör — Översikt av tjänster

Skyland löser fyra problem som ägarledda serviceföretag känner igen: missade kunder, för mycket admin, luckor i kalendern och förfrågningar som glöms bort. Det gör vi med sju saker som kan kombineras eller köpas separat:

1. **AI-telefonist och röstagent** — svarar i telefon och på sajten dygnet runt, på svenska, kvalificerar och bokar direkt i kalendern.

2. **Automatiserad uppföljning och databasreaktivering** — varje förfrågan följs upp tills den har ett svar, och gamla kunder och leads som tystnat väcks till liv med personliga utskick. Ofta resultatbaserat.

3. **AI-kundservice och smarta kontaktformulär** — besökaren får ett konkret svar inom sekunder i stället för "vi återkommer", och allt hamnar som ett kort i CRM:et.

4. **CRM och Skyland-systemet** — ett ställe för kunder, ärenden, pipeline, bokningar och all kommunikation. Samma system som driver Skyland själva; går att få som egen instans.

5. **Hemsidor som producerar leads** — snabba, mobilanpassade sajter med formulär, bokning och AI-agent inbyggt, och en SEO-grund som gör att de hittas.

6. **Annonser och kampanjer** — Meta-annonser och kampanjer som fyller kalendern, kopplade till uppföljningen så att inget lead tappas. Ofta på provision.

7. **Automation och integrationer** — dina befintliga system (bokning, e-handel, ekonomi, kalender, mejl) börjar prata med varandra så att det manuella klippandet och klistrandet försvinner.
---

## Tjänst: AI-telefonist och röstagent

En telefonist som aldrig är upptagen. Svarar i telefon och på sajten, dygnet runt, på svenska som låter mänsklig. Inte en knapptrycknings-IVR.

Vad den gör:

- Svarar direkt när kunder ringer eller trycker på mikrofonen på sajten
- Ställer rätt följdfrågor och kvalificerar ärendet
- Bokar tider direkt i din kalender och bekräftar
- Svarar på vanliga frågor: priser, öppettider, vad som ingår
- Lämnar över till en människa när det behövs, med hela sammanhanget
- Loggar varje samtal som ett kort i CRM:et

Du kan prova den nu: Alex på skylandai.se är exakt den här tjänsten, i drift, för Skyland själva.

Tekniskt: ElevenLabs Conversational AI med svensk röst, kunskapsbas om din verksamhet, kopplad till kalender och CRM.
---

## Tjänst: Automatiserad uppföljning och databasreaktivering

Det dyraste i ett serviceföretag är inte det som händer — det är det som inte händer. Förfrågan som ingen svarade på. Kunden som var nöjd för åtta månader sedan och sedan aldrig hörde av sig igen.

Två delar:

**Uppföljning.** Varje förfrågan — från formulär, telefon eller mejl — får en sekvens: svar, påminnelse, avslut. Sekvensen stoppar automatiskt när kunden svarar. Du ser allt i CRM:et och kan gripa in när som helst.

**Databasreaktivering.** Vi tar ditt register av gamla kunder och leads som tystnat, skriver personliga meddelanden utifrån vad vi vet om varje person, skickar dem i lagom takt och följer upp. De som svarar bokas in hos dig. Du gör ingenting förrän det är dags att träffa kunden.

Så tar vi betalt för reaktivering: vi börjar med ett gratis test på en avgränsad del av registret så att du ser att det fungerar. Fortsätter vi betalar du per bokad kund eller på provision — aldrig i förskott för något som inte levererat.

Passar bäst där kunder återkommer: kliniker, salonger, verkstäder, tandvård, gym och massage, mäklare med gamla värderingsleads.

Tekniskt: Skylands egen sekvensmotor med suppressionslista, arbetstidsfönster och svarsklassificering. Mejl via egen sändardomän med SPF/DKIM/DMARC.
---

## Tjänst: AI-kundservice och smarta kontaktformulär

Ett kontaktformulär som svarar. Besökaren skriver sin fråga och får inom sekunder ett konkret svar: prisspann, hur det brukar gå till, vad nästa steg är. Inte "tack, vi återkommer inom två arbetsdagar".

Vad det gör:

- Svarar på besökarens fråga direkt, med kunskap om just din verksamhet
- Skapar ett kort i CRM:et med namn, företag, fråga och det svar som gavs
- Poängsätter leadet så att du ringer rätt kund först
- Startar uppföljningen automatiskt om kunden inte går vidare
- Lämnar över till röstagenten om besökaren hellre pratar

Du kan prova det nu: formuläret på skylandai.se är exakt det här, i drift.

Tekniskt: språkmodell med kunskapsbas om din verksamhet, kopplad till CRM och uppföljning. Alla anrop går via servern — inga nycklar i webbläsaren.
---

## Tjänst: CRM och Skyland-systemet

Ett ställe där kunder, ärenden, pipeline, bokningar och all kommunikation samlas — och där AI-agenterna, uppföljningen och kampanjerna hänger ihop i stället för att vara fem verktyg som inte pratar med varandra.

Det finns två sätt att jobba med Skyland:

**Som tjänstekund.** Vi bygger och driver det du behöver — röstagent, uppföljning, kampanj, sajt — i vårt system. Du ser resultatet i din kalender och i rapporter, och slipper tekniken helt.

**Som systemkund.** Du får en egen instans av Skyland-systemet: CRM, pipeline, sekvensmotor, kalender, inkorg för mejl och WhatsApp, och en AI-assistent som jobbar i den. Samma system som driver Skyland själva. Du äger datan och kan exportera allt.

Vad det gör:

- Samlar kunder, ärenden, offerter och kommunikation på ett ställe
- Loggar mejl, samtal och möten automatiskt
- Pipeline som speglar din verkliga säljprocess
- Kalender med Cal.com-bokningar och detaljkort
- Kopplingar mot bokningssystem, ekonomisystem och mejl

Tekniskt: Supabase som databas, modern webbfrontend, allt i EU.
---

## Tjänst: Hemsidor som producerar leads

Hemsidor som gör ett jobb, inte bara ser snygga ut. Snabba, mobil-först, byggda för att en besökare ska bli en förfrågan.

Vad ingår:

- Struktur och texter utifrån vad din målgrupp faktiskt söker efter
- Design och utveckling utan tung plattform — snabb laddning på mobil
- Formulär och bokning kopplade till CRM och uppföljning
- AI-agent eller röstagent på sajten om det passar
- SEO-grund som gör att sajten hittas: sidor per tjänst och ort, strukturerad data, sitemap, Google Business-profil

Exempel: skylandai.se, marinmekaniker.nu, en konstnärs portfoliosajt med serviceavtal, en flerspråkig bokningssajt för en turismaktör i Lappland.

Tekniskt: statisk, snabb frontend på Netlify; formulär och röst mot vår backend.
---

## Tjänst: Annonser och kampanjer

Annonser som fyller kalendern, inte bara ger klick. Vi bygger Meta-kampanjer (Facebook/Instagram) från research och konkurrentanalys, producerar annonsmaterialet och kopplar allt till uppföljningen så att varje lead som kommer in faktiskt får ett svar.

Vad vi gör:

- Analyserar vad som fungerar i din bransch (annonsbibliotek, konkurrenter, säsong)
- Producerar annonser: text, bild, video
- Kör kampanjen och justerar löpande
- Kopplar inkommande leads till uppföljning och bokning
- Rapporterar det som betyder något: bokningar och intäkt, inte bara räckvidd

Så tar vi betalt: ofta på provision eller per resultat, ibland fast månadsavgift — beroende på om resultatet går att mäta hos dig.

Exempel: en tatueringsstudio i Göteborg på provisionsmodell, en kampsportsklubb i Göteborg, säsongsmarknadsföring för en marinmekaniker.

---

## Tjänst: Automation och integrationer

Får dina system att börja prata med varandra. Webbshop till ekonomisystem. Bokningssystem till mejl. Formulär till CRM. Allt det manuella klippandet och klistrandet borta.

Vad vi gör:

- Kartlägger dina nuvarande verktyg och var tiden försvinner
- Bygger automationer som ersätter manuellt arbete — som egen, underhållbar kod i vårt system, inte som sköra klickflöden
- Underhåll och vidareutveckling enligt serviceavtal

Vanliga integrationer: WooCommerce, Fortnox, Google Workspace, Microsoft 365, Cal.com och andra kalendrar, Resend/mejl, WhatsApp Business, betalplattformar.
---

## Case study: Cold Experience

Cold Experience är en turismaktör i Norrland som driver upplevelsepaket med isvandring, snöskor och vinteraktiviteter. Ägare: Gustav.

Problem: Bokningar kom in på fyra språk (svenska, engelska, tyska, polska) men deras gamla sajt hanterade bara ett språk åt gången. Översättning skedde manuellt. Marknadsföringsinnehåll producerades sporadiskt.

Vad vi byggde: Flerspråkig bokningssajt med automatisk översättning via ett headless CMS. Digital broschyr som genereras dynamiskt. Bokningssystem integrerat mot deras kalender. Nu bygger vi nästa steg: ett WhatsApp-intag där förfrågningar från annonser kvalificeras av en AI-agent på fyra språk och landar som kort i CRM:et.

Resultat: Bokningar på alla fyra språk hanteras automatiskt. Tid sparad per vecka uppskattas till 8-10 timmar. Konverteringsgrad ökade märkbart efter snabbare laddningstider och mobiloptimering.

Tekniskt: modern webbfrontend, Supabase, headless CMS, auto-översättning via språkmodell, WhatsApp Business API.

---

## Case study: MarinMekaniker

MarinMekaniker.nu är en marinmekaniker i västra Sverige som servar båtmotorer, propellrar och elsystem. Ägare: Thomas.

Problem: Offerter och fakturor hanterades manuellt i e-post och pärmar. Återkommande kunder fick inte den uppföljning som skulle leda till mer arbete. Ingen samlad bild av vilka kunder som hade vilka båtar.

Vad vi byggde: Ny sajt (marinmekaniker.nu) med orderformulär som går direkt till CRM och mejl, kundhantering och ärendehantering, samt säsongsmarknadsföring inför vår och höst. Tvåspråkig (svenska/engelska) eftersom flera kunder är utländska båtägare.

Resultat: Tider och offerter hanteras nu i ett system. Återkommande kunder får automatisk påminnelse om service. Tid sparad per vecka cirka 5 timmar.

Tekniskt: snabb webbfrontend, Supabase, orderflöde i Skyland-systemet. Driftavtal.

---

## Case study: Hasselblads Livs

Hasselblads Livs är en livsmedelshandel som driver e-handel via Solängens Frukt & Grönt AB. Ägare: Axel.

Problem: WooCommerce-shoppen krävde manuell hantering av produktbilder. Varje ny produkt behövde bild, beskrivning och kategorisering — det tog timmar varje vecka. Kreditkundshantering skedde i Excel.

Vad vi byggde: AI-driven bildautomation som söker upp, väljer och beskär produktbilder automatiskt. Integration mot WooCommerce. Kundkort och kreditplånbok-system föreslaget för fas 2.

Resultat: Produktupplägg som tog 30 minuter per produkt tar nu under 5. Bildkvalitet konsekvent. Tid sparad per vecka cirka 6 timmar.

Tekniskt: webbapp med bildsökning, språkmodell för beskrivningar och bildhantering, allt integrerat mot WooCommerce. Löpande serviceavtal.

---

## För bygg- och hantverksföretag

En byggare med 8-15 anställda får ofta 30-50 förfrågningar i veckan. Av dem hinner man kanske svara på hälften samma dag. De andra hamnar i en mejlhög som öppnas på fredag kväll, eller på måndag morgon när nästa vecka redan börjat. Då har kunden ofta redan ringt två konkurrenter.

Det är där affärerna tappas. Inte på pris. Inte på kvalitet. På att svaret kom för sent.

Räkna lågt: om en byggare tappar två offert-förfrågningar i veckan på grund av sen respons, och en av tio förfrågningar normalt blir ett uppdrag på 50 000 kr, motsvarar det cirka 500 000 kr i förlorad omsättning per år. Bara från långsamma svar.

Det vi bygger är ett första-svar-system. Kunden fyller i ett formulär eller pratar med en AI-agent på telefon, och får inom minuter ett konkret svar: prisspann, ungefärlig tidsram, vad som typiskt ingår. Sen följer ett mejl där en personlig offert utlovas inom 24 timmar.

Det fångar typiskt 70-80% av rutinärenden direkt. Du eller dina platschefer ringer bara tillbaka när det är något verkligt att diskutera.

Konkreta byggstenar:
- AI-formulär som ställer rätt följdfrågor (typ av projekt, ungefärlig yta, tidsram)
- Automatiska första-svar med spann baserade på er prislista
- Enkel materialkalkylator där kunden får ett första materialspann som komplement
- Kalenderintegration så kunden kan boka platsbesök direkt
- CRM som loggar alla förfrågningar och påminner om uppföljning

Vad det kostar beror på omfattning och på om resultatet går att mäta — då kan vi ofta jobba resultatbaserat med ett gratis test först. Du får en konkret offert efter ett kort samtal.

---

## För hotell, B&B och korttidsuthyrning

Ett mindre hotell eller B&B med 10-30 rum får hundratals frågor i veckan från Booking, Airbnb, telefon och mejl. Varje obesvarat meddelande är en gäst som överväger att boka någon annanstans. Varje sen check-in-fråga blir en grund till att klaga i efterhand.

Det som kostar mest är inte tiden personalen lägger på att svara. Det är gästerna som aldrig bokar för att de inte fick svar i tid, och recensionerna som blir tre stjärnor istället för fem för att frukosten kom som en överraskning.

Räkna lågt: två missade bokningar i veckan á 1 500 kr per natt, snitt 2 nätter — det motsvarar drygt 300 000 kr i förlorad omsättning per år. Lägg till lägre review-betyg som påverkar synlighet på Booking, och hela kalkylen blir betydligt större.

Det vi bygger är ett samordnat svarssystem. En AI som svarar på vanliga gästfrågor inom minuter på alla kanaler, kopplad till ert befintliga bokningssystem så att svar är personliga (rätt rumsnummer, rätt incheckningsdag). Pre-stay-mejl med praktisk info så att gästen vet vad som väntar. Post-stay-mejl med review-länk när minnet är färskt.

Konkreta byggstenar:
- AI-baserade svar på vanliga frågor på engelska och svenska
- Automatiska pre-stay och post-stay mejl med personlig info
- Personliga tilläggsförslag i pre-stay-mejlet baserat på bokningstyp (frukost, sen utcheckning, parkering)
- Integration mot er PMS (Mews, Cloudbeds, Sirvoy etc) eller bokningskalender
- Review-management som påminner gäster att lämna omdöme

Vad det kostar beror på omfattning och på om resultatet går att mäta — då kan vi ofta jobba resultatbaserat med ett gratis test först. Du får en konkret offert efter ett kort samtal.

---

## För restauranger och caféer

Restauranger tappar bord på två sätt: missade samtal under lunchrushen, och no-shows som lämnar bord tomma på lördagskvällar. Båda går att räkna på.

Ett ställe med 30-80 platser får 50-150 bokningsförfrågningar i veckan. Av telefonsamtalen som kommer under rushen blir 10-20% missade — personalen är upptagen med gäster som redan är där. De som inte når fram bokar någon annanstans, eller skippar restaurangbesök helt.

Räkna lågt: fem missade bokningar i veckan á tre kuvert á 400 kr motsvarar cirka 300 000 kr i förlorad omsättning per år. Lägg till två no-shows i veckan på sex kuvert: ytterligare runt 250 000 kr i tomma bord. Tillsammans är det halv miljon årligen, inte i förlorad vinst utan i ren intäkt som aldrig kommer in.

Det vi bygger är ett system där bokningar tas emot dygnet runt utan att personal behöver svara. AI:n hanterar bokningsändringar, no-show-påminnelser och svarar på frågor om öppettider, allergener, gruppstorlekar. Personalen ringer bara tillbaka när det är något verkligt unikt.

Konkreta byggstenar:
- AI-bokningsagent på telefon eller chat som hanterar 80-90% av bokningar
- Automatiska SMS-påminnelser dagen innan för att minska no-shows
- Integration mot ert kassasystem för bordhantering
- Schemaläggningsstöd som föreslår bemanning baserat på bokningsvolym kommande vecka

Vad det kostar beror på omfattning och på om resultatet går att mäta — då kan vi ofta jobba resultatbaserat med ett gratis test först. Du får en konkret offert efter ett kort samtal.

---

## För frisörer, skönhetssalonger och spa

Frisörer lever på återkommande kunder. Det stora problemet är inte att få nya — det är att hålla befintliga utan att lägga halva dagen på telefon. När en kund inte får tag på dig för att boka om, går de till en annan salong.

En salong med 4-8 anställda får 80-200 bokningar och ändringar i veckan. När frisörerna sitter med kunder svarar ingen i telefonen. När personalen ringer tillbaka efter två timmar har kunden redan bokat någon annanstans, eller skjutit upp besöket helt.

Räkna lågt: tio missade bokningar i månaden á 700 kr motsvarar 84 000 kr per år i direkt tapp. Om fem av de förlorade kunderna inte kommer tillbaka — kund som annars besökt var sjätte vecka, cirka 8-9 gånger per år — är det ytterligare runt 30 000 kr per år i tappad återkommande intäkt. Tillsammans 100 000-150 000 kr per år. Lägg till no-shows utan påminnelse, vanligen 15-25% av bokade tider, och kalkylen växer ytterligare.

Det vi bygger är ett komplett bokningsekosystem där kunder själva bokar, ändrar och avbokar tider. AI:n påminner inför besöket, följer upp efteråt, och bokar in nästa tid när det är dags. Salongen koncentrerar sig på själva arbetet, inte på telefonsamtal.

Konkreta byggstenar:
- Bokningssida med rätt tider hos rätt frisör/terapeut
- Automatiska SMS-påminnelser 24h innan och 2h innan
- AI som svarar på vanliga frågor (priser, behandlingstider, produkter)
- Återkommande-bokningssystem som föreslår nästa tid baserat på behandlingstyp

Vad det kostar beror på omfattning och på om resultatet går att mäta — då kan vi ofta jobba resultatbaserat med ett gratis test först. Du får en konkret offert efter ett kort samtal.

---

## För konsultbyråer och tjänsteföretag

För en konsultbyrå är tid produkten. Varje minut som läggs på administration är en minut som inte faktureras. Mindre byråer med 2-15 konsulter lägger typiskt 15-25% av sin tid på arbetsuppgifter som inte är direkt klientarbete: mejlhantering, offerter, fakturapåminnelser, statusuppdateringar.

För en konsult som fakturerar 1 800 kr per timme och arbetar 1 500 timmar per år motsvarar 20 procent admin cirka 540 000 kr i kapacitetsvärde — per konsult, per år. Allt går inte automatiskt att omvandla till ny fakturering, men varje frigjord timme ökar utrymmet för debiterbart arbete, mer pipeline-aktivitet eller mindre övertid. Plus försenade fakturor som ligger 60-90 dagar utestående och tär på kassaflödet.

Det vi bygger är AI-system som tar bort återkommande administration. Offert-mallar som genereras automatiskt baserat på projekttyp. Tidrapportering som följer upp sig själv via kalenderintegration. Klientportaler där kunder själva ser status, dokument och fakturor utan att ringa.

Konkreta byggstenar:
- Offertgenerator baserad på projekttyp och omfattning
- Klientportaler med dokumenthantering och statusöversikt
- Automatiserad tidrapportering kopplad till kalendrar och projektsystem
- Automatiska fakturapåminnelser med eskaleringssteg, integrerat mot ert bokföringssystem
- Onboarding-flöden för nya klienter (NDA, GDPR-godkännande, dokument)

Vad det kostar beror på omfattning och på om resultatet går att mäta — då kan vi ofta jobba resultatbaserat med ett gratis test först. Du får en konkret offert efter ett kort samtal.

---

## För mindre e-handelsföretag

E-handelsföretag tappar pengar på två fronter: kunder som överger köp för att de inte får svar på en fråga i checkout, och support-kostnader som växer exponentiellt med orderflödet.

När en kund undrar om en tröja finns i större storlek och inte får svar inom 30 minuter, klickar en stor andel bort. När returprocessen kräver att man mejlar och väntar två dagar på instruktioner, hamnar nästa-gångs-köp på en annan sajt.

Räkna lågt: en e-handel som omsätter 5 miljoner kr per år och tappar 3% av sina checkout-besökare på obesvarade frågor förlorar runt 150 000 kr per år bara där. Lägg till support-tid som växer från 5 timmar i veckan till 25 timmar i veckan när orderflödet tredubblas — och plötsligt behövs en ny anställning.

Det vi bygger är ett samordnat system där AI:n svarar på vanliga frågor på alla kanaler — chatt, mejl, sociala medier — baserat på era faktiska produktdata och orderhistorik. När en kund frågar var deras paket är, kollar AI:n direkt mot er fraktleverantör. När någon undrar om en produkt finns i en viss storlek, kollar AI:n lagersaldo i realtid.

Konkreta byggstenar:
- AI-chatbot kopplad till er produktkatalog och orderdatabas
- Automatiserad retur-hantering där kunder själva startar processen
- Integration mot Shopify, WooCommerce, Centra eller andra plattformar
- Sentimentsanalys på kundfeedback för att fånga problem tidigt

Vad det kostar beror på omfattning och på om resultatet går att mäta — då kan vi ofta jobba resultatbaserat med ett gratis test först. Du får en konkret offert efter ett kort samtal.

---

## För mäklare och fastighetsförmedling

Mäklare hanterar leads i hundratal. Få av dem blir affärer på kort sikt, men alla kräver uppföljning. Mindre mäklarbyråer med 2-10 mäklare tappar ofta affärer på att leadshanteringen inte hänger med — folk faller mellan stolarna när det är högsäsong.

Räkna lågt: om en mäklare tappar 80 leads i månaden på svag uppföljning, och bara 0,5-1 procent av dem hade blivit affär inom 12-24 månader, motsvarar det cirka 5-10 affärer per år. Vid 50 000 kr i provisionsintäkt per affär är det 250 000-500 000 kr i möjlig provision som aldrig konverteras.

Det vi bygger är ett system som tar emot leads från Hemnet, Booli, sociala medier och egna sajten, kvalificerar dem automatiskt, och bokar in visningsbesök eller värderingsmöten utan att mäklaren behöver lyfta luren förrän det är något konkret. Påminnelser inför visningar, automatiska uppföljningar dagar och veckor efteråt.

Konkreta byggstenar:
- Lead-kvalificering baserad på objekttyp, prisklass och tidsram
- Automatiska visningsbokningar med kalenderintegration
- Uppföljningssekvenser efter visningar (dagar 1, 7, 30 efter)
- Värderingsförfrågningar via formulär med automatiserade första-svar

Vad det kostar beror på omfattning och på om resultatet går att mäta — då kan vi ofta jobba resultatbaserat med ett gratis test först. Du får en konkret offert efter ett kort samtal.

---

## För tandläkarmottagningar, naprapater och fysioterapeuter

Mindre vårdmottagningar har en specifik utmaning: bokningssystemet måste fungera 100%, men personalen sitter ofta med patienter och kan inte svara på telefon i realtid. När en patient inte får tag på receptionen för att boka om, går de antingen till en annan klinik — eller hoppar över besöket helt.

En klinik med 3-8 behandlare tar emot 100-300 bokningsförfrågningar i veckan. Missade samtal under behandlingstid betyder förlorade bokningar. Och no-shows som inte påminns kostar dubbelt: en tom tid som inte fylls, plus den behandlare vars schema är luckigt resten av dagen.

Räkna lågt: tre missade samtal per dag, varav en tredjedel hade lett till bokning á 800 kr — det motsvarar cirka 200 000 kr per år i förlorad omsättning. Lägg till no-shows utan påminnelse, vanligen 10-20% av bokade tider. Systematiska översikter visar att SMS- och telefonpåminnelser kan minska uteblivna besök markant jämfört med inga påminnelser, vilket på en mellanstor klinik kan motsvara ytterligare 100 000-200 000 kr per år i återvunnen kapacitet.

Det vi bygger är ett system som hanterar rutinärenden helt automatiskt så receptionen får tid över för det som faktiskt kräver mänsklig handpåläggning. AI:n svarar på vanliga frågor inom minuter, hanterar bokningsändringar utan att någon behöver ringa tillbaka, och påminner patienter inför besök.

Konkreta byggstenar:
- AI-baserad bokningsagent som hanterar nyboknings- och omplaneringsförfrågningar
- Automatiska SMS-påminnelser 24h och 2h innan besök
- Frågor om priser och försäkring besvaras automatiskt baserat på era prislistor
- Integration mot befintligt bokningssystem där det är tekniskt och juridiskt möjligt

Viktigt: Vi bygger inom ramen för Patientdatalagen (PDL) och vårdens dataskyddsregler. All hantering av personuppgifter sker EU-baserat och i enlighet med GDPR och dataskyddsförordningen för vårdsektorn. Journaldata hanteras bara om kunden redan har godkända system, avtal och dataskyddsstruktur på plats — vi tar inte ansvar för att etablera den infrastrukturen.

Vad det kostar beror på omfattning och på om resultatet går att mäta — då kan vi ofta jobba resultatbaserat med ett gratis test först. Du får en konkret offert efter ett kort samtal.

---

## Paketet: Resultatbaserat samarbete

För det som går att mäta — bokningar, återvunna kunder, leads från annonser — tar vi hellre betalt på resultat än i förskott.

Så går det till:

- Vi börjar med ett gratis, avgränsat test: en del av ditt register, en kanal, en bestämd period
- Innan testet skriver vi ner vad som gäller om det fungerar: vad en bokad kund eller genomförd affär kostar, och hur det mäts
- Mätningen sker via vår länk, vårt nummer eller din kalender — inte via uppskattningar
- Fungerar det fortsätter vi på de villkoren. Fungerar det inte har det inte kostat dig något

Passar för: databasreaktivering, annonskampanjer med bokning som mål, uppföljningssekvenser.

Kräver: att resultatet går att koppla till oss. Går det inte att mäta erbjuder vi fast pris i stället.
---

## Paketet: Fast pris per projekt

För det som byggs en gång: hemsida, röstagent, formulär-AI, integration, CRM-uppsättning.

Så går det till:

- Kort samtal och behovsanalys
- Offert med fast pris och leveranstid — inga löpande timmar som drar iväg
- Bygg i korta steg med avstämning varje vecka
- Driftsättning, utbildning och dokumentation ingår
- Du äger det som byggts

Vill du ha det underhållet och vidareutvecklat efteråt tecknar du ett serviceavtal (se nedan). Vill du klara dig själv går det också bra.
---

## Paketet: Skyland-systemet som prenumeration

För dig som vill ha hela systemet, inte bara en del: CRM, pipeline, uppföljningsmotor, kalender, inkorg för mejl och WhatsApp, och en AI-assistent som jobbar i det. Samma system som driver Skyland själva, som en egen instans för din verksamhet.

Vad ingår:

- Egen instans med din data, i EU
- Uppsättning anpassad efter din säljprocess och dina kanaler
- Löpande drift, uppdateringar och support
- Vidareutveckling i takt med att systemet växer
- Export av all data när du vill — inget lock-in

Månadsavgift efter omfattning. Boka ett samtal så visar vi systemet live och räknar på vad det skulle innebära för dig.
---

## Paketet: Drift- och serviceavtal

Om något går sönder vill du veta hur snabbt du får hjälp. Det är precis det serviceavtalet handlar om — tydliga svarstider när systemet krånglar, och löpande underhåll så att det inte krånglar i onödan. Du slipper ligga vaken och undra vem som fixar en akut driftstörning en tisdagmorgon.

Avtalet gäller system och sajter vi byggt eller tagit över. Det säkerställer att allt funkar, att säkerhetsuppdateringar sköts, och att systemet utvecklas vidare i takt med dina behov.

Månadsavgift efter omfattning — en enkel sajt kostar en bråkdel av ett helt system.

Vad ingår:

- Månatlig statusgenomgång
- Säkerhetsuppdateringar och backuper
- Felsökning vid driftstörningar
- Mindre vidareutveckling enligt timpott
- Tillgång till support via mejl och telefon

**Svarstider och prioritering:**

*Kritiskt ärende* (systemet är nere, hela verksamheten påverkas):
Bekräftelse inom 2 timmar under kontorstid (08-17, vardagar). Påbörjad felsökning samma arbetsdag.

*Driftstörning* (delar fungerar inte, men verksamheten kan fortsätta):
Bekräftelse inom 24 timmar. Lösning inom 3 arbetsdagar.

*Vidareutveckling och justeringar* (nytt önskemål, inte fel):
Bekräftelse inom 48 timmar. Schemaläggs i nästa utvecklings-sprint, vanligen inom 2 veckor.

*Jourtid utanför kontorstid* är inte standard men kan tilläggas mot avgift för verksamheter som kräver det (t.ex. e-handel med dygnetruntorder).

Avtalet har 2 månaders uppsägningstid och kan när som helst skalas upp eller ner beroende på dina behov.
---

## FAQ: Vad kostar det?

Det beror på vad du behöver, och på om resultatet går att mäta.

Går det att mäta — bokningar, återvunna kunder, leads från annonser — tar vi hellre betalt på resultat: ett gratis test först, sedan per bokad kund eller på provision. Då kostar det inget förrän det har levererat.

Byggs något en gång — en hemsida, en röstagent, en integration — får du en offert med fast pris efter ett kort samtal. Inga timdebiteringar som drar iväg.

Vill du ha hela Skyland-systemet som egen instans, eller drift och vidareutveckling av det vi byggt, är det en månadsavgift efter omfattning.

Vi säger inga siffror förrän vi vet vad du behöver, för då blir de fel. Boka ett samtal så räknar vi tillsammans, och du får en konkret siffra att ta ställning till.
---

## FAQ: Hur lång tid tar det?

Beror på vad det gäller. Riktlinjer:

- Röstagent eller formulär-AI på befintlig sajt: 1-2 veckor
- Uppföljningssekvens eller reaktiveringstest: igång inom en vecka, testet löper 2-4 veckor
- Annonskampanj: första annonserna live inom 1-2 veckor
- Hemsida: 3-6 veckor
- Eget Skyland-system: uppsatt och i drift inom 2-4 veckor

Vi jobbar iterativt. Du ser resultat tidigt och kan styra under tiden. Inget byggs i tysthet i tre månader för att sedan presenteras.
---

## FAQ: Vad händer om vi inte vill fortsätta?

Du äger allt vi byggt. Koden är din. Datan är din. Du kan ta över själv eller anlita någon annan att underhålla det.

Vi tror inte på lock-in. Om du vill avsluta vårt samarbete så hjälper vi dig att överlämna systemet ordentligt. Vi vill att du stannar för att det är värt det, inte för att du inte kan komma loss.

Driftavtal har 2 månaders uppsägningstid.

---

## FAQ: Hur vet jag om det är värt det?

Räkna på vad det kostar dig idag att inte ha det. Hur mycket tid lägger du på administration? Hur många leads tappar du för att uppföljningen inte sker? Hur mycket av din tid går åt till saker som inte producerar intäkter?

Vi gör räkneövningen tillsammans i första samtalet. Om siffrorna inte talar för en investering så säger vi det.

Där resultatet går att mäta tar vi risken själva: gratis test först, betalt per resultat sedan. Där något byggs en gång räknar vi ut återbetalningstiden i sparad tid eller vunna affärer innan du bestämmer dig. Talar siffrorna inte för det säger vi det.

---

## FAQ: Vi har redan ett system, kan ni jobba med det?

Oftast ja. Vi är pragmatiska och bygger gärna ovanpå eller bredvid det du redan har istället för att riva och bygga nytt. Många av våra projekt handlar om att få existerande system att börja prata med varandra.

Det vi inte gillar att jobba med är gamla, oöverskådliga monolithar där varje ändring riskerar att bryta något annat. Då rekommenderar vi en gradvis migration istället för fortsatt patchning.

Berätta vad du har så ger vi en ärlig bedömning av vad som är möjligt.

---

## FAQ: Är det säkert att lita på AI?

Beror på vad du menar med "lita på". Vi bygger system där:

- AI gör det repetitiva, människan tar besluten som spelar roll
- All data lagras inom EU enligt GDPR
- Du har full insyn i vad systemet gör och kan stänga av det när du vill
- Vi loggar tillräckligt för att kunna felsöka om något går fel

Vi bygger inte system som fattar beslut åt dig som du inte kan ångra eller granska. Vi bygger system som hanterar volym och repetition så att du kan fokusera på det som behöver mänskligt omdöme.

---

## FAQ: Måste vi vara tekniska för att jobba med er?

Nej. De flesta av våra kunder är inte tekniska. De driver livsmedelshandel, marinverkstad, turismverksamhet, tatueringsstudio, kampsportsklubb. De vet sin bransch, vi vet tekniken.

Vi pratar svenska, inte teknisk jargong. Vi förklarar vad vi bygger och varför. Du behöver inte förstå koden — du behöver förstå vad systemet gör för ditt företag.

Utbildning av ditt team ingår när vi bygger något åt dig.

---

## Om Joakim Landqvist

Skyland grundades 2025 av Joakim Landqvist efter snart 20 år som osteopat och massageterapeut. Bakgrunden formar hur Skyland jobbar.

Som osteopat lärde sig Joakim att förtroende inte byggs genom övertalning. Det byggs när händerna gör vad munnen lovat. En patient som ligger på britsen och känner att smärtan släpper behöver ingen broschyr. På samma sätt bygger Skyland system som bevisar sig själva genom att fungera, inte genom marketing-fraser.

Tidigare bakgrund inkluderar utbildning och praktik som gymnastiklärare. Joakim har också tränat Systema och Xing Yi Quan i många år, och tar med sig kroppskännedom och mönsterigenkänning till sitt arbete.

Skyland är en enmansverksamhet med ett etablerat nätverk av specialister som tas in när projekt kräver det. Det betyder snabba beslut, direkt kommunikation och inga lager mellan dig och den som faktiskt bygger.

---

## Vår ICP — Vilka vi jobbar bäst med

Skyland passar bäst för:

- Ägarstyrda servicebolag med 2-15 anställda
- Verksamhet med 1-20 miljoner kr i årsomsättning
- Verksamheter där tid är den begränsade resursen
- Beslutsfattare som vet vad de vill men inte hur de ska bygga det
- Företag som vill äga sina system, inte hyra dem

Skyland passar mindre bra för:

- Stora bolag med komplex inköpsprocess och 6-månaders beslutscykler
- Företag som vill ha någon att ringa när något går fel utan att förstå systemet
- Verksamheter som söker billigaste möjliga lösning utan kvalitetskrav
- Projekt där priset ska konkurrera mot offshore-utveckling

Är du osäker på om vi passar varandra? Boka ett samtal. Vi säger ärligt om vi tror att vi är rätt för dig eller inte.

---

## Vad vi inte gör

Vi får ofta frågan om vi bygger mobilappar, designar logotyper eller sköter IT-support. Svaret är nej. Vi bygger inte heller hårdvara och vi utvecklar inte bokföringssystem från grunden — däremot integrerar vi mot de system som redan finns.

Det handlar inte om att vi inte kan, utan om att vi valt att vara riktigt bra på det vi gör: AI-agenter, uppföljning, kampanjer och system som ger ägarledda serviceföretag fler kunder och färre timmar admin. Allt annat lämnar vi till specialister som faktiskt är bäst på det.

Konkret ligger följande utanför vår verksamhet:

- Hårdvaruutveckling och fysiska enheter
- Logotypdesign och varumärkesidentitet utanför webbprojekt
- Större bokföringssystem från grunden — vi integrerar mot existerande
- Generella IT-supportavtal för datorer och nätverk
- Apputveckling för iOS och Android som primär leverans
- Annonser eller SEO som fristående byråtjänst utan koppling till uppföljning och bokning — vi gör det som del av ett system som ska ge kunder, inte som räckviddsrapporter

Vi rekommenderar gärna kunniga partners om ditt behov ligger utanför vår scope. Bättre att du får rätt hjälp än fel hjälp från oss.
---

## Hur vi jobbar — Process

**Steg 1: Förutsättningslöst samtal (15-30 min, gratis).** Du beskriver din situation. Vi lyssnar och ställer frågor. Inga säljpitchar.

**Steg 2: Behovsanalys (1-2 timmar).** Vi går igenom dina arbetsflöden mer i detalj. Identifierar vad som är värt att automatisera först. Du får en första bild av möjligheter.

**Steg 3: Förslag.** Antingen ett gratis, avgränsat test med villkoren för fortsättningen nedskrivna, eller en offert med fast pris och leveranstid. Du tar beslutet på lugn och ro.

**Steg 4: Bygg.** Vi bygger iterativt. Du ser progressen och kan styra under tiden. Korta avstämningar varje vecka.

**Steg 5: Driftsättning och utbildning.** Systemet går live. Ditt team utbildas. Du tar över ägandet.

**Steg 6: Drift och vidareutveckling (valfritt).** Serviceavtal om du vill ha löpande support och utveckling. Annars klarar du dig själv eller tar in någon annan.

---

## Onboarding — Hur det går till från ditt perspektiv

Många undrar vad som händer efter första samtalet. Här är hur det typiskt ser ut för en kund som väljer att jobba med oss:

**Första samtalet (15 minuter, gratis)**
Vi pratar om din situation. Du beskriver vad som tar tid eller vad som inte funkar. Vi lyssnar och ställer följdfrågor. Inget krav på beslut efteråt — du går därifrån med en bättre förståelse av vad som är möjligt, oavsett om vi jobbar tillsammans eller inte.

**Behovsanalys (1-2 timmar, hos er eller via video)**
Om vi båda känner att det finns en fit, kommer vi närmare. Vi går igenom dina arbetsflöden konkret: hur tar bokningar in idag, vart landar leads, hur hanteras offerter. Du visar oss systemen ni redan har. Vi noterar var tiden faktiskt försvinner.

Du behöver avsätta runt 2 timmar för det här mötet. Plus förmodligen en timme efter mötet för att samla ihop tillgångar vi behöver — inloggningar till era nuvarande system, exempel på hur ärenden hanteras idag, eventuella bilder eller texter ni vill återanvända.

**Förslag**
Inom en vecka efter behovsanalysen får du ett konkret förslag. Går resultatet att mäta föreslår vi ett gratis test med villkoren för fortsättningen nedskrivna. Byggs något en gång får du en offert med fast pris: vad vi bygger, vad det kostar, när det levereras. Inga vaga uppskattningar.

**Bygg-fasen (varierar beroende på omfattning)**
När du sagt ja kör vi igång. Du får löpande avstämningar — vanligen en kort video varje vecka där vi visar progressen. Du kan styra under tiden om något känns fel.

Din tidsåtgång under bygg-fasen är typiskt 30-60 minuter per vecka för avstämningar, plus eventuella frågor när vi behöver din input på specifika beslut. Du bygger inte själv — vi gör det. Men vi behöver ditt omdöme för att bygga rätt sak.

**Driftsättning och utbildning**
Systemet går live. Ditt team utbildas — vanligen en workshop på 1-2 timmar där vi går igenom hur systemet används i vardagen. Skriftlig dokumentation följer med så att nya medarbetare kan komma in i systemet senare utan att vi behöver vara med.

**Efter lansering**
Du äger systemet. Vill du ha löpande support och vidareutveckling tecknar vi ett serviceavtal med månadsavgift efter omfattning. Vill du klara dig själv går det också bra — koden är din.

**Total tid från första samtal till live-system:**

- Röstagent eller formulär-AI: 1-2 veckor
- Reaktiveringstest: igång inom en vecka
- Hemsida med automation: 4-8 veckor
- Eget Skyland-system: 2-4 veckor

Ingen kund har behövt avsätta mer än några timmar i veckan av sin egen tid under bygg-fasen. Det är vårt jobb att bygga, ditt jobb att driva din verksamhet.

---

## Kontakt och boka samtal

Vill du ha ett första samtal? Boka 15 minuter direkt i Joakims kalender.

Det enklaste är att boka via vår sajt (knappen Boka går till Joakims kalender) eller be Alex, röstagenten på sajten — hon kan lägga in mötet direkt.

E-post: <joakim@skylandai.se>
Bas: Mölndal/Göteborg
Räckvidd: hela Sverige
