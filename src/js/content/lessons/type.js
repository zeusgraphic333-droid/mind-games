// Font Mall — Lecture 02 · The psychology of typeface (slides 22–27).
import { TYPES, RBL } from '../../data/psych.js';

const FG = '#EDEBE6', DIM = '#7E7C8B', SUN = '#FFC21A', LINE = 'rgba(237,235,230,.3)';
export const FAM = { serif: 'var(--f-serif)', sans: 'var(--f-sans)', script: 'var(--f-script)', display: 'var(--f-poster)', mono: 'var(--f-mono)' };
export const RBLS = {
  plain: { css: 'font-family:var(--f-sans);font-weight:400;text-transform:uppercase;letter-spacing:.02em', h: 'PLAIN', s: 'Plain Plain Plain', ar: 'عادي' },
  bold: { css: 'font-family:var(--f-display);font-weight:900;text-transform:uppercase;letter-spacing:-.01em', h: 'BOLD', s: 'Bold Bold Bold', ar: 'تقيل' },
  fancy: { css: 'font-family:var(--f-script);font-weight:400', h: 'Fancy', s: 'Fancy Fancy Fancy', ar: 'مزخرف' },
  thin: { css: 'font-family:var(--f-display);font-weight:200;text-transform:uppercase;letter-spacing:.05em', h: 'THIN', s: 'Thin Thin Thin', ar: 'رفيع' }
};
export const rblCard = (h, s, cls = '') => `<div class="typ-rblc ${cls}" dir="ltr"><b style="${RBLS[h].css}">${RBLS[h].h}</b><span style="${RBLS[s].css}">${RBLS[s].s}</span></div>`;
const T = Object.fromEntries(TYPES.map(t => [t.k, t]));

