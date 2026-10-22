// Lecture 02 — The psychology of shapes: informed use, shapes → emotions, lines, and the nine shape personalities.
// English edition of shape.js (same ids, blocks, scenes and demos).
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
/* the slide's nine cards (slides 10–12), exact wording.
   In this edition `ar` is the display name (the slide's heading), `arE` a short headline of the effect and
   `arS` the symbolism line — the same fields the Arabic edition fills with its Arabic glosses. */
export const SHAPE_CARDS = [
  { k: 'circle', ar: 'Circle', en: 'Circle', color: C.ultra, sym: 'Unity, infinity, wholeness, protection.', eff: 'Feels soft, safe, and inclusive.', use: 'Buttons in UI design, logos (e.g., Pepsi), social icons.', tip: 'Use circles to create a sense of harmony or friendliness.', arS: 'Symbolism: unity, infinity, wholeness, protection', arE: 'Soft, safe, inclusive' },
  { k: 'square', ar: 'Square / Rectangle', en: 'Square / Rectangle', color: C.red, sym: 'Stability, reliability, structure, honesty.', eff: 'Feels solid, grounded, and trustworthy.', use: 'Layouts, grids, containers, corporate logos.', tip: 'Use squares to convey professionalism and order.', arS: 'Symbolism: stability, reliability, structure, honesty', arE: 'Solid, grounded, trustworthy' },
  { k: 'triangle', ar: 'Triangle', en: 'Triangle', color: C.sun, sym: 'Direction, movement, tension, power.', eff: 'Feels dynamic, energetic, and sometimes aggressive.', use: 'Play buttons, warning signs, arrows.', tip: 'Use upward triangles for growth, downward for danger or grounding.', arS: 'Symbolism: direction, movement, tension, power', arE: 'Dynamic, energetic, sometimes aggressive' },
  { k: 'star', ar: 'Star', en: 'Star', color: C.sun, sym: 'Achievement, excellence, aspiration.', eff: 'Feels celebratory and attention-grabbing.', use: 'Ratings, awards, festive designs.', tip: 'Use sparingly to highlight key elements or achievements.', arS: 'Symbolism: achievement, excellence, aspiration', arE: 'Celebratory, attention-grabbing' },
  { k: 'polygon', ar: 'Polygon / Abstract Shapes', en: 'Polygon / Abstract', color: C.violet, sym: 'Depends on the number of sides and symmetry.', eff: 'Can feel modern, edgy, or chaotic.', use: 'Backgrounds, branding for tech or creative industries.', tip: 'Use to break monotony or add visual interest.', arS: 'Symbolism: depends on the number of sides and symmetry', arE: 'Modern, edgy, or chaotic' },
  { k: 'organic', ar: 'Organic / Freeform Shapes', en: 'Organic / Freeform', color: C.good, sym: 'Nature, creativity, spontaneity.', eff: 'Feels relaxed, artistic, and human.', use: 'Illustrations, art-based branding, wellness products.', tip: 'Use to soften rigid layouts or evoke natural themes.', arS: 'Symbolism: nature, creativity, spontaneity', arE: 'Relaxed, artistic, human' },
  { k: 'lines', ar: 'Lines and Arrows', en: 'Lines and Arrows', color: C.ice, sym: 'Direction, connection, emphasis.', eff: 'Guides the eye, creates flow.', use: 'Navigation, infographics, diagrams.', tip: 'Use arrows to lead users, lines to separate or connect elements.', arS: 'Symbolism: direction, connection, emphasis', arE: 'Guides the eye, creates flow' },
  { k: 'ellipse', ar: 'Ellipse / Oval', en: 'Ellipse / Oval', color: C.pink, sym: 'Continuity, elegance, motion.', eff: 'Feels smooth and graceful.', use: 'Portrait frames, logo elements, buttons.', tip: 'Use to create a sense of movement or softness.', arS: 'Symbolism: continuity, elegance, motion', arE: 'Smooth and graceful' },
  { k: 'combo', ar: 'Geometric Combinations', en: 'Geometric Combinations', color: C.fg, sym: 'Complexity, innovation, balance.', eff: 'Feels structured yet creative.', use: 'Modern branding, abstract art, tech interfaces.', tip: 'Combine shapes to tell layered stories or build visual metaphors.', arS: 'Symbolism: complexity, innovation, balance', arE: 'Structured yet creative' }
];
const CARD = Object.fromEntries(SHAPE_CARDS.map(c => [c.k, c]));
const cardBack = c => `<span class="shp-back"><b>Symbolism</b><small dir="ltr">${c.sym}</small><b>Psychological effect</b><small dir="ltr">${c.eff}</small><small class="shp-back__tip" dir="ltr">Tip: ${c.tip}</small></span>`;
const cardTable = keys => ({ t: 'table', head: ['', ...keys.map(k => CARD[k].ar)], rows: [['Symbolism', ...keys.map(k => `<span dir="ltr">${CARD[k].sym}</span>`)], ['Psychological effect', ...keys.map(k => `<span dir="ltr">${CARD[k].eff}</span>`)], ['Common uses', ...keys.map(k => `<span dir="ltr">${CARD[k].use}</span>`)], ['Design tip', ...keys.map(k => `<span dir="ltr">${CARD[k].tip}</span>`)]] });
// three shapes side by side would be four columns, too wide for a phone: the overview keeps the two big rows; uses and tips live in each quote below
const overviewTable = keys => ({ t: 'table', head: ['', 'Symbolism', 'Psychological effect'], rows: keys.map(k => [CARD[k].ar, `<span dir="ltr">${CARD[k].sym}</span>`, `<span dir="ltr">${CARD[k].eff}</span>`]) });

