// The Archive: flashcards · exam traps · trigger words · exam intel · you (rank, achievements, settings).
import { TERMS, PAIRS } from '../data/index.js';
import { TRIGGERS } from '../data/triggers.js';
import { openScreen } from './screen.js';
import { ICON, marks } from './icons.js';
import { GLYPH } from './glyphs.js';
import { esc, shuffle } from '../core/util.js';
import { state, save, levelOf, LEVELS, BADGES, setSetting, resetAll, emit } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { modal } from './events.js';
import { ZONES } from '../content/zones.js';

const TABS = [{ id: 'cards', label: 'كروت' }, { id: 'traps', label: 'فخاخ' }, { id: 'words', label: 'كلمات السر' }, { id: 'intel', label: 'عن الامتحان' }, { id: 'me', label: 'إنت' }];

export function openArchive(section, world) {
  if (world?.real) world.morph('nebula', { dur: 1.8 });
  const scr = openScreen({
    id: 'archive', title: 'الأرشيف', en: 'Archive · review tools', glyph: 'square', color: '#EDEBE6', dark: '#9A988F', tabs: TABS,
    onTab(t, pane, first) {
      history.replaceState(null, '', '#/archive/' + t);
      const cap = { cards: ['Flashcards', 'الكروت'], traps: ['Exam traps', 'الفخاخ'], words: ['Trigger words', 'كلمات السر'], intel: ['Exam intel', 'عن الامتحان'], me: ['You', 'إنت'] }[t];
      scr.setCaption(TABS.findIndex(x => x.id === t) + 1, cap[0], cap[1]);
      if (t === 'cards') cards(pane, first);
      if (t === 'traps' && first) traps(pane);
      if (t === 'words' && first) words(pane);
      if (t === 'intel' && first) intel(pane);
      if (t === 'me') me(pane);
    }
  });
  scr.setTab(TABS.some(t => t.id === section) ? section : 'cards');
  return scr;
}
const head = (n, title, sub) => `<header class="pane__head"><p class="label"><b>${n}</b> ${sub || ''}</p><h2>${title}</h2></header>`;

/* ---------------- flashcards ---------------- */
function cards(pane, first) {
  if (!first && pane._deck) return;
  const S = state(); S.known ||= {};
  let filter = 'all', deck = [], i = 0, flipped = false;
  const LEC = { all: 'الكل', '02p': 'سيكولوجية التصميم', '02e': 'التعبير', '03': 'الجشطالت' };
  pane.innerHTML = `<div class="wrap">${head(String(TERMS.length), 'كروت المراجعة', 'كارت')}
    <p class="arc__lead">اقرا المصطلح، قول التعريف في دماغك، وبعدين اقلب. لو عارفه علّم عليه، ولو لأ هيرجعلك.</p>
    <div class="arc__filters" role="radiogroup">${Object.entries(LEC).map(([k, v]) => `<button type="button" class="chip arc__f" role="radio" data-f="${k}" aria-checked="${k === 'all'}">${v}</button>`).join('')}<button type="button" class="chip arc__f" data-shuffle>${ICON.shuffle} لخبطهم</button></div>
    <div class="fc" tabindex="0" aria-live="polite"><div class="fc__in"><div class="fc__face fc__front"></div><div class="fc__face fc__back"></div></div></div>
    <div class="fc__bar"><button type="button" class="btn btn--icon" data-a="prev" aria-label="اللي قبله">${ICON.back}</button><span class="hud-num fc__n"></span><button type="button" class="btn btn--icon" data-a="next" aria-label="اللي بعده">${ICON.next}</button></div>
    <div class="fc__acts"><button type="button" class="btn" data-a="again">لسه</button><button type="button" class="btn btn--good" data-a="know">${ICON.check} عارفها</button></div>
    <div class="fc__prog"><span class="label">عارف</span> <b class="hud-num fc__known"></b><div class="bar bar--good"><i></i></div></div>
  </div>`;
  const $ = s => pane.querySelector(s);
  const build = () => { deck = TERMS.filter(t => filter === 'all' || t.lec === filter); deck.sort((a, b) => (S.known[a.t] ? 1 : 0) - (S.known[b.t] ? 1 : 0)); i = 0; draw(); };
  const draw = () => {
    const t = deck[i]; if (!t) return; flipped = false; $('.fc').classList.remove('is-flipped');
    $('.fc__front').innerHTML = `<span class="label">${LEC[t.lec] || ''}</span><b dir="ltr">${esc(t.t)}</b><span class="fc__ar">${esc(t.ar)}</span><span class="fc__hint">${ICON.refresh} اضغط أو Space</span>${S.known[t.t] ? '<span class="chip chip--good fc__k">عارفها</span>' : ''}`;
    $('.fc__back').innerHTML = `<p dir="ltr">${esc(t.d)}</p><p class="fc__r">${esc(t.r)}</p>`;
    $('.fc__n').textContent = `${i + 1}/${deck.length}`;
    const k = TERMS.filter(x => S.known[x.t]).length; $('.fc__known').textContent = `${k}/${TERMS.length}`; $('.fc__prog .bar i').style.setProperty('--p', k / TERMS.length);
  };
  const flip = () => { flipped = !flipped; $('.fc').classList.toggle('is-flipped', flipped); sfx('flip'); };
  $('.fc').addEventListener('click', flip);
  $('.fc').addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } if (e.key === 'ArrowLeft') { i = (i + 1) % deck.length; draw(); } if (e.key === 'ArrowRight') { i = (i - 1 + deck.length) % deck.length; draw(); } });
  pane.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a; const t = deck[i];
    if (a === 'next') i = (i + 1) % deck.length;
    if (a === 'prev') i = (i - 1 + deck.length) % deck.length;
    if (a === 'know') { S.known[t.t] = 1; save(); sfx('good'); i = (i + 1) % deck.length; }
    if (a === 'again') { delete S.known[t.t]; save(); sfx('click'); i = (i + 1) % deck.length; }
    draw();
  }));
  pane.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.f; pane.querySelectorAll('[data-f]').forEach(x => x.setAttribute('aria-checked', String(x === b))); build(); sfx('click'); }));
  $('[data-shuffle]').addEventListener('click', () => { deck = shuffle(deck); i = 0; draw(); sfx('swoosh'); });
  pane._deck = true; build();
}

