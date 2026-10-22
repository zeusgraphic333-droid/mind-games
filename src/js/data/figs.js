// Original SVG figures used by quiz questions and lessons (ported from v1, colours via CSS variables).
import { SQ } from './squares.js';
import { esc, seeded } from '../core/util.js';
export const PROFILE = [ // left face, x = fraction of width from the left edge to the face's front, y = fraction of height
  [.33, -.03], [.33, 0], [.352, .085], [.394, .168], [.372, .214], [.398, .262], [.471, .331], [.455, .352], [.419, .368],
  [.421, .392], [.447, .418], [.428, .440], [.441, .463], [.405, .5], [.418, .532], [.433, .566], [.398, .612], [.332, .662],
  [.291, .73], [.287, .8], [.313, .866], [.381, .932], [.421, .982], [.426, 1.03]
];
export const CAT_PATH = 'M74 182C52 184 26 184 17 172C11 163 17 152 27 155C33 157 31 165 38 168C46 171 54 167 55 158C45 140 44 116 62 98C74 86 89 80 97 68C95 56 97 44 101 34L104 9L120 25L137 8L142 32C152 38 158 48 159 57C160 63 155 68 149 72C145 76 139 80 132 82C137 100 143 126 141 150C140 162 147 169 155 171C163 173 163 182 154 182Z';
const SQC = { k: 'var(--ink)', p: 'var(--pink)', b: 'var(--blue)', r: 'var(--bad)' };
let _clipN = 0;
function sqItemSVG(it) {
  if (it.t === 'l') return `<line x1="${it.x1.toFixed(1)}" y1="${it.y1.toFixed(1)}" x2="${it.x2.toFixed(1)}" y2="${it.y2.toFixed(1)}" stroke="${SQC[it.c] || SQC.k}" stroke-width="${it.w}" stroke-opacity="${it.o ?? 1}" stroke-linecap="square"/>`;
  const cx = it.x + it.s / 2, cy = it.y + it.s / 2;
  const tr = it.r ? ` transform="rotate(${it.r.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"` : '';
  const paint = it.st ? `fill="none" stroke="${SQC[it.c] || SQC.k}" stroke-width="1.6"` : `fill="${SQC[it.c] || SQC.k}"`;
  return `<rect x="${it.x.toFixed(1)}" y="${it.y.toFixed(1)}" width="${it.s.toFixed(1)}" height="${it.s.toFixed(1)}" ${paint} opacity="${it.o ?? 1}"${tr}/>`;
}
export function sqSVG(items, opts = {}) {
  const id = 'sqc' + (++_clipN);
  const pad = opts.pad ?? 6;
  return `<svg viewBox="${-pad} ${-pad} ${150 + pad * 2} ${150 + pad * 2}" class="sq-svg" role="img" aria-label="${esc(opts.label || 'A composition of squares and lines')}">
<defs><clipPath id="${id}"><rect x="0" y="0" width="150" height="150"/></clipPath></defs>
<rect x="0" y="0" width="150" height="150" fill="var(--paper)"/>
<g clip-path="url(#${id})">${items.map(sqItemSVG).join('')}</g>
<rect x="0" y="0" width="150" height="150" fill="none" stroke="var(--ink)" stroke-width="1"/></svg>`;
}

export const FIG = {};
const box = (inner, vb = '0 0 320 200', label = '') => `<svg viewBox="${vb}" role="img" aria-label="${esc(label)}" class="fig-svg">${inner}</svg>`;
const dotsGrid = (cols, rows, fx, fy, r, paint) => { let o = ''; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) o += `<circle cx="${fx(i, j)}" cy="${fy(i, j)}" r="${r}" ${paint(i, j)}/>`; return o; };

