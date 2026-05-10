# KUNSKAPSBAS — Skyland AI Solutions

**Källfil:** Detta dokument är källan till sanning för Skylands kunskapsbas i Supabase pgvector. När den uppdateras ska TICKET-V01-skriptet köras om så att kunskapsbasen synkas.

**Språk:** Svenska. Skyland säljer till svenska SMB:er. Engelska översättningar görs vid behov av RAG-systemet, inte i denna källa.

**Senast uppdaterad:** 2026-05-04
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

**Pragmatism före teknik.** Vi väljer den enklaste tekniken som löser problemet. n8n över custom kod. Supabase över egen databas. Det som funkar och är underhållbart vinner.

---

## Vad vi gör — Översikt av tjänster

Skyland erbjuder sex kärnområden. Alla kan kombineras eller köpas separat.

1. **CRM-system och kundhantering** — En plats där alla kunder, ärenden och kommunikation samlas. Bygger på Supabase, anpassat efter ditt sätt att jobba.

2. **AI-agenter och chatbottar** — Agenter som svarar på frågor, kvalificerar leads, bokar möten. Tränade på din verksamhet, inte generiska modeller.

3. **Voiceflows och röstlösningar** — Telefoniagenter som svarar i kundtjänst, bokar tider, hanterar enkla ärenden. ElevenLabs Conversational AI.

4. **Hemsidor och webbutveckling** — Konverteringsoptimerade sajter som faktiskt producerar leads. React, modern stack, snabb leverans.

5. **Prompt engineering och AI-strategi** — Hjälp att förstå vad AI faktiskt kan göra för dig och vad som är hype. Konkret, branschspecifikt.

6. **Automation och integrationer** — n8n-baserade arbetsflöden som kopplar ihop dina existerande system. WooCommerce, Fortnox, Mailchimp, kalendrar — det som finns kopplas ihop och börjar prata.

---

## Tjänst: CRM-system och kundhantering

Vi bygger CRM som passar dig, inte tvärtom. De flesta off-the-shelf CRM tvingar dig att jobba enligt deras logik. Vi börjar med ditt sätt att jobba och bygger systemet runt det.

Vad det gör:

- Samlar kunder, ärenden, offerter, kommunikation på ett ställe
- Automatisk loggning av mejl, samtal, möten
- Pipeline som speglar din verkliga säljprocess
- Integrationer mot bokningssystem, ekonomisystem, mejl

Tekniskt: Supabase som backend, React som frontend. Du äger databasen och kan exportera allt när du vill.

Typisk leverans: 2-4 veckor från start till produktion.

---

## Tjänst: AI-agenter och chatbottar

AI-agenter som faktiskt vet vad ditt företag gör. Tränade på dina tjänster, dina priser, dina vanliga frågor. Inte generiska ChatGPT-bottar.

Vad de gör:

- Svarar på besökarfrågor på hemsidan dygnet runt
- Kvalificerar leads innan de når dig
- Bokar möten direkt i din kalender
- Skickar offerter när det passar
- Loggar alla samtal i ditt CRM

Tekniskt: Claude eller GPT som motor, n8n för logik, kunskapsbas i Supabase pgvector. Anpassningsbara verktygsanrop mot dina egna system.

Typisk leverans: 1-3 veckor.

---

## Tjänst: Voiceflows och röstlösningar

Telefoniagenter som låter mänskliga, talar svenska flytande och hanterar verkliga kundärenden. Inte robot-IVR.

Vad de gör:

- Svarar i kundtjänst när du inte hinner
- Bokar tider och bekräftar bokningar
- Tar emot beställningar och frågar rätt följdfrågor
- Eskalerar till människa när det behövs

Tekniskt: ElevenLabs Conversational AI med svensk röstmodell. Integrerad mot kalender, CRM och ekonomisystem.

Användningsfall vi byggt: bokningssystem för servicefirmor, kundservice för e-handel, enklare orderhantering.

---

## Tjänst: Hemsidor och webbutveckling

Hemsidor som producerar leads, inte bara ser snygga ut. Konverteringsfokuserade, snabba, mobil-first.

