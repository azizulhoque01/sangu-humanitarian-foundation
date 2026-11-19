import { html } from '../../utils/dom.js';

/**
 * Reusable section heading: eyebrow pill + title + optional subtitle.
 * align: 'center' | 'start'; dark: for dark backgrounds
 */
export function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false }) {
  const alignCls = align === 'center' ? 'mx-auto text-center' : 'text-start';
  return html`
    <div class="${alignCls} max-w-3xl" data-animate="fade-up">
      ${eyebrow
        ? html`<span class="eyebrow ${dark ? 'eyebrow-dark' : ''}">
            <span class="size-1.5 rounded-full bg-secondary-500"></span>${eyebrow}
          </span>`
        : ''}
      <h2 class="section-title ${dark ? 'text-white!' : ''}">${title}</h2>
      ${subtitle ? html`<p class="section-subtitle ${dark ? 'text-primary-100!' : ''}">${subtitle}</p>` : ''}
    </div>
  `;
}
