// Mind zone trials (English edition): First Glance (hierarchy under a 1-second flash) and Read the Situation (concept quick-fire).
import { glanceLayout, GLANCE_PARTS } from '../content/lessons/mind.en.js';
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

/** shared end screen */
function endScreen(el, api, ctx, id, score, max, lines) {
  el._mgStop?.(); // the finished trial lets go of its timers and keys before the end card (replay remounts without a stop)
  const pct = max ? score / max : 0;
  el.innerHTML = `<div class="g-card g-end">
    <span class="glyph">${api.GLYPH.eye}</span>
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

/* ---------- 1 · First Glance ---------- */
const glance = {
  id: 'mind-glance', title: 'First Glance', en: 'poster → focal point',
  how: 'A poster flashes for less than a second, then disappears. Say what your eye went to first. That’s exactly what happens when people scan.',
  mount(el, api, ctx) {
    const ROUNDS = 8; let i = 0, score = 0, focal = '', timers = [], locked = true;
    const later = (f, ms) => timers.push(setTimeout(f, ms));
    const accents = ['#8B7BFF', '#FF3E8A', '#7FE7FF', '#FFC21A'];
    // one label per choice in English (the Arabic edition adds the English term under its Arabic label)
    el.innerHTML = `<div class="mnd-t">
      <div class="g-hud"><span class="chip">Round <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="chip chip--zone">Correct <span class="hud-num" data-s>0</span></span></div>
      <div class="mnd-t__stage"><div class="mnd-t__poster"></div><div class="mnd-t__veil"><span class="hud-num" data-cd>3</span><p>Focus on the middle of the screen</p></div></div>
      <div class="g-choices" role="group" aria-label="What did you see first?">${GLANCE_PARTS.map((p, k) => `<button type="button" class="g-choice" data-k="${p.k}" disabled><span class="hud-num">${k + 1}</span>${p.ar}</button>`).join('')}</div>
      <p class="mnd-t__note" aria-live="polite">Ready? The first poster is coming.</p>
    </div>`;
    fitView(el);
    const poster = el.querySelector('.mnd-t__poster'), veil = el.querySelector('.mnd-t__veil'), cd = el.querySelector('[data-cd]'), note = el.querySelector('.mnd-t__note');
    const btns = [...el.querySelectorAll('.g-choice')];
    function round() {
      locked = true; btns.forEach(b => { b.disabled = true; b.classList.remove('is-right', 'is-wrong'); });
      el.querySelector('[data-r]').textContent = i + 1;
      const opts = GLANCE_PARTS.map(p => p.k); focal = opts[Math.floor(Math.random() * opts.length)];
      veil.classList.remove('is-open'); veil.querySelector('p').textContent = 'Focus on the middle of the screen';
      // swap the poster only once the veil has faded back in, so the next answer never peeks through
      const r = i; later(() => { poster.innerHTML = glanceLayout(focal, r, accents[r % accents.length]); }, 200);
      const flash = reduced() ? 1500 : Math.max(550, 950 - i * 55);
      let n = 3; cd.textContent = n;
      const tick = () => { n--; if (n > 0) { cd.textContent = n; api.sfx('tick'); later(tick, 420); } else { veil.classList.add('is-open'); api.sfx('swoosh'); later(hide, flash); } };
      later(tick, 420);
    }
    function hide() {
      veil.classList.remove('is-open'); cd.textContent = '?'; veil.querySelector('p').textContent = 'Gone. What did your eye go to first?';
      locked = false; btns.forEach(b => b.disabled = false); btns[0].focus({ preventScroll: true });
    }
    function answer(k) {
      if (locked) return; locked = true;
      const ok = k === focal; const b = btns.find(x => x.dataset.k === k), right = btns.find(x => x.dataset.k === focal);
      btns.forEach(x => x.disabled = true); right.classList.add('is-right'); if (!ok) b.classList.add('is-wrong');
      if (ok) { score++; api.sfx('good'); api.burst(b, '#46E3A0'); } else { api.sfx('bad'); }
      el.querySelector('[data-s]').textContent = score;
      veil.classList.add('is-open');
      const name = GLANCE_PARTS.find(p => p.k === focal).ar.toLowerCase();
      note.innerHTML = ok ? `<b>Right.</b> The ${name} was the <bdi class="en" dir="ltr">focal point</bdi>.` : `<b>It was the ${name}.</b> The biggest, highest-contrast thing always wins.`;
      i++;
      later(() => { if (i < ROUNDS) { note.textContent = 'Next…'; round(); } else endScreen(el, api, ctx, glance.id, score, ROUNDS, ['A designer’s eye. Hierarchy can’t fool you.', 'Your eye is quick. A little more and it’s a radar.', 'Your eye is still learning. Go back to the chapter “People scan, they don’t read” and try again.']); }, ok ? 1100 : 1700);
    }
    btns.forEach(b => b.addEventListener('click', () => answer(b.dataset.k)));
    const onKey = e => { const k = '1234'.indexOf(e.key); if (k >= 0 && btns[k] && !btns[k].disabled) { e.preventDefault(); answer(btns[k].dataset.k); } };
    document.addEventListener('keydown', onKey);
    later(round, 500);
    return (el._mgStop = () => { timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey); });
  }
};

/* ---------- 2 · Read the Situation ---------- */
// [label, English term]: in this edition both are English, so each choice shows the label only
const CONCEPTS = {
  empathy: ['Empathy', 'Empathy'], culture: ['Cultural context', 'Cultural context'], scan: ['Scan, don’t read', 'Scan, don’t read'], feedback: ['Feedback', 'Feedback'],
  monolith: ['Not a monolith', 'Not a monolith'], biology: ['Biology', 'Biology'], seek: ['Clarity, patterns, cues', 'Clarity, patterns, cues'], aesthetics: ['Not just aesthetics', 'Not just aesthetics'],
  levers: ['Shape · Typeface · Color · Space', 'Shape · Type · Color · Space'], fedex: ['Forward, speed, precision', 'Forward, speed, precision'], apple: ['Bytes', 'Bytes'], yahoo: ['Human touch', 'Human touch'], airbnb: ['People + places + love + A', 'People, places, love, A'], hierarchy: ['Visual hierarchy', 'Visual hierarchy']
};
const SITUATIONS = [
  { s: 'A minimal poster: Sara finds it calm, Omar finds it cold and empty. What does the lecture say is the answer?', a: 'empathy', o: ['empathy', 'scan', 'levers', 'aesthetics'] },
  { s: 'A symbol means something nice in your country, but it’s offensive in the country of the audience you’re designing for.', a: 'culture', o: ['culture', 'biology', 'hierarchy', 'feedback'] },
  { s: 'People glance at a shop sign for two seconds while they walk down the street.', a: 'scan', o: ['scan', 'empathy', 'monolith', 'apple'] },
  { s: 'Before you publish the design, you show it to five different people and listen to what they think.', a: 'feedback', o: ['feedback', 'culture', 'seek', 'levers'] },
  { s: 'Your audience has students, parents and older people. Not one kind of person.', a: 'monolith', o: ['monolith', 'scan', 'yahoo', 'aesthetics'] },
  { s: 'Perception is shaped by experiences, emotions, culture, education… and even what?', a: 'biology', o: ['biology', 'feedback', 'hierarchy', 'fedex'] },
  { s: 'The brain is wired to look for 3 things, and a design that goes along with them gets through.', a: 'seek', o: ['seek', 'levers', 'monolith', 'airbnb'] },
  { s: 'A very stylish design… but nobody got the message. The lecture says that’s not what effective design is.', a: 'aesthetics', o: ['aesthetics', 'scan', 'culture', 'apple'] },
  { s: 'Four things a designer uses to move the viewer’s feelings.', a: 'levers', o: ['levers', 'seek', 'hierarchy', 'yahoo'] },
  { s: 'An arrow hidden in the space between two letters of a shipping company’s logo. What does it say?', a: 'fedex', o: ['fedex', 'apple', 'airbnb', 'culture'] },
  { s: 'An apple with a bite missing. And the bite hints at something in computing.', a: 'apple', o: ['apple', 'fedex', 'yahoo', 'biology'] },
  { s: 'A logo that looks fun and personal: fancy, yet sophisticated.', a: 'yahoo', o: ['yahoo', 'airbnb', 'aesthetics', 'apple'] },
  { s: 'One symbol that combines the ideas of people, places, love and a letter.', a: 'airbnb', o: ['airbnb', 'fedex', 'levers', 'yahoo'] },
  { s: 'A huge headline, smaller details under it, and the small print at the end. The eye moves in order.', a: 'hierarchy', o: ['hierarchy', 'monolith', 'empathy', 'apple'] }
];
const read = {
  id: 'mind-read', title: 'Read the Situation', en: 'situation → lecture idea',
  how: 'A real-life situation and 4 ideas from the lecture. Pick the right idea before time runs out.',
  mount(el, api, ctx) {
    const ROUNDS = 10, LIMIT = reduced() ? 16000 : 11000; const set = shuffle(SITUATIONS).slice(0, ROUNDS);
    let i = 0, score = 0, combo = 0, raf = 0, t0 = 0, locked = false, timers = [];
    el.innerHTML = `<div class="mnd-t">
      <div class="g-hud"><span class="chip">Situation <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="chip" data-combo hidden>${api.GLYPH.flame.replace('<svg', '<svg width="14" height="14"')}<span class="hud-num">0</span></span><span class="chip chip--zone">Correct <span class="hud-num" data-s>0</span></span></div>
      <div class="g-timer"><i></i></div>
      <div class="g-card"><p class="mnd-t__card"></p><div class="g-choices"></div></div>
      <p class="mnd-t__note" aria-live="polite"></p>
    </div>`;
    fitView(el);
    const card = el.querySelector('.mnd-t__card'), box = el.querySelector('.g-choices'), bar = el.querySelector('.g-timer'), note = el.querySelector('.mnd-t__note');
    function round() {
      locked = false; const it = set[i]; el.querySelector('[data-r]').textContent = i + 1; note.textContent = '';
      card.textContent = it.s;
      box.innerHTML = shuffle(it.o).map((k, n) => `<button type="button" class="g-choice" data-k="${k}"><span class="hud-num">${n + 1}</span>${CONCEPTS[k][0]}</button>`).join('');
      box.querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => answer(b.dataset.k)));
      t0 = performance.now(); cancelAnimationFrame(raf);
      const step = now => { const left = 1 - (now - t0) / LIMIT; bar.style.setProperty('--t', Math.max(0, left)); if (left <= 0) answer(null); else raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }
    function answer(k) {
      if (locked) return; locked = true; cancelAnimationFrame(raf);
      const it = set[i]; const ok = k === it.a;
      box.querySelectorAll('.g-choice').forEach(b => { b.disabled = true; if (b.dataset.k === it.a) b.classList.add('is-right'); else if (b.dataset.k === k) b.classList.add('is-wrong'); });
      if (ok) { score++; combo++; api.sfx('good'); } else { combo = 0; api.sfx('bad'); }
      el.querySelector('[data-s]').textContent = score;
      const c = el.querySelector('[data-combo]'); c.hidden = combo < 2; c.querySelector('.hud-num').textContent = combo;
      note.innerHTML = k === null ? `<b>Time’s up.</b> The answer: ${CONCEPTS[it.a][0]}.` : ok ? (combo >= 3 ? `<b>Combo ×${combo}.</b>` : '<b>Right.</b>') : `<b>No.</b> The right one: ${CONCEPTS[it.a][0]}.`;
      i++;
      timers.push(setTimeout(() => { if (i < ROUNDS) round(); else endScreen(el, api, ctx, read.id, score, ROUNDS, ['You read every situation right. This lecture is yours now.', 'Nice. Whatever you missed, go back to it in the lessons.', 'Not yet. Read the chapter “Every mind sees in its own way” and come back.']); }, ok ? 900 : 1600));
    }
    const onKey = e => { const n = '1234'.indexOf(e.key); const b = box.querySelectorAll('.g-choice')[n]; if (n >= 0 && b && !b.disabled) { e.preventDefault(); answer(b.dataset.k); } };
    document.addEventListener('keydown', onKey);
    round();
    return (el._mgStop = () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey); });
  }
};

export default [glance, read];