Vad ingår:

- Strategi och struktur baserat på din målgrupp
- Design och utveckling i React
- Integrerade formulär kopplade till CRM
- AI-agent eller chattbott på sajten om det passar
- SEO-grund som faktiskt funkar

Tekniskt: React, modern stack, Netlify-deploy. Snabb laddning, ingen WordPress-överfett.

Typisk leverans: 3-6 veckor beroende på komplexitet.

---

## Tjänst: Prompt engineering och AI-strategi

För dig som inte vill ha system byggt, men vill förstå vad AI kan göra för ditt företag. Konkret rådgivning, inte hype.

Vad du får:

- Genomgång av dina arbetsflöden och var AI passar
- Konkret prioritering av vad som är värt att automatisera först
- Hands-on sessioner där vi bygger prompts och flöden tillsammans
- Underlag för att fatta investeringsbeslut

Format: vanligen halvdags- eller heldagsworkshops, ibland följt av kortare uppföljningar.

---

## Tjänst: Automation och integrationer

Får dina system att börja prata med varandra. WooCommerce till Fortnox. Bokningssystem till mejl. Formulär till CRM. Allt det manuella klippandet och klistrandet borta.

Vad vi gör:

- Kartlägger dina nuvarande verktyg och flöden
- Bygger automationer i n8n som ersätter manuellt arbete
- Hostar n8n hos oss eller hos dig
- Underhåll och vidareutveckling enligt avtal

Vanliga integrationer: WooCommerce, Fortnox, Mailchimp, Google Workspace, Microsoft 365, kalendersystem, betalplattformar.

---

## Case study: Cold Experience

Cold Experience är en turismaktör i Norrland som driver upplevelsepaket med isvandring, snöskor och vinteraktiviteter. Ägare: Gustav.

Problem: Bokningar kom in på fyra språk (svenska, engelska, tyska, polska) men deras gamla sajt hanterade bara ett språk åt gången. Översättning skedde manuellt. Marknadsföringsinnehåll producerades sporadiskt.

Vad vi byggde: Flerspråkig bokningssajt i React med automatisk översättning via headless CMS (Decap + Supabase + n8n). Digital broschyr som genereras dynamiskt. Bokningssystem integrerat mot deras kalender.

Resultat: Bokningar på alla fyra språk hanteras automatiskt. Tid sparad per vecka uppskattas till 8-10 timmar. Konverteringsgrad ökade märkbart efter snabbare laddningstider och mobiloptimering.

Tekniskt: React, Supabase, n8n, Decap CMS, auto-översättning via OpenAI.

---

## Case study: MarinMekaniker

MarinMekaniker.nu är en marinmekaniker i västra Sverige som servar båtmotorer, propellrar och elsystem. Ägare: Thomas.

Problem: Offerter och fakturor hanterades manuellt i e-post och pärmar. Återkommande kunder fick inte den uppföljning som skulle leda till mer arbete. Ingen samlad bild av vilka kunder som hade vilka båtar.

Vad vi byggde: CRM-pilot med kundhantering, ärendehantering och offert-modul. React-frontend mot FastAPI-backend och MongoDB. Supabase för CRM-delen. Tvåspråkig (svenska/engelska) eftersom flera kunder är utländska båtägare.

Resultat: Tider och offerter hanteras nu i ett system. Återkommande kunder får automatisk påminnelse om service. Tid sparad per vecka cirka 5 timmar.

Tekniskt: React, Tailwind, FastAPI, MongoDB, Supabase, n8n för automatisering. Hostas på Render med kvartalsvis driftavtal.

---

## Case study: Hasselblads Livs

Hasselblads Livs är en livsmedelshandel som driver e-handel via Solängens Frukt & Grönt AB. Ägare: Axel.

Problem: WooCommerce-shoppen krävde manuell hantering av produktbilder. Varje ny produkt behövde bild, beskrivning och kategorisering — det tog timmar varje vecka. Kreditkundshantering skedde i Excel.

