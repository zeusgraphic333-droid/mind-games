// Font Mall — Lecture 02 · The psychology of typeface (slides 22–27). English edition of type.js.
import { TYPES, RBL } from '../../data/psych.js';

const FG = '#EDEBE6', DIM = '#7E7C8B', SUN = '#FFC21A', LINE = 'rgba(237,235,230,.3)';
export const FAM = { serif: 'var(--f-serif)', sans: 'var(--f-sans)', script: 'var(--f-script)', display: 'var(--f-poster)', mono: 'var(--f-mono)' };
/* same keys as the Arabic file: `ar` = the style's name on the page (here in English) */
export const RBLS = {
  plain: { css: 'font-family:var(--f-sans);font-weight:400;text-transform:uppercase;letter-spacing:.02em', h: 'PLAIN', s: 'Plain Plain Plain', ar: 'Plain' },
  bold: { css: 'font-family:var(--f-display);font-weight:900;text-transform:uppercase;letter-spacing:-.01em', h: 'BOLD', s: 'Bold Bold Bold', ar: 'Bold' },
  fancy: { css: 'font-family:var(--f-script);font-weight:400', h: 'Fancy', s: 'Fancy Fancy Fancy', ar: 'Fancy' },
  thin: { css: 'font-family:var(--f-display);font-weight:200;text-transform:uppercase;letter-spacing:.05em', h: 'THIN', s: 'Thin Thin Thin', ar: 'Thin' }
};
export const rblCard = (h, s, cls = '') => `<div class="typ-rblc ${cls}" dir="ltr"><b style="${RBLS[h].css}">${RBLS[h].h}</b><span style="${RBLS[s].css}">${RBLS[s].s}</span></div>`;
const T = Object.fromEntries(TYPES.map(t => [t.k, t]));

/* the five families as specimen tiles */
const familyTiles = () => `<div class="typ-fams" dir="ltr">${TYPES.map(t => `<div class="typ-fam"><span class="typ-fam__aa" style="font-family:${FAM[t.k]}">${t.k === 'display' ? 'AA' : 'Aa'}</span><b>${t.name}</b><small>${t.ex}</small></div>`).join('')}</div>`;
/* masculine / feminine / kids / grown-ups */
const whoTiles = () => `<div class="typ-who">
  <div class="typ-who__t"><span style="font-family:var(--f-poster);font-size:40px;letter-spacing:.02em">STRONG</span><b>Masculine</b><small>There are masculine fonts.</small></div>
  <div class="typ-who__t"><span style="font-family:var(--f-script);font-size:36px">grace</span><b>Feminine</b><small>And there are feminine fonts too.</small></div>
  <div class="typ-who__t"><span class="typ-kids">${[...'play!'].map((c, i) => `<i style="--r:${[-10, 8, -6, 12, -4][i]}deg;--y:${[0, -6, 3, -4, 2][i]}px;color:${['#FF3E8A', '#FFC21A', '#46E3A0', '#7FE7FF', '#FF4A2E'][i]}">${c}</i>`).join('')}</span><b>For kids</b><small>There are fonts for kids.</small></div>
  <div class="typ-who__t"><span style="font-family:var(--f-serif);font-size:36px;font-weight:600">Report</span><b>For grown-ups</b><small>And fonts for grown ups.</small></div>
</div>`;
/* serif anatomy: where the serifs are */
const serifArt = `<svg viewBox="0 0 560 230" direction="ltr" role="img" aria-label="The same letters in a serif and a sans-serif face; small circles mark the serifs (the little feet)">
  <text x="140" y="168" text-anchor="middle" style="font-family:var(--f-serif);font-weight:500" font-size="168" fill="${FG}">Ah</text>
  <text x="420" y="168" text-anchor="middle" style="font-family:var(--f-sans);font-weight:500" font-size="156" fill="${FG}">Ah</text>
  <g fill="none" stroke="${SUN}" stroke-width="1.6"><circle cx="66" cy="164" r="13"/><circle cx="112" cy="164" r="13"/><circle cx="162" cy="164" r="13"/><circle cx="221" cy="164" r="13"/><circle cx="168" cy="54" r="13"/></g>
  <g font-family="IBM Plex Sans Arabic" font-size="15" fill="${DIM}" text-anchor="middle"><text x="140" y="214">Serif — the little feet</text><text x="420" y="214">Sans-serif — sans = without</text></g>
</svg>`;
/* print vs web */
const printArt = `<svg viewBox="0 0 240 150" direction="ltr" aria-hidden="true"><rect x="40" y="14" width="160" height="122" rx="3" fill="none" stroke="${LINE}"/><text x="56" y="52" style="font-family:var(--f-serif);font-weight:700" font-size="26" fill="${FG}">The Daily</text>${[66, 80, 94, 108, 122].map((y, i) => `<rect x="56" y="${y}" width="${[128, 110, 128, 96, 120][i]}" height="5" rx="2" fill="${DIM}"/>`).join('')}</svg>`;
const webArt = `<svg viewBox="0 0 240 150" direction="ltr" aria-hidden="true"><rect x="78" y="8" width="84" height="134" rx="14" fill="none" stroke="${LINE}"/><rect x="104" y="16" width="32" height="5" rx="2.5" fill="${DIM}"/><text x="90" y="54" style="font-family:var(--f-sans);font-weight:600" font-size="17" fill="${FG}">Settings</text>${[66, 82, 98, 114].map(y => `<rect x="90" y="${y}" width="60" height="9" rx="4.5" fill="none" stroke="${DIM}"/>`).join('')}</svg>`;
/* Bauhaus-style geometric "a" — a circle and a line */
const bauhausArt = `<svg viewBox="0 0 560 190" direction="ltr" role="img" aria-label="A geometric letter a built from a circle and a straight stroke, next to the note that geometric sans-serifs evoke Bauhaus modernism">
  <circle cx="110" cy="105" r="58" fill="none" stroke="${FG}" stroke-width="16"/><path d="M176 45v118" stroke="${FG}" stroke-width="16" stroke-linecap="butt"/>
  <g stroke="${SUN}" stroke-width="1.2" stroke-dasharray="3 5" fill="none"><circle cx="110" cy="105" r="58"/><path d="M40 105h156M110 35v140"/></g>
  <text x="250" y="88" style="font-family:var(--f-sans);font-weight:600" font-size="24" fill="${FG}">Geometric sans-serif</text>
  <text x="250" y="122" font-family="IBM Plex Sans Arabic" font-size="17" fill="${DIM}">circle + line = Bauhaus modernism</text>
</svg>`;

