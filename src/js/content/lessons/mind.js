// Lecture 02 — The viewer's mind: how great designs play with the psychology of viewers, different minds,
// the four levers, and the logo discussion. Voice: a sharp friend, Egyptian Arabic, short sentences.
const C = { fg: '#EDEBE6', dim: '#7E7C8B', faint: '#3A3946', ink: '#101018', zc: '#8B7BFF', red: '#FF4A2E', ultra: '#4D6BFF', sun: '#FFC21A', ice: '#7FE7FF', pink: '#FF3E8A', good: '#46E3A0' };
const svg = (vb, inner, label = '') => `<svg viewBox="${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${label}">${inner}</svg>`;
const tx = (x, y, s, { fill = C.dim, size = 13, anchor = 'middle', font = 'IBM Plex Sans Arabic', weight = 400, extra = '' } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${fill}" ${extra}>${s}</text>`;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- "first glance": a poster where one element owns the hierarchy ---------- */
export const GLANCE_PARTS = [
  { k: 'headline', ar: 'العنوان', en: 'Headline' },
  { k: 'image', ar: 'الصورة', en: 'Image' },
  { k: 'price', ar: 'الخصم', en: 'Price tag' },
  { k: 'button', ar: 'الزرار', en: 'Button' }
];
// three poster templates; every focal version fits the 320×220 frame and clears the dim parts of its template
const SLOTS = [
  { headline: [160, 50], image: [160, 120], price: [246, 118], button: [160, 188], folio: [22, 210] },
  { headline: [236, 44], image: [92, 128], price: [236, 104], button: [236, 168], folio: [22, 210] },
  { headline: [160, 176], image: [236, 72], price: [96, 70], button: [100, 128], folio: [22, 20] }
];
/** returns an SVG poster; `focal` is drawn big and bright, the rest small and dim */
export function glanceLayout(focal = 'headline', t = 0, accent = C.zc) {
  const P = SLOTS[t % SLOTS.length]; const on = k => k === focal;
  const part = {
    // the big headline is ~240 units wide, so it always sits on the centre line of its row
    headline: ([x, y]) => on('headline') ? tx(160, y + 11, 'عرض النهارده', { fill: C.fg, size: 34, font: 'Alexandria', weight: 900 }) : tx(x, y + 5, 'عرض النهارده', { fill: '#4E4C5A', size: 15, font: 'Alexandria', weight: 600 }),
    image: ([x, y]) => on('image') ? `<circle cx="${x}" cy="${y}" r="52" fill="${accent}" opacity=".9"/><circle cx="${x}" cy="${y}" r="35" stroke="${C.fg}" stroke-width="1.5" opacity=".7"/><circle cx="${x}" cy="${y}" r="15" fill="${C.ink}"/>` : `<circle cx="${x}" cy="${y}" r="17" stroke="#4E4C5A" stroke-width="1.4"/><path d="M${x - 9} ${y + 6}l6-7 5 5 4-4 4 6" stroke="#4E4C5A" stroke-width="1.2"/>`,
    price: ([x, y]) => on('price') ? `<g transform="rotate(-8 ${x} ${y})"><rect x="${x - 54}" y="${y - 30}" width="108" height="60" rx="10" fill="${C.red}"/>${tx(x, y + 13, '-50%', { fill: C.fg, size: 38, font: 'Handjet', weight: 700, extra: 'direction="ltr" unicode-bidi="embed"' })}</g>` : tx(x, y + 4, '-50%', { fill: '#4E4C5A', size: 13, font: 'Handjet', weight: 500, extra: 'direction="ltr" unicode-bidi="embed"' }),
    button: ([x, y]) => on('button') ? `<rect x="${x - 72}" y="${y - 22}" width="144" height="44" rx="22" fill="${C.good}"/>${tx(x, y + 7, 'اطلب دلوقتي', { fill: C.ink, size: 18, font: 'Alexandria', weight: 700 })}` : `<rect x="${x - 30}" y="${y - 9}" width="60" height="18" rx="9" stroke="#4E4C5A" stroke-width="1.2"/>${tx(x, y + 4, 'اطلب', { fill: '#4E4C5A', size: 10, font: 'Alexandria' })}`
  };
  const order = GLANCE_PARTS.map(p => p.k).sort((a, b) => (a === focal) - (b === focal)); // focal drawn last, on top
  return svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="14" fill="${C.ink}" stroke="#2A2935"/>${order.map(k => part[k](P[k])).join('')}${tx(P.folio[0], P.folio[1], 'صفحة ١', { fill: '#3E3D4A', size: 9, anchor: 'end' })}`, 'بوستر فيه عنوان وصورة وخصم وزرار');
}

/* ---------- art ---------- */
const flowArt = svg('0 0 600 200', `
  <g stroke="${C.fg}" stroke-width="1.6">
    <path d="M440 82c18-24 38-36 60-36s42 12 60 36c-18 24-38 36-60 36s-42-12-60-36z"/><circle cx="500" cy="82" r="15"/><circle cx="500" cy="82" r="5" fill="${C.fg}"/>
    <circle cx="300" cy="82" r="36"/><circle cx="300" cy="82" r="22" stroke="${C.zc}"/><circle cx="300" cy="82" r="8" fill="${C.zc}" stroke="none"/>
    <path d="M44 82h34l12-26 16 52 14-38 9 12h29" stroke="${C.pink}"/>
  </g>
  <g stroke="${C.dim}" stroke-width="1.4"><path d="M420 82H352M360 74l-8 8 8 8"/><path d="M248 82H180M188 74l-8 8 8 8"/></g>
  ${tx(500, 150, 'يشوف', { fill: C.fg, size: 19, font: 'Alexandria', weight: 700 })}${tx(500, 172, 'perceive', { size: 13 })}
  ${tx(300, 150, 'يفهم', { fill: C.fg, size: 19, font: 'Alexandria', weight: 700 })}${tx(300, 172, 'process', { size: 13 })}
  ${tx(100, 150, 'يحس', { fill: C.fg, size: 19, font: 'Alexandria', weight: 700 })}${tx(100, 172, 'emotionally respond', { size: 13 })}`, 'المشاهد بيشوف، بعدين يفهم، بعدين يحس');

const seekArt = {
  clarity: svg('0 0 48 48', `<circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="1.6"/><path d="M16 24h16" stroke="currentColor" stroke-width="1.6"/>`),
  patterns: svg('0 0 48 48', `<g fill="currentColor">${[0, 1, 2].map(i => [0, 1, 2].map(j => `<circle cx="${12 + i * 12}" cy="${12 + j * 12}" r="${(i + j) % 2 ? 2.2 : 3.4}"/>`).join('')).join('')}</g>`),
  cues: svg('0 0 48 48', `<path d="M6 26h9l4-9 6 18 5-12 3 3h9" stroke="currentColor" stroke-width="1.6"/>`)
};

const leversArt = svg('0 0 600 300', `
  <g stroke="${C.dim}" stroke-width="1" stroke-dasharray="2 5"><path d="M300 150L130 70M300 150L470 70M300 150L130 230M300 150L470 230"/></g>
  <g transform="translate(300 150)" stroke="${C.fg}" stroke-width="1.6"><path d="M-40 0c10-15 24-24 40-24s30 9 40 24c-10 15-24 24-40 24S-30 15-40 0z"/><circle r="10"/><circle r="3.5" fill="${C.fg}"/></g>
  <g stroke="${C.red}" stroke-width="1.6"><path d="M104 88l18-34 18 34z"/><circle cx="158" cy="72" r="15"/></g>
  ${tx(470, 84, 'Aa', { fill: C.sun, size: 40, font: 'EB Garamond', weight: 600 })}
  <g opacity=".95"><circle cx="118" cy="228" r="17" fill="${C.pink}" opacity=".8"/><circle cx="140" cy="228" r="17" fill="${C.ultra}" opacity=".8"/><circle cx="129" cy="210" r="17" fill="${C.sun}" opacity=".7"/></g>
  <rect x="444" y="200" width="54" height="54" stroke="${C.ice}" stroke-width="1.4" stroke-dasharray="3 4"/><circle cx="471" cy="227" r="3" fill="${C.ice}"/>
  ${tx(130, 122, 'Shape · الشكل', { fill: C.fg, size: 14 })}${tx(470, 122, 'Typeface · الخط', { fill: C.fg, size: 14 })}${tx(130, 280, 'Color · اللون', { fill: C.fg, size: 14 })}${tx(470, 280, 'Space · الفراغ', { fill: C.fg, size: 14 })}`, 'العين في النص، وحواليها أربع أدوات: الشكل والخط واللون والفراغ');

const viewerPoster = mood => svg('0 0 300 200', `
  <rect x=".5" y=".5" width="299" height="199" rx="10" fill="${mood === 'cold' ? '#0E1320' : mood === 'mourn' ? '#141414' : '#12121A'}" stroke="#2A2935"/>
  <rect x="120" y="58" width="60" height="60" stroke="${mood === 'cold' ? '#7FB6FF' : C.fg}" stroke-width="1.4"/>
  ${tx(150, 150, 'هدوء', { fill: mood === 'mourn' ? '#BDBDBD' : C.fg, size: 16, font: 'Alexandria', weight: 600 })}
  ${tx(150, 170, 'معرض صغير · الجمعة', { size: 10 })}
  ${mood === 'calm' ? `<circle cx="150" cy="88" r="6" fill="${C.good}" opacity=".85"/>` : ''}
  ${mood === 'cold' ? `<g stroke="#7FB6FF" stroke-width="1" opacity=".6"><path d="M30 30l8 8M38 30l-8 8M260 160l8 8M268 160l-8 8"/></g>` : ''}
  ${mood === 'mourn' ? `<path d="M120 58l60 60" stroke="#8A8A8A" stroke-width="1"/>` : ''}`, 'بوستر مينيمال فيه مربع وكلمة واحدة');

/* ---------- lesson ---------- */
export default {
  zone: 'mind',
  hero: { say: 'قبل أي شكل أو لون أو خط: فيه دماغ هتشوف شغلك. المصمم الشاطر بيصمم للدماغ دي الأول، وبعدين للشاشة.' },
  chapters: [
    {
      id: 'mind-play', title: 'التصميم بيلعب في دماغك', en: 'How great designs play with the psychology of viewers', ref: 'Lecture 02 · slides 2–3', scene: 'eye',
      blocks: [
        { t: 'say', who: 'eye', text: 'كل تصميم عدّى عليك النهارده لعب في دماغك. حتى لو انت مش واخد بالك. خصوصًا لو انت مش واخد بالك.' },
        { t: 'p', big: true, text: 'التصميم مش رسمة حلوة. التصميم رسالة رايحة لدماغ حد.' },
        { t: 'p', text: 'أول جملة في المحاضرة بتقول إن المصمم لازم **يتوقّع** دماغ المشاهد هتعمل إيه. وده بيحصل على ٣ مراحل ورا بعض.' },
        { t: 'quote', ref: 'L02 · S03', text: 'The psychology of viewers plays a crucial role in shaping graphic design, as designers must anticipate how people perceive, process, and emotionally respond to visual content.', ar: 'سيكولوجية المشاهد ليها دور كبير في التصميم، لأن المصمم لازم يتوقع الناس هتشوف إزاي، وهتفهم إزاي، وهتحس بإيه.' },
        { t: 'art', html: flowArt, caption: '<en>perceive</en> ← <en>process</en> ← <en>emotionally respond</en>' },
        { t: 'list', style: 'num', items: ['**يشوف** <en>perceive</en>: العين تلقط الحاجة أصلًا. لو العنصر ضايع، القصة خلصت هنا.', '**يفهم** <en>process</en>: المخ يرتب اللي شافه ويطلع منه معنى.', '**يحس** <en>emotionally respond</en>: يتبسط؟ يتطمن؟ يتخض؟ ده اللي بيفضل معاه.'] },
        { t: 'example', title: 'إعلان على الكوبري', text: 'السواق معاه ٣ ثواني بس. يشوف الإعلان، يفهم هو عن إيه، ويحس بحاجة. لو أي مرحلة فيهم وقعت، فلوس الإعلان راحت في الهوا.' },
        { t: 'h', text: 'المخ بيدوّر على ٣ حاجات', en: 'clarity · patterns · emotional cues' },
        { t: 'quote', ref: 'L02 · S03', text: 'Human brains are wired to seek clarity, patterns, and emotional cues so designs that align with these tendencies are more likely to resonate.' },
        { t: 'grid', cols: 3, items: [
          { title: 'وضوح', en: 'Clarity', text: 'تفهم من أول بصّة. من غير مجهود.', art: seekArt.clarity, color: C.zc },
          { title: 'أنماط', en: 'Patterns', text: 'حاجة بتتكرر بنظام، فالمخ يرتاح ويتوقع اللي جاي.', art: seekArt.patterns, color: C.ice },
          { title: 'إشارات عاطفية', en: 'Emotional cues', text: 'لون أو صورة أو كلمة بتحسسك قبل ما تفكر.', art: seekArt.cues, color: C.pink }
        ] },
        { t: 'why', text: 'المخ كسول بذكاء. بيحب الطرق المختصرة. الوضوح والأنماط بيوفروا عليه مجهود، والإشارات العاطفية أسرع من التفكير. فالتصميم اللي ماشي مع الميول دي بيوصل (<en>resonate</en>).' },
        { t: 'check', q: 'mi02' },
        { t: 'h', text: 'الجمال لوحده مش كفاية', en: 'not just aesthetics' },
        { t: 'quote', ref: 'L02 · S03', text: 'Ultimately, effective graphic design is not just about aesthetics, it’s about understanding the viewer’s mind and crafting visuals that speak directly to it.' },
        { t: 'p', text: 'يعني التصميم الحلو اللي محدش فهمه = تصميم فاشل. والتصميم البسيط اللي وصل للدماغ صح = تصميم ناجح.' },
        { t: 'trap', text: 'سؤال صح وغلط بيقولك: التصميم الفعّال هدفه الجمال وبس. الإجابة **غلط**.', wrong: 'Effective design is only about aesthetics', right: 'It’s about understanding the viewer’s mind' },
        { t: 'tip', text: 'التصميم = قراية أفكار، مش ديكور. اسأل نفسك دايمًا: دماغ اللي قدامي هتعمل إيه؟' },
        { t: 'check', q: 'mi04' }
      ]
    },
    {
      id: 'mind-scan', title: 'الناس بتمسح، مش بتقرا', en: 'Viewers scan rather than read → visual hierarchy', ref: 'Lecture 02 · slide 3', scene: 'scan',
      blocks: [
        { t: 'say', who: 'eye', text: 'اعترف: انت مش بتقرا البوستر. انت بتبصله ثانيتين وتكمّل سكرول.' },
        { t: 'p', text: 'المحاضرة بتقول إن الناس بت<en>scan</en>، يعني بتمسح بعينها بسرعة، مش بتقرا كلمة كلمة. ده بيجبر المصمم يعمل حاجة اسمها <en>visual hierarchy</en>: ترتيب بصري واضح.' },
        { t: 'quote', ref: 'L02 · S03', text: 'For instance, viewers tend to scan rather than read, which pushes designers to create layouts with strong visual hierarchy, guiding eye from focal points to supporting details.' },
        { t: 'demo', id: 'mnd-glance', title: 'اختبار الثانية الواحدة', caption: 'العين مابتقراش بالترتيب. بتنط على الأكبر والأعلى تباين الأول. ده الـ <en>focal point</en>.', mount: mountGlance },
        { t: 'h', text: 'الـ Hierarchy بتشتغل إزاي؟', en: 'from focal points to supporting details' },
        { t: 'list', style: 'num', items: ['**نقطة تركيز** <en>focal point</en>: أكبر، أو أوضح، أو أكتر لون. دي أول حاجة.', '**تفاصيل مساعدة** <en>supporting details</en>: معلومات أصغر بتشرح.', 'وفي الآخر الكلام الصغير: الميعاد، العنوان، الشروط.'] },
        { t: 'example', title: 'بوستر ماتش', text: 'اسم الفريقين بخط ضخم (<en>focal point</en>). تحته الميعاد. وفي الآخر اسم القناة صغير. انت فهمت الماتش من غير ما تقرا البوستر.' },
        { t: 'why', text: 'العين بتنط بسرعة على أكبر وأوضح عنصر، وبعدين تمشي على اللي جنبه. لما المصمم يحدد الترتيب ده بنفسه، الرسالة بتوصل حتى لو الشخص بص ثانيتين بس.' },
        { t: 'trap', text: 'السؤال: ليه المصمم محتاج <en>strong visual hierarchy</en>؟ متختارش أي سبب له علاقة بالألوان أو الجمال.', wrong: 'Because viewers read every word in order', right: 'Because viewers tend to scan rather than read' },
        { t: 'tip', text: 'Scan مش Read. العين رادار، والـ <en>hierarchy</en> هي اللي بتقول للرادار يقف فين الأول.' },
        { t: 'check', q: 'mi01' }
      ]
    },
    {
      id: 'mind-minds', title: 'كل عقل بيشوف بطريقته', en: 'Different minds perceive things differently · cultural context', ref: 'Lecture 02 · slides 3–5', scene: 'minds',
      blocks: [
        { t: 'say', who: 'eye', text: 'نفس البوستر. ٣ أشخاص. ٣ إحساسات مختلفة. مين فيهم صح؟ التلاتة.' },
        { t: 'p', text: 'الإدراك (<en>perception</en>) مش كاميرا بتصوّر وخلاص. كل دماغ بيقرا الصورة بخلفيته هو.' },
        { t: 'quote', ref: 'L02 · S05', text: 'Different minds perceive things differently because perception is shaped by a unique blend of experiences, emotions, culture, education, and even biology.' },
        { t: 'list', style: 'dot', items: ['**خبرات** <en>experiences</en>: اللي حصلك قبل كده.', '**مشاعر** <en>emotions</en>: مودك وانت بتشوف.', '**ثقافة** <en>culture</en>: البيئة اللي اتربيت فيها.', '**تعليم** <en>education</en>: اللي اتعلمته وبتعرفه.', '**وحتى بيولوجي** <en>biology</en>: جسمك وعينك نفسها.'] },
        { t: 'check', q: 'mi05' },
        { t: 'h', text: 'المينيمال: هادي ولا بارد؟', en: 'calm vs cold or empty' },
        { t: 'quote', ref: 'L02 · S05', text: 'For example, a minimalist design might feel calm to someone who values simplicity but appears cold or empty to someone who craves richness and detail.' },
        { t: 'demo', id: 'mnd-viewers', title: 'بوستر واحد، ٣ عيون', caption: '<en>“Perception is not just about what’s seen it’s about how it’s seen, and by whom.”</en>', mount: mountViewers },
        { t: 'example', title: 'كافيه أبيض فيه زرعة واحدة', text: 'صاحبك اللي بيحب البساطة: «إيه الراحة دي». خالتك اللي بتحب التفاصيل: «المكان فاضي، ناقصه كام برواز». نفس المكان، دماغين.' },
        { t: 'h', text: 'التعاطف هو السلاح', en: 'empathy' },
        { t: 'quote', ref: 'L02 · S05', text: 'This is why empathy is such a powerful tool in design and communication.' },
        { t: 'p', text: 'التعاطف (<en>empathy</en>) هنا مش إنك تزعل على حد. ده إنك تبص للتصميم بعين اللي هيشوفه، مش بعينك انت.' },
        { t: 'check', q: 'mi06' },
        { t: 'compare', left: { title: 'الجمهور كتلة واحدة', en: 'a monolith', text: 'تصميم واحد لنوع واحد من الناس. غالبًا هيوصل لناس، ويضيع على الباقي.' }, right: { title: 'الجمهور ناس مختلفة', en: 'diverse perspectives', text: 'لما تفهم إن جمهورك متنوع، تقدر تعمل رسالة بتوصل لأكتر من دماغ.' }, note: 'المحاضرة: الجمهور مش <en>monolith</en>، يعني مش كتلة واحدة كلها شبه بعض.' },
        { t: 'quote', ref: 'L02 · S05', text: 'When creators understand that their audience isn’t a monolith, they can craft visuals and messages that resonate across diverse perspectives.' },
        { t: 'check', q: 'mi07' },
        { t: 'h', text: 'وعشان كده الـ Feedback مهم', en: 'feedback' },
        { t: 'quote', ref: 'L02 · S05', text: 'It’s also why feedback is so valuable what feels “clear” or “beautiful” to one person might need rethinking for another. Perception is not just about what’s seen it’s about how it’s seen, and by whom.' },
        { t: 'p', text: 'اللي شايفه انت "واضح" أو "حلو"، ممكن حد تاني يحتاجه بشكل مختلف. عشان كده ورّي شغلك لناس قبل ما تنزله.' },
        { t: 'check', q: 'mi08' },
        { t: 'h', text: 'والثقافة؟', en: 'cultural context' },
        { t: 'quote', ref: 'L02 · S03', text: 'Cultural context also matters symbols, colors, and styles must reflect the values and expectations of the target audience to avoid miscommunication.' },
        { t: 'example', title: 'رمز واحد، معنيين', text: 'علامة الصباع لفوق معناها «تمام» في أماكن كتير، وفي أماكن تانية بتتفهم إهانة. واللون الأبيض في الثقافات الغربية نقاء (<en>purity</en>)، وفي بعض الثقافات الشرقية حِداد (<en>mourning</en>) — هتقابله في منطقة الألوان. الرمز مش بيحمل معناه لوحده. الجمهور هو اللي بيدّيله المعنى.' },
        { t: 'why', text: 'الرموز والألوان والستايلات بنتعلم معناها من بيئتنا. لو المصمم تجاهل ثقافة الجمهور، الرسالة بتوصل غلط (<en>miscommunication</en>).' },
        { t: 'trap', text: 'لو السؤال فيه رمز «حلو في بلد ومُهين في بلد الجمهور»، الكلمة المفتاحية هي الثقافة، مش أي حاجة تانية.', wrong: 'Typographic hierarchy', right: 'Cultural context' },
        { t: 'check', q: 'mi03' },
        { t: 'tip', text: 'الإدراك = اللي اتشاف + إزاي اتشاف + مين اللي شاف. (<en>what’s seen · how it’s seen · by whom</en>)' },
        { t: 'check', q: 'mi09' }
      ]
    },
    {
      id: 'mind-levers', title: 'الأدوات الأربعة', en: 'Shape · Typeface · Color · Space', ref: 'Lecture 02 · slides 6–7', scene: 'levers',
      blocks: [
        { t: 'say', who: 'eye', text: 'طب المصمم بيلعب في دماغك بإيه بالظبط؟ بأربع أدوات. كل واحدة فيهم ليها منطقة في المدار.' },
        { t: 'art', html: leversArt, caption: 'الشكل، الخط، اللون، الفراغ — حوالين عين المشاهد' },
        { t: 'p', text: 'المحاضرة رسمت ٤ حاجات حوالين دماغ: <en>Shape</en>، <en>Typeface</en>، <en>Color</en>، <en>Space</en>. دول الأدوات اللي المصمم بيحرّك بيها إحساس المشاهد.' },
        { t: 'check', q: 'mi14' },
        { t: 'demo', id: 'mnd-levers', title: 'حرّك الأربع أدوات', caption: 'نفس الكلمة، بس كل أداة بتغيّر الإحساس. جرّب كل الأدوات عشان تاخد الـ XP.', mount: mountLevers },
        { t: 'h', text: 'يعني إيه «استخدام واعي» للأشكال؟', en: 'informed use of graphic shapes' },
        { t: 'quote', ref: 'L02 · S06', text: 'The informed use of graphic shapes refers to the intentional and strategic application of visual forms—such as circles, squares, triangles, and abstract shapes—to communicate meaning, guide perception, and enhance user experience.' },
        { t: 'p', text: 'الكلمتين المهمين: **عن قصد** <en>intentional</en> و**بخطة** <en>strategic</en>. الشكل مش جاي بالصدفة. جاي عشان يوصّل معنى، ويوجّه الإدراك، ويحسّن تجربة المستخدم.' },
        { t: 'check', q: 'mi10' },
        { t: 'quote', ref: 'L02 · S06', text: 'Shapes are not just decorative; they carry psychological and symbolic weight that influences how viewers interpret a design.' },
        { t: 'trap', text: 'صح ولا غلط: الأشكال مجرد زينة. **غلط**. ليها وزن نفسي ورمزي.', wrong: 'Shapes are just decorative', right: 'Shapes carry psychological and symbolic weight' },
        { t: 'check', q: 'mi11' },
        { t: 'quote', ref: 'L02 · S06', text: 'When designers understand these associations, they can use shapes to reinforce brand identity, evoke emotion, and direct attention within a layout.' },
        { t: 'example', title: 'المثلث العاكس ورا العربية', text: 'لما عربية تعطل، بتحط مثلث أحمر عاكس وراها. محدش بيقرا عليه حاجة. الشكل لوحده بيقول «خلّي بالك». ده <en>direct attention</en> صافي.' },
        { t: 'check', q: 'mi15' },
        { t: 'tip', text: 'الأدوات الأربعة = ٤ مناطق في المدار: **الأشكال، الخط (<en>Typeface</en>)، الألوان، الفراغ**. لو نسيتهم في الامتحان، افتكر المدار.' },
        { t: 'quote', ref: 'L02 · S06', text: 'Moreover, informed shape usage considers cultural context, audience expectations, and design goals.' },
        { t: 'check', q: 'mi12' },
        { t: 'quote', ref: 'L02 · S06', text: 'The power of graphic shapes lies in their ability to speak a visual language that transcends words, making design more intuitive, memorable, and emotionally resonant.' },
        { t: 'check', q: 'mi13' }
      ]
    },
    {
      id: 'mind-logos', title: 'محقق اللوجوهات', en: 'More examples for discussion', ref: 'Lecture 02 · slides 28–35', scene: 'eye',
      blocks: [
        { t: 'say', who: 'eye', text: 'آخر المحاضرة كانت لعبة: «بص كويس، فيه حاجة مستخبية». هنا هنحكيها بالكلام بس. ومش هنرسم ولا لوجو.' },
        { t: 'p', text: '٤ لوجوهات مشهورة، وفي كل واحد فكرة نفسية. اقلب الكارت وشوف السر.' },
        { t: 'grid', cols: 2, flip: true, items: [
          { title: 'سهم شركة الشحن', en: 'FedEx', text: '<span>في الفراغ بين حرفين فيه سهم مستخبي. معناه: <en>forward direction, speed, and precision</en>. وده بالظبط وعد شركة شحن.</span>', color: C.ice },
          { title: 'القضمة في التفاحة', en: 'Apple', text: '<span>التفاحة ناقصة حتة. والقضمة <en>bite</en> بتلمّح لـ <en>bytes</en>: حجر الأساس في الكمبيوتر.</span>', color: C.fg },
          { title: 'لوجو فيه روح', en: 'Yahoo', text: '<span>فيه <en>human touch</en>: شكله مرح وشخصي. والانطباع العام: <en>fancy yet sophisticated</en>.</span>', color: C.zc },
          { title: 'رمز بيجمع ٤ حاجات', en: 'Airbnb', text: '<span>ناس <en>people</en> + أماكن <en>places</en> + حب <en>love</en> + حرف <en>A</en>. كله في رمز واحد.</span>', color: C.pink }
        ] },
        { t: 'quote', ref: 'L02 · S29', text: 'Ever noticed this arrow in FedEx logo? Yes. It depicts forward direction, speed, and precision as core values at FedEx.' },
        { t: 'check', q: 'mi16' },
        { t: 'quote', ref: 'L02 · S31', text: 'So Apple picked a logo as simple as an ‘apple’! But do you know what this incomplete apple indicates? This ‘bite’ implies ‘bytes’ - the foundation stones of computing.' },
        { t: 'check', q: 'mi17' },
        { t: 'quote', ref: 'L02 · S33', text: 'You guessed it right! Yahoo logo has a human touch – it looks fun and personal. The overall impression is fancy yet sophisticated.' },
        { t: 'check', q: 'mi18' },
        { t: 'quote', ref: 'L02 · S35', text: 'No. Airbnb didn’t mean to be explicit. — People + Places + Love + Airbnb (A)' },
        { t: 'why', text: 'كل لوجو فيهم بيستخدم أداة من الأربعة: سهم شركة الشحن معمول من **الفراغ**، والقضمة **شكل** ليه معنى، وروح ياهو جاية من **الخط**، ورمز إيربنب **تركيبة أشكال** بتحكي قصة.' },
        { t: 'trap', text: 'السؤال بيحب يلعب بالمعاني. ركّز على الكلمات بالظبط:', wrong: 'FedEx arrow = danger · Apple bite = hunger', right: 'FedEx = forward direction, speed, precision · Apple = bytes' },
        { t: 'tip', text: 'سهم = سرعة. قضمة = بايتس. ياهو = روح. إيربنب = ناس + أماكن + حب + A.' },
        { t: 'check', q: 'mi19' }
      ]
    }
  ]
};

/* ---------- demos ---------- */
function mountGlance(el, api) {
  let t = 0, focal = 'image', timers = [];
  const later = (f, ms) => timers.push(setTimeout(f, ms));
  el.innerHTML = `<div class="mnd-glance">
    <div class="mnd-glance__screen"><div class="mnd-glance__poster"></div><div class="mnd-glance__cover"><span class="hud-num mnd-glance__cd">1.0s</span><p>هتشوف بوستر لمدة ثانية واحدة بس. ركّز.</p></div></div>
    <div class="mnd-glance__side">
      <button type="button" class="btn btn--zone mnd-glance__go">ورّيني البوستر</button>
      <div class="mnd-glance__q" hidden><p>إيه أول حاجة عينك راحت لها؟</p><div class="mnd-opts">${GLANCE_PARTS.map((p, i) => `<button type="button" class="btn btn--sm" data-k="${p.k}"><span class="hud-num">${i + 1}</span> ${p.ar}</button>`).join('')}</div></div>
      <p class="mnd-glance__out" aria-live="polite"></p>
    </div></div>`;
  const poster = el.querySelector('.mnd-glance__poster'), cover = el.querySelector('.mnd-glance__cover'), q = el.querySelector('.mnd-glance__q'), out = el.querySelector('.mnd-glance__out'), go = el.querySelector('.mnd-glance__go');
  const pick = () => { const ks = GLANCE_PARTS.map(p => p.k).filter(k => k !== focal); focal = ks[Math.floor(Math.random() * ks.length)]; t++; };
  function show() {
    pick(); poster.innerHTML = glanceLayout(focal, t); out.textContent = ''; q.hidden = true; go.disabled = true;
    api.scene('scan'); api.sfx('swoosh');
    cover.classList.add('is-open');
    const ms = reduced() ? 1800 : 1000;
    later(() => { cover.classList.remove('is-open'); cover.querySelector('p').textContent = 'اتقفل. جاوب من الذاكرة.'; q.hidden = false; q.querySelector('button')?.focus({ preventScroll: true }); }, ms);
  }
  go.addEventListener('click', show);
  q.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
    const ok = b.dataset.k === focal; q.hidden = true; cover.classList.add('is-open'); go.disabled = false; go.textContent = 'مرة كمان';
    const name = GLANCE_PARTS.find(p => p.k === focal).ar;
    out.innerHTML = ok ? `<b>بالظبط.</b> ${name} كان الأكبر والأوضح، فبقى <bdi class="en" dir="ltr">focal point</bdi>.` : `<b>لأ، كان ${name}.</b> ده كان الأكبر والأعلى تباين. العين بتروح له الأول، مهما كان مكانه.`;
    api.sfx(ok ? 'good' : 'bad');
    if (ok) api.award(5, { from: b, key: 'demo:mnd-glance' });
  }));
  return () => timers.forEach(clearTimeout);
}

function mountViewers(el, api) {
  const V = [
    { k: 'calm', ar: 'بيحب البساطة', read: 'هادي ومريح', why: 'شايف المساحة راحة، والعنصر الواحد تركيز.', en: 'calm' },
    { k: 'cold', ar: 'بيحب التفاصيل', read: 'بارد وفاضي', why: 'مستني غنى وتفاصيل، فالبساطة عنده نقص.', en: 'cold or empty' },
    { k: 'mourn', ar: 'من ثقافة تانية', read: 'حزين؟', why: 'في ثقافته الأبيض والفراغ ممكن يفكّروه بالعزا. نفس التصميم، معنى تاني.', en: 'cultural context' }
  ];
  let seen = new Set();
  el.innerHTML = `<div class="mnd-view"><div class="mnd-view__poster"></div><div class="mnd-view__side"><p class="label">مين اللي بيبص؟</p><div class="mnd-view__who" role="radiogroup" aria-label="المشاهد">${V.map((v, i) => `<button type="button" role="radio" class="mnd-view__btn" data-i="${i}" aria-checked="false"><span class="hud-num">0${i + 1}</span> ${v.ar}</button>`).join('')}</div><div class="mnd-view__read" aria-live="polite"><b>—</b><span></span></div></div></div>`;
  const poster = el.querySelector('.mnd-view__poster'), read = el.querySelector('.mnd-view__read');
  const set = i => {
    const v = V[i]; poster.innerHTML = viewerPoster(v.k);
    el.querySelectorAll('.mnd-view__btn').forEach((b, j) => b.setAttribute('aria-checked', String(j === i)));
    read.querySelector('b').textContent = v.read; read.querySelector('span').innerHTML = `${v.why} <bdi class="en" dir="ltr">${v.en}</bdi>`;
    seen.add(i); api.sfx('click'); if (seen.size === V.length) api.award(5, { from: read, key: 'demo:mnd-viewers' });
  };
  el.querySelectorAll('.mnd-view__btn').forEach(b => b.addEventListener('click', () => set(+b.dataset.i)));
  poster.innerHTML = viewerPoster('calm');
}

function mountLevers(el, api) {
  const L = {
    shape: { ar: 'الشكل', opts: [['circle', 'دايرة', 'ودود وآمن'], ['square', 'مربع', 'ثابت وموثوق'], ['triangle', 'مثلث', 'متحرك وجريء']] },
    type: { ar: 'الخط', opts: [['serif', 'Serif', 'رسمي وكلاسيك'], ['sans', 'Sans', 'نضيف ومعاصر'], ['script', 'Script', 'شخصي ورومانسي'], ['display', 'Display', 'صاخب وملفت']] },
    color: { ar: 'اللون', opts: [['#4D6BFF', 'أزرق', 'ثقة وهدوء'], ['#FF4A2E', 'أحمر', 'طاقة واستعجال'], ['#FFC21A', 'أصفر', 'تفاؤل وبهجة'], ['#EDEBE6', 'أبيض', 'نضافة وبساطة']] },
    space: { ar: 'الفراغ', opts: [['airy', 'براح', 'هادي ومريح'], ['dense', 'زحمة', 'مستعجل ومكثف']] }
  };
  const FONT = { serif: '"EB Garamond", serif', sans: '"IBM Plex Sans Arabic", sans-serif', script: 'Lobster, cursive', display: '"Bebas Neue", Impact, sans-serif' };
  const cur = { shape: 0, type: 1, color: 0, space: 0 }; const touched = new Set();
  el.innerHTML = `<div class="mnd-lev"><div class="mnd-lev__poster"></div><div class="mnd-lev__ctl">${Object.entries(L).map(([k, l]) => `<div class="mnd-lev__row"><span class="label">${l.ar}</span><div class="mnd-lev__seg" role="radiogroup" aria-label="${l.ar}">${l.opts.map((o, i) => `<button type="button" role="radio" data-k="${k}" data-i="${i}" aria-checked="${cur[k] === i}">${o[1]}</button>`).join('')}</div></div>`).join('')}<p class="mnd-lev__read" aria-live="polite"></p></div></div>`;
  const poster = el.querySelector('.mnd-lev__poster'), read = el.querySelector('.mnd-lev__read');
  const draw = () => {
    const sh = L.shape.opts[cur.shape][0], col = L.color.opts[cur.color][0], dense = L.space.opts[cur.space][0] === 'dense', fam = FONT[L.type.opts[cur.type][0]];
    const shape = sh === 'circle' ? `<circle cx="150" cy="${dense ? 70 : 78}" r="${dense ? 30 : 38}" fill="none" stroke="${col}" stroke-width="2"/>` : sh === 'square' ? `<rect x="${dense ? 120 : 112}" y="40" width="${dense ? 60 : 76}" height="${dense ? 60 : 76}" fill="none" stroke="${col}" stroke-width="2"/>` : `<path d="M150 ${dense ? 36 : 34}l${dense ? 36 : 44} ${dense ? 66 : 82}h-${dense ? 72 : 88}z" fill="none" stroke="${col}" stroke-width="2"/>`;
    const extra = dense ? `<g fill="#4E4C5A">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${18 + (i % 3) * 92}" y="${148 + Math.floor(i / 3) * 18}" width="${70 - (i % 2) * 18}" height="7" rx="2"/>`).join('')}<rect x="16" y="16" width="40" height="14" rx="3"/><rect x="246" y="16" width="38" height="14" rx="3"/><circle cx="268" cy="96" r="12"/><circle cx="30" cy="100" r="9"/></g>` : '';
    poster.innerHTML = `<svg viewBox="0 0 300 200" role="img" aria-label="بوستر بيتغير مع الأدوات"><rect x=".5" y=".5" width="299" height="199" rx="12" fill="#101018" stroke="#2A2935"/>${shape}<text x="150" y="${dense ? 134 : 152}" text-anchor="middle" font-family='${fam}' font-size="${dense ? 22 : 26}" fill="${col}">Mind Games</text>${extra}</svg>`;
    read.innerHTML = `الإحساس: ${[L.shape.opts[cur.shape][2], L.type.opts[cur.type][2], L.color.opts[cur.color][2], L.space.opts[cur.space][2]].map(s => `<b>${s}</b>`).join(' + ')}`;
  };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.k; cur[k] = +b.dataset.i; touched.add(k);
    el.querySelectorAll(`[data-k="${k}"]`).forEach(x => x.setAttribute('aria-checked', String(x === b)));
    draw(); api.sfx('click');
    if (touched.size === 4) api.award(5, { from: read, key: 'demo:mnd-levers' });
  }));
  draw();
}
