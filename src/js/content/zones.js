// The districts of the mind. `tp` = question-bank topics; `n` = suggested order (lecture order) on the orbit.
// Names: ar / en (enShort: the orbit label) · tag + blurb: Arabic, tagEn + blurbEn: English (pick with L() at render time).
export const ZONES = [
  { id: 'mind', n: 1, ar: 'عقل المشاهد', en: 'The Viewer’s Mind', enShort: 'Viewer’s Mind', lec: '02', color: '#8B7BFF', dark: '#5B4BD6', tp: ['mind'],
    tag: 'كل تصميم بيلعب في دماغ حد', blurb: 'إزاي المصمم بيتوقّع دماغ اللي قدامه. وليه كل واحد بيشوف نفس الحاجة بطريقة مختلفة.', tagEn: 'Every design plays with someone’s mind', blurbEn: 'How a designer anticipates the mind of whoever is looking. And why everyone sees the same thing differently.' },
  { id: 'shape', n: 2, ar: 'الأشكال', en: 'Psychology of Shapes', enShort: 'Shapes', lec: '02', color: '#FF4A2E', dark: '#B8301A', tp: ['shape'],
    tag: 'كل شكل ليه شخصية', blurb: 'الدايرة بتطمّن، والمربع بيدّي ثقة، والمثلث بيتحرك. ٩ أشكال و٩ شخصيات.', tagEn: 'Every shape has a personality', blurbEn: 'The circle reassures, the square earns trust, the triangle moves. 9 shapes, 9 personalities.' },
  { id: 'space', n: 3, ar: 'الفراغ', en: 'Psychology of Space', enShort: 'Space', lec: '02', color: '#7FE7FF', dark: '#2BA6C4', tp: ['space'],
    tag: 'الفاضي مش فاضي', blurb: 'المساحة الفاضية عنصر تصميم. ليها نوعين، وليها مود، وبتقول حاجات من غير كلام.', tagEn: 'Empty isn’t empty', blurbEn: 'Empty space is a design element. It comes in two kinds, it has a mood, and it says things without words.' },
  { id: 'color', n: 4, ar: 'الألوان', en: 'Psychology of Color', enShort: 'Color', lec: '02', color: '#FF3E8A', dark: '#B8125C', tp: ['color'],
    tag: 'اللون بيحسّسك قبل ما تقرا', blurb: '٨ ألوان، ولكل لون مود ووظيفة. والمعنى بيتغيّر من ثقافة لثقافة.', tagEn: 'Color makes you feel before you read', blurbEn: '8 colors, each with a mood and a job. And the meaning shifts from culture to culture.' },
  { id: 'type', n: 5, ar: 'الخطوط', en: 'Psychology of Typeface', enShort: 'Typeface', lec: '02', color: '#FFC21A', dark: '#B88600', tp: ['type'],
    tag: 'الخط صوت', blurb: 'سيريف وسانس وسكريبت وديسبلاي ومونو. خمس عائلات، وخمس أصوات مختلفة لنفس الكلام.', tagEn: 'Type is a voice', blurbEn: 'Serif, sans, script, display and mono. Five families, five different voices for the same words.' },
  { id: 'express', n: 6, ar: 'المربع الأسود', en: 'Express Meaning', enShort: 'Black Square', lec: '02', color: '#EDEBE6', dark: '#9A988F', tp: ['express'],
    tag: 'عبّر بمربعات وخطوط بس', blurb: 'يعني إيه تعبير في التصميم. وإزاي كلمة زي "توتر" تبقى تكوين من مربعات.', tagEn: 'Express it with squares and lines only', blurbEn: 'What expression means in design. And how a word like “tension” becomes a composition of squares.' },
  { id: 'gestalt', n: 7, ar: 'الجشطالت', en: 'Gestalt Principles', enShort: 'Gestalt', lec: '03', color: '#4D6BFF', dark: '#2A3FB8', tp: ['gintro', 'gideas', 'glaws'],
    tag: 'المخ بيكمّل الصورة', blurb: 'الإدراك، و٤ أفكار أساسية، و٩ قوانين بتشرح إزاي المخ بيحوّل الزحمة لصورة واحدة.', tagEn: 'Your brain completes the picture', blurbEn: 'Perception, 4 key ideas, and 9 laws that explain how the brain turns clutter into one picture.' },
  { id: 'boss', n: 8, ar: 'الامتحان', en: 'The Exam', enShort: 'The Exam', lec: '', color: '#FF3B30', dark: '#B3201A', tp: [],
    tag: 'الوحش مستنيك', blurb: 'معركة الوحش، وامتحان البورتال بالتايمر، ووضع الانتقام من غلطاتك.', tagEn: 'The boss is waiting', blurbEn: 'The boss fight, the timed Portal exam, and Revenge mode for your mistakes.' },
  { id: 'old', n: 9, ar: 'محاضرة ١', en: 'Elements & Principles', enShort: 'Lecture 01', lec: '01', color: '#D9B88C', dark: '#8A7356', tp: ['bonus'],
    tag: 'برّه الكويز — احتياطي', blurb: 'عناصر ومبادئ التصميم من محاضرة ١. مش في الكويز، بس لو حبيت تأمّن نفسك.', tagEn: 'Not in the quiz — backup', blurbEn: 'The elements and principles of design from Lecture 01. Not in the quiz, but there if you want to play it safe.', bonus: true }
];
export const ZONE = Object.fromEntries(ZONES.map(z => [z.id, z]));
