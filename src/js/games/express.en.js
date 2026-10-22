// Black Square Studio trials: Read the Feeling (composition → word) and Allowed or Not? (section-work rules). English edition of express.js.
import { sqPage, SQ, LECTURE_WORDS, SECTION_WORDS } from '../content/lessons/_express-art.js';
import { READ } from '../content/lessons/express.en.js';
import { quickfire, sample, shuffleIn } from './_cte-kit.js';

/* words that can look alike on paper: a round never offers one of these next to the answer */
const LOOKALIKE = [
  ['Order', 'Harmony', 'Justice', 'Stability'],
  ['Chaos', 'Congested', 'Disorder', 'Rage'],
  ['Increase', 'Upbeat', 'Playful', 'Fluidity'],
  ['Bold', 'Dominance', 'Pressure'],
  ['Alienated', 'Surprise', 'Acceptance'],
  ['Tranquility', 'Melancholy'],
  ['Alienated', 'Melancholy'], ['Alienated', 'Tranquility'], ['Surprise', 'Disorder'], ['Order', 'Disorder'], ['Order', 'Acceptance'], ['Order', 'Surprise'],
  ['Harmony', 'Surprise'], ['Harmony', 'Acceptance'], ['Tension', 'Pressure'], ['Tranquility', 'Stability'], ['Increase', 'Stability'],
  ['Surprise', 'Dominance'], ['Pressure', 'Acceptance'], ['Order', 'Tranquility'], ['Bold', 'Alienated'], ['Bold', 'Stability'], ['Tension', 'Tranquility'], ['Harmony', 'Melancholy']
];
const near = (a, b) => a === b || LOOKALIKE.some(g => g.includes(a) && g.includes(b));
const wordBtn = w => `<span class="exp-ch"><b>${w}</b></span>`;

/* ---------- mini pages for the rules trial ---------- */
const INK = '#0B0B10', PAPER = '#ECEAE4', RED = '#E0312B';
const frame = (w = 1, fill = 'none') => `<rect width="150" height="150" fill="${fill}" stroke="${INK}" stroke-width="${w}"/>`;
const paper = (inner, label, fr = frame()) => `<svg class="exp-page" viewBox="-5 -5 160 160" role="img" aria-label="${label}"><rect x="-5" y="-5" width="160" height="160" fill="${PAPER}" rx="2"/>${fr}${inner}</svg>`;
const sq = (x, y, s, extra = '') => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${INK}" ${extra}/>`;
/* a plain sheet for document-level rules (size, page count) */
const sheet = (inner, label, vb = '0 0 200 150') => `<svg class="exp-page exp-page--doc" viewBox="${vb}" role="img" aria-label="${label}" direction="ltr">${inner}</svg>`;
const FONT = `font-family="IBM Plex Sans Arabic, sans-serif" font-weight="600"`;
const docPage = (x, y, w, h, t = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPER}" rx="1.5"/><rect x="${x + w * .08}" y="${y + h * .08}" width="${w * .84}" height="${h * .84}" fill="none" stroke="${INK}" stroke-width=".8"/>${t ? `<text x="${x + w / 2}" y="${y + h / 2 + Math.min(w, h) * .11}" text-anchor="middle" ${FONT} font-size="${Math.min(w, h) * .3}" fill="${INK}">${t}</text>` : ''}`;
const dim = (x1, y1, x2, y2, t, tx, ty, rot = 0) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#EDEBE6" stroke-width="1" marker-start="url(#xa)" marker-end="url(#xa)"/><text x="${tx}" y="${ty}" text-anchor="middle" ${FONT} font-size="12" fill="#EDEBE6"${rot ? ` transform="rotate(${rot} ${tx} ${ty})"` : ''}>${t}</text>`;
const arrowDef = `<defs><marker id="xa" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L8 4L0 8z" fill="#EDEBE6"/></marker></defs>`;
/* pages in a grid; `top` labels each column (a word), `inner` labels each page */
const grid = (cols, rows, inner, top) => {
  const head = top ? 16 : 0, S = Math.min(184 / cols - 8, (136 - head) / rows - 8);
  const x0 = (200 - cols * S - (cols - 1) * 8) / 2, y0 = head + (150 - head - rows * S - (rows - 1) * 8) / 2;
  let s = '';
  for (let c = 0; c < cols; c++) {
    if (top) s += `<text x="${x0 + c * (S + 8) + S / 2}" y="${y0 - 6}" text-anchor="middle" ${FONT} font-size="10" fill="#EDEBE6">${top(c)}</text>`;
    for (let r = 0; r < rows; r++) s += docPage(x0 + c * (S + 8), y0 + r * (S + 8), S, S, inner ? inner(c, r) : '');
  }
  return s;
};

