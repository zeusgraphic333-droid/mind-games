// Illustrated scenes — express group (Black Square). See STYLE.md.
//   squares   — the Black Square Challenge: one set of navy squares re-arranges itself to say each lecture word
//               (Order · Increase · Bold · Congested · Tension · Playful), on a 15 × 15 cm sheet.
//   sq(name)  — 'sq:<Word>' / 'sq:<Word>#<trial>' → that page from data/squares.js, printed onto its sheet.
import { SQ } from '../../data/squares.js';

/* the sheet: a 150 × 150 page (+5 margin) scaled ×3 into the 600 frame; frame box = 1 pt stroke, no fill */
const U = 2.8, PX = 300 - 75 * U, PY = 54; // page origin in the frame (a 160-unit card: 40…488)
const px = v => PX + v * U, py = v => PY + v * U;
const LECTURE = ['Order', 'Increase', 'Bold', 'Congested', 'Tension', 'Playful'];
const inkOf = (k, c) => ({ r: k.INK.red, b: k.INK.blue, p: k.INK.pink }[c] || k.INK.navy);
const f1 = v => (+v).toFixed(1);

function sheet(k, id, word, note) {
  const { INK } = k; const x0 = px(-5), y0 = py(-5), s = 160 * U, x1 = x0 + s, y1 = y0 + s, m = 10, L = 16;
  const crop = [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]].map(([x, y, sx, sy]) =>
    `<line x1="${x + sx * m}" y1="${y}" x2="${x + sx * (m + L)}" y2="${y}"/><line x1="${x}" y1="${y + sy * m}" x2="${x}" y2="${y + sy * (m + L)}"/>`).join('');
  return {
    under: `<g class="${id}-crop" stroke="${INK.navy}" stroke-width="1.2" opacity=".6">${crop}</g>
      <rect class="${id}-card" x="${x0}" y="${y0}" width="${s}" height="${s}" fill="${INK.paper2}"/>
      <rect class="${id}-frame" x="${px(0)}" y="${py(0)}" width="${150 * U}" height="${150 * U}" fill="none" stroke="${INK.navy}" stroke-width="1.3"/>`,
    label: `<g class="${id}-label">${k.text(x0, y1 + 46, word.toUpperCase(), { size: 22, family: 'dot', weight: 800, fill: INK.navy, anchor: 'start', extra: `class="${id}-word" letter-spacing="3"` })}${note ? k.text(x1, y1 + 46, note, { size: 18, family: 'dot', weight: 700, fill: INK.ink3, anchor: 'end', extra: `class="${id}-note"` }) : ''}</g>`
  };
}
/** one SQ item as markup in frame coordinates */
function itemSVG(k, it, cls) {
  const col = inkOf(k, it.c), o = it.o ?? 1;
  if (it.t === 'l') return `<line class="${cls} ${cls}-l" x1="${f1(px(it.x1))}" y1="${f1(py(it.y1))}" x2="${f1(px(it.x2))}" y2="${f1(py(it.y2))}" stroke="${col}" stroke-width="${f1(it.w * U)}" stroke-opacity="${o}" stroke-linecap="square"/>`;
  const cx = px(it.x + it.s / 2), cy = py(it.y + it.s / 2), s = it.s * U;
  const tr = it.r ? ` transform="rotate(${f1(it.r)} ${f1(cx)} ${f1(cy)})"` : '';
  const paint = it.st ? `fill="none" stroke="${col}" stroke-width="${f1(1.6 * U)}"` : `fill="${col}"`;
  return `<rect class="${cls} ${cls}-s" x="${f1(cx - s / 2)}" y="${f1(cy - s / 2)}" width="${f1(s)}" height="${f1(s)}" ${paint} opacity="${o}"${tr}/>`;
}
const pageClip = id => `<clipPath id="${id}-clip"><rect x="${px(0)}" y="${py(0)}" width="${150 * U}" height="${150 * U}"/></clipPath>`;

