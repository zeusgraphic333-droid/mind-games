// Illustrated scenes — mind group: eye · eyeBare · scan · minds · levers. See STYLE.md.
// `eye` is the reference scene for the whole set: layered inks, halftone, a hair of misregistration, one idea, calm loop.
const ALMOND = 'M70,300 Q300,92 530,300 Q300,508 70,300 Z';

function eyeDraw(k, { bare = false } = {}) {
  const { INK, mul, ht } = k;
  return `
  <g class="e-halo" ${mul}><circle cx="300" cy="300" r="262" fill="${ht('pink', 'l')}" mask="url(#fade-r)"/></g>
  <g class="e-sun" ${mul}><circle cx="388" cy="214" r="84" fill="${INK.yellow}"/></g>
  <g class="e-eye">
    <clipPath id="e-clip"><path d="${ALMOND}"/></clipPath>
    <path class="e-white" d="${ALMOND}" fill="${INK.paper}"/>
    <g clip-path="url(#e-clip)">
      <g class="e-iris">
        <circle cx="300" cy="300" r="104" fill="${INK.blue}"/>
        <circle cx="300" cy="300" r="104" fill="${ht('navy', 's')}" mask="url(#fade-r)" opacity=".9"/>
        <g ${mul} transform="translate(7 -5)" opacity=".9"><circle cx="300" cy="300" r="104" fill="none" stroke="${INK.pink}" stroke-width="10"/></g>
        ${Array.from({ length: 24 }, (_, i) => { const a = i * 15 * Math.PI / 180; return `<line x1="${(300 + Math.cos(a) * 52).toFixed(1)}" y1="${(300 + Math.sin(a) * 52).toFixed(1)}" x2="${(300 + Math.cos(a) * 96).toFixed(1)}" y2="${(300 + Math.sin(a) * 96).toFixed(1)}" stroke="${INK.paper}" stroke-width="2.2" opacity=".35"/>`; }).join('')}
        <circle class="e-pupil" cx="300" cy="300" r="44" fill="${INK.navy}"/>
        <circle cx="330" cy="268" r="15" fill="${INK.paper}"/>
        <circle cx="276" cy="322" r="6" fill="${INK.paper}" opacity=".7"/>
      </g>
    </g>
    <path d="${ALMOND}" fill="none" stroke="${INK.navy}" stroke-width="9" stroke-linejoin="round"/>
    <g ${mul} transform="translate(4 3)" opacity=".55"><path d="${ALMOND}" fill="none" stroke="${INK.blue}" stroke-width="4"/></g>
  </g>
  ${bare ? '' : `${k.regmark(52, 52)}${k.regmark(548, 548)}`}`;
}
function eyePlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s);
  const t = k.tl();
  k.press(t, [q('.e-halo'), q('.e-sun'), q('.e-eye')], { from: 26 });
  t.from(q('.e-iris'), { scale: .4, svgOrigin: '300 300', duration: 1.2, ease: 'expo.out' }, .25);
  if (k.reduced()) return t;
  // look around, then blink — a calm, unhurried loop
  gsap.timeline({ repeat: -1, delay: 1.4 })
    .to(q('.e-iris'), { x: -46, y: 6, duration: 1.1, ease: 'power3.inOut' })
    .to(q('.e-iris'), { x: 38, y: -10, duration: 1.3, ease: 'power3.inOut' }, '+=.8')
    .to(q('.e-iris'), { x: 0, y: 0, duration: 1, ease: 'power3.inOut' }, '+=.7')
    .to(q('.e-eye'), { scaleY: .05, svgOrigin: '300 300', duration: .09, ease: 'power1.in' }, '+=.5')
    .to(q('.e-eye'), { scaleY: 1, duration: .16, ease: 'power2.out' });
  k.loop(q('.e-pupil'), { attr: { r: 36 }, duration: 2.6 });
  k.loop(q('.e-halo'), { rotate: 8, svgOrigin: '300 300', duration: 7 });
  return t;
}

const P = a => a.map(p => p.join(',')).join(' ');
const still = (t, k) => { if (!k.reduced()) return false; t.progress(1); return true; };
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
/** a printed page: hairline edge + crop marks outside its corners */
function page(k, x, y, w, h, cls) {
  const { INK } = k; const x1 = x + w, y1 = y + h;
  const crop = (cx, cy, sx, sy) => `<line x1="${cx + sx * 9}" y1="${cy}" x2="${cx + sx * 30}" y2="${cy}"/><line x1="${cx}" y1="${cy + sy * 9}" x2="${cx}" y2="${cy + sy * 30}"/>`;
  return `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK.navy}" stroke-width="2.4" opacity=".34"/>
    <g stroke="${INK.navy}" stroke-width="3" opacity=".75">${crop(x, y, -1, -1)}${crop(x1, y, 1, -1)}${crop(x, y1, -1, 1)}${crop(x1, y1, 1, 1)}</g></g>`;
}

