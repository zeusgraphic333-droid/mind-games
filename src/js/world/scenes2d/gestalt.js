// Illustrated scenes — gestalt group: halftone · emergence · kanizsa · necker · vase · invariance · proximity · similarity ·
// continuity · closure · simplicity · commonFate · connection · symmetry · figureGround. See STYLE.md.
// `kanizsa` is a reference: the idea is carried by what is NOT printed, and the motion makes you notice it.
const V = [[300, 128], [146, 394], [454, 394]]; // triangle vertices
const C3 = [300, 305];

function kanizsaDraw(k) {
  const { INK, mul, ht, notched } = k;
  const face = ([x, y]) => Math.atan2(C3[1] - y, C3[0] - x) * 180 / Math.PI;
  const disks = V.map(([x, y], i) => `<g class="kz-d" data-i="${i}">
      <g ${mul} transform="translate(6 5)"><path d="${notched(x, y, 74, face([x, y]))}" fill="${ht('blue', 'm')}"/></g>
      <path class="kz-full" d="M${x - 74},${y} a74,74 0 1,0 148,0 a74,74 0 1,0 -148,0" fill="${INK.navy}"/>
      <path class="kz-pac" d="${notched(x, y, 74, face([x, y]))}" fill="${INK.navy}" opacity="0"/>
    </g>`).join('');
  const tri = V.map(p => p.join(',')).join(' ');
  return `
    <g class="kz-ghost" ${mul} opacity="0"><polygon points="${tri}" fill="${ht('yellow', 'l')}"/><polygon points="${tri}" fill="none" stroke="${INK.pink}" stroke-width="2.5" stroke-dasharray="3 9"/></g>
    ${disks}
    <g class="kz-note" opacity="0">${k.text(300, 548, 'not printed', { size: 26, family: 'dot', weight: 700, fill: INK.ink2 })}</g>
    ${k.regmark(52, 52)}${k.regmark(548, 52)}`;
}
function kanizsaPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s);
  const t = k.tl();
  t.from(all('.kz-d'), { scale: 0, transformOrigin: '50% 50%', duration: .9, stagger: .12, ease: 'back.out(1.6)' });
  // the disks "open" together — the triangle appears although nobody drew it
  t.to(all('.kz-pac'), { opacity: 1, duration: .5, ease: 'power2.inOut' }, '+=.2').to(all('.kz-full'), { opacity: 0, duration: .5 }, '<');
  if (k.reduced()) { t.set(all('.kz-pac'), { opacity: 1 }); return t; }
  // every few seconds, show what your mind is adding — then take it away again
  gsap.timeline({ repeat: -1, repeatDelay: 2.2, delay: 2 })
    .to(all('.kz-ghost'), { opacity: .9, duration: .7, ease: 'power2.out' })
    .to(all('.kz-note'), { opacity: 1, duration: .4 }, '<.2')
    .to(all('.kz-ghost'), { opacity: 0, duration: .9, ease: 'power2.in' }, '+=1.2')
    .to(all('.kz-note'), { opacity: 0, duration: .5 }, '<');
  k.loop(all('.kz-d'), { y: '+=5', duration: 2.4, stagger: .3 });
  return t;
}

/* ======================================================================================================
   shared bits for the laws. The system: navy is the key ink; what your MIND adds or groups is shown, now and then,
   as a yellow-halftone ghost with a pink dashed edge (the same language as kanizsa), then taken away again.
   ====================================================================================================== */
const rng = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const f1 = v => (+v).toFixed(1);
const pt = p => `${f1(p[0])} ${f1(p[1])}`;
/** Catmull-Rom through the points as cubic segments, continuing from pts[0] (no M) */
function smoothSeg(pts) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return d;
}
const ghostStyle = k => `stroke="${k.INK.pink}" stroke-width="2.5" stroke-dasharray="3 9" stroke-linecap="round"`;
const lineLen = el => Math.hypot(el.x2.baseVal.value - el.x1.baseVal.value, el.y2.baseVal.value - el.y1.baseVal.value);
/** stroke-draw a set of <line>s */
function drawLines(t, lines, { at = 0, dur = .5, stagger = .05 } = {}) {
  lines.forEach((el, i) => { const L = lineLen(el) + 1; t.fromTo(el, { strokeDasharray: `0 ${L}` }, { strokeDasharray: `${L} 0`, duration: dur, ease: 'power2.inOut' }, at + i * stagger); });
}

/* ======================================================================================================
   halftone — dots of different sizes, and your eye fuses them into one picture: a lit ball and its shadow.
   The loop zooms in until it is only dots, then out again until it is a ball.
   ====================================================================================================== */
