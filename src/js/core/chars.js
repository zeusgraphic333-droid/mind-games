// Mind Games — character system. Every character is an original SVG "sticker":
// flat body + shade + highlight + thick ink outline + a face that changes with the mood.
export const INK = '#1D1336';
const W = 'stroke-linejoin="round" stroke-linecap="round"';

/* ---------- colour helpers ---------- */
function hx(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function rgb(a) { return '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
export function shade(h, k) { const c = hx(h); return rgb(c.map(v => v * (1 - k))); }
export function tint(h, k) { const c = hx(h); return rgb(c.map(v => v + (255 - v) * k)); }

/* ---------- faces ---------- */
// cx, cy: centre between the eyes; s: scale (1 = eyes ~18px apart radius 9 in a 200 box)
export function face(expr = 'happy', cx = 100, cy = 100, s = 1, o = {}) {
  const g = (o.gap ?? 26) * s, r = 9.5 * s, lw = 5 * s;
  const L = cx - g, R = cx + g, my = cy + 22 * s;
  const ink = o.ink || INK;
  const blush = o.blush === false ? '' : `<ellipse cx="${L - 6 * s}" cy="${cy + 15 * s}" rx="${9 * s}" ry="${5 * s}" fill="#FF6FA3" opacity=".45"/><ellipse cx="${R + 6 * s}" cy="${cy + 15 * s}" rx="${9 * s}" ry="${5 * s}" fill="#FF6FA3" opacity=".45"/>`;
  const eye = (x, kind = 'dot') => {
    if (kind === 'dot') return `<g class="eye"><ellipse cx="${x}" cy="${cy}" rx="${r * .8}" ry="${r}" fill="${ink}"/><circle cx="${x + r * .28}" cy="${cy - r * .38}" r="${r * .32}" fill="#fff"/></g>`;
    if (kind === 'big') return `<g class="eye"><ellipse cx="${x}" cy="${cy}" rx="${r * 1.25}" ry="${r * 1.45}" fill="#fff" stroke="${ink}" stroke-width="${lw * .8}"/><ellipse cx="${x + r * .15}" cy="${cy + r * .15}" rx="${r * .72}" ry="${r * .9}" fill="${ink}"/><circle cx="${x + r * .42}" cy="${cy - r * .3}" r="${r * .3}" fill="#fff"/></g>`;
    if (kind === 'happy') return `<path d="M${x - r} ${cy + r * .25} Q${x} ${cy - r * 1.15} ${x + r} ${cy + r * .25}" fill="none" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'flat') return `<path d="M${x - r} ${cy} H${x + r}" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'x') return `<path d="M${x - r * .8} ${cy - r * .8} L${x + r * .8} ${cy + r * .8} M${x + r * .8} ${cy - r * .8} L${x - r * .8} ${cy + r * .8}" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'heart') return `<path d="M${x} ${cy + r * 1.05} C${x - r * 1.9} ${cy - r * .2} ${x - r * .9} ${cy - r * 1.6} ${x} ${cy - r * .45} C${x + r * .9} ${cy - r * 1.6} ${x + r * 1.9} ${cy - r * .2} ${x} ${cy + r * 1.05}Z" fill="#FF3D6E" stroke="${ink}" stroke-width="${lw * .6}" ${W}/>`;
    if (kind === 'star') { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .55 : r * 1.35; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); } return `<path d="${d}Z" fill="#FFD23F" stroke="${ink}" stroke-width="${lw * .55}" ${W}/>`; }
    if (kind === 'sleepy') return `<path d="M${x - r} ${cy} Q${x} ${cy + r * .9} ${x + r} ${cy}" fill="none" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'side') return `<g class="eye"><ellipse cx="${x}" cy="${cy}" rx="${r * .8}" ry="${r}" fill="${ink}"/><circle cx="${x - r * .3}" cy="${cy - r * .35}" r="${r * .3}" fill="#fff"/></g>`;
    return '';
  };
  const brows = (kind) => {
    if (kind === 'angry') return `<path d="M${L - r * 1.3} ${cy - r * 1.9} L${L + r * 1.1} ${cy - r * 1.1} M${R + r * 1.3} ${cy - r * 1.9} L${R - r * 1.1} ${cy - r * 1.1}" stroke="${ink}" stroke-width="${lw * 1.1}" ${W}/>`;
    if (kind === 'sad') return `<path d="M${L - r * 1.2} ${cy - r * 1.2} L${L + r * .9} ${cy - r * 1.9} M${R + r * 1.2} ${cy - r * 1.2} L${R - r * .9} ${cy - r * 1.9}" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'up') return `<path d="M${L - r} ${cy - r * 2} Q${L} ${cy - r * 2.7} ${L + r} ${cy - r * 2.05} M${R - r} ${cy - r * 2.05} Q${R} ${cy - r * 2.7} ${R + r} ${cy - r * 2}" fill="none" stroke="${ink}" stroke-width="${lw * .9}" ${W}/>`;
    if (kind === 'smug') return `<path d="M${L - r} ${cy - r * 1.5} L${L + r} ${cy - r * 1.7} M${R - r} ${cy - r * 2.1} Q${R} ${cy - r * 2.6} ${R + r} ${cy - r * 2}" fill="none" stroke="${ink}" stroke-width="${lw * .9}" ${W}/>`;
    return '';
  };
  const mouth = (kind) => {
    const w = 15 * s;
    if (kind === 'smile') return `<path d="M${cx - w} ${my - 3 * s} Q${cx} ${my + 13 * s} ${cx + w} ${my - 3 * s}" fill="none" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'open') return `<path d="M${cx - w} ${my - 4 * s} Q${cx} ${my + 24 * s} ${cx + w} ${my - 4 * s} Z" fill="#7A1838" stroke="${ink}" stroke-width="${lw}" ${W}/><path d="M${cx - w * .45} ${my + 9 * s} Q${cx} ${my + 4 * s} ${cx + w * .45} ${my + 9 * s} Q${cx} ${my + 15 * s} ${cx - w * .45} ${my + 9 * s}Z" fill="#FF7A9C"/>`;
    if (kind === 'o') return `<ellipse cx="${cx}" cy="${my + 4 * s}" rx="${7 * s}" ry="${9 * s}" fill="#7A1838" stroke="${ink}" stroke-width="${lw}"/>`;
    if (kind === 'flat') return `<path d="M${cx - w * .7} ${my + 2 * s} H${cx + w * .7}" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'frown') return `<path d="M${cx - w} ${my + 8 * s} Q${cx} ${my - 6 * s} ${cx + w} ${my + 8 * s}" fill="none" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'smirk') return `<path d="M${cx - w * .8} ${my + 3 * s} Q${cx + w * .1} ${my + 8 * s} ${cx + w} ${my - 5 * s}" fill="none" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'teeth') return `<path d="M${cx - w * 1.1} ${my - 2 * s} H${cx + w * 1.1} V${my + 11 * s} H${cx - w * 1.1} Z" fill="#fff" stroke="${ink}" stroke-width="${lw}" ${W}/><path d="M${cx - w * .4} ${my - 2 * s} V${my + 11 * s} M${cx + w * .35} ${my - 2 * s} V${my + 11 * s} M${cx - w * 1.1} ${my + 4.5 * s} H${cx + w * 1.1}" stroke="${ink}" stroke-width="${lw * .55}"/>`;
    if (kind === 'wavy') return `<path d="M${cx - w} ${my + 2 * s} q${w / 3} ${-7 * s} ${w * 2 / 3} 0 t${w * 2 / 3} 0 t${w * 2 / 3} 0" fill="none" stroke="${ink}" stroke-width="${lw}" ${W}/>`;
    if (kind === 'tongue') return `<path d="M${cx - w} ${my - 3 * s} Q${cx} ${my + 13 * s} ${cx + w} ${my - 3 * s}" fill="none" stroke="${ink}" stroke-width="${lw}" ${W}/><path d="M${cx + 2 * s} ${my + 4 * s} q${3 * s} ${12 * s} ${10 * s} ${2 * s}" fill="#FF7A9C" stroke="${ink}" stroke-width="${lw * .7}" ${W}/>`;
    return '';
  };
  const E = {
    happy: ['dot', 'dot', '', 'smile'], laugh: ['happy', 'happy', '', 'open'], wow: ['big', 'big', 'up', 'o'], smug: ['sleepy', 'side', 'smug', 'smirk'],
    angry: ['dot', 'dot', 'angry', 'teeth'], mad: ['dot', 'dot', 'angry', 'frown'], sad: ['dot', 'dot', 'sad', 'frown'], love: ['heart', 'heart', '', 'open'],
    dead: ['x', 'x', '', 'wavy'], calm: ['sleepy', 'sleepy', '', 'smile'], cheeky: ['happy', 'dot', '', 'tongue'], starry: ['star', 'star', '', 'open'],
    worried: ['big', 'big', 'sad', 'wavy'], cool: ['dot', 'dot', '', 'smirk'], flat: ['flat', 'flat', '', 'flat'], talk: ['dot', 'dot', 'up', 'open']
  }[expr] || ['dot', 'dot', '', 'smile'];
  const tear = (expr === 'sad' || expr === 'worried') ? `<path d="M${R + r * 1.4} ${cy + r * .6} q${-4 * s} ${8 * s} 0 ${11 * s} q${4 * s} ${-3 * s} 0 ${-11 * s}Z" fill="#7FD3FF" stroke="${ink}" stroke-width="${lw * .5}"/>` : '';
  const sweat = expr === 'worried' ? `<path d="M${L - r * 2.6} ${cy - r * 2} q-5 9 0 13 q5 -4 0 -13Z" fill="#7FD3FF" stroke="${ink}" stroke-width="${lw * .5}"/>` : '';
  return `<g class="face">${blush}${brows(E[2])}${eye(L, E[0])}${eye(R, E[1])}${mouth(E[3])}${tear}${sweat}</g>`;
}

/* ---------- body builder: fill + shade + highlight + outline ---------- */
function body(d, color, o = {}) {
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  const lw = o.lw ?? 7;
  return `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>
  <path d="${d}" fill="${color}"/>
  <g clip-path="url(#${id})"><path d="${d}" fill="none" stroke="${shade(color, .2)}" stroke-width="${o.shadeW ?? 26}" transform="translate(${o.sx ?? 12} ${o.sy ?? 12})" opacity=".6"/></g>
  ${o.hl === false ? '' : `<ellipse cx="${o.hx ?? 70}" cy="${o.hy ?? 62}" rx="${o.hrx ?? 15}" ry="${o.hry ?? 9}" fill="#fff" opacity=".7" transform="rotate(-30 ${o.hx ?? 70} ${o.hy ?? 62})"/>`}
  <path d="${d}" fill="none" stroke="${INK}" stroke-width="${lw}" ${W}/>`;
}
const limb = (d, lw = 7) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${lw}" ${W}/>`;
const shoe = (x, y, c = INK) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="6.5" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
const shadowEl = (cx = 100, cy = 190, rx = 46) => `<ellipse class="shd" cx="${cx}" cy="${cy}" rx="${rx}" ry="7" fill="${INK}" opacity=".16"/>`;

