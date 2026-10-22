// Black Square Studio trials: Read the Feeling (composition → word) and Allowed or Not? (section-work rules).
import { sqPage, SQ, LECTURE_WORDS, SECTION_WORDS } from '../content/lessons/_express-art.js';
import { READ } from '../content/lessons/express.js';
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
const wordBtn = w => `<span class="exp-ch"><b dir="ltr">${w}</b><small>${SQ[w].ar}</small></span>`;

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
const RULES = [
  /* allowed */
  { ok: true, s: 'ترسم مربعات', art: paper(sq(28, 40, 34) + sq(78, 74, 24) + sq(100, 30, 16), 'Squares on a page'), en: 'You can ONLY USE LINES & SQUARES' },
  { ok: true, s: 'ترسم خطوط', art: paper(`<path d="M15 40H135M15 75H135M15 110H135" stroke="${INK}" stroke-width="1.6"/>`, 'Lines on a page'), en: 'You can ONLY USE LINES & SQUARES' },
  { ok: true, s: 'تحط ٤٠ مربع في صفحة واحدة', art: paper(Array.from({ length: 40 }, (_, k) => sq(12 + (k % 8) * 16, 18 + Math.floor(k / 8) * 24, 10)).join(''), 'Forty small squares'), en: 'as many as you like' },
  { ok: true, s: 'تلوّن مربع بالأحمر', art: paper(sq(30, 55, 30) + `<rect x="66" y="55" width="30" height="30" fill="${RED}"/>` + sq(102, 55, 30), 'One red square between black ones'), en: play('COLOR') },
  { ok: true, s: 'تميّل مربع ٤٥ درجة', art: paper(sq(53, 53, 44, 'transform="rotate(45 75 75)"'), 'A square turned 45 degrees'), en: play('ORIENTATION') },
  { ok: true, s: 'تقلّل شفافية مربع لـ ٤٠٪', art: paper(sq(22, 52, 46) + sq(82, 52, 46, 'opacity=".4"'), 'A solid square next to a square at 40 percent opacity'), en: play('OPACITY') },
  { ok: true, s: 'تكرّر نفس المربع كذا مرة', art: paper([0, 1, 2, 3, 4].map(k => sq(14 + k * 26, 64, 18)).join(''), 'The same square repeated in a row'), en: play('REPETITION') },
  { ok: true, s: 'تكبّر مربع وتصغّر التاني', art: paper(sq(18, 30, 84) + sq(112, 96, 18), 'One big square and one small square'), en: play('SIZE') },
  { ok: true, s: 'تزق المربع لركن الصفحة', art: paper(sq(112, 112, 30), 'A square pushed into the corner'), en: play('POSITION') },
  { ok: true, s: 'البوكس من غير Fill، وStroke أسود 1 pt', art: paper('', 'An empty box with a thin black stroke'), en: 'box with no FILL and a 1 pt black STROKE' },
  { ok: true, s: 'الدوكيومنت مربع ١٥ × ١٥ سم', art: sheet(arrowDef + docPage(46, 32, 96, 96) + dim(46, 22, 142, 22, '15 cm', 94, 15) + dim(154, 32, 154, 128, '15 cm', 170, 80, 90), 'A square page, 15 by 15 cm'), en: 'Square (15*15 cm)' },
  { ok: true, s: '٦ صفحات في الدوكيومنت', art: sheet(grid(3, 2, (c, r) => c + r * 3 + 1), 'Six pages'), en: '6 Pages' },
  { ok: true, s: '٣ كلمات، ولكل كلمة محاولتين', art: sheet(grid(3, 2, (c, r) => r + 1, c => `Word ${c + 1}`), 'Three words, two trials each'), en: 'You can choose 3 words from this list (with 2 trails for each word)' },
  /* not allowed */
  { ok: false, s: 'ترسم دايرة', art: paper(`<circle cx="75" cy="75" r="34" fill="${INK}"/>`, 'A circle'), en: 'You can ONLY USE LINES & SQUARES', ar: 'والدايرة مش منهم.' },
  { ok: false, s: 'ترسم مثلث', art: paper(`<path d="M75 36L116 112H34z" fill="${INK}"/>`, 'A triangle'), en: 'You can ONLY USE LINES & SQUARES', ar: 'والمثلث مش منهم.' },
  { ok: false, s: 'تكتب كلمة RAGE جوه الصفحة', art: paper(`<text x="75" y="90" text-anchor="middle" font-family="Bebas Neue, sans-serif" font-size="46" textLength="100" lengthAdjust="spacingAndGlyphs" fill="${INK}">RAGE</text>`, 'The word RAGE written on the page'), en: 'You can ONLY USE LINES & SQUARES', ar: 'مفيش كتابة ولا فونت.' },
  { ok: false, s: 'تحط صورة فوتوغرافيا', art: paper(`<rect x="28" y="38" width="94" height="74" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M32 106l26-30 18 20 14-14 28 24" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="98" cy="56" r="7" fill="none" stroke="${INK}" stroke-width="1.6"/>`, 'A photo placeholder'), en: 'You can ONLY USE LINES & SQUARES', ar: 'مفيش صور.' },
  { ok: false, s: 'تملا البوكس نفسه بـ Fill أسود', art: paper('', 'The box itself filled black', `<rect width="150" height="150" fill="${INK}"/>`), en: 'boxes should be non filled', ar: 'المربعات اللي جوه تتملي عادي، البوكس نفسه لأ.' },
  { ok: false, s: 'تخلّي Stroke البوكس 4 pt', art: paper('', 'A box with a thick 4 point stroke', frame(4)), en: 'a 1 pt black STROKE', ar: 'السُمك ١ بوينت بس.' },
  { ok: false, s: 'تعمل الدوكيومنت A4', art: sheet(docPage(65, 6, 70, 99, 'A4') + `<text x="100" y="134" text-anchor="middle" ${FONT} font-size="12" fill="#EDEBE6">210 × 297 mm</text>`, 'An A4 page'), en: 'Square (15*15 cm)', ar: 'مربع، مش ورقة A4.' },
  { ok: false, s: 'تعمل الدوكيومنت ٢٠ × ٢٠ سم', art: sheet(arrowDef + docPage(46, 32, 96, 96) + dim(46, 22, 142, 22, '20 cm', 94, 15) + dim(154, 32, 154, 128, '20 cm', 170, 80, 90), 'A square page, 20 by 20 cm'), en: 'Square (15*15 cm)', ar: 'المقاس ١٥، مش ٢٠.' },
  { ok: false, s: '٣ صفحات بس', art: sheet(grid(3, 1, c => c + 1), 'Three pages'), en: '6 Pages', ar: '٣ كلمات × محاولتين = ٦.' },
  { ok: false, s: 'كلمتين، ولكل كلمة ٣ محاولات', art: sheet(grid(2, 3, (c, r) => r + 1, c => `Word ${c + 1}`), 'Two words, three trials each'), en: 'You can choose 3 words from this list (with 2 trails for each word)', ar: 'مش العكس.' },
  { ok: false, s: '٦ كلمات، ولكل كلمة محاولة واحدة', art: sheet(grid(6, 1, null, c => `W${c + 1}`), 'Six words, one trial each'), en: 'You can choose 3 words from this list (with 2 trails for each word)', ar: '٣ كلمات بس.' },
  { ok: false, s: 'تختار ORDER من كلمات المحاضرة', art: paper([0, 1, 2, 3].map(k => [0, 1, 2, 3].map(j => sq(24 + k * 30, 24 + j * 30, 14)).join('')).join(''), 'An orderly grid of squares'), en: 'replicate this assignment using new words to express', ar: 'اختار من الـ ١٥ كلمة، مش من كلمات المحاضرة.' }
];

