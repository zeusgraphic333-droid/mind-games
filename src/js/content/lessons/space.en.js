// Lecture 02 — The psychology of space: emptiness as a design element, mood, active vs passive whitespace,
// and what negative space does to the mind. English edition of space.js (same ids, blocks, scenes and demos).
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
  return svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="12" fill="${C.ink}" stroke="#2A2935"/>${extra}<circle cx="160" cy="${86 - t * 10}" r="${26 - t * 8}" stroke="${C.ice}" stroke-width="1.6" fill="${C.ink}"/>${tx(160, 150 - t * 14, 'Spring Fair', { fill: C.fg, size, font: 'Alexandria', weight: 800, extra: `stroke="${C.ink}" stroke-width="${t > .4 ? 4 : 0}" paint-order="stroke"` })}`, 'A poster that gets more crowded or emptier');
}
/** a layout whose space is either active (deliberate, asymmetric) or passive (default gaps) */
export function spaceLayout(kind = 'active', fill = C.ink, seed = 3) {
  const r = rnd(seed);
  if (kind === 'active') {
    const left = r() > .5; const ox = left ? 196 : 28;
    // LTR: the word sits opposite the block, so its anchors mirror the Arabic edition's (start ↔ end)
    return svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="12" fill="${fill}" stroke="#2A2935"/>
      <rect x="${ox}" y="44" width="96" height="120" rx="4" fill="${C.ice}" opacity=".9"/>
      ${tx(left ? 28 : 292, 178, 'Calm', { fill: C.fg, size: 22, font: 'Alexandria', weight: 800, anchor: left ? 'start' : 'end' })}
      <rect x="${left ? 28 : 214}" y="188" width="78" height="5" rx="2" fill="${C.mute}"/>`, 'Deliberate, asymmetric space');
  }
  let lines = '';
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) lines += `<rect x="${24 + j * 70}" y="${30 + i * 18}" width="${52 + (i + j) % 3 * 4}" height="6" rx="2" fill="${C.mute}"/>`;
  return svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="12" fill="${fill}" stroke="#2A2935"/>${lines}`, 'Default spacing between lines and elements');
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
  ${tx(75, 140, 'Strikes balance', { fill: C.fg, size: 13 })}${tx(75, 160, 'spreads the weight', { size: 12 })}
  ${tx(200, 140, 'Evokes imagination', { fill: C.fg, size: 13 })}${tx(200, 160, 'lets the mind fill in', { size: 12 })}
  ${tx(320, 140, 'Emphasizes object', { fill: C.fg, size: 13 })}${tx(320, 160, 'makes it the hero', { size: 12 })}
  ${tx(430, 140, 'Eliminates clutter', { fill: C.fg, size: 13 })}${tx(430, 160, 'clears the mess', { size: 12 })}
  ${tx(538, 140, 'Implies luxury', { fill: C.fg, size: 13 })}${tx(538, 156, 'and sophistication', { fill: C.fg, size: 12 })}${tx(538, 176, 'looks expensive', { size: 12 })}
  <path d="M40 200h520" stroke="${C.faint}" stroke-dasharray="2 6"/>${tx(300, 228, 'What negative space does psychologically', { size: 12 })}`, 'Five things negative space does');

const notWhite = svg('0 0 600 170', `
  <rect x="20" y="20" width="170" height="130" rx="8" fill="#EDEBE6"/><rect x="70" y="60" width="40" height="40" fill="#101018"/>
  <rect x="215" y="20" width="170" height="130" rx="8" fill="#B8301A"/><rect x="265" y="60" width="40" height="40" fill="#EDEBE6"/>
  <defs><pattern id="spc-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.3" fill="#7FE7FF" opacity=".55"/></pattern></defs>
  <rect x="410" y="20" width="170" height="130" rx="8" fill="#0E1A22"/><rect x="410" y="20" width="170" height="130" rx="8" fill="url(#spc-dots)"/><rect x="460" y="60" width="40" height="40" fill="#EDEBE6"/>
  ${tx(105, 166, 'white', { size: 12 })}${tx(300, 166, 'color', { size: 12 })}${tx(495, 166, 'pattern', { size: 12 })}`, 'The same space: white, a color, and a pattern');