/* ---------- art ---------- */
const slide9Art = svg('0 0 600 220', `
  <g stroke="${C.red}" stroke-width="1.6"><rect x="40" y="40" width="70" height="70"/><rect x="58" y="58" width="70" height="70" opacity=".55"/><rect x="76" y="76" width="70" height="70" opacity=".3"/></g>
  <g stroke="${C.sun}" stroke-width="1.6"><path d="M300 34l58 112H242z"/><path d="M300 66l32 62h-64z" opacity=".45"/></g>
  <g stroke="${C.ice}" stroke-width="1.6"><path d="M470 34v112M494 34v112M518 34v112"/><path d="M450 64h96M450 88h96M450 112h96" opacity=".5"/></g>
  ${tx(93, 182, 'Square & Rectangle', { fill: C.fg, size: 14 })}${tx(93, 202, 'stability · consistency · balance', { size: 11.5 })}
  ${tx(300, 182, 'Triangles', { fill: C.fg, size: 14 })}${tx(300, 202, 'power · science · religious firms', { size: 11.5 })}
  ${tx(497, 182, 'Vertical & Horizontal', { fill: C.fg, size: 14 })}${tx(497, 202, 'aggression vs calm', { size: 11.5 })}`, 'Squares, a triangle, and vertical and horizontal lines');

const triplets = { t: 'table', head: ['The slide says', 'The three'], rows: [
  ['Shapes are used to', '<span dir="ltr">communicate meaning · guide perception · enhance user experience</span>'],
  ['Once you understand the associations, you can', '<span dir="ltr">reinforce brand identity · evoke emotion · direct attention</span>'],
  ['Informed use considers', '<span dir="ltr">cultural context · audience expectations · design goals</span>'],
  ['A visual language that goes beyond words makes design', '<span dir="ltr">intuitive · memorable · emotionally resonant</span>']
] };

