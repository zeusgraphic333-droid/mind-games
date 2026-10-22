// Illustrated scenes — type group: type · serif · sans · script · display · mono · voices. See STYLE.md.
// Real specimens in the site's faces: EB Garamond (serif), Archivo (sans), Lobster (script), Bebas Neue (display),
// Courier Prime (mono). Glyph advances below were measured from the same font files (per 1000 units) so letters and
// annotations land where the ink is.
const F = {
  serif: "'EB Garamond', Garamond, serif", sans: "'Archivo', 'Atkinson Hyperlegible Next', Arial, sans-serif", script: "'Lobster', cursive",
  display: "'Bebas Neue', Impact, sans-serif", mono: "'Courier Prime', 'Courier New', monospace", wide: "'Anybody', 'Arial Black', sans-serif", dot: "'Doto', monospace"
};
const T = (x, y, s, { fam = 'serif', size = 100, w = 400, fill = '#121535', anchor = 'middle', extra = '', ls = 0, stretch = 100 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${F[fam] || fam}" font-size="${size}" font-weight="${w}" fill="${fill}"${ls ? ` letter-spacing="${ls}"` : ''}${stretch !== 100 ? ` style="font-stretch:${stretch}%"` : ''} ${extra}>${s}</text>`;
const label = (x, y, s, fill, { anchor = 'start', size = 13, extra = '' } = {}) => T(x, y, s, { fam: 'mono', size, w: 700, fill, anchor, ls: (size * .16).toFixed(1), extra });

/* ======================================================================================================
   type — a typeface is a voice: the same letters "Aa" on one type grid, reprinted in four voices from slide 23:
   fonts for grown ups, masculine fonts, feminine fonts, fonts for kids.
   ====================================================================================================== */
const TY = { base: 432, cap: 157, xh: 257, desc: 486 };
const VOICES4 = [
  { k: 'GROWN UPS', html: k => T(300, TY.base, 'Aa', { fam: 'serif', size: 400, w: 600, fill: k.INK.navy }) },
  { k: 'MASCULINE', html: k => T(300, TY.base, 'AA', { fam: 'display', size: 392, fill: k.INK.navy, ls: 6 }) },
  { k: 'FEMININE', html: k => T(300, TY.base, 'Aa', { fam: 'script', size: 366, fill: k.INK.navy }) },
  { k: 'KIDS', html: k => `<g transform="rotate(-8 214 ${TY.base})">${T(214, TY.base, 'A', { fam: 'wide', size: 330, w: 900, fill: k.INK.navy })}</g><g transform="rotate(9 410 ${TY.base - 20})">${T(410, TY.base - 20, 'a', { fam: 'wide', size: 330, w: 900, fill: k.INK.navy })}</g>` }
];
function typeDraw(k) {
  const { INK, ht } = k;
  const guide = (y, dash = '') => `<line class="ty-g" x1="46" y1="${y}" x2="554" y2="${y}" stroke="${INK.blue}" stroke-width="1.5" ${dash ? `stroke-dasharray="${dash}"` : ''}/><rect class="ty-g" x="40" y="${y - 4}" width="8" height="8" fill="${INK.blue}"/>`;
  const faces = VOICES4.map((v, i) => `<g class="ty-v" data-i="${i}" ${i ? 'opacity="0"' : ''}>
      <g class="ty-mis" transform="translate(8 -6)" opacity=".9">${v.html({ INK: { navy: INK.pink } })}</g>
      <g class="ty-ink">${v.html(k)}</g>
      ${label(48, 98, v.k, INK.navy, { size: 15 })}
    </g>`).join('');
  return `
  <rect class="ty-band" x="46" y="${TY.xh}" width="508" height="${TY.base - TY.xh}" fill="${ht('yellow', 'm')}"/>
  ${guide(TY.cap)}${guide(TY.xh, '6 6')}${guide(TY.base)}${guide(TY.desc, '2 6')}
  ${faces}
  ${k.regmark(548, 548)}`;
}
function typePlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s);
  const v = [...all('.ty-v')];
  const t = k.tl();
  t.from(all('line.ty-g'), { attr: { x2: 46 }, duration: .9, stagger: .08, ease: 'expo.out' }, 0)
    .from(all('rect.ty-g'), { scale: 0, transformOrigin: '50% 50%', duration: .4, stagger: .08 }, 0)
    .from(svg.querySelector('.ty-band'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1, ease: 'expo.out' }, .15);
  k.press(t, [v[0].querySelector('.ty-mis'), v[0].querySelector('.ty-ink')], { at: .3, from: 26 });
  if (k.reduced()) return t;
  // same letters, new voice: each face is pulled off the press and the next one is printed on the same grid
  const cyc = gsap.timeline({ repeat: -1, delay: 2.6 });
  v.forEach((g, i) => {
    const nx = v[(i + 1) % v.length];
    cyc.to(g, { opacity: 0, y: 14, duration: .45, ease: 'power2.in' }, i * 2.9)
      .set(g, { y: 0 })
      .fromTo(nx, { opacity: 0 }, { opacity: 1, duration: .2 }, i * 2.9 + .45)
      .fromTo(nx.querySelector('.ty-mis'), { x: -10, y: 8 }, { x: 8, y: -6, duration: .9, ease: 'expo.out' }, i * 2.9 + .45)
      .fromTo(nx.querySelector('.ty-ink'), { y: -16 }, { y: 0, duration: .9, ease: 'expo.out' }, i * 2.9 + .45);
  });
  return t;
}