/* ---------------- traps ---------------- */
function traps(pane) {
  pane.innerHTML = `<div class="wrap">${head(String(PAIRS.length), 'الفخاخ', 'فخ')}
    <p class="arc__lead">دي الحاجات اللي بتتلخبط في بعض في الامتحان. اقرا السطر الأخير في كل كارت: ده اللي بيفرّق.</p>
    <div class="traps">${PAIRS.map(([a, ad, b, bd, tip], k) => `<article class="trap">
      <span class="hud-num trap__n">${String(k + 1).padStart(2, '0')}</span>
      <div class="trap__ab"><div><b dir="ltr">${esc(a)}</b><p dir="ltr">${esc(ad)}</p></div><span class="trap__vs">vs</span><div><b dir="ltr">${esc(b)}</b><p dir="ltr">${esc(bd)}</p></div></div>
      <p class="trap__tip">${GLYPH.bolt}<span>${esc(tip)}</span></p></article>`).join('')}</div></div>`;
}

/* ---------------- trigger words ---------------- */
function words(pane) {
  pane.innerHTML = `<div class="wrap">${head(String(TRIGGERS.length), 'كلمات السر', 'كلمة')}
    <p class="arc__lead">لو شفت الكلمات دي في السؤال، الإجابة غالبًا اللي جنبها. اكتب في الخانة عشان تدوّر.</p>
    <input class="arc__search" type="search" placeholder="دوّر… مثلًا: unity أو closure" aria-label="دوّر في كلمات السر">
    <div class="blk-table arc__tbl"><table dir="ltr"><thead><tr><th>If the question says</th><th>Think</th><th>Lec</th></tr></thead><tbody>${TRIGGERS.map(([w, a, l]) => `<tr><td>“${esc(w)}”</td><td><b>${esc(a)}</b></td><td class="hud-num">${l}</td></tr>`).join('')}</tbody></table></div></div>`;
  const rows = [...pane.querySelectorAll('tbody tr')];
  pane.querySelector('.arc__search').addEventListener('input', e => { const v = e.target.value.trim().toLowerCase(); rows.forEach(r => r.hidden = v && !r.textContent.toLowerCase().includes(v)); });
}

