// Illustrated scenes — space group: clearing · airy · dense · activeSpace · passiveSpace. See STYLE.md.
// Space needs a boundary to be seen, so four scenes share one printed sheet (a portrait format with crop marks): the same
// sheet goes from airy to crammed, and active/passive whitespace are made visible by tinting the space itself
// ("the white space doesn't have to be white"). `clearing` is the zone picture: a crowd with one clearing.

function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const f1 = v => +v.toFixed(1);
const still = (t, k) => { if (!k.reduced()) return false; t.progress(1); return true; };
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const SH = { x: 150, y: 84, w: 300, h: 432 }; // the sheet
/** the printed sheet: a hairline edge and crop marks just outside its corners */
function sheet(k) {
  const { INK } = k; const { x, y, w, h } = SH; const x1 = x + w, y1 = y + h;
  const crop = (cx, cy, sx, sy) => `<line x1="${cx + sx * 9}" y1="${cy}" x2="${cx + sx * 30}" y2="${cy}"/><line x1="${cx}" y1="${cy + sy * 9}" x2="${cx}" y2="${cy + sy * 30}"/>`;
  return `<g class="sp-sheet"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK.navy}" stroke-width="2.4" opacity=".34"/>
    <g stroke="${INK.navy}" stroke-width="3" opacity=".75">${crop(x, y, -1, -1)}${crop(x1, y, 1, -1)}${crop(x, y1, -1, 1)}${crop(x1, y1, 1, 1)}</g></g>`;
}
const sheetIn = (t, svg) => t.from(svg.querySelector('.sp-sheet'), { opacity: 0, scale: .94, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, 0);

/* ---------- clearing · negative space: a crowd of marks, one clearing, one object that the space makes the hero ---------- */
function clearingDraw(k) {
  const { INK, ht } = k;
  const r = rng(13), R0 = 134, R1 = 262; const bands = [[], [], [], []];
  for (let j = 0; j < 19; j++) for (let i = 0; i < 19; i++) {
    const x = 30 + i * 30 + (r() - .5) * 15, y = 30 + j * 30 + (r() - .5) * 15, d = Math.hypot(x - 300, y - 300);
    const kind = Math.floor(r() * 3), c = r(), a = r() * 180;
    if (d < R0 || d > R1) continue;
    const t = (d - R0) / (R1 - R0), s = 1.08 - t * .6, ink = c < .66 ? INK.navy : INK.blue; // pink belongs to the hero only
    const m = kind === 0 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(5.6 * s)}" fill="${ink}"/>`
      : kind === 1 ? `<rect x="${f1(x - 11 * s)}" y="${f1(y - 2.4 * s)}" width="${f1(22 * s)}" height="${f1(4.8 * s)}" rx="${f1(2.4 * s)}" fill="${ink}" transform="rotate(${a.toFixed(0)} ${f1(x)} ${f1(y)})"/>`
        : `<rect x="${f1(x - 5 * s)}" y="${f1(y - 5 * s)}" width="${f1(10 * s)}" height="${f1(10 * s)}" fill="${ink}" transform="rotate(${(a / 2).toFixed(0)} ${f1(x)} ${f1(y)})"/>`;
    bands[Math.min(3, Math.floor(t * 4))].push(m);
  }
  return `
  ${bands.map((b, i) => `<g class="cl-band" data-i="${i}">${b.join('')}</g>`).join('')}
  <circle class="cl-edge" cx="300" cy="300" r="112" fill="none" stroke="${INK.navy}" stroke-width="1.6" stroke-dasharray="2 9" stroke-linecap="round" opacity=".45"/>
  <g class="cl-obj">
    <g transform="translate(8 7)"><circle cx="300" cy="300" r="40" fill="${ht('navy', 's')}"/></g>
    <circle cx="300" cy="300" r="40" fill="${INK.pink}"/>
  </g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function clearingPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  // the crowd arrives packed tight, then gives way: the clearing opens and the one object steps into it
  t.from(qa('.cl-band'), { scale: .5, opacity: 0, svgOrigin: '300 300', duration: 1.3, stagger: .08, ease: 'expo.out' }, 0)
    .from(q('.cl-edge'), { scale: .6, opacity: 0, svgOrigin: '300 300', duration: 1, ease: 'expo.out' }, .5)
    .from(q('.cl-obj'), { scale: 0, svgOrigin: '300 300', duration: .8, ease: 'back.out(2)' }, .75);
  if (still(t, k)) return t;
  // turning the noise down: every few breaths the crowd steps back a little further and the object grows into the space
  qa('.cl-band').forEach((b, i) => k.loop(b, { scale: 1.07 + i * .012, svgOrigin: '300 300', duration: 2.8, delay: 1.4 + i * .18 }));
  k.loop(q('.cl-obj'), { scale: 1.12, svgOrigin: '300 300', duration: 2.8, delay: 1.5 });
  gsap.to(q('.cl-edge'), { rotation: 360, svgOrigin: '300 300', duration: 90, repeat: -1, ease: 'none' });
  return t;
}

/* ---------- airy · open, calm and inviting: one thing on the sheet, and all the paper around it ---------- */
function airyDraw(k) {
  const { INK, ht } = k;
  return `
  ${sheet(k)}
  <g class="ai-halo"><circle cx="300" cy="232" r="122" fill="${ht('pink', 'm')}" mask="url(#fade-r)"/></g>
  <g class="ai-obj"><g transform="translate(7 -6)"><rect x="268" y="200" width="64" height="64" fill="${ht('navy', 's')}"/></g><rect x="268" y="200" width="64" height="64" fill="${INK.blue}"/></g>
  <g class="ai-txt"><rect x="238" y="338" width="124" height="11" fill="${INK.navy}"/><rect x="266" y="362" width="68" height="6" fill="${INK.navy}" opacity=".5"/></g>
  <g class="ai-foot"><rect x="176" y="482" width="30" height="5" fill="${INK.navy}" opacity=".45"/><rect x="394" y="482" width="30" height="5" fill="${INK.navy}" opacity=".45"/></g>`;
}
function airyPlay(svg, k) {
  const [q] = sel(svg);
  const t = k.tl(); sheetIn(t, svg);
  k.press(t, [q('.ai-halo'), q('.ai-obj'), q('.ai-txt'), q('.ai-foot')], { at: .2, stagger: .16, from: 16 });
  if (still(t, k)) return t;
  k.loop(q('.ai-obj'), { y: -9, duration: 3.6, delay: 1.4 });
  k.loop(q('.ai-halo'), { scale: 1.08, transformOrigin: '50% 50%', duration: 4.8, delay: 1.4 });
  return t;
}

/* ---------- dense · intense, urgent: the same sheet crammed edge to edge; a burst turns, a ticker never stops ---------- */
function denseDraw(k) {
  const { INK, ht } = k; const r = rng(21);
  const inks = [INK.navy, INK.pink, INK.yellow, INK.blue, INK.red, INK.teal, INK.navy];
  let blocks = '';
  for (let i = 0; i < 36; i++) { // stratified: every band of the sheet gets its share, so nothing is left to breathe
    const w = 26 + r() * 100, h = 9 + r() * 40, x = 158 + ((i % 3) / 3 + r() / 3) * (284 - w), y = 92 + ((Math.floor(i / 3) + r()) / 12) * (334 - h);
    const ink = inks[i % inks.length], tone = r() < .22 ? ht(['pink', 'blue', 'navy'][i % 3], 'm') : ink, rot = r() < .3 ? ((r() - .5) * 16).toFixed(1) : 0;
    blocks += `<g class="dn-b"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${tone}" ${rot ? `transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})"` : ''}/></g>`;
  }
  let bars = '';
  for (let i = 0; i < 8; i++) bars += `<rect x="${158 + (i % 2) * 150}" y="${110 + i * 34}" width="${60 + r() * 70}" height="6" fill="${INK.navy}"/>`;
  let tick = ''; for (let i = 0; i < 14; i++) tick += `<rect x="${150 + i * 42}" y="458" width="${18 + (i * 7) % 16}" height="9" fill="${INK.paper}"/>`;
  return `
  ${sheet(k)}
  <g class="dn-crowd">${blocks}<g class="dn-bars">${bars}</g>
    <rect x="240" y="262" width="54" height="54" fill="${INK.blue}"/>
  </g>
  <g class="dn-burst"><polygon points="${k.star(386, 178, 62, 44, 14).map(p => p.join(',')).join(' ')}" fill="${INK.yellow}"/><circle cx="386" cy="178" r="30" fill="${INK.red}"/></g>
  <clipPath id="dense-tick"><rect x="150" y="440" width="300" height="46"/></clipPath>
  <g class="dn-band"><rect x="150" y="440" width="300" height="46" fill="${INK.red}"/>
    <g clip-path="url(#dense-tick)"><g class="dn-tick">${tick}</g></g></g>
  <g class="dn-foot"><rect x="160" y="496" width="280" height="8" fill="${ht('navy', 's')}"/></g>`;
}
function densePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl(); sheetIn(t, svg);
  t.from(qa('.dn-b'), { scale: 0, transformOrigin: '50% 50%', duration: .45, stagger: { each: .025, from: 'random' }, ease: 'back.out(2.2)' }, .1)
    .from(qa('.dn-bars rect'), { scaleX: 0, transformOrigin: '0% 50%', duration: .5, stagger: .04 }, .4)
    .from(q('.dn-band'), { scaleX: 0, transformOrigin: '0% 50%', duration: .7, ease: 'expo.out' }, .5)
    .from(q('.dn-burst'), { scale: 0, rotation: -90, svgOrigin: '386 178', duration: .8, ease: 'back.out(1.8)' }, .8);
  if (still(t, k)) return t;
  gsap.to(q('.dn-tick'), { x: -84, duration: 1.6, repeat: -1, ease: 'none' }); // the ticker: always more coming
  gsap.to(q('.dn-burst'), { rotation: 360, svgOrigin: '386 178', duration: 16, repeat: -1, ease: 'none' });
  // stickers keep landing on top of each other: one restamps every beat
  const b = qa('.dn-b'), seq = gsap.timeline({ repeat: -1, delay: 1.6 });
  [3, 11, 7, 19, 1, 24, 14, 28].forEach(i => seq.fromTo(b[i], { scale: 1.25 }, { scale: 1, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)' }, '+=.55'));
  return t;
}

/* ---------- active whitespace · deliberate and asymmetric: the space is a shape, and it moves with the layout ---------- */
// the image hugs the right edge, the title the left; on the swap they trade sides (image −140, title +96 → right-aligned at 426)
const AS = { img: [314, 110, 112, 196], ttl: [174, 432, 156, 18], sub: [174, 462, 92, 8], swing: -140, ttlSwing: 96 };
function activeDraw(k) {
  const { INK, ht } = k; const pad = 14;
  const hole = ([x, y, w, h], cls) => `<rect class="${cls}" x="${x - pad}" y="${y - pad}" width="${w + pad * 2}" height="${h + pad * 2}" fill="#000"/>`;
  const [ix, iy, iw, ih] = AS.img;
  return `
  ${sheet(k)}
  <mask id="activeSpace-m" maskUnits="userSpaceOnUse" x="150" y="84" width="300" height="432">
    <rect x="150" y="84" width="300" height="432" fill="#fff"/>${hole(AS.img, 'as-mi')}${hole([AS.ttl[0], AS.ttl[1], AS.ttl[2], AS.sub[1] + AS.sub[3] - AS.ttl[1]], 'as-mt')}
  </mask>
  <g class="as-space"><rect x="160" y="94" width="280" height="412" fill="${ht('pink', 's')}" mask="url(#activeSpace-m)"/></g>
  <g class="as-img"><g transform="translate(9 -8)"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="${ht('navy', 's')}"/></g><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="${INK.teal}"/>
    <circle cx="${ix + iw / 2}" cy="${iy + ih * .38}" r="26" fill="${INK.paper}" opacity=".85"/></g>
  <g class="as-ttl"><rect x="${AS.ttl[0]}" y="${AS.ttl[1]}" width="${AS.ttl[2]}" height="${AS.ttl[3]}" fill="${INK.navy}"/><rect x="${AS.sub[0]}" y="${AS.sub[1]}" width="${AS.sub[2]}" height="${AS.sub[3]}" fill="${INK.navy}" opacity=".55"/></g>`;
}
function activePlay(svg, k) {
  const { gsap } = k; const [q] = sel(svg);
  const t = k.tl(); sheetIn(t, svg);
  t.from(q('.as-img'), { y: -40, opacity: 0, duration: .9, ease: 'expo.out' }, .15)
    .from(q('.as-ttl'), { x: -40, opacity: 0, duration: .9, ease: 'expo.out' }, .3)
    .from(q('.as-space'), { opacity: 0, duration: 1, ease: 'power2.out' }, .7);
  if (still(t, k)) return t;
  // the designer moves the weight to the other side: still asymmetric, still deliberate — the space follows the decision
  const swap = gsap.timeline({ repeat: -1, yoyo: true, delay: 2.4, repeatDelay: 2.2 });
  swap.to([q('.as-img'), q('.as-mi')], { x: AS.swing, duration: 1.3, ease: 'expo.inOut' }, 0)
    .to([q('.as-ttl'), q('.as-mt')], { x: AS.ttlSwing, duration: 1.3, ease: 'expo.inOut' }, .08);
  k.loop(q('.as-space'), { opacity: .55, duration: 2.2, delay: 1.8 });
  return t;
}

/* ---------- passive whitespace · the default gaps between letters, words and lines; given room, the page breathes ---------- */
function passiveDraw(k) {
  const { INK, ht } = k; const r = rng(5);
  let rows = '';
  for (let c = 0; c < 2; c++) for (let i = 0; i < 12; i++) {
    let x = 174 + c * 134, line = ''; const end = 174 + c * 134 + (i === 11 ? 70 + r() * 30 : 118);
    while (x < end - 12) { const w = Math.min(end - x, 14 + r() * 34); line += `<rect x="${f1(x)}" y="${150 + i * 22}" width="${f1(w)}" height="7" fill="${INK.navy}"/>`; x += w + 7; }
    rows += `<g class="ps-row" data-i="${i}">${line}</g>`;
  }
  return `
  ${sheet(k)}
  <g class="ps-tint"><rect x="166" y="104" width="268" height="333" fill="${ht('pink', 's')}"/></g>
  <g class="ps-head"><rect x="174" y="112" width="166" height="16" fill="${INK.navy}"/></g>
  ${rows}
  <g class="ps-foot"><rect x="174" y="476" width="54" height="5" fill="${INK.navy}" opacity=".45"/><rect x="384" y="476" width="42" height="5" fill="${INK.navy}" opacity=".45"/></g>`;
}
function passivePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const rows = qa('.ps-row');
  const t = k.tl(); sheetIn(t, svg);
  t.from(q('.ps-head'), { scaleX: 0, transformOrigin: '0% 50%', duration: .7, ease: 'expo.out' }, .15)
    .from(rows, { scaleX: 0, transformOrigin: '0% 50%', duration: .6, stagger: .025, ease: 'expo.out' }, .25)
    .from(q('.ps-tint'), { opacity: 0, duration: .9 }, .9);
  if (still(t, k)) return t;
  // leading opens and closes: the same text, more breathing room between the lines
  gsap.timeline({ repeat: -1, yoyo: true, delay: 2, repeatDelay: 1.6 })
    .to(rows, { y: i => (+rows[i].dataset.i) * 4, duration: 2, ease: 'sine.inOut' }, 0)
    .to(q('.ps-tint'), { scaleY: (333 + 44) / 333, transformOrigin: '50% 0%', duration: 2, ease: 'sine.inOut' }, 0);
  return t;
}

export default {
  clearing: { draw: clearingDraw, play: clearingPlay },
  airy: { draw: airyDraw, play: airyPlay },
  dense: { draw: denseDraw, play: densePlay },
  activeSpace: { draw: activeDraw, play: activePlay },
  passiveSpace: { draw: passiveDraw, play: passivePlay }
};
