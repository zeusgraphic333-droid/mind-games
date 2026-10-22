// Space zone trials: Declutter (tap the noise away so the message can sing) and Read the Space (quick-fire).
import { densityLayout, spaceLayout } from '../content/lessons/space.js';
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

function endScreen(el, api, ctx, id, score, max, lines) {
  el._mgStop?.(); // the finished trial lets go of its timers and keys before the end card (replay remounts without a stop)
  const pct = max ? score / max : 0;
  el.innerHTML = `<div class="g-card g-end">
    <span class="glyph">${api.GLYPH.void}</span>
    <p class="label">النتيجة</p>
    <h3><span class="hud-num">${score}</span> / <span class="hud-num">${max}</span></h3>
    <div class="g-end__marks"></div>
    <p>${pct >= .95 ? lines[0] : pct >= .6 ? lines[1] : lines[2]}</p>
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
function timerBar(bar, ms, onEnd) {
  const t0 = performance.now(); let raf = 0;
  const step = now => { const left = 1 - (now - t0) / ms; bar.style.setProperty('--t', Math.max(0, left)); if (left <= 0) onEnd(); else raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/* ---------- 1 · Declutter ---------- */
const MESSAGES = ['افتتاح الليلة', 'خصم ٣٠٪', 'معرض الربيع', 'اشترك دلوقتي', 'هدوء', 'حفلة الجمعة'];
const declutter = {
  id: 'space-declutter', title: 'وطّي الدوشة', en: 'Declutter',
  how: 'بوستر مزحوم وفي نصه رسالة واحدة. شيل الزحمة بسرعة من غير ما تلمس الرسالة. ٦ جولات، والزحمة بتزيد.',
  mount(el, api, ctx) {
    const ROUNDS = 6, LIMIT = reduced() ? 13000 : 9000; const COUNTS = Array.from({ length: ROUNDS }, (_, i) => 5 + i); const MAX = COUNTS.reduce((a, b) => a + b, 0);
    let i = 0, score = 0, left = 0, slips = 0, stopT = null, timers = [], live = false;
    el.innerHTML = `<div class="spc-t">
      <div class="g-hud"><span class="chip">جولة <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="chip">زحمة فاضلة <span class="hud-num" data-l>0</span></span><span class="chip chip--zone">نقط <span class="hud-num" data-s>0</span></span></div>
      <div class="g-timer"><i></i></div>
      <div class="spc-t__board" role="group" aria-label="البوستر"></div>
      <p class="spc-t__note" aria-live="polite"></p></div>`;
    fitView(el);
    const board = el.querySelector('.spc-t__board'), bar = el.querySelector('.g-timer'), note = el.querySelector('.spc-t__note');
    const hud = () => { el.querySelector('[data-l]').textContent = left; el.querySelector('[data-s]').textContent = score; };
    function round() {
      live = true; slips = 0; const k = COUNTS[i]; left = k; board.classList.remove('is-clear');
      el.querySelector('[data-r]').textContent = i + 1; note.textContent = 'شيل كل الزحمة. متلمسش الرسالة.';
      const cols = ['#4E4C5A', '#FF3E8A', '#FFC21A', '#5A5866', '#FF4A2E', '#8B7BFF'];
      let html = `<button type="button" class="spc-t__msg">${MESSAGES[i % MESSAGES.length]}</button>`;
      for (let n = 0; n < k; n++) {
        let x, y, w, h; do { w = 10 + Math.random() * 18; h = 6 + Math.random() * 12; x = 3 + Math.random() * (94 - w); y = 4 + Math.random() * (92 - h); } while (x < 70 && x + w > 28 && y < 62 && y + h > 36);
        html += `<button type="button" class="spc-t__j" aria-label="زحمة ${n + 1}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;background:${cols[n % cols.length]};--o:${(.65 + Math.random() * .3).toFixed(2)}"></button>`;
      }
      board.innerHTML = html; hud();
      board.querySelectorAll('.spc-t__j').forEach(b => b.addEventListener('click', () => {
        if (!live || b.classList.contains('is-gone')) return;
        b.classList.add('is-gone'); left--; score++; api.sfx('pop'); hud();
        if (!left) finish(true);
      }));
      board.querySelector('.spc-t__msg').addEventListener('click', e => { if (!live) return; slips++; score = Math.max(0, score - 1); hud(); api.sfx('bad'); api.shake(e.currentTarget); note.innerHTML = '<b>دي الرسالة!</b> سيبها. شيل اللي حواليها.'; });
      stopT?.(); stopT = timerBar(bar, LIMIT, () => finish(false));
    }
    function finish(clean) {
      if (!live) return; live = false; stopT?.();
      if (clean) { board.classList.add('is-clear'); api.sfx('good'); note.innerHTML = slips ? '<b>نضيف.</b> بس لمست الرسالة. ركّز.' : '<b>الرسالة بتغنّي دلوقتي.</b>'; }
      else { api.sfx('bad'); note.innerHTML = `<b>الوقت خلص.</b> فضل ${left} حتة زحمة.`; }
      i++;
      timers.push(setTimeout(() => { if (i < ROUNDS) round(); else endScreen(el, api, ctx, declutter.id, score, MAX, ['ولا ذرة دوشة. الرسالة غنّت في كل جولة.', 'إيد سريعة. الفراغ بقى صاحبك.', 'الدوشة كسبت المرة دي. جرّب تاني وابدأ من الأطراف.']); }, 1300));
    }
    round();
    return (el._mgStop = () => { stopT?.(); timers.forEach(clearTimeout); });
  }
};

/* ---------- 2 · Read the Space ---------- */
const readSpace = {
  id: 'space-read', title: 'اقرا الفراغ', en: 'Read the Space',
  how: 'لياوت بيظهر، وسؤال واحد: الفراغ ده <b>Active</b> ولا <b>Passive</b>؟ أو الإحساس <b>هادي</b> ولا <b>مستعجل</b>؟ اضغط 1 أو 2.',
  mount(el, api, ctx) {
    const ROUNDS = 10, LIMIT = reduced() ? 11000 : 7000;
    const set = shuffle([...Array(5)].map((_, n) => ({ t: 'ap', a: n % 2 ? 'passive' : 'active', seed: 3 + n })).concat([...Array(5)].map((_, n) => ({ t: 'mood', a: n % 2 ? 'urgent' : 'calm', seed: 9 + n }))));
    let i = 0, score = 0, stopT = null, locked = false, timers = [];
    el.innerHTML = `<div class="spc-t">
      <div class="g-hud"><span class="chip">لياوت <span class="hud-num" data-r>1</span>/<span class="hud-num">${ROUNDS}</span></span><span class="chip chip--zone">صح <span class="hud-num" data-s>0</span></span></div>
      <div class="g-timer"><i></i></div>
      <div class="g-card"><div class="spc-t__fig"></div><p class="spc-t__q"></p><div class="spc-t__yn"></div></div>
      <p class="spc-t__note" aria-live="polite"></p></div>`;
    fitView(el);
    const fig = el.querySelector('.spc-t__fig'), q = el.querySelector('.spc-t__q'), yn = el.querySelector('.spc-t__yn'), bar = el.querySelector('.g-timer'), note = el.querySelector('.spc-t__note');
    const OPTS = { ap: [['active', 'Active', 'مقصود ومش متماثل'], ['passive', 'Passive', 'مسافات تلقائية']], mood: [['calm', 'هادي ومرحّب', 'calm and inviting'], ['urgent', 'مستعجل ومكثف', 'intense or urgent']] };
    function round() {
      locked = false; const it = set[i]; el.querySelector('[data-r]').textContent = i + 1; note.textContent = '';
      fig.innerHTML = it.t === 'ap' ? spaceLayout(it.a, '#101018', it.seed) : densityLayout(it.a === 'calm' ? .06 + Math.random() * .12 : .82 + Math.random() * .16, it.seed);
      q.textContent = it.t === 'ap' ? 'الفراغ في اللياوت ده:' : 'إحساس اللياوت ده:';
      yn.innerHTML = OPTS[it.t].map(([k, a, b], n) => `<button type="button" class="g-choice" data-k="${k}"><span class="hud-num">${n + 1}</span>${a}<bdi class="en" dir="${it.t === 'ap' ? 'rtl' : 'ltr'}">${b}</bdi></button>`).join('');
      yn.querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => answer(b.dataset.k)));
      stopT?.(); stopT = timerBar(bar, LIMIT, () => answer(null));
    }
    function answer(k) {
      if (locked) return; locked = true; stopT?.();
      const it = set[i]; const ok = k === it.a;
      yn.querySelectorAll('.g-choice').forEach(b => { b.disabled = true; if (b.dataset.k === it.a) b.classList.add('is-right'); else if (b.dataset.k === k) b.classList.add('is-wrong'); });
      if (ok) { score++; api.sfx('good'); } else api.sfx('bad');
      el.querySelector('[data-s]').textContent = score;
      const why = { active: 'فراغ كبير متعمّد في جنب واحد: <bdi class="en" dir="ltr">deliberate, asymmetric</bdi>.', passive: 'مسافات عادية بين السطور والعناصر: <bdi class="en" dir="ltr">default space</bdi>.', calm: 'براح = <bdi class="en" dir="ltr">calm and inviting</bdi>.', urgent: 'زحمة = <bdi class="en" dir="ltr">intense or urgent</bdi>.' }[it.a];
      note.innerHTML = `<b>${k === null ? 'الوقت خلص.' : ok ? 'صح.' : 'لأ.'}</b> ${why}`;
      i++;
      timers.push(setTimeout(() => { if (i < ROUNDS) round(); else endScreen(el, api, ctx, readSpace.id, score, ROUNDS, ['عينك بتقرا الفراغ زي الكلام.', 'كويس. الـ Active والـ Passive بقوا واضحين.', 'لسه بتتلخبط. ارجع لفصل «فراغ بقرار، وفراغ تلقائي».']); }, ok ? 900 : 1700));
    }
    const onKey = e => { const n = '12'.indexOf(e.key); const b = yn.querySelectorAll('.g-choice')[n]; if (n >= 0 && b && !b.disabled) { e.preventDefault(); answer(b.dataset.k); } };
    document.addEventListener('keydown', onKey);
    round();
    return (el._mgStop = () => { stopT?.(); timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey); });
  }
};

export default [declutter, readSpace];