/* ---------- shapes ---------- */
function starPath(cx, cy, R, r, n = 5, rot = -Math.PI / 2) { let d = ''; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); } return d + 'Z'; }
function roundPoly(pts, rad) { // rounded polygon path
  let d = ''; const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const v1 = [p0[0] - p1[0], p0[1] - p1[1]], v2 = [p2[0] - p1[0], p2[1] - p1[1]];
    const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2);
    const a = [p1[0] + v1[0] / l1 * rad, p1[1] + v1[1] / l1 * rad], b = [p1[0] + v2[0] / l2 * rad, p1[1] + v2[1] / l2 * rad];
    d += (i ? 'L' : 'M') + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'Q' + p1[0] + ' ' + p1[1] + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
  }
  return d + 'Z';
}
export const PATHS = {
  circle: 'M100 30a62 62 0 1 1 0 124a62 62 0 1 1 0-124Z',
  square: roundPoly([[42, 40], [158, 40], [158, 156], [42, 156]], 16),
  triangle: roundPoly([[100, 22], [170, 156], [30, 156]], 14),
  star: (() => { const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 36 : 80; pts.push([100 + Math.cos(a) * rr, 98 + Math.sin(a) * rr]); } return roundPoly(pts, 7); })(),
  polygon: roundPoly([[100, 30], [160, 62], [160, 128], [100, 160], [40, 128], [40, 62]], 12),
  organic: 'M104 30C138 28 166 52 166 86C166 112 152 118 158 138C164 160 136 168 112 162C90 157 82 168 60 160C34 151 30 124 38 104C44 88 30 78 38 58C48 38 76 31 104 30Z',
  ellipse: 'M100 50C150 50 178 72 178 100C178 128 150 150 100 150C50 150 22 128 22 100C22 72 50 50 100 50Z',
  arrow: roundPoly([[24, 76], [112, 76], [112, 40], [178, 100], [112 , 160], [112, 124], [24, 124]], 9),
  drop: 'M100 24C100 24 154 82 154 120C154 150 130 170 100 170C70 170 46 150 46 120C46 82 100 24 100 24Z',
  brain: 'M60 66C52 44 74 30 92 38C100 24 126 24 134 40C154 34 172 50 166 70C182 80 182 104 168 114C176 132 160 152 140 148C130 164 106 166 96 154C80 166 56 160 52 142C32 142 22 120 34 106C22 92 34 70 60 66Z',
  paper: roundPoly([[44, 28], [138, 28], [162, 52], [162, 172], [44, 172]], 8)
};

