# Changelog

All notable changes to this project are documented here.

## [Unreleased]

- fix(gdpr): den personliga röstöppningen efter formulär (voice.js) säger nu, precis som starterknapparnas varianter, att besökaren pratar med en AI och att samtalet sparas — integritetspolicyn lovade det, koden höll det inte i den vägen. (granskning 6 sep)
- fix(copy): dashboardens Översikt-flik påstod att allt på sidan hänt i besökarens session; KPI-siffrorna (< 30 s, 24/7, 100 %, 0) är egenskaper hos systemet, inte sessionsutfall. Noten säger nu vad som är vad. (granskning 6 sep)
- docs: AGENT.md omskriven efter verklig arkitektur (statisk `app/` på Netlify, SCC på Render, ElevenLabs via signerad URL; n8n/FastAPI/Retell/React är historik). docs/infrastructure.md märkt som historiskt. Rätta filnamn skyland-pod.md/skyland-pov.md. (granskning 6 sep)
- perf: Alex-filmerna (3,3 + 4,8 MB) hämtas när deras sida blir aktiv, inte vid sidstart; ingen synkron layout i motorns init (höjden cachas, sida 1 behöver den inte). PageSpeed 6 sep 11:54: mobil 81, desktop 98, övriga tre 100. Utgångsläge 5 sep: mobil 57, desktop 48. (PR #40–#41)
- perf(mobil): första målningen väntar inte längre på JavaScript (hero-sidan syns via CSS innan app.js), röst-SDK:t (120 kB) laddas lat vid mikrofontryck, ikonfonten subsettad 1,13 MB → 4,7 kB (`icon_names`, nya ikoner MÅSTE läggas till i listan i index.html), Google Fonts-CSS icke-blockerande, bredaste ordet först i hero-rotationen så LCP inte flyttas av ett senare ord, shadern avstängd på pekskärmar. Lighthouse mobil 56 → 70, desktop 48 → 89 (Mac, cache-bustad URL). (PR #35–#38)
- perf(bg): bakgrundsshadern startar bara med riktig grafikkrets, efter load+idle, och aldrig vid `prefers-reduced-motion`; stilla CSS-fallback annars. PageSpeed desktop var 48 (huvudtråden blockerad 13 s på Googles GPU-lösa maskin) medan a11y/best practices/SEO låg på 100. Pausar när fliken är dold. (PR #33)
- feat(seo): add IndexNow key hosting and automatic post-deploy sitemap ping
- fix(rag): rewrite 'Vad vi inte gör' and 'Drift-avtal' chunks as conversational prose — both now rank #1 for target queries (0.52+)
- feat(content): expand knowledge base with onboarding, scope boundaries, and detailed SLA
