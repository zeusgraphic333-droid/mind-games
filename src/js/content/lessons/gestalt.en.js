// Gestalt Arcade — Lecture 03 · Gestalt Principles of Visual Perception. English edition of gestalt.js.
// Every chapter drives a particle scene; every demo also works alone (phones) with its own SVG.
const C = { fg: '#EDEBE6', dim: '#7E7C8B', faint: '#3A3946', ultra: '#4D6BFF', pink: '#FF3E8A', sun: '#FFC21A', good: '#46E3A0', red: '#FF4A2E', ice: '#7FE7FF', violet: '#8B7BFF' };
const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
const svg = (vb, inner, label, cls = '') => `<svg class="gst-svg ${cls}" viewBox="${vb}" role="img" aria-label="${label}">${inner}</svg>`;
const seg = (name, items, on = 0) => `<div class="gst-seg" role="group" aria-label="${name}">${items.map((t, i) => `<button type="button" class="gst-seg__b" data-i="${i}" aria-pressed="${i === on}">${t}</button>`).join('')}</div>`;
const range = (label, min, max, val, step = 1) => `<label class="gst-range"><span>${label}</span><input type="range" min="${min}" max="${max}" value="${val}" step="${step}"></label>`;
/** wire a segmented control: fn(index, button) */
function onSeg(root, fn) { const bs = [...root.querySelectorAll('.gst-seg__b')]; bs.forEach((b, i) => b.addEventListener('click', () => { bs.forEach(x => x.setAttribute('aria-pressed', String(x === b))); fn(i, b); })); }
/** a pool of circles that can glide between layouts */
function pool(g, n, r) {
  g.innerHTML = Array.from({ length: n }, () => `<circle r="${r}" cx="0" cy="0"/>`).join('');
  const els = [...g.children];
  return { els, place(fn) { els.forEach((c, i) => { const o = fn(i); c.style.transform = `translate(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px) scale(${o.s ?? 1})`; if (o.fill) c.setAttribute('fill', o.fill); c.style.opacity = o.op ?? 1; }); } };
}

/* ---------- static art ---------- */
const chatArt = svg('0 0 360 230', `
  <rect x="8" y="6" width="344" height="218" rx="18" stroke="${C.faint}" fill="none"/>
  <text x="180" y="30" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="11" fill="${C.dim}">Today</text>
  <rect x="22" y="44" width="150" height="28" rx="12" fill="none" stroke="${C.dim}"/><rect x="22" y="76" width="118" height="28" rx="12" fill="none" stroke="${C.dim}"/>
  <rect x="188" y="116" width="150" height="28" rx="12" fill="${C.ultra}" fill-opacity=".35" stroke="${C.ultra}"/><rect x="214" y="148" width="124" height="28" rx="12" fill="${C.ultra}" fill-opacity=".35" stroke="${C.ultra}"/>
  <rect x="22" y="188" width="132" height="26" rx="12" fill="none" stroke="${C.dim}"/>
  <g stroke="${C.pink}" stroke-dasharray="3 4" fill="none"><rect x="14" y="38" width="166" height="72" rx="14"/><rect x="180" y="110" width="166" height="72" rx="14"/></g>
  <text x="96" y="129" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="11" fill="${C.pink}">close + alike</text>`, 'A chat with grouped messages: yours in one color on one side, your friend’s in another color on the other side');
const timelineArt = `<div class="gst-tl" role="group" aria-label="Timeline: German psychologists in the 1920s; in 1922, Wertheimer, Koffka and Köhler">
  <div class="gst-tl__i"><b class="gst-tl__y">1920s</b><i></i><span>German psychologists</span><small>a group of them</small></div>
  <div class="gst-tl__i is-key"><b class="gst-tl__y">1922</b><i></i><span>Wertheimer · Koffka · Köhler</span><small>developers of Gestalt Psychology</small></div>
  <div class="gst-tl__i"><b class="gst-tl__y">2026</b><i></i><span>You, before the quiz</span></div></div>`;
const layersArt = svg('0 0 520 250', `
  ${['Context', 'Image', 'Form', 'Idea'].map((t, i) => `<g transform="translate(${30 + i * 34} ${150 - i * 34})"><path d="M0 40L120 0L260 40L140 80Z" fill="${[C.faint, C.ultra, C.violet, C.pink][i]}" fill-opacity="${[.6, .22, .22, .28][i]}" stroke="${[C.dim, C.ultra, C.violet, C.pink][i]}" stroke-width="1.2"/><text x="268" y="46" font-family="IBM Plex Sans Arabic" font-size="17" fill="${C.fg}" direction="ltr">${t}</text></g>`).join('')}
  <path d="M70 214Q200 244 380 214" stroke="${C.sun}" stroke-width="1.5" fill="none" stroke-dasharray="4 5"/><text x="225" y="247" text-anchor="middle" font-family="Alexandria" font-size="16" font-weight="600" fill="${C.sun}">the gestalt = one message</text>`, 'Four stacked layers: idea, form, image and context, pulled together into one message');
const formulaArt = `<div class="gst-eq" role="group" aria-label="Equation: creative thought plus Gestalt laws equals good design">
  <div class="gst-eq__c gst-eq__c--a"><span class="gst-eq__o">Creative Thought</span><small>your idea</small></div><span class="gst-eq__op" aria-hidden="true">+</span>
  <div class="gst-eq__c gst-eq__c--b"><span class="gst-eq__o">Gestalt Laws</span><small>how we see</small></div><span class="gst-eq__op" aria-hidden="true">=</span>
  <div class="gst-eq__c gst-eq__c--c"><span class="gst-eq__o">Good Design</span><small>it communicates</small></div></div>`;
/* one creature, ten treatments (the assignment) */
const FISH = 'M20 60C44 30 96 26 128 48L150 30V90L128 72C96 94 44 90 20 60Z';
const fishArt = (() => {
  const cell = (inner, label) => `<figure class="gst-fish__c"><svg viewBox="8 14 156 92" aria-hidden="true">${inner}</svg><figcaption>${label}</figcaption></figure>`;
  const r = rng(5); let stip = ''; for (let k = 0; k < 120; k++) { const x = 26 + r() * 120, y = 32 + r() * 56; stip += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + r() * 1.6).toFixed(1)}"/>`; }
  let circ = ''; for (let k = 0; k < 15; k++) { const t = k / 14; const x = 28 + t * 100, h = Math.sin(t * Math.PI) * 22 + 4; circ += `<circle cx="${x}" cy="${60 - h}" r="5"/><circle cx="${x}" cy="${60 + h}" r="5"/>`; }
  const items = [
    [`<path d="${FISH}" fill="none" stroke="${C.fg}" stroke-width="2.4"/><circle cx="46" cy="54" r="3" fill="${C.fg}"/>`, 'Outline'],
    [`<path d="${FISH}" fill="${C.ultra}"/><circle cx="46" cy="54" r="3.5" fill="#07070B"/>`, 'Inner fill'],
    [`<clipPath id="gfc"><path d="${FISH}"/></clipPath><g clip-path="url(#gfc)" fill="${C.fg}">${stip}</g>`, 'Stipple dots'],
    [`<clipPath id="gfs"><path d="${FISH}"/></clipPath><g clip-path="url(#gfs)" stroke="${C.sun}" stroke-width="3">${Array.from({ length: 9 }, (_, k) => `<path d="M${30 + k * 14} 20V100"/>`).join('')}</g>`, 'Lines'],
    [`<path d="M20 60L60 34L96 38L128 48L150 30L140 60L150 90L128 72L96 84L60 86Z" fill="none" stroke="${C.violet}" stroke-width="2"/><path d="M60 34L60 86M96 38L96 84M60 34L96 84M20 60L96 38" stroke="${C.violet}" stroke-width="1.2" opacity=".7"/>`, 'Geometric reduction'],
    [`<path d="M20 60C44 30 96 26 128 48L150 30V90L128 72C96 94 44 90 20 60C40 62 60 48 82 56S120 70 136 60" fill="none" stroke="${C.pink}" stroke-width="2.2"/>`, 'One line'],
    [`<path d="${FISH}" fill="none" stroke="${C.fg}" stroke-width="3" stroke-dasharray="14 9"/><circle cx="46" cy="54" r="3" fill="${C.fg}"/>`, 'Closure (gaps)'],
    [`<g fill="${C.good}">${circ}</g>`, 'Made of circles'],
    [`<rect x="12" y="20" width="148" height="80" fill="${C.fg}"/><path d="${FISH}" fill="#07070B"/>`, 'Negative space'],
    [`<clipPath id="gfo"><path d="${FISH}"/></clipPath><g clip-path="url(#gfo)" fill="none" stroke="${C.ice}" stroke-width="1.4">${Array.from({ length: 6 }, (_, a) => Array.from({ length: 4 }, (_, b) => `<path d="M${30 + a * 20} ${40 + b * 14}a8 8 0 0 1 16 0"/>`).join('')).join('')}</g><path d="${FISH}" fill="none" stroke="${C.ice}" stroke-width="1.6"/>`, 'Ornament']
  ];
  return `<div class="gst-fish" role="group" aria-label="The same fish drawn in ten treatments">${items.map(([inner, label]) => cell(inner, label)).join('')}</div>`;
})();