const PLAY = 'You may play with COLOR, SIZE, OPACITY, POSITION, ORIENTATION, & REPETITION of each element';
const play = k => PLAY.replace(k, `<b>${k}</b>`);
/* s = the move on the card · en = the slide's own words · ar = the extra line after the quote (same key as the Arabic file) */
const RULES = [
  /* allowed */
  { ok: true, s: 'Draw squares', art: paper(sq(28, 40, 34) + sq(78, 74, 24) + sq(100, 30, 16), 'Squares on a page'), en: 'You can ONLY USE LINES & SQUARES' },
  { ok: true, s: 'Draw lines', art: paper(`<path d="M15 40H135M15 75H135M15 110H135" stroke="${INK}" stroke-width="1.6"/>`, 'Lines on a page'), en: 'You can ONLY USE LINES & SQUARES' },
  { ok: true, s: 'Put 40 squares on one page', art: paper(Array.from({ length: 40 }, (_, k) => sq(12 + (k % 8) * 16, 18 + Math.floor(k / 8) * 24, 10)).join(''), 'Forty small squares'), en: 'as many as you like' },
  { ok: true, s: 'Color one square red', art: paper(sq(30, 55, 30) + `<rect x="66" y="55" width="30" height="30" fill="${RED}"/>` + sq(102, 55, 30), 'One red square between black ones'), en: play('COLOR') },
  { ok: true, s: 'Tilt a square 45 degrees', art: paper(sq(53, 53, 44, 'transform="rotate(45 75 75)"'), 'A square turned 45 degrees'), en: play('ORIENTATION') },
  { ok: true, s: 'Set a square to 40% opacity', art: paper(sq(22, 52, 46) + sq(82, 52, 46, 'opacity=".4"'), 'A solid square next to a square at 40 percent opacity'), en: play('OPACITY') },
  { ok: true, s: 'Repeat the same square several times', art: paper([0, 1, 2, 3, 4].map(k => sq(14 + k * 26, 64, 18)).join(''), 'The same square repeated in a row'), en: play('REPETITION') },
  { ok: true, s: 'Make one square big and the other small', art: paper(sq(18, 30, 84) + sq(112, 96, 18), 'One big square and one small square'), en: play('SIZE') },
  { ok: true, s: 'Push the square into the corner of the page', art: paper(sq(112, 112, 30), 'A square pushed into the corner'), en: play('POSITION') },
  { ok: true, s: 'The box has no Fill and a 1 pt black Stroke', art: paper('', 'An empty box with a thin black stroke'), en: 'box with no FILL and a 1 pt black STROKE' },
  { ok: true, s: 'The document is a 15 × 15 cm square', art: sheet(arrowDef + docPage(46, 32, 96, 96) + dim(46, 22, 142, 22, '15 cm', 94, 15) + dim(154, 32, 154, 128, '15 cm', 170, 80, 90), 'A square page, 15 by 15 cm'), en: 'Square (15*15 cm)' },
  { ok: true, s: '6 pages in the document', art: sheet(grid(3, 2, (c, r) => c + r * 3 + 1), 'Six pages'), en: '6 Pages' },
  { ok: true, s: '3 words, with 2 trials for each', art: sheet(grid(3, 2, (c, r) => r + 1, c => `Word ${c + 1}`), 'Three words, two trials each'), en: 'You can choose 3 words from this list (with 2 trails for each word)' },
  /* not allowed */
  { ok: false, s: 'Draw a circle', art: paper(`<circle cx="75" cy="75" r="34" fill="${INK}"/>`, 'A circle'), en: 'You can ONLY USE LINES & SQUARES', ar: 'and a circle isn’t one of them.' },
  { ok: false, s: 'Draw a triangle', art: paper(`<path d="M75 36L116 112H34z" fill="${INK}"/>`, 'A triangle'), en: 'You can ONLY USE LINES & SQUARES', ar: 'and a triangle isn’t one of them.' },
  { ok: false, s: 'Write the word RAGE on the page', art: paper(`<text x="75" y="90" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="46" textLength="100" lengthAdjust="spacingAndGlyphs" fill="${INK}">RAGE</text>`, 'The word RAGE written on the page'), en: 'You can ONLY USE LINES & SQUARES', ar: 'no writing, no fonts.' },
  { ok: false, s: 'Add a photograph', art: paper(`<rect x="28" y="38" width="94" height="74" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M32 106l26-30 18 20 14-14 28 24" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="98" cy="56" r="7" fill="none" stroke="${INK}" stroke-width="1.6"/>`, 'A photo placeholder'), en: 'You can ONLY USE LINES & SQUARES', ar: 'no photos.' },
  { ok: false, s: 'Fill the box itself with black', art: paper('', 'The box itself filled black', `<rect width="150" height="150" fill="${INK}"/>`), en: 'boxes should be non filled', ar: 'the squares inside can be filled, the box itself can’t.' },
  { ok: false, s: 'Give the box a 4 pt Stroke', art: paper('', 'A box with a thick 4 point stroke', frame(4)), en: 'a 1 pt black STROKE', ar: 'the stroke is 1 pt only.' },
  { ok: false, s: 'Make the document A4', art: sheet(docPage(65, 6, 70, 99, 'A4') + `<text x="100" y="134" text-anchor="middle" ${FONT} font-size="12" fill="#EDEBE6">210 × 297 mm</text>`, 'An A4 page'), en: 'Square (15*15 cm)', ar: 'a square, not an A4 sheet.' },
  { ok: false, s: 'Make the document 20 × 20 cm', art: sheet(arrowDef + docPage(46, 32, 96, 96) + dim(46, 22, 142, 22, '20 cm', 94, 15) + dim(154, 32, 154, 128, '20 cm', 170, 80, 90), 'A square page, 20 by 20 cm'), en: 'Square (15*15 cm)', ar: 'it’s 15, not 20.' },
  { ok: false, s: 'Only 3 pages', art: sheet(grid(3, 1, c => c + 1), 'Three pages'), en: '6 Pages', ar: '3 words × 2 trials = 6.' },
  { ok: false, s: '2 words, with 3 trials for each', art: sheet(grid(2, 3, (c, r) => r + 1, c => `Word ${c + 1}`), 'Two words, three trials each'), en: 'You can choose 3 words from this list (with 2 trails for each word)', ar: 'not the other way round.' },
  { ok: false, s: '6 words, with 1 trial for each', art: sheet(grid(6, 1, null, c => `W${c + 1}`), 'Six words, one trial each'), en: 'You can choose 3 words from this list (with 2 trails for each word)', ar: 'only 3 words.' },
  { ok: false, s: 'Pick ORDER from the lecture words', art: paper([0, 1, 2, 3].map(k => [0, 1, 2, 3].map(j => sq(24 + k * 30, 24 + j * 30, 14)).join('')).join(''), 'An orderly grid of squares'), en: 'replicate this assignment using new words to express', ar: 'pick from the 15 section words, not the lecture words.' }
];