/* ======================================================================================================
   voices — visual voices: the same word in the five families of slide 26; a highlight passes from voice to voice.
   ====================================================================================================== */
const VO = [
  { k: 'SERIF', fam: 'serif', w: 600, size: 94, s: 'Voice' },
  { k: 'SANS-SERIF', fam: 'sans', w: 600, size: 88, s: 'Voice' },
  { k: 'SCRIPT', fam: 'script', w: 400, size: 98, s: 'Voice' },
  { k: 'DISPLAY', fam: 'display', w: 400, size: 104, s: 'VOICE', ls: 3 },
  { k: 'MONOSPACED', fam: 'mono', w: 700, size: 74, s: 'Voice' }
];
const VO_Y = i => 140 + i * 84;
function voicesDraw(k) {
  const { INK, ht } = k;
  const rows = VO.map((v, i) => {
    const y = VO_Y(i), o = { fam: v.fam, size: v.size, w: v.w, anchor: 'start', ls: v.ls || 0 };
    return `<g class="vo-r" data-i="${i}">
      <g class="vo-mis" transform="translate(6 -5)" opacity="0">${T(236, y, v.s, { ...o, fill: INK.pink })}</g>
      ${T(236, y, v.s, { ...o, fill: INK.navy, extra: `class="vo-w" fill-opacity="${i ? .26 : 1}"` })}
      ${label(64, y - 6, v.k, INK.navy, { size: 13, extra: `class="vo-l" opacity="${i ? .45 : 1}"` })}
    </g>`;
  }).join('');
  return `
  <g class="vo-bar" transform="translate(0 ${VO_Y(0)})"><rect x="40" y="-64" width="520" height="80" fill="${ht('yellow', 'm')}"/><rect x="40" y="-64" width="9" height="80" fill="${INK.pink}"/></g>
  <line class="vo-rule" x1="214" y1="80" x2="214" y2="${VO_Y(4) + 34}" stroke="${INK.navy}" stroke-width="1.5" opacity=".5"/>
  ${rows}
  ${k.regmark(52, 548)}`;
}
function voicesPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const rows = [...all('.vo-r')];
  const t = k.tl();
  t.from(rows, { opacity: 0, x: -24, duration: .8, stagger: .09, ease: 'expo.out' }, 0)
    .from(q('.vo-bar'), { scaleX: 0, transformOrigin: '40px 0px', duration: .9, ease: 'expo.out' }, .35)
    .from(q('.vo-rule'), { attr: { y2: 80 }, duration: .9 }, .2)
    .to(rows[0].querySelector('.vo-mis'), { opacity: .9, duration: .4 }, .8);
  if (k.reduced()) return t;
  // one voice speaks at a time: the highlight moves down, that word prints solid with its second ink pass
  const cyc = gsap.timeline({ repeat: -1, delay: 2.4 });
  rows.forEach((r, i) => {
    const n = (i + 1) % rows.length, at = i * 2.3, nx = rows[n];
    cyc.to(q('.vo-bar'), { y: VO_Y(n), duration: .8, ease: 'power3.inOut' }, at)
      .to(r.querySelector('.vo-w'), { attr: { 'fill-opacity': .26 }, duration: .5 }, at)
      .to(r.querySelector('.vo-mis'), { opacity: 0, duration: .4 }, at)
      .to(r.querySelector('.vo-l'), { opacity: .45, duration: .4 }, at)
      .to(nx.querySelector('.vo-w'), { attr: { 'fill-opacity': 1 }, duration: .5 }, at + .35)
      .to(nx.querySelector('.vo-l'), { opacity: 1, duration: .4 }, at + .35)
      .fromTo(nx.querySelector('.vo-mis'), { opacity: 0, x: -4, y: 4 }, { opacity: .9, x: 6, y: -5, duration: .8, ease: 'expo.out' }, at + .45);
  });
  return t;
}