/* ---------- lesson ---------- */
export default {
  zone: 'space',
  hero: { say: 'In a lot of designs, the most important element… is the part with nothing in it. Seriously. This zone will make you respect empty space.' },
  chapters: [
    {
      id: 'space-psych', title: 'Empty isn’t empty', en: 'The psychology of space in graphic design', ref: 'Lecture 02 · slides 13–14', scene: 'clearing',
      blocks: [
        { t: 'say', who: 'void', text: 'Look at the empty part of any classy ad. It isn’t empty. It’s working harder than anything else in the ad.' },
        { t: 'quote', ref: 'L02 · S14', text: 'The psychology of space in graphic design revolves around how the use—or absence—of space influences perception, emotion, and behavior.' },
        { t: 'p', text: 'So having space, or not having it, changes 3 things in you: how you see (**perception**), what you feel (**emotion**), and what you do next (**behavior**). Stop? Read? Tap? Walk away?' },
        { t: 'check', q: 'sp05' },
        { t: 'quote', ref: 'L02 · S14', text: 'Space isn’t just emptiness; it’s a powerful design element that shapes how viewers interact with content. When used intentionally, space can create clarity, focus, and emotional tone.' },
        { t: 'grid', cols: 3, items: [
          { title: 'Clarity', text: 'The elements aren’t stuck together, so the meaning shows.', art: svg('0 0 48 48', '<rect x="8" y="10" width="12" height="12" stroke="currentColor" stroke-width="1.6"/><rect x="28" y="26" width="12" height="12" stroke="currentColor" stroke-width="1.6"/>'), color: C.ice },
          { title: 'Focus', text: 'The space around an element points at it.', art: svg('0 0 48 48', '<circle cx="24" cy="24" r="17" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 4"/><circle cx="24" cy="24" r="4" fill="currentColor"/>'), color: C.ice },
          { title: 'Emotional tone', text: 'Roomy = calm. Crowded = urgent.', art: svg('0 0 48 48', '<path d="M6 30c6-10 12-10 18 0s12 10 18 0" stroke="currentColor" stroke-width="1.6"/>'), color: C.ice }
        ] },
        { t: 'example', title: 'A koshary sign and a café menu', text: 'The sign over a koshary shop (Egypt’s cheap, fast rice-lentil-and-pasta meal) is packed with prices, photos and colors: it feels fast, cheap and in a hurry. The menu at a quiet café has a few items and lots of space: it feels like “take your time”. The main difference? Space.' },
        { t: 'why', text: 'The brain needs places to rest while it looks. Space cuts information into small, easy pieces, and tells the eye “the important thing is here”.' },
        { t: 'trap', text: 'True or false: “Space is just empty area.” **False**. The lecture calls it **a powerful design element**.', wrong: 'Space is just emptiness', right: 'Space is a powerful design element that shapes how viewers interact with content' },
        { t: 'check', q: 'sp18' },
        { t: 'tip', text: 'Space plays with 3 things: **perception, emotion, behavior**. See it, feel it, act on it.' }
      ]
    },
    {
      id: 'space-mood', title: 'The mood of space', en: 'Open & airy vs dense & compact', ref: 'Lecture 02 · slide 14', scene: 'airy',
      blocks: [
        { t: 'say', who: 'void', text: 'Same poster. Take things out, and it calms down. Add things, and it gets tense. Space is the mood dial.' },
        { t: 'quote', ref: 'L02 · S14', text: 'Psychologically, space affects mood. Open, airy designs can feel calm and inviting, while dense, compact layouts may feel intense or urgent.' },
        { t: 'demo', id: 'spc-density', title: 'The mood dial', caption: 'Move the slider. Same main elements, but the crowding flips the feeling from “calm and inviting” to “intense or urgent”.', mount: mountDensity },
        { t: 'compare', left: { title: 'Roomy', en: 'open, airy', text: 'Feels **calm and inviting**: quiet, and it says “come on in”.' }, right: { title: 'Crowded', en: 'dense, compact', text: 'Feels **intense or urgent**: packed and rushed, grab it before it’s gone.' } },
        { t: 'example', title: 'A big-sale ad vs a perfume ad', text: 'The sale ad is crammed with numbers, stars and colors, because it wants you to feel the chance is slipping away. The perfume ad has one bottle and lots of empty space, because it wants you to feel calm and value.' },
        { t: 'check', q: 'sp06' },
        { t: 'h', text: 'Culture has a say too', en: 'cultural factors' },
        { t: 'quote', ref: 'L02 · S14', text: 'Cultural factors play a role too—some audiences associate minimalism with modernity, while others may interpret it as lacking substance.' },
        { t: 'p', text: 'The same minimal design: one audience sees it as **modern**, another sees it as **empty, with nothing in it** (**lacking substance**). What do you think your grandma would say about a white wedding card with two lines on it?' },
        { t: 'trap', text: 'The words they ask about: roomy = **calm and inviting**, crowded = **intense or urgent**. And for some people, minimal = **lacking substance**.', wrong: 'Dense layouts feel calm and inviting', right: 'Dense, compact layouts may feel intense or urgent' },
        { t: 'check', q: 'sp07' },
        { t: 'tip', text: 'Roomy = the sea. Crowded = a microbus stop at 5 pm (Cairo’s shared minibuses at rush hour).' }
      ]
    },
    {
      id: 'space-active', title: 'Space by decision, space by default', en: 'Active vs passive whitespace', ref: 'Lecture 02 · slide 13', scene: 'activeSpace',
      blocks: [
        { t: 'say', who: 'void', text: 'There are two kinds of space: one you decided on to create movement, and one that’s just there so the text can be read. The exam loves asking about the difference.' },
        { t: 'compare', left: { title: 'Space on purpose', en: 'Active whitespace', art: spaceLayout('active', C.ink, 4), text: 'The deliberate asymmetric space intended to make design more lively. In short: it’s **on purpose**, it’s **not symmetrical**, and it brings the design to life.' }, right: { title: 'Everyday space', en: 'Passive whitespace', art: spaceLayout('passive'), text: 'The default space between characters and different design elements. In short: the **normal** gaps between letters and between elements.' }, note: 'Active = a decision. Passive = the default.' },
        { t: 'quote', ref: 'L02 · S13', text: 'Active whitespace — the deliberate asymmetric space intended to make design more lively. Passive whitespace — the default space between characters and different design elements.' },
        { t: 'demo', id: 'spc-active', title: 'Switch the type of space… and its color', caption: 'Notice: even if you paint the space red or put a pattern in it, it’s still **white space**.', mount: mountActive },
        { t: 'example', title: 'An art-show poster', text: 'The painting is pushed into one corner, the small title sits in the other corner, and half the poster is empty. That’s a decision. That space creates movement and a nice tension. That’s **active**. The space between the lines in the catalogue inside? That’s **passive**.' },
        { t: 'check', q: 'sp01' },
        { t: 'check', q: 'sp02' },
        { t: 'check', q: 'sp17' },
        { t: 'h', text: 'White space doesn’t have to be white', en: 'any color or pattern' },
        { t: 'art', html: notWhite, caption: 'One square. The space around it: white, a color, a pattern. All three are **white space**.' },
        { t: 'quote', ref: 'L02 · S13', text: 'The white space doesn’t have to be White. It can be any color or pattern.' },
        { t: 'why', text: 'It’s called “white” because back in the print days, paper was white. But the idea is **the absence of elements**, not the color of the paper.' },
        { t: 'trap', text: 'True or false: “White space has to be white.” **False**. And remember its other name: **negative space**.', wrong: 'White space has to be white', right: 'It can be any color or pattern' },
        { t: 'check', q: 'sp03' },
        { t: 'check', q: 'sp04' },
        { t: 'tip', text: '**A**ctive = **A**rranged on purpose: deliberate, asymmetric, makes the design lively. **P**assive = **P**reset: the default gaps between characters and elements.' }
      ]
    },
    {
      id: 'space-negative', title: 'What does space do to your mind?', en: 'What negative space does psychologically', ref: 'Lecture 02 · slides 15–16', scene: 'clearing',
      blocks: [
        { t: 'say', who: 'void', text: 'Negative space talks without a single word. And the lecture lists what it says.' },
        { t: 'quote', ref: 'L02 · S15', text: 'The psychology of negative space in graphic design is all about how “emptiness” speaks volumes. Far from being just blank areas, negative space (also called white space) plays a crucial role in shaping how people perceive, feel, and respond to a design.' },
        { t: 'art', html: effectsArt, caption: 'Slide 15 shows 5 things negative space does' },
        { t: 'list', style: 'num', items: ['**Strikes balance**: it spreads the weight across the design.', '**Evokes imagination**: it leaves a gap for the brain to fill in.', '**Emphasizes object**: the only thing in the space becomes the hero.', '**Eliminates clutter**.', '**Implies luxury and sophistication**.'] },
        { t: 'h', text: 'Turn down the noise', en: 'Focuses attention' },
        { t: 'quote', ref: 'L02 · S16', text: 'Focuses Attention — Negative space helps isolate key elements, guiding the viewer’s eye to what’s most important. It’s like turning down the noise so the message can sing.' },
        { t: 'demo', id: 'spc-noise', title: 'Turn down the noise… and the message will sing', caption: 'Every click clears some clutter. Notice how the message gets louder without getting bigger.', mount: mountNoise },
        { t: 'check', q: 'sp11' },
        { t: 'h', text: 'Space = money', en: 'Suggests quality and sophistication' },
        { t: 'quote', ref: 'L02 · S16', text: 'Suggests Quality and Sophistication — High-end brands often use generous negative space to signal refinement and exclusivity.' },
        { t: 'example', title: 'An expensive shop window', text: 'The expensive clothes shop puts just 3 pieces in its big window. The sale shop puts 300. Which one felt more expensive? The space told you before the price did.' },
        { t: 'check', q: 'sp12' },
        { t: 'why', text: 'In the real world, space costs money. So when a brand “wastes” a lot of space on one element, the brain reads that as confidence and luxury.' },
        { t: 'trap', text: 'A **NOT** question: negative space does all of the above, except **create a sense of urgency**. Urgency belongs to crowded layouts.', wrong: 'Negative space creates a sense of urgency', right: 'Dense layouts with little negative space can feel urgent' },
        { t: 'check', q: 'sp10' },
        { t: 'tip', text: 'Negative space: balance, imagination, a hero, no clutter, luxury. And the golden line: **turning down the noise so the message can sing**.' }
      ]
    },
    {
      id: 'space-breathe', title: 'Breathing, reading, feeling', en: 'Breathing room · readability · emotion', ref: 'Lecture 02 · slides 14 & 16', scene: 'passiveSpace',
      blocks: [
        { t: 'say', who: 'void', text: 'The last 3 powers of space make the difference between a page that gets read and a page that gets closed at first glance.' },
        { t: 'quote', ref: 'L02 · S14', text: 'White space (also called negative space) gives breathing room to a design. It helps reduce cognitive overload, making content easier to digest and more visually appealing.' },
        { t: 'check', q: 'sp08' },
        { t: 'p', text: '**Cognitive overload** means your brain is carrying more than it can handle. Space lightens that load, so the content is **easier to digest**.' },
        { t: 'check', q: 'sp09' },
        { t: 'h', text: 'Let the design breathe', en: 'Creates breathing room' },
        { t: 'quote', ref: 'L02 · S16', text: 'Creates Breathing Room — Designs with ample negative space feel calm, open, and approachable. This reduces cognitive load and makes content easier to absorb.' },
        { t: 'check', q: 'sp13' },
        { t: 'h', text: 'Easier to read, easier to understand', en: 'Improves readability and comprehension' },
        { t: 'quote', ref: 'L02 · S16', text: 'Improves Readability and Comprehension — Space between lines, paragraphs, and elements helps the brain process information more efficiently. It’s not just aesthetic—it’s functional.' },
        { t: 'demo', id: 'spc-leading', title: 'The space between lines', caption: 'The right space between lines isn’t a matter of taste. It does a job: the brain reads faster and understands more.', mount: mountLeading },
        { t: 'example', title: 'The study booklet', text: 'A course booklet printed in tiny type, with the lines glued together, tires your eyes after two pages. The same text with comfortable spacing, you finish faster. That’s what **it’s functional** means.' },
        { t: 'check', q: 'sp14' },
        { t: 'h', text: 'It moves your feelings', en: 'Evokes emotion' },
        { t: 'quote', ref: 'L02 · S16', text: 'Evokes Emotion — Minimalist use of space can feel elegant, modern, or luxurious. Dense layouts with little negative space can feel urgent, chaotic, or overwhelming.' },
        { t: 'check', q: 'sp15' },
        { t: 'compare', left: { title: 'Lots of space', en: 'minimalist', text: 'Feels **elegant, modern, or luxurious**.' }, right: { title: 'Little space', en: 'dense', text: 'Feels **urgent, chaotic, or overwhelming**.' } },
        { t: 'trap', text: 'Two that get mixed up: **Creates Breathing Room** = calm, open, and less load on the brain. **Improves Readability** = space between lines and paragraphs = function, not beauty.', wrong: 'Readability spacing is just aesthetic', right: 'It’s not just aesthetic—it’s functional' },
        { t: 'check', q: 'sp16' },
        { t: 'tip', text: 'Space on a page is like air in a room: nobody sees it, but without it nobody can stay.' }
      ]
    }
  ]
};

