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

/** Language to start with: ?lang= → saved choice → default */
export function detectInitialLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (isSupported(fromUrl)) return fromUrl;
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

  // Keep ?lang= in the URL in sync (so links can be shared) without reloading
  const url = new URL(location.href);
  if (url.searchParams.has('lang') || code !== siteConfig.defaultLang) {
    url.searchParams.set('lang', code);
    history.replaceState(null, '', url);
  }
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