const HT = { cx: 288, cy: 258, R: 186, step: 20, fx: 352, fy: 318 };
function htDots() {
  const { cx, cy, R, step } = HT; const ball = [], shadow = [];
  const L = [-.55, -.62, .56]; const n = Math.hypot(...L); const l = L.map(v => v / n);
  const a = Math.PI / 4, ca = Math.cos(a), sa = Math.sin(a);
  const sx = cx + 70, sy = cy + R + 30, rx = 196, ry = 36;
  for (let i = -22; i <= 22; i++) for (let j = -22; j <= 22; j++) {
    const gx = i * step, gy = j * step; const x = cx + gx * ca - gy * sa, y = cy + gx * sa + gy * ca;
    const dx = (x - cx) / R, dy = (y - cy) / R, d2 = dx * dx + dy * dy;
    if (d2 <= 1) {
      const dz = Math.sqrt(1 - d2), lam = Math.max(0, dx * l[0] + dy * l[1] + dz * l[2]);
      let tone = 1 - (.06 + .94 * Math.pow(lam, 1.2));
      tone *= 1 - .3 * Math.pow(Math.max(0, (dx + dy) * .72), 4); // bounce light along the shadowed rim
      const r = step / 2 * 1.04 * Math.sqrt(Math.max(0, tone));
      if (r > 1) ball.push([x, y, r]);
    } else {
      const e = ((x - sx) / rx) ** 2 + ((y - sy) / ry) ** 2;
      if (e < 1) { const r = step / 2 * Math.sqrt(.78 * (1 - e)); if (r > 1) shadow.push([x, y, r]); }
    }
  }
  return { ball, shadow };
}
function halftoneDraw(k) {
  const { INK } = k; const { cx, cy, R } = HT; const { ball, shadow } = htDots();
  const c = ([x, y, r]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  return `
  <defs><clipPath id="halftone-clip"><rect x="40" y="40" width="520" height="520"/></clipPath></defs>
  <g clip-path="url(#halftone-clip)"><g class="hf-z">
    <circle class="hf-y" cx="${cx - 8}" cy="${cy - 7}" r="${R}" fill="${INK.yellow}"/>
    <g class="hf-sh" fill="${INK.blue}">${shadow.map(c).join('')}</g>
    <g class="hf-b" fill="${INK.navy}">${ball.map(c).join('')}</g>
  </g></g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function halftonePlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s), all = s => svg.querySelectorAll(s);
  const t = k.tl();
  k.press(t, [q('.hf-y'), q('.hf-sh')], { from: 24 });
  // the screen is printed row by row, like a plate being exposed
  t.from(all('.hf-b circle'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)', stagger: { each: .0032, from: 'start' } }, .15);
  if (k.reduced()) return t;
  const o = `${HT.fx} ${HT.fy}`;
  gsap.timeline({ repeat: -1, delay: 2.6, repeatDelay: 1.8 })
    .to(q('.hf-z'), { scale: 3.6, svgOrigin: o, duration: 2.8, ease: 'power2.inOut' })
    .to(q('.hf-z'), { scale: 1, svgOrigin: o, duration: 2.6, ease: 'power2.inOut' }, '+=1.6');
  return t;
}

/* ======================================================================================================
   emergence — the whole is identified before the parts: circles of every size that are, at once, a U.
   They drift apart and gather again; the outline (what you identify first) shows up before they have settled.
   ====================================================================================================== */
const EM = { top: 100, jy: 322, ro: 150, ri: 60 };
const inU = (x, y) => (y >= EM.top && y <= EM.jy && ((x >= 300 - EM.ro && x <= 300 - EM.ri) || (x >= 300 + EM.ri && x <= 300 + EM.ro)))
  || (y >= EM.jy && (d => d >= EM.ri && d <= EM.ro)(Math.hypot(x - 300, y - EM.jy)));
function emCircles() {
  const r = rng(29), out = [], N = 9000;
  for (let i = 0; i < N && out.length < 118; i++) {
    const rad = Math.max(5.5, 30 * (1 - i / N) * (.55 + .45 * r()));
    const x = 300 - EM.ro + r() * EM.ro * 2, y = EM.top + r() * (EM.jy + EM.ro - EM.top);
    let ok = inU(x, y); for (let a = 0; ok && a < 12; a++) ok = inU(x + Math.cos(a * Math.PI / 6) * rad, y + Math.sin(a * Math.PI / 6) * rad);
    if (!ok || out.some(([cx, cy, cr]) => Math.hypot(cx - x, cy - y) < cr + rad + 3.5)) continue;
    out.push([x, y, rad]);
  }
  return out;
}
const EM_U = `M${300 - EM.ro} ${EM.top}H${300 - EM.ri}V${EM.jy}A${EM.ri} ${EM.ri} 0 0 0 ${300 + EM.ri} ${EM.jy}V${EM.top}H${300 + EM.ro}V${EM.jy}A${EM.ro} ${EM.ro} 0 0 1 ${300 - EM.ro} ${EM.jy}Z`;
function emergenceDraw(k) {
  const { INK, ht } = k; const cs = emCircles();
  return `
  <g class="em-ghost" opacity="0"><path d="${EM_U}" fill="${ht('yellow', 'l')}"/><path d="${EM_U}" fill="none" ${ghostStyle(k)}/></g>
  <g class="em-dots">${cs.map(([x, y, r], i) => `<circle class="em-c" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${i % 9 === 4 ? INK.navy : i % 7 === 2 ? ht('pink', 's') : INK.pink}"${i % 7 === 2 ? ` stroke="${INK.pink}" stroke-width="2.5"` : ''}/>`).join('')}</g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function emergencePlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const cs = [...all('.em-c')]; const r = rng(7);
  const off = cs.map(c => {
    const x = +c.getAttribute('cx'), y = +c.getAttribute('cy'), a = Math.atan2(y - 286, x - 300) + (r() - .5) * 1.3, d = 70 + r() * 120;
    const tx = Math.max(52, Math.min(548, x + Math.cos(a) * d)), ty = Math.max(52, Math.min(548, y + Math.sin(a) * d));
    return { x: tx - x, y: ty - y };
  });
  const t = k.tl();
  if (k.reduced()) { t.from(cs, { opacity: 0, duration: .6, stagger: .004 }); return t; }
  // parts first arrive from everywhere; the outline is recognised before they have even settled
  t.from(cs, { x: i => off[i].x, y: i => off[i].y, opacity: 0, duration: 1.5, ease: 'expo.out', stagger: { each: .004, from: 'random' } }, 0)
    .to(q('.em-ghost'), { opacity: .95, duration: .45 }, .35).to(q('.em-ghost'), { opacity: 0, duration: .8 }, 1.5);
  gsap.timeline({ repeat: -1, delay: 3.6, repeatDelay: 1.4 })
    .to(cs, { x: i => off[i].x * .8, y: i => off[i].y * .8, duration: 1.8, ease: 'power2.inOut', stagger: { each: .005, from: 'random' } })
    .to(cs, { x: 0, y: 0, duration: 1.9, ease: 'power3.inOut', stagger: { each: .005, from: 'random' } }, '+=1.1')
    .to(q('.em-ghost'), { opacity: .95, duration: .5 }, '<.55')
    .to(q('.em-ghost'), { opacity: 0, duration: .9 }, '>.5');
  return t;
}

/* ======================================================================================================
   necker — one line drawing, two cubes: first this face is in front, then the other one. (Multi-stability)
   ====================================================================================================== */
const NK = { a: [134, 238], b: [246, 126], s: 218 };
const nkSq = ([x, y], s) => [[x, y], [x + s, y], [x + s, y + s], [x, y + s]];
function neckerDraw(k) {
  const { INK } = k; const A = nkSq(NK.a, NK.s), B = nkSq(NK.b, NK.s);
  const edges = [...A.map((p, i) => [p, A[(i + 1) % 4]]), ...B.map((p, i) => [p, B[(i + 1) % 4]]), ...A.map((p, i) => [p, B[i]])];
  const ln = ([p, q], cls = '') => `<line ${cls} x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;
  const box = P => `M${P.map(p => p.join(' ')).join('L')}Z`;
  return `
  <g class="nk-mis" transform="translate(7 -6)" stroke="${INK.pink}" stroke-width="3" stroke-linecap="round" opacity=".85">${edges.map(e => ln(e)).join('')}</g>
  <g class="nk-wire" stroke="${INK.navy}" stroke-width="9" stroke-linecap="round">${edges.map(e => ln(e, 'class="nk-e"')).join('')}</g>
  <g class="nk-fa" opacity="0"><path d="${box(A)}" fill="${INK.blue}" stroke="${INK.navy}" stroke-width="9" stroke-linejoin="round"/></g>
  <g class="nk-fb" opacity="0"><path d="${box(B)}" fill="${INK.yellow}" stroke="${INK.navy}" stroke-width="9" stroke-linejoin="round"/></g>
  ${k.regmark(52, 548)}${k.regmark(548, 52)}`;
}
function neckerPlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s), all = s => svg.querySelectorAll(s);
  const t = k.tl();
  drawLines(t, [...all('.nk-e')], { dur: .55, stagger: .06 });
  t.from(q('.nk-mis'), { opacity: 0, x: -6, y: 6, duration: .9, ease: 'expo.out' }, .6);
  if (k.reduced()) { t.set(q('.nk-fa'), { opacity: 1 }); return t; }
  // the mind will not stay undecided: it picks a front face, then flips to the other
  gsap.timeline({ repeat: -1, delay: 1.8 })
    .to(q('.nk-fa'), { opacity: 1, duration: .6, ease: 'power2.out' })
    .to(q('.nk-fa'), { opacity: 0, duration: .5, ease: 'power2.in' }, '+=2.2')
    .to(q('.nk-fb'), { opacity: 1, duration: .6, ease: 'power2.out' }, '+=.6')
    .to(q('.nk-fb'), { opacity: 0, duration: .5, ease: 'power2.in' }, '+=2.2')
    .to({}, { duration: .6 });
  k.loop([q('.nk-wire'), q('.nk-fa'), q('.nk-fb')], { y: '+=5', duration: 2.8 });
  return t;
}

/* ======================================================================================================
   vase — Rubin's vase: one edge, two readings. A vase in the middle, or two profiles facing each other.
   ====================================================================================================== */
const VS = { top: 96, bot: 504, l: 96, r: 504 };
// distance from the centre line to the profile edge, top to bottom (forehead, brow, nose, lips, chin, throat, neck)
const VPROF = [[96, 118], [140, 112], [178, 100], [198, 108], [218, 96], [244, 54], [260, 68], [272, 86], [284, 74], [297, 86], [309, 76], [323, 92], [343, 72], [366, 98], [394, 118], [440, 124], [478, 116], [504, 104]];
function vaseParts() {
  const R = VPROF.map(([y, d]) => [300 + d, y]), L = VPROF.map(([y, d]) => [300 - d, y]);
  const segR = smoothSeg(R), segL = smoothSeg(L), segLup = smoothSeg([...L].reverse());
  return {
    vase: `M${pt(R[0])}${segR}L${pt(L[L.length - 1])}${segLup}Z`,
    faceR: `M${pt(R[0])}${segR}L${VS.r} ${VS.bot}L${VS.r} ${VS.top}Z`,
    faceL: `M${pt(L[0])}${segL}L${VS.l} ${VS.bot}L${VS.l} ${VS.top}Z`,
    edges: `M${pt(R[0])}${segR}M${pt(L[0])}${segL}`
  };
}
function vaseDraw(k) {
  const { INK } = k; const P = vaseParts(); const w = VS.r - VS.l;
  return `
  <g class="vs-mis" transform="translate(7 -6)" opacity=".9"><path d="${P.edges}" fill="none" stroke="${INK.blue}" stroke-width="3.5"/></g>
  <path class="vs-vase" d="${P.vase}" fill="${INK.navy}"/>
  <g class="vs-faces" opacity="0"><path d="${P.faceL}" fill="${INK.pink}"/><path d="${P.faceR}" fill="${INK.pink}"/></g>
  <path class="vs-edge" d="${P.edges}" fill="none" stroke="${INK.navy}" stroke-width="2.5"/>
  <rect class="vs-frame" x="${VS.l}" y="${VS.top}" width="${w}" height="${VS.bot - VS.top}" fill="none" stroke="${INK.navy}" stroke-width="3"/>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function vasePlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s);
  const t = k.tl();
  t.from(q('.vs-frame'), { opacity: 0, scale: .94, transformOrigin: '50% 50%', duration: .8, ease: 'expo.out' }, 0);
  const e = q('.vs-edge'), L = e.getTotalLength ? e.getTotalLength() : 1000;
  t.fromTo(e, { strokeDasharray: `0 ${L}` }, { strokeDasharray: `${L} 0`, duration: 1.1, ease: 'power2.inOut' }, .1);
  k.press(t, [q('.vs-mis'), q('.vs-vase')], { at: .6 });
  if (k.reduced()) return t;
  // look at the middle: a vase. Look at the sides: two faces. The print flips which one carries the ink.
  gsap.timeline({ repeat: -1, delay: 2.4 })
    .to(q('.vs-vase'), { opacity: 0, duration: .8, ease: 'power2.inOut' })
    .to(q('.vs-faces'), { opacity: 1, duration: .8, ease: 'power2.inOut' }, '<')
    .to(q('.vs-faces'), { opacity: 0, duration: .8, ease: 'power2.inOut' }, '+=2.4')
    .to(q('.vs-vase'), { opacity: 1, duration: .8, ease: 'power2.inOut' }, '<')
    .to({}, { duration: 2.4 });
  return t;
}

