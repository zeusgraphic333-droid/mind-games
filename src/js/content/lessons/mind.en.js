// Lecture 02 — The viewer's mind: how great designs play with the psychology of viewers, different minds,
// the four tools, and the logo discussion. English edition of mind.js (same ids, blocks, scenes and demos).
const C = { fg: '#EDEBE6', dim: '#7E7C8B', faint: '#3A3946', ink: '#101018', zc: '#8B7BFF', red: '#FF4A2E', ultra: '#4D6BFF', sun: '#FFC21A', ice: '#7FE7FF', pink: '#FF3E8A', good: '#46E3A0' };
const svg = (vb, inner, label = '') => `<svg viewBox="${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${label}">${inner}</svg>`;
const tx = (x, y, s, { fill = C.dim, size = 13, anchor = 'middle', font = 'IBM Plex Sans Arabic', weight = 400, extra = '' } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${fill}" ${extra}>${s}</text>`;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- "first glance": a poster where one element owns the hierarchy ---------- */
// `ar` holds the label in this edition's language (the trials read it); `en` is the English term.
export const GLANCE_PARTS = [
  { k: 'headline', ar: 'Headline', en: 'Headline' },
  { k: 'image', ar: 'Image', en: 'Image' },
  { k: 'price', ar: 'Discount', en: 'Price tag' },
  { k: 'button', ar: 'Button', en: 'Button' }
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
    headline: ([x, y]) => on('headline') ? tx(160, y + 11, 'Today’s deal', { fill: C.fg, size: 34, font: 'Alexandria', weight: 900 }) : tx(x, y + 5, 'Today’s deal', { fill: '#4E4C5A', size: 15, font: 'Alexandria', weight: 600 }),
    image: ([x, y]) => on('image') ? `<circle cx="${x}" cy="${y}" r="52" fill="${accent}" opacity=".9"/><circle cx="${x}" cy="${y}" r="35" stroke="${C.fg}" stroke-width="1.5" opacity=".7"/><circle cx="${x}" cy="${y}" r="15" fill="${C.ink}"/>` : `<circle cx="${x}" cy="${y}" r="17" stroke="#4E4C5A" stroke-width="1.4"/><path d="M${x - 9} ${y + 6}l6-7 5 5 4-4 4 6" stroke="#4E4C5A" stroke-width="1.2"/>`,
    price: ([x, y]) => on('price') ? `<g transform="rotate(-8 ${x} ${y})"><rect x="${x - 54}" y="${y - 30}" width="108" height="60" rx="10" fill="${C.red}"/>${tx(x, y + 13, '-50%', { fill: C.fg, size: 38, font: 'Handjet', weight: 700, extra: 'direction="ltr" unicode-bidi="embed"' })}</g>` : tx(x, y + 4, '-50%', { fill: '#4E4C5A', size: 13, font: 'Handjet', weight: 500, extra: 'direction="ltr" unicode-bidi="embed"' }),
    button: ([x, y]) => on('button') ? `<rect x="${x - 72}" y="${y - 22}" width="144" height="44" rx="22" fill="${C.good}"/>${tx(x, y + 7, 'Order now', { fill: C.ink, size: 18, font: 'Alexandria', weight: 700 })}` : `<rect x="${x - 30}" y="${y - 9}" width="60" height="18" rx="9" stroke="#4E4C5A" stroke-width="1.2"/>${tx(x, y + 4, 'Order', { fill: '#4E4C5A', size: 10, font: 'Alexandria' })}`
  };
  const order = GLANCE_PARTS.map(p => p.k).sort((a, b) => (a === focal) - (b === focal)); // focal drawn last, on top
  // LTR: the folio starts at its x (the Arabic edition anchors its end there, which is the same left corner in RTL)
  return svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="14" fill="${C.ink}" stroke="#2A2935"/>${order.map(k => part[k](P[k])).join('')}${tx(P.folio[0], P.folio[1], 'Page 1', { fill: '#3E3D4A', size: 9, anchor: 'start' })}`, 'A poster with a headline, an image, a discount and a button');
}

/* ---------- art ---------- */
// reads left to right in English: perceive → process → emotionally respond
const flowArt = svg('0 0 600 200', `
  <g stroke="${C.fg}" stroke-width="1.6">
    <path d="M40 82c18-24 38-36 60-36s42 12 60 36c-18 24-38 36-60 36s-42-12-60-36z"/><circle cx="100" cy="82" r="15"/><circle cx="100" cy="82" r="5" fill="${C.fg}"/>
    <circle cx="300" cy="82" r="36"/><circle cx="300" cy="82" r="22" stroke="${C.zc}"/><circle cx="300" cy="82" r="8" fill="${C.zc}" stroke="none"/>
    <path d="M444 82h34l12-26 16 52 14-38 9 12h29" stroke="${C.pink}"/>
  </g>
  <g stroke="${C.dim}" stroke-width="1.4"><path d="M180 82H248M240 74l8 8-8 8"/><path d="M352 82H420M412 74l8 8-8 8"/></g>
  ${tx(100, 150, 'Sees', { fill: C.fg, size: 19, font: 'Alexandria', weight: 700 })}${tx(100, 172, 'perceive', { size: 13 })}
  ${tx(300, 150, 'Understands', { fill: C.fg, size: 19, font: 'Alexandria', weight: 700 })}${tx(300, 172, 'process', { size: 13 })}
  ${tx(500, 150, 'Feels', { fill: C.fg, size: 19, font: 'Alexandria', weight: 700 })}${tx(500, 172, 'emotionally respond', { size: 13 })}`, 'The viewer sees, then understands, then feels');

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
  ${tx(130, 122, 'Shape', { fill: C.fg, size: 14 })}${tx(470, 122, 'Typeface', { fill: C.fg, size: 14 })}${tx(130, 280, 'Color', { fill: C.fg, size: 14 })}${tx(470, 280, 'Space', { fill: C.fg, size: 14 })}`, 'The eye in the middle, with four tools around it: shape, typeface, color and space');

