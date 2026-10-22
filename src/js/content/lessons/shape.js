// Lecture 02 — The psychology of shapes: informed use, shapes → emotions, lines, and the nine shape personalities.
const C = { fg: '#EDEBE6', dim: '#7E7C8B', faint: '#3A3946', ink: '#101018', red: '#FF4A2E', ultra: '#4D6BFF', sun: '#FFC21A', ice: '#7FE7FF', violet: '#8B7BFF', pink: '#FF3E8A', good: '#46E3A0' };
const svg = (vb, inner, label = '') => `<svg viewBox="${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${label}">${inner}</svg>`;
const tx = (x, y, s, { fill = C.dim, size = 13, anchor = 'middle', font = 'IBM Plex Sans Arabic', weight = 400, extra = '' } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${fill}" ${extra}>${s}</text>`;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const starD = (cx, cy, R, r, n = 5) => Array.from({ length: n * 2 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R; return (i ? 'L' : 'M') + (cx + Math.cos(a) * d).toFixed(1) + ' ' + (cy + Math.sin(a) * d).toFixed(1); }).join('') + 'Z';
const polyD = (cx, cy, R, n, jit = 0, seed = 1) => { let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; return Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / n, d = R * (1 + (rnd() - .5) * jit); return (i ? 'L' : 'M') + (cx + Math.cos(a) * d).toFixed(1) + ' ' + (cy + Math.sin(a) * d).toFixed(1); }).join('') + 'Z'; };

/* line glyphs for the nine personalities (48 × 48, currentColor) */
const G = s => svg('0 0 48 48', `<g stroke="currentColor" stroke-width="1.6">${s}</g>`);
export const SHAPE_GLYPH = {
  circle: G('<circle cx="24" cy="24" r="16"/>'),
  square: G('<rect x="8" y="8" width="32" height="32"/>'),
  triangle: G('<path d="M24 7l17 33H7z"/>'),
  triangleDown: G('<path d="M24 41L41 8H7z"/>'),
  star: G(`<path d="${starD(24, 25, 18, 7.5)}"/>`),
  polygon: G(`<path d="${polyD(24, 24, 17, 6)}"/>`),
  organic: G('<path d="M26 8c9 0 15 6 14 14-1 6-5 7-4 12s-6 7-12 6-7 0-12-3-5-8-3-13-2-8 3-12 7-4 14-4z"/>'),
  lines: G('<path d="M6 16h24M6 24h30M6 32h24"/><path d="M34 18l6 6-6 6"/>'),
  ellipse: G('<ellipse cx="24" cy="24" rx="19" ry="11"/>'),
  combo: G('<circle cx="17" cy="28" r="10"/><rect x="21" y="9" width="18" height="18"/><path d="M33 30l8 12H25z"/>')
};
/* the slide's nine cards (slides 10–12), exact wording */
export const SHAPE_CARDS = [
  { k: 'circle', ar: 'الدايرة', en: 'Circle', color: C.ultra, sym: 'Unity, infinity, wholeness, protection.', eff: 'Feels soft, safe, and inclusive.', use: 'Buttons in UI design, logos (e.g., Pepsi), social icons.', tip: 'Use circles to create a sense of harmony or friendliness.', arS: 'وحدة، لانهاية، اكتمال، حماية', arE: 'ناعمة وآمنة وبتحتوي' },
  { k: 'square', ar: 'المربع والمستطيل', en: 'Square / Rectangle', color: C.red, sym: 'Stability, reliability, structure, honesty.', eff: 'Feels solid, grounded, and trustworthy.', use: 'Layouts, grids, containers, corporate logos.', tip: 'Use squares to convey professionalism and order.', arS: 'ثبات، اعتمادية، نظام، صدق', arE: 'متين ومتأسس وموثوق' },
  { k: 'triangle', ar: 'المثلث', en: 'Triangle', color: C.sun, sym: 'Direction, movement, tension, power.', eff: 'Feels dynamic, energetic, and sometimes aggressive.', use: 'Play buttons, warning signs, arrows.', tip: 'Use upward triangles for growth, downward for danger or grounding.', arS: 'اتجاه، حركة، توتر، قوة', arE: 'ديناميكي ونشيط، وساعات عدواني' },
  { k: 'star', ar: 'النجمة', en: 'Star', color: C.sun, sym: 'Achievement, excellence, aspiration.', eff: 'Feels celebratory and attention-grabbing.', use: 'Ratings, awards, festive designs.', tip: 'Use sparingly to highlight key elements or achievements.', arS: 'إنجاز، تميّز، طموح', arE: 'احتفالية وبتشد الانتباه' },
  { k: 'polygon', ar: 'المضلّع والأشكال المجردة', en: 'Polygon / Abstract', color: C.violet, sym: 'Depends on the number of sides and symmetry.', eff: 'Can feel modern, edgy, or chaotic.', use: 'Backgrounds, branding for tech or creative industries.', tip: 'Use to break monotony or add visual interest.', arS: 'حسب عدد الأضلاع والتماثل', arE: 'مودرن أو حاد أو فوضوي' },
  { k: 'organic', ar: 'الأشكال العضوية الحرة', en: 'Organic / Freeform', color: C.good, sym: 'Nature, creativity, spontaneity.', eff: 'Feels relaxed, artistic, and human.', use: 'Illustrations, art-based branding, wellness products.', tip: 'Use to soften rigid layouts or evoke natural themes.', arS: 'طبيعة، إبداع، تلقائية', arE: 'مرتاحة وفنية وإنسانية' },
  { k: 'lines', ar: 'الخطوط والأسهم', en: 'Lines and Arrows', color: C.ice, sym: 'Direction, connection, emphasis.', eff: 'Guides the eye, creates flow.', use: 'Navigation, infographics, diagrams.', tip: 'Use arrows to lead users, lines to separate or connect elements.', arS: 'اتجاه، ربط، تأكيد', arE: 'بتوجّه العين وبتعمل flow' },
  { k: 'ellipse', ar: 'البيضاوي', en: 'Ellipse / Oval', color: C.pink, sym: 'Continuity, elegance, motion.', eff: 'Feels smooth and graceful.', use: 'Portrait frames, logo elements, buttons.', tip: 'Use to create a sense of movement or softness.', arS: 'استمرارية، أناقة، حركة', arE: 'ناعم ورشيق' },
  { k: 'combo', ar: 'تركيبات الأشكال', en: 'Geometric Combinations', color: C.fg, sym: 'Complexity, innovation, balance.', eff: 'Feels structured yet creative.', use: 'Modern branding, abstract art, tech interfaces.', tip: 'Combine shapes to tell layered stories or build visual metaphors.', arS: 'تعقيد، ابتكار، توازن', arE: 'منظّم بس مبدع' }
];
const CARD = Object.fromEntries(SHAPE_CARDS.map(c => [c.k, c]));
const cardBack = c => `<span class="shp-back"><b>${c.arS}</b><small dir="ltr">${c.sym}</small><b>${c.arE}</b><small dir="ltr">${c.eff}</small><small class="shp-back__tip" dir="ltr">Tip: ${c.tip}</small></span>`;
const cardTable = keys => ({ t: 'table', head: ['', ...keys.map(k => `${CARD[k].ar}<br><small dir="ltr">${CARD[k].en}</small>`)], rows: [['الرمزية <small dir="ltr">Symbolism</small>', ...keys.map(k => `<span dir="ltr">${CARD[k].sym}</span>`)], ['الإحساس <small dir="ltr">Psychological effect</small>', ...keys.map(k => `<span dir="ltr">${CARD[k].eff}</span>`)], ['الاستخدام <small dir="ltr">Common uses</small>', ...keys.map(k => `<span dir="ltr">${CARD[k].use}</span>`)], ['النصيحة <small dir="ltr">Design tip</small>', ...keys.map(k => `<span dir="ltr">${CARD[k].tip}</span>`)]] });
// three shapes side by side would be four columns, too wide for a phone: the overview keeps the two big rows; uses and tips live in each quote below
const overviewTable = keys => ({ t: 'table', head: ['', 'الرمزية <small dir="ltr">Symbolism</small>', 'الإحساس <small dir="ltr">Psychological effect</small>'], rows: keys.map(k => [`${CARD[k].ar}<br><small dir="ltr">${CARD[k].en}</small>`, `<span dir="ltr">${CARD[k].sym}</span>`, `<span dir="ltr">${CARD[k].eff}</span>`]) });

