// Lecture 01 trial: principles quick-fire.
import { marks } from '../ui/icons.js';
const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const P = ['Balance', 'Contrast', 'Emphasis', 'Hierarchy', 'Rhythm', 'Unity', 'Variety', 'Movement', 'Repetition', 'Alignment', 'Proximity'];
const AR = { Balance: 'التوازن', Contrast: 'التباين', Emphasis: 'التركيز', Hierarchy: 'الهيراركي', Rhythm: 'الإيقاع', Unity: 'الوحدة', Variety: 'التنوع', Movement: 'الحركة', Repetition: 'التكرار', Alignment: 'المحاذاة', Proximity: 'القرب' };
const CASES = [
  ['تلات حاجات صغيرة قصاد حاجة واحدة كبيرة، والتصميم مش مايل.', 'Three small objects offset one large object', 'Balance'],
  ['نفس الأشكال متعكوسة على جانبين محور زي المراية.', 'Shapes mirrored on either side of an axis', 'Balance', ['Repetition']],
  ['كلام رمادي على أبيض بدل الأسود على الأبيض.', 'Gray text on a white background', 'Contrast'],
  ['الفرق بين حاجتين أو أكتر: فاتح وغامق، رفيع وتخين.', 'The difference between two or more objects', 'Contrast'],
  ['حيطة لونها فاقع في آخر طُرقة طويلة.', 'A bright wall at the end of a long hallway', 'Emphasis'],
  ['بيعمل Focal point، وساعات اسمه dominance.', 'Creates a focal point; sometimes called dominance', 'Emphasis'],
  ['ترتيب أهمية المعلومات: العنوان أهم عنصر، فبيتعمل أكبر من الـ body text.', 'Ordering information by importance', 'Hierarchy', ['Emphasis', 'Contrast']],
  ['حجم، لون، خط، مسافات، قرب، محاذاة، تكرار، وخطوط موجّهة.', 'Eight tools to order importance', 'Hierarchy'],
  ['مربعات بتكبر واحد ورا التاني بالتدريج.', 'A gradual change in size or color', 'Rhythm', ['Repetition']],
  ['أشكال متطابقة طالعة من محور في النص زي الشمس.', 'Identical objects coming from a central axis', 'Rhythm', ['Repetition', 'Balance']],
  ['كل المبادئ اتطبقت صح، والتصميم بقى حتة واحدة.', 'All principles correctly applied — one cohesive unit', 'Unity'],
  ['غيّرت أحجام وألوان الدواير عشان التصميم ميبقاش ممل.', 'Varying elements to avoid making them boring', 'Variety'],
  ['المصمم متحكم في العين هتبص على إيه بعد كده.', 'Controls what the viewer sees next', 'Movement'],
  ['نفس العنصر متكرر في التصميم كله، فبقى شكله موحّد ومتّسق.', 'Repeating elements for a unified, consistent look', 'Repetition', ['Unity', 'Rhythm']],
  ['العناصر والكلام واقفين على نفس الخط.', 'Elements line up with the composition', 'Alignment'],
  ['الحاجات اللي ليها علاقة ببعض جنب بعض، والباقي بعيد.', 'Related things nearer to each other', 'Proximity']
];
const shuffle = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export default [{
  id: 'old-quickfire', title: 'مبادئ على السريع', en: 'Principles quick-fire', how: 'موقف من التصميم بيظهر، واختار المبدأ. ١٠ جولات، والوقت بيقصر مع الكومبو. أرقام ١–٤ من الكيبورد.',
  mount(el, api, ctx) {
    const r = api.seeded(Date.now() % 99991); const MAX = 10;
    const deck = shuffle(CASES, r).slice(0, MAX);
    let i = 0, score = 0, combo = 0, raf = 0, nextT = 0, locked = false; const misses = [];
    el.innerHTML = `<div class="g-card old-game">
      <div class="g-hud"><span class="chip">جولة <span class="hud-num old-r">1</span>/<span class="hud-num">${MAX}</span></span><span class="chip old-combo" hidden>كومبو <span class="hud-num">×0</span></span><span class="chip">سكور <span class="hud-num old-s">0</span></span></div>
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
      $('.old-opts').innerHTML = opts.map((p, k) => `<button type="button" class="g-choice" data-p="${p}"><span class="hud-num old-key">${k + 1}</span><b>${AR[p]}</b><small dir="ltr">${p}</small></button>`).join('');
      $('.old-opts').querySelectorAll('.g-choice').forEach(b => b.addEventListener('click', () => answer(b.dataset.p, b)));
      const ms = (reduced() ? 1.5 : 1) * Math.max(4500, 8000 - combo * 350); const t0 = performance.now(); const fill = $('.g-timer i');
      const tick = t => { const p = Math.max(0, 1 - (t - t0) / ms); fill.style.setProperty('--t', p.toFixed(3)); if (p <= 0) { answer(null, null); return; } raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
    function answer(p, btn) {
      if (locked) return; locked = true; stopT();
      const c = deck[i], ok = p === c[2];
      el.querySelectorAll('.g-choice').forEach(b => { b.disabled = true; if (b.dataset.p === c[2]) b.classList.add('is-right'); else if (b === btn) b.classList.add('is-wrong'); });
      if (ok) { score++; combo++; api.sfx('good'); api.burst(btn, '#46E3A0'); } else { combo = 0; misses.push(`${c[0]} ← <b>${AR[c[2]]}</b> <span dir="ltr">(${c[2]})</span>`); api.sfx('bad'); api.shake($('.old-case')); }
      $('.old-s').textContent = score; const cb = $('.old-combo'); cb.hidden = combo < 2; cb.querySelector('.hud-num').textContent = '×' + combo;
      $('.old-why').innerHTML = `${p === null ? 'الوقت خلص. ' : ''}الإجابة: <b>${AR[c[2]]}</b> <span dir="ltr">${c[2]}</span>`;
      i++; nextT = setTimeout(() => { if (i >= MAX) finish(); else show(); }, ok ? 1000 : 1800);
    }
    function finish() {
      const res = api.finishGame('old-quickfire', score, MAX, el.querySelector('.g-card'));
      el.innerHTML = `<div class="g-card g-end old-end"><span class="glyph">${api.GLYPH.spiral}</span><p class="label">النتيجة</p>
        <div class="old-end__score"><span class="hud-num">${score}</span><span class="hud-num old-end__of">/${MAX}</span></div>
        <h3>${score >= 9 ? 'أساسك متين' : score >= 6 ? 'كويس' : 'محتاج مراجعة'}</h3>
        <p>محاضرة ١ برّه الكويز، بس الأساس ده بيخلّي محاضرة ٢ و٣ أسهل.</p>
        <div class="old-end__marks">${marks(res.stars, 3, 'marks--big')}</div>
        <p><span class="chip chip--zone"><span class="hud-num" dir="ltr">+${res.xp} XP</span></span></p>
        ${misses.length ? `<div class="old-miss"><p class="label">راجع دول</p><ul>${misses.map(m => `<li>${m}</li>`).join('')}</ul></div>` : ''}
        <div class="g-acts"><button type="button" class="btn btn--zone" data-a="again">العب تاني</button><button type="button" class="btn" data-a="back">كل التحديات</button></div></div>`;
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
