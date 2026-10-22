// UI strings for both languages. Keys are dotted by area: 'hub.*', 'screen.*', 'zone.*', 'learn.*', 'quiz.*', 'boss.*',
// 'archive.*', 'toast.*', 'common.*'. A value may be a string with {vars} or a function (vars) => string.
// Rules: Arabic stays Egyptian colloquial, short sentences (keep today's wording). English is plain, warm and short — a sharp friend, not a textbook.
// Never read these at module load time: call t() while rendering, so a language switch re-renders correctly.
// (Entry-flow strings — ident, setup, titles, illustrated hub — live in strings-entry.js.)
export const STR = {
  ar: {
    'common.back': 'رجوع',
    'common.close': 'اقفل'
  },
  en: {
    'common.back': 'Back',
    'common.close': 'Close'
  }
};