export default [
  {
    id: 'express-read', title: 'اقرا الإحساس', en: 'Read the Feeling',
    how: 'تكوين من مربعات وخطوط. أنهي كلمة بيقولها؟ ١٠ جولات، ١٢ ثانية للجولة.',
    mount(el, api, ctx) {
      const words = shuffleIn([...sample(LECTURE_WORDS, 4), ...sample(SECTION_WORDS, 6)]);
      const rounds = words.map(w => {
        const t = Math.random() < .5 ? 0 : 1;
        const others = sample(Object.keys(SQ).filter(o => !near(o, w)), 3);
        const opts = shuffleIn([w, ...others]);
        return {
          art: `<div class="exp-qart">${sqPage(w, t, { label: 'A Black Square composition' })}</div>`,
          prompt: 'التكوين ده بيقول إيه؟',
          choices: opts.map(o => ({ html: wordBtn(o), ok: o === w, label: `${o} (${SQ[o].ar})` })),
          explain: `<b dir="ltr">${w}</b> · ${READ[w]}`
        };
      });
      return quickfire(el, api, ctx, { id: 'express-read', time: 12, layout: 'words', rounds, intro: { title: 'اقرا الإحساس', text: 'كل جولة صفحة من شغل Black Square: مربعات وخطوط جوه بوكس. اقرا العلاقات بين العناصر، وقول الكلمة.', rules: ['اختار بالأرقام ١–٤ أو بالضغط.', 'الكلمات من المحاضرة (٦) ومن ليستة السكشن (١٥).', 'ركّز في المسافة والحجم والاتجاه والتكرار، مش في عدد المربعات.'] } });
    }
  },
  {
    id: 'express-rules', title: 'مسموح ولا ممنوع؟', en: 'Allowed or Not?',
    how: 'قواعد شغل السكشن بالظبط. كل كارت حركة: مسموح ولا ممنوع؟ ١٠ جولات، ٧ ثواني للجولة.',
    mount(el, api, ctx) {
      const pick = shuffleIn([...sample(RULES.filter(r => r.ok), 5), ...sample(RULES.filter(r => !r.ok), 5)]);
      const rounds = pick.map(r => ({
        art: `<div class="exp-qart exp-qart--sm">${r.art}</div>`,
        prompt: r.s, layout: 'yn',
        choices: [{ html: '<span>✓ مسموح</span>', ok: r.ok, label: 'مسموح' }, { html: '<span>✕ ممنوع</span>', ok: !r.ok, label: 'ممنوع' }],
        explain: `من السلايد: <span dir="ltr">“${r.en}”</span>${r.ar ? ` — ${r.ar}` : ''}`
      }));
      return quickfire(el, api, ctx, { id: 'express-rules', time: 7, rounds, intro: { title: 'مسموح ولا ممنوع؟', text: 'إنت في السكشن والمعيد معدّي على الترابيزات. كل كارت حاجة بتعملها في الشغل. قرّر بسرعة: ماشية مع القواعد ولا لأ.', rules: ['١ = مسموح · ٢ = ممنوع.', 'كل القواعد من سلايد Section Works.', 'الوقت لو خلص، الجولة بتتحسب غلط.'] } });
    }
  }
];
