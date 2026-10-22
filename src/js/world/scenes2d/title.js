// The illustrated title — the site's name printed like a riso poster: two inks, a hair out of register,
// the three Kandinsky shapes behind it. 'title:ar' / 'title:en' (main.js picks by language).
function titleDraw(k, lines, { family, size, width = 118, rtl = false }) {
  const { INK, ht } = k;
  const y0 = 300 - (lines.length - 1) * size * .52;
  const line = (s, i, fill, extra = '') => k.text(300, y0 + i * size * 1.04, s, { size, family, weight: 900, width, fill, extra: `${rtl ? 'direction="rtl"' : ''} ${extra}` });
  return `
    <g class="tt-shapes">
      <g class="tt-c"><circle cx="150" cy="168" r="118" fill="${ht('pink', 'l')}" mask="url(#fade-r)"/><circle cx="150" cy="168" r="70" fill="${INK.pink}" fill-opacity=".9"/></g>
      <g class="tt-s"><rect x="372" y="330" width="150" height="150" fill="${INK.blue}" fill-opacity=".9" transform="rotate(12 447 405)"/></g>
      <g class="tt-t"><polygon points="438,96 520,236 356,236" fill="${INK.yellow}"/></g>
    </g>
    <g class="tt-pink" transform="translate(7 6)">${lines.map((s, i) => line(s, i, INK.pink, 'fill-opacity=".9"')).join('')}</g>
    <g class="tt-navy">${lines.map((s, i) => `<g class="tt-l">${line(s, i, INK.navy)}</g>`).join('')}</g>
    ${k.regmark(36, 36)}${k.regmark(564, 564)}`;
}
function titlePlay(svg, k) {
  const { gsap } = k; const q = s => svg.querySelector(s), all = s => svg.querySelectorAll(s);
  const t = k.tl();
  k.press(t, [q('.tt-c'), q('.tt-s'), q('.tt-t')], { from: 30, stagger: .1 });
  t.from(all('.tt-l'), { opacity: 0, scale: 1.12, transformOrigin: '50% 50%', duration: .9, stagger: .14, ease: 'expo.out' }, .25)
    .from(q('.tt-pink'), { opacity: 0, x: 26, y: -18, duration: 1.1, ease: 'expo.out' }, .45);
  if (k.reduced()) return t;
  // the press never quite registers: the pink pass drifts a hair, the shapes breathe
  k.loop(q('.tt-pink'), { x: 10, y: 4, duration: 3.2 });
  k.loop(q('.tt-c'), { y: '-=10', duration: 4.2 });
  k.loop(q('.tt-s'), { rotate: 4, transformOrigin: '447px 405px', duration: 5.5 });
  k.loop(q('.tt-t'), { y: '+=8', duration: 3.6 });
  return t;
}
export default {
  'title:ar': { draw: k => titleDraw(k, ['عقلك', 'بيشتغلك.'], { family: 'ar', size: 128, rtl: true }), play: titlePlay },
  'title:en': { draw: k => titleDraw(k, ['Your mind is', 'playing you.'], { family: 'display', size: 84, width: 112 }), play: titlePlay }
};