/* ======================================================================================================
   invariance — the same tile, rotated, moved, scaled and distorted, still recognised. Four stamps of it in four
   inks; the solid one travels through all four poses.
   ====================================================================================================== */
const TILE = 'M-40 -56H40Q56 -56 56 -40V40Q56 56 40 56H-40Q-56 56 -56 40V-40Q-56 -56 -40 -56ZM-39 -20a19 19 0 1 0 38 0a19 19 0 1 0 -38 0ZM17 27a12 12 0 1 0 24 0a12 12 0 1 0 -24 0Z';
const POSES = [
  { x: 176, y: 178, r: 0, k: 0, sx: 1.12, sy: 1.12 },
  { x: 432, y: 170, r: 36, k: 0, sx: .72, sy: .72 },
  { x: 418, y: 420, r: 158, k: 0, sx: 1.04, sy: 1.04 },
  { x: 180, y: 424, r: -10, k: -26, sx: 1.12, sy: .76 }
];
const poseT = p => `translate(${f1(p.x)} ${f1(p.y)}) rotate(${f1(p.r)}) skewX(${f1(p.k)}) scale(${f1(p.sx)} ${f1(p.sy)})`;
function invarianceDraw(k) {
  const { INK, ht } = k;
  const fills = [`fill="none" stroke="${INK.navy}" stroke-width="2.5" stroke-dasharray="4 6"`, `fill="${ht('blue', 'm')}"`, `fill="${ht('pink', 'm')}"`, `fill="${INK.yellow}"`];
  const stamps = POSES.map((p, i) => `<path class="iv-s" d="${TILE}" fill-rule="evenodd" ${fills[i]} vector-effect="non-scaling-stroke" transform="${poseT(p)}"/>`).join('');
  return `${stamps}
  <g class="iv-live" transform="${poseT(POSES[0])}">
    <path d="${TILE}" fill-rule="evenodd" fill="${INK.pink}" transform="translate(5 -4)" opacity=".9"/>
    <path d="${TILE}" fill-rule="evenodd" fill="${INK.navy}"/>
  </g>
  ${k.regmark(548, 548)}${k.regmark(52, 548)}`;
}
function invariancePlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), live = svg.querySelector('.iv-live');
  const p = { ...POSES[0] }; const set = () => live.setAttribute('transform', poseT(p));
  const t = k.tl();
  t.from(all('.iv-s'), { opacity: 0, scale: 1.3, transformOrigin: '50% 50%', duration: .45, stagger: .14, ease: 'power3.out' }, 0)
    .from(live, { opacity: 0, duration: .5 }, .6);
  if (k.reduced()) return t;
  // rotate it, move it, scale it, distort it — it is still the same thing
  const cyc = gsap.timeline({ repeat: -1, delay: 1.8 });
  [1, 2, 3, 0].forEach((n, i) => cyc.to(p, { ...POSES[n], duration: 1.3, ease: 'power3.inOut', onUpdate: set }, i * 2.5));
  return t;
}

