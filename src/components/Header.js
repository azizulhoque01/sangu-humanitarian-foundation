import { html } from '../utils/dom.js';
import { icon } from './ui/Icon.js';
import { LangSwitcher } from './LangSwitcher.js';
import { formatNumber } from '../i18n/index.js';

function TopBar({ c, cfg, lang }) {
  const { contact } = cfg;
  return html`
    <div class="topbar hidden border-b border-white/10 text-sm text-white/80 md:block">
      <div class="container-x flex h-11 items-center justify-between gap-4">
        <div class="flex items-center gap-5">
          <a href="tel:${contact.phone.replace(/\s/g, '')}" class="inline-flex items-center gap-1.5 transition hover:text-white" dir="ltr">
            ${icon('phone', 'size-4 text-secondary-300')}<span>${contact.phone}</span>
          </a>
          <a href="mailto:${contact.email}" class="inline-flex items-center gap-1.5 transition hover:text-white">
            ${icon('mail', 'size-4 text-secondary-300')}<span>${contact.email}</span>
          </a>
          <span class="hidden items-center gap-1.5 lg:inline-flex">
            ${icon('award', 'size-4 text-secondary-300')}${c.topbar.est} ${formatNumber(cfg.established, { plain: true })}
          </span>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            ${cfg.socials.map(
              (s) => html`<a href="${s.url}" aria-label="${s.id}" class="grid size-8 place-items-center rounded-full transition hover:bg-white/10 hover:text-white">${icon(s.id, 'size-4')}</a>`,
            )}
          </div>
          ${LangSwitcher({ c, cfg, current: lang, variant: 'light' })}
        </div>
      </div>
    </div>
  `;
}

export function Header({ c, cfg, lang }) {
  const links = cfg.nav.map((id) => ({ id, label: c.nav[id] }));
  return html`
    <header class="site-header fixed inset-x-0 top-0 z-50 transition-all duration-300">
      ${TopBar({ c, cfg, lang })}
      <div class="container-x">
        <nav class="navbar flex items-center justify-between gap-4 transition-all duration-300" aria-label="Main">
          <a href="#hero" class="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <img src="${cfg.logo}" alt="${c.brand.name}" width="52" height="52" class="brand-logo size-12 shrink-0 rounded-full bg-white object-cover shadow-md ring-2 ring-white/60 sm:size-13" />
            <span class="min-w-0 leading-tight">
              <span class="brand-name block truncate text-[0.9rem] font-bold sm:text-lg">${c.brand.name}</span>
              <span class="brand-sub block truncate text-xs font-medium" lang="${lang === 'en' ? 'bn' : 'en'}">${c.brand.subname}</span>
            </span>
          </a>

          <ul class="hidden items-center gap-0.5 xl:flex">
            ${links.map((l) => html`<li><a href="#${l.id}" class="nav-link" data-nav="${l.id}">${l.label}</a></li>`)}
          </ul>

          <div class="flex items-center gap-2">
            <a href="#donate" class="btn btn-primary btn-shine hidden px-5 py-2.5 sm:inline-flex">
              ${icon('hand-heart', 'size-5')}${c.actions.donate}
            </a>
            <button type="button" class="menu-btn grid size-10 sm:size-11 place-items-center rounded-full transition xl:hidden" data-drawer-open aria-label="${c.actions.menu}" aria-controls="mobile-drawer" aria-expanded="false">
              ${icon('menu', 'size-6')}
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Mobile drawer -->
    <div class="drawer-layer">
    <div class="drawer-backdrop absolute inset-0 bg-primary-950/50 backdrop-blur-sm" data-drawer-close></div>
    <aside id="mobile-drawer" class="drawer absolute inset-y-0 end-0 flex w-[min(88vw,22rem)] flex-col bg-white shadow-2xl" aria-label="${c.actions.menu}" aria-hidden="true">
      <div class="flex items-center justify-between border-b border-primary-100 p-4">
        <img src="${cfg.logo}" alt="" width="44" height="44" class="size-11 rounded-full" />
        <button type="button" class="grid size-10 place-items-center rounded-full text-ink-soft hover:bg-primary-50" data-drawer-close aria-label="${c.actions.close}">
          ${icon('x', 'size-5')}
        </button>
      </div>
      <ul class="flex-1 space-y-1 overflow-y-auto p-4">
        ${links.map(
          (l) => html`<li>
            <a href="#${l.id}" data-drawer-link class="flex items-center justify-between rounded-xl px-4 py-3 font-medium text-ink hover:bg-primary-50 hover:text-primary-700">
              ${l.label}${icon('arrow-right', 'size-4 text-primary-300 rtl:-scale-x-100')}
            </a>
          </li>`,
        )}
      </ul>
      <div class="space-y-4 border-t border-primary-100 p-4">
        ${LangSwitcher({ c, cfg, current: lang, variant: 'dark' })}
        <a href="#donate" data-drawer-link class="btn btn-primary w-full">${icon('hand-heart', 'size-5')}${c.actions.donate}</a>
      </div>
    </aside>
    </div>
  `;
}
