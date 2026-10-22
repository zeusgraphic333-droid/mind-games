// Color Lab — Lecture 02 · The psychology of colors in graphic design (slides 17–21).
import { COLORS } from '../../data/psych.js';

const FG = '#EDEBE6', DIM = '#7E7C8B', LINE = 'rgba(237,235,230,.35)';
const WARM = [['Warmth', 'دفا', '#FF6A13'], ['Glory', 'مجد', '#FFAF1E'], ['Love', 'حب', '#FF1F1F'], ['Prosperity', 'رخاء', '#FFD21A'], ['Energy', 'طاقة', '#FFF02A']];
const COLD = [['Tranquility', 'هدوء', '#66F2C6'], ['Peace', 'سلام', '#5BE0F7'], ['Trust', 'ثقة', '#2F8BE0'], ['Nobility', 'نبالة', '#86A9F5'], ['Nobility', 'نبالة', '#8E77DA']];
const NEUTRAL = [['Friendly', 'ودود', '#B49F70'], ['Formal', 'رسمي', '#6B6457'], ['Gloomy', 'كئيب', '#2A2620'], ['Solid', 'متين', '#050505'], ['Classy', 'شيك', '#B2B2F5'], ['Clean', 'نضيف', '#D6C8A3'], ['Purity', 'نقاء', '#D9D9D9']];
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
  warm: { name: 'دافي', scene: 'warm', words: WARM.map(w => w[0]), p: ['#2B0F05', '#FF6A13', '#FFD21A', '#FFF1D6', '#FFAF1E'] },
  cold: { name: 'بارد', scene: 'cold', words: ['Tranquility', 'Peace', 'Trust', 'Nobility'], p: ['#071A2B', '#2F8BE0', '#66F2C6', '#E6F6FF', '#86A9F5'] },
  neutral: { name: 'محايد', scene: 'neutrals', words: NEUTRAL.map(w => w[0]), p: ['#1E1C18', '#B49F70', '#D6C8A3', '#F0EDE6', '#6B6457'] }
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
    <text x="105" y="319" text-anchor="middle" font-family="Alexandria" font-weight="700" font-size="16" fill="${c.on}">اطلب دلوقتي</text>
  </svg>`;
}

export default {
  zone: 'color',
  hero: { say: 'اللون أول حاجة بتوصل لمخك. قبل الكلمة، وقبل الشكل. هنا هتعرف كل لون بيعمل فيك إيه، وليه نفس اللون معناه بيتغيّر من مكان لمكان.' },
  chapters: [
    /* ------------------------------------------------------------ 1 */
    {
      id: 'color-what', title: 'اللون مش ديكور', en: 'The psychology of colors', ref: 'L02 · slide 20', scene: 'colorSphere',
      blocks: [
        { t: 'say', who: 'drop:#FF3E8A', text: 'قبل ما تقرا ولا كلمة في أي بوستر، اللون يكون قالك المود خلاص. التصميم بيكلّمك قبل ما يتكلم.' },
        { t: 'p', text: 'السلايد بتعرّف سيكولوجية الألوان إنها خلطة من ٣ حاجات: **فن**، و**علم**، و**مشاعر**.' },
        { t: 'list', style: 'num', items: ['**فن** <en>art</en>: اختيار اللون ذوق وتكوين وتوازن.', '**علم** <en>science</en>: عينك ومخك بيتفاعلوا مع اللون بطريقة متوقعة إلى حد كبير.', '**مشاعر** <en>emotion</en>: كل لون شايل ذكريات وإحساس جواك.'] },
        { t: 'quote', text: 'The psychology of colors is a fascinating blend of art, science, and emotion.', ref: 'L02 · S20', ar: 'سيكولوجية الألوان = فن + علم + مشاعر.' },
        { t: 'p', text: 'وبعدين جملة مهمة: اللون مش حاجة "بتتشاف" وخلاص. اللون <en>trigger</en>. يعني زرار بيتداس جوه مخك. بيغيّر إحساسك، وتفكيرك، وتصرفك.' },
        { t: 'quote', text: 'Colors aren’t just visual, they’re psychological triggers that shape how people feel, think, and behave.', ref: 'L02 · S20', ar: 'الألوان مش بصرية بس. دي مُحفّزات نفسية بتشكّل إحساسك وتفكيرك وتصرفك.' },
        { t: 'h', text: 'المصمم بيستخدم اللون عشان ٣ حاجات', en: 'Designers use color strategically to…' },
        { t: 'grid', cols: 3, items: [
          { title: 'يعمل مود', en: 'evoke moods', text: 'هادي؟ متحمس؟ فخم؟ اللون بيحدد.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 30c6-10 12-10 18 0s12 10 18 0"/><path d="M6 20c6-10 12-10 18 0s12 10 18 0" opacity=".45"/></svg>`, color: '#8B7BFF' },
          { title: 'يأثّر على قرارك', en: 'influence decisions', text: 'تدوس؟ تشتري؟ تستنى؟', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M24 6v20M24 26l-12 14M24 26l12 14"/><circle cx="12" cy="41" r="2.5" fill="currentColor"/><circle cx="36" cy="41" r="2.5"/></svg>`, color: '#FF3E8A' },
          { title: 'يوصّل هوية البراند', en: 'communicate brand identity', text: 'تعرف البراند من لونه قبل اسمه.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="14" height="14"/><rect x="26" y="8" width="14" height="14"/><rect x="8" y="26" width="14" height="14"/><rect x="26" y="26" width="14" height="14" fill="currentColor"/></svg>`, color: '#FFC21A' }
        ] },
        { t: 'quote', text: 'Designers use color strategically to evoke moods, influence decisions, and communicate brand identity.', ref: 'L02 · S20' },
        { t: 'example', title: 'الأوكازيون', text: 'وقت الأوكازيون، فتارين محلات الهدوم بتتملي يافطات حمرا. مش صدفة. الأحمر بيعمل إحساس بالاستعجال، فتحس إن العرض هيخلص لو ما دخلتش دلوقتي. ده بالظبط <en>influence decisions</en>.' },
        { t: 'why', text: 'مخك بيلقط اللون أسرع من ما بيقرا. فاللون بيحط الإحساس الأول، والكلام بييجي بعده يأكّده.' },
        { t: 'trap', text: 'السلايد بتقول <en>triggers</en>. ممكن السؤال يحط كلمات شبهها زي <en>decorations</en> أو <en>signals</en> أو <en>symbols</en>. اختار الكلمة اللي في السلايد بالظبط.', wrong: 'Colors are psychological decorations', right: 'Colors are psychological triggers' },
        { t: 'tip', text: 'اللون = فن + علم + مشاعر. واللون <en>trigger</en> مش زينة. وبيستخدموه لـ: مود، قرار، براند.' },
        { t: 'check', q: 'co01' },
        { t: 'check', q: 'co02' },
        { t: 'check', q: 'co03' }
      ]
    },
    /* ------------------------------------------------------------ 2 */
    {
      id: 'color-temp', title: 'دافي، بارد، ومحايد', en: 'Warm colors · Cold colors · Neutrals', ref: 'L02 · slides 17–19', scene: 'warm',
      blocks: [
        { t: 'say', who: 'drop:#FF6A13', text: 'ادخل محل كشري في وسط البلد: أحمر وأصفر وبرتقالي. ادخل عيادة أسنان: أزرق وأبيض. ده مش ذوق صاحب المكان وبس. ده "حرارة" اللون.' },
        { t: 'p', text: 'السلايدات قسمت الألوان لمجموعتين ليهم عنوان: **ألوان دافية** <en>Warm colors</en> و**ألوان باردة** <en>Cold colors</en>. وبعدهم جراف تالت من غير عنوان، كله ألوان محايدة: بيج ورمادي وأسود، وواحد بس لافندر فاتح (<en>Classy</en>).' },
        { t: 'art', html: columns(), caption: 'دي كلمات السلايدات نفسها. خد بالك إن Nobility متكررة مرتين في الباردة، وإن السلايد كاتبة Tranquility غلط: TRANQUALITY.' },
        { t: 'h', text: 'الدافي: طاقة ودفا', en: 'Warm colors' },
        { t: 'grid', cols: 5, items: WARM.map(([en, ar, c]) => ({ title: ar, en, art: hexSw(c), color: c })) },
        { t: 'h', text: 'البارد: هدوء وثقة', en: 'Cold colors' },
        { t: 'grid', cols: 5, items: COLD.map(([en, ar, c]) => ({ title: ar, en, art: hexSw(c), color: c })) },
        { t: 'h', text: 'المحايد: الجراف اللي من غير عنوان', en: 'Neutrals' },
        { t: 'p', text: 'التالت ده بيج ورمادي وأسود، وواحد لافندر فاتح (<en>Classy</en>). كلماته: ودود، رسمي، كئيب، متين، شيك، نضيف، نقاء. خد بالك: نفس العيلة المحايدة فيها "ودود" و"كئيب". يعني درجة اللون نفسها بتفرق.' },
        { t: 'grid', cols: 4, items: NEUTRAL.map(([en, ar, c]) => ({ title: ar, en, art: hexSw(c), color: c === '#050505' || c === '#2A2620' ? '#55535F' : c })) },
        { t: 'demo', id: 'clr-temp', title: 'غيّر حرارة البوستر', caption: 'نفس البوستر بالظبط. اللي اتغير هو الحرارة بس، والإحساس اتقلب.', mount(el, api) {
          const keys = Object.keys(PAL); const seen = new Set(); let cur = 'warm';
          el.innerHTML = `<div class="clr-temp"><div class="clr-temp__btns" role="group" aria-label="حرارة الألوان">${keys.map(k => `<button type="button" class="btn btn--sm" data-k="${k}" aria-pressed="false">${PAL[k].name}</button>`).join('')}</div><div class="clr-temp__view"><div class="clr-temp__poster"></div><div class="clr-temp__words" dir="ltr"></div></div></div>`;
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
        { t: 'example', title: 'كافيه ولا سبا؟', text: 'كافيه عايزك تتكلم وتطلب تاني: ديكور دافي، طاقة ودفا. سبا عايزك تهدى وتسترخي: ألوان باردة، هدوء وسلام. نفس الفلوس في الدهانات، بس رسالتين عكس بعض.' },
        { t: 'why', text: 'الدافي بيفكّرك بالنار والشمس، فجسمك يصحى. والبارد بيفكرك بالمية والسما، فتهدى. مخك بيربط اللون بحاجات عاشها قبل كده.' },
        { t: 'trap', text: 'الامتحان بيحب يخلط كلمات الدافي بالبارد. <en>Prosperity</en> و<en>Glory</en> دافيين، مش باردين. و<en>Trust</en> و<en>Nobility</en> باردين، مش دافيين. والكلمات المحايدة زي <en>Classy</en> مش في أي واحدة من المجموعتين.', wrong: 'Cold colors: trust, love, prosperity', right: 'Cold colors: tranquility, peace, trust, nobility' },
        { t: 'tip', text: 'الدافي: دفا، مجد، حب، رخاء، طاقة. البارد: هدوء، سلام، ثقة، نبالة. المحايد: ودود، رسمي، كئيب، متين، شيك، نضيف، نقاء.' },
        { t: 'check', q: 'co04' },
        { t: 'check', q: 'co05' },
        { t: 'check', q: 'co06' }
      ]
    },
    /* ------------------------------------------------------------ 3 */
    {
      id: 'color-loud', title: 'أحمر، برتقالي، أصفر', en: 'Red · Orange · Yellow — the colors that push', ref: 'L02 · slide 20', scene: 'swatches',
      blocks: [
        { t: 'say', who: 'drop:#E5322D', text: 'التلاتة دول بيحركوك. تاكل، تشتري، تدوس. بس كل واحد بيزقّك من حتة مختلفة.' },
        { t: 'p', text: 'من هنا بنبدأ أهم جدول في درس الألوان. لكل لون حاجتين: **التأثير النفسي** <en>Psychological Impact</en> و**الاستخدامات الشائعة** <en>Common Uses</en>. الجدول ده بيجيب أسئلة كتير، فخده على مهلك.' },
        { t: 'table', dir: 'ltr', head: ['Color', 'Psychological Impact', 'Common Uses'], rows: [
          ['<span class="clr-dot" style="--c:#E5322D"></span>Red', 'Stimulates energy, urgency, passion, and appetite. Can also signal danger or excitement.', 'Sales, food brands, warnings'],
          ['<span class="clr-dot" style="--c:#FF7A1A"></span>Orange', 'Friendly, playful, and energetic. Encourages enthusiasm and creativity.', 'Call-to-action buttons, youth brands'],
          ['<span class="clr-dot" style="--c:#FFD21F"></span>Yellow', 'Optimistic, cheerful, attention-grabbing. Can cause anxiety in excess.', 'Promotions, children’s products']
        ] },
        { t: 'h', text: 'الأحمر: جوع واستعجال', en: 'Red' },
        { t: 'p', text: 'الأحمر بيرفع الطاقة، والاستعجال، والشغف، و**الشهية**. وكمان ممكن يدّي إشارة **خطر** أو **حماس**. استخداماته في الجدول: العروض <en>Sales</en>، وبراندات الأكل <en>food brands</en>، والتحذيرات <en>warnings</en>.' },
        { t: 'example', title: 'نفس الأحمر، معنيين', text: 'يافطة "<en>SALE 50%</en>" حمرا = حماس واستعجال. وعلامة "ممنوع الوقوف" حمرا = خطر. الاتنين في الجدول: <en>Can also signal danger or excitement</en>.' },
        { t: 'h', text: 'البرتقالي: دوس هنا', en: 'Orange' },
        { t: 'p', text: 'البرتقالي ودود ولعوب وفيه طاقة. بيشجّع الحماس والإبداع. والجدول بيقول استخدامه: **زراير** <en>Call-to-action</en> والبراندات الشبابية <en>youth brands</en>. يعني الزرار اللي عايزك تدوس عليه.' },
        { t: 'h', text: 'الأصفر: بُص هنا، بس بالراحة', en: 'Yellow' },
        { t: 'p', text: 'الأصفر متفائل ومبهج وبيشد العين. بس السلايد بتحذّر: لو زاد عن حده بيعمل **قلق** <en>anxiety in excess</en>. استخداماته: العروض <en>Promotions</en> ومنتجات الأطفال <en>children’s products</en>.' },
        { t: 'demo', id: 'clr-cta', title: 'لوّن زرار "اطلب دلوقتي"', caption: 'جرّب كذا لون على نفس الزرار، واقرا الجدول بيقول إيه عن كل واحد.', mount(el, api) {
          const tried = new Set();
          const verdict = { orange: 'ده بالظبط اللي في الجدول: <en>Call-to-action buttons</en>.', red: 'شغّال: الأحمر بيعمل استعجال، واستخدامه <en>Sales</en>. بس الجدول بيدّي الـ CTA للبرتقالي.', yellow: 'بيشد العين، بس كتير منه بيعمل قلق.', green: 'إحساس طبيعة وثروة. أنسب لبراند فلوس أو منتج طبيعي.', blue: 'ثقة وهدوء. حلو لمستشفى أو شركة تكنولوجيا، بس مش أكتر لون "بيزقّك".', purple: 'فخامة وغموض. يناسب منتج تجميل أو حاجة بريميوم.', black: 'شيك وقوي، وممكن يحس تقيل. شائع في الفخامة والموضة.', white: 'نضيف وبسيط. لوحده على خلفية فاتحة ممكن يختفي.' };
          el.innerHTML = `<div class="clr-cta"><div class="clr-cta__phone"></div><div class="clr-cta__side"><div class="clr-cta__chips" role="group" aria-label="ألوان الزرار">${COLORS.map(c => `<button type="button" class="clr-chip" data-k="${c.k}" style="--c:${c.hex}" aria-label="${c.name}" title="${c.name}"></button>`).join('')}</div><div class="clr-cta__read" aria-live="polite"></div></div></div>`;
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
        { t: 'why', text: 'التلاتة دول ألوان عالية الطاقة. بتمسك العين بسرعة، فبتعمل إحساس "دلوقتي حالًا". عشان كده بتلاقيهم في العروض والأكل والزراير.' },
        { t: 'trap', text: 'الشهية <en>appetite</en> مكتوبة عند الأحمر بس، مش البرتقالي. والـ <en>Call-to-action</en> للبرتقالي. ومنتجات الأطفال للأصفر. وتطبيق تأمل كله أحمر؟ غلط، لأن الأحمر بيعمل استعجال.', wrong: 'Orange stimulates appetite; yellow is for call-to-action buttons', right: 'Red → appetite & food brands · Orange → call-to-action · Yellow → children’s products' },
        { t: 'tip', text: 'أحمر = جعان ومستعجل. برتقالي = دوس هنا. أصفر = بُص هنا، بس متزوّدهاش.' },
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
      id: 'color-calm', title: 'أخضر، أزرق، بنفسجي، أسود، أبيض', en: 'Green · Blue · Purple · Black · White', ref: 'L02 · slide 20', scene: 'cold',
      blocks: [
        { t: 'say', who: 'drop:#2F47E8', text: 'الخمسة دول أهدى. بس كل واحد بيقول جملة مختلفة: طبيعة، ثقة، فخامة، قوة، بساطة.' },
        { t: 'table', dir: 'ltr', head: ['Color', 'Psychological Impact', 'Common Uses'], rows: [
          ['<span class="clr-dot" style="--c:#1FA35B"></span>Green', 'Associated with nature, health, tranquility, and wealth.', 'Eco-friendly brands, finance'],
          ['<span class="clr-dot" style="--c:#2F47E8"></span>Blue', 'Trustworthy, calming, and professional. Often used to convey stability and reliability.', 'Tech, healthcare, corporate brands'],
          ['<span class="clr-dot" style="--c:#7B3FC4"></span>Purple', 'Luxurious, mysterious, and creative. Historically linked to royalty and spirituality.', 'Beauty, premium products, spirituality'],
          ['<span class="clr-dot" style="--c:#15151C"></span>Black', 'Sophisticated, powerful, and elegant. Can also feel heavy or intimidating.', 'Luxury, fashion, editorial'],
          ['<span class="clr-dot" style="--c:#FFFFFF"></span>White', 'Clean, pure, minimalist. Enhances clarity and simplicity.', 'Tech, healthcare, modern design']
        ] },
        { t: 'grid', cols: 5, flip: true, items: COLORS.slice(3).map(c => ({ title: { green: 'أخضر', blue: 'أزرق', purple: 'بنفسجي', black: 'أسود', white: 'أبيض' }[c.k], en: c.name, art: hexSw(c.hex), color: c.k === 'black' ? '#55535F' : c.hex, text: c.ar + '<br><small>' + { green: 'الاستخدام: براندات صديقة للبيئة، والفلوس.', blue: 'الاستخدام: تكنولوجيا، صحة، شركات.', purple: 'الاستخدام: تجميل، منتجات بريميوم، روحانيات.', black: 'الاستخدام: فخامة، موضة، مجلات.', white: 'الاستخدام: تكنولوجيا، صحة، تصميم مودرن.' }[c.k] + '</small>' })) },
        { t: 'h', text: 'الأخضر: شجر… وفلوس', en: 'Green' },
        { t: 'p', text: 'الأخضر مرتبط بالطبيعة والصحة والهدوء، و**الثروة** <en>wealth</en>. عشان كده استخداماته حاجتين بعاد عن بعض: البراندات الصديقة للبيئة <en>Eco-friendly</en>، والفلوس <en>finance</en>.' },
        { t: 'h', text: 'الأزرق: الثقة', en: 'Blue' },
        { t: 'p', text: 'الأزرق جدير بالثقة، وهادي، واحترافي. وبيستخدموه عشان يوصّل الثبات والاعتمادية <en>stability and reliability</en>. استخداماته: التكنولوجيا، والصحة، والشركات.' },
        { t: 'h', text: 'البنفسجي: ملوك وغموض', en: 'Purple' },
        { t: 'p', text: 'فاخر وغامض ومبدع. وتاريخيًا مرتبط بالملوك والروحانيات <en>royalty and spirituality</en>. استخداماته: التجميل، والمنتجات البريميوم، والروحانيات.' },
        { t: 'h', text: 'الأسود: فخامة… ممكن تتقل', en: 'Black' },
        { t: 'p', text: 'راقي وقوي وأنيق. بس ممكن يحس **تقيل أو مخيف** <en>heavy or intimidating</en>. استخداماته: الفخامة، والموضة، والمجلات <en>editorial</en>.' },
        { t: 'h', text: 'الأبيض: وضوح', en: 'White' },
        { t: 'p', text: 'نضيف ونقي ومينيمال. وبيزوّد الوضوح والبساطة <en>clarity and simplicity</en>. استخداماته: التكنولوجيا، والصحة، والتصميم المودرن.' },
        { t: 'example', title: 'لفّة في الشارع', text: 'مستشفى أو شركة كبيرة: أزرق كتير. محل منتجات طبيعية أو أبلكيشن بنك: أخضر. براند ميكب غالي: بنفسجي أو أسود. موقع شركة تكنولوجيا: أبيض كتير ومساحة. كل واحد اختار اللون اللي استخداماته في الجدول شبهه.' },
        { t: 'why', text: 'الأزرق بيفكرك بالسما والبحر، حاجات ثابتة وموجودة دايمًا. فمخك يربطه بالثبات والثقة. والأسود بيفكرك بالليل والحاجة التقيلة، فيبقى قوي وممكن مخيف.' },
        { t: 'trap', text: 'الأزرق والأبيض الاتنين فيهم <en>Tech</en> و<en>healthcare</en> في الاستخدامات! الفرق في التأثير: الأزرق = ثقة وهدوء واحترافية. الأبيض = نضافة ونقاء وبساطة. وخد بالك: <en>Sales and warnings</en> مش من استخدامات الأزرق، دول بتوع الأحمر.', wrong: 'Blue: sales and warnings', right: 'Blue: tech, healthcare, corporate brands' },
        { t: 'tip', text: 'أخضر = شجر وفلوس. أزرق = ثقة. بنفسجي = ملوك وتجميل. أسود = فخامة تقيلة. أبيض = وضوح وبساطة.' },
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
      id: 'color-principles', title: '٤ حاجات بتحصل في مخك', en: 'Psychological principles at play', ref: 'L02 · slide 21', scene: 'colorSphere',
      blocks: [
        { t: 'say', who: 'drop:#8B7BFF', text: 'طب ليه اللون بيأثر فينا أصلًا؟ السلايد بتجاوب بـ ٤ مبادئ. والأربعة دول بييجوا في الامتحان كتعريفات، فاحفظ اسم كل واحد.' },
        { t: 'grid', cols: 2, items: [
          { title: 'الارتباطات', en: 'Color Associations', text: 'مخك رابط كل لون بتجارب ومشاعر. والربط ده بيتشكّل حسب الثقافة والسن والسياق.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="14" cy="24" r="7"/><circle cx="34" cy="14" r="5"/><circle cx="34" cy="34" r="5"/><path d="M20 21l9-5M20 27l9 5"/></svg>`, color: '#8B7BFF' },
          { title: 'التباين والانتباه', en: 'Contrast and Attention', text: 'الألوان الفاقعة أو المختلفة عن اللي حواليها بتخطف العين وبتوجهها.', art: `<svg viewBox="0 0 48 48"><g fill="#55535F">${Array.from({ length: 16 }, (_, k) => `<circle cx="${9 + (k % 4) * 10}" cy="${9 + Math.floor(k / 4) * 10}" r="3"/>`).join('')}</g><circle cx="29" cy="19" r="3.6" fill="#FF3E8A"/></svg>`, color: '#FF3E8A' },
          { title: 'التمهيد العاطفي', en: 'Emotional Priming', text: 'اللون بيجهّزك لإحساس معين قبل ما تقرا ولا كلمة.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 34h32"/><path d="M8 34c6-14 12-20 16-20s10 6 16 20" opacity=".6"/><path d="M24 8v6"/></svg>`, color: '#7FE7FF' },
          { title: 'هوية البراند', en: 'Brand Identity', text: 'نفس اللون كل مرة = البراند يتعرف وتثق فيه.', art: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="14" width="10" height="20" fill="currentColor"/><rect x="19" y="14" width="10" height="20" fill="currentColor" opacity=".7"/><rect x="32" y="14" width="10" height="20" fill="currentColor" opacity=".45"/></svg>`, color: '#FFC21A' }
        ] },
        { t: 'quote', text: '<b>Color Associations:</b> Our brains link colors to experiences and emotions—often shaped by culture, age, and context.<br><b>Contrast and Attention:</b> Bright or contrasting colors grab attention and guide the viewer’s eye.<br><b>Emotional Priming:</b> Colors can subtly prime viewers to feel a certain way before they even read a word.<br><b>Brand Identity:</b> Consistent color use builds recognition and trust. Think Coca-Cola red or Facebook blue.', ref: 'L02 · S21' },
        { t: 'demo', id: 'clr-contrast', title: 'زوّد التباين وشوف عينك بتروح فين', caption: 'المربع ده موجود من الأول. لما اختلف عن جيرانه بس، عينك راحتله لوحدها. ده Contrast and Attention.', mount(el, api) {
          const target = 23;
          el.innerHTML = `<div class="clr-con"><div class="clr-con__grid" aria-hidden="true">${Array.from({ length: 40 }, (_, k) => `<i${k === target ? ' class="is-t"' : ''}></i>`).join('')}</div><label class="clr-con__lab"><span>التباين</span><input type="range" min="0" max="100" value="0" aria-label="التباين"><b class="hud-num" dir="ltr">0%</b></label></div>`;
          const inp = el.querySelector('input'), t = el.querySelector('.is-t'), out = el.querySelector('b');
          const mixC = v => { const a = [85, 83, 95], b = [255, 62, 138]; return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * v)).join(',')})`; };
          const draw = () => { const v = inp.value / 100; t.style.background = mixC(v); t.style.boxShadow = v > .6 ? `0 0 ${Math.round(v * 18)}px rgba(255,62,138,${v * .7})` : 'none'; out.textContent = inp.value + '%'; if (v >= .8) api.award(5, { from: inp, key: 'demo:clr-contrast' }); };
          inp.addEventListener('input', draw); draw();
        } },
        { t: 'example', title: 'التمهيد في إعلان مستشفى', text: 'إعلان مستشفى بخلفية زرقا هادية. قبل ما تقرا الأرقام والخدمات، إنت أصلًا هديت شوية. ده <en>Emotional Priming</en>: اللون حضّرك.' },
        { t: 'example', title: 'البراند من لونه بس', text: 'لو شفت لون معين لوحده على عربية توزيع في الشارع، ساعات بتعرف البراند قبل ما تقرا اسمه. السلايد بتضرب المثل بـ <en>Coca-Cola red</en> و<en>Facebook blue</en>. السر في الثبات: نفس اللون كل مرة.' },
        { t: 'why', text: 'المخ بيحب الاختصار. بدل ما يفكر في كل حاجة من الأول، بيرجع لارتباطات قديمة. واللون أسرع مفتاح للارتباطات دي.' },
        { t: 'trap', text: 'اتنين بيتلخبطوا: <en>Color Associations</en> = مخك رابط اللون بتجارب ومشاعر (والربط ده حسب الثقافة والسن والسياق). <en>Emotional Priming</en> = اللون بيجهّزك لإحساس **قبل ما تقرا**. لو السؤال فيه "before they even read a word" يبقى Priming.', wrong: '“Before they even read a word” = Color Associations', right: '“Before they even read a word” = Emotional Priming' },
        { t: 'tip', text: 'Associations = ذاكرة. Contrast = عين. Priming = قبل الكلام. Brand Identity = تكرار.' },
        { t: 'check', q: 'co23' },
        { t: 'check', q: 'co24' },
        { t: 'check', q: 'co25' },
        { t: 'check', q: 'co26' }
      ]
    },
    /* ------------------------------------------------------------ 6 */
    {
      id: 'color-culture', title: 'نفس اللون، معنى تاني', en: 'Cultural considerations', ref: 'L02 · slide 21', scene: 'neutrals',
      blocks: [
        { t: 'say', who: 'drop:#FFFFFF', text: 'فستان الفرح أبيض، صح؟ في ثقافات تانية، الأبيض لون حزن. اللون مالوش معنى واحد في الدنيا كلها.' },
        { t: 'quote', text: 'Color meanings are not universal: In Western cultures, white often symbolizes purity; in some Eastern cultures, it’s linked to mourning. Red may mean love in one context and danger or luck in another.', ref: 'L02 · S21', ar: 'معاني الألوان مش عالمية. الأبيض: نقاء في الغرب، وحداد في بعض ثقافات الشرق. والأحمر: حب، أو خطر، أو حظ.' },
        { t: 'compare', left: { title: 'الأبيض في الغرب', en: 'Western cultures', text: 'رمز للنقاء <en>purity</en>. عشان كده فستان العروسة أبيض.', art: `<svg viewBox="0 0 220 90" fill="none" stroke="#EDEBE6" stroke-width="1.6"><circle cx="92" cy="45" r="22"/><circle cx="124" cy="45" r="22"/></svg>` }, right: { title: 'الأبيض في بعض ثقافات الشرق', en: 'some Eastern cultures', text: 'مرتبط بالحداد <en>mourning</en>. يعني ممكن يبقى لون عزا.', art: `<svg viewBox="0 0 220 90" fill="none" stroke="#7E7C8B" stroke-width="1.6"><path d="M110 74V36"/><path d="M110 36c-10-14-24-12-28-4 10 0 20 2 28 4zM110 36c10-14 24-12 28-4-10 0-20 2-28 4z"/><path d="M80 78h60"/></svg>` }, note: 'نفس اللون. عكس الإحساس. والفرق في عين اللي بيشوف، مش في اللون.' },
        { t: 'demo', id: 'clr-culture', title: 'الأحمر في ٣ سياقات', caption: 'السلايد: Red may mean love in one context and danger or luck in another.', mount(el, api) {
          const ctxs = [
            { k: 'love', ar: 'حب', en: 'love', d: 'كارت عيد حب أو وردة حمرا: الأحمر هنا حب وشغف.', svg: `<path d="M110 150C60 116 44 92 52 70c8-22 38-26 58-4 20-22 50-18 58 4 8 22-8 46-58 80z" fill="#E5322D"/>` },
            { k: 'danger', ar: 'خطر', en: 'danger', d: 'علامة تحذير أو زرار طوارئ: الأحمر هنا خطر.', svg: `<path d="M110 40l70 120H40z" fill="none" stroke="#E5322D" stroke-width="10" stroke-linejoin="round"/><path d="M110 86v34" stroke="#EDEBE6" stroke-width="10" stroke-linecap="round"/><circle cx="110" cy="138" r="6" fill="#EDEBE6"/>` },
            { k: 'luck', ar: 'حظ', en: 'luck', d: 'في ثقافات تانية، الظرف الأحمر بيتهادى بيه في الأعياد: الأحمر هنا حظ.', svg: `<rect x="66" y="46" width="88" height="118" rx="6" fill="#E5322D"/><circle cx="110" cy="96" r="18" fill="none" stroke="#FFC21A" stroke-width="5"/><path d="M66 70l44 30 44-30" fill="none" stroke="#B51F1A" stroke-width="3"/>` }
          ];
          const seen = new Set();
          el.innerHTML = `<div class="clr-cul"><div class="clr-cul__btns" role="group" aria-label="السياق">${ctxs.map(c => `<button type="button" class="btn btn--sm" data-k="${c.k}" aria-pressed="false">${c.ar}</button>`).join('')}</div><div class="clr-cul__view"><svg class="clr-cul__art" viewBox="0 0 220 200" role="img" aria-label="red in context"></svg><p class="clr-cul__d" aria-live="polite"></p></div></div>`;
          const draw = k => { const c = ctxs.find(x => x.k === k); seen.add(k); el.querySelector('.clr-cul__art').innerHTML = c.svg; el.querySelector('.clr-cul__d').innerHTML = `<b>Red = ${c.en}</b><br>${c.d}`; el.querySelectorAll('[data-k]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k))); if (seen.size === 3) api.award(5, { from: el.querySelector('.clr-cul__art'), key: 'demo:clr-culture' }); };
          el.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { api.sfx('pop'); draw(b.dataset.k); }));
          draw('love'); seen.clear(); seen.add('love');
        } },
        { t: 'example', title: 'تصميم لعميل برّه مصر', text: 'لو بتصمم دعوة لعميل من ثقافة تانية، متفترضش إن الأبيض فرحة. اسأل الأول. غلطة لون واحدة ممكن تقلب الرسالة.' },
        { t: 'why', text: 'المعنى مش جوه اللون. المعنى جوه دماغ اللي بيشوف. ودي نفس فكرة أول المحاضرة: <en>Different minds perceive things differently</en>.' },
        { t: 'trap', text: 'سؤال صح وغلط مشهور: "معاني الألوان عالمية". الإجابة: **غلط**. والأبيض: <en>purity</en> في الغرب، و<en>mourning</en> في بعض ثقافات الشرق، مش العكس.', wrong: 'Color meanings are universal across all cultures', right: 'Color meanings are not universal' },
        { t: 'quote', text: 'Color is silent, but it speaks volumes.', ref: 'L02 · S21', ar: 'اللون ساكت، بس بيقول كتير.' },
        { t: 'tip', text: 'أبيض: غرب = نقاء، بعض الشرق = حداد. أحمر: حب، خطر، حظ. والجملة الختامية: Color is silent, but it speaks volumes.' },
        { t: 'check', q: 'co27' },
        { t: 'check', q: 'co28' },
        { t: 'check', q: 'co29' },
        { t: 'check', q: 'co30' },
        { t: 'check', q: 'co33' }
      ]
    }
  ]
};
