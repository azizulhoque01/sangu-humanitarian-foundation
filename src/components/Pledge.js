import { html, delay } from '../utils/dom.js';
import { icon } from './ui/Icon.js';

export function Pledge({ c }) {
  const p = c.pledge;
  return html`
    <section id="pledge" class="bg-hero relative overflow-hidden py-24 text-white lg:py-32">
      <div class="pointer-events-none absolute inset-0 m-auto size-[40rem] rounded-full bg-secondary-500/10 blur-3xl"></div>
      <div class="container-x relative max-w-4xl! text-center">
        <span class="eyebrow eyebrow-dark" data-animate="fade-down">${icon('heart-handshake', 'size-4')}${p.eyebrow}</span>
        <div class="mt-10 space-y-6">
          ${p.lines.map(
            (line, i) => html`<p class="text-xl leading-relaxed text-primary-50/90 sm:text-2xl" data-animate="fade-up" style="${delay(i, 150)}">${line}</p>`,
          )}
        </div>
        <p class="text-gradient mt-12 text-3xl font-extrabold leading-snug sm:text-5xl" data-animate="zoom" style="--d:500ms">${p.closing}</p>
        <div class="mt-10 flex flex-wrap justify-center gap-3" data-animate="fade-up" style="--d:650ms">
          <a href="#donate" class="btn btn-primary btn-shine">${icon('hand-heart', 'size-5')}${c.actions.donate}</a>
          <a href="#involved" class="btn btn-ghost-light">${icon('user-plus', 'size-5')}${c.actions.joinVolunteer}</a>
        </div>
      </div>
    </section>
  `;
}
