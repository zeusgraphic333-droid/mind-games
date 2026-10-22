// A district: Learn (chapters; each can drive a particle scene) · Play (trials) · Test (zone quiz with marks).
import { ZONE, ZONES } from '../content/zones.js';
import { openScreen } from './screen.js';
import { renderLesson, lessonProgress } from './learn.js';
import { GLYPH, ZONE_GLYPH } from './glyphs.js';
import { ICON, marks } from './icons.js';
import { esc, rich } from '../core/util.js';
import { state, visit, award, emit } from '../core/state.js';
import api from '../core/api.js';
import { mountZoneQuiz } from './quiz.js';
import { sfx } from '../core/sfx.js';
import { SCENE_INFO } from '../world/scenes.js';
import { ZONE_FORMATION } from '../world/formations.js';

const TABS = [{ id: 'learn', label: 'اتعلّم', icon: 'book' }, { id: 'play', label: 'العب', icon: 'play' }, { id: 'quiz', label: 'اختبر نفسك', icon: 'target' }];

/** content = { lesson, games } */
export function openZone(id, tab = 'learn', origin, content = {}) {
  const z = ZONE[id]; if (!z) return null;
  visit(id);
  if (ZONES.filter(q => q.id !== 'boss' && !q.bonus).every(q => state().visits[q.id])) award('explorer');
  const lesson = content.lesson || { chapters: [] };
  const games = content.games || [];
  const scr = openScreen({
    id: 'zone-' + id, title: z.ar, en: z.en + (z.lec ? ' · Lecture ' + z.lec : ''), glyph: ZONE_GLYPH[id],
    color: z.color, dark: z.dark, tabs: TABS,
    onTab(t, pane, first) {
      if (t === 'learn') { if (first) mountLearn(pane, z, lesson, scr); else scr._sceneNow?.(); }
      if (t !== 'learn') { emit('scene', { name: ZONE_FORMATION[z.id] }); const info = SCENE_INFO[ZONE_FORMATION[z.id]] || []; scr.setCaption(0, info[0], info[1]); }
      if (t === 'play') mountPlay(pane, z, games, first);
      if (t === 'quiz') mountZoneQuiz(pane, z, first);
      history.replaceState(null, '', `#/z/${id}/${t}`);
    }
  });
  const info = SCENE_INFO[ZONE_FORMATION[id]] || [];
  scr.setCaption(0, info[0], info[1]);
  scr.setTab(TABS.some(t => t.id === tab) ? tab : 'learn');
  return scr;
}

/** reading time from the words actually on the page (≈ 180 Arabic words a minute), plus a little per check/demo */
function readMinutes(lesson) {
  let words = 0, extra = 0;
  const SKIP = new Set(['t', 'id', 'html', 'art', 'svg', 'mount', 'scene', 'ref', 'glyph', 'kind', 'tone', 'color', 'q', 'fig', 'page', 'slide', 'cols']);
  const add = v => { if (typeof v === 'string') words += v.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; else if (Array.isArray(v)) v.forEach(add); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => { if (!SKIP.has(k)) add(x); }); };
  (lesson.chapters || []).forEach(ch => (ch.blocks || []).forEach(b => { if (b.t === 'check') extra += .25; else if (b.t === 'demo') extra += .5; else add(b); }));
  return Math.max(3, Math.round(words / 180 + extra));
}
function heroHTML(z, lesson) {
  const p = lessonProgress(lesson); const q = state().quiz[z.id];
  const h = lesson.hero || {};
  return `<section class="zhero">
    <p class="zhero__meta"><span class="hud-num">${String(z.n).padStart(2, '0')}</span><span>${z.lec ? 'Lecture ' + z.lec : ''}</span><span class="zhero__tag">${esc(z.tag)}</span></p>
    <h1 class="zhero__title"><span class="mask"><span>${esc(z.ar)}</span></span></h1>
    <p class="zhero__en" dir="ltr">${esc(z.en)}</p>
    <p class="zhero__say">${rich(h.say || z.blurb)}</p>
    <div class="zhero__stats">
      <div class="zstat"><span class="label">الدروس</span><span class="hud-num zstat__v" data-k="done">${p.done}/${p.total}</span><div class="bar"><i style="--p:${p.pct}"></i></div></div>
      <div class="zstat"><span class="label">الكويز</span><span class="zstat__v">${marks(q?.stars || 0)}</span><small>${q ? 'أحسن نتيجة ' + Math.round(q.best * 100) + '٪' : 'لسه'}</small></div>
      <div class="zstat"><span class="label">وقت المذاكرة</span><span class="zstat__v"><span class="hud-num">${readMinutes(lesson)}</span> <small>دقيقة</small></span></div>
    </div>
  </section>`;
}

