import { html, delay } from '../utils/dom.js';
import { icon, iconFor } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';

function CopyButton(value, c) {
  return html`
    <button type="button" data-copy="${value}" data-label-copied="${c.actions.copied}"
      class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 ring-1 ring-primary-100 transition hover:bg-primary-100">
      ${icon('copy', 'size-3.5')}<span data-copy-label>${c.actions.copy}</span>
    </button>
  `;
}

function MobileMethod(m, c, i) {
  return html`
    <div class="card card-hover p-5!" data-animate="fade-up" style="${delay(i)}">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-3">
          <span class="grid size-11 shrink-0 place-items-center rounded-xl text-white shadow-md" style="background:${m.color}">${iconFor(m.id, 'size-5')}</span>
          <div>
            <p class="font-bold text-primary-900">${c.donate.methods[m.id]}</p>
            <p class="text-xs text-ink-soft">${c.donate.accountTypes[m.accountType] ?? ''}</p>
          </div>
        </div>
        ${CopyButton(m.number, c)}
      </div>
      <p class="mt-4 rounded-xl bg-surface-muted px-3 py-2.5 text-center font-mono text-lg font-semibold tracking-wider text-ink" dir="ltr">${m.number}</p>
    </div>
  `;
}

function BankMethod(m, c, i) {
  const L = c.donate.bankLabels;
  const rows = [
    [L.accountName, m.accountName],
    [L.bank, m.bankName],
    [L.branch, m.branch],
  ];
  return html`
    <div class="card card-hover p-5! sm:col-span-2 lg:col-span-3" data-animate="fade-up" style="${delay(i)}">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="grid size-11 place-items-center rounded-xl text-white shadow-md" style="background:${m.color}">${iconFor(m.id, 'size-5')}</span>
          <p class="font-bold text-primary-900">${c.donate.methods[m.id]}</p>
        </div>
        <div class="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2">
          <span class="text-xs text-ink-soft">${L.accountNumber}</span>
          <span class="font-mono font-semibold text-ink" dir="ltr">${m.number}</span>
          ${CopyButton(m.number, c)}
        </div>
      </div>
      <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        ${rows.map(([k, v]) => html`<div><dt class="text-ink-soft">${k}</dt><dd class="font-semibold text-ink">${v}</dd></div>`)}
      </dl>
    </div>
  `;
}

export function Donate({ c, cfg }) {
  const d = c.donate;
  return html`
    <section id="donate" class="section bg-surface-muted overflow-hidden">
      <div class="bg-dots pointer-events-none absolute inset-0 opacity-50"></div>
      <div class="container-x relative">
        ${SectionHeading({ eyebrow: d.eyebrow, title: d.title })}

        <div class="mt-14 grid gap-8 lg:grid-cols-12">
          <!-- Policy -->
          <div class="lg:col-span-5" data-animate="slide-start">
            <div class="relative h-full overflow-hidden rounded-[2rem] bg-linear-to-br from-secondary-600 via-secondary-700 to-primary-800 p-8 text-white shadow-lift sm:p-10">
              <div class="absolute -bottom-20 -end-20 size-64 rounded-full bg-white/10"></div>
              ${icon('quote', 'size-10 text-secondary-200 rtl:-scale-x-100')}
              <p class="relative mt-4 text-2xl font-bold leading-snug sm:text-3xl">${d.quote}</p>
              <p class="relative mt-3 text-sm font-medium text-secondary-100">${d.quoteSource}</p>
              <ul class="relative mt-8 space-y-3">
                ${d.policy.map(
                  (p) => html`<li class="flex gap-3">
                    <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/20">${icon('check', 'size-3.5', { strokeWidth: 3 })}</span>
                    <span class="text-white/90">${p}</span>
                  </li>`,
                )}
              </ul>
              <div class="relative mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20">
                <p class="flex items-center gap-2 font-bold">${icon('handshake', 'size-5 text-secondary-200')}${d.nonMonetaryTitle}</p>
                <p class="mt-2 text-sm text-white/85">${d.nonMonetary}</p>
              </div>
            </div>
          </div>

          <!-- Methods + funds -->
          <div class="lg:col-span-7">
            <h3 class="text-xl font-bold text-primary-900" data-animate="fade-up">${d.methodsTitle}</h3>
            <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              ${cfg.donationMethods.map((m, i) => (m.kind === 'bank' ? BankMethod(m, c, i) : MobileMethod(m, c, i)))}
            </div>

            <h3 class="mt-10 text-xl font-bold text-primary-900" data-animate="fade-up">${d.fundsTitle}</h3>
            <ul class="mt-5 grid gap-3 sm:grid-cols-2">
              ${d.funds.map(
                (f, i) => html`<li class="group flex items-center gap-3 rounded-2xl bg-white p-3 pe-4 shadow-soft ring-1 ring-primary-100/70 transition hover:ring-secondary-300"
                  data-animate="fade-up" style="${delay(i % 2)}">
                  <span class="icon-tile size-10 rounded-xl">${iconFor(f.id, 'size-5')}</span>
                  <span class="font-medium text-ink">${f.title}</span>
                </li>`,
              )}
            </ul>

            <p class="mt-8 flex gap-3 text-sm text-ink-soft" data-animate="fade-up">
              ${icon('shield-check', 'size-5 shrink-0 text-secondary-500')}${d.receiptNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}
