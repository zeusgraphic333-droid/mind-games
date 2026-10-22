// Gestalt Arcade — Lecture 03 · Gestalt Principles of Visual Perception.
// Every chapter drives a particle scene; every demo also works alone (phones) with its own SVG.
const C = { fg: '#EDEBE6', dim: '#7E7C8B', faint: '#3A3946', ultra: '#4D6BFF', pink: '#FF3E8A', sun: '#FFC21A', good: '#46E3A0', red: '#FF4A2E', ice: '#7FE7FF', violet: '#8B7BFF' };
const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
const svg = (vb, inner, label, cls = '') => `<svg class="gst-svg ${cls}" viewBox="${vb}" role="img" aria-label="${label}">${inner}</svg>`;
const seg = (name, items, on = 0) => `<div class="gst-seg" role="group" aria-label="${name}">${items.map((t, i) => `<button type="button" class="gst-seg__b" data-i="${i}" aria-pressed="${i === on}">${t}</button>`).join('')}</div>`;
const range = (label, min, max, val, step = 1) => `<label class="gst-range"><span>${label}</span><input type="range" min="${min}" max="${max}" value="${val}" step="${step}"></label>`;
/** wire a segmented control: fn(index, button) */
function onSeg(root, fn) { const bs = [...root.querySelectorAll('.gst-seg__b')]; bs.forEach((b, i) => b.addEventListener('click', () => { bs.forEach(x => x.setAttribute('aria-pressed', String(x === b))); fn(i, b); })); }
/** a pool of circles that can glide between layouts */
function pool(g, n, r) {
  g.innerHTML = Array.from({ length: n }, () => `<circle r="${r}" cx="0" cy="0"/>`).join('');
  const els = [...g.children];
  return { els, place(fn) { els.forEach((c, i) => { const o = fn(i); c.style.transform = `translate(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px) scale(${o.s ?? 1})`; if (o.fill) c.setAttribute('fill', o.fill); c.style.opacity = o.op ?? 1; }); } };
}

/* ---------- static art ---------- */
const chatArt = svg('0 0 360 230', `
  <rect x="8" y="6" width="344" height="218" rx="18" stroke="${C.faint}" fill="none"/>
  <text x="180" y="30" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="11" fill="${C.dim}">النهارده</text>
  <rect x="22" y="44" width="150" height="28" rx="12" fill="none" stroke="${C.dim}"/><rect x="22" y="76" width="118" height="28" rx="12" fill="none" stroke="${C.dim}"/>
  <rect x="188" y="116" width="150" height="28" rx="12" fill="${C.ultra}" fill-opacity=".35" stroke="${C.ultra}"/><rect x="214" y="148" width="124" height="28" rx="12" fill="${C.ultra}" fill-opacity=".35" stroke="${C.ultra}"/>
  <rect x="22" y="188" width="132" height="26" rx="12" fill="none" stroke="${C.dim}"/>
  <g stroke="${C.pink}" stroke-dasharray="3 4" fill="none"><rect x="14" y="38" width="166" height="72" rx="14"/><rect x="180" y="110" width="166" height="72" rx="14"/></g>
  <text x="96" y="129" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="11" fill="${C.pink}">قريب + شبه بعض</text>`, 'شات فيه رسايل متجمّعة: رسايلك بلون وفي جنب، ورسايل صاحبك بلون تاني وفي الجنب التاني');
const timelineArt = `<div class="gst-tl" role="group" aria-label="خط زمني: علماء نفس ألمان في العشرينات، وسنة ١٩٢٢ فيرتهايمر وكوفكا وكولر">
  <div class="gst-tl__i"><b class="gst-tl__y">1920s</b><i></i><span dir="ltr">German psychologists</span><small>علماء نفس ألمان</small></div>
  <div class="gst-tl__i is-key"><b class="gst-tl__y">1922</b><i></i><span dir="ltr">Wertheimer · Koffka · Köhler</span><small>مطوّرين علم نفس الجشطالت</small></div>
  <div class="gst-tl__i"><b class="gst-tl__y">2026</b><i></i><span>إنت، قبل الكويز</span></div></div>`;
const layersArt = svg('0 0 520 250', `
  ${['Context · السياق', 'Image · الصورة', 'Form · الشكل', 'Idea · الفكرة'].map((t, i) => `<g transform="translate(${30 + i * 34} ${150 - i * 34})"><path d="M0 40L120 0L260 40L140 80Z" fill="${[C.faint, C.ultra, C.violet, C.pink][i]}" fill-opacity="${[.6, .22, .22, .28][i]}" stroke="${[C.dim, C.ultra, C.violet, C.pink][i]}" stroke-width="1.2"/><text x="268" y="46" font-family="IBM Plex Sans Arabic" font-size="17" fill="${C.fg}" direction="ltr">${t}</text></g>`).join('')}
  <path d="M70 214Q200 244 380 214" stroke="${C.sun}" stroke-width="1.5" fill="none" stroke-dasharray="4 5"/><text x="225" y="247" text-anchor="middle" font-family="Alexandria" font-size="16" font-weight="600" fill="${C.sun}">the gestalt = رسالة واحدة</text>`, 'أربع طبقات فوق بعض: فكرة وشكل وصورة وسياق، بتتلم في رسالة واحدة');
const formulaArt = `<div class="gst-eq" role="group" aria-label="معادلة: تفكير مبدع زائد قوانين الجشطالت يساوي تصميم كويس">
  <div class="gst-eq__c gst-eq__c--a"><span class="gst-eq__o" dir="ltr">Creative Thought</span><small>تفكير مبدع</small></div><span class="gst-eq__op" aria-hidden="true">+</span>
  <div class="gst-eq__c gst-eq__c--b"><span class="gst-eq__o" dir="ltr">Gestalt Laws</span><small>قوانين الجشطالت</small></div><span class="gst-eq__op" aria-hidden="true">=</span>
  <div class="gst-eq__c gst-eq__c--c"><span class="gst-eq__o" dir="ltr">Good Design</span><small>تصميم كويس</small></div></div>`;
/* one creature, ten treatments (the assignment) */
const FISH = 'M20 60C44 30 96 26 128 48L150 30V90L128 72C96 94 44 90 20 60Z';
const fishArt = (() => {
  const cell = (inner, label) => `<figure class="gst-fish__c"><svg viewBox="8 14 156 92" aria-hidden="true">${inner}</svg><figcaption>${label}</figcaption></figure>`;
  const r = rng(5); let stip = ''; for (let k = 0; k < 120; k++) { const x = 26 + r() * 120, y = 32 + r() * 56; stip += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + r() * 1.6).toFixed(1)}"/>`; }
  let circ = ''; for (let k = 0; k < 15; k++) { const t = k / 14; const x = 28 + t * 100, h = Math.sin(t * Math.PI) * 22 + 4; circ += `<circle cx="${x}" cy="${60 - h}" r="5"/><circle cx="${x}" cy="${60 + h}" r="5"/>`; }
  const items = [
    [`<path d="${FISH}" fill="none" stroke="${C.fg}" stroke-width="2.4"/><circle cx="46" cy="54" r="3" fill="${C.fg}"/>`, 'تحديد خارجي'],
    [`<path d="${FISH}" fill="${C.ultra}"/><circle cx="46" cy="54" r="3.5" fill="#07070B"/>`, 'ملء داخلي'],
    [`<clipPath id="gfc"><path d="${FISH}"/></clipPath><g clip-path="url(#gfc)" fill="${C.fg}">${stip}</g>`, 'نقط (ستيبل)'],
    [`<clipPath id="gfs"><path d="${FISH}"/></clipPath><g clip-path="url(#gfs)" stroke="${C.sun}" stroke-width="3">${Array.from({ length: 9 }, (_, k) => `<path d="M${30 + k * 14} 20V100"/>`).join('')}</g>`, 'خطوط'],
    [`<path d="M20 60L60 34L96 38L128 48L150 30L140 60L150 90L128 72L96 84L60 86Z" fill="none" stroke="${C.violet}" stroke-width="2"/><path d="M60 34L60 86M96 38L96 84M60 34L96 84M20 60L96 38" stroke="${C.violet}" stroke-width="1.2" opacity=".7"/>`, 'اختزال هندسي'],
    [`<path d="M20 60C44 30 96 26 128 48L150 30V90L128 72C96 94 44 90 20 60C40 62 60 48 82 56S120 70 136 60" fill="none" stroke="${C.pink}" stroke-width="2.2"/>`, 'خط واحد'],
    [`<path d="${FISH}" fill="none" stroke="${C.fg}" stroke-width="3" stroke-dasharray="14 9"/><circle cx="46" cy="54" r="3" fill="${C.fg}"/>`, 'إغلاق (فراغات)'],
    [`<g fill="${C.good}">${circ}</g>`, 'من دواير'],
    [`<rect x="12" y="20" width="148" height="80" fill="${C.fg}"/><path d="${FISH}" fill="#07070B"/>`, 'مساحة سلبية'],
    [`<clipPath id="gfo"><path d="${FISH}"/></clipPath><g clip-path="url(#gfo)" fill="none" stroke="${C.ice}" stroke-width="1.4">${Array.from({ length: 6 }, (_, a) => Array.from({ length: 4 }, (_, b) => `<path d="M${30 + a * 20} ${40 + b * 14}a8 8 0 0 1 16 0"/>`).join('')).join('')}</g><path d="${FISH}" fill="none" stroke="${C.ice}" stroke-width="1.6"/>`, 'زخرفة']
  ];
  return `<div class="gst-fish" role="group" aria-label="نفس السمكة مرسومة بعشر معالجات">${items.map(([inner, label]) => cell(inner, label)).join('')}</div>`;
})();