/* ---------- scan · viewers scan, they don't read: the hierarchy throws the eye from point to point in a Z ---------- */
const ZP = [[204, 186], [436, 212], [178, 336], [440, 419]]; // fixations: headline → image → body → button
function scanDraw(k) {
  const { INK, ht } = k;
  return `
  ${page(k, 70, 110, 460, 360, 'sc-page')}
  <g class="sc-el" data-i="0"><g transform="translate(-6 6)"><rect x="100" y="146" width="236" height="38" fill="${ht('pink', 'm')}"/></g><rect x="100" y="146" width="236" height="38" fill="${INK.navy}"/><rect x="100" y="194" width="166" height="38" fill="${INK.navy}"/></g>
  <g class="sc-el" data-i="1"><g transform="translate(8 -7)"><rect x="372" y="140" width="128" height="148" fill="${ht('navy', 's')}"/></g><rect x="372" y="140" width="128" height="148" fill="${INK.blue}"/><circle cx="436" cy="204" r="31" fill="${INK.yellow}"/><rect x="372" y="262" width="128" height="26" fill="${INK.navy}" opacity=".35"/></g>
  <g class="sc-el" data-i="2">${[200, 186, 196, 122].map((w, i) => `<rect x="100" y="${302 + i * 19}" width="${w}" height="7" fill="${INK.navy}" opacity=".55"/>`).join('')}</g>
  <g class="sc-el" data-i="3"><rect x="378" y="398" width="124" height="42" rx="21" fill="${INK.pink}"/><rect x="410" y="416" width="60" height="6" fill="${INK.paper}"/></g>
  <g class="sc-small">${[0, 1].map(i => `<rect x="100" y="${420 + i * 13}" width="${[84, 58][i]}" height="5" fill="${INK.navy}" opacity=".4"/>`).join('')}</g>
  <path class="sc-trace" d="M${ZP.map(p => p.join(',')).join(' L')}" fill="none" stroke="${INK.navy}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
  ${ZP.map(([x, y], i) => `<circle class="sc-fix" cx="${x}" cy="${y}" r="${[15, 12, 10, 10][i]}" fill="${INK.navy}" stroke="${INK.paper}" stroke-width="3"/>`).join('')}
  <g class="sc-gaze"><circle r="42" fill="${ht('pink', 's')}"/><circle r="42" fill="none" stroke="${INK.pink}" stroke-width="6"/></g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function scanPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const els = qa('.sc-el'), fix = qa('.sc-fix'), trace = q('.sc-trace'), gaze = q('.sc-gaze');
  const cum = ZP.map((_, i) => ZP.slice(0, i + 1).reduce((a, p, j) => j ? a + Math.hypot(p[0] - ZP[j - 1][0], p[1] - ZP[j - 1][1]) : 0, 0)), L = cum[3];
  gsap.set(trace, { strokeDasharray: L + 1 });
  gsap.set(gaze, { x: ZP[0][0], y: ZP[0][1], transformOrigin: '50% 50%' });
  const t = k.tl();
  t.from(q('.sc-page'), { opacity: 0, scale: .95, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, 0);
  k.press(t, [els[0], els[1], els[2], els[3], q('.sc-small')], { at: .1, stagger: .1, from: 16 });
  t.from(gaze, { scale: 0, duration: .5, ease: 'back.out(2)' }, .9).from(fix, { scale: 0, transformOrigin: '50% 50%', duration: .4, stagger: .08, ease: 'back.out(2)' }, 1);
  if (still(t, k)) return t; // composed state: the whole Z, the eye resting on the focal point
  // the scan: fixate on the biggest thing, then jump (fast), fixate (calm), jump… — the trace stays behind like a print
  gsap.set(trace, { strokeDashoffset: L });
  const s = gsap.timeline({ repeat: -1, delay: 1.7, repeatDelay: .4 });
  s.set(fix, { scale: 0, transformOrigin: '50% 50%' }).set(trace, { strokeDashoffset: L, opacity: 1 })
    .to(gaze, { x: ZP[0][0], y: ZP[0][1], scale: 1, opacity: 1, duration: .5, ease: 'expo.inOut' })
    .to(fix[0], { scale: 1, duration: .35, ease: 'back.out(2.4)' }, '-=.1')
    .to(els[0], { scale: 1.04, transformOrigin: '50% 50%', duration: .3, yoyo: true, repeat: 1, ease: 'power2.out' }, '<');
  for (let i = 1; i < 4; i++) {
    s.to(gaze, { x: ZP[i][0], y: ZP[i][1], duration: .45, ease: 'expo.inOut' }, '+=.8')
      .to(trace, { strokeDashoffset: L - cum[i], duration: .45, ease: 'expo.inOut' }, '<')
      .to(fix[i], { scale: 1, duration: .35, ease: 'back.out(2.4)' }, '-=.08')
      .to(els[i], { scale: 1.04, transformOrigin: '50% 50%', duration: .3, yoyo: true, repeat: 1, ease: 'power2.out' }, '<');
  }
  s.to(gaze, { scale: .6, opacity: 0, duration: .5, ease: 'power2.in' }, '+=1.3')
    .to(trace, { opacity: 0, duration: .6 }, '<')
    .to(fix, { scale: 0, duration: .35, stagger: .06, ease: 'power2.in' }, '<.2');
  return t;
}

/* ---------- minds · three viewers (different age, culture, experience), one design, three readings ---------- */
// an abstract profile (facing right) — a silhouette only: no eye, no mouth, no expression
const HEAD = 'M34,120 L32,92 C14,84 4,66 6,50 C8,22 30,4 54,4 C74,4 88,16 88,36 L88,46 L100,64 L88,68 L88,84 C88,92 82,96 72,97 L66,98 L66,120 Z';
// three sizes (age) and three inks (culture, experience), stepped down a diagonal so each profile stays whole
const HEADS = [{ ink: 'green', s: 1.1, x: 40, y: 92 }, { ink: 'pink', s: 1.38, x: 80, y: 212 }, { ink: 'blue', s: 1.66, x: 116, y: 346 }];
const DSG = { x: 384, y: 214, s: 132 }; // the one design they all look at
const READ_OFF = [[-10, -10], [0, 0], [10, 10]];
function mindsDraw(k) {
  const { INK, ht } = k;
  const eyeAt = h => [h.x + 86 * h.s, h.y + 48 * h.s];
  const lines = HEADS.map((h, i) => { const [ex, ey] = eyeAt(h); return `<line class="mi-ray" x1="${(ex + 14).toFixed(1)}" y1="${ey.toFixed(1)}" x2="${DSG.x - 14}" y2="${DSG.y + 36 + i * 30}" stroke="${INK[h.ink]}" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="2 11"/>`; }).join('');
  // each head is two plates: a halftone of its ink (always printed) and the solid + its misregistered pass (its turn)
  const heads = HEADS.map(h => `<g class="mi-head"><g transform="translate(${h.x} ${h.y}) scale(${h.s})"><path d="${HEAD}" fill="${ht(h.ink, 'm')}"/></g>
    <g class="mi-solid"><g transform="translate(${h.x + 7} ${h.y + 6}) scale(${h.s})"><path d="${HEAD}" fill="${ht('navy', 's')}"/></g><g transform="translate(${h.x} ${h.y}) scale(${h.s})"><path d="${HEAD}" fill="${INK[h.ink]}"/></g></g></g>`).join('');
  const reads = HEADS.map((h, i) => `<g class="mi-read"><rect x="${DSG.x + 14 + READ_OFF[i][0]}" y="${DSG.y + 14 + READ_OFF[i][1]}" width="${DSG.s - 28}" height="${DSG.s - 28}" fill="${ht(h.ink, 'm')}"/></g>`).join('');
  return `
  <g class="mi-rays">${lines}</g>
  ${heads}
  <g class="mi-design">${reads}
    <rect x="${DSG.x}" y="${DSG.y}" width="${DSG.s}" height="${DSG.s}" fill="none" stroke="${INK.navy}" stroke-width="7"/>
    <circle cx="${DSG.x + DSG.s / 2}" cy="${DSG.y + DSG.s / 2}" r="21" fill="${INK.navy}"/>
  </g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function mindsPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const heads = qa('.mi-head'), solids = qa('.mi-solid'), rays = qa('.mi-ray'), reads = qa('.mi-read');
  const t = k.tl();
  t.from(q('.mi-design'), { scale: .5, opacity: 0, transformOrigin: '50% 50%', duration: 1, ease: 'expo.out' }, 0)
    .from(heads, { x: -40, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out' }, .1)
    .from(rays, { opacity: 0, duration: .6, stagger: .12 }, .7)
    .from(reads, { opacity: 0, x: (i) => READ_OFF[i][0] * 3, y: (i) => READ_OFF[i][1] * 3, duration: .9, stagger: .12, ease: 'expo.out' }, .75);
  if (still(t, k)) return t; // composed: all three readings printed over each other, slightly out of register
  // one viewer at a time: their line of sight lights up and the design is printed in their ink, in register
  const c = gsap.timeline({ repeat: -1, delay: 2.4 });
  [0, 1, 2].forEach(i => {
    const others = [0, 1, 2].filter(j => j !== i);
    c.to(others.map(j => solids[j]), { opacity: 0, duration: .6, ease: 'power2.inOut' })
      .to(solids[i], { opacity: 1, duration: .6 }, '<')
      .to(others.map(j => rays[j]), { opacity: .2, duration: .6 }, '<')
      .to(rays[i], { opacity: 1, duration: .6 }, '<')
      .to(others.map(j => reads[j]), { opacity: .12, duration: .6 }, '<')
      .to(reads[i], { opacity: 1, x: -READ_OFF[i][0], y: -READ_OFF[i][1], duration: .8, ease: 'expo.out' }, '<')
      .to({}, { duration: 1.5 })
      .to(reads[i], { x: 0, y: 0, duration: .6, ease: 'power2.inOut' });
  });
  c.to([...solids, ...rays, ...reads], { opacity: 1, duration: .7, ease: 'power2.inOut' }).to({}, { duration: 2.2 });
  gsap.to(rays, { strokeDashoffset: -22, duration: 1.2, repeat: -1, ease: 'none' });
  return t;
}

/* ---------- levers · the designer's four tools — Shape, Typeface, Color, Space — around the viewer's eye ---------- */
const LQ = [[172, 172], [428, 172], [172, 428], [428, 428]]; // quadrant centres: shape · type · color · space
const TYPE_FACES = [['serif', 100, 600], ['display', 128, 900], ['script', 100, 400]];
function leversDraw(k) {
  const { INK, ht } = k;
  const [sx, sy] = LQ[0], [cx, cy] = LQ[2], [px, py] = LQ[3];
  const shapes = `<g class="lv-shapes">
      <circle cx="${sx - 24}" cy="${sy - 28}" r="44" fill="${INK.blue}"/>
      <rect x="${sx - 6}" y="${sy - 10}" width="78" height="78" fill="${INK.pink}" fill-opacity=".9"/>
      <polygon points="${P([[sx - 46, sy + 6], [sx + 4, sy + 84], [sx - 96, sy + 84]])}" fill="${INK.yellow}" fill-opacity=".92"/></g>`;
  const faces = TYPE_FACES.map(([fam, w, wt], i) => `<g class="lv-face" opacity="${i ? 0 : 1}">${k.text(LQ[1][0] + 6, LQ[1][1] + 46, 'Aa', { size: fam === 'display' ? 112 : 136, family: fam, weight: wt, width: w, fill: INK.pink, extra: 'transform="translate(5 -4)" opacity=".85"' })}${k.text(LQ[1][0], LQ[1][1] + 50, 'Aa', { size: fam === 'display' ? 112 : 136, family: fam, weight: wt, width: w, fill: INK.navy })}</g>`).join('');
  const color = `<g class="lv-color">${[['pink', -90], ['yellow', 150], ['blue', 30]].map(([ink, a]) => `<circle cx="${(cx + Math.cos(a * Math.PI / 180) * 34).toFixed(1)}" cy="${(cy + 6 + Math.sin(a * Math.PI / 180) * 34).toFixed(1)}" r="54" fill="${INK[ink]}" fill-opacity=".86"/>`).join('')}</g>`;
  const space = `<g class="lv-space"><rect class="lv-frame" x="${px - 76}" y="${py - 76}" width="152" height="152" fill="none" stroke="${INK.navy}" stroke-width="4" stroke-dasharray="10 8"/>
      <rect class="lv-dot" x="${px - 52}" y="${py - 52}" width="30" height="30" fill="${INK.navy}"/><rect x="${px - 52}" y="${py - 52}" width="30" height="30" fill="${ht('navy', 's')}" class="lv-dot2" opacity="0"/></g>`;
  const cross = `<g class="lv-cross" stroke="${INK.navy}" stroke-width="1.8" opacity=".4"><line x1="56" y1="300" x2="226" y2="300"/><line x1="374" y1="300" x2="544" y2="300"/><line x1="300" y1="56" x2="300" y2="272"/><line x1="300" y1="328" x2="300" y2="544"/></g>`;
  const eye = `<g class="lv-eye"><path d="M232,300 Q300,254 368,300 Q300,346 232,300 Z" fill="${INK.paper}" stroke="${INK.navy}" stroke-width="5" stroke-linejoin="round"/>
      <clipPath id="levers-eye"><path d="M232,300 Q300,254 368,300 Q300,346 232,300 Z"/></clipPath>
      <g clip-path="url(#levers-eye)"><g class="lv-iris"><circle cx="300" cy="300" r="19" fill="${INK.blue}"/><circle cx="300" cy="300" r="8" fill="${INK.navy}"/><circle cx="306" cy="294" r="3.5" fill="${INK.paper}"/></g></g></g>`;
  const finder = `<g class="lv-finder" stroke="${INK.pink}" stroke-width="6" fill="none" stroke-linecap="round">${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy]) => `<polyline points="${P([[dx * 112, dy * 82], [dx * 112, dy * 112], [dx * 82, dy * 112]])}"/>`).join('')}</g>`;
  return `${cross}${shapes}<g class="lv-type">${faces}</g>${color}${space}${eye}${finder}${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function leversPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const finder = q('.lv-finder'), iris = q('.lv-iris'), faces = qa('.lv-face');
  gsap.set(finder, { x: LQ[0][0], y: LQ[0][1], transformOrigin: '50% 50%' });
  const t = k.tl();
  t.from(q('.lv-cross'), { opacity: 0, scale: .8, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, 0)
    .from(q('.lv-eye'), { scaleY: 0, transformOrigin: '50% 50%', duration: .6, ease: 'back.out(2)' }, .1);
  k.press(t, [q('.lv-shapes'), q('.lv-type'), q('.lv-color'), q('.lv-space')], { at: .15, stagger: .12, from: 22 });
  t.from(finder, { scale: 1.4, opacity: 0, duration: .6, ease: 'expo.out' }, 1);
  if (still(t, k)) return t;
  // the viewfinder moves from lever to lever; the eye follows it; each lever makes its one move. Three rounds are built
  // into one timeline (absolute values: the trio and the inks turn 120° per round, the face steps serif → display → script)
  // so the repeat lands exactly where it started and every tween belongs to the scene.
  const look = [[-11, -6], [11, -6], [-11, 6], [11, 6]];
  const c = gsap.timeline({ repeat: -1, delay: 1.8 });
  for (let r = 0; r < 3; r++) [0, 1, 2, 3].forEach(i => {
    c.to(finder, { x: LQ[i][0], y: LQ[i][1], duration: .8, ease: 'expo.inOut' })
      .to(iris, { x: look[i][0], y: look[i][1], duration: .6, ease: 'power3.inOut' }, '<.1');
    const at = '>-.1';
    if (i === 0) c.to(q('.lv-shapes'), { rotation: 120 * (r + 1), svgOrigin: `${LQ[0][0] - 20} ${LQ[0][1] + 20}`, duration: 1.2, ease: 'expo.inOut' }, at);
    if (i === 1) c.to(faces[r], { opacity: 0, duration: .35 }, at).to(faces[(r + 1) % 3], { opacity: 1, duration: .45 }, '-=.1');
    if (i === 2) c.to(q('.lv-color'), { rotation: 120 * (r + 1), svgOrigin: `${LQ[2][0]} ${LQ[2][1] + 6}`, duration: 1.2, ease: 'expo.inOut' }, at);
    if (i === 3) c.to(q('.lv-frame'), { scale: 1.1, transformOrigin: '50% 50%', duration: .7, ease: 'expo.out' }, at).to(q('.lv-dot'), { scale: .7, x: 8, y: 8, transformOrigin: '50% 50%', duration: .7, ease: 'expo.out' }, '<')
      .to(q('.lv-frame'), { scale: 1, duration: .9, ease: 'power2.inOut' }, '+=.5').to(q('.lv-dot'), { scale: 1, x: 0, y: 0, duration: .9, ease: 'power2.inOut' }, '<');
    c.to({}, { duration: 2 });
  });
  return t;
}

export default {
  eye: { draw: k => eyeDraw(k), play: eyePlay },
  eyeBare: { draw: k => eyeDraw(k, { bare: true }), play: eyePlay },
  scan: { draw: scanDraw, play: scanPlay },
  minds: { draw: mindsDraw, play: mindsPlay },
  levers: { draw: leversDraw, play: leversPlay }
};