/* ---------------- exam intel ---------------- */
function intel(pane) {
  const src = [
    ['BUC · School of Applied Arts programme page (MDP001 row)', 'https://buc.edu.eg/new-undergraduate/applied-arts-new-2/'],
    ['BUC Applied Arts student guide, 2021 (assessment rules, grade scale)', 'https://buc.edu.eg/wp-content/uploads/2022/10/12-Students-guide-2021_compressed.pdf'],
    ['BUC teaching, learning and evaluation strategy (quizzes as assessment)', 'https://buc.edu.eg/wp-content/uploads/2022/10/05-Strategy-of-Teaching-Learning-and-Evaluation.pdf'],
    ['BUC Exam Portal (mElimu)', 'https://buc-exam.melimu.com'],
    ['Moodle docs · quiz settings (timer, navigation, review)', 'https://docs.moodle.org/405/en/Quiz_settings']
  ];
  pane.innerHTML = `<div class="wrap intel">${head('2026', 'عن الامتحان', 'اتجمع في أكتوبر')}
    <section class="intel__sec"><h3><span class="hud-num">01</span> المؤكد</h3><ul class="blk-list blk-list--dot">
      <li>المادة <bdi class="en" dir="ltr">MDP001 — Graphic Design Fundamentals</bdi>، المستوى التاني، الترم الأول. ٣ ساعات معتمدة: محاضرة ساعة وسكشن ٤ ساعات.</li>
      <li>الدرجات: شفوي ٥٠ + أعمال سنة ٥٠ = ١٠٠. مفيش امتحان تحريري نهائي. يعني الكويز النظري غالبًا جوه أعمال السنة.</li>
      <li>الجامعة عندها <bdi class="en" dir="ltr">Exam Portal</bdi> مبني على <bdi class="en" dir="ltr">mElimu</bdi> وشبه <bdi class="en" dir="ltr">Moodle</bdi>: تايمر، تنقّل بين الأسئلة، علامات، وصفحة ملخّص قبل التسليم.</li>
      <li>كلية الفنون التطبيقية بتذكر الكويزات القصيرة و"الأسئلة القصيرة الموضوعية" ضمن أدوات التقييم الرسمية.</li>
      <li>التقديرات (دليل ٢٠٢١، ممكن يكون اتحدّث): <bdi class="en hud-num" dir="ltr">A 95 · A− 90 · B+ 87 · B 80 · B− 76 · C+ 73 · C 70 · C− 67 · D+ 64 · D 60 · F &lt;60</bdi>. النجاح من ٦٠٪، والحضور لازم ٧٥٪ على الأقل.</li></ul></section>
    <section class="intel__sec"><h3><span class="hud-num">02</span> مش منشور</h3><ul class="blk-list blk-list--dot">
      <li>عدد الأسئلة، والوقت، ونوع الأسئلة، ووزن الكويز من الـ٥٠: محدش نشرهم.</li>
      <li>عشان كده الامتحانات هنا معمولة على أشهر شكل في الجامعات المصرية: <bdi class="en" dir="ltr">MCQ</bdi> بأربع اختيارات، وشوية صح وغلط، و"<bdi class="en" dir="ltr">which is NOT</bdi>"، وأسئلة بالصور، من السهل للصعب.</li>
      <li>التوزيع قريب من مواصفات الورقة الامتحانية: ٤٠٪ تذكّر وفهم، ٣٠٪ تطبيق، ٢٠٪ تحليل، ١٠٪ تقييم.</li></ul></section>
    <section class="intel__sec"><h3><span class="hud-num">03</span> ٨ عادات تكسب بيها نقط سهلة</h3><ol class="blk-list blk-list--num">
      <li>جاوب في دماغك الأول، وبعدين دوّر على إجابتك في الاختيارات.</li>
      <li>خلي بالك من <bdi class="en" dir="ltr">NOT</bdi> و <bdi class="en" dir="ltr">EXCEPT</bdi>. كلمة واحدة بتقلب الإجابة.</li>
      <li>شوف العيلة: السؤال عن فكرة؟ شيل القوانين. عن شكل؟ شيل الألوان.</li>
      <li>صدّق كلام السلايد. الإجابة الصح غالبًا بنفس الكلمات.</li>
      <li>دقيقة لكل سؤال. ٢٠ سؤال في ٢٠ دقيقة مفيهمش وقت للتأمل.</li>
      <li>علّم وكمّل. وقفت ٤٠ ثانية؟ علّم عليه وارجعله.</li>
      <li>متسيبش سؤال فاضي. الفاضي صفر، والتخمين ٢٥٪.</li>
      <li>قبل "<bdi class="en" dir="ltr">Submit all and finish</bdi>" اتأكد مفيش "<bdi class="en" dir="ltr">Not yet answered</bdi>".</li></ol></section>
    <section class="intel__sec"><h3><span class="hud-num">04</span> المصادر</h3><ul class="intel__src">${src.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener" dir="ltr">${esc(t)}</a></li>`).join('')}<li dir="ltr">Course slides: Lecture 02 (Psychology of Design; Express Meaning) and Lecture 03 (Gestalt Principles of Visual Perception), 2026–2027.</li></ul></section>
    <a class="btn btn--zone btn--lg" href="#/boss/portal">جرّب امتحان البورتال ${ICON.next}</a>
  </div>`;
}

/* ---------------- you ---------------- */
function me(pane) {
  const S = state(), lv = levelOf();
  const ex = S.exams; const acc = ex.length ? Math.round(ex.reduce((a, e) => a + e.pct, 0) / ex.length * 100) : null;
  const quiz = ZONES.filter(z => z.tp.length && !z.bonus).map(z => ({ z, q: S.quiz[z.id] }));
  pane.innerHTML = `<div class="wrap mep-page">
    <section class="mep__hero"><span class="mep__big">${GLYPH[S.sigil] || GLYPH.circle}</span><div><p class="label">Lv ${lv.n} · ${esc(lv.en)}</p><h2>${esc(S.name || 'ضيف')}</h2><p class="mep__rank">${esc(lv.ar)}</p>
      <div class="mep__xp"><span class="hud-num">${S.xp}</span><span class="label">XP</span><div class="bar"><i style="--p:${lv.pct}"></i></div><span class="label">${lv.next ? `فاضل <span class="hud-num">${lv.next - S.xp}</span> للرانك الجاي` : 'وصلت لآخر رانك'}</span></div></div></section>
    <div class="result__stats"><div><span class="label">أيام ورا بعض</span><b class="hud-num">${S.streak.days}</b></div><div><span class="label">أحسن سلسلة</span><b class="hud-num">${S.streak.best}</b></div><div><span class="label">امتحانات</span><b class="hud-num">${ex.length}</b></div><div><span class="label">متوسط</span><b class="hud-num">${acc == null ? '—' : acc + '%'}</b></div></div>
    <section class="mep__sec"><h3>الرانكات</h3><ol class="ranks">${LEVELS.map((L, k) => `<li class="${k + 1 < lv.n ? 'is-done' : k + 1 === lv.n ? 'is-now' : ''}"><span class="hud-num">${String(k + 1).padStart(2, '0')}</span><b>${esc(L.ar)}</b><small dir="ltr">${esc(L.en)}</small><span class="hud-num ranks__xp">${L.xp}</span></li>`).join('')}</ol></section>
    <section class="mep__sec"><h3>علامات الكويزات</h3><div class="mep__quiz">${quiz.map(({ z, q }) => `<a class="mq" href="#/z/${z.id}/quiz" style="--zc:${z.color}"><b>${esc(z.ar)}</b>${marks(q?.stars || 0)}<span class="hud-num">${q ? Math.round(q.best * 100) + '%' : '—'}</span></a>`).join('')}</div></section>
    <section class="mep__sec"><h3>الإنجازات <span class="label"><span class="hud-num">${Object.keys(S.badges).length}/${Object.keys(BADGES).length}</span></span></h3><div class="badges">${Object.entries(BADGES).map(([id, b]) => `<div class="badge ${S.badges[id] ? 'is-on' : ''}"><span class="badge__g">${GLYPH[b.icon] || GLYPH.star}</span><b>${esc(b.ar)}</b><small>${esc(b.d)}</small></div>`).join('')}</div></section>
    <section class="mep__sec"><h3>الإعدادات</h3>
      <label class="set"><span><b>الصوت</b><small>أصوات خفيفة للتفاعل.</small></span><input type="checkbox" data-s="sound" ${S.settings.sound ? 'checked' : ''}></label>
      <label class="set"><span><b>أسئلة محاضرة ١ في الامتحانات</b><small>برّه منهج الكويز. احتياطي بس.</small></span><input type="checkbox" data-s="bonus" ${S.settings.bonus ? 'checked' : ''}></label>
      <label class="set"><span><b>حركة أقل</b><small>يقلّل الأنيميشن والانتقالات.</small></span><input type="checkbox" data-s="motion" ${S.settings.motion === 'reduce' ? 'checked' : ''}></label>
      <div class="set set--danger"><span><b>ابدأ من الأول</b><small>يمسح الـXP والتقدّم والإنجازات من الجهاز ده.</small></span><button type="button" class="btn btn--sm" data-reset>امسح التقدّم</button></div>
    </section></div>`;
  pane.querySelectorAll('[data-s]').forEach(i => i.addEventListener('change', () => {
    const k = i.dataset.s;
    if (k === 'motion') { setSetting('motion', i.checked ? 'reduce' : 'auto'); document.documentElement.dataset.motion = i.checked ? 'reduce' : ''; }
    else setSetting(k, i.checked);
    sfx('click');
  }));
  pane.querySelector('[data-reset]').addEventListener('click', () => modal({ glyph: 'infinity', kicker: 'تأكيد', title: 'تمسح كل حاجة؟', body: 'التقدّم كله هيتمسح من الجهاز ده، ومفيش رجوع.', acts: [{ label: 'امسح', primary: true, run: () => { resetAll(); location.hash = '#/'; location.reload(); } }, { label: 'لأ' }] }));
}
