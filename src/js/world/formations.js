// Formations: every "picture" the particle cloud can assemble into.
// Each generator fills N particles → { pos, col, grp, piv } (Float32Arrays).
//   grp: 0 static · 1 iris (follows the cursor, clipped by the lids) · 2 lids (blink) · 3 highlight · 4 dust
//   piv: xyz = spin pivot, w = spin speed (rad/s) for solids that turn in place
import { SQ } from '../data/squares.js';

export const N_DESKTOP = 36000, N_MOBILE = 15000;

function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1000003) / 1000003; }; }
const gauss = r => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
export function hex(h) { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }
function hsl(h, s, l) { const k = n => (n + h * 12) % 12, a = s * Math.min(l, 1 - l); const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0), f(8), f(4)]; }
const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function make(N) { return { N, pos: new Float32Array(N * 3), col: new Float32Array(N * 3), grp: new Float32Array(N), piv: new Float32Array(N * 4) }; }
function put(F, i, x, y, z, c, g = 0) { F.pos[i * 3] = x; F.pos[i * 3 + 1] = y; F.pos[i * 3 + 2] = z; F.col[i * 3] = c[0]; F.col[i * 3 + 1] = c[1]; F.col[i * 3 + 2] = c[2]; F.grp[i] = g; }
function pivot(F, i, x, y, z, w) { F.piv[i * 4] = x; F.piv[i * 4 + 1] = y; F.piv[i * 4 + 2] = z; F.piv[i * 4 + 3] = w; }

/** background dust: a deep shell of faint specks (always some, so the void has depth) */
function dust(F, from, r, tint = [0.75, 0.74, 0.82]) {
  for (let i = from; i < F.N; i++) {
    const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 7 + Math.pow(r(), .6) * 16;
    const s = Math.sqrt(1 - u * u);
    const k = 0.1 + r() * 0.24;
    put(F, i, Math.cos(th) * s * rad, u * rad * 0.62, Math.min(1.5, Math.sin(th) * s * rad * .7 - 9), [tint[0] * k, tint[1] * k, tint[2] * k], 4);
  }
}
/** random order so particles travel varied paths between formations */
function shuffled(F, seed) {
  const r = rng(seed), N = F.N, idx = new Uint32Array(N);
  for (let i = 0; i < N; i++) idx[i] = i;
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  const G = make(N);
  for (let i = 0; i < N; i++) { const s = idx[i]; G.pos.set(F.pos.subarray(s * 3, s * 3 + 3), i * 3); G.col.set(F.col.subarray(s * 3, s * 3 + 3), i * 3); G.grp[i] = F.grp[s]; G.piv.set(F.piv.subarray(s * 4, s * 4 + 4), i * 4); }
  return G;
}

