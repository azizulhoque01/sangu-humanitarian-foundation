import { html, delay } from '../utils/dom.js';
import { icon, iconFor } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';
import { formatNumber } from '../i18n/index.js';

export function ProgramCard(p, i) {
  return html`
    <article class="card card-hover group flex flex-col" data-animate="fade-up" style="${delay(i % 4)}">
      <span class="absolute end-6 top-6 text-4xl font-extrabold text-primary-100 transition group-hover:text-secondary-100">
        ${formatNumber(i + 1).padStart(2, formatNumber(0))}
      </span>
      <span class="icon-tile">${iconFor(p.id, 'size-7')}</span>
      <h3 class="mt-6 text-xl font-bold text-primary-900">${p.title}</h3>
      <ul class="mt-4 space-y-2.5 text-[0.95rem] text-ink-soft">
        ${p.points.map(
          (pt) => html`<li class="flex gap-2.5">
            <span class="mt-1 grid size-4.5 shrink-0 place-items-center rounded-full bg-secondary-100 text-secondary-600">${icon('check', 'size-3', { strokeWidth: 3 })}</span>
            <span>${pt}</span>
          </li>`,
        )}
      </ul>
    </article>
  `;
}

export function Programs({ c }) {
  const p = c.programs;
  return html`
    <section id="programs" class="section">
      <div class="container-x">
        ${SectionHeading({ eyebrow: p.eyebrow, title: p.title, subtitle: p.subtitle })}
        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          ${p.items.map((item, i) => ProgramCard(item, i))}
        </div>
        <div class="mt-12 flex justify-center" data-animate="fade-up">
          <a href="#donate" class="btn btn-blue btn-shine">${icon('hand-heart', 'size-5')}${c.actions.donate}${icon('arrow-right', 'size-4 rtl:-scale-x-100')}</a>
        </div>
      </div>
    </section>
  `;
}