/* ======================================================================================================
   proximity — identical dots; only the spacing changes, and a square of dots becomes three columns.
   ====================================================================================================== */
const PX_EVEN = c => 300 + (c - 2.5) * 62;
const PX_GRP = c => 300 + (Math.floor(c / 2) - 1) * 164 + (c % 2 - .5) * 40;
const PY = r => 300 + (r - 2.5) * 62;
function proximityDraw(k) {
  const { INK, ht } = k; let dots = '';
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) dots += `<circle class="px-d" data-c="${c}" cx="${f1(PX_GRP(c))}" cy="${f1(PY(r))}" r="13" fill="${INK.navy}"/>`;
  const ghost = [0, 1, 2].map(g => { const x = 300 + (g - 1) * 164; return `<rect x="${x - 50}" y="${PY(0) - 40}" width="100" height="${PY(5) - PY(0) + 80}" rx="50" fill="${ht('yellow', 'l')}"/><rect x="${x - 50}" y="${PY(0) - 40}" width="100" height="${PY(5) - PY(0) + 80}" rx="50" fill="none" ${ghostStyle(k)}/>`; }).join('');
  return `<g class="px-ghost" opacity="0">${ghost}</g><g class="px-dots">${dots}</g>${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function proximityPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const dots = [...all('.px-d')]; const cOf = el => +el.dataset.c;
  const t = k.tl();
  if (k.reduced()) { t.from(dots, { opacity: 0, duration: .5 }); return t; }
  // printed as one even square first…
  t.set(dots, { attr: { cx: i => f1(PX_EVEN(cOf(dots[i]))) } }, 0)
    .from(dots, { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)', stagger: { each: .02, grid: [6, 6], from: 'center' } }, 0);
  // …then only the gaps change: three columns, and the mind groups them (shown, then taken away)
  gsap.timeline({ repeat: -1, delay: 1.5, repeatDelay: .4 })
    .to(dots, { attr: { cx: i => f1(PX_GRP(cOf(dots[i]))) }, duration: 1.2, ease: 'power3.inOut' })
    .to(q('.px-ghost'), { opacity: .9, duration: .6 }, '+=.3')
    .to(q('.px-ghost'), { opacity: 0, duration: .7 }, '+=1.3')
    .to(dots, { attr: { cx: i => f1(PX_EVEN(cOf(dots[i]))) }, duration: 1.2, ease: 'power3.inOut' }, '+=.8')
    .to({}, { duration: 1.2 });
  return t;
}

/* ======================================================================================================
   similarity — equal spacing everywhere; only what the elements look like decides the groups: rows, then columns.
   ====================================================================================================== */
const SM = { cols: 8, rows: 5, dx: 58, dy: 62 };
const smX = c => 300 + (c - (SM.cols - 1) / 2) * SM.dx, smY = r => 300 + (r - (SM.rows - 1) / 2) * SM.dy;
function similarityDraw(k) {
  const { INK, ht } = k; let s = '';
  for (let r = 0; r < SM.rows; r++) for (let c = 0; c < SM.cols; c++) {
    const ring = r % 2 === 1;
    s += `<g class="sm-e" data-r="${r}" data-c="${c}"><circle class="sm-dot" cx="${f1(smX(c))}" cy="${f1(smY(r))}" r="15" fill="${INK.navy}" opacity="${ring ? 0 : 1}"/><circle class="sm-ring" cx="${f1(smX(c))}" cy="${f1(smY(r))}" r="12" fill="none" stroke="${INK.pink}" stroke-width="6" opacity="${ring ? 1 : 0}"/></g>`;
  }
  const rowBands = [1, 3].map(r => `<rect x="${f1(smX(0) - 36)}" y="${f1(smY(r) - 30)}" width="${f1(smX(SM.cols - 1) - smX(0) + 72)}" height="60" rx="30" fill="${ht('yellow', 'l')}"/><rect x="${f1(smX(0) - 36)}" y="${f1(smY(r) - 30)}" width="${f1(smX(SM.cols - 1) - smX(0) + 72)}" height="60" rx="30" fill="none" ${ghostStyle(k)}/>`).join('');
  const colBands = [1, 3, 5, 7].map(c => `<rect x="${f1(smX(c) - 27)}" y="${f1(smY(0) - 36)}" width="54" height="${f1(smY(SM.rows - 1) - smY(0) + 72)}" rx="27" fill="${ht('yellow', 'l')}"/><rect x="${f1(smX(c) - 27)}" y="${f1(smY(0) - 36)}" width="54" height="${f1(smY(SM.rows - 1) - smY(0) + 72)}" rx="27" fill="none" ${ghostStyle(k)}/>`).join('');
  return `<g class="sm-rows" opacity="0">${rowBands}</g><g class="sm-cols" opacity="0">${colBands}</g>${s}${k.regmark(52, 548)}${k.regmark(548, 52)}`;
}
function similarityPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const els = [...all('.sm-e')];
  const flip = (tl, rule, at) => els.forEach(e => {
    const ring = rule(+e.dataset.r, +e.dataset.c), d = (+e.dataset.c + +e.dataset.r) * .035;
    tl.to(e.querySelector('.sm-dot'), { opacity: ring ? 0 : 1, duration: .45 }, at + d).to(e.querySelector('.sm-ring'), { opacity: ring ? 1 : 0, duration: .45 }, at + d);
  });
  const t = k.tl();
  t.from(els, { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)', stagger: { each: .012, grid: [SM.rows, SM.cols], from: 'start' } }, 0);
  if (k.reduced()) return t;
  // rows of rings and rows of dots read as rows; swap the rule and the same grid reads as columns
  const cyc = gsap.timeline({ repeat: -1, delay: 1.6 });
  cyc.to(q('.sm-rows'), { opacity: .9, duration: .6 }).to(q('.sm-rows'), { opacity: 0, duration: .6 }, '+=1.4');
  flip(cyc, (r, c) => c % 2 === 1, 3);
  cyc.to(q('.sm-cols'), { opacity: .9, duration: .6 }, 4.6).to(q('.sm-cols'), { opacity: 0, duration: .6 }, 6.6);
  flip(cyc, r => r % 2 === 1, 7.6);
  cyc.to({}, { duration: .1 }, 9.2);
  return t;
}

/* ======================================================================================================
   continuity — a straight row and an S-curve of dots cross; you see two continuous lines, not four pieces
   meeting in the middle. A pulse runs along each line, straight through the crossing.
   ====================================================================================================== */
const CT_N = 25;
function ctPaths() {
  const straight = Array.from({ length: CT_N }, (_, i) => [70 + i * 460 / (CT_N - 1), 300]);
  const S = t => [70 + 460 * t, 300 + 176 * Math.sin((t - .5) * Math.PI)];
  const fine = Array.from({ length: 401 }, (_, i) => S(i / 400)); const acc = [0];
  for (let i = 1; i < fine.length; i++) acc.push(acc[i - 1] + Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]));
  const total = acc[acc.length - 1]; const curve = [];
  for (let n = 0, i = 0; n < CT_N; n++) { const want = total * n / (CT_N - 1); while (i < acc.length - 1 && acc[i] < want) i++; curve.push(fine[i]); }
  return { straight, curve, sD: `M70 300H530`, cD: 'M' + fine.filter((_, i) => i % 8 === 0 || i === 400).map(pt).join('L') };
}
function continuityDraw(k) {
  const { INK, ht } = k; const P = ctPaths();
  const dots = (pts, fill, cls) => pts.map(p => `<circle class="${cls}" cx="${f1(p[0])}" cy="${f1(p[1])}" r="9" fill="${fill}"/>`).join('');
  const rib = (d, cls) => `<g class="${cls}" opacity="0"><path d="${d}" fill="none" stroke="${ht('yellow', 'l')}" stroke-width="44" stroke-linecap="round"/><path d="${d}" fill="none" ${ghostStyle(k)}/></g>`;
  return `${rib(P.sD, 'ct-rs')}${rib(P.cD, 'ct-rc')}
  <g class="ct-cv">${dots(P.curve, INK.pink, 'ct-c')}</g>
  <g class="ct-st">${dots(P.straight, INK.navy, 'ct-s')}</g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function continuityPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const S = [...all('.ct-s')], C = [...all('.ct-c')];
  const t = k.tl();
  t.from(S, { scale: 0, transformOrigin: '50% 50%', duration: .35, stagger: .03, ease: 'back.out(2)' }, 0)
    .from(C, { scale: 0, transformOrigin: '50% 50%', duration: .35, stagger: .03, ease: 'back.out(2)' }, .15);
  if (k.reduced()) return t;
  // the eye follows each line through the crossing
  const pulse = (tl, dots, rib, at) => tl.to(q(rib), { opacity: .85, duration: .4 }, at)
    .to(dots, { scale: 1.75, transformOrigin: '50% 50%', duration: .22, ease: 'power2.out', yoyo: true, repeat: 1, stagger: .06 }, at + .1)
    .to(q(rib), { opacity: 0, duration: .5 }, at + .1 + dots.length * .06 + .2);
  const cyc = gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: 1.2 });
  pulse(cyc, S, '.ct-rs', 0); pulse(cyc, C, '.ct-rc', 2.6);
  return t;
}