/* ---------------- the eye ---------------- */
export const EYE = { W: 3.25, HU: 1.55, HL: 1.22, R: 1.18, P: 0.44 };
export const lidH = (x, up) => { const t = 1 - Math.min(1, (x / EYE.W) ** 2); return up ? EYE.HU * Math.pow(t, .8) : EYE.HL * Math.pow(t, .9); };
export function eye(N, { ring = false, seed = 3 } = {}) {
  const F = make(N), r = rng(seed); let i = 0;
  const A = Math.floor(N * (ring ? .60 : .66));
  const irisIn = hex('#FFB36B'), irisMid = hex('#8B7BFF'), irisOut = hex('#3D5BFF'), white = [1, 1, 1], lid = hex('#EDEBE6');
  const nLid = Math.floor(A * .21), nCrease = Math.floor(A * .04), nIris = Math.floor(A * .67), nPup = Math.floor(A * .06), nHi = A - nLid - nCrease - nIris - nPup;
  // lids
  for (let k = 0; k < nLid; k++, i++) {
    const up = k % 2 === 0; const x = (r() * 2 - 1) * EYE.W; const y = (up ? 1 : -1) * lidH(x, up);
    const j = gauss(r) * 0.03; const fade = 0.55 + 0.45 * (1 - Math.abs(x) / EYE.W);
    put(F, i, x + j, y + gauss(r) * 0.028, 0.15 + j, lid.map(c => c * fade), 2);
  }
  for (let k = 0; k < nCrease; k++, i++) { const x = (r() * 2 - 1) * EYE.W * .82; put(F, i, x, lidH(x, true) + .34 + gauss(r) * .025, 0.1, lid.map(c => c * .45), 2); }
  // iris: radial fibres + a bright limbus + a collarette
  const fibres = 220;
  for (let k = 0; k < nIris; k++, i++) {
    const f = Math.floor(r() * fibres); let a = f / fibres * Math.PI * 2 + gauss(r) * 0.012;
    let rad; const pick = r();
    if (pick < .18) rad = EYE.R - Math.abs(gauss(r)) * .035; // limbus
    else if (pick < .3) { rad = 0.74 + gauss(r) * .03; a = r() * Math.PI * 2; } // collarette
    else rad = EYE.P + .03 + Math.pow(r(), .85) * (EYE.R - EYE.P - .05);
    const t = (rad - EYE.P) / (EYE.R - EYE.P);
    const c = t < .45 ? mixc(irisIn, irisMid, t / .45) : mixc(irisMid, irisOut, (t - .45) / .55);
    const z = 0.32 * (1 - (rad / EYE.R) ** 2) + 0.05;
    put(F, i, Math.cos(a) * rad, Math.sin(a) * rad, z, c.map(v => v * (0.75 + r() * .5)), 1);
  }
  for (let k = 0; k < nPup; k++, i++) { const a = r() * Math.PI * 2, rad = EYE.P + Math.abs(gauss(r)) * .02; put(F, i, Math.cos(a) * rad, Math.sin(a) * rad, .36, irisIn.map(v => v * .9), 1); }
  for (let k = 0; k < nHi; k++, i++) { const a = r() * Math.PI * 2, rad = Math.sqrt(r()) * .15; put(F, i, -.42 + Math.cos(a) * rad, .42 + Math.sin(a) * rad, .5, white.map(v => v * .55), 3); }
  // the orbit the districts ride on
  if (ring) {
    const nR = Math.floor(N * .07);
    for (let k = 0; k < nR; k++, i++) { const a = r() * Math.PI * 2; const [x, y, z] = ringPoint(a); const b = .2 + .14 * (z > 0 ? 1 : 0); put(F, i, x + gauss(r) * .015, y + gauss(r) * .015, z, [b, b * .96, b * 1.2], 0); }
  }
  dust(F, i, r);
  return shuffled(F, seed + 7);
}
/** the orbit around the eye that the districts ride on (tilted toward the viewer) */
export const RING = { R: 4.9, tilt: 0.3 };
export function ringPoint(a, R = RING.R) { return [Math.cos(a) * R, -Math.sin(a) * R * Math.sin(RING.tilt) - .15, Math.sin(a) * R * Math.cos(RING.tilt)]; }

