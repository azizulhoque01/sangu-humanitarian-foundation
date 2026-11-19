import { raw } from '../../utils/dom.js';

/**
 * The "Sangu river" wave divider. Two layered waves drift slowly.
 * fill: any CSS colour (use the colour of the section that comes next).
 */
export function Wave({ fill = '#ffffff', className = '' } = {}) {
  const path =
    'M0 40 C 120 10, 240 10, 360 40 S 600 70, 720 40 S 960 10, 1080 40 S 1320 70, 1440 40 V 80 H 0 Z';
  const strip = (opacity, extra) => `
    <svg class="absolute bottom-0 start-0 h-full w-[200%] ${extra}" viewBox="0 0 2880 80" preserveAspectRatio="none" aria-hidden="true">
      <path d="${path}" fill="${fill}" fill-opacity="${opacity}"/>
      <path d="${path}" transform="translate(1440 0)" fill="${fill}" fill-opacity="${opacity}"/>
    </svg>`;
  return raw(`
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden sm:h-20 ${className}" dir="ltr">
      ${strip(0.45, 'animate-wave [animation-duration:22s] translate-y-1')}
      ${strip(1, 'animate-wave')}
    </div>`);
}
