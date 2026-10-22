/* Black Square Challenge — original compositions in a 150 × 150 frame (only squares and lines).
   item: {t:'s', x, y, s, r(deg), o(opacity), c:'k'|'p'|'b'|'r', st:1 for outline}  {t:'l', x1, y1, x2, y2, w, o, c} */
const SQ = (() => {
  const S = (x, y, s, r = 0, c = 'k', o = 1, st = 0) => ({ t: 's', x, y, s, r, c, o, st });
  const L = (x1, y1, x2, y2, w = 1.2, c = 'k', o = 1) => ({ t: 'l', x1, y1, x2, y2, w, c, o });
  const rnd = seed => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
  const W = {};
  const add = (word, ar, lec, why, trials) => { W[word] = { word, ar, lec, why, trials }; };

  add('Order', 'نظام', 1, 'Equal sizes, equal gaps, one alignment.', [
    { note: 'Same size + same gap', items: (() => { const a = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) a.push(S(21 + i * 30, 21 + j * 30, 18)); return a; })() },
    { note: 'One row, equal gaps', items: [0, 1, 2, 3, 4].map(i => S(11 + i * 28, 67, 16)) }
  ]);
  add('Increase', 'زيادة', 1, 'Size or number grows step by step.', [
    { note: 'Size grows', items: (() => { const sz = [8, 14, 20, 26, 32]; let x = 12; return sz.map(s => { const it = S(x, 130 - s, s); x += s + 4; return it; }); })() },
    { note: 'Count grows', items: (() => { const a = []; for (let c = 0; c < 5; c++) for (let k = 0; k <= c; k++) a.push(S(14 + c * 26, 116 - k * 16, 12)); return a; })() }
  ]);
  add('Bold', 'جرأة', 1, 'One heavy element takes the whole frame.', [
    { note: 'One huge square', items: [S(15, 15, 120)] },
    { note: 'Too big for the frame', items: [S(36, 36, 140), S(12, 12, 14)] }
  ]);
  add('Congested', 'زحمة', 1, 'Many elements, no room to breathe.', [
    { note: 'Crammed in a corner', items: (() => { const r = rnd(11), a = []; for (let i = 0; i < 16; i++) { const s = 10 + r() * 24; a.push(S(8 + r() * 58, 8 + r() * 58, s, (r() - .5) * 40)); } return a; })() },
    { note: 'Every gap filled', items: (() => { const r = rnd(29), a = []; for (let i = 0; i < 34; i++) { const s = 14 + r() * 28; a.push(S(-4 + r() * 130, -4 + r() * 130, s, (r() - .5) * 36)); } return a; })() }
  ]);
  add('Tension', 'توتر', 1, 'Elements almost touch, or balance on a point.', [
    { note: 'A 2-unit gap at the corners', items: [S(30, 30, 44), S(76, 76, 44)] },
    { note: 'Balanced on one corner', items: [S(45, 100, 60), S(52, 44.5, 46, 45)] }
  ]);
  add('Playful', 'مرح', 1, 'Small, tilted, bouncing at different heights.', [
    { note: 'Bouncing', items: [S(12, 96, 12, -14), S(30, 64, 11, 22), S(48, 88, 13, -8), S(66, 50, 12, 35), S(84, 80, 10, -25), S(100, 44, 14, 12), S(120, 72, 12, -30)] },
    { note: 'Tumbling', items: [S(14, 16, 22, 15), S(44, 34, 14, -20), S(62, 58, 26, 30), S(92, 74, 16, -12), S(104, 104, 20, 40), S(126, 124, 12, 10)] }
  ]);
  add('Dominance', 'سيطرة', 2, 'One element is far larger than the rest.', [
    { note: 'One giant over small ones', items: [S(40, 14, 70), ...[0, 1, 2, 3, 4, 5].map(i => S(23 + i * 18, 120, 8))] },
    { note: 'The small ones face it', items: [S(10, 30, 86), S(106, 96, 10), S(120, 96, 10), S(134, 96, 10)] }
  ]);
  add('Alienated', 'منعزل', 2, 'A group, and one element left outside it.', [
    { note: 'Left out of the group', items: [...[0, 1].flatMap(i => [0, 1, 2, 3].map(j => S(16 + i * 17, 18 + j * 17, 14))), S(122, 122, 14)] },
    { note: 'The odd one, outside the grid', items: [...[0, 1, 2, 3].flatMap(i => [0, 1, 2, 3].map(j => S(14 + i * 20, 34 + j * 20, 12))), S(122, 60, 12, 30, 'p')] }
  ]);
  add('Surprise', 'مفاجأة', 2, 'A pattern, then a sudden break.', [
    { note: 'The rhythm breaks', items: [...[0, 1, 2, 3, 4].map(i => S(10 + i * 16, 74, 10)), S(88, 42, 56)] },
    { note: 'One pops out', items: (() => { const a = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if (!(i === 3 && j === 1)) a.push(S(30 + i * 20, 40 + j * 20, 10)); a.push(S(82, 8, 26, 25, 'p')); return a; })() }
  ]);
  add('Upbeat', 'متفائل', 2, 'A rising rhythm with a light step.', [
    { note: 'Stepping up', items: [0, 1, 2, 3, 4, 5].map(i => S(12 + i * 21, 112 - i * 17, 14, i % 2 ? 10 : -10)) },
    { note: 'Notes going up', items: [L(10, 124, 140, 124, .8, 'k', .5), ...[[14, 100], [30, 80], [46, 90], [62, 64], [78, 74], [94, 46], [110, 56], [124, 26]].map(([x, y], i) => S(x, y, 11, 0, i === 7 ? 'p' : 'k'))] }
  ]);
  add('Chaos', 'فوضى', 2, 'Random sizes, angles, and lines everywhere.', [
    { note: 'No rule at all', items: (() => { const r = rnd(77), a = []; for (let i = 0; i < 22; i++) a.push(S(r() * 130, r() * 130, 6 + r() * 34, r() * 90, r() < .15 ? 'p' : 'k', .55 + r() * .45)); for (let i = 0; i < 6; i++) a.push(L(r() * 150, r() * 150, r() * 150, r() * 150, .8 + r() * 2.4)); return a; })() },
    { note: 'Lines cutting through', items: (() => { const r = rnd(5), a = []; for (let i = 0; i < 12; i++) a.push(L(r() * 150, 0 + r() * 20, r() * 150, 130 + r() * 20, .6 + r() * 2)); for (let i = 0; i < 10; i++) a.push(S(r() * 128, r() * 128, 8 + r() * 18, r() * 90)); return a; })() }
  ]);
  add('Acceptance', 'قبول', 2, 'A different element is taken into the group.', [
    { note: 'Welcomed into the gap', items: (() => { const a = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (!(i === 1 && j === 1)) a.push(S(36 + i * 28, 36 + j * 28, 22)); a.push(S(64, 64, 22, 0, 'p')); return a; })() },
    { note: 'Held inside', items: [S(30, 26, 90, 0, 'k', 1, 1), S(63, 82, 24)] }
  ]);
  add('Pressure', 'ضغط', 2, 'A heavy element bears down on a small one.', [
    { note: 'Pressed from above', items: [L(8, 136, 142, 136, 1.4), S(65, 116, 20), S(27, 19, 96)] },
    { note: 'Squeezed from all sides', items: [S(69, 69, 12, 0, 'p'), S(32, 58, 34), S(84, 58, 34), S(58, 32, 34), S(58, 84, 34)] }
  ]);
  add('Tranquility', 'هدوء', 2, 'Horizontal lines and lots of empty space.', [
    { note: 'Resting on the horizon', items: [L(10, 110, 140, 110, 1), S(69, 98, 12)] },
    { note: 'Still water', items: [L(10, 96, 140, 96, .8, 'k', .45), L(30, 112, 120, 112, .8, 'k', .3), S(34, 86, 10, 0, 'k', .6), S(70, 86, 10, 0, 'k', .6), S(106, 86, 10, 0, 'k', .6)] }
  ]);
  add('Harmony', 'انسجام', 2, 'Balanced, gradual, nothing fights.', [
    { note: 'Mirrored steps', items: [S(8, 69, 12), S(28, 64, 22), S(59, 59, 32, 0, 'p'), S(100, 64, 22), S(130, 69, 12)] },
    { note: 'Layers that agree', items: [0, 1, 2, 3].map(i => S(22 + i * 18, 22 + i * 18, 52, 0, 'k', .32)) }
  ]);
  add('Stability', 'ثبات', 2, 'A wide base, a narrow top, square on the ground.', [
    { note: 'Pyramid stack', items: [L(10, 135, 140, 135, 1.4), S(30, 105, 30), S(60, 105, 30), S(90, 105, 30), S(45, 75, 30), S(75, 75, 30), S(60, 45, 30)] },
    { note: 'Planted', items: [L(10, 138, 140, 138, 1.6), S(35, 58, 80)] }
  ]);
  add('Rage', 'غضب', 2, 'Sharp verticals, tilted squares, red.', [
    { note: 'Slashing verticals', items: [L(30, 6, 26, 144, 3.2), L(58, 10, 62, 140, 2.2, 'r'), L(98, 4, 92, 146, 3.6), L(124, 12, 128, 138, 1.6, 'r'), S(46, 40, 58, 24, 'r'), S(84, 92, 34, -32), S(16, 104, 22, 40, 'r')] },
    { note: 'Burst', items: (() => { const a = []; for (let i = 0; i < 10; i++) { const t = i / 10 * Math.PI * 2; const d = 30 + (i % 3) * 14; a.push(S(75 + Math.cos(t) * d - 8, 75 + Math.sin(t) * d - 8, 12 + (i % 4) * 5, t * 57, i % 3 ? 'k' : 'r')); a.push(L(75 + Math.cos(t + .3) * 10, 75 + Math.sin(t + .3) * 10, 75 + Math.cos(t + .3) * 70, 75 + Math.sin(t + .3) * 70, 2.6, i % 2 ? 'r' : 'k')); } return a; })() }
  ]);
  add('Justice', 'عدل', 2, 'Equal weights on both sides of an axis.', [
    { note: 'The scale', items: [L(25, 60, 125, 60, 1.6), L(75, 60, 75, 130, 1.6), L(55, 130, 95, 130, 1.6), S(25, 38, 22), S(103, 38, 22)] },
    { note: 'Mirror', items: [L(75, 12, 75, 138, 1, 'k', .6), S(33, 58, 26), S(91, 58, 26)] }
  ]);
  add('Melancholy', 'حزن', 2, 'Low, small, fading, falling lines.', [
    { note: 'Alone in the rain', items: [...[22, 40, 58, 76, 94, 112, 130].map((x, i) => L(x, 8 + (i % 3) * 10, x - 4, 60 + (i % 2) * 20, .7, 'k', .35)), S(20, 120, 14)] },
    { note: 'Sinking', items: [0, 1, 2, 3, 4].map(i => S(20 + i * 24, 30 + i * 22, 24 - i * 4, 0, 'k', 1 - i * .18)) }
  ]);
  add('Disorder', 'عدم انتظام', 2, 'An order you can still see, broken.', [
    { note: 'A grid that slipped', items: (() => { const a = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { if (i === 2 && j === 1) continue; let x = 21 + i * 30, y = 21 + j * 30, r = 0; if (i === 1 && j === 2) { x += 9; y += 5; r = 18; } if (i === 3 && j === 3) { x += 6; r = -24; } if (i === 0 && j === 1) { y -= 7; } a.push(S(x, y, 18, r)); } a.push(S(118, 132, 18, 32)); return a; })() },
    { note: 'Uneven steps', items: [S(10, 70, 14), S(28, 66, 20, 8), S(54, 76, 10), S(68, 60, 26, -12), S(100, 74, 12, 20), S(118, 64, 18)] }
  ]);
  add('Fluidity', 'سيولة', 2, 'Elements follow one smooth wave.', [
    { note: 'Riding the wave', items: (() => { const a = []; for (let i = 0; i < 12; i++) { const x = 10 + i * 11, y = 75 + Math.sin(i / 11 * Math.PI * 2) * 30, d = Math.cos(i / 11 * Math.PI * 2) * 30 * Math.PI * 2 / 121 * 11; a.push(S(x - 5, y - 5, 10, Math.atan(d / 11) * 57)); } return a; })() },
    { note: 'Ribbon', items: (() => { const a = []; for (let i = 0; i < 26; i++) { const x = 8 + i * 5.3; const y1 = 60 + Math.sin(i / 25 * Math.PI * 2) * 26, y2 = 92 + Math.sin(i / 25 * Math.PI * 2 + .9) * 26; a.push(L(x, y1, x, y2, .8, 'k', .7)); } return a; })() }
  ]);
  return W;
})();

export { SQ };