/* ---------- sq:<Word>[#trial] ---------- */
export function sq(name) {
  const m = /^sq:([A-Za-z]+)(?:#(\d+))?$/.exec(name || ''); if (!m) return null;
  const w = SQ[m[1]]; if (!w) return null;
  const trial = Math.min(+(m[2] || 0), w.trials.length - 1);
  const id = `sq-${m[1]}-${trial}`; const items = w.trials[trial].items;
  return {
    draw(k) {
      const sh = sheet(k, id, w.word, `${trial + 1} / ${w.trials.length}`);
      // one riso touch that cannot change the composition: a misregistered second pass of the frame box
      return `<g direction="ltr"><defs>${pageClip(id)}</defs>
        <rect class="${id}-mis" x="${px(0) + 5}" y="${py(0) - 4}" width="${150 * U}" height="${150 * U}" fill="none" stroke="${k.INK.blue}" stroke-width="1.3" opacity=".55"/>
        ${sh.under}
        <g class="${id}-art" clip-path="url(#${id}-clip)">${items.map(it => itemSVG(k, it, `${id}-i`)).join('')}</g>
        ${sh.label}</g>`;
    },
    play(svg, k) {
      const { gsap } = k; const q = s => svg.querySelector(s), all = s => svg.querySelectorAll(s);
      const t = k.tl(); const els = [...all(`.${id}-i`)];
      k.press(t, [q(`.${id}-card`), q(`.${id}-mis`)], { from: 22 });
      t.from(all(`.${id}-crop`), { opacity: 0, duration: .6 }, .1)
        .from(q(`.${id}-frame`), { attr: { width: 0, height: 0 }, duration: .7, ease: 'expo.out' }, .2)
        .from(q(`.${id}-label`), { opacity: 0, y: 10, duration: .6 }, .5);
      // printed onto the sheet: squares are stamped one after another, lines are pulled across
      const each = Math.min(.07, .85 / Math.max(1, els.length));
      els.forEach((el, i) => {
        const at = .45 + i * each;
        if (el.tagName === 'line') { const L = Math.hypot(el.x2.baseVal.value - el.x1.baseVal.value, el.y2.baseVal.value - el.y1.baseVal.value); t.fromTo(el, { strokeDasharray: `0 ${L + 2}` }, { strokeDasharray: `${L + 2} 0`, duration: .45, ease: 'power2.out' }, at); }
        else t.from(el, { scale: 1.35, opacity: 0, transformOrigin: '50% 50%', duration: .4, ease: 'power3.out' }, at);
      });
      if (k.reduced()) { t.progress(1); return t; }
      // the sheet hangs on the drying line: a slow sway
      k.loop([q(`.${id}-card`), q(`.${id}-frame`), q(`.${id}-art`), q(`.${id}-mis`), ...all(`.${id}-crop`)], { y: '+=5', duration: 3.2, delay: 1.6 });
      void gsap;
      return t;
    }
  };
}

/* ---------- squares: the challenge — one set of squares, six words ---------- */
const POOL = 16;
/** every lecture word as POOL squares {cx, cy, s, r, o} in frame units; spare squares hide inside the real ones */
const LAYOUTS = LECTURE.map(w => {
  const its = SQ[w].trials[0].items.filter(i => i.t === 's');
  return Array.from({ length: POOL }, (_, j) => { const it = its[j % its.length]; return { cx: px(it.x + it.s / 2), cy: py(it.y + it.s / 2), s: it.s * U, r: it.r || 0, o: it.o ?? 1 }; });
});
const sqT = p => `translate(${f1(p.cx)} ${f1(p.cy)}) rotate(${f1(p.r)}) scale(${f1(Math.max(.01, p.s))})`;
function squaresDraw(k) {
  const sh = sheet(k, 'bs', LECTURE[0], '');
  const L0 = LAYOUTS[0];
  const words = LECTURE.map((w, i) => k.text(px(-5), py(155) + 46, w.toUpperCase(), { size: 22, family: 'dot', weight: 800, fill: k.INK.navy, anchor: 'start', extra: `class="bs-w" data-i="${i}" letter-spacing="3" opacity="${i ? 0 : 1}"` })).join('');
  return `<g direction="ltr"><defs>${pageClip('bs')}</defs>
    <rect class="bs-mis" x="${px(0) + 5}" y="${py(0) - 4}" width="${150 * U}" height="${150 * U}" fill="none" stroke="${k.INK.blue}" stroke-width="1.3" opacity=".55"/>
    ${sh.under}
    <g clip-path="url(#bs-clip)">${L0.map((p, j) => `<rect class="bs-q" data-j="${j}" x="-.5" y="-.5" width="1" height="1" fill="${k.INK.navy}" transform="${sqT(p)}"/>`).join('')}</g>
    ${words}
    <g class="bs-dots">${LECTURE.map((_, i) => `<circle class="bs-d" cx="${px(150) - (LECTURE.length - 1 - i) * 18}" cy="${py(155) + 39}" r="5" fill="${i ? 'none' : k.INK.pink}" stroke="${k.INK.navy}" stroke-width="1.5"/>`).join('')}</g></g>`;
}
function squaresPlay(svg, k) {
  const { gsap } = k; const all = s => svg.querySelectorAll(s), q = s => svg.querySelector(s);
  const els = [...all('.bs-q')], words = [...all('.bs-w')], dots = [...all('.bs-d')];
  const st = LAYOUTS[0].map(p => ({ ...p }));
  const paint = () => els.forEach((el, j) => el.setAttribute('transform', sqT(st[j])));
  const t = k.tl();
  k.press(t, [q('.bs-card'), q('.bs-mis')], { from: 22 });
  t.from(all('.bs-crop'), { opacity: 0, duration: .6 }, .1)
    .from(q('.bs-frame'), { attr: { width: 0, height: 0 }, duration: .7, ease: 'expo.out' }, .2)
    .from(els, { opacity: 0, duration: .3, stagger: .035 }, .45)
    .from([words[0], q('.bs-dots')], { opacity: 0, y: 10, duration: .6 }, .6);
  if (k.reduced()) return t;
  // same squares, new word: every square slides, grows, shrinks or tilts into the next composition
  const cyc = gsap.timeline({ repeat: -1, delay: 2.4 });
  LECTURE.forEach((_, i) => {
    const n = (i + 1) % LECTURE.length, at = i * 2.9;
    st.forEach((s, j) => cyc.to(s, { ...LAYOUTS[n][j], duration: 1.1, ease: 'power3.inOut', onUpdate: j === 0 ? paint : undefined }, at + (j % 8) * .025));
    cyc.to(words[i], { opacity: 0, y: -8, duration: .35 }, at)
      .fromTo(words[n], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5 }, at + .55)
      .to(dots[i], { attr: { fill: 'none' }, duration: .2 }, at)
      .to(dots[n], { attr: { fill: k.INK.pink }, duration: .2 }, at + .55)
      .set(words[i], { y: 0 }, at + .4);
  });
  // one paint per frame for the whole set (the first square's tween drives it, the others only move numbers)
  cyc.eventCallback('onUpdate', paint);
  return t;
}

export default {
  squares: { draw: squaresDraw, play: squaresPlay }
};
