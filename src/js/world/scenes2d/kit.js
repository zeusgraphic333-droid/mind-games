// The riso-print kit for illustrated scenes. Every scene draws with these inks and helpers so the whole mode reads as
// one printed object: flat inks that overprint (multiply), halftone textures, a hair of misregistration, paper showing through.
// Scenes are SVG in a 600 × 600 viewBox (unless they set `view`). See STYLE.md next to this file.
import gsap from 'gsap';

export const INK = {
  paper: '#F4F5F9', paper2: '#E9EBF4', paper3: '#DCE0EF',
  navy: '#121535', ink2: '#474C77', ink3: '#6F74A0',
  blue: '#2F47E8', pink: '#FF4DAA', yellow: '#FFE24A', teal: '#00A6A1', orange: '#FF6A3D',
  green: '#16A05D', violet: '#6B4CFF', red: '#EE3440', gold: '#E8B931'
};
/** every ink that gets a halftone pattern */
const HT_INKS = ['navy', 'blue', 'pink', 'yellow', 'teal', 'orange', 'green', 'violet', 'red'];

let installed = false;
/** shared <defs>: halftone patterns (ht-<ink>-s|m|l), dot grids, misregistration + grain filters. Installed once per page. */
export function installDefs() {
  if (installed || typeof document === 'undefined') return; installed = true;
  const sizes = { s: [6, 1.35], m: [9, 2.4], l: [13, 4.1] };
  let p = '';
  for (const k of HT_INKS) for (const [sz, [step, r]] of Object.entries(sizes)) {
    p += `<pattern id="ht-${k}-${sz}" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(${k === 'yellow' ? 0 : k === 'pink' ? 75 : k === 'blue' ? 15 : 45})"><circle cx="${step / 2}" cy="${step / 2}" r="${r}" fill="${INK[k]}"/></pattern>`;
  }
  // halftone that fades: a radial gradient mask × dot pattern (use mask="url(#fade-r)" on a halftone fill)
  p += `<radialGradient id="g-fade-r"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="fade-r" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#g-fade-r)"/></mask>
    <linearGradient id="g-fade-y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="fade-y" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#g-fade-y)"/></mask>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .07  0 0 0 0 .08  0 0 0 0 .2  0 0 0 -1.4 1.05"/></filter>`;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `<defs>${p}</defs>`;
  document.body.appendChild(svg);
}

/* ---------- drawing helpers (return SVG markup strings) ---------- */
const attr = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => `${k}="${v}"`).join(' ');
/** an ink layer. NOTE: no mix-blend-mode inside scenes — Chrome mis-renders blended SVG groups that use pattern fills
 * (the halftone leaks to the group's bounding box). The whole scene multiplies onto the paper at the HTML level instead
 * (.st2-scene svg { mix-blend-mode: multiply }). For a see-through overprint inside a scene, use fill-opacity (.8–.9). */
