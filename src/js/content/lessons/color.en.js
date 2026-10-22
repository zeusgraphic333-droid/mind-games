// Color Lab — Lecture 02 · The psychology of colors in graphic design (slides 17–21). English edition of color.js.
import { COLORS } from '../../data/psych.js';

const FG = '#EDEBE6', DIM = '#7E7C8B', LINE = 'rgba(237,235,230,.35)';
/* [slide word, label on the page, swatch] — same shape as the Arabic file; in English the label is the slide word itself */
const WARM = [['Warmth', 'Warmth', '#FF6A13'], ['Glory', 'Glory', '#FFAF1E'], ['Love', 'Love', '#FF1F1F'], ['Prosperity', 'Prosperity', '#FFD21A'], ['Energy', 'Energy', '#FFF02A']];
const COLD = [['Tranquility', 'Tranquility', '#66F2C6'], ['Peace', 'Peace', '#5BE0F7'], ['Trust', 'Trust', '#2F8BE0'], ['Nobility', 'Nobility', '#86A9F5'], ['Nobility', 'Nobility', '#8E77DA']];
const NEUTRAL = [['Friendly', 'Friendly', '#B49F70'], ['Formal', 'Formal', '#6B6457'], ['Gloomy', 'Gloomy', '#2A2620'], ['Solid', 'Solid', '#050505'], ['Classy', 'Classy', '#B2B2F5'], ['Clean', 'Clean', '#D6C8A3'], ['Purity', 'Purity', '#D9D9D9']];
const lum = h => { const n = parseInt(h.slice(1), 16); return (.2126 * ((n >> 16) & 255) + .7152 * ((n >> 8) & 255) + .0722 * (n & 255)) / 255; };
const on = h => lum(h) > .55 ? '#0B0B10' : '#FFFFFF';
const hexSw = c => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4 92 28v44L50 96 8 72V28z" fill="${c}" stroke="${LINE}" stroke-width="2"/></svg>`;

/* three palettes as editorial swatch columns (not the slide's honeycomb) */
function columns() {
  const col = (x, title, set) => `<g transform="translate(${x} 0)"><text x="0" y="22" fill="${FG}" font-family="Alexandria" font-weight="700" font-size="15" letter-spacing=".04em">${title}</text>${set.map(([en, , c], k) => {
    return `<rect x="0" y="${38 + k * 42}" width="172" height="34" rx="4" fill="${c}" stroke="${LINE}" stroke-width="1"/><text x="12" y="${60 + k * 42}" fill="${on(c)}" font-family="IBM Plex Sans Arabic" font-weight="600" font-size="13" letter-spacing=".06em">${en.toUpperCase()}</text>`;
  }).join('')}</g>`;
  return `<svg viewBox="0 0 600 340" role="img" aria-label="Warm colors: warmth, glory, love, prosperity, energy. Cold colors: tranquility, peace, trust, nobility. Neutral colors: friendly, formal, gloomy, solid, classy, clean, purity."><g direction="ltr">${col(8, 'WARM COLORS', WARM)}${col(214, 'COLD COLORS', COLD)}${col(420, 'NEUTRAL (untitled)', NEUTRAL)}</g></svg>`;
}

/* a tiny poster that changes palette (used by the temperature demo) */
function poster(p, words) {
  return `<svg viewBox="0 0 340 210" role="img" aria-label="A poster in ${words.join(', ')} colors">
    <rect width="340" height="210" rx="12" fill="${p[0]}"/>
    <circle cx="246" cy="98" r="64" fill="${p[1]}"/><circle cx="246" cy="98" r="40" fill="${p[2]}"/>
    <rect x="26" y="34" width="132" height="18" rx="2" fill="${p[3]}"/><rect x="26" y="62" width="100" height="18" rx="2" fill="${p[3]}"/>
    <rect x="26" y="100" width="118" height="6" rx="3" fill="${p[4]}" opacity=".85"/><rect x="26" y="114" width="96" height="6" rx="3" fill="${p[4]}" opacity=".85"/><rect x="26" y="128" width="108" height="6" rx="3" fill="${p[4]}" opacity=".85"/>
    <rect x="26" y="158" width="92" height="28" rx="14" fill="${p[1]}"/>
  </svg>`;
}
const PAL = {
  warm: { name: 'Warm', scene: 'warm', words: WARM.map(w => w[0]), p: ['#2B0F05', '#FF6A13', '#FFD21A', '#FFF1D6', '#FFAF1E'] },
  cold: { name: 'Cold', scene: 'cold', words: ['Tranquility', 'Peace', 'Trust', 'Nobility'], p: ['#071A2B', '#2F8BE0', '#66F2C6', '#E6F6FF', '#86A9F5'] },
  neutral: { name: 'Neutral', scene: 'neutrals', words: NEUTRAL.map(w => w[0]), p: ['#1E1C18', '#B49F70', '#D6C8A3', '#F0EDE6', '#6B6457'] }
};

