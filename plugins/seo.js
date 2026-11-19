/**
 * SEO / social-share plugin
 * -------------------------
 * Social bots (WhatsApp, Facebook, X, LinkedIn, Telegram…) do NOT run JavaScript,
 * so the share preview must already be in the HTML file.
 *
 * At build time this plugin:
 *   1. fills <!-- SEO:START --> … <!-- SEO:END --> in index.html with the default language's tags
 *   2. emits one more copy per extra language: dist/en/index.html, dist/ar/index.html …
 *      each with its own <html lang dir>, title, description, Open Graph & Twitter tags.
 *
 * All values come from src/i18n/locales/*.json (meta.*, brand.*) and src/config/site.config.js.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../src/config/site.config.js';

const localeFile = (code) => new URL(`../src/i18n/locales/${code}.json`, import.meta.url);
const loadLocale = (code) => JSON.parse(readFileSync(fileURLToPath(localeFile(code)), 'utf-8'));

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const abs = (path) => siteConfig.siteUrl.replace(/\/$/, '') + path;
const langPath = (code) => (code === siteConfig.defaultLang ? '/' : `/${code}/`);

function seoTags(code) {
  const c = loadLocale(code);
  const lang = siteConfig.languages.find((l) => l.code === code);
  const url = abs(langPath(code));
  const image = abs(siteConfig.ogImage(code));
  const imageAlt = `${c.brand.name}: ${c.brand.motto}`;

  const tag = (attr, key, value) => `<meta ${attr}="${key}" content="${esc(value)}" />`;
  const og = (k, v) => tag('property', `og:${k}`, v);
  const tw = (k, v) => tag('name', `twitter:${k}`, v);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: c.brand.name,
    alternateName: c.brand.subname,
    url,
    logo: abs(siteConfig.logo),
    image,
    slogan: c.brand.motto,
    description: c.meta.description,
    foundingDate: String(siteConfig.established),
    inLanguage: code,
    sameAs: siteConfig.socials.map((s) => s.url).filter((u) => /^https?:\/\//.test(u)),
  };

  return [
    `<title>${esc(c.meta.title)}</title>`,
    tag('name', 'description', c.meta.description),
    `<link rel="canonical" href="${url}" />`,
    ...siteConfig.languages.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${abs(langPath(l.code))}" />`),
    `<link rel="alternate" hreflang="x-default" href="${abs('/')}" />`,

    // Open Graph (WhatsApp, Facebook, LinkedIn, Telegram, Messenger…)
    og('type', 'website'),
    og('site_name', c.brand.name),
    og('title', c.meta.title),
    og('description', c.meta.description),
    og('url', url),
    og('image', image),
    og('image:secure_url', image),
    og('image:type', 'image/jpeg'),
    og('image:width', '1200'),
    og('image:height', '630'),
    og('image:alt', imageAlt),
    og('locale', lang.ogLocale),
    ...siteConfig.languages.filter((l) => l.code !== code).map((l) => og('locale:alternate', l.ogLocale)),

    // X / Twitter
    tw('card', 'summary_large_image'),
    tw('title', c.meta.title),
    tw('description', c.meta.description),
    tw('image', image),
    tw('image:alt', imageAlt),

    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

const SEO_BLOCK = /<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/;

function localize(html, code) {
  const { dir } = siteConfig.languages.find((l) => l.code === code);
  return html
    .replace(/<html[^>]*>/, `<html lang="${code}" dir="${dir}">`)
    .replace(SEO_BLOCK, `<!-- SEO:START -->\n    ${seoTags(code)}\n    <!-- SEO:END -->`);
}

/** Read an analytics ID from siteConfig.analytics and check its format */
function analyticsId(key, pattern, example) {
  const id = siteConfig.analytics?.[key]?.trim();
  if (id && !pattern.test(id)) throw new Error(`analytics.${key} "${id}" should look like ${example}`);
  return id || '';
}

/** Analytics snippets: { head, body }, empty strings when no ID is set */
function analyticsSnippets() {
  const gtm = analyticsId('gtmContainerId', /^GTM-[A-Z0-9]+$/i, 'GTM-XXXXXXX');
  const ga = analyticsId('gaMeasurementId', /^G-[A-Z0-9]+$/i, 'G-XXXXXXXXXX');
  const head = [];
  let body = '';

  if (gtm) {
    head.push(`<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtm}');</script>
    <!-- End Google Tag Manager -->`);
    body = `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtm}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;
  }
  if (ga) {
    head.push(`<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${ga}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ga}');
    </script>`);
  }
  return { head: head.join('\n    '), body };
}

export function seoPlugin() {
  let isBuild = false;
  return {
    name: 'shf-seo',

    configResolved(config) {
      isBuild = config.command === 'build';
    },

    // Default-language tags in index.html (dev server + build); analytics only in the build
    transformIndexHtml: {
      order: 'post',
      handler: (html) => {
        let out = localize(html, siteConfig.defaultLang);
        if (!isBuild) return out;
        const { head, body } = analyticsSnippets();
        // head: right after <meta viewport> so <meta charset> stays first; body: right after <body>
        if (head) out = out.replace(/(<meta name="viewport"[^>]*>)/, `$1\n    ${head}`);
        if (body) out = out.replace(/(<body[^>]*>)/, `$1\n    ${body}`);
        return out;
      },
    },

    // Extra language pages for the build: dist/<code>/index.html
    // (done after writing, when the final index.html with hashed asset names exists on disk)
    writeBundle(options) {
      const outDir = options.dir;
      const indexPath = join(outDir, 'index.html');
      if (!existsSync(indexPath)) return;
      const source = readFileSync(indexPath, 'utf-8');
      for (const { code } of siteConfig.languages) {
        if (code === siteConfig.defaultLang) continue;
        mkdirSync(join(outDir, code), { recursive: true });
        writeFileSync(join(outDir, code, 'index.html'), localize(source, code));
      }
    },

    // Dev server: serve /en/ and /ar/ with their own tags too
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const code = req.url?.split('?')[0].match(/^\/([a-z]{2})\/?$/)?.[1];
        const lang = siteConfig.languages.find((l) => l.code === code && code !== siteConfig.defaultLang);
        if (!lang) return next();
        if (!req.url.split('?')[0].endsWith('/')) {
          res.writeHead(301, { Location: `/${code}/` });
          return res.end();
        }
        const raw = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf-8');
        const html = await server.transformIndexHtml(req.url, raw);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(localize(html, code));
      });
    },
  };
}
