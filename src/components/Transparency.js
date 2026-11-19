import { html, delay } from '../utils/dom.js';
import { iconFor } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';
import { formatNumber } from '../i18n/index.js';

export function Transparency({ c }) {
  const t = c.transparency;
  return html`
    <section id="transparency" class="section bg-surface-muted">
      <div class="bg-dots pointer-events-none absolute inset-0 opacity-50"></div>
      <div class="container-x relative">
        ${SectionHeading({ eyebrow: t.eyebrow, title: t.title, subtitle: t.subtitle })}
        <div class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          ${t.items.map(
            (item, i) => html`
              <article class="card card-hover group overflow-hidden" data-animate="fade-up" style="${delay(i % 3)}">
                <span class="absolute inset-x-0 top-0 h-1 origin-[left] scale-x-0 bg-linear-to-r from-primary-500 to-secondary-500 transition-transform duration-500 group-hover:scale-x-100 rtl:origin-[right]"></span>
                <div class="flex items-center justify-between">
                  <span class="icon-tile">${iconFor(item.id, 'size-7')}</span>
                  <span class="text-sm font-bold text-primary-200">${formatNumber(i + 1).padStart(2, formatNumber(0))}</span>
                </div>
                <h3 class="mt-5 text-xl font-bold text-primary-900">${item.title}</h3>
                <p class="mt-2 text-ink-soft">${item.text}</p>
              </article>
            `,
          )}
        </div>
      </div>
    </section>
  `;
}