/* ---------- demos ---------- */
function mountDensity(el, api) {
  let t = .15, zone = 'airy', moved = 0;
  el.innerHTML = `<div class="spc-dens"><div class="spc-dens__fig"></div><div class="spc-dens__side"><label class="spc-range"><span class="label">Crowding</span><span class="hud-num spc-dens__v">15</span><input type="range" min="0" max="100" value="15" aria-label="Crowding"></label><div class="spc-meter" aria-hidden="true"><i></i></div><div class="spc-read" aria-live="polite"><b></b><small dir="ltr"></small></div></div></div>`;
  const fig = el.querySelector('.spc-dens__fig'), range = el.querySelector('input'), read = el.querySelector('.spc-read'), meter = el.querySelector('.spc-meter i');
  const paint = () => {
    fig.innerHTML = densityLayout(t); el.querySelector('.spc-dens__v').textContent = Math.round(t * 100); meter.style.width = (t * 100) + '%';
    const [a, b] = t < .35 ? ['Calm and inviting', 'an open, airy design'] : t < .65 ? ['Balanced', 'somewhere in between'] : ['Intense or urgent', 'a dense, compact layout'];
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
  const fills = [[C.ink, 'Dark'], ['#B8301A', 'Color'], ['pattern', 'Pattern']];
  el.innerHTML = `<div class="spc-act"><div class="spc-act__fig"></div><div class="spc-act__side"><span class="label">Type of space</span><div class="spc-seg" role="radiogroup" aria-label="Type of space"><button type="button" role="radio" data-k="active" aria-checked="true">Active</button><button type="button" role="radio" data-k="passive" aria-checked="false">Passive</button></div><span class="label">Color of the space</span><div class="spc-seg" role="radiogroup" aria-label="Color of the space">${fills.map(([f, n], i) => `<button type="button" role="radio" data-f="${i}" aria-checked="${i === 0}">${n}</button>`).join('')}</div><div class="spc-read" aria-live="polite"><b></b><small dir="ltr"></small></div></div></div>`;
  const fig = el.querySelector('.spc-act__fig'), read = el.querySelector('.spc-read');
  const paint = () => {
    const f = fill === 'pattern' ? 'url(#spc-pat)' : fill;
    let s = spaceLayout(kind, f, 4);
    if (fill === 'pattern') s = s.replace('<rect x=".5"', '<defs><pattern id="spc-pat" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#0E1A22"/><circle cx="6" cy="6" r="1.4" fill="#7FE7FF" opacity=".55"/></pattern></defs><rect x=".5"');
    fig.innerHTML = s;
    read.querySelector('b').textContent = kind === 'active' ? 'Active: deliberate and asymmetric' : 'Passive: the default gaps';
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
  el.innerHTML = `<div class="spc-noise"><div class="spc-noise__fig">${svg('0 0 320 220', `<rect x=".5" y=".5" width="319" height="219" rx="12" fill="${C.ink}" stroke="#2A2935"/>${junk}${tx(160, 118, 'One message', { fill: C.fg, size: 26, font: 'Alexandria', weight: 800, extra: 'class="spc-noise__msg"' })}`, 'A noisy poster with one message in the middle')}</div><div class="spc-noise__side"><button type="button" class="btn btn--zone">Turn down the noise</button><button type="button" class="btn btn--sm" hidden>Bring the noise back</button><p class="spc-read" aria-live="polite"><b>Noise: <span class="hud-num">${N}</span></b><small></small></p></div></div>`;
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
  el.innerHTML = `<div class="spc-lead"><p class="spc-lead__txt">The space between lines gives the eye a place to rest. When the lines stick together, the eye gets lost on its way back to the start of the next line. When they drift too far apart, the paragraph breaks into islands. The right spacing lets the brain read faster and understand more.</p><div class="spc-lead__side"><label class="spc-range"><span class="label">Line spacing</span><span class="hud-num spc-lead__v">1.05</span><input type="range" min="100" max="300" value="105" aria-label="Line spacing"></label><div class="spc-read" aria-live="polite"><b></b><small></small></div></div></div>`;
  const txt = el.querySelector('.spc-lead__txt'), range = el.querySelector('input'), read = el.querySelector('.spc-read');
  const paint = () => {
    txt.style.lineHeight = lh; el.querySelector('.spc-lead__v').textContent = lh.toFixed(2);
    const [a, b] = lh < 1.35 ? ['Suffocating', 'The lines are glued together: the eye gets lost and the brain gets tired.'] : lh <= 2.1 ? ['Comfortable', 'The brain reads faster and understands more. That’s the goal.'] : ['Falling apart', 'The lines drifted too far apart, and the paragraph turned into islands.'];
    read.querySelector('b').textContent = a; read.querySelector('small').textContent = b;
  };
  range.addEventListener('input', () => { lh = range.value / 100; moved++; paint(); if (moved > 5 && lh > 1.5 && lh < 2.1) api.award(5, { from: range, key: 'demo:spc-leading' }); });
  paint();
}