/* a phone screen with one call-to-action button (the CTA demo) */
function phone(c) {
  return `<svg viewBox="0 0 210 360" role="img" aria-label="A shopping app screen with a ${c.name} button">
    <rect x="4" y="4" width="202" height="352" rx="26" fill="#111119" stroke="${LINE}"/>
    <rect x="72" y="14" width="66" height="8" rx="4" fill="#23232F"/>
    <rect x="22" y="44" width="166" height="128" rx="12" fill="#1B1B26"/>
    <circle cx="105" cy="108" r="34" fill="none" stroke="${DIM}" stroke-width="1.5"/><path d="M90 108h30M105 93v30" stroke="${DIM}" stroke-width="1.5"/>
    <rect x="22" y="188" width="120" height="12" rx="3" fill="${FG}" opacity=".9"/><rect x="22" y="208" width="88" height="8" rx="3" fill="${DIM}"/><rect x="22" y="222" width="104" height="8" rx="3" fill="${DIM}"/>
    <rect class="clr-cta__btn" x="22" y="290" width="166" height="46" rx="23" fill="${c.hex}" stroke="${LINE}"/>
    <text x="105" y="319" text-anchor="middle" font-family="Alexandria" font-weight="700" font-size="16" fill="${c.on}">Order now</text>
  </svg>`;
}