/* the five families as specimen tiles */
const familyTiles = () => `<div class="typ-fams" dir="ltr">${TYPES.map(t => `<div class="typ-fam"><span class="typ-fam__aa" style="font-family:${FAM[t.k]}">${t.k === 'display' ? 'AA' : 'Aa'}</span><b>${t.name}</b><small>${t.ex}</small></div>`).join('')}</div>`;
/* masculine / feminine / kids / grown-ups */
const whoTiles = () => `<div class="typ-who">
  <div class="typ-who__t"><span style="font-family:var(--f-poster);font-size:40px;letter-spacing:.02em">STRONG</span><b>رجالي</b><small>masculine</small></div>
  <div class="typ-who__t"><span style="font-family:var(--f-script);font-size:36px">grace</span><b>حريمي</b><small>feminine</small></div>
  <div class="typ-who__t"><span class="typ-kids">${[...'play!'].map((c, i) => `<i style="--r:${[-10, 8, -6, 12, -4][i]}deg;--y:${[0, -6, 3, -4, 2][i]}px;color:${['#FF3E8A', '#FFC21A', '#46E3A0', '#7FE7FF', '#FF4A2E'][i]}">${c}</i>`).join('')}</span><b>للأطفال</b><small>fonts for kids</small></div>
  <div class="typ-who__t"><span style="font-family:var(--f-serif);font-size:36px;font-weight:600">Report</span><b>للكبار</b><small>fonts for grown-ups</small></div>
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
  hero: { say: 'نفس الجملة بخطين مختلفين = رسالتين مختلفتين. الخط مش حروف وبس. الخط صوت. وهنا هتعرف الصوت ده بيقول إيه.' },
  chapters: [
    /* ------------------------------------------------------------ 1 */
    {
      id: 'type-voice', title: 'الخط بيتكلم قبل الكلام', en: 'The psychology of typeface', ref: 'L02 · slide 25', scene: 'voices',
      blocks: [
        { t: 'say', who: 'letter:serif:A', text: 'اكتب كلمة "عاجل" بخط فرح، هتضحك. اكتبها بخط تقيل مضغوط، هتقلق. الكلمة هي هي. اللي اتغيّر هو الخط.' },
        { t: 'p', text: 'سيكولوجية الخط بتدرس إزاي الفونت بيأثر على **مشاعرنا**، و**إدراكنا**، و**تصرفاتنا**. وأهم حتة في الجملة: ده بيحصل غالبًا **قبل ما نقرا الكلام أصلًا**.' },
        { t: 'quote', text: 'The psychology of typeface in graphic design explores how fonts influence our emotions, perceptions, and behavior often before we even read the words.', ref: 'L02 · S25' },
        { t: 'p', text: 'السلايد بتسمّي الخطوط **أصوات بصرية** <en>visual voices</en>. والصوت ده بيحدد حاجتين: الرسالة بتحسسك بإيه، وإنت هتاخدها **بجد قد إيه**.' },
        { t: 'quote', text: 'Typefaces are more than just letters; they’re visual voices that shape how a message feels and how seriously it’s taken.', ref: 'L02 · S25', ar: 'الخطوط أكتر من مجرد حروف. دي أصوات بصرية بتحدد الرسالة بتحسسك بإيه، وبتتاخد بجد قد إيه.' },
        { t: 'quote', text: 'Designers choose fonts not just for readability, but for personality.', ref: 'L02 · S25', ar: 'المصمم بيختار الخط مش عشان يتقري وبس، لكن عشان شخصيته.' },
        { t: 'demo', id: 'typ-voices', title: 'جملة واحدة، خمس أصوات', caption: 'الكلام ما اتغيرش. الصوت هو اللي اتغيّر. جرّب العائلات الخمسة.', mount(el, api) {
          const fams = ['serif', 'sans', 'script', 'display', 'mono']; const seen = new Set();
          el.innerHTML = `<div class="typ-demo typ-voices"><div class="typ-voices__btns" role="group" aria-label="العائلة">${fams.map(k => `<button type="button" class="btn btn--sm" data-k="${k}" aria-pressed="false">${T[k].name}</button>`).join('')}</div><p class="typ-voices__line" dir="ltr">We need to talk.</p><p class="typ-voices__psy" dir="ltr"></p></div>`;
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
        { t: 'example', title: 'دعوة فرح بخط الآلة الكاتبة', text: 'دعوة فرح مكتوبة بخط آلة كاتبة؟ هتحسها إنذار من المحكمة. وورقة رسمية مكتوبة بخط مزخرف؟ محدش هياخدها بجد. ده بالظبط معنى <en>how seriously it’s taken</en>.' },
        { t: 'why', text: 'عينك بتلقط شكل الحروف قبل ما مخك يفك الكلمة: تقيلة ولا رفيعة؟ مستقيمة ولا مايلة؟ الشكل ده بيحط المود الأول، والمعنى بييجي بعده يأكّده.' },
        { t: 'trap', text: 'الجملة مش "<en>for readability</en>" وبس. الجملة: <en>not just for readability, but for personality</en>. ولو السؤال سأل "بيحصل إمتى؟" الإجابة: <en>before we even read the words</en>.', wrong: 'Designers choose fonts only for readability', right: 'Designers choose fonts not just for readability, but for personality' },
        { t: 'tip', text: 'الخط = صوت. والصوت بيوصل قبل الكلام.' },
        { t: 'check', q: 'ty01' },
        { t: 'check', q: 'ty02' },
        { t: 'check', q: 'ty03' }
      ]
    },
    /* ------------------------------------------------------------ 2 */
    {
      id: 'type-who', title: 'خط لمين؟', en: 'Masculine, feminine, kids, grown-ups — print or web', ref: 'L02 · slides 22–24', scene: 'type',
      blocks: [
        { t: 'say', who: 'letter:display:A', text: 'السلايدات هنا جريئة: فيه خطوط "رجالي" وخطوط "حريمي". وفيه خطوط للأطفال وخطوط للكبار. وفيه خطوط للورق وخطوط للشاشة.' },
        { t: 'quote', text: 'There are masculine fonts. And there are feminine fonts too. There are fonts for kids. And fonts for grown ups.', ref: 'L02 · S23' },
        { t: 'p', text: 'المقصود مش إن الخط ليه بطاقة شخصية. المقصود إن شكل الحروف شايل إحساس. الحروف التقيلة المستقيمة الحادة بتحسسك بقوة وخشونة. والمزخرفة المنحنية (<en>Fancy</en>) بتحسسك برقة وأنوثة. والمدورة اللعوبة بتحسسك بطفولة. والهادية المنظمة بتحسسك بجدية.' },
        { t: 'art', html: whoTiles(), caption: 'نفس فكرة السلايد ٢٣، بخطوط حقيقية.' },
        { t: 'h', text: 'أسامي الخطوط اللي في السلايد', en: 'Slide 22' },
        { t: 'p', text: 'السلايد ٢٢ حاطة أسامي خطوط مشهورة جنب بعض: <en>Calibri</en> و<en>Arial</en> و<en>Helvetica</en> (سانس بسيطة)، و<en>Impact</en> (ديسبلاي تقيل للعناوين)، و<en>Chiller</en> و<en>Gigi</en> (زخرفية بشخصية عالية)، و<en>Bradley Hand ITC</en> (شبه خط الإيد). الرسالة: كل اسم ليه شخصية، مش مجرد "فونت".' },
        { t: 'h', text: 'ورق ولا شاشة؟', en: 'Serifs are for print · Sans serif are for web' },
        { t: 'compare', left: { title: 'السيريف للمطبوع', en: 'Serifs are for print', text: 'الجرايد والكتب والمطبوعات.', art: printArt }, right: { title: 'السانس للويب', en: 'Sans serif are for web', text: 'المواقع والأبلكيشنات والشاشات.', art: webArt }, note: 'دي جملة السلايد ٢٤ بالحرف، وبتيجي في الامتحان كده.' },
        { t: 'quote', text: 'Serifs are for print. Sans serif are for web.', ref: 'L02 · S24' },
        { t: 'example', title: 'افتح شنطتك', text: 'كتاب الجامعة أو جرنال ورق: غالبًا سيريف. أبلكيشن البنك وإعدادات موبايلك: غالبًا سانس. بص بنفسك.' },
        { t: 'why', text: 'من أشهر التفسيرات: "رجلين" السيريف الصغيرين بيمشّوا عينك على السطر في الورق المطبوع. وعلى الشاشات، خصوصًا الصغيرة، الحروف النضيفة من غير زوايد بتبان أوضح.' },
        { t: 'trap', text: 'الامتحان ممكن يقلب الجملة. ركّز: السيريف للطباعة، والسانس للويب.', wrong: 'Serifs are for web. Sans serif are for print.', right: 'Serifs are for print. Sans serif are for web.' },
        { t: 'tip', text: 'السيريف ليه "رجلين" واقف بيهم على الورق. والسانس من غير رجلين، طاير على الشاشة.' },
        { t: 'check', q: 'ty29' },
        { t: 'check', q: 'ty23' }
      ]
    },
    /* ------------------------------------------------------------ 3 */
    {
      id: 'type-serif-sans', title: 'سيريف وسانس', en: 'How typefaces speak to us — Serif & Sans-serif', ref: 'L02 · slide 26', scene: 'serif',
      blocks: [
        { t: 'say', who: 'letter:serif:A', text: 'ده الجدول اللي هيجي منه أغلب أسئلة الخطوط. ٥ عائلات، ولكل عيلة ٣ حاجات: سيكولوجية، واستخدام، وتأثير. هنبدأ بأشهر اتنين.' },
        { t: 'art', html: familyTiles(), caption: 'الخمس عائلات بخطوط حقيقية من نفس العيلة.' },
        { t: 'table', dir: 'ltr', head: ['Family', 'Psychology', 'Use', 'Effect'], rows: TYPES.map(t => [`${t.name}<br><small>${t.ex}</small>`, t.psy, t.use, t.eff]) },
        { t: 'art', html: serifArt, caption: 'السيريف = الزوايد الصغيرة في أطراف الحروف. Sans بالفرنساوي يعني "من غير".' },
        { t: 'h', text: 'السيريف: البدلة', en: 'Serif — Times New Roman, Garamond' },
        { t: 'p', text: 'سيكولوجيته: **تقاليد، وسلطة، واعتمادية** <en>Tradition, authority, reliability</en>. استخدامه: **الجرايد، ومكاتب المحاماة، والجامعات**. وتأثيره: رسمي، وموثوق، وكلاسيكي <en>formal, trustworthy, and classic</en>.' },
        { t: 'h', text: 'السانس: التيشيرت النضيف', en: 'Sans-serif — Helvetica, Arial' },
        { t: 'p', text: 'سيكولوجيته: **حداثة، ووضوح، وحياد** <en>Modernity, clarity, neutrality</en>. استخدامه: **شركات التكنولوجيا، والبراندات المينيمال، وتصميم الـ <en>UI</en>**. وتأثيره: نضيف، ومباشر، ومعاصر <en>clean, straightforward, and contemporary</en>.' },
        { t: 'example', title: 'شهادة ولا أبلكيشن؟', text: 'شهادة تخرج أو كارنيه نقابة: سيريف، عشان تحس بالرسمية والتاريخ. أبلكيشن توصيل أكل: سانس، عشان يبان سريع ونضيف وحديث.' },
        { t: 'why', text: 'السيريف جذوره قديمة، من الحفر على الحجر والطباعة الأولى. فمخك يربطه بالتاريخ والسلطة. والسانس انتشر مع الحداثة والشاشات، فيحسسك إنه جديد ومحايد.' },
        { t: 'trap', text: '<en>Coding environments</en> مش من استخدامات السيريف، دي بتاعة المونو. واستخدامات السيريف تلاتة بس: <en>newspapers, law firms, academic institutions</en>.', wrong: 'Serif use: coding environments', right: 'Serif use: newspapers, law firms, academic institutions' },
        { t: 'tip', text: 'سيريف = محامي ببدلة. سانس = أبلكيشن على موبايلك.' },
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
      id: 'type-loud', title: 'سكريبت، ديسبلاي، ومونو', en: 'Script · Display · Monospaced', ref: 'L02 · slide 26', scene: 'script',
      blocks: [
        { t: 'say', who: 'letter:script:A', text: 'التلاتة دول أصحاب الشخصيات العالية: واحد رومانسي، وواحد بيزعق، وواحد شغال زي الآلة.' },
        { t: 'art', html: `<div class="typ-trio" dir="ltr"><span style="font-family:var(--f-script);font-size:54px">Celebrate</span><span style="font-family:var(--f-poster);font-size:70px;letter-spacing:.02em">BIG SALE</span><span style="font-family:var(--f-mono);font-size:40px">iiiWWW</span></div>`, caption: 'Script · Display · Monospaced' },
        { t: 'h', text: 'السكريبت: همس رومانسي', en: 'Script — Brush Script, Lobster' },
        { t: 'p', text: 'سيكولوجيته: **أناقة، وإبداع، وقُرب** <en>Elegance, creativity, intimacy</en>. استخدامه: **دعوات الفرح والبوتيكات**. وتأثيره: شخصي، ورومانسي، أو فني <en>personal, romantic, or artistic</en>.' },
        { t: 'h', text: 'الديسبلاي: صوت عالي', en: 'Display — Impact, Bebas Neue' },
        { t: 'p', text: 'سيكولوجيته: **جرأة، وتميّز، وشد انتباه** <en>Boldness, uniqueness, attention-grabbing</en>. استخدامه: **البوسترات، والعناوين، والإعلانات**. وتأثيره: درامي، ومعبّر، ومحفور في الذاكرة <en>dramatic, expressive, and memorable</en>.' },
        { t: 'h', text: 'المونو: الآلة', en: 'Monospaced — Courier, Consolas' },
        { t: 'p', text: 'سيكولوجيته: **دقة، وتكنولوجيا، وعملية** <en>Precision, tech-savvy, utilitarian</en>. استخدامه: **بيئات البرمجة، والتصميم الريترو**. وتأثيره: ميكانيكي، ومنظم، أو بيفكرك بزمان <en>mechanical, structured, or nostalgic</en>. وأهم علامة: **كل حرف واخد نفس العرض بالظبط**، حتى الـ i والـ W.' },
        { t: 'demo', id: 'typ-mono', title: 'اختبار العرض', caption: 'في المونو، كل حرف ليه خانة بنفس المقاس. ده اللي بيدّيه إحساس الآلة والدقة.', mount(el, api) {
          const word = 'iiiWWW';
          el.innerHTML = `<div class="typ-demo typ-mono"><div class="typ-mono__row"><span class="typ-mono__lab">Monospaced</span><span class="typ-mono__w" style="font-family:var(--f-mono)" dir="ltr">${[...word].map(c => `<i>${c}</i>`).join('')}</span></div><div class="typ-mono__row"><span class="typ-mono__lab">Serif</span><span class="typ-mono__w" style="font-family:var(--f-serif)" dir="ltr">${[...word].map(c => `<i>${c}</i>`).join('')}</span></div><button type="button" class="btn btn--sm" aria-pressed="false">ورّيني الخانات</button></div>`;
          const b = el.querySelector('button');
          b.addEventListener('click', () => { const on = el.querySelector('.typ-mono').classList.toggle('is-boxes'); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'اخفي الخانات' : 'ورّيني الخانات'; api.sfx('pop'); api.scene('mono'); if (on) api.award(5, { from: b, key: 'demo:typ-mono' }); });
        } },
        { t: 'example', title: 'لفّة في يومك', text: 'كارت فرح أختك: سكريبت. أفيش فيلم أكشن على السينما: ديسبلاي. المحرر اللي بتكتب فيه كود: مونو. وتصميم "ريترو" شبه الآلة الكاتبة: مونو برضه.' },
        { t: 'why', text: 'السكريبت شبه خط الإيد، فيحسسك بقُرب وحميمية. الديسبلاي معمول عشان يتشاف من بعيد، فهو بيزعق. والمونو كل حرف فيه في خانته، فيحسسك بآلة دقيقة.' },
        { t: 'trap', text: 'السكريبت والديسبلاي الاتنين "مميزين"، بس مش زي بعض. <en>Display</en> = جرأة ولفت انتباه (بوسترات وعناوين). <en>Script</en> = أناقة وقرب (دعوات فرح وبوتيكات).', wrong: 'Wedding invitations → Display · Posters → Script', right: 'Wedding invitations → Script · Posters → Display' },
        { t: 'tip', text: 'سكريبت = فرح. ديسبلاي = بوستر. مونو = كود.' },
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
      id: 'type-rbl', title: 'اقرا ما بين السطور', en: 'Read between the lines — mixing the moods right', ref: 'L02 · slide 25', scene: 'display',
      blocks: [
        { t: 'say', who: 'letter:display:A', text: 'العنوان والسطر اللي تحته. غيّر وزن واحد فيهم، والرسالة كلها تتقلب. السلايد عاملة جدول بـ ٨ تركيبات، واحفظهم.' },
        { t: 'quote', text: 'READ BETWEEN THE LINES — Mixing the moods right.', ref: 'L02 · S25' },
        { t: 'p', text: 'الفكرة: كل كارت فيه **عنوان كبير** بأسلوب، و**سطر صغير تحته** بأسلوب. الأساليب ٤: عادي <en>PLAIN</en>، وتقيل <en>BOLD</en>، ومزخرف <en>Fancy</en>، ورفيع <en>THIN</en>. وكل تركيبة بتقول جملة عن صاحبها.' },
        { t: 'art', html: `<div class="typ-rblg">${RBL.map(r => `<figure>${rblCard(r.h, r.s)}<figcaption dir="ltr">${r.read}</figcaption><p>${r.ar}</p></figure>`).join('')}</div>`, caption: 'التمانية زي الجدول بالظبط: العنوان فوق، والسطر تحته.' },
        { t: 'table', dir: 'ltr', head: ['Headline', 'Subtext', 'Reads as'], rows: RBL.map(r => [RBLS[r.h].h, RBLS[r.s].h, r.read]) },
        { t: 'demo', id: 'typ-rbl', title: 'اخلط بنفسك', caption: 'اختار أسلوب العنوان وأسلوب السطر. لو التركيبة من التمانية، هتظهرلك قرايتها.', mount(el, api) {
          const ks = ['plain', 'bold', 'fancy', 'thin']; let h = 'plain', s = 'fancy'; const found = new Set();
          el.innerHTML = `<div class="typ-demo typ-mix"><div class="typ-mix__ctl"><div><span class="label">العنوان</span><div class="typ-mix__g" data-g="h">${ks.map(k => `<button type="button" class="btn btn--sm" data-k="${k}">${RBLS[k].ar}</button>`).join('')}</div></div><div><span class="label">السطر اللي تحته</span><div class="typ-mix__g" data-g="s">${ks.map(k => `<button type="button" class="btn btn--sm" data-k="${k}">${RBLS[k].ar}</button>`).join('')}</div></div></div><div class="typ-mix__out"><div class="typ-mix__card"></div><p class="typ-mix__read" aria-live="polite"></p><p class="typ-mix__found"></p></div></div>`;
          const draw = () => {
            el.querySelector('.typ-mix__card').innerHTML = rblCard(h, s);
            const r = RBL.find(x => x.h === h && x.s === s);
            el.querySelector('.typ-mix__read').innerHTML = r ? `<b dir="ltr">${r.read}</b><br>${r.ar}` : `<span class="typ-mix__no">التركيبة دي مش في الجدول. التمانية اللي في السلايد بس هما اللي بيتسألوا.</span>`;
            if (r) found.add(h + s);
            el.querySelector('.typ-mix__found').innerHTML = `لقيت <span class="hud-num">${found.size}</span> من <span class="hud-num">8</span>`;
            el.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-k]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === (g.dataset.g === 'h' ? h : s)))));
            if (found.size >= 4) api.award(5, { from: el.querySelector('.typ-mix__card'), key: 'demo:typ-rbl' });
          };
          el.querySelectorAll('[data-g]').forEach(g => g.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { if (g.dataset.g === 'h') h = b.dataset.k; else s = b.dataset.k; api.sfx('pop'); draw(); })));
          draw();
        } },
        { t: 'why', text: 'الوزن والزخرفة بيدّوا "نبرة صوت". تقيل فوق تقيل = زعيق. رفيع فوق رفيع = همس منظم. مزخرف فوق مزخرف = رقة زيادة عن اللزوم.' },
        { t: 'trap', text: 'التركيبات المقلوبة بتلخبط: <en>BOLD</en> فوق <en>THIN</en> = <en>Committed to make an impression</en>. لكن <en>THIN</en> فوق <en>BOLD</en> = <en>Caters to the needs of disparate audience</en>. ونفس الحكاية: <en>PLAIN</en> فوق <en>Fancy</en> = <en>Emphasis is on core business</en>، و<en>Fancy</en> فوق <en>PLAIN</en> = <en>Friendly, flexible and open to new ideas</en>.', wrong: 'Thin headline + bold subtext = Committed to make an impression', right: 'Bold headline + thin subtext = Committed to make an impression' },
        { t: 'tip', text: 'نفس الأسلوبين = رسالة صافية: <en>BOLD+BOLD</en> عدواني، <en>PLAIN+PLAIN</en> واضح، <en>THIN+THIN</en> مينيمال، <en>Fancy+Fancy</en> أنثوي زيادة.' },
        { t: 'check', q: 'ty24' },
        { t: 'check', q: 'ty25' },
        { t: 'check', q: 'ty26' },
        { t: 'check', q: 'ty27' },
        { t: 'check', q: 'ty28' }
      ]
    },
    /* ------------------------------------------------------------ 6 */
    {
      id: 'type-principles', title: 'قواعد اللعبة', en: 'Psychological principles at play', ref: 'L02 · slide 27', scene: 'sans',
      blocks: [
        { t: 'say', who: 'letter:sans:A', text: 'تلات مبادئ بيقولولك ليه اختيار الخط مش ذوق شخصي وخلاص. والتلاتة بييجوا في الامتحان كتعريفات.' },
        { t: 'h', text: 'يتقري… ويحسّس', en: 'Legibility vs. Emotion' },
        { t: 'quote', text: 'Legibility vs. Emotion: A font must be readable, but it also sets the emotional tone. A playful font on a legal document would feel jarring, while a rigid font on a children’s book would feel cold.', ref: 'L02 · S27' },
        { t: 'compare', left: { title: 'خط لعوب على ورقة قانونية', en: 'jarring', text: 'نشاز. حاجة مش في مكانها.' }, right: { title: 'خط ناشف على كتاب أطفال', en: 'cold', text: 'بارد. الطفل مش هيحس إنه بتاعه.' }, note: 'الخط لازم يتقري، وفي نفس الوقت يحط المود الصح.' },
        { t: 'h', text: 'كرّر… تتعرف', en: 'Consistency and Trust' },
        { t: 'quote', text: 'Consistency and Trust: Repeated use of a typeface builds brand recognition and emotional familiarity.', ref: 'L02 · S27' },
        { t: 'example', title: 'نفس الخط في كل حتة', text: 'براند بيستخدم نفس الخط في اللوجو، واليافطة، والأبلكيشن، والبوستات. بعد شوية، بتعرفه من الخط لوحده، وبتحس معاه بألفة.' },
        { t: 'h', text: 'للخط جنسية وتاريخ', en: 'Cultural Influence' },
        { t: 'quote', text: 'Cultural Influence: Some fonts evoke specific eras or regions—like Gothic typefaces suggesting medieval Europe, or geometric sans-serifs evoking Bauhaus modernism.', ref: 'L02 · S27' },
        { t: 'art', html: bauhausArt, caption: 'السانس الهندسي معمول من أشكال بسيطة زي الدايرة والخط، ودي روح مدرسة باوهاوس.' },
        { t: 'example', title: 'وعندنا نفس الفكرة', text: 'الخط الكوفي بيحسسك بتراث وتاريخ. وخط الرقعة بيفكرك بخط إيد الكشكول واليافطات القديمة. الخط بيشيل زمنه ومكانه معاه.' },
        { t: 'quote', text: 'Typography is silent, but it speaks volumes. It’s the difference between shouting, whispering, or singing your message.', ref: 'L02 · S27', ar: 'الخط ساكت، بس بيقول كتير. هو الفرق بين إنك تزعق برسالتك، أو تهمس بيها، أو تغنيها.' },
        { t: 'demo', id: 'typ-tone', title: 'زعّق، اهمس، أو غنّي', caption: 'نفس الجملة، تلات نبرات. ده معنى shouting, whispering, or singing.', mount(el, api) {
          const modes = { shout: 'زعّق', whisper: 'اهمس', sing: 'غنّي' }; const seen = new Set();
          el.innerHTML = `<div class="typ-demo typ-tone"><div class="typ-tone__btns" role="group" aria-label="النبرة">${Object.keys(modes).map(k => `<button type="button" class="btn btn--sm" data-k="${k}" aria-pressed="false">${modes[k]}</button>`).join('')}</div><p class="typ-tone__line" dir="ltr"></p></div>`;
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
        { t: 'why', text: 'المخ بيربط الخط بالمواقف اللي شافه فيها قبل كده. عشان كده الخط الصح في المكان الصح بيبني ثقة، والخط الغلط بيعمل "نشاز" حتى لو الكلام مظبوط.' },
        { t: 'trap', text: '<en>Gothic → medieval Europe</en> مثال على <en>Cultural Influence</en>، مش <en>Consistency</en>. و<en>Bauhaus</en> مرتبط بالـ <en>geometric sans-serifs</en>، مش بالسيريف.', wrong: 'Gothic typefaces suggesting medieval Europe = Consistency and Trust', right: 'Gothic typefaces suggesting medieval Europe = Cultural Influence' },
        { t: 'tip', text: 'Legibility vs Emotion = يتقري + يحسّس. Consistency = كرّر تتعرف. Cultural = الخط ليه تاريخ وجنسية.' },
        { t: 'check', q: 'ty19' },
        { t: 'check', q: 'ty20' },
        { t: 'check', q: 'ty21' },
        { t: 'check', q: 'ty22' },
        { t: 'check', q: 'ty30' }
      ]
    }
  ]
};
