// Lesson scenes: formations that illustrate one idea each. Chapters name them with `scene: '<name>'`.
// Catalogue (keep in sync with SCENE_INFO below):
//   mind:    eye · scan · minds · levers
//   shape:   solids · circle · square · triangle · triangleDown · star · polygon · organic · arrow · ellipse · combo · vlines · hlines
//   space:   clearing · airy · dense · activeSpace · passiveSpace
//   color:   colorSphere · warm · cold · neutrals · swatches
//   type:    type · serif · sans · script · display · mono · voices
//   express: squares · sq:<Word> (any Black Square word, e.g. sq:Chaos, sq:Order#1 for the 2nd trial)
//   gestalt: halftone · emergence · kanizsa · necker · vase · invariance · proximity · similarity · continuity · closure · simplicity · commonFate · connection · symmetry · figureGround
//   other:   monolith · spiral · nebula · elements
import * as FM from './formations.js';

const { hex } = FM;
function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1000003) / 1000003; }; }
const gauss = r => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const C = { w: hex('#EDEBE6'), dim: hex('#6F6D7A'), ultra: hex('#4D6BFF'), pink: hex('#FF3E8A'), red: hex('#FF4A2E'), sun: hex('#FFC21A'), ice: hex('#7FE7FF'), violet: hex('#8B7BFF'), good: hex('#46E3A0'), stone: hex('#D9B88C') };
const k = (c, f) => [c[0] * f, c[1] * f, c[2] * f];

