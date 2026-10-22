// Illustrated scenes — shape group: solids · circle · square · triangle · triangleDown · star · polygon · organic ·
// arrow · ellipse · combo · vlines · hlines. See STYLE.md.
// The personalities share one press sheet: each hero is printed in its lesson ink (SHAPE_CARDS colours), fills the same
// box (≈115…485) and moves the way the slide says it feels, so switching shapes in a demo reads as "same sheet, new
// character". triangle/triangleDown and vlines/hlines are flip pairs (the demos swap between them).

const P = a => a.map(p => p.join(',')).join(' ');
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
/** smooth closed blob through n jittered radial points (Catmull-Rom → cubic Bézier); seeded, so draw() stays pure */
function blob(cx, cy, r, seed = 1, { n = 7, amp = .22, sx = 1, sy = 1 } = {}) {
  const rnd = rng(seed);
  const p = Array.from({ length: n }, (_, i) => { const a = (i + rnd() * .35) / n * Math.PI * 2; const d = r * (1 + (rnd() * 2 - 1) * amp); return [cx + Math.cos(a) * d * sx, cy + Math.sin(a) * d * sy]; });
  return catmull(p, true);
}
function catmull(p, closed = false) {
  const n = p.length, f = v => v.toFixed(1), at = i => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = at(i - 1), b = at(i), c = at(i + 1), e = at(i + 2);
    d += ` C${f(b[0] + (c[0] - a[0]) / 6)},${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)},${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])},${f(c[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
const marks = k => k.regmark(52, 52) + k.regmark(548, 548);
const groundLine = (k, cls, y = 473, x1 = 84, x2 = 516) => `<line class="${cls}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${k.INK.navy}" stroke-width="6" stroke-linecap="round"/>`;
/** reduced motion: jump the entrance to its composed end and skip every loop */
const still = (t, k) => { if (!k.reduced()) return false; t.progress(1); return true; };
/** endless linear spin (only reached when motion is allowed) */
const spin = (k, el, deg, dur, origin = '300 300') => k.gsap.to(el, { rotation: deg, svgOrigin: origin, duration: dur, repeat: -1, ease: 'none' });
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];

/* ---------- solids · Kandinsky's three on one shelf: each moves in character ---------- */
function solidsDraw(k) {
  const { INK, ht } = k;
  const tri = [[117, 210], [192, 440], [42, 440]], sq = [208, 280, 160, 160], C = [456, 358, 82];
  const aura = (cx, ink, sz, cls) => `<g class="so-aura ${cls}"><circle cx="${cx}" cy="318" r="132" fill="${ht(ink, sz)}" mask="url(#fade-r)"/></g>`;
  return `
  ${aura(117, 'yellow', 'l', 'so-a1')}${aura(288, 'red', 'm', 'so-a2')}${aura(456, 'blue', 'm', 'so-a3')}
  <g class="so-tri"><g class="so-tri-in">
    <g transform="translate(-9 -7)"><polygon points="${P(tri)}" fill="${ht('navy', 's')}"/></g>
    <polygon points="${P(tri)}" fill="${INK.yellow}"/>
  </g></g>
  <g class="so-sq">
    <rect x="${sq[0] + 11}" y="${sq[1] - 11}" width="${sq[2]}" height="${sq[3]}" fill="${ht('navy', 's')}"/>
    <rect x="${sq[0]}" y="${sq[1]}" width="${sq[2]}" height="${sq[3]}" fill="${INK.red}"/>
  </g>
  <g class="so-ci"><g class="so-ci-in">
    <circle cx="${C[0] + 9}" cy="${C[1] - 8}" r="${C[2]}" fill="${ht('navy', 's')}"/>
    <circle cx="${C[0]}" cy="${C[1]}" r="${C[2]}" fill="${INK.blue}"/>
    <circle cx="${C[0]}" cy="${C[1]}" r="${C[2] - 24}" fill="none" stroke="${INK.paper}" stroke-width="3" stroke-dasharray="2 11" stroke-linecap="round" opacity=".7"/>
    <circle cx="${C[0] + 31}" cy="${C[1] - 31}" r="11" fill="${INK.paper}"/>
  </g></g>
  ${groundLine(k, 'so-ground', 443, 40, 560)}
  ${marks(k)}`;
}
function solidsPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  t.from(q('.so-ground'), { scaleX: 0, transformOrigin: '50% 50%', duration: 1, ease: 'expo.out' }, 0)
    .from(qa('.so-aura'), { opacity: 0, scale: .6, transformOrigin: '50% 50%', duration: 1.3, stagger: .12, ease: 'expo.out' }, .1);
  k.press(t, [q('.so-tri'), q('.so-sq'), q('.so-ci')], { at: .2, stagger: .14, from: 30 });
  if (still(t, k)) return t;
  // each shape moves in character: the triangle reaches up · the square never moves · the circle rolls, soft and easy
  k.loop(q('.so-tri-in'), { scaleY: 1.07, transformOrigin: '50% 100%', duration: 1.6, delay: 1.3, ease: 'power2.inOut' });
  // rolling = translate by r·θ (r 82): it just kisses the square on the left and stops short of the frame on the right
  gsap.timeline({ delay: 1.5 }).to(q('.so-ci-in'), { x: -8, rotation: -5.6, svgOrigin: '456 358', duration: 1.1, ease: 'sine.inOut' })
    .to(q('.so-ci-in'), { x: 20, rotation: 14, svgOrigin: '456 358', duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
  qa('.so-aura').forEach((a, i) => k.loop(a, { scale: 1.07, transformOrigin: '50% 50%', duration: 3.4 + i * .5, delay: 1.4 + i * .3 }));
  return t;
}

/* ---------- circle · unity, wholeness, protection: a round table of equals inside rings that guard it ---------- */
function circleDraw(k) {
  const { INK, ht } = k;
  const rings = [[188, 3, '1 10', .75], [216, 2.2, '1 14', .55], [244, 1.6, '1 19', .38]]
    .map(([r, w, da, o]) => `<g class="ci-ring"><circle cx="300" cy="300" r="${r}" fill="none" stroke="${INK.navy}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round" opacity="${o}"/></g>`).join('');
  const seats = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<circle cx="${(300 + Math.cos(a) * 100).toFixed(1)}" cy="${(300 + Math.sin(a) * 100).toFixed(1)}" r="9.5" fill="${INK.paper}"/>`; }).join('');
  return `
  <g class="ci-rings">${rings}</g>
  <g class="ci-pass"><circle cx="313" cy="312" r="152" fill="${ht('pink', 'm')}"/></g>
  <g class="ci-disc">
    <circle cx="300" cy="300" r="150" fill="${INK.blue}"/>
    <circle cx="300" cy="300" r="100" fill="none" stroke="${INK.paper}" stroke-width="2" opacity=".4"/>
    <g class="ci-seats">${seats}</g>
    <circle class="ci-core" cx="300" cy="300" r="34" fill="${INK.navy}"/>
  </g>
  <g transform="translate(-7 6)"><circle class="ci-rim" cx="300" cy="300" r="150" fill="none" stroke="${INK.pink}" stroke-width="6" opacity=".9"/></g>
  ${marks(k)}`;
}
function circlePlay(svg, k) {
  const [q, qa] = sel(svg);
  const t = k.tl();
  t.from(q('.ci-disc'), { scale: 0, transformOrigin: '50% 50%', duration: 1.1, ease: 'back.out(1.5)' }, 0)
    .from(q('.ci-pass'), { opacity: 0, x: 24, y: 20, duration: 1, ease: 'expo.out' }, .15)
    .from(q('.ci-rim'), { opacity: 0, scale: .7, transformOrigin: '50% 50%', duration: 1, ease: 'expo.out' }, .25)
    .from(qa('.ci-ring'), { opacity: 0, scale: .75, transformOrigin: '50% 50%', duration: 1.1, stagger: .1, ease: 'expo.out' }, .3)
    .from(qa('.ci-seats circle'), { scale: 0, transformOrigin: '50% 50%', duration: .5, stagger: .04, ease: 'back.out(2)' }, .5)
    .from(q('.ci-core'), { scale: 0, transformOrigin: '50% 50%', duration: .6, ease: 'back.out(2)' }, .7);
  if (still(t, k)) return t;
  spin(k, q('.ci-seats'), 360, 48);
  qa('.ci-ring').forEach((r, i) => spin(k, r, i % 2 ? -360 : 360, 80 + i * 30));
  k.loop(q('.ci-disc'), { scale: 1.025, transformOrigin: '50% 50%', duration: 3.2, delay: 1.4 });
  k.loop(q('.ci-core'), { scale: .84, transformOrigin: '50% 50%', duration: 2.4, delay: 1.4 });
  return t;
}

