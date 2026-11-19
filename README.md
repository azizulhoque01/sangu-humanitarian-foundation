# Sangu Humanitarian Foundation: Website

Landing page for **সাঙ্গু মানবকল্যাণ ফাউন্ডেশন / Sangu Humanitarian Foundation**.
It is available in Bangla (default), English and Arabic, and Arabic switches the page to RTL.
Built with Vite, Tailwind CSS v4 and plain JavaScript.

```bash
npm install
npm run dev       # http://localhost:5173  (use ?lang=en or ?lang=ar)
npm run build     # production build → dist/
npm run preview   # serve the build
```

## Where to edit things

| I want to change… | Edit this file |
|---|---|
| Any text in any language | `src/i18n/locales/bn.json`, `en.json`, `ar.json` |
| Phone, email, socials, bKash/Nagad/bank numbers, stats, committee names/photos | `src/config/site.config.js` |
| Section order, or hide a section | `sections` in `src/config/site.config.js` |
| Menu items | `nav` in `src/config/site.config.js` |
| Colours, fonts, shadows | `@theme` block at the top of `src/styles/main.css` |
| Shared styles (buttons, cards, headings) | `@layer components` in `src/styles/main.css` |
| Which icon a program, principle or fund uses | `ICON_MAP` in `src/components/ui/Icon.js` |
| Layout of one section | `src/components/<Section>.js` |

> ⚠ Everything marked `PLACEHOLDER` in `site.config.js` (phone, email, payment numbers, socials, map) must be replaced with the real details before launch.

## Language URLs & social sharing

Each language has its own URL, and each URL has its own share preview (title, description, image):

| URL | Language |
|---|---|
| `/` | বাংলা (default) |
| `/en/` | English |
| `/ar/` | العربية |

- WhatsApp, Facebook and other bots don't run JavaScript, so `plugins/seo.js` writes the meta tags
  into the HTML at build time and creates `dist/en/index.html` and `dist/ar/index.html`.
- The text comes from `meta.title`, `meta.description` and `brand.*` in the locale files.
- **Share images** live in `public/images/og/og-<lang>.jpg` (1200×630). After changing the logo, name or motto, regenerate them with
  `npm run og` (needs Chrome installed).
- **Custom domain:** update `siteUrl` in `site.config.js`, since social previews need full URLs.
- **Preview still looks old?** The platforms cache previews:
  - Facebook: <https://developers.facebook.com/tools/debug/> → **Scrape Again**
  - WhatsApp: share the link with something extra added, e.g. `…/en/?v=2`, to get a fresh preview.

## How it is built

```
src/
├─ main.js               boots the app, holds the section registry, handles events
├─ config/site.config.js data that does not depend on language
├─ i18n/                 language detection, t(), number formatting, locale JSON files
├─ services/content.js   ← the ONLY place data is loaded (swap point for the backend)
├─ components/           one file per section, plus ui/ for shared pieces
├─ utils/                html`` templating (auto-escaped), reveal & counter animations
└─ styles/main.css       theme tokens + component classes + animations
```

- **Components** are plain functions: `Section({ c, cfg, lang }) → html`. `c` is the content for the current language and `cfg` is the site config.
- **`html```** escapes every value it inserts, so content coming from an API later cannot inject HTML.
- **Animations**: put `data-animate="fade-up | fade-down | zoom | slide-start | slide-end"` on an element and it animates when scrolled into view. Use `style="--d:200ms"` to delay it. `data-count="12"` counts a number up. All motion is switched off for visitors who prefer reduced motion.
- **RTL**: layouts use logical utilities (`ms-`, `pe-`, `start-`, `end-`), so Arabic mirrors automatically. Directional icons use `rtl:-scale-x-100`.

### Adding a language
1. Copy `src/i18n/locales/en.json` to `xx.json` and translate it.
2. Add `{ code: 'xx', label, short, dir, intl }` to `languages` in `site.config.js`.
3. Optionally add a font rule in `main.css`: `html:lang(xx) { --font-body: ... }`.

### Adding a section
1. Create `src/components/MySection.js` that exports `MySection({ c, cfg })`.
2. Register it in `SECTIONS` in `src/main.js`.
3. Add its id to `sections` (and to `nav` if it should be in the menu) in `site.config.js`.
4. Add its text to each locale file.

## Roadmap

1. **Split into pages**: use Vite multi-page (`about.html`, `programs.html`, `donate.html` and so on). The new pages reuse the same components, locale files and theme.
2. **Backend**: implement `getContent()`, `getSiteConfig()` and `submitVolunteer()` in `src/services/content.js` with `fetch()`. Keep the response shape the same as the locale JSON and nothing else needs to change.

## Content rules (from the constitution)
- Do not describe the foundation as a registered NGO until it is registered (ধারা ২৯).
- Protect the dignity and privacy of aid recipients. Do not use their photos for promotion (ধারা ২৪). The design uses icons and illustrations instead.
- The Arabic translation should be reviewed by a native speaker before launch.