const linesCompare = {
  t: 'compare',
  left: { title: 'Standing up', en: 'Vertical lines', art: svg('0 0 200 110', `<g stroke="${C.red}" stroke-width="2">${[30, 60, 90, 120, 150].map((x, i) => `<path d="M${x} ${12 + (i % 2) * 6}V${98 - (i % 3) * 4}"/>`).join('')}</g>`, 'Vertical lines'), text: 'Associated with **masculinity, endurance, aggression**. Upright and tense.' },
  right: { title: 'Lying down', en: 'Horizontal lines', art: svg('0 0 200 110', `<g stroke="${C.ice}" stroke-width="2">${[25, 45, 65, 85].map((y, i) => `<path d="M${20 + i * 4} ${y}H${180 - i * 4}" opacity="${1 - i * .15}"/>`).join('')}</g>`, 'Horizontal lines'), text: 'Depict **community, tranquility, calm**. Lying down and relaxed.' },
  note: 'The exact same line. The only difference: direction.'
};
const triCompare = {
  t: 'compare',
  left: { title: 'Pointing up', en: 'upward', art: svg('0 0 200 110', `<path d="M100 14l52 84H48z" stroke="${C.sun}" stroke-width="2"/><path d="M100 98V40M88 52l12-12 12 12" stroke="${C.good}" stroke-width="1.6"/>`, 'Upward triangle'), text: '**growth**: going up and rising. The arrow points up.' },
  right: { title: 'Pointing down', en: 'downward', art: svg('0 0 200 110', `<path d="M100 98L48 14h104z" stroke="${C.red}" stroke-width="2"/><path d="M100 14v58M88 60l12 12 12-12" stroke="${C.red}" stroke-width="1.6" opacity=".7"/>`, 'Downward triangle'), text: '**danger or grounding**: a warning, or being planted firmly on the ground.' },
  note: 'One shape. Its direction is what changes the sentence.'
};