export const mul = '';
export const ht = (ink, size = 'm') => `url(#ht-${ink}-${size})`;
export const circle = (cx, cy, r, fill, extra = '') => `<circle ${attr({ cx, cy, r, fill })} ${extra}/>`;
export const rect = (x, y, w, h, fill, extra = '') => `<rect ${attr({ x, y, width: w, height: h, fill })} ${extra}/>`;
export const poly = (pts, fill, extra = '') => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${fill}" ${extra}/>`;
export const path = (d, fill = 'none', extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
export const line = (x1, y1, x2, y2, stroke, w = 3, extra = '') => `<line ${attr({ x1, y1, x2, y2, stroke, 'stroke-width': w, 'stroke-linecap': 'round' })} ${extra}/>`;
/** regular polygon / star points */
export const ngon = (cx, cy, r, n, rot = -90) => Array.from({ length: n }, (_, i) => { const a = (rot + i * 360 / n) * Math.PI / 180; return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)]; });
export const star = (cx, cy, r1, r2, n = 5, rot = -90) => Array.from({ length: n * 2 }, (_, i) => { const r = i % 2 ? r2 : r1; const a = (rot + i * 180 / n) * Math.PI / 180; return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)]; });
/** a grid of dots (for halftone fields, Gestalt groupings…) */
export function dots(cols, rows, x0, y0, step, r, fill, pick = () => true) {
  let s = ''; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (pick(i, j)) s += `<circle cx="${x0 + i * step}" cy="${y0 + j * step}" r="${typeof r === 'function' ? r(i, j) : r}" fill="${fill}"/>`; return s;
}
/** display text in the mode's faces. family: 'display' (Anybody), 'text' (Atkinson), 'ar' (Alexandria), 'dot' (Doto) */
export function text(x, y, s, { size = 40, fill = INK.navy, family = 'display', weight = 800, width = 100, anchor = 'middle', extra = '', dir = '' } = {}) {
  const fam = { display: "'Anybody', 'Arial Black', sans-serif", text: "'Atkinson Hyperlegible Next', Arial, sans-serif", ar: "'Alexandria', sans-serif", dot: "'Doto', monospace", serif: "'EB Garamond', serif", script: "'Lobster', cursive", bebas: "'Bebas Neue', sans-serif", mono: "'Courier Prime', monospace" }[family] || family;
  // the page may be RTL: anchors would flip with it, so each text carries its own direction (Arabic text → rtl).
  // An explicit direction="…" in `extra` comes first in the markup and wins.
  const d = dir || (/[\u0600-\u06FF]/.test(String(s)) ? 'rtl' : 'ltr');
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${fam}" font-size="${size}" font-weight="${weight}" fill="${fill}" style="font-stretch:${width}%" ${extra} direction="${d}">${s}</text>`;
}
/** misregistered copy: the same markup printed twice — the second pass in `ink2`, nudged — for the riso double-hit look */
export const misreg = (markupFor, ink1, ink2, dx = 3, dy = -2) => `<g transform="translate(${dx} ${dy})" opacity=".85">${markupFor(ink2)}</g><g>${markupFor(ink1)}</g>`;
/** the paper texture over a whole scene (cheap: one filtered rect) */
export const grain = (w = 600, h = 600, o = .35) => `<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${o}" style="pointer-events:none"/>`;


/** printer's registration mark (thin crosshair in a circle) — the print-lab signature; use sparingly, in corners */
export const regmark = (x, y, r = 9, c = INK.navy) => `<g opacity=".55"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="1.2"/><line x1="${x - r * 1.6}" y1="${y}" x2="${x + r * 1.6}" y2="${y}" stroke="${c}" stroke-width="1.2"/><line x1="${x}" y1="${y - r * 1.6}" x2="${x}" y2="${y + r * 1.6}" stroke="${c}" stroke-width="1.2"/></g>`;
/** pac-man / notched disk: a circle with a wedge of `gap` degrees cut out, centred on angle `face` */
export function notched(cx, cy, r, face, gap = 60) {
  const a1 = (face - gap / 2) * Math.PI / 180, a2 = (face + gap / 2) * Math.PI / 180;
  const p = a => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  return `M${cx},${cy} L${p(a2)} A${r},${r} 0 1 1 ${p(a1)} Z`;
}

/* ---------- motion helpers ---------- */
export const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
/** a timeline that the stage will kill when the scene leaves; loops only when motion is allowed */
export function tl(opts = {}) { return gsap.timeline({ defaults: { ease: 'power3.out' }, ...opts }); }
/** gentle endless motion (bob/breathe/rotate) — skipped under reduced motion */
export function loop(targets, vars) { if (reduced()) return null; return gsap.to(targets, { repeat: -1, yoyo: true, ease: 'sine.inOut', ...vars }); }
/** print-press entrance: layers arrive one ink at a time, slightly off, then register */
export function press(t, layers, { at = 0, stagger = .12, from = 18 } = {}) {
  layers = [].concat(layers).filter(Boolean);
  layers.forEach((el, i) => { const a = (i * 137) % 360 * Math.PI / 180; t.from(el, { opacity: 0, x: Math.cos(a) * from, y: Math.sin(a) * from, duration: .9, ease: 'expo.out' }, at + i * stagger); });
  return t;
}
export const kit = { INK, mul, ht, circle, rect, poly, path, line, ngon, star, dots, text, misreg, grain, regmark, notched, reduced, tl, loop, press, gsap };
export default kit;
