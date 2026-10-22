/* Lecture 02 content tables (slide wording) used by the Psychology room */
const SHAPES = [
  { k: 'circle', name: 'Circle', sym: 'Unity, infinity, wholeness, protection.', eff: 'Feels soft, safe, and inclusive.', use: 'Buttons in UI design, logos (e.g., Pepsi), social icons.', tip: 'Use circles to create a sense of harmony or friendliness.', ar: 'الدايرة: وحدة ولانهاية واكتمال وحماية. إحساسها ناعم وآمن وبيحتوي الكل.' },
  { k: 'square', name: 'Square / Rectangle', sym: 'Stability, reliability, structure, honesty.', eff: 'Feels solid, grounded, and trustworthy.', use: 'Layouts, grids, containers, corporate logos.', tip: 'Use squares to convey professionalism and order.', ar: 'المربع: ثبات واعتمادية ونظام وصدق. إحساسه متين وموثوق.' },
  { k: 'triangle', name: 'Triangle', sym: 'Direction, movement, tension, power.', eff: 'Feels dynamic, energetic, and sometimes aggressive.', use: 'Play buttons, warning signs, arrows.', tip: 'Use upward triangles for growth, downward for danger or grounding.', ar: 'المثلث: اتجاه وحركة وتوتر وقوة. لفوق = نمو، لتحت = خطر أو ثبات.' },
  { k: 'star', name: 'Star', sym: 'Achievement, excellence, aspiration.', eff: 'Feels celebratory and attention-grabbing.', use: 'Ratings, awards, festive designs.', tip: 'Use sparingly to highlight key elements or achievements.', ar: 'النجمة: إنجاز وتميز وطموح. احتفالية وبتشد الانتباه، فاستخدمها بقلة.' },
  { k: 'polygon', name: 'Polygon / Abstract', sym: 'Depends on the number of sides and symmetry.', eff: 'Can feel modern, edgy, or chaotic.', use: 'Backgrounds, branding for tech or creative industries.', tip: 'Use to break monotony or add visual interest.', ar: 'المضلع: معناه حسب عدد الأضلاع والتماثل. مودرن أو حاد أو فوضوي.' },
  { k: 'organic', name: 'Organic / Freeform', sym: 'Nature, creativity, spontaneity.', eff: 'Feels relaxed, artistic, and human.', use: 'Illustrations, art-based branding, wellness products.', tip: 'Use to soften rigid layouts or evoke natural themes.', ar: 'الأشكال العضوية: طبيعة وإبداع وتلقائية. مريحة وفنية وإنسانية.' },
  { k: 'lines', name: 'Lines and Arrows', sym: 'Direction, connection, emphasis.', eff: 'Guides the eye, creates flow.', use: 'Navigation, infographics, diagrams.', tip: 'Use arrows to lead users, lines to separate or connect elements.', ar: 'الخطوط والأسهم: اتجاه وربط وتأكيد. بتوجّه العين وبتعمل flow.' },
  { k: 'ellipse', name: 'Ellipse / Oval', sym: 'Continuity, elegance, motion.', eff: 'Feels smooth and graceful.', use: 'Portrait frames, logo elements, buttons.', tip: 'Use to create a sense of movement or softness.', ar: 'البيضاوي: استمرارية وأناقة وحركة. ناعم ورشيق.' },
  { k: 'combo', name: 'Geometric combinations', sym: 'Complexity, innovation, balance.', eff: 'Feels structured yet creative.', use: 'Modern branding, abstract art, tech interfaces.', tip: 'Combine shapes to tell layered stories or build visual metaphors.', ar: 'تركيبات الأشكال: تعقيد وابتكار وتوازن. منظمة بس مبدعة.' }
];
const COLORS = [
  { k: 'red', name: 'Red', hex: '#E5322D', on: '#fff', imp: 'Stimulates energy, urgency, passion, and appetite. Can also signal danger or excitement.', use: 'Sales, food brands, warnings', ar: 'طاقة واستعجال وشغف وفاتح للشهية. وممكن خطر أو حماس.' },
  { k: 'orange', name: 'Orange', hex: '#FF7A1A', on: '#1a1205', imp: 'Friendly, playful, and energetic. Encourages enthusiasm and creativity.', use: 'Call-to-action buttons, youth brands', ar: 'ودود ومرح وفيه طاقة. بيشجع الحماس والإبداع.' },
  { k: 'yellow', name: 'Yellow', hex: '#FFD21F', on: '#1a1705', imp: 'Optimistic, cheerful, attention-grabbing. Can cause anxiety in excess.', use: 'Promotions, children’s products', ar: 'متفائل ومبهج وبيشد الانتباه. لو زاد بيعمل قلق.' },
  { k: 'green', name: 'Green', hex: '#1FA35B', on: '#fff', imp: 'Associated with nature, health, tranquility, and wealth.', use: 'Eco-friendly brands, finance', ar: 'طبيعة وصحة وهدوء وثروة.' },
  { k: 'blue', name: 'Blue', hex: '#2F47E8', on: '#fff', imp: 'Trustworthy, calming, and professional. Often used to convey stability and reliability.', use: 'Tech, healthcare, corporate brands', ar: 'ثقة وهدوء واحترافية، وثبات واعتمادية.' },
  { k: 'purple', name: 'Purple', hex: '#7B3FC4', on: '#fff', imp: 'Luxurious, mysterious, and creative. Historically linked to royalty and spirituality.', use: 'Beauty, premium products, spirituality', ar: 'فخامة وغموض وإبداع. تاريخيًا مرتبط بالملوك والروحانيات.' },
  { k: 'black', name: 'Black', hex: '#15151C', on: '#fff', imp: 'Sophisticated, powerful, and elegant. Can also feel heavy or intimidating.', use: 'Luxury, fashion, editorial', ar: 'راقي وقوي وأنيق. وممكن يبقى تقيل أو مخيف.' },
  { k: 'white', name: 'White', hex: '#FFFFFF', on: '#15151C', imp: 'Clean, pure, minimalist. Enhances clarity and simplicity.', use: 'Tech, healthcare, modern design', ar: 'نظيف ونقي وبسيط. بيزوّد الوضوح والبساطة.' }
];
const TYPES = [
  { k: 'serif', name: 'Serif', ex: 'Times New Roman, Garamond', fam: "'EB Garamond', Garamond, 'Times New Roman', serif", psy: 'Tradition, authority, reliability', use: 'Newspapers, law firms, academic institutions', eff: 'Feels formal, trustworthy, and classic', ar: 'تقاليد وسلطة واعتمادية: جرايد ومحاماة وجامعات.', size: 1 },
  { k: 'sans', name: 'Sans-serif', ex: 'Helvetica, Arial', fam: "Arimo, Helvetica, Arial, sans-serif", psy: 'Modernity, clarity, neutrality', use: 'Tech companies, minimalist brands, UI design', eff: 'Feels clean, straightforward, and contemporary', ar: 'حداثة ووضوح وحياد: تك وبراندات بسيطة و UI.', size: .92 },
  { k: 'script', name: 'Script', ex: 'Brush Script, Lobster', fam: "Lobster, 'Brush Script MT', cursive", psy: 'Elegance, creativity, intimacy', use: 'Wedding invitations, boutique branding', eff: 'Feels personal, romantic, or artistic', ar: 'أناقة وإبداع وقرب: دعوات أفراح وبوتيكات.', size: 1 },
  { k: 'display', name: 'Display', ex: 'Impact, Bebas Neue', fam: "'Bebas Neue', Impact, sans-serif", psy: 'Boldness, uniqueness, attention-grabbing', use: 'Posters, headlines, advertising', eff: 'Feels dramatic, expressive, and memorable', ar: 'جرأة وتميّز وشد انتباه: بوسترات وعناوين وإعلانات.', size: 1.18 },
  { k: 'mono', name: 'Monospaced', ex: 'Courier, Consolas', fam: "'Courier Prime', Courier, monospace", psy: 'Precision, tech-savvy, utilitarian', use: 'Coding environments, retro designs', eff: 'Feels mechanical, structured, or nostalgic', ar: 'دقة وتكنولوجيا وعملية: برمجة وريترو.', size: .86 }
];
/* "Read between the lines": headline style over subline style, as on the slide */
const RBL = [ // row-major for a 2-column grid, so it mirrors the slide's two columns
  { h: 'plain', s: 'fancy', read: 'Emphasis is on core business.', ar: 'التركيز على البيزنس الأساسي.' },
  { h: 'bold', s: 'thin', read: 'Committed to make an impression.', ar: 'عايز يسيب انطباع.' },
  { h: 'fancy', s: 'plain', read: 'Friendly, flexible and open to new ideas.', ar: 'ودود ومرن ومنفتح على أفكار جديدة.' },
  { h: 'bold', s: 'bold', read: 'Jagged, masculine and aggressive.', ar: 'حاد ورجولي وعدواني.' },
  { h: 'plain', s: 'plain', read: 'The impact of this message is clear.', ar: 'تأثير الرسالة واضح ومباشر.' },
  { h: 'thin', s: 'thin', read: 'Minimalism inspired. Focused.', ar: 'مينيمال ومركّز.' },
  { h: 'fancy', s: 'fancy', read: 'It is about women. Yep, too feminine.', ar: 'عن الستات، وأنثوي زيادة.' },
  { h: 'thin', s: 'bold', read: 'Caters to the needs of a disparate audience.', ar: 'بيخدم جمهور مختلف ومتنوع.' }
];
/* Mood mixer briefs: every "fit" is a phrase taken from the slides */
const BRIEFS = [
  { k: 'free', name: 'Free play', ar: 'لعب حر' },
  { k: 'kids', name: 'Children’s toy brand', ar: 'براند لعب أطفال', want: { shape: ['circle', 'star'], type: ['display'], color: ['yellow', 'orange'], space: 'airy' },
    why: { shape: 'Circles create harmony or friendliness; stars feel celebratory.', type: 'Display faces are bold and attention-grabbing (and there are fonts for kids).', color: 'Yellow’s common uses include children’s products; orange suits youth brands.', space: 'Open, airy designs feel calm and inviting.' } },
  { k: 'law', name: 'Law firm', ar: 'مكتب محاماة', want: { shape: ['square'], type: ['serif'], color: ['blue', 'black'], space: 'airy' },
    why: { shape: 'Squares convey professionalism and order.', type: 'Serif uses: newspapers, law firms, academic institutions.', color: 'Blue: trustworthy, professional, corporate. Black: sophisticated, powerful.', space: 'Generous space feels calm and suggests quality.' } },
  { k: 'perfume', name: 'Luxury perfume', ar: 'برفان فاخر', want: { shape: ['ellipse', 'circle'], type: ['script', 'serif'], color: ['purple', 'black'], space: 'airy' },
    why: { shape: 'Ellipse: elegance, smooth and graceful.', type: 'Script: elegance and intimacy, boutique branding.', color: 'Purple: luxurious, premium products. Black: luxury and fashion.', space: 'High-end brands use generous negative space to signal refinement and exclusivity.' } },
  { k: 'sale', name: 'Fast-food sale', ar: 'عرض أكل سريع', want: { shape: ['triangle', 'star'], type: ['display'], color: ['red', 'orange'], space: 'dense' },
    why: { shape: 'Triangles feel dynamic and energetic; stars grab attention.', type: 'Display uses: posters, headlines, advertising.', color: 'Red stimulates urgency and appetite; uses: sales, food brands.', space: 'Dense, compact layouts feel intense or urgent.' } },
  { k: 'spa', name: 'Wellness spa', ar: 'سبا واسترخاء', want: { shape: ['organic', 'circle'], type: ['script', 'sans'], color: ['green'], space: 'airy' },
    why: { shape: 'Organic shapes: nature; common uses include wellness products.', type: 'Script feels personal; sans-serif feels clean and calm.', color: 'Green: nature, health, tranquility.', space: 'Ample negative space feels calm, open, and approachable.' } },
  { k: 'tech', name: 'Tech startup', ar: 'شركة تكنولوجيا ناشئة', want: { shape: ['polygon', 'combo', 'square'], type: ['sans', 'mono'], color: ['blue', 'white'], space: 'airy' },
    why: { shape: 'Polygons brand tech or creative industries; combinations fit tech interfaces.', type: 'Sans-serif uses: tech companies, UI design. Mono: tech-savvy.', color: 'Blue and white both list tech among their uses.', space: 'Minimalist space feels modern.' } }
];

export { SHAPES, COLORS, TYPES, RBL, BRIEFS };
