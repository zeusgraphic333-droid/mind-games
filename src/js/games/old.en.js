// Lecture 01 trial: principles quick-fire. English edition of old.js.
import { marks } from '../ui/icons.js';
const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const P = ['Balance', 'Contrast', 'Emphasis', 'Hierarchy', 'Rhythm', 'Unity', 'Variety', 'Movement', 'Repetition', 'Alignment', 'Proximity'];
/* [the situation, the slide's own wording, the answer, options that would also be defensible (never offered)] */
const CASES = [
  ['Three small things on one side, one big thing on the other, and the design doesn’t tip.', 'Three small objects offset one large object', 'Balance'],
  ['The left half and the right half are mirror images of each other, across an axis.', 'Shapes mirrored on either side of an axis', 'Balance', ['Repetition']],
  ['You swap black text on white for gray text on white.', 'Gray text on a white background', 'Contrast'],
  ['The difference between two or more things: light and dark, thin and thick.', 'The difference between two or more objects', 'Contrast'],
  ['You paint the wall at the end of a long hallway a bright color.', 'A bright wall at the end of a long hallway', 'Emphasis'],
  ['Also known as dominance: it gives the design a focal point.', 'Creates a focal point; sometimes called dominance', 'Emphasis'],
  ['The title matters most, so it’s bigger than the body text, and everything else follows in order.', 'Ordering information by importance', 'Hierarchy', ['Emphasis', 'Contrast']],
  ['Size, color, type, spacing, proximity, alignment, repetition and leading lines.', 'Eight tools to order importance', 'Hierarchy'],
  ['Squares that grow bigger, one after the other, step by step.', 'A gradual change in size or color', 'Rhythm', ['Repetition']],
  ['Like a drawing of the sun: identical shapes coming out of one center.', 'Identical objects coming from a central axis', 'Rhythm', ['Repetition', 'Balance']],
  ['Every principle is applied right, and the whole design reads as one piece.', 'All principles correctly applied — one cohesive unit', 'Unity'],
  ['You changed the sizes and colors of the circles so the design isn’t boring.', 'Varying elements to avoid making them boring', 'Variety'],
  ['The designer is in control of what your eye looks at next.', 'Controls what the viewer sees next', 'Movement'],
  ['The same element shows up all over the design, so it looks unified and consistent.', 'Repeating elements for a unified, consistent look', 'Repetition', ['Unity', 'Rhythm']],
  ['The elements and the text all stand on the same line.', 'Elements line up with the composition', 'Alignment'],
  ['Things that belong together sit side by side, and everything else keeps its distance.', 'Related things nearer to each other', 'Proximity']
];
const shuffle = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export default [{
  id: 'old-quickfire', title: 'Principles Quick-Fire', en: 'situation → principle', how: 'A design situation pops up: pick the principle. 10 rounds, and the clock gets shorter as your combo grows. Keys 1–4 work too.',
  mount(el, api, ctx) {
    const r = api.seeded(Date.now() % 99991); const MAX = 10;
    const deck = shuffle(CASES, r).slice(0, MAX);
    let i = 0, score = 0, combo = 0, raf = 0, nextT = 0, locked = false; const misses = [];
    el.innerHTML = `<div class="g-card old-game">
      <div class="g-hud"><span class="chip">Round <span class="hud-num old-r">1</span>/<span class="hud-num">${MAX}</span></span><span class="chip old-combo" hidden>Combo <span class="hud-num">×0</span></span><span class="chip">Score <span class="hud-num old-s">0</span></span></div>
      <div class="g-timer"><i></i></div>
      <div class="old-case"><p class="old-case__ar"></p><p class="old-case__en" dir="ltr"></p></div>
      <div class="g-choices old-opts"></div>
      <p class="old-why" aria-live="polite"></p>
    </div>`;
    const $ = s => el.querySelector(s);
    const stopT = () => cancelAnimationFrame(raf);
    function show() {
      locked = false; const c = deck[i];
      $('.old-r').textContent = i + 1; $('.old-why').textContent = '';
      $('.old-case__ar').textContent = c[0]; $('.old-case__en').textContent = c[1];
      const opts = shuffle([c[2], ...shuffle(P.filter(p => p !== c[2] && !(c[3] || []).includes(p)), r).slice(0, 3)], r); // c[3]: options that would also be defensible
      $('.old-opts').innerHTML = opts.map((p, k) => `<button type="button" class="g-choice" data-p="${p}"><span class="hud-num old-key">${k + 1}</span><b>${p}</b></button>`).join('');
      $('.old-opts').querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => answer(b.dataset.p, b)));
      const ms = (reduced() ? 1.5 : 1) * Math.max(4500, 8000 - combo * 350); const t0 = performance.now(); const fill = $('.g-timer i');
      const tick = t => { const p = Math.max(0, 1 - (t - t0) / ms); fill.style.setProperty('--t', p.toFixed(3)); if (p <= 0) { answer(null, null); return; } raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
    function answer(p, btn) {
      if (locked) return; locked = true; stopT();
      const c = deck[i], ok = p === c[2];
      el.querySelectorAll('.g-choice').forEach(b => { b.disabled = true; if (b.dataset.p === c[2]) b.classList.add('is-right'); else if (b === btn) b.classList.add('is-wrong'); });
      if (ok) { score++; combo++; api.sfx('good'); api.burst(btn, '#46E3A0'); } else { combo = 0; misses.push(`${c[0]} → <b>${c[2]}</b>`); api.sfx('bad'); api.shake($('.old-case')); }
      $('.old-s').textContent = score; const cb = $('.old-combo'); cb.hidden = combo < 2; cb.querySelector('.hud-num').textContent = '×' + combo;
      $('.old-why').innerHTML = `${p === null ? 'Time’s up. ' : ''}Answer: <b>${c[2]}</b>`;
      i++; nextT = setTimeout(() => { if (i >= MAX) finish(); else show(); }, ok ? 1000 : 1800);
    }
    function finish() {
      const res = api.finishGame('old-quickfire', score, MAX, el.querySelector('.g-card'));
      el.innerHTML = `<div class="g-card g-end old-end"><span class="glyph">${api.GLYPH.spiral}</span><p class="label">Your score</p>
        <div class="old-end__score"><span class="hud-num">${score}</span><span class="hud-num old-end__of">/${MAX}</span></div>
        <h3>${score >= 9 ? 'Solid foundation' : score >= 6 ? 'Good' : 'Needs a review'}</h3>
        <p>Lecture 1 isn’t in the quiz, but this foundation makes Lectures 2 and 3 easier.</p>
        <div class="old-end__marks">${marks(res.stars, 3, 'marks--big')}</div>
        <p><span class="chip chip--zone"><span class="hud-num" dir="ltr">+${res.xp} XP</span></span></p>
        ${misses.length ? `<div class="old-miss"><p class="label">Review these</p><ul>${misses.map(m => `<li>${m}</li>`).join('')}</ul></div>` : ''}
        <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">Play again</button><button type="button" class="btn" data-a="back">All trials</button></div></div>`;
      el.querySelector('[data-a="again"]').addEventListener('click', () => ctx.again());
      el.querySelector('[data-a="back"]').addEventListener('click', () => ctx.back());
      el.querySelector('[data-a="again"]').focus({ preventScroll: true });
    }
    const onKey = e => { if (!el.isConnected) return; const n = '1234'.indexOf(e.key); if (n >= 0) { const b = el.querySelectorAll('.g-choice')[n]; if (b && !b.disabled) { e.preventDefault(); b.click(); } } };
    document.addEventListener('keydown', onKey);
    show();
    return () => { stopT(); clearTimeout(nextT); document.removeEventListener('keydown', onKey); };
  }
}];
