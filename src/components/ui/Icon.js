/**
 * Icons: Lucide icons (only the ones imported here end up in the bundle)
 * plus a few brand icons Lucide does not ship.
 * Usage: icon('heart', 'size-6')
 */
import {
  ArrowRight, ArrowUp, Award, BookOpen, Check, ClipboardCheck, Copy, Eye, FileText, GraduationCap,
  HandCoins, HandHeart, Handshake, HeartHandshake, HeartPulse, House, Landmark, Leaf, LifeBuoy, Mail,
  MapPin, Menu, Moon, Phone, Quote, Receipt, Scale, Send, ShieldCheck, Shirt, Smartphone, Sparkles,
  Sprout, Star, Target, Telescope, UserRound, Users, Utensils, Waves, X, Globe, Info, Crown,
  Briefcase, Megaphone, Wallet, ChartColumn, Lock, Building2, UserPlus,
} from 'lucide';
import { raw } from '../../utils/dom.js';

const LUCIDE = {
  'arrow-right': ArrowRight, 'arrow-up': ArrowUp, award: Award, book: BookOpen, check: Check,
  'clipboard-check': ClipboardCheck, copy: Copy, eye: Eye, 'file-text': FileText, graduation: GraduationCap,
  'hand-coins': HandCoins, 'hand-heart': HandHeart, handshake: Handshake, 'heart-handshake': HeartHandshake,
  'heart-pulse': HeartPulse, house: House, landmark: Landmark, leaf: Leaf, lifebuoy: LifeBuoy, mail: Mail,
  'map-pin': MapPin, menu: Menu, moon: Moon, phone: Phone, quote: Quote, receipt: Receipt, scale: Scale,
  send: Send, 'shield-check': ShieldCheck, shirt: Shirt, smartphone: Smartphone, sparkles: Sparkles,
  sprout: Sprout, star: Star, target: Target, telescope: Telescope, user: UserRound, users: Users,
  utensils: Utensils, waves: Waves, x: X, globe: Globe, info: Info, crown: Crown, briefcase: Briefcase,
  megaphone: Megaphone, wallet: Wallet, chart: ChartColumn, lock: Lock, building: Building2, 'user-plus': UserPlus,
};

const BRANDS = {
  facebook:
    '<path fill="currentColor" stroke="none" d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v1.7H7.5v3.2h2.8V21H14v-9.3h2.8l.4-3.2H14z"/>',
  youtube:
    '<path fill="currentColor" stroke="none" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z"/>',
  whatsapp:
    '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3z"/>',
};

const toSvgChildren = (node) =>
  node
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
      return `<${tag} ${a}/>`;
    })
    .join('');

export function icon(name, className = 'size-5', { strokeWidth = 1.8 } = {}) {
  const inner = BRANDS[name] ?? (LUCIDE[name] ? toSvgChildren(LUCIDE[name]) : toSvgChildren(LUCIDE.sparkles));
  return raw(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">${inner}</svg>`,
  );
}

/** Which icon belongs to which content id (programs, principles, funds…). Change icons here. */
export const ICON_MAP = {
  // programs
  housing: 'house', family: 'heart-handshake', medical: 'heart-pulse', ramadan: 'moon',
  education: 'graduation', winter: 'shirt', disaster: 'lifebuoy', social: 'sprout',
  // principles
  humanity: 'hand-heart', honesty: 'shield-check', transparency: 'eye', unity: 'users',
  equality: 'scale', accountability: 'clipboard-check', service: 'heart-handshake',
  // about → nature
  humanitarian: 'hand-heart', nonprofit: 'hand-coins', nonpolitical: 'scale', integrity: 'lock',
  // funds
  general: 'wallet',
  // membership
  founder: 'crown', member: 'user-plus', associate: 'handshake', wellwisher: 'star',
  // transparency
  record: 'file-text', receipt: 'receipt', project: 'chart', report: 'clipboard-check',
  approval: 'users', dignity: 'shield-check',
  // committee
  president: 'crown', vicePresident: 'award', generalSecretary: 'briefcase', jointSecretary: 'briefcase',
  treasurer: 'wallet', organizingSecretary: 'users', publicitySecretary: 'megaphone', executiveMembers: 'user',
  // donation methods
  bkash: 'smartphone', nagad: 'smartphone', rocket: 'smartphone', bank: 'landmark',
};

export const iconFor = (id, className, opts) => icon(ICON_MAP[id] ?? 'sparkles', className, opts);
