import { html, delay } from '../utils/dom.js';
import { icon } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';

export function Contact({ c, cfg }) {
  const ct = c.contact;
  const { contact } = cfg;
  const items = [
    { icon: 'phone', label: ct.phone, value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}`, ltr: true },
    { icon: 'whatsapp', label: ct.whatsapp, value: `+${contact.whatsapp}`, href: `https://wa.me/${contact.whatsapp}`, ltr: true },
    { icon: 'mail', label: ct.email, value: contact.email, href: `mailto:${contact.email}`, ltr: true },
    { icon: 'map-pin', label: ct.address, value: ct.addressValue, href: contact.mapUrl, cta: ct.map },
  ];
  return html`
    <section id="contact" class="section">
      <div class="container-x">
        ${SectionHeading({ eyebrow: ct.eyebrow, title: ct.title, subtitle: ct.subtitle })}
        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          ${items.map(
            (it, i) => html`
              <a href="${it.href}" ${it.href.startsWith('http') ? html`target="_blank" rel="noopener"` : ''}
                class="card card-hover group block text-center" data-animate="fade-up" style="${delay(i)}">
                <span class="icon-tile mx-auto">${icon(it.icon, 'size-7')}</span>
                <p class="mt-5 text-sm font-semibold uppercase tracking-wide text-secondary-600">${it.label}</p>
                <p class="mt-1 font-bold break-words text-primary-900" ${it.ltr ? html`dir="ltr"` : ''}>${it.value}</p>
                ${it.cta
                  ? html`<span class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">${it.cta}${icon('arrow-right', 'size-4 transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1')}</span>`
                  : ''}
              </a>
            `,
          )}
        </div>
      </div>
    </section>
  `;
}
