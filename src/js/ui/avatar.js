// Turn a "who" string from content into a character sticker.
import { charSVG, dropSVG, letterSVG, bossSVG, CAST } from '../core/chars.js';

const FONT = { serif: "var(--f-serif)", sans: "var(--f-sans)", script: "var(--f-script)", display: "var(--f-display)", mono: "var(--f-mono)" };
const LETTER_COL = { serif: '#FFFFFF', sans: '#BFE3FF', script: '#FFD3E6', display: '#FFD23F', mono: '#CDF7E6' };
/** who: 'mokho' | cast key | 'boss' | 'drop:#hex' | 'letter:serif:A' */
export function avatar(who = 'mokho', expr = 'happy', cls = '') {
  if (who === 'boss') return bossSVG({ expr: expr === 'happy' ? 'angry' : expr, cls });
  if (who.startsWith('drop:')) return dropSVG(who.slice(5), { expr, cls });
  if (who.startsWith('letter:')) {
    const [, fam, ch] = who.split(':');
    const sizes = { serif: [150, 160], sans: [140, 158], script: [150, 162], display: [190, 172], mono: [150, 160] }[fam] || [150, 160];
    return letterSVG(FONT[fam] || FONT.sans, ch || 'A', { expr, cls, color: LETTER_COL[fam], fs: sizes[0], y: sizes[1], fy: 118, fsz: .62, gap: 16 });
  }
  if (!CAST[who]) who = 'mokho';
  return charSVG(who, { expr, cls });
}
export const castName = who => (CAST[who]?.name) || (who === 'boss' ? 'الوحش' : who.startsWith('drop:') ? 'نقطة لون' : who.startsWith('letter:') ? 'حرف' : 'مُخّو');

const CHAR_OF = { mind: 'mokho', shape: 'circle', space: 'nokta', color: 'drop:#9A5BFF', type: 'letter:display:A', express: 'square', gestalt: 'nokta', boss: 'boss', old: 'polygon' };
export const zoneChar = id => CHAR_OF[id] || 'mokho';
