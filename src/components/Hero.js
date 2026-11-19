import { html, delay } from '../utils/dom.js';
import { icon } from './ui/Icon.js';
import { Wave } from './ui/Wave.js';
import { formatNumber } from '../i18n/index.js';

/** Logo inside rotating / pulsing rings with floating value chips */
function LogoOrbit({ c, cfg }) {
  const chips = [
    { icon: 'hand-heart', label: c.principles.items[0]?.title, pos: 'top-6 -start-2 sm:start-0', d: '0s' },
    { icon: 'eye', label: c.principles.items[2]?.title, pos: 'bottom-16 -end-2 sm:end-0', d: '1.2s' },
    { icon: 'users', label: c.principles.items[3]?.title, pos: 'bottom-0 start-10', d: '2.4s' },
  ];
  return html`
    <div class="relative mx-auto aspect-square w-[min(84vw,27rem)]" data-animate="zoom" style="--d:250ms">
      <div class="absolute inset-0 rounded-full border-2 border-dashed border-white/20 animate-spin-slow"></div>
      <div class="absolute inset-8 rounded-full bg-white/5 ring-1 ring-white/10"></div>
      <div class="absolute inset-14 rounded-full bg-secondary-400/30 animate-pulse-ring"></div>
      <div class="absolute inset-14 animate-float">
        <img src="${cfg.logo}" alt="${c.brand.name}" width="320" height="320"
          class="size-full rounded-full bg-white object-cover shadow-2xl shadow-primary-950/60 ring-8 ring-white/15" />
      </div>
      ${chips.map(
        (ch) => html`
          <div class="absolute ${ch.pos} animate-float" style="animation-delay:${ch.d}">
            <span class="inline-flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2 text-sm font-semibold text-primary-800 shadow-xl">
              <span class="grid size-7 place-items-center rounded-lg bg-secondary-100 text-secondary-600">${icon(ch.icon, 'size-4')}</span>
              ${ch.label}
            </span>
          </div>
        `,
      )}
    </div>
  `;
}

export function Hero({ c, cfg }) {
  const h = c.hero;
  return html`
    <section id="hero" class="bg-hero relative overflow-hidden pt-36 pb-40 text-white md:pt-44 lg:pb-48">
      <!-- decorative leaves / glow -->
      <div class="pointer-events-none absolute -end-24 top-24 size-72 rounded-full bg-secondary-500/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -start-20 bottom-10 size-72 rounded-full bg-primary-400/20 blur-3xl"></div>

      <div class="container-x relative grid items-center gap-14 lg:grid-cols-2">
        <div class="text-center lg:text-start">
          <span class="eyebrow eyebrow-dark" data-animate="fade-down">
            ${icon('waves', 'size-4')}${h.eyebrow}
          </span>
          <h1 class="mt-6 text-4xl font-extrabold leading-[1.2] sm:text-5xl lg:text-6xl" data-animate="fade-up" style="--d:100ms">
            <span class="block">${h.titleLead}</span>
            <span class="text-gradient block">${h.titleHighlight}</span>
          </h1>
          <p class="mx-auto mt-6 max-w-xl text-lg text-primary-100/90 lg:mx-0" data-animate="fade-up" style="--d:200ms">${h.subtitle}</p>

          <div class="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start" data-animate="fade-up" style="--d:300ms">
            <a href="#donate" class="btn btn-primary btn-shine px-7 py-3.5 text-lg">
              ${icon('hand-heart', 'size-5')}${c.actions.donate}
            </a>
            <a href="#involved" class="btn btn-ghost-light px-7 py-3.5 text-lg">
              ${icon('user-plus', 'size-5')}${c.actions.joinVolunteer}
            </a>
          </div>

          <ul class="mt-9 flex flex-wrap justify-center gap-2 lg:justify-start">
            ${h.badges.map(
              (b, i) => html`<li data-animate="fade-up" style="${delay(i, 80, 400)}"
                class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 ring-1 ring-white/15">
                ${icon('check', 'size-4 text-secondary-300')}${b}</li>`,
            )}
          </ul>
        </div>

        ${LogoOrbit({ c, cfg })}
      </div>

      ${Wave({ fill: '#ffffff' })}
    </section>
  `;
}

export function Stats({ c, cfg }) {
  const iconOf = { programs: 'heart-handshake', objectives: 'target', principles: 'shield-check', founded: 'sprout' };
  return html`
    <div class="relative z-10 -mt-24 sm:-mt-28">
      <div class="container-x">
        <div class="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-primary-100 shadow-lift ring-1 ring-primary-100 lg:grid-cols-4">
          ${cfg.stats.map(
            (s, i) => html`
              <div class="group flex flex-col items-center gap-2 bg-white p-6 text-center sm:p-8" data-animate="fade-up" style="${delay(i)}">
                <span class="icon-tile size-12">${icon(iconOf[s.id] ?? 'sparkles', 'size-6')}</span>
                <span class="mt-1 text-3xl font-extrabold text-primary-800 sm:text-4xl" data-count="${s.value}" data-plain="${!!s.plain}">${formatNumber(0)}</span>
                <span class="text-sm font-medium text-ink-soft sm:text-base">${c.stats[s.id]}</span>
              </div>
            `,
          )}
        </div>
      </div>
    </div>
  `;
}