/** builder: draw(P, budget) places points with P.pt(); the rest becomes dust */
function build(N, seed, draw, fill = .6) {
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), grp = new Float32Array(N), piv = new Float32Array(N * 4);
  const r = rng(seed); let i = 0;
  const P = {
    r, g: () => gauss(r),
    pt(x, y, z, c, g = 0, pv) { if (i >= N) return; pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; const f = .78 + r() * .4; col[i * 3] = c[0] * f; col[i * 3 + 1] = c[1] * f; col[i * 3 + 2] = c[2] * f; grp[i] = g; if (pv) piv.set(pv, i * 4); i++; },
    seg(n, x1, y1, x2, y2, c, j = .02, g = 0) { for (let q = 0; q < n; q++) { const t = r(); P.pt(x1 + (x2 - x1) * t + gauss(r) * j, y1 + (y2 - y1) * t + gauss(r) * j, gauss(r) * j, c, g); } },
    arc(n, cx, cy, rad, a0, a1, c, j = .02, g = 0) { for (let q = 0; q < n; q++) { const a = a0 + (a1 - a0) * r(); P.pt(cx + Math.cos(a) * rad + gauss(r) * j, cy + Math.sin(a) * rad + gauss(r) * j, gauss(r) * j, c, g); } },
    disc(n, cx, cy, rad, c, g = 0, pv) { for (let q = 0; q < n; q++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad; P.pt(cx + Math.cos(a) * d, cy + Math.sin(a) * d, gauss(r) * .03, c, g, pv); } },
    rect(n, x, y, w, h, c, g = 0) { for (let q = 0; q < n; q++) P.pt(x + r() * w, y + r() * h, gauss(r) * .02, c, g); },
    box(n, x, y, w, h, c, j = .015) { for (let q = 0; q < n; q++) { const t = r() * 2 * (w + h); let px, py; if (t < w) { px = x + t; py = y; } else if (t < w + h) { px = x + w; py = y + t - w; } else if (t < 2 * w + h) { px = x + w - (t - w - h); py = y + h; } else { px = x; py = y + h - (t - 2 * w - h); } P.pt(px + gauss(r) * j, py + gauss(r) * j, 0, c); } },
    poly(n, pts, c, g = 0) { // fill a convex/concave polygon by rejection
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
      const inside = (x, y) => { let o = false; for (let a = 0, b = pts.length - 1; a < pts.length; b = a++) { const [xa, ya] = pts[a], [xb, yb] = pts[b]; if ((ya > y) !== (yb > y) && x < (xb - xa) * (y - ya) / (yb - ya) + xa) o = !o; } return o; };
      let tries = 0; for (let q = 0; q < n && tries < n * 30; tries++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); if (inside(x, y)) { P.pt(x, y, gauss(r) * .02, c, g); q++; } }
    },
    outline(n, pts, c, j = .018) { const L = pts.map((p, a) => Math.hypot(pts[(a + 1) % pts.length][0] - p[0], pts[(a + 1) % pts.length][1] - p[1])); const T = L.reduce((a, b) => a + b, 0); pts.forEach((p, a) => { const q = pts[(a + 1) % pts.length]; P.seg(Math.round(n * L[a] / T), p[0], p[1], q[0], q[1], c, j); }); },
    text(n, str, font, width, c, c2, rtl = false, cy = 0, cx = 0) { const T = FM.textPoints(str, { font, width, rtl }); const m = T.length / 2; if (!m) return; for (let q = 0; q < n; q++) { const p = Math.floor(r() * m); const x = T[p * 2] + (r() - .5) * T.step, y = T[p * 2 + 1] + (r() - .5) * T.step; const t = c2 ? Math.min(1, Math.max(0, x / width + .5)) : 0; const cc = c2 ? [c[0] + (c2[0] - c[0]) * t, c[1] + (c2[1] - c[1]) * t, c[2] + (c2[2] - c[2]) * t] : c; P.pt(x + cx, y + cy, gauss(r) * .05, cc); } },
    get i() { return i; }
  };
  draw(P, Math.floor(N * fill));
  // dust: a deep faint shell
  for (; i < N; i++) { const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 7 + Math.pow(r(), .6) * 16, s = Math.sqrt(1 - u * u), f = .09 + r() * .22; pos[i * 3] = Math.cos(th) * s * rad; pos[i * 3 + 1] = u * rad * .62; pos[i * 3 + 2] = Math.min(1.5, Math.sin(th) * s * rad * .7 - 9); col[i * 3] = .75 * f; col[i * 3 + 1] = .74 * f; col[i * 3 + 2] = .82 * f; grp[i] = 4; }
  // shuffle
  const idx = Array.from({ length: N }, (_, q) => q); const rr = rng(seed + 99); for (let q = N - 1; q > 0; q--) { const j = Math.floor(rr() * (q + 1)); [idx[q], idx[j]] = [idx[j], idx[q]]; }
  const out = { N, pos: new Float32Array(N * 3), col: new Float32Array(N * 3), grp: new Float32Array(N), piv: new Float32Array(N * 4) };
  idx.forEach((s, d) => { out.pos.set(pos.subarray(s * 3, s * 3 + 3), d * 3); out.col.set(col.subarray(s * 3, s * 3 + 3), d * 3); out.grp[d] = grp[s]; out.piv.set(piv.subarray(s * 4, s * 4 + 4), d * 4); });
  return out;
}
const reg = (n, sides, rad, rot = -Math.PI / 2, cx = 0, cy = 0) => Array.from({ length: sides }, (_, q) => [cx + Math.cos(rot + q * Math.PI * 2 / sides) * rad, cy + Math.sin(rot + q * Math.PI * 2 / sides) * rad]);
const starPts = (R, rr, n = 5, cx = 0, cy = 0) => Array.from({ length: n * 2 }, (_, q) => { const a = -Math.PI / 2 + q * Math.PI / n, d = q % 2 ? rr : R; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]; });

