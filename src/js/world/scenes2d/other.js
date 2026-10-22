// Illustrated scenes — other group: monolith (the exam) · spiral (Lecture 01) · elements (elements of design) ·
// nebula (raw stimuli). See STYLE.md.

const P = a => a.map(p => p.join(',')).join(' ');
const f1 = v => +v.toFixed(1);
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const still = (t, k) => { if (!k.reduced()) return false; t.progress(1); return true; };
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const marks = k => k.regmark(52, 52) + k.regmark(548, 548);

/* ---------- monolith · the exam: a tower whose face is an answer sheet; it watches through one slit ---------- */
const MO = { x: 222, y: 92, w: 156, h: 408, rows: 7, cols: 4 };
function monolithDraw(k) {
  const { INK, ht } = k; const { x, y, w, h } = MO;
  let bubbles = '';
  for (let r = 0; r < MO.rows; r++) {
    let row = '';
    for (let c = 0; c < MO.cols; c++) row += `<circle class="mo-b" cx="${x + 36 + c * 28}" cy="${y + 140 + r * 34}" r="9.5" fill="none" stroke="${INK.paper}" stroke-width="2.6" opacity=".75"/>`;
    bubbles += `<g class="mo-row">${row}<circle class="mo-fill" cx="${x + 36 + ((r * 7 + 1) % 4) * 28}" cy="${y + 140 + r * 34}" r="8.5" fill="${INK.navy}"/></g>`;
  }
  return `
  <g class="mo-sun"><circle cx="300" cy="262" r="232" fill="${ht('red', 'l')}" mask="url(#fade-r)"/></g>
  <g class="mo-tower">
    <g transform="translate(14 -12)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${ht('navy', 's')}"/></g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${INK.red}"/>
    <rect x="${x}" y="${y + 92}" width="${w}" height="10" fill="${INK.navy}" opacity=".9"/>
    <rect x="${x}" y="${y + h - 46}" width="${w}" height="22" fill="${INK.navy}" opacity=".9"/>
    <g class="mo-sheet">${bubbles}</g>
    <clipPath id="monolith-visor"><rect x="${x + 16}" y="${y + 40}" width="${w - 32}" height="20"/></clipPath>
    <rect x="${x + 16}" y="${y + 40}" width="${w - 32}" height="20" fill="${INK.navy}"/>
    <g clip-path="url(#monolith-visor)"><rect class="mo-glint" x="${x + 16}" y="${y + 40}" width="44" height="20" fill="${INK.yellow}"/></g>
  </g>
  <line class="mo-ground" x1="96" y1="${y + h + 3}" x2="504" y2="${y + h + 3}" stroke="${INK.navy}" stroke-width="6" stroke-linecap="round"/>
  ${marks(k)}`;
}
function monolithPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const fills = qa('.mo-fill'), glint = q('.mo-glint');
  const t = k.tl();
  t.from(q('.mo-ground'), { scaleX: 0, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, 0)
    .from(q('.mo-tower'), { scaleY: 0, transformOrigin: '50% 100%', duration: 1.2, ease: 'expo.out' }, .05)
    .from(q('.mo-sun'), { opacity: 0, scale: .7, transformOrigin: '50% 50%', duration: 1.4, ease: 'expo.out' }, .2)
    .from(qa('.mo-row'), { opacity: 0, x: -10, duration: .5, stagger: .06, ease: 'power2.out' }, .7)
    .from(glint, { opacity: 0, duration: .4 }, 1.1);
  if (still(t, k)) return t;
  // the slit watches — a slow sweep · the sheet fills in, one answer per row, then clears for the next candidate
  gsap.to(glint, { x: MO.w - 32 - 44, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 });
  gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: 1.4 })
    .set(fills, { scale: 0, transformOrigin: '50% 50%' })
    .to(fills, { scale: 1, duration: .35, stagger: .55, ease: 'back.out(2.4)' })
    .to(fills, { opacity: 0, duration: .5, stagger: .04 }, '+=1.6')
    .set(fills, { opacity: 1, scale: 0 });
  k.loop(q('.mo-sun'), { scale: 1.06, transformOrigin: '50% 50%', duration: 4.2, delay: 1.4 });
  return t;
}