/* ======================================================================================================
   serif — EB Garamond: a printer's loupe travels along the word and magnifies the serifs (the little feet).
   ====================================================================================================== */
const SF = { size: 224, base: 372, x0: 92, mag: 2.5, r: 82 };
// advances (EB Garamond 500, per 1000): S 475 · e 400 · r 362 · i 263 · f 333
const SF_X = (() => { const adv = [475, 400, 362, 263, 333]; const xs = [SF.x0]; adv.forEach(a => xs.push(xs[xs.length - 1] + a * SF.size / 1000)); return xs; })();
const SF_STOPS = [
  [SF_X[2] + .14 * SF.size, SF.base - 6], // r: foot serif
  [SF_X[3] + .13 * SF.size, SF.base - 6], // i: foot serif
  [SF_X[4] + .16 * SF.size, SF.base - 6], // f: foot serif
  [SF_X[2] + .08 * SF.size, SF.base - .43 * SF.size + 8] // r: the serif at the top of the stem
];
function serifWord(k, fill) { return T(SF.x0, SF.base, 'Serif', { fam: 'serif', size: SF.size, w: 500, fill, anchor: 'start' }); }
function serifDraw(k) {
  const { INK, ht } = k; const [fx, fy] = SF_STOPS[0], { mag, r } = SF;
  const ticks = [0, 90, 180, 270].map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<line x1="${(c * (r - 14)).toFixed(1)}" y1="${(s * (r - 14)).toFixed(1)}" x2="${(c * (r - 4)).toFixed(1)}" y2="${(s * (r - 4)).toFixed(1)}" stroke="${INK.navy}" stroke-width="2.5"/>`; }).join('');
  return `
  <defs><clipPath id="sf-lens"><circle class="sf-clip" cx="${fx}" cy="${fy}" r="${r - 3}"/></clipPath></defs>
  <line class="sf-base" x1="56" y1="${SF.base + 1}" x2="544" y2="${SF.base + 1}" stroke="${INK.blue}" stroke-width="2"/>
  <g class="sf-mis" transform="translate(-6 5)" opacity=".85">${serifWord(k, INK.blue)}</g>
  <g class="sf-word">${serifWord(k, INK.navy)}</g>
  <g class="sf-loupe-in" clip-path="url(#sf-lens)">
    <circle class="sf-glass" cx="${fx}" cy="${fy}" r="${r}" fill="#fff"/>
    <circle class="sf-glass" cx="${fx}" cy="${fy}" r="${r}" fill="${ht('yellow', 'm')}"/>
    <g class="sf-zoom" transform="translate(${fx} ${fy}) scale(${mag}) translate(${-fx} ${-fy})">
      <line x1="56" y1="${SF.base + 1}" x2="544" y2="${SF.base + 1}" stroke="${INK.blue}" stroke-width="1.2"/>${serifWord(k, INK.navy)}
    </g>
  </g>
  <g class="sf-loupe" transform="translate(${fx} ${fy})">
    <circle r="${r + 5}" fill="none" stroke="${INK.pink}" stroke-width="4" transform="translate(5 -4)" opacity=".9"/>
    <circle r="${r}" fill="none" stroke="${INK.navy}" stroke-width="9"/>${ticks}
  </g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function serifPlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s);
  const lens = { x: SF_STOPS[0][0], y: SF_STOPS[0][1] };
  const glass = svg.querySelectorAll('.sf-glass'), zoom = q('.sf-zoom'), clip = q('.sf-clip'), loupe = q('.sf-loupe');
  const place = () => {
    const { x, y } = lens; const m = SF.mag;
    clip.setAttribute('cx', x.toFixed(1)); clip.setAttribute('cy', y.toFixed(1));
    glass.forEach(g => { g.setAttribute('cx', x.toFixed(1)); g.setAttribute('cy', y.toFixed(1)); });
    zoom.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${m}) translate(${(-x).toFixed(1)} ${(-y).toFixed(1)})`);
    loupe.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  };
  const t = k.tl();
  t.from(q('.sf-base'), { attr: { x2: 56 }, duration: .9, ease: 'expo.out' }, 0);
  k.press(t, [q('.sf-mis'), q('.sf-word')], { at: .1, from: 22 });
  t.from([q('.sf-loupe'), q('.sf-loupe-in')], { opacity: 0, duration: .5 }, .55);
  if (k.reduced()) return t;
  t.fromTo(lens, { x: 470, y: 150 }, { x: SF_STOPS[0][0], y: SF_STOPS[0][1], duration: 1.1, ease: 'power3.out', onUpdate: place, immediateRender: true }, .5);
  // the loupe inspects one serif after another
  const cyc = gsap.timeline({ repeat: -1, delay: 2.4 });
  const order = [1, 2, 3, 0];
  order.forEach((s, i) => cyc.to(lens, { x: SF_STOPS[s][0], y: SF_STOPS[s][1], duration: 1.15, ease: 'power3.inOut', onUpdate: place }, i * 2.5));
  return t;
}

/* ======================================================================================================
   sans — Archivo on a Swiss grid; the geometric 'a' of the Bauhaus (a circle and a straight stroke) assembles itself.
   ====================================================================================================== */
const SN = { x0: 70, base: 262, size: 172, cx: 372, cy: 428, r: 74, sw: 30 };
function sansDraw(k) {
  const { INK, ht } = k; const { x0, base, size, cx, cy, r, sw } = SN;
  const cols = Array.from({ length: 7 }, (_, i) => 70 + i * 76.67);
  const rows = [96, base - .703 * size, base, cy - r - sw / 2, cy + r + sw / 2, 530];
  const grid = cols.map(x => `<line class="sn-g" x1="${x.toFixed(1)}" y1="62" x2="${x.toFixed(1)}" y2="548" stroke="${INK.blue}" stroke-width="1" opacity=".55"/>`).join('')
    + rows.map(y => `<line class="sn-g" x1="44" y1="${y.toFixed(1)}" x2="556" y2="${y.toFixed(1)}" stroke="${INK.blue}" stroke-width="1" opacity=".55"/>`).join('');
  const stemX = cx + r + sw / 2 - sw / 2;
  return `
  ${grid}
  <rect class="sn-ht" x="${cols[0]}" y="${base + 30}" width="${(cols[3] - cols[0]).toFixed(1)}" height="${(rows[4] - base - 30).toFixed(1)}" fill="${ht('blue', 's')}" opacity=".9"/>
  <g class="sn-word">${T(x0, base, 'Sans', { fam: 'sans', size, w: 600, fill: INK.navy, anchor: 'start', ls: -2 })}</g>
  <rect class="sn-bar" x="${x0}" y="${base + 26}" width="${(cols[3] - x0).toFixed(1)}" height="12" fill="${INK.navy}"/>
  <g class="sn-a">
    <circle class="sn-mis" cx="${cx + 7}" cy="${cy - 6}" r="${r}" fill="none" stroke="${INK.pink}" stroke-width="${sw}" opacity=".9"/>
    <circle class="sn-ring" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK.yellow}" stroke-width="${sw}"/>
    <rect class="sn-stem" x="${stemX}" y="${cy - r - sw / 2}" width="${sw}" height="${2 * r + sw}" fill="${INK.navy}"/>
  </g>
  <rect class="sn-dot" x="${cols[5] + 10}" y="${rows[0] + 12}" width="34" height="34" fill="${INK.pink}"/>`;
}
function sansPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const t = k.tl();
  t.from(all('.sn-g'), { opacity: 0, duration: .5, stagger: .03 }, 0)
    .from(q('.sn-word'), { opacity: 0, x: -30, duration: .9, ease: 'expo.out' }, .2)
    .from(q('.sn-bar'), { scaleX: 0, transformOrigin: '0% 50%', duration: .8, ease: 'expo.out' }, .4)
    .from(q('.sn-ht'), { opacity: 0, duration: .6 }, .5)
    .from([q('.sn-ring'), q('.sn-mis')], { scale: 0, transformOrigin: '50% 50%', duration: .9, ease: 'back.out(1.5)', stagger: .08 }, .5)
    .from(q('.sn-stem'), { scaleY: 0, transformOrigin: '50% 100%', duration: .7, ease: 'expo.out' }, .75)
    .from(q('.sn-dot'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)' }, .9);
  if (k.reduced()) return t;
  // construction: the straight stroke steps out along the grid and comes back to close the circle into an 'a'
  gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: 1.6 })
    .to(q('.sn-stem'), { x: 76.67, duration: 1, ease: 'expo.inOut' })
    .to(q('.sn-dot'), { x: -76.67, duration: 1, ease: 'expo.inOut' }, '<.1')
    .to(q('.sn-stem'), { x: 0, duration: 1, ease: 'expo.inOut' }, '+=1.4')
    .to(q('.sn-dot'), { x: 0, duration: 1, ease: 'expo.inOut' }, '<.1');
  k.loop(q('.sn-mis'), { x: -3, y: 3, duration: 3.6 });
  return t;
}

/* ======================================================================================================
   script — Lobster, written in: the outline is drawn like a pen, the ink fills it, a swash flows underneath.
   ====================================================================================================== */
const SC = { base: 318, size: 178 };
const SWASH = 'M118 398C178 382 238 372 300 376S418 394 458 382C492 372 500 344 478 338C456 333 448 360 470 372C488 382 516 376 534 364';
function scriptDraw(k) {
  const { INK, ht } = k;
  const word = (fill, extra = '') => T(300, SC.base, 'Script', { fam: 'script', size: SC.size, fill, extra });
  return `
  <rect class="sc-card" x="76" y="104" width="448" height="380" fill="none" stroke="${INK.gold}" stroke-width="2"/>
  <rect class="sc-card" x="86" y="114" width="428" height="360" fill="none" stroke="${INK.gold}" stroke-width="1"/>
  <circle class="sc-dot" cx="300" cy="200" r="120" fill="${ht('pink', 's')}" mask="url(#fade-r)"/>
  <g class="sc-mis" transform="translate(-6 5)" opacity=".9">${word(INK.gold)}</g>
  <g class="sc-word">${word(INK.pink, `stroke="${INK.pink}" stroke-width="2" stroke-linejoin="round"`)}</g>
  <path class="sc-swash" d="${SWASH}" fill="none" stroke="${INK.navy}" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M534 364l8 -9l8 9l-8 9z" class="sc-tip" fill="${INK.navy}"/>
  ${k.regmark(548, 548)}`;
}
function scriptPlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s), all = s => svg.querySelectorAll(s);
  const word = q('.sc-word text'), sw = q('.sc-swash'); const L = sw.getTotalLength ? sw.getTotalLength() : 600;
  sw.style.strokeDasharray = `${L} ${L}`;
  const t = k.tl();
  t.from(all('.sc-card'), { opacity: 0, scale: .96, transformOrigin: '50% 50%', duration: .8, stagger: .1 }, 0)
    .from(q('.sc-dot'), { opacity: 0, duration: .8 }, .1)
    .fromTo(word, { attr: { 'fill-opacity': 0 }, strokeDasharray: '0 1200' }, { strokeDasharray: '1200 0', duration: 1.4, ease: 'power2.inOut' }, .1)
    .to(word, { attr: { 'fill-opacity': 1 }, duration: .5 }, .95)
    .from(q('.sc-mis'), { opacity: 0, x: -14, y: 10, duration: .9, ease: 'expo.out' }, .9)
    .fromTo(sw, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, .6)
    .from(q('.sc-tip'), { scale: 0, transformOrigin: '50% 50%', duration: .4, ease: 'back.out(2)' }, 1.5);
  if (k.reduced()) { t.progress(1); return t; }
  // the pen keeps writing the flourish: it lifts off, then flows back in
  gsap.timeline({ repeat: -1, delay: 3.2, repeatDelay: 1.8 })
    .to(sw, { strokeDashoffset: -L, duration: 1.6, ease: 'power2.inOut' })
    .to(q('.sc-tip'), { scale: 0, transformOrigin: '50% 50%', duration: .3 }, '<')
    .set(sw, { strokeDashoffset: L })
    .to(sw, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, '+=.5')
    .to(q('.sc-tip'), { scale: 1, duration: .4, ease: 'back.out(2)' });
  k.loop(q('.sc-mis'), { x: -3, y: 3, duration: 3.8 });
  return t;
}

/* ======================================================================================================
   display — Bebas Neue as a poster headline: stamped hard, and it keeps shouting (echoes leave the word).
   ====================================================================================================== */
const DP = { base: 372, size: 200 };
function displayDraw(k) {
  const { INK, ht } = k;
  const rays = Array.from({ length: 16 }, (_, i) => { const a1 = (i * 22.5 - 4) * Math.PI / 180, a2 = (i * 22.5 + 4) * Math.PI / 180, R = 262; return `<polygon points="300,300 ${(300 + Math.cos(a1) * R).toFixed(1)},${(300 + Math.sin(a1) * R).toFixed(1)} ${(300 + Math.cos(a2) * R).toFixed(1)},${(300 + Math.sin(a2) * R).toFixed(1)}"/>`; }).join('');
  const word = (fill, extra = '') => T(300, DP.base, 'DISPLAY', { fam: 'display', size: DP.size, fill, ls: 2, extra });
  return `
  <g class="dp-rays" fill="${ht('pink', 'm')}" mask="url(#fade-r)">${rays}</g>
  <g class="dp-block" transform="rotate(-4 300 300)">
    <rect x="44" y="200" width="512" height="200" fill="${INK.yellow}"/>
    <g class="dp-echo" opacity="0">${word('none', `stroke="${INK.pink}" stroke-width="2.5"`)}</g>
    <g class="dp-mis" transform="translate(8 7)" opacity=".92">${word(INK.red)}</g>
    <g class="dp-word">${word(INK.navy)}</g>
    <rect x="44" y="410" width="250" height="14" fill="${INK.navy}"/>
  </g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function displayPlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s);
  const t = k.tl();
  t.from(q('.dp-rays'), { opacity: 0, rotate: -20, svgOrigin: '300 300', duration: 1.4, ease: 'expo.out' }, 0)
    .from(q('.dp-block'), { scaleX: 0, svgOrigin: '300 300', duration: .7, ease: 'expo.out' }, .05)
    .from(q('.dp-word'), { scale: 1.5, opacity: 0, svgOrigin: '300 300', duration: .5, ease: 'power4.in' }, .45)
    .from(q('.dp-mis'), { opacity: 0, x: -6, y: -8, duration: .7, ease: 'expo.out' }, .9);
  if (k.reduced()) return t;
  // it keeps shouting: an echo of the headline leaves the word, slow and wide
  gsap.timeline({ repeat: -1, delay: 1.8, repeatDelay: .9 })
    .fromTo(q('.dp-echo'), { opacity: .95, scale: 1 }, { opacity: 0, scale: 1.22, svgOrigin: '300 300', duration: 2.2, ease: 'sine.out' });
  k.loop(q('.dp-rays'), { rotate: 9, svgOrigin: '300 300', duration: 6 });
  return t;
}

