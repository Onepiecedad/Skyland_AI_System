# AGENT INSTRUCTION: KUNSKAPSBAS-uppdatering — tre nya sektioner

## Sammanhang

Efter analys av kundens troliga frågor under säljkonversationer har vi identifierat tre tillägg som ska göras till kunskapsbasen:

1. **Ny sektion: Onboarding-process** — svarar på "vad händer efter första samtalet" och "hur mycket tid behöver jag avsätta"
2. **Ny sektion: Vad vi inte gör** — sätter förväntningar och filtrerar olämpliga leads
3. **Utökad sektion: Drift- och säkerhetsavtal** — ersätter vag SLA-formulering med konkreta svarstider

Dessa tillägg är medvetna säljmaterial-uppdateringar, inte tekniska förändringar. De är specifikt formulerade för att Dana och Void-formuläret ska kunna svara på vanliga prospekt-frågor med konkret information istället för vaga svar.

## Din uppgift

1. Uppdatera `/docs/content/KUNSKAPSBAS.md` med tre nya sektioner enligt specifikationen i `/mnt/user-data/outputs/KUNSKAPSBAS-tillagg.md` (eller från meddelandet nedan)
2. Kör om `/scripts/populate_knowledge_base.py` så att Supabase-kunskapsbasen synkas med den uppdaterade filen
3. Verifiera att de nya chunks är retrievable via similarity search
4. Rapportera resultat

## Steg 1: Uppdatera KUNSKAPSBAS.md

Öppna `/docs/content/KUNSKAPSBAS.md`. Gör följande tre ändringar:

### Ändring 1: Lägg till "Vad vi inte gör"-sektion

Hitta sektionen `## Vår ICP — Vilka vi jobbar bäst med`. EFTER hela den sektionen (efter sista textraden men före nästa H2-rubrik), infoga:

```markdown
## Vad vi inte gör

För att vi ska kunna leverera värde där vi är starka, är vi tydliga med vad som ligger utanför vår verksamhet:

- Hårdvaruutveckling och fysiska enheter
- Logotypdesign och varumärkesidentitet utanför webbprojekt
- Större bokföringssystem från grunden — vi integrerar mot existerande
- Marknadsföringsbyrå-tjänster (annonsproduktion, kampanjstrategi, SEO-byrå)
- Generella IT-supportavtal för datorer och nätverk
- Apputveckling för iOS och Android som primär leverans
- Projekt under 4 990 kr — vi bygger för värde, inte mängd

Vi rekommenderar gärna kunniga partners om ditt behov ligger utanför vår scope. Bättre att du får rätt hjälp än fel hjälp från oss.
```

Resultat: "Vad vi inte gör" ligger mellan "Vår ICP" och "Hur vi jobbar — Process".

### Ändring 2: Lägg till "Onboarding"-sektion

Hitta sektionen `## Hur vi jobbar — Process`. EFTER hela den sektionen, men FÖRE `## Kontakt och boka samtal`, infoga:

```markdown
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
```

Resultat: "Onboarding" ligger mellan "Hur vi jobbar — Process" och "Kontakt och boka samtal".

### Ändring 3: Ersätt "Drift- och säkerhetsavtal"-sektionen

Hitta sektionen `## Paketet: Drift- och säkerhetsavtal`. ERSÄTT hela sektionen (från H2-rubriken till och med sista textraden innan nästa H2) med:

```markdown
## Paketet: Drift- och säkerhetsavtal

För system vi byggt eller som vi tagit över. Säkerställer att allt funkar och utvecklas vidare.

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
```

## Steg 2: Kör populate_knowledge_base.py igen

Skriptet är idempotent (verifierat i TICKET-V01). Det innebär att:
- Befintliga chunks som inte ändrats förblir oförändrade
- Den utökade Drift-sektionen uppdaterar befintlig chunk (samma title, ny content och nytt embedding)
- De två nya sektionerna (Onboarding, Vad vi inte gör) skapas som nya chunks

Förväntad förändring i row count: 28 → 30 (två nya chunks, en uppdaterad).

Kör skriptet:
```bash
python3 scripts/populate_knowledge_base.py
```

Verifiera total count i Supabase:
```sql
SELECT COUNT(*) FROM knowledge_base;
-- Ska vara 30
```

## Steg 3: Verifiera retrieval

Kör fyra nya testqueries via samma mekanism som i TICKET-V01:

1. **"hur lång tid tar det innan ni är igång"**
   - Förväntat top match: Onboarding-chunken
   - Förväntad similarity: 0.5+

2. **"vad behöver jag göra för att komma igång"**
   - Förväntat top match: Onboarding-chunken
   - Förväntad similarity: 0.5+

3. **"bygger ni mobilappar"**
   - Förväntat top match: "Vad vi inte gör"-chunken
   - Förväntad similarity: 0.45+

4. **"hur snabbt får jag svar om något går sönder"**
   - Förväntat top match: Drift- och säkerhetsavtal-chunken
   - Förväntad similarity: 0.45+

Lägg till resultaten i `/scripts/test_kb_results.md` som ett nytt avsnitt med rubrik `## Verifiering efter onboarding-tillägg (2026-XX-XX)`.

## Definition of Done

- [ ] `/docs/content/KUNSKAPSBAS.md` innehåller alla tre ändringar enligt specifikation
- [ ] Sektioner är placerade på rätt platser (verifiera ordning: ICP → Vad vi inte gör → Hur vi jobbar → Onboarding → Kontakt)
- [ ] populate_knowledge_base.py körs cleanly utan fel
- [ ] Total row count i `knowledge_base` är 30
- [ ] Drift-sektionens content är uppdaterad (verifiera genom att läsa raden i Supabase)
- [ ] Alla fyra nya verifieringsqueries returnerar förväntat top match med similarity över tröskeln
- [ ] Resultaten loggade i test_kb_results.md
- [ ] CHANGELOG.md uppdaterad med rad: `feat(content): expand knowledge base with onboarding, scope boundaries, and detailed SLA`

## Hard Constraints

- Skriv INTE om innehållet. Använd exakt text som specificerats ovan. Innehållet är medvetet formulerat och godkänt av Joakim.
- Lägg INTE till metadata-tags eller liknande i markdown-filen. Embedding-modellen fångar semantiken automatiskt.
- Skapa INTE nya kategorier i knowledge_base-tabellen. De nya chunks ska kategoriseras enligt befintligt schema:
  - "Vad vi inte gör" → category: 'tech' (om Skyland-positionering)
  - "Onboarding — Hur det går till från ditt perspektiv" → category: 'tech' (process-information)
  - Drift-uppdatering → behåll befintlig category: 'tech'
- Rör INTE andra delar av KUNSKAPSBAS.md än de tre specificerade sektionerna.

## När du är klar

Rapportera:
- Total row count efter körning
- Resultaten av de fyra verifieringsqueries (top match + similarity)
- Eventuella avvikelser från förväntningar

Avvakta godkännande innan du fortsätter med TICKET-V02 (RAG retrieval workflow).

## När du fastnar

Surface direkt till Joakim om:
- KUNSKAPSBAS.md inte ser ut som förväntat (sektioner saknas, struktur har ändrats sedan V01)
- populate_knowledge_base.py kraschar med felmeddelande
- Verifieringsqueries returnerar fel top match (kan indikera att chunkningen behöver justeras)
- Total row count inte blir exakt 30 (kan indikera dubblering eller misslyckad upsert)