/* ---------- lesson ---------- */
export default {
  zone: 'shape',
  hero: { say: '9 shapes, and every shape has a personality and something to say. After this zone, you’ll never look at a round button the same way again.' },
  chapters: [
    {
      id: 'shape-informed', title: 'A shape is a sentence, not decoration', en: 'The informed use of graphic shapes', ref: 'Lecture 02 · slide 6', scene: 'solids',
      blocks: [
        { t: 'say', who: 'trio', text: 'A beginner adds a circle because it “looks nice”. An informed designer adds it because they know what it will say.' },
        { t: 'p', text: 'The lecture calls this the **informed use of graphic shapes**. It means the shape is there on purpose and with a plan, not by accident.' },
        { t: 'quote', ref: 'L02 · S06', text: 'The informed use of graphic shapes refers to the intentional and strategic application of visual forms—such as circles, squares, triangles, and abstract shapes—to communicate meaning, guide perception, and enhance user experience.' },
        { t: 'quote', ref: 'L02 · S06', text: 'Shapes are not just decorative; they carry psychological and symbolic weight that influences how viewers interpret a design.' },
        { t: 'p', text: 'So every shape carries **psychological weight** and **symbolic weight**. And that weight changes the way the viewer interprets the design.' },
        { t: 'h', text: 'This slide is all threes', en: 'learn it in threes' },
        triplets,
        { t: 'tip', text: 'This slide loves the number three: most sentences list 3 things (except the weight sentence: that one has only two). If the question is “fill in the blank”, count the three in your head.' },
        { t: 'example', title: 'The reflective triangle behind the car', text: 'Nobody reads anything on it, and still every driver gets it: “watch out”. That’s a shape that **communicates meaning** and **directs attention** at the same moment.' },
        { t: 'why', text: 'Over the years, the brain learned that round things are usually safe, pointed things can hurt, and straight things are steady. So when it sees a shape, the feeling comes out before the thinking.' },
        { t: 'trap', text: 'The exam might ask: “Informed shape usage considers cultural context, audience expectations, and ______.” The answer is **design goals**.', wrong: 'cultural context, audience expectations, and decoration', right: 'cultural context, audience expectations, and design goals' },
        { t: 'check', q: 'mi12' },
        { t: 'quote', ref: 'L02 · S06', text: 'The power of graphic shapes lies in their ability to speak a visual language that transcends words, making design more intuitive, memorable, and emotionally resonant.' },
        { t: 'check', q: 'mi13' }
      ]
    },
    {
      id: 'shape-feel', title: 'Every shape stirs a feeling', en: 'Different shapes stimulate different emotions', ref: 'Lecture 02 · slides 8–9', scene: 'combo',
      blocks: [
        { t: 'say', who: 'trio', text: 'One sentence on the slide, but it’s the base of this whole zone: every shape stirs a different feeling.' },
        { t: 'quote', ref: 'L02 · S08', text: 'Different shapes stimulate different emotions.' },
        { t: 'check', q: 'sh01' },
        { t: 'demo', id: 'shp-mood', title: 'Change the shape, change the feeling', caption: 'Same space, roughly the same color. The shape alone changed what it says.', mount: mountMood },
        { t: 'h', text: 'Slide 9: 3 quick ideas', en: 'squares · triangles · lines' },
        { t: 'art', html: slide9Art, caption: 'An original drawing that sums up slide 9' },
        { t: 'quote', ref: 'L02 · S09', text: 'Square & Rectangle — Straight edge shapes imply stability and consistency in a more concrete sense. These can also be used to indicate balance.' },
        { t: 'p', text: 'Straight edges = **stability** and **consistency**. They can also give a feeling of **balance**.' },
        { t: 'check', q: 'sh23' },
        { t: 'quote', ref: 'L02 · S09', text: 'Triangles — Triangles tend to be viewed as a symbol of power and science. Triangular shapes are also popular in religious firms.' },
        { t: 'p', text: 'The triangle is a symbol of **power** and **science**. It’s also popular in **religious firms**. It looks like a tiny detail, but it comes up in the exam.' },
        { t: 'example', title: 'Look around you', text: 'Lots of tech and engineering company logos have triangles in them. And the pointed tops of minarets and church towers, and the Pyramids, give you a feeling of power and greatness. The shape works even if nobody explains it.' },
        { t: 'trap', text: 'Triangles = **power and science**. Squares = **stability and consistency**. Don’t swap them.', wrong: 'Triangles = stability and consistency', right: 'Triangles = power and science · popular in religious firms' },
        { t: 'check', q: 'sh24' }
      ]
    },
    {
      id: 'shape-lines', title: 'Standing lines, lying lines', en: 'Vertical vs horizontal lines', ref: 'Lecture 02 · slide 9', scene: 'vlines',
      blocks: [
        { t: 'say', who: 'line', text: 'One line. Turn it 90 degrees… and the whole feeling flips.' },
        { t: 'quote', ref: 'L02 · S09', text: 'Horizontal & Vertical Lines — Vertical lines are associated with masculinity, endurance and aggression. Horizontal lines depict community, tranquility and calm.' },
        linesCompare,
        { t: 'demo', id: 'shp-lines', title: 'Turn the lines', caption: 'The eye reads direction before anything else: standing = masculinity, endurance, aggression. Lying down = community, tranquility, calm.', mount: mountLines },
        { t: 'example', title: 'The sea and the towers', text: 'The Alexandria Corniche (the long road along the sea): the sea line is horizontal, and the feeling is tranquility. A tall tower downtown: vertical lines, and the feeling is masculinity, endurance, aggression. Same city, two feelings.' },
        { t: 'why', text: 'A horizontal line looks like the ground, or a body at rest, so we feel calm. A vertical line looks like a man standing up straight and tense, so we feel masculinity, endurance, aggression.' },
        { t: 'check', q: 'sh25' },
        { t: 'check', q: 'sh26' },
        { t: 'trap', text: 'If the question is about a **spa** poster that should look calm, the answer is **horizontal** lines. And if it’s about a kids’ sleep app full of sharp triangles and vertical lines, it feels dynamic and maybe aggressive, so it’s wrong for a calm app.', wrong: 'Spa = vertical lines', right: 'Spa = horizontal lines (tranquility, calm)' },
        { t: 'check', q: 'sh27' },
        { t: 'tip', text: 'Vertical = a man standing in a long queue (masculinity, endurance, aggression). Horizontal = friends sitting together on the Corniche wall (community, tranquility, calm).' },
        { t: 'check', q: 'sh30' }
      ]
    },
    {
      id: 'shape-circle-square', title: 'The circle and the square', en: 'Circle · Square / Rectangle', ref: 'Lecture 02 · slide 10', scene: 'circle',
      blocks: [
        { t: 'say', who: 'circle', text: 'The circle makes you feel safe. The square gives you confidence. And both work on you every day without you noticing.' },
        { t: 'p', text: 'Every shape in the lecture comes with 4 things: **Symbolism**, **Psychological effect**, **Common uses**, and a **Design tip**. Learn all four for every shape.' },
        cardTable(['circle', 'square']),
        { t: 'h', text: 'The circle' },
        { t: 'quote', ref: 'L02 · S10', text: 'Circle — Symbolism: Unity, infinity, wholeness, protection. Psychological effect: Feels soft, safe, and inclusive.' },
        { t: 'example', title: 'Buttons and icons', text: 'The app icons on your phone, the record button in the camera, the profile pictures in your chats: all circles, or rounded at the edges. Because the feeling is safe and friendly.' },
        { t: 'check', q: 'sh02' },
        { t: 'check', q: 'sh03' },
        { t: 'trap', text: 'A **NOT** question: which is **not** a common use of circles? The uses are: Buttons in UI design, logos, social icons. Warning signs belong to the triangle.', wrong: 'Circles → warning signs', right: 'Circles → buttons, logos, social icons' },
        { t: 'check', q: 'sh29' },
        { t: 'check', q: 'sh28' },
        { t: 'h', text: 'The square and the rectangle' },
        { t: 'quote', ref: 'L02 · S10', text: 'Square / Rectangle — Symbolism: Stability, reliability, structure, honesty. Psychological effect: Feels solid, grounded, and trustworthy.' },
        { t: 'example', title: 'The grid you live in', text: 'The photo grid on your profile, your lecture timetable, your bank card: all squares and rectangles. And banks love the square, because it says “we’re steady and respectable”.' },
        { t: 'check', q: 'sh04' },
        { t: 'check', q: 'sh05' },
        { t: 'tip', text: 'Circle = a hug (safety). Square = a bank (trust and order).' }
      ]
    },
    {
      id: 'shape-triangle', title: 'The triangle: up or down?', en: 'Triangle', ref: 'Lecture 02 · slide 10', scene: 'triangle',
      blocks: [
        { t: 'say', who: 'triangle', text: 'The triangle is the most hot-headed shape in the family. It’s always heading somewhere. The only question: where?' },
        cardTable(['triangle']),
        { t: 'quote', ref: 'L02 · S10', text: 'Triangle — Symbolism: Direction, movement, tension, power. Psychological effect: Feels dynamic, energetic, and sometimes aggressive. Common uses: Play buttons, warning signs, arrows.' },
        { t: 'p', text: 'The triangle has **direction**, **movement**, **tension** and **power**. It feels dynamic and energetic, **and sometimes aggressive**.' },
        { t: 'check', q: 'sh06' },
        { t: 'check', q: 'sh07' },
        { t: 'example', title: '3 places you’ll see a triangle today', text: 'The **Play** button on any video. The warning sign on the road. And the arrows that tell you “go this way”.' },
        { t: 'check', q: 'sh10' },
        { t: 'h', text: 'The tip: direction is everything', en: 'design tip' },
        { t: 'quote', ref: 'L02 · S10', text: 'Design tip: Use upward triangles for growth, downward for danger or grounding.' },
        triCompare,
        { t: 'demo', id: 'shp-tri', title: 'Flip the triangle', caption: 'Up = growth. Down = danger, or grounding (planted on the ground).', mount: mountTri },
        { t: 'why', text: 'A triangle pointing up looks like a mountain or a rising arrow, so we read it as ambition and growth. One pointing down stands on a single point, so it’s either unstable (danger) or pulling down to the ground (**grounding**).' },
        { t: 'check', q: 'sh08' },
        { t: 'trap', text: 'A personal-growth coach wants a symbol for growth? A triangle pointing **up**. Don’t pick “down” just because it looks stable.', wrong: 'Growth → downward triangle', right: 'Growth → upward triangle' },
        { t: 'check', q: 'sh09' }
      ]
    },
    {
      id: 'shape-rest', title: 'The star, the polygon and the freeform shape', en: 'Star · Polygon / Abstract · Organic / Freeform', ref: 'Lecture 02 · slide 11', scene: 'star',
      blocks: [
        { t: 'say', who: 'star', text: 'These three are the “difficult characters”: one loves the spotlight, one’s mood depends on how many sides it has, and one is an artist who hates rules.' },
        overviewTable(['star', 'polygon', 'organic']),
        { t: 'h', text: 'The star' },
        { t: 'quote', ref: 'L02 · S11', text: 'Star — Symbolism: Achievement, excellence, aspiration. Psychological effect: Feels celebratory and attention-grabbing. Common uses: Ratings, awards, festive designs. Design tip: Use sparingly to highlight key elements or achievements.' },
        { t: 'example', title: 'Rating the restaurant', text: 'The 5 stars when you rate a restaurant or an Uber ride, the “Employee of the Month” badge, the Ramadan and Eid decorations. The star says “this is special”.' },
        { t: 'trap', text: 'The star’s design tip: use it **sparingly**. If everything is a star, nothing stands out.', wrong: 'Use stars generously everywhere', right: 'Use sparingly to highlight key elements or achievements' },
        { t: 'check', q: 'sh11' },
        { t: 'check', q: 'sh12' },
        { t: 'h', text: 'Polygons and abstract shapes' },
        { t: 'quote', ref: 'L02 · S11', text: 'Polygon / Abstract Shapes — Symbolism: Depends on the number of sides and symmetry. Psychological effect: Can feel modern, edgy, or chaotic. Common uses: Backgrounds, branding for tech or creative industries. Design tip: Use to break monotony or add visual interest.' },
        { t: 'p', text: 'The polygon has no fixed meaning. Its meaning **depends on the number of sides and symmetry**. Try it yourself:' },
        { t: 'demo', id: 'shp-sides', title: 'Add sides, break the symmetry', caption: 'The exam answer never changes: **depends on the number of sides and symmetry**. The words under the shape are a rough feeling, just to help you get the idea.', mount: mountSides },
        { t: 'check', q: 'sh13' },
        { t: 'check', q: 'sh14' },
        { t: 'h', text: 'Organic, freeform shapes' },
        { t: 'quote', ref: 'L02 · S11', text: 'Organic / Freeform Shapes — Symbolism: Nature, creativity, spontaneity. Psychological effect: Feels relaxed, artistic, and human. Common uses: Illustrations, art-based branding, wellness products. Design tip: Use to soften rigid layouts or evoke natural themes.' },
        { t: 'example', title: 'A natural-products brand', text: 'Natural soap and oil packaging loves blobs and freeform shapes that look like leaves and water. The shape says “natural and relaxed”, and it breaks the stiffness of the grid.' },
        { t: 'check', q: 'sh15' },
        { t: 'check', q: 'sh16' },
        { t: 'tip', text: 'Star = the celebrity (achievement). Polygon = its meaning depends on its sides and symmetry. Freeform = the artist (nature, creativity).' }
      ]
    },
    {
      id: 'shape-flow', title: 'Lines, ovals and combinations', en: 'Lines & Arrows · Ellipse / Oval · Geometric Combinations', ref: 'Lecture 02 · slide 12', scene: 'arrow',
      blocks: [
        { t: 'say', who: 'line', text: 'The last three in the family: one that points the way, one that’s graceful, and one that makes a team out of everyone.' },
        overviewTable(['lines', 'ellipse', 'combo']),
        { t: 'h', text: 'Lines and arrows' },
        { t: 'quote', ref: 'L02 · S12', text: 'Lines and Arrows — Symbolism: Direction, connection, emphasis. Psychological effect: Guides the eye, creates flow. Common uses: Navigation, infographics, diagrams. Design tip: Use arrows to lead users, lines to separate or connect elements.' },
        { t: 'example', title: 'The metro map', text: 'Lines connect the stations, and arrows tell you the direction. Without a single sentence, your eye follows a clear **flow**.' },
        { t: 'check', q: 'sh17' },
        { t: 'check', q: 'sh18' },
        { t: 'h', text: 'The ellipse (oval)' },
        { t: 'quote', ref: 'L02 · S12', text: 'Ellipse / Oval — Symbolism: Continuity, elegance, motion. Psychological effect: Feels smooth and graceful. Common uses: Portrait frames, logo elements, buttons. Design tip: Use to create a sense of movement or softness.' },
        { t: 'trap', text: 'Portrait frames = **ellipse / oval**, not circle. The circle is the one with **unity, infinity**.', wrong: 'Portrait frames → circle', right: 'Portrait frames → ellipse / oval' },
        { t: 'check', q: 'sh19' },
        { t: 'check', q: 'sh20' },
        { t: 'h', text: 'Geometric combinations' },
        { t: 'quote', ref: 'L02 · S12', text: 'Geometric Combinations — Symbolism: Complexity, innovation, balance. Psychological effect: Feels structured yet creative. Common uses: Modern branding, abstract art, tech interfaces. Design tip: Combine shapes to tell layered stories or build visual metaphors.' },
        { t: 'p', text: 'When you combine shapes, you build a longer sentence. Like a symbol that joins people, places and love in one shape. That’s called a **visual metaphor**.' },
        { t: 'check', q: 'sh21' },
        { t: 'check', q: 'sh22' },
        { t: 'h', text: 'The full deck: 9 shapes' },
        { t: 'p', text: 'Flip every card. The front shows the shape; the back has the symbolism, the psychological effect and the tip, in the slide’s own words.' },
        { t: 'grid', cols: 3, flip: true, items: SHAPE_CARDS.map(c => ({ title: c.ar, text: cardBack(c), art: SHAPE_GLYPH[c.k], color: c.color })) },
        { t: 'trap', text: 'The most famous “which is wrong” question in this zone: it sticks one shape’s feeling onto another shape. “Relaxed, artistic, and human” is the freeform shape, not the star.', wrong: 'Star — feels relaxed, artistic, and human', right: 'Star — feels celebratory and attention-grabbing' },
        { t: 'check', q: 'sh31' },
        { t: 'tip', text: 'The line points the way (direction, connection). The oval is graceful (frames, motion). The combination tells a layered story.' }
      ]
    }
  ]
};