/* ======================================================================================================
   closure — a circle and a square with gaps in them, closed anyway. The broken circle turns, the square's corners
   breathe; now and then the edges your mind fills in are shown.
   ====================================================================================================== */
const CL = { cx: 194, cy: 212, r: 120, gap: 24, qx: 410, qy: 402, h: 104, arm: 58 };
function closureDraw(k) {
  const { INK, ht } = k; const { cx, cy, r, gap, qx, qy, h, arm } = CL;
  const arcs = [0, 1, 2, 3].map(i => {
    const a1 = (i * 90 - 30 + gap / 2) * Math.PI / 180, a2 = ((i + 1) * 90 - 30 - gap / 2) * Math.PI / 180;
    return `<path d="M${f1(cx + r * Math.cos(a1))} ${f1(cy + r * Math.sin(a1))}A${r} ${r} 0 0 1 ${f1(cx + r * Math.cos(a2))} ${f1(cy + r * Math.sin(a2))}"/>`;
  }).join('');
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => {
    const x = qx + sx * h, y = qy + sy * h;
    return `<path class="cl-k" data-sx="${sx}" data-sy="${sy}" d="M${x} ${y - sy * arm}L${x} ${y}L${x - sx * arm} ${y}"/>`;
  }).join('');
  return `
  <g class="cl-ghost" opacity="0">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${ht('yellow', 'l')}"/><rect x="${qx - h}" y="${qy - h}" width="${2 * h}" height="${2 * h}" fill="${ht('yellow', 'l')}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${ghostStyle(k)}/><rect x="${qx - h}" y="${qy - h}" width="${2 * h}" height="${2 * h}" fill="none" ${ghostStyle(k)}/>
  </g>
  <g class="cl-mis" transform="translate(6 -5)" opacity=".85"><g class="cl-arcs2" fill="none" stroke="${INK.blue}" stroke-width="4">${arcs}</g></g>
  <g class="cl-arcs" fill="none" stroke="${INK.navy}" stroke-width="30">${arcs}</g>
  <g class="cl-sq" fill="none" stroke="${INK.pink}" stroke-width="30" stroke-linejoin="miter">${corners}</g>
  ${k.regmark(548, 52)}${k.regmark(52, 548)}`;
}
function closurePlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const t = k.tl();
  t.from(all('.cl-arcs path'), { opacity: 0, rotate: -30, svgOrigin: `${CL.cx} ${CL.cy}`, duration: .9, stagger: .08, ease: 'expo.out' }, 0)
    .from(all('.cl-k'), { opacity: 0, x: i => [-1, 1, 1, -1][i] * 30, y: i => [-1, -1, 1, 1][i] * 30, duration: .9, stagger: .08, ease: 'expo.out' }, .2)
    .from(q('.cl-mis'), { opacity: 0, duration: .6 }, .7);
  if (k.reduced()) return t;
  gsap.to([q('.cl-arcs'), q('.cl-arcs2')], { rotate: 360, svgOrigin: `${CL.cx} ${CL.cy}`, duration: 30, ease: 'none', repeat: -1 });
  all('.cl-k').forEach(c => k.loop(c, { x: +c.dataset.sx * 9, y: +c.dataset.sy * 9, duration: 2.6, delay: 1.2 }));
  gsap.timeline({ repeat: -1, delay: 2.4, repeatDelay: 2.4 })
    .to(q('.cl-ghost'), { opacity: .9, duration: .7 }).to(q('.cl-ghost'), { opacity: 0, duration: .9 }, '+=1.3');
  return t;
}

