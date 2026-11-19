import { html, delay } from '../utils/dom.js';
import { icon, iconFor } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';

export function Principles({ c }) {
  const p = c.principles;
  return html`
    <section id="principles" class="section">
      <div class="container-x grid gap-12 lg:grid-cols-3">
        <div class="lg:sticky lg:top-28 lg:self-start">
          ${SectionHeading({ eyebrow: p.eyebrow, title: p.title, align: 'start' })}
          <blockquote class="relative mt-8 rounded-3xl bg-secondary-50 p-6 ring-1 ring-secondary-100" data-animate="fade-up" style="--d:120ms">
            ${icon('quote', 'size-8 text-secondary-400 rtl:-scale-x-100')}
            <p class="mt-3 text-lg font-medium text-secondary-900">${p.commitment}</p>
          </blockquote>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:col-span-2">
          ${p.items.map(
            (item, i) => html`
              <article class="card card-hover group flex gap-5 p-6! ${i === p.items.length - 1 && p.items.length % 2 ? 'sm:col-span-2' : ''}"
                data-animate="fade-up" style="${delay(i % 2)}">
                <span class="icon-tile">${iconFor(item.id, 'size-7')}</span>
                <div>
                  <h3 class="text-xl font-bold text-primary-900">${item.title}</h3>
                  <p class="mt-1.5 text-ink-soft">${item.text}</p>
                </div>
              </article>
            `,
          )}
        </div>
      </div>
    </section>
  `;
}