const viewerPoster = mood => svg('0 0 300 200', `
  <rect x=".5" y=".5" width="299" height="199" rx="10" fill="${mood === 'cold' ? '#0E1320' : mood === 'mourn' ? '#141414' : '#12121A'}" stroke="#2A2935"/>
  <rect x="120" y="58" width="60" height="60" stroke="${mood === 'cold' ? '#7FB6FF' : C.fg}" stroke-width="1.4"/>
  ${tx(150, 150, 'Calm', { fill: mood === 'mourn' ? '#BDBDBD' : C.fg, size: 16, font: 'Alexandria', weight: 600 })}
  ${tx(150, 170, 'A small show · Friday', { size: 10 })}
  ${mood === 'calm' ? `<circle cx="150" cy="88" r="6" fill="${C.good}" opacity=".85"/>` : ''}
  ${mood === 'cold' ? `<g stroke="#7FB6FF" stroke-width="1" opacity=".6"><path d="M30 30l8 8M38 30l-8 8M260 160l8 8M268 160l-8 8"/></g>` : ''}
  ${mood === 'mourn' ? `<path d="M120 58l60 60" stroke="#8A8A8A" stroke-width="1"/>` : ''}`, 'A minimal poster with a square and one word');

/* ---------- lesson ---------- */
export default {
  zone: 'mind',
  hero: { say: 'Before any shape, color or font, there’s a brain that will see your work. A smart designer designs for that brain first, and for the screen second.' },
  chapters: [
    {
      id: 'mind-play', title: 'Design plays with your mind', en: 'How great designs play with the psychology of viewers', ref: 'Lecture 02 · slides 2–3', scene: 'eye',
      blocks: [
        { t: 'say', who: 'eye', text: 'Every design you passed today played with your mind. Even if you didn’t notice. Especially if you didn’t notice.' },
        { t: 'p', big: true, text: 'Design isn’t a pretty picture. Design is a message on its way to someone’s brain.' },
        { t: 'p', text: 'The first line of the lecture says the designer must **anticipate** what the viewer’s brain will do. And that happens in 3 steps, one after the other.' },
        { t: 'quote', ref: 'L02 · S03', text: 'The psychology of viewers plays a crucial role in shaping graphic design, as designers must anticipate how people perceive, process, and emotionally respond to visual content.' },
        { t: 'art', html: flowArt, caption: 'perceive → process → emotionally respond' },
        { t: 'list', style: 'num', items: ['**Perceive** (see it): the eye has to catch the thing in the first place. If the element gets lost, the story ends here.', '**Process** (understand it): the brain sorts out what it saw and pulls a meaning out of it.', '**Emotionally respond** (feel it): happy? reassured? startled? That’s what stays with them.'] },
        { t: 'example', title: 'A billboard on the flyover', text: 'The driver has 3 seconds, tops. They see the ad, get what it’s about, and feel something. If any one of those steps fails, the ad money is gone with the wind.' },
        { t: 'h', text: 'The brain looks for 3 things', en: 'clarity · patterns · emotional cues' },
        { t: 'quote', ref: 'L02 · S03', text: 'Human brains are wired to seek clarity, patterns, and emotional cues so designs that align with these tendencies are more likely to resonate.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Clarity', text: 'You get it at first glance. No effort needed.', art: seekArt.clarity, color: C.zc },
          { title: 'Patterns', text: 'Something repeats in an order, so the brain relaxes and can predict what comes next.', art: seekArt.patterns, color: C.ice },
          { title: 'Emotional cues', text: 'A color, an image or a word that makes you feel before you think.', art: seekArt.cues, color: C.pink }
        ] },
        { t: 'why', text: 'The brain is lazy, in a smart way. It loves shortcuts. Clarity and patterns save it effort, and emotional cues are faster than thinking. So a design that goes along with these tendencies gets through: it **resonates**.' },
        { t: 'check', q: 'mi02' },
        { t: 'h', text: 'Looking good isn’t enough', en: 'not just aesthetics' },
        { t: 'quote', ref: 'L02 · S03', text: 'Ultimately, effective graphic design is not just about aesthetics, it’s about understanding the viewer’s mind and crafting visuals that speak directly to it.' },
        { t: 'p', text: 'So a beautiful design that nobody understood = a failed design. And a simple design that reached the brain the right way = a successful design.' },
        { t: 'trap', text: 'A true-or-false question says: effective design is only about aesthetics. The answer is **False**.', wrong: 'Effective design is only about aesthetics', right: 'It’s about understanding the viewer’s mind' },
        { t: 'tip', text: 'Design = mind reading, not decoration. Always ask yourself: what will this person’s brain do with it?' },
        { t: 'check', q: 'mi04' }
      ]
    },
    {
      id: 'mind-scan', title: 'People scan, they don’t read', en: 'Viewers scan rather than read → visual hierarchy', ref: 'Lecture 02 · slide 3', scene: 'scan',
      blocks: [
        { t: 'say', who: 'eye', text: 'Admit it: you don’t read the poster. You look at it for two seconds and keep scrolling.' },
        { t: 'p', text: 'The lecture says people **scan**: their eyes sweep the page fast instead of reading word by word. That forces the designer to build a **visual hierarchy**: a clear visual order.' },
        { t: 'quote', ref: 'L02 · S03', text: 'For instance, viewers tend to scan rather than read, which pushes designers to create layouts with strong visual hierarchy, guiding eye from focal points to supporting details.' },
        { t: 'demo', id: 'mnd-glance', title: 'The one-second test', caption: 'The eye doesn’t read in order. It jumps to the biggest, highest-contrast thing first. That’s the **focal point**.', mount: mountGlance },
        { t: 'h', text: 'How does hierarchy work?', en: 'from focal points to supporting details' },
        { t: 'list', style: 'num', items: ['**Focal point**: the biggest, the clearest, or the most colorful thing. That comes first.', '**Supporting details**: smaller information that explains.', 'And last, the small print: the time, the address, the terms.'] },
        { t: 'example', title: 'A match poster', text: 'The two teams’ names in huge type (the **focal point**). The kick-off time under them. And at the bottom, the channel’s name, small. You got the match without reading the poster.' },
        { t: 'why', text: 'The eye jumps straight to the biggest, clearest element, then moves on to what’s next to it. When the designer sets that order on purpose, the message gets through even if the person only looks for two seconds.' },
        { t: 'trap', text: 'The question: why does the designer need a **strong visual hierarchy**? Don’t pick any reason about colors or beauty.', wrong: 'Because viewers read every word in order', right: 'Because viewers tend to scan rather than read' },
        { t: 'tip', text: '**Scan**, not read. The eye is a radar, and the **hierarchy** tells the radar where to stop first.' },
        { t: 'check', q: 'mi01' }
      ]
    },
    {
      id: 'mind-minds', title: 'Every mind sees in its own way', en: 'Different minds perceive things differently · cultural context', ref: 'Lecture 02 · slides 3–5', scene: 'minds',
      blocks: [
        { t: 'say', who: 'eye', text: 'Same poster. 3 people. 3 different feelings. Which one is right? All three.' },
        { t: 'p', text: '**Perception** isn’t a camera that just takes a picture. Every brain reads the image through its own background.' },
        { t: 'quote', ref: 'L02 · S05', text: 'Different minds perceive things differently because perception is shaped by a unique blend of experiences, emotions, culture, education, and even biology.' },
        { t: 'list', style: 'dot', items: ['**Experiences**: what happened to you before.', '**Emotions**: your mood while you’re looking.', '**Culture**: the world you grew up in.', '**Education**: what you’ve learned and know.', '**And even biology**: your body, your eyes themselves.'] },
        { t: 'check', q: 'mi05' },
        { t: 'h', text: 'Minimal: calm or cold?', en: 'calm vs cold or empty' },
        { t: 'quote', ref: 'L02 · S05', text: 'For example, a minimalist design might feel calm to someone who values simplicity but appears cold or empty to someone who craves richness and detail.' },
        { t: 'demo', id: 'mnd-viewers', title: 'One poster, 3 pairs of eyes', caption: '“Perception is not just about what’s seen it’s about how it’s seen, and by whom.”', mount: mountViewers },
        { t: 'example', title: 'A white café with one plant', text: 'Your friend who loves simplicity: “So relaxing.” Your aunt who loves detail: “It’s empty. It needs a few picture frames.” Same place, two minds.' },
        { t: 'h', text: 'Empathy is the secret weapon', en: 'a powerful tool' },
        { t: 'quote', ref: 'L02 · S05', text: 'This is why empathy is such a powerful tool in design and communication.' },
        { t: 'p', text: '**Empathy** here doesn’t mean feeling sorry for someone. It means looking at the design through the eyes of the person who will see it, not through yours.' },
        { t: 'check', q: 'mi06' },
        { t: 'compare', left: { title: 'The audience as one block', en: 'a monolith', text: 'One design for one kind of person. It will probably reach some people and be lost on the rest.' }, right: { title: 'The audience as many people', en: 'diverse perspectives', text: 'Once you understand your audience is varied, you can make a message that reaches more than one mind.' }, note: 'The lecture: the audience isn’t a **monolith**. It isn’t one solid block where everyone is the same.' },
        { t: 'quote', ref: 'L02 · S05', text: 'When creators understand that their audience isn’t a monolith, they can craft visuals and messages that resonate across diverse perspectives.' },
        { t: 'check', q: 'mi07' },
        { t: 'h', text: 'And that’s why feedback matters', en: 'feedback is so valuable' },
        { t: 'quote', ref: 'L02 · S05', text: 'It’s also why feedback is so valuable what feels “clear” or “beautiful” to one person might need rethinking for another. Perception is not just about what’s seen it’s about how it’s seen, and by whom.' },
        { t: 'p', text: 'What looks “clear” or “beautiful” to you might need rethinking for someone else. That’s why you show your work to people before you publish it.' },
        { t: 'check', q: 'mi08' },
        { t: 'h', text: 'And culture?', en: 'cultural context' },
        { t: 'quote', ref: 'L02 · S03', text: 'Cultural context also matters symbols, colors, and styles must reflect the values and expectations of the target audience to avoid miscommunication.' },
        { t: 'example', title: 'One symbol, two meanings', text: 'A thumbs-up means “OK” in many places, and in some others it’s taken as an insult. And white means **purity** in Western cultures but **mourning** in some Eastern cultures — you’ll meet this again in the Color zone. A symbol doesn’t carry its meaning on its own. The audience gives it the meaning.' },
        { t: 'why', text: 'We learn what symbols, colors and styles mean from the world around us. If the designer ignores the audience’s culture, the message arrives wrong: **miscommunication**.' },
        { t: 'trap', text: 'If the question has a symbol that’s “friendly in one country but offensive in the audience’s country”, the key word is culture. Nothing else.', wrong: 'Typographic hierarchy', right: 'Cultural context' },
        { t: 'check', q: 'mi03' },
        { t: 'tip', text: 'Perception = **what’s seen** + **how it’s seen** + **by whom**.' },
        { t: 'check', q: 'mi09' }
      ]
    },
    {
      id: 'mind-levers', title: 'The four tools', en: 'Shape · Typeface · Color · Space', ref: 'Lecture 02 · slides 6–7', scene: 'levers',
      blocks: [
        { t: 'say', who: 'eye', text: 'So what exactly does a designer use to play with your mind? Four tools. Each one has its own zone in the orbit.' },
        { t: 'art', html: leversArt, caption: 'Shape, typeface, color, space — around the viewer’s eye' },
        { t: 'p', text: 'The lecture drew 4 things around a brain: **Shape**, **Typeface**, **Color**, **Space**. These are the tools the designer uses to move the viewer’s feelings.' },
        { t: 'check', q: 'mi14' },
        { t: 'demo', id: 'mnd-levers', title: 'Work the four tools', caption: 'Same word, but every tool changes the feeling. Try all four tools to get the XP.', mount: mountLevers },
        { t: 'h', text: 'What does “informed use” of shapes mean?', en: 'informed use of graphic shapes' },
        { t: 'quote', ref: 'L02 · S06', text: 'The informed use of graphic shapes refers to the intentional and strategic application of visual forms—such as circles, squares, triangles, and abstract shapes—to communicate meaning, guide perception, and enhance user experience.' },
        { t: 'p', text: 'The two words that matter: **intentional** (on purpose) and **strategic** (with a plan). The shape isn’t there by accident. It’s there to communicate meaning, guide perception, and enhance user experience.' },
        { t: 'check', q: 'mi10' },
        { t: 'quote', ref: 'L02 · S06', text: 'Shapes are not just decorative; they carry psychological and symbolic weight that influences how viewers interpret a design.' },
        { t: 'trap', text: 'True or false: shapes are just decoration. **False**. They carry psychological and symbolic weight.', wrong: 'Shapes are just decorative', right: 'Shapes carry psychological and symbolic weight' },
        { t: 'check', q: 'mi11' },
        { t: 'quote', ref: 'L02 · S06', text: 'When designers understand these associations, they can use shapes to reinforce brand identity, evoke emotion, and direct attention within a layout.' },
        { t: 'example', title: 'The reflective triangle behind the car', text: 'When a car breaks down, the driver puts a red reflective triangle behind it. Nobody reads anything on it. The shape alone says “watch out”. That’s **direct attention** in its purest form.' },
        { t: 'check', q: 'mi15' },
        { t: 'tip', text: 'The four tools = 4 zones in the orbit: **Shape, Typeface, Color, Space**. If you forget them in the exam, picture the orbit.' },
        { t: 'quote', ref: 'L02 · S06', text: 'Moreover, informed shape usage considers cultural context, audience expectations, and design goals.' },
        { t: 'check', q: 'mi12' },
        { t: 'quote', ref: 'L02 · S06', text: 'The power of graphic shapes lies in their ability to speak a visual language that transcends words, making design more intuitive, memorable, and emotionally resonant.' },
        { t: 'check', q: 'mi13' }
      ]
    },
    {
      id: 'mind-logos', title: 'Logo detective', en: 'More examples for discussion', ref: 'Lecture 02 · slides 28–35', scene: 'eye',
      blocks: [
        { t: 'say', who: 'eye', text: 'The end of the lecture was a game: “Look closely, something’s hidden.” Here we’ll tell it in words only. We won’t draw a single logo.' },
        { t: 'p', text: '4 famous logos, each with a psychological idea inside. Flip the card and see the secret.' },
        { t: 'grid', cols: 2, flip: true, items: [
          { title: 'The shipping company’s arrow', en: 'FedEx', text: '<span>An arrow hides in the space between two letters. It means **forward direction, speed, and precision**. Exactly what a shipping company promises.</span>', color: C.ice },
          { title: 'The bite in the apple', en: 'Apple', text: '<span>The apple is missing a piece. The **bite** hints at **bytes**: the foundation stones of computing.</span>', color: C.fg },
          { title: 'A logo with a soul', en: 'Yahoo', text: '<span>It has a **human touch**: it looks fun and personal. The overall impression: **fancy yet sophisticated**.</span>', color: C.zc },
          { title: 'A symbol that joins 4 things', en: 'Airbnb', text: '<span>**People** + **places** + **love** + the letter **A**. All in one symbol.</span>', color: C.pink }
        ] },
        { t: 'quote', ref: 'L02 · S29', text: 'Ever noticed this arrow in FedEx logo? Yes. It depicts forward direction, speed, and precision as core values at FedEx.' },
        { t: 'check', q: 'mi16' },
        { t: 'quote', ref: 'L02 · S31', text: 'So Apple picked a logo as simple as an ‘apple’! But do you know what this incomplete apple indicates? This ‘bite’ implies ‘bytes’ - the foundation stones of computing.' },
        { t: 'check', q: 'mi17' },
        { t: 'quote', ref: 'L02 · S33', text: 'You guessed it right! Yahoo logo has a human touch – it looks fun and personal. The overall impression is fancy yet sophisticated.' },
        { t: 'check', q: 'mi18' },
        { t: 'quote', ref: 'L02 · S35', text: 'No. Airbnb didn’t mean to be explicit. — People + Places + Love + Airbnb (A)' },
        { t: 'why', text: 'Each of these logos uses one of the four tools: the shipping arrow is made of **space**, the bite is a **shape** with a meaning, Yahoo’s personality comes from the **typeface**, and the Airbnb symbol is a **combination of shapes** that tells a story.' },
        { t: 'trap', text: 'The question loves to swap the meanings around. Stick to the exact words:', wrong: 'FedEx arrow = danger · Apple bite = hunger', right: 'FedEx = forward direction, speed, precision · Apple = bytes' },
        { t: 'tip', text: 'Arrow = speed. Bite = bytes. Yahoo = human touch. Airbnb = people + places + love + A.' },
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
    <div class="mnd-glance__screen"><div class="mnd-glance__poster"></div><div class="mnd-glance__cover"><span class="hud-num mnd-glance__cd">1.0s</span><p>You’ll see a poster for one second only. Focus.</p></div></div>
    <div class="mnd-glance__side">
      <button type="button" class="btn btn--zone mnd-glance__go">Show me the poster</button>
      <div class="mnd-glance__q" hidden><p>What did your eye go to first?</p><div class="mnd-opts">${GLANCE_PARTS.map((p, i) => `<button type="button" class="btn btn--sm" data-k="${p.k}"><span class="hud-num">${i + 1}</span> ${p.ar}</button>`).join('')}</div></div>
      <p class="mnd-glance__out" aria-live="polite"></p>
    </div></div>`;
  const poster = el.querySelector('.mnd-glance__poster'), cover = el.querySelector('.mnd-glance__cover'), q = el.querySelector('.mnd-glance__q'), out = el.querySelector('.mnd-glance__out'), go = el.querySelector('.mnd-glance__go');
  const pick = () => { const ks = GLANCE_PARTS.map(p => p.k).filter(k => k !== focal); focal = ks[Math.floor(Math.random() * ks.length)]; t++; };
  function show() {
    pick(); poster.innerHTML = glanceLayout(focal, t); out.textContent = ''; q.hidden = true; go.disabled = true;
    api.scene('scan'); api.sfx('swoosh');
    cover.classList.add('is-open');
    const ms = reduced() ? 1800 : 1000;
    later(() => { cover.classList.remove('is-open'); cover.querySelector('p').textContent = 'Gone. Answer from memory.'; q.hidden = false; q.querySelector('button')?.focus({ preventScroll: true }); }, ms);
  }
  go.addEventListener('click', show);
  q.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
    const ok = b.dataset.k === focal; q.hidden = true; cover.classList.add('is-open'); go.disabled = false; go.textContent = 'Again';
    const name = GLANCE_PARTS.find(p => p.k === focal).ar.toLowerCase();
    out.innerHTML = ok ? `<b>Exactly.</b> The ${name} was the biggest and clearest, so it became the <bdi class="en" dir="ltr">focal point</bdi>.` : `<b>No, it was the ${name}.</b> That was the biggest, highest-contrast thing. The eye goes to it first, wherever it sits.`;
    api.sfx(ok ? 'good' : 'bad');
    if (ok) api.award(5, { from: b, key: 'demo:mnd-glance' });
  }));
  return () => timers.forEach(clearTimeout);
}

function mountViewers(el, api) {
  const V = [
    { k: 'calm', ar: 'Loves simplicity', read: 'Calm and relaxing', why: 'Sees the empty space as rest, and the single element as focus.', en: 'calm' },
    { k: 'cold', ar: 'Loves detail', read: 'Cold and empty', why: 'Expects richness and detail, so simplicity feels like something is missing.', en: 'cold or empty' },
    { k: 'mourn', ar: 'From another culture', read: 'Sad?', why: 'In their culture, white and emptiness can bring a funeral to mind. Same design, different meaning.', en: 'cultural context' }
  ];
  let seen = new Set();
  el.innerHTML = `<div class="mnd-view"><div class="mnd-view__poster"></div><div class="mnd-view__side"><p class="label">Who’s looking?</p><div class="mnd-view__who" role="radiogroup" aria-label="Viewer">${V.map((v, i) => `<button type="button" role="radio" class="mnd-view__btn" data-i="${i}" aria-checked="false"><span class="hud-num">0${i + 1}</span> ${v.ar}</button>`).join('')}</div><div class="mnd-view__read" aria-live="polite"><b>—</b><span></span></div></div></div>`;
  const poster = el.querySelector('.mnd-view__poster'), read = el.querySelector('.mnd-view__read');
  const set = i => {
    const v = V[i]; poster.innerHTML = viewerPoster(v.k);
    el.querySelectorAll('.mnd-view__btn').forEach((b, j) => b.setAttribute('aria-checked', String(j === i)));
    read.querySelector('b').textContent = v.read; read.querySelector('span').innerHTML = `${v.why} <bdi class="en" dir="ltr">(${v.en})</bdi>`;
    seen.add(i); api.sfx('click'); if (seen.size === V.length) api.award(5, { from: read, key: 'demo:mnd-viewers' });
  };
  el.querySelectorAll('.mnd-view__btn').forEach(b => b.addEventListener('click', () => set(+b.dataset.i)));
  poster.innerHTML = viewerPoster('calm');
}

function mountLevers(el, api) {
  const L = {
    shape: { ar: 'Shape', opts: [['circle', 'Circle', 'friendly and safe'], ['square', 'Square', 'stable and trustworthy'], ['triangle', 'Triangle', 'dynamic and bold']] },
    type: { ar: 'Typeface', opts: [['serif', 'Serif', 'formal and classic'], ['sans', 'Sans', 'clean and contemporary'], ['script', 'Script', 'personal and romantic'], ['display', 'Display', 'loud and eye-catching']] },
    color: { ar: 'Color', opts: [['#4D6BFF', 'Blue', 'trust and calm'], ['#FF4A2E', 'Red', 'energy and urgency'], ['#FFC21A', 'Yellow', 'optimism and cheer'], ['#EDEBE6', 'White', 'clean and simple']] },
    space: { ar: 'Space', opts: [['airy', 'Airy', 'calm and relaxed'], ['dense', 'Crowded', 'urgent and intense']] }
  };
  const FONT = { serif: '"EB Garamond", serif', sans: '"IBM Plex Sans Arabic", sans-serif', script: 'Lobster, cursive', display: '"Bebas Neue", Impact, sans-serif' };
  const cur = { shape: 0, type: 1, color: 0, space: 0 }; const touched = new Set();
  el.innerHTML = `<div class="mnd-lev"><div class="mnd-lev__poster"></div><div class="mnd-lev__ctl">${Object.entries(L).map(([k, l]) => `<div class="mnd-lev__row"><span class="label">${l.ar}</span><div class="mnd-lev__seg" role="radiogroup" aria-label="${l.ar}">${l.opts.map((o, i) => `<button type="button" role="radio" data-k="${k}" data-i="${i}" aria-checked="${cur[k] === i}">${o[1]}</button>`).join('')}</div></div>`).join('')}<p class="mnd-lev__read" aria-live="polite"></p></div></div>`;
  const poster = el.querySelector('.mnd-lev__poster'), read = el.querySelector('.mnd-lev__read');
  const draw = () => {
    const sh = L.shape.opts[cur.shape][0], col = L.color.opts[cur.color][0], dense = L.space.opts[cur.space][0] === 'dense', fam = FONT[L.type.opts[cur.type][0]];
    const shape = sh === 'circle' ? `<circle cx="150" cy="${dense ? 70 : 78}" r="${dense ? 30 : 38}" fill="none" stroke="${col}" stroke-width="2"/>` : sh === 'square' ? `<rect x="${dense ? 120 : 112}" y="40" width="${dense ? 60 : 76}" height="${dense ? 60 : 76}" fill="none" stroke="${col}" stroke-width="2"/>` : `<path d="M150 ${dense ? 36 : 34}l${dense ? 36 : 44} ${dense ? 66 : 82}h-${dense ? 72 : 88}z" fill="none" stroke="${col}" stroke-width="2"/>`;
    const extra = dense ? `<g fill="#4E4C5A">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${18 + (i % 3) * 92}" y="${148 + Math.floor(i / 3) * 18}" width="${70 - (i % 2) * 18}" height="7" rx="2"/>`).join('')}<rect x="16" y="16" width="40" height="14" rx="3"/><rect x="246" y="16" width="38" height="14" rx="3"/><circle cx="268" cy="96" r="12"/><circle cx="30" cy="100" r="9"/></g>` : '';
    poster.innerHTML = `<svg viewBox="0 0 300 200" role="img" aria-label="A poster that changes with the four tools"><rect x=".5" y=".5" width="299" height="199" rx="12" fill="#101018" stroke="#2A2935"/>${shape}<text x="150" y="${dense ? 134 : 152}" text-anchor="middle" font-family='${fam}' font-size="${dense ? 22 : 26}" fill="${col}">Mind Games</text>${extra}</svg>`;
    read.innerHTML = `The feeling: ${[L.shape.opts[cur.shape][2], L.type.opts[cur.type][2], L.color.opts[cur.color][2], L.space.opts[cur.space][2]].map(s => `<b>${s}</b>`).join(' + ')}`;
  };
  el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.k; cur[k] = +b.dataset.i; touched.add(k);
    el.querySelectorAll(`[data-k="${k}"]`).forEach(x => x.setAttribute('aria-checked', String(x === b)));
    draw(); api.sfx('click');
    if (touched.size === 4) api.award(5, { from: read, key: 'demo:mnd-levers' });
  }));
  draw();
}
