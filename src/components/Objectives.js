import { html, delay } from '../utils/dom.js';
import { SectionHeading } from './ui/SectionHeading.js';
import { formatNumber } from '../i18n/index.js';

export function Objectives({ c }) {
  const o = c.objectives;
  return html`
    <section id="objectives" class="section bg-hero overflow-hidden text-white">
      <div class="pointer-events-none absolute -start-32 top-1/3 size-96 rounded-full bg-secondary-500/15 blur-3xl"></div>
      <div class="container-x relative">
        ${SectionHeading({ eyebrow: o.eyebrow, title: o.title, dark: true })}
        <ol class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          ${o.items.map(
            (item, i) => html`
              <li class="group flex items-start gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:ring-secondary-400/40"
                data-animate="fade-up" style="${delay(i % 3)}">
                <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-secondary-400 to-secondary-600 text-lg font-bold text-white shadow-lg shadow-secondary-900/30 transition group-hover:scale-110">
                  ${formatNumber(i + 1)}
                </span>
                <p class="pt-1.5 text-primary-50/90">${item}</p>
              </li>
            `,
          )}
        </ol>
      </div>
    </section>
  `;
}
