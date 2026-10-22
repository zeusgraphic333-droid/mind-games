// Font Mall trials: Font Swipe (brief + specimen → fits or not) and Between the Lines (combo → meaning).
import { TYPES, RBL } from '../data/psych.js';
import { FAM, RBLS, rblCard } from '../content/lessons/type.js';
import { quickfire, sample, shuffleIn } from './_cte-kit.js';

const T = Object.fromEntries(TYPES.map(t => [t.k, t]));
const AR = { serif: 'سيريف', sans: 'سانس', script: 'سكريبت', display: 'ديسبلاي', mono: 'مونو' };
const BRIEFS = [
  { b: 'جرنال يومي', fam: 'serif', txt: 'The Daily Gazette', use: 'Newspapers' },
  { b: 'مكتب محاماة', fam: 'serif', txt: 'Justice & Partners', use: 'Law firms' },
  { b: 'جامعة عريقة', fam: 'serif', txt: 'Faculty of Arts', use: 'Academic institutions' },
  { b: 'شركة تكنولوجيا', fam: 'sans', txt: 'Nexa Cloud', use: 'Tech companies', no: ['mono'] },
  { b: 'براند مينيمال', fam: 'sans', txt: 'plain studio', use: 'Minimalist brands' },
  { b: 'شاشة إعدادات في أبلكيشن', fam: 'sans', txt: 'Settings', use: 'UI design', no: ['mono'] },
  { b: 'دعوة فرح', fam: 'script', txt: 'Mariam & Omar', use: 'Wedding invitations' },
  { b: 'بوتيك ورد', fam: 'script', txt: 'Rosa Boutique', use: 'Boutique branding' },
  { b: 'بوستر حفلة', fam: 'display', txt: 'LIVE TONIGHT', use: 'Posters' },
  { b: 'عنوان بوستر إعلاني', fam: 'display', txt: 'GRAND OPENING', use: 'Headlines', no: ['serif'] },
  { b: 'إعلان على الطريق', fam: 'display', txt: 'MEGA SALE', use: 'Advertising' },
  { b: 'محرر كود', fam: 'mono', txt: 'const x = 42;', use: 'Coding environments' },
  { b: 'تصميم ريترو شبه الآلة الكاتبة', fam: 'mono', txt: 'Dear Sir,', use: 'Retro designs' }
];
const specimen = (fam, txt) => `<div class="typ-swipe__card" dir="ltr"><span style="font-family:${FAM[fam]};${fam === 'display' ? 'text-transform:uppercase;letter-spacing:.02em;font-size:58px' : fam === 'script' ? 'font-size:46px' : 'font-size:38px'}">${txt}</span><small>${T[fam].name}</small></div>`;

export default [
  {
    id: 'type-swipe', title: 'فونت سوايب', en: 'Font Swipe',
    how: 'بريف + خط. ينفع ولا لأ؟ ١٠ جولات، ٦ ثواني لكل جولة. كل بريف من عمود Use في السلايد.',
    mount(el, api, ctx) {
      const rounds = sample(BRIEFS, 10).map((r, k) => {
        const match = k % 2 === 0 ? true : Math.random() < .35;
        const others = Object.keys(AR).filter(f => f !== r.fam && !(r.no || []).includes(f)); // r.no: families the slides would also allow
        const fam = match ? r.fam : others[Math.floor(Math.random() * others.length)];
        const ok = fam === r.fam;
        return {
          art: specimen(fam, r.txt), prompt: r.b, sub: `الخط ده (${AR[fam]}) ينفع للبريف ده؟`, layout: 'yn',
          choices: [{ html: '<span>✓ ينفع</span>', ok, label: 'ينفع' }, { html: '<span>✕ مش ينفع</span>', ok: !ok, label: 'مش ينفع' }],
          explain: `<span dir="ltr">${r.use} → ${T[r.fam].name}</span>`
        };
      });
      return quickfire(el, api, ctx, { id: 'type-swipe', time: 6, rounds: shuffleIn(rounds), intro: { title: 'فونت سوايب', text: 'إنت آرت دايركتور ووقتك ضيق. كل كارت فيه بريف وخط مقترح. قرّر بسرعة: ينفع ولا لأ.', rules: ['١ = ينفع · ٢ = مش ينفع.', 'الحكم من جدول How Typefaces Speak to Us (عمود Use).', 'الوقت لو خلص، الجولة بتتحسب غلط.'] } });
    }
  },
  {
    id: 'type-rbl', title: 'ما بين السطور', en: 'Between the Lines',
    how: 'عنوان وسطر تحته. اختار القراية الصح من جدول Read between the lines. ٨ جولات.',
    mount(el, api, ctx) {
      const rounds = shuffleIn(RBL).map(r => {
        const wrong = sample(RBL.filter(x => x !== r), 3);
        const opts = shuffleIn([r, ...wrong]);
        return { art: rblCard(r.h, r.s, 'typ-rblc--game'), prompt: 'التركيبة دي بتقول إيه؟', sub: `${RBLS[r.h].ar} فوق، و${RBLS[r.s].ar} تحت`, layout: 'list', choices: opts.map(o => ({ html: `<span dir="ltr">${o.read}</span>`, ok: o === r, label: o.read })), explain: `${r.ar}` };
      });
      return quickfire(el, api, ctx, { id: 'type-rbl', time: 14, rounds, intro: { title: 'ما بين السطور', text: 'التمانية تركيبات اللي في السلايد ٢٥. كل كارت عنوان كبير وسطر صغير. اقراه صح.', rules: ['اختار بالأرقام ١–٤ أو بالضغط.', 'ركّز في التركيبات المقلوبة: Bold فوق Thin غير Thin فوق Bold.'] } });
    }
  }
];