/* ---------- character catalogue ---------- */
export const CAST = {
  mokho: { name: 'مُخّو', en: 'Mokho', color: '#FF8FC0', path: 'brain' },
  circle: { name: 'دايرة', en: 'Circle', color: '#FFB35C', path: 'circle' },
  square: { name: 'مربّع', en: 'Square', color: '#4F86FF', path: 'square' },
  triangle: { name: 'مثلّث', en: 'Triangle', color: '#FF5757', path: 'triangle' },
  star: { name: 'نجمة', en: 'Star', color: '#FFD23F', path: 'star' },
  polygon: { name: 'مضلّع', en: 'Polygon', color: '#9466FF', path: 'polygon' },
  organic: { name: 'بلوبي', en: 'Blobby', color: '#3ED6A0', path: 'organic' },
  arrow: { name: 'سهم', en: 'Arrow', color: '#FF8A3D', path: 'arrow' },
  ellipse: { name: 'بيضاوي', en: 'Ellipse', color: '#C7A6FF', path: 'ellipse' },
  nokta: { name: 'نُقطة', en: 'Nokta', color: '#FF4D9A', path: 'circle' }
};

function extras(kind, color) {
  switch (kind) {
    case 'mokho': return `<g fill="none" stroke="${shade(color, .28)}" stroke-width="5" ${W}><path d="M100 42C96 60 104 70 100 88"/><path d="M72 58c10 4 14 14 10 24"/><path d="M128 56c-8 6-10 16-6 24"/><path d="M150 84c-12 0-18 8-16 18"/><path d="M52 100c12-2 18 6 16 16"/></g>`;
    case 'square': return `<path d="M100 150 l-9 -18 l9 -12 l9 12 Z" fill="${INK}"/><path d="M90 116 L100 124 L110 116" fill="#fff" stroke="${INK}" stroke-width="4" ${W}/>`;
    case 'star': return `<g><path d="M62 84h76v14c0 10-8 17-18 17h-6c-8 0-14-6-14-14v-3h-0v3c0 8-6 14-14 14h-6c-10 0-18-7-18-17Z" fill="${INK}"/><path d="M68 90h22M110 90h22" stroke="#fff" stroke-width="3" opacity=".7" ${W}/></g><g fill="#fff" stroke="${INK}" stroke-width="3.5"><path d="M30 40l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/><path d="M168 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/></g>`;
    case 'polygon': return `<g fill="none" stroke="${INK}" stroke-width="5"><rect x="56" y="78" width="34" height="26" rx="6" fill="#fff" fill-opacity=".35"/><rect x="110" y="78" width="34" height="26" rx="6" fill="#fff" fill-opacity=".35"/><path d="M90 88h20"/></g>`;
    case 'organic': return `<path d="M150 40c18-6 30 4 30 4s-6 18-26 14c-6-1-8-12-4-18Z" fill="#7BE38A" stroke="${INK}" stroke-width="4.5" ${W}/><path d="M152 52c8-4 14-6 22-8" stroke="${INK}" stroke-width="3" ${W}/>`;
    case 'ellipse': return `<g stroke="${INK}" stroke-width="3.5" ${W}><path d="M66 82l-6-6M72 79l-3-8M128 79l3-8M134 82l6-6"/></g><circle cx="150" cy="70" r="7" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="160" cy="80" r="5" fill="#fff" stroke="${INK}" stroke-width="3.5"/>`;
    case 'triangle': return `<path d="M152 40l-12 22h10l-8 18" fill="none" stroke="#FFD23F" stroke-width="5" ${W}/>`;
    default: return '';
  }
}
const FACE_AT = { mokho: [100, 100, 1, 24], circle: [100, 88, 1.05, 24], square: [100, 88, 1.05, 24], triangle: [100, 110, .9, 20], star: [100, 98, .9, 20], polygon: [100, 92, 1, 24], organic: [100, 92, 1, 24], arrow: [92, 98, .85, 20], ellipse: [100, 96, .95, 24], nokta: [100, 90, 1.05, 22], drop: [100, 118, .95, 22], paper: [103, 86, 1.05, 26] };
const ARMS = {
  circle: ['M40 104c-16 4-22-6-26-16', 'M160 104c16 4 22-6 26-16'],
  square: ['M42 112c-14 6-18 18-16 30', 'M158 112c14 6 18 18 16 30'],
  triangle: ['M58 122c-16-6-24-20-22-34', 'M142 122c16-6 24-20 22-34'],
  star: ['M40 96c-12 6-18 2-24-6', 'M160 96c12 6 18 2 24-6'],
  polygon: ['M40 110c-14 4-18 14-16 26', 'M160 110c14 4 18 14 16 26'],
  organic: ['M38 108c-12 6-18 16-14 28', 'M164 112c12 6 16 16 12 28'],
  ellipse: ['M24 104c-10 6-14 14-10 24', 'M176 104c10 6 14 14 10 24'],
  mokho: ['M40 112c-14 6-18 18-16 30', 'M164 112c14 6 18 18 16 30'],
  nokta: ['M40 104c-14 2-20-6-24-14', 'M160 104c14 2 20-6 24-14'],
  drop: ['M48 128c-14 4-20 14-18 26', 'M152 128c14 4 20 14 18 26'],
  paper: ['M44 120c-16 2-24 10-26 22', 'M162 120c16 2 24 10 26 22']
};
const LEGS = { circle: [[84, 154], [116, 154]], square: [[78, 156], [122, 156]], triangle: [[78, 156], [122, 156]], star: [[84, 150], [116, 150]], polygon: [[84, 160], [116, 160]], organic: [[86, 162], [118, 162]], ellipse: [[80, 150], [120, 150]], mokho: [[84, 156], [116, 156]], nokta: [[86, 154], [114, 154]], arrow: [[60, 124], [92, 124]], drop: [[84, 170], [116, 170]], paper: [[80, 172], [126, 172]] };

