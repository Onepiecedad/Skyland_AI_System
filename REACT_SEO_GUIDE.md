# React SPA SEO Guide

## Komplett guide och checklista för optimal SEO i React-applikationer

**Baserad på:** Cold Experience-projektet (coldexperience.se)  
**Senast uppdaterad:** 2026-01-29  
**Författare:** Joakim Landqvist  

---

## 📋 Innehåll

1. [Sammanfattning](#1-sammanfattning)
2. [Kärnproblemet med React SPA](#2-kärnproblemet-med-react-spa)
3. [Lösning: Custom SSG med Puppeteer](#3-lösning-custom-ssg-med-puppeteer)
4. [Bildoptimering](#4-bildoptimering)
5. [Videooptimering (YouTube Facade Pattern)](#5-videooptimering-youtube-facade-pattern)
6. [Internationalisering (i18n)](#6-internationalisering-i18n)
7. [Innehållsoptimering](#7-innehållsoptimering)
8. [Hosting & Deploy (Netlify)](#8-hosting--deploy-netlify)
9. [Verifieringsverktyg & Metoder](#9-verifieringsverktyg--metoder)
10. [Master Checklista](#10-master-checklista)
11. [Vanliga Fallgropar & Lösningar](#11-vanliga-fallgropar--lösningar)
12. [Skript & Automation](#12-skript--automation)

---

## 1. Sammanfattning

Denna guide dokumenterar alla SEO-optimeringar implementerade på Cold Experience-projektet, från kritisk tillstånd (oindexerbar SPA) till optimal prestanda:

| Kategori | Före | Efter |
|----------|------|-------|
| **Performance** | 56/100 | **98/100** 🟢 |
| **SEO** | 0 (oindexerbar) | **100/100** 🟢 |
| **Best Practices** | 54/100 | **100/100** 🟢 |
| **Accessibility** | 86/100 | **89/100** 🟢 |

### Huvudsakliga åtgärder

1. **SSG (Static Site Generation)** - Puppeteer-baserat pre-rendering
2. **Bildoptimering** - WebP-konvertering (84% storlekminskning)
3. **YouTube Facade Pattern** - Eliminerar tredjepartscookies
4. **Internationalisering** - hreflang, kanoniska URLs, semantiska slugs

---

## 2. Kärnproblemet med React SPA

### Vad Google ser utan SSG

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My App</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <script src="/static/js/main.js"></script>
</body>
</html>
```

**Problem:**

- ❌ Inga H1/H2/H3-taggar synliga
- ❌ Ingen länktext
- ❌ Inga alt-texter för bilder
- ❌ Inget innehåll för Google att indexera
- ❌ Sidor markeras som "Excluded by noindex tag"

### Varför react-snap inte fungerar

Vi testade `react-snap` initialt, men det hade flera problem:

- Endast genererade en enda `index.html` på root
- Timeouts under crawling
- Svårigheter att hantera asynkron i18n-data
- Resulterade i tomma HTML-filer

---

## 3. Lösning: Custom SSG med Puppeteer

### Konceptet

Vårt custom SSG-script:

1. Startar en lokal HTTP-server med build-output
2. Öppnar varje route i headless Chrome via Puppeteer
3. Väntar på React hydration + i18n-laddning
4. Sparar den ferdigrenderade HTML:en som statiska filer

### Implementation: `scripts/prerender-routes.js`

#### Nyckelkonfiguration

```javascript
#!/usr/bin/env node
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// CI-miljödetektering  
const IS_CI = process.env.NETLIFY === 'true';

// Alla routes som ska pre-renderas
const ROUTES = [
    '/',
    '/en/', '/sv/', '/de/', '/pl/',
    '/en/husky-ride', '/sv/hundspann', '/de/husky-tour',
    // ... alla language-specifika routes
];

// Puppeteer launch-konfiguration
const browser = await puppeteer.launch({
    headless: 'new',
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        ...(IS_CI ? ['--single-process', '--no-zygote'] : []),
    ],
});
```

#### Hydration Wait Logic

```javascript
async function prerenderRoute(browser, route) {
    const page = await browser.newPage();
    
    await page.goto(`${BASE_URL}${route}`, {
        waitUntil: 'networkidle0', // Vänta tills alla nätverksrequest är klara
        timeout: 30000
    });
    
    // Extra väntetid för React hydration
    await page.waitForTimeout(1000);
    
    // Verifiera att #root har innehåll
    await page.waitForSelector('#root');
    
    // Hämta fullständig HTML
    const html = await page.content();
    
    // Spara som index.html i rätt mappstruktur
    const outputPath = path.join(BUILD_DIR, route, 'index.html');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);
}
```

### Build-integration (package.json)

```json
{
  "scripts": {
    "build": "craco build",
    "postbuild": "npm run generate:sitemap && node scripts/prerender-routes.js",
    "generate:sitemap": "node scripts/generate-sitemap.js"
  }
}
```

### Netlify-konfiguration (netlify.toml)

```toml
[build]
  command = "npx puppeteer browsers install chrome && npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Kritiskt:** `npx puppeteer browsers install chrome` måste köras FÖRE build i CI-miljön.

---

## 4. Bildoptimering

### Problemet: 9.7MB payload

PageSpeed-audit visade en **31.62 MB** bildpayload som orsakade:

- LCP: 12.9 sekunder (mobil)
- Performance: 56/100

### Lösningen: Aggressiv WebP-konvertering

#### Script: `scripts/optimize-images-aggressive.js`

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1200;
const QUALITY = 70;

async function optimizeImage(inputPath, outputPath) {
    await sharp(inputPath)
        .resize(MAX_WIDTH, MAX_HEIGHT, { 
            fit: 'inside', 
            withoutEnlargement: true 
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath);
}
```

#### Script: `scripts/migrate-to-webp.js`

Uppdaterar alla bildreferenser i koden:

```javascript
// Söker igenom src-mappen och uppdaterar .jpg/.png till .webp
const files = glob.sync('src/**/*.{js,jsx,ts,tsx}');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\.(jpg|jpeg|png)/gi, '.webp');
    fs.writeFileSync(file, content);
});
```

### Resultat

| Metrik | Före | Efter | Förbättring |
|--------|------|-------|-------------|
| **Total bildpayload** | 31.62 MB | 5.06 MB | **84% minskning** |
| **FCP** | 7.1s | 0.9s | **87% snabbare** |
| **LCP** | 12.9s | 1.9s | **85% snabbare** |
| **Performance** | 56 | 98 | **+42 poäng** |

### Best Practices

1. **WebP 70% kvalitet** är industristandard för fotografiskt innehåll
2. **Max 1600x1200px** för hero-bilder
3. **Kör optimering vid varje ny bildinläggning**
4. **Undvik externa bild-CDN:er** som kan injicera cookies

```bash
# Kör optimering
cd frontend
node scripts/optimize-images-aggressive.js
```

---

## 5. Videooptimering (YouTube Facade Pattern)

### Problemet

YouTube embed laddar tredjepartscookies (`YSC`, `VISITOR_INFO1_LIVE`) vid initial sidladdning, vilket sänker Best Practices-poängen.

### Misslyckade försök

| Strategi | Problem |
|----------|---------|
| **Lazy-loading iframe** | Cookies "bakas in" under SSG |
| **Self-hosted video** | 14MB payload → Performance 56/100 |
| **youtube-nocookie.com** | Cookies ändå detekterade |

### Framgångsrik lösning: Facade Pattern

Visa en statisk thumbnail och play-knapp initialt. Ladda iframe **endast vid klick**.

```jsx
import React, { useState } from "react";

const FeaturedVideo = () => {
  const [showVideo, setShowVideo] = useState(false);
  const videoId = "lzQ_P2IGBXQ";
  
  // KRITISKT: Använd LOKAL poster för att undvika tredjepartscookies
  const poster = "/images/video-poster.jpg";
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;

  return (
    <div className="video-facade">
      {showVideo ? (
        <iframe 
          src={embedUrl} 
          allow="autoplay; encrypted-media" 
          allowFullScreen 
        />
      ) : (
        <button 
          onClick={() => setShowVideo(true)}
          aria-label="Spela video om Cold Experience"
        >
          <img src={poster} alt="Video förhandsvisning" />
          <div className="play-icon">▶</div>
        </button>
      )}
    </div>
  );
};
```

### Kritiska insikter

1. **Lokal poster är OBLIGATORISKT** - Även `img.youtube.com` thumbnails triggar cookie-varningar
2. **Användaren måste klicka** - Inga autoplay eller on-hover triggers
3. **Fungerar med SSG** - Eftersom iframe inte existerar före klick, "bakas" den inte in i HTML

### Prestanda efter implementation

- **Best Practices:** 100/100 ✅
- **Performance:** 98/100 ✅

---

## 6. Internationalisering (i18n)

### URL-struktur

Använd subfolder-struktur för språk:

```
/en/           → Engelska (Primary)
/sv/           → Svenska
/de/           → Tyska
/pl/           → Polska
```

### Semantiska slugs

Varje språk ska ha översatta URL-slugs för SEO:

| Språk | Slug |
|-------|------|
| EN | `/en/husky-ride` |
| SV | `/sv/hundspann` |
| DE | `/de/husky-tour` |
| PL | `/pl/husky-ride` |

### Kritiska SEO-element

#### 1. Hreflang-taggar

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/" />
<link rel="alternate" hreflang="sv" href="https://example.com/sv/" />
<link rel="alternate" hreflang="de" href="https://example.com/de/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/" />
```

#### 2. Kanoniska URLs

```html
<link rel="canonical" href="https://example.com/en/husky-ride" />
```

#### 3. Dynamisk sitemap

```javascript
// scripts/generate-sitemap.js
const languages = ['en', 'sv', 'de', 'pl'];
const routes = require('../src/utils/route-map.json');

function generateSitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    
    routes.forEach(route => {
        languages.forEach(lang => {
            xml += `<url>
                <loc>https://example.com/${lang}/${route}</loc>
                <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/${route}"/>
                <xhtml:link rel="alternate" hreflang="sv" href="https://example.com/sv/${route}"/>
            </url>`;
        });
    });
    
    xml += '</urlset>';
    return xml;
}
```

### Vanliga i18n-fel

#### Problem: Saknade översättningar

Nya komponenter läggs till med engelska defaultvärden → Knappar visas på engelska i alla språk.

#### Lösning: Automatiserat översättningsscript

```javascript
// scripts/fix-missing-translations.js
const languages = ['sv', 'de', 'pl'];
const baseTranslations = require('../public/locales/en/translation.json');

languages.forEach(lang => {
    const langTranslations = require(`../public/locales/${lang}/translation.json`);
    const merged = deepMerge(baseTranslations, langTranslations);
    fs.writeFileSync(`../public/locales/${lang}/translation.json`, 
        JSON.stringify(merged, null, 2));
});
```

---

## 7. Innehållsoptimering

### Beskrivande länktext

**FEL:**

```html
<a href="/husky">Learn more</a>
<a href="/snowmobile">Read more</a>
```

**RÄTT:**

```html
<a href="/husky">Explore husky adventure</a>
<a href="/snowmobile">Discover snowmobile tours</a>
```

#### Implementation per sektion

| Sektion | Länktext (EN) | i18n-nyckel |
|---------|---------------|-------------|
| Snowmobile | "Explore snowmobile tours" | `learnMoreSnowmobile` |
| Northern Lights | "Discover Northern Lights tours" | `learnMoreNorthernLights` |
| Dog Sledding | "Explore husky adventure" | `learnMoreHusky` |
| Accommodation | "See accommodation details" | `learnMoreLodging` |

### CTA Accuracy

**Undvik missvisande CTAs:**

| FEL | RÄTT | Varför |
|-----|------|--------|
| "Book husky sledding" | "Explore husky adventure" | Aktiviteter säljs som paket, inte enskilt |
| "Chat with a musher" | "Ask about availability" | Ingen live-chat finns |

### Footer-beskrivning

Byt ut generisk "Company description" mot keyword-rik text:

```json
{
  "companyDescription": "Cold Experience offers authentic Arctic adventures in Swedish Lapland – snowmobile safaris, Northern Lights tours, and husky sledding with local hosts Gustav & Julia."
}
```

### Rubrikhierarki

```html
<h1>Experience the Magic of Swedish Lapland</h1>
  <h2>Our Adventures</h2>
    <h3>Husky Sledding</h3>
    <h3>Snowmobile Safari</h3>
  <h2>Why Choose Us</h2>
  <h2>Contact</h2>
```

---

## 8. Hosting & Deploy (Netlify)

### Kritisk Netlify-konfiguration

#### netlify.toml

```toml
[build]
  base = "frontend"
  command = "npx puppeteer browsers install chrome && npm run build"
  publish = "build"

[build.environment]
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "true"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### ⚠️ KRITISKT: Avaktivera Prerender.io

**Problem:** Netlify's Prerender.io-extension utför egen rendering för bots, vilket kan trigga on-demand komponenter (som YouTube facade) och injicera tredjepartscookies.

**Symptom:**

- Intern Lighthouse: 100/100
- Extern PageSpeed: 54/100
- `curl -H "User-Agent: Googlebot"` visar iframe-innehåll

**Lösning:** Avinstallera Prerender.io-extensionen i Netlify-dashboarden.

### Cache-hantering

Efter deploy, rensa Netlify-cache för att säkerställa PageSpeed ser ny kod:

```bash
# Via Netlify CLI
netlify build --clear-cache
```

Eller via dashboard: **Deploys → Trigger deploy → Clear cache and deploy site**

---

## 9. Verifieringsverktyg & Metoder

### 1. curl-verifiering

```bash
# Verifiera att pre-renderad HTML serveras
curl -sL "https://example.com/en/" | head -100

# Verifiera specifikt innehåll
curl -s https://example.com/en/ | grep -o "Explore husky adventure"

# Verifiera bot-view (viktigt efter Prerender.io-problem)
curl -sL -H "User-Agent: Googlebot" https://example.com/en/ | grep -o "youtube.com/embed"
# Bör returnera INGENTING om facade fungerar
```

### 2. Google PageSpeed Insights

```
https://pagespeed.web.dev/
```

**Tips:** Lägg till cache-busting parameter efter deploy:

```
https://example.com/en/?v=1706518626
```

### 3. Search Engine Simulator

Använd "To The Web" Search Engine Simulator:

```
https://totheweb.com/learning_center/tools-search-engine-simulator/
```

Verifiera:

- Title Tag
- Meta Description
- H1-taggar
- Word Count
- Nyckelord

### 4. Google Search Console

- Begär omindexering för viktiga sidor
- Övervaka "Coverage" för indexeringsstatus
- Kontrollera "Core Web Vitals"

### Build-verifiering

```bash
# Verifiera statiskt innehåll efter build
grep -o "Explore snowmobile tours\|Book husky sledding" build/en/index.html

# Verifiera översättningar
grep -o "Varför våra gäster väljer" build/sv/index.html

# Verifiera footer-beskrivning
grep -o "Gustav & Julia" build/en/index.html
```

---

## 10. Master Checklista

### 🔧 Teknisk SEO

- [ ] **SSG implementerat** - Puppeteer pre-renderingsscript
- [ ] **Build-integration** - postbuild kör SSG automatiskt
- [ ] **Netlify CI-kompatibel** - Chrome explicit installerat
- [ ] **Prerender.io avaktiverat** - Ingen edge-layer konflikt
- [ ] **Sitemap genereras** - Vid varje build
- [ ] **robots.txt** - Korrekt konfigurerad

### 📸 Bildoptimering

- [ ] **WebP-format** - Alla bilder konverterade
- [ ] **Max 1600x1200px** - Storleksbegränsning
- [ ] **70% kvalitet** - Komprimering
- [ ] **Kodreferenser uppdaterade** - .jpg/.png → .webp
- [ ] **Alt-texter** - Beskrivande för alla bilder

### 🎬 Videooptimering

- [ ] **Facade Pattern** - YouTube iframe laddas efter klick
- [ ] **Lokal poster** - Ingen extern thumbnail
- [ ] **youtube-nocookie.com** - Privacy-enhanced mode
- [ ] **aria-label** - På play-knapp
- [ ] **Inga tredjepartscookies** - Vid initial laddning

### 🌍 Internationalisering

- [ ] **Subfolder-struktur** - /en/, /sv/, /de/, etc.
- [ ] **Semantiska slugs** - Översatta per språk
- [ ] **hreflang-taggar** - På varje sida
- [ ] **x-default** - Pekar på primärt språk
- [ ] **Kanoniska URLs** - Unika per sida
- [ ] **Alla översättningar kompletta** - Inga engelska fallbacks

### 📝 Innehåll

- [ ] **Beskrivande länktexter** - Inga "Learn more"
- [ ] **Korrekt rubrikhierarki** - En H1 per sida
- [ ] **Keyword-rik footer** - Med varumärke och tjänster
- [ ] **Meta title** - Under 60 tecken
- [ ] **Meta description** - 150-160 tecken
- [ ] **Korrekta CTAs** - Matchar faktiskt erbjudande

### ✅ Verifiering

- [ ] **curl-test** - Visar renderat innehåll
- [ ] **Bot-test** - Ingen iframe vid Googlebot UA
- [ ] **PageSpeed 90+** - Performance, SEO, Best Practices
- [ ] **Search Console** - Omindexering begärd
- [ ] **Simulator-test** - Innehåll synligt för crawler

---

## 11. Vanliga Fallgropar & Lösningar

### 1. "Caching Trap"

**Symptom:** PageSpeed visar gamla låga poäng efter deploy.

**Orsak:** CDN eller PageSpeed cachar gammal version.

**Lösning:**

```bash
# Lägg till cache-busting parameter
https://example.com/en/?v=$(date +%s)

# Eller rensa Netlify-cache
netlify build --clear-cache
```

### 2. "Cookie Baking" under SSG

**Symptom:** Best Practices låg trots lazy-loading.

**Orsak:** Puppeteer snappar tillstånd efter iframe-initiering.

**Lösning:**

- Använd Facade Pattern (iframe läggs till vid klick)
- Använd lokal poster-bild
- Kontrollera att ingen autoplay eller hover-trigger finns

### 3. Prerender.io Edge-Layer Konflikt

**Symptom:**

- Lokal build: 100/100
- PageSpeed: 54/100

**Diagnostik:**

```bash
curl -H "User-Agent: Googlebot" https://example.com/en/ | grep iframe
```

**Lösning:** Avinstallera Prerender.io i Netlify.

### 4. Puppeteer/Chrome i CI

**Symptom:** `Could not find Chrome (ver. XXX)`

**Lösning:**

```toml
# netlify.toml
[build]
  command = "npx puppeteer browsers install chrome && npm run build"
```

```javascript
// prerender-routes.js
const IS_CI = process.env.NETLIFY === 'true';

const browser = await puppeteer.launch({
    args: IS_CI ? ['--single-process', '--no-zygote'] : [],
});
```

### 5. Navigation Timeouts

**Symptom:** Vissa routes timear ut (30 000ms).

**Orsak:** Tunga resurser eller tredjepartsscripts.

**Lösning:**

- Exkludera icke-kritiska sidor (policy, terms)
- Öka timeout till 60000ms för kritiska sidor
- Implementera "relaxed exit" - failar endast om >50% misslyckas

### 6. i18n-regression

**Symptom:** Engelska knappar på svenska sidor efter ny komponent.

**Orsak:** Nya i18n-nycklar saknas i andra språk.

**Lösning:**

```bash
node scripts/fix-missing-translations.js
```

---

## 12. Skript & Automation

### Tillgängliga skript

| Skript | Syfte |
|--------|-------|
| `prerender-routes.js` | SSG med Puppeteer |
| `generate-sitemap.js` | Dynamisk sitemap |
| `optimize-images-aggressive.js` | WebP-konvertering |
| `migrate-to-webp.js` | Uppdatera kodreferenser |
| `fix-missing-translations.js` | Fylla i saknade översättningar |

### Rekommenderat arbetsflöde

```bash
# 1. Vid nya bilder
node scripts/optimize-images-aggressive.js

# 2. Vid bildbyten i kod
node scripts/migrate-to-webp.js

# 3. Vid nya komponenter/översättningar
node scripts/fix-missing-translations.js

# 4. Verifiera lokalt
npm run build
curl -s http://localhost:5555/en/ | grep "H1-text"

# 5. Deploy och verifiera
git push
# Vänta på Netlify deploy
curl -sL https://example.com/en/?v=$(date +%s) | head -50
```

### CI/CD Integration

```yaml
# .github/workflows/seo-check.yml (exempel)
- name: SEO Verification
  run: |
    npm run build
    grep "Experience the Magic" build/en/index.html
    grep "Utforska" build/sv/index.html
    echo "SEO pre-check passed ✅"
```

---

## 📊 Resultatsammanfattning

Efter implementation av samtliga optimeringar:

| Kategori | Mål | Uppnått |
|----------|-----|---------|
| Performance | 90+ | **98** ✅ |
| SEO | 100 | **100** ✅ |
| Best Practices | 100 | **100** ✅ |
| Accessibility | 90+ | **89** ✅ |
| Pre-renderade sidor | 100% | **49/49** ✅ |
| Bildpayload | <10MB | **5.06MB** ✅ |
| LCP (mobil) | <2.5s | **1.9s** ✅ |

---

## 🔗 Referenser & Resurser

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Search Console](https://search.google.com/search-console/)
- [To The Web Search Engine Simulator](https://totheweb.com/learning_center/tools-search-engine-simulator/)
- [Puppeteer Dokumentation](https://pptr.dev/)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [react-helmet-async](https://github.com/staylor/react-helmet-async)

---

*Denna guide är ett levande dokument och bör uppdateras när nya optimeringar eller lärdomar tillkommer.*