export default [
  {
    id: 'express-read', title: 'Read the Feeling', en: 'composition → word',
    how: 'A composition of squares and lines. Which word is it saying? 10 rounds, 12 seconds each.',
    mount(el, api, ctx) {
      const words = shuffleIn([...sample(LECTURE_WORDS, 4), ...sample(SECTION_WORDS, 6)]);
      const rounds = words.map(w => {
        const t = Math.random() < .5 ? 0 : 1;
        const others = sample(Object.keys(SQ).filter(o => !near(o, w)), 3);
        const opts = shuffleIn([w, ...others]);
        return {
          art: `<div class="exp-qart">${sqPage(w, t, { label: 'A Black Square composition' })}</div>`,
          prompt: 'What is this composition saying?',
          choices: opts.map(o => ({ html: wordBtn(o), ok: o === w, label: o })),
          explain: `<b>${w}</b> · ${READ[w]}`
        };
      });
      return quickfire(el, api, ctx, { id: 'express-read', time: 12, layout: 'words', rounds, intro: { title: 'Read the Feeling', text: 'Each round is a page of Black Square work: squares and lines inside a box. Read the relationships between the elements, and name the word.', rules: ['Answer with keys 1–4, or tap.', 'The words come from the lecture (6) and the section list (15).', 'Look at distance, size, direction and repetition, not at how many squares there are.'] } });
    }
  },
  {
    id: 'express-rules', title: 'Allowed or Not?', en: 'the section-work rules',
    how: 'The exact section-work rules. Each card is a move: allowed or not? 10 rounds, 7 seconds each.',
    mount(el, api, ctx) {
      const pick = shuffleIn([...sample(RULES.filter(r => r.ok), 5), ...sample(RULES.filter(r => !r.ok), 5)]);
      const rounds = pick.map(r => ({
        art: `<div class="exp-qart exp-qart--sm">${r.art}</div>`,
        prompt: r.s, layout: 'yn',
        choices: [{ html: '<span>✓ Allowed</span>', ok: r.ok, label: 'Allowed' }, { html: '<span>✕ Not allowed</span>', ok: !r.ok, label: 'Not allowed' }],
        explain: `From the slide: “${r.en}”${r.ar ? ` — ${r.ar}` : ''}`
      }));
      return quickfire(el, api, ctx, { id: 'express-rules', time: 7, rounds, intro: { title: 'Allowed or Not?', text: 'You’re in the section, and the TA is walking between the tables. Each card is something you do in your work. Decide fast: does it follow the rules or not?', rules: ['1 = Allowed · 2 = Not allowed.', 'Every rule comes from the Section Works slide.', 'If time runs out, the round counts as wrong.'] } });
    }
  }
];
