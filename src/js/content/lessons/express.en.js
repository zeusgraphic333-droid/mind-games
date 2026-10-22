// Black Square Studio — Lecture 02 · Express Meaning (slides 2–5). English edition of express.js.
import { sqPage, pageSVG, SQ, LECTURE_WORDS, SECTION_WORDS } from './_express-art.js';

const FG = '#EDEBE6', DIM = '#7E7C8B';
/* how to read each composition (built from the SQ notes) */
export const READ = {
  Order: 'Same size, same gap, one alignment. No element steps out of line.',
  Increase: 'Size or number grows step by step, so your eye travels with the increase.',
  Bold: 'One heavy element takes the whole frame. Nothing competes with it.',
  Congested: 'Lots of elements jammed together, with no room to breathe.',
  Tension: 'Elements about to touch, or standing on one corner. You feel it could fall.',
  Playful: 'Small squares, tilted and bouncing at different heights.',
  Dominance: 'One element far bigger than the rest, with the small ones below it.',
  Alienated: 'A group, and one element left outside it, on its own.',
  Surprise: 'A pattern going along, then a sudden break.',
  Upbeat: 'A rhythm rising upward with a light step.',
  Chaos: 'Random sizes and angles, lines everywhere. No rule.',
  Acceptance: 'A different element taken in by the group.',
  Pressure: 'A heavy element bearing down on a small one.',
  Tranquility: 'Horizontal lines and lots of empty space.',
  Harmony: 'Balanced and gradual. Nothing is fighting.',
  Stability: 'A wide base, a narrow top, standing firmly on the ground.',
  Rage: 'Sharp vertical lines, tilted squares, and red.',
  Justice: 'Two equal weights on either side of an axis.',
  Melancholy: 'Low, small, faded, with falling lines.',
  Disorder: 'An order you can still see, but broken.',
  Fluidity: 'The elements ride one smooth wave.'
};
const wordCard = (w, t = 0, extra = '') => `<figure class="exp-word">${sqPage(w, t)}<figcaption><b>${w}</b></figcaption>${extra}</figure>`;
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
  hero: { say: 'No photos here, no fonts. Just squares and lines. The challenge: make a black square **feel** something.' },
  chapters: [
    /* ------------------------------------------------------------ 1 */
    {
      id: 'exp-what', title: 'What does expression mean?', en: 'Express meaning', ref: 'L02 · Express · slide 2', scene: 'squares',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'Expression isn’t drawing something pretty. It’s getting what’s inside you onto the paper, honestly.' },
        { t: 'quote', text: 'Expression in Design implies a clear and authentic displaying of the character or personality of an individual (Designer).', ref: 'L02 · Express · S2' },
        { t: 'p', text: 'Focus on three words in that definition:' },
        { t: 'list', style: 'num', items: ['**Clear**: whoever looks at it gets the feeling without you explaining it.', '**Authentic**: it comes from you, not copied from someone else.', '**The character or personality of an individual (Designer)**: the design shows who you are.'] },
        { t: 'quote', text: 'The expression is often identified with the design elements and principles, whose main starting point and aim is to present and express what has been “seen” or experienced in the inner eye of the mind, heart and soul, i.e. to express the subjective moods and feelings without referring to conventional and “objective” values, judgments and truths.', ref: 'L02 · Express · S2' },
        { t: 'p', text: 'That long sentence says four things. Break it up like this:' },
        { t: 'list', style: 'num', items: ['Expression is tied to the **design elements and principles**. In other words, your tools: point, line, shape, space, balance, rhythm…', 'The starting point and the aim: to show what you “saw” or lived through with **the inner eye of the mind, heart and soul**.', 'That means expressing your **subjective moods and feelings**.', '**Without referring to** conventional and “objective” values, judgments and truths.'] },
        { t: 'compare', left: { title: 'Describing', en: 'objective', text: 'A square in the middle. Correct? Sure. Does it make you feel anything? Nothing at all.', art: pageSVG([{ t: 's', x: 50, y: 50, s: 50 }], { label: 'One square in the centre' }) }, right: { title: 'Expressing', en: 'subjective', text: 'The same square, tiny and squeezed into the corner, with huge empty space around it. Suddenly it feels “lonely”.', art: pageSVG([{ t: 's', x: 116, y: 118, s: 14 }], { label: 'One tiny square pushed into the bottom corner' }) }, note: 'Same element. What changed is the decision: size and position.' },
        { t: 'example', title: 'Two people drew the sea', text: 'One drew it blue, with neat, even waves. The other drew it as broken black lines, because it reminded him of a sad day on the Alexandria Corniche. The first one “described” the sea. The second one “expressed” his own sea.' },
        { t: 'why', text: 'Viewers can feel honesty. A design that comes from a real feeling gets through faster than a dry, “correct” one. It’s the same idea from the start of the lecture: design talks to the viewer’s mind and heart.' },
        { t: 'trap', text: 'Expression shows the personality of the **Designer**, not the client and not the brand. And it expresses **subjective** feelings without referring to “objective” truths.', wrong: 'Expression follows conventional, objective values and truths', right: 'Expression shows subjective moods and feelings — without referring to conventional and “objective” values' },
        { t: 'tip', text: 'Expression = from inside me → out onto the page. Clear, authentic, mine. And no “supposed to”.' },
        { t: 'check', q: 'ex01' },
        { t: 'check', q: 'ex02' },
        { t: 'check', q: 'ex03' },
        { t: 'check', q: 'ex04' }
      ]
    },
    /* ------------------------------------------------------------ 2 */
    {
      id: 'exp-everywhere', title: 'Expression is everywhere', en: 'A very broad concept', ref: 'L02 · Express · slide 3', scene: 'sq:Upbeat',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'Expression doesn’t belong to graphic design alone. It’s in sound, in games, even in the room you’re sitting in right now.' },
        { t: 'quote', text: 'It is a very broad concept, and its meaning can greatly vary from one field to another. It and permeates many aspects of our lives and branches out into many different subgenres, from product design, sound, virtual reality, interaction, to Graphic design, video games, software interfaces, the home and offices interior etc.', ref: 'L02 · Express · S3' },
        { t: 'p', text: 'In plain words: a **very broad concept**, and its meaning changes from one field to another. It runs through a lot of our life. The slide lists 8 fields:' },
        { t: 'grid', cols: 4, items: [
          { title: 'Product design', art: icon('product') }, { title: 'Sound', art: icon('sound') },
          { title: 'Virtual reality', art: icon('vr') }, { title: 'Interaction', art: icon('interaction') },
          { title: 'Graphic design', art: icon('graphic') }, { title: 'Video games', art: icon('games') },
          { title: 'Software interfaces', art: icon('software') }, { title: 'Home & office interior', art: icon('interior') }
        ] },
        { t: 'example', title: 'The notification sound', text: 'A light “ting” when a message arrives = a small moment of joy. A heavy “bzzz” when your battery dies = worry. That’s expression through sound. A horror game with dim lighting and washed-out colors? That’s expression in **video games**.' },
        { t: 'why', text: 'Anything people design can carry a mood. That’s why “expression” means something different in each field: in sound it’s tone, in interiors it’s light and materials, in graphic design it’s elements and composition.' },
        { t: 'trap', text: 'A likely true/false question: “Expression is a narrow concept, only for graphic design.” **False.** It’s **a very broad concept**. And if you get a “which fields” question, look for: product design, sound, virtual reality, interaction.', wrong: 'Expression is a narrow concept that applies only to graphic design', right: 'Expression is a very broad concept that branches out into many fields' },
        { t: 'tip', text: '8 fields: product, sound, VR, interaction, graphic, games, software interfaces, and home & office interior.' },
        { t: 'check', q: 'ex05' },
        { t: 'check', q: 'ex06' }
      ]
    },
    /* ------------------------------------------------------------ 3 */
    {
      id: 'exp-challenge', title: 'Say it with black squares', en: 'Black Square Challenge', ref: 'L02 · Express · slide 4', scene: 'sq:Order',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'The lecture shows a challenge called **Black Square**: 6 words, and each word is said with black squares only. No picture, no written word.' },
        { t: 'quote', text: 'Black Square CHALLENGE — Order, Increase, Bold, Congested, Tension, Playful', ref: 'L02 · Express · S4' },
        { t: 'p', text: 'Notice something important: the slide shows **4 solutions for each word**. So there’s no single right composition. The same feeling can be said in more than one way, and that’s exactly what you’ll do in the section with your **2 trials**.' },
        { t: 'art', html: `<div class="exp-words">${LECTURE_WORDS.map(w => wordCard(w, 0, `<p>${READ[w]}</p>`)).join('')}</div>`, caption: 'Original compositions, made with the same rules as the lecture challenge: only black squares inside a box.' },
        { t: 'demo', id: 'exp-six', title: 'Every word, two trials', caption: 'The same word can be said in more than one way. Look at both trials, and read how each one says the word.', mount(el, api) {
          const seen = new Set(); let cur = 'Order';
          el.innerHTML = `<div class="exp-six"><div class="exp-six__tabs" role="group" aria-label="Word">${LECTURE_WORDS.map(w => `<button type="button" class="btn btn--sm" data-w="${w}" aria-pressed="false">${w}</button>`).join('')}</div><div class="exp-six__pages"></div><p class="exp-six__why" aria-live="polite"></p></div>`;
          const draw = w => {
            cur = w; seen.add(w);
            el.querySelector('.exp-six__pages').innerHTML = [0, 1].map(t => `<figure>${sqPage(w, t)}<figcaption dir="ltr">Trial ${t + 1} · ${SQ[w].trials[t].note}</figcaption></figure>`).join('');
            el.querySelector('.exp-six__why').innerHTML = `<b>${w}</b> — ${READ[w]}`;
            el.querySelectorAll('[data-w]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.w === w)));
            if (live) api.scene('sq:' + w);
            if (seen.size === 6) api.award(5, { from: el.querySelector('.exp-six__pages'), key: 'demo:exp-six' });
          };
          el.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => { api.sfx('pop'); draw(b.dataset.w); }));
          let live = false; draw('Order'); live = true; seen.clear(); seen.add('Order');
        } },
        { t: 'why', text: 'Your brain reads the **relationships** between elements before the elements themselves: distance, size, direction, repetition. Two squares about to touch = tension. Lots of squares jammed together = congested. Same square; the relationship is what changed.' },
        { t: 'trap', text: 'The **lecture** words are 6, and only 6: Order, Increase, Bold, Congested, Tension, Playful. Dominance, Chaos, Harmony… come from the **section** list (15 words). The exam loves mixing them up.', wrong: 'Lecture words: Dominance, Chaos, Harmony', right: 'Lecture words: Order, Increase, Bold, Congested, Tension, Playful' },
        { t: 'tip', text: 'Order · Increase · Bold · Congested · Tension · Playful = “**O**nly **I**n **B**lack **C**an **T**hey **P**lay.”' },
        { t: 'check', q: 'ex07' },
        { t: 'check', q: 'ex14' },
        { t: 'check', q: 'ex17' },
        { t: 'check', q: 'ex19' }
      ]
    },
    /* ------------------------------------------------------------ 4 */
    {
      id: 'exp-rules', title: 'Your section work: the rules', en: 'Section works', ref: 'L02 · Express · slide 5', scene: 'sq:Dominance',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'Now it’s your turn. The section work comes with rules, and the rules come with numbers. The exam loves those numbers.' },
        { t: 'quote', text: 'You will now replicate this assignment using new words to express. You can choose 3 words from this list (with 2 trails for each word).', ref: 'L02 · Express · S5' },
        { t: 'art', html: `<div class="exp-list" dir="ltr">${SECTION_WORDS.map(w => `<span><b>${w.toUpperCase()}</b></span>`).join('')}</div>`, caption: 'The 15 section words. You pick 3 of them.' },
        { t: 'quote', text: 'Create a NEW document in illustrator, Square (15*15 cm) 6 Pages. In each page Create box with no FILL and a 1 pt black STROKE; boxes should be non filled. You can ONLY USE LINES & SQUARES as many as you like. You may play with COLOR, SIZE, OPACITY, POSITION, ORIENTATION, & REPETITION of each element.', ref: 'L02 · Express · S5' },
        { t: 'list', style: 'num', items: ['A new document in Illustrator: a **15 × 15 cm square**, with **6 pages**.', 'On every page: a box with **no Fill** and a **1 pt black Stroke**. The box stays empty.', 'You may use **only lines and squares** (LINES & SQUARES), as many as you like.', 'You can play with 6 things only: **color, size, opacity, position, orientation and repetition**.', 'You pick **3 words**, with **2 trials** for each word. The slide says “trails”; it means **trials**, as in attempts.'] },
        { t: 'art', html: pagesDiagram, caption: 'Why 6 pages? 3 words × 2 trials = 6. The two numbers are linked.' },
        { t: 'demo', id: 'exp-pages', title: 'Pick your three words', caption: 'A rough idea of what your 6 pages look like. Trial 2 has to be a different idea, not the same composition again.', mount(el, api) {
          let picks = ['Rage', 'Tranquility', 'Fluidity'];
          el.innerHTML = `<div class="exp-pk"><div class="exp-pk__words" role="group" aria-label="Words">${SECTION_WORDS.map(w => `<button type="button" class="btn btn--sm" data-w="${w}" aria-pressed="false">${w}</button>`).join('')}</div><p class="exp-pk__hint"></p><div class="exp-pk__doc"></div></div>`;
          const draw = () => {
            el.querySelectorAll('[data-w]').forEach(b => b.setAttribute('aria-pressed', String(picks.includes(b.dataset.w))));
            el.querySelector('.exp-pk__hint').innerHTML = picks.length < 3 ? `Pick <span class="hud-num">${3 - picks.length}</span> more.` : 'Done: 3 words × 2 trials = 6 pages.';
            el.querySelector('.exp-pk__doc').innerHTML = picks.map((w, i) => `<div class="exp-pk__w"><span dir="ltr">Word ${i + 1} · ${w}</span>${[0, 1].map(t => `<figure>${sqPage(w, t)}<figcaption dir="ltr">trial ${t + 1}</figcaption></figure>`).join('')}</div>`).join('');
          };
          el.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => {
            const w = b.dataset.w; api.sfx('pop');
            if (picks.includes(w)) picks = picks.filter(x => x !== w); else { if (picks.length >= 3) picks.shift(); picks.push(w); }
            draw(); if (picks.length === 3) { api.scene('sq:' + w); api.award(5, { from: el.querySelector('.exp-pk__doc'), key: 'demo:exp-pages' }); }
          }));
          draw();
        } },
        { t: 'example', title: 'If you pick RAGE', text: 'Page 1: sharp vertical lines and red. Page 2: an explosion of tilted squares from one point. Same word, two different ideas. That’s what **2 trials** means.' },
        { t: 'why', text: 'The challenge locks your tools on purpose. When you can’t use a picture, a word, or any shape except the square and the line, your brain focuses on the strongest thing left: the **relationships** between elements.' },
        { t: 'trap', text: 'Three traps that keep coming back: (1) the box has **no Fill** and a **1 pt** stroke; it’s not a solid black square. (2) **Lines and squares only**: no circles, no triangles. (3) **Typeface** is **not** one of the six variables.', wrong: 'Variables: color, size, opacity, typeface, texture, perspective', right: 'Variables: color, size, opacity, position, orientation, repetition' },
        { t: 'tip', text: '15 × 15 cm · 6 pages · 3 words × 2 trials · lines and squares only · box: No Fill + 1 pt · 6 variables: color, size, opacity, position, orientation, repetition (“**C**ool **S**quares **O**nly **P**lay **O**n **R**epeat”).' },
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
      id: 'exp-translate', title: 'From a feeling to a composition', en: 'Turning a feeling into squares and lines', ref: 'L02 · Express + Psychology of Design', scene: 'sq:Tranquility',
      blocks: [
        { t: 'say', who: 'blacksq', text: 'The hardest part: you look at a word like **Melancholy** and ask yourself, what does a sad square look like? The answer is in the lecture itself.' },
        { t: 'list', style: 'num', items: ['**Feel the word in your body**: heavy or light? Fast or still? Crowded or alone?', '**Turn it into relationships**: distance, size, direction, repetition.', '**Go back to the Psychology of Design** in the same lecture: open space calms, crowding creates tension, red is energy, urgency and danger, the square is stability and order, and the triangle is tension, sometimes aggression.'] },
        { t: 'quote', text: 'Psychologically, space affects mood. Open, airy designs can feel calm and inviting, while dense, compact layouts may feel intense or urgent.', ref: 'L02 · Psychology of Design · Space' },
        { t: 'table', head: ['Variable', 'What it says', 'Example'], rows: [
          ['Color', 'A red square among black ones = energy, anger or surprise.', 'Rage, Surprise'],
          ['Size', 'One huge element = dominance. Sizes that grow = increase.', 'Dominance, Increase'],
          ['Opacity', 'Elements fading out = something disappearing, or sadness.', 'Melancholy'],
          ['Position', 'Near the edge = tension. Outside the group = isolation.', 'Tension, Alienated'],
          ['Orientation', 'Tilted = movement and play, or chaos. Straight and lying flat = stability and calm.', 'Playful, Tranquility'],
          ['Repetition', 'A regular grid = order. A broken order = disorder.', 'Order, Disorder']
        ] },
        { t: 'compare', left: { title: 'Calm', en: 'Tranquility', text: 'A long horizontal line, small squares resting on it, and lots of empty space.', art: sqPage('Tranquility', 0) }, right: { title: 'Anger', en: 'Rage', text: 'Sharp vertical lines, tilted squares, and red.', art: sqPage('Rage', 0) }, note: 'The whole difference is space, direction and color: emptiness and a line lying at rest, against standing lines, sharp angles and red.' },
        { t: 'compare', left: { title: 'Tidy', en: 'Order', text: 'Same size, same gap, one alignment.', art: sqPage('Order', 0) }, right: { title: 'Broken', en: 'Disorder', text: 'The same grid… but one square slipped and one disappeared.', art: sqPage('Disorder', 0) }, note: '**Disorder** needs a visible order first, so you can see it break.' },
        { t: 'art', html: `<div class="exp-words exp-words--sm">${SECTION_WORDS.map(w => wordCard(w, 0)).join('')}</div>`, caption: 'Gallery of the 15 words. Each one shows one of its two trials.' },
        { t: 'demo', id: 'exp-sandbox', title: 'Your own black box', caption: 'Play with the variables and see what the composition says (Tilt = orientation). The reading below is a rough guess, not a final verdict.', mount(el, api) {
          let base = 7, seed = 7; const st = { n: 9, size: 18, tr: 0, rot: 0, lay: 'grid', red: false, lines: 'none' }; let moves = 0;
          const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
          el.innerHTML = `<div class="exp-sb"><div class="exp-sb__page"></div><div class="exp-sb__ctl">
            <label>Count <input type="range" min="1" max="30" value="9" data-k="n"></label>
            <label>Size <input type="range" min="6" max="90" value="18" data-k="size"></label>
            <label>Transparency <input type="range" min="0" max="85" value="0" data-k="tr"></label>
            <label>Tilt <input type="range" min="0" max="45" value="0" data-k="rot"></label>
            <div class="exp-sb__g" data-g="lay"><span>Layout</span>${[['grid', 'Grid'], ['row', 'Row'], ['grow', 'Growing'], ['corner', 'In the corner'], ['scatter', 'Random']].map(([k, a]) => `<button type="button" class="btn btn--sm" data-v="${k}">${a}</button>`).join('')}</div>
            <div class="exp-sb__g" data-g="lines"><span>Lines</span>${[['none', 'None'], ['h', 'Horizontal'], ['v', 'Vertical']].map(([k, a]) => `<button type="button" class="btn btn--sm" data-v="${k}">${a}</button>`).join('')}</div>
            <div class="exp-sb__g"><span>Color</span><button type="button" class="btn btn--sm" data-red>Red square</button><button type="button" class="btn btn--sm" data-shuffle>Shake</button></div>
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
            el.querySelector('.exp-sb__read').innerHTML = g.length ? `This composition looks like: ${g.map(w => `<b>${w}</b>`).join(' or ')}` : 'It’s not clear yet what it says. Change something else.';
            if (++moves >= 6) api.award(5, { from: el.querySelector('.exp-sb__page'), key: 'demo:exp-sandbox' });
          };
          el.querySelectorAll('input[type=range]').forEach(i => i.addEventListener('input', () => { st[i.dataset.k] = +i.value; draw(); }));
          el.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { st[g.dataset.g] = b.dataset.v; api.sfx('pop'); draw(); })));
          el.querySelector('[data-red]').addEventListener('click', () => { st.red = !st.red; api.sfx('pop'); draw(); });
          el.querySelector('[data-shuffle]').addEventListener('click', () => { base = Math.floor(Math.random() * 1e6) + 1; api.sfx('flip'); draw(); });
          moves = -1; draw();
        } },
        { t: 'why', text: 'You’re not inventing new rules. The Psychology of Design slides already said it: open space feels calm, a crowded design feels urgent and chaotic, red is energy, urgency and danger, the square is stability and order, and the triangle is tension. You’re just putting all of that inside a 15 cm box.' },
        { t: 'trap', text: 'Scenario questions test exactly this link. **TRANQUILITY** = a few small squares on a long horizontal line, with lots of empty space. **RAGE** = sharp vertical lines, tilted squares, and red. If an option says “crowded” for Tranquility, cross it out.', wrong: 'Tranquility: many crowded red squares with sharp vertical lines', right: 'Tranquility: a few small squares resting on a long horizontal line, with lots of empty space' },
        { t: 'tip', text: 'Calm = horizontal + empty space. Rage = vertical + tilt + red. Order = same size, same gap. Chaos = no rule at all.' },
        { t: 'check', q: 'ex20' },
        { t: 'check', q: 'ex21' }
      ]
    }
  ]
};