/* ======================================================================================================
   simplicity — one complicated silhouette, read at once as its simplest parts: a square, a triangle, a circle.
   ====================================================================================================== */
const SP = [
  { cls: 'sp-c', ink: 'yellow', d: 'M196 404a104 104 0 1 0 208 0a104 104 0 1 0 -208 0Z', dx: 2, dy: 26 },
  { cls: 'sp-s', ink: 'blue', d: 'M118 156H318V356H118Z', dx: -22, dy: -14 },
  { cls: 'sp-t', ink: 'pink', d: 'M252 118L498 280L252 442Z', dx: 26, dy: -10 }
];
function simplicityDraw(k) {
  const { INK } = k;
  return `${SP.map(s => `<path class="sp-p ${s.cls}" d="${s.d}" fill="${INK.navy}"/>`).join('')}${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function simplicityPlay(svg, k) {
  const { gsap, INK } = k; const els = SP.map(s => svg.querySelector('.' + s.cls));
  const t = k.tl();
  t.from(els, { scale: .6, opacity: 0, transformOrigin: '50% 50%', duration: .9, stagger: .1, ease: 'expo.out' }, 0);
  const apart = (tl, at) => SP.forEach((s, i) => tl.to(els[i], { x: s.dx, y: s.dy, attr: { fill: INK[s.ink] }, fillOpacity: .9, duration: 1, ease: 'power3.inOut' }, at + i * .06));
  const merge = (tl, at) => SP.forEach((s, i) => tl.to(els[i], { x: 0, y: 0, attr: { fill: INK.navy }, fillOpacity: 1, duration: 1, ease: 'power3.inOut' }, at + i * .06));
  if (k.reduced()) { apart(t, .2); t.progress(1); return t; }
  // the mind does not see a strange shape; it sees three simple ones. The print shows them, then folds them back
  const cyc = gsap.timeline({ repeat: -1, delay: 1.6 });
  apart(cyc, 0); merge(cyc, 3.6); cyc.to({}, { duration: .1 }, 6.6);
  return t;
}

/* ======================================================================================================
   commonFate — a still grid; then some dots move down the page together, and they become a group of their own.
   ====================================================================================================== */
const CF = { cols: 7, rows: 5, dx: 66, dy: 62, drop: 46 };
const cfX = c => 300 + (c - 3) * CF.dx, cfY = r => 262 + (r - 2) * CF.dy;
const cfMoves = (c, r) => (c + r) % 3 === 0;
function commonFateDraw(k) {
  const { INK } = k; let trails = '', dots = '';
  for (let r = 0; r < CF.rows; r++) for (let c = 0; c < CF.cols; c++) {
    const m = cfMoves(c, r), x = cfX(c), y = cfY(r);
    if (m) trails += `<line class="cf-t" x1="${x}" y1="${y}" x2="${x}" y2="${y}" stroke="${INK.pink}" stroke-width="10" stroke-linecap="round"/>`;
    dots += `<circle class="cf-d${m ? ' cf-m' : ''}" cx="${x}" cy="${y}" r="13" fill="${INK.navy}"/>`;
  }
  return `<g class="cf-trails" opacity=".85">${trails}</g>${dots}${k.regmark(52, 52)}${k.regmark(548, 52)}`;
}
function commonFatePlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s);
  const movers = [...all('.cf-m')], trails = [...all('.cf-t')];
  const t = k.tl();
  t.from(all('.cf-d'), { scale: 0, transformOrigin: '50% 50%', duration: .45, ease: 'back.out(2)', stagger: { each: .015, grid: [CF.rows, CF.cols], from: 'start' } }, 0);
  const down = (tl, at, dur = 1.5) => tl.to(movers, { y: CF.drop, duration: dur, ease: 'power2.inOut' }, at)
    .to(trails, { attr: { y2: (i, el) => +el.getAttribute('y1') + CF.drop }, duration: dur, ease: 'power2.inOut' }, at);
  if (k.reduced()) { down(t, .6, .01); return t; }
  // the same dots, the same colour — moving together is enough to make them a group
  const cyc = gsap.timeline({ repeat: -1, delay: 1.2 });
  down(cyc, 0);
  cyc.to(movers, { y: 0, duration: 1.5, ease: 'power2.inOut' }, 3.4)
    .to(trails, { attr: { y2: (i, el) => +el.getAttribute('y1') }, duration: 1.5, ease: 'power2.inOut' }, 3.4)
    .to({}, { duration: 1.4 }, 4.9);
  return t;
}

/* ======================================================================================================
   connection — circles and squares (similarity would pair circles with circles); a drawn line makes a circle and a
   square into one unit.
   ====================================================================================================== */
const CN = { y1: 226, y2: 374, dx: 64 };
const cnX = i => 300 + (i - 3.5) * CN.dx;
function connectionDraw(k) {
  const { INK } = k;
  const el = (i, y, circle) => circle ? `<circle cx="${f1(cnX(i))}" cy="${y}" r="21" fill="${INK.navy}"/>` : `<rect x="${f1(cnX(i) - 19)}" y="${y - 19}" width="38" height="38" fill="${INK.navy}"/>`;
  const link = (i, j, y) => `<line class="cn-l" x1="${f1(cnX(i))}" y1="${y}" x2="${f1(cnX(j))}" y2="${y}" stroke="${INK.pink}" stroke-width="10" stroke-linecap="round"/>`;
  const links = [[0, 1], [2, 3], [4, 5], [6, 7]].map(([i, j]) => link(i, j, CN.y1)).join('') + [[1, 2], [3, 4], [5, 6]].map(([i, j]) => link(i, j, CN.y2)).join('');
  const row1 = Array.from({ length: 8 }, (_, i) => el(i, CN.y1, i % 2 === 0)).join('');
  const row2 = Array.from({ length: 8 }, (_, i) => el(i, CN.y2, i % 2 === 1)).join('');
  return `<g class="cn-links">${links}</g><g class="cn-els">${row1}${row2}</g>
  <g class="cn-mis" transform="translate(6 -5)" opacity=".8"><line x1="${f1(cnX(0) - 20)}" y1="${CN.y1 + 74}" x2="${f1(cnX(7) + 20)}" y2="${CN.y1 + 74}" stroke="${INK.blue}" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/></g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function connectionPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s);
  const links = [...all('.cn-l')]; const x2 = links.map(l => l.getAttribute('x2')), x1 = links.map(l => l.getAttribute('x1'));
  const t = k.tl();
  t.from(all('.cn-els > *'), { scale: 0, transformOrigin: '50% 50%', duration: .45, ease: 'back.out(2)', stagger: .03 }, 0)
    .from(all('.cn-mis'), { opacity: 0, duration: .5 }, .4);
  if (k.reduced()) return t;
  t.fromTo(links, { attr: { x2: i => x1[i] } }, { attr: { x2: i => x2[i] }, duration: .6, stagger: .08, ease: 'power3.inOut' }, .7);
  // unlink, and similarity takes over (circles with circles); link again, and the pairs are units
  gsap.timeline({ repeat: -1, delay: 3.6, repeatDelay: 1.4 })
    .to(links, { attr: { x2: i => x1[i] }, duration: .5, stagger: .05, ease: 'power3.in' })
    .to(links, { attr: { x2: i => x2[i] }, duration: .6, stagger: .08, ease: 'power3.inOut' }, '+=1.6');
  return t;
}

