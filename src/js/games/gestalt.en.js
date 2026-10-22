// Gestalt trials: "Name the Law" (reflex) and "Idea or Law?" (sorting the exam's favourite confusion). English edition of gestalt.js.
import { marks } from '../ui/icons.js';
const C = { fg: '#EDEBE6', dim: '#7E7C8B', faint: '#3A3946', ultra: '#4D6BFF', pink: '#FF3E8A', sun: '#FFC21A', good: '#46E3A0', ice: '#7FE7FF' };
const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const svg = (inner, label) => `<svg class="gst-fig" viewBox="0 0 360 220" role="img" aria-label="${label}">${inner}</svg>`;

/* ---------- figure generators (randomised so you learn the law, not the picture) ---------- */
const LAWS = {
  proximity: { en: 'Proximity', why: 'Identical dots. Only the spacing grouped them.' },
  similarity: { en: 'Similarity', why: 'The spacing is equal. The likeness (color or shape) did the grouping.' },
  figure: { en: 'Figure & Ground', why: 'The shape comes out of the empty space: positive and negative.' },
  continuity: { en: 'Good Continuity', why: 'Your eye followed two lines instead of seeing 4 pieces.' },
  closure: { en: 'Closure', why: 'The line is broken, and your brain closed the shape.' },
  simplicity: { en: 'Simplicity', why: 'You saw simple overlapping shapes, not one complicated shape.' },
  fate: { en: 'Common Fate', why: 'The ones moving together became a group.' },
  connection: { en: 'Connection', why: 'The lines joined different shapes into pairs.' },
  symmetry: { en: 'Symmetry', why: 'Each pair of brackets is a mirror = a closed shape.' },
  emergence: { en: 'Emergence', why: 'You saw the letter (the whole) before the dots (the parts).' },
  reification: { en: 'Reification', why: 'The shape in the middle isn’t drawn. Your brain filled it in.' },
  multi: { en: 'Multi-stability', why: 'The picture flips between two readings.' },
  invariance: { en: 'Invariance', why: 'The same shape, rotated, scaled and moved, and you still knew it.' }
};
const CONFUSE = { proximity: ['similarity', 'fate'], similarity: ['proximity', 'connection'], figure: ['multi', 'closure'], continuity: ['closure', 'connection'], closure: ['reification', 'continuity'], simplicity: ['emergence', 'closure'], fate: ['proximity', 'similarity'], connection: ['similarity', 'continuity'], symmetry: ['closure', 'figure'], emergence: ['simplicity', 'reification'], reification: ['closure', 'emergence'], multi: ['invariance', 'figure'], invariance: ['multi', 'similarity'] };
// pairs the slides themselves blur (S17/S29 both "fill the gap"; S33 symmetry "seen as a closed figure"): never offer them together
const NEVER = { closure: ['reification', 'symmetry'], reification: ['closure', 'emergence'], symmetry: ['closure'], emergence: ['reification'] };
function gen(law, r) {
  const pick = a => a[Math.floor(r() * a.length)];
  if (law === 'proximity') { const groups = 2 + Math.floor(r() * 2), per = 2 + Math.floor(r() * 2), rows = 4 + Math.floor(r() * 2); let s = ''; const gw = 300 / groups; for (let g = 0; g < groups; g++) for (let c = 0; c < per; c++) for (let rr = 0; rr < rows; rr++) s += `<circle cx="${(30 + g * gw + c * 22 + (gw - per * 22) / 2).toFixed(1)}" cy="${30 + rr * (160 / (rows - 1))}" r="7" fill="${C.fg}"/>`; return svg(s, 'Identical dots in groups'); }
  if (law === 'similarity') { const byShape = r() < .5, byCol = r() < .5; let s = ''; for (let rr = 0; rr < 5; rr++) for (let c = 0; c < 8; c++) { const alt = byCol ? c % 2 : rr % 2, x = 44 + c * 39, y = 30 + rr * 40; s += byShape && alt ? `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="none" stroke="${C.fg}" stroke-width="2"/>` : `<circle cx="${x}" cy="${y}" r="9" fill="${!byShape && alt ? C.ultra : C.fg}"/>`; } return svg(s, 'An evenly spaced grid of elements that look alike'); }
  if (law === 'figure') { const kind = pick(['arrow', 'circle', 'plus']); let s = ''; for (let rr = 0; rr < 7; rr++) for (let c = 0; c < 11; c++) { const x = 20 + c * 30, y = 12 + rr * 28; const cx = x + 13 - 180, cy = y + 12 - 110; let hole = false; if (kind === 'circle') hole = Math.hypot(cx, cy) < 62; if (kind === 'plus') hole = (Math.abs(cx) < 22 && Math.abs(cy) < 74) || (Math.abs(cy) < 22 && Math.abs(cx) < 80); if (kind === 'arrow') hole = (Math.abs(cy) < 16 && cx > -110 && cx < 30) || (cx >= 20 && cx < 100 && Math.abs(cy) < (100 - cx) * .9); if (!hole) s += `<rect x="${x}" y="${y}" width="26" height="24" rx="2" fill="${C.ultra}"/>`; } return svg(s, 'Squares, with the empty space between them forming a shape'); }
  if (law === 'continuity') { const a = 50 + r() * 40, ph = r() * 2; let s = ''; for (let k = 0; k <= 20; k++) { const t = k / 20, x = 20 + t * 320; s += `<circle cx="${x.toFixed(1)}" cy="${(110 + (r() - .5) * 2).toFixed(1)}" r="5.5" fill="${C.fg}"/><circle cx="${x.toFixed(1)}" cy="${(110 - Math.sin(t * Math.PI * 2 + ph * 0) * a).toFixed(1)}" r="5.5" fill="${C.fg}"/>`; } return svg(s, 'Two lines of dots crossing each other'); }
  if (law === 'closure') { const kind = pick(['circle', 'square', 'triangle']); const g = 14 + r() * 10; let sh; if (kind === 'circle') sh = `<circle cx="180" cy="110" r="76" stroke-dasharray="${(476 / 6 - g).toFixed(1)} ${g.toFixed(1)}"/>`; else if (kind === 'square') sh = `<rect x="105" y="35" width="150" height="150" stroke-dasharray="${(150 / 2 - g).toFixed(1)} ${g.toFixed(1)}" stroke-dashoffset="${(g / 2).toFixed(1)}"/>`; else sh = `<path d="M180 26L268 186H92Z" stroke-dasharray="${(183 / 2 - g).toFixed(1)} ${g.toFixed(1)}"/>`; return svg(`<g fill="none" stroke="${C.fg}" stroke-width="8">${sh}</g>`, 'A shape drawn with a broken line'); }
  if (law === 'simplicity') { const dx = (r() - .5) * 30; return svg(`<g fill="${C.ultra}"><rect x="${110 + dx}" y="40" width="96" height="76"/><path d="M${214 + dx} 26L282 136H146Z"/><circle cx="${150 + dx}" cy="132" r="48"/></g>`, 'Simple overlapping shapes in one color'); }
  if (law === 'fate') { let s = ''; const mod = 2 + Math.floor(r() * 2); for (let rr = 0; rr < 4; rr++) for (let c = 0; c < 8; c++) { const mov = (c + rr * 2) % mod === 0; s += `<circle cx="${40 + c * 40}" cy="${45 + rr * 42}" r="8" fill="${mov ? C.pink : C.fg}" class="${mov ? 'gst-mov' : ''}"/>${mov && reduced() ? `<path d="M${50 + c * 40} ${40 + rr * 42}l8 -10m0 0h-7m7 0v7" stroke="${C.pink}" stroke-width="2" fill="none"/>` : ''}`; } return svg(s, 'Dots, some of them moving together'); }
  if (law === 'connection') { let s = '', l = ''; const n = 4; for (let k = 0; k < n; k++) { const x1 = 30 + k * 84, x2 = x1 + 46, y = 60 + (k % 2) * 90; const aSq = r() < .5; l += `<path d="M${x1} ${y}L${x2} ${y + (k % 2 ? -40 : 40)}" stroke="${C.ultra}" stroke-width="4"/>`; s += aSq ? `<rect x="${x1 - 12}" y="${y - 12}" width="24" height="24" fill="${C.fg}"/><circle cx="${x2}" cy="${y + (k % 2 ? -40 : 40)}" r="13" fill="${C.fg}"/>` : `<circle cx="${x1}" cy="${y}" r="13" fill="${C.fg}"/><rect x="${x2 - 12}" y="${y + (k % 2 ? -40 : 40) - 12}" width="24" height="24" fill="${C.fg}"/>`; } return svg(l + s, 'Different shapes joined by lines'); }
  if (law === 'symmetry') { const prs = [['[', ']'], ['{', '}'], ['(', ')']]; const o = [0, 1, 2].map(() => pick(prs)); return svg(`<text x="180" y="138" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-weight="300" font-size="88" fill="${C.fg}" direction="ltr" unicode-bidi="bidi-override">${o.map(p => p[0] + ' ' + p[1]).join('  ')}</text>`, 'Symmetrical brackets'); }
  if (law === 'emergence') { const L = pick(['U', 'L', 'T', 'H']); const zones = { U: [[110, 40, 30, 120], [220, 40, 30, 120], [110, 140, 140, 30]], L: [[120, 30, 32, 160], [120, 160, 120, 30]], T: [[90, 30, 180, 32], [164, 30, 32, 160]], H: [[100, 30, 30, 160], [230, 30, 30, 160], [100, 95, 160, 30]] }[L]; let s = ''; for (let k = 0; k < 70; k++) { const z = zones[Math.floor(r() * zones.length)]; s += `<circle cx="${(z[0] + r() * z[2]).toFixed(1)}" cy="${(z[1] + r() * z[3]).toFixed(1)}" r="${(3 + r() * 6).toFixed(1)}" fill="${C.pink}"/>`; } return svg(s, 'Dots forming a letter'); }
  if (law === 'reification') { const sq = r() < .5; const V = sq ? [[120, 50], [240, 50], [240, 170], [120, 170]] : [[180, 30], [90, 190], [270, 190]]; const R = 30; let s = ''; V.forEach(([x, y], k) => { const n1 = V[(k + 1) % V.length], n2 = V[(k + V.length - 1) % V.length]; const a1 = Math.atan2(n1[1] - y, n1[0] - x), a2 = Math.atan2(n2[1] - y, n2[0] - x); let lo = Math.min(a1, a2), hi = Math.max(a1, a2); if (hi - lo > Math.PI) { const t = lo; lo = hi; hi = t + Math.PI * 2; } const p = a => `${(x + Math.cos(a) * R).toFixed(1)} ${(y + Math.sin(a) * R).toFixed(1)}`; s += `<path d="M${x} ${y}L${p(hi)}A${R} ${R} 0 1 1 ${p(lo)}Z" fill="${C.ultra}"/>`; }); return svg(s, 'Cut circles with an illusory shape between them'); }
  if (law === 'multi') { const s0 = 90 + r() * 30, ox = 40 + r() * 20; const a = [110, 70], b = [110 + ox, 70 - ox * .7]; const sq = o => `M${o[0]} ${o[1]}h${s0}v${s0}h${-s0}Z`; return svg(`<g fill="none" stroke="${C.fg}" stroke-width="2.5"><path d="${sq(a)}"/><path d="${sq(b)}"/><path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}M${a[0] + s0} ${a[1]}L${b[0] + s0} ${b[1]}M${a[0] + s0} ${a[1] + s0}L${b[0] + s0} ${b[1] + s0}M${a[0]} ${a[1] + s0}L${b[0]} ${b[1] + s0}"/></g>`, 'A line cube that can be read from above or from below'); }
  if (law === 'invariance') { const base = 'M-22 -30L26 -30L26 -8L4 -8L4 34L-22 34Z'; const t = [[70, 110, 0, 1], [180, 105, 60 + r() * 60, 1.35], [292, 112, -130 - r() * 30, .7]]; return svg(t.map(([x, y, a, s]) => `<path d="${base}" transform="translate(${x} ${y}) rotate(${a.toFixed(0)}) scale(${s})" fill="${C.ultra}"/>`).join(''), 'The same shape 3 times, in different positions'); }
  return svg('', '');
}
const shuffle = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- shared bits ---------- */
function endScreen(el, api, ctx, { id, score, max, title, line, misses }) {
  const r = api.finishGame(id, score, max, el.querySelector('.g-card') || el);
  el.innerHTML = `<div class="g-card g-end gst-end">
    <span class="glyph">${api.GLYPH.kanizsa}</span>
    <p class="label">Score</p>
    <div class="gst-end__score"><span class="hud-num">${score}</span><span class="hud-num gst-end__of">/${max}</span></div>
    <h3>${title}</h3>
    <p class="gst-end__line">${line}</p>
    <div class="gst-end__marks">${marks(r.stars, 3, 'marks--big')}</div>
    <p><span class="chip chip--zone"><span class="hud-num" dir="ltr">+${r.xp} XP</span></span></p>
    ${misses.length ? `<div class="gst-miss"><p class="label">Review these</p><ul>${misses.map(m => `<li>${m}</li>`).join('')}</ul></div>` : ''}
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">Play again</button><button type="button" class="btn" data-a="back">All trials</button></div>
  </div>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  el.querySelector('[data-a="again"]').focus({ preventScroll: true });
}
function timer(fill, ms, onEnd) { // returns stop()
  let raf = 0, t0 = performance.now(), dead = false;
  const tick = t => { if (dead) return; const p = Math.max(0, 1 - (t - t0) / ms); fill.style.setProperty('--t', p.toFixed(3)); if (p <= 0) { dead = true; onEnd(); return; } raf = requestAnimationFrame(tick); };
  raf = requestAnimationFrame(tick);
  return () => { dead = true; cancelAnimationFrame(raf); };
}

/* ---------- trial 1: Name the Law ---------- */
const reflex = {
  id: 'gestalt-reflex', title: 'Name the Law', en: 'figure → law or idea', how: 'A figure appears, and you have a few seconds to name the law or idea behind it. 3 lives, and a combo speeds up the clock. Keys 1–4 work too.',
  mount(el, api, ctx) {
    const r = api.seeded(Date.now() % 100000);
    const all = Object.keys(LAWS); const MAX = 12;
    let round = 0, lives = 3, score = 0, combo = 0, stop = () => { }, nextT = 0, locked = false; const misses = [];
    const deck = shuffle([...all, ...shuffle(all, r)], r).slice(0, MAX);
    el.innerHTML = `<div class="g-card gst-game">
      <div class="g-hud"><span class="chip">Round <span class="hud-num gst-r">1</span>/<span class="hud-num">${MAX}</span></span><span class="gst-lives" aria-label="Lives"></span><span class="chip gst-combo" hidden>Combo <span class="hud-num">×0</span></span><span class="chip">Score <span class="hud-num gst-s">0</span></span></div>
      <div class="g-timer"><i></i></div>
      <div class="gst-figbox"></div>
      <p class="g-prompt">Which one is this?</p>
      <div class="g-choices gst-opts"></div>
      <p class="gst-why" aria-live="polite"></p>
    </div>`;
    const $ = s => el.querySelector(s);
    const paintLives = () => { $('.gst-lives').innerHTML = [0, 1, 2].map(i => `<i class="${i < lives ? 'on' : ''}"></i>`).join(''); };
    paintLives();
    function show() {
      locked = false; const law = deck[round];
      $('.gst-r').textContent = round + 1; $('.gst-why').textContent = '';
      $('.gst-figbox').innerHTML = gen(law, r);
      const ban = k => (NEVER[law] || []).includes(k);
      const conf = shuffle((CONFUSE[law] || []).filter(k => !ban(k)), r);
      const wrong = [...conf.slice(0, 2), ...shuffle(all.filter(k => k !== law && !conf.includes(k) && !ban(k)), r)].slice(0, 3);
      const opts = shuffle([law, ...wrong.slice(0, 3)], r);
      $('.gst-opts').innerHTML = opts.map((k, i) => `<button type="button" class="g-choice" data-k="${k}"><span class="hud-num gst-key">${i + 1}</span><span dir="ltr">${LAWS[k].en}</span></button>`).join('');
      $('.gst-opts').querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => answer(b.dataset.k, b)));
      const ms = Math.max(4000, 7000 - combo * 300);
      stop = timer($('.g-timer i'), reduced() ? ms * 1.5 : ms, () => answer(null, null));
    }
    function answer(k, btn) {
      if (locked) return; locked = true; stop();
      const law = deck[round]; const ok = k === law;
      el.querySelectorAll('.g-choice').forEach(b => { b.disabled = true; if (b.dataset.k === law) b.classList.add('is-right'); else if (b === btn) b.classList.add('is-wrong'); });
      if (ok) { score++; combo++; api.sfx('good'); api.burst(btn, '#46E3A0'); } else { combo = 0; lives--; misses.push(`<span dir="ltr">${LAWS[law].en}</span> — ${LAWS[law].why}`); api.sfx('bad'); api.shake(el.querySelector('.gst-game')); paintLives(); }
      $('.gst-s').textContent = score; const cb = $('.gst-combo'); cb.hidden = combo < 2; cb.querySelector('.hud-num').textContent = '×' + combo;
      $('.gst-why').innerHTML = `${k === null ? 'Time’s up. ' : ''}<b dir="ltr">${LAWS[law].en}</b> — ${LAWS[law].why}`;
      round++;
      nextT = setTimeout(() => { if (lives <= 0 || round >= MAX) finish(); else show(); }, ok ? 1100 : 1900);
    }
    function finish() {
      const pct = score / MAX;
      endScreen(el, api, ctx, { id: reflex.id, score, max: MAX, misses, title: pct >= .9 ? 'A true Gestalt eye' : pct >= .6 ? 'Your brain is on it' : lives <= 0 ? 'Out of lives' : 'One more round', line: pct >= .9 ? 'You see the law before the figure finishes drawing. You’re ready.' : pct >= .6 ? 'Nice. Focus on the pairs you mix up, then come back.' : 'Go back over the Gestalt lessons, then try again. It will make a difference.' });
    }
    const onKey = e => { if (!el.isConnected) return; const n = '1234'.indexOf(e.key); if (n >= 0) { const b = el.querySelectorAll('.g-choice')[n]; if (b && !b.disabled) { e.preventDefault(); b.click(); } } };
    document.addEventListener('keydown', onKey);
    show();
    return () => { stop(); clearTimeout(nextT); document.removeEventListener('keydown', onKey); };
  }
};

/* ---------- trial 2: Idea or Law? ---------- */
const STATEMENTS = [
  ['The whole is identified before the parts', 'idea', 'Emergence'], ['Forming complex patterns from simple rules', 'idea', 'Emergence'], ['When identifying an object, we first seek its outline', 'idea', 'Emergence'],
  ['Our mind fills in the gaps', 'idea', 'Reification'], ['The object as perceived contains more spatial information than what is actually present', 'idea', 'Reification'], ['ˈnvˈsˈble or vˈsˈble? — you still read it', 'idea', 'Reification'],
  ['The mind seeks to avoid uncertainty', 'idea', 'Multi-stability'], ['Ambiguous images move back and forth between interpretations', 'idea', 'Multi-stability'], ['The dancing girl turns one way, then the other', 'idea', 'Multi-stability'],
  ['Objects are recognized independent of rotation, translation and scale', 'idea', 'Invariance'], ['We’re good at recognizing similarities and differences', 'idea', 'Invariance'],
  ['Elements placed close to each other are perceived as one group', 'law', 'Proximity'], ['Objects that look alike are organized together', 'law', 'Similarity'], ['Positive and negative space', 'law', 'Figure & Ground'],
  ['Objects are grouped if they are co-linear, or follow a direction', 'law', 'Good Continuity'], ['Two crossed lines instead of four lines meeting at the center', 'law', 'Good Continuity'], ['A tendency to close simple figures', 'law', 'Closure'],
  ['Our mind perceives everything in its simplest form', 'law', 'Simplicity'], ['Separate components that combine to spell the word ‘logo’', 'law', 'Simplicity'], ['A movement takes place and the dots change grouping', 'law', 'Common Fate'],
  ['Arrows connect one figure (or text block) to the next', 'law', 'Connection'], ['The smaller of two overlapping figures is perceived as figure', 'law', 'Symmetry']
];
const sorter = {
  id: 'gestalt-sort', title: 'Idea or Law?', en: '4 key ideas vs 9 laws', how: 'The exam loves to mix up the 4 key ideas with the 9 laws. A line from the slides appears: sort it, fast. Left arrow = key idea, right arrow = law.',
  mount(el, api, ctx) {
    const r = api.seeded((Date.now() >> 3) % 100000);
    const ideas = shuffle(STATEMENTS.filter(s => s[1] === 'idea'), r).slice(0, 6), laws = shuffle(STATEMENTS.filter(s => s[1] === 'law'), r).slice(0, 6);
    const deck = shuffle([...ideas, ...laws], r); const MAX = deck.length;
    let i = 0, score = 0, combo = 0, stop = () => { }, nextT = 0, locked = false; const misses = [];
    el.innerHTML = `<div class="g-card gst-game gst-sort">
      <div class="g-hud"><span class="chip">Line <span class="hud-num gst-r">1</span>/<span class="hud-num">${MAX}</span></span><span class="chip gst-combo" hidden>Combo <span class="hud-num">×0</span></span><span class="chip">Score <span class="hud-num gst-s">0</span></span></div>
      <div class="g-timer"><i></i></div>
      <blockquote class="gst-card" dir="ltr"></blockquote>
      <div class="gst-bins"><button type="button" class="gst-bin gst-bin--idea" data-v="idea"><span class="hud-num">←</span><b>Key idea</b><small dir="ltr">one of 4</small></button><button type="button" class="gst-bin gst-bin--law" data-v="law"><span class="hud-num">→</span><b>Law</b><small dir="ltr">one of 9</small></button></div>
      <p class="gst-why" aria-live="polite"></p>
    </div>`;
    const $ = s => el.querySelector(s);
    const bins = [...el.querySelectorAll('.gst-bin')];
    bins.forEach(b => b.addEventListener('click', () => answer(b.dataset.v, b)));
    function show() {
      locked = false; const s = deck[i];
      $('.gst-r').textContent = i + 1; $('.gst-why').textContent = '';
      const card = $('.gst-card'); card.textContent = '“' + s[0] + '”'; card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
      bins.forEach(b => { b.disabled = false; b.classList.remove('is-right', 'is-wrong'); });
      stop = timer($('.g-timer i'), reduced() ? 9000 : Math.max(3800, 6500 - combo * 250), () => answer(null, null));
    }
    function answer(v, btn) {
      if (locked) return; locked = true; stop();
      const s = deck[i], ok = v === s[1];
      bins.forEach(b => { b.disabled = true; if (b.dataset.v === s[1]) b.classList.add('is-right'); else if (b === btn) b.classList.add('is-wrong'); });
      if (ok) { score++; combo++; api.sfx('good'); api.burst(btn, '#46E3A0'); } else { combo = 0; misses.push(`<span dir="ltr">“${s[0]}”</span> → <b dir="ltr">${s[2]}</b> (${s[1] === 'idea' ? 'key idea' : 'law'})`); api.sfx('bad'); api.shake($('.gst-card')); }
      $('.gst-s').textContent = score; const cb = $('.gst-combo'); cb.hidden = combo < 2; cb.querySelector('.hud-num').textContent = '×' + combo;
      $('.gst-why').innerHTML = `${v === null ? 'Time’s up. ' : ''}<b dir="ltr">${s[2]}</b> — ${s[1] === 'idea' ? 'one of the 4 key ideas.' : 'one of the 9 laws.'}`;
      i++;
      nextT = setTimeout(() => { if (i >= MAX) finish(); else show(); }, ok ? 1000 : 1800);
    }
    function finish() {
      const pct = score / MAX;
      endScreen(el, api, ctx, { id: sorter.id, score, max: MAX, misses, title: pct >= .9 ? 'Nobody can fool you' : pct >= .6 ? 'Almost there' : 'Still mixing them up', line: pct >= .9 ? 'A “Which key idea…” question won’t trip you up. 4 ideas, 9 laws.' : 'There are only 4 key ideas: ' + ['Emergence', 'Reification', 'Multi-stability', 'Invariance'].map(w => `<bdi dir="ltr">${w}</bdi>`).join(', ') + '. Anything else = a law.' });
    }
    const onKey = e => { if (!el.isConnected || locked) return; if (e.key === 'ArrowLeft' || e.key === '1') { e.preventDefault(); bins[0].click(); } if (e.key === 'ArrowRight' || e.key === '2') { e.preventDefault(); bins[1].click(); } };
    document.addEventListener('keydown', onKey);
    show();
    return () => { stop(); clearTimeout(nextT); document.removeEventListener('keydown', onKey); };
  }
};

export default [reflex, sorter];
