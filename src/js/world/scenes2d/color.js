// Illustrated scenes — color group: colorSphere · warm · cold · neutrals · swatches. See STYLE.md.
// The colour scenes print the lecture's own colours as spot inks (data/psych.js COLORS, lessons/color.js WARM/COLD/NEUTRAL):
// a colour lesson in the wrong colours would teach the wrong thing. Halftones of spot colours are local patterns (ids prefixed).

/* ---------- local helpers ---------- */
const hex2 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
/** what two transparent inks look like printed on top of each other (multiply) */
const over = (a, b) => toHex(hex2(a).map((v, i) => v * hex2(b)[i] / 255));
/** a halftone dot screen in any colour (step/r like the kit's s · m · l) */
const pat = (id, fill, step = 9, r = 2.4, rot = 45) => `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})"><circle cx="${step / 2}" cy="${step / 2}" r="${r}" fill="${fill}"/></pattern>`;
const P = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;
const lum = h => { const [r, g, b] = hex2(h); return (.2126 * r + .7152 * g + .0722 * b) / 255; };
const mono = (x, y, s, { size = 13, fill, anchor = 'middle', extra = '' } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="'Courier Prime', monospace" font-weight="700" font-size="${size}" letter-spacing="${(size * .14).toFixed(1)}" fill="${fill}" ${extra}>${s}</text>`;

/* ======================================================================================================
   colorSphere — Runge's colour sphere: hues around the equator, white at the top pole, dark toward the bottom.
   Three riso inks (yellow · pink · teal) overprint to make every hue; the in-between gores are a solid ink with a
   halftone of the next ink on top. The globe turns slowly on its axis.
   ====================================================================================================== */
const CS = { cx: 300, cy: 300, R: 192, tilt: 20 * Math.PI / 180 };
const D2R = Math.PI / 180;
function csPt(lam, th) {
  const { cx, cy, R, tilt } = CS, cl = Math.cos(lam);
  return [cx + R * cl * Math.sin(th), cy - R * (Math.sin(lam) * Math.cos(tilt) - cl * Math.cos(th) * Math.sin(tilt))];
}
/** latitude where a meridian goes behind the limb */
const limbLat = th => Math.atan(-Math.cos(th) / Math.tan(CS.tilt));
/** the visible part of the gore between longitudes t1 and t2 (radians): meridian down, along the limb, meridian up */
function gorePath(t1, t2) {
  const pts = [], N = 11, M = 5, l1 = limbLat(t1), l2 = limbLat(t2);
  for (let i = 0; i <= N; i++) pts.push(csPt(Math.PI / 2 + (l1 - Math.PI / 2) * i / N, t1));
  for (let i = 1; i < M; i++) { const th = t1 + (t2 - t1) * i / M; pts.push(csPt(limbLat(th), th)); }
  for (let i = 0; i <= N; i++) pts.push(csPt(l2 + (Math.PI / 2 - l2) * i / N, t2));
  return 'M' + pts.map(p => P(p[0], p[1])).join('L') + 'Z';
}
/** screen region of latitudes above (cap) or below (body) `lam`, as seen through the tilt */
function latRegion(lam, part) {
  const { cx, cy, R, tilt } = CS;
  const c = -Math.tan(lam) * Math.tan(tilt); const tm = Math.acos(Math.max(-1, Math.min(1, c)));
  const pts = []; for (let i = 0; i <= 24; i++) { const th = -tm + 2 * tm * i / 24; pts.push(csPt(lam, th)); }
  const end = pts[pts.length - 1], aR = Math.atan2(end[1] - cy, end[0] - cx);
  const to = part === 'body' ? Math.PI - aR : -Math.PI - aR;
  for (let i = 1; i < 24; i++) { const a = aR + (to - aR) * i / 24; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
  return 'M' + pts.map(p => P(p[0], p[1])).join('L') + 'Z';
}
function csGores(k) {
  const { INK } = k, Y = INK.yellow, Pk = INK.pink, T = INK.teal;
  const YP = over(Y, Pk), PT = over(Pk, T), TY = over(T, Y);
  return { YP, PT, TY, list: [
    { base: Y, tint: 'url(#ht-yellow-m)' }, { base: Y, dots: 'url(#cs-yp)', tint: 'url(#ht-yellow-m)' },
    { base: YP, tint: 'url(#cs-ypt)' }, { base: Pk, dots: 'url(#cs-yp)', tint: 'url(#ht-pink-m)' },
    { base: Pk, tint: 'url(#ht-pink-m)' }, { base: Pk, dots: 'url(#cs-pt)', tint: 'url(#ht-pink-m)' },
    { base: PT, tint: 'url(#cs-ptt)' }, { base: T, dots: 'url(#cs-pt)', tint: 'url(#ht-teal-m)' },
    { base: T, tint: 'url(#ht-teal-m)' }, { base: T, dots: 'url(#cs-ty)', tint: 'url(#ht-teal-m)' },
    { base: TY, tint: 'url(#cs-tyt)' }, { base: Y, dots: 'url(#cs-ty)', tint: 'url(#ht-yellow-m)' }
  ] };
}
const CS_BODY = 36 * D2R, CS_POLE = 71 * D2R;
function sphereDraw(k) {
  const { INK, ht } = k; const { cx, cy, R, tilt } = CS;
  const G = csGores(k); const n = G.list.length, step = 2 * Math.PI / n;
  const body = G.list.map((g, i) => { const d = gorePath(i * step, (i + 1) * step); return `<path class="cs-g" data-i="${i}" d="${d}" fill="${g.base}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>${g.dots ? `<path class="cs-g" data-i="${i}" d="${d}" fill="${g.dots}"/>` : ''}`; }).join('');
  // tints are drawn first and unclipped: the opaque body gores cover them everywhere but the polar cap.
  // (A clip-path on a group whose children are all pattern fills renders displaced in Chrome.)
  const tint = G.list.map((g, i) => `<path class="cs-g" data-i="${i}" d="${gorePath(i * step, (i + 1) * step)}" fill="${g.tint}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`).join('');
  const pole = csPt(Math.PI / 2, 0), capC = csPt(CS_POLE, Math.PI / 2);
  const capRx = R * Math.cos(CS_POLE), capRy = capRx * Math.sin(tilt), capCy = cy - R * Math.sin(CS_POLE) * Math.cos(tilt);
  const eq = []; for (let i = 0; i <= 30; i++) eq.push(csPt(0, -Math.PI / 2 + Math.PI * i / 30));
  void capC;
  return `
  <defs>
    ${pat('cs-yp', G.YP, 9, 2.6, 75)}${pat('cs-pt', G.PT, 9, 2.4, 15)}${pat('cs-ty', G.TY, 9, 2.6, 45)}
    ${pat('cs-ypt', G.YP, 9, 2.4, 60)}${pat('cs-ptt', G.PT, 9, 2.2, 30)}${pat('cs-tyt', G.TY, 9, 2.4, 0)}
    <clipPath id="cs-body"><path d="${latRegion(CS_BODY, 'body')}"/></clipPath>
    <linearGradient id="cs-g-shade" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".22" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="cs-shade" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#cs-g-shade)"/></mask>
  </defs>
  <g class="cs-axis-b"><line x1="${cx}" y1="${cy + R + 6}" x2="${cx}" y2="${cy + R + 40}" stroke="${INK.navy}" stroke-width="3" stroke-linecap="round"/></g>
  <g class="cs-mis" transform="translate(7 -6)" opacity=".9"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK.blue}" stroke-width="4"/></g>
  <g class="cs-ball">
    <g>${tint}</g>
    <g clip-path="url(#cs-body)">${body}</g>
    <ellipse cx="${cx}" cy="${capCy.toFixed(1)}" rx="${capRx.toFixed(1)}" ry="${capRy.toFixed(1)}" fill="#fff"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="${ht('navy', 's')}" mask="url(#cs-shade)" opacity=".95"/>
    <path d="M${eq.map(p => P(p[0], p[1])).join('L')}" fill="none" stroke="${INK.navy}" stroke-width="1.6" stroke-dasharray="2 5" stroke-linecap="round" opacity=".7"/>
  </g>
  <circle class="cs-rim" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK.navy}" stroke-width="5"/>
  <g class="cs-axis-t"><line x1="${cx}" y1="${pole[1].toFixed(1)}" x2="${cx}" y2="${cy - R - 40}" stroke="${INK.navy}" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${pole[1].toFixed(1)}" r="6" fill="#fff" stroke="${INK.navy}" stroke-width="2.5"/></g>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function spherePlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s);
  const els = [...svg.querySelectorAll('.cs-g')]; const n = 12, step = 2 * Math.PI / n;
  const rot = { a: 0 };
  const paint = () => { const cache = {}; els.forEach(el => { const i = +el.dataset.i; const d = cache[i] || (cache[i] = gorePath(rot.a + i * step, rot.a + (i + 1) * step)); el.setAttribute('d', d); }); };
  const t = k.tl();
  k.press(t, [q('.cs-mis'), q('.cs-ball'), q('.cs-rim')], { from: 24 });
  t.from([q('.cs-axis-t'), q('.cs-axis-b')], { opacity: 0, duration: .6 }, .5);
  if (k.reduced()) return t;
  // the globe spins into place, then keeps turning slowly: hues travel round the axis, white stays on top, dark below
  t.fromTo(rot, { a: -2.4 }, { a: 0, duration: 1.7, ease: 'expo.out', onUpdate: paint, immediateRender: true }, 0);
  gsap.to(rot, { a: Math.PI * 2, duration: 44, ease: 'none', repeat: -1, delay: 1.7, onUpdate: paint });
  k.loop(q('.cs-mis'), { x: 4, y: -3, duration: 3.4 });
  return t;
}

/* ======================================================================================================
   warm — the five warm colours as a rising sun: Warmth at the core, Glory, Love, Prosperity, Energy radiating out.
   ====================================================================================================== */
const WARM = [['Warmth', '#FF6A13'], ['Glory', '#FFAF1E'], ['Love', '#FF1F1F'], ['Prosperity', '#FFD21A'], ['Energy', '#FFF02A']];
const WM = { cx: 300, hy: 418, core: 74, band: 34, gap: 10 };
const wmRad = i => i === 0 ? [0, WM.core] : [WM.core + WM.gap + (i - 1) * (WM.band + WM.gap), WM.core + WM.gap + (i - 1) * (WM.band + WM.gap) + WM.band];
function archPath(ri, ro) {
  const { cx, hy } = WM;
  if (!ri) return `M${cx - ro} ${hy}A${ro} ${ro} 0 0 1 ${cx + ro} ${hy}Z`;
  return `M${cx - ro} ${hy}A${ro} ${ro} 0 0 1 ${cx + ro} ${hy}L${cx + ri} ${hy}A${ri} ${ri} 0 0 0 ${cx - ri} ${hy}Z`;
}
function warmDraw(k) {
  const { INK, ht } = k; const { cx, hy } = WM;
  const [, outer] = wmRad(4);
  const bands = WARM.map(([w, c], i) => {
    const [ri, ro] = wmRad(i), rm = (ri + ro) / 2;
    const label = i === 0 ? mono(cx, hy - 26, w.toUpperCase(), { size: 14, fill: INK.navy })
      : `<path id="wm-arc${i}" d="M${cx - rm} ${hy + 5}A${rm} ${rm} 0 0 1 ${cx + rm} ${hy + 5}" fill="none"/><text font-family="'Courier Prime', monospace" font-weight="700" font-size="13" letter-spacing="2.2" fill="${INK.navy}" opacity=".85"><textPath href="#wm-arc${i}" startOffset="50%" text-anchor="middle">${w.toUpperCase()}</textPath></text>`;
    return `<g class="wm-b" data-i="${i}"><path d="${archPath(ri, ro)}" fill="${c}"/>${label}</g>`;
  }).join('');
  const bar = WARM.map(([, c], i) => `<rect x="${cx - 2.5 * 30 + i * 30 + 4}" y="${hy + 44}" width="22" height="22" fill="${c}"/>`).join('');
  return `
  <defs>
    <clipPath id="wm-sky"><rect x="0" y="0" width="600" height="${hy}"/></clipPath>
    <radialGradient id="wm-rg" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${hy}" r="${outer + 74}"><stop offset=".55" stop-color="#fff"/><stop offset=".8" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="wm-glowmask" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600"><rect x="0" y="0" width="600" height="${hy - 2}" fill="url(#wm-rg)"/></mask>
  </defs>
  <g class="wm-glow"><circle cx="${cx}" cy="${hy}" r="${outer + 74}" fill="${ht('yellow', 'l')}" mask="url(#wm-glowmask)"/></g>
  <g class="wm-ripple" clip-path="url(#wm-sky)"><circle cx="${cx}" cy="${hy}" r="${outer + 8}" fill="none" stroke="${INK.orange}" stroke-width="3" opacity="0"/></g>
  <g class="wm-mis" transform="translate(6 -5)" opacity=".85"><path d="${archPath(...wmRad(2))}" fill="${INK.pink}"/></g>
  ${bands}
  <line class="wm-hz" x1="64" y1="${hy}" x2="536" y2="${hy}" stroke="${INK.navy}" stroke-width="4" stroke-linecap="round"/>
  <g class="wm-bar">${bar}</g>
  ${k.regmark(52, 52)}${k.regmark(548, 52)}`;
}
function warmPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const o = `${WM.cx}px ${WM.hy}px`;
  const t = k.tl();
  t.from(q('.wm-hz'), { attr: { x1: 300, x2: 300 }, duration: .8, ease: 'expo.out' }, 0);
  t.from(all('.wm-b'), { scale: 0, transformOrigin: o, svgOrigin: `${WM.cx} ${WM.hy}`, duration: 1.1, stagger: .1, ease: 'expo.out' }, .1);
  k.press(t, [q('.wm-glow'), q('.wm-mis')], { at: .35, from: 20 });
  t.from(all('.wm-bar rect'), { scaleY: 0, transformOrigin: '50% 100%', duration: .5, stagger: .06 }, .7);
  if (k.reduced()) return t;
  // warmth radiates: a slow heat ring leaves the sun, and the bands breathe outward one after another
  gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: .6 })
    .fromTo(q('.wm-ripple circle'), { attr: { r: wmRad(4)[1] + 6 }, opacity: .9 }, { attr: { r: wmRad(4)[1] + 92 }, opacity: 0, duration: 2.8, ease: 'sine.out' });
  k.loop(all('.wm-b'), { scale: 1.025, svgOrigin: `${WM.cx} ${WM.hy}`, duration: 1.8, stagger: { each: .22 }, delay: 1.4 });
  k.loop(q('.wm-glow'), { scale: 1.06, svgOrigin: `${WM.cx} ${WM.hy}`, duration: 3.2 });
  return t;
}

/* ======================================================================================================
   cold — the cold colours as still water: Tranquility, Peace, Trust, Nobility, Nobility (the slide lists Nobility twice).
   ====================================================================================================== */
const COLD = [['Tranquility', '#66F2C6'], ['Peace', '#5BE0F7'], ['Trust', '#2F8BE0'], ['Nobility', '#86A9F5'], ['Nobility', '#8E77DA']];
const CD = { cx: 300, cy: 300, R: 196, top: 150, wl: 132, amp: 8 };
function wavePath(y0, phase = 0) {
  const { wl, amp } = CD; let d = `M${-wl * 2} ${y0}`;
  for (let x = -wl * 2; x <= 600 + wl * 2; x += wl / 2) { const cxp = x + wl / 4; d += `Q${cxp} ${y0 + (((x / (wl / 2)) % 2 === 0) ? -amp : amp) * (phase ? -1 : 1)} ${x + wl / 2} ${y0}`; }
  return d + `L${600 + wl * 2} 560L${-wl * 2} 560Z`;
}
function coldDraw(k) {
  const { INK } = k; const { cx, cy, R, top } = CD; const h = (cy + R - top) / COLD.length;
  const bands = COLD.map(([w, c], i) => {
    const y0 = top + i * h; const dark = lum(c) < .5;
    return `<g class="cd-b"><path class="cd-w" d="${wavePath(y0, i % 2)}" fill="${c}"/></g>`;
  }).join('');
  const labels = COLD.map(([w, c], i) => mono(cx, top + i * h + h / 2 + 7, w.toUpperCase(), { size: 13, fill: lum(c) < .5 ? '#fff' : INK.navy })).join('');
  return `
  <defs><clipPath id="cd-disc"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>
  <g class="cd-mis" transform="translate(-7 6)" opacity=".9"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK.violet}" stroke-width="3"/></g>
  <g class="cd-sea" clip-path="url(#cd-disc)">${bands}</g>
  <g class="cd-lab">${labels}</g>
  <circle class="cd-rim" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK.navy}" stroke-width="4"/>
  <line class="cd-hz" x1="${cx - R - 34}" y1="${top}" x2="${cx + R + 34}" y2="${top}" stroke="${INK.navy}" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round" opacity=".7"/>
  ${k.regmark(52, 548)}${k.regmark(548, 52)}`;
}
function coldPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const t = k.tl();
  // the water level settles band by band, then the labels are printed
  t.from(all('.cd-b'), { y: 70, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out' }, 0);
  k.press(t, [q('.cd-mis'), q('.cd-rim')], { at: .1 });
  t.from(q('.cd-lab'), { opacity: 0, duration: .5 }, .9).from(q('.cd-hz'), { opacity: 0, duration: .5 }, .9);
  if (k.reduced()) return t;
  // calm water: each band drifts sideways by one wavelength, slowly, in alternating directions
  all('.cd-w').forEach((w, i) => gsap.to(w, { x: (i % 2 ? 1 : -1) * CD.wl, duration: 9 + i * 1.7, ease: 'none', repeat: -1 }));
  k.loop(q('.cd-mis'), { x: -3, y: 2, duration: 4 });
  return t;
}

/* ======================================================================================================
   neutrals — the slide's untitled third set: Friendly, Formal, Gloomy, Solid, Classy, Clean, Purity — stacked like
   paper stock and stone, the heaviest at the bottom (Classy is the one lavender among the beiges and greys).
   ====================================================================================================== */
const NEUTRAL = [['Solid', '#050505'], ['Gloomy', '#2A2620'], ['Formal', '#6B6457'], ['Friendly', '#B49F70'], ['Clean', '#D6C8A3'], ['Classy', '#B2B2F5'], ['Purity', '#D9D9D9']];
const NT = { h: 44, gap: 8, w: [404, 366, 384, 334, 356, 306, 326], dx: [0, -16, 12, -10, 18, -8, 6] };
function neutralsDraw(k) {
  const { INK } = k; const n = NEUTRAL.length, pitch = NT.h + NT.gap, y0 = 300 + n * pitch / 2 - NT.gap / 2;
  const slabs = NEUTRAL.map(([w, c], i) => {
    const y = y0 - (i + 1) * pitch + NT.gap, x = 300 - NT.w[i] / 2 + NT.dx[i];
    const ink = lum(c) < .45 ? '#fff' : INK.navy;
    const mis = i === 0 ? `<rect x="${x + 6}" y="${y - 5}" width="${NT.w[i]}" height="${NT.h}" fill="${INK.blue}" opacity=".9"/>` : '';
    return `<g class="nt-s" data-i="${i}">${mis}<rect x="${x}" y="${y}" width="${NT.w[i]}" height="${NT.h}" fill="${c}"/>${mono(x + 18, y + NT.h / 2 + 5, w.toUpperCase(), { size: 13, fill: ink, anchor: 'start' })}</g>`;
  }).join('');
  return `${slabs}
  <line class="nt-base" x1="60" y1="${y0 + 12}" x2="540" y2="${y0 + 12}" stroke="${INK.navy}" stroke-width="3" stroke-linecap="round"/>
  ${k.regmark(52, 52)}${k.regmark(548, 52)}`;
}
function neutralsPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s);
  const t = k.tl();
  t.from(svg.querySelector('.nt-base'), { attr: { x1: 300, x2: 300 }, duration: .7, ease: 'expo.out' }, 0);
  // stacked like paper: bottom slab first, each one set down on the last
  t.from(all('.nt-s'), { y: -46, opacity: 0, duration: .75, stagger: .1, ease: 'power3.out' }, .1);
  if (k.reduced()) return t;
  all('.nt-s').forEach((s, i) => k.loop(s, { x: (i % 2 ? -1 : 1) * 7, duration: 3.2 + i * .35, delay: 1.3 + i * .15 }));
  void gsap;
  return t;
}

/* ======================================================================================================
   swatches — the lecture's 8-colour table as a fan deck: Red, Orange, Yellow, Green, Blue, Purple, Black, White.
   Each chip prints its solid and two halftone tints.
   ====================================================================================================== */
const EIGHT = [['Red', '#E5322D'], ['Orange', '#FF7A1A'], ['Yellow', '#FFD21F'], ['Green', '#1FA35B'], ['Blue', '#2F47E8'], ['Purple', '#7B3FC4'], ['Black', '#15151C'], ['White', '#FFFFFF']];
const SW = { px: 300, py: 476, len: 286, w: 64, step: 15 };
const swAngle = i => (i - (EIGHT.length - 1) / 2) * SW.step;
function swatchesDraw(k) {
  const { INK } = k; const { px, py, len, w } = SW;
  const defs = EIGHT.map(([, c], i) => pat(`sw-a${i}`, c, 8, 2.6, 45) + pat(`sw-b${i}`, c, 8, 1.4, 45)).join('');
  const chips = EIGHT.map(([name, c], i) => {
    const white = c === '#FFFFFF'; const x = px - w / 2, top = py - len;
    const ink = lum(c) < .5 ? '#fff' : INK.navy;
    return `<g class="sw-c" data-i="${i}" transform="rotate(${swAngle(i)} ${px} ${py})">
      <rect x="${x}" y="${top}" width="${w}" height="${len + 26}" rx="8" fill="#fff" stroke="${INK.navy}" stroke-width="${white ? 2 : 1.4}"/>
      <rect x="${x + 6}" y="${top + 6}" width="${w - 12}" height="${150}" rx="3" fill="${c}" ${white ? `stroke="${INK.ink3}" stroke-width="1.2" stroke-dasharray="3 4"` : ''}/>
      <rect x="${x + 6}" y="${top + 162}" width="${w - 12}" height="34" rx="3" fill="url(#sw-a${i})"/>
      <rect x="${x + 6}" y="${top + 202}" width="${w - 12}" height="34" rx="3" fill="url(#sw-b${i})"/>
      <text transform="translate(${px + 7} ${top + 140}) rotate(-90)" font-family="'Courier Prime', monospace" font-weight="700" font-size="15" letter-spacing="2" fill="${white ? INK.navy : ink}">${name.toUpperCase()}</text>
    </g>`;
  }).join('');
  return `<defs>${defs}</defs>
  <g class="sw-mis" transform="translate(6 -5)" opacity=".9"><circle cx="${px}" cy="${py}" r="46" fill="${k.ht('pink', 'm')}"/></g>
  ${chips}
  <circle cx="${px}" cy="${py}" r="11" fill="#fff" stroke="${INK.navy}" stroke-width="4"/><circle cx="${px}" cy="${py}" r="3" fill="${INK.navy}"/>
  ${k.regmark(52, 52)}${k.regmark(548, 548)}`;
}
function swatchesPlay(svg, k) {
  const { gsap } = k; const chips = [...svg.querySelectorAll('.sw-c')];
  const st = chips.map((el, i) => ({ el, a: swAngle(i), i }));
  const set = s => s.el.setAttribute('transform', `rotate(${s.a.toFixed(2)} ${SW.px} ${SW.py})`);
  const t = k.tl();
  t.from(chips, { opacity: 0, duration: .3, stagger: .03 }, 0);
  k.press(t, [svg.querySelector('.sw-mis')], { at: .5 });
  if (k.reduced()) return t;
  // the deck fans open from a closed stack
  st.forEach(s => t.fromTo(s, { a: 0 }, { a: swAngle(s.i), duration: 1.4, ease: 'expo.out', onUpdate: () => set(s), immediateRender: true }, .05 + Math.abs(s.i - 3.5) * .03));
  // then breathes: closes a little and opens again, slowly
  const fan = { f: 1 };
  gsap.to(fan, { f: .86, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8, onUpdate: () => st.forEach(s => { s.a = swAngle(s.i) * fan.f; set(s); }) });
  return t;
}

export default {
  colorSphere: { draw: sphereDraw, play: spherePlay },
  warm: { draw: warmDraw, play: warmPlay },
  cold: { draw: coldDraw, play: coldPlay },
  neutrals: { draw: neutralsDraw, play: neutralsPlay },
  swatches: { draw: swatchesDraw, play: swatchesPlay }
};
