// Shape zone trials (English edition): Casting (brief → cast the right shape) and Right Pair? (true / false quick-fire).
import { SHAPE_GLYPH, SHAPE_CARDS } from '../content/lessons/shape.en.js';
import { marks } from '../ui/icons.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** phones keep a particle band above the level content: bring the whole trial (and its back bar) into view, so no timed control sits below the fold */
function fitView(el) {
  requestAnimationFrame(() => {
    if (el.getBoundingClientRect().bottom <= innerHeight) return;
    (el.previousElementSibling || el).scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
  });
}
const CARD = Object.fromEntries(SHAPE_CARDS.map(c => [c.k, c]));
const NAME = { ...Object.fromEntries(SHAPE_CARDS.map(c => [c.k, c.ar])), triangleDown: 'Downward triangle', triangle: 'Triangle' };
// the slide's own labels (what the exam uses); the two triangles are told apart by their direction
const SHORT = { circle: 'Circle', square: 'Square / Rectangle', triangle: 'Triangle ▲', triangleDown: 'Triangle ▼', star: 'Star', polygon: 'Polygon / Abstract', organic: 'Organic / Freeform', lines: 'Lines and Arrows', ellipse: 'Ellipse / Oval', combo: 'Geometric Combinations' };
const COLOR = { ...Object.fromEntries(SHAPE_CARDS.map(c => [c.k, c.color])), triangleDown: '#FF4A2E' };