/* ---------- art ---------- */
const slide9Art = svg('0 0 600 220', `
  <g stroke="${C.red}" stroke-width="1.6"><rect x="40" y="40" width="70" height="70"/><rect x="58" y="58" width="70" height="70" opacity=".55"/><rect x="76" y="76" width="70" height="70" opacity=".3"/></g>
  <g stroke="${C.sun}" stroke-width="1.6"><path d="M300 34l58 112H242z"/><path d="M300 66l32 62h-64z" opacity=".45"/></g>
  <g stroke="${C.ice}" stroke-width="1.6"><path d="M470 34v112M494 34v112M518 34v112"/><path d="M450 64h96M450 88h96M450 112h96" opacity=".5"/></g>
  ${tx(93, 182, 'Square & Rectangle', { fill: C.fg, size: 14 })}${tx(93, 202, 'stability · consistency · balance', { size: 11.5 })}
  ${tx(300, 182, 'Triangles', { fill: C.fg, size: 14 })}${tx(300, 202, 'power · science · religious firms', { size: 11.5 })}
  ${tx(497, 182, 'Vertical & Horizontal', { fill: C.fg, size: 14 })}${tx(497, 202, 'aggression vs calm', { size: 11.5 })}`, 'مربعات ومثلث وخطوط رأسية وأفقية');