/* ---------------- text (sampled from a canvas) ---------------- */
const textCache = new Map();
/** sample the filled pixels of some text → [x0,y0,x1,y1,…] centred, scaled so the ink is `width` wide */
export function textPoints(str, { font = '900 220px Alexandria', width = 8.5, rtl = true, lines = null } = {}) {
  const key = [str, font, width, rtl, lines && lines.join('|')].join('§');
  if (textCache.has(key)) return textCache.get(key);
  const cv = document.createElement('canvas'); const W = 1600, H = 560; cv.width = W; cv.height = H;
  const x = cv.getContext('2d', { willReadFrequently: true });
  x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.direction = rtl ? 'rtl' : 'ltr'; x.font = font;
  const ls = lines || [str]; const fs = parseFloat((font.match(/(\d+)px/) || [0, 200])[1]);
  // shrink to fit the canvas
  let scale = 1; ls.forEach(l => { const w = x.measureText(l).width; if (w > W * .94) scale = Math.min(scale, W * .94 / w); });
  if (scale < 1) x.font = font.replace(/(\d+)px/, Math.floor(fs * scale) + 'px');
  ls.forEach((l, k) => x.fillText(l, W / 2, H / 2 + (k - (ls.length - 1) / 2) * fs * scale * 1.05));
  const d = x.getImageData(0, 0, W, H).data; const pts = [];
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let yy = 0; yy < H; yy += 2) for (let xx = 0; xx < W; xx += 2) if (d[(yy * W + xx) * 4] > 140) { pts.push(xx, yy); if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; if (yy < minY) minY = yy; if (yy > maxY) maxY = yy; }
  const sc = width / Math.max(1, maxX - minX); const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const out = new Float32Array(pts.length);
  for (let i = 0; i < pts.length; i += 2) { out[i] = (pts[i] - cx) * sc; out[i + 1] = -(pts[i + 1] - cy) * sc; }
  out.step = 2 * sc; // size of one sample cell in world units
  textCache.set(key, out);
  return out;
}
export function text(N, str, { font = '900 220px Alexandria', width = 8.5, color = '#EDEBE6', color2 = null, seed = 5, fill = .62, rtl = true, lines = null } = {}) {
  const F = make(N), r = rng(seed);
  const T = textPoints(str, { font, width, rtl, lines }); const n = T.length / 2; const nT = Math.floor(N * fill); let i = 0;
  const c1 = hex(color), c2 = color2 ? hex(color2) : c1;
  for (; i < nT && n; i++) {
    const p = Math.floor(r() * n); const px = T[p * 2] + (r() - .5) * T.step, py = T[p * 2 + 1] + (r() - .5) * T.step;
    const t = Math.min(1, Math.max(0, px / width + .5));
    put(F, i, px, py, gauss(r) * .06, mixc(c1, c2, rtl ? 1 - t : t).map(v => v * (.8 + r() * .35)), 0);
  }
  dust(F, i, r);
  return shuffled(F, seed + 11);
}

/* ---------------- Shape Town: Kandinsky's three (yellow triangle, red square, blue circle) ---------------- */
export function solids(N, seed = 9) {
  const F = make(N), r = rng(seed); let i = 0; const nS = Math.floor(N * .62), each = Math.floor(nS / 3);
  const Y = hex('#FFC21A'), Rd = hex('#FF4A2E'), B = hex('#3D5BFF');
  // sphere (circle) — right side in RTL reading order comes first, but keep classic left→right: triangle, square, circle
  for (let k = 0; k < each; k++, i++) { const u = r() * 2 - 1, th = r() * Math.PI * 2, s = Math.sqrt(1 - u * u), rad = 1.12 * (r() < .85 ? 1 : Math.cbrt(r())); put(F, i, 2.85 + Math.cos(th) * s * rad, u * rad, Math.sin(th) * s * rad, B.map(v => v * (.75 + r() * .45))); pivot(F, i, 2.85, 0, 0, .35); }
  // cube (square)
  for (let k = 0; k < each; k++, i++) {
    const h = 0.95; const face = Math.floor(r() * 6); let a = (r() * 2 - 1) * h, b = (r() * 2 - 1) * h; let p;
    if (face === 0) p = [h, a, b]; else if (face === 1) p = [-h, a, b]; else if (face === 2) p = [a, h, b]; else if (face === 3) p = [a, -h, b]; else if (face === 4) p = [a, b, h]; else p = [a, b, -h];
    const edge = (Math.abs(Math.abs(p[0]) - h) < .02) + (Math.abs(Math.abs(p[1]) - h) < .02) + (Math.abs(Math.abs(p[2]) - h) < .02);
    put(F, i, p[0], p[1], p[2], Rd.map(v => v * (.7 + r() * .4 + (edge >= 2 ? .3 : 0)))); pivot(F, i, 0, 0, 0, -.28);
  }
  // pyramid (triangle): 4 triangular faces + base
  const apex = [-2.85, 1.25, 0], base = [[-2.85 - 1.1, -.95, -1.1], [-2.85 + 1.1, -.95, -1.1], [-2.85 + 1.1, -.95, 1.1], [-2.85 - 1.1, -.95, 1.1]];
  for (let k = 0; k < nS - 2 * each; k++, i++) {
    const f = Math.floor(r() * 5); let p;
    if (f < 4) { const a = base[f], b = base[(f + 1) % 4]; let u = r(), v = r(); if (u + v > 1) { u = 1 - u; v = 1 - v; } p = [apex[0] + (a[0] - apex[0]) * u + (b[0] - apex[0]) * v, apex[1] + (a[1] - apex[1]) * u + (b[1] - apex[1]) * v, apex[2] + (a[2] - apex[2]) * u + (b[2] - apex[2]) * v]; }
    else p = [-2.85 + (r() * 2 - 1) * 1.1, -.95, (r() * 2 - 1) * 1.1];
    put(F, i, p[0], p[1], p[2], Y.map(v => v * (.75 + r() * .4))); pivot(F, i, -2.85, 0, 0, .3);
  }
  dust(F, i, r);
  return shuffled(F, seed + 1);
}

