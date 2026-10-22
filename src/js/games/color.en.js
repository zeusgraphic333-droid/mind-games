// Color Lab trials: Vibe Check (brief → colour) and Thermostat (word → warm / cold / neutral). English edition of color.js.
import { COLORS } from '../data/psych.js';
import { quickfire, sample, shuffleIn } from './_cte-kit.js';

const C = Object.fromEntries(COLORS.map(c => [c.k, c]));
/* same name as the Arabic file: the color's name on the page */
const AR = { red: 'Red', orange: 'Orange', yellow: 'Yellow', green: 'Green', blue: 'Blue', purple: 'Purple', black: 'Black', white: 'White' };
const sw = k => `<span class="cte-sw" style="--c:${C[k].hex}"></span><span class="cte-sw__t">${AR[k]}</span>`;

const BRIEFS = [
  { b: 'A big sale: “50% off — today only”', ok: 'red', d: ['blue', 'white', 'purple'], why: 'The table: Red → Sales. And red creates urgency.' },
  { b: 'A fast-food place that wants to make you hungry', ok: 'red', d: ['blue', 'purple', 'white'], why: 'Red stimulates appetite → food brands.' },
  { b: 'A “Subscribe” button for a youth brand', ok: 'orange', d: ['black', 'purple', 'green'], why: 'Orange → Call-to-action buttons, youth brands.' },
  { b: 'A kids’ toy box with an offer on it', ok: 'yellow', d: ['black', 'purple', 'blue'], why: 'Yellow → Promotions, children’s products.' },
  { b: 'An eco-friendly products brand', ok: 'green', d: ['red', 'black', 'orange'], why: 'Green → nature, health → Eco-friendly brands.' },
  { b: 'A savings and investment app', ok: 'green', d: ['red', 'yellow', 'orange'], why: 'Green → wealth → finance.' },
  { b: 'A hospital that wants people to feel trust and calm', ok: 'blue', d: ['red', 'yellow', 'orange'], why: 'Blue → trustworthy, calming → healthcare.' },
  { b: 'A premium makeup brand', ok: 'purple', d: ['orange', 'yellow', 'green'], why: 'Purple → beauty, premium products.' },
  { b: 'A luxury fashion magazine', ok: 'black', d: ['yellow', 'orange', 'green'], why: 'Black → luxury, fashion, editorial.' },
  { b: 'A clean, minimal website for a tech company', ok: 'white', d: ['red', 'orange', 'yellow'], why: 'White → clean, minimalist → tech, modern design.' },
  { b: 'A meditation and sleep app', ok: 'blue', d: ['red', 'orange', 'yellow'], why: 'Blue → calming. Red is wrong here: it creates urgency.' },
  { b: 'A “Danger — high voltage” sign', ok: 'red', d: ['green', 'blue', 'purple'], why: 'Red can also signal danger → warnings.' }
];

const WORDS = [
  ...['Warmth', 'Glory', 'Love', 'Prosperity', 'Energy'].map(w => ({ w, g: 'warm' })),
  ...['Tranquility', 'Peace', 'Trust', 'Nobility'].map(w => ({ w, g: 'cold' })),
  ...['Friendly', 'Formal', 'Gloomy', 'Solid', 'Classy', 'Clean', 'Purity'].map(w => ({ w, g: 'neutral' }))
];
/* same keys as the Arabic file: `ar` = the label on the button, `en` = the word used in the explanation */
const GROUP = {
  warm: { ar: 'Warm', en: 'warm', strip: ['#FF6A13', '#FFAF1E', '#FF1F1F', '#FFD21A'] },
  cold: { ar: 'Cold', en: 'cold', strip: ['#66F2C6', '#5BE0F7', '#2F8BE0', '#8E77DA'] },
  neutral: { ar: 'Neutral', en: 'neutral', strip: ['#B49F70', '#6B6457', '#B2B2F5', '#D9D9D9'] }
};
const strip = g => `<span class="cte-strip">${GROUP[g].strip.map(c => `<i style="--c:${c}"></i>`).join('')}</span><span class="cte-sw__t">${GROUP[g].ar}</span>`;

export default [
  {
    id: 'color-vibe', title: 'Vibe Check', en: 'brief → color',
    how: 'A quick brief comes in, and you pick the color the lecture’s table points to. 8 rounds, 9 seconds each.',
    mount(el, api, ctx) {
      const rounds = sample(BRIEFS, 8).map(r => {
        const keys = shuffleIn([r.ok, ...r.d]);
        return { prompt: r.b, sub: 'Which color fits this brief?', choices: keys.map(k => ({ html: sw(k), ok: k === r.ok, label: AR[k] })), explain: `<span dir="auto">${r.why}</span>`, layout: 'swatch' };
      });
      return quickfire(el, api, ctx, { id: 'color-vibe', time: 9, rounds, intro: { title: 'Vibe Check', text: 'You’re the designer, and the client is in a hurry. Each brief has one color the table points to. Pick it before time runs out.', rules: ['Tap the color, or use keys 1–4.', 'The right answer = the one the Common Uses or Psychological Impact column points to.', 'If time runs out, the round counts as wrong.'] } });
    }
  },
  {
    id: 'color-thermo', title: 'Thermostat', en: 'word → warm, cold or neutral',
    how: 'A word from the slides drops in. Warm, cold or neutral? 12 quick rounds, 5 seconds each.',
    mount(el, api, ctx) {
      const rounds = sample(WORDS, 12).map(({ w, g }) => ({
        prompt: `<span class="cte-word" dir="ltr">${w}</span>`, sub: 'Warm, cold or neutral?',
        choices: ['warm', 'cold', 'neutral'].map(k => ({ html: strip(k), ok: k === g, label: GROUP[k].ar })),
        explain: `${w} is ${GROUP[g].en}${w === 'Nobility' ? ', and it shows up twice in the cold set.' : g === 'neutral' ? ': it’s from the third graphic, the one with no title.' : '.'}`,
        layout: 'row'
      }));
      return quickfire(el, api, ctx, { id: 'color-thermo', time: 5, rounds, intro: { title: 'Thermostat', text: 'Every word comes from the three graphics on the slides: warm, cold and neutral. Sort it fast.', rules: ['1 = Warm · 2 = Cold · 3 = Neutral.', 'The words are written exactly as on the slides.', 'Nobility shows up twice in the cold set. Stay sharp.'] } });
    }
  }
];