/* shapes & lines */
FIG['s-circle'] = () => box(`<circle cx="160" cy="100" r="70" fill="var(--blue)"/>`, '0 0 320 200', 'A circle');
FIG['s-triangle'] = () => box(`<path d="M160 28 238 168H82Z" fill="var(--blue)"/>`, '0 0 320 200', 'A triangle pointing up');
FIG['s-tri-down'] = () => box(`<path d="M82 32H238L160 172Z" fill="var(--blue)"/>`, '0 0 320 200', 'A triangle pointing down');
FIG['s-vlines'] = () => box([60, 100, 140, 180, 220, 260].map((x, i) => `<line x1="${x}" y1="${26 + (i % 2) * 8}" x2="${x}" y2="${174 - (i % 3) * 6}" stroke="var(--ink)" stroke-width="7"/>`).join(''), '0 0 320 200', 'Strong vertical lines');
FIG['s-hlines'] = () => box([60, 88, 116, 144].map((y, i) => `<line x1="${40 + i * 6}" y1="${y}" x2="${280 - i * 6}" y2="${y}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" opacity="${1 - i * .15}"/>`).join(''), '0 0 320 200', 'Calm horizontal lines');

/* space */
FIG['p-active'] = () => box(`<rect x="0" y="0" width="320" height="200" fill="var(--paper)"/>
<rect x="196" y="40" width="92" height="120" fill="var(--blue)"/>
<rect x="34" y="128" width="96" height="9" fill="var(--ink)"/><rect x="34" y="144" width="70" height="6" fill="var(--ink-3)"/><rect x="34" y="155" width="80" height="6" fill="var(--ink-3)"/>
<path d="M34 40h130v74H34z" fill="none" stroke="var(--pink)" stroke-width="1.5" stroke-dasharray="5 5"/>
<text x="99" y="82" text-anchor="middle" font-family="var(--f-text)" font-size="12" fill="var(--pink-deep)">empty on purpose</text>`, '0 0 320 200', 'A layout with a large empty area placed on one side on purpose');

/* type specimens (category questions) */
const spec = (fam, txt, size, extra = '') => box(`<text x="160" y="118" text-anchor="middle" font-family="${fam}" font-size="${size}" fill="var(--ink)" ${extra}>${txt}</text>`, '0 0 320 200', 'A type sample');
FIG['t-serif'] = () => spec("'EB Garamond', Garamond, 'Times New Roman', serif", 'Heritage', 64);
FIG['t-script'] = () => spec("Lobster, 'Brush Script MT', cursive", 'Celebrate', 62);
FIG['t-mono'] = () => box(`<text x="160" y="98" text-anchor="middle" font-family="'Courier Prime', Courier, monospace" font-size="40" fill="var(--ink)">iiiWWW</text><text x="160" y="146" text-anchor="middle" font-family="'Courier Prime', Courier, monospace" font-size="40" fill="var(--ink)">llmmOO</text>`, '0 0 320 200', 'A type sample where every letter has the same width');
FIG['t-display'] = () => spec("'Bebas Neue', Impact, sans-serif", 'BIG SALE', 92, 'letter-spacing="1"');
FIG['t-sans'] = () => spec("Arimo, Helvetica, Arial, sans-serif", 'Interface', 60);

/* Black Square Challenge */
['Order', 'Increase', 'Congested', 'Tension', 'Bold', 'Playful'].forEach(w => {
  FIG['e-' + w.toLowerCase()] = () => `<div class="fig-sq">${sqSVG(SQ[w].trials[0].items, { label: 'A composition of black squares' })}</div>`;
});