/* ---------------- Space Station: a crowd with one clearing (negative space isolates the object) ---------------- */
export function clearing(N, seed = 13) {
  const F = make(N), r = rng(seed); let i = 0; const nF = Math.floor(N * .64);
  const ice = hex('#9FEFFF'), white = hex('#EDEBE6');
  const R0 = 1.75;
  while (i < nF) {
    const x = (r() * 2 - 1) * 5.2, y = (r() * 2 - 1) * 2.9; const d = Math.hypot(x, y);
    if (d < R0 && d > .42) continue;
    const edge = Math.max(0, 1 - Math.abs(d - R0) / .5);
    if (d <= .42) put(F, i++, x * .9, y * .9, .2 + gauss(r) * .05, white, 0);
    else { const fall = Math.min(1, Math.max(.15, 1 - (Math.abs(x) / 5.2) ** 3)); put(F, i++, x, y, gauss(r) * .12 - .2, ice.map(v => v * (.25 + .45 * fall + edge * .4) * (.7 + r() * .5)), 0); }
  }
  dust(F, i, r);
  return shuffled(F, seed + 3);
}

/* ---------------- Color Lab: Runge's colour sphere ---------------- */
export function colorSphere(N, seed = 17) {
  const F = make(N), r = rng(seed); let i = 0; const nS = Math.floor(N * .64); const R = 2.25;
  for (; i < nS; i++) {
    const u = r() * 2 - 1, th = r() * Math.PI * 2, s = Math.sqrt(1 - u * u); const rad = R * (r() < .9 ? 1 : Math.cbrt(r()));
    const sat = rad / R; const light = .5 + u * .42;
    put(F, i, Math.cos(th) * s * rad, u * rad, Math.sin(th) * s * rad, hsl(th / (Math.PI * 2), .95 * sat, light)); pivot(F, i, 0, 0, 0, .22);
  }
  dust(F, i, r);
  return shuffled(F, seed + 2);
}