/**
 * charSVG('square', { expr:'happy', color, size, arms:true, legs:true, cls, extra })
 */
export function charSVG(kind, o = {}) {
  const c = CAST[kind] || {};
  const pk = o.path || c.path || kind;
  const d = PATHS[pk];
  const color = o.color || c.color || '#FFD23F';
  const [fx, fy, fs, gap] = FACE_AT[kind] || FACE_AT[pk] || [100, 100, 1, 24];
  const arms = o.arms === false ? '' : (ARMS[kind] || ARMS[pk] || []).map(a => limb(a, 7)).join('');
  const legs = o.legs === false ? '' : (LEGS[kind] || LEGS[pk] || []).map(([x, y]) => limb(`M${x} ${y} v16`, 7) + shoe(x + (x < 100 ? -3 : 3), y + 18)).join('');
  const label = o.label ? `<title>${o.label}</title>` : '';
  const hl = { circle: [74, 58], square: [66, 62], triangle: [86, 62], star: [82, 54], polygon: [70, 62], organic: [72, 56], ellipse: [62, 70], arrow: [52, 86], mokho: [74, 56], nokta: [74, 58], drop: [80, 70], brain: [74, 56], paper: [64, 50] }[kind] || [70, 60];
  return `<svg class="chr chr--${kind} ${o.cls || ''}" viewBox="0 0 200 200" ${o.size ? `width="${o.size}" height="${o.size}"` : ''} role="img" aria-label="${o.label || c.en || kind}">${label}
  ${o.shadow === false ? '' : shadowEl(100, kind === 'arrow' ? 150 : 192, kind === 'ellipse' ? 60 : 44)}
  <g class="chr__bob">${legs}${arms}
    <g class="chr__body">${body(d, color, { hx: hl[0], hy: hl[1] })}${extras(kind, color)}${o.extra || ''}</g>
    ${face(o.expr || 'happy', fx, fy, fs, { gap })}
  </g></svg>`;
}

