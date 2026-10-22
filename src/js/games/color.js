// Color Lab trials: Vibe Check (brief → colour) and Thermostat (word → warm / cold / neutral).
import { COLORS } from '../data/psych.js';
import { quickfire, sample, shuffleIn } from './_cte-kit.js';

const C = Object.fromEntries(COLORS.map(c => [c.k, c]));
const AR = { red: 'أحمر', orange: 'برتقالي', yellow: 'أصفر', green: 'أخضر', blue: 'أزرق', purple: 'بنفسجي', black: 'أسود', white: 'أبيض' };
const sw = k => `<span class="cte-sw" style="--c:${C[k].hex}"></span><span class="cte-sw__t">${AR[k]}<small dir="ltr">${C[k].name}</small></span>`;

const BRIEFS = [
  { b: 'أوكازيون: "خصم ٥٠٪ — النهارده بس"', ok: 'red', d: ['blue', 'white', 'purple'], why: 'الجدول: Red → Sales. والأحمر بيعمل استعجال.' },
  { b: 'مطعم أكل سريع عايز يفتح نفسك', ok: 'red', d: ['blue', 'purple', 'white'], why: 'Red stimulates appetite → food brands.' },
  { b: 'زرار "اشترك" لبراند شبابي', ok: 'orange', d: ['black', 'purple', 'green'], why: 'Orange → Call-to-action buttons, youth brands.' },
  { b: 'علبة لعبة أطفال وعليها عرض', ok: 'yellow', d: ['black', 'purple', 'blue'], why: 'Yellow → Promotions, children’s products.' },
  { b: 'براند منتجات صديقة للبيئة', ok: 'green', d: ['red', 'black', 'orange'], why: 'Green → nature, health → Eco-friendly brands.' },
  { b: 'أبلكيشن ادخار واستثمار', ok: 'green', d: ['red', 'yellow', 'orange'], why: 'Green → wealth → finance.' },
  { b: 'مستشفى عايز الناس تحس بثقة وهدوء', ok: 'blue', d: ['red', 'yellow', 'orange'], why: 'Blue → trustworthy, calming → healthcare.' },
  { b: 'براند ميكب بريميوم', ok: 'purple', d: ['orange', 'yellow', 'green'], why: 'Purple → beauty, premium products.' },
  { b: 'مجلة موضة فخمة', ok: 'black', d: ['yellow', 'orange', 'green'], why: 'Black → luxury, fashion, editorial.' },
  { b: 'موقع شركة تكنولوجيا مينيمال ونضيف', ok: 'white', d: ['red', 'orange', 'yellow'], why: 'White → clean, minimalist → tech, modern design.' },
  { b: 'أبلكيشن تأمل ونوم', ok: 'blue', d: ['red', 'orange', 'yellow'], why: 'Blue calming. الأحمر هنا غلط: بيعمل urgency.' },
  { b: 'يافطة "خطر — كهربا"', ok: 'red', d: ['green', 'blue', 'purple'], why: 'Red can also signal danger → warnings.' }
];

const WORDS = [
  ...['Warmth', 'Glory', 'Love', 'Prosperity', 'Energy'].map(w => ({ w, g: 'warm' })),
  ...['Tranquility', 'Peace', 'Trust', 'Nobility'].map(w => ({ w, g: 'cold' })),
  ...['Friendly', 'Formal', 'Gloomy', 'Solid', 'Classy', 'Clean', 'Purity'].map(w => ({ w, g: 'neutral' }))
];
const WAR = { Warmth: 'دفا', Glory: 'مجد', Love: 'حب', Prosperity: 'رخاء', Energy: 'طاقة', Tranquility: 'هدوء', Peace: 'سلام', Trust: 'ثقة', Nobility: 'نبالة', Friendly: 'ودود', Formal: 'رسمي', Gloomy: 'كئيب', Solid: 'متين', Classy: 'شيك', Clean: 'نضيف', Purity: 'نقاء' };
const GROUP = {
  warm: { ar: 'دافي', en: 'Warm', strip: ['#FF6A13', '#FFAF1E', '#FF1F1F', '#FFD21A'] },
  cold: { ar: 'بارد', en: 'Cold', strip: ['#66F2C6', '#5BE0F7', '#2F8BE0', '#8E77DA'] },
  neutral: { ar: 'محايد', en: 'Neutral', strip: ['#B49F70', '#6B6457', '#B2B2F5', '#D9D9D9'] }
};
const strip = g => `<span class="cte-strip">${GROUP[g].strip.map(c => `<i style="--c:${c}"></i>`).join('')}</span><span class="cte-sw__t">${GROUP[g].ar}<small dir="ltr">${GROUP[g].en}</small></span>`;

export default [
  {
    id: 'color-vibe', title: 'فايب تشيك', en: 'Vibe Check',
    how: 'بريف سريع ييجي، وانت تختار اللون اللي الجدول بتاع المحاضرة بيقول عليه. ٨ جولات، ٩ ثواني لكل جولة.',
    mount(el, api, ctx) {
      const rounds = sample(BRIEFS, 8).map(r => {
        const keys = shuffleIn([r.ok, ...r.d]);
        return { prompt: r.b, sub: 'أنهي لون يناسب البريف ده؟', choices: keys.map(k => ({ html: sw(k), ok: k === r.ok, label: AR[k] })), explain: `<span dir="auto">${r.why}</span>`, layout: 'swatch' };
      });
      return quickfire(el, api, ctx, { id: 'color-vibe', time: 9, rounds, intro: { title: 'فايب تشيك', text: 'إنت المصمم، والعميل مستعجل. كل بريف ليه لون واحد الجدول بيقول عليه. اختاره قبل ما الوقت يخلص.', rules: ['اضغط على اللون، أو استخدم الأرقام ١–٤.', 'الإجابة الصح = اللي في عمود Common Uses أو Psychological Impact.', 'لو الوقت خلص، الجولة بتتحسب غلط.'] } });
    }
  },
  {
    id: 'color-thermo', title: 'الترموستات', en: 'Thermostat',
    how: 'كلمة من السلايدات تنزل. دافية، باردة، ولا محايدة؟ ١٢ جولة سريعة، ٥ ثواني لكل واحدة.',
    mount(el, api, ctx) {
      const rounds = sample(WORDS, 12).map(({ w, g }) => ({
        prompt: `<span class="cte-word" dir="ltr">${w}</span>`, sub: WAR[w],
        choices: ['warm', 'cold', 'neutral'].map(k => ({ html: strip(k), ok: k === g, label: GROUP[k].ar })),
        explain: `${w} = ${GROUP[g].ar} (${GROUP[g].en})${w === 'Nobility' ? ' — ومتكررة مرتين في البارد.' : g === 'neutral' ? ' — من الجراف التالت اللي من غير عنوان.' : '.'}`,
        layout: 'row'
      }));
      return quickfire(el, api, ctx, { id: 'color-thermo', time: 5, rounds, intro: { title: 'الترموستات', text: 'كل كلمة من الجرافات التلاتة في السلايدات: الدافي، والبارد، والمحايد. صنّفها بسرعة.', rules: ['١ = دافي · ٢ = بارد · ٣ = محايد.', 'الكلمات بالإنجليزي زي السلايد بالظبط.', 'Nobility موجودة في البارد مرتين، ركّز.'] } });
    }
  }
];