/* ---------------- Black Square Studio: a composition of squares + lines inside the 15 × 15 frame ---------------- */
export function squares(N, word = 'Tension', trial = 0, seed = 21) {
  const F = make(N), r = rng(seed); let i = 0; const nS = Math.floor(N * .6);
  const S = 4.6 / 150; const off = (v) => (v - 75) * S;
  const white = hex('#EDEBE6'), red = hex('#FF3B30'), blue = hex('#3D5BFF'), pink = hex('#FF3E8A');
  const items = (SQ[word] || SQ.Tension).trials[trial].items;
  const C = { k: white, r: red, b: blue, p: pink };
  // frame: 1pt stroke box
  const nFrame = Math.floor(nS * .14);
  for (let k = 0; k < nFrame; k++, i++) { const t = r() * 4; const side = Math.floor(t), u = t - side; let x, y; if (side === 0) { x = -75 + u * 150; y = -75; } else if (side === 1) { x = 75; y = -75 + u * 150; } else if (side === 2) { x = 75 - u * 150; y = 75; } else { x = -75; y = 75 - u * 150; } put(F, i, x * S + gauss(r) * .01, -y * S + gauss(r) * .01, 0, white.map(v => v * .55)); }
  // items weighted by area
  const areas = items.map(it => it.t === 's' ? (it.st ? it.s * 4 * 1.5 : it.s * it.s) : Math.hypot(it.x2 - it.x1, it.y2 - it.y1) * Math.max(1.5, it.w) * 1.2);
  const tot = areas.reduce((a, b) => a + b, 0) || 1; const left = nS - nFrame;
  items.forEach((it, k) => {
    const n = Math.floor(left * areas[k] / tot); const c = C[it.c] || white; const o = it.o ?? 1;
    for (let q = 0; q < n && i < N; q++, i++) {
      let x, y;
      if (it.t === 's') {
        let a = r(), b = r();
        if (it.st) { const t = r() * 4; const side = Math.floor(t), u = t - side; [a, b] = side === 0 ? [u, 0] : side === 1 ? [1, u] : side === 2 ? [u, 1] : [0, u]; }
        const lx = (a - .5) * it.s, ly = (b - .5) * it.s; const ang = (it.r || 0) * Math.PI / 180;
        x = it.x + it.s / 2 + lx * Math.cos(ang) - ly * Math.sin(ang); y = it.y + it.s / 2 + lx * Math.sin(ang) + ly * Math.cos(ang);
      } else { const t = r(); x = it.x1 + (it.x2 - it.x1) * t + gauss(r) * it.w * .3; y = it.y1 + (it.y2 - it.y1) * t + gauss(r) * it.w * .3; }
      put(F, i, off(x), -off(y), gauss(r) * .02 + .05, c.map(v => v * (.55 + .45 * o) * (.85 + r() * .3)));
    }
  });
  dust(F, i, r);
  return shuffled(F, seed + 4);
}

/* ---------------- Gestalt Arcade: the Kanizsa triangle (an edge nobody drew) ---------------- */
export function kanizsa(N, seed = 25) {
  const F = make(N), r = rng(seed); let i = 0; const nS = Math.floor(N * .6);
  const B = hex('#3D5BFF'), W = hex('#EDEBE6');
  const L = 4.4, Rr = .95; const V = [[0, L / Math.sqrt(3)], [-L / 2, -L / (2 * Math.sqrt(3))], [L / 2, -L / (2 * Math.sqrt(3))]].map(([x, y]) => [x, y + .2]);
  const nEach = Math.floor(nS / 3);
  V.forEach((v, k) => {
    const others = V.filter((_, j) => j !== k); const a1 = Math.atan2(others[0][1] - v[1], others[0][0] - v[0]), a2 = Math.atan2(others[1][1] - v[1], others[1][0] - v[0]);
    let lo = Math.min(a1, a2), hi = Math.max(a1, a2); if (hi - lo > Math.PI) { const t = lo; lo = hi; hi = t + Math.PI * 2; }
    for (let q = 0; q < nEach; q++, i++) {
      let a, rad; do { a = r() * Math.PI * 2; rad = Math.sqrt(r()) * Rr; let aa = a; while (aa < lo) aa += Math.PI * 2; if (!(aa > lo && aa < hi)) break; } while (true);
      const rim = rad > Rr * .93; put(F, i, v[0] + Math.cos(a) * rad, v[1] + Math.sin(a) * rad, gauss(r) * .03, (rim ? W : B).map(c => c * (.7 + r() * .4)));
    }
  });
  dust(F, i, r);
  return shuffled(F, seed + 9);
}