/* Gestalt laws */
FIG['g-proximity'] = () => box(dotsGrid(6, 5, (i) => 62 + Math.floor(i / 2) * 96 + (i % 2) * 28, (i, j) => 40 + j * 30, 8, () => 'fill="var(--ink)"'), '0 0 360 200', 'Identical dots spaced in three pairs of columns');
FIG['g-similarity'] = () => box(dotsGrid(7, 5, (i) => 72 + i * 36, (i, j) => 32 + j * 34, 10, (i, j) => j % 2 ? 'fill="none" stroke="var(--ink)" stroke-width="2.4"' : 'fill="var(--ink)"'), '0 0 360 200', 'Equally spaced dots; filled and hollow rows alternate');
FIG['g-continuity'] = () => {
  let o = '';
  for (let k = 0; k <= 16; k++) { const x = 28 + k * 19; o += `<circle cx="${x}" cy="100" r="6" fill="var(--ink)"/>`; }
  for (let k = 0; k <= 16; k++) { const t = k / 16; const x = 28 + t * 304; const y = 100 - Math.sin(t * Math.PI * 2) * 70; o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="var(--ink)"/>`; }
  return box(o, '0 0 360 200', 'A straight line of dots crossed twice by a wavy line of dots');
};
FIG['g-closure'] = () => box(`<g fill="none" stroke="var(--ink)" stroke-width="8" stroke-linecap="butt">
<path d="M110 40 A60 60 0 0 1 166 92"/><path d="M162 122 A60 60 0 0 1 96 158"/><path d="M62 140 A60 60 0 0 1 58 70"/>
<path d="M228 40h-14M228 40v14M318 40h-24M318 40v24M318 160v-22M318 160h-28M228 160v-30M228 160h20"/></g>`, '0 0 360 200', 'A circle and a square drawn with gaps in their outlines');
FIG['g-simplicity'] = () => box(`<g fill="var(--ink)"><rect x="70" y="62" width="100" height="78"/><path d="M168 48 236 152H128Z"/><circle cx="118" cy="140" r="44"/></g>`, '0 0 300 200', 'A square, a triangle and a circle overlapping in one color');
FIG['g-fate'] = () => {
  let o = '';
  const pts = [[60, 60], [60, 110], [60, 160], [120, 60], [120, 110], [120, 160], [180, 60], [180, 110], [180, 160], [240, 60], [240, 110], [240, 160], [300, 60], [300, 110], [300, 160]];
  const moving = new Set([1, 4, 7, 10, 13]);
  pts.forEach(([x, y], i) => {
    o += `<circle cx="${x}" cy="${y}" r="9" fill="var(--ink)"/>`;
    if (moving.has(i)) o += `<path d="M${x + 14} ${y - 4} l16 -14 m0 0 h-10 m10 0 v10" fill="none" stroke="var(--pink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  return box(o, '0 0 360 200', 'A grid of dots; the dots in the middle row have arrows showing they move up together');
};
FIG['g-connect'] = () => box(`<g stroke="var(--ink)" stroke-width="3"><line x1="70" y1="70" x2="130" y2="70"/><line x1="190" y1="130" x2="250" y2="130"/><line x1="70" y1="130" x2="130" y2="130"/><line x1="190" y1="70" x2="250" y2="70"/></g>
<g fill="var(--ink)"><circle cx="70" cy="70" r="15"/><rect x="117" y="57" width="26" height="26"/><rect x="57" y="117" width="26" height="26"/><circle cx="130" cy="130" r="15"/><circle cx="190" cy="70" r="15"/><rect x="237" y="57" width="26" height="26"/><rect x="177" y="117" width="26" height="26"/><circle cx="250" cy="130" r="15"/></g>`, '0 0 320 200', 'Circles and squares joined in pairs by short lines');
FIG['g-symmetry'] = () => box(`<g fill="var(--ink)" font-family="var(--f-text)" font-size="92" font-weight="300"><text x="40" y="132">[</text><text x="98" y="132">]</text><text x="160" y="132">{</text><text x="218" y="132">}</text><text x="276" y="132">[</text><text x="330" y="132">]</text></g>`, '0 0 380 200', 'Three mirrored pairs of brackets');
FIG['g-figure'] = () => {
  // a cat left unpainted in a dark, textured field
  let tex = ''; const r = seeded(9);
  for (let i = 0; i < 60; i++) tex += `<rect x="${(r() * 330 - 10).toFixed(0)}" y="${(r() * 210 - 10).toFixed(0)}" width="${(6 + r() * 16).toFixed(0)}" height="${(6 + r() * 16).toFixed(0)}" transform="rotate(${(r() * 90).toFixed(0)} 160 100)" fill="var(--blue)" opacity="${(.35 + r() * .5).toFixed(2)}"/>`;
  return box(`<rect width="320" height="200" fill="var(--ink)"/>${tex}<g transform="translate(108 6) scale(.95)"><path d="${CAT_PATH}" fill="var(--paper)"/></g>`, '0 0 320 200', 'A dark textured field with an unpainted cat shape left in it');
};
FIG['g-vase'] = () => {
  const W = 300, H = 300; const pt = PROFILE.map(([x, y]) => [x * W, y * H]);
  const d = (mir) => { let s = ''; const P = pt.map(([x, y]) => [mir ? W - x : x, y]); s += `M${P[0][0]} ${P[0][1]}`; for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]; s += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; } return s; };
  return box(`<rect width="300" height="300" fill="var(--paper)"/><path d="M-2 -10 ${d(false).slice(1).replace(/^/, 'L')} L-2 310Z" fill="var(--blue)"/><path d="M302 -10 ${d(true).slice(1).replace(/^/, 'L')} L302 310Z" fill="var(--blue)"/>`, '0 0 300 300', 'A white vase between two blue face profiles');
};

