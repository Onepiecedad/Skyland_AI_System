# V09 — End-to-End Voice Test Report

**Tester:** Joakim
**Datum:** 2026-05-10
**Miljö:** localhost:8081 → localhost:8000 (proxy) → ElevenLabs
**SDK:** @elevenlabs/client 1.4.0

---

## Bedömningsskala (1–5)

| Poäng | Betydelse |
|-------|-----------|
| 1 | Oacceptabelt — bryter upplevelsen |
| 2 | Svagt — märkbart problem |
| 3 | Acceptabelt — mindre brister |
| 4 | Bra — uppfyller förväntningar |
| 5 | Utmärkt — överträffar förväntningar |

---

## Svenska tester (agent: agent_8701kr69134ge7gvh3a6tcmkhq95)

### Test SV-1: Starter "Hur mycket kostar det?"

**Starter klickad:** Hur mycket kostar det?
**Förväntat:** Alex öppnar med Variant 1 (prisspann), frågar efter namn, ställer en fråga åt gången.

| Dimension | Poäng | Kommentar |
|-----------|-------|-----------|
| Ton (varmt, professionellt) | /5 | |
| Naturlighet (flöde, inga hackningar) | /5 | |
| Längd (max 2 meningar per turn) | /5 | |
| Trohet (följer numrerade STEG) | /5 | |
| Latens (tid till första svar) | /5 | |

**Alex öppning (transcript):**
> 

**Anomalier:**
> 

---

### Test SV-2: Starter "Hur fungerar processen?"

**Starter klickad:** Hur fungerar processen?
**Förväntat:** Alex öppnar med Variant 1 (utifrån er situation), frågar efter namn.

| Dimension | Poäng | Kommentar |
|-----------|-------|-----------|
| Ton | /5 | |
| Naturlighet | /5 | |
| Längd | /5 | |
| Trohet | /5 | |
| Latens | /5 | |

**Alex öppning (transcript):**
> 

**Anomalier:**
> 

---

### Test SV-3: Starter "Vilka företag har ni jobbat med?"

**Starter klickad:** Vilka företag har ni jobbat med?
**Förväntat:** Alex öppnar med Variant 1 (urval av exempel), frågar efter namn.

| Dimension | Poäng | Kommentar |
|-----------|-------|-----------|
| Ton | /5 | |
| Naturlighet | /5 | |
| Längd | /5 | |
| Trohet | /5 | |
| Latens | /5 | |

**Alex öppning (transcript):**
> 

**Anomalier:**
> 

---

### Test SV-4: "Eller starta vanlig konversation →"

**Starter klickad:** (ingen — vanlig konversation)
**Förväntat:** Alex öppnar med Variant 2 default ("Välkommen till Skyland. Vad kan jag hjälpa dig med idag?")

| Dimension | Poäng | Kommentar |
|-----------|-------|-----------|
| Ton | /5 | |
| Naturlighet | /5 | |
| Längd | /5 | |
| Trohet | /5 | |
| Latens | /5 | |

**Alex öppning (transcript):**
> 

**Anomalier:**
> 

---

## Engelska tester (agent: TDgRNcUoUC1GHVKK0bHH)

> Byt till EN via SV/EN-knappen innan dessa tester.

### Test EN-1: Starter "How much does it cost?"

**Starter klickad:** How much does it cost?
**Förväntat:** Alex opens with Variant 1 (price range), asks for name.

| Dimension | Poäng | Kommentar |
|-----------|-------|-----------|
| Ton | /5 | |
| Naturlighet | /5 | |
| Längd | /5 | |
| Trohet | /5 | |
| Latens | /5 | |

**Alex opening (transcript):**
> 

**Anomalies:**
> 

---

### Test EN-2: Starter "How does the process work?"

**Starter klickad:** How does the process work?
**Förväntat:** Alex opens with Variant 1 (your specific situation), asks for name.

| Dimension | Poäng | Kommentar |
|-----------|-------|-----------|
| Ton | /5 | |
| Naturlighet | /5 | |
| Längd | /5 | |
| Trohet | /5 | |
| Latens | /5 | |

**Alex opening (transcript):**
> 

**Anomalies:**
> 

---

### Test EN-3: Starter "Which companies have you worked with?"

**Starter klickad:** Which companies have you worked with?
**Förväntat:** Alex opens with Variant 1 (selection of examples), asks for name.

| Dimension | Poäng | Kommentar |
|-----------|-------|-----------|
| Ton | /5 | |
| Naturlighet | /5 | |
| Längd | /5 | |
| Trohet | /5 | |
| Latens | /5 | |

**Alex opening (transcript):**
> 

**Anomalies:**
> 

---

### Test EN-4: "Or start a regular conversation →"

**Starter klickad:** (none — regular conversation)
**Förväntat:** Alex opens with Variant 2 default ("Welcome to Skyland. What can I help you with today?")

| Dimension | Poäng | Kommentar |
|-----------|-------|-----------|
| Ton | /5 | |
| Naturlighet | /5 | |
| Längd | /5 | |
| Trohet | /5 | |
| Latens | /5 | |

**Alex opening (transcript):**
> 

**Anomalies:**
> 

---

## Sammanfattning

### Poängsummering

| Test | Ton | Nat. | Längd | Trohet | Latens | Snitt |
|------|-----|------|-------|--------|--------|-------|
| SV-1 | | | | | | |
| SV-2 | | | | | | |
| SV-3 | | | | | | |
| SV-4 | | | | | | |
| EN-1 | | | | | | |
| EN-2 | | | | | | |
| EN-3 | | | | | | |
| EN-4 | | | | | | |
| **Genomsnitt** | | | | | | |

### Övergripande bedömning

**Godkänt för produktion:** ☐ Ja / ☐ Nej / ☐ Med förbehåll

**Kritiska problem att åtgärda innan deploy:**
> 

**Icke-kritiska förbättringar (post-launch):**
> 

**Noteringar:**
> 