Vad vi byggde: AI-driven bildautomation som söker upp, väljer och beskär produktbilder automatiskt. Integration mot WooCommerce. Kundkort och kreditplånbok-system föreslaget för fas 2.

Resultat: Produktupplägg som tog 30 minuter per produkt tar nu under 5. Bildkvalitet konsekvent. Tid sparad per vecka cirka 6 timmar.

Tekniskt: React-baserad SPA, Google Custom Search för bildsökning, Gemini som fallback för beskrivningar, Cloudinary för bildhantering (1000×1000px standard). Allt integrerat mot WooCommerce.

---

## Case study: Norra Hamnens Bilskola

Bilskola i Göteborgsområdet som behövde modernisera bokning och kommunikation med elever.

Problem: Elever bokade lektioner via telefon eller e-post. Manuell schemaläggning. Påminnelser skickades manuellt. Mycket no-shows på inbokade tider.

Vad vi byggde: Bokningssystem direkt på sajten där elever själva väljer tid hos rätt lärare. Automatiska SMS-påminnelser 24 timmar innan lektion. Integrerat mot lärarnas kalendrar.

Resultat: No-show-frekvens halverades. Administrativ tid för bokningshantering minskade med uppskattningsvis 70%. Eleverna uppskattar att kunna boka när som helst.

Tekniskt: Cal.com-baserad bokning, n8n för SMS-flöden, Supabase för datalagring.

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

Investeringen ligger typiskt mellan 30 000 och 60 000 kr. För ett företag som tappar ett par jobb i månaden på sen respons kan det vara inbetalt på första kvartalet.

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

Investeringen ligger typiskt mellan 25 000 och 50 000 kr. Återbetalningstid kan vara så kort som ett kvartal om ni får tillbaka ett par bokningar i månaden som annars hade tappats.

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

Investeringen ligger mellan 20 000 och 45 000 kr. För en restaurang som tappar ett par bord i veckan kan det vara inbetalt på första kvartalet.

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

Investeringen ligger mellan 20 000 och 40 000 kr. Återbetalningstid kan vara under tre månader för en salong med 4+ anställda — bara minskningen av no-shows brukar kunna räcka.

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

Investeringen ligger mellan 35 000 och 80 000 kr beroende på integrationer. För en byrå med 5+ konsulter är återbetalningstiden typiskt 3-6 månader, främst genom att 5-10% av faktureringstid kan frigöras.

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

Investeringen ligger mellan 30 000 och 65 000 kr. För en e-handel med 50+ ordrar per dag kan återbetalningstiden vara under två månader om checkout-tappet minskar markant.

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

Investeringen ligger mellan 40 000 och 75 000 kr. Återbetalningstid är ofta 4-8 månader, men huvudvärdet är att färre leads tappas. För en byrå som omsätter 5-15 miljoner i året kan ett par extra affärer per kvartal från bättre leadshantering motsvara hela investeringen.

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

Investeringen ligger mellan 35 000 och 70 000 kr. Återbetalningstid är ofta 3-6 månader, främst genom att receptionspersonal kan fokusera på besökande patienter istället för telefonsamtal, och no-show-frekvens som typiskt minskar markant.

---

## Paketet: Starterpaket

För dig som vill börja smått och se vad AI kan göra för ditt företag innan du investerar i ett komplett system.

Pris: från 4 990 kr engångsbetalning.

Vad ingår:

- 2-timmars genomgång av din verksamhet och dina arbetsflöden
- En konkret AI-lösning byggd och driftsatt (vanligen en chattbot eller automation)
- 30 dagars support efter leverans
- Skriftligt underlag med rekommendationer för nästa steg

Lämpligt för: enmansföretag, mindre serviceföretag som vill testa innan de bygger större.

Leveranstid: 1-2 veckor från beställning.

---

## Paketet: Hemsidor

Konverteringsoptimerade hemsidor med modern teknik och faktisk leadgenerering.

Pris: från 14 990 kr engångsbetalning.

Vad ingår:

- Strategi och innehållsstruktur
- Design och utveckling
- Mobiloptimering och SEO-grund
- Integration mot CRM eller mejl
- 60 dagars garanti efter lansering

