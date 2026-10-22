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
  t.from(q('.e-iris'), { scale: .4, transformOrigin: '300px 300px', duration: 1.2, ease: 'expo.out' }, .25);
  if (k.reduced()) return t;
  // look around, then blink — a calm, unhurried loop
  gsap.timeline({ repeat: -1, delay: 1.4 })
    .to(q('.e-iris'), { x: -46, y: 6, duration: 1.1, ease: 'power3.inOut' })
    .to(q('.e-iris'), { x: 38, y: -10, duration: 1.3, ease: 'power3.inOut' }, '+=.8')
    .to(q('.e-iris'), { x: 0, y: 0, duration: 1, ease: 'power3.inOut' }, '+=.7')
    .to(q('.e-eye'), { scaleY: .05, transformOrigin: '300px 300px', duration: .09, ease: 'power1.in' }, '+=.5')
    .to(q('.e-eye'), { scaleY: 1, duration: .16, ease: 'power2.out' });
  k.loop(q('.e-pupil'), { attr: { r: 36 }, duration: 2.6 });
  k.loop(q('.e-halo'), { rotate: 8, transformOrigin: '300px 300px', duration: 7 });
  return t;
}

export default {
  eye: { draw: k => eyeDraw(k), play: eyePlay },
  eyeBare: { draw: k => eyeDraw(k, { bare: true }), play: eyePlay }
};