/* ---------------- Boss Tower: the Exam, a monolith with a visor ---------------- */
export function monolith(N, seed = 29) {
  const F = make(N), r = rng(seed); let i = 0; const nS = Math.floor(N * .64);
  const red = hex('#FF3B30'), ink = hex('#5A1A1A'), hot = hex('#FFD1C4');
  const w = 1.25, h = 3.0, d = .7;
  for (; i < nS; i++) {
    const face = Math.floor(r() * 6); let a = r() * 2 - 1, b = r() * 2 - 1, p;
    if (face < 2) p = [face ? w : -w, a * h, b * d]; else if (face < 4) p = [a * w, b * h, face === 2 ? d : -d]; else p = [a * w, face === 4 ? h : -h, b * d];
    const visor = Math.abs(p[1] - 1.55) < .1 && Math.abs(p[2] - d) < .02;
    const band = Math.floor((p[1] + h) * 3) % 4 === 0;
    put(F, i, p[0], p[1] - .1, p[2], visor ? hot : (band ? ink : red).map(v => v * (.7 + r() * .45))); pivot(F, i, 0, 0, 0, .18);
  }
  dust(F, i, r, [.9, .55, .55]);
  return shuffled(F, seed + 6);
}

/* ---------------- Old Town (Lecture 01): the golden spiral ---------------- */
export function spiral(N, seed = 33) {
  const F = make(N), r = rng(seed); let i = 0; const nS = Math.floor(N * .58);
  const stone = hex('#D9B88C'), dim = hex('#8A7356');
  const phi = (1 + Math.sqrt(5)) / 2; const b = Math.log(phi) / (Math.PI / 2);
  for (; i < nS; i++) {
    if (r() < .72) { const t = r() * Math.PI * 4.5; const rad = .06 * Math.exp(b * t); const a = t + Math.PI * .1; put(F, i, Math.cos(a) * rad - .6 + gauss(r) * .02, Math.sin(a) * rad * 1 + gauss(r) * .02, gauss(r) * .03, stone.map(v => v * (.7 + r() * .4))); }
    else { const k = Math.floor(r() * 6); const s = [3.6, 2.2, 1.4, .85, .52, .32][k]; const t = r() * 4; const side = Math.floor(t), u = t - side; let x, y; if (side === 0) { x = u * s; y = 0; } else if (side === 1) { x = s; y = u * s; } else if (side === 2) { x = s - u * s; y = s; } else { x = 0; y = s - u * s; } put(F, i, x - 2.2 + k * .35, y - 1.8 + k * .2, -.1, dim.map(v => v * (.6 + r() * .3))); }
  }
  dust(F, i, r);
  return shuffled(F, seed + 5);
}

/* ---------------- a calm cloud (between things) ---------------- */
export function nebula(N, seed = 41) {
  const F = make(N), r = rng(seed); let i = 0; const nS = Math.floor(N * .55);
  const a = hex('#8B7BFF'), b = hex('#FF3E8A'), c = hex('#3D5BFF');
  for (; i < nS; i++) { const rad = Math.pow(r(), .5) * 3.2, th = r() * Math.PI * 2, u = gauss(r) * .45; const t = rad / 3.2; put(F, i, Math.cos(th) * rad, u * (1.2 - t * .6), Math.sin(th) * rad * .6, mixc(mixc(b, a, t), c, Math.max(0, t - .5)).map(v => v * (.35 + r() * .5))); pivot(F, i, 0, 0, 0, .12); }
  dust(F, i, r);
  return shuffled(F, seed + 8);
}

export const ZONE_FORMATION = { mind: 'eye', shape: 'solids', space: 'clearing', color: 'colorSphere', type: 'type', express: 'squares', gestalt: 'kanizsa', boss: 'monolith', old: 'spiral' };