/* paint-drop colour characters */
export function dropSVG(color, o = {}) {
  const dark = ['#15151C', '#1D1336'].includes(color);
  const faceInk = dark ? '#FFFFFF' : INK;
  const acc = o.acc || '';
  return `<svg class="chr chr--drop ${o.cls || ''}" viewBox="0 0 200 200" role="img" aria-label="${o.label || 'colour'}">${shadowEl(100, 192, 40)}
  <g class="chr__bob">${(LEGS.drop).map(([x, y]) => limb(`M${x} ${y} v10`, 7) + shoe(x + (x < 100 ? -3 : 3), y + 12)).join('')}${ARMS.drop.map(a => limb(a)).join('')}
  <g class="chr__body">${body(PATHS.drop, color, { hx: 80, hy: 84, shadeW: 22 })}</g>${face(o.expr || 'happy', 100, 118, .95, { gap: 22, ink: faceInk, blush: !dark })}${acc}</g></svg>`;
}

/* font characters: a big letter with a face and a prop */
export function letterSVG(fam, letter, o = {}) {
  const fill = o.color || '#FFFFFF';
  return `<svg class="chr chr--letter ${o.cls || ''}" viewBox="0 0 200 200" role="img" aria-label="${o.label || 'font'}">${shadowEl(100, 192, 48)}
  <g class="chr__bob"><text x="100" y="${o.y || 168}" text-anchor="middle" font-family="${fam}" font-size="${o.fs || 170}" ${o.weight ? `font-weight="${o.weight}"` : ''} fill="${fill}" stroke="${INK}" stroke-width="8" paint-order="stroke" stroke-linejoin="round">${letter}</text>
  ${face(o.expr || 'happy', o.fx || 100, o.fy || 112, o.fsz || .8, { gap: o.gap || 20 })}${o.prop || ''}</g></svg>`;
}

