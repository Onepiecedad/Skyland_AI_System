# Changelog

All notable changes to this project are documented here.

## [Unreleased]

- perf(bg): bakgrundsshadern startar bara med riktig grafikkrets, efter load+idle, och aldrig vid `prefers-reduced-motion`; stilla CSS-fallback annars. PageSpeed desktop var 48 (huvudtråden blockerad 13 s på Googles GPU-lösa maskin) medan a11y/best practices/SEO låg på 100. Pausar när fliken är dold. (PR #33)
- feat(seo): add IndexNow key hosting and automatic post-deploy sitemap ping
- fix(rag): rewrite 'Vad vi inte gör' and 'Drift-avtal' chunks as conversational prose — both now rank #1 for target queries (0.52+)
- feat(content): expand knowledge base with onboarding, scope boundaries, and detailed SLA
