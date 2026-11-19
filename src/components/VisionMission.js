import { html } from '../utils/dom.js';
import { icon } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';

export function VisionMission({ c }) {
  const v = c.visionMission;
  return html`
    <section id="visionMission" class="section bg-surface-muted">
      <div class="bg-dots pointer-events-none absolute inset-0 opacity-60"></div>
      <div class="container-x relative">
        ${SectionHeading({ eyebrow: v.eyebrow, title: v.title })}
        <div class="mt-14 grid gap-6 lg:grid-cols-2">
          <article class="group relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary-600 to-primary-800 p-8 text-white shadow-lift transition duration-300 hover:-translate-y-1 sm:p-10" data-animate="slide-start">
            <div class="absolute -end-10 -top-10 size-48 rounded-full bg-white/10 transition duration-500 group-hover:scale-125"></div>
            <span class="relative grid size-16 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">${icon('telescope', 'size-8')}</span>
            <h3 class="relative mt-6 text-2xl font-bold sm:text-3xl">${v.vision.title}</h3>
            <p class="relative mt-4 text-lg leading-relaxed text-primary-50/90">${v.vision.text}</p>
          </article>
          <article class="group relative overflow-hidden rounded-[2rem] bg-linear-to-br from-secondary-500 to-secondary-700 p-8 text-white shadow-lift transition duration-300 hover:-translate-y-1 sm:p-10" data-animate="slide-end">
            <div class="absolute -end-10 -top-10 size-48 rounded-full bg-white/10 transition duration-500 group-hover:scale-125"></div>
            <span class="relative grid size-16 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">${icon('target', 'size-8')}</span>
            <h3 class="relative mt-6 text-2xl font-bold sm:text-3xl">${v.mission.title}</h3>
            <p class="relative mt-4 text-lg leading-relaxed text-secondary-50/95">${v.mission.text}</p>
          </article>
        </div>
      </div>
    </section>
  `;
}
