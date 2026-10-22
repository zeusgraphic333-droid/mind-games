// One place to reach the question bank and the study tables.
import { Q_PSYCH, Q_EXPRESS, Q_GESTALT, Q_BONUS } from './bank.js';
export { TERMS, PAIRS } from './terms.js';
export { SHAPES, COLORS, TYPES, RBL, BRIEFS } from './psych.js';
export { SQ } from './squares.js';

export const QUESTIONS = [...Q_PSYCH, ...Q_EXPRESS, ...Q_GESTALT, ...Q_BONUS];
export const QBY = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
/** topic → island zone */
export const TOPIC_ZONE = { mind: 'mind', shape: 'shape', space: 'space', color: 'color', type: 'type', express: 'express', gintro: 'gestalt', gideas: 'gestalt', glaws: 'gestalt', bonus: 'old' };
/** topic → [Arabic, English] name (pick with L() at render time) */
export const TOPIC_NAME = {
  mind: ['عقل المشاهد', 'The viewer’s mind'], shape: ['الأشكال', 'Shapes'], space: ['الفراغ', 'Space'], color: ['الألوان', 'Color'], type: ['الخطوط', 'Typeface'],
  express: ['التعبير', 'Express meaning'], gintro: ['مقدمة الجشطالت', 'Gestalt basics'], gideas: ['أفكار الجشطالت', 'Gestalt ideas'], glaws: ['قوانين الجشطالت', 'Gestalt laws'], bonus: ['محاضرة ١', 'Lecture 01']
};
export const qFor = topics => QUESTIONS.filter(q => topics.includes(q.tp));
/** options in display order: fixed items keep their order, the rest are shuffled; returns [{text, ok}] */
export function optionsOf(q, rnd = Math.random) {
  const right = q.a ?? 0;
  const list = q.o.map((t, i) => ({ text: t, ok: i === right }));
  if (q.fx) return list;
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  return list;
}
export const answerOf = q => q.o[q.a ?? 0];
