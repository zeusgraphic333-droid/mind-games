// Old Town — Lecture 01 · Elements & Principles of Design. Outside the quiz: a backup for the careful. English edition of old.js.
const C = { fg: '#EDEBE6', dim: '#7E7C8B', faint: '#3A3946', stone: '#D9B88C', red: '#FF4A2E', ultra: '#4D6BFF', sun: '#FFC21A', good: '#46E3A0', pink: '#FF3E8A' };
const svg = (vb, inner, label, cls = '') => `<svg class="old-svg ${cls}" viewBox="${vb}" role="img" aria-label="${label}">${inner}</svg>`;
const seg = (name, items, on = 0) => `<div class="old-seg" role="group" aria-label="${name}">${items.map((t, i) => `<button type="button" class="old-seg__b" data-i="${i}" aria-pressed="${i === on}">${t}</button>`).join('')}</div>`;
function onSeg(root, fn) { const bs = [...root.querySelectorAll('.old-seg__b')]; bs.forEach((b, i) => b.addEventListener('click', () => { bs.forEach(x => x.setAttribute('aria-pressed', String(x === b))); fn(i, b); })); }

const balanceDemo = {
  t: 'demo', id: 'old-balance', title: 'Put the weights on the seesaw', caption: 'Balance doesn’t have to be a mirror. 3 small things can offset 1 big thing.',
  mount(el, api) {
    el.innerHTML = `<div class="old-demo">${seg('Balance', ['Symmetrical', 'Asymmetrical', 'Heavy on one side'])}<div class="old-stage">${svg('0 0 420 220', `<path d="M210 196L186 214H234Z" fill="${C.dim}"/><g class="old-beam"><rect x="40" y="186" width="340" height="8" rx="4" fill="${C.stone}"/><g class="old-load"></g></g>`, 'A seesaw with weights on it')}</div><p class="old-readout" aria-live="polite"></p></div>`;
    const beam = el.querySelector('.old-beam'), load = el.querySelector('.old-load'), out = el.querySelector('.old-readout');
    const S = [
      { tilt: 0, html: `<rect x="70" y="126" width="60" height="60" fill="${C.stone}"/><rect x="290" y="126" width="60" height="60" fill="${C.stone}"/>`, say: '<b>Symmetrical</b>: the same shape on both sides, like a mirror.' },
      { tilt: 0, html: `<rect x="62" y="106" width="80" height="80" fill="${C.stone}" fill-opacity=".45"/><rect x="262" y="160" width="26" height="26" fill="${C.stone}"/><rect x="296" y="160" width="26" height="26" fill="${C.stone}"/><rect x="330" y="160" width="26" height="26" fill="${C.stone}"/>`, say: '<b>Asymmetrical</b>: one big, quiet shape against 3 small ones in a strong color. Not a mirror, but balanced.' },
      { tilt: -9, html: `<rect x="62" y="106" width="80" height="80" fill="${C.stone}"/>`, say: 'Heavy on one side: the viewer’s eye goes straight to the heavy part, and the design tips over.' }
    ];
    const show = i => { beam.style.transform = `rotate(${S[i].tilt}deg)`; load.innerHTML = S[i].html; out.innerHTML = S[i].say; };
    show(0); onSeg(el, (i, b) => { show(i); api.scene(i === 1 ? 'activeSpace' : 'elements'); api.sfx('pop'); if (i === 1) api.award(5, { from: b, key: 'demo:old-balance' }); });
  }
};
const hierarchyDemo = {
  t: 'demo', id: 'old-hierarchy', title: 'Same poster… with and without hierarchy', caption: 'Without hierarchy, your eye doesn’t know where to start. With hierarchy: the title, then the date, then the details.',
  mount(el, api) {
    el.innerHTML = `<div class="old-demo">${seg('The poster', ['No hierarchy', 'With hierarchy'])}<div class="old-stage">${svg('0 0 300 220', `<rect x="1" y="1" width="298" height="218" rx="10" fill="none" stroke="${C.faint}"/><g class="old-poster" font-family="Alexandria" fill="${C.fg}" direction="ltr"><text class="t1" x="26" y="60" text-anchor="start">Grad Show</text><text class="t2" x="26" y="100" text-anchor="start">Thursday 3 Dec, 6 pm</text><text class="t3" x="26" y="140" text-anchor="start">Applied Arts Hall, ground floor</text><text class="t4" x="26" y="176" text-anchor="start">Free entry for students</text></g>`, 'A poster with all its text in one size, or in different sizes', 'old-hier')}</div><p class="old-readout" aria-live="polite">Everything is the same size. Your eye wanders around and can’t find a first step.</p></div>`;
    onSeg(el, (i, b) => { el.querySelector('.old-hier').classList.toggle('on', i === 1); el.querySelector('.old-readout').textContent = i ? 'The bigger title caught you first, then the date. That’s typographic hierarchy.' : 'Everything is the same size. Your eye wanders around and can’t find a first step.'; api.scene('scan'); api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:old-hierarchy' }); });
  }
};
const contrastDemo = {
  t: 'demo', id: 'old-contrast', title: 'Turn up the contrast, then make a focal point', caption: 'Contrast = the difference. Emphasis = the impact. Contrast can help emphasis, but they’re not the same thing.',
  mount(el, api) {
    let dots = ''; for (let k = 0; k < 26; k++) { const x = 24 + (k % 13) * 22, y = 150 + Math.floor(k / 13) * 26; dots += `<circle cx="${x}" cy="${y}" r="7" fill="${C.dim}"/>`; }
    el.innerHTML = `<div class="old-demo"><label class="old-range"><span>Contrast</span><input type="range" min="0" max="100" value="15"></label>${seg('Focal point', ['Without', 'Make a focal point'])}<div class="old-stage">${svg('0 0 320 210', `<rect class="old-bg" x="0" y="0" width="320" height="120" rx="10"/><text class="old-txt" x="160" y="74" text-anchor="middle" font-family="Alexandria" font-weight="700" font-size="34">Read me</text>${dots}<circle class="old-focal" cx="250" cy="163" r="22" fill="${C.red}"/>`, 'Text on a background with changing contrast, and gray circles with one red circle among them', 'old-con')}</div><p class="old-readout" aria-live="polite">Low contrast: the text gets lost.</p></div>`;
    const inp = el.querySelector('input'), bg = el.querySelector('.old-bg'), tx = el.querySelector('.old-txt'), out = el.querySelector('.old-readout');
    const draw = () => { const v = +inp.value / 100; const b = 40; const t = Math.round(70 + v * 167); bg.setAttribute('fill', `rgb(${b},${b},${b + 6})`); tx.setAttribute('fill', `rgb(${t},${t},${t - 4})`); out.textContent = v < .35 ? 'Low contrast: the text gets lost (like gray on gray).' : v < .75 ? 'Better. But it can still go higher.' : 'High contrast: you can read it from far away. That’s readability.'; };
    inp.addEventListener('input', () => { draw(); api.scene('clearing'); });
    onSeg(el, (i, b) => { el.querySelector('.old-con').classList.toggle('focal', i === 1); out.textContent = i ? 'The big red circle = the focal point. Everything else stepped back (subordination).' : 'All the circles look alike. Nothing is calling you.'; api.sfx('pop'); if (i) api.award(5, { from: b, key: 'demo:old-contrast' }); });
    draw();
  }
};
const rhythmDemo = {
  t: 'demo', id: 'old-rhythm', title: '5 types of rhythm', caption: 'Rhythm = organized repetition that moves the eye. Each type moves it in its own way.',
  mount(el, api) {
    const R = [
      ['Repetition', 'Repetition', Array.from({ length: 8 }, (_, k) => `<rect x="${20 + k * 36}" y="70" width="24" height="24" fill="${C.stone}"/>`).join(''), 'The same shape, repeated.'],
      ['Gradation', 'Gradation', Array.from({ length: 8 }, (_, k) => { const s = 8 + k * 6; return `<rect x="${14 + k * 36}" y="${100 - s}" width="${s}" height="${s}" fill="${C.stone}" fill-opacity="${.3 + k * .09}"/>`; }).join(''), 'A gradual change in size or color.'],
      ['Radiation', 'Radiation', Array.from({ length: 12 }, (_, k) => `<rect x="164" y="40" width="12" height="40" fill="${C.stone}" transform="rotate(${k * 30} 170 90)"/>`).join(''), 'Identical shapes coming out of a central axis.'],
      ['Opposition', 'Opposition', `<rect x="20" y="60" width="120" height="16" fill="${C.stone}"/><rect x="152" y="20" width="16" height="140" fill="${C.red}"/><rect x="180" y="104" width="120" height="16" fill="${C.stone}"/>`, 'A sudden change in direction or color.'],
      ['Transition', 'Transition', `<path d="M10 120C70 20 130 160 190 70S290 40 310 90" fill="none" stroke="${C.stone}" stroke-width="5"/>`, 'A curve that carries your eye across a straight surface.']
    ];
    el.innerHTML = `<div class="old-demo">${seg('Type', R.map(r => r[0]))}<div class="old-stage">${svg('0 0 320 180', '<g class="old-r"></g>', 'A drawing of the rhythm type')}</div><p class="old-readout" aria-live="polite"></p></div>`;
    const g = el.querySelector('.old-r'), out = el.querySelector('.old-readout');
    const show = i => { g.innerHTML = R[i][2]; out.innerHTML = `<b>Rhythm by ${R[i][1]}</b> — ${R[i][3]}`; };
    show(0); onSeg(el, (i, b) => { show(i); api.scene('spiral'); api.sfx('pop'); if (i === 4) api.award(5, { from: b, key: 'demo:old-rhythm' }); });
  }
};

export default {
  zone: 'old',
  hero: { say: '==Not in the quiz.== This lecture is a backup. But everything in Lectures 2 and 3 is built on it, and there are 25 questions in the bank if you want to play it safe.' },
  chapters: [
    {
      id: 'old-map', title: 'The building blocks… and balance', en: 'Elements, Principles · Balance', ref: 'L01 · S2–S12', scene: 'elements',
      blocks: [
        { t: 'say', who: 'spiral', text: 'Before Gestalt, and before the psychology of color, there was a simpler question: what is a design made of? And how do you arrange it?' },
        { t: 'quote', text: 'Design principles are fundamental pieces of advice for you to make easy-to-use, pleasurable designs. You apply them when you select, create and organize elements and features in your work.', ref: 'L01 · S2' },
        { t: 'compare', left: { title: 'The ingredients', en: '7 Elements', text: 'Line · Shape · Form · Color · Value · Texture · Space' }, right: { title: 'The cooking', en: '7 Principles', text: 'Balance · Contrast · Variety · Unity · Repetition · Emphasis · Hierarchy' }, note: 'Elements = the ingredients. Principles = how you cook them.' },
        { t: 'quote', text: 'Think of the elements of design as the ingredients you need for a recipe.', ref: 'L01 · Elements' },
        { t: 'list', style: 'num', items: ['**Ideas come first**: after you identify the problem and do your research.', '**Visualization**: sketches, and playing around with the ideas.', '**Elements**: the ones you choose to present your idea.', '**Principles**: what makes the elements work right.', '**Implementation**: you actually make it.'] },
        { t: 'h', text: 'Balance' },
        { t: 'quote', text: 'Objects in design carry weight just like in the physical world, but it’s called visual weight. The visual weight of a design needs to have balance. It’s like putting two objects on a seesaw: If one side is too heavy, the viewer’s eye goes directly to the heavy part.', ref: 'L01 · S5' },
        balanceDemo,
        { t: 'compare', left: { title: 'Mirrored', en: 'Symmetrical Balance', text: 'The shapes repeat like a mirror on both sides of an axis (vertical or horizontal).' }, right: { title: 'Not a mirror', en: 'Asymmetrical Balance', text: 'Balance between elements that don’t mirror each other. Like 3 small things against 1 big thing.' }, note: 'And there’s also **Radial**: elements spread around a point in the center.' },
        { t: 'quote', text: 'Balance can be implied by size, shape, or even contrast. Think of asymmetry as the opposite of mirroring: Instead of seeing the reflection, you see something that evenly distributes the elements.', ref: 'L01 · S8' },
        { t: 'tip', text: '**Visual weight** = how heavy something looks. The seesaw: if one side gets heavier, the eye goes to it. And asymmetry = **the opposite of mirroring**.' },
        { t: 'check', q: 'b01' }, { t: 'check', q: 'b02' }, { t: 'check', q: 'b03' }, { t: 'check', q: 'b04' }, { t: 'check', q: 'b05' }, { t: 'check', q: 'b06' }
      ]
    },
    {
      id: 'old-hierarchy', cap: ['Hierarchy', 'The order of importance'], title: 'Hierarchy: 8 tools', en: 'Hierarchy', ref: 'L01 · S55–S69', scene: 'scan',
      blocks: [
        { t: 'say', who: 'spiral', text: 'Hierarchy = the order of importance. You decide where the eye looks first. You don’t leave it to chance.' },
        { t: 'grid', cols: 4, items: [
          { title: '1 · Size and Scale', text: 'The most important thing is the biggest.', color: C.stone },
          { title: '2 · Color and contrast', text: 'The most important thing gets the **brighter**, stronger color.', color: C.red },
          { title: '3 · Typographic hierarchy', text: 'The title is bigger than the body text.', color: C.sun },
          { title: '4 · Spacing', text: 'Room for the elements to breathe.', color: C.ultra },
          { title: '5 · Proximity', text: 'Things that belong together sit together.', color: C.good },
          { title: '6 · Alignment', text: 'The elements line up on one line.', color: C.pink },
          { title: '7 · Repetition', text: 'A unified, consistent look.', color: C.stone },
          { title: '8 · Leading lines', text: 'Lines that point the eye.', color: C.fg }
        ] },
        hierarchyDemo,
        { t: 'quote', text: 'Typographic hierarchy in graphic design is a system used to organize in a visual way using typography the order of importance of the information shown in the design, where the title will be the most important element, and it will be bigger than the body text.', ref: 'L01 · S61' },
        { t: 'quote', text: 'Proximity rules in the visual hierarchy say that things that are related should be nearer to each other, and things that don’t have any relationship should be placed further from each other in your design composition.', ref: 'L01 · S64' },
        { t: 'trap', text: 'Expect a **NOT** question on the eight tools. If a Gestalt law like **Common fate** shows up among them, that’s the one that doesn’t belong.', wrong: 'Common fate is one of the eight hierarchy tools', right: 'Size, color & contrast, typography, spacing, proximity, alignment, repetition, leading lines' },
        { t: 'tip', text: 'The eight tools: **size, color, type, spacing, proximity, alignment, repetition, lines**.' },
        { t: 'check', q: 'b07' }, { t: 'check', q: 'b08' }, { t: 'check', q: 'b09' }, { t: 'check', q: 'b10' }, { t: 'check', q: 'b11' }, { t: 'check', q: 'b25' }
      ]
    },
    {
      id: 'old-contrast', cap: ['Contrast · Emphasis', 'Difference and impact'], title: 'Difference or impact?', en: 'Contrast · Emphasis', ref: 'L01 · S13–S17, S45–S53', scene: 'clearing',
      blocks: [
        { t: 'say', who: 'spiral', text: 'Two words that always get mixed up. Contrast = **the difference**. Emphasis = **the impact**.' },
        { t: 'quote', text: 'The difference between two or more objects in a design is referred to as contrast. The difference in objects could be light and dark, thin and thick, small and large, bright and dull, etc. Contrast is most commonly associated with readability, legibility, and accessibility.', ref: 'L01 · Contrast' },
        { t: 'quote', text: 'A text-based design could be high contrast by using black text on a white background. To dial down the contrast, you’d use gray text on a white background.', ref: 'L01 · S14' },
        contrastDemo,
        { t: 'quote', text: 'Emphasis can be created by size, weight, position, color, shape, and style. Sometimes referred to as dominance, emphasis might seem similar to contrast, but it’s not quite the same. Contrast deals with the difference between two objects, and emphasis deals with the impact of an object.', ref: 'L01 · S45' },
        { t: 'quote', text: 'Adding emphasis to an object creates a focal point, which grabs an audience’s attention. It’s where you want the viewer to look first but doesn’t overpower the rest of the design (or it would be out of balance).', ref: 'L01 · S45' },
        { t: 'example', title: 'The long hallway', text: 'The slide’s own example: a long hallway, and your eye runs straight to the end of it. Paint the wall at the end a bright color, and that wall becomes the focal point. Same thing at the entrance of your faculty: the one red poster on a gray wall.' },
        { t: 'trap', text: 'The difference between the two is a direct question.', wrong: 'Emphasis = the difference between two objects', right: 'Contrast = difference · Emphasis = impact (a.k.a. dominance)' },
        { t: 'tip', text: 'Contrast = **difference**. Emphasis = **impact** = dominance = focal point. And a black-and-white photo with every shade, from white through gray to black = high contrast.' },
        { t: 'check', q: 'b12' }, { t: 'check', q: 'b13' }, { t: 'check', q: 'b14' }, { t: 'check', q: 'b15' }, { t: 'check', q: 'b16' }, { t: 'check', q: 'b17' }, { t: 'check', q: 'b18' }
      ]
    },
    {
      id: 'old-rhythm', cap: ['Repetition · Rhythm', 'The beat that moves the eye'], title: 'One piece, but never boring', en: 'Repetition · Rhythm · Unity · Variety · Movement', ref: 'L01 · S21–S41', scene: 'spiral',
      blocks: [
        { t: 'say', who: 'spiral', text: 'Last part: **Repetition**, **Unity** and **Variety** are on the list of 7 principles. With them come **Rhythm** and **Movement** (those two are extra, not among the 7 on S4). All of them are about making the design **one piece** and, at the same time, **not boring**.' },
        { t: 'h', text: 'Repetition' },
        { t: 'quote', text: 'Repetition can be regular or irregular, even and uneven. It can work in two ways: Radial – in which the elements repeat from one central point; Gradation – where the repeated elements become larger or smaller.', ref: 'L01 · S30' },
        { t: 'p', text: 'Repetition can be **regular or irregular**. And it works in two ways: **from one central point** (Radial), or **step by step** (Gradation), where the repeated element gets bigger or smaller.' },
        { t: 'quote', text: 'Repetition also creates rhythm; this is the rate at which the eye can go through a design. It relates to the flow of the design.', ref: 'L01 · S30' },
        { t: 'trap', text: 'The same two words show up twice: **Radial** and **Gradation** under **Repetition** (S30), and **Rhythm by Radiation** and **Rhythm by Gradation** under **Rhythm** (S36–S37). Read the question carefully: if it asks about the ways **repetition** works, it’s Repetition. If it asks about the **types of rhythm**, it’s Rhythm.', wrong: 'Gradation belongs only to Rhythm', right: 'Repetition (S30) and Rhythm (S36) both use gradation' },
        { t: 'quote', text: 'A visual tempo or beat. The principle of design that refers to a regular repetition of elements of design to produce the look and feel of movement.', ref: 'L01 · S33 · Rhythm' },
        rhythmDemo,
        { t: 'quote', text: 'Unity is the result when all of the design principles (balance, movement, emphasis, contrast, Rhythm) have been correctly applied.', ref: 'L01 · S25' },
        { t: 'quote', text: 'Variety is about varying elements and objects in your image, to avoid making them boring.', ref: 'L01 · S21' },
        { t: 'quote', text: 'Movement is the principle of good design which gives the designer control over what the viewer sees next. Using this principle, the designer can create the path our eyes will travel as we look at a work of design.', ref: 'L01 · S40' },
        { t: 'compare', left: { title: 'One piece', en: 'Unity', text: 'All the elements work together as a single piece.' }, right: { title: 'Not boring', en: 'Variety', text: 'Differences that break the boredom and add interest.' }, note: 'Variety gives contrast to harmony and unity. The two need each other.' },
        { t: 'tip', text: 'Gradation = **step by step**. Radiation = **from the center**. Opposition = **sudden**. Unity = **everything applied right**. Movement = **the eye’s path**.' },
        { t: 'check', q: 'b19' }, { t: 'check', q: 'b20' }, { t: 'check', q: 'b21' }, { t: 'check', q: 'b22' }, { t: 'check', q: 'b23' }, { t: 'check', q: 'b24' }
      ]
    }
  ]
};