/* ---------- spiral · Lecture 01: rhythm, gradation, movement — a golden spiral printed in a falling halftone ---------- */
const PHI = (1 + Math.sqrt(5)) / 2;
function goldenSquares(x0, y0, W, n) {
  const sq = []; let r = { x: x0, y: y0, w: W, h: W / PHI };
  for (let i = 0; i < n; i++) {
    const d = i % 4; let s, x, y;
    if (d === 0) { s = r.h; x = r.x; y = r.y; r = { x: r.x + s, y: r.y, w: r.w - s, h: r.h }; }
    else if (d === 1) { s = r.w; x = r.x; y = r.y; r = { x: r.x, y: r.y + s, w: r.w, h: r.h - s }; }
    else if (d === 2) { s = r.h; x = r.x + r.w - s; y = r.y; r = { x: r.x, y: r.y, w: r.w - s, h: r.h }; }
    else { s = r.w; x = r.x; y = r.y + r.h - s; r = { x: r.x, y: r.y, w: r.w, h: r.h - s }; }
    // quarter arc through this square (clockwise, continuous with the previous one)
    const [a, b] = d === 0 ? [[x, y + s], [x + s, y]] : d === 1 ? [[x, y], [x + s, y + s]] : d === 2 ? [[x + s, y], [x, y + s]] : [[x + s, y + s], [x, y]];
    sq.push({ x, y, s, a, b });
  }
  return sq;
}
const SPW = 500, SPX = 50, SPY = 300 - SPW / PHI / 2, SPN = 8;
function spiralDraw(k) {
  const { INK, ht } = k;
  const sq = goldenSquares(SPX, SPY, SPW, SPN);
  // gradation: every square smaller, every dot finer
  const fills = [INK.yellow, ht('pink', 'l'), ht('blue', 'm'), INK.pink, ht('navy', 's'), INK.blue, INK.navy, INK.pink];
  const tiles = sq.map((c, i) => `<g class="spi-sq"><rect x="${f1(c.x)}" y="${f1(c.y)}" width="${f1(c.s)}" height="${f1(c.s)}" fill="${fills[i]}"/></g>`).join('');
  const frames = sq.map(c => `<rect x="${f1(c.x)}" y="${f1(c.y)}" width="${f1(c.s)}" height="${f1(c.s)}" fill="none" stroke="${INK.navy}" stroke-width="2" opacity=".55"/>`).join('');
  const d = 'M' + sq[0].a.map(f1).join(',') + sq.map(c => ` A${f1(c.s)},${f1(c.s)} 0 0 1 ${f1(c.b[0])},${f1(c.b[1])}`).join('');
  return `
  <g class="spi-tiles">${tiles}</g>
  <g class="spi-frames">${frames}</g>
  <g transform="translate(5 -4)" opacity=".8"><path class="spi-pass" d="${d}" fill="none" stroke="${INK.pink}" stroke-width="7" stroke-linecap="round"/></g>
  <path class="spi-path" d="${d}" fill="none" stroke="${INK.navy}" stroke-width="7" stroke-linecap="round"/>
  <circle class="spi-dot" r="13" fill="${INK.paper}" stroke="${INK.navy}" stroke-width="5"/>
  ${marks(k)}`;
}
function spiralPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const path = q('.spi-path'), pass = q('.spi-pass'), dot = q('.spi-dot'), tiles = qa('.spi-sq');
  const L = path.getTotalLength ? path.getTotalLength() : 1500;
  const at = u => { const p = path.getPointAtLength ? path.getPointAtLength(u * L) : { x: SPX, y: SPY }; dot.setAttribute('cx', p.x.toFixed(1)); dot.setAttribute('cy', p.y.toFixed(1)); };
  gsap.set([path, pass], { strokeDasharray: L + 2 });
  at(0);
  const t = k.tl();
  t.from(tiles, { scale: 0, transformOrigin: '50% 50%', duration: .7, stagger: .07, ease: 'back.out(1.6)' }, 0)
    .from(q('.spi-frames'), { opacity: 0, duration: .8 }, .2)
    .from([path, pass], { strokeDashoffset: L + 2, duration: 1.4, ease: 'power2.inOut', stagger: .08 }, .25)
    .from(dot, { scale: 0, transformOrigin: '50% 50%', duration: .4, ease: 'back.out(2)' }, 1.2);
  if (still(t, k)) return t;
  // movement: the dot rides the spiral inward (the path the eye travels), and a beat runs down the squares (rhythm)
  const u = { v: 0 };
  gsap.timeline({ repeat: -1, delay: 1.7, repeatDelay: .6 })
    .to(u, { v: 1, duration: 5.2, ease: 'power1.in', onUpdate: () => at(u.v) })
    .to(dot, { scale: 0, transformOrigin: '50% 50%', duration: .3 })
    .call(at, [0]).to(dot, { scale: 1, duration: .4, ease: 'back.out(2)' });
  gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: 2.4 })
    .to(tiles, { scale: .9, transformOrigin: '50% 50%', duration: .22, stagger: .3, ease: 'power2.out', yoyo: true, repeat: 1 });
  return t;
}

