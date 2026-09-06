# Changelog

All notable changes to this project are documented here.

## [Unreleased]

- perf(mobil): första målningen väntar inte längre på JavaScript (hero-sidan syns via CSS innan app.js), röst-SDK:t (120 kB) laddas lat vid mikrofontryck, ikonfonten subsettad 1,13 MB → 4,7 kB (`icon_names`, nya ikoner MÅSTE läggas till i listan i index.html), Google Fonts-CSS icke-blockerande, bredaste ordet först i hero-rotationen så LCP inte flyttas av ett senare ord, shadern avstängd på pekskärmar. Lighthouse mobil 56 → 70, desktop 48 → 89 (Mac, cache-bustad URL). (PR #35–#38)
- perf(bg): bakgrundsshadern startar bara med riktig grafikkrets, efter load+idle, och aldrig vid `prefers-reduced-motion`; stilla CSS-fallback annars. PageSpeed desktop var 48 (huvudtråden blockerad 13 s på Googles GPU-lösa maskin) medan a11y/best practices/SEO låg på 100. Pausar när fliken är dold. (PR #33)
- feat(seo): add IndexNow key hosting and automatic post-deploy sitemap ping
- fix(rag): rewrite 'Vad vi inte gör' and 'Drift-avtal' chunks as conversational prose — both now rank #1 for target queries (0.52+)
- feat(content): expand knowledge base with onboarding, scope boundaries, and detailed SLA