const triplets = { t: 'table', head: ['السلايد بيقول', 'التلاتة'], rows: [
  ['الشكل بيتعمل عشان', '<span dir="ltr">communicate meaning · guide perception · enhance user experience</span><br>يوصّل معنى · يوجّه الإدراك · يحسّن تجربة المستخدم'],
  ['لما تفهم الارتباطات، تقدر', '<span dir="ltr">reinforce brand identity · evoke emotion · direct attention</span><br>تقوّي هوية البراند · تحرّك إحساس · توجّه الانتباه'],
  ['الاستخدام الواعي بياخد في اعتباره', '<span dir="ltr">cultural context · audience expectations · design goals</span><br>الثقافة · توقعات الجمهور · أهداف التصميم'],
  ['لغة بصرية بتعدّي الكلام، فالتصميم يبقى', '<span dir="ltr">intuitive · memorable · emotionally resonant</span><br>مفهوم بديهي · بيتفكر · بيلمس الإحساس']
] };

const linesCompare = {
  t: 'compare',
  left: { title: 'خطوط رأسية', en: 'Vertical lines', art: svg('0 0 200 110', `<g stroke="${C.red}" stroke-width="2">${[30, 60, 90, 120, 150].map((x, i) => `<path d="M${x} ${12 + (i % 2) * 6}V${98 - (i % 3) * 4}"/>`).join('')}</g>`, 'خطوط رأسية'), text: 'مرتبطة بـ <en>masculinity, endurance, aggression</en>: رجولة، تحمّل، عدوانية. واقفة ومشدودة.' },
  right: { title: 'خطوط أفقية', en: 'Horizontal lines', art: svg('0 0 200 110', `<g stroke="${C.ice}" stroke-width="2">${[25, 45, 65, 85].map((y, i) => `<path d="M${20 + i * 4} ${y}H${180 - i * 4}" opacity="${1 - i * .15}"/>`).join('')}</g>`, 'خطوط أفقية'), text: 'بتصوّر <en>community, tranquility, calm</en>: مجتمع، سكينة، هدوء. نايمة ومرتاحة.' },
  note: 'نفس الخط بالظبط. الفرق الوحيد: الاتجاه.'
};
const triCompare = {
  t: 'compare',
  left: { title: 'مثلث لفوق', en: 'upward', art: svg('0 0 200 110', `<path d="M100 14l52 84H48z" stroke="${C.sun}" stroke-width="2"/><path d="M100 98V40M88 52l12-12 12 12" stroke="${C.good}" stroke-width="1.6"/>`, 'مثلث لفوق'), text: '<en>growth</en>: نمو وطلوع. السهم لفوق.' },
  right: { title: 'مثلث لتحت', en: 'downward', art: svg('0 0 200 110', `<path d="M100 98L48 14h104z" stroke="${C.red}" stroke-width="2"/><path d="M100 14v58M88 60l12 12 12-12" stroke="${C.red}" stroke-width="1.6" opacity=".7"/>`, 'مثلث لتحت'), text: '<en>danger or grounding</en>: خطر، أو تأريض وتثبيت في الأرض.' },
  note: 'الشكل واحد. اتجاهه هو اللي بيغيّر الجملة.'
};