/* ---------- elements · the seven elements of design as a specimen sheet: the ingredients before the recipe ---------- */
const EL_CELL = 116, EL_GAP = 14, EL_ROW = 30;
const elRowX = n => (600 - (n * EL_CELL + (n - 1) * EL_GAP)) / 2, EL_Y = 300 - EL_CELL - EL_ROW / 2;
const EL_POS = [0, 1, 2, 3].map(i => [elRowX(4) + i * (EL_CELL + EL_GAP), EL_Y]).concat([0, 1, 2].map(i => [elRowX(3) + i * (EL_CELL + EL_GAP), EL_Y + EL_CELL + EL_ROW]));
function elementsDraw(k) {
  const { INK, ht } = k; const S = EL_CELL;
  const c = i => EL_POS[i].map(v => v + S / 2);
  const [l, sh, fo, co, va, tx, sp] = [0, 1, 2, 3, 4, 5, 6].map(c);
  let hatch = ''; for (let i = -4; i < 9; i++) hatch += `<line x1="${tx[0] - 44 + i * 11}" y1="${tx[1] + 40}" x2="${tx[0] - 44 + i * 11 + 30}" y2="${tx[1] - 40}" stroke="${INK.navy}" stroke-width="4" stroke-linecap="round"/>`;
  const items = [
    // 01 line
    `<path class="el-line" d="M${l[0] - 40},${l[1] + 26} C${l[0] - 14},${l[1] - 44} ${l[0] + 14},${l[1] + 44} ${l[0] + 40},${l[1] - 26}" fill="none" stroke="${INK.navy}" stroke-width="9" stroke-linecap="round"/>`,
    // 02 shape
    `<circle class="el-shape" cx="${sh[0]}" cy="${sh[1]}" r="38" fill="${INK.blue}"/>`,
    // 03 form: a cube in three flat inks
    `<g class="el-form"><polygon points="${P([[fo[0], fo[1] - 40], [fo[0] + 36, fo[1] - 20], [fo[0], fo[1]], [fo[0] - 36, fo[1] - 20]])}" fill="${INK.yellow}"/><polygon points="${P([[fo[0] - 36, fo[1] - 20], [fo[0], fo[1]], [fo[0], fo[1] + 42], [fo[0] - 36, fo[1] + 22]])}" fill="${INK.pink}"/><polygon points="${P([[fo[0] + 36, fo[1] - 20], [fo[0], fo[1]], [fo[0], fo[1] + 42], [fo[0] + 36, fo[1] + 22]])}" fill="${INK.navy}"/></g>`,
    // 04 color: three inks overprinting
    `<g class="el-color">${[['pink', -90], ['yellow', 150], ['blue', 30]].map(([ink, a]) => `<circle cx="${f1(co[0] + Math.cos(a * Math.PI / 180) * 17)}" cy="${f1(co[1] + 4 + Math.sin(a * Math.PI / 180) * 17)}" r="27" fill="${INK[ink]}" fill-opacity=".86"/>`).join('')}</g>`,
    // 05 value: light to dark in one ink
    `<g class="el-value">${[INK.paper2, ht('navy', 's'), ht('navy', 'm'), ht('navy', 'l'), INK.navy].map((f, i) => `<rect x="${va[0] - 45 + i * 18}" y="${va[1] - 36}" width="18" height="72" fill="${f}"/>`).join('')}</g>`,
    // 06 texture: a hatched surface
    `<g class="el-texture"><clipPath id="elements-tx"><rect x="${tx[0] - 40}" y="${tx[1] - 36}" width="80" height="72"/></clipPath><g clip-path="url(#elements-tx)"><g class="el-hatch">${hatch}</g></g></g>`,
    // 07 space: almost nothing, on purpose
    `<g class="el-space"><circle class="el-sdot" cx="${sp[0] + 26}" cy="${sp[1] - 26}" r="7" fill="${INK.pink}"/></g>`
  ];
  const cells = EL_POS.map(([x, y], i) => `<g class="el-cell"><rect x="${x}" y="${y}" width="${S}" height="${S}" fill="none" stroke="${INK.navy}" stroke-width="1.8" opacity=".3"/>${k.text(x + 8, y + 19, '0' + (i + 1), { size: 16, family: 'dot', weight: 800, fill: INK.ink2, anchor: 'start', extra: 'direction="ltr"' })}${items[i]}</g>`).join('');
  const finder = `<g class="el-finder" stroke="${INK.pink}" stroke-width="5" fill="none" stroke-linecap="round">${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy]) => `<polyline points="${P([[dx * 64, dy * 44], [dx * 64, dy * 64], [dx * 44, dy * 64]])}"/>`).join('')}</g>`;
  return `${cells}${finder}${marks(k)}`;
}
function elementsPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const cells = qa('.el-cell'), finder = q('.el-finder'), C = EL_POS.map(([x, y]) => [x + EL_CELL / 2, y + EL_CELL / 2]);
  const line = q('.el-line'); const L = line.getTotalLength ? line.getTotalLength() : 160;
  gsap.set(line, { strokeDasharray: L + 1 });
  gsap.set(finder, { x: C[0][0], y: C[0][1], transformOrigin: '50% 50%' });
  const t = k.tl();
  t.from(cells, { scale: .6, opacity: 0, transformOrigin: '50% 50%', duration: .7, stagger: .07, ease: 'back.out(1.7)' }, 0)
    .from(line, { strokeDashoffset: L + 1, duration: .8, ease: 'power2.inOut' }, .3)
    .from(finder, { scale: 1.5, opacity: 0, duration: .6, ease: 'expo.out' }, .9);
  if (still(t, k)) return t;
  // the viewfinder reads the ingredients one by one; each one shows what it is
  const moves = [
    tl => tl.fromTo(line, { strokeDashoffset: L + 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }),
    tl => tl.to(q('.el-shape'), { scale: 1.18, transformOrigin: '50% 50%', duration: .45, yoyo: true, repeat: 1, ease: 'power2.inOut' }),
    tl => tl.to(q('.el-form'), { y: -8, duration: .45, yoyo: true, repeat: 1, ease: 'power2.inOut' }),
    tl => tl.to(q('.el-color'), { rotation: '+=120', transformOrigin: '50% 54%', duration: 1, ease: 'expo.inOut' }),
    tl => tl.fromTo(q('.el-value').children, { opacity: .15 }, { opacity: 1, duration: .25, stagger: .12 }),
    tl => tl.to(q('.el-hatch'), { x: 22, duration: 1, ease: 'power2.inOut', yoyo: true, repeat: 1 }),
    tl => tl.to(q('.el-sdot'), { x: -52, y: 52, duration: 1.1, ease: 'expo.inOut', yoyo: true, repeat: 1 })
  ];
  const c = gsap.timeline({ repeat: -1, delay: 1.6 });
  for (let r = 0; r < 3; r++) C.forEach((p, i) => {
    c.to(finder, { x: p[0], y: p[1], duration: .7, ease: 'expo.inOut' });
    if (i === 3) c.to(q('.el-color'), { rotation: 120 * (r + 1), svgOrigin: `${C[3][0]} ${C[3][1] + 4}`, duration: 1, ease: 'expo.inOut' }, '>-.1');
    else { const sub = gsap.timeline(); moves[i](sub); c.add(sub, '>-.1'); }
    c.to({}, { duration: 1.1 });
  });
  return t;
}

