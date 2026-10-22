// The districts of the mind. `tp` = question-bank topics; `n` = suggested order (lecture order) on the orbit.
export const ZONES = [
  { id: 'mind', n: 1, ar: 'عقل المشاهد', en: 'The Viewer’s Mind', lec: '02', color: '#8B7BFF', dark: '#5B4BD6', tp: ['mind'],
    tag: 'كل تصميم بيلعب في دماغ حد', blurb: 'إزاي المصمم بيتوقّع دماغ اللي قدامه. وليه كل واحد بيشوف نفس الحاجة بطريقة مختلفة.' },
  { id: 'shape', n: 2, ar: 'الأشكال', en: 'Psychology of Shapes', lec: '02', color: '#FF4A2E', dark: '#B8301A', tp: ['shape'],
    tag: 'كل شكل ليه شخصية', blurb: 'الدايرة بتطمّن، والمربع بيدّي ثقة، والمثلث بيتحرك. ٩ أشكال و٩ شخصيات.' },
  { id: 'space', n: 3, ar: 'الفراغ', en: 'Psychology of Space', lec: '02', color: '#7FE7FF', dark: '#2BA6C4', tp: ['space'],
    tag: 'الفاضي مش فاضي', blurb: 'المساحة الفاضية عنصر تصميم. ليها نوعين، وليها مود، وبتقول حاجات من غير كلام.' },
  { id: 'color', n: 4, ar: 'الألوان', en: 'Psychology of Color', lec: '02', color: '#FF3E8A', dark: '#B8125C', tp: ['color'],
    tag: 'اللون بيحسّسك قبل ما تقرا', blurb: '٨ ألوان، ولكل لون مود ووظيفة. والمعنى بيتغيّر من ثقافة لثقافة.' },
  { id: 'type', n: 5, ar: 'الخطوط', en: 'Psychology of Typeface', lec: '02', color: '#FFC21A', dark: '#B88600', tp: ['type'],
    tag: 'الخط صوت', blurb: 'سيريف وسانس وسكريبت وديسبلاي ومونو. خمس عائلات، وخمس أصوات مختلفة لنفس الكلام.' },
  { id: 'express', n: 6, ar: 'المربع الأسود', en: 'Express Meaning', lec: '02', color: '#EDEBE6', dark: '#9A988F', tp: ['express'],
    tag: 'عبّر بمربعات وخطوط بس', blurb: 'يعني إيه تعبير في التصميم. وإزاي كلمة زي "توتر" تبقى تكوين من مربعات.' },
  { id: 'gestalt', n: 7, ar: 'الجشطالت', en: 'Gestalt Principles', lec: '03', color: '#4D6BFF', dark: '#2A3FB8', tp: ['gintro', 'gideas', 'glaws'],
    tag: 'المخ بيكمّل الصورة', blurb: 'الإدراك، و٤ أفكار أساسية، و٩ قوانين بتشرح إزاي المخ بيحوّل الزحمة لصورة واحدة.' },
  { id: 'boss', n: 8, ar: 'الامتحان', en: 'The Exam', lec: '', color: '#FF3B30', dark: '#B3201A', tp: [],
    tag: 'الوحش مستنيك', blurb: 'معركة الوحش، وامتحان البورتال بالتايمر، ووضع الانتقام من غلطاتك.' },
  { id: 'old', n: 9, ar: 'محاضرة ١', en: 'Elements & Principles', lec: '01', color: '#D9B88C', dark: '#8A7356', tp: ['bonus'],
    tag: 'برّه الكويز — احتياطي', blurb: 'عناصر ومبادئ التصميم من محاضرة ١. مش في الكويز، بس لو حبيت تأمّن نفسك.', bonus: true }
];
export const ZONE = Object.fromEntries(ZONES.map(z => [z.id, z]));
