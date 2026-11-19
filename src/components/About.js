import { html, delay } from '../utils/dom.js';
import { icon, iconFor } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';
import { formatNumber } from '../i18n/index.js';

export function About({ c, cfg }) {
  const a = c.about;
  return html`
    <section id="about" class="section overflow-hidden">
      <div class="container-x grid items-center gap-16 lg:grid-cols-2">
        <!-- Visual: no beneficiary photos (constitution §24): a brand illustration instead -->
        <div class="relative" data-animate="slide-start">
          <div class="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary-700 via-primary-800 to-primary-950 p-8 text-white shadow-lift sm:p-12">
            <div class="bg-dots absolute inset-0 opacity-30 invert"></div>
            <div class="absolute -end-16 -top-16 size-56 rounded-full bg-secondary-500/30 blur-2xl"></div>
            <div class="relative">
              ${icon('quote', 'size-12 text-secondary-300 rtl:-scale-x-100')}
              <p class="mt-4 text-2xl font-bold leading-snug sm:text-3xl">${c.brand.motto}</p>
              <p class="mt-4 text-primary-100/90">${c.brand.tagline}</p>
              <div class="mt-10 flex items-center gap-4">
                <img src="${cfg.logo}" alt="" width="64" height="64" class="size-16 rounded-full bg-white ring-4 ring-white/20" />
                <div>
                  <p class="font-semibold">${c.brand.name}</p>
                  <p class="text-sm text-secondary-200">${c.topbar.est} ${formatNumber(cfg.established, { plain: true })}</p>
                </div>
              </div>
            </div>
            <!-- river lines -->
            <svg class="absolute inset-x-0 bottom-0 h-20 w-full text-white/10" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 50 Q 50 30 100 50 T 200 50 T 300 50 T 400 50" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M0 65 Q 50 45 100 65 T 200 65 T 300 65 T 400 65" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <!-- floating "working area" card -->
          <div class="card absolute -bottom-10 end-4 max-w-xs p-5! sm:end-[-1.5rem]" data-animate="fade-up" style="--d:300ms">
            <div class="flex gap-3">
              <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary-100 text-secondary-600">${icon('map-pin', 'size-5')}</span>
              <div>
                <p class="font-bold text-primary-900">${a.areaTitle}</p>
                <p class="mt-1 text-sm text-ink-soft">${c.contact.addressValue}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-8 lg:pt-0">
          ${SectionHeading({ eyebrow: a.eyebrow, title: a.title, align: 'start' })}
          <div class="mt-6 space-y-4 text-lg text-ink-soft" data-animate="fade-up" style="--d:100ms">
            ${a.story.map((p) => html`<p>${p}</p>`)}
            <p>${a.area}</p>
          </div>

          <h3 class="mt-10 text-lg font-bold text-primary-900" data-animate="fade-up">${a.natureTitle}</h3>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            ${a.nature.map(
              (n, i) => html`
                <div class="group flex gap-4 rounded-2xl p-3 transition hover:bg-surface-muted" data-animate="fade-up" style="${delay(i)}">
                  <span class="icon-tile size-12">${iconFor(n.id, 'size-6')}</span>
                  <div>
                    <p class="font-bold text-primary-900">${n.title}</p>
                    <p class="text-sm text-ink-soft">${n.text}</p>
                  </div>
                </div>
              `,
            )}
          </div>

          <p class="mt-8 flex gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-800 ring-1 ring-primary-100" data-animate="fade-up">
            ${icon('info', 'mt-0.5 size-5 shrink-0 text-primary-500')}<span>${a.notice}</span>
          </p>
        </div>
      </div>
    </section>
  `;
}
