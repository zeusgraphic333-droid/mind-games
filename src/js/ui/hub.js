// The hub: an orbit of districts around the eye. Level-select: rotate the orbit, preview a district, dive in.
import gsap from 'gsap';
import { ZONES, ZONE } from '../content/zones.js';
import { ringPoint } from '../world/formations.js';
import { ZONE_FORMATION } from '../world/formations.js';
import { GLYPH, ZONE_GLYPH, glyph } from './glyphs.js';
import { ICON, marks } from './icons.js';
import { esc } from '../core/util.js';
import { state, levelOf, on } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { lessonProgress } from './learn.js';
import * as THREE from 'three';

const STEP = Math.PI * 2 / ZONES.length;

export const hubStage = () => innerWidth > 1100 ? { cx: .42, cy: .5, z: 13.5 } : innerWidth > 760 ? { cx: .5, cy: .44, z: 14.5 } : { cx: .5, cy: .36, z: 12.5 };
export function createHub(world, { lessons = {}, onEnter, onOpen }) {
  const root = document.getElementById('hud');
  root.innerHTML = `
    <header class="hud__top">
      <a class="brand" href="#/" aria-label="Mind Games — الرئيسية"><span class="brand__mark">${GLYPH.eye}</span><span class="brand__txt"><b>MIND GAMES</b><small>عقلك بيشتغلك</small></span></a>
      <div class="hud__me">
        <button type="button" class="me" data-open="profile" aria-label="ملفك"><span class="me__sigil"></span><span class="me__txt"><b class="me__name"></b><small class="me__rank"></small></span></button>
        <div class="xp" aria-label="الخبرة"><span class="xp__n hud-num"></span><span class="xp__l">XP</span><div class="bar xp__bar"><i></i></div></div>
        <span class="streak chip" title="أيام ورا بعض">${GLYPH.flame}<span class="hud-num"></span></span>
        <button type="button" class="btn btn--icon btn--ghost hud__sound" aria-label="الصوت"></button>
        <button type="button" class="btn btn--sm hud__archive" data-open="archive">${ICON.cards}<span>الأرشيف</span></button>
      </div>
    </header>
    <div class="nodes" role="listbox" aria-label="مناطق المنهج" aria-orientation="horizontal"></div>
    <section class="sel" aria-live="polite">
      <div class="sel__meta"><span class="hud-num sel__n" dir="ltr"></span><span class="sel__lec"></span><span class="sel__tag"></span></div>
      <h1 class="sel__title"></h1>
      <p class="sel__en" dir="ltr"></p>
      <p class="sel__blurb"></p>
      <div class="sel__row"><button type="button" class="btn btn--zone btn--lg sel__go"><span>ادخل</span>${ICON.next.replace('<svg', '<svg class="arrow"')}</button><div class="sel__stats"></div></div>
    </section>
    <nav class="hud__nav" aria-label="لف المدار">
      <button type="button" class="btn btn--icon" data-step="-1" aria-label="اللي قبلها">${ICON.back}</button>
      <span class="hud__hint">اسحب، أو الأسهم، أو الأرقام ١–٩</span>
      <button type="button" class="btn btn--icon" data-step="1" aria-label="اللي بعدها">${ICON.next}</button>
    </nav>`;
  const nodesEl = root.querySelector('.nodes');
  const nodes = ZONES.map((z, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'node' + (z.id === 'boss' ? ' node--boss' : '') + (z.bonus ? ' node--bonus' : '');
    b.setAttribute('role', 'option'); b.dataset.zone = z.id; b.style.setProperty('--zc', z.color);
    b.innerHTML = `<span class="node__dot"></span><span class="node__txt"><span class="node__n hud-num">${String(z.n).padStart(2, '0')}</span><span class="node__ar">${esc(z.ar)}</span></span>`;
    b.addEventListener('click', () => { if (Math.round(sel.v) % ZONES.length === i || mod(Math.round(sel.v)) === i) dive(); else go(i); });
    nodesEl.appendChild(b);
    return b;
  });
  const mod = k => ((k % ZONES.length) + ZONES.length) % ZONES.length;
  const sel = { v: 0 };
  let active = -1, diving = false, morphT = 0, shown = false;

  /* ---------- selection ---------- */
  function go(i, instant) {
    const target = Math.round(sel.v) + shortest(mod(Math.round(sel.v)), i);
    gsap.to(sel, { v: target, duration: instant ? 0 : .9, ease: 'power3.out', onUpdate: settle });
    sfx('swoosh');
  }
  const shortest = (from, to) => { let d = to - from; if (d > ZONES.length / 2) d -= ZONES.length; if (d < -ZONES.length / 2) d += ZONES.length; return d; };
  function step(d) { gsap.killTweensOf(sel); go(mod(Math.round(sel.v) + d)); }
  function settle() {
    const i = mod(Math.round(sel.v));
    if (i !== active) { active = i; paint(ZONES[i]); clearTimeout(morphT); morphT = setTimeout(() => world.morph(ZONE_FORMATION[ZONES[i].id] || 'nebula', { dur: 2 }), 260); }
  }
  function paint(z) {
    root.style.setProperty('--zc', z.color); root.style.setProperty('--zglow', z.color + '55');
    const s = root.querySelector('.sel');
    s.style.setProperty('--zc', z.color);
    s.querySelector('.sel__n').textContent = String(z.n).padStart(2, '0') + ' / ' + String(ZONES.length).padStart(2, '0');
    s.querySelector('.sel__lec').textContent = z.lec ? 'Lecture ' + z.lec : 'Boss';
    s.querySelector('.sel__tag').textContent = z.tag;
    const t = s.querySelector('.sel__title'); t.innerHTML = `<span class="mask"><span>${esc(z.ar)}</span></span>`;
    s.querySelector('.sel__en').textContent = z.en;
    s.querySelector('.sel__blurb').textContent = z.blurb;
    const go = s.querySelector('.sel__go span'); go.textContent = z.id === 'boss' ? 'واجه الوحش' : 'ادخل';
    stats(z);
    s.classList.remove('in'); void s.offsetWidth; s.classList.add('in');
    nodes.forEach((n, k) => { n.setAttribute('aria-selected', String(k === active)); n.classList.toggle('is-active', k === active); });
  }
  function stats(z) {
    const box = root.querySelector('.sel__stats');
    if (z.id === 'boss') { const b = state().boss; box.innerHTML = `<span class="chip">${b.wins ? `هزمته ${b.wins} مرة` : 'لسه محدش هزمه'}</span>`; return; }
    const p = lessonProgress(lessons[z.id]); const q = state().quiz[z.id];
    box.innerHTML = `<span class="sel__prog"><span class="hud-num">${p.done}/${p.total}</span> دروس</span><div class="bar"><i style="--p:${p.pct}"></i></div>${marks(q?.stars || 0)}`;
  }

  /* ---------- drag / wheel / keys ---------- */
  let drag = null;
  const canvas = world.renderer.domElement;
  canvas.addEventListener('pointerdown', e => { if (!shown) return; drag = { x: e.clientX, v: sel.v, moved: false }; gsap.killTweensOf(sel); });
  window.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true; sel.v = drag.v + dx / (world.mobile ? 120 : 200); settle(); });
  window.addEventListener('pointerup', () => { if (!drag) return; const moved = drag.moved; drag = null; if (moved) go(mod(Math.round(sel.v))); });
  let wheelT = 0;
  window.addEventListener('wheel', e => { if (!shown || document.getElementById('screens').children.length) return; const now = performance.now(); if (now - wheelT < 380) return; wheelT = now; step((e.deltaY || e.deltaX) > 0 ? 1 : -1); }, { passive: true });
  window.addEventListener('keydown', e => {
    if (!shown || document.getElementById('screens').children.length || e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(-1); }
    if (e.key === 'Enter' && !e.target.closest('button,a')) { e.preventDefault(); dive(); }
  });
  root.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => step(+b.dataset.step)));
  root.querySelector('.sel__go').addEventListener('click', () => dive());
  root.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => onOpen?.(b.dataset.open)));
  const soundBtn = root.querySelector('.hud__sound');
  const paintSound = () => { const on = state().settings.sound; soundBtn.innerHTML = on ? ICON.sound : ICON.mute; soundBtn.setAttribute('aria-pressed', String(on)); soundBtn.title = on ? 'اقفل الصوت' : 'شغّل الصوت'; };
  soundBtn.addEventListener('click', () => { import('../core/state.js').then(m => { m.setSetting('sound', !state().settings.sound); paintSound(); if (state().settings.sound) sfx('pop'); }); });

  /** the first district (in lecture order) that still has lessons or marks to earn */
  function recommend() {
    const S = state();
    for (const z of ZONES) {
      if (z.id === 'boss' || z.bonus) continue;
      const p = lessonProgress(lessons[z.id]); const q = S.quiz[z.id];
      if (p.done < p.total || !q || q.stars < 2) return z.id;
    }
    return 'boss';
  }
  window.addEventListener('keydown', e => {
    if (!shown || document.getElementById('screens').children.length || e.target.closest('input,textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = +e.key; if (k >= 1 && k <= ZONES.length) { e.preventDefault(); gsap.killTweensOf(sel); go(k - 1); }
  });

  /* ---------- per-frame: place nodes on the orbit ---------- */
  const p3 = new THREE.Vector3();
  let selBox = null, boxT = 0;
  function frame() {
    if (!shown) return;
    if (++boxT % 20 === 1) { const r = root.querySelector('.sel').getBoundingClientRect(); selBox = { left: r.left, right: r.right, top: r.top + 40, bottom: r.bottom }; }
    const w = innerWidth, h = innerHeight;
    nodes.forEach((n, i) => {
      const a = Math.PI / 2 + (i - sel.v) * STEP;
      const [x, y, z] = ringPoint(a); p3.set(x, y, z);
      const s = world.project(p3);
      const depth = (z / 4.9 + 1) / 2; // 0 back … 1 front
      const front = depth > .97;
      n.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) scale(${(.72 + depth * .38).toFixed(3)})`;
      const under = selBox && s.x > selBox.left - 20 && s.x < selBox.right + 20 && s.y > selBox.top - 30 && s.y < selBox.bottom + 10;
      n.style.opacity = s.x < -60 || s.x > w + 60 ? 0 : under ? .12 : (.28 + depth * .72).toFixed(2);
      n.style.pointerEvents = under ? 'none' : '';
      n.style.zIndex = String(Math.round(depth * 100));
      n.classList.toggle('is-back', depth < .45);
      n.classList.toggle('is-front', front);
    });
  }

  /* ---------- HUD values ---------- */
  function paintMe() {
    const S = state(), lv = levelOf();
    root.querySelector('.me__sigil').innerHTML = GLYPH[S.sigil] || GLYPH.circle;
    root.querySelector('.me__name').textContent = S.name || 'ضيف';
    root.querySelector('.me__rank').textContent = `Lv ${lv.n} · ${lv.ar}`;
    root.querySelector('.xp__n').textContent = S.xp;
    root.querySelector('.xp__bar i').style.setProperty('--p', lv.pct);
    const st = root.querySelector('.streak'); st.hidden = !S.streak.days; st.querySelector('.hud-num').textContent = S.streak.days;
    paintSound();
  }
  on('xp', paintMe); on('progress', () => { paintMe(); if (active >= 0) stats(ZONES[active]); }); on('settings', paintSound); on('reset', paintMe);

  /* ---------- dive ---------- */
  async function dive() {
    if (diving) return; const z = ZONES[mod(Math.round(sel.v))]; diving = true;
    sfx('whoosh'); root.classList.add('is-diving');
    world.flash(z.color, .18);
    if (world.current !== (ZONE_FORMATION[z.id] || 'nebula')) world.morph(ZONE_FORMATION[z.id], { dur: 1.2 });
    world.setStage({ z: 7.2 }, 1.0);
    world.scatter(.35, { out: .5, back: 1.2 });
    await new Promise(r => setTimeout(r, 650));
    diving = false;
    onEnter?.(z.id);
  }

  return {
    frame,
    show(selectId) {
      shown = true; root.hidden = false; root.classList.remove('is-diving');
      world.setStage(hubStage(), 1.6); world.showRing?.(true, 1.6);
      paintMe();
      const want = selectId || (active < 0 ? recommend() : null);
      const i = want ? Math.max(0, ZONES.findIndex(z => z.id === want)) : active;
      if (active < 0) { sel.v = i; settle(); } else if (i !== active) go(i); else { paint(ZONES[i]); world.morph(ZONE_FORMATION[ZONES[i].id] || 'nebula', { dur: 1.6 }); }
      requestAnimationFrame(() => root.classList.add('is-shown'));
    },
    hide() { shown = false; root.classList.remove('is-shown'); root.hidden = true; world.showRing?.(false, .5); },
    get active() { return ZONES[active]?.id; },
    paintMe
  };
}
