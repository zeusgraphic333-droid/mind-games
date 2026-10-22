// Black Square Studio — Lecture 02 · Express Meaning (slides 2–5).
import { sqPage, pageSVG, SQ, LECTURE_WORDS, SECTION_WORDS } from './_express-art.js';

const FG = '#EDEBE6', DIM = '#7E7C8B';
const AR = Object.fromEntries(Object.keys(SQ).map(w => [w, SQ[w].ar]));
/* Arabic reading of each composition (built from the SQ notes) */
export const READ = {
  Order: 'نفس المقاس، ونفس المسافة، ومحاذاة واحدة. مفيش عنصر خارج عن الصف.',
  Increase: 'الحجم أو العدد بيكبر خطوة بخطوة، فعينك تمشي مع الزيادة.',
  Bold: 'عنصر واحد تقيل واخد الكادر كله. مفيش منافس.',
  Congested: 'عناصر كتير ملزوقة في بعض، ومفيش مساحة تتنفّس.',
  Tension: 'عناصر قربت تلمس بعض، أو واقفة على سنّة. حاسس إنها هتقع.',
  Playful: 'مربعات صغيرة مايلة ونطّاطة على ارتفاعات مختلفة.',
  Dominance: 'عنصر واحد أكبر بكتير من الباقي، والصغيرين تحته.',
  Alienated: 'مجموعة، وعنصر واحد متساب برّاها لوحده.',
  Surprise: 'نظام ماشي، وفجأة كسرة.',
  Upbeat: 'إيقاع طالع لفوق بخطوة خفيفة.',
  Chaos: 'مقاسات وزوايا عشوائية، وخطوط في كل حتة. مفيش قاعدة.',
  Acceptance: 'عنصر مختلف اتاخد جوه المجموعة.',
  Pressure: 'عنصر تقيل كابس على عنصر صغير.',
  Tranquility: 'خطوط أفقية ومساحة فاضية كتير.',
  Harmony: 'متوازن وبالتدريج، ومفيش حاجة بتتخانق.',
  Stability: 'قاعدة عريضة، وقمة ضيقة، وواقف على الأرض.',
  Rage: 'خطوط رأسية حادة، ومربعات مايلة، وأحمر.',
  Justice: 'وزنين متساويين على جنبين محور.',
  Melancholy: 'واطي، وصغير، وباهت، وخطوط نازلة.',
  Disorder: 'نظام لسه باين، بس اتكسر.',
  Fluidity: 'العناصر ماشية على موجة واحدة ناعمة.'
};
const wordCard = (w, t = 0, extra = '') => `<figure class="exp-word">${sqPage(w, t)}<figcaption><b dir="ltr">${w}</b><span>${AR[w]}</span></figcaption>${extra}</figure>`;
const ICONS = {
  product: `<path d="M14 34h20M17 34l-2 8M31 34l2 8M12 22h24v12H12zM18 22v-8h12v8"/>`,
  sound: `<path d="M6 24h4l3-8 4 18 4-24 4 28 4-20 4 12 3-6h6"/>`,
  vr: `<rect x="6" y="16" width="36" height="17" rx="6"/><circle cx="16" cy="25" r="4"/><circle cx="32" cy="25" r="4"/><path d="M21 33l3-4 3 4"/>`,
  interaction: `<path d="M18 10v18l-4-3-3 3 9 11h12l3-14-11-3V10a3 3 0 0 0-6 0z"/>`,
  graphic: `<rect x="10" y="6" width="28" height="36"/><circle cx="20" cy="18" r="5"/><path d="M14 32h20M14 37h12"/>`,
  games: `<rect x="5" y="16" width="38" height="18" rx="9"/><path d="M14 22v6M11 25h6"/><circle cx="31" cy="23" r="1.6"/><circle cx="35" cy="27" r="1.6"/>`,
  software: `<rect x="6" y="9" width="36" height="28" rx="3"/><path d="M6 16h36M10 12.5h2M14 12.5h2M12 23h14M12 29h10"/>`,
  interior: `<path d="M8 40h32M12 40V28h24v12M12 28v-4a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v4M24 6v8M20 14h8l-2 5h-4z"/>`
};
const icon = k => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${ICONS[k]}</svg>`;

/* the 6 pages of the section work: 3 words × 2 trials */
const pagesDiagram = `<svg viewBox="0 0 600 250" direction="ltr" role="img" aria-label="Six square pages in a 3 by 2 grid: word 1, 2 and 3, each with trial 1 and trial 2">
  ${[0, 1, 2].map(c => [0, 1].map(r => `<g transform="translate(${36 + c * 190} ${18 + r * 116})"><rect width="96" height="96" fill="#ECEAE4"/><rect x="8" y="8" width="80" height="80" fill="none" stroke="#0B0B10" stroke-width="1"/><text x="110" y="44" font-family="IBM Plex Sans Arabic" font-size="15" fill="${FG}" font-weight="600">Word ${c + 1}</text><text x="110" y="66" font-family="IBM Plex Sans Arabic" font-size="13" fill="${DIM}">trial ${r + 1}</text></g>`).join('')).join('')}
