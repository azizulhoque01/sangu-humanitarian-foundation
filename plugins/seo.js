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

export function seoPlugin() {
  return {
    name: 'shf-seo',

    // Default-language tags in index.html (dev server + build)
    transformIndexHtml: {
      order: 'post',
      handler: (html) => localize(html, siteConfig.defaultLang),
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