Tillval: AI-chattbot, voice-agent, avancerad SEO, flerspråk.

Leveranstid: 3-6 veckor.

---

## Paketet: Custom builds

För dig som behöver ett system byggt från grunden — CRM, automationsplattform, eller komplett AI-system.

Pris: från 30 000 kr beroende på omfattning.

Vad ingår:

- Djupgående kartläggning av dina behov
- Arkitekturförslag och prisuppskattning
- Iterativ utveckling med löpande avstämningar
- Driftsättning och utbildning av ditt team
- Du äger systemet och koden

Vanlig omfattning: 4-12 veckor från start till produktion.

---

## Paketet: Drift- och säkerhetsavtal

Om något går sönder vill du veta hur snabbt du får hjälp. Det är precis det driftavtalet handlar om — tydliga svarstider när systemet krånglar, och löpande underhåll så att det inte krånglar i onödan. Du slipper ligga vaken och undra vem som fixar en akut driftstörning en tisdagmorgon.

Avtalet gäller system vi byggt eller tagit över. Det säkerställer att allt funkar, att säkerhetsuppdateringar sköts, och att systemet utvecklas vidare i takt med dina behov.

Pris: från 990 kr per månad.

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

Det beror helt på vad du behöver. En enkel chattbot kan komma in på 4 990 kr i Starterpaketet. En komplett hemsida börjar på 14 990 kr. Ett custom-byggt system börjar på 30 000 kr men kan landa betydligt högre beroende på omfattning.

Det vi alltid gör är att börja med ett förutsättningslöst samtal där vi kartlägger vad du behöver. Du får en konkret offert med fast pris innan vi börjar bygga. Inga timdebiteringar som drar iväg. Inga oklarheter.

Drift och underhåll efteråt börjar på 990 kr per månad.

---

## FAQ: Hur lång tid tar det?

Beror på vad det gäller. Riktlinjer:

- Starterpaket: 1-2 veckor
- Hemsidor: 3-6 veckor
- AI-agenter och chattbottar: 1-3 veckor
- CRM-system: 2-4 veckor
- Custom builds: 4-12 veckor

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

Det vanligaste är att en automation som kostar 30 000 kr betalar tillbaka sig på 3-6 månader genom sparad tid. Men det varierar beroende på din verksamhet.

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

Nej. De flesta av våra kunder är inte tekniska. De driver bilskolor, livsmedelshandlar, marinmekaniska företag, turismverksamheter. De vet sin bransch, vi vet tekniken.

Vi pratar svenska, inte teknisk jargong. Vi förklarar vad vi bygger och varför. Du behöver inte förstå koden — du behöver förstå vad systemet gör för ditt företag.

Utbildning av ditt team ingår i alla custom builds.

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

Vi får ofta frågan om vi bygger mobilappar, designar logotyper, eller fungerar som en marknadsföringsbyrå. Svaret är nej på alla tre. Vi bygger inte heller hårdvara, tar inte generella IT-supportuppdrag för datorer och nätverk, och vi utvecklar inte bokföringssystem från grunden — däremot integrerar vi mot de system som redan finns.

Det handlar inte om att vi inte kan, utan om att vi valt att vara riktigt bra på det vi gör: AI-automation, webbsystem, och CRM-lösningar för småföretag. Allt annat lämnar vi till specialister som faktiskt är bäst på det.

Konkret ligger följande utanför vår verksamhet:

- Hårdvaruutveckling och fysiska enheter
- Logotypdesign och varumärkesidentitet utanför webbprojekt
- Större bokföringssystem från grunden — vi integrerar mot existerande
- Marknadsföringsbyrå-tjänster (annonsproduktion, kampanjstrategi, SEO-byrå)
- Generella IT-supportavtal för datorer och nätverk
- Apputveckling för iOS och Android som primär leverans

Vi rekommenderar gärna kunniga partners om ditt behov ligger utanför vår scope. Bättre att du får rätt hjälp än fel hjälp från oss.

---

## Hur vi jobbar — Process

