// Font Mall trials: Font Swipe (brief + specimen → fits or not) and Between the Lines (combo → meaning). English edition of type.js.
import { TYPES, RBL } from '../data/psych.js';
import { FAM, RBLS, rblCard } from '../content/lessons/type.en.js';
import { quickfire, sample, shuffleIn } from './_cte-kit.js';

const T = Object.fromEntries(TYPES.map(t => [t.k, t]));
/* same name as the Arabic file: each family's name on the page */
const AR = { serif: 'serif', sans: 'sans-serif', script: 'script', display: 'display', mono: 'monospaced' };
const BRIEFS = [
  { b: 'A daily newspaper', fam: 'serif', txt: 'The Daily Gazette', use: 'Newspapers' },
  { b: 'A law firm', fam: 'serif', txt: 'Justice & Partners', use: 'Law firms' },
  { b: 'An old, respected university', fam: 'serif', txt: 'Faculty of Arts', use: 'Academic institutions' },
  { b: 'A tech company', fam: 'sans', txt: 'Nexa Cloud', use: 'Tech companies', no: ['mono'] },
  { b: 'A minimalist brand', fam: 'sans', txt: 'plain studio', use: 'Minimalist brands' },
  { b: 'A settings screen in an app', fam: 'sans', txt: 'Settings', use: 'UI design', no: ['mono'] },
  { b: 'A wedding invitation', fam: 'script', txt: 'Mariam & Omar', use: 'Wedding invitations' },
  { b: 'A flower boutique', fam: 'script', txt: 'Rosa Boutique', use: 'Boutique branding' },
  { b: 'A concert poster', fam: 'display', txt: 'LIVE TONIGHT', use: 'Posters' },
  { b: 'The headline of an ad poster', fam: 'display', txt: 'GRAND OPENING', use: 'Headlines', no: ['serif'] },
  { b: 'A billboard by the road', fam: 'display', txt: 'MEGA SALE', use: 'Advertising' },
  { b: 'A code editor', fam: 'mono', txt: 'const x = 42;', use: 'Coding environments' },
  { b: 'A retro design that looks typewritten', fam: 'mono', txt: 'Dear Sir,', use: 'Retro designs' }
];
const specimen = (fam, txt) => `<div class="typ-swipe__card" dir="ltr"><span style="font-family:${FAM[fam]};${fam === 'display' ? 'text-transform:uppercase;letter-spacing:.02em;font-size:58px' : fam === 'script' ? 'font-size:46px' : 'font-size:38px'}">${txt}</span><small>${T[fam].name}</small></div>`;

export default [
  {
    id: 'type-swipe', title: 'Font Swipe', en: 'brief + font → fits or not',
    how: 'A brief + a font. Does it fit or not? 10 rounds, 6 seconds each. Every brief comes from the Use column on the slide.',
    mount(el, api, ctx) {
      const rounds = sample(BRIEFS, 10).map((r, k) => {
        const match = k % 2 === 0 ? true : Math.random() < .35;
        const others = Object.keys(AR).filter(f => f !== r.fam && !(r.no || []).includes(f)); // r.no: families the slides would also allow
        const fam = match ? r.fam : others[Math.floor(Math.random() * others.length)];
        const ok = fam === r.fam;
        return {
          art: specimen(fam, r.txt), prompt: r.b, sub: `Does this ${AR[fam]} font fit the brief?`, layout: 'yn',
          choices: [{ html: '<span>✓ Fits</span>', ok, label: 'Fits' }, { html: '<span>✕ Doesn’t fit</span>', ok: !ok, label: 'Doesn’t fit' }],
          explain: `<span dir="ltr">${r.use} → ${T[r.fam].name}</span>`
        };
      });
      return quickfire(el, api, ctx, { id: 'type-swipe', time: 6, rounds: shuffleIn(rounds), intro: { title: 'Font Swipe', text: 'You’re the art director, and you’re short on time. Each card has a brief and a suggested font. Decide fast: does it fit or not?', rules: ['1 = Fits · 2 = Doesn’t fit.', 'The judge is the How Typefaces Speak to Us table (the Use column).', 'If time runs out, the round counts as wrong.'] } });
    }
  },
  {
    id: 'type-rbl', title: 'Between the Lines', en: 'combo → meaning',
    how: 'A headline and a line under it. Pick the right reading from the Read between the lines table. 8 rounds.',
    mount(el, api, ctx) {
      const rounds = shuffleIn(RBL).map(r => {
        const wrong = sample(RBL.filter(x => x !== r), 3);
        const opts = shuffleIn([r, ...wrong]);
        return { art: rblCard(r.h, r.s, 'typ-rblc--game'), prompt: 'What does this combo say?', sub: `${RBLS[r.h].ar} on top, ${RBLS[r.s].ar} underneath`, layout: 'list', choices: opts.map(o => ({ html: `<span dir="ltr">${o.read}</span>`, ok: o === r, label: o.read })), explain: `${r.en}` };
      });
      return quickfire(el, api, ctx, { id: 'type-rbl', time: 14, rounds, intro: { title: 'Between the Lines', text: 'The eight combinations from slide 25. Each card is a big headline with a small line under it. Read it right.', rules: ['Pick with keys 1–4, or tap.', 'Watch the flipped pairs: Bold over Thin is not the same as Thin over Bold.'] } });
    }
  }
];
