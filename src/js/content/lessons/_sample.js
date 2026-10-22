// REFERENCE LESSON — every block type the renderer supports, in the house style (route: build --sample → #/dev/learn).
// Rules of the house:
//  · Arabic = Egyptian, simple, short sentences, one idea per sentence. English slide terms inside <en>…</en>.
//  · No faces, no cartoon characters. Art = original line/particle-like SVG: thin strokes, geometric, dark-friendly.
//    Use currentColor or the palette below; backgrounds transparent (cards are dark).
//  · Each chapter may set `scene` (see world/scenes.js) — the particle stage beside the text morphs to it.
const C = { fg: '#EDEBE6', dim: '#7E7C8B', red: '#FF4A2E', ultra: '#4D6BFF', sun: '#FFC21A', ice: '#7FE7FF', violet: '#8B7BFF', pink: '#FF3E8A', good: '#46E3A0' };

export default {
  zone: 'shape',
  hero: { say: 'ده درس تجريبي بيورّي كل أنواع البلوكات. <en>Sample</en> بس.' },
  chapters: [
    {
      id: 'sample-1', title: 'كل أنواع البلوكات', en: 'Every block type', ref: 'Lecture 02 · slide 10', scene: 'circle',
      blocks: [
        { t: 'say', who: 'circle', text: 'أنا الدايرة. أي حد يشوفني بيرتاح. ده مش صدفة، ده <en>psychology</en>.' },
        { t: 'p', text: 'فقرة عادية. جمل قصيرة. فكرة واحدة في كل جملة. الكلمات الإنجليزي تتكتب كده: <en>Symbolism</en>. وممكن **تقيل** أو ==مهم==.' },
        { t: 'quote', text: 'Circle — Symbolism: Unity, infinity, wholeness, protection.', ref: 'L02 · S10', ar: 'الدايرة = وحدة ولانهاية واكتمال وحماية.' },
        { t: 'h', text: 'عنوان صغير جوه الدرس', en: 'Psychological effect' },
        { t: 'list', style: 'dot', items: ['أول نقطة فيها <en>soft</en>', 'تاني نقطة', 'تالت نقطة'] },
        { t: 'list', style: 'num', items: ['خطوة ١', 'خطوة ٢'] },
        { t: 'list', style: 'check', items: ['حاجة صح', 'حاجة صح كمان'] },
        { t: 'example', title: 'زرار المتابعة', text: 'أغلب الأزرار في التطبيقات أطرافها مدورة. ليه؟ عشان الحواف المدورة إحساسها آمن وودود.', art: `<svg viewBox="0 0 320 110" fill="none"><rect x="70" y="27" width="180" height="56" rx="28" stroke="${C.fg}" stroke-width="1.5"/><text x="160" y="62" text-anchor="middle" font-family="Alexandria" font-weight="600" font-size="20" fill="${C.fg}">Follow</text><rect x="20" y="40" width="30" height="30" stroke="${C.dim}" stroke-dasharray="3 4"/><circle cx="285" cy="55" r="15" stroke="${C.dim}" stroke-dasharray="3 4"/></svg>` },
        { t: 'why', text: 'المخ بيربط الحواف المدورة بالأمان، لأن مفيش سنّ يعوّرك.' },
        { t: 'trap', text: 'السؤال ممكن يقولك "unity, infinity" ويحطلك <en>Ellipse</en> في الاختيارات.', wrong: 'Ellipse = unity, infinity', right: 'Circle = unity, infinity, wholeness, protection' },
        { t: 'tip', text: 'الدايرة = حضن. المربع = بنك. المثلث = إشارة.' },
        { t: 'art', html: `<svg viewBox="0 0 600 200" fill="none" stroke-width="1.5"><circle cx="110" cy="100" r="70" stroke="${C.ultra}"/><rect x="230" y="30" width="140" height="140" stroke="${C.red}"/><path d="M490 30L560 170H420Z" stroke="${C.sun}"/><g fill="${C.dim}" font-family="IBM Plex Sans Arabic" font-size="14" text-anchor="middle" stroke="none"><text x="110" y="196">Circle</text><text x="300" y="196">Square</text><text x="490" y="196">Triangle</text></g></svg>`, caption: 'رسمة خطية بسيطة بتشرح فكرة' },
        { t: 'compare', left: { title: 'فراغ مقصود', en: 'Active whitespace', text: 'مساحة مقصودة ومش متماثلة، بتخلي التصميم أحيا.' }, right: { title: 'فراغ عادي', en: 'Passive whitespace', text: 'المسافة الطبيعية بين الحروف والعناصر.' }, note: 'الفرق: واحدة بقرار، والتانية تلقائي.' },
        { t: 'grid', cols: 3, flip: true, items: [
          { title: 'دايرة', en: 'Circle', text: 'وحدة، لانهاية، اكتمال، حماية.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="24" cy="24" r="17"/></svg>`, color: C.ultra },
          { title: 'مربّع', en: 'Square', text: 'ثبات، اعتمادية، نظام، صدق.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="32" height="32"/></svg>`, color: C.red },
          { title: 'مثلّث', en: 'Triangle', text: 'اتجاه، حركة، توتر، قوة.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M24 6L42 40H6z"/></svg>`, color: C.sun }
        ] },
        { t: 'table', head: ['الشكل', 'الإحساس', 'الاستخدام'], rows: [['دايرة', 'آمن', 'أزرار'], ['مربع', 'ثابت', 'جريد']] },
        { t: 'fig', id: 'g-closure', caption: 'فيجر من مكتبة الأشكال' },
        { t: 'demo', id: 'sample-demo', title: 'غيّر الشكل وشوف الإحساس', caption: 'كل ضغطة بتغيّر الشكل، والكلمة اللي جنبه بتتغير معاه.', mount(el, api) {
          const S = [['circle', 'آمن'], ['square', 'ثابت'], ['triangle', 'متحرك'], ['star', 'احتفالي']]; let i = 0;
          el.innerHTML = `<div class="smp"><button type="button" class="btn">بدّل الشكل</button><span class="smp__g"></span><b class="smp__w"></b></div>`;
          const draw = () => { el.querySelector('.smp__g').innerHTML = api.GLYPH[S[i][0]]; el.querySelector('.smp__w').textContent = S[i][1]; };
          el.querySelector('button').onclick = e => { i = (i + 1) % S.length; draw(); api.sfx('pop'); if (i === 3) api.award(5, { from: e.currentTarget, key: 'demo:sample' }); };
          draw();
        } },
        { t: 'check', q: 'sh02' },
        { t: 'divider' }
      ]
    },
    { id: 'sample-2', title: 'الفصل التاني', en: 'Second chapter', scene: 'triangle', blocks: [{ t: 'p', text: 'فصل قصير.' }, { t: 'check', q: 'sh03' }] }
  ]
};

export const games = [{
  id: 'sample-game', title: 'تحدي تجريبي', en: 'Sample trial', how: 'اضغط ٥ مرات بسرعة.',
  mount(el, api, ctx) {
    let n = 0;
    el.innerHTML = `<div class="g-card" style="text-align:center"><p class="g-prompt">اضغط!</p><button type="button" class="btn btn--zone btn--lg">اضغط</button><p class="hud-num" style="font-size:40px">0</p></div>`;
    el.querySelector('button').onclick = e => { n++; el.querySelector('.hud-num').textContent = n; api.sfx('pop'); if (n === 5) { const r = api.finishGame('sample-game', 5, 5, e.currentTarget); el.querySelector('.g-prompt').textContent = 'خلصت! ' + r.stars + ' علامات'; } };
    return () => { };
  }
}];
