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

export default {
  kanizsa: { draw: kanizsaDraw, play: kanizsaPlay }
};
