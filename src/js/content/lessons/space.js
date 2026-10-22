// Lecture 02 — The psychology of space: emptiness as a design element, mood, active vs passive whitespace,
// and what negative space does to the mind.
const C = { fg: '#EDEBE6', dim: '#7E7C8B', faint: '#3A3946', mute: '#4E4C5A', ink: '#101018', ice: '#7FE7FF', red: '#FF4A2E', ultra: '#4D6BFF', sun: '#FFC21A', violet: '#8B7BFF', pink: '#FF3E8A', good: '#46E3A0' };
const svg = (vb, inner, label = '') => `<svg viewBox="${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${label}">${inner}</svg>`;
const tx = (x, y, s, { fill = C.dim, size = 13, anchor = 'middle', font = 'IBM Plex Sans Arabic', weight = 400, extra = '' } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${fill}" ${extra}>${s}</text>`;
const rnd = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

/* ---------- layouts shared with the trials ---------- */
/** density 0…1 → a poster that goes from airy to crammed */
export function densityLayout(t, seed = 7) {
  const r = rnd(seed); const n = Math.round(t * 26); let extra = '';
  const cols = [C.mute, C.mute, '#5A5866', C.pink, C.sun, C.ice];
  for (let i = 0; i < n; i++) { const w = 18 + r() * 70, h = 6 + r() * 22; const x = 10 + r() * (300 - w), y = 10 + r() * (200 - h); extra += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${cols[i % cols.length]}" opacity="${(.45 + r() * .45).toFixed(2)}"/>`; }
  const size = 30 - t * 10;
  return svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="12" fill="${C.ink}" stroke="#2A2935"/>${extra}<circle cx="160" cy="${86 - t * 10}" r="${26 - t * 8}" stroke="${C.ice}" stroke-width="1.6" fill="${C.ink}"/>${tx(160, 150 - t * 14, 'معرض الربيع', { fill: C.fg, size, font: 'Alexandria', weight: 800, extra: `stroke="${C.ink}" stroke-width="${t > .4 ? 4 : 0}" paint-order="stroke"` })}`, 'بوستر بيتزحم أو يفضى');
}
/** a layout whose space is either active (deliberate, asymmetric) or passive (default gaps) */
export function spaceLayout(kind = 'active', fill = C.ink, seed = 3) {
  const r = rnd(seed);
  if (kind === 'active') {
    const left = r() > .5; const ox = left ? 196 : 28;
    return svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="12" fill="${fill}" stroke="#2A2935"/>
      <rect x="${ox}" y="44" width="96" height="120" rx="4" fill="${C.ice}" opacity=".9"/>
      ${tx(left ? 28 : 292, 178, 'هدوء', { fill: C.fg, size: 22, font: 'Alexandria', weight: 800, anchor: left ? 'end' : 'start' })}
      <rect x="${left ? 28 : 214}" y="188" width="78" height="5" rx="2" fill="${C.mute}"/>`, 'فراغ مقصود ومش متماثل');
  }
  let lines = '';
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) lines += `<rect x="${24 + j * 70}" y="${30 + i * 18}" width="${52 + (i + j) % 3 * 4}" height="6" rx="2" fill="${C.mute}"/>`;
  return svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="12" fill="${fill}" stroke="#2A2935"/>${lines}`, 'مسافات عادية بين السطور والعناصر');
}

/* ---------- art ---------- */
const effectsArt = svg('0 0 600 240', `
  <g stroke="${C.ice}" stroke-width="1.5">
    <path d="M40 70h70M75 52v36" opacity=".9"/><circle cx="75" cy="70" r="30" stroke-dasharray="2 5"/>
    <path d="M170 92c10-30 50-30 60 0" /><circle cx="200" cy="60" r="10"/>
    <rect x="290" y="40" width="60" height="60" stroke-dasharray="3 5"/><circle cx="320" cy="70" r="9" fill="${C.ice}"/>
    <path d="M410 50l40 40M450 50l-40 40" stroke="${C.red}"/><circle cx="430" cy="70" r="34" stroke-dasharray="2 6"/>
    <path d="M520 98V54l18 12 18-12v44" stroke="${C.sun}"/>
  </g>
  ${tx(75, 140, 'Strikes balance', { fill: C.fg, size: 13 })}${tx(75, 160, 'بيعمل توازن', { size: 12 })}
  ${tx(200, 140, 'Evokes imagination', { fill: C.fg, size: 13 })}${tx(200, 160, 'بيشغّل الخيال', { size: 12 })}
  ${tx(320, 140, 'Emphasizes object', { fill: C.fg, size: 13 })}${tx(320, 160, 'بيبرز العنصر', { size: 12 })}
  ${tx(430, 140, 'Eliminates clutter', { fill: C.fg, size: 13 })}${tx(430, 160, 'بيشيل الزحمة', { size: 12 })}
  ${tx(538, 140, 'Implies luxury', { fill: C.fg, size: 13 })}${tx(538, 156, 'and sophistication', { fill: C.fg, size: 12 })}${tx(538, 176, 'فخامة ورُقي', { size: 12 })}
  <path d="M40 200h520" stroke="${C.faint}" stroke-dasharray="2 6"/>${tx(300, 228, 'What negative space does psychologically', { size: 12 })}`, 'خمس حاجات بيعملها الفراغ السلبي');

const notWhite = svg('0 0 600 170', `
  <rect x="20" y="20" width="170" height="130" rx="8" fill="#EDEBE6"/><rect x="70" y="60" width="40" height="40" fill="#101018"/>
  <rect x="215" y="20" width="170" height="130" rx="8" fill="#B8301A"/><rect x="265" y="60" width="40" height="40" fill="#EDEBE6"/>
  <defs><pattern id="spc-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.3" fill="#7FE7FF" opacity=".55"/></pattern></defs>
  <rect x="410" y="20" width="170" height="130" rx="8" fill="#0E1A22"/><rect x="410" y="20" width="170" height="130" rx="8" fill="url(#spc-dots)"/><rect x="460" y="60" width="40" height="40" fill="#EDEBE6"/>
  ${tx(105, 166, 'white', { size: 12 })}${tx(300, 166, 'color', { size: 12 })}${tx(495, 166, 'pattern', { size: 12 })}`, 'نفس الفراغ: أبيض، ولون، ونقش');

/* ---------- lesson ---------- */
export default {
  zone: 'space',
  hero: { say: 'أهم عنصر في تصميم كتير… هو الحتة اللي مفيهاش حاجة. بجد. المنطقة دي هتخليك تحترم الفراغ.' },
  chapters: [
    {
      id: 'space-psych', title: 'الفاضي مش فاضي', en: 'The psychology of space in graphic design', ref: 'Lecture 02 · slides 13–14', scene: 'clearing',
      blocks: [
        { t: 'say', who: 'void', text: 'بص على الحتة الفاضية في أي إعلان شيك. هي مش فاضية. هي شغالة أكتر من أي حاجة في الإعلان.' },
        { t: 'quote', ref: 'L02 · S14', text: 'The psychology of space in graphic design revolves around how the use—or absence—of space influences perception, emotion, and behavior.' },
        { t: 'p', text: 'يعني وجود الفراغ أو غيابه بيغيّر ٣ حاجات عندك: إزاي **بتشوف** <en>perception</en>، وبتحس بإيه <en>emotion</en>، وهتعمل إيه <en>behavior</en>: تقف؟ تقرا؟ تدوس؟ تمشي؟' },
        { t: 'check', q: 'sp05' },
        { t: 'quote', ref: 'L02 · S14', text: 'Space isn’t just emptiness; it’s a powerful design element that shapes how viewers interact with content. When used intentionally, space can create clarity, focus, and emotional tone.' },
        { t: 'grid', cols: 3, items: [
          { title: 'وضوح', en: 'Clarity', text: 'العناصر مش لازقة في بعض، فالمعنى بيبان.', art: svg('0 0 48 48', '<rect x="8" y="10" width="12" height="12" stroke="currentColor" stroke-width="1.6"/><rect x="28" y="26" width="12" height="12" stroke="currentColor" stroke-width="1.6"/>'), color: C.ice },
          { title: 'تركيز', en: 'Focus', text: 'الفراغ حوالين العنصر بيشاور عليه.', art: svg('0 0 48 48', '<circle cx="24" cy="24" r="17" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 4"/><circle cx="24" cy="24" r="4" fill="currentColor"/>'), color: C.ice },
          { title: 'نبرة إحساس', en: 'Emotional tone', text: 'براح = هدوء. زحمة = استعجال.', art: svg('0 0 48 48', '<path d="M6 30c6-10 12-10 18 0s12 10 18 0" stroke="currentColor" stroke-width="1.6"/>'), color: C.ice }
        ] },
        { t: 'example', title: 'منيو كشري ومنيو كافيه', text: 'لافتة محل الكشري مليانة أسعار وصور وألوان: إحساس سريع ورخيص ومستعجل. منيو الكافيه الهادي فيه أصناف قليلة ومسافات كبيرة: إحساس «خد وقتك». الفرق الأساسي؟ الفراغ.' },
        { t: 'why', text: 'المخ محتاج أماكن يرتاح فيها وهو بيبص. الفراغ بيقسّم المعلومة لحتت صغيرة سهلة، وبيقول للعين «الحاجة المهمة هنا».' },
        { t: 'trap', text: 'سؤال صح وغلط: «الفراغ مجرد مساحة فاضية». **غلط**. المحاضرة قالت إنه <en>a powerful design element</en>.', wrong: 'Space is just emptiness', right: 'Space is a powerful design element that shapes how viewers interact with content' },
        { t: 'check', q: 'sp18' },
        { t: 'tip', text: 'الفراغ بيلعب في ٣: الإدراك، الإحساس، السلوك. (<en>perception · emotion · behavior</en>)' }
      ]
    },
    {
      id: 'space-mood', title: 'مود الفراغ', en: 'Open & airy vs dense & compact', ref: 'Lecture 02 · slide 14', scene: 'airy',
      blocks: [
        { t: 'say', who: 'void', text: 'نفس البوستر. شيل حاجات، يهدى. زوّد حاجات، يتوتر. الفراغ هو زرار الـ Mood.' },
        { t: 'quote', ref: 'L02 · S14', text: 'Psychologically, space affects mood. Open, airy designs can feel calm and inviting, while dense, compact layouts may feel intense or urgent.' },
        { t: 'demo', id: 'spc-density', title: 'زرار المود', caption: 'حرّك السلايدر. نفس العناصر الأساسية، بس الزحمة بتقلب الإحساس من «هادي ومرحّب» لـ«مستعجل ومكثف».', mount: mountDensity },
        { t: 'compare', left: { title: 'براح', en: 'open, airy', text: 'إحساس <en>calm and inviting</en>: هادي وبيقولك اتفضل.' }, right: { title: 'زحمة', en: 'dense, compact', text: 'إحساس <en>intense or urgent</en>: مكثف ومستعجل، الحق قبل ما يخلص.' } },
        { t: 'example', title: 'إعلان أوكازيون vs إعلان برفان', text: 'إعلان التخفيضات مزحوم بالأرقام والنجوم والألوان، لأنه عايزك تحس إن الفرصة هتضيع. إعلان البرفان فيه زجاجة واحدة وفراغ كبير، لأنه عايزك تحس بهدوء وقيمة.' },
        { t: 'check', q: 'sp06' },
        { t: 'h', text: 'والثقافة ليها رأي', en: 'cultural factors' },
        { t: 'quote', ref: 'L02 · S14', text: 'Cultural factors play a role too—some audiences associate minimalism with modernity, while others may interpret it as lacking substance.' },
        { t: 'p', text: 'نفس التصميم المينيمال: جمهور يشوفه **مودرن**، وجمهور تاني يشوفه **فاضي ومفيهوش حاجة** <en>lacking substance</en>. تفتكر جدّتك هتقول إيه على كارت فرح أبيض فيه سطرين؟' },
        { t: 'trap', text: 'الكلمتين اللي بيتسألوا: البراح = <en>calm and inviting</en>، والزحمة = <en>intense or urgent</en>. والمينيمال عند بعض الناس = <en>lacking substance</en>.', wrong: 'Dense layouts feel calm and inviting', right: 'Dense, compact layouts may feel intense or urgent' },
        { t: 'check', q: 'sp07' },
        { t: 'tip', text: 'براح = بحر. زحمة = موقف ميكروباص الساعة ٥.' }
      ]
    },
    {
      id: 'space-active', title: 'فراغ بقرار، وفراغ تلقائي', en: 'Active vs passive whitespace', ref: 'Lecture 02 · slide 13', scene: 'activeSpace',
      blocks: [
        { t: 'say', who: 'void', text: 'في نوعين فراغ: واحد انت قررته عشان تعمل حركة، وواحد موجود لوحده عشان الكلام يتقرا. والامتحان بيحب يسأل عن الفرق.' },
        { t: 'compare', left: { title: 'فراغ مقصود', en: 'Active whitespace', art: spaceLayout('active', C.ink, 4), text: '<en>The deliberate asymmetric space intended to make design more lively.</en> مساحة **متعمّدة** و**مش متماثلة**، هدفها تخلي التصميم أحيا.' }, right: { title: 'فراغ عادي', en: 'Passive whitespace', art: spaceLayout('passive'), text: '<en>The default space between characters and different design elements.</en> المسافة **الطبيعية** بين الحروف وبين العناصر.' }, note: 'Active = قرار. Passive = افتراضي.' },
        { t: 'quote', ref: 'L02 · S13', text: 'Active whitespace — the deliberate asymmetric space intended to make design more lively. Passive whitespace — the default space between characters and different design elements.' },
        { t: 'demo', id: 'spc-active', title: 'بدّل نوع الفراغ… ولونه', caption: 'لاحظ: حتى لو لونت الفراغ أحمر أو حطيت فيه نقش، هو لسه <en>white space</en>.', mount: mountActive },
        { t: 'example', title: 'بوستر معرض فني', text: 'اللوحة متزقوقة في ركن، والعنوان الصغير في الركن التاني، ونص البوستر فاضي. ده قرار. الفراغ ده بيعمل حركة وتوتر حلو. ده <en>active</en>. أما المسافة بين السطور في الكتالوج اللي جوه، فدي <en>passive</en>.' },
        { t: 'check', q: 'sp01' },
        { t: 'check', q: 'sp02' },
        { t: 'check', q: 'sp17' },
        { t: 'h', text: 'الفراغ الأبيض مش لازم يبقى أبيض', en: 'white space doesn’t have to be white' },
        { t: 'art', html: notWhite, caption: 'المربع واحد. الفراغ حواليه: أبيض، ولون، ونقش. التلاتة <en>white space</en>.' },
        { t: 'quote', ref: 'L02 · S13', text: 'The white space doesn’t have to be White. It Can be any color or pattern.' },
        { t: 'why', text: 'اسمه «أبيض» عشان أيام الطباعة كان الورق أبيض. لكن الفكرة هي **غياب العناصر**، مش لون الورق.' },
        { t: 'trap', text: 'صح وغلط: «الفراغ الأبيض لازم يبقى أبيض». **غلط**. وكمان اسمه التاني: <en>negative space</en>.', wrong: 'White space has to be white', right: 'It can be any color or pattern' },
        { t: 'check', q: 'sp03' },
        { t: 'check', q: 'sp04' },
        { t: 'tip', text: 'Active = متعمّد + مش متماثل + بيحيي التصميم. Passive = تلقائي بين الحروف والعناصر.' }
      ]
    },
    {
      id: 'space-negative', title: 'الفراغ بيعمل إيه في دماغك؟', en: 'What negative space does psychologically', ref: 'Lecture 02 · slides 15–16', scene: 'clearing',
      blocks: [
        { t: 'say', who: 'void', text: 'الفراغ السلبي بيتكلم من غير ولا كلمة. والمحاضرة عدّت الحاجات اللي بيقولها.' },
        { t: 'quote', ref: 'L02 · S15', text: 'The psychology of negative space in graphic design is all about how “emptiness” speaks volumes. Far from being just blank areas, negative space (also called white space) plays a crucial role in shaping how people perceive, feel, and respond to a design.' },
        { t: 'art', html: effectsArt, caption: 'السلايد ١٥ عرض ٥ حاجات بيعملها الفراغ السلبي' },
        { t: 'list', style: 'num', items: ['**بيعمل توازن** <en>Strikes balance</en>: بيوزّع الثقل على التصميم.', '**بيشغّل الخيال** <en>Evokes imagination</en>: سايب حتة للمخ يكمّلها.', '**بيبرز العنصر** <en>Emphasizes object</en>: الحاجة الوحيدة في الفراغ بتبقى بطلة.', '**بيشيل الزحمة** <en>Eliminates clutter</en>.', '**بيوحي بالفخامة والرقي** <en>Implies luxury and sophistication</en>.'] },
        { t: 'h', text: 'وطّي الدوشة', en: 'Focuses attention' },
        { t: 'quote', ref: 'L02 · S16', text: 'Focuses Attention — Negative space helps isolate key elements, guiding the viewer’s eye to what’s most important. It’s like turning down the noise so the message can sing.' },
        { t: 'demo', id: 'spc-noise', title: 'وطّي الدوشة… والرسالة هتغني', caption: 'كل ضغطة بتشيل زحمة. لاحظ الرسالة بتعلى من غير ما تكبر.', mount: mountNoise },
        { t: 'check', q: 'sp11' },
        { t: 'h', text: 'الفراغ = فلوس', en: 'Suggests quality and sophistication' },
        { t: 'quote', ref: 'L02 · S16', text: 'Suggests Quality and Sophistication — High-end brands often use generous negative space to signal refinement and exclusivity.' },
        { t: 'example', title: 'فاترينة محل غالي', text: 'محل الهدوم الغالي حاطط ٣ قطع بس في الفاترينة الكبيرة. محل الأوكازيون حاطط ٣٠٠ قطعة. مين اللي حسيت إنه أغلى؟ الفراغ قالك قبل السعر.' },
        { t: 'check', q: 'sp12' },
        { t: 'why', text: 'المساحة في الدنيا الحقيقية غالية. فلما براند «يضيّع» مساحة كبيرة على عنصر واحد، المخ بيقرا ده ثقة وفخامة.' },
        { t: 'trap', text: 'سؤال <en>NOT</en>: كل الحاجات اللي فاتت بيعملها الفراغ السلبي، إلا إنه **يعمل إحساس استعجال**. الاستعجال بتاع الزحمة.', wrong: 'Negative space creates a sense of urgency', right: 'Dense layouts with little negative space can feel urgent' },
        { t: 'check', q: 'sp10' },
        { t: 'tip', text: 'الفراغ السلبي: توازن، خيال، بطل، نضافة، فخامة. والجملة الذهبية: <en>turning down the noise so the message can sing</en>.' }
      ]
    },
    {
      id: 'space-breathe', title: 'نَفَس، وقراية، وإحساس', en: 'Breathing room · readability · emotion', ref: 'Lecture 02 · slides 14 & 16', scene: 'passiveSpace',
      blocks: [
        { t: 'say', who: 'void', text: 'آخر ٣ قوى للفراغ هي اللي بتفرق بين صفحة بتتقري، وصفحة بتتقفل من أول نظرة.' },
        { t: 'quote', ref: 'L02 · S14', text: 'White space (also called negative space) gives breathing room to a design. It helps reduce cognitive overload, making content easier to digest and more visually appealing.' },
        { t: 'check', q: 'sp08' },
        { t: 'p', text: '<en>cognitive overload</en> يعني دماغك اتحمّل أكتر من طاقته. الفراغ بيخفف الحمل ده، فالمحتوى يتهضم أسهل <en>easier to digest</en>.' },
        { t: 'check', q: 'sp09' },
        { t: 'h', text: 'بيدّي التصميم نَفَس', en: 'Creates breathing room' },
        { t: 'quote', ref: 'L02 · S16', text: 'Creates Breathing Room — Designs with ample negative space feel calm, open, and approachable. This reduces cognitive load and makes content easier to absorb.' },
        { t: 'check', q: 'sp13' },
        { t: 'h', text: 'بيحسّن القراية والفهم', en: 'Improves readability and comprehension' },
        { t: 'quote', ref: 'L02 · S16', text: 'Improves Readability and Comprehension — Space between lines, paragraphs, and elements helps the brain process information more efficiently. It’s not just aesthetic—it’s functional.' },
        { t: 'demo', id: 'spc-leading', title: 'المسافة بين السطور', caption: 'المسافة الصح بين السطور مش ذوق. دي وظيفة: المخ بيقرا أسرع ويفهم أكتر.', mount: mountLeading },
        { t: 'example', title: 'ملزمة المذاكرة', text: 'ملزمة مكتوبة بخط صغير والسطور لازقة في بعض، بتتعب عينك بعد صفحتين. نفس الكلام بمسافات مريحة بتخلص منه أسرع. ده معنى <en>it’s functional</en>.' },
        { t: 'check', q: 'sp14' },
        { t: 'h', text: 'بيحرّك إحساس', en: 'Evokes emotion' },
        { t: 'quote', ref: 'L02 · S16', text: 'Evokes Emotion — Minimalist use of space can feel elegant, modern, or luxurious. Dense layouts with little negative space can feel urgent, chaotic, or overwhelming.' },
        { t: 'check', q: 'sp15' },
        { t: 'compare', left: { title: 'مينيمال', en: 'minimalist', text: '<en>elegant, modern, or luxurious</en>: أنيق، مودرن، فخم.' }, right: { title: 'مزحوم', en: 'dense', text: '<en>urgent, chaotic, or overwhelming</en>: مستعجل، فوضوي، خانق.' } },
        { t: 'trap', text: 'اتنين بيتلخبطوا: <en>Creates Breathing Room</en> = هدوء وانفتاح وتقليل الحمل على المخ. و<en>Improves Readability</en> = المسافات بين السطور والفقرات = وظيفة مش جمال.', wrong: 'Readability spacing is just aesthetic', right: 'It’s not just aesthetic—it’s functional' },
        { t: 'check', q: 'sp16' },
        { t: 'tip', text: 'الفراغ في الصفحة زي الهوا في الأوضة: محدش بيشوفه، بس من غيره محدش يقدر يقعد.' }
      ]
    }
  ]
};

/* ---------- demos ---------- */
function mountDensity(el, api) {
  let t = .15, zone = 'airy', moved = 0;
  el.innerHTML = `<div class="spc-dens"><div class="spc-dens__fig"></div><div class="spc-dens__side"><label class="spc-range"><span class="label">الزحمة</span><span class="hud-num spc-dens__v">15</span><input type="range" min="0" max="100" value="15" aria-label="الزحمة"></label><div class="spc-meter" aria-hidden="true"><i></i></div><div class="spc-read" aria-live="polite"><b></b><small dir="ltr"></small></div></div></div>`;
  const fig = el.querySelector('.spc-dens__fig'), range = el.querySelector('input'), read = el.querySelector('.spc-read'), meter = el.querySelector('.spc-meter i');
  const paint = () => {
    fig.innerHTML = densityLayout(t); el.querySelector('.spc-dens__v').textContent = Math.round(t * 100); meter.style.width = (t * 100) + '%';
    const [a, b] = t < .35 ? ['هادي ومرحّب', 'open, airy → calm and inviting'] : t < .65 ? ['متوازن', 'somewhere in between'] : ['مستعجل ومكثف', 'dense, compact → intense or urgent'];
    read.querySelector('b').textContent = a; read.querySelector('small').textContent = b;
    meter.style.background = t < .35 ? C.ice : t < .65 ? C.sun : C.red;
  };
  range.addEventListener('input', () => {
    t = range.value / 100; moved++; paint();
    const z = t < .5 ? 'airy' : 'dense'; if (z !== zone) { zone = z; api.scene(z); }
    if (moved > 6 && t > .7) api.award(5, { from: range, key: 'demo:spc-density' });
  });
  paint();
}
function mountActive(el, api) {
  let kind = 'active', fill = C.ink, seen = new Set();
  const fills = [[C.ink, 'غامق'], ['#B8301A', 'لون'], ['pattern', 'نقش']];
  el.innerHTML = `<div class="spc-act"><div class="spc-act__fig"></div><div class="spc-act__side"><span class="label">نوع الفراغ</span><div class="spc-seg" role="radiogroup" aria-label="نوع الفراغ"><button type="button" role="radio" data-k="active" aria-checked="true">Active</button><button type="button" role="radio" data-k="passive" aria-checked="false">Passive</button></div><span class="label">لون الفراغ</span><div class="spc-seg" role="radiogroup" aria-label="لون الفراغ">${fills.map(([f, n], i) => `<button type="button" role="radio" data-f="${i}" aria-checked="${i === 0}">${n}</button>`).join('')}</div><div class="spc-read" aria-live="polite"><b></b><small dir="ltr"></small></div></div></div>`;
  const fig = el.querySelector('.spc-act__fig'), read = el.querySelector('.spc-read');
  const paint = () => {
    const f = fill === 'pattern' ? 'url(#spc-pat)' : fill;
    let s = spaceLayout(kind, f, 4);
    if (fill === 'pattern') s = s.replace('<rect x=".5"', '<defs><pattern id="spc-pat" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#0E1A22"/><circle cx="6" cy="6" r="1.4" fill="#7FE7FF" opacity=".55"/></pattern></defs><rect x=".5"');
    fig.innerHTML = s;
    read.querySelector('b').textContent = kind === 'active' ? 'فراغ مقصود: متعمّد ومش متماثل' : 'فراغ عادي: المسافات الافتراضية';
    read.querySelector('small').textContent = kind === 'active' ? 'The deliberate asymmetric space intended to make design more lively.' : 'The default space between characters and different design elements.';
  };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { kind = b.dataset.k; el.querySelectorAll('[data-k]').forEach(x => x.setAttribute('aria-checked', String(x === b))); paint(); api.sfx('click'); api.scene(kind === 'active' ? 'activeSpace' : 'passiveSpace'); seen.add(kind); if (seen.size >= 3) api.award(5, { from: read, key: 'demo:spc-active' }); }));
  el.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { fill = fills[+b.dataset.f][0]; el.querySelectorAll('[data-f]').forEach(x => x.setAttribute('aria-checked', String(x === b))); paint(); api.sfx('click'); seen.add('f' + b.dataset.f); if (seen.size >= 3) api.award(5, { from: read, key: 'demo:spc-active' }); }));
  paint();
}
function mountNoise(el, api) {
  const r = rnd(11); const N = 12; let left = N;
  const junk = Array.from({ length: N }, (_, i) => {
    const w = 30 + r() * 60, h = 10 + r() * 22; let x, y; do { x = 8 + r() * (304 - w); y = 8 + r() * (204 - h); } while (x < 200 && x + w > 120 && y < 140 && y + h > 80);
    return `<g class="spc-noise__j" data-i="${i}"><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${['#4E4C5A', C.pink, C.sun, '#5A5866', C.red][i % 5]}" opacity=".75"/></g>`;
  }).join('');
  el.innerHTML = `<div class="spc-noise"><div class="spc-noise__fig">${svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="12" fill="${C.ink}" stroke="#2A2935"/>${junk}${tx(160, 118, 'رسالة واحدة', { fill: C.fg, size: 26, font: 'Alexandria', weight: 800, extra: 'class="spc-noise__msg"' })}`, 'بوستر مليان دوشة وفي نصه رسالة')}</div><div class="spc-noise__side"><button type="button" class="btn btn--zone">وطّي الدوشة</button><button type="button" class="btn btn--sm" hidden>رجّع الدوشة</button><p class="spc-read" aria-live="polite"><b>دوشة: <span class="hud-num">${N}</span></b><small></small></p></div></div>`;
  const [down, reset] = el.querySelectorAll('button'), read = el.querySelector('.spc-read');
  down.addEventListener('click', () => {
    if (left === N) api.scene('dense');
    let k = 0; el.querySelectorAll('.spc-noise__j:not(.is-gone)').forEach(g => { if (k < 3) { g.classList.add('is-gone'); k++; } });
    left = Math.max(0, left - 3); read.querySelector('.hud-num').textContent = left; api.sfx('swoosh');
    if (!left) { el.querySelector('.spc-noise__fig').classList.add('is-clear'); read.querySelector('small').innerHTML = '<bdi class="en" dir="ltr">“turning down the noise so the message can sing.”</bdi>'; down.disabled = true; reset.hidden = false; api.scene('clearing'); api.award(5, { from: down, key: 'demo:spc-noise' }); }
  });
  reset.addEventListener('click', () => { left = N; el.querySelectorAll('.spc-noise__j').forEach(g => g.classList.remove('is-gone')); el.querySelector('.spc-noise__fig').classList.remove('is-clear'); read.querySelector('.hud-num').textContent = N; read.querySelector('small').textContent = ''; down.disabled = false; reset.hidden = true; });
}
function mountLeading(el, api) {
  let lh = 1.05, moved = 0;
  el.innerHTML = `<div class="spc-lead"><p class="spc-lead__txt">الفراغ بين السطور بيدّي العين مكان ترتاح فيه. لما السطور تلزق في بعض، العين بتتوه وهي راجعة لأول السطر اللي بعده. ولما تبعد زيادة، الفقرة بتتفك لجزر. المسافة الصح بتخلي المخ يقرا أسرع ويفهم أكتر.</p><div class="spc-lead__side"><label class="spc-range"><span class="label">المسافة بين السطور</span><span class="hud-num spc-lead__v">1.05</span><input type="range" min="100" max="300" value="105" aria-label="المسافة بين السطور"></label><div class="spc-read" aria-live="polite"><b></b><small></small></div></div></div>`;
  const txt = el.querySelector('.spc-lead__txt'), range = el.querySelector('input'), read = el.querySelector('.spc-read');
  const paint = () => {
    txt.style.lineHeight = lh; el.querySelector('.spc-lead__v').textContent = lh.toFixed(2);
    const [a, b] = lh < 1.35 ? ['خانق', 'السطور لازقة: العين بتتوه، والمخ بيتعب.'] : lh <= 2.1 ? ['مريح', 'المخ بيقرا أسرع ويفهم أكتر. ده المطلوب.'] : ['مفكك', 'السطور بعدت زيادة، والفقرة بقت جزر.'];
    read.querySelector('b').textContent = a; read.querySelector('small').textContent = b;
  };
  range.addEventListener('input', () => { lh = range.value / 100; moved++; paint(); if (moved > 5 && lh > 1.5 && lh < 2.1) api.award(5, { from: range, key: 'demo:spc-leading' }); });
  paint();
}
