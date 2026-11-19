/**
 * Tiny i18n layer.
 * - Keeps the active language + its dictionary.
 * - t('donate.title') looks up a dotted key in the current dictionary.
 * - Updates <html lang dir>, persists the choice, and formats numbers per locale.
 */
import { siteConfig } from '../config/site.config.js';

const STORAGE_KEY = 'shf.lang';
const state = { lang: siteConfig.defaultLang, dict: {} };

export const getLang = () => state.lang;
export const getDict = () => state.dict;
export const getLanguage = (code = state.lang) =>
  siteConfig.languages.find((l) => l.code === code) ?? siteConfig.languages[0];
export const isSupported = (code) => siteConfig.languages.some((l) => l.code === code);

/** URL path of a language: default → "/", others → "/en/", "/ar/" */
export const langPath = (code) => (code === siteConfig.defaultLang ? '/' : `/${code}/`);

/** Language from the URL path ("/en/…" → "en"), or null */
function langFromPath() {
  const first = location.pathname.split('/').filter(Boolean)[0];
  return isSupported(first) ? first : null;
}

/**
 * Language to start with:
 * /en/ or /ar/ path → ?lang= (old links) → saved choice → default
 * A language path always wins so shared links open in the language they were shared in.
 */
export function detectInitialLang() {
  const fromPath = langFromPath();
  if (fromPath) return fromPath;
  const fromQuery = new URLSearchParams(location.search).get('lang');
  if (isSupported(fromQuery)) return fromQuery;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isSupported(saved)) return saved;
  } catch { /* storage unavailable */ }
  return siteConfig.defaultLang;
}

export function setLang(code, dict) {
  state.lang = code;
  state.dict = dict;
  const { dir } = getLanguage(code);
  document.documentElement.lang = code;
  document.documentElement.dir = dir;
  try { localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }

  // Keep the URL in sync (/ , /en/ , /ar/) so the address bar is always shareable.
  // Every language path is a real built page (see plugins/seo.js), so reloading it works.
  const url = new URL(location.href);
  url.pathname = langPath(code);
  url.searchParams.delete('lang');
  if (url.href !== location.href) history.replaceState(null, '', url);
}

/** t('a.b.c', fallback) */
export function t(key, fallback = '') {
  const value = key.split('.').reduce((obj, k) => (obj == null ? obj : obj[k]), state.dict);
  return value ?? fallback ?? key;
}

/** Locale-aware number: 2026 → ২০২৬ (bn) / ٢٠٢٦ (ar) */
export function formatNumber(n, { plain = false } = {}) {
  return new Intl.NumberFormat(getLanguage().intl, { useGrouping: !plain }).format(n);
}