/* ---------- nebula · raw stimuli: scattered marks before the mind organises them (now and then, it does) ---------- */
const NB_N = 92;
function nebulaMarks() {
  const r = rng(41), out = [];
  for (let i = 0; i < NB_N; i++) {
    let x, y; do { const a = r() * Math.PI * 2, d = Math.pow(r(), .62) * 238; x = 300 + Math.cos(a) * d * 1.04; y = 300 + Math.sin(a) * d * .92; } while (Math.hypot(x - 300, y - 300) < 26);
    out.push({ x, y, kind: Math.floor(r() * 6), ink: r(), s: .65 + r() * .75, rot: r() * 180, g: i % 4 });
  }
  return out;
}
function nebulaDraw(k) {
  const { INK, ht } = k; const M = nebulaMarks();
  const inkOf = v => v < .38 ? INK.navy : v < .62 ? INK.blue : v < .84 ? INK.pink : INK.yellow;
  const mark = m => {
    const { x, y, s } = m, c = inkOf(m.ink), X = f1(x), Y = f1(y);
    switch (m.kind) {
      case 0: return `<circle cx="${X}" cy="${Y}" r="${f1(7 * s)}" fill="${c}"/>`;
      case 1: return `<circle cx="${X}" cy="${Y}" r="${f1(8 * s)}" fill="none" stroke="${c}" stroke-width="${f1(3.2 * s)}"/>`;
      case 2: return `<rect x="${f1(x - 12 * s)}" y="${f1(y - 2.5 * s)}" width="${f1(24 * s)}" height="${f1(5 * s)}" rx="${f1(2.5 * s)}" fill="${c}" transform="rotate(${m.rot.toFixed(0)} ${X} ${Y})"/>`;
      case 3: return `<rect x="${f1(x - 6 * s)}" y="${f1(y - 6 * s)}" width="${f1(12 * s)}" height="${f1(12 * s)}" fill="${c}" transform="rotate(${(m.rot / 2).toFixed(0)} ${X} ${Y})"/>`;
      case 4: return `<polygon points="${P([[x, y - 8 * s], [x + 7.5 * s, y + 6 * s], [x - 7.5 * s, y + 6 * s]].map(p => p.map(f1)))}" fill="${c}" transform="rotate(${m.rot.toFixed(0)} ${X} ${Y})"/>`;
      default: return `<circle cx="${X}" cy="${Y}" r="${f1(3.2 * s)}" fill="${c}"/>`;
    }
  };
  const groups = [0, 1, 2, 3].map(g => `<g class="nb-g">${M.map((m, i) => m.g === g ? `<g class="nb-m" data-i="${i}">${mark(m)}</g>` : '').join('')}</g>`).join('');
  return `
  <g class="nb-haze"><circle cx="248" cy="262" r="150" fill="${ht('blue', 'm')}" mask="url(#fade-r)"/><circle cx="360" cy="340" r="130" fill="${ht('pink', 'm')}" mask="url(#fade-r)"/></g>
  ${groups}`;
}
function nebulaPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const M = nebulaMarks(), els = qa('.nb-m');
  const t = k.tl();
  t.from(q('.nb-haze'), { opacity: 0, scale: .8, transformOrigin: '50% 50%', duration: 1.4, ease: 'expo.out' }, 0)
    .from(els, { scale: 0, transformOrigin: '50% 50%', duration: .6, stagger: { each: .008, from: 'random' }, ease: 'back.out(2)' }, .1);
  if (still(t, k)) return t;
  // drift: four loose groups breathe on their own clocks
  qa('.nb-g').forEach((g, i) => k.loop(g, { x: [8, -10, 6, -7][i], y: [-9, 7, 10, -6][i], duration: 3.2 + i * .7, delay: 1 + i * .2 }));
  k.loop(q('.nb-haze'), { rotation: 10, svgOrigin: '300 300', duration: 8, delay: 1 });
  // every so often the mind organises the noise: the marks find two rings, hold, and let go again
  const order = M.map((m, i) => ({ i, a: Math.atan2(m.y - 300, m.x - 300) })).sort((a, b) => a.a - b.a);
  const tgt = new Array(M.length);
  order.forEach((o, j) => { const ring = j % 2, n = Math.ceil(M.length / 2), a = (Math.floor(j / 2) / n) * Math.PI * 2 - Math.PI / 2 + (ring ? Math.PI / n : 0), R = ring ? 214 : 150; tgt[o.i] = [300 + Math.cos(a) * R - M[o.i].x, 300 + Math.sin(a) * R - M[o.i].y]; });
  gsap.timeline({ repeat: -1, delay: 4, repeatDelay: 5 })
    .to(els, { x: i => tgt[+els[i].dataset.i][0], y: i => tgt[+els[i].dataset.i][1], duration: 1.8, ease: 'expo.inOut', stagger: { each: .006, from: 'random' } })
    .to(els, { x: 0, y: 0, duration: 2, ease: 'expo.inOut', stagger: { each: .006, from: 'random' } }, '+=1.6');
  return t;
}

export default {
  monolith: { draw: monolithDraw, play: monolithPlay },
  spiral: { draw: spiralDraw, play: spiralPlay },
  elements: { draw: elementsDraw, play: elementsPlay },
  nebula: { draw: nebulaDraw, play: nebulaPlay }
};