/* the boss: an exam sheet monster */
export function bossSVG(o = {}) {
  const expr = o.expr || 'angry';
  const hurt = expr === 'hurt';
  const bubbles = [0, 1, 2, 3].map(i => `<circle cx="${72 + i * 20}" cy="132" r="7" fill="${i === 2 ? INK : '#fff'}" stroke="${INK}" stroke-width="3"/>`).join('') + [0, 1, 2, 3].map(i => `<circle cx="${72 + i * 20}" cy="152" r="7" fill="${i === 0 ? INK : '#fff'}" stroke="${INK}" stroke-width="3"/>`).join('');
  return `<svg class="chr chr--boss ${o.cls || ''}" viewBox="0 0 200 200" role="img" aria-label="The Exam, the final boss">${shadowEl(100, 194, 56)}
  <g class="chr__bob">${limb('M44 120c-22-2-30-16-28-32', 8)}${limb('M162 118c20-6 26-22 22-40', 8)}
    <g transform="rotate(-24 178 74)"><rect x="170" y="20" width="12" height="70" rx="4" fill="#FF3B3B" stroke="${INK}" stroke-width="5"/><path d="M170 90l6 14 6-14Z" fill="#fff" stroke="${INK}" stroke-width="4" ${W}/></g>
    ${limb('M80 172v14', 8)}${limb('M126 172v14', 8)}${shoe(76, 190)}${shoe(130, 190)}
    <g class="chr__body">${body(PATHS.paper, hurt ? '#FFD6D6' : '#FFFFFF', { hx: 70, hy: 50, shadeW: 18 })}
      <path d="M138 28v24h24" fill="#E7E2F3" stroke="${INK}" stroke-width="6" ${W}/>
      <g stroke="#C7C0DD" stroke-width="4" ${W}><path d="M60 46h52M60 58h70"/></g>${bubbles}
      <text x="100" y="186" text-anchor="middle" font-family="Lilita One, Impact, sans-serif" font-size="14" fill="${INK}" opacity=".0">exam</text></g>
    ${face(hurt ? 'dead' : expr, 103, 90, 1.05, { gap: 26, blush: false })}
  </g></svg>`;
}
