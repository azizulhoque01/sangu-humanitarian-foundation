import { html } from '../utils/dom.js';
import { icon } from './ui/Icon.js';
import { formatNumber } from '../i18n/index.js';

export function Footer({ c, cfg }) {
  const year = formatNumber(Math.max(new Date().getFullYear(), cfg.established), { plain: true });
  return html`
    <footer class="relative overflow-hidden bg-primary-950 text-primary-100/80">
      <div class="h-1 bg-linear-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
      <div class="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <div class="flex items-center gap-3">
            <img src="${cfg.logo}" alt="" width="56" height="56" class="size-14 rounded-full bg-white" loading="lazy" />
            <div>
              <p class="text-lg font-bold text-white">${c.brand.name}</p>
              <p class="text-sm text-secondary-300">${c.brand.motto}</p>
            </div>
          </div>
          <p class="mt-5 max-w-md">${c.footer.about}</p>
          <div class="mt-6 flex gap-2">
            ${cfg.socials.map(
              (s) => html`<a href="${s.url}" aria-label="${s.id}" class="grid size-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-secondary-500 hover:text-white">${icon(s.id, 'size-5')}</a>`,
            )}
          </div>
        </div>

        <div class="lg:col-span-3">
          <p class="font-bold text-white">${c.footer.quickLinks}</p>
          <ul class="mt-4 space-y-2.5">
            ${cfg.nav.map((id) => html`<li><a href="#${id}" class="transition hover:text-secondary-300">${c.nav[id]}</a></li>`)}
          </ul>
        </div>

        <div class="lg:col-span-4">
          <p class="font-bold text-white">${c.footer.programs}</p>
          <ul class="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            ${c.programs.items.map(
              (p) => html`<li><a href="#programs" class="inline-flex items-center gap-2 transition hover:text-secondary-300">${icon('leaf', 'size-4 text-secondary-400')}${p.title}</a></li>`,
            )}
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div class="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm sm:flex-row">
          <p>© ${year} ${c.brand.name}. ${c.footer.rights}</p>
          <p class="italic text-secondary-300" lang="en">${c.footer.closing}</p>
        </div>
      </div>
    </footer>

    <button type="button" class="to-top fixed bottom-6 end-6 z-40 grid size-12 place-items-center rounded-full bg-secondary-500 text-white shadow-lg shadow-secondary-700/40 transition hover:bg-secondary-600"
      data-scroll-top aria-label="${c.actions.backToTop}">
      ${icon('arrow-up', 'size-5')}
    </button>
  `;
}
