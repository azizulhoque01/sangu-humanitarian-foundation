/**
 * Scroll animations:
 *  - [data-animate]  → gets .is-visible when it enters the viewport (see main.css)
 *  - [data-count]    → counts up from 0 to its value when visible
 */
import { formatNumber } from '../i18n/index.js';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let revealObserver;
let countObserver;

export function initReveal(root = document) {
  const items = root.querySelectorAll('[data-animate]:not(.is-visible)');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  items.forEach((el) => revealObserver.observe(el));
}

function runCounter(el) {
  const target = Number(el.dataset.count);
  const plain = el.dataset.plain === 'true';
  const suffix = el.dataset.suffix ?? '';
  if (prefersReducedMotion()) {
    el.textContent = formatNumber(target, { plain }) + suffix;
    return;
  }
  // Years count up from a nearby value instead of 0, so they don't flash odd numbers
  const start = plain ? Math.max(0, target - 40) : 0;
  const duration = 1600;
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatNumber(Math.round(start + (target - start) * eased), { plain }) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initCounters(root = document) {
  const items = root.querySelectorAll('[data-count]');
  countObserver?.disconnect();
  countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );
  items.forEach((el) => countObserver.observe(el));
}
