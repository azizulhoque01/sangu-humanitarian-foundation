import { html, delay } from '../utils/dom.js';
import { iconFor } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';

export function Committee({ c, cfg }) {
  const cm = c.committee;
  return html`
    <section id="committee" class="section">
      <div class="container-x">
        ${SectionHeading({ eyebrow: cm.eyebrow, title: cm.title, subtitle: cm.subtitle })}
        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          ${cm.roles.map((role, i) => {
            const member = cfg.committee[role.id] ?? {};
            return html`
              <article class="card card-hover group text-center" data-animate="fade-up" style="${delay(i % 4)}">
                <div class="relative mx-auto size-24">
                  <span class="absolute inset-0 rounded-full bg-linear-to-br from-primary-500 to-secondary-400 transition duration-500 group-hover:rotate-180"></span>
                  ${member.photo
                    ? html`<img src="${member.photo}" alt="${member.name ?? role.title}" class="absolute inset-1 size-[5.5rem] rounded-full object-cover" loading="lazy" />`
                    : html`<span class="absolute inset-1 grid place-items-center rounded-full bg-white text-primary-600">${iconFor(role.id, 'size-9')}</span>`}
                </div>
                <h3 class="mt-5 text-lg font-bold text-primary-900">${role.title}</h3>
                <p class="mt-1 text-sm font-semibold ${member.name ? 'text-secondary-600' : 'italic text-ink-soft/70'}">${member.name ?? cm.tba}</p>
                <p class="mt-3 text-sm text-ink-soft">${role.duty}</p>
              </article>
            `;
          })}
        </div>
      </div>
    </section>
  `;
}