/* ======================================================================================================
   mono — Courier Prime: every character gets the same cell, even i and W; a typewriter caret types them in.
   ====================================================================================================== */
const MN = { size: 134, base: 342, s: 'iiiWWW' };
MN.cell = .6 * MN.size; MN.x0 = 300 - MN.cell * MN.s.length / 2;
function monoDraw(k) {
  const { INK, ht } = k; const { size, base, cell, x0, s } = MN; const top = base - .78 * size, h = 1.02 * size;
  const cells = [...s].map((ch, i) => {
    const x = x0 + i * cell;
    return `<rect class="mn-c" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${cell.toFixed(1)}" height="${h.toFixed(1)}" fill="${i % 2 ? 'none' : ht('blue', 's')}" opacity=".9"/>
      <rect class="mn-c" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${cell.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="${INK.blue}" stroke-width="2"/>
      ${T((x + cell / 2).toFixed(1), base, ch, { fam: 'mono', size, w: 400, fill: INK.navy, extra: `class="mn-ch" data-i="${i}"` })}`;
  }).join('');
  // a typewriter scale above the cells: one equal step per character
  const ticks = Array.from({ length: s.length + 1 }, (_, i) => `<line x1="${(x0 + i * cell).toFixed(1)}" y1="${(top - 30).toFixed(1)}" x2="${(x0 + i * cell).toFixed(1)}" y2="${(top - 12).toFixed(1)}" stroke="${INK.navy}" stroke-width="2"/>`).join('')
    + Array.from({ length: s.length }, (_, i) => `<line x1="${(x0 + i * cell + cell / 2).toFixed(1)}" y1="${(top - 21).toFixed(1)}" x2="${(x0 + i * cell + cell / 2).toFixed(1)}" y2="${(top - 12).toFixed(1)}" stroke="${INK.navy}" stroke-width="1.4"/>`).join('');
  return `
  <g class="mn-cells">${cells}</g>
  <g class="mn-ticks">${ticks}<line x1="${x0.toFixed(1)}" y1="${(top - 12).toFixed(1)}" x2="${(x0 + cell * s.length).toFixed(1)}" y2="${(top - 12).toFixed(1)}" stroke="${INK.navy}" stroke-width="2"/></g>
  <rect class="mn-caret" x="${(x0 + 8).toFixed(1)}" y="${(top + h + 14).toFixed(1)}" width="${(cell - 16).toFixed(1)}" height="10" fill="${INK.pink}"/>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function monoPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const chs = [...all('.mn-ch')], caret = q('.mn-caret'); const { cell } = MN;
  const t = k.tl();
  t.from(all('.mn-c'), { opacity: 0, scaleY: 0, transformOrigin: '50% 100%', duration: .6, stagger: .04, ease: 'expo.out' }, 0)
    .from(q('.mn-ticks'), { opacity: 0, y: 8, duration: .6 }, .2);
  const type = (tl, at) => chs.forEach((c, i) => {
    tl.set(caret, { x: i * cell }, at + i * .28)
      .fromTo(c, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: .16, ease: 'power2.in' }, at + i * .28);
  });
  if (k.reduced()) return t;
  type(t, .35);
  t.set(caret, { x: (chs.length - 1) * cell }, .35 + chs.length * .28);
  // a typewriter: same step for every key; then a carriage return and it types again
  const cyc = gsap.timeline({ repeat: -1, delay: 4.2 });
  cyc.to(chs, { opacity: 0, duration: .35, stagger: .03 }).to(caret, { x: 0, duration: .6, ease: 'power3.inOut' }, '<');
  type(cyc, .8);
  cyc.to({}, { duration: 2.2 });
  return t;
}

/** the site is RTL: without this, text-anchor start/end would flip inside the scene */
const ltr = draw => k => `<g direction="ltr">${draw(k)}</g>`;
export default {
  type: { draw: ltr(typeDraw), play: typePlay },
  voices: { draw: ltr(voicesDraw), play: voicesPlay },
  serif: { draw: ltr(serifDraw), play: serifPlay },
  sans: { draw: ltr(sansDraw), play: sansPlay },
  script: { draw: ltr(scriptDraw), play: scriptPlay },
  display: { draw: ltr(displayDraw), play: displayPlay },
  mono: { draw: ltr(monoDraw), play: monoPlay }
};