**Steg 1: Förutsättningslöst samtal (15-30 min, gratis).** Du beskriver din situation. Vi lyssnar och ställer frågor. Inga säljpitchar.

**Steg 2: Behovsanalys (1-2 timmar).** Vi går igenom dina arbetsflöden mer i detalj. Identifierar vad som är värt att automatisera först. Du får en första bild av möjligheter.

**Steg 3: Offert.** Konkret förslag med fast pris och leveranstid. Du tar beslutet på lugn och ro.

**Steg 4: Bygg.** Vi bygger iterativt. Du ser progressen och kan styra under tiden. Korta avstämningar varje vecka.

**Steg 5: Driftsättning och utbildning.** Systemet går live. Ditt team utbildas. Du tar över ägandet.

**Steg 6: Drift och vidareutveckling (valfritt).** Driftavtal om du vill ha löpande support och utveckling. Annars klarar du dig själv eller tar in någon annan.

---

## Onboarding — Hur det går till från ditt perspektiv

Många undrar vad som händer efter första samtalet. Här är hur det typiskt ser ut för en kund som väljer att jobba med oss:

**Första samtalet (15 minuter, gratis)**
Vi pratar om din situation. Du beskriver vad som tar tid eller vad som inte funkar. Vi lyssnar och ställer följdfrågor. Inget krav på beslut efteråt — du går därifrån med en bättre förståelse av vad som är möjligt, oavsett om vi jobbar tillsammans eller inte.

**Behovsanalys (1-2 timmar, hos er eller via video)**
Om vi båda känner att det finns en fit, kommer vi närmare. Vi går igenom dina arbetsflöden konkret: hur tar bokningar in idag, vart landar leads, hur hanteras offerter. Du visar oss systemen ni redan har. Vi noterar var tiden faktiskt försvinner.

Du behöver avsätta runt 2 timmar för det här mötet. Plus förmodligen en timme efter mötet för att samla ihop tillgångar vi behöver — inloggningar till era nuvarande system, exempel på hur ärenden hanteras idag, eventuella bilder eller texter ni vill återanvända.

**Offert med fast pris**
Inom en vecka efter behovsanalysen får du en konkret offert. Den är specifik: vad vi bygger, vad det kostar, när det levereras. Inga vaga uppskattningar. Du tar beslutet på lugn och ro.

**Bygg-fasen (varierar beroende på omfattning)**
När du sagt ja kör vi igång. Du får löpande avstämningar — vanligen en kort video varje vecka där vi visar progressen. Du kan styra under tiden om något känns fel.

Din tidsåtgång under bygg-fasen är typiskt 30-60 minuter per vecka för avstämningar, plus eventuella frågor när vi behöver din input på specifika beslut. Du bygger inte själv — vi gör det. Men vi behöver ditt omdöme för att bygga rätt sak.

**Driftsättning och utbildning**
Systemet går live. Ditt team utbildas — vanligen en workshop på 1-2 timmar där vi går igenom hur systemet används i vardagen. Skriftlig dokumentation följer med så att nya medarbetare kan komma in i systemet senare utan att vi behöver vara med.

**Efter lansering**
Du äger systemet. Vill du ha löpande support och vidareutveckling tecknar vi ett driftavtal från 990 kr per månad. Vill du klara dig själv går det också bra — koden är din.

**Total tid från första samtal till live-system:**

- Starterpaket: 1-2 veckor
- Hemsida med automation: 4-8 veckor
- Custom-byggt system: 6-16 veckor

Ingen kund har behövt avsätta mer än några timmar i veckan av sin egen tid under bygg-fasen. Det är vårt jobb att bygga, ditt jobb att driva din verksamhet.

---

## Kontakt och boka samtal

Vill du ha ett första samtal? Boka 15 minuter direkt i Joakims kalender.

Det enklaste är att boka via vår sajt eller fråga AI-agenten Dana som finns där. Hon kan lägga in mötet direkt.

E-post: <joakim@skylandai.se>
Bas: Mölndal/Göteborg
Räckvidd: hela Sverige