function mountLearn(pane, z, lesson, scr) {
  pane.innerHTML = `<div class="wrap">${heroHTML(z, lesson)}<div class="learn"></div><div class="learn__end"></div></div>`;
  requestAnimationFrame(() => pane.querySelector('.zhero')?.classList.add('in'));
  const root = pane.querySelector('.learn');
  if (!lesson.chapters?.length) { root.innerHTML = `<div class="card empty">الدروس هنا لسه بتتكتب. جرّب الكويز أو العب.</div>`; return; }
  const refresh = () => {
    const p = lessonProgress(lesson);
    const v = pane.querySelector('[data-k="done"]'); if (v) { v.textContent = `${p.done}/${p.total}`; v.parentElement.querySelector('.bar i').style.setProperty('--p', p.pct); }
    const end = pane.querySelector('.learn__end');
    end.innerHTML = p.done === p.total ? `<section class="learn__done"><span class="glyph">${GLYPH.star}</span><div><h3>خلّصت دروس ${esc(z.ar)}</h3><p>دلوقتي جرّب التحدي، وبعده الكويز عشان تاخد العلامات.</p><div class="learn__acts"><button class="btn btn--zone" data-go="play">${ICON.play} العب</button><button class="btn" data-go="quiz">${ICON.target} اختبر نفسك</button></div></div></section>` : '';
    end.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => pane.closest('.screen').querySelector(`#tab-${b.dataset.go}`)?.click()));
  };
  const clean = renderLesson(root, lesson, z, { onProgress: refresh });
  refresh();
  // each chapter can ask the stage for a scene; the chapter crossing 35% of the view wins
  const chs = lesson.chapters;
  let cur = -1;
  const pick = () => {
    if (pane.hidden) return; // other tabs share the scroller; only the visible lesson drives the stage
    const steps = [...root.querySelectorAll('.path__step')]; const top = scr.body.getBoundingClientRect().top + scr.body.clientHeight * .35;
    let idx = -1; steps.forEach((s, i) => { if (s.getBoundingClientRect().top < top) idx = i; });
    if (idx === cur) return; cur = idx;
    const ch = idx < 0 ? null : chs[idx];
    const name = ch?.scene || ZONE_FORMATION[z.id];
    emit('scene', { name });
    const info = ch?.cap || SCENE_INFO[name.startsWith('sq:') ? 'squares' : name] || [];
    const extra = name.startsWith('sq:') ? name.slice(3).split('#')[0] : '';
    scr.setCaption(idx + 1, extra ? `Black Square · ${extra}` : info[0], info[1]);
  };
  let tick = 0;
  const onScroll = () => { if (tick) return; tick = requestAnimationFrame(() => { tick = 0; pick(); }); };
  scr.body.addEventListener('scroll', onScroll, { passive: true });
  scr._sceneNow = () => { cur = -2; pick(); };
  pane._cleanup = () => { clean(); scr.body.removeEventListener('scroll', onScroll); };
}

function mountPlay(pane, z, games, first) {
  if (!first && pane._playing) return;
  if (!games.length) { pane.innerHTML = `<div class="wrap"><div class="card empty">التحدي بتاع المنطقة دي لسه في المعمل.</div></div>`; return; }
  const list = () => {
    pane._stop?.(); pane._stop = null; pane._playing = false;
    pane.innerHTML = `<div class="wrap"><header class="pane__head"><p class="label"><b>${String(games.length).padStart(2, '0')}</b> تحديات</p><h2>العب. وانت مش واخد بالك، هتذاكر.</h2><p>كل تحدي بيديك XP وعلامات، وبيثبّت المعلومة بالتكرار.</p></header>
      <div class="gamelist">${games.map((g, i) => { const s = state().games[g.id]; return `<button type="button" class="gamecard" data-i="${i}">
        <span class="gamecard__n hud-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="gamecard__txt"><b>${esc(g.title)}</b>${g.en ? `<bdi class="en" dir="ltr">${esc(g.en)}</bdi>` : ''}<span class="gamecard__how">${rich(g.how || '')}</span></span>
        <span class="gamecard__meta">${s ? marks(s.stars) + `<small>أحسن سكور <span class="hud-num">${s.best}</span></small>` : '<span class="chip chip--zone">جديد</span>'}</span>
        <span class="gamecard__go">${ICON.next}</span>
      </button>`; }).join('')}</div></div>`;
    pane.querySelectorAll('.gamecard').forEach(b => b.addEventListener('click', () => { sfx('pop'); play(games[+b.dataset.i]); }));
  };
  const play = g => {
    try { pane._stop?.(); } catch (e) { } pane._stop = null;
    pane._playing = true;
    pane.innerHTML = `<div class="wrap gamestage"><div class="gamestage__bar"><button type="button" class="btn btn--sm gamestage__back">${ICON.back} كل التحديات</button><b>${esc(g.title)}</b></div><div class="gamestage__in"></div></div>`;
    pane.querySelector('.gamestage__back').addEventListener('click', list);
    const st = pane.querySelector('.gamestage__in');
    try { const stop = g.mount(st, api, { zone: z, again: () => play(g), back: list }); pane._stop = typeof stop === 'function' ? stop : null; }
    catch (e) { console.error('game', g.id, e); st.innerHTML = '<p>التحدي وقع. ارجع وجرّب تاني.</p>'; }
    // phones: the particle band sits above the content, so bring the trial up to the top
    if (matchMedia('(max-width: 980px)').matches) requestAnimationFrame(() => pane.querySelector('.gamestage__bar')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce' ? 'auto' : 'smooth' }));
  };
  list();
}
