import './styles/main.css';

import { getContent, getSiteConfig, submitVolunteer } from './services/content.js';
import { detectInitialLang, getLang, isSupported, setLang } from './i18n/index.js';
import { html, $, $$, copyToClipboard } from './utils/dom.js';
import { initReveal, initCounters } from './utils/animate.js';

import { Header } from './components/Header.js';
import { Hero, Stats } from './components/Hero.js';
import { About } from './components/About.js';
import { VisionMission } from './components/VisionMission.js';
import { Programs } from './components/Programs.js';
import { Objectives } from './components/Objectives.js';
import { Principles } from './components/Principles.js';
import { Donate } from './components/Donate.js';
import { GetInvolved } from './components/GetInvolved.js';
import { Transparency } from './components/Transparency.js';
import { Committee } from './components/Committee.js';
import { Pledge } from './components/Pledge.js';
import { Contact } from './components/Contact.js';
import { Footer } from './components/Footer.js';

/**
 * Section registry: id (used in site.config.js → sections) → component.
 * To add a section: create a component, register it here, add its id to the config.
 */
const SECTIONS = {
  hero: (p) => html`${Hero(p)}${Stats(p)}`,
  about: About,
  visionMission: VisionMission,
  programs: Programs,
  objectives: Objectives,
  principles: Principles,
  donate: Donate,
  involved: GetInvolved,
  transparency: Transparency,
  committee: Committee,
  pledge: Pledge,
  contact: Contact,
};

const app = document.getElementById('app');

async function render(lang) {
  const [c, cfg] = await Promise.all([getContent(lang), getSiteConfig()]);
  setLang(lang, c);
  updateMeta(c);

  const props = { c, cfg, lang };
  app.innerHTML = String(html`
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
    ${Header(props)}
    <main id="main">${cfg.sections.map((id) => SECTIONS[id]?.(props) ?? '')}</main>
    ${Footer(props)}
  `);

  initReveal(app);
  initCounters(app);
  initScrollSpy(cfg.nav);
  onScroll();
}

function updateMeta(c) {
  document.title = c.meta.title;
  const set = (sel, val) => $(sel)?.setAttribute('content', val);
  set('meta[name="description"]', c.meta.description);
  set('meta[property="og:title"]', c.meta.title);
  set('meta[property="og:description"]', c.meta.description);
}

/* ---------------- Language switching ---------------- */
async function switchLang(lang) {
  if (!isSupported(lang) || lang === getLang()) return;
  const y = window.scrollY;
  setDrawer(false);
  app.classList.add('is-switching');
  await new Promise((r) => setTimeout(r, 220));
  await render(lang);
  window.scrollTo({ top: y, behavior: 'instant' });
  requestAnimationFrame(() => app.classList.remove('is-switching'));
}

/* ---------------- Mobile drawer ---------------- */
function setDrawer(open) {
  const drawer = $('#mobile-drawer');
  if (!drawer) return;
  drawer.classList.toggle('is-open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  $('.drawer-backdrop')?.classList.toggle('is-open', open);
  $('[data-drawer-open]')?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

/* ---------------- Scroll: header state, back-to-top ---------------- */
function onScroll() {
  const y = window.scrollY;
  $('.site-header')?.classList.toggle('is-scrolled', y > 40);
  $('.to-top')?.classList.toggle('is-visible', y > 700);
}

/* ---------------- Scrollspy: highlight the nav link of the visible section ---------------- */
let spy;
function initScrollSpy(navIds) {
  spy?.disconnect();
  spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$('[data-nav]').forEach((a) => a.classList.toggle('is-active', a.dataset.nav === entry.target.id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  navIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}

/* ---------------- Interest form ---------------- */
// Accept Bangla (০-৯) and Arabic (٠-٩) digits too
const toLatinDigits = (s) =>
  s.replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

async function handleForm(form) {
  const c = await getContent(getLang());
  const f = c.involved.form;
  const fd = new FormData(form);
  const data = {
    name: (fd.get('name') ?? '').trim(),
    phone: toLatinDigits(fd.get('phone') ?? '').replace(/[\s\-()]/g, ''),
    email: (fd.get('email') ?? '').trim(),
    interest: fd.getAll('interest').map((i) => f.interests[i]),
    message: (fd.get('message') ?? '').trim(),
  };

  const errors = {};
  if (!data.name) errors.name = f.errors.required;
  if (!data.phone) errors.phone = f.errors.required;
  else if (!/^\+?\d{8,15}$/.test(data.phone)) errors.phone = f.errors.phone;
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = f.errors.email;

  ['name', 'phone', 'email'].forEach((key) => {
    const msg = form.querySelector(`[data-error-for="${key}"]`);
    form.elements[key].setAttribute('aria-invalid', String(!!errors[key]));
    msg.textContent = errors[key] ?? '';
    msg.classList.toggle('hidden', !errors[key]);
  });
  const firstError = Object.keys(errors)[0];
  if (firstError) {
    form.elements[firstError].focus();
    return;
  }

  const btn = form.querySelector('[type="submit"]');
  const label = btn.querySelector('[data-submit-label]');
  const status = form.querySelector('.form-status');
  const original = label.textContent;
  btn.disabled = true;
  label.textContent = btn.dataset.sending;

  const base = 'form-status mt-4 rounded-xl p-3 text-sm font-medium ring-1';
  try {
    const res = await submitVolunteer({ ...data, lang: getLang() });
    if (!res.ok) throw new Error('Request failed');
    form.reset();
    status.textContent = status.dataset.success;
    status.className = `${base} bg-secondary-50 text-secondary-800 ring-secondary-200`;
  } catch {
    status.textContent = status.dataset.error;
    status.className = `${base} bg-red-50 text-red-700 ring-red-200`;
  } finally {
    btn.disabled = false;
    label.textContent = original;
  }
}

/* ---------------- Global event delegation (bound once, survives re-renders) ---------------- */
async function handleCopy(btn) {
  const ok = await copyToClipboard(btn.dataset.copy);
  if (!ok) return;
  const label = btn.querySelector('[data-copy-label]');
  const original = label.textContent;
  label.textContent = btn.dataset.labelCopied;
  btn.classList.add('bg-secondary-100', 'text-secondary-700');
  setTimeout(() => {
    label.textContent = original;
    btn.classList.remove('bg-secondary-100', 'text-secondary-700');
  }, 1800);
}

function bindEvents() {
  document.addEventListener('click', (e) => {
    const t = e.target;
    const langBtn = t.closest('[data-lang]');
    if (langBtn) return void switchLang(langBtn.dataset.lang);
    if (t.closest('[data-drawer-open]')) return setDrawer(true);
    if (t.closest('[data-drawer-close], [data-drawer-link]')) setDrawer(false);
    const copyBtn = t.closest('[data-copy]');
    if (copyBtn) return void handleCopy(copyBtn);
    if (t.closest('[data-scroll-top]')) window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('submit', (e) => {
    if (e.target.id !== 'interest-form') return;
    e.preventDefault();
    handleForm(e.target);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setDrawer(false);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.matchMedia('(min-width: 1280px)').addEventListener('change', () => setDrawer(false));
}

/* ---------------- Boot ---------------- */
function hideLoader() {
  const loader = $('#page-loader');
  if (!loader) return;
  loader.classList.add('is-hidden');
  loader.addEventListener('transitionend', () => loader.replaceWith(), { once: true });
}

bindEvents();
render(detectInitialLang())
  .catch((err) => {
    console.error(err);
    app.innerHTML = '<p style="padding:2rem;text-align:center">Failed to load content.</p>';
  })
  .finally(hideLoader);