/* ---------- square · stability, structure, honesty: it lands, holds, and its grid keeps being measured ---------- */
const SQ = { x: 160, y: 190, s: 280 };
function squareDraw(k) {
  const { INK, ht } = k; const { x, y, s } = SQ;
  const g = (x1, y1, x2, y2) => `<line class="sq-g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK.paper}" stroke-width="3" stroke-dasharray="262" opacity=".5"/>`;
  const grid = [1, 2, 3].map(i => g(x + i * 70, y + 9, x + i * 70, y + s - 9)).join('') + [1, 2, 3].map(i => g(x + 9, y + i * 70, x + s - 9, y + i * 70)).join('');
  return `
  <g class="sq-pass"><rect x="${x + 16}" y="${y - 16}" width="${s}" height="${s}" fill="${ht('navy', 's')}"/></g>
  <g class="sq-body"><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${INK.red}"/>${grid}
    <rect class="sq-unit" x="${x + 9}" y="${y + 9}" width="52" height="52" fill="${INK.yellow}"/></g>
  ${groundLine(k, 'sq-ground', y + s + 3)}
  ${marks(k)}`;
}
function squarePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  t.from(q('.sq-ground'), { scaleX: 0, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, 0)
    .from(q('.sq-body'), { y: -110, opacity: 0, duration: .7, ease: 'power3.in' }, .05)
    .from(q('.sq-pass'), { opacity: 0, x: -18, y: 18, duration: .8, ease: 'expo.out' }, .75)
    .from(qa('.sq-g'), { strokeDashoffset: 262, duration: .7, stagger: .07, ease: 'power2.out' }, .8)
    .from(q('.sq-unit'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)' }, 1.2);
  if (still(t, k)) return t;
  // the square never moves. Its module walks the grid, one cell at a time, the same step every time (consistency)
  const steps = [[70, 0], [140, 0], [210, 0], [210, 70], [210, 140], [210, 210], [140, 210], [70, 210], [0, 210], [0, 140], [0, 70], [0, 0]];
  const walk = gsap.timeline({ repeat: -1, delay: 2.2 });
  steps.forEach(([x, y]) => walk.to(q('.sq-unit'), { x, y, duration: .7, ease: 'power3.inOut' }, '+=.9'));
  return t;
}

/* ---------- triangle ▲ / ▼ · same box, flipped: growth climbs; danger balances on its point, grounding digs in ---------- */
function triDraw(k, down) {
  const { INK, ht } = k;
  const body = down ? [[116, 160], [484, 160], [300, 470]] : [[300, 160], [484, 470], [116, 470]];
  const cy = body.reduce((a, p) => a + p[1], 0) / 3, inset = f => body.map(([x, y]) => [300 + (x - 300) * f, cy + (y - cy) * f]);
  const pass = body.map(([x, y]) => [x + (down ? 14 : -15), y + (down ? -11 : -10)]);
  // the shape repeats itself, small: climbing off the apex (growth) or sinking under the ground (grounding)
  const mini = (cy, s) => `<polygon class="tr-ch" points="${P(down ? [[300 - s * .58, cy - s / 2], [300 + s * .58, cy - s / 2], [300, cy + s / 2]] : [[300, cy - s / 2], [300 + s * .58, cy + s / 2], [300 - s * .58, cy + s / 2]])}" fill="${INK.navy}"/>`;
  const chevs = down ? [[503, 30], [537, 22]].map(([y, s]) => mini(y, s)).join('') : [[128, 38], [90, 30], [60, 22]].map(([y, s]) => mini(y, s)).join('');
  return `
  <g class="tr-rock">
    <g class="tr-pass"><polygon points="${P(pass)}" fill="${ht(down ? 'pink' : 'orange', 'l')}"/></g>
    <g class="tr-body"><g class="tr-grow">
      <polygon points="${P(body)}" fill="${down ? INK.red : INK.yellow}"/>
      <polygon points="${P(inset(.56))}" fill="none" stroke="${down ? INK.paper : INK.orange}" stroke-width="3.5" stroke-linejoin="round" opacity="${down ? .6 : .9}"/>
      <polygon points="${P(inset(.2))}" fill="${INK.navy}"/>
    </g></g>
  </g>
  <g class="tr-chevs">${chevs}</g>
  ${groundLine(k, 'tr-ground')}
  ${marks(k)}`;
}
function triPlay(svg, k, down) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  t.from(q('.tr-ground'), { scaleX: 0, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, 0)
    .from(q('.tr-body'), { scale: 0, transformOrigin: '50% 100%', duration: 1, ease: 'back.out(1.4)' }, .1)
    .from(q('.tr-pass'), { opacity: 0, x: down ? 22 : -22, y: -18, duration: 1, ease: 'expo.out' }, .3)
    .from(qa('.tr-ch'), { opacity: 0, y: down ? -14 : 14, duration: .6, stagger: .1, ease: 'power2.out' }, .6);
  if (still(t, k)) return t;
  const chs = qa('.tr-ch'), d = down ? 1 : -1;
  // a slow conveyor of chevrons: up for growth, down into the ground for grounding
  chs.forEach((c, i) => gsap.timeline({ repeat: -1, delay: 1.6 + i * .7 })
    .to(c, { y: d * 18, opacity: 0, duration: 1.1, ease: 'sine.in' })
    .set(c, { y: -d * 18 })
    .to(c, { y: 0, opacity: 1, duration: 1, ease: 'sine.out' }));
  if (down) { // balancing on its point = danger: a slow, uneasy rock
    gsap.timeline({ delay: 1.2 }).to(q('.tr-rock'), { rotation: 2.6, svgOrigin: '300 470', duration: 1.4, ease: 'sine.out' })
      .to(q('.tr-rock'), { rotation: -2.6, svgOrigin: '300 470', duration: 2.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
  } else k.loop(q('.tr-grow'), { scaleY: 1.045, transformOrigin: '50% 100%', duration: 2.2, delay: 1.2 });
  return t;
}

/* ---------- star · achievement: one star, used sparingly, turning inside an award seal ---------- */
function starDraw(k) {
  const { INK, ht } = k;
  return `
  <g class="st-seal">
    <circle cx="300" cy="312" r="236" fill="none" stroke="${INK.navy}" stroke-width="12" stroke-dasharray="1.6 8.697" opacity=".5"/>
    <circle cx="300" cy="312" r="221" fill="none" stroke="${INK.navy}" stroke-width="1.5" opacity=".45"/>
  </g>
  <g class="st-pass"><polygon points="${P(k.star(300, 312, 214, 88, 5, -54))}" fill="${ht('pink', 'l')}"/></g>
  <g class="st-body">
    <polygon points="${P(k.star(300, 312, 196, 80))}" fill="${INK.yellow}"/>
    <polygon points="${P(k.star(300, 312, 122, 50))}" fill="none" stroke="${INK.orange}" stroke-width="3" stroke-linejoin="round" opacity=".9"/>
  </g>
  ${marks(k)}`;
}
function starPlay(svg, k) {
  const { gsap } = k; const [q] = sel(svg);
  const t = k.tl();
  t.from(q('.st-body'), { scale: 0, rotation: -72, svgOrigin: '300 312', duration: 1.2, ease: 'back.out(1.3)' }, 0)
    .from(q('.st-pass'), { opacity: 0, rotation: 30, svgOrigin: '300 312', duration: 1.2, ease: 'expo.out' }, .15)
    .from(q('.st-seal'), { opacity: 0, scale: .85, svgOrigin: '300 312', duration: 1.2, ease: 'expo.out' }, .25);
  if (still(t, k)) return t;
  // a deliberate quarter-turn every few seconds (72° — it lands looking exactly the same), the seal drifts the other way
  gsap.timeline({ repeat: -1, delay: 2 }).to(q('.st-body'), { rotation: '+=72', svgOrigin: '300 312', duration: 1.4, ease: 'expo.inOut' }).to({}, { duration: 2.6 });
  spin(k, q('.st-seal'), -360, 120, '300 312');
  k.loop(q('.st-pass'), { rotation: 9, svgOrigin: '300 312', duration: 4.5, delay: 1.2 });
  return t;
}

/* ---------- polygon · the meaning depends on the number of sides: the print keeps changing its count ---------- */
const PG_N = [6, 8, 3, 4, 5]; // first = the composed state (hexagon, as in the immersive scene)
function polygonDraw(k) {
  const { INK, ht } = k;
  const R = 168;
  const groups = PG_N.map((n, i) => {
    const cy = 286 + (n % 2 ? R * (1 - Math.cos(Math.PI / n)) / 2 : 0);
    const v = k.ngon(300, cy, R, n, -90);
    return `<g class="pg-n" opacity="${i ? 0 : 1}">
      <g transform="translate(13 11)"><polygon points="${P(v)}" fill="${ht('teal', 'm')}"/></g>
      <polygon points="${P(v)}" fill="${INK.violet}"/>
      ${v.map(([x, y]) => `<line x1="300" y1="${cy.toFixed(1)}" x2="${x}" y2="${y}" stroke="${INK.paper}" stroke-width="2" opacity=".35"/>`).join('')}
      <circle cx="300" cy="${cy.toFixed(1)}" r="9" fill="${INK.paper}" opacity=".9"/>
      ${v.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${INK.navy}"/>`).join('')}
    </g>`;
  }).join('');
  const nums = PG_N.map((n, i) => `<g class="pg-num" opacity="${i ? 0 : 1}">${k.text(300, 548, String(n), { size: 46, family: 'dot', weight: 800, fill: INK.navy })}</g>`).join('');
  return `${groups}${nums}${marks(k)}`;
}
function polygonPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const gs = qa('.pg-n'), ns = qa('.pg-num');
  const t = k.tl();
  t.from(gs[0], { scale: 0, rotation: -60, transformOrigin: '50% 50%', duration: 1.2, ease: 'back.out(1.4)' }, 0)
    .from(gs[0].querySelectorAll('circle'), { scale: 0, transformOrigin: '50% 50%', duration: .45, stagger: .05, ease: 'back.out(2.5)' }, .55)
    .from(ns[0], { opacity: 0, y: 12, duration: .6 }, .8);
  if (still(t, k)) return t;
  const cyc = gsap.timeline({ repeat: -1, delay: 2.4 });
  gs.forEach((g, i) => {
    const j = (i + 1) % gs.length;
    cyc.to(g, { opacity: 0, rotation: 40, scale: .8, transformOrigin: '50% 50%', duration: .55, ease: 'power2.in' })
      .to(ns[i], { opacity: 0, y: -10, duration: .35 }, '<')
      .fromTo(gs[j], { opacity: 0, rotation: -40, scale: .8, transformOrigin: '50% 50%' }, { opacity: 1, rotation: 0, scale: 1, duration: .9, ease: 'expo.out' }, '-=.12')
      .fromTo(ns[j], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5 }, '<.15')
      .to({}, { duration: 2.2 });
  });
  return t;
}

/* ---------- organic · nature and spontaneity: soft forms breathing over a rigid grid they soften ---------- */
function organicDraw(k) {
  const { INK, ht } = k;
  let grid = '';
  for (let i = 0; i <= 6; i++) grid += `<line x1="${120 + i * 60}" y1="110" x2="${120 + i * 60}" y2="490" stroke="${INK.navy}" stroke-width="1.4" opacity=".22"/><line x1="110" y1="${120 + i * 60}" x2="490" y2="${120 + i * 60}" stroke="${INK.navy}" stroke-width="1.4" opacity=".22"/>`;
  for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) grid += `<circle cx="${120 + i * 60}" cy="${120 + j * 60}" r="3.4" fill="${INK.navy}" opacity=".6"/>`;
  return `
  <g class="og-grid">${grid}</g>
  <g class="og-b3"><path d="${blob(322, 322, 172, 13, { n: 7, amp: .16 })}" fill="${ht('teal', 'm')}"/></g>
  <g class="og-b1"><path d="${blob(292, 304, 164, 5, { n: 8, amp: .27 })}" fill="${INK.green}"/></g>
  <g class="og-b2"><path d="${blob(410, 196, 70, 9, { n: 6, amp: .24 })}" fill="${INK.yellow}"/></g>
  <path class="og-gesture" d="${catmull([[96, 404], [150, 478], [262, 508], [384, 478], [470, 396], [500, 290]])}" fill="none" stroke="${INK.navy}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  ${marks(k)}`;
}
function organicPlay(svg, k) {
  const { gsap } = k; const [q] = sel(svg);
  const ges = q('.og-gesture'); const L = ges.getTotalLength ? ges.getTotalLength() : 600;
  gsap.set(ges, { strokeDasharray: L });
  const t = k.tl();
  t.from(q('.og-grid'), { opacity: 0, duration: .8, ease: 'power2.out' }, 0);
  k.press(t, [q('.og-b3'), q('.og-b1'), q('.og-b2')], { at: .1, stagger: .14, from: 26 });
  t.from(q('.og-b1'), { scale: .6, transformOrigin: '50% 50%', duration: 1.2, ease: 'expo.out' }, .2)
    .from(ges, { strokeDashoffset: L, duration: 1.2, ease: 'power2.inOut' }, .5);
  if (still(t, k)) return t;
  // soft, out-of-phase breathing: rotation + uneven scale reads as a living form (no path morphing)
  k.loop(q('.og-b1'), { rotation: 7, scaleX: 1.05, scaleY: .95, transformOrigin: '50% 50%', duration: 4.2, delay: 1.4 });
  k.loop(q('.og-b3'), { rotation: -9, scaleX: .96, scaleY: 1.04, transformOrigin: '50% 50%', duration: 5.4, delay: 1.4 });
  k.loop(q('.og-b2'), { x: -16, y: 12, rotation: 24, transformOrigin: '50% 50%', duration: 3.6, delay: 1.4 });
  gsap.timeline({ repeat: -1, repeatDelay: 4.5, delay: 6 })
    .to(ges, { strokeDashoffset: -L, duration: 1.1, ease: 'power2.in' })
    .set(ges, { strokeDashoffset: L })
    .to(ges, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' });
  return t;
}

/* ---------- arrow · lines and arrows: leading lines funnel the eye into one bold direction ---------- */
const ARW = [[150, 274], [372, 274], [372, 212], [522, 300], [372, 388], [372, 326], [150, 326]];
function arrowDraw(k) {
  const { INK, ht } = k;
  const lines = [104, 166, 434, 496].map(y0 => { const x2 = 352, y2 = y0 + (300 - y0) * (x2 - 64) / (522 - 64); return `<path class="ar-l" d="M64,${y0} L${x2},${y2.toFixed(1)}" fill="none" stroke="${INK.navy}" stroke-width="5" stroke-dasharray="22 12" stroke-linecap="round"/>`; }).join('');
  return `
  <g class="ar-lines">${lines}</g>
  <g class="ar-move">
    <g class="ar-pass"><polygon points="${P(ARW.map(([x, y]) => [x + 10, y + 10]))}" fill="${ht('teal', 'l')}"/></g>
    <g class="ar-body"><polygon points="${P(ARW)}" fill="${INK.red}"/></g>
  </g>
  <g class="ar-node"><circle cx="146" cy="300" r="40" fill="${INK.navy}"/><circle cx="146" cy="300" r="15" fill="${INK.paper}"/></g>
  ${marks(k)}`;
}
function arrowPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  t.from(q('.ar-node'), { scale: 0, transformOrigin: '50% 50%', duration: .7, ease: 'back.out(2)' }, 0)
    .from(q('.ar-body'), { scaleX: 0, transformOrigin: '0% 50%', duration: .9, ease: 'expo.out' }, .15)
    .from(q('.ar-pass'), { opacity: 0, x: -30, duration: .9, ease: 'expo.out' }, .35)
    .from(qa('.ar-l'), { opacity: 0, x: -40, duration: .8, stagger: .08, ease: 'expo.out' }, .3);
  if (still(t, k)) return t;
  gsap.to(qa('.ar-l'), { strokeDashoffset: -68, duration: 1.7, repeat: -1, ease: 'none' });
  k.loop(q('.ar-move'), { x: 14, duration: 1.5, delay: 1.2, ease: 'sine.inOut' });
  return t;
}

/* ---------- ellipse · continuity, elegance, motion: a graceful body with a path that never ends ---------- */
// the orbit is printed in two halves: the far half under the body, the near half over it, so the path wraps the form
const EO = { rx: 262, ry: 80, tilt: -18 };
function ellipseDraw(k) {
  const { INK, ht } = k; const { rx, ry, tilt } = EO;
  const half = (far, cls) => `<path class="${cls}" d="M${far ? 300 - rx : 300 + rx},300 A${rx},${ry} 0 0 1 ${far ? 300 + rx : 300 - rx},300" fill="none" stroke="${INK.navy}" stroke-width="3.2" stroke-linecap="round"/>`;
  const dot = cls => `<circle class="${cls}" cx="${300 + rx}" cy="300" r="14" fill="${INK.navy}"/>`;
  return `
  <g transform="rotate(${tilt} 300 300)">${half(true, 'el-o el-far')}${dot('el-dot el-dot-far')}</g>
  <g class="el-pass"><ellipse cx="315" cy="314" rx="210" ry="130" fill="${ht('violet', 'm')}"/></g>
  <g class="el-body">
    <ellipse cx="300" cy="300" rx="210" ry="130" fill="${INK.pink}"/>
    <ellipse cx="300" cy="300" rx="148" ry="82" fill="none" stroke="${INK.paper}" stroke-width="3" opacity=".55"/>
    <ellipse cx="300" cy="300" rx="84" ry="40" fill="none" stroke="${INK.paper}" stroke-width="2" opacity=".4"/>
  </g>
  <g transform="rotate(${tilt} 300 300)">${half(false, 'el-o el-near')}${dot('el-dot el-dot-near')}</g>
  ${marks(k)}`;
}
function ellipsePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const far = q('.el-dot-far'), near = q('.el-dot-near'), halves = qa('.el-o');
  const L = halves[0].getTotalLength ? halves[0].getTotalLength() : 600;
  gsap.set(halves, { strokeDasharray: L + 1 });
  // the dot rides the orbit: drawn under the body on the far half (sin < 0), over it on the near half
  const put = a => { const x = (300 + EO.rx * Math.cos(a)).toFixed(1), y = (300 + EO.ry * Math.sin(a)).toFixed(1), back = Math.sin(a) < 0; [far, near].forEach(d => { d.setAttribute('cx', x); d.setAttribute('cy', y); }); far.style.opacity = back ? 1 : 0; near.style.opacity = back ? 0 : 1; };
  put(0);
  const t = k.tl();
  t.from(q('.el-body'), { scaleX: 0, transformOrigin: '50% 50%', duration: 1.1, ease: 'expo.out' }, 0)
    .from(q('.el-pass'), { opacity: 0, x: 26, y: 18, duration: 1, ease: 'expo.out' }, .2)
    .from(halves, { strokeDashoffset: L + 1, duration: 1, ease: 'power2.inOut', stagger: .45 }, .3)
    .from(near, { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)' }, 1.3);
  if (still(t, k)) return t;
  const p = { a: 0 };
  gsap.to(p, { a: Math.PI * 2, duration: 8, repeat: -1, ease: 'none', delay: 1.6, onUpdate: () => put(p.a) });
  k.loop(q('.el-body'), { scaleX: 1.035, scaleY: .965, transformOrigin: '50% 50%', duration: 3, delay: 1.2 });
  return t;
}

/* ---------- combo · geometric combinations: three shapes overprint into one mark (new inks where they meet) ---------- */
const CB = { c: [244, 252, 126], s: [298, 244, 186], t: [[300, 262], [436, 474], [164, 474]] };
const CB_OFF = { c: [-34, -26], s: [36, -16], t: [0, 36] };
function comboDraw(k) {
  const { INK } = k;
  const c = cls => `<circle class="cb-c ${cls || ''}" cx="${CB.c[0]}" cy="${CB.c[1]}" r="${CB.c[2]}"`;
  const s = cls => `<rect class="cb-s ${cls || ''}" x="${CB.s[0]}" y="${CB.s[1]}" width="${CB.s[2]}" height="${CB.s[2]}"`;
  const tr = cls => `<polygon class="cb-t ${cls || ''}" points="${P(CB.t)}"`;
  return `
  <defs>
    <clipPath id="combo-kc">${c()}/></clipPath>
    <clipPath id="combo-ks">${s()}/></clipPath>
  </defs>
  <g class="cb-all">
    ${c()} fill="${INK.blue}"/>
    ${s()} fill="${INK.red}"/>
    ${tr()} fill="${INK.yellow}"/>
    <g clip-path="url(#combo-kc)">${s()} fill="${INK.navy}"/></g>
    <g clip-path="url(#combo-kc)">${tr()} fill="${INK.green}"/></g>
    <g clip-path="url(#combo-ks)">${tr()} fill="${INK.orange}"/></g>
    <g clip-path="url(#combo-kc)"><g clip-path="url(#combo-ks)">${tr()} fill="${INK.navy}"/></g></g>
  </g>
  ${marks(k)}`;
}
function comboPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const els = { c: qa('.cb-c'), s: qa('.cb-s'), t: qa('.cb-t') };
  const p = { s: 0 };
  const apply = () => { for (const key in els) { const [dx, dy] = CB_OFF[key]; const tr = `translate(${(dx * p.s).toFixed(2)} ${(dy * p.s).toFixed(2)})`; els[key].forEach(e => e.setAttribute('transform', tr)); } };
  const t = k.tl();
  // the three arrive from three sides and lock together; new inks appear only where they overlap
  t.fromTo(p, { s: 7 }, { s: 0, duration: 1.5, ease: 'expo.out', onUpdate: apply }, 0)
    .from(q('.cb-all'), { opacity: 0, duration: .4, ease: 'power1.out' }, 0);
  apply();
  if (still(t, k)) { p.s = 0; apply(); return t; }
  gsap.timeline({ repeat: -1, yoyo: true, delay: 2.2, repeatDelay: .9 }).to(p, { s: 1, duration: 2.4, ease: 'sine.inOut', onUpdate: apply });
  return t;
}

/* ---------- vertical lines · masculinity, endurance, aggression: a rank of rigid strokes, standing to attention ---------- */
// the twin of hlines turned 90°: same count and rhythm, but hard cut ends, a tighter rank, and red among the navy
const VL = { n: 9, step: 33, len: 352, w: 17, cy: 300, dy: [0, -16, 10, -24, 6, -12, 18, -6, 12], red: [2, 4, 6] };
function vlStroke(i, fill, dx = 0, dy = 0) {
  const x = 300 + (i - (VL.n - 1) / 2) * VL.step - VL.w / 2 + dx, top = VL.cy - VL.len / 2 + VL.dy[i] + dy, bot = top + VL.len;
  return VL.red.includes(i) ? `<polygon points="${P([[x, bot], [x, top + VL.w], [x + VL.w, top], [x + VL.w, bot]])}" fill="${fill}"/>` : `<rect x="${x}" y="${top}" width="${VL.w}" height="${VL.len}" fill="${fill}"/>`;
}
function vlinesDraw(k) {
  const { INK, ht } = k;
  const all = (fill, cls, dx, dy) => Array.from({ length: VL.n }, (_, i) => `<g class="${cls}">${vlStroke(i, typeof fill === 'function' ? fill(i) : fill, dx, dy)}</g>`).join('');
  return `
  <g class="vl-pass">${all(ht('red', 'm'), 'vl-p', 10, -10)}</g>
  <g class="vl-bars">${all(i => VL.red.includes(i) ? INK.red : INK.navy, 'vl-b', 0, 0)}</g>
  ${marks(k)}`;
}
function vlinesPlay(svg, k) {
  const [, qa] = sel(svg);
  const t = k.tl();
  t.from(qa('.vl-b'), { scaleY: 0, transformOrigin: '50% 100%', duration: 1, stagger: .06, ease: 'expo.out' }, 0)
    .from(qa('.vl-p'), { scaleY: 0, transformOrigin: '50% 100%', duration: 1, stagger: .06, ease: 'expo.out' }, .15);
  if (still(t, k)) return t;
  // straining upward, out of step: endurance under tension, never quite at rest
  qa('.vl-b').forEach((b, i) => k.loop([b, qa('.vl-p')[i]], { y: -(10 + (i % 3) * 5), scaleY: 1.03, transformOrigin: '50% 100%', duration: 1.5 + (i % 3) * .3, delay: 1.1 + i * .11, ease: 'power2.inOut' }));
  return t;
}

/* ---------- horizontal lines · community, tranquility, calm: lines lying together, drifting like water ---------- */
const HL = { len: [300, 404, 356, 452, 380, 428, 330], y0: 184, step: 39, th: 15 };
function hlinesDraw(k) {
  const { INK, ht } = k;
  const ink = i => i === 3 ? INK.navy : i % 2 ? INK.blue : INK.teal;
  const row = (i, fill, dx = 0, dy = 0) => { const L = HL.len[i], y = HL.y0 + i * HL.step; return `<line x1="${300 - L / 2 + dx}" y1="${y + dy}" x2="${300 + L / 2 + dx}" y2="${y + dy}" stroke="${fill}" stroke-width="${HL.th}" stroke-linecap="round"/>`; };
  return `
  <g class="hl-pass">${HL.len.map((_, i) => `<g class="hl-p">${row(i, ht('blue', 'm'), -9, 9)}</g>`).join('')}</g>
  <g class="hl-rows">${HL.len.map((_, i) => `<g class="hl-r">${row(i, ink(i))}</g>`).join('')}</g>
  ${marks(k)}`;
}
function hlinesPlay(svg, k) {
  const [, qa] = sel(svg);
  const t = k.tl();
  t.from(qa('.hl-r'), { scaleX: 0, transformOrigin: '50% 50%', duration: 1.1, stagger: .08, ease: 'expo.out' }, 0)
    .from(qa('.hl-p'), { scaleX: 0, opacity: 0, transformOrigin: '50% 50%', duration: 1.1, stagger: .08, ease: 'expo.out' }, .2);
  if (still(t, k)) return t;
  qa('.hl-r').forEach((r, i) => k.loop([r, qa('.hl-p')[i]], { x: (i % 2 ? -1 : 1) * (10 + (i % 3) * 4), duration: 4.2 + (i % 3) * .6, delay: 1.2 + i * .25 }));
  return t;
}

export default {
  solids: { draw: solidsDraw, play: solidsPlay },
  circle: { draw: circleDraw, play: circlePlay },
  square: { draw: squareDraw, play: squarePlay },
  triangle: { draw: k => triDraw(k, false), play: (svg, k) => triPlay(svg, k, false) },
  triangleDown: { draw: k => triDraw(k, true), play: (svg, k) => triPlay(svg, k, true) },
  star: { draw: starDraw, play: starPlay },
  polygon: { draw: polygonDraw, play: polygonPlay },
  organic: { draw: organicDraw, play: organicPlay },
  arrow: { draw: arrowDraw, play: arrowPlay },
  ellipse: { draw: ellipseDraw, play: ellipsePlay },
  combo: { draw: comboDraw, play: comboPlay },
  vlines: { draw: vlinesDraw, play: vlinesPlay },
  hlines: { draw: hlinesDraw, play: hlinesPlay }
};