export function sceneBuilders(N) {
  const B = {
    /* ---------- mind ---------- */
    scan: () => build(N, 101, (P, n) => { // a poster: one focal block, then supporting lines, read in a Z
      P.rect(n * .34, -3.4, .2, 3.1, 2.2, C.violet); P.rect(n * .12, .3, 1.7, 3.1, .34, C.w); P.rect(n * .05, .3, 1.15, 2.4, .14, k(C.w, .6)); P.rect(n * .05, .3, .85, 2.7, .14, k(C.w, .6)); P.rect(n * .05, .3, .55, 1.9, .14, k(C.w, .6));
      P.rect(n * .06, -3.4, -1.7, 1.4, .5, k(C.w, .7)); P.rect(n * .06, 1.6, -1.7, 1.8, .5, C.pink);
      const path = [[-3.2, 2.3], [3.2, 2.3], [-3.2, -2.3], [3.2, -2.3]]; for (let a = 0; a < 3; a++) P.seg(n * .09, ...path[a], ...path[a + 1], k(C.sun, .9), .025);
    }),
    minds: () => build(N, 103, (P, n) => { // the same thing, three readings
      [[-3, C.violet], [0, C.sun], [3, C.ice]].forEach(([x, c], q) => { P.arc(n * .1, x, .2, 1.2, 0, Math.PI * 2, k(c, .5), .03); P.disc(n * .2, x, .2, .5 + q * .12, c); });
      P.seg(n * .04, -4.4, -1.8, 4.4, -1.8, k(C.w, .5), .01);
    }),
    levers: () => build(N, 105, (P, n) => { // shape · type · colour · space
      P.disc(n * .2, -3.3, .9, .8, C.red); P.text(n * .2, 'A', '700 300px "EB Garamond", serif', 1.3, C.sun, null, false, -1.2);
      P.disc(n * .1, 3.3, .9, .9, C.pink); P.disc(n * .1, 3.3, .9, .5, C.violet);
      P.box(n * .14, 2.3, -2.3, 2, 1.6, k(C.ice, .8)); P.pt(3.3, -1.5, 0, C.w);
    }),
    /* ---------- shapes ---------- */
    circle: () => build(N, 111, (P, n) => { P.disc(n * .7, 0, 0, 2.1, hex('#3D5BFF')); P.arc(n * .3, 0, 0, 2.15, 0, Math.PI * 2, C.w, .02); }),
    square: () => build(N, 112, (P, n) => { P.rect(n * .7, -1.9, -1.9, 3.8, 3.8, C.red); P.box(n * .3, -1.95, -1.95, 3.9, 3.9, C.w); }),
    triangle: () => build(N, 113, (P, n) => { const t = [[0, 2.3], [2.4, -1.9], [-2.4, -1.9]]; P.poly(n * .7, t, C.sun); P.outline(n * .3, t, C.w); }),
    triangleDown: () => build(N, 114, (P, n) => { const t = [[-2.4, 1.9], [2.4, 1.9], [0, -2.3]]; P.poly(n * .7, t, C.red); P.outline(n * .3, t, C.w); }),
    star: () => build(N, 115, (P, n) => { const s = starPts(2.4, 1.0); P.poly(n * .7, s, C.sun); P.outline(n * .3, s, C.w); }),
    polygon: () => build(N, 116, (P, n) => { const h = reg(n, 6, 2.3); P.poly(n * .6, h, C.violet); P.outline(n * .25, h, C.w); [[0, 3], [1, 4], [2, 5]].forEach(([a, b]) => P.seg(n * .05, ...h[a], ...h[b], k(C.w, .5))); }),
    organic: () => build(N, 117, (P, n) => { const pts = Array.from({ length: 48 }, (_, q) => { const a = q / 48 * Math.PI * 2; const d = 2 + .35 * Math.sin(3 * a + .5) + .2 * Math.sin(5 * a + 1) + .12 * Math.sin(7 * a); return [Math.cos(a) * d * 1.15, Math.sin(a) * d * .9]; }); P.poly(n * .7, pts, C.good); P.outline(n * .3, pts, C.w); }),
    arrow: () => build(N, 118, (P, n) => { for (let q = 0; q < 4; q++) P.seg(n * .1, -4, 1.4 - q * .9, 1.6, 1.4 - q * .9, k(C.w, .4 + q * .15), .02); const a = [[-4, .35], [1.8, .35], [1.8, 1.1], [4, 0], [1.8, -1.1], [1.8, -.35], [-4, -.35]]; P.poly(n * .45, a, C.red); P.outline(n * .15, a, C.w); }),
    ellipse: () => build(N, 119, (P, n) => { P.arc(n * .35, 0, 0, 1, 0, Math.PI * 2, C.w, .02); for (let q = 0; q < n * .65; q++) { const a = P.r() * Math.PI * 2, d = Math.sqrt(P.r()); P.pt(Math.cos(a) * d * 3.1, Math.sin(a) * d * 1.8, P.g() * .03, C.violet); } }),
    combo: () => build(N, 120, (P, n) => { P.disc(n * .25, -1, .6, 1.4, hex('#3D5BFF')); P.rect(n * .25, -.2, -1.8, 2.6, 2.6, C.red); P.poly(n * .25, [[1.9, 2.3], [3.6, -.6], [.2, -.6]], C.sun); P.outline(n * .1, [[1.9, 2.3], [3.6, -.6], [.2, -.6]], C.w); }),
    vlines: () => build(N, 121, (P, n) => { for (let q = 0; q < 7; q++) P.seg(n / 7, -3 + q, -2.4 + (q % 2) * .3, -3 + q, 2.4 - (q % 3) * .2, q % 3 === 1 ? C.red : C.w, .03); }),
    hlines: () => build(N, 122, (P, n) => { for (let q = 0; q < 6; q++) P.seg(n / 6, -4 + q * .15, 1.9 - q * .75, 4 - q * .15, 1.9 - q * .75, k(q < 3 ? C.ice : C.w, 1 - q * .1), .025); }),
    /* ---------- space ---------- */
    airy: () => build(N, 131, (P, n) => { P.rect(n * .35, -.9, -.9, 1.8, 1.8, C.ice); P.seg(n * .1, -2, -2.1, 2, -2.1, k(C.w, .7)); P.seg(n * .05, -1.2, -2.5, 1.2, -2.5, k(C.w, .4)); }, .45),
    dense: () => build(N, 132, (P, n) => { for (let q = 0; q < 46; q++) { const w = .4 + P.r() * 1.6, h = .2 + P.r() * .9; P.rect(n / 46, -4.4 + P.r() * (8.8 - w), -2.6 + P.r() * (5.2 - h), w, h, [C.ice, C.w, C.pink, C.sun, C.red][q % 5]); } }, .7),
    activeSpace: () => build(N, 133, (P, n) => { P.rect(n * .55, 1.3, -1.6, 2.8, 3.4, C.ice); P.rect(n * .12, -4.2, -2.2, 3, .3, C.w); P.rect(n * .06, -4.2, -2.6, 2.1, .16, k(C.w, .6)); P.box(n * .1, -4.2, -.4, 4.6, 2.6, k(C.pink, .7), .02); }),
    passiveSpace: () => build(N, 134, (P, n) => { for (let row = 0; row < 7; row++) for (let w = 0; w < 6; w++) P.rect(n / 42, -4 + w * 1.38, 2.1 - row * .66, 1.1, .2, k(C.w, .8)); }),
    /* ---------- colour ---------- */
    warm: () => build(N, 141, (P, n) => { ['#FF4A2E', '#FF8A3D', '#FFC21A', '#FF3E8A', '#FFE14A'].forEach((h, q) => P.disc(n / 5, -3.2 + q * 1.6, Math.sin(q) * .5, .9, hex(h))); }),
    cold: () => build(N, 142, (P, n) => { ['#3DD6C4', '#7FE7FF', '#3D5BFF', '#8B7BFF', '#6F5BD6'].forEach((h, q) => P.disc(n / 5, -3.2 + q * 1.6, Math.cos(q) * .5, .9, hex(h))); }),
    neutrals: () => build(N, 143, (P, n) => { ['#EDEBE6', '#B6A88F', '#7E7C8B', '#4A4652', '#C9C2B4', '#2A2730', '#D9D4CC'].forEach((h, q) => { const a = q / 7 * Math.PI * 2; P.poly(n / 7, reg(0, 6, .85, 0, Math.cos(a) * 2.2, Math.sin(a) * 1.6), hex(h)); }); }),
    swatches: () => build(N, 144, (P, n) => { ['#E5322D', '#FF7A1A', '#FFD21F', '#1FA35B', '#2F47E8', '#7B3FC4', '#3A3A44', '#FFFFFF'].forEach((h, q) => P.rect(n / 8, -4.2 + q * 1.06, -1.4, .86, 2.8, hex(h))); }),
    /* ---------- type ---------- */
    serif: () => build(N, 151, (P, n) => P.text(n, 'Serif', '600 300px "EB Garamond", Georgia, serif', 7.5, C.sun, C.w)),
    sans: () => build(N, 152, (P, n) => P.text(n, 'Sans', '600 300px "IBM Plex Sans Arabic", Helvetica, sans-serif', 7, C.w, C.ice)),
    script: () => build(N, 153, (P, n) => P.text(n, 'Script', '400 300px Lobster, cursive', 7.5, C.pink, C.sun)),
    display: () => build(N, 154, (P, n) => P.text(n, 'DISPLAY', '400 300px "Bebas Neue", Impact, sans-serif', 8.2, C.red, C.sun)),
    mono: () => build(N, 155, (P, n) => P.text(n, 'mono', '400 300px "Courier Prime", monospace', 7.2, C.good, C.w)),
    voices: () => build(N, 156, (P, n) => { P.text(n * .5, 'خط', '900 300px Alexandria', 3.4, C.w, null, true, 1.0); P.text(n * .5, 'voice', '400 300px Lobster, cursive', 4.6, C.sun, C.pink, false, -1.4); }),
    /* ---------- gestalt ---------- */
    halftone: () => build(N, 161, (P, n) => { for (let y = -2.6; y <= 2.6; y += .22) for (let x = -4.2; x <= 4.2; x += .22) { const d = Math.hypot(x * .8, y); const s = Math.max(0, 1 - d / 2.8) * .1 + .015; P.disc(Math.round(4 + s * 380), x, y, s, d < 2.8 ? C.w : k(C.w, .3)); } }, .75),
    emergence: () => build(N, 162, (P, n) => { for (let q = 0; q < 170; q++) { let x, y; const t = P.r(); if (t < .32) { x = -1.15 + P.g() * .22; y = .1 + P.r() * 2.2; } else if (t < .64) { x = 1.15 + P.g() * .22; y = .1 + P.r() * 2.2; } else { const a = Math.PI + Math.PI * P.r(); x = Math.cos(a) * 1.15 + P.g() * .2; y = .1 + Math.sin(a) * 1.4; } P.disc(n / 170, x, y, .07 + P.r() * .14, C.pink); } }),
    necker: () => build(N, 163, (P, n) => { const a = [-2, -1.6], b = [-.6, -.2]; const s = 2.6; const sq = (o) => [[o[0], o[1]], [o[0] + s, o[1]], [o[0] + s, o[1] + s], [o[0], o[1] + s]]; const A = sq(a), Bq = sq(b); P.outline(n * .38, A, C.w, .015); P.outline(n * .38, Bq, C.w, .015); for (let q = 0; q < 4; q++) P.seg(n * .06, ...A[q], ...Bq[q], C.ultra, .015); }),
    vase: () => build(N, 164, (P, n) => { const prof = [[-.1, 2.5], [-.1, 2.2], [-.25, 1.8], [-.55, 1.5], [-.45, 1.3], [-.6, 1.1], [-.95, .8], [-.85, .65], [-.62, .55], [-.66, .4], [-.8, .25], [-.68, .1], [-.75, -.05], [-.55, -.25], [-.6, -.45], [-.68, -.65], [-.45, -.95], [-.08, -1.25], [.1, -1.65], [0, -2], [-.25, -2.3], [-.45, -2.6]]; const L = prof.map(([x, y]) => [x - 1.1, y]); const R = prof.map(([x, y]) => [-(x - 1.1), y]).reverse(); P.poly(n * .5, [[-4, 2.6], ...L, [-4, -2.6]], C.ultra); P.poly(n * .5, [[4, 2.6], ...R.reverse(), [4, -2.6]].map(([x, y]) => [x, y]), C.ultra); }),
    invariance: () => build(N, 165, (P, n) => { const base = [[-.5, 1], [.6, 1], [.9, .2], [.2, -1], [-.8, -.4]]; [[-3, 0, 0, 1], [0, .2, 1.1, 1.45], [3, -.1, -2.4, .7]].forEach(([cx, cy, rot, sc]) => { const pts = base.map(([x, y]) => [cx + (x * Math.cos(rot) - y * Math.sin(rot)) * sc, cy + (x * Math.sin(rot) + y * Math.cos(rot)) * sc]); P.poly(n / 3 * .8, pts, C.ultra); P.outline(n / 3 * .2, pts, C.w); }); }),
    proximity: () => build(N, 166, (P, n) => { for (let row = 0; row < 6; row++) for (let col = 0; col < 6; col++) { const x = -3.4 + Math.floor(col / 2) * 2.6 + (col % 2) * .7; P.disc(n / 36, x, 1.9 - row * .75, .16, C.w); } }),
    similarity: () => build(N, 167, (P, n) => { for (let row = 0; row < 5; row++) for (let col = 0; col < 8; col++) { const x = -3.5 + col, y = 1.8 - row * .9; if (row % 2) P.arc(n / 40, x, y, .24, 0, Math.PI * 2, C.ultra, .015); else P.disc(n / 40, x, y, .25, C.w); } }),
    continuity: () => build(N, 168, (P, n) => { for (let q = 0; q < 26; q++) { const t = q / 25; P.disc(n / 52, -4 + t * 8, 0, .1, C.w); P.disc(n / 52, -4 + t * 8, -Math.sin(t * Math.PI * 2) * 1.8, .1, C.pink); } }),
    closure: () => build(N, 169, (P, n) => { [[0, 1.1], [2.2, 3.4], [4.2, 5.6]].forEach(([a, b]) => P.arc(n * .14, -2.3, 0, 1.6, a, b, C.w, .02)); const s = 1.6, x0 = 1.2, y0 = -1.6; [[x0, y0, x0 + 1.1, y0], [x0 + 2.2, y0, x0 + 3.2, y0], [x0 + 3.2, y0, x0 + 3.2, y0 + 1.2], [x0 + 3.2, y0 + 2, x0 + 3.2, y0 + 3.2], [x0 + 3.2, y0 + 3.2, x0 + 2, y0 + 3.2], [x0 + 1, y0 + 3.2, x0, y0 + 3.2], [x0, y0 + 3.2, x0, y0 + 2.2], [x0, y0 + 1.2, x0, y0]].forEach(sg => P.seg(n * .07, ...sg, C.ultra, .02)); void s; }),
    simplicity: () => build(N, 170, (P, n) => { P.rect(n * .32, -2.2, -.9, 2.4, 1.9, C.w); P.poly(n * .3, [[.8, 1.5], [2.6, -1.3], [-.8, -1.3]], C.w); P.disc(n * .3, -1.1, -1.2, 1.1, C.w); }),
    commonFate: () => build(N, 171, (P, n) => { for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) { const moving = row === 1 && col % 2 === 0; const x = -3.3 + col * 1.1, y = 1.2 - row * 1.2; for (let q = 0; q < n / 21; q++) { const a = P.r() * Math.PI * 2, d = Math.sqrt(P.r()) * .22; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d, 0, moving ? C.pink : C.w, moving ? 5 : 0); } } }),
    connection: () => build(N, 172, (P, n) => { const pairs = [[[-3, 1], [-1.4, 1]], [[1.4, 1], [3, 1]], [[-3, -1], [-1.4, -1]], [[1.4, -1], [3, -1]]]; pairs.forEach(([a, b], q) => { P.seg(n * .05, ...a, ...b, C.ultra, .015); P.disc(n * .1, ...a, .32, C.w); P.rect(n * .1, b[0] - .3, b[1] - .3, .6, .6, C.w); void q; }); }),
    symmetry: () => build(N, 173, (P, n) => { P.text(n, '[ ]  { }  [ ]', '300 300px "IBM Plex Sans Arabic", sans-serif', 8.4, C.w, C.ultra); }),
    figureGround: () => build(N, 174, (P, n) => { const cat = [[-.6, 1.6], [-.3, 2.2], [0, 1.7], [.4, 1.7], [.7, 2.2], [.9, 1.5], [1, .7], [.7, .1], [1.3, -.4], [1.4, -1.6], [-1.4, -1.6], [-1.2, -.5], [-.6, .2], [-.9, .8]]; let tries = 0; for (let q = 0; q < n && tries < n * 4; tries++) { const x = -4.3 + P.r() * 8.6, y = -2.6 + P.r() * 5.2; let o = false; for (let a = 0, b = cat.length - 1; a < cat.length; b = a++) { const [xa, ya] = cat[a], [xb, yb] = cat[b]; if ((ya > y) !== (yb > y) && x < (xb - xa) * (y - ya) / (yb - ya) + xa) o = !o; } if (!o) { P.pt(x, y, P.g() * .05, k(C.ultra, .8 + P.r() * .3)); q++; } } }, .7),
    /* ---------- lecture 01 ---------- */
    elements: () => build(N, 181, (P, n) => { P.disc(n * .05, -3.6, 1.6, .12, C.stone); P.seg(n * .12, -2.6, 1.6, -.6, 1.6, C.stone, .02); P.box(n * .14, .2, .9, 1.4, 1.4, C.stone); P.disc(n * .2, 2.9, 1.6, .75, k(C.stone, .8)); P.rect(n * .2, -3.8, -2, 2.2, 1.4, k(C.stone, .6)); for (let q = 0; q < 5; q++) P.disc(n * .03, -.6 + q * .8, -1.3 + (q % 2) * .4, .2, C.stone); })
  };
  return B;
}