/* key ideas */
FIG['i-kanizsa'] = () => {
  const P = [[160, 34], [82, 166], [238, 166]];
  const pac = (x, y, a1, a2) => { const r = 30; const s = [x + r * Math.cos(a2), y + r * Math.sin(a2)], e = [x + r * Math.cos(a1), y + r * Math.sin(a1)]; return `<path d="M${x} ${y} L${s[0].toFixed(1)} ${s[1].toFixed(1)} A${r} ${r} 0 1 1 ${e[0].toFixed(1)} ${e[1].toFixed(1)}Z" fill="var(--ink)"/>`; };
  const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  let o = '';
  P.forEach((p, i) => { const q = P[(i + 1) % 3], r = P[(i + 2) % 3]; let a = ang(p, q), b = ang(p, r); let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI; if (d < 0) { a = b; d = -d; } o += pac(p[0], p[1], a, a + d); });
  return box(o, '0 0 320 200', 'Three black circles with wedges cut out, arranged so a triangle seems to sit on top');
};
FIG['i-necker'] = () => box(`<g fill="none" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"><rect x="100" y="70" width="100" height="100"/><rect x="140" y="30" width="100" height="100"/><path d="M100 70 140 30M200 70 240 30M200 170 240 130M100 170 140 130"/></g>`, '0 0 340 200', 'A wire-frame cube drawn with no depth cues');
FIG['i-invariance'] = () => {
  const sh = 'M-6 -38 L30 -2 L8 -2 L8 34 L-14 34 L-14 -2 L-30 -2Z M-9 10 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0';
  return box(`<g fill="var(--blue)" fill-rule="evenodd"><path d="${sh}" transform="translate(66 100)"/><path d="${sh}" transform="translate(172 98) rotate(70) scale(1.45)"/><path d="${sh}" transform="translate(276 110) rotate(-150) scale(.72)"/></g>`, '0 0 340 200', 'The same shape three times: rotated, moved and resized');
};
FIG['i-emergence'] = () => {
  // a U built only from dots of different sizes
  const r = seeded(3); let o = '';
  for (let k = 0; k < 140; k++) {
    const t = r();
    let x, y;
    if (t < .32) { x = 108 + (r() - .5) * 34; y = 30 + r() * 100; }
    else if (t < .64) { x = 212 + (r() - .5) * 34; y = 30 + r() * 100; }
    else { const a = Math.PI * r(); const rad = 52 + (r() - .5) * 34; x = 160 - Math.cos(a) * rad; y = 130 + Math.sin(a) * rad; }
    o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(3 + r() * 6).toFixed(1)}" fill="var(--pink)"/>`;
  }
  return box(o, '0 0 320 200', 'A letter U made only of separate pink dots');
};

export function figureHTML(key) {
  const f = FIG[key]; if (!f) return '';
  try { return `<div class="qfig" data-fig="${esc(key)}">${f()}</div>`; } catch (e) { console.warn('figure', key, e); return ''; }
}