function endScreen(el, api, ctx, id, score, max, lines) {
  el._mgStop?.(); // the finished trial lets go of its timers and keys before the end card (replay remounts without a stop)
  const pct = max ? score / max : 0;
  el.innerHTML = `<div class="g-card g-end">
    <span class="glyph">${api.GLYPH.trio}</span>
    <p class="label">Your score</p>
    <h3><span class="hud-num">${score}</span> / <span class="hud-num">${max}</span></h3>
    <div class="g-end__marks"></div>
    <p>${pct === 1 ? lines[0] : pct >= .6 ? lines[1] : lines[2]}</p>
    <p class="g-end__xp"></p>
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">Play again</button><button type="button" class="btn" data-a="back">All trials</button></div>
  </div>`;
  const r = api.finishGame(id, score, max, el.querySelector('h3'));
  el.querySelector('.g-end__marks').innerHTML = marks(r.stars, 3, 'marks--big');
  el.querySelector('.g-end__xp').innerHTML = `<span class="chip chip--zone"><span class="hud-num" dir="ltr">+${r.xp} XP</span></span>`;
  el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
  el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
  el.querySelector('[data-a="again"]').focus({ preventScroll: true });
}
/** a timer bar driven by rAF; returns stop() */
function timerBar(bar, ms, onEnd) {
  const t0 = performance.now(); let raf = 0;
  const step = now => { const left = 1 - (now - t0) / ms; bar.style.setProperty('--t', Math.max(0, left)); if (left <= 0) onEnd(); else raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/* ---------- 1 · Casting ---------- */
const BRIEFS = [
  { b: 'A bank that wants to look respectable and organized.', a: 'square', why: 'Use squares to convey professionalism and order.' },
  { b: 'Friendly social icons and UI buttons.', a: 'circle', why: 'Circle uses: buttons in UI design, social icons.' },
  { b: 'The play button on a video player.', a: 'triangle', why: 'Triangle uses: play buttons, warning signs, arrows.' },
  { b: 'A warning sign on a highway.', a: 'triangle', why: 'Triangle uses: warning signs.' },
  { b: 'A restaurant rating out of 5.', a: 'star', why: 'Star uses: ratings, awards, festive designs.' },
  { b: 'An “Employee of the Month” badge.', a: 'star', why: 'Star symbolism: achievement, excellence, aspiration.' },
  { b: 'A background for a tech startup’s brand.', a: 'polygon', why: 'Polygon uses: backgrounds, branding for tech or creative industries.', avoid: ['combo'] },
  { b: 'A brand of natural soaps and skincare oils.', a: 'organic', why: 'Organic uses: wellness products. Evokes natural themes.' },
  { b: 'An infographic that walks the eye from step to step.', a: 'lines', why: 'Lines & arrows: guide the eye, create flow (infographics, navigation).' },
  { b: 'A portrait frame in an exhibition.', a: 'ellipse', why: 'Ellipse uses: portrait frames, logo elements, buttons.' },
  { b: 'A logo that tells a layered story and builds a visual metaphor.', a: 'combo', why: 'Combine shapes to tell layered stories or build visual metaphors.' },
  { b: 'A personal-growth coach who wants a symbol for growth.', a: 'triangle', why: 'Use upward triangles for growth.', pair: true },
  { b: 'A symbol that should say “grounding”: steady and heading down to the ground, not rising up.', a: 'triangleDown', why: 'Downward triangles for danger or grounding.', pair: true, avoid: ['square'] },
  { b: 'A grid for a magazine with tidy pages.', a: 'square', why: 'Square uses: layouts, grids, containers.' },
  { b: 'A logo that should feel like unity, protection and wholeness.', a: 'circle', why: 'Circle symbolism: unity, infinity, wholeness, protection.' },
  { b: 'A rigid grid layout that needs something to soften its hard edges.', a: 'organic', why: 'Use organic shapes to soften rigid layouts.', avoid: ['polygon'] },
  { b: 'A festive design for a birthday.', a: 'star', why: 'Star uses: festive designs.' },
  { b: 'Lines and arrows that connect the steps and lead the user through an app.', a: 'lines', why: 'Use arrows to lead users, lines to separate or connect elements.', avoid: ['triangle'] }
];
const ALL = ['circle', 'square', 'triangle', 'star', 'polygon', 'organic', 'lines', 'ellipse', 'combo'];
const casting = {
  id: 'shape-cast', title: 'Casting', en: 'brief → shape',
  how: 'You have a brand and it needs a lead. Read the brief and cast the shape that fits the role. 10 roles, 10 seconds each.',
  mount(el, api, ctx) {
    const ROUNDS = 10, LIMIT = reduced() ? 15000 : 10000; const set = shuffle(BRIEFS).slice(0, ROUNDS);
    let i = 0, score = 0, combo = 0, stopT = null, locked = false, timers = [];
    el.innerHTML = `<div class="shp-t">
      <div class="g-hud"><span class="chip">Role <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="chip" data-combo hidden>${api.GLYPH.flame.replace('<svg', '<svg width="14" height="14"')}<span class="hud-num">0</span></span><span class="chip chip--zone">Correct <span class="hud-num" data-s>0</span></span></div>
      <div class="g-timer"><i></i></div>
      <div class="g-card"><p class="label">The brief</p><p class="shp-t__brief"></p><div class="g-choices"></div></div>
      <p class="shp-t__note" aria-live="polite"></p></div>`;
    fitView(el);
    const brief = el.querySelector('.shp-t__brief'), box = el.querySelector('.g-choices'), bar = el.querySelector('.g-timer'), note = el.querySelector('.shp-t__note');
    function round() {
      locked = false; const it = set[i]; el.querySelector('[data-r]').textContent = i + 1; note.textContent = '';
      brief.textContent = it.b;
      const twin = it.pair ? (it.a === 'triangle' ? 'triangleDown' : 'triangle') : null;
      const wrong = shuffle(ALL.filter(k => k !== it.a && k !== twin && !(it.pair && k === 'triangle') && !(it.avoid || []).includes(k))).slice(0, twin ? 2 : 3);
      const opts = shuffle([it.a, ...wrong, ...(twin ? [twin] : [])]);
      // one label per choice in English: the slide's own name for the shape
      box.innerHTML = opts.map((k, n) => `<button type="button" class="g-choice" data-k="${k}" style="--gc:${COLOR[k]}"><span class="hud-num">${n + 1}</span><span class="shp-t__g">${SHAPE_GLYPH[k]}</span>${SHORT[k]}</button>`).join('');
      box.querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => answer(b.dataset.k)));
      stopT?.(); stopT = timerBar(bar, LIMIT, () => answer(null));
    }
    function answer(k) {
      if (locked) return; locked = true; stopT?.();
      const it = set[i]; const ok = k === it.a;
      box.querySelectorAll('.g-choice').forEach(b => { b.disabled = true; if (b.dataset.k === it.a) b.classList.add('is-right'); else if (b.dataset.k === k) b.classList.add('is-wrong'); });
      if (ok) { score++; combo++; api.sfx('good'); api.burst(box.querySelector('.is-right'), COLOR[it.a]); } else { combo = 0; api.sfx('bad'); }
      el.querySelector('[data-s]').textContent = score;
      const c = el.querySelector('[data-combo]'); c.hidden = combo < 2; c.querySelector('.hud-num').textContent = combo;
      note.innerHTML = `${k === null ? '<b>Time’s up.</b>' : ok ? '<b>Great casting.</b>' : `<b>That role goes to: ${SHORT[it.a]}.</b>`}<span class="shp-t__why" dir="ltr">${it.why}</span>`;
      i++;
      timers.push(setTimeout(() => { if (i < ROUNDS) round(); else endScreen(el, api, ctx, casting.id, score, ROUNDS, ['Not one mistake. You’re a real casting director.', 'Good eye. Focus a bit more on the design tips and you’ll nail it.', 'The shapes still mix you up. Go through the card deck in the last chapter and come back.']); }, ok ? 1100 : 1900));
    }
    const onKey = e => { const n = '1234'.indexOf(e.key); const b = box.querySelectorAll('.g-choice')[n]; if (n >= 0 && b && !b.disabled) { e.preventDefault(); answer(b.dataset.k); } };
    document.addEventListener('keydown', onKey);
    round();
    return (el._mgStop = () => { stopT?.(); timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey); });
  }
};