/* ---------- lesson ---------- */
export default {
  zone: 'shape',
  hero: { say: '٩ أشكال، ولكل شكل شخصية وكلام. بعد المنطقة دي، عمرك ما هتشوف زرار مدوّر بنفس العين تاني.' },
  chapters: [
    {
      id: 'shape-informed', title: 'الشكل جملة، مش زينة', en: 'The informed use of graphic shapes', ref: 'Lecture 02 · slide 6', scene: 'solids',
      blocks: [
        { t: 'say', who: 'trio', text: 'المصمم المبتدئ بيحط دايرة عشان «شكلها حلو». المصمم الواعي بيحطها عشان عارف هي هتقول إيه.' },
        { t: 'p', text: 'المحاضرة بتسمّي ده <en>informed use of graphic shapes</en>: الاستخدام **الواعي** للأشكال. يعني الشكل جاي عن قصد وبخطة، مش بالصدفة.' },
        { t: 'quote', ref: 'L02 · S06', text: 'The informed use of graphic shapes refers to the intentional and strategic application of visual forms—such as circles, squares, triangles, and abstract shapes—to communicate meaning, guide perception, and enhance user experience.' },
        { t: 'quote', ref: 'L02 · S06', text: 'Shapes are not just decorative; they carry psychological and symbolic weight that influences how viewers interpret a design.' },
        { t: 'p', text: 'يعني كل شكل شايل **وزن نفسي** <en>psychological weight</en> و**وزن رمزي** <en>symbolic weight</en>. والوزن ده بيغيّر الطريقة اللي المشاهد بيفسّر بيها التصميم.' },
        { t: 'h', text: 'السلايد ده كله تلاتات', en: 'learn it in threes' },
        triplets,
        { t: 'tip', text: 'السلايد ده بيحب الأرقام التلاتة: أغلب الجمل فيها ٣ حاجات (ماعدا جملة الوزن: اتنين بس). لو السؤال «كمّل الفراغ»، عدّ التلاتة في دماغك.' },
        { t: 'example', title: 'المثلث العاكس ورا العربية', text: 'محدش بيقرا عليه حاجة، ومع ذلك كل السواقين بيفهموه: «خلّي بالك». ده شكل بيوصّل معنى (<en>communicate meaning</en>) ويوجّه الانتباه (<en>direct attention</en>) في نفس اللحظة.' },
        { t: 'why', text: 'المخ اتعلّم عبر سنين إن الحاجات المدورة غالبًا آمنة، والمدببة ممكن تعوّر، والمستقيمة ثابتة. فلما يشوف شكل، بيطلع إحساسه قبل ما يفكر.' },
        { t: 'trap', text: 'الامتحان ممكن يسألك «الاستخدام الواعي بياخد في اعتباره الثقافة، وتوقعات الجمهور، و______». الإجابة <en>design goals</en>.', wrong: 'cultural context, audience expectations, and decoration', right: 'cultural context, audience expectations, and design goals' },
        { t: 'check', q: 'mi12' },
        { t: 'quote', ref: 'L02 · S06', text: 'The power of graphic shapes lies in their ability to speak a visual language that transcends words, making design more intuitive, memorable, and emotionally resonant.' },
        { t: 'check', q: 'mi13' }
      ]
    },
    {
      id: 'shape-feel', title: 'كل شكل بيحرّك إحساس', en: 'Different shapes stimulate different emotions', ref: 'Lecture 02 · slides 8–9', scene: 'combo',
      blocks: [
        { t: 'say', who: 'trio', text: 'جملة واحدة في السلايد، بس هي أساس المنطقة كلها: كل شكل بيحرّك إحساس مختلف.' },
        { t: 'quote', ref: 'L02 · S08', text: 'Different shapes stimulate different emotions.' },
        { t: 'check', q: 'sh01' },
        { t: 'demo', id: 'shp-mood', title: 'بدّل الشكل، الإحساس يتبدّل', caption: 'نفس المساحة ونفس اللون تقريبًا. الشكل لوحده غيّر الكلام.', mount: mountMood },
        { t: 'h', text: 'السلايد التاسع: ٣ أفكار سريعة', en: 'squares · triangles · lines' },
        { t: 'art', html: slide9Art, caption: 'رسم أصلي بيلخّص السلايد التاسع' },
        { t: 'quote', ref: 'L02 · S09', text: 'Square & Rectangle — Straight edge shapes imply stability and consistency in a more concrete sense. These can also be used to indicate balance.' },
        { t: 'p', text: 'الحواف المستقيمة = **ثبات** و**اتساق**. وكمان ممكن تدّي إحساس **توازن** <en>balance</en>.' },
        { t: 'check', q: 'sh23' },
        { t: 'quote', ref: 'L02 · S09', text: 'Triangles — Triangles tend to be viewed as a symbol of power and science. Triangular shapes are also popular in religious firms.' },
        { t: 'p', text: 'المثلث رمز **قوة** و**علم**. وكمان منتشر في المؤسسات الدينية (<en>religious firms</en>). دي معلومة شكلها صغيرة، بس بتيجي في الامتحان.' },
        { t: 'example', title: 'شوف حواليك', text: 'شعارات كتير لشركات تكنولوجيا وهندسة فيها مثلثات. والقمم المدببة للمآذن وأبراج الكنايس، والأهرامات، بتحسسك بقوة وسمو. الشكل بيشتغل حتى لو ماحدش شرحه.' },
        { t: 'trap', text: 'المثلثات <en>power and science</en>، والمربعات <en>stability and consistency</en>. متبدّلهمش.', wrong: 'Triangles = stability and consistency', right: 'Triangles = power and science · popular in religious firms' },
        { t: 'check', q: 'sh24' }
      ]
    },
    {
      id: 'shape-lines', title: 'خط واقف، وخط نايم', en: 'Vertical vs horizontal lines', ref: 'Lecture 02 · slide 9', scene: 'vlines',
      blocks: [
        { t: 'say', who: 'line', text: 'خط واحد. لفّه ٩٠ درجة… والإحساس كله يتقلب.' },
        { t: 'quote', ref: 'L02 · S09', text: 'Horizontal & Vertical Lines — Vertical lines are associated with masculinity, endurance and aggression. Horizontal lines depict community, tranquility and calm.' },
        linesCompare,
        { t: 'demo', id: 'shp-lines', title: 'لفّ الخطوط', caption: 'العين بتقرا الاتجاه قبل أي حاجة: واقف = رجولة وتحمّل وعدوانية، نايم = مجتمع وسكينة وهدوء.', mount: mountLines },
        { t: 'example', title: 'البحر والأبراج', text: 'كورنيش إسكندرية: خط البحر أفقي، والإحساس سكينة. برج عالي في نص البلد: خطوط رأسية، والإحساس رجولة وتحمّل وعدوانية. نفس البلد، إحساسين.' },
        { t: 'why', text: 'الخط الأفقي شبه الأرض والجسم وهو مرتاح، فبنحس بهدوء. الخط الرأسي شبه راجل واقف ومشدود، فبنحس برجولة وتحمّل وعدوانية.' },
        { t: 'check', q: 'sh25' },
        { t: 'check', q: 'sh26' },
        { t: 'trap', text: 'لو السؤال عن بوستر **سبا** عايز يبان هادي، الإجابة خطوط **أفقية**. ولو عن تطبيق نوم أطفال مليان مثلثات حادة وخطوط رأسية، يبقى إحساسه ديناميكي وممكن عدواني، يعني غلط لتطبيق هادي.', wrong: 'Spa = vertical lines', right: 'Spa = horizontal lines (tranquility, calm)' },
        { t: 'check', q: 'sh27' },
        { t: 'tip', text: 'رأسي = راجل واقف في طابور (رجولة وتحمّل وعدوانية). أفقي = ناس قاعدة على الكورنيش (مجتمع وهدوء).' },
        { t: 'check', q: 'sh30' }
      ]
    },
    {
      id: 'shape-circle-square', title: 'الدايرة والمربع', en: 'Circle · Square / Rectangle', ref: 'Lecture 02 · slide 10', scene: 'circle',
      blocks: [
        { t: 'say', who: 'circle', text: 'الدايرة بتطمّنك. المربع بيدّيك ثقة. والاتنين بيشتغلوا عليك كل يوم من غير ما تاخد بالك.' },
        { t: 'p', text: 'كل شكل في المحاضرة ليه ٤ حاجات: **الرمزية** <en>Symbolism</en>، **الإحساس** <en>Psychological effect</en>، **الاستخدام** <en>Common uses</en>، و**النصيحة** <en>Design tip</en>. احفظ الأربعة لكل شكل.' },
        cardTable(['circle', 'square']),
        { t: 'h', text: 'الدايرة', en: 'Circle' },
        { t: 'quote', ref: 'L02 · S10', text: 'Circle — Symbolism: Unity, infinity, wholeness, protection. Psychological effect: Feels soft, safe, and inclusive.', ar: 'وحدة ولانهاية واكتمال وحماية. وإحساسها ناعم وآمن وبيحتوي الكل.' },
        { t: 'example', title: 'زراير وأيقونات', text: 'أيقونات التطبيقات على موبايلك، وزرار التسجيل في الكاميرا، والصور الشخصية في الشات: كلها دواير أو حوافها مدوّرة. عشان الإحساس آمن وودود.' },
        { t: 'check', q: 'sh02' },
        { t: 'check', q: 'sh03' },
        { t: 'trap', text: 'سؤال <en>NOT</en>: إيه اللي **مش** من استخدامات الدايرة؟ الاستخدامات: <en>Buttons in UI design, logos, social icons</en>. علامات التحذير بتاعة المثلث.', wrong: 'Circles → warning signs', right: 'Circles → buttons, logos, social icons' },
        { t: 'check', q: 'sh29' },
        { t: 'check', q: 'sh28' },
        { t: 'h', text: 'المربع والمستطيل', en: 'Square / Rectangle' },
        { t: 'quote', ref: 'L02 · S10', text: 'Square / Rectangle — Symbolism: Stability, reliability, structure, honesty. Psychological effect: Feels solid, grounded, and trustworthy.', ar: 'ثبات واعتمادية ونظام وصدق. وإحساسه متين ومتأسس وموثوق.' },
        { t: 'example', title: 'الجريد اللي انت عايش فيه', text: 'شبكة الصور في البروفايل، وجدول المحاضرات، وكارت البنك: كلهم مربعات ومستطيلات. والبنوك بتحب المربع لأنه بيقول «احنا ثابتين ومحترمين».' },
        { t: 'check', q: 'sh04' },
        { t: 'check', q: 'sh05' },
        { t: 'tip', text: 'الدايرة = حضن (أمان). المربع = بنك (ثقة ونظام).' }
      ]
    },
    {
      id: 'shape-triangle', title: 'المثلث: لفوق ولا لتحت؟', en: 'Triangle', ref: 'Lecture 02 · slide 10', scene: 'triangle',
      blocks: [
        { t: 'say', who: 'triangle', text: 'المثلث أكتر شكل عصبي في العيلة. دايمًا رايح في حتة. والسؤال بس: رايح فين؟' },
        cardTable(['triangle']),
        { t: 'quote', ref: 'L02 · S10', text: 'Triangle — Symbolism: Direction, movement, tension, power. Psychological effect: Feels dynamic, energetic, and sometimes aggressive. Common uses: Play buttons, warning signs, arrows.' },
        { t: 'p', text: 'المثلث فيه **اتجاه** و**حركة** و**توتر** و**قوة**. وإحساسه ديناميكي ونشيط، **وساعات عدواني** <en>sometimes aggressive</en>.' },
        { t: 'check', q: 'sh06' },
        { t: 'check', q: 'sh07' },
        { t: 'example', title: '٣ أماكن هتلاقي فيها المثلث النهارده', text: 'زرار الـ <en>Play</en> في أي فيديو. علامة التحذير على الطريق. والأسهم اللي بتقولك «اتجه من هنا».' },
        { t: 'check', q: 'sh10' },
        { t: 'h', text: 'النصيحة: الاتجاه هو كل حاجة', en: 'design tip' },
        { t: 'quote', ref: 'L02 · S10', text: 'Design tip: Use upward triangles for growth, downward for danger or grounding.' },
        triCompare,
        { t: 'demo', id: 'shp-tri', title: 'اقلب المثلث', caption: 'لفوق = نمو. لتحت = خطر أو تثبيت في الأرض.', mount: mountTri },
        { t: 'why', text: 'المثلث اللي رأسه لفوق شبه الجبل والسهم الطالع، فبنقراه طموح ونمو. اللي رأسه لتحت واقف على نقطة، فيا إما مش مستقر (خطر)، يا إما بيشدّ لتحت (<en>grounding</en>).' },
        { t: 'check', q: 'sh08' },
        { t: 'trap', text: 'كوتش تنمية بشرية عايز رمز للنمو؟ مثلث **لفوق**. متختارش «لتحت» عشان شكله مستقر.', wrong: 'Growth → downward triangle', right: 'Growth → upward triangle' },
        { t: 'check', q: 'sh09' }
      ]
    },
    {
      id: 'shape-rest', title: 'النجمة والمضلّع والشكل الحر', en: 'Star · Polygon / Abstract · Organic / Freeform', ref: 'Lecture 02 · slide 11', scene: 'star',
      blocks: [
        { t: 'say', who: 'star', text: 'التلاتة دول هما «الشخصيات الصعبة»: واحدة بتحب الأضواء، وواحد مزاجه حسب عدد أضلاعه، وواحد فنان مش بيحب القواعد.' },
        overviewTable(['star', 'polygon', 'organic']),
        { t: 'h', text: 'النجمة', en: 'Star' },
        { t: 'quote', ref: 'L02 · S11', text: 'Star — Symbolism: Achievement, excellence, aspiration. Psychological effect: Feels celebratory and attention-grabbing. Common uses: Ratings, awards, festive designs. Design tip: Use sparingly to highlight key elements or achievements.' },
        { t: 'example', title: 'تقييم المطعم', text: 'الـ ٥ نجوم في تقييم مطعم أو أوبر، وشارة «أفضل موظف»، وزينة رمضان والعيد. النجمة بتقول «ده مميز».' },
        { t: 'trap', text: 'النصيحة بتاعة النجمة: استخدمها **بقلة** <en>sparingly</en>. لو كل حاجة نجمة، ولا حاجة هتبقى مميزة.', wrong: 'Use stars generously everywhere', right: 'Use sparingly to highlight key elements or achievements' },
        { t: 'check', q: 'sh11' },
        { t: 'check', q: 'sh12' },
        { t: 'h', text: 'المضلّع والأشكال المجردة', en: 'Polygon / Abstract' },
        { t: 'quote', ref: 'L02 · S11', text: 'Polygon / Abstract Shapes — Symbolism: Depends on the number of sides and symmetry. Psychological effect: Can feel modern, edgy, or chaotic. Common uses: Backgrounds, branding for tech or creative industries. Design tip: Use to break monotony or add visual interest.' },
        { t: 'p', text: 'المضلّع ملوش معنى ثابت. معناه **بيعتمد على عدد الأضلاع والتماثل**. جرّب بنفسك:' },
        { t: 'demo', id: 'shp-sides', title: 'زوّد الأضلاع، وبوّظ التماثل', caption: 'إجابة الامتحان ثابتة: <en>depends on the number of sides and symmetry</en>. الكلام اللي تحت الشكل إحساس تقريبي عشان تفهم الفكرة.', mount: mountSides },
        { t: 'check', q: 'sh13' },
        { t: 'check', q: 'sh14' },
        { t: 'h', text: 'الأشكال العضوية الحرة', en: 'Organic / Freeform' },
        { t: 'quote', ref: 'L02 · S11', text: 'Organic / Freeform Shapes — Symbolism: Nature, creativity, spontaneity. Psychological effect: Feels relaxed, artistic, and human. Common uses: Illustrations, art-based branding, wellness products. Design tip: Use to soften rigid layouts or evoke natural themes.' },
        { t: 'example', title: 'براند منتجات طبيعية', text: 'عبوات صابون وزيوت طبيعية بتحب البقع والأشكال الحرة اللي شبه ورق الشجر والمية. الشكل بيقول «طبيعي ومرتاح»، وبيكسر قسوة الجريد.' },
        { t: 'check', q: 'sh15' },
        { t: 'check', q: 'sh16' },
        { t: 'tip', text: 'نجمة = تريند (إنجاز). مضلع = معناه حسب عدد أضلاعه وتماثله. شكل حر = فنان (طبيعة وإبداع).' }
      ]
    },
    {
      id: 'shape-flow', title: 'الخطوط، البيضاوي، والتركيبات', en: 'Lines & Arrows · Ellipse / Oval · Geometric Combinations', ref: 'Lecture 02 · slide 12', scene: 'arrow',
      blocks: [
        { t: 'say', who: 'line', text: 'آخر تلاتة في العيلة: واحد بيشاور، وواحد رشيق، وواحد عامل فريق من الكل.' },
        overviewTable(['lines', 'ellipse', 'combo']),
        { t: 'h', text: 'الخطوط والأسهم', en: 'Lines and Arrows' },
        { t: 'quote', ref: 'L02 · S12', text: 'Lines and Arrows — Symbolism: Direction, connection, emphasis. Psychological effect: Guides the eye, creates flow. Common uses: Navigation, infographics, diagrams. Design tip: Use arrows to lead users, lines to separate or connect elements.' },
        { t: 'example', title: 'خريطة المترو', text: 'الخطوط بتربط المحطات ببعض، والأسهم بتقولك الاتجاه. من غير ولا جملة، عينك ماشية في <en>flow</en> واضح.' },
        { t: 'check', q: 'sh17' },
        { t: 'check', q: 'sh18' },
        { t: 'h', text: 'البيضاوي', en: 'Ellipse / Oval' },
        { t: 'quote', ref: 'L02 · S12', text: 'Ellipse / Oval — Symbolism: Continuity, elegance, motion. Psychological effect: Feels smooth and graceful. Common uses: Portrait frames, logo elements, buttons. Design tip: Use to create a sense of movement or softness.' },
        { t: 'trap', text: 'براويز صور البورتريه = **بيضاوي**، مش دايرة. والدايرة هي اللي بتاعة <en>unity, infinity</en>.', wrong: 'Portrait frames → circle', right: 'Portrait frames → ellipse / oval' },
        { t: 'check', q: 'sh19' },
        { t: 'check', q: 'sh20' },
        { t: 'h', text: 'تركيبات الأشكال', en: 'Geometric Combinations' },
        { t: 'quote', ref: 'L02 · S12', text: 'Geometric Combinations — Symbolism: Complexity, innovation, balance. Psychological effect: Feels structured yet creative. Common uses: Modern branding, abstract art, tech interfaces. Design tip: Combine shapes to tell layered stories or build visual metaphors.' },
        { t: 'p', text: 'لما تجمع أشكال مع بعض، بتعمل جملة أطول. زي رمز بيجمع ناس وأماكن وحب في شكل واحد. ده اسمه <en>visual metaphor</en>: استعارة بصرية.' },
        { t: 'check', q: 'sh21' },
        { t: 'check', q: 'sh22' },
        { t: 'h', text: 'الكوتشينة كاملة: ٩ أشكال', en: 'the full deck' },
        { t: 'p', text: 'اقلب كل كارت. الوش عليه الشكل، والضهر عليه الرمزية والإحساس والنصيحة بكلام السلايد.' },
        { t: 'grid', cols: 3, flip: true, items: SHAPE_CARDS.map(c => ({ title: c.ar, en: c.en, text: cardBack(c), art: SHAPE_GLYPH[c.k], color: c.color })) },
        { t: 'trap', text: 'أشهر سؤال «غلط» في المنطقة دي: يركّب إحساس شكل على شكل تاني. «مرتاح وفني وإنساني» ده الشكل الحر، مش النجمة.', wrong: 'Star — feels relaxed, artistic, and human', right: 'Star — feels celebratory and attention-grabbing' },
        { t: 'check', q: 'sh31' },
        { t: 'tip', text: 'الخط بيشاور (اتجاه وربط). البيضاوي رشيق (برواز وحركة). التركيبة بتحكي قصة بطبقات.' }
      ]
    }
  ]
};

