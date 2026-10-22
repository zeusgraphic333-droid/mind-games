// Mind zone trials: First Glance (hierarchy under a 1-second flash) and Read the Situation (concept quick-fire).
import { glanceLayout, GLANCE_PARTS } from '../content/lessons/mind.js';
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
    <p class="label">النتيجة</p>
    <h3><span class="hud-num">${score}</span> / <span class="hud-num">${max}</span></h3>
    <div class="g-end__marks"></div>
    <p>${pct === 1 ? lines[0] : pct >= .6 ? lines[1] : lines[2]}</p>
    <p class="g-end__xp"></p>
    <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">العب تاني</button><button type="button" class="btn" data-a="back">كل التحديات</button></div>
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
  id: 'mind-glance', title: 'أول نظرة', en: 'First Glance',
  how: 'بوستر بيظهر أقل من ثانية ويختفي. قول عينك راحت لإيه الأول. ده بالظبط اللي بيحصل لما الناس <en>scan</en>.',
  mount(el, api, ctx) {
    const ROUNDS = 8; let i = 0, score = 0, focal = '', timers = [], locked = true;
    const later = (f, ms) => timers.push(setTimeout(f, ms));
    const accents = ['#8B7BFF', '#FF3E8A', '#7FE7FF', '#FFC21A'];
    el.innerHTML = `<div class="mnd-t">
      <div class="g-hud"><span class="chip">جولة <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="chip chip--zone">صح <span class="hud-num" data-s>0</span></span></div>
      <div class="mnd-t__stage"><div class="mnd-t__poster"></div><div class="mnd-t__veil"><span class="hud-num" data-cd>3</span><p>ركّز في نص الشاشة</p></div></div>
      <div class="g-choices" role="group" aria-label="إيه أول حاجة شفتها؟">${GLANCE_PARTS.map((p, k) => `<button type="button" class="g-choice" data-k="${p.k}" disabled><span class="hud-num">${k + 1}</span>${p.ar}<bdi class="en" dir="ltr">${p.en}</bdi></button>`).join('')}</div>
      <p class="mnd-t__note" aria-live="polite">جاهز؟ أول بوستر جاي.</p>
    </div>`;
    fitView(el);
    const poster = el.querySelector('.mnd-t__poster'), veil = el.querySelector('.mnd-t__veil'), cd = el.querySelector('[data-cd]'), note = el.querySelector('.mnd-t__note');
    const btns = [...el.querySelectorAll('.g-choice')];
    function round() {
      locked = true; btns.forEach(b => { b.disabled = true; b.classList.remove('is-right', 'is-wrong'); });
      el.querySelector('[data-r]').textContent = i + 1;
      const opts = GLANCE_PARTS.map(p => p.k); focal = opts[Math.floor(Math.random() * opts.length)];
      veil.classList.remove('is-open'); veil.querySelector('p').textContent = 'ركّز في نص الشاشة';
      // swap the poster only once the veil has faded back in, so the next answer never peeks through
      const r = i; later(() => { poster.innerHTML = glanceLayout(focal, r, accents[r % accents.length]); }, 200);
      const flash = reduced() ? 1500 : Math.max(550, 950 - i * 55);
      let n = 3; cd.textContent = n;
      const tick = () => { n--; if (n > 0) { cd.textContent = n; api.sfx('tick'); later(tick, 420); } else { veil.classList.add('is-open'); api.sfx('swoosh'); later(hide, flash); } };
      later(tick, 420);
    }
    function hide() {
      veil.classList.remove('is-open'); cd.textContent = '?'; veil.querySelector('p').textContent = 'اتقفل. عينك راحت لإيه الأول؟';
      locked = false; btns.forEach(b => b.disabled = false); btns[0].focus({ preventScroll: true });
    }
    function answer(k) {
      if (locked) return; locked = true;
      const ok = k === focal; const b = btns.find(x => x.dataset.k === k), right = btns.find(x => x.dataset.k === focal);
      btns.forEach(x => x.disabled = true); right.classList.add('is-right'); if (!ok) b.classList.add('is-wrong');
      if (ok) { score++; api.sfx('good'); api.burst(b, '#46E3A0'); } else { api.sfx('bad'); }
      el.querySelector('[data-s]').textContent = score;
      veil.classList.add('is-open');
      const name = GLANCE_PARTS.find(p => p.k === focal).ar;
      note.innerHTML = ok ? `<b>صح.</b> ${name} كان الـ <bdi class="en" dir="ltr">focal point</bdi>.` : `<b>كان ${name}.</b> الأكبر والأعلى تباين بيكسب دايمًا.`;
      i++;
      later(() => { if (i < ROUNDS) { note.textContent = 'اللي بعده…'; round(); } else endScreen(el, api, ctx, glance.id, score, ROUNDS, ['عين مصمم. الـ hierarchy مبتضحكش عليك.', 'عينك سريعة. شوية كمان وتبقى رادار.', 'العين لسه بتتعلم. ارجع لفصل «الناس بتمسح» وجرّب تاني.']); }, ok ? 1100 : 1700);
    }
    btns.forEach(b => b.addEventListener('click', () => answer(b.dataset.k)));
    const onKey = e => { const k = '1234'.indexOf(e.key); if (k >= 0 && btns[k] && !btns[k].disabled) { e.preventDefault(); answer(btns[k].dataset.k); } };
    document.addEventListener('keydown', onKey);
    later(round, 500);
    return (el._mgStop = () => { timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey); });
  }
};

