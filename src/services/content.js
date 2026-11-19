/**
 * CONTENT SERVICE: the one place where data enters the app.
 *
 * Today: content comes from local JSON files + site.config.js.
 * Later (backend): replace the bodies below with API calls, e.g.
 *
 *   export async function getContent(lang) {
 *     const res = await fetch(`${API_URL}/content?lang=${lang}`);
 *     return res.json();
 *   }
 *
 * As long as the API returns the same shape as src/i18n/locales/*.json,
 * no component needs to change.
 */
import { siteConfig } from '../config/site.config.js';

const locales = import.meta.glob('../i18n/locales/*.json', { import: 'default' });
const cache = new Map();

export async function getContent(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const loader = locales[`../i18n/locales/${lang}.json`];
  if (!loader) throw new Error(`Missing locale file: ${lang}.json`);
  const data = await loader();
  cache.set(lang, data);
  return data;
}

export async function getSiteConfig() {
  return siteConfig;
}

/**
 * Volunteer / interest form.
 * TODO (backend): POST to the API, e.g. fetch(`${API_URL}/volunteers`, { method: 'POST', body: JSON.stringify(payload) })
 * For now it only simulates a successful request.
 */
export async function submitVolunteer(payload) {
  await new Promise((r) => setTimeout(r, 900));
  if (import.meta.env.DEV) console.info('[submitVolunteer] payload', payload);
  return { ok: true };
}