/* ---------- demos ---------- */
function mountMood(el, api) {
  const keys = ['circle', 'square', 'triangle', 'star', 'organic'];
  const scenes = { circle: 'circle', square: 'square', triangle: 'triangle', star: 'star', organic: 'organic' };
  let cur = -1; const seen = new Set();
  el.innerHTML = `<div class="shp-mood"><div class="shp-mood__fig" aria-hidden="true"></div><div class="shp-mood__side"><div class="shp-seg" role="radiogroup" aria-label="الشكل">${keys.map((k, i) => `<button type="button" role="radio" aria-checked="false" data-i="${i}">${CARD[k].ar.replace('الأشكال العضوية الحرة', 'الشكل الحر')}</button>`).join('')}</div><div class="shp-mood__read" aria-live="polite"><b></b><span></span><small dir="ltr"></small></div></div></div>`;
  const fig = el.querySelector('.shp-mood__fig'), read = el.querySelector('.shp-mood__read');
  const set = (i, user) => {
    if (i === cur) return; cur = i; const k = keys[i], c = CARD[k];
    fig.style.color = c.color; fig.innerHTML = SHAPE_GLYPH[k].replace('<svg', '<svg class="shp-draw"');
    el.querySelectorAll('.shp-seg button').forEach((b, j) => b.setAttribute('aria-checked', String(j === i)));
    read.querySelector('b').textContent = c.arE; read.querySelector('span').textContent = c.arS; read.querySelector('small').textContent = c.eff;
    if (!user) return;
    api.scene(scenes[k]); api.sfx('click'); seen.add(i);
    if (seen.size >= 4) api.award(5, { from: read, key: 'demo:shp-mood' });
  };
  el.querySelectorAll('.shp-seg button').forEach(b => b.addEventListener('click', () => set(+b.dataset.i, true)));
  set(0);
}
function mountLines(el, api) {
  let vertical = true;
  el.innerHTML = `<div class="shp-lines"><div class="shp-lines__fig">${svg('0 0 240 160', `<g class="shp-lines__g" stroke="currentColor" stroke-width="2.2">${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${60 + i * 20} 22V138" opacity="${.45 + (i % 3) * .2}"/>`).join('')}</g>`, 'خطوط بتلف')}</div><div class="shp-lines__side"><button type="button" class="btn btn--zone">لفّ ٩٠°</button><div class="shp-lines__read" aria-live="polite"><b></b><small dir="ltr"></small></div></div></div>`;
  const g = el.querySelector('.shp-lines__g'), read = el.querySelector('.shp-lines__read'), fig = el.querySelector('.shp-lines__fig');
  let turns = 0;
  const paint = user => {
    g.style.transform = vertical ? 'rotate(0deg)' : 'rotate(90deg)';
    fig.style.color = vertical ? C.red : C.ice;
    read.querySelector('b').textContent = vertical ? 'رجولة، تحمّل، عدوانية' : 'مجتمع، سكينة، هدوء';
    read.querySelector('small').textContent = vertical ? 'Vertical: masculinity, endurance, aggression' : 'Horizontal: community, tranquility, calm';
    if (user) api.scene(vertical ? 'vlines' : 'hlines');
  };
  el.querySelector('button').addEventListener('click', e => { vertical = !vertical; turns++; paint(true); api.sfx('swoosh'); if (turns >= 2) api.award(5, { from: e.currentTarget, key: 'demo:shp-lines' }); });
  paint();
}
function mountTri(el, api) {
  let up = true, flips = 0;
  el.innerHTML = `<div class="shp-lines"><div class="shp-lines__fig shp-tri__fig">${svg('0 0 240 160', `<g class="shp-tri__g" stroke="currentColor" stroke-width="2.2"><path d="M120 22l62 112H58z"/></g>`, 'مثلث بيتقلب')}</div><div class="shp-lines__side"><button type="button" class="btn btn--zone">اقلب المثلث</button><div class="shp-lines__read" aria-live="polite"><b></b><small dir="ltr"></small></div></div></div>`;
  const g = el.querySelector('.shp-tri__g'), read = el.querySelector('.shp-lines__read'), fig = el.querySelector('.shp-tri__fig');
  const paint = user => {
    g.style.transform = up ? 'rotate(0deg)' : 'rotate(180deg)'; fig.style.color = up ? C.sun : C.red;
    read.querySelector('b').textContent = up ? 'نمو وطلوع' : 'خطر… أو تثبيت في الأرض';
    read.querySelector('small').textContent = up ? 'Upward triangles for growth' : 'Downward for danger or grounding';
    if (user) api.scene(up ? 'triangle' : 'triangleDown');
  };
  el.querySelector('button').addEventListener('click', e => { up = !up; flips++; paint(true); api.sfx('flip'); if (flips >= 2) api.award(5, { from: e.currentTarget, key: 'demo:shp-tri' }); });
  paint();
}
function mountSides(el, api) {
  let n = 6, sym = true, moved = 0;
  el.innerHTML = `<div class="shp-sides"><div class="shp-sides__fig">${svg('0 0 200 200', '<path class="shp-sides__p" stroke="currentColor" stroke-width="2"/>', 'مضلع بعدد أضلاع متغير')}</div><div class="shp-sides__side"><label class="shp-range"><span class="label">عدد الأضلاع</span><span class="hud-num shp-sides__n">6</span><input type="range" min="3" max="12" value="6" aria-label="عدد الأضلاع"></label><button type="button" class="btn btn--sm" aria-pressed="false">بوّظ التماثل</button><div class="shp-lines__read" aria-live="polite"><b></b><small></small></div></div></div>`;
  const p = el.querySelector('.shp-sides__p'), range = el.querySelector('input'), btn = el.querySelector('button'), read = el.querySelector('.shp-lines__read');
  const feel = () => !sym ? ['فوضوي ومتوتر', 'التماثل راح، فالإحساس بقى <en>chaotic</en>.'] : n === 3 ? ['حاد ومتحرك', 'قرّب من شخصية المثلث.'] : n === 4 ? ['ثابت ومنظم', 'قرّب من شخصية المربع.'] : n <= 6 ? ['مودرن ومتوازن', 'إحساس تقني نضيف.'] : n <= 9 ? ['حاد ومودرن', 'زوايا كتير، بس لسه منظم.'] : ['ناعم، قرّب للدايرة', 'كل ما الأضلاع تزيد، الشكل بيقرّب من الدايرة.'];
  const paint = () => {
    p.setAttribute('d', polyD(100, 104, 74, n, sym ? 0 : .5, n * 7 + 3)); el.querySelector('.shp-sides__n').textContent = n;
    const [a, b] = feel(); read.querySelector('b').textContent = a; read.querySelector('small').innerHTML = api.rich(b);
    btn.setAttribute('aria-pressed', String(!sym)); btn.textContent = sym ? 'بوّظ التماثل' : 'رجّع التماثل';
  };
  range.addEventListener('input', () => { n = +range.value; moved++; paint(); if (moved === 1) api.scene('polygon'); if (moved > 4) api.award(5, { from: range, key: 'demo:shp-sides' }); });
  btn.addEventListener('click', () => { sym = !sym; paint(); api.sfx('click'); api.scene(sym ? 'polygon' : 'organic'); });
  paint();
}