/* ======================================================================================================
   symmetry — [ ] { } [ ]: mirrored pairs close into three figures. Swap partners ([ } { ] ] [) and they are loose
   marks again. The figures the mind closes are shown when the pairs are symmetrical.
   ====================================================================================================== */
const SYM = { y0: 220, y1: 380, slots: [102, 178, 262, 338, 422, 498] };
const BR = { sq: 'M24 0H0V160H24', cu: 'M24 0C6 0 6 12 6 30V58C6 72 0 80 -12 80C0 80 6 88 6 102V130C6 148 6 160 24 160' };
// glyph: [shape, mirrored?, from slot, to slot]
const GLY = [['sq', false, 0, 0], ['sq', true, 1, 3], ['cu', false, 2, 2], ['cu', true, 3, 1], ['sq', false, 4, 5], ['sq', true, 5, 4]];
function symmetryDraw(k) {
  const { INK, ht } = k;
  const g = GLY.map(([s, m, from], i) => `<g class="sy-g" data-i="${i}" transform="translate(${SYM.slots[from]} ${SYM.y0})"><path d="${BR[s]}" transform="${m ? 'scale(-1 1)' : ''}" fill="none" stroke="${INK.navy}" stroke-width="15" stroke-linecap="square" stroke-linejoin="miter"/></g>`).join('');
  const fills = [[0, 1], [2, 3], [4, 5]].map(([a, b]) => `<rect x="${SYM.slots[a] + 16}" y="${SYM.y0 + 14}" width="${SYM.slots[b] - SYM.slots[a] - 32}" height="${SYM.y1 - SYM.y0 - 28}" fill="${ht('yellow', 'l')}"/>`).join('');
  return `<g class="sy-ghost" opacity="0">${fills}</g>
  <g class="sy-mis" transform="translate(6 -5)" opacity=".8"><line x1="70" y1="${SYM.y1 + 42}" x2="530" y2="${SYM.y1 + 42}" stroke="${INK.pink}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/></g>
  ${g}<line x1="300" y1="${SYM.y0 - 40}" x2="300" y2="${SYM.y1 + 40}" stroke="${INK.blue}" stroke-width="2" stroke-dasharray="4 7" class="sy-axis"/>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function symmetryPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const gs = [...all('.sy-g')];
  const t = k.tl();
  t.from(gs, { opacity: 0, y: SYM.y0 - 30, duration: .8, stagger: .08, ease: 'expo.out' }, 0)
    .from(q('.sy-axis'), { opacity: 0, duration: .6 }, .4).from(q('.sy-mis'), { opacity: 0, duration: .6 }, .5);
  if (k.reduced()) { t.to(q('.sy-ghost'), { opacity: .9, duration: .01 }, .9); return t; }
  const go = (tl, key, at) => GLY.forEach(([, , from, to], i) => {
    const target = SYM.slots[key === 'to' ? to : from]; if (from === to) return;
    tl.to(gs[i], { x: target, duration: 1.1, ease: 'power3.inOut' }, at)
      .to(gs[i], { y: SYM.y0 + (i % 2 ? -34 : 34), duration: .55, ease: 'sine.out', yoyo: true, repeat: 1 }, at);
  });
  const cyc = gsap.timeline({ repeat: -1, delay: 1.2 });
  cyc.to(q('.sy-ghost'), { opacity: .9, duration: .6 }, 0).to(q('.sy-ghost'), { opacity: 0, duration: .5 }, 2.2);
  go(cyc, 'to', 2.5); go(cyc, 'from', 5.6);
  cyc.to({}, { duration: .1 }, 6.8);
  return t;
}

/* ======================================================================================================
   figureGround — a field of navy cells with an arrow nobody printed: the figure exists only as negative space.
   ====================================================================================================== */
const FG = { n: 9, pitch: 48, cell: 41, x0: 87.5, y0: 64 };
const fgArrow = (c, r) => (r >= 3 && r <= 5 && c >= 1 && c <= 3) || (c >= 4 && c <= 7 && Math.abs(r - 4) <= 7 - c);
function figureGroundDraw(k) {
  const { INK, ht } = k; const { n, pitch, cell, x0, y0 } = FG; let cells = '', holes = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const x = x0 + c * pitch, y = y0 + r * pitch;
    if (fgArrow(c, r)) holes += `M${x - 3.5} ${y - 3.5}h${pitch}v${pitch}h${-pitch}Z`;
    else cells += `<rect class="fg-c" data-d="${c + r}" x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${INK.navy}"/>`;
  }
  const G = (gx, gy) => [x0 + gx * pitch - 3.5, y0 + gy * pitch - 3.5];
  const arrow = [[1, 3], [4, 3], [4, 1], [8, 4.5], [4, 8], [4, 6], [1, 6]].map(([a, b]) => pt(G(a, b))).join('L');
  const W = n * pitch;
  return `
  <path class="fg-mis" transform="translate(6 5)" d="M${x0 - 3.5} ${y0 - 3.5}h${W}v${W}h${-W}Z${holes}" fill-rule="evenodd" fill="${ht('blue', 'm')}"/>
  <g class="fg-ghost" opacity="0"><path d="M${arrow}Z" fill="${ht('yellow', 'l')}"/><path d="M${arrow}Z" fill="none" ${ghostStyle(k)}/></g>
  <g class="fg-cells">${cells}</g>
  <g class="fg-note" opacity="0">${k.text(300, y0 + W + 38, 'negative space', { size: 24, family: 'dot', weight: 700, fill: INK.ink2 })}</g>`;
}
function figureGroundPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const cells = [...all('.fg-c')];
  const t = k.tl();
  t.from(cells, { scale: 0, transformOrigin: '50% 50%', duration: .45, ease: 'back.out(1.8)', stagger: i => +cells[i].dataset.d * .045 }, 0)
    .from(q('.fg-mis'), { opacity: 0, x: 0, y: 0, duration: .9, ease: 'expo.out' }, .5);
  if (k.reduced()) return t;
  // the ground keeps breathing; the arrow, made of nothing, stays — and now and then we point at it
  gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: 1.6 })
    .to(cells, { scale: .78, transformOrigin: '50% 50%', duration: .6, ease: 'sine.inOut', yoyo: true, repeat: 1, stagger: i => +cells[i].dataset.d * .06 })
    .to(q('.fg-ghost'), { opacity: .9, duration: .6 }, '+=.2').to(q('.fg-note'), { opacity: 1, duration: .4 }, '<.2')
    .to(q('.fg-ghost'), { opacity: 0, duration: .8 }, '+=1.4').to(q('.fg-note'), { opacity: 0, duration: .5 }, '<');
  return t;
}

