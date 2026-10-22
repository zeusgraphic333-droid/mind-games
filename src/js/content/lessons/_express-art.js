// Black Square art: compositions drawn as real assignment pages (paper, 1 pt frame, black squares and lines).
import { SQ } from '../../data/squares.js';

const INK = '#0B0B10', PAPER = '#ECEAE4';
const PAL = { k: INK, r: '#E0312B', b: '#3D5BFF', p: '#FF3E8A' };
let uid = 0;

function item(it, ink = INK) {
  const col = it.c === 'k' || !it.c ? ink : PAL[it.c];
  if (it.t === 'l') return `<line x1="${it.x1.toFixed(1)}" y1="${it.y1.toFixed(1)}" x2="${it.x2.toFixed(1)}" y2="${it.y2.toFixed(1)}" stroke="${col}" stroke-width="${it.w}" stroke-opacity="${it.o ?? 1}" stroke-linecap="square"/>`;
  const cx = it.x + it.s / 2, cy = it.y + it.s / 2;
  const tr = it.r ? ` transform="rotate(${(+it.r).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"` : '';
  const paint = it.st ? `fill="none" stroke="${col}" stroke-width="1.6"` : `fill="${col}"`;
  return `<rect x="${it.x.toFixed(1)}" y="${it.y.toFixed(1)}" width="${it.s.toFixed(1)}" height="${it.s.toFixed(1)}" ${paint} opacity="${it.o ?? 1}"${tr}/>`;
}
/** any list of items (same format as SQ) on a 150 × 150 page */
export function pageSVG(items, { label = 'A composition of squares and lines', cls = '' } = {}) {
  const id = 'xsq' + (++uid);
  return `<svg class="exp-page ${cls}" viewBox="-5 -5 160 160" role="img" aria-label="${label}"><defs><clipPath id="${id}"><rect width="150" height="150"/></clipPath></defs><rect x="-5" y="-5" width="160" height="160" fill="${PAPER}" rx="2"/><g clip-path="url(#${id})">${items.map(i => item(i)).join('')}</g><rect width="150" height="150" fill="none" stroke="${INK}" stroke-width="1"/></svg>`;
}
/** one of the 21 words, trial 0 or 1 */
export function sqPage(word, trial = 0, opts = {}) {
  const w = SQ[word]; if (!w) return '';
  return pageSVG(w.trials[trial].items, { label: opts.label || `A Black Square composition (${w.trials[trial].note})`, cls: opts.cls || '' });
}
export const WORDS = Object.keys(SQ);
export const LECTURE_WORDS = WORDS.filter(w => SQ[w].lec === 1);
export const SECTION_WORDS = WORDS.filter(w => SQ[w].lec === 2);
export { SQ };