/* ---------- 2 · Right pair? ---------- */
const CLAIMS = [
  { k: 'star', c: 'feels celebratory and attention-grabbing', ok: true },
  { k: 'star', c: 'feels relaxed, artistic, and human', ok: false, fix: 'That’s the feeling of the organic / freeform shape.' },
  { k: 'circle', c: 'feels soft, safe, and inclusive', ok: true },
  { k: 'square', c: 'feels dynamic, energetic, and sometimes aggressive', ok: false, fix: 'That’s the triangle. The square: solid, grounded, trustworthy.' },
  { k: 'ellipse', c: 'feels smooth and graceful', ok: true },
  { k: 'polygon', c: 'symbolism depends on the number of sides and symmetry', ok: true },
  { k: 'organic', c: 'feels structured yet creative', ok: false, fix: 'That’s geometric combinations. Organic / freeform: relaxed, artistic, human.' },
  { k: 'lines', c: 'guide the eye and create flow', ok: true },
  { k: 'circle', c: 'symbolism: direction, movement, tension, power', ok: false, fix: 'That’s the triangle’s symbolism. The circle: unity, infinity, wholeness, protection.' },
  { k: 'combo', c: 'symbolism: complexity, innovation, balance', ok: true },
  { k: 'ellipse', c: 'common uses: portrait frames, logo elements, buttons', ok: true },
  { k: 'star', c: 'design tip: use generously on every element', ok: false, fix: 'The tip says: use sparingly.' },
  { k: 'square', c: 'symbolism: stability, reliability, structure, honesty', ok: true },
  { k: 'triangle', c: 'common uses: play buttons, warning signs, arrows', ok: true },
  { k: 'organic', c: 'common uses: wellness products, illustrations', ok: true },
  { k: 'polygon', c: 'common uses: portrait frames and buttons', ok: false, fix: 'Those are the ellipse’s uses. Polygon: backgrounds, tech or creative branding.' },
  { k: 'lines', c: 'design tip: use circles to create harmony', ok: false, fix: 'That’s the circle’s tip. Lines: arrows to lead users, lines to separate or connect.' },
  { k: 'triangle', c: 'upward for danger, downward for growth', ok: false, fix: 'The other way round: upward for growth, downward for danger or grounding.' }
];
const pairs = {
  id: 'shape-pairs', title: 'Right Pair?', en: 'shape + sentence: true or false',
  how: 'A shape and a sentence from the slide. Does that sentence really belong to that shape? Only 6 seconds. Press <b>1</b> for true and <b>2</b> for false.',
  mount(el, api, ctx) {
    const ROUNDS = 12, LIMIT = reduced() ? 10000 : 6500; const set = shuffle(CLAIMS).slice(0, ROUNDS);
    let i = 0, score = 0, stopT = null, locked = false, timers = [];
    el.innerHTML = `<div class="shp-t">
      <div class="g-hud"><span class="chip">Sentence <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="chip chip--zone">Correct <span class="hud-num" data-s>0</span></span></div>
      <div class="g-timer"><i></i></div>
      <div class="g-card"><div class="shp-t__claim"></div><div class="shp-t__yn"><button type="button" class="g-choice" data-v="1"><span class="hud-num">1</span>True</button><button type="button" class="g-choice" data-v="0"><span class="hud-num">2</span>False</button></div></div>
      <p class="shp-t__note" aria-live="polite"></p></div>`;
    fitView(el);
    const claim = el.querySelector('.shp-t__claim'), btns = [...el.querySelectorAll('.shp-t__yn .g-choice')], bar = el.querySelector('.g-timer'), note = el.querySelector('.shp-t__note');
    function round() {
      locked = false; const it = set[i]; el.querySelector('[data-r]').textContent = i + 1; note.textContent = '';
      btns.forEach(b => { b.disabled = false; b.classList.remove('is-right', 'is-wrong'); });
      // the shape's name in bold, then the claim (the Arabic edition repeats the English name before the claim)
      claim.innerHTML = `<span class="shp-t__g" style="color:${COLOR[it.k]}">${SHAPE_GLYPH[it.k]}</span><b>${CARD[it.k].en}</b><span dir="ltr">“${it.c}”</span>`;
      stopT?.(); stopT = timerBar(bar, LIMIT, () => answer(null));
    }
    function answer(v) {
      if (locked) return; locked = true; stopT?.();
      const it = set[i]; const ok = v !== null && (v === '1') === it.ok;
      btns.forEach(b => { b.disabled = true; if ((b.dataset.v === '1') === it.ok) b.classList.add('is-right'); else if (b.dataset.v === v) b.classList.add('is-wrong'); });
      if (ok) { score++; api.sfx('good'); } else api.sfx('bad');
      el.querySelector('[data-s]').textContent = score;
      note.innerHTML = it.ok ? (ok ? '<b>Right, that one belongs to it.</b>' : '<b>It was true.</b> That sentence really belongs to this shape.') : `<b>${ok ? 'You caught it.' : 'It was false.'}</b> ${api.esc(it.fix)}`;
      i++;
      timers.push(setTimeout(() => { if (i < ROUNDS) round(); else endScreen(el, api, ctx, pairs.id, score, ROUNDS, ['Not a single trick got past you.', 'Good. The tricks that caught you are the same tricks the exam uses, so learn them.', 'The sentences are getting mixed up. Go through the nine shape cards and come back.']); }, ok ? 900 : 1900));
    }
    btns.forEach(b => b.addEventListener('click', () => answer(b.dataset.v)));
    const onKey = e => { if (e.key === '1') { e.preventDefault(); answer('1'); } if (e.key === '2') { e.preventDefault(); answer('0'); } };
    document.addEventListener('keydown', onKey);
    round();
    return (el._mgStop = () => { stopT?.(); timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey); });
  }
};

export default [casting, pairs];