/** sq:<Word>[#trial] → a Black Square composition */
export function sqScene(N, name) { const [w, t] = name.slice(3).split('#'); return FM.squares(N, w, +(t || 0)); }

/** what the stage caption says for each scene: [English title, Arabic line, English line] (Arabic shows 0+1, English shows 0+2) */
export const SCENE_INFO = {
  eye: ['The viewer', 'المشاهد', 'Design starts in their head'], eyeBare: ['The viewer', 'المشاهد', 'Design starts in their head'], scan: ['Scan, don’t read', 'العين بتمسح مش بتقرا', 'Hierarchy guides the eye'], minds: ['Different minds', 'كل عقل بيشوف بطريقته', 'Same thing, many readings'], levers: ['Shape · Type · Color · Space', 'الأدوات الأربعة', 'The four levers'],
  solids: ['Shape, color, feeling', 'كل شكل ليه شخصية', 'Every shape has a personality'], circle: ['Circle', 'الدايرة', 'Unity · protection'], square: ['Square / Rectangle', 'المربع', 'Stability · trust'], triangle: ['Triangle ▲', 'المثلث لفوق', 'Pointing up: growth'], triangleDown: ['Triangle ▼', 'المثلث لتحت', 'Pointing down: danger'], star: ['Star', 'النجمة', 'Achievement · use sparingly'], polygon: ['Polygon', 'المضلّع', 'Sides and symmetry'], organic: ['Organic / Freeform', 'الشكل الحر', 'Nature · creativity'], arrow: ['Lines & Arrows', 'الخطوط والأسهم', 'They lead the eye'], ellipse: ['Ellipse / Oval', 'البيضاوي', 'Elegance · motion'], combo: ['Geometric combinations', 'تركيبات الأشكال', 'Layered stories'], vlines: ['Vertical lines', 'خطوط رأسية', 'Endurance · aggression'], hlines: ['Horizontal lines', 'خطوط أفقية', 'Community · calm'],
  clearing: ['Negative space', 'الفراغ السلبي', 'Room to breathe'], airy: ['Open, airy', 'براح وهادي', 'Calm and inviting'], dense: ['Dense, compact', 'زحمة ومستعجل', 'Intense and urgent'], activeSpace: ['Active whitespace', 'فراغ مقصود', 'Deliberate, asymmetric'], passiveSpace: ['Passive whitespace', 'فراغ عادي', 'The default gaps'],
  colorSphere: ['Color', 'اللون', 'Felt before it’s read'], warm: ['Warm colors', 'ألوان دافية', 'Energy · love · glory'], cold: ['Cold colors', 'ألوان باردة', 'Calm · trust · peace'], neutrals: ['Neutrals', 'ألوان محايدة', 'Formal · clean · classy'], swatches: ['8 colors', '٨ ألوان', 'Eight moods'],
  type: ['Typeface', 'الخط', 'Type is a voice'], serif: ['Serif', 'سيريف', 'Tradition · print'], sans: ['Sans-serif', 'سانس', 'Clarity · web'], script: ['Script', 'سكريبت', 'Elegance · intimacy'], display: ['Display', 'ديسبلاي', 'Bold · headlines'], mono: ['Monospaced', 'مونو', 'Precision · code'], voices: ['Visual voices', 'الخط صوت', 'Same words, another voice'],
  squares: ['Black Square Challenge', 'تحدي المربع الأسود', 'Only squares and lines'],
  halftone: ['Halftone dots', 'نقط الهافتون', 'Dots become a picture'], emergence: ['Emergence', 'الكل قبل الأجزاء', 'The whole before the parts'], kanizsa: ['Reification', 'المخ بيملا الفراغ', 'The mind fills the gaps'], necker: ['Multi-stability', 'صورتين في واحدة', 'Two pictures in one'], vase: ['Vase or two faces?', 'فازة ولا وشّين؟', 'Figure and ground swap'], invariance: ['Invariance', 'نفس الشكل مهما اتلف', 'Same shape, however it turns'],
  proximity: ['Proximity', 'القُرب', 'Close means together'], similarity: ['Similarity', 'التشابه', 'Alike means together'], continuity: ['Good continuity', 'الاستمرارية', 'The eye follows the line'], closure: ['Closure', 'الإغلاق', 'The mind closes the gap'], simplicity: ['Simplicity', 'البساطة', 'The simplest reading wins'], commonFate: ['Common fate', 'المصير المشترك', 'Move together, group together'], connection: ['Connectedness', 'الاتصال', 'Joined means grouped'], symmetry: ['Symmetry', 'التماثل', 'Mirrored reads as one'], figureGround: ['Figure / ground', 'الشكل والأرضية', 'The object and the space around it'],
  monolith: ['The Exam', 'الامتحان', 'Boss Tower'], spiral: ['Lecture 01', 'محاضرة ١', 'Elements & principles'], elements: ['Elements of design', 'عناصر التصميم', 'The building blocks'], nebula: ['Raw stimuli', 'زحمة قبل الترتيب', 'Noise before order']
};