export default {
  zone: 'type',
  hero: { say: 'The same sentence in two different fonts = two different messages. A font isn’t just letters. A font is a voice. Here you’ll learn what that voice is saying.' },
  chapters: [
    /* ------------------------------------------------------------ 1 */
    {
      id: 'type-voice', title: 'Type talks before the words do', en: 'The psychology of typeface', ref: 'L02 · slide 25', scene: 'voices',
      blocks: [
        { t: 'say', who: 'letter:serif:A', text: 'Write “URGENT” in a cheerful party font, and you’ll laugh. Write it in a heavy, squeezed font, and you’ll worry. Same word. What changed is the font.' },
        { t: 'p', text: 'The psychology of typeface explores how fonts influence our **emotions**, **perceptions** and **behavior**. And the most important part of the sentence: this often happens **before we even read the words**.' },
        { t: 'quote', text: 'The psychology of typeface in graphic design explores how fonts influence our emotions, perceptions, and behavior often before we even read the words.', ref: 'L02 · S25' },
        { t: 'p', text: 'The slide calls typefaces **visual voices**. That voice decides two things: how the message makes you feel, and **how seriously** you take it.' },
        { t: 'quote', text: 'Typefaces are more than just letters; they’re visual voices that shape how a message feels and how seriously it’s taken.', ref: 'L02 · S25', ar: 'In short: a typeface is a visual voice. It decides how the message feels, and how seriously people take it.' },
        { t: 'quote', text: 'Designers choose fonts not just for readability, but for personality.', ref: 'L02 · S25', ar: 'In short: a designer picks a font so it can be read, and also for its personality.' },
        { t: 'demo', id: 'typ-voices', title: 'One sentence, five voices', caption: 'The words didn’t change. The voice did. Try all five families.', mount(el, api) {
          const fams = ['serif', 'sans', 'script', 'display', 'mono']; const seen = new Set();
          el.innerHTML = `<div class="typ-demo typ-voices"><div class="typ-voices__btns" role="group" aria-label="Font family">${fams.map(k => `<button type="button" class="btn btn--sm" data-k="${k}" aria-pressed="false">${T[k].name}</button>`).join('')}</div><p class="typ-voices__line" dir="ltr">We need to talk.</p><p class="typ-voices__psy" dir="ltr"></p></div>`;
          const line = el.querySelector('.typ-voices__line'), psy = el.querySelector('.typ-voices__psy');
          const draw = k => {
            seen.add(k); line.style.fontFamily = FAM[k]; line.style.textTransform = k === 'display' ? 'uppercase' : 'none'; line.style.fontSize = k === 'display' ? '64px' : k === 'script' ? '50px' : '44px';
            psy.innerHTML = `<b>${T[k].psy}</b><br><span>${T[k].eff}</span>`;
            el.querySelectorAll('[data-k]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
            if (live) api.scene(k);
            if (seen.size === 5) api.award(5, { from: line, key: 'demo:typ-voices' });
          };
          el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { api.sfx('pop'); draw(b.dataset.k); }));
          let live = false; draw('serif'); live = true; seen.clear(); seen.add('serif');
        } },
        { t: 'example', title: 'A wedding invitation in typewriter font', text: 'A wedding invitation typed in a typewriter font? It feels like a court summons. An official letter in a curly, fancy font? Nobody will take it seriously. That’s exactly what “how seriously it’s taken” means.' },
        { t: 'why', text: 'Your eye catches the shape of the letters before your brain decodes the word: heavy or thin? Upright or slanted? That shape sets the mood first, and the meaning comes after to confirm it.' },
        { t: 'trap', text: 'The line isn’t just “for readability”. The line is: “not just for readability, but for personality”. And if the question asks when it happens, the answer is: “before we even read the words”.', wrong: 'Designers choose fonts only for readability', right: 'Designers choose fonts not just for readability, but for personality' },
        { t: 'tip', text: 'Font = voice. And the voice arrives before the words.' },
        { t: 'check', q: 'ty01' },
        { t: 'check', q: 'ty02' },
        { t: 'check', q: 'ty03' }
      ]
    },
    /* ------------------------------------------------------------ 2 */
    {
      id: 'type-who', title: 'A font for whom?', en: 'Masculine, feminine, kids, grown-ups — print or web', ref: 'L02 · slides 22–24', scene: 'type',
      blocks: [
        { t: 'say', who: 'letter:display:A', text: 'The slides get bold here: there are “masculine” fonts and “feminine” fonts. There are fonts for kids and fonts for grown-ups. And there are fonts for paper and fonts for screens.' },
        { t: 'quote', text: 'There are masculine fonts. And there are feminine fonts too. There are fonts for kids. And fonts for grown ups.', ref: 'L02 · S23' },
        { t: 'p', text: 'The point isn’t that a font has an ID card. The point is that the shape of the letters carries a feeling. Heavy, straight, sharp letters feel strong and rough. Curly, decorated ones (Fancy) feel delicate and feminine. Round, playful ones feel childlike. Calm, orderly ones feel serious.' },
        { t: 'art', html: whoTiles(), caption: 'The same idea as slide 23, in real fonts.' },
        { t: 'h', text: 'The font names on the slide', en: 'Slide 22' },
        { t: 'p', text: 'Slide 22 puts famous font names side by side: Calibri, Arial and Helvetica (simple sans-serifs), Impact (a heavy display face for headlines), Chiller and Gigi (decorative, with a loud personality), and Bradley Hand ITC (looks like handwriting). The message: every name has a personality. It’s not just “a font”.' },
        { t: 'h', text: 'Paper or screen?', en: 'Serifs are for print · Sans serif are for web' },
        { t: 'compare', left: { title: 'Serif for print', en: 'Serifs are for print', text: 'Newspapers, books and anything printed.', art: printArt }, right: { title: 'Sans for web', en: 'Sans serif are for web', text: 'Websites, apps and screens.', art: webArt }, note: 'That’s slide 24 word for word, and it comes up in the exam exactly like that.' },
        { t: 'quote', text: 'Serifs are for print. Sans serif are for web.', ref: 'L02 · S24' },
        { t: 'example', title: 'Open your bag', text: 'Your university textbook or a paper newspaper: most likely serif. Your banking app and your phone’s settings: most likely sans. Check for yourself.' },
        { t: 'why', text: 'One of the best-known explanations: the serif’s little “feet” walk your eye along the line on printed paper. On screens, especially small ones, clean letters with no extra strokes look clearer.' },
        { t: 'trap', text: 'The exam may flip the sentence. Stay focused: serif for print, sans for web.', wrong: 'Serifs are for web. Sans serif are for print.', right: 'Serifs are for print. Sans serif are for web.' },
        { t: 'tip', text: 'Serif has little “feet” to stand on paper. Sans has no feet, so it floats on the screen.' },
        { t: 'check', q: 'ty29' },
        { t: 'check', q: 'ty23' }
      ]
    },
    /* ------------------------------------------------------------ 3 */
    {
      id: 'type-serif-sans', title: 'Serif and sans-serif', en: 'How typefaces speak to us — Serif & Sans-serif', ref: 'L02 · slide 26', scene: 'serif',
      blocks: [
        { t: 'say', who: 'letter:serif:A', text: 'This is the table most typeface questions come from. 5 families, and each family has 3 things: psychology, use and effect. We’ll start with the two best-known.' },
        { t: 'art', html: familyTiles(), caption: 'The five families, each in a real font from that family.' },
        { t: 'table', dir: 'ltr', head: ['Family', 'Psychology', 'Use', 'Effect'], rows: TYPES.map(t => [`${t.name}<br><small>${t.ex}</small>`, t.psy, t.use, t.eff]) },
        { t: 'art', html: serifArt, caption: 'Serifs = the small extra strokes at the ends of the letters. “Sans” is French for “without”.' },
        { t: 'h', text: 'Serif: the suit', en: 'Serif — Times New Roman, Garamond' },
        { t: 'p', text: 'Its psychology: **tradition, authority, reliability**. Its use: **newspapers, law firms, academic institutions**. Its effect: it feels **formal, trustworthy and classic**.' },
        { t: 'h', text: 'Sans-serif: the clean T-shirt', en: 'Sans-serif — Helvetica, Arial' },
        { t: 'p', text: 'Its psychology: **modernity, clarity, neutrality**. Its use: **tech companies, minimalist brands, UI design**. Its effect: it feels **clean, straightforward and contemporary**.' },
        { t: 'example', title: 'Certificate or app?', text: 'A graduation certificate or a professional union card: serif, so it feels official and full of history. A food-delivery app: sans, so it looks fast, clean and modern.' },
        { t: 'why', text: 'Serif has old roots, from letters carved in stone and the first printed books. So your brain links it to history and authority. Sans spread with modern design and screens, so it feels new and neutral.' },
        { t: 'trap', text: '**Coding environments** is not a serif use. It belongs to monospaced. Serif has just three uses: newspapers, law firms, academic institutions.', wrong: 'Serif use: coding environments', right: 'Serif use: newspapers, law firms, academic institutions' },
        { t: 'tip', text: 'Serif = a lawyer in a suit. Sans = an app on your phone.' },
        { t: 'check', q: 'ty04' },
        { t: 'check', q: 'ty05' },
        { t: 'check', q: 'ty06' },
        { t: 'check', q: 'ty07' },
        { t: 'check', q: 'ty15' },
        { t: 'check', q: 'ty31' },
        { t: 'check', q: 'ty32' }
      ]
    },
    /* ------------------------------------------------------------ 4 */
    {
      id: 'type-loud', title: 'Big personalities', en: 'Script · Display · Monospaced', ref: 'L02 · slide 26', scene: 'script',
      blocks: [
        { t: 'say', who: 'letter:script:A', text: 'These three have the big personalities: one is romantic, one shouts, and one works like a machine.' },
        { t: 'art', html: `<div class="typ-trio" dir="ltr"><span style="font-family:var(--f-script);font-size:54px">Celebrate</span><span style="font-family:var(--f-poster);font-size:70px;letter-spacing:.02em">BIG SALE</span><span style="font-family:var(--f-mono);font-size:40px">iiiWWW</span></div>`, caption: 'Script · Display · Monospaced' },
        { t: 'h', text: 'Script: a romantic whisper', en: 'Script — Brush Script, Lobster' },
        { t: 'p', text: 'Its psychology: **elegance, creativity, intimacy**. Its use: **wedding invitations, boutique branding**. Its effect: it feels **personal, romantic, or artistic**.' },
        { t: 'h', text: 'Display: a loud voice', en: 'Display — Impact, Bebas Neue' },
        { t: 'p', text: 'Its psychology: **boldness, uniqueness, attention-grabbing**. Its use: **posters, headlines, advertising**. Its effect: it feels **dramatic, expressive and memorable**.' },
        { t: 'h', text: 'Monospaced: the machine', en: 'Monospaced — Courier, Consolas' },
        { t: 'p', text: 'Its psychology: **precision, tech-savvy, utilitarian**. Its use: **coding environments, retro designs**. Its effect: it feels **mechanical, structured, or nostalgic**. The easiest way to spot it: **every letter takes exactly the same width**, even the i and the W.' },
        { t: 'demo', id: 'typ-mono', title: 'The width test', caption: 'In monospaced type, every letter gets a slot of the same size. That’s what gives it the feel of a precise machine.', mount(el, api) {
          const word = 'iiiWWW';
          el.innerHTML = `<div class="typ-demo typ-mono"><div class="typ-mono__row"><span class="typ-mono__lab">Monospaced</span><span class="typ-mono__w" style="font-family:var(--f-mono)" dir="ltr">${[...word].map(c => `<i>${c}</i>`).join('')}</span></div><div class="typ-mono__row"><span class="typ-mono__lab">Serif</span><span class="typ-mono__w" style="font-family:var(--f-serif)" dir="ltr">${[...word].map(c => `<i>${c}</i>`).join('')}</span></div><button type="button" class="btn btn--sm" aria-pressed="false">Show the slots</button></div>`;
          const b = el.querySelector('button');
          b.addEventListener('click', () => { const on = el.querySelector('.typ-mono').classList.toggle('is-boxes'); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Hide the slots' : 'Show the slots'; api.sfx('pop'); api.scene('mono'); if (on) api.award(5, { from: b, key: 'demo:typ-mono' }); });
        } },
        { t: 'example', title: 'Through your day', text: 'Your sister’s wedding card: script. An action-movie poster outside the cinema: display. The editor where you write code: mono. A “retro” design that looks like a typewriter: mono again.' },
        { t: 'why', text: 'Script looks like handwriting, so it feels close and intimate. Display is made to be seen from far away, so it shouts. And in mono every letter sits in its own slot, so it feels like a precise machine.' },
        { t: 'trap', text: 'Script and display both “stand out”, but they’re not the same. **Display** = boldness and grabbing attention (posters, headlines). **Script** = elegance and intimacy (wedding invitations, boutiques).', wrong: 'Wedding invitations → Display · Posters → Script', right: 'Wedding invitations → Script · Posters → Display' },
        { t: 'tip', text: 'Script = wedding. Display = poster. Mono = code.' },
        { t: 'check', q: 'ty08' },
        { t: 'check', q: 'ty10' },
        { t: 'check', q: 'ty12' },
        { t: 'check', q: 'ty16' },
        { t: 'check', q: 'ty17' },
        { t: 'check', q: 'ty18' }
      ]
    },
    /* ------------------------------------------------------------ 5 */
    {
      id: 'type-rbl', title: 'Read between the lines', en: 'Mixing the moods right', ref: 'L02 · slide 25', scene: 'display',
      blocks: [
        { t: 'say', who: 'letter:display:A', text: 'A headline and the line under it. Change the weight of one, and the whole message flips. The slide has a table of 8 combinations. Learn them.' },
        { t: 'quote', text: 'READ BETWEEN THE LINES — Mixing the moods right.', ref: 'L02 · S25' },
        { t: 'p', text: 'The idea: each card has a **big headline** in one style and a **small line under it** in another. There are 4 styles: **PLAIN**, **BOLD**, **Fancy** and **THIN**. And each combination says something about whoever uses it.' },
        { t: 'art', html: `<div class="typ-rblg">${RBL.map(r => `<figure>${rblCard(r.h, r.s)}<figcaption dir="ltr">${r.read}</figcaption><p>${r.en}</p></figure>`).join('')}</div>`, caption: 'All eight, exactly as in the table: the headline on top, the line underneath.' },
        { t: 'table', dir: 'ltr', head: ['Headline', 'Subtext', 'Reads as'], rows: RBL.map(r => [RBLS[r.h].h, RBLS[r.s].h, r.read]) },
        { t: 'demo', id: 'typ-rbl', title: 'Mix it yourself', caption: 'Pick a headline style and a style for the line under it. If the combo is one of the eight, its reading shows up.', mount(el, api) {
          const ks = ['plain', 'bold', 'fancy', 'thin']; let h = 'plain', s = 'fancy'; const found = new Set();
          el.innerHTML = `<div class="typ-demo typ-mix"><div class="typ-mix__ctl"><div><span class="label">Headline</span><div class="typ-mix__g" data-g="h">${ks.map(k => `<button type="button" class="btn btn--sm" data-k="${k}">${RBLS[k].ar}</button>`).join('')}</div></div><div><span class="label">The line under it</span><div class="typ-mix__g" data-g="s">${ks.map(k => `<button type="button" class="btn btn--sm" data-k="${k}">${RBLS[k].ar}</button>`).join('')}</div></div></div><div class="typ-mix__out"><div class="typ-mix__card"></div><p class="typ-mix__read" aria-live="polite"></p><p class="typ-mix__found"></p></div></div>`;
          const draw = () => {
            el.querySelector('.typ-mix__card').innerHTML = rblCard(h, s);
            const r = RBL.find(x => x.h === h && x.s === s);
            el.querySelector('.typ-mix__read').innerHTML = r ? `<b dir="ltr">${r.read}</b><br>${r.en}` : `<span class="typ-mix__no">This combo isn’t in the table. Only the eight on the slide come up in questions.</span>`;
            if (r) found.add(h + s);
            el.querySelector('.typ-mix__found').innerHTML = `Found <span class="hud-num">${found.size}</span> of <span class="hud-num">8</span>`;
            el.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-k]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === (g.dataset.g === 'h' ? h : s)))));
            if (found.size >= 4) api.award(5, { from: el.querySelector('.typ-mix__card'), key: 'demo:typ-rbl' });
          };
          el.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { if (g.dataset.g === 'h') h = b.dataset.k; else s = b.dataset.k; api.sfx('pop'); draw(); })));
          draw();
        } },
        { t: 'why', text: 'Weight and decoration give a “tone of voice”. Bold over bold = shouting. Thin over thin = a neat, quiet whisper. Fancy over fancy = more delicate than it needs to be.' },
        { t: 'trap', text: 'The flipped pairs are the confusing ones. **BOLD over THIN** = “Committed to make an impression.” But **THIN over BOLD** = “Caters to the needs of disparate audience.” Same story here: **PLAIN over Fancy** = “Emphasis is on core business.”, and **Fancy over PLAIN** = “Friendly, flexible and open to new ideas.”', wrong: 'Thin headline + bold subtext = Committed to make an impression', right: 'Bold headline + thin subtext = Committed to make an impression' },
        { t: 'tip', text: 'Same style twice = a pure message: BOLD+BOLD aggressive, PLAIN+PLAIN clear, THIN+THIN minimal, Fancy+Fancy too feminine.' },
        { t: 'check', q: 'ty24' },
        { t: 'check', q: 'ty25' },
        { t: 'check', q: 'ty26' },
        { t: 'check', q: 'ty27' },
        { t: 'check', q: 'ty28' }
      ]
    },
    /* ------------------------------------------------------------ 6 */
    {
      id: 'type-principles', title: 'The rules of the game', en: 'Psychological principles at play', ref: 'L02 · slide 27', scene: 'sans',
      blocks: [
        { t: 'say', who: 'letter:sans:A', text: 'Three principles tell you why picking a font isn’t just personal taste. All three come up in the exam as definitions.' },
        { t: 'h', text: 'Readable… and felt', en: 'Legibility vs. Emotion' },
        { t: 'quote', text: 'Legibility vs. Emotion: A font must be readable, but it also sets the emotional tone. A playful font on a legal document would feel jarring, while a rigid font on a children’s book would feel cold.', ref: 'L02 · S27' },
        { t: 'compare', left: { title: 'A playful font on a legal document', en: 'jarring', text: 'Off-key. Something out of place.' }, right: { title: 'A rigid font on a children’s book', en: 'cold', text: 'Cold. The child won’t feel it was made for them.' }, note: 'A font has to be readable, and at the same time set the right mood.' },
        { t: 'h', text: 'Repeat it… and get recognized', en: 'Consistency and Trust' },
        { t: 'quote', text: 'Consistency and Trust: Repeated use of a typeface builds brand recognition and emotional familiarity.', ref: 'L02 · S27' },
        { t: 'example', title: 'The same font everywhere', text: 'A brand uses the same font on its logo, its shop sign, its app and its posts. After a while, you know it from the font alone, and it feels familiar.' },
        { t: 'h', text: 'A font has a homeland and a history', en: 'Cultural Influence' },
        { t: 'quote', text: 'Cultural Influence: Some fonts evoke specific eras or regions—like Gothic typefaces suggesting medieval Europe, or geometric sans-serifs evoking Bauhaus modernism.', ref: 'L02 · S27' },
        { t: 'art', html: bauhausArt, caption: 'A geometric sans is built from simple shapes like the circle and the line. That’s the spirit of the Bauhaus school.' },
        { t: 'example', title: 'Same idea, closer to home', text: 'Arabic Kufic script feels like heritage and history. Ruq’ah script reminds you of notebook handwriting and old shop signs. A typeface carries its time and place with it.' },
        { t: 'quote', text: 'Typography is silent, but it speaks volumes. It’s the difference between shouting, whispering, or singing your message.', ref: 'L02 · S27', ar: 'In short: type makes no sound, but it says a lot. It decides whether you shout your message, whisper it, or sing it.' },
        { t: 'demo', id: 'typ-tone', title: 'Shout, whisper or sing', caption: 'Same line, three tones. That’s what “shouting, whispering, or singing” means.', mount(el, api) {
          const modes = { shout: 'Shout', whisper: 'Whisper', sing: 'Sing' }; const seen = new Set();
          el.innerHTML = `<div class="typ-demo typ-tone"><div class="typ-tone__btns" role="group" aria-label="Tone">${Object.keys(modes).map(k => `<button type="button" class="btn btn--sm" data-k="${k}" aria-pressed="false">${modes[k]}</button>`).join('')}</div><p class="typ-tone__line" dir="ltr"></p></div>`;
          const line = el.querySelector('.typ-tone__line');
          const draw = k => {
            seen.add(k); line.className = 'typ-tone__line is-' + k;
            line.innerHTML = k === 'sing' ? [...'exam tomorrow'].map((c, i) => `<i style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</i>`).join('') : 'exam tomorrow';
            el.querySelectorAll('[data-k]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
            if (live) api.scene(k === 'shout' ? 'display' : k === 'sing' ? 'script' : 'sans');
            if (seen.size === 3) api.award(5, { from: line, key: 'demo:typ-tone' });
          };
          el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { api.sfx('pop'); draw(b.dataset.k); }));
          let live = false; draw('shout'); live = true; seen.clear(); seen.add('shout');
        } },
        { t: 'why', text: 'The brain links a font to the situations where it saw it before. That’s why the right font in the right place builds trust, and the wrong font feels “jarring” even when the words are right.' },
        { t: 'trap', text: '**Gothic → medieval Europe** is an example of **Cultural Influence**, not Consistency. And **Bauhaus** goes with **geometric sans-serifs**, not with serif.', wrong: 'Gothic typefaces suggesting medieval Europe = Consistency and Trust', right: 'Gothic typefaces suggesting medieval Europe = Cultural Influence' },
        { t: 'tip', text: 'Legibility vs. Emotion = readable + felt. Consistency = repeat it to be recognized. Cultural = a font has a history and a homeland.' },
        { t: 'check', q: 'ty19' },
        { t: 'check', q: 'ty20' },
        { t: 'check', q: 'ty21' },
        { t: 'check', q: 'ty22' },
        { t: 'check', q: 'ty30' }
      ]
    }
  ]
};
