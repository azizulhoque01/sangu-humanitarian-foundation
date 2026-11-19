import { html, delay } from '../utils/dom.js';
import { icon, iconFor } from './ui/Icon.js';
import { SectionHeading } from './ui/SectionHeading.js';

function Field({ id, label, type = 'text', required = false, autocomplete = '', inputmode = '' }) {
  return html`
    <div>
      <label for="f-${id}" class="mb-1.5 block text-sm font-semibold text-primary-900">
        ${label}${required ? html`<span class="text-red-500"> *</span>` : ''}
      </label>
      <input id="f-${id}" name="${id}" type="${type}" class="form-field"
        ${required ? 'required' : ''} autocomplete="${autocomplete}" ${inputmode ? html`inputmode="${inputmode}"` : ''} />
      <p class="mt-1 hidden text-xs font-medium text-red-600" data-error-for="${id}"></p>
    </div>
  `;
}

function InterestForm({ c }) {
  const f = c.involved.form;
  return html`
    <form id="interest-form" class="card p-6! shadow-lift sm:p-8!" novalidate data-animate="slide-end">
      <h3 class="text-2xl font-bold text-primary-900">${f.title}</h3>
      <p class="mt-1 text-ink-soft">${f.subtitle}</p>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">${Field({ id: 'name', label: f.name, required: true, autocomplete: 'name' })}</div>
        ${Field({ id: 'phone', label: f.phone, type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' })}
        ${Field({ id: 'email', label: f.email, type: 'email', autocomplete: 'email' })}
      </div>

      <fieldset class="mt-5">
        <legend class="mb-2 text-sm font-semibold text-primary-900">${f.interest}</legend>
        <div class="flex flex-wrap gap-2">
          ${f.interests.map(
            (label, i) => html`
              <label class="cursor-pointer">
                <input type="checkbox" name="interest" value="${i}" class="peer sr-only" />
                <span class="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-4 py-2 text-sm font-medium text-ink-soft ring-1 ring-primary-100 transition peer-checked:bg-secondary-500 peer-checked:text-white peer-checked:ring-secondary-500 peer-focus-visible:ring-4 peer-focus-visible:ring-secondary-200 hover:ring-secondary-300">
                  ${label}
                </span>
              </label>
            `,
          )}
        </div>
      </fieldset>

      <div class="mt-5">
        <label for="f-message" class="mb-1.5 block text-sm font-semibold text-primary-900">${f.message}</label>
        <textarea id="f-message" name="message" rows="3" class="form-field resize-y"></textarea>
      </div>

      <button type="submit" class="btn btn-primary btn-shine mt-6 w-full py-3.5" data-sending="${f.sending}">
        ${icon('send', 'size-5 rtl:-scale-x-100')}<span data-submit-label>${f.submit}</span>
      </button>
      <p class="form-status mt-4 hidden rounded-xl p-3 text-sm font-medium" role="status" aria-live="polite"
        data-success="${f.success}" data-error="${f.error}"></p>
    </form>
  `;
}

export function GetInvolved({ c }) {
  const v = c.involved;
  return html`
    <section id="involved" class="section">
      <div class="container-x grid items-start gap-14 lg:grid-cols-2">
        <div>
          ${SectionHeading({ eyebrow: v.eyebrow, title: v.title, subtitle: v.subtitle, align: 'start' })}
          <h3 class="mt-10 text-lg font-bold text-primary-900" data-animate="fade-up">${v.typesTitle}</h3>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            ${v.types.map(
              (t, i) => html`
                <div class="card card-hover group p-5!" data-animate="fade-up" style="${delay(i % 2)}">
                  <span class="icon-tile size-12">${iconFor(t.id, 'size-6')}</span>
                  <p class="mt-4 font-bold text-primary-900">${t.title}</p>
                  <p class="mt-1 text-sm text-ink-soft">${t.text}</p>
                </div>
              `,
            )}
          </div>
        </div>
        ${InterestForm({ c })}
      </div>
    </section>
  `;
}