/* ---------- demos ---------- */
const D = {};
D.organize = {
  id: 'gst-organize', title: 'اتفرّج على مخّك وهو بيرتّب', caption: 'نفس الـ٢٤ نقطة في الأربع خطوات. اللي بيتغير هو الترتيب بس.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('خطوات', ['فوضى', 'جمّع المتشابه', 'لاقي نظام', 'بسّط'])}<div class="gst-stage">${svg('0 0 420 230', `<g class="gst-anim dots"></g><g class="gst-shapes" fill="none" stroke-width="2"><circle cx="80" cy="115" r="46" stroke="${C.ultra}"/><rect x="164" y="69" width="92" height="92" stroke="${C.pink}"/><path d="M340 66L388 162H292Z" stroke="${C.sun}"/></g>`, 'نقط بتترتب')}</div><p class="gst-readout" aria-live="polite"></p></div>`;
    const P = pool(el.querySelector('.dots'), 24, 7); const cols = [C.ultra, C.pink, C.sun]; const r = rng(8);
    const rand = Array.from({ length: 24 }, () => ({ x: 20 + r() * 380, y: 18 + r() * 194 }));
    const say = ['كده مخّك تعبان: ٢٤ حاجة منفصلة.', 'أريح: ٣ جروبات حسب اللون.', 'أحسن: ٣ صفوف ليها نظام.', 'خلاص: ٣ أشكال بسيطة. ده بالظبط شغل مخّك.'];
    const scenes = ['nebula', 'similarity', 'proximity', 'simplicity'];
    const shapes = el.querySelector('.gst-shapes');
    const show = i => {
      P.place(k => { const g = k % 3, j = Math.floor(k / 3); if (i === 0) return { ...rand[k], fill: cols[g] }; if (i === 1) { const a = j / 8 * Math.PI * 2; return { x: [80, 210, 340][g] + Math.cos(a) * 32, y: 115 + Math.sin(a) * 32, fill: cols[g] }; } if (i === 2) return { x: 70 + j * 40, y: 55 + g * 60, fill: cols[g] }; return { x: [80, 210, 340][g], y: 115, fill: cols[g], s: .2, op: 0 }; });
      shapes.classList.toggle('on', i === 3); el.querySelector('.gst-readout').textContent = say[i]; api.scene(scenes[i]);
    };
    onSeg(el, (i, b) => { show(i); api.sfx('pop'); if (i === 3) api.award(5, { from: b, key: 'demo:gst-organize' }); });
    P.place(k => ({ ...rand[k], fill: cols[k % 3] })); el.querySelector('.gst-readout').textContent = say[0];
  }
};
D.halftone = {
  id: 'gst-halftone', title: 'قرّب لحد ما الصورة تختفي', caption: 'من بعيد: صورة واحدة. من قريب: نقط ملهاش معنى. الكل أكبر من مجموع أجزائه.',
  mount(el, api) {
    let dots = ''; const W = 420, H = 260;
    for (let y = 6; y < H; y += 9) for (let x = 6 + ((y / 9) % 2) * 4.5; x < W; x += 9) {
      const dx = (x - 210) / 105, dy = (y - 128) / 105, d = Math.hypot(dx, dy);
      let v = d < 1 ? .17 + .83 * Math.pow(Math.max(0, 1 - Math.hypot(dx + .38, dy + .4) / 1.5), 1.1) : .012 + .018 * (1 - Math.min(1, (y / H)));
      if (d > .94 && d < 1) v = Math.max(v, .3);
      const rr = 4.4 * Math.sqrt(Math.max(0, v)); if (rr > .35) dots += `<circle cx="${x.toFixed(1)}" cy="${y}" r="${rr.toFixed(2)}"/>`;
    }
    el.innerHTML = `<div class="gst-demo"><div class="gst-stage gst-stage--tall"><svg class="gst-svg gst-ht" viewBox="0 0 ${W} ${H}" role="img" aria-label="كورة منوّرة معمولة من نقط هافتون"><g fill="${C.fg}">${dots}</g></svg></div>${range('قرّب', 1, 8, 1, .1)}<p class="gst-readout" aria-live="polite">صورة كاملة: كورة عليها نور.</p></div>`;
    const sv = el.querySelector('.gst-ht'), inp = el.querySelector('input'), out = el.querySelector('.gst-readout'); let told = false;
    inp.addEventListener('input', () => {
      const z = +inp.value; const w = W / z, h = H / z; const cx = 150, cy = 92;
      const x0 = Math.max(0, Math.min(W - w, cx - w / 2)), y0 = Math.max(0, Math.min(H - h, cy - h / 2));
      sv.setAttribute('viewBox', `${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
      out.textContent = z < 2 ? 'صورة كاملة: كورة عليها نور.' : z < 4.5 ? 'لسه شايف الكورة… بس النقط بدأت تبان.' : 'نقط وبس. الصورة اختفت. هي كانت في دماغك من الأول.';
      if (!told) { told = true; api.scene('halftone'); }
      if (z >= 7.5) api.award(5, { from: inp, key: 'demo:gst-halftone' });
    });
  }
};
D.context = {
  id: 'gst-context', title: 'نفس الشكل… حرف ولا رقم؟', caption: 'الشكل اللي في النص ثابت ما اتحركش ولا بيكسل. اللي اتغير هو اللي إنت تعرفه حواليه.',
  mount(el, api) {
    const mid = `<g transform="translate(176 40)" stroke="${C.ultra}" stroke-width="10" stroke-linecap="round" fill="none"><path d="M8 6V96"/><path d="M28 10C64 4 70 46 34 50C72 52 66 100 28 94"/></g>`;
    el.innerHTML = `<div class="gst-demo">${seg('السياق', ['وسط حروف', 'وسط أرقام'])}<div class="gst-stage">${svg('0 0 440 180', `<text class="gst-ctx-l" x="110" y="128" text-anchor="middle" font-family="Alexandria" font-weight="800" font-size="104" fill="${C.fg}">A</text>${mid}<text class="gst-ctx-r" x="340" y="128" text-anchor="middle" font-family="Alexandria" font-weight="800" font-size="104" fill="${C.fg}">C</text>`, 'شكل في النص بين حرفين أو رقمين')}</div><p class="gst-readout" aria-live="polite">قريتها <b>B</b>. طبيعي: حواليها حروف.</p></div>`;
    const L = el.querySelector('.gst-ctx-l'), R = el.querySelector('.gst-ctx-r'), out = el.querySelector('.gst-readout');
    onSeg(el, (i, b) => { L.textContent = i ? '12' : 'A'; R.textContent = i ? '14' : 'C'; L.setAttribute('font-size', i ? 92 : 104); R.setAttribute('font-size', i ? 92 : 104); out.innerHTML = i ? 'قريتها <b>13</b>. نفس الشكل بالظبط! حواليها أرقام.' : 'قريتها <b>B</b>. طبيعي: حواليها حروف.'; api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-context' }); });
  }
};
D.emergence = {
  id: 'gst-emergence', title: 'الكل الأول، ولا الأجزاء؟', caption: 'أول ما الحرف يتجمع، عينك بتشوف الحرف قبل ما تعدّ ولا نقطة.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('الشكل', ['الكل', 'الأجزاء'])}<div class="gst-stage">${svg('0 0 420 250', `<g class="gst-anim dots"></g>`, 'حرف U معمول من نقط')}</div><p class="gst-readout" aria-live="polite">حرف <b>U</b>. شفته في ثانية.</p></div>`;
    const r = rng(12); const n = 70; const P = pool(el.querySelector('.dots'), n, 1);
    const U = Array.from({ length: n }, () => { const t = r(); let x, y; if (t < .33) { x = 150 + (r() - .5) * 26; y = 40 + r() * 110; } else if (t < .66) { x = 270 + (r() - .5) * 26; y = 40 + r() * 110; } else { const a = Math.PI * r(); x = 210 - Math.cos(a) * 60 + (r() - .5) * 22; y = 150 + Math.sin(a) * 66 + (r() - .5) * 18; } return { x, y, s: 5 + r() * 9 }; });
    const scat = Array.from({ length: n }, () => ({ x: 20 + r() * 380, y: 20 + r() * 210, s: 3 + r() * 6 }));
    const whole = () => P.place(k => ({ ...U[k], fill: C.pink })), parts = () => P.place(k => ({ ...scat[k], fill: [C.pink, C.ultra, C.sun, C.fg][k % 4], op: .9 }));
    whole();
    onSeg(el, (i, b) => { i ? parts() : whole(); el.querySelector('.gst-readout').innerHTML = i ? 'دلوقتي نقط. مفيش "حرف" خلاص. المعنى كان في الترتيب.' : 'حرف <b>U</b>. شفته في ثانية.'; api.scene('emergence'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-emergence' }); });
  }
};
D.kanizsa = {
  id: 'gst-kanizsa', title: 'مثلث محدش رسمه', caption: 'المثلث الأبيض مش مرسوم. ومع ذلك حاسس إنه أفتح من الخلفية. ده مخّك بيكمّل.',
  mount(el, api) {
    const V = [[210, 34], [92, 214], [328, 214]];
    const pac = ([x, y], k) => { const o = V.filter((_, j) => j !== k); const a1 = Math.atan2(o[0][1] - y, o[0][0] - x), a2 = Math.atan2(o[1][1] - y, o[1][0] - x); let lo = Math.min(a1, a2), hi = Math.max(a1, a2); if (hi - lo > Math.PI) { const t = lo; lo = hi; hi = t + Math.PI * 2; } const R = 34; const p = a => `${(x + Math.cos(a) * R).toFixed(1)} ${(y + Math.sin(a) * R).toFixed(1)}`; return `<g class="gst-pac" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y}L${p(hi)}A${R} ${R} 0 1 1 ${p(lo + Math.PI * 2 * 0)}Z" fill="${C.ultra}"/></g>`; };
    el.innerHTML = `<div class="gst-demo">${seg('الدواير', ['الفتحات لجوه', 'الفتحات لبره'])}<div class="gst-stage">${svg('0 0 420 250', V.map(pac).join(''), 'تلات دواير مقطوع منها جزء، مترتبة بحيث يبان مثلث وهمي')}</div>
      <div class="gst-inv"><p class="gst-inv__t" dir="ltr">ˈnvˈsˈble or vˈsˈble?</p>${seg('الحروف', ['ناقصة', 'كاملة'])}</div><p class="gst-readout" aria-live="polite">شايف مثلث؟ هو مش موجود.</p></div>`;
    const segs = el.querySelectorAll('.gst-seg'), out = el.querySelector('.gst-readout');
    const bs1 = [...segs[0].querySelectorAll('button')], bs2 = [...segs[1].querySelectorAll('button')];
    bs1.forEach((b, i) => b.addEventListener('click', () => { bs1.forEach(x => x.setAttribute('aria-pressed', String(x === b))); el.querySelectorAll('.gst-pac').forEach(p => p.classList.toggle('flip', i === 1)); out.textContent = i ? 'المثلث اختفى. نفس الدواير، بس الفتحات مبقتش بتتقابل.' : 'شايف مثلث؟ هو مش موجود.'; api.scene('kanizsa'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-kanizsa' }); }));
    bs2.forEach((b, i) => b.addEventListener('click', () => { bs2.forEach(x => x.setAttribute('aria-pressed', String(x === b))); el.querySelector('.gst-inv__t').textContent = i ? 'invisible or visible?' : 'ˈnvˈsˈble or vˈsˈble?'; out.textContent = i ? 'آه، دي كانت invisible or visible. وانت كنت قريتها قبل ما نرجّع الحروف.' : 'الحروف ناقصة… وقريتها برضه.'; api.sfx('pop'); }));
  }
};
D.multi = {
  id: 'gst-multi', title: 'قراءتين لنفس الصورة', caption: 'مخّك مبيقدرش يشوف القراءتين في نفس اللحظة. بيتنطط بينهم.',
  mount(el, api) {
    const a = [70, 70], b = [130, 30], s = 110;
    const sq = o => `M${o[0]} ${o[1]}h${s}v${s}h${-s}Z`;
    const cube = `<g fill="none" stroke="${C.fg}" stroke-width="2"><path class="gst-face gst-face--a" d="${sq(a)}"/><path class="gst-face gst-face--b" d="${sq(b)}"/><path d="M70 70L130 30M180 70L240 30M180 180L240 140M70 180L130 140"/></g>`;
    const prof = [[0, 0], [0, 16], [-6, 34], [-16, 46], [-12, 54], [-20, 62], [-34, 74], [-30, 80], [-20, 84], [-22, 92], [-28, 100], [-22, 106], [-24, 114], [-16, 124], [-18, 134], [-22, 146], [-12, 160], [4, 172], [10, 190], [4, 210], [-6, 230]];
    const face = (dir) => { const pts = prof.map(([x, y]) => [150 + dir * (60 + x) , y + 10]); const edge = dir < 0 ? 0 : 300; return `M${edge} 10L${pts.map(p => p.join(' ')).join('L')}L${edge} 240Z`; };
    const vase = `<rect x="0" y="10" width="300" height="230" class="gst-vbg"/><path class="gst-faces" d="${face(-1)}"/><path class="gst-faces" d="${face(1)}"/>`;
    el.innerHTML = `<div class="gst-demo gst-two"><div><div class="gst-stage">${svg('0 0 310 210', cube, 'مكعب خطوط بس، ممكن تشوفه من فوق أو من تحت')}</div>${seg('المكعب', ['الوش ده قدّام', 'الوش التاني قدّام'])}</div>
      <div><div class="gst-stage">${svg('0 0 300 250', vase, 'شكل في النص ممكن يبان فازة أو وشين بيبصوا لبعض', 'gst-vase')}</div>${seg('الصورة', ['شوف الفازة', 'شوف الوشّين'])}</div></div><p class="gst-readout" aria-live="polite">جرّب الزرارين، وبعدين بص من غير ما تدوس. هتلاقي مخّك بيقلب لوحده.</p>`;
    const segs = el.querySelectorAll('.gst-seg');
    [...segs[0].querySelectorAll('button')].forEach((b, i, all) => b.addEventListener('click', () => { all.forEach(x => x.setAttribute('aria-pressed', String(x === b))); el.querySelector('.gst-face--a').classList.toggle('on', i === 0); el.querySelector('.gst-face--b').classList.toggle('on', i === 1); api.scene('necker'); api.sfx('flip'); }));
    [...segs[1].querySelectorAll('button')].forEach((b, i, all) => b.addEventListener('click', () => { all.forEach(x => x.setAttribute('aria-pressed', String(x === b))); el.querySelector('.gst-vase').classList.toggle('faces', i === 1); api.scene('vase'); api.sfx('flip'); if (i) api.award(5, { from: b, key: 'demo:gst-multi' }); }));
    el.querySelector('.gst-face--a').classList.add('on');
  }
};
D.invariance = {
  id: 'gst-invariance', title: 'لِفّه، انقله، كبّره', caption: 'الخط المتقطع هو الأصل. اعمل في الشكل اللي إنت عايزه… مخّك هيفضل عارفه.',
  mount(el, api) {
    const shape = 'M-30 -42L34 -42L34 -14L6 -14L6 46L-30 46Z M-12 -24a7 7 0 1 0 0.1 0Z';
    el.innerHTML = `<div class="gst-demo"><div class="gst-stage">${svg('0 0 420 240', `<path d="${shape}" transform="translate(210 120)" fill="none" stroke="${C.dim}" stroke-dasharray="4 5"/><path class="gst-inv-s" d="${shape}" fill="${C.ultra}" fill-rule="evenodd" transform="translate(210 120)"/>`, 'شكل بيتلف ويتنقل ويكبر')}</div>
      <div class="gst-ctrl">${range('لِف <bdi class="en" dir="ltr">rotation</bdi>', -180, 180, 0)}${range('انقل <bdi class="en" dir="ltr">translation</bdi>', -150, 150, 0)}${range('كبّر وصغّر <bdi class="en" dir="ltr">scale</bdi>', .4, 1.8, 1, .05)}</div><p class="gst-readout" aria-live="polite">نفس الشكل؟ أكيد.</p></div>`;
    const [rot, mov, sca] = el.querySelectorAll('input'); const s = el.querySelector('.gst-inv-s'); let told = false;
    const upd = () => { s.setAttribute('transform', `translate(${210 + +mov.value} 120) rotate(${rot.value}) scale(${sca.value})`); if (!told) { told = true; api.scene('invariance'); } if (Math.abs(+rot.value) > 120 && Math.abs(+sca.value - 1) > .4) api.award(5, { from: s, key: 'demo:gst-invariance' }); };
    [rot, mov, sca].forEach(i => i.addEventListener('input', upd));
  }
};
D.proximity = {
  id: 'gst-proximity', title: 'حرّك المسافة بس', caption: 'النقط ما اتغيرتش. لا لونها ولا حجمها. المسافة لوحدها عملت الجروبات.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo"><div class="gst-stage">${svg('0 0 420 230', `<g class="gst-anim dots"></g>`, 'نقط في شبكة بتتجمع عواميد')}</div>${range('المسافة بين الجروبات', 0, 100, 0)}<p class="gst-readout" aria-live="polite">مربع واحد من النقط.</p></div>`;
    const P = pool(el.querySelector('.dots'), 36, 8); const inp = el.querySelector('input'), out = el.querySelector('.gst-readout'); let told = false;
    const draw = () => { const g = +inp.value / 100; P.place(k => { const c = k % 6, rr = Math.floor(k / 6); const pair = Math.floor(c / 2), side = c % 2; const step = 44 - g * 22; const x = 210 + (pair - 1) * (step * 2 + g * 70) + (side - .5) * step; return { x, y: 30 + rr * 34, fill: C.fg }; }); out.textContent = g < .2 ? 'مربع واحد من النقط.' : g < .5 ? 'بدأت تبان عواميد…' : '٣ عواميد. نفس النقط، المسافة بس اتغيرت.'; };
    inp.addEventListener('input', () => { draw(); if (!told) { told = true; api.scene('proximity'); } if (+inp.value > 90) api.award(5, { from: inp, key: 'demo:gst-proximity' }); });
    draw();
  }
};
D.similarity = {
  id: 'gst-similarity', title: 'نفس المسافة… غيّر الشكل بس', caption: 'المسافات متساوية في كل الحالات. التشابه لوحده بيعمل الجروب.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('التشابه', ['كلهم زي بعض', 'لوّن صفوف', 'غيّر الشكل', 'لوّن عواميد'])}<div class="gst-stage">${svg('0 0 420 230', `<g class="gst-grid"></g>`, 'شبكة نقط بمسافات متساوية')}</div><p class="gst-readout" aria-live="polite">شبكة. ولا جروب.</p></div>`;
    const g = el.querySelector('.gst-grid'); const say = ['شبكة. ولا جروب.', 'دلوقتي صفوف. مع إن المسافة زي ما هي.', 'صفوف برضه، بالشكل بدل اللون.', 'وكده عواميد. نفس النقط، قرار مختلف.'];
    const draw = m => { let s = ''; for (let rr = 0; rr < 5; rr++) for (let c = 0; c < 8; c++) { const x = 49 + c * 46, y = 27 + rr * 44; const alt = m === 3 ? c % 2 : rr % 2; const col = (m === 1 || m === 3) && alt ? C.ultra : C.fg; s += m === 2 && alt ? `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" fill="none" stroke="${C.fg}" stroke-width="2"/>` : `<circle cx="${x}" cy="${y}" r="10" fill="${col}"/>`; } g.innerHTML = s; el.querySelector('.gst-readout').textContent = say[m]; };
    draw(0);
    onSeg(el, (i, b) => { draw(i); api.scene('similarity'); api.sfx('pop'); if (i === 3) api.award(5, { from: b, key: 'demo:gst-similarity' }); });
  }
};
D.figure = {
  id: 'gst-figure', title: 'مين الشكل ومين الأرضية؟', caption: 'السهم مش مرسوم. هو المكان اللي اتساب فاضي. اقلب الألوان وشوف مين اللي بيتقدّم.',
  mount(el, api) {
    const arrow = (c, rr) => { const x = c - 2, y = rr - 3; return (y === 0 && x >= 0 && x <= 5) || (x >= 3 && x <= 5 && Math.abs(y) <= 5 - x); };
    let cells = ''; for (let rr = 0; rr < 7; rr++) for (let c = 0; c < 10; c++) cells += `<rect class="${arrow(c, rr) ? 'gst-neg' : 'gst-pos'}" x="${30 + c * 36}" y="${12 + rr * 30}" width="34" height="28" rx="3"/>`;
    el.innerHTML = `<div class="gst-demo">${seg('اقلب', ['الأزرق شكل', 'اقلب الألوان'])}<div class="gst-stage">${svg('0 0 420 236', cells, 'مربعات زرقا والمساحة الفاضية بينها عاملة سهم', 'gst-fg')}</div><p class="gst-readout" aria-live="polite">المربعات الزرقا = <b>positive</b>. السهم الفاضي = <b>negative</b>… وهو اللي عينك مسكته!</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.gst-fg').classList.toggle('inv', i === 1); el.querySelector('.gst-readout').innerHTML = i ? 'دلوقتي السهم بقى هو الشكل، والباقي أرضية. نفس الرسمة، قرار مختلف.' : 'المربعات الزرقا = <b>positive</b>. السهم الفاضي = <b>negative</b>… وهو اللي عينك مسكته!'; api.scene('figureGround'); api.sfx('flip'); if (i) api.award(5, { from: b, key: 'demo:gst-figure' }); });
  }
};
D.continuity = {
  id: 'gst-continuity', title: 'خطين ولا ٤ حتت؟', caption: 'التلوين التاني صح منطقيًا… بس عينك رافضاه. هي عايزة تكمّل الاتجاه.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('القراءة', ['خطين متقاطعين', '٤ حتت بتتقابل'])}<div class="gst-stage">${svg('0 0 420 220', `<g class="gst-cont"></g>`, 'خط مستقيم من النقط وخط متموج بيتقاطعوا')}</div><p class="gst-readout" aria-live="polite">خط مستقيم وخط متموّج. طبيعي.</p></div>`;
    const g = el.querySelector('.gst-cont');
    const draw = m => { let s = ''; for (let k = 0; k <= 22; k++) { const t = k / 22, x = 24 + t * 372; const y2 = 110 - Math.sin(t * Math.PI * 2) * 74; const left = t < .5; const cA = m ? (left ? C.ultra : C.pink) : C.ultra, cB = m ? (left ? C.pink : C.ultra) : C.pink; s += `<circle cx="${x.toFixed(1)}" cy="110" r="6" fill="${cA}"/><circle cx="${x.toFixed(1)}" cy="${y2.toFixed(1)}" r="6" fill="${cB}"/>`; } g.innerHTML = s; el.querySelector('.gst-readout').textContent = m ? 'كده كل خط بيتكسر في النص ويكمّل في التاني. حاسس إنها غلط؟ ده Good Continuity.' : 'خط مستقيم وخط متموّج. طبيعي.'; };
    draw(0); onSeg(el, (i, b) => { draw(i); api.scene('continuity'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-continuity' }); });
  }
};
D.closure = {
  id: 'gst-closure', title: 'وسّع الفراغات لحد ما الشكل يقع', caption: 'لحد مستوى معين مخّك بيقفل الشكل لوحده. بعد كده بيسيبه.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo"><div class="gst-stage">${svg('0 0 420 220', `<g class="gst-clo" fill="none" stroke="${C.fg}" stroke-width="7" stroke-linecap="butt"></g>`, 'دايرة ومربع خطوطهم فيها فراغات')}</div>${range('حجم الفراغ', 0, 90, 20)}<p class="gst-readout" aria-live="polite">دايرة ومربع. كاملين في دماغك.</p></div>`;
    const g = el.querySelector('.gst-clo'), inp = el.querySelector('input'); let told = false;
    const draw = () => { const v = +inp.value / 100; const C1 = 2 * Math.PI * 70, n = 4; const dash = C1 / n * (1 - v), gap = C1 / n * v; const P = 4 * 130, d2 = P / 4 * (1 - v) * .5, g2 = P / 4 * v * .5; g.innerHTML = `<circle cx="110" cy="110" r="70" stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}" transform="rotate(-20 110 110)"/><rect x="245" y="45" width="130" height="130" stroke="${C.ultra}" stroke-dasharray="${d2.toFixed(1)} ${g2.toFixed(1)}" stroke-dashoffset="${(-g2 / 2 - d2 / 2).toFixed(1)}"/>`; el.querySelector('.gst-readout').textContent = v < .45 ? 'دايرة ومربع. كاملين في دماغك.' : v < .7 ? 'لسه… بس مخّك بدأ يتعب وهو بيقفلهم.' : 'كده حتت متفرقة. الشكل وقع.'; };
    inp.addEventListener('input', () => { draw(); if (!told) { told = true; api.scene('closure'); } if (+inp.value > 80) api.award(5, { from: inp, key: 'demo:gst-closure' }); });
    draw();
  }
};
D.simplicity = {
  id: 'gst-simplicity', title: 'فكّكها… وركّبها', caption: 'مخّك قرا الشكل المعقد كـ٣ أشكال بسيطة من أول نظرة. وقرا الحتت كلمة.',
  mount(el, api) {
    const logo = `<g class="gst-logo" fill="${C.fg}">
      <rect class="f" x="40" y="150" width="14" height="60"/><rect class="f" x="58" y="196" width="30" height="14"/>
      <path class="f" d="M128 152a30 30 0 0 0 0 58v-14a16 16 0 0 1 0-30Z"/><path class="f" d="M134 152a30 30 0 0 1 0 58v-14a16 16 0 0 0 0-30Z"/>
      <path class="f" d="M206 152a30 30 0 0 0 0 58v-14a16 16 0 0 1 0-30Z"/><path class="f" d="M212 196h16v14h-16Z"/><path class="f" d="M218 178h18v32h-14v-18h-4Z"/>
      <path class="f" d="M282 152a30 30 0 0 0 0 58v-14a16 16 0 0 1 0-30Z"/><path class="f" d="M288 152a30 30 0 0 1 0 58v-14a16 16 0 0 0 0-30Z"/></g>`;
    el.innerHTML = `<div class="gst-demo">${seg('الحالة', ['مجمّعة', 'فكّك'])}<div class="gst-stage">${svg('0 0 340 230', `<g class="gst-simp" fill="${C.ultra}"><rect class="a" x="90" y="34" width="80" height="62"/><path class="b" d="M168 22L226 112H110Z"/><circle class="c" cx="128" cy="100" r="36"/></g>${logo}`, 'مربع ومثلث ودايرة متداخلين، وتحتهم حتت بتكوّن كلمة logo')}</div><p class="gst-readout" aria-live="polite">مربع ومثلث ودايرة… وكلمة <b>logo</b>.</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.gst-simp').classList.toggle('apart', i === 1); el.querySelector('.gst-logo').classList.toggle('apart', i === 1); el.querySelector('.gst-readout').innerHTML = i ? 'الحتت لوحدها ملهاش معنى. ولا حرف فيهم كامل. المعنى كان في التجميع.' : 'مربع ومثلث ودايرة… وكلمة <b>logo</b>.'; api.scene('simplicity'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-simplicity' }); });
  }
};
D.fate = {
  id: 'gst-fate', title: 'اللي بيتحركوا سوا', caption: 'قبل الحركة: عواميد (قرب). بعد الحركة: اللي بيتحركوا مع بعض بقوا جروب لوحدهم.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('الحركة', ['ثابتين', 'حرّك'])}<div class="gst-stage">${svg('0 0 420 220', `<g class="gst-fate"></g>`, 'نقط في شبكة وبعضها بيتحرك مع بعض')}</div><p class="gst-readout" aria-live="polite">نقط ثابتة في عواميد.</p></div>`;
    const g = el.querySelector('.gst-fate'); let s = ''; for (let rr = 0; rr < 4; rr++) for (let c = 0; c < 7; c++) { const mov = (c + rr) % 3 === 0; s += `<circle cx="${60 + c * 50}" cy="${48 + rr * 42}" r="9" fill="${C.fg}" class="${mov ? 'mov' : ''}"/>`; } g.innerHTML = s;
    const movers = [...g.querySelectorAll('.mov')]; let raf = 0, on = false, t0 = 0;
    const loop = t => { if (!on) return; const dy = Math.sin((t - t0) / 380) * 16; movers.forEach(c => c.style.transform = `translateY(${dy.toFixed(1)}px)`); raf = requestAnimationFrame(loop); };
    onSeg(el, (i, b) => { on = i === 1; cancelAnimationFrame(raf); if (on) { if (reduced()) movers.forEach(c => c.style.transform = 'translateY(-14px)'); else { t0 = performance.now(); raf = requestAnimationFrame(loop); } movers.forEach(c => c.setAttribute('fill', C.pink)); } else { movers.forEach(c => { c.style.transform = ''; c.setAttribute('fill', C.fg); }); } el.querySelector('.gst-readout').textContent = on ? 'الوردي بيتحرك مع بعض، فبقى جروب. حتى لو مش جنب بعض.' : 'نقط ثابتة في عواميد.'; api.scene('commonFate'); api.sfx('pop'); if (on) api.award(5, { from: b, key: 'demo:gst-fate' }); });
    return () => { on = false; cancelAnimationFrame(raf); };
  }
};
D.connect = {
  id: 'gst-connect', title: 'خط واحد بيغيّر الجروب', caption: 'من غير خطوط: الدواير مع الدواير والمربعات مع المربعات. بخط واحد: كل دايرة بقت مع المربع اللي جنبها.',
  mount(el, api) {
    let s = ''; for (let k = 0; k < 8; k++) { const x = 40 + k * 48; s += k % 2 ? `<rect x="${x - 13}" y="97" width="26" height="26" fill="${C.fg}"/>` : `<circle cx="${x}" cy="110" r="14" fill="${C.fg}"/>`; }
    let lines = ''; for (let k = 0; k < 8; k += 2) lines += `<path d="M${40 + k * 48} 110H${40 + (k + 1) * 48}" />`;
    el.innerHTML = `<div class="gst-demo">${seg('الخطوط', ['من غير', 'وصّل'])}<div class="gst-stage">${svg('0 0 420 220', `<g class="gst-lines" stroke="${C.ultra}" stroke-width="4">${lines}</g>${s}`, 'دواير ومربعات في صف وبعدين خطوط بتوصل كل دايرة بمربع', 'gst-con')}</div><p class="gst-readout" aria-live="polite">دواير لوحدها ومربعات لوحدها (تشابه).</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.gst-con').classList.toggle('on', i === 1); el.querySelector('.gst-readout').textContent = i ? 'دلوقتي ٤ أزواج. الخط غلب التشابه. ده Connection.' : 'دواير لوحدها ومربعات لوحدها (تشابه).'; api.scene('connection'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-connect' }); });
  }
};
D.symmetry = {
  id: 'gst-symmetry', title: 'مرايا = شكل مقفول', caption: 'لما الجانبين يبقوا مرايا لبعض، بتشوف شكل واحد مقفول. لما يختلفوا، بتشوف علامات سايبة.',
  mount(el, api) {
    el.innerHTML = `<div class="gst-demo">${seg('الأقواس', ['مرايا', 'مش مرايا'])}<div class="gst-stage">${svg('0 0 420 170', `<text class="gst-br" x="210" y="112" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-weight="300" font-size="92" fill="${C.fg}" direction="ltr" unicode-bidi="bidi-override">[ ]  { }  [ ]</text>`, 'أقواس متماثلة أو غير متماثلة')}</div><p class="gst-readout" aria-live="polite">٣ أشكال مقفولة.</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.gst-br').textContent = i ? '[ }  { ]  ] [' : '[ ]  { }  [ ]'; el.querySelector('.gst-readout').textContent = i ? 'كده علامات متفرقة. مفيش ولا شكل مقفول.' : '٣ أشكال مقفولة.'; api.scene('symmetry'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:gst-symmetry' }); });
  }
};
const demo = k => ({ t: 'demo', ...D[k] });

/* ---------- the lesson ---------- */
export default {
  zone: 'gestalt',
  hero: { say: 'أكبر حتة في الكويز، وأحلى حتة كمان. هنا هتكتشف إن عينك مبتشوفش. **مخّك** هو اللي بيشوف.' },
  chapters: [
    {
      id: 'gst-start', title: 'قبل ما نبدأ: التصميم مش ديكور', en: 'Before we Start', ref: 'L03 · S4', scene: 'nebula',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'لو التصميم مجرد ترتيب حلو، يبقى إحنا مزيّنين مش مصممين. المحاضرة بتبدأ بالسؤال ده بالظبط.' },
        { t: 'p', text: 'الدكتور بيفتح المحاضرة بفكرة. لو شغلتنا بس إننا نرتّب حاجات بشكل لطيف، يبقى الشكل لوحده كفاية. حتى لو مالوش أي معنى.' },
        { t: 'p', text: 'ساعتها التصميم هيبقى **تزيين**، مش **تواصل**. والسلايد بيقولك صراحة: التصميم أكبر من الشكل بكتير.' },
        { t: 'quote', text: 'If a graphic designer had only to organize information into pleasing arrangements, then the aesthetic use of form, devoid of any meaning, would be all that’s required of our job. Graphic design would be more about decorating than communicating. However, as you have already seen, graphic design is much more than form.', ref: 'L03 · S4', ar: 'لو الشغلانة ترتيب حلو وبس، التصميم هيبقى تزيين مش تواصل. بس التصميم أكبر من الشكل.' },
        { t: 'trap', text: 'سؤال الـ <en>Complete</en> ممكن يقلب الكلمتين. ركّز على الترتيب.', wrong: '…more about communicating than decorating', right: '<en>…more about decorating than communicating</en> — ده لو التصميم ترتيب حلو وبس' },
        { t: 'h', text: 'طيب الجشطالت دخله إيه؟', en: 'Definition' },
        { t: 'p', text: 'الجشطالت هي القوانين اللي بتشرح المخ بيشوف إزاي. يعني بيرتّب اللي قدامه إزاي قبل ما يفهمه.' },
        { t: 'quote', text: 'Gestalt Principles are principles/laws of human perception that describe how humans group similar elements, recognize patterns and simplify complex images when we perceive objects.', ref: 'L03 · S4' },
        { t: 'list', style: 'num', items: ['**بيجمّع** الحاجات اللي شبه بعض <en>group similar elements</en>', '**بيلاقي** أنماط ونظام <en>recognize patterns</en>', '**بيبسّط** الصورة المعقدة <en>simplify complex images</en>'] },
        demo('organize'),
        { t: 'quote', text: 'Designers use the principles to organize content on Advertising and other media, so it is aesthetically pleasing and easy to understand.', ref: 'L03 · S4', ar: 'المصممين بيستخدموها عشان المحتوى يبقى حلو وسهل يتفهم في نفس الوقت.' },
        { t: 'example', title: 'شات الواتساب', text: 'رسايلك في جنب وبلون. رسايل صاحبك في الجنب التاني وبلون تاني. الرسايل المتتالية لازقة في بعض، وبين كل يوم ويوم مسافة. إنت بتفهم مين قال إيه من غير ما تقرا. ده الجشطالت شغّال: تشابه، وقُرب، وتبسيط.', art: chatArt },
        { t: 'why', text: 'المخ بيستقبل كمية معلومات رهيبة كل ثانية. لو حلّل كل نقطة لوحدها هيفصل. فبيختصر: يجمّع، ويدوّر على نظام، ويبسّط. المصمم الشاطر بيرتّب التصميم بنفس الطريقة اللي المخ أصلًا بيحبها.' },
        { t: 'tip', text: 'جشطالت = المخ بيعمل ٣ حاجات: **يجمّع، ويلاقي نظام، ويبسّط**. والمصمم بيستخدمها عشان الحاجة تبقى **حلوة وتتفهم**.' },
        { t: 'check', q: 'gi06' }, { t: 'check', q: 'gi07' }, { t: 'check', q: 'gi08' }
      ]
    },
    {
      id: 'gst-about', title: 'جشطالت يعني «الكل»', en: 'About Gestalt Theories of Visual Perception', ref: 'L03 · S5, S12–S13', scene: 'halftone',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'كلمة ألماني صعبة النطق، ومعناها بسيط جدًا: الكل الموحّد.' },
        { t: 'quote', text: 'Gestalt means "unified whole". It refers to theories of visual perception developed by a group of German psychologists in the 1920s.', ref: 'L03 · S5', ar: 'جشطالت = كل موحّد. نظريات عن الإدراك البصري طلّعها علماء نفس ألمان في العشرينات.' },
        { t: 'art', html: timelineArt, caption: 'السلايد كاتب: ١٩٢٢ — فيرتهايمر وكوفكا وكولر، مطوّرين علم نفس الجشطالت.' },
        { t: 'p', text: 'التلات أسامي ممكن ييجوا اختيارات: <en>Max Wertheimer</en> و<en>Kurt Koffka</en> و<en>Wolfgang Köhler</en>. مش مطلوب تحفظ عنهم أكتر من كده.' },
        { t: 'quote', text: 'These theories describe how people tend to organize visual elements into groups or unified wholes when certain principles are applied. How the brain perceives complex surroundings and converts this information to easier to process unitary information.', ref: 'L03 · S5', ar: 'الناس بترتّب اللي بتشوفه في جروبات أو "كُل". والمخ بيحوّل الزحمة لوحدات أسهل.' },
        { t: 'p', text: 'خلّي بالك من العبارة الأخيرة. هي نفسها العنوان الفرعي للمحاضرة: المخ بيشوف دنيا معقدة، ويحوّلها لـ<en>unitary information</en>. يعني معلومة "وحدة واحدة" سهلة.' },
        { t: 'check', q: 'gi01' }, { t: 'check', q: 'gi03' }, { t: 'check', q: 'gi05' },
        { t: 'h', text: 'نقط الهافتون: أوضح مثال', en: 'Halftone dots' },
        { t: 'p', text: 'قرّب أي صورة في جرنال لعينك. هتلاقيها نقط صغيرة بأحجام مختلفة. ابعد شوية… النقط اختفت وبقت صورة.' },
        { t: 'quote', text: 'When you see individual halftone dots together, your eyes form them into a complete picture. This phenomenon would be considered a visual form of gestalt, seeing a whole that is made of individual parts.', ref: 'L03 · S13' },
        demo('halftone'),
        { t: 'check', q: 'gi18' },
        { t: 'h', text: 'التصميم نفسه طبقات', en: 'Idea · Form · Image · Context' },
        { t: 'quote', text: 'On a broader level, a design is built of many layers—idea, form, image, and context—but with a total graphic design concept in mind. The gestalt, the goal, unifies the parts, forming a complete and unified message.', ref: 'L03 · S13' },
        { t: 'art', html: layersArt, caption: '٤ طبقات. والجشطالت هو الهدف اللي بيلمّهم.' },
        { t: 'example', title: 'بوستر حفلة في الكلية', text: 'الفكرة: حفلة روك. الشكل: خطوط حادة. الصورة: جيتار. السياق: حيطة جنب الكافيتريا والناس معدّية بسرعة. لو كل طبقة شغالة لوحدها، البوستر هيبقى مشتّت. الجشطالت هنا هو الهدف اللي بيخلّي الأربعة يقولوا جملة واحدة.' },
        { t: 'check', q: 'gi19' },
        { t: 'h', text: 'المعادلة', en: 'Creative Thought + Gestalt Laws = Good Design' },
        { t: 'art', html: formulaArt },
        { t: 'quote', text: 'Gestalt Principles can really help in focusing attention and organizing contents in an effective way.', ref: 'L03 · S12' },
        { t: 'why', text: 'الإبداع لوحده ممكن يطلّع حاجة حلوة بس محدش فاهمها. والقوانين لوحدها بتطلّع حاجة منظمة بس مملة. الاتنين مع بعض = تصميم بيوصل.' },
        { t: 'trap', text: 'سؤال "طلّعها مين؟" هيحطلك اختيارات شيك وغلط.', wrong: 'Bauhaus designers in the 1950s', right: 'A group of German psychologists in the 1920s' },
        { t: 'tip', text: 'جشطالت = **الكل**. ألمان. **العشرينات**. ٣ أسامي سنة ١٩٢٢. وهافتون = نقط → صورة.' },
        { t: 'check', q: 'gi21' },
        { t: 'check', q: 'gi22' }
      ]
    },
    {
      id: 'gst-perception', title: 'الإدراك: مخّك بيحل لغز', en: 'What is Perception?', ref: 'L03 · S6–S11', scene: 'eyeBare',
      blocks: [
        { t: 'say', who: 'eye', text: 'عينك كاميرا. بس مخّك هو اللي بيقرر الصورة دي معناها إيه.' },
        { t: 'quote', text: 'Perception is an active process. Human cognition simplifies an enormous range of stimuli into understandable units.', ref: 'L03 · S6', ar: 'الإدراك عملية نشطة. المخ بيبسّط كمية ضخمة من المؤثرات لوحدات مفهومة.' },
        { t: 'p', text: 'أهم كلمة هنا **active**. الإدراك مش إنك تستقبل الصورة وخلاص. المخ بيشتغل عليها: بيختار ويرتّب ويفسّر.' },
        { t: 'trap', text: 'صح ولا غلط: <en>Perception is a passive process</en>.', wrong: '<en>True</en> — العين بتصوّر والمخ بيستقبل', right: 'False — Perception is an active process' },
        { t: 'quote', text: 'It merges what we see with what we know to build a coherent understanding of the world. Building on memory and experience, the brain fills in gaps and filters out extraneous data.', ref: 'L03 · S6' },
        { t: 'list', style: 'dot', items: ['**بيدمج** اللي بتشوفه مع اللي تعرفه <en>what we see + what we know</en>', '**بيعتمد** على الذاكرة والخبرة <en>memory and experience</en>', '**بيملا** الفراغات <en>fills in gaps</en>', '**بيشيل** المعلومات الزيادة <en>filters out extraneous data</en>'] },
        demo('context'),
        { t: 'check', q: 'gi11' }, { t: 'check', q: 'gi12' },
        { t: 'quote', text: 'With perception, the mind is trying to solve a puzzle—to interpret what the arrangements of shapes and colors mean. This interpretation depends on many factors, from the viewer’s memories, culture, and mood to the design’s context, form, and style.', ref: 'L03 · S6' },
        { t: 'compare', left: { title: 'عند المشاهد', en: 'the viewer', text: 'ذاكرته <en>memories</en>، ثقافته <en>culture</en>، ومزاجه <en>mood</en>.' }, right: { title: 'في التصميم', en: 'the design', text: 'السياق <en>context</en>، الشكل <en>form</en>، والستايل <en>style</en>.' }, note: 'تفسير أي تصميم = حاجات عند المشاهد + حاجات في التصميم.' },
        { t: 'quote', text: 'A designer must, therefore, carefully consider every element he chooses, so the viewer can translate the design’s code properly.', ref: 'L03 · S6', ar: 'عشان كده المصمم لازم يختار كل عنصر بحساب، عشان المشاهد يفك "الكود" صح.' },
        { t: 'check', q: 'gi13' },
        { t: 'h', text: 'الصور اللي في السلايدات', en: 'Arcimboldo · W.E. Hill 1915 · German postcard 1880' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'أرتشيمبولدو', en: 'Giuseppe Arcimboldo · 16th c.', text: 'لوحة من القرن ١٦: خضار وفاكهة متجمّعين بيكوّنوا وش. الأجزاء لوحدها خضار. مع بعض = كل جديد. ده معنى الجشطالت بالظبط.', color: C.sun },
          { title: 'بنت ولا ست كبيرة؟', en: 'W.E. Hill, 1915', text: 'رسمة واحدة: تشوفها بنت صغيرة باصّة بعيد، أو ست كبيرة. نفس الخطوط، قراءتين.', color: C.ultra },
          { title: 'كارت بوستال ألماني', en: 'German postcard, 1880', text: 'نسخة أقدم من نفس الفكرة. والسلايدات اللي بعدها فيها رسمة "بطة ولا أرنب؟" المشهورة.', color: C.pink }
        ] },
        { t: 'example', title: 'عربية الفول الصبح', text: 'من بعيد في ضلمة الفجر بتشوف قِدرة ونور أصفر وناس واقفة. لسه ما قريتش ولا كلمة. بس مخّك قالك: فطار. ذاكرتك وثقافتك فسّروا الشكل قبل أي قراية.' },
        { t: 'why', text: 'المخ مبيستحملش حاجة ملهاش معنى. أول ما يشوف شكل، بيدوّر في ذاكرته على حاجة شبهه. لو لقى، يرتاح. لو ملقاش، يكمّل هو من عنده.' },
        { t: 'tip', text: 'الإدراك = **active**. بيدمج + بيملا + بيفلتر. والتفسير = **المشاهد** (ذاكرة، ثقافة، مود) + **التصميم** (سياق، شكل، ستايل).' },
        { t: 'check', q: 'gi15' }, { t: 'check', q: 'gi16' }
      ]
    },
    {
      id: 'gst-ideas-1', title: 'فكرتين: الكل الأول… والمخ بيكمّل', en: 'Key ideas · Emergence & Reification', ref: 'L03 · S14–S17', scene: 'emergence',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'السلايدات فيها ٤ <en>Key Ideas</en>. انتبه: دي **أفكار**، مش **قوانين**. والامتحان بيحب يخلطهم.' },
        { t: 'grid', cols: 4, flip: true, items: [
          { title: 'Emergence', en: 'النشوء', text: 'The whole is identified before the parts — يتم تحديد الكل قبل الأجزاء.', color: C.pink },
          { title: 'Reification', en: 'إعادة التأهيل', text: 'Our mind fills in the gaps — العقل يقوم بملء الفجوات.', color: C.ultra },
          { title: 'Multi-stability', en: 'الاستقرار المتعدد', text: 'The mind seeks to avoid uncertainty — يسعى العقل لتجنب الأشياء المجهولة.', color: C.sun },
          { title: 'Invariance', en: 'تقليل الاختلاف', text: 'We’re good at recognizing similarities and differences — نحن جيدون في تحديد أوجه التشابه والاختلاف.', color: C.good }
        ] },
        { t: 'h', text: 'Emergence · النشوء', en: 'The whole is identified before the parts' },
        { t: 'quote', text: 'EMERGENCE (The whole is identified before the parts). Emergence is the process of forming complex patterns from simple rules. When attempting to identify an object, we first seek to identify its outline. We then match this outline pattern against shapes and objects we already know to find a match.', ref: 'L03 · S14', ar: 'يتم تحديد الكل قبل الأجزاء.' },
        { t: 'list', style: 'num', items: ['أول حاجة: المخ بيدوّر على **الحدود الخارجية** <en>outline</en>.', 'بعدها: بيقارن الحدود دي بأشكال يعرفها.', 'أول ما يلاقي تطابق: عرف الحاجة. التفاصيل تيجي بعدين.'] },
        demo('emergence'),
        { t: 'example', title: 'السلايد: وردة، وبقع، وحرف', text: 'في السلايد: سلويت وردة، وبقع سودا متفرقة بتطلع منها صورة كلب دلماسيان، وحرف U بينك معمول من دواير. في التلاتة بتشوف الكل الأول، وبعدين تاخد بالك إنه حتت.' },
        { t: 'trap', text: 'صح ولا غلط: <en>In emergence, we identify the parts first and then build the whole</en>.', wrong: 'True', right: 'False — the whole is identified before the parts' },
        { t: 'check', q: 'gk01' }, { t: 'check', q: 'gk06' }, { t: 'check', q: 'gk17' },
        { t: 'h', text: 'Reification · إعادة التأهيل', en: 'Our mind fills in the gaps' },
        { t: 'quote', text: 'REIFICATION (Our mind fills in the gaps). Reification is an aspect of perception in which the object as perceived contains more spatial information than what is actually present. As we attempt to match what we see to the familiar patterns we have stored in memory, there isn’t always an exact match.', ref: 'L03 · S16', ar: 'العقل يقوم بملء الفجوات.' },
        { t: 'p', text: 'يعني إنت بتشوف **أكتر** من المرسوم فعلًا. ليه؟ المخ بيقارن باللي في ذاكرته. ولما ميلاقيش تطابق كامل، بيكمّل الناقص من عنده.' },
        demo('kanizsa'),
        { t: 'example', title: 'يافطة نيون نصها محروق', text: 'يافطة محل في وسط البلد، نص حروفها مطفية. بتقراها برضه. مخّك ملى الحروف الناقصة من ذاكرته. وده بالظبط اللي بيحصل مع "ˈnvˈsˈble or vˈsˈble?" في السلايد.' },
        { t: 'why', text: 'المخ بيكره النقص. أي حاجة ناقصة بيرجّعها لأقرب حاجة يعرفها. ده بيوفّر وقت وطاقة، بس كمان بيخلّيه يشوف حاجات مش موجودة.' },
        { t: 'trap', text: 'Reification ولا Closure؟ الاتنين "المخ بيكمّل". الفرق في نوع السؤال: لو بيسأل عن **الأفكار الأساسية** يبقى Reification. لو بيسأل عن **القوانين** يبقى Closure.', wrong: 'Closure is one of the 4 key ideas', right: 'Reification = key idea · Closure = law' },
        { t: 'tip', text: '<en>E</en>mergence = <en>E</en>ntire first: الكل الأول. <en>R</en>eification = <en>R</en>efill: املا الناقص.' },
        { t: 'check', q: 'gk02' }, { t: 'check', q: 'gk08' }, { t: 'check', q: 'gk13' }, { t: 'check', q: 'gk19' }
      ]
    },
    {
      id: 'gst-ideas-2', title: 'صورتين في صورة، وشكل مهما اتلف', en: 'Key ideas · Multi-stability & Invariance', ref: 'L03 · S18–S21', scene: 'necker',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'فكرتين عكس بعض تقريبًا. واحدة: صورة **واحدة** بتتقري **مرتين**. والتانية: أشكال **كتير** متغيرة، وانت عارف إنها حاجة **واحدة**.' },
        { t: 'h', text: 'Multi-stability · الاستقرار المتعدد', en: 'The mind seeks to avoid uncertainty' },
        { t: 'quote', text: 'MULTI-STABILITY (The mind seeks to avoid uncertainty). Multi-stability is the tendency of ambiguous perceptual experiences to move unstably back and forth between alternative interpretations. Some objects can be perceived in more than one way.', ref: 'L03 · S18', ar: 'يسعى العقل لتجنب الأشياء المجهولة.' },
        { t: 'p', text: 'الصورة نفسها مش محسومة. ليها تفسيرين. المخ مبيعرفش يقعد في النص، لأنه بيكره عدم اليقين. فبيختار تفسير. وبعد شوية يقلب للتاني. وهكذا.' },
        demo('multi'),
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'المكعب', en: 'Same square shape – different perspectives', text: 'مكعب مرسوم خطوط بس. مرة الوش ده اللي قدّام، ومرة التاني. السلايد كاتب تحته: ده مثال على الـ multistability.', color: C.fg },
          { title: 'الفازة والوشين', en: 'Rubin’s face/vase', text: 'شكل أسود في النص: تشوفه فازة. تبص على اللي حواليه: تشوف وشّين بيبصوا لبعض. في السلايد مكتوب RUBENS FACE.', color: C.ultra },
          { title: 'البنت اللي بترقص', en: 'Dancing girl', text: 'سلويت بنت بتلف. مرة تشوفها بتلف يمين، ومرة شمال. الصورة نفسها مفيهاش اتجاه أصلًا.', color: C.pink }
        ] },
        { t: 'example', title: 'تيشيرت عليه أسهم', text: 'تيشيرت عليه أسهم بيضا وسودا متداخلة. مرة تشوف الأبيض رايح يمين، ومرة الأسود رايح شمال. مخّك بيتنطط بين القراءتين، ومبيقدرش يشوفهم الاتنين في نفس اللحظة.' },
        { t: 'trap', text: 'في السلايدات الفازة والوشين مثال على **Multi-stability** (S19): الصورة بتتقلب بين قراءتين. أمثلة **Figure/Ground** في السلايدات حاجة تانية: الأعمدة (S23) والشجرة والحمام (S27).', wrong: 'Vase ↔ two faces flipping = Invariance', right: 'Flipping between two readings = Multi-stability' },
        { t: 'check', q: 'gk10' }, { t: 'check', q: 'gk15' }, { t: 'check', q: 'gk18' },
        { t: 'h', text: 'Invariance · تقليل الاختلاف', en: 'We’re good at recognizing similarities and differences' },
        { t: 'quote', text: 'INVARIANCE (We’re good at recognizing similarities and differences). Invariance is a property of perception in which simple objects are recognized independent of their rotation, translation and scale. Since we often encounter objects from different perspectives, we’ve developed an ability to recognize them despite their different appearance.', ref: 'L03 · S20', ar: 'نحن جيدون في تحديد أوجه التشابه والاختلاف.' },
        { t: 'list', style: 'dot', items: ['<en>Rotation</en> = تلفّه', '<en>Translation</en> = تنقله من مكان لمكان', '<en>Scale</en> = تكبّره أو تصغّره'] },
        demo('invariance'),
        { t: 'example', title: 'لوجو الكلية على المج والقلم والبوستر', text: 'نفس اللوجو: لافف حوالين مج، صغير على قلم، وفي ركن بوستر. بتعرفه في التلاتة. ده Invariance. وعشان كده اللوجو الكويس لازم يتعرف من أي زاوية وبأي حجم.' },
        { t: 'why', text: 'إحنا طول اليوم بنشوف الحاجات من زوايا مختلفة. الكوباية من فوق دايرة، ومن الجنب مستطيل. لو المخ مكانش بيثبّت الحاجة، كانت كل زاوية هتبقى حاجة جديدة.' },
        { t: 'trap', text: 'Multi-stability ولا Invariance؟ Multi = **صورة واحدة، قراءتين**. Invariance = **أشكال متغيرة، شيء واحد**.', wrong: 'Invariance — one image, two readings', right: 'Invariance — rotation, translation, scale; you still recognize it' },
        { t: 'tip', text: '<en>Multi</en> = متعدد القراءات. <en>In-variance</en> = مفيش تغيير في التعرّف: لِف، انقل، كبّر… هو هو.' },
        { t: 'check', q: 'gk11' }, { t: 'check', q: 'gk16' }, { t: 'check', q: 'gk24' }
      ]
    },
    {
      id: 'gst-laws-1', title: 'خريطة القوانين + القُرب والتشابه', en: 'Gestalt Laws · Proximity & Similarity', ref: 'L03 · S24–S26', scene: 'proximity',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'هنا القوانين نفسها. ٦ أساسية و٣ مضافة. احفظ العدد قبل الأسامي، لأن الامتحان بيسأل عنه.' },
        { t: 'compare', left: { title: 'القوانين الأساسية (٦)', en: 'The Main Gestalt Laws', text: '<en>Proximity / Grouping</en> · <en>Similarity</en> · <en>Figure and Ground</en> · <en>Good Continuity</en> · <en>Closure</en> · <en>Simplicity</en>' }, right: { title: 'مبادئ مضافة (٣)', en: 'Other Add Principles', text: '<en>Common Fate</en> · <en>Connection</en> · <en>Symmetry</en>' }, note: '٦ + ٣ = ٩. واللي في كارت <en>Other Add Principles</en> بس هما "المضافة".' },
        { t: 'trap', text: 'سؤال <en>NOT</en>: إيه اللي **مش** من المبادئ المضافة؟', wrong: 'Proximity is an added principle', right: 'Added = Common Fate, Connection, Symmetry only' },
        { t: 'check', q: 'gl31' }, { t: 'check', q: 'gl30' },
        { t: 'h', text: 'القُرب', en: 'Law of Proximity / Grouping' },
        { t: 'quote', text: 'PROXIMITY where Elements that are placed close to each other will often be perceived as one group. When the dots are placed close to each other in groups, we tend to perceive 3 columns rather than a whole group of dots.', ref: 'L03 · S25' },
        demo('proximity'),
        { t: 'example', title: 'منيو محل الكشري', text: 'اسم الطبق والسعر والوصف لازقين في بعض. وبين كل طبق والتاني مسافة. عينك بتفهم إن كل ٣ سطور دول حاجة واحدة. لو المسافات بقت كلها زي بعض، المنيو هيبقى لخبطة.' },
        { t: 'example', title: 'في السلايدات', text: 'صورة تمثال رافع إيده قدام سلة باسكت، والكورة في الهوا فوق السلة. عشان الإيد والكورة قريبين من بعض في الصورة، المخ ربطهم وبان كإن التمثال لسه مشوّط الكورة. السلايد كاتب عليها <en>Law of Proximity</en>.' },
        { t: 'check', q: 'gl02' }, { t: 'check', q: 'gl32' }, { t: 'check', q: 'gl40' },
        { t: 'h', text: 'التشابه', en: 'Law of Similarity' },
        { t: 'quote', text: 'SIMILARITY where Objects that look alike, with similar components or attributes, are more likely to be organized together.', ref: 'L03 · S26' },
        demo('similarity'),
        { t: 'example', title: 'ماتش قمة', text: 'المدرجات فيها آلاف. بس إنت بتشوف جمهورين، مش آلاف أشخاص. ليه؟ لون التيشيرتات. كل الأحمر جروب، وكل الأبيض جروب. ده Similarity في أكبر صوره.' },
        { t: 'why', text: 'التجميع بيوفّر على المخ. بدل ما يتعامل مع ٣٦ نقطة، بيتعامل مع ٣ عواميد. أسهل وأسرع.' },
        { t: 'trap', text: 'Proximity ولا Similarity؟ لو العناصر **متطابقة** والفرق في **الأماكن**: قُرب. لو **المسافات متساوية** والفرق في **اللون أو الشكل**: تشابه.', wrong: 'Identical dots, grouped by spacing = Similarity', right: 'Identical dots, grouped by spacing = Proximity' },
        { t: 'tip', text: '<en>Proximity</en> = قريب من بعض. <en>Similarity</en> = شبه بعض. الأول **مسافة**، والتاني **شكل**.' },
        { t: 'check', q: 'gl04' }, { t: 'check', q: 'gl33' }
      ]
    },
    {
      id: 'gst-figure', title: 'الشكل والأرضية', en: 'Law of Figure and Ground', ref: 'L03 · S27', scene: 'figureGround',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'كل تصميم فيه حاجة "هي الموضوع"، وحاجة "حواليه". المخ لازم يقرر. والمصمم الشاطر بيخلّيه يقرر الاتنين.' },
        { t: 'quote', text: 'FIGURE/GROUND principle is based upon the relationship between an object and the surrounding space. Figure/ground is also referred to as positive and negative space, the positive being the object and the negative referring to the space around it.', ref: 'L03 · S27' },
        { t: 'compare', left: { title: 'الشكل', en: 'Figure = positive', text: 'الحاجة نفسها. اللي عينك بتقف عندها.' }, right: { title: 'الأرضية', en: 'Ground = negative', text: 'المساحة اللي حوالين الحاجة.' } },
        demo('figure'),
        { t: 'fig', id: 'g-figure', caption: 'القطة دي مش مرسومة. هي المساحة اللي اتسابت فاضية وسط الشكل الغامق.' },
        { t: 'example', title: 'المشربية', text: 'شبّاك مشربية: الخشب هو الشكل، والفتحات أرضية. بس لما الشمس تدخل، الفتحات المنوّرة بتبقى هي الشكل، والخشب يرجع أرضية. نفس الشبّاك، قراءتين حسب النور.' },
        { t: 'example', title: 'في السلايدات', text: 'أعمدة درابزين بيضا، والمسافات اللي بينها بتعمل بروفايلات وشوش. وشجرة سلويت، وطيور مرسومة بالمساحة الفاضية. السلايد كاتب عليها <en>Law of Figure and Ground</en>.' },
        { t: 'trap', text: 'صح ولا غلط: <en>In figure/ground, “negative” refers to the object itself</en>.', wrong: 'True', right: 'False — negative = the space around it; positive = the object' },
        { t: 'why', text: 'المخ مبيقدرش يشوف الاتنين "موضوع" في نفس اللحظة. لازم يقدّم واحد ويرجّع التاني لورا. التصميم الذكي بيلعب على اللحظة دي، فتلاقي نفسك بتبص مرتين.' },
        { t: 'tip', text: '<en>Positive</en> = الحاجة. <en>Negative</en> = اللاشيء اللي حواليها. <en>N</en> زي <en>Nothing</en>.' },
        { t: 'check', q: 'gl05' }, { t: 'check', q: 'gl06' }, { t: 'check', q: 'gl07' }, { t: 'check', q: 'gl41' }, { t: 'check', q: 'gl34' }
      ]
    },
    {
      id: 'gst-laws-2', title: 'الاستمرارية والإغلاق', en: 'Good Continuity · Closure', ref: 'L03 · S28–S29', scene: 'continuity',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'عينك بتحب تكمّل الطريق، ومخّك بيحب يقفل الأشكال. القانونين قرايب… بس مش توأم.' },
        { t: 'h', text: 'الاستمرارية', en: 'Good Continuity' },
        { t: 'quote', text: 'GOOD CONTINUITY: Objects will be grouped if they are co-linear, or follow a direction. It predicts the preference for continuous figures. We perceive the figure as two crossed lines instead of 4 lines meeting at the center.', ref: 'L03 · S28' },
        demo('continuity'),
        { t: 'example', title: 'خريطة المترو', text: 'كل خط مترسوم خط واحد مستمر بلون، حتى لما يعدّي على خطوط تانية. عينك بتمشي مع الخط لآخره، ومش بتتلخبط في التقاطعات.' },
        { t: 'example', title: 'في السلايدات', text: 'صورة لاعيبة كورة: دراع لاعب شكله مكمّل في جسم لاعب تاني لأنهم على نفس الاتجاه. السلايد كاتب عليها <en>Law of Continuity</en>.' },
        { t: 'check', q: 'gl08' }, { t: 'check', q: 'gl09' }, { t: 'check', q: 'gl36' },
        { t: 'h', text: 'الإغلاق', en: 'Law of Closure' },
        { t: 'quote', text: 'CLOSURE Related to principle of good continuation, there is a tendency to close simple figures, independent of continuity or similarity. This results in a effect of filling in missing information or organizing information which is present to make a whole.', ref: 'L03 · S29' },
        demo('closure'),
        { t: 'example', title: 'فانوس رمضان على يافطة', text: 'فانوس مرسوم بخطوط متقطعة على يافطة محل. الخط مش مكمّل في أي حتة، وانت شايفه فانوس كامل. ونفس الحكاية في لوجوهات حيوانات معمولة من كام بقعة سودا من غير خط حواليها.' },
        { t: 'trap', text: 'Continuity = عينك **ماشية مع اتجاه** (خط، منحنى). Closure = مخّك **بيقفل شكل** ناقص. السلايد بيقول إن Closure ليه علاقة بالـ <en>good continuation</en>، بس بيقفل الأشكال <en>independent of continuity or similarity</en>.', wrong: 'Closure needs continuity to work', right: 'Closure closes simple figures independent of continuity or similarity' },
        { t: 'tip', text: '<en>Continuity</en> = كمّل الطريق. <en>Closure</en> = اقفل الباب.' },
        { t: 'check', q: 'gl11' }, { t: 'check', q: 'gl12' }, { t: 'check', q: 'gl14' }, { t: 'check', q: 'gl35' }
      ]
    },
    {
      id: 'gst-simplicity', title: 'البساطة (Prägnanz)', en: 'Law of Simplicity', ref: 'L03 · S30', scene: 'simplicity',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'مخّك كسول… بس بشياكة. أي حاجة معقدة بيقراها في أبسط شكل ممكن.' },
        { t: 'quote', text: 'SIMPLICITY indicates that our mind perceives everything in its simplest form. The image below, for example, when studied in depth is made up of individual components that have no meaning when viewed separately, yet our mind automatically perceives them in combination to spell out the word ‘logo’.', ref: 'L03 · S30' },
        { t: 'p', text: 'نفس القانون اسمه كمان <en>Law of Prägnanz</en>. في السلايد مكتوب: <en>Law of Pragnanz or Simplicity</en>. الاتنين حاجة واحدة.' },
        demo('simplicity'),
        { t: 'example', title: 'أيقونات الموبايل', text: 'أيقونة الكاميرا مستطيل ودايرة. مفيش عدسات ولا زراير. ومع ذلك بتفهمها في جزء من ثانية. وفي السلايد: كرسي سلويت بسيط جنب كرسي مزخرف، والاتنين "كرسي".' },
        { t: 'why', text: 'الشكل البسيط أسهل يتخزن في الذاكرة ويتقارن بسرعة. فالمخ بيختار التفسير الأبسط الأول، وبعدين يبص على التفاصيل لو احتاج.' },
        { t: 'trap', text: 'Simplicity ولا Emergence؟ Emergence = **الكل قبل الأجزاء** (فكرة). Simplicity = **أبسط شكل** (قانون). ومثال كلمة ‘logo’ تبع Simplicity.', wrong: 'The ‘logo’ example = Emergence', right: 'The ‘logo’ example = Simplicity (Prägnanz)' },
        { t: 'tip', text: '<en>Prägnanz</en> = <en>Simplicity</en>. مخّك بيختار **أقصر تفسير**.' },
        { t: 'check', q: 'gl15' }, { t: 'check', q: 'gl16' }, { t: 'check', q: 'gl17' }, { t: 'check', q: 'gl18' }
      ]
    },
    {
      id: 'gst-added', title: 'التلاتة المضافين', en: 'Common Fate · Connection · Symmetry', ref: 'L03 · S31–S33', scene: 'commonFate',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'دول اللي السلايد سمّاهم <en>Other Add Principles</en>. تلاتة بس… وكلهم أسئلة سهلة لو فهمتهم.' },
        { t: 'h', text: 'المصير المشترك', en: 'Law of Common Fate' },
        { t: 'quote', text: 'COMMON FATE Suppose both principles of proximity and similarity are in place - then a movement takes place - the dots begin to move down the page. They appear to change grouping.', ref: 'L03 · S31' },
        demo('fate'),
        { t: 'example', title: 'حمام فوق القلعة', text: 'آلاف حمامة في السما. اللي بيطيروا مع بعض في نفس الاتجاه بتشوفهم سرب واحد. وفي الموبايل: لما تدوس مطوّل، الأيقونات اللي بتترعش مع بعض بتبقى جروب.' },
        { t: 'check', q: 'gl19' }, { t: 'check', q: 'gl21' },
        { t: 'h', text: 'الاتصال', en: 'Law of Connection · Connectedness' },
        { t: 'quote', text: 'CONNECTEDNESS We perceive elements as being "united" if they are connected by other elements. An easy way to think about this principle in action is an infographic or flowchart where arrows help connect one figure (or text block) to the next.', ref: 'L03 · S32' },
        demo('connect'),
        { t: 'example', title: 'خطوات التقديم في الجامعة', text: 'فلوتشارت: كل مربع موصّل باللي بعده بسهم. السهم هو اللي بيقولك إن الخطوتين تبع بعض، حتى لو شكلهم مختلف خالص.' },
        { t: 'trap', text: 'لو لقيت <en>Connectedness — elements that look alike are grouped</en>: ده غلط. "اللي شبه بعض" = Similarity. الاتصال = **حاجة بتوصلهم** (خط، سهم).', wrong: 'Connectedness — elements that look alike are grouped', right: 'Connectedness — united because they are connected by other elements' },
        { t: 'check', q: 'gl23' }, { t: 'check', q: 'gl39' },
        { t: 'h', text: 'التماثل', en: 'Law of Symmetry' },
        { t: 'quote', text: 'SYMMETRY The principle of area states that the smaller of two overlapping figures is perceived as figure while the larger is regarded as ground. The principle of the symmetrical figure is that it is seen as a closed figure. Symmetrical contours thus define a figure and isolate it from its ground.', ref: 'L03 · S33' },
        { t: 'list', style: 'dot', items: ['**قانون المساحة** <en>principle of area</en>: لو شكلين فوق بعض، الأصغر = شكل، والأكبر = أرضية.', '**الشكل المتماثل** بيتشاف **مقفول** <en>closed figure</en>.', 'الحدود المتماثلة بتحدد الشكل وتفصله عن الأرضية.'] },
        demo('symmetry'),
        { t: 'example', title: 'باب الجامع', text: 'بوابة متماثلة: الجانبين زي بعض بالظبط، فبتتشاف وحدة واحدة مقفولة. لو جنب واحد اتشال، الإحساس بالوحدة بيقع.' },
        { t: 'tip', text: '<en>Common Fate</en> = بيتحركوا سوا. <en>Connection</en> = متوصّلين بخط. <en>Symmetry</en> = مرايا = شكل مقفول.' },
        { t: 'check', q: 'gl25' }, { t: 'check', q: 'gl26' }
      ]
    },
    {
      id: 'gst-design', cap: ['Gestalt in ads', 'الجشطالت في الإعلانات'], title: 'الجشطالت في الإعلانات، والأسايمنت', en: 'Design Using Gestalt Perception · Assignment', ref: 'L03 · S22–S23, S38–S48', scene: 'vase',
      blocks: [
        { t: 'say', who: 'kanizsa', text: 'كل اللي فات ده مش كلام نظري. المعلنين بيستخدموه عشان يخلّوك تبص مرتين.' },
        { t: 'p', text: 'السلايدات فيها إعلانات ولوجوهات كتير. مش هنرسمها هنا. هنوصفها، واقلب الكارت عشان تشوف قراءتنا للقانون اللي فيها.' },
        { t: 'grid', cols: 2, flip: true, items: [
          { title: 'إزازة كاتشب من شرايح طماطم', en: 'Heinz · “No one grows ketchup like Heinz”', text: 'شرايح طماطم فوق بعض بتعمل شكل إزازة. مفيش إزازة مرسومة. مخّك جمّع الشرايح لشكل يعرفه: Closure + Emergence.', color: C.red },
          { title: 'شجرة من البطاطس المحمّرة', en: 'McDonald’s · Merry Christmas', text: 'أصابع بطاطس مترتبة على شكل شجرة كريسماس. الأجزاء بطاطس، والكل شجرة: Emergence + Similarity.', color: C.sun },
          { title: 'حرف من عشرات الأيقونات', en: 'Unilever', text: 'حرف U كبير معمول من أيقونات صغيرة كتير. بتشوف الحرف الأول، وبعدين الأيقونات: Emergence.', color: C.ultra },
          { title: 'حروف من خطوط مقطّعة', en: 'IBM', text: 'حروف معمولة من خطوط أفقية متقطعة. مفيش حرف مقفول، ومخّك بيكمّل: Closure.', color: C.ice },
          { title: 'بروفايلين أسود وأصفر', en: 'Criminal Underworld poster', text: 'الأسود بيعمل بروفايل، والأصفر اللي حواليه بيعمل بروفايل تاني: Figure and Ground.', color: C.pink },
          { title: 'كوباية قهوة = زرار تشغيل', en: 'Bake Well · OFF / ON', text: 'كوباية من فوق، وودنها بتبان زي مفتاح بين OFF و ON. شكل بسيط بيتقري معنى تاني: Simplicity + Closure.', color: C.good }
        ] },
        { t: 'example', title: 'إعلانات تانية في السلايدات', text: 'إزازة صوص حار متركّب عليها راس طفاية حريق وخرطومها (Beware the heat). وسمكة متقطعة شرايح وانت شايفها سمكة واحدة. وإزازة لبن معمولة بالكامل من كلام مكتوب. حاول تطلّع القانون في كل واحد قبل ما تكمّل.' },
        { t: 'h', text: 'الأسايمنت', en: 'Assignment' },
        { t: 'quote', text: 'اختار احد الكائنات الحية (حيوانات برية – طيور - زواحف) — وقم برسمها بعدة معالجات (10 أساليب علي الأقل) مع مراعاة ان تكون الأساليب متنوعة وتتفق مع مبادئ الجشتالط — يرجى مراعاة التنوع بين أساليب المعالجة (التحديد الخارجي – الملىء الداخلي – الزخرفة – الاختزال....الخ) — توضع الرسم جميعها مع الأصل في ملف واحد بصيغة PDF', ref: 'L03 · S44' },
        { t: 'list', style: 'num', items: ['اختار كائن حي واحد: حيوان بري، أو طير، أو زاحف.', 'ارسمه بـ**١٠ معالجات على الأقل**، متنوعة، ومتفقة مع مبادئ الجشطالت.', 'نوّع: تحديد خارجي، ملء داخلي، زخرفة، اختزال… إلخ.', 'حط كل الرسومات **مع الصورة الأصلية** في **ملف PDF واحد**.'] },
        { t: 'art', html: fishArt, caption: 'مثال: نفس السمكة بعشر معالجات. لاحظ إنك عارفها في الكل: ده Invariance و Closure و Emergence شغالين مع بعض.', wide: true },
        { t: 'tip', text: 'الأسايمنت = **كائن واحد × ١٠ معالجات** + الأصل، في **PDF واحد**. والسلايدات فيها أمثلة: غزلان، أحصنة بحر، سلاحف، نحل، ودبّ متقسم مثلثات.' },
        { t: 'check', q: 'gl42' }
      ]
    }
  ]
};
