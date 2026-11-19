import { html } from '../utils/dom.js';
import { icon } from './ui/Icon.js';

/** Segmented language switcher. variant: 'light' (on dark bg) | 'dark' (on light bg) */
export function LangSwitcher({ c, cfg, current, variant = 'light' }) {
  const wrap = variant === 'light' ? 'bg-white/10 ring-white/20' : 'bg-primary-50 ring-primary-100';
  const idle = variant === 'light' ? 'text-white/80 hover:text-white' : 'text-ink-soft hover:text-primary-700';
  return html`
    <div class="inline-flex items-center gap-1 rounded-full p-1 ring-1 ${wrap}" role="group" aria-label="${c.actions.language}">
      ${icon('globe', `ms-1.5 me-0.5 size-4 ${variant === 'light' ? 'text-white/70' : 'text-primary-500'}`)}
      ${cfg.languages.map(
        (l) => html`
          <button
            type="button"
            data-lang="${l.code}"
            lang="${l.code}"
            aria-pressed="${l.code === current}"
            title="${l.label}"
            class="rounded-full px-2.5 py-1 text-xs font-semibold transition ${l.code === current
              ? 'bg-secondary-500 text-white shadow'
              : idle}"
          >${l.short}</button>
        `,
      )}
    </div>
  `;
}
