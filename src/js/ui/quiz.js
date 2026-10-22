// Zone quiz: 10 questions, instant feedback, combo meter, stars at the end.
import { qFor, QBY } from '../data/index.js';
import { mountQ } from './qcard.js';
import { GLYPH, ZONE_GLYPH } from './glyphs.js';
import { ICON, marks } from './icons.js';
import { esc, shuffle, qtext } from '../core/util.js';
import { state, recordAnswer, setQuizResult, addXP, emit } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { confetti, burst, floatFrom, shake } from '../core/fx.js';

/** balanced pick: favour questions you got wrong or never saw */
export function pickSet(pool, n, mix = { 1: .3, 2: .5, 3: .2 }) {
  const S = state();
  const weight = q => (S.wrong[q.id] ? 3 : 0) + (q.id in S.checks ? 0 : 1) + Math.random() * 2;
  const by = lv => shuffle(pool.filter(q => q.lv === lv)).sort((a, b) => weight(b) - weight(a));
  const want = { 1: Math.round(n * mix[1]), 3: Math.round(n * mix[3]) }; want[2] = n - want[1] - want[3];
  let out = [];
  for (const lv of [1, 2, 3]) out.push(...by(lv).slice(0, want[lv]));
  if (out.length < n) out.push(...shuffle(pool.filter(q => !out.includes(q))).slice(0, n - out.length));
  return out.sort((a, b) => a.lv - b.lv);
}

export function mountZoneQuiz(pane, z, first) {
  if (!first && pane._busy) return;
  start();
  function start() {
    pane._busy = false;
    const pool = qFor(z.tp);
    const best = state().quiz[z.id];
    pane.innerHTML = `<div class="wrap"><section class="qstart">
      <p class="label"><b>${pool.length}</b> سؤال في البنك · بنختار ١٠</p>
      <h2>كويز ${esc(z.ar)}</h2>
      <p>كل سؤال بيقولك صح ولا غلط على طول، وبيشرحلك ليه. جيب <b>٩٠٪</b> عشان تاخد ٣ علامات.</p>
      <div class="qstart__row"><button type="button" class="btn btn--zone btn--lg qstart__go">${ICON.target} ابدأ الكويز</button>${best ? `<span class="qstart__best">${marks(best.stars)}<small>أحسن نتيجة <span class="hud-num">${Math.round(best.best * 100)}%</span></small></span>` : ''}</div>
      <ul class="qstart__rules"><li><span class="hud-num">01</span> أسئلة بالإنجليزي زي الامتحان، وشرح بالعربي.</li><li><span class="hud-num">02</span> من السهل للصعب.</li><li><span class="hud-num">03</span> غلطاتك بتتحفظ لوضع الانتقام في الامتحان.</li></ul>
    </section></div>`;
    pane.querySelector('.qstart__go').addEventListener('click', () => { sfx('pop'); run(pickSet(pool, Math.min(10, pool.length))); });
  }
  function run(set) {
    pane._busy = true;
    let i = 0, score = 0, combo = 0; const wrong = [];
    pane.innerHTML = `<div class="wrap qrun">
      <div class="qrun__top"><div class="bar" style="--p:0"><i></i></div><span class="qrun__n">1/${set.length}</span><span class="qrun__combo" hidden>${GLYPH.flame}<b class="hud-num">0</b><span>كومبو</span></span></div>
      <div class="qrun__card"></div>
      <div class="qrun__acts"><button type="button" class="btn btn--zone qrun__next" hidden>اللي بعده ${ICON.next}</button></div></div>`;
    const card = pane.querySelector('.qrun__card'), next = pane.querySelector('.qrun__next'), comboEl = pane.querySelector('.qrun__combo');
    let h = null;
    const show = () => {
      h?.destroy(); next.hidden = true;
      pane.querySelector('.qrun__n').textContent = `${i + 1}/${set.length}`;
      pane.querySelector('.qrun .bar').style.setProperty('--p', i / set.length);
      card.innerHTML = '<div></div>'; card.classList.add('qc--focus');
      h = mountQ(card.firstChild, set[i], {
        label: `سؤال ${i + 1}`,
        onAnswer(ok, idx, q, btn) {
          recordAnswer(q.id, ok);
          if (ok) { score++; combo++; sfx('good'); burst(btn, '#2BD49A'); if (combo >= 3) floatFrom(btn, `كومبو ×${combo}`, 'fx-float--good'); }
          else { combo = 0; wrong.push(q); sfx('bad'); shake(card); }
          comboEl.hidden = combo < 2; comboEl.querySelector('b').textContent = combo;
          next.hidden = false; next.innerHTML = i + 1 < set.length ? `اللي بعده ${ICON.next}` : `النتيجة ${ICON.trophy}`;
          setTimeout(() => next.focus({ preventScroll: true }), 50);
          card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
      pane.closest('.screen__body').scrollTop = 0;
    };
    next.addEventListener('click', () => { sfx('click'); i++; if (i < set.length) show(); else end(); });
    show();
    function end() {
      h?.destroy(); pane._busy = false;
      const pct = score / set.length;
      const before = state().quiz[z.id]?.stars || 0;
      const stars = setQuizResult(z.id, pct);
      const xp = score * 5 + Math.max(0, stars - before) * 25;
      addXP(xp, 'quiz:' + z.id);
      const all = Object.values(state().quiz); if (all.length >= 7 && all.every(q => q.stars === 3)) emit('allstars');
            const line = pct === 1 ? 'فول مارك! مفيش كلام.' : pct >= .9 ? 'وحش! كده جاهز.' : pct >= .7 ? 'حلو جدًا. شوية تركيز وتبقى ٣ نجوم.' : pct >= .5 ? 'مش بطال. راجع الغلطات وارجع تاني.' : 'ولا يهمك. ارجع لدروس المنطقة وبعدين حاول تاني.';
      pane.innerHTML = `<div class="wrap"><section class="qend">
        <p class="label">النتيجة · كويز ${esc(z.ar)}</p>
        <div class="qend__score"><span class="hud-num">${score}</span><span class="qend__of hud-num">/${set.length}</span></div>
        <div class="qend__marks">${marks(stars, 3, 'marks--big')}</div>
        <p class="qend__line">${line}</p>
        <p><span class="chip chip--zone">${ICON.bolt}<span class="hud-num">+${xp}</span> XP</span></p>
        <div class="qend__acts"><button type="button" class="btn btn--zone" data-a="again">${ICON.refresh} كويز جديد</button><button type="button" class="btn" data-a="learn">${ICON.book} راجع الدروس</button></div>
        ${wrong.length ? `<div class="qend__review"><h4>غلطاتك <span class="label">هتلاقيها تاني في وضع الانتقام</span></h4>${wrong.map(q => `<details class="rev"><summary dir="ltr">${qtext(q.q)}</summary><p dir="ltr" class="rev__a">${esc(q.o[q.a ?? 0])}</p><p>${esc(q.r || '')}</p></details>`).join('')}</div>` : ''}
      </section></div>`;
      if (stars >= 2) { sfx('win'); confetti({ big: stars === 3 }); } else sfx('boop');
      pane.querySelector('[data-a="again"]').addEventListener('click', () => run(pickSet(qFor(z.tp), Math.min(10, qFor(z.tp).length))));
      pane.querySelector('[data-a="learn"]').addEventListener('click', () => pane.closest('.screen').querySelector('#tab-learn')?.click());
      emit('progress');
    }
  }
}