export default {
  zone: 'color',
  hero: { say: 'Color is the first thing that reaches your brain. Before the words, and before the shapes. Here you’ll learn what each color does to you, and why the same color can mean different things in different places.' },
  chapters: [
    /* ------------------------------------------------------------ 1 */
    {
      id: 'color-what', title: 'Color isn’t decoration', en: 'The psychology of colors', ref: 'L02 · slide 20', scene: 'colorSphere',
      blocks: [
        { t: 'say', who: 'drop:#FF3E8A', text: 'Before you read a single word on any poster, the color has already told you the mood. The design talks to you before it says a word.' },
        { t: 'p', text: 'The slide defines the psychology of colors as a blend of 3 things: **art**, **science** and **emotion**.' },
        { t: 'list', style: 'num', items: ['**Art**: picking a color is taste, composition and balance.', '**Science**: your eyes and brain react to color in a way that’s largely predictable.', '**Emotion**: every color carries memories and feelings inside you.'] },
        { t: 'quote', text: 'The psychology of colors is a fascinating blend of art, science, and emotion.', ref: 'L02 · S20', ar: 'In short: color psychology = art + science + emotion.' },
        { t: 'p', text: 'Then comes an important line: color isn’t just something you “see”. Color is a **trigger**: a button that gets pressed inside your brain. It changes how you feel, how you think and how you act.' },
        { t: 'quote', text: 'Colors aren’t just visual, they’re psychological triggers that shape how people feel, think, and behave.', ref: 'L02 · S20', ar: 'In short: colors are more than something you see. They are psychological triggers that shape how you feel, think and behave.' },
        { t: 'h', text: 'Designers use color for 3 things', en: 'Designers use color strategically to…' },
        { t: 'grid', cols: 3, items: [
          { title: 'Set a mood', en: 'evoke moods', text: 'Calm? Excited? Luxurious? The color decides.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 30c6-10 12-10 18 0s12 10 18 0"/><path d="M6 20c6-10 12-10 18 0s12 10 18 0" opacity=".45"/></svg>`, color: '#8B7BFF' },
          { title: 'Affect your decision', en: 'influence decisions', text: 'Tap? Buy? Wait?', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M24 6v20M24 26l-12 14M24 26l12 14"/><circle cx="12" cy="41" r="2.5" fill="currentColor"/><circle cx="36" cy="41" r="2.5"/></svg>`, color: '#FF3E8A' },
          { title: 'Show the brand', en: 'communicate brand identity', text: 'You know the brand by its color before its name.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="14" height="14"/><rect x="26" y="8" width="14" height="14"/><rect x="8" y="26" width="14" height="14"/><rect x="26" y="26" width="14" height="14" fill="currentColor"/></svg>`, color: '#FFC21A' }
        ] },
        { t: 'quote', text: 'Designers use color strategically to evoke moods, influence decisions, and communicate brand identity.', ref: 'L02 · S20' },
        { t: 'example', title: 'Sales season', text: 'In the okazyon (the big sales season), clothes-shop windows fill up with red signs. That’s no accident. Red creates a sense of urgency, so you feel the offer will be gone if you don’t walk in now. That’s exactly **influence decisions**.' },
        { t: 'why', text: 'Your brain picks up color faster than it reads. So color sets the feeling first, and the words come after to confirm it.' },
        { t: 'trap', text: 'The slide says **triggers**. The question may offer look-alike words like decorations, signals or symbols. Pick the exact word from the slide.', wrong: 'Colors are psychological decorations', right: 'Colors are psychological triggers' },
        { t: 'tip', text: 'Color = art + science + emotion. Color is a trigger, not decoration. Designers use it for: mood, decisions, brand.' },
        { t: 'check', q: 'co01' },
        { t: 'check', q: 'co02' },
        { t: 'check', q: 'co03' }
      ]
    },
    /* ------------------------------------------------------------ 2 */
    {
      id: 'color-temp', title: 'A color’s temperature', en: 'Warm colors · Cold colors · Neutrals', ref: 'L02 · slides 17–19', scene: 'warm',
      blocks: [
        { t: 'say', who: 'drop:#FF6A13', text: 'Walk into a koshary place in downtown Cairo: red, yellow and orange. Walk into a dentist’s clinic: blue and white. That’s not just the owner’s taste. That’s the color’s “temperature”.' },
        { t: 'p', text: 'The slides split colors into two titled groups: **Warm colors** and **Cold colors**. After them comes a third graphic with no title, all neutral colors: beige, gray and black, plus just one light lavender (Classy).' },
        { t: 'art', html: columns(), caption: 'Every word as it appears on the slides. Notice that Nobility shows up twice in the cold set.' },
        { t: 'h', text: 'Warm: energy and warmth', en: 'Warm colors' },
        { t: 'grid', cols: 5, items: WARM.map(([en, ar, c]) => ({ title: ar, art: hexSw(c), color: c })) },
        { t: 'h', text: 'Cold: tranquility and trust', en: 'Cold colors' },
        { t: 'grid', cols: 5, items: COLD.map(([en, ar, c]) => ({ title: ar, art: hexSw(c), color: c })) },
        { t: 'h', text: 'Neutral: the graphic with no title', en: 'Neutrals' },
        { t: 'p', text: 'This third one is beige, gray and black, plus one light lavender (Classy). Its words: Friendly, Formal, Gloomy, Solid, Classy, Clean, Purity. Notice: the same neutral family holds both “Friendly” and “Gloomy”. So the exact shade matters.' },
        { t: 'grid', cols: 4, items: NEUTRAL.map(([en, ar, c]) => ({ title: ar, art: hexSw(c), color: c === '#050505' || c === '#2A2620' ? '#55535F' : c })) },
        { t: 'demo', id: 'clr-temp', title: 'Change the poster’s temperature', caption: 'The exact same poster. Only the temperature changed, and the whole feeling flipped.', mount(el, api) {
          const keys = Object.keys(PAL); const seen = new Set(); let cur = 'warm';
          el.innerHTML = `<div class="clr-temp"><div class="clr-temp__btns" role="group" aria-label="Color temperature">${keys.map(k => `<button type="button" class="btn btn--sm" data-k="${k}" aria-pressed="false">${PAL[k].name}</button>`).join('')}</div><div class="clr-temp__view"><div class="clr-temp__poster"></div><div class="clr-temp__words" dir="ltr"></div></div></div>`;
          const draw = k => {
            cur = k; seen.add(k); const P = PAL[k];
            el.querySelector('.clr-temp__poster').innerHTML = poster(P.p, P.words);
            el.querySelector('.clr-temp__words').innerHTML = P.words.filter((w, i, a) => a.indexOf(w) === i).map(w => `<span class="chip">${w}</span>`).join('');
            el.querySelectorAll('[data-k]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
            if (live) api.scene(P.scene);
            if (seen.size === 3) api.award(5, { from: el.querySelector('.clr-temp__poster'), key: 'demo:clr-temp' });
          };
          el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { api.sfx('pop'); draw(b.dataset.k); }));
          let live = false; draw('warm'); live = true; seen.clear(); seen.add('warm');
        } },
        { t: 'example', title: 'Café or spa?', text: 'A café wants you to chat and order again: warm decor, energy and warmth. A spa wants you to calm down and relax: cold colors, tranquility and peace. The same money spent on paint, two opposite messages.' },
        { t: 'why', text: 'Warm colors remind you of fire and the sun, so your body wakes up. Cold colors remind you of water and the sky, so you calm down. Your brain links each color to things it has lived before.' },
        { t: 'trap', text: 'The exam loves to mix up warm and cold words. **Prosperity** and **Glory** are warm, not cold. **Trust** and **Nobility** are cold, not warm. And neutral words like **Classy** are in neither group.', wrong: 'Cold colors: trust, love, prosperity', right: 'Cold colors: tranquility, peace, trust, nobility' },
        { t: 'tip', text: 'Warm: Warmth, Glory, Love, Prosperity, Energy. Cold: Tranquility, Peace, Trust, Nobility. Neutral: Friendly, Formal, Gloomy, Solid, Classy, Clean, Purity.' },
        { t: 'check', q: 'co04' },
        { t: 'check', q: 'co05' },
        { t: 'check', q: 'co06' }
      ]
    },
    /* ------------------------------------------------------------ 3 */
    {
      id: 'color-loud', title: 'The colors that push', en: 'Red · Orange · Yellow', ref: 'L02 · slide 20', scene: 'swatches',
      blocks: [
        { t: 'say', who: 'drop:#E5322D', text: 'These three get you moving. Eat, buy, tap. But each one pushes you from a different side.' },
        { t: 'p', text: 'This is where the most important table of the color lesson starts. Each color gets two things: its **Psychological Impact** and its **Common Uses**. This table brings a lot of questions, so take it slowly.' },
        { t: 'table', dir: 'ltr', head: ['Color', 'Psychological Impact', 'Common Uses'], rows: [
          ['<span class="clr-dot" style="--c:#E5322D"></span>Red', 'Stimulates energy, urgency, passion, and appetite. Can also signal danger or excitement.', 'Sales, food brands, warnings'],
          ['<span class="clr-dot" style="--c:#FF7A1A"></span>Orange', 'Friendly, playful, and energetic. Encourages enthusiasm and creativity.', 'Call-to-action buttons, youth brands'],
          ['<span class="clr-dot" style="--c:#FFD21F"></span>Yellow', 'Optimistic, cheerful, attention-grabbing. Can cause anxiety in excess.', 'Promotions, children’s products']
        ] },
        { t: 'h', text: 'Red: hungry and in a hurry' },
        { t: 'p', text: 'Red stimulates energy, urgency, passion and **appetite**. It can also signal **danger** or **excitement**. Its uses in the table: **sales**, **food brands** and **warnings**.' },
        { t: 'example', title: 'Same red, two meanings', text: 'A red “SALE 50%” sign = excitement and urgency. A red “No stopping” sign = danger. Both are in the table: “Can also signal danger or excitement.”' },
        { t: 'h', text: 'Orange: tap here' },
        { t: 'p', text: 'Orange is friendly, playful and energetic. It encourages enthusiasm and creativity. The table gives its uses: **call-to-action buttons** and **youth brands**. In other words, the button that wants you to tap it.' },
        { t: 'h', text: 'Yellow: look here, but go easy' },
        { t: 'p', text: 'Yellow is optimistic, cheerful and grabs the eye. But the slide warns: too much of it can cause **anxiety** (“anxiety in excess”). Its uses: **promotions** and **children’s products**.' },
        { t: 'demo', id: 'clr-cta', title: 'Color the “Order now” button', caption: 'Try a few colors on the same button, and read what the table says about each one.', mount(el, api) {
          const tried = new Set();
          const verdict = { orange: 'That’s exactly what the table says: **Call-to-action buttons**.', red: 'It works: red creates urgency, and its use is **Sales**. But the table gives call-to-action buttons to orange.', yellow: 'It grabs the eye, but too much of it can cause anxiety.', green: 'It feels like nature and wealth. Better for a finance brand or a natural product.', blue: 'Trust and calm. Great for a hospital or a tech company, but not the color that “pushes” you most.', purple: 'Luxury and mystery. It suits a beauty product or something premium.', black: 'Sophisticated and powerful, but it can feel heavy. Common in luxury and fashion.', white: 'Clean and simple. On its own, on a light background, it can disappear.' };
          el.innerHTML = `<div class="clr-cta"><div class="clr-cta__phone"></div><div class="clr-cta__side"><div class="clr-cta__chips" role="group" aria-label="Button colors">${COLORS.map(c => `<button type="button" class="clr-chip" data-k="${c.k}" style="--c:${c.hex}" aria-label="${c.name}" title="${c.name}"></button>`).join('')}</div><div class="clr-cta__read" aria-live="polite"></div></div></div>`;
          const draw = k => {
            const c = COLORS.find(x => x.k === k); tried.add(k);
            el.querySelector('.clr-cta__phone').innerHTML = phone({ hex: c.hex, on: c.on, name: c.name });
            el.querySelectorAll('.clr-chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
            el.querySelector('.clr-cta__read').innerHTML = `<p class="clr-cta__name"><b>${c.name}</b></p><p dir="ltr" class="clr-cta__en">${c.imp}<br><span>Common uses: ${c.use}</span></p><p>${api.rich(verdict[k])}</p>`;
            if (tried.size >= 4) api.award(5, { from: el.querySelector('.clr-cta__chips'), key: 'demo:clr-cta' });
          };
          el.querySelectorAll('.clr-chip').forEach(b => b.addEventListener('click', () => { api.sfx('pop'); draw(b.dataset.k); }));
          draw('orange'); tried.clear(); tried.add('orange');
        } },
        { t: 'why', text: 'These three are high-energy colors. They catch the eye fast, so they create a “right now” feeling. That’s why you find them on sales, food and buttons.' },
        { t: 'trap', text: '**Appetite** is written under red only, not orange. **Call-to-action** belongs to orange. **Children’s products** belong to yellow. And a meditation app that’s all red? Wrong, because red creates urgency.', wrong: 'Orange stimulates appetite; yellow is for call-to-action buttons', right: 'Red → appetite & food brands · Orange → call-to-action · Yellow → children’s products' },
        { t: 'tip', text: 'Red = hungry and in a hurry. Orange = tap here. Yellow = look here, just don’t overdo it.' },
        { t: 'check', q: 'co07' },
        { t: 'check', q: 'co09' },
        { t: 'check', q: 'co11' },
        { t: 'check', q: 'co12' },
        { t: 'check', q: 'co13' },
        { t: 'check', q: 'co32' }
      ]
    },
    /* ------------------------------------------------------------ 4 */
    {
      id: 'color-calm', title: 'The calmer five', en: 'Green · Blue · Purple · Black · White', ref: 'L02 · slide 20', scene: 'cold',
      blocks: [
        { t: 'say', who: 'drop:#2F47E8', text: 'These five are calmer. But each one says something different: nature, trust, luxury, power, simplicity.' },
        { t: 'table', dir: 'ltr', head: ['Color', 'Psychological Impact', 'Common Uses'], rows: [
          ['<span class="clr-dot" style="--c:#1FA35B"></span>Green', 'Associated with nature, health, tranquility, and wealth.', 'Eco-friendly brands, finance'],
          ['<span class="clr-dot" style="--c:#2F47E8"></span>Blue', 'Trustworthy, calming, and professional. Often used to convey stability and reliability.', 'Tech, healthcare, corporate brands'],
          ['<span class="clr-dot" style="--c:#7B3FC4"></span>Purple', 'Luxurious, mysterious, and creative. Historically linked to royalty and spirituality.', 'Beauty, premium products, spirituality'],
          ['<span class="clr-dot" style="--c:#15151C"></span>Black', 'Sophisticated, powerful, and elegant. Can also feel heavy or intimidating.', 'Luxury, fashion, editorial'],
          ['<span class="clr-dot" style="--c:#FFFFFF"></span>White', 'Clean, pure, minimalist. Enhances clarity and simplicity.', 'Tech, healthcare, modern design']
        ] },
        { t: 'grid', cols: 5, flip: true, items: COLORS.slice(3).map(c => ({ title: c.name, art: hexSw(c.hex), color: c.k === 'black' ? '#55535F' : c.hex, text: c.en + '<br><small>Uses: ' + c.use + '.</small>' })) },
        { t: 'h', text: 'Green: trees… and money' },
        { t: 'p', text: 'Green is associated with nature, health, tranquility and **wealth**. That’s why its uses are two things far apart: **eco-friendly brands** and **finance**.' },
        { t: 'h', text: 'Blue: trust' },
        { t: 'p', text: 'Blue is trustworthy, calming and professional. It’s often used to convey **stability and reliability**. Its uses: **tech**, **healthcare** and **corporate brands**.' },
        { t: 'h', text: 'Purple: royalty and mystery' },
        { t: 'p', text: 'Luxurious, mysterious and creative. Historically linked to **royalty and spirituality**. Its uses: **beauty**, **premium products** and **spirituality**.' },
        { t: 'h', text: 'Black: luxury… that can get heavy' },
        { t: 'p', text: 'Sophisticated, powerful and elegant. But it can also feel **heavy or intimidating**. Its uses: **luxury**, **fashion** and **editorial** (think magazines).' },
        { t: 'h', text: 'White: clarity' },
        { t: 'p', text: 'Clean, pure and minimalist. It enhances **clarity and simplicity**. Its uses: **tech**, **healthcare** and **modern design**.' },
        { t: 'example', title: 'A walk down the street', text: 'A hospital or a big company: lots of blue. A natural-products shop or a banking app: green. An expensive makeup brand: purple or black. A tech company’s website: lots of white and space. Each one picked the color whose uses in the table match it.' },
        { t: 'why', text: 'Blue reminds you of the sky and the sea, things that are steady and always there. So your brain links it to stability and trust. Black reminds you of night and heavy things, so it feels powerful, and maybe intimidating.' },
        { t: 'trap', text: 'Blue and white **both** list Tech and healthcare in their uses! The difference is the impact: blue = trustworthy, calming, professional. White = clean, pure, minimalist. And careful: sales and warnings are not blue’s uses. Those belong to red.', wrong: 'Blue: sales and warnings', right: 'Blue: tech, healthcare, corporate brands' },
        { t: 'tip', text: 'Green = trees and money. Blue = trust. Purple = royalty and beauty. Black = heavy luxury. White = clarity and simplicity.' },
        { t: 'check', q: 'co14' },
        { t: 'check', q: 'co15' },
        { t: 'check', q: 'co17' },
        { t: 'check', q: 'co18' },
        { t: 'check', q: 'co20' },
        { t: 'check', q: 'co22' },
        { t: 'check', q: 'co31' }
      ]
    },
    /* ------------------------------------------------------------ 5 */
    {
      id: 'color-principles', title: '4 things happening in your brain', en: 'Psychological principles at play', ref: 'L02 · slide 21', scene: 'colorSphere',
      blocks: [
        { t: 'say', who: 'drop:#8B7BFF', text: 'So why does color affect us at all? The slide answers with 4 principles. All four come up in the exam as definitions, so learn the name of each one.' },
        { t: 'grid', cols: 2, items: [
          { title: 'Color Associations', text: 'Your brain links every color to experiences and emotions. Those links are shaped by culture, age and context.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="14" cy="24" r="7"/><circle cx="34" cy="14" r="5"/><circle cx="34" cy="34" r="5"/><path d="M20 21l9-5M20 27l9 5"/></svg>`, color: '#8B7BFF' },
          { title: 'Contrast and Attention', text: 'Bright colors, or colors that stand out from what’s around them, grab the eye and guide it.', art: `<svg viewBox="0 0 48 48"><g fill="#55535F">${Array.from({ length: 16 }, (_, k) => `<circle cx="${9 + (k % 4) * 10}" cy="${9 + Math.floor(k / 4) * 10}" r="3"/>`).join('')}</g><circle cx="29" cy="19" r="3.6" fill="#FF3E8A"/></svg>`, color: '#FF3E8A' },
          { title: 'Emotional Priming', text: 'Color gets you ready to feel a certain way before you read a single word.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 34h32"/><path d="M8 34c6-14 12-20 16-20s10 6 16 20" opacity=".6"/><path d="M24 8v6"/></svg>`, color: '#7FE7FF' },
          { title: 'Brand Identity', text: 'The same color every time = the brand gets recognized and trusted.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="14" width="10" height="20" fill="currentColor"/><rect x="19" y="14" width="10" height="20" fill="currentColor" opacity=".7"/><rect x="32" y="14" width="10" height="20" fill="currentColor" opacity=".45"/></svg>`, color: '#FFC21A' }
        ] },
        { t: 'quote', text: '<b>Color Associations:</b> Our brains link colors to experiences and emotions—often shaped by culture, age, and context.<br><b>Contrast and Attention:</b> Bright or contrasting colors grab attention and guide the viewer’s eye.<br><b>Emotional Priming:</b> Colors can subtly prime viewers to feel a certain way before they even read a word.<br><b>Brand Identity:</b> Consistent color use builds recognition and trust. Think Coca-Cola red or Facebook blue.', ref: 'L02 · S21' },
        { t: 'demo', id: 'clr-contrast', title: 'Raise the contrast and watch where your eye goes', caption: 'That square was there from the start. Only once it stood out from its neighbors did your eye go to it on its own. That’s Contrast and Attention.', mount(el, api) {
          const target = 23;
          el.innerHTML = `<div class="clr-con"><div class="clr-con__grid" aria-hidden="true">${Array.from({ length: 40 }, (_, k) => `<i${k === target ? ' class="is-t"' : ''}></i>`).join('')}</div><label class="clr-con__lab"><span>Contrast</span><input type="range" min="0" max="100" value="0" aria-label="Contrast"><b class="hud-num" dir="ltr">0%</b></label></div>`;
          const inp = el.querySelector('input'), t = el.querySelector('.is-t'), out = el.querySelector('b');
          const mixC = v => { const a = [85, 83, 95], b = [255, 62, 138]; return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * v)).join(',')})`; };
          const draw = () => { const v = inp.value / 100; t.style.background = mixC(v); t.style.boxShadow = v > .6 ? `0 0 ${Math.round(v * 18)}px rgba(255,62,138,${v * .7})` : 'none'; out.textContent = inp.value + '%'; if (v >= .8) api.award(5, { from: inp, key: 'demo:clr-contrast' }); };
          inp.addEventListener('input', draw); draw();
        } },
        { t: 'example', title: 'Priming in a hospital ad', text: 'A hospital ad with a calm blue background. Before you read the numbers and the services, you’ve already calmed down a little. That’s **Emotional Priming**: the color got you ready.' },
        { t: 'example', title: 'The brand from its color alone', text: 'Spot a certain color on its own, on a delivery truck in the street, and sometimes you know the brand before you read its name. The slide’s examples: **Coca-Cola red** and **Facebook blue**. The secret is consistency: the same color every time.' },
        { t: 'why', text: 'The brain loves shortcuts. Instead of thinking everything through from scratch, it goes back to old associations. And color is the fastest key to those associations.' },
        { t: 'trap', text: 'Two of them get mixed up. **Color Associations** = your brain links color to experiences and emotions (shaped by culture, age and context). **Emotional Priming** = color gets you ready for a feeling **before you read**. If the question says “before they even read a word”, it’s Priming.', wrong: '“Before they even read a word” = Color Associations', right: '“Before they even read a word” = Emotional Priming' },
        { t: 'tip', text: 'Associations = memory. Contrast = the eye. Priming = before the words. Brand Identity = repetition.' },
        { t: 'check', q: 'co23' },
        { t: 'check', q: 'co24' },
        { t: 'check', q: 'co25' },
        { t: 'check', q: 'co26' }
      ]
    },
    /* ------------------------------------------------------------ 6 */
    {
      id: 'color-culture', title: 'Same color, different meaning', en: 'Cultural considerations', ref: 'L02 · slide 21', scene: 'neutrals',
      blocks: [
        { t: 'say', who: 'drop:#FFFFFF', text: 'A wedding dress is white, right? In other cultures, white is the color of grief. A color doesn’t have one meaning everywhere in the world.' },
        { t: 'quote', text: 'Color meanings are not universal: In Western cultures, white often symbolizes purity; in some Eastern cultures, it’s linked to mourning. Red may mean love in one context and danger or luck in another.', ref: 'L02 · S21', ar: 'In short: white = purity in the West, mourning in some Eastern cultures. Red = love, or danger, or luck.' },
        { t: 'compare', left: { title: 'In Western cultures', en: 'white = purity', text: 'White is a symbol of **purity**. That’s why the bride wears white.', art: `<svg viewBox="0 0 220 90" fill="none" stroke="#EDEBE6" stroke-width="1.6"><circle cx="92" cy="45" r="22"/><circle cx="124" cy="45" r="22"/></svg>` }, right: { title: 'In some Eastern cultures', en: 'white = mourning', text: 'White is linked to **mourning**. So it can be a funeral color.', art: `<svg viewBox="0 0 220 90" fill="none" stroke="#7E7C8B" stroke-width="1.6"><path d="M110 74V36"/><path d="M110 36c-10-14-24-12-28-4 10 0 20 2 28 4zM110 36c10-14 24-12 28-4-10 0-20 2-28 4z"/><path d="M80 78h60"/></svg>` }, note: 'Same color. Opposite feeling. The difference is in the eye of the viewer, not in the color.' },
        { t: 'demo', id: 'clr-culture', title: 'Red in 3 contexts', caption: 'The slide: “Red may mean love in one context and danger or luck in another.”', mount(el, api) {
          /* ar = the button label (same key as the Arabic file) · en = the meaning */
          const ctxs = [
            { k: 'love', ar: 'Love', en: 'love', d: 'A Valentine’s card or a red rose: here red means love and passion.', svg: `<path d="M110 150C60 116 44 92 52 70c8-22 38-26 58-4 20-22 50-18 58 4 8 22-8 46-58 80z" fill="#E5322D"/>` },
            { k: 'danger', ar: 'Danger', en: 'danger', d: 'A warning sign or an emergency button: here red means danger.', svg: `<path d="M110 40l70 120H40z" fill="none" stroke="#E5322D" stroke-width="10" stroke-linejoin="round"/><path d="M110 86v34" stroke="#EDEBE6" stroke-width="10" stroke-linecap="round"/><circle cx="110" cy="138" r="6" fill="#EDEBE6"/>` },
            { k: 'luck', ar: 'Luck', en: 'luck', d: 'In some other cultures, red envelopes are given as gifts on holidays: here red means luck.', svg: `<rect x="66" y="46" width="88" height="118" rx="6" fill="#E5322D"/><circle cx="110" cy="96" r="18" fill="none" stroke="#FFC21A" stroke-width="5"/><path d="M66 70l44 30 44-30" fill="none" stroke="#B51F1A" stroke-width="3"/>` }
          ];
          const seen = new Set();
          el.innerHTML = `<div class="clr-cul"><div class="clr-cul__btns" role="group" aria-label="Context">${ctxs.map(c => `<button type="button" class="btn btn--sm" data-k="${c.k}" aria-pressed="false">${c.ar}</button>`).join('')}</div><div class="clr-cul__view"><svg class="clr-cul__art" viewBox="0 0 220 200" role="img" aria-label="red in context"></svg><p class="clr-cul__d" aria-live="polite"></p></div></div>`;
          const draw = k => { const c = ctxs.find(x => x.k === k); seen.add(k); el.querySelector('.clr-cul__art').innerHTML = c.svg; el.querySelector('.clr-cul__d').innerHTML = `<b>Red = ${c.en}</b><br>${c.d}`; el.querySelectorAll('[data-k]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k))); if (seen.size === 3) api.award(5, { from: el.querySelector('.clr-cul__art'), key: 'demo:clr-culture' }); };
          el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { api.sfx('pop'); draw(b.dataset.k); }));
          draw('love'); seen.clear(); seen.add('love');
        } },
        { t: 'example', title: 'Designing for a client outside Egypt', text: 'If you’re designing an invitation for a client from another culture, don’t assume white means joy. Ask first. One wrong color can flip the whole message.' },
        { t: 'why', text: 'The meaning isn’t inside the color. It’s inside the head of whoever is looking. It’s the same idea from the start of the lecture: “Different minds perceive things differently.”' },
        { t: 'trap', text: 'A famous true-or-false question: “Color meanings are universal.” The answer: **False**. And white = **purity** in the West and **mourning** in some Eastern cultures, not the other way round.', wrong: 'Color meanings are universal across all cultures', right: 'Color meanings are not universal' },
        { t: 'quote', text: 'Color is silent, but it speaks volumes.', ref: 'L02 · S21', ar: 'In short: color makes no sound, but it says a lot.' },
        { t: 'tip', text: 'White: the West = purity, some Eastern cultures = mourning. Red: love, danger, luck. And the closing line: “Color is silent, but it speaks volumes.”' },
        { t: 'check', q: 'co27' },
        { t: 'check', q: 'co28' },
        { t: 'check', q: 'co29' },
        { t: 'check', q: 'co30' },
        { t: 'check', q: 'co33' }
      ]
    }
  ]
};
