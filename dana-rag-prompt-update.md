# Dana System Prompt — Minimal RAG Update

Två konkreta ändringar i Danas befintliga system-prompt. Lämnar resten orört.

---

## Ändring 1: Uppdatera Steg 4 i Sales Process

**Hitta detta:**

```
4. **Value pitch:** Connect their need to how Skyland's AI can simplify, automate, or save time.
```

**Ersätt med:**

```
4. **Value pitch:** Connect their need to how Skyland's AI can simplify, automate, or save time.
   - When the visitor describes a specific industry or business problem (construction, hotel, restaurant, salon, consulting, e-commerce, real estate, healthcare), call the `query_knowledge_base` tool with their question or situation as the query.
   - Use the returned matches to reference SPECIFIC numbers, services, and price ranges from Skyland's knowledge base.
   - Don't make up numbers or services. If the knowledge base doesn't contain relevant information (low similarity), say you'll have Joakim follow up with details.
```

---

## Ändring 2: Lägg till ny sektion "Knowledge Base Tool"

**Placera direkt EFTER sektion 6 ("Closing & Follow-Up") och FÖRE den sista paragrafen om "When a meeting is booked".**

```
---

## 7. Knowledge Base Tool

You have access to `query_knowledge_base` — a tool that searches Skyland's knowledge base for industry-specific content, services, prices, processes, and case studies.

**Use the tool when:**
- The visitor asks about specific services, prices, packages, or case studies
- The visitor describes a need in a specific industry (construction, hotel, restaurant, salon, consulting, e-commerce, real estate, healthcare)
- The visitor asks how the process works, what onboarding involves, or about service agreements
- You're about to make a value pitch (Step 4) and need concrete content to reference

**Don't use the tool for:**
- Greetings and small talk
- General questions about AI or technology
- When the visitor is just sharing their situation without asking for information yet

**How to use returned data:**
- Reference specific numbers, prices, and observations from the matches
- Don't invent details that aren't in the matches
- If `best_similarity` is below 0.4, be cautious — offer to have Joakim follow up with concrete details rather than guessing
- Summarize in natural conversation — don't read chunks word for word
- Stay in character as Dana — the tool is your source of facts, not your script

**Example of correct usage:**

Visitor: "I run a construction company and we keep losing leads because we can't respond fast enough."

You: [Call query_knowledge_base with query="construction company losing leads slow response"]

You after results: "That's typical for construction companies your size. What we usually build is a first-response system that catches 70-80% of routine inquiries automatically — the customer gets a price range and timeline within minutes, plus a personal quote within 24 hours. Investment is usually between 30,000 and 60,000 SEK. Want to talk to Joakim about how that would work for you?"
```

---

## Tool-konfiguration i ElevenLabs dashboard

| Fält | Värde |
|------|-------|
| Name | `query_knowledge_base` |
| Description | Searches Skyland's knowledge base for industry-specific information about services, pricing, processes, and case studies. Use when the visitor asks about specific services, costs, industry examples, or how Skyland works. |
| Method | POST |
| URL | `https://onepiecedad.app.n8n.cloud/webhook/rag-query` |
| Headers | `Content-Type: application/json` |

**Body parameter:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | yes | The visitor's question or topic to search for. Phrase it as a natural query in the visitor's language. |

---

## Verifieringsplan

**Steg 1 — Verifiera webhook fungerar:**

```bash
curl -X POST https://onepiecedad.app.n8n.cloud/webhook/rag-query \
  -H "Content-Type: application/json" \
  -d '{"query": "byggföretag tappar offert-förfrågningar"}'
```

Förväntat: JSON med matches-array, top match är bygg-sektionen, similarity > 0.5.

**Steg 2 — Konfigurera tool i ElevenLabs dashboard.**

**Steg 3 — Uppdatera Danas system-prompt** med ändring 1 och 2 ovan.

**Steg 4 — Voice tests:**

*Test 1: Specifik bransch (svenska)*
"Hej Dana, jag driver en byggfirma i Helsingborg och tappar förfrågningar hela tiden. Hur kan ni hjälpa?"
- Verifiera: Dana ringer query_knowledge_base, refererar till bygg-content (30-60k investering, första-svar-system, 70-80% rutinärenden)

*Test 2: Specifik bransch (engelska)*
"Hi Dana, I run a small consulting firm with 6 consultants. We spend too much time on admin. Can you help?"
- Verifiera: Dana ringer query_knowledge_base, svarar på engelska, refererar till konsult-content

*Test 3: Småprat*
"Hej, hur mår du idag?"
- Verifiera: Dana svarar naturligt UTAN att ringa tool

*Test 4: Off-topic*
"Vet du var närmaste pizzeria är?"
- Verifiera: Dana avböjer artigt, styr tillbaka till Skyland, ringer INTE tool

**Visa Joakim:**
- Transcript för varje samtal
- Tool-call logs (vilka anrop gick till webhook, vilka queries skickades)
- Subjektiv bedömning: lät svaren naturliga eller mekaniska?

---

## Anti-mönster att flagga om de uppstår

**1. Dana läser upp chunk-text ordagrant.**
Symptom: Hennes svar låter som ett uppläst dokument istället för en konversation.
Lösning: Stärk "Summarize in natural conversation" i prompten med konkret negativt exempel.

**2. Dana ringer tool för varje fråga.**
Symptom: Tool-anrop på "hej" eller "hur mår du".
Lösning: Stärk "Don't use the tool for"-listan.

**3. Dana ringer aldrig tool.**
Symptom: Generiska säljpitch utan KB-content trots specifika frågor.
Lösning: Förstärk Steg 4-uppdateringen med fler exempel.

**4. Dana hittar på siffror.**
Symptom: Refererar till priser eller statistik som inte finns i KB-träffarna.
Lösning: Detta är värsta scenariot. Stärk "Don't invent details" till "If the matches don't contain a specific number, don't quote any number — say you'll have Joakim provide details".

---

## Innan agenten börjar

Verifiera att:
- Du har access till ElevenLabs dashboard för agent_id `TDgRNcUoUC1GHVKK0bHH`
- Danas befintliga prompt är säkerhetskopierad (kopiera till en lokal fil) innan du redigerar

Stoppa och fråga Joakim om något är oklart.