/** the site is RTL: without this, text-anchor start/end would flip inside the scene */
const ltr = draw => k => `<g direction="ltr">${draw(k)}</g>`;
export default {
  halftone: { draw: ltr(halftoneDraw), play: halftonePlay },
  emergence: { draw: ltr(emergenceDraw), play: emergencePlay },
  kanizsa: { draw: kanizsaDraw, play: kanizsaPlay },
  necker: { draw: ltr(neckerDraw), play: neckerPlay },
  vase: { draw: ltr(vaseDraw), play: vasePlay },
  invariance: { draw: ltr(invarianceDraw), play: invariancePlay },
  proximity: { draw: ltr(proximityDraw), play: proximityPlay },
  similarity: { draw: ltr(similarityDraw), play: similarityPlay },
  continuity: { draw: ltr(continuityDraw), play: continuityPlay },
  closure: { draw: ltr(closureDraw), play: closurePlay },
  simplicity: { draw: ltr(simplicityDraw), play: simplicityPlay },
  commonFate: { draw: ltr(commonFateDraw), play: commonFatePlay },
  connection: { draw: ltr(connectionDraw), play: connectionPlay },
  symmetry: { draw: ltr(symmetryDraw), play: symmetryPlay },
  figureGround: { draw: ltr(figureGroundDraw), play: figureGroundPlay }
};
