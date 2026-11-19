/**
 * Safe HTML templating.
 * html`<p>${value}</p>` escapes every interpolated value unless it is
 * already HTML produced by html`` / raw(). This keeps content from an API safe.
 */
class SafeHtml {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Mark a trusted string (e.g. an SVG icon) as HTML */
export const raw = (s) => new SafeHtml(String(s));

function toHtml(value) {
  if (value == null || value === false) return '';
  if (Array.isArray(value)) return value.map(toHtml).join('');
  if (value instanceof SafeHtml) return value.value;
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = '';
  strings.forEach((str, i) => {
    out += str;
    if (i < values.length) out += toHtml(values[i]);
  });
  return new SafeHtml(out);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / insecure origins
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** Stagger delay helper for data-animate children: style="--d:240ms" */
export const delay = (index, step = 90, base = 0) => `--d:${base + index * step}ms`;
