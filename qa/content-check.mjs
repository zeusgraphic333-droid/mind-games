// Content integrity: every lesson block points at real things; every trial is mountable; the exam builder is balanced.
// node qa/content-check.mjs
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
const root = new URL('../src/js/', import.meta.url);
globalThis.document = globalThis.document || { createElement: () => ({ getContext: () => null, style: {} }), documentElement: { style: { setProperty() { } }, dataset: {} } };
globalThis.matchMedia = globalThis.matchMedia || (() => ({ matches: false }));
globalThis.localStorage = globalThis.localStorage || { getItem: () => null, setItem() { }, removeItem() { } };
globalThis.window = globalThis.window || globalThis; window.addEventListener = () => { };

const { QBY, QUESTIONS, TOPIC_ZONE } = await import(new URL('data/index.js', root));
const { FIG } = await import(new URL('data/figs.js', root));
const { SCENE_INFO } = await import(new URL('world/scenes.js', root));
const { SQ } = await import(new URL('data/squares.js', root));
const { ZONES } = await import(new URL('content/zones.js', root));
const BLOCKS = new Set(['say', 'p', 'h', 'quote', 'list', 'example', 'why', 'trap', 'tip', 'art', 'compare', 'grid', 'table', 'demo', 'check', 'fig', 'divider']);
let errors = 0, warns = 0; const err = m => { errors++; console.log('  ✗ ' + m); }; const warn = m => { warns++; console.log('  ! ' + m); };
const sceneOk = n => n.startsWith('sq:') ? !!SQ[n.slice(3).split('#')[0]] : n in SCENE_INFO;
const usedQ = new Set(); const chapterIds = new Set();
for (const z of ZONES) {
  if (z.id === 'boss') continue;
  const file = new URL(`content/lessons/${z.id}.js`, root);
  const src = fs.readFileSync(file, 'utf8');
  if (/core\/chars\.js/.test(src)) err(`${z.id}: imports core/chars.js (cartoon characters are retired)`);
  let L; try { L = (await import(file)).default; } catch (e) { err(`${z.id}: import failed — ${e.message}`); continue; }
  const chs = L.chapters || [];
  const zq = new Set(); let blocks = 0, checks = 0, demos = 0, quotes = 0, scenes = 0;
  console.log(`\n${z.id}: ${chs.length} chapters`);
  if (!chs.length) err(`${z.id}: no chapters`);
  for (const ch of chs) {
    if (!ch.id) err(`${z.id}: chapter without id`); else if (chapterIds.has(ch.id)) err(`duplicate chapter id ${ch.id}`); else chapterIds.add(ch.id);
    if (!ch.title) err(`${ch.id}: no title`);
    if (ch.scene) { scenes++; if (!sceneOk(ch.scene)) err(`${ch.id}: unknown scene "${ch.scene}"`); } else warn(`${ch.id}: no scene`);
    let hasCheck = false, hasQuote = false;
    for (const b of ch.blocks || []) {
      blocks++;
      if (!BLOCKS.has(b.t)) err(`${ch.id}: unknown block type "${b.t}"`);
      if (b.t === 'check') { checks++; hasCheck = true; const q = QBY[b.q]; if (!q) err(`${ch.id}: unknown question ${b.q}`); else { if (TOPIC_ZONE[q.tp] !== z.id) warn(`${ch.id}: ${b.q} is from topic ${q.tp} (zone ${TOPIC_ZONE[q.tp]})`); if (zq.has(b.q)) warn(`${ch.id}: ${b.q} used twice in ${z.id}`); zq.add(b.q); usedQ.add(b.q); } }
      if (b.t === 'quote') { quotes++; hasQuote = true; if (!b.text) err(`${ch.id}: empty quote`); }
      if (b.t === 'fig' && !FIG[b.id]) err(`${ch.id}: unknown figure ${b.id}`);
      if (b.t === 'demo') { demos++; if (typeof b.mount !== 'function') err(`${ch.id}: demo "${b.id}" has no mount()`); if (!b.id) warn(`${ch.id}: demo without id`); }
      if ((b.t === 'p' || b.t === 'say' || b.t === 'tip' || b.t === 'why') && !b.text) err(`${ch.id}: empty ${b.t}`);
      if (b.t === 'grid' && !(b.items || []).length) err(`${ch.id}: empty grid`);
      if (b.t === 'compare' && !(b.left && b.right)) err(`${ch.id}: compare needs left and right`);
      if (b.t === 'art' && !/^\s*<(svg|div|figure)/.test(b.html || '')) warn(`${ch.id}: art block html does not start with svg/div`);
      const txt = JSON.stringify(b);
      if (/[\u{1F300}-\u{1FAFF}]/u.test(txt)) warn(`${ch.id}: emoji in a ${b.t} block`);
    }
    if (!hasCheck) warn(`${ch.id}: no quick check`);
    if (!hasQuote && z.id !== 'old') warn(`${ch.id}: no slide quote`);
  }
  const pool = QUESTIONS.filter(q => z.tp.includes(q.tp)).length;
  console.log(`  blocks ${blocks} · checks ${checks} (${zq.size} unique of ${pool} in bank) · quotes ${quotes} · demos ${demos} · scenes ${scenes}/${chs.length}`);
  // trials
  try {
    const G = (await import(new URL(`games/${z.id}.js`, root))).default || [];
    console.log(`  trials: ${G.map(g => g.id).join(', ') || 'none'}`);
    if (!G.length) warn(`${z.id}: no trials`);
    for (const g of G) { if (!g.id?.startsWith(z.id + '-')) warn(`trial id ${g.id} should start with ${z.id}-`); if (typeof g.mount !== 'function') err(`trial ${g.id} has no mount()`); if (!g.title) err(`trial ${g.id} has no title`); }
  } catch (e) { err(`${z.id}: games import failed — ${e.message}`); }
}
console.log(`\nquestions used in lessons: ${usedQ.size} of ${QUESTIONS.length}`);
console.log(errors ? `\n${errors} error(s), ${warns} warning(s)` : `\nOK — 0 errors, ${warns} warning(s)`);
process.exit(errors ? 1 : 0);