/* ---------- demos ---------- */
function mountMood(el, api) {
  const keys = ['circle', 'square', 'triangle', 'star', 'organic'];
  const scenes = { circle: 'circle', square: 'square', triangle: 'triangle', star: 'star', organic: 'organic' };
  let cur = -1; const seen = new Set();
  el.innerHTML = `<div class="shp-mood"><div class="shp-mood__fig" aria-hidden="true"></div><div class="shp-mood__side"><div class="shp-seg" role="radiogroup" aria-label="Shape">${keys.map((k, i) => `<button type="button" role="radio" aria-checked="false" data-i="${i}">${CARD[k].ar.replace('Organic / Freeform Shapes', 'Freeform')}</button>`).join('')}</div><div class="shp-mood__read" aria-live="polite"><b></b><span></span><small dir="ltr"></small></div></div></div>`;
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
  el.innerHTML = `<div class="shp-lines"><div class="shp-lines__fig">${svg('0 0 240 160', `<g class="shp-lines__g" stroke="currentColor" stroke-width="2.2">${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${60 + i * 20} 22V138" opacity="${.45 + (i % 3) * .2}"/>`).join('')}</g>`, 'Lines that turn')}</div><div class="shp-lines__side"><button type="button" class="btn btn--zone">Turn 90°</button><div class="shp-lines__read" aria-live="polite"><b></b><small dir="ltr"></small></div></div></div>`;
  const g = el.querySelector('.shp-lines__g'), read = el.querySelector('.shp-lines__read'), fig = el.querySelector('.shp-lines__fig');
  let turns = 0;
  const paint = user => {
    g.style.transform = vertical ? 'rotate(0deg)' : 'rotate(90deg)';
    fig.style.color = vertical ? C.red : C.ice;
    read.querySelector('b').textContent = vertical ? 'Masculinity, endurance, aggression' : 'Community, tranquility, calm';
    read.querySelector('small').textContent = vertical ? 'Vertical lines' : 'Horizontal lines';
    if (user) api.scene(vertical ? 'vlines' : 'hlines');
  };
  el.querySelector('button').addEventListener('click', e => { vertical = !vertical; turns++; paint(true); api.sfx('swoosh'); if (turns >= 2) api.award(5, { from: e.currentTarget, key: 'demo:shp-lines' }); });
  paint();
}
function mountTri(el, api) {
  let up = true, flips = 0;
  el.innerHTML = `<div class="shp-lines"><div class="shp-lines__fig shp-tri__fig">${svg('0 0 240 160', `<g class="shp-tri__g" stroke="currentColor" stroke-width="2.2"><path d="M120 22l62 112H58z"/></g>`, 'A triangle that flips')}</div><div class="shp-lines__side"><button type="button" class="btn btn--zone">Flip the triangle</button><div class="shp-lines__read" aria-live="polite"><b></b><small dir="ltr"></small></div></div></div>`;
  const g = el.querySelector('.shp-tri__g'), read = el.querySelector('.shp-lines__read'), fig = el.querySelector('.shp-tri__fig');
  const paint = user => {
    g.style.transform = up ? 'rotate(0deg)' : 'rotate(180deg)'; fig.style.color = up ? C.sun : C.red;
    read.querySelector('b').textContent = up ? 'Growing, rising' : 'Danger… or rooted to the ground';
    read.querySelector('small').textContent = up ? 'Upward triangles for growth' : 'Downward for danger or grounding';
    if (user) api.scene(up ? 'triangle' : 'triangleDown');
  };
  el.querySelector('button').addEventListener('click', e => { up = !up; flips++; paint(true); api.sfx('flip'); if (flips >= 2) api.award(5, { from: e.currentTarget, key: 'demo:shp-tri' }); });
  paint();
}
function mountSides(el, api) {
  let n = 6, sym = true, moved = 0;
  el.innerHTML = `<div class="shp-sides"><div class="shp-sides__fig">${svg('0 0 200 200', '<path class="shp-sides__p" stroke="currentColor" stroke-width="2"/>', 'A polygon with a changing number of sides')}</div><div class="shp-sides__side"><label class="shp-range"><span class="label">Number of sides</span><span class="hud-num shp-sides__n">6</span><input type="range" min="3" max="12" value="6" aria-label="Number of sides"></label><button type="button" class="btn btn--sm" aria-pressed="false">Break the symmetry</button><div class="shp-lines__read" aria-live="polite"><b></b><small></small></div></div></div>`;
  const p = el.querySelector('.shp-sides__p'), range = el.querySelector('input'), btn = el.querySelector('button'), read = el.querySelector('.shp-lines__read');
  const feel = () => !sym ? ['Chaotic and tense', 'The symmetry is gone, so the feeling turned **chaotic**.'] : n === 3 ? ['Sharp and on the move', 'Close to the triangle’s personality.'] : n === 4 ? ['Steady and orderly', 'Close to the square’s personality.'] : n <= 6 ? ['Modern and balanced', 'A clean, techy feeling.'] : n <= 9 ? ['Edgy and modern', 'Lots of corners, but still orderly.'] : ['Soft, almost a circle', 'The more sides you add, the closer it gets to a circle.'];
  const paint = () => {
    p.setAttribute('d', polyD(100, 104, 74, n, sym ? 0 : .5, n * 7 + 3)); el.querySelector('.shp-sides__n').textContent = n;
    const [a, b] = feel(); read.querySelector('b').textContent = a; read.querySelector('small').innerHTML = api.rich(b);
    btn.setAttribute('aria-pressed', String(!sym)); btn.textContent = sym ? 'Break the symmetry' : 'Bring the symmetry back';
  };
  range.addEventListener('input', () => { n = +range.value; moved++; paint(); if (moved === 1) api.scene('polygon'); if (moved > 4) api.award(5, { from: range, key: 'demo:shp-sides' }); });
  btn.addEventListener('click', () => { sym = !sym; paint(); api.sfx('click'); api.scene(sym ? 'polygon' : 'organic'); });
  paint();
}