/* ---------- 2 · Read the Situation ---------- */
const CONCEPTS = {
  empathy: ['التعاطف', 'Empathy'], culture: ['السياق الثقافي', 'Cultural context'], scan: ['بيمسحوا مش بيقروا', 'Scan, don’t read'], feedback: ['الفيدباك', 'Feedback'],
  monolith: ['الجمهور مش كتلة واحدة', 'Not a monolith'], biology: ['البيولوجي', 'Biology'], seek: ['وضوح وأنماط وإشارات', 'Clarity, patterns, cues'], aesthetics: ['مش جمال وبس', 'Not just aesthetics'],
  levers: ['الأدوات الأربعة', 'Shape · Type · Color · Space'], fedex: ['اتجاه وسرعة ودقة', 'Forward, speed, precision'], apple: ['بايتس', 'Bytes'], yahoo: ['لمسة إنسانية', 'Human touch'], airbnb: ['ناس + أماكن + حب + A', 'People, places, love, A'], hierarchy: ['الترتيب البصري', 'Visual hierarchy']
};
const SITUATIONS = [
  { s: 'بوستر مينيمال: سارة شايفاه هادي، وعمر شايفه فاضي وبارد. المحاضرة بتقول إيه هو الحل؟', a: 'empathy', o: ['empathy', 'scan', 'levers', 'aesthetics'] },
  { s: 'رمز معناه حلو في بلدك، بس مُهين في بلد الجمهور اللي بتصمم له.', a: 'culture', o: ['culture', 'biology', 'hierarchy', 'feedback'] },
  { s: 'الناس بتبص على لافتة المحل ثانيتين وهي ماشية في الشارع.', a: 'scan', o: ['scan', 'empathy', 'monolith', 'apple'] },
  { s: 'قبل ما تنزل التصميم، بتوريه لخمس أشخاص مختلفين وتسمع رأيهم.', a: 'feedback', o: ['feedback', 'culture', 'seek', 'levers'] },
  { s: 'جمهورك فيه طلبة وأهالي وكبار سن. مش نوع واحد من الناس.', a: 'monolith', o: ['monolith', 'scan', 'yahoo', 'aesthetics'] },
  { s: 'الإدراك بيتشكّل من الخبرات والمشاعر والثقافة والتعليم… وحتى إيه؟', a: 'biology', o: ['biology', 'feedback', 'hierarchy', 'fedex'] },
  { s: 'المخ متبرمج إنه يدوّر على 3 حاجات، والتصميم اللي ماشي معاها بيوصل.', a: 'seek', o: ['seek', 'levers', 'monolith', 'airbnb'] },
  { s: 'تصميم شيك جدًا… بس محدش فهم الرسالة. المحاضرة بتقول التصميم الفعّال مش كده.', a: 'aesthetics', o: ['aesthetics', 'scan', 'culture', 'apple'] },
  { s: 'أربع حاجات بيحرّك بيها المصمم إحساس المشاهد.', a: 'levers', o: ['levers', 'seek', 'hierarchy', 'yahoo'] },
  { s: 'سهم مستخبي في الفراغ بين حرفين في لوجو شركة شحن. بيقول إيه؟', a: 'fedex', o: ['fedex', 'apple', 'airbnb', 'culture'] },
  { s: 'تفاحة ناقصة قضمة. والقضمة بتلمّح لحاجة في الكمبيوتر.', a: 'apple', o: ['apple', 'fedex', 'yahoo', 'biology'] },
  { s: 'لوجو شكله مرح وشخصي، فانسي بس راقي.', a: 'yahoo', o: ['yahoo', 'airbnb', 'aesthetics', 'apple'] },
  { s: 'رمز واحد بيجمع معاني ناس وأماكن وحب وحرف.', a: 'airbnb', o: ['airbnb', 'fedex', 'levers', 'yahoo'] },
  { s: 'عنوان ضخم، وتحته تفاصيل أصغر، وفي الآخر الكلام الصغير. العين ماشية بترتيب.', a: 'hierarchy', o: ['hierarchy', 'monolith', 'empathy', 'apple'] }
];
const read = {
  id: 'mind-read', title: 'اقرا الموقف', en: 'Read the Situation',
  how: 'موقف من الحياة، و٤ أفكار من المحاضرة. اختار الفكرة الصح قبل ما الوقت يخلص.',
  mount(el, api, ctx) {
    const ROUNDS = 10, LIMIT = reduced() ? 16000 : 11000; const set = shuffle(SITUATIONS).slice(0, ROUNDS);
    let i = 0, score = 0, combo = 0, raf = 0, t0 = 0, locked = false, timers = [];
    el.innerHTML = `<div class="mnd-t">
      <div class="g-hud"><span class="chip">موقف <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="chip" data-combo hidden>${api.GLYPH.flame.replace('<svg', '<svg width="14" height="14"')}<span class="hud-num">0</span></span><span class="chip chip--zone">صح <span class="hud-num" data-s>0</span></span></div>
      <div class="g-timer"><i></i></div>
      <div class="g-card"><p class="mnd-t__card"></p><div class="g-choices"></div></div>
      <p class="mnd-t__note" aria-live="polite"></p>
    </div>`;
    fitView(el);
    const card = el.querySelector('.mnd-t__card'), box = el.querySelector('.g-choices'), bar = el.querySelector('.g-timer'), note = el.querySelector('.mnd-t__note');
    function round() {
      locked = false; const it = set[i]; el.querySelector('[data-r]').textContent = i + 1; note.textContent = '';
      card.textContent = it.s;
      box.innerHTML = shuffle(it.o).map((k, n) => `<button type="button" class="g-choice" data-k="${k}"><span class="hud-num">${n + 1}</span>${CONCEPTS[k][0]}<bdi class="en" dir="ltr">${CONCEPTS[k][1]}</bdi></button>`).join('');
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
      note.innerHTML = k === null ? `<b>الوقت خلص.</b> الإجابة: ${CONCEPTS[it.a][0]}.` : ok ? (combo >= 3 ? `<b>كومبو ×${combo}.</b>` : '<b>صح.</b>') : `<b>لأ.</b> الصح: ${CONCEPTS[it.a][0]}.`;
      i++;
      timers.push(setTimeout(() => { if (i < ROUNDS) round(); else endScreen(el, api, ctx, read.id, score, ROUNDS, ['قريت كل المواقف صح. المحاضرة دي بقت بتاعتك.', 'حلو. اللي غلطت فيه، ارجعله في الدروس.', 'لسه. اقرا فصل «كل عقل بيشوف بطريقته» وتعالى.']); }, ok ? 900 : 1600));
    }
    const onKey = e => { const n = '1234'.indexOf(e.key); const b = box.querySelectorAll('.g-choice')[n]; if (n >= 0 && b && !b.disabled) { e.preventDefault(); answer(b.dataset.k); } };
    document.addEventListener('keydown', onKey);
    round();
    return (el._mgStop = () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey); });
  }
};

export default [glance, read];