/* ---------- demos ---------- */
const D = {};
D.organize = {
  id: 'gst-organize', title: 'Watch your brain tidy up', caption: 'The same 24 dots in all four steps. Only the arrangement changes.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('Steps', ['Chaos', 'Group what’s alike', 'Find a pattern', 'Simplify'])}<div class="gst-stage">${svg('0 0 420 230', `<g class="gst-anim dots"></g><g class="gst-shapes" fill="none" stroke-width="2"><circle cx="80" cy="115" r="46" stroke="${C.ultra}"/><rect x="164" y="69" width="92" height="92" stroke="${C.pink}"/><path d="M340 66L388 162H292Z" stroke="${C.sun}"/></g>`, 'Dots getting organized')}</div><p class="gst-readout" aria-live="polite"></p></div>`;
    const P = pool(el.querySelector('.dots'), 24, 7); const cols = [C.ultra, C.pink, C.sun]; const r = rng(8);
    const rand = Array.from({ length: 24 }, () => ({ x: 20 + r() * 380, y: 18 + r() * 194 }));
    const say = ['Hard work for your brain: 24 separate things.', 'Easier: 3 groups, by color.', 'Better: 3 rows with a pattern.', 'Done: 3 simple shapes. That’s exactly what your brain does.'];
    const scenes = ['nebula', 'similarity', 'proximity', 'simplicity'];
    const shapes = el.querySelector('.gst-shapes');
    const show = i => {
      P.place(k => { const g = k % 3, j = Math.floor(k / 3); if (i === 0) return { ...rand[k], fill: cols[g] }; if (i === 1) { const a = j / 8 * Math.PI * 2; return { x: [80, 210, 340][g] + Math.cos(a) * 32, y: 115 + Math.sin(a) * 32, fill: cols[g] }; } if (i === 2) return { x: 70 + j * 40, y: 55 + g * 60, fill: cols[g] }; return { x: [80, 210, 340][g], y: 115, fill: cols[g], s: .2, op: 0 }; });
      shapes.classList.toggle('on', i === 3); el.querySelector('.gst-readout').textContent = say[i]; api.scene(scenes[i]);
    };
    onSeg(el, (i, b) => { show(i); api.sfx('pop'); if (i === 3) api.award(5, { from: b, key: 'demo:gst-organize' }); });
    P.place(k => ({ ...rand[k], fill: cols[k % 3] })); el.querySelector('.gst-readout').textContent = say[0];
  }
};
D.halftone = {
  id: 'gst-halftone', title: 'Zoom in until the picture disappears', caption: 'From far away: one picture. Up close: dots with no meaning. The whole is greater than the sum of its parts.',
  mount(el, api) {
    let dots = ''; const W = 420, H = 260;
    for (let y = 6; y < H; y += 9) for (let x = 6 + ((y / 9) % 2) * 4.5; x < W; x += 9) {
      const dx = (x - 210) / 105, dy = (y - 128) / 105, d = Math.hypot(dx, dy);
      let v = d < 1 ? .17 + .83 * Math.pow(Math.max(0, 1 - Math.hypot(dx + .38, dy + .4) / 1.5), 1.1) : .012 + .018 * (1 - Math.min(1, (y / H)));
      if (d > .94 && d < 1) v = Math.max(v, .3);
      const rr = 4.4 * Math.sqrt(Math.max(0, v)); if (rr > .35) dots += `<circle cx="${x.toFixed(1)}" cy="${y}" r="${rr.toFixed(2)}"/>`;
    }
    el.innerHTML = `<div class="gst-demo"><div class="gst-stage gst-stage--tall"><svg class="gst-svg gst-ht" viewBox="0 0 ${W} ${H}" role="img" aria-label="A lit ball made of halftone dots"><g fill="${C.fg}">${dots}</g></svg></div>${range('Zoom in', 1, 8, 1, .1)}<p class="gst-readout" aria-live="polite">A whole picture: a ball with light on it.</p></div>`;
    const sv = el.querySelector('.gst-ht'), inp = el.querySelector('input'), out = el.querySelector('.gst-readout'); let told = false;
    inp.addEventListener('input', () => {
      const z = +inp.value; const w = W / z, h = H / z; const cx = 150, cy = 92;
      const x0 = Math.max(0, Math.min(W - w, cx - w / 2)), y0 = Math.max(0, Math.min(H - h, cy - h / 2));
      sv.setAttribute('viewBox', `${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
      out.textContent = z < 2 ? 'A whole picture: a ball with light on it.' : z < 4.5 ? 'You still see the ball… but the dots are starting to show.' : 'Just dots. The picture is gone. It was in your head all along.';
      if (!told) { told = true; api.scene('halftone'); }
      if (z >= 7.5) api.award(5, { from: inp, key: 'demo:gst-halftone' });
    });
  }
};
D.context = {
  id: 'gst-context', title: 'Same shape… letter or number?', caption: 'The shape in the middle didn’t move a single pixel. What changed is what you know around it.',
  mount(el, api) {
    const mid = `<g transform="translate(176 40)" stroke="${C.ultra}" stroke-width="10" stroke-linecap="round" fill="none"><path d="M8 6V96"/><path d="M28 10C64 4 70 46 34 50C72 52 66 100 28 94"/></g>`;
    el.innerHTML = `<div class="gst-demo">${seg('Context', ['Among letters', 'Among numbers'])}<div class="gst-stage">${svg('0 0 440 180', `<text class="gst-ctx-l" x="110" y="128" text-anchor="middle" font-family="Alexandria" font-weight="800" font-size="104" fill="${C.fg}">A</text>${mid}<text class="gst-ctx-r" x="340" y="128" text-anchor="middle" font-family="Alexandria" font-weight="800" font-size="104" fill="${C.fg}">C</text>`, 'A shape in the middle, between two letters or two numbers')}</div><p class="gst-readout" aria-live="polite">You read it as <b>B</b>. Of course: there are letters around it.</p></div>`;
    const L = el.querySelector('.gst-ctx-l'), R = el.querySelector('.gst-ctx-r'), out = el.querySelector('.gst-readout');
    onSeg(el, (i, b) => { L.textContent = i ? '12' : 'A'; R.textContent = i ? '14' : 'C'; L.setAttribute('font-size', i ? 92 : 104); R.setAttribute('font-size', i ? 92 : 104); out.innerHTML = i ? 'You read it as <b>13</b>. The exact same shape! Now there are numbers around it.' : 'You read it as <b>B</b>. Of course: there are letters around it.'; api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-context' }); });
  }
};
D.emergence = {
  id: 'gst-emergence', title: 'The whole first, or the parts?', caption: 'The moment the letter comes together, your eye sees it before counting a single dot.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('Shape', ['The whole', 'The parts'])}<div class="gst-stage">${svg('0 0 420 250', `<g class="gst-anim dots"></g>`, 'The letter U made of dots')}</div><p class="gst-readout" aria-live="polite">The letter <b>U</b>. You saw it in a second.</p></div>`;
    const r = rng(12); const n = 70; const P = pool(el.querySelector('.dots'), n, 1);
    const U = Array.from({ length: n }, () => { const t = r(); let x, y; if (t < .33) { x = 150 + (r() - .5) * 26; y = 40 + r() * 110; } else if (t < .66) { x = 270 + (r() - .5) * 26; y = 40 + r() * 110; } else { const a = Math.PI * r(); x = 210 - Math.cos(a) * 60 + (r() - .5) * 22; y = 150 + Math.sin(a) * 66 + (r() - .5) * 18; } return { x, y, s: 5 + r() * 9 }; });
    const scat = Array.from({ length: n }, () => ({ x: 20 + r() * 380, y: 20 + r() * 210, s: 3 + r() * 6 }));
    const whole = () => P.place(k => ({ ...U[k], fill: C.pink })), parts = () => P.place(k => ({ ...scat[k], fill: [C.pink, C.ultra, C.sun, C.fg][k % 4], op: .9 }));
    whole();
    onSeg(el, (i, b) => { i ? parts() : whole(); el.querySelector('.gst-readout').innerHTML = i ? 'Now it’s just dots. No more “letter”. The meaning was in the arrangement.' : 'The letter <b>U</b>. You saw it in a second.'; api.scene('emergence'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-emergence' }); });
  }
};
D.kanizsa = {
  id: 'gst-kanizsa', title: 'A triangle nobody drew', caption: 'The white triangle isn’t drawn. Still, it feels brighter than the background. That’s your brain filling in.',
  mount(el, api) {
    const V = [[210, 34], [92, 214], [328, 214]];
    const pac = ([x, y], k) => { const o = V.filter((_, j) => j !== k); const a1 = Math.atan2(o[0][1] - y, o[0][0] - x), a2 = Math.atan2(o[1][1] - y, o[1][0] - x); let lo = Math.min(a1, a2), hi = Math.max(a1, a2); if (hi - lo > Math.PI) { const t = lo; lo = hi; hi = t + Math.PI * 2; } const R = 34; const p = a => `${(x + Math.cos(a) * R).toFixed(1)} ${(y + Math.sin(a) * R).toFixed(1)}`; return `<g class="gst-pac" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y}L${p(hi)}A${R} ${R} 0 1 1 ${p(lo + Math.PI * 2 * 0)}Z" fill="${C.ultra}"/></g>`; };
    el.innerHTML = `<div class="gst-demo">${seg('Circles', ['Openings in', 'Openings out'])}<div class="gst-stage">${svg('0 0 420 250', V.map(pac).join(''), 'Three circles, each with a slice cut out, arranged so an illusory triangle appears')}</div>
      <div class="gst-inv"><p class="gst-inv__t" dir="ltr">ˈnvˈsˈble or vˈsˈble?</p>${seg('Letters', ['Missing', 'Complete'])}</div><p class="gst-readout" aria-live="polite">See a triangle? It isn’t there.</p></div>`;
    const segs = el.querySelectorAll('.gst-seg'), out = el.querySelector('.gst-readout');
    const bs1 = [...segs[0].querySelectorAll('button')], bs2 = [...segs[1].querySelectorAll('button')];
    bs1.forEach((b, i) => b.addEventListener('click', () => { bs1.forEach(x => x.setAttribute('aria-pressed', String(x === b))); el.querySelectorAll('.gst-pac').forEach(p => p.classList.toggle('flip', i === 1)); out.textContent = i ? 'The triangle is gone. Same circles, but the openings don’t face each other anymore.' : 'See a triangle? It isn’t there.'; api.scene('kanizsa'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-kanizsa' }); }));
    bs2.forEach((b, i) => b.addEventListener('click', () => { bs2.forEach(x => x.setAttribute('aria-pressed', String(x === b))); el.querySelector('.gst-inv__t').textContent = i ? 'invisible or visible?' : 'ˈnvˈsˈble or vˈsˈble?'; out.textContent = i ? 'Yes: “invisible or visible?” And you read it before we put the letters back.' : 'Letters missing… and you read it anyway.'; api.sfx('pop'); }));
  }
};
D.multi = {
  id: 'gst-multi', title: 'Two readings of one picture', caption: 'Your brain can’t see both readings at the same moment. It jumps between them.',
  mount(el, api) {
    const a = [70, 70], b = [130, 30], s = 110;
    const sq = o => `M${o[0]} ${o[1]}h${s}v${s}h${-s}Z`;
    const cube = `<g fill="none" stroke="${C.fg}" stroke-width="2"><path class="gst-face gst-face--a" d="${sq(a)}"/><path class="gst-face gst-face--b" d="${sq(b)}"/><path d="M70 70L130 30M180 70L240 30M180 180L240 140M70 180L130 140"/></g>`;
    const prof = [[0, 0], [0, 16], [-6, 34], [-16, 46], [-12, 54], [-20, 62], [-34, 74], [-30, 80], [-20, 84], [-22, 92], [-28, 100], [-22, 106], [-24, 114], [-16, 124], [-18, 134], [-22, 146], [-12, 160], [4, 172], [10, 190], [4, 210], [-6, 230]];
    const face = (dir) => { const pts = prof.map(([x, y]) => [150 + dir * (60 + x) , y + 10]); const edge = dir < 0 ? 0 : 300; return `M${edge} 10L${pts.map(p => p.join(' ')).join('L')}L${edge} 240Z`; };
    const vase = `<rect x="0" y="10" width="300" height="230" class="gst-vbg"/><path class="gst-faces" d="${face(-1)}"/><path class="gst-faces" d="${face(1)}"/>`;
    el.innerHTML = `<div class="gst-demo gst-two"><div><div class="gst-stage">${svg('0 0 310 210', cube, 'A cube made of lines only: you can see it from above or from below')}</div>${seg('Cube', ['This face in front', 'The other face in front'])}</div>
      <div><div class="gst-stage">${svg('0 0 300 250', vase, 'A shape in the middle that can look like a vase or two faces looking at each other', 'gst-vase')}</div>${seg('Picture', ['The vase', 'The two faces'])}</div></div><p class="gst-readout" aria-live="polite">Try both buttons, then just look without pressing anything. You’ll catch your brain flipping on its own.</p>`;
    const segs = el.querySelectorAll('.gst-seg');
    [...segs[0].querySelectorAll('button')].forEach((b, i, all) => b.addEventListener('click', () => { all.forEach(x => x.setAttribute('aria-pressed', String(x === b))); el.querySelector('.gst-face--a').classList.toggle('on', i === 0); el.querySelector('.gst-face--b').classList.toggle('on', i === 1); api.scene('necker'); api.sfx('flip'); }));
    [...segs[1].querySelectorAll('button')].forEach((b, i, all) => b.addEventListener('click', () => { all.forEach(x => x.setAttribute('aria-pressed', String(x === b))); el.querySelector('.gst-vase').classList.toggle('faces', i === 1); api.scene('vase'); api.sfx('flip'); if (i) api.award(5, { from: b, key: 'demo:gst-multi' }); }));
    el.querySelector('.gst-face--a').classList.add('on');
  }
};
D.invariance = {
  id: 'gst-invariance', title: 'Turn it, move it, resize it', caption: 'The dashed outline is the original. Do whatever you like to the shape… your brain will still know it.',
  mount(el, api) {
    const shape = 'M-30 -42L34 -42L34 -14L6 -14L6 46L-30 46Z M-12 -24a7 7 0 1 0 0.1 0Z';
    el.innerHTML = `<div class="gst-demo"><div class="gst-stage">${svg('0 0 420 240', `<path d="${shape}" transform="translate(210 120)" fill="none" stroke="${C.dim}" stroke-dasharray="4 5"/><path class="gst-inv-s" d="${shape}" fill="${C.ultra}" fill-rule="evenodd" transform="translate(210 120)"/>`, 'A shape that rotates, moves and scales')}</div>
      <div class="gst-ctrl">${range('Rotation <bdi>turn</bdi>', -180, 180, 0)}${range('Translation <bdi>move</bdi>', -150, 150, 0)}${range('Scale <bdi>resize</bdi>', .4, 1.8, 1, .05)}</div><p class="gst-readout" aria-live="polite">Same shape? Of course.</p></div>`;
    const [rot, mov, sca] = el.querySelectorAll('input'); const s = el.querySelector('.gst-inv-s'); let told = false;
    const upd = () => { s.setAttribute('transform', `translate(${210 + +mov.value} 120) rotate(${rot.value}) scale(${sca.value})`); if (!told) { told = true; api.scene('invariance'); } if (Math.abs(+rot.value) > 120 && Math.abs(+sca.value - 1) > .4) api.award(5, { from: s, key: 'demo:gst-invariance' }); };
    [rot, mov, sca].forEach(i => i.addEventListener('input', upd));
  }
};
D.proximity = {
  id: 'gst-proximity', title: 'Change the spacing only', caption: 'The dots didn’t change. Not their color, not their size. Spacing alone made the groups.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo"><div class="gst-stage">${svg('0 0 420 230', `<g class="gst-anim dots"></g>`, 'Dots in a grid that gather into columns')}</div>${range('Space between groups', 0, 100, 0)}<p class="gst-readout" aria-live="polite">One square of dots.</p></div>`;
    const P = pool(el.querySelector('.dots'), 36, 8); const inp = el.querySelector('input'), out = el.querySelector('.gst-readout'); let told = false;
    const draw = () => { const g = +inp.value / 100; P.place(k => { const c = k % 6, rr = Math.floor(k / 6); const pair = Math.floor(c / 2), side = c % 2; const step = 44 - g * 22; const x = 210 + (pair - 1) * (step * 2 + g * 70) + (side - .5) * step; return { x, y: 30 + rr * 34, fill: C.fg }; }); out.textContent = g < .2 ? 'One square of dots.' : g < .5 ? 'Columns are starting to show…' : '3 columns. Same dots, only the spacing changed.'; };
    inp.addEventListener('input', () => { draw(); if (!told) { told = true; api.scene('proximity'); } if (+inp.value > 90) api.award(5, { from: inp, key: 'demo:gst-proximity' }); });
    draw();
  }
};
D.similarity = {
  id: 'gst-similarity', title: 'Same spacing… change the look only', caption: 'The spacing is equal every time. Similarity alone makes the groups.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('Similarity', ['All the same', 'Color rows', 'Change shape', 'Color columns'])}<div class="gst-stage">${svg('0 0 420 230', `<g class="gst-grid"></g>`, 'A grid of evenly spaced dots')}</div><p class="gst-readout" aria-live="polite">A grid. No groups.</p></div>`;
    const g = el.querySelector('.gst-grid'); const say = ['A grid. No groups.', 'Now you see rows. The spacing didn’t change.', 'Rows again, by shape instead of color.', 'And now columns. Same dots, a different decision.'];
    const draw = m => { let s = ''; for (let rr = 0; rr < 5; rr++) for (let c = 0; c < 8; c++) { const x = 49 + c * 46, y = 27 + rr * 44; const alt = m === 3 ? c % 2 : rr % 2; const col = (m === 1 || m === 3) && alt ? C.ultra : C.fg; s += m === 2 && alt ? `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" fill="none" stroke="${C.fg}" stroke-width="2"/>` : `<circle cx="${x}" cy="${y}" r="10" fill="${col}"/>`; } g.innerHTML = s; el.querySelector('.gst-readout').textContent = say[m]; };
    draw(0);
    onSeg(el, (i, b) => { draw(i); api.scene('similarity'); api.sfx('pop'); if (i === 3) api.award(5, { from: b, key: 'demo:gst-similarity' }); });
  }
};
D.figure = {
  id: 'gst-figure', title: 'Which is figure, which is ground?', caption: 'The arrow isn’t drawn. It’s the space left empty. Swap the colors and see which one comes forward.',
  mount(el, api) {
    const arrow = (c, rr) => { const x = c - 2, y = rr - 3; return (y === 0 && x >= 0 && x <= 5) || (x >= 3 && x <= 5 && Math.abs(y) <= 5 - x); };
    let cells = ''; for (let rr = 0; rr < 7; rr++) for (let c = 0; c < 10; c++) cells += `<rect class="${arrow(c, rr) ? 'gst-neg' : 'gst-pos'}" x="${30 + c * 36}" y="${12 + rr * 30}" width="34" height="28" rx="3"/>`;
    el.innerHTML = `<div class="gst-demo">${seg('Swap', ['Blue is the figure', 'Swap the colors'])}<div class="gst-stage">${svg('0 0 420 236', cells, 'Blue squares, with the empty space between them forming an arrow', 'gst-fg')}</div><p class="gst-readout" aria-live="polite">Blue squares = <b>positive</b>. The empty arrow = <b>negative</b>… and that’s what caught your eye!</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.gst-fg').classList.toggle('inv', i === 1); el.querySelector('.gst-readout').innerHTML = i ? 'Now the arrow is the figure, and the rest is ground. Same drawing, a different decision.' : 'Blue squares = <b>positive</b>. The empty arrow = <b>negative</b>… and that’s what caught your eye!'; api.scene('figureGround'); api.sfx('flip'); if (i) api.award(5, { from: b, key: 'demo:gst-figure' }); });
  }
};
D.continuity = {
  id: 'gst-continuity', title: 'Two lines, or 4 pieces?', caption: 'The second coloring makes just as much sense… but your eye refuses it. It wants to keep going in the same direction.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('Reading', ['Two crossing lines', '4 pieces meeting'])}<div class="gst-stage">${svg('0 0 420 220', `<g class="gst-cont"></g>`, 'A straight line of dots and a wavy line of dots crossing each other')}</div><p class="gst-readout" aria-live="polite">A straight line and a wavy line. Natural.</p></div>`;
    const g = el.querySelector('.gst-cont');
    const draw = m => { let s = ''; for (let k = 0; k <= 22; k++) { const t = k / 22, x = 24 + t * 372; const y2 = 110 - Math.sin(t * Math.PI * 2) * 74; const left = t < .5; const cA = m ? (left ? C.ultra : C.pink) : C.ultra, cB = m ? (left ? C.pink : C.ultra) : C.pink; s += `<circle cx="${x.toFixed(1)}" cy="110" r="6" fill="${cA}"/><circle cx="${x.toFixed(1)}" cy="${y2.toFixed(1)}" r="6" fill="${cB}"/>`; } g.innerHTML = s; el.querySelector('.gst-readout').textContent = m ? 'Now each line breaks in the middle and carries on as the other one. Feels wrong? That’s Good Continuity.' : 'A straight line and a wavy line. Natural.'; };
    draw(0); onSeg(el, (i, b) => { draw(i); api.scene('continuity'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-continuity' }); });
  }
};
D.closure = {
  id: 'gst-closure', title: 'Widen the gaps until the shape falls apart', caption: 'Up to a point, your brain closes the shape by itself. After that, it lets go.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo"><div class="gst-stage">${svg('0 0 420 220', `<g class="gst-clo" fill="none" stroke="${C.fg}" stroke-width="7" stroke-linecap="butt"></g>`, 'A circle and a square drawn with gaps in their lines')}</div>${range('Gap size', 0, 90, 20)}<p class="gst-readout" aria-live="polite">A circle and a square. Complete, in your head.</p></div>`;
    const g = el.querySelector('.gst-clo'), inp = el.querySelector('input'); let told = false;
    const draw = () => { const v = +inp.value / 100; const C1 = 2 * Math.PI * 70, n = 4; const dash = C1 / n * (1 - v), gap = C1 / n * v; const P = 4 * 130, d2 = P / 4 * (1 - v) * .5, g2 = P / 4 * v * .5; g.innerHTML = `<circle cx="110" cy="110" r="70" stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}" transform="rotate(-20 110 110)"/><rect x="245" y="45" width="130" height="130" stroke="${C.ultra}" stroke-dasharray="${d2.toFixed(1)} ${g2.toFixed(1)}" stroke-dashoffset="${(-g2 / 2 - d2 / 2).toFixed(1)}"/>`; el.querySelector('.gst-readout').textContent = v < .45 ? 'A circle and a square. Complete, in your head.' : v < .7 ? 'Still there… but your brain is working harder to close them.' : 'Now it’s scattered pieces. The shape fell apart.'; };
    inp.addEventListener('input', () => { draw(); if (!told) { told = true; api.scene('closure'); } if (+inp.value > 80) api.award(5, { from: inp, key: 'demo:gst-closure' }); });
    draw();
  }
};
D.simplicity = {
  id: 'gst-simplicity', title: 'Take it apart… put it back', caption: 'At first glance your brain read the complex shape as 3 simple ones. And it read the pieces as a word.',
  mount(el, api) {
    const logo = `<g class="gst-logo" fill="${C.fg}">
      <rect class="f" x="40" y="150" width="14" height="60"/><rect class="f" x="58" y="196" width="30" height="14"/>
      <path class="f" d="M128 152a30 30 0 0 0 0 58v-14a16 16 0 0 1 0-30Z"/><path class="f" d="M134 152a30 30 0 0 1 0 58v-14a16 16 0 0 0 0-30Z"/>
      <path class="f" d="M206 152a30 30 0 0 0 0 58v-14a16 16 0 0 1 0-30Z"/><path class="f" d="M212 196h16v14h-16Z"/><path class="f" d="M218 178h18v32h-14v-18h-4Z"/>
      <path class="f" d="M282 152a30 30 0 0 0 0 58v-14a16 16 0 0 1 0-30Z"/><path class="f" d="M288 152a30 30 0 0 1 0 58v-14a16 16 0 0 0 0-30Z"/></g>`;
    el.innerHTML = `<div class="gst-demo">${seg('State', ['Together', 'Take apart'])}<div class="gst-stage">${svg('0 0 340 230', `<g class="gst-simp" fill="${C.ultra}"><rect class="a" x="90" y="34" width="80" height="62"/><path class="b" d="M168 22L226 112H110Z"/><circle class="c" cx="128" cy="100" r="36"/></g>${logo}`, 'A square, a triangle and a circle overlapping, with pieces below them that spell the word logo')}</div><p class="gst-readout" aria-live="polite">A square, a triangle and a circle… and the word <b>logo</b>.</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.gst-simp').classList.toggle('apart', i === 1); el.querySelector('.gst-logo').classList.toggle('apart', i === 1); el.querySelector('.gst-readout').innerHTML = i ? 'On their own, the pieces mean nothing. Not one of them is a whole letter. The meaning was in the combination.' : 'A square, a triangle and a circle… and the word <b>logo</b>.'; api.scene('simplicity'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-simplicity' }); });
  }
};
D.fate = {
  id: 'gst-fate', title: 'The ones that move together', caption: 'Before the movement: columns (proximity). After it: the dots that move together become a group of their own.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('Motion', ['Still', 'Move'])}<div class="gst-stage">${svg('0 0 420 220', `<g class="gst-fate"></g>`, 'Dots in a grid, some of them moving together')}</div><p class="gst-readout" aria-live="polite">Still dots in columns.</p></div>`;
    const g = el.querySelector('.gst-fate'); let s = ''; for (let rr = 0; rr < 4; rr++) for (let c = 0; c < 7; c++) { const mov = (c + rr) % 3 === 0; s += `<circle cx="${60 + c * 50}" cy="${48 + rr * 42}" r="9" fill="${C.fg}" class="${mov ? 'mov' : ''}"/>`; } g.innerHTML = s;
    const movers = [...g.querySelectorAll('.mov')]; let raf = 0, on = false, t0 = 0;
    const loop = t => { if (!on) return; const dy = Math.sin((t - t0) / 380) * 16; movers.forEach(c => c.style.transform = `translateY(${dy.toFixed(1)}px)`); raf = requestAnimationFrame(loop); };
    onSeg(el, (i, b) => { on = i === 1; cancelAnimationFrame(raf); if (on) { if (reduced()) movers.forEach(c => c.style.transform = 'translateY(-14px)'); else { t0 = performance.now(); raf = requestAnimationFrame(loop); } movers.forEach(c => c.setAttribute('fill', C.pink)); } else { movers.forEach(c => { c.style.transform = ''; c.setAttribute('fill', C.fg); }); } el.querySelector('.gst-readout').textContent = on ? 'The pink dots move together, so they become a group. Even though they aren’t next to each other.' : 'Still dots in columns.'; api.scene('commonFate'); api.sfx('pop'); if (on) api.award(5, { from: b, key: 'demo:gst-fate' }); });
    return () => { on = false; cancelAnimationFrame(raf); };
  }
};
D.connect = {
  id: 'gst-connect', title: 'One line changes the group', caption: 'Without lines: circles go with circles, squares with squares. With one line: each circle now goes with the square next to it.',
  mount(el, api) {
    let s = ''; for (let k = 0; k < 8; k++) { const x = 40 + k * 48; s += k % 2 ? `<rect x="${x - 13}" y="97" width="26" height="26" fill="${C.fg}"/>` : `<circle cx="${x}" cy="110" r="14" fill="${C.fg}"/>`; }
    let lines = ''; for (let k = 0; k < 8; k += 2) lines += `<path d="M${40 + k * 48} 110H${40 + (k + 1) * 48}" />`;
    el.innerHTML = `<div class="gst-demo">${seg('Lines', ['No lines', 'Connect'])}<div class="gst-stage">${svg('0 0 420 220', `<g class="gst-lines" stroke="${C.ultra}" stroke-width="4">${lines}</g>${s}`, 'Circles and squares in a row, then lines joining each circle to a square', 'gst-con')}</div><p class="gst-readout" aria-live="polite">Circles with circles, squares with squares (similarity).</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.gst-con').classList.toggle('on', i === 1); el.querySelector('.gst-readout').textContent = i ? 'Now it’s 4 pairs. The line beat similarity. That’s Connection.' : 'Circles with circles, squares with squares (similarity).'; api.scene('connection'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-connect' }); });
  }
};
D.symmetry = {
  id: 'gst-symmetry', title: 'Mirror = closed shape', caption: 'When the two sides mirror each other, you see one closed shape. When they don’t match, you see loose marks.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('Brackets', ['Mirrored', 'Not mirrored'])}<div class="gst-stage">${svg('0 0 420 170', `<text class="gst-br" x="210" y="112" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-weight="300" font-size="92" fill="${C.fg}" direction="ltr" unicode-bidi="bidi-override">[ ]  { }  [ ]</text>`, 'Brackets, mirrored or not')}</div><p class="gst-readout" aria-live="polite">3 closed shapes.</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.gst-br').textContent = i ? '[ }  { ]  ] [' : '[ ]  { }  [ ]'; el.querySelector('.gst-readout').textContent = i ? 'Now they’re scattered marks. Not a single closed shape.' : '3 closed shapes.'; api.scene('symmetry'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-symmetry' }); });
  }
};
const demo = k => ({ t: 'demo', ...D[k] });

/* ---------- the lesson ---------- */
export default {
  zone: 'gestalt',
  hero: { say: 'The biggest part of the quiz, and the best part too. Here you’ll find out that your eyes don’t see. Your **brain** does.' },
  chapters: [
    {
      id: 'gst-start', title: 'Before we start: design isn’t decoration', en: 'Before we Start', ref: 'L03 · S4', scene: 'nebula',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'If design were just a pretty arrangement, we’d be decorators, not designers. The lecture opens with exactly that question.' },
        { t: 'p', text: 'The professor opens the lecture with an idea. If our only job were to arrange things nicely, form alone would be enough. Even with no meaning at all.' },
        { t: 'p', text: 'Then design would be **decorating**, not **communicating**. And the slide says it plainly: graphic design is much more than form.' },
        { t: 'quote', text: 'If a graphic designer had only to organize information into pleasing arrangements, then the aesthetic use of form, devoid of any meaning, would be all that’s required of our job. Graphic design would be more about decorating than communicating. However, as you have already seen, graphic design is much more than form.', ref: 'L03 · S4', ar: 'In short: if the job were only pretty arrangements, design would be decorating, not communicating. But design is much more than form.' },
        { t: 'trap', text: 'A **Complete** question may swap the two words around. Watch the order.', wrong: '…more about communicating than decorating', right: '…more about decorating than communicating — that’s if design were only pretty arrangements' },
        { t: 'h', text: 'So where does Gestalt come in?', en: 'Definition' },
        { t: 'p', text: 'Gestalt is the set of laws that explain how the brain sees. In other words, how it organizes what’s in front of it before it understands it.' },
        { t: 'quote', text: 'Gestalt Principles are principles/laws of human perception that describe how humans group similar elements, recognize patterns and simplify complex images when we perceive objects.', ref: 'L03 · S4' },
        { t: 'list', style: 'num', items: ['It **groups** similar elements: things that look alike go together.', 'It **recognizes** patterns: it looks for order.', 'It **simplifies** complex images: a busy picture gets read in the easiest way.'] },
        demo('organize'),
        { t: 'quote', text: 'Designers use the principles to organize content on Advertising and other media, so it is aesthetically pleasing and easy to understand.', ref: 'L03 · S4', ar: 'In short: designers use them so the content looks good and is easy to understand, both at once.' },
        { t: 'example', title: 'Your WhatsApp chat', text: 'Your messages sit on one side, in one color. Your friend’s sit on the other side, in another color. Messages sent back to back stick together, and there’s a gap between one day and the next. You know who said what without reading a word. That’s Gestalt at work: similarity, proximity and simplicity.', art: chatArt },
        { t: 'why', text: 'Your brain takes in a huge amount of information every second. If it analyzed every dot on its own, it would shut down. So it takes shortcuts: it groups, looks for order and simplifies. A smart designer arranges the design the way the brain already likes to work.' },
        { t: 'tip', text: 'Gestalt = the brain does 3 things: **groups, finds patterns, simplifies**. Designers use it so the work is **pleasing and easy to understand**.' },
        { t: 'check', q: 'gi06' }, { t: 'check', q: 'gi07' }, { t: 'check', q: 'gi08' }
      ]
    },
    {
      id: 'gst-about', title: 'Gestalt means “the whole”', en: 'About Gestalt Theories of Visual Perception', ref: 'L03 · S5, S12–S13', scene: 'halftone',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'A German word that’s hard to pronounce, with a very simple meaning: a unified whole.' },
        { t: 'quote', text: 'Gestalt means "unified whole". It refers to theories of visual perception developed by a group of German psychologists in the 1920s.', ref: 'L03 · S5', ar: 'In short: Gestalt = a unified whole. Theories of visual perception from German psychologists in the 1920s.' },
        { t: 'art', html: timelineArt, caption: 'The slide says: 1922 — Wertheimer, Koffka and Köhler, developers of Gestalt Psychology.' },
        { t: 'p', text: 'The three names can show up as answer choices: **Max Wertheimer**, **Kurt Koffka** and **Wolfgang Köhler**. You don’t need to know anything more about them.' },
        { t: 'quote', text: 'These theories describe how people tend to organize visual elements into groups or unified wholes when certain principles are applied. How the brain perceives complex surroundings and converts this information to easier to process unitary information.', ref: 'L03 · S5', ar: 'In short: people organize what they see into groups, or wholes. And the brain turns a crowded scene into easier units.' },
        { t: 'p', text: 'Watch that last sentence. It’s also the lecture’s subtitle: the brain sees a complex world and converts it into **unitary information**. That means simple information that comes as one unit.' },
        { t: 'check', q: 'gi01' }, { t: 'check', q: 'gi03' }, { t: 'check', q: 'gi05' },
        { t: 'h', text: 'The clearest example', en: 'Halftone dots' },
        { t: 'p', text: 'Hold any newspaper photo close to your eye. It’s tiny dots of different sizes. Move it back a little… the dots disappear and become a picture.' },
        { t: 'quote', text: 'When you see individual halftone dots together, your eyes form them into a complete picture. This phenomenon would be considered a visual form of gestalt, seeing a whole that is made of individual parts.', ref: 'L03 · S13' },
        demo('halftone'),
        { t: 'check', q: 'gi18' },
        { t: 'h', text: 'A design is made of layers', en: 'Idea · Form · Image · Context' },
        { t: 'quote', text: 'On a broader level, a design is built of many layers—idea, form, image, and context—but with a total graphic design concept in mind. The gestalt, the goal, unifies the parts, forming a complete and unified message.', ref: 'L03 · S13' },
        { t: 'art', html: layersArt, caption: '4 layers. The gestalt is the goal that pulls them together.' },
        { t: 'example', title: 'A concert poster at college', text: 'Idea: a rock concert. Form: sharp lines. Image: a guitar. Context: a wall next to the cafeteria, with people hurrying past. If each layer works on its own, the poster falls apart. The gestalt here is the goal that makes all four say one sentence.' },
        { t: 'check', q: 'gi19' },
        { t: 'h', text: 'The equation', en: 'Creative Thought + Gestalt Laws = Good Design' },
        { t: 'art', html: formulaArt },
        { t: 'quote', text: 'Gestalt Principles can really help in focusing attention and organizing contents in an effective way.', ref: 'L03 · S12' },
        { t: 'why', text: 'Creativity alone can make something beautiful that nobody understands. The laws alone make something organized but boring. Both together = a design that gets its message across.' },
        { t: 'trap', text: 'The “who developed it?” question will give you smart-looking wrong choices.', wrong: 'Bauhaus designers in the 1950s', right: 'A group of German psychologists in the 1920s' },
        { t: 'tip', text: 'Gestalt = **the whole**. Germans. **The 1920s**. 3 names in 1922. And halftone = dots → a picture.' },
        { t: 'check', q: 'gi21' },
        { t: 'check', q: 'gi22' }
      ]
    },
    {
      id: 'gst-perception', title: 'Perception: your brain solves a puzzle', en: 'What is Perception?', ref: 'L03 · S6–S11', scene: 'eyeBare',
      blocks: [
        { t: 'say', who: 'eye', text: 'Your eye is a camera. But your brain is the one that decides what the picture means.' },
        { t: 'quote', text: 'Perception is an active process. Human cognition simplifies an enormous range of stimuli into understandable units.', ref: 'L03 · S6', ar: 'In short: perception is active. The brain simplifies a huge amount of stimuli into units it can understand.' },
        { t: 'p', text: 'The key word here is **active**. Perception isn’t just receiving the picture. The brain works on it: it selects, organizes and interprets.' },
        { t: 'trap', text: 'True or false: “Perception is a passive process.”', wrong: 'True — the eye takes the picture and the brain just receives it', right: 'False — Perception is an active process' },
        { t: 'quote', text: 'It merges what we see with what we know to build a coherent understanding of the world. Building on memory and experience, the brain fills in gaps and filters out extraneous data.', ref: 'L03 · S6' },
        { t: 'list', style: 'dot', items: ['It **merges** what we see with what we know.', 'It **builds on** memory and experience.', 'It **fills in** gaps.', 'It **filters out** extraneous data: the extra stuff it doesn’t need.'] },
        demo('context'),
        { t: 'check', q: 'gi11' }, { t: 'check', q: 'gi12' },
        { t: 'quote', text: 'With perception, the mind is trying to solve a puzzle—to interpret what the arrangements of shapes and colors mean. This interpretation depends on many factors, from the viewer’s memories, culture, and mood to the design’s context, form, and style.', ref: 'L03 · S6' },
        { t: 'compare', left: { title: 'The viewer', en: 'what they bring', text: 'Their **memories**, **culture** and **mood**.' }, right: { title: 'The design', en: 'what it brings', text: 'Its **context**, **form** and **style**.' }, note: 'Interpreting any design = what the viewer brings + what the design brings.' },
        { t: 'quote', text: 'A designer must, therefore, carefully consider every element he chooses, so the viewer can translate the design’s code properly.', ref: 'L03 · S6', ar: 'In short: that’s why a designer chooses every element with care, so the viewer can crack the design’s “code” correctly.' },
        { t: 'check', q: 'gi13' },
        { t: 'h', text: 'The pictures in the slides', en: 'Arcimboldo · W.E. Hill 1915 · German postcard 1880' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'Arcimboldo', en: 'Giuseppe Arcimboldo · 16th c.', text: 'A 16th-century painting: fruit and vegetables forming a face. Apart, just vegetables. Together, a new whole.', color: C.sun },
          { title: 'Young girl or old woman?', en: 'W.E. Hill, 1915', text: 'One drawing: you see a young girl looking away, or an old woman. Same lines, two readings.', color: C.ultra },
          { title: 'A German postcard', en: 'German postcard, 1880', text: 'An older take on the same idea. The next slides add the famous “duck or rabbit?” drawing.', color: C.pink }
        ] },
        { t: 'example', title: 'The fava-bean cart at dawn', text: 'From far away, in the dark before sunrise, you see a big pot, a yellow light and people standing around. You haven’t read a single word yet. But your brain has already decided: the foul cart, breakfast. Your memory and your culture interpreted the shape before any reading.' },
        { t: 'why', text: 'The brain can’t stand something meaningless. As soon as it sees a shape, it searches its memory for something similar. If it finds a match, it relaxes. If it doesn’t, it fills in the rest by itself.' },
        { t: 'tip', text: 'Perception = **active**. It merges + fills in + filters. And interpretation = **the viewer** (memories, culture, mood) + **the design** (context, form, style).' },
        { t: 'check', q: 'gi15' }, { t: 'check', q: 'gi16' }
      ]
    },
    {
      id: 'gst-ideas-1', title: 'Two ideas: the whole first… and the brain fills in', en: 'Key ideas · Emergence & Reification', ref: 'L03 · S14–S17', scene: 'emergence',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'The slides have 4 **Key Ideas**. Careful: these are **ideas**, not **laws**. And the exam loves to mix them up.' },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'Emergence', en: 'key idea 1', text: 'The whole is identified before the parts — whole first, details later.', color: C.pink },
          { title: 'Reification', en: 'key idea 2', text: 'Our mind fills in the gaps — you see more than is drawn.', color: C.ultra },
          { title: 'Multi-stability', en: 'key idea 3', text: 'The mind seeks to avoid uncertainty — it picks one reading, then flips.', color: C.sun },
          { title: 'Invariance', en: 'key idea 4', text: 'We’re good at recognizing similarities and differences — any angle, any size.', color: C.good }
        ] },
        { t: 'h', text: 'Emergence', en: 'The whole is identified before the parts' },
        { t: 'quote', text: 'EMERGENCE (The whole is identified before the parts). Emergence is the process of forming complex patterns from simple rules. When attempting to identify an object, we first seek to identify its outline. We then match this outline pattern against shapes and objects we already know to find a match.', ref: 'L03 · S14', ar: 'In short: you see the whole first. The parts come later.' },
        { t: 'list', style: 'num', items: ['First, the brain looks for the **outline**.', 'Then it matches that outline against shapes it already knows.', 'Once it finds a match, it knows what the thing is. The details come later.'] },
        demo('emergence'),
        { t: 'example', title: 'The slide: a rose, some blobs and a letter', text: 'On the slide: a rose silhouette, scattered black blobs that turn into a Dalmatian dog, and a pink letter U made of circles. In all three you see the whole first, and only then notice it’s made of pieces.' },
        { t: 'trap', text: 'True or false: “In emergence, we identify the parts first and then build the whole.”', wrong: 'True', right: 'False — the whole is identified before the parts' },
        { t: 'check', q: 'gk01' }, { t: 'check', q: 'gk06' }, { t: 'check', q: 'gk17' },
        { t: 'h', text: 'Reification', en: 'Our mind fills in the gaps' },
        { t: 'quote', text: 'REIFICATION (Our mind fills in the gaps). Reification is an aspect of perception in which the object as perceived contains more spatial information than what is actually present. As we attempt to match what we see to the familiar patterns we have stored in memory, there isn’t always an exact match.', ref: 'L03 · S16', ar: 'In short: your mind fills in what’s missing, so you see more than what’s really there.' },
        { t: 'p', text: 'So you see **more** than what’s actually drawn. Why? The brain compares what it sees with what’s in its memory. When it can’t find an exact match, it fills in the missing part by itself.' },
        demo('kanizsa'),
        { t: 'example', title: 'A half-dead neon sign', text: 'A shop sign in Downtown Cairo with half its letters burnt out. You still read it. Your brain filled in the missing letters from memory. That’s exactly what happens with “ˈnvˈsˈble or vˈsˈble?” on the slide.' },
        { t: 'why', text: 'The brain hates anything incomplete. Whatever is missing, it completes with the closest thing it knows. That saves time and energy, but it also makes it see things that aren’t there.' },
        { t: 'trap', text: 'Reification or Closure? Both are “the brain fills in”. The difference is in the kind of question: if it asks about the **key ideas**, it’s Reification. If it asks about the **laws**, it’s Closure.', wrong: 'Closure is one of the 4 key ideas', right: 'Reification = key idea · Closure = law' },
        { t: 'tip', text: '**E**mergence = **E**ntire first: the whole comes first. **R**eification = **R**efill: fill in what’s missing.' },
        { t: 'check', q: 'gk02' }, { t: 'check', q: 'gk08' }, { t: 'check', q: 'gk13' }, { t: 'check', q: 'gk19' }
      ]
    },
    {
      id: 'gst-ideas-2', title: 'Two pictures in one, and a shape you know from any angle', en: 'Key ideas · Multi-stability & Invariance', ref: 'L03 · S18–S21', scene: 'necker',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'Two ideas that are almost opposites. One: **one** picture that reads **two** ways. The other: **many** changing shapes, and you know they’re **one** thing.' },
        { t: 'h', text: 'Multi-stability', en: 'The mind seeks to avoid uncertainty' },
        { t: 'quote', text: 'MULTI-STABILITY (The mind seeks to avoid uncertainty). Multi-stability is the tendency of ambiguous perceptual experiences to move unstably back and forth between alternative interpretations. Some objects can be perceived in more than one way.', ref: 'L03 · S18', ar: 'In short: the mind hates not knowing, so it settles on one reading… then flips to the other.' },
        { t: 'p', text: 'The picture itself isn’t settled. It has two interpretations. The brain can’t sit in the middle, because it hates uncertainty. So it picks one. A moment later, it flips to the other. And so on.' },
        demo('multi'),
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'The cube', en: 'Same square shape – different perspectives', text: 'A line cube: first this face is in front, then the other. The slide calls it an example of multistability.', color: C.fg },
          { title: 'The vase and two faces', en: 'Rubin’s face/vase', text: 'The black is a vase. The white around it is two faces, nose to nose. The slide labels it RUBENS FACE.', color: C.ultra },
          { title: 'The dancing girl', en: 'Dancing girl', text: 'A spinning silhouette: one moment she turns right, the next left. The picture itself has no direction.', color: C.pink }
        ] },
        { t: 'example', title: 'A T-shirt with arrows', text: 'A T-shirt printed with interlocking white and black arrows. One moment you see the white ones pointing right, the next the black ones pointing left. Your brain jumps between the two readings, and it can’t see both at the same moment.' },
        { t: 'trap', text: 'In the slides, the vase and two faces is an example of **Multi-stability** (S19): the picture flips between two readings. The slides’ **Figure/Ground** examples are different ones: the balusters (S23) and the tree with the doves (S27).', wrong: 'Vase ↔ two faces flipping = Invariance', right: 'Flipping between two readings = Multi-stability' },
        { t: 'check', q: 'gk10' }, { t: 'check', q: 'gk15' }, { t: 'check', q: 'gk18' },
        { t: 'h', text: 'Invariance', en: 'We’re good at recognizing similarities and differences' },
        { t: 'quote', text: 'INVARIANCE (We’re good at recognizing similarities and differences). Invariance is a property of perception in which simple objects are recognized independent of their rotation, translation and scale. Since we often encounter objects from different perspectives, we’ve developed an ability to recognize them despite their different appearance.', ref: 'L03 · S20', ar: 'In short: turn it, move it, resize it, and you still recognize it.' },
        { t: 'list', style: 'dot', items: ['**Rotation** = turning it', '**Translation** = moving it from one place to another', '**Scale** = making it bigger or smaller'] },
        demo('invariance'),
        { t: 'example', title: 'The college logo on a mug, a pen and a poster', text: 'The same logo: wrapped around a mug, tiny on a pen, in the corner of a poster. You recognize it in all three. That’s Invariance. And that’s why a good logo has to be recognizable from any angle, at any size.' },
        { t: 'why', text: 'All day long we see things from different angles. A glass seen from above is a circle; from the side, it’s a rectangle. If the brain didn’t hold on to the object, every new angle would be a new thing.' },
        { t: 'trap', text: 'Multi-stability or Invariance? Multi = **one picture, two readings**. Invariance = **changing shapes, one thing**.', wrong: 'Invariance — one image, two readings', right: 'Invariance — rotation, translation, scale; you still recognize it' },
        { t: 'tip', text: '**Multi** = many readings. **In-variance** = no variance in recognizing it: turn it, move it, resize it… it’s still the same thing.' },
        { t: 'check', q: 'gk11' }, { t: 'check', q: 'gk16' }, { t: 'check', q: 'gk24' }
      ]
    },
    {
      id: 'gst-laws-1', title: 'The laws at a glance + Proximity and Similarity', en: 'Gestalt Laws · Proximity & Similarity', ref: 'L03 · S24–S26', scene: 'proximity',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'Here come the laws themselves. 6 main ones and 3 added. Learn the count before the names, because the exam asks about it.' },
        { t: 'compare', left: { title: 'The main laws (6)', en: 'The Main Gestalt Laws', text: 'Proximity\u00a0/\u00a0Grouping\u00a0· Similarity\u00a0· Figure\u00a0and\u00a0Ground\u00a0· Good\u00a0Continuity\u00a0· Closure\u00a0· Simplicity' }, right: { title: 'Added principles (3)', en: 'Other Add Principles', text: 'Common\u00a0Fate\u00a0· Connection\u00a0· Symmetry' }, note: '6 + 3 = 9. Only the ones on the **Other Add Principles** card count as “added”.' },
        { t: 'trap', text: 'A **NOT** question: which one is **not** an added principle?', wrong: 'Proximity is an added principle', right: 'Added = Common Fate, Connection, Symmetry only' },
        { t: 'check', q: 'gl31' }, { t: 'check', q: 'gl30' },
        { t: 'h', text: 'Proximity', en: 'Law of Proximity / Grouping' },
        { t: 'quote', text: 'PROXIMITY where Elements that are placed close to each other will often be perceived as one group. When the dots are placed close to each other in groups, we tend to perceive 3 columns rather than a whole group of dots.', ref: 'L03 · S25' },
        demo('proximity'),
        { t: 'example', title: 'The menu at a koshary shop', text: 'The dish name, the price and the description sit tight together. Between one dish and the next, there’s a gap. Your eye understands that each set of 3 lines is one item. If all the gaps were equal, the menu would be a mess.' },
        { t: 'example', title: 'In the slides', text: 'A photo of a statue raising its arm in front of a basketball hoop, with the ball in the air above the hoop. Because the hand and the ball are close together in the picture, the brain links them, and it looks like the statue just took the shot. The slide labels it **Law of Proximity**.' },
        { t: 'check', q: 'gl02' }, { t: 'check', q: 'gl32' }, { t: 'check', q: 'gl40' },
        { t: 'h', text: 'Similarity', en: 'Law of Similarity' },
        { t: 'quote', text: 'SIMILARITY where Objects that look alike, with similar components or attributes, are more likely to be organized together.', ref: 'L03 · S26' },
        demo('similarity'),
        { t: 'example', title: 'The Cairo derby', text: 'The stands hold thousands. But you see two crowds, not thousands of separate people. Why? The shirt colors. All the red is one group, and all the white is another. That’s Similarity at its biggest.' },
        { t: 'why', text: 'Grouping saves the brain effort. Instead of dealing with 36 dots, it deals with 3 columns. Easier and faster.' },
        { t: 'trap', text: 'Proximity or Similarity? If the elements are **identical** and only their **positions** differ: proximity. If the **spacing is equal** and they differ in **color or shape**: similarity.', wrong: 'Identical dots, grouped by spacing = Similarity', right: 'Identical dots, grouped by spacing = Proximity' },
        { t: 'tip', text: '**Proximity** = close to each other. **Similarity** = like each other. The first is about **distance**, the second is about **looks**.' },
        { t: 'check', q: 'gl04' }, { t: 'check', q: 'gl33' }
      ]
    },
    {
      id: 'gst-figure', title: 'Figure and ground', en: 'Law of Figure and Ground', ref: 'L03 · S27', scene: 'figureGround',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'Every design has something that’s “the subject” and something “around it”. The brain has to decide which is which. And a clever designer makes it decide both ways.' },
        { t: 'quote', text: 'FIGURE/GROUND principle is based upon the relationship between an object and the surrounding space. Figure/ground is also referred to as positive and negative space, the positive being the object and the negative referring to the space around it.', ref: 'L03 · S27' },
        { t: 'compare', left: { title: 'Figure', en: '= positive', text: 'The object itself. What your eye stops on.' }, right: { title: 'Ground', en: '= negative', text: 'The space around the object.' } },
        demo('figure'),
        { t: 'fig', id: 'g-figure', caption: 'This cat isn’t drawn. It’s the space left empty inside the dark shape.' },
        { t: 'example', title: 'The mashrabiya', text: 'A mashrabiya window, the carved wooden screen of old Cairo houses: the wood is the figure and the holes are the ground. But when the sun comes through, the glowing holes become the figure and the wood falls back into ground. Same window, two readings, depending on the light.' },
        { t: 'example', title: 'In the slides', text: 'White balusters, with the spaces between them forming face profiles. And a tree in silhouette, with birds drawn by the empty space. The slide labels them **Law of Figure and Ground**.' },
        { t: 'trap', text: 'True or false: “In figure/ground, ‘negative’ refers to the object itself.”', wrong: 'True', right: 'False — negative = the space around it; positive = the object' },
        { t: 'why', text: 'The brain can’t see both as “the subject” at the same moment. It has to bring one forward and push the other back. Clever design plays with that moment, so you find yourself looking twice.' },
        { t: 'tip', text: '**Positive** = the thing. **Negative** = the nothing around it. **N** as in **Nothing**.' },
        { t: 'check', q: 'gl05' }, { t: 'check', q: 'gl06' }, { t: 'check', q: 'gl07' }, { t: 'check', q: 'gl41' }, { t: 'check', q: 'gl34' }
      ]
    },
    {
      id: 'gst-laws-2', title: 'Continuity and closure', en: 'Good Continuity · Closure', ref: 'L03 · S28–S29', scene: 'continuity',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'Your eye likes to keep following the road, and your brain likes to close shapes. The two laws are related… but they aren’t twins.' },
        { t: 'h', text: 'Continuity', en: 'Good Continuity' },
        { t: 'quote', text: 'GOOD CONTINUITY: Objects will be grouped if they are co-linear, or follow a direction. It predicts the preference for continuous figures. We perceive the figure as two crossed lines instead of 4 lines meeting at the center.', ref: 'L03 · S28' },
        demo('continuity'),
        { t: 'example', title: 'The Cairo Metro map', text: 'Each line is drawn as one continuous line in one color, even where it crosses other lines. Your eye follows the line to its end and doesn’t get lost at the crossings.' },
        { t: 'example', title: 'In the slides', text: 'A photo of football players: one player’s arm looks like it carries on into another player’s body, because they follow the same direction. The slide labels it **Law of Continuity**.' },
        { t: 'check', q: 'gl08' }, { t: 'check', q: 'gl09' }, { t: 'check', q: 'gl36' },
        { t: 'h', text: 'Closure', en: 'Law of Closure' },
        { t: 'quote', text: 'CLOSURE Related to principle of good continuation, there is a tendency to close simple figures, independent of continuity or similarity. This results in a effect of filling in missing information or organizing information which is present to make a whole.', ref: 'L03 · S29' },
        demo('closure'),
        { t: 'example', title: 'A Ramadan lantern on a sign', text: 'A fanous, the Ramadan lantern, drawn with broken lines on a shop sign. The line isn’t complete anywhere, yet you see a whole lantern. Same story with animal logos made of a few black patches, with no outline around them.' },
        { t: 'trap', text: 'Continuity = your eye **follows a direction** (a line, a curve). Closure = your brain **closes an incomplete shape**. The slide says Closure is related to **good continuation**, but it closes shapes **independent of continuity or similarity**.', wrong: 'Closure needs continuity to work', right: 'Closure closes simple figures independent of continuity or similarity' },
        { t: 'tip', text: '**Continuity** = keep following the road. **Closure** = close the door.' },
        { t: 'check', q: 'gl11' }, { t: 'check', q: 'gl12' }, { t: 'check', q: 'gl14' }, { t: 'check', q: 'gl35' }
      ]
    },
    {
      id: 'gst-simplicity', title: 'Simplicity (Prägnanz)', en: 'Law of Simplicity', ref: 'L03 · S30', scene: 'simplicity',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'Your brain is lazy… but in style. It reads anything complicated in the simplest form it can.' },
        { t: 'quote', text: 'SIMPLICITY indicates that our mind perceives everything in its simplest form. The image below, for example, when studied in depth is made up of individual components that have no meaning when viewed separately, yet our mind automatically perceives them in combination to spell out the word ‘logo’.', ref: 'L03 · S30' },
        { t: 'p', text: 'The same law is also called the **Law of Prägnanz**. The slide writes: **Law of Pragnanz or Simplicity**. Both names mean the same law.' },
        demo('simplicity'),
        { t: 'example', title: 'Phone icons', text: 'The camera icon is a rectangle and a circle. No lenses, no buttons. Still, you get it in a split second. And on the slide: a simple chair silhouette next to an ornate chair, and both read as “a chair”.' },
        { t: 'why', text: 'A simple shape is easier to store in memory and quicker to compare. So the brain picks the simplest interpretation first, and only looks at the details later if it needs to.' },
        { t: 'trap', text: 'Simplicity or Emergence? Emergence = **the whole before the parts** (an idea). Simplicity = **the simplest form** (a law). And the ‘logo’ word example belongs to Simplicity.', wrong: 'The ‘logo’ example = Emergence', right: 'The ‘logo’ example = Simplicity (Prägnanz)' },
        { t: 'tip', text: '**Prägnanz** = **Simplicity**. Your brain picks the **shortest explanation**.' },
        { t: 'check', q: 'gl15' }, { t: 'check', q: 'gl16' }, { t: 'check', q: 'gl17' }, { t: 'check', q: 'gl18' }
      ]
    },
    {
      id: 'gst-added', title: 'The three added principles', en: 'Common Fate · Connection · Symmetry', ref: 'L03 · S31–S33', scene: 'commonFate',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'These are the ones the slide calls **Other Add Principles**. Just three… and they’re all easy questions once you get them.' },
        { t: 'h', text: 'Common fate', en: 'Law of Common Fate' },
        { t: 'quote', text: 'COMMON FATE Suppose both principles of proximity and similarity are in place - then a movement takes place - the dots begin to move down the page. They appear to change grouping.', ref: 'L03 · S31' },
        demo('fate'),
        { t: 'example', title: 'Pigeons over the Citadel', text: 'Thousands of pigeons in the sky. The ones flying together in the same direction look like one flock. And on your phone: when you long-press, the icons that wiggle together become a group.' },
        { t: 'check', q: 'gl19' }, { t: 'check', q: 'gl21' },
        { t: 'h', text: 'Connection', en: 'Law of Connection · Connectedness' },
        { t: 'quote', text: 'CONNECTEDNESS We perceive elements as being "united" if they are connected by other elements. An easy way to think about this principle in action is an infographic or flowchart where arrows help connect one figure (or text block) to the next.', ref: 'L03 · S32' },
        demo('connect'),
        { t: 'example', title: 'Applying to university, step by step', text: 'A flowchart: each box is linked to the next one with an arrow. The arrow is what tells you the two steps belong together, even if they look completely different.' },
        { t: 'trap', text: 'If you see “Connectedness — elements that look alike are grouped”: that’s wrong. “Look alike” = Similarity. Connection = **something joins them** (a line, an arrow).', wrong: 'Connectedness — elements that look alike are grouped', right: 'Connectedness — united because they are connected by other elements' },
        { t: 'check', q: 'gl23' }, { t: 'check', q: 'gl39' },
        { t: 'h', text: 'Symmetry', en: 'Law of Symmetry' },
        { t: 'quote', text: 'SYMMETRY The principle of area states that the smaller of two overlapping figures is perceived as figure while the larger is regarded as ground. The principle of the symmetrical figure is that it is seen as a closed figure. Symmetrical contours thus define a figure and isolate it from its ground.', ref: 'L03 · S33' },
        { t: 'list', style: 'dot', items: ['**Principle of area**: when two figures overlap, the smaller = figure and the larger = ground.', 'A **symmetrical figure** is seen as a **closed figure**.', 'Symmetrical contours define the figure and isolate it from its ground.'] },
        demo('symmetry'),
        { t: 'example', title: 'The mosque gate', text: 'A symmetrical gateway: both sides are exactly alike, so you see it as one closed unit. Take one side away, and the feeling of unity falls apart.' },
        { t: 'tip', text: '**Common Fate** = they move together. **Connection** = they’re joined by a line. **Symmetry** = a mirror = a closed shape.' },
        { t: 'check', q: 'gl25' }, { t: 'check', q: 'gl26' }
      ]
    },
    {
      id: 'gst-design', cap: ['Gestalt in ads', 'Logos, posters and the assignment'], title: 'Gestalt in ads, and the assignment', en: 'Design Using Gestalt Perception · Assignment', ref: 'L03 · S22–S23, S38–S48', scene: 'vase',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'None of this is just theory. Advertisers use it to make you look twice.' },
        { t: 'p', text: 'The slides are full of ads and logos. We won’t draw them here. We’ll describe them instead: flip each card to see our reading of the law inside it.' },
        { t: 'grid', cols: 2, flip: true, items: [
          { title: 'A ketchup bottle made of tomato slices', en: 'Heinz · “No one grows ketchup like Heinz”', text: 'Stacked tomato slices make a bottle. No bottle is drawn; your brain groups the slices: Closure + Emergence.', color: C.red },
          { title: 'A tree made of French fries', en: 'McDonald’s · Merry Christmas', text: 'Fries arranged in the shape of a Christmas tree. The parts are fries; the whole is a tree: Emergence + Similarity.', color: C.sun },
          { title: 'A letter made of dozens of icons', en: 'Unilever', text: 'A big letter U made of lots of small icons. You see the letter first, then the icons: Emergence.', color: C.ultra },
          { title: 'Letters made of broken lines', en: 'IBM', text: 'Letters built from broken horizontal lines. No letter is closed, and your brain completes them: Closure.', color: C.ice },
          { title: 'Two profiles, black and yellow', en: 'Criminal Underworld poster', text: 'The black makes one profile, and the yellow around it makes another one: Figure and Ground.', color: C.pink },
          { title: 'A coffee cup = a power switch', en: 'Bake Well · OFF / ON', text: 'Seen from above, the cup’s handle becomes a switch between OFF and ON: Simplicity + Closure.', color: C.good }
        ] },
        { t: 'example', title: 'Other ads in the slides', text: 'A hot sauce bottle fitted with a fire extinguisher’s head and hose (Beware the heat). A fish cut into slices that you still see as one fish. And a milk bottle made entirely of written words. Try to name the law in each one before you move on.' },
        { t: 'h', text: 'The assignment', en: 'Assignment' },
        { t: 'quote', text: 'اختار احد الكائنات الحية (حيوانات برية – طيور - زواحف) — وقم برسمها بعدة معالجات (10 أساليب علي الأقل) مع مراعاة ان تكون الأساليب متنوعة وتتفق مع مبادئ الجشتالط — يرجى مراعاة التنوع بين أساليب المعالجة (التحديد الخارجي – الملىء الداخلي – الزخرفة – الاختزال....الخ) — توضع الرسم جميعها مع الأصل في ملف واحد بصيغة PDF', ref: 'L03 · S44' },
        { t: 'list', style: 'num', items: ['Pick one living creature: a wild animal, a bird or a reptile.', 'Draw it in **at least 10 treatments**: varied, and in line with Gestalt principles.', 'Mix your treatments: outline, inner fill, ornament, reduction… and so on.', 'Put all the drawings **with the original picture** in **one PDF file**.'] },
        { t: 'art', html: fishArt, caption: 'Example: the same fish in ten treatments. Notice that you recognize it in every one: that’s Invariance, Closure and Emergence working together.', wide: true },
        { t: 'tip', text: 'The assignment = **one creature × 10 treatments** + the original, in **one PDF**. The slides show examples: deer, seahorses, turtles, bees, and a bear split into triangles.' },
        { t: 'check', q: 'gl42' }
      ]
    }
  ]
};