</svg>`;

export default {
  zone: 'express',
  hero: { say: 'هنا مفيش صور ولا فونتات. مربعات وخطوط وبس. والتحدي: تخلّي مربع أسود "يحسّ".' },
  chapters: [
    /* ------------------------------------------------------------ 1 */
    {
      id: 'exp-what', title: 'يعني إيه تعبير؟', en: 'Express meaning', ref: 'L02 · Express · slide 2', scene: 'squares',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'التعبير مش إنك ترسم حاجة حلوة. التعبير إنك تطلّع اللي جواك على الورق، بصدق.' },
        { t: 'quote', text: 'Expression in Design implies a clear and authentic displaying of the character or personality of an individual (Designer).', ref: 'L02 · Express · S2' },
        { t: 'p', text: 'ركّز في ٣ كلمات من التعريف:' },
        { t: 'list', style: 'num', items: ['**واضح** <en>clear</en>: اللي بيشوف يفهم الإحساس من غير شرح.', '**حقيقي** <en>authentic</en>: طالع منك إنت، مش تقليد لحد.', '**شخصية المصمم** <en>the character or personality of an individual (Designer)</en>: التصميم بيبان فيه إنت.'] },
        { t: 'quote', text: 'The expression is often identified with the design elements and principles, whose main starting point and aim is to present and express what has been “seen” or experienced in the inner eye of the mind, heart and soul, i.e. to express the subjective moods and feelings without referring to conventional and “objective” values, judgments and truths.', ref: 'L02 · Express · S2' },
        { t: 'p', text: 'الجملة الطويلة دي بتقول ٤ حاجات. فكّها كده:' },
        { t: 'list', style: 'num', items: ['التعبير بيتربط بـ **عناصر ومبادئ التصميم** <en>design elements and principles</en>. يعني أدواتك: نقطة، خط، شكل، مساحة، توازن، إيقاع…', 'نقطة البداية والهدف: إنك تعرض اللي "شفته" أو عشته بـ **عين العقل والقلب والروح** <en>the inner eye of the mind, heart and soul</en>.', 'يعني تعبّر عن **مودك ومشاعرك الذاتية** <en>subjective moods and feelings</en>.', '**من غير** ما ترجع للقيم والأحكام والحقائق "الموضوعية" المتعارف عليها <en>without referring to conventional and “objective” values, judgments and truths</en>.'] },
        { t: 'compare', left: { title: 'وصف', en: 'objective', text: 'مربع في النص. صح؟ صح. بيحسّسك بحاجة؟ ولا حاجة.', art: pageSVG([{ t: 's', x: 50, y: 50, s: 50 }], { label: 'One square in the centre' }) }, right: { title: 'تعبير', en: 'subjective', text: 'نفس المربع، صغير ومزنوق في الركن، وحواليه فراغ ضخم. فجأة بقى "وحيد".', art: pageSVG([{ t: 's', x: 116, y: 118, s: 14 }], { label: 'One tiny square pushed into the bottom corner' }) }, note: 'نفس العنصر. اللي اتغير القرار: المقاس والمكان.' },
        { t: 'example', title: 'اتنين رسموا البحر', text: 'واحد رسم البحر أزرق بموج منظم. والتاني رسمه خطوط سودا مكسّرة، لأنه افتكر يوم حزين على الكورنيش. الأول "وصف" البحر. التاني "عبّر" عن البحر بتاعه.' },
        { t: 'why', text: 'المشاهد بيحس الصدق. التصميم اللي طالع من إحساس حقيقي بيوصل أسرع من التصميم "الصح" الناشف. وده نفس كلام أول المحاضرة: التصميم بيكلّم عقل المشاهد وقلبه.' },
        { t: 'trap', text: 'التعبير بيعرض شخصية **المصمم** <en>(Designer)</en>، مش العميل ولا البراند. وبيعبّر عن مشاعر **ذاتية** من غير ما يرجع لحقائق "موضوعية".', wrong: 'Expression follows conventional, objective values and truths', right: 'Expression shows subjective moods and feelings — without referring to conventional and “objective” values' },
        { t: 'tip', text: 'التعبير = جوايا ← برّا. واضح، وحقيقي، وبتاعي. ومن غير "المفروض".' },
        { t: 'check', q: 'ex01' },
        { t: 'check', q: 'ex02' },
        { t: 'check', q: 'ex03' },
        { t: 'check', q: 'ex04' }
      ]
    },
    /* ------------------------------------------------------------ 2 */
    {
      id: 'exp-everywhere', title: 'التعبير في كل حتة', en: 'A very broad concept', ref: 'L02 · Express · slide 3', scene: 'sq:Upbeat',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'التعبير مش حكر على الجرافيك. موجود في الصوت، والألعاب، وحتى في الأوضة اللي إنت قاعد فيها دلوقتي.' },
        { t: 'quote', text: 'It is a very broad concept, and its meaning can greatly vary from one field to another. It and permeates many aspects of our lives and branches out into many different subgenres, from product design, sound, virtual reality, interaction, to Graphic design, video games, software interfaces, the home and offices interior etc.', ref: 'L02 · Express · S3' },
        { t: 'p', text: 'يعني: مفهوم **واسع جدًا**، ومعناه بيتغيّر من مجال لمجال. وبيدخل في حاجات كتير في حياتنا. السلايد عدّت ٨ مجالات:' },
        { t: 'grid', cols: 4, items: [
          { title: 'تصميم المنتجات', en: 'product design', art: icon('product') }, { title: 'الصوت', en: 'sound', art: icon('sound') },
          { title: 'الواقع الافتراضي', en: 'virtual reality', art: icon('vr') }, { title: 'التفاعل', en: 'interaction', art: icon('interaction') },
          { title: 'الجرافيك', en: 'graphic design', art: icon('graphic') }, { title: 'ألعاب الفيديو', en: 'video games', art: icon('games') },
          { title: 'واجهات السوفتوير', en: 'software interfaces', art: icon('software') }, { title: 'ديكور البيت والمكتب', en: 'home & office interior', art: icon('interior') }
        ] },
        { t: 'example', title: 'صوت الإشعار', text: 'نغمة "تينج" خفيفة لما رسالة توصل = فرحة صغيرة. "بززز" تقيلة لما البطارية تخلص = قلق. ده تعبير بالصوت. ولعبة رعب بإضاءة خافتة وألوان باهتة؟ ده تعبير بالـ <en>video games</en>.' },
        { t: 'why', text: 'أي حاجة الإنسان بيصممها ممكن تشيل مود. عشان كده كلمة "تعبير" معناها بيختلف: في الصوت نبرة، وفي الديكور إضاءة وخامات، وفي الجرافيك عناصر وتكوين.' },
        { t: 'trap', text: 'سؤال صح وغلط محتمل: "التعبير مفهوم ضيق للجرافيك بس". **غلط**. هو <en>a very broad concept</en>. ولو جالك سؤال اختيار المجالات، دوّر على: <en>product design, sound, virtual reality, interaction</en>.', wrong: 'Expression is a narrow concept that applies only to graphic design', right: 'Expression is a very broad concept that branches out into many fields' },
        { t: 'tip', text: '٨ مجالات: منتج، صوت، VR، تفاعل، جرافيك، جيمز، واجهات سوفتوير، وديكور البيت والمكتب.' },
        { t: 'check', q: 'ex05' },
        { t: 'check', q: 'ex06' }
      ]
    },
    /* ------------------------------------------------------------ 3 */
    {
      id: 'exp-challenge', title: 'تحدي المربع الأسود', en: 'Black Square Challenge', ref: 'L02 · Express · slide 4', scene: 'sq:Order',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'في المحاضرة اتعرض تحدي اسمه <en>Black Square</en>: ٦ كلمات، وكل كلمة متقالة بمربعات سودا بس. ولا صورة، ولا كلمة مكتوبة.' },
        { t: 'quote', text: 'Black Square CHALLENGE — Order, Increase, Bold, Congested, Tension, Playful', ref: 'L02 · Express · S4' },
        { t: 'p', text: 'لاحظ حاجة مهمة: السلايد عارضة **٤ حلول لكل كلمة**. يعني مفيش تكوين واحد صح. نفس الإحساس يتقال بأكتر من طريقة، وده اللي هتعمله في السكشن بالـ <en>2 trials</en>.' },
        { t: 'art', html: `<div class="exp-words">${LECTURE_WORDS.map(w => wordCard(w, 0, `<p>${READ[w]}</p>`)).join('')}</div>`, caption: 'تكوينات أصلية بنفس قواعد تحدي المحاضرة: مربعات سودا بس جوه بوكس.' },
        { t: 'demo', id: 'exp-six', title: 'كل كلمة بمحاولتين', caption: 'نفس الكلمة ممكن تتقال بأكتر من طريقة. شوف المحاولتين، واقرا إزاي كل واحدة بتقول الكلمة.', mount(el, api) {
          const seen = new Set(); let cur = 'Order';
          el.innerHTML = `<div class="exp-six"><div class="exp-six__tabs" role="group" aria-label="الكلمة">${LECTURE_WORDS.map(w => `<button type="button" class="btn btn--sm" data-w="${w}" aria-pressed="false">${w}</button>`).join('')}</div><div class="exp-six__pages"></div><p class="exp-six__why" aria-live="polite"></p></div>`;
          const draw = w => {
            cur = w; seen.add(w);
            el.querySelector('.exp-six__pages').innerHTML = [0, 1].map(t => `<figure>${sqPage(w, t)}<figcaption dir="ltr">Trial ${t + 1} · ${SQ[w].trials[t].note}</figcaption></figure>`).join('');
            el.querySelector('.exp-six__why').innerHTML = `<b dir="ltr">${w}</b> · ${AR[w]} — ${READ[w]}`;
            el.querySelectorAll('[data-w]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.w === w)));
            if (live) api.scene('sq:' + w);
            if (seen.size === 6) api.award(5, { from: el.querySelector('.exp-six__pages'), key: 'demo:exp-six' });
          };
          el.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => { api.sfx('pop'); draw(b.dataset.w); }));
          let live = false; draw('Order'); live = true; seen.clear(); seen.add('Order');
        } },
        { t: 'why', text: 'المخ بيقرا **العلاقات** بين العناصر قبل العناصر نفسها: المسافة، والحجم، والاتجاه، والتكرار. مربعين قربوا يلمسوا بعض = توتر. مربعات كتير ملزوقة = زحمة. نفس المربع، بس العلاقة اتغيرت.' },
        { t: 'trap', text: 'كلمات **المحاضرة** ٦ وبس: <en>Order, Increase, Bold, Congested, Tension, Playful</en>. أما <en>Dominance, Chaos, Harmony…</en> فدي من ليستة **السكشن** (١٥ كلمة). الامتحان بيحب يخلطهم.', wrong: 'Lecture words: Dominance, Chaos, Harmony', right: 'Lecture words: Order, Increase, Bold, Congested, Tension, Playful' },
        { t: 'tip', text: 'نظام · زيادة · جرأة · زحمة · توتر · مرح = Order · Increase · Bold · Congested · Tension · Playful.' },
        { t: 'check', q: 'ex07' },
        { t: 'check', q: 'ex14' },
        { t: 'check', q: 'ex17' },
        { t: 'check', q: 'ex19' }
      ]
    },
    /* ------------------------------------------------------------ 4 */
    {
      id: 'exp-rules', title: 'قواعد السكشن', en: 'Section works', ref: 'L02 · Express · slide 5', scene: 'sq:Dominance',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'دلوقتي دورك. السكشن ليه قواعد بأرقام. والامتحان بيحب الأرقام دي جدًا.' },
        { t: 'quote', text: 'You will now replicate this assignment using new words to express. You can choose 3 words from this list (with 2 trails for each word).', ref: 'L02 · Express · S5' },
        { t: 'art', html: `<div class="exp-list" dir="ltr">${SECTION_WORDS.map(w => `<span><b>${w.toUpperCase()}</b><small dir="rtl">${AR[w]}</small></span>`).join('')}</div>`, caption: 'الـ ١٥ كلمة بتوع السكشن. هتختار منهم ٣.' },
        { t: 'quote', text: 'Create a NEW document in illustrator, Square (15*15 cm) 6 Pages. In each page Create box with no FILL and a 1 pt black STROKE; boxes should be non filled. You can ONLY USE LINES & SQUARES as many as you like. You may play with COLOR, SIZE, OPACITY, POSITION, ORIENTATION, & REPETITION of each element.', ref: 'L02 · Express · S5' },
        { t: 'list', style: 'num', items: ['دوكيومنت جديد على <en>Illustrator</en>: **مربع ١٥ × ١٥ سم**، و**٦ صفحات**.', 'في كل صفحة: بوكس **من غير <en>Fill</en>** وبـ **<en>Stroke</en> أسود <en>1 pt</en>**. البوكس مايتملاش.', 'مسموح **خطوط ومربعات بس** <en>LINES & SQUARES</en>، وبأي عدد.', 'تقدر تلعب في ٦ حاجات بس: **اللون، والحجم، والشفافية، والمكان، والاتجاه، والتكرار**.', 'تختار **٣ كلمات**، ولكل كلمة **محاولتين**. السلايد كاتبة <en>trails</en>، والمقصود <en>trials</en> يعني محاولات.'] },
        { t: 'art', html: pagesDiagram, caption: 'ليه ٦ صفحات؟ ٣ كلمات × محاولتين = ٦. الرقمين مربوطين ببعض.' },
        { t: 'demo', id: 'exp-pages', title: 'اختار كلماتك التلاتة', caption: 'دي فكرة عن شكل الـ ٦ صفحات بتوعك. المحاولة التانية لازم تكون فكرة مختلفة، مش نفس التكوين متكرر.', mount(el, api) {
          let picks = ['Rage', 'Tranquility', 'Fluidity'];
          el.innerHTML = `<div class="exp-pk"><div class="exp-pk__words" role="group" aria-label="الكلمات">${SECTION_WORDS.map(w => `<button type="button" class="btn btn--sm" data-w="${w}" aria-pressed="false">${w}</button>`).join('')}</div><p class="exp-pk__hint"></p><div class="exp-pk__doc"></div></div>`;
          const draw = () => {
            el.querySelectorAll('[data-w]').forEach(b => b.setAttribute('aria-pressed', String(picks.includes(b.dataset.w))));
            el.querySelector('.exp-pk__hint').innerHTML = picks.length < 3 ? `اختار <span class="hud-num">${3 - picks.length}</span> كمان.` : 'تمام: ٣ كلمات × محاولتين = ٦ صفحات.';
            el.querySelector('.exp-pk__doc').innerHTML = picks.map((w, i) => `<div class="exp-pk__w"><span dir="ltr">Word ${i + 1} · ${w}</span>${[0, 1].map(t => `<figure>${sqPage(w, t)}<figcaption dir="ltr">trial ${t + 1}</figcaption></figure>`).join('')}</div>`).join('');
          };
          el.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => {
            const w = b.dataset.w; api.sfx('pop');
            if (picks.includes(w)) picks = picks.filter(x => x !== w); else { if (picks.length >= 3) picks.shift(); picks.push(w); }
            draw(); if (picks.length === 3) { api.scene('sq:' + w); api.award(5, { from: el.querySelector('.exp-pk__doc'), key: 'demo:exp-pages' }); }
          }));
          draw();
        } },
        { t: 'example', title: 'لو اخترت RAGE', text: 'الصفحة ١: خطوط رأسية حادة وأحمر. الصفحة ٢: انفجار مربعات مايلة من نقطة واحدة. نفس الكلمة، فكرتين مختلفتين. ده معنى <en>2 trials</en>.' },
        { t: 'why', text: 'التحدي بيقفل عليك الأدوات عمدًا. لما متقدرش تستخدم صورة ولا كلمة ولا أي شكل غير المربع والخط، مخك يركز على الأقوى: **العلاقات** بين العناصر.' },
        { t: 'trap', text: 'تلات فخاخ بتتكرر: (١) البوكس **من غير <en>Fill</en>** وبـ **<en>1 pt</en>**، مش مربع أسود مليان. (٢) **خطوط ومربعات بس**، مفيش دواير ولا مثلثات. (٣) الـ <en>Typeface</en> **مش** من المتغيرات الستة.', wrong: 'Variables: color, size, opacity, typeface, texture, perspective', right: 'Variables: color, size, opacity, position, orientation, repetition' },
        { t: 'tip', text: '١٥ × ١٥ سم · ٦ صفحات · ٣ كلمات × ٢ محاولة · خطوط ومربعات بس · بوكس <en>No Fill + 1 pt</en> · ٦ متغيرات: لون، حجم، شفافية، مكان، اتجاه، تكرار.' },
        { t: 'check', q: 'ex08' },
        { t: 'check', q: 'ex09' },
        { t: 'check', q: 'ex10' },
        { t: 'check', q: 'ex11' },
        { t: 'check', q: 'ex12' },
        { t: 'check', q: 'ex13' },
        { t: 'check', q: 'ex22' }
      ]
    },
    /* ------------------------------------------------------------ 5 */
    {
      id: 'exp-translate', title: 'من إحساس لتكوين', en: 'Turning a feeling into squares and lines', ref: 'L02 · Express + Psychology of Design', scene: 'sq:Tranquility',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'أصعب حتة: تبص على كلمة زي <en>Melancholy</en> وتسأل نفسك: هو المربع الحزين شكله إيه؟ الإجابة في المحاضرة نفسها.' },
        { t: 'list', style: 'num', items: ['**حسّ الكلمة بجسمك**: تقيلة ولا خفيفة؟ سريعة ولا ساكنة؟ زحمة ولا وحيدة؟', '**ترجمها لعلاقات**: مسافة، وحجم، واتجاه، وتكرار.', '**ارجع لسيكولوجية التصميم** في نفس المحاضرة: المساحة المفتوحة بتهدّي، والزحمة بتوتّر، والأحمر طاقة واستعجال وخطر، والمربع ثبات ونظام، والمثلث توتر وأحيانًا عدوانية.'] },
        { t: 'quote', text: 'Psychologically, space affects mood. Open, airy designs can feel calm and inviting, while dense, compact layouts may feel intense or urgent.', ref: 'L02 · Psychology of Design · Space' },
        { t: 'table', head: ['المتغير', 'بيقول إيه؟', 'مثال'], rows: [
          ['اللون <en>Color</en>', 'مربع أحمر وسط الأسود = طاقة أو غضب أو مفاجأة.', '<en>Rage</en>، <en>Surprise</en>'],
          ['الحجم <en>Size</en>', 'واحد ضخم = سيطرة. مقاسات بتكبر = زيادة.', '<en>Dominance</en>، <en>Increase</en>'],
          ['الشفافية <en>Opacity</en>', 'عناصر بتبهت = حاجة بتختفي أو حزن.', '<en>Melancholy</en>'],
          ['المكان <en>Position</en>', 'قرب الحافة = توتر. برّا المجموعة = عزلة.', '<en>Tension</en>، <en>Alienated</en>'],
          ['الاتجاه <en>Orientation</en>', 'مايل = حركة ولعب أو فوضى. مستقيم ونايم = ثبات وهدوء.', '<en>Playful</en>، <en>Tranquility</en>'],
          ['التكرار <en>Repetition</en>', 'شبكة منتظمة = نظام. نظام متكسر = عدم انتظام.', '<en>Order</en>، <en>Disorder</en>']
        ] },
        { t: 'compare', left: { title: 'هدوء', en: 'Tranquility', text: 'خط أفقي طويل، ومربعات صغيرة مرتاحة عليه، وفراغ كتير.', art: sqPage('Tranquility', 0) }, right: { title: 'غضب', en: 'Rage', text: 'خطوط رأسية حادة، ومربعات مايلة، وأحمر.', art: sqPage('Rage', 0) }, note: 'الفرق كله في المساحة والاتجاه واللون: فراغ وخط نايم مرتاح، قصاد خطوط واقفة وزوايا حادة وأحمر.' },
        { t: 'compare', left: { title: 'نظام', en: 'Order', text: 'نفس المقاس، ونفس المسافة، ومحاذاة واحدة.', art: sqPage('Order', 0) }, right: { title: 'عدم انتظام', en: 'Disorder', text: 'نفس الشبكة… بس واحد زحلق وواحد اختفى.', art: sqPage('Disorder', 0) }, note: 'الـ Disorder محتاج نظام باين الأول عشان كسرته تبان.' },
        { t: 'art', html: `<div class="exp-words exp-words--sm">${SECTION_WORDS.map(w => wordCard(w, 0)).join('')}</div>`, caption: 'معرض الـ ١٥ كلمة. كل واحدة محاولة واحدة من اتنين.' },
        { t: 'demo', id: 'exp-sandbox', title: 'الصندوق الأسود بتاعك', caption: 'العب بالمتغيرات، وشوف التكوين بيقول إيه. القراية تحت تخمين تقريبي، مش حكم نهائي.', mount(el, api) {
          let base = 7, seed = 7; const st = { n: 9, size: 18, tr: 0, rot: 0, lay: 'grid', red: false, lines: 'none' }; let moves = 0;
          const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
          el.innerHTML = `<div class="exp-sb"><div class="exp-sb__page"></div><div class="exp-sb__ctl">
            <label>العدد <input type="range" min="1" max="30" value="9" data-k="n"></label>
            <label>الحجم <input type="range" min="6" max="90" value="18" data-k="size"></label>
            <label>الشفافية <input type="range" min="0" max="85" value="0" data-k="tr"></label>
            <label>الميلان <input type="range" min="0" max="45" value="0" data-k="rot"></label>
            <div class="exp-sb__g" data-g="lay"><span>الترتيب</span>${[['grid', 'شبكة'], ['row', 'صف أفقي'], ['grow', 'بيكبر'], ['corner', 'في الركن'], ['scatter', 'عشوائي']].map(([k, a]) => `<button type="button" class="btn btn--sm" data-v="${k}">${a}</button>`).join('')}</div>
            <div class="exp-sb__g" data-g="lines"><span>خطوط</span>${[['none', 'من غير'], ['h', 'أفقية'], ['v', 'رأسية']].map(([k, a]) => `<button type="button" class="btn btn--sm" data-v="${k}">${a}</button>`).join('')}</div>
            <div class="exp-sb__g"><span>لون</span><button type="button" class="btn btn--sm" data-red>مربع أحمر</button><button type="button" class="btn btn--sm" data-shuffle>رجّ</button></div>
          </div><p class="exp-sb__read" aria-live="polite"></p></div>`;
          const build = () => {
            seed = base; const items = []; const { n, size: s, tr, rot, lay } = st; const o = 1 - tr / 100;
            const R = () => (rnd() * 2 - 1) * rot;
            if (lay === 'grid') { const c = Math.ceil(Math.sqrt(n)); const gap = 150 / c; for (let k = 0; k < n; k++) { const x = (k % c) * gap + gap / 2, y = Math.floor(k / c) * gap + gap / 2; items.push({ t: 's', x: x - s / 2, y: y - s / 2, s, r: R(), o }); } }
            if (lay === 'row') { const gap = 150 / (n + 1); for (let k = 0; k < n; k++) items.push({ t: 's', x: gap * (k + 1) - s / 2, y: 92 - s, s, r: R(), o }); items.push({ t: 'l', x1: 8, y1: 92, x2: 142, y2: 92, w: 1.2 }); }
            if (lay === 'grow') { let x = 8; for (let k = 0; k < n && x < 146; k++) { const sz = Math.max(3, s * (k + 1) / n); items.push({ t: 's', x, y: 132 - sz, s: sz, r: R(), o }); x += sz + 3; } }
            if (lay === 'corner') { for (let k = 0; k < n; k++) items.push({ t: 's', x: 150 - s - rnd() * 40, y: 150 - s - rnd() * 40, s: s * (.6 + rnd() * .5), r: R(), o }); }
            if (lay === 'scatter') { for (let k = 0; k < n; k++) { const sz = s * (.4 + rnd() * 1.1); items.push({ t: 's', x: rnd() * (150 - sz), y: rnd() * (150 - sz), s: sz, r: R() + (rnd() - .5) * 20, o }); } }
            if (st.lines === 'h') for (let k = 0; k < 4; k++) { const y = 24 + k * 34; items.unshift({ t: 'l', x1: 6, y1: y, x2: 144, y2: y, w: .9, o: .7 }); }
            if (st.lines === 'v') for (let k = 0; k < 6; k++) { const x = 14 + k * 24; items.unshift({ t: 'l', x1: x, y1: 6, x2: x + (rnd() - .5) * 8, y2: 144, w: 2.4 }); }
            if (st.red && items.some(i => i.t === 's')) { const sq = items.filter(i => i.t === 's'); sq[Math.floor(sq.length / 2)].c = 'r'; }
            return items;
          };
          const guess = () => {
            const { n, size: s, tr, rot, lay, lines, red } = st; const g = [];
            if (lines === 'v' && (rot > 15 || red)) g.push('Rage');
            if (lines === 'h' && n <= 6 && s <= 24 && rot < 8) g.push('Tranquility');
            if (lay === 'grid' && rot < 4 && tr < 20) g.push(red ? 'Surprise' : 'Order');
            if (lay === 'grid' && rot >= 4 && rot < 20) g.push('Disorder');
            if (lay === 'grow') g.push(rot > 10 ? 'Upbeat' : 'Increase');
            if (lay === 'corner' && n >= 8) g.push('Congested');
            if (lay === 'corner' && n <= 2) g.push('Alienated');
            if (lay === 'scatter' && (rot > 25 || n > 16)) g.push('Chaos');
            if (lay === 'scatter' && rot <= 25 && s < 20 && n <= 12) g.push('Playful');
            if (n === 1 && s > 70) g.push('Bold');
            if (tr > 50) g.push('Melancholy');
            if (lay === 'row' && rot < 6) g.push(n <= 4 ? 'Stability' : 'Harmony');
            return [...new Set(g)].slice(0, 2);
          };
          const draw = () => {
            el.querySelector('.exp-sb__page').innerHTML = pageSVG(build(), { label: 'Your composition of squares and lines' });
            el.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === st[g.dataset.g]))));
            el.querySelector('[data-red]').setAttribute('aria-pressed', String(st.red));
            const g = guess();
            el.querySelector('.exp-sb__read').innerHTML = g.length ? `التكوين ده شبه: ${g.map(w => `<b dir="ltr">${w}</b> (${AR[w]})`).join(' أو ')}` : 'لسه مش واضح بيقول إيه. غيّر حاجة كمان.';
            if (++moves >= 6) api.award(5, { from: el.querySelector('.exp-sb__page'), key: 'demo:exp-sandbox' });
          };
          el.querySelectorAll('input[type=range]').forEach(i => i.addEventListener('input', () => { st[i.dataset.k] = +i.value; draw(); }));
          el.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { st[g.dataset.g] = b.dataset.v; api.sfx('pop'); draw(); })));
          el.querySelector('[data-red]').addEventListener('click', () => { st.red = !st.red; api.sfx('pop'); draw(); });
          el.querySelector('[data-shuffle]').addEventListener('click', () => { base = Math.floor(Math.random() * 1e6) + 1; api.sfx('flip'); draw(); });
          moves = -1; draw();
        } },
        { t: 'why', text: 'إنت مش بتخترع قواعد جديدة. سلايدات سيكولوجية التصميم قالتها: المساحة المفتوحة بتحسّس بالهدوء، والتصميم الزحمة بيحسّس باستعجال وفوضى، والأحمر طاقة واستعجال وخطر، والمربع ثبات ونظام، والمثلث توتر. إنت بس بتحط الكلام ده جوه بوكس ١٥ سم.' },
        { t: 'trap', text: 'أسئلة السيناريو بتختبر الربط ده. <en>TRANQUILITY</en> = مربعات صغيرة قليلة على خط أفقي طويل، وفراغ كتير. <en>RAGE</en> = خطوط رأسية حادة، ومربعات مايلة، وأحمر. لو لقيت اختيار فيه "زحمة" لـ <en>Tranquility</en>، شيله.', wrong: 'Tranquility: many crowded red squares with sharp vertical lines', right: 'Tranquility: a few small squares resting on a long horizontal line, with lots of empty space' },
        { t: 'tip', text: 'هادي = أفقي + فراغ. غضب = رأسي + ميلان + أحمر. نظام = نفس المقاس ونفس المسافة. فوضى = مفيش قاعدة.' },
        { t: 'check', q: 'ex20' },
        { t: 'check', q: 'ex21' }
      ]
    }
  ]
};
