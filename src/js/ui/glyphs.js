// Geometric sigils (no faces): the player's mark, district emblems, achievement medals. Drawn in currentColor.
const S = (inner, vb = '0 0 48 48') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
export const GLYPH = {
  circle: S('<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>'),
  square: S('<rect x="8" y="8" width="32" height="32"/><path d="M8 40L40 8" opacity=".35"/>'),
  triangle: S('<path d="M24 6L42 40H6z"/><path d="M24 6v34" opacity=".35"/>'),
  star: S('<path d="M24 4c1.6 10.2 9.8 18.4 20 20-10.2 1.6-18.4 9.8-20 20-1.6-10.2-9.8-18.4-20-20 10.2-1.6 18.4-9.8 20-20z"/>'),
  polygon: S('<path d="M24 5l16.5 9.5v19L24 43 7.5 33.5v-19z"/><path d="M24 5v38M7.5 14.5l33 19M40.5 14.5l-33 19" opacity=".3"/>'),
  organic: S('<path d="M26 7c10 0 16 7 15 16-1 7-6 8-5 13s-6 7-12 6-8 0-13-3-6-9-4-14-2-9 3-13 9-5 16-5z"/>'),
  trio: S('<circle cx="15" cy="31" r="10"/><rect x="21" y="7" width="19" height="19"/><path d="M33 30l8 13H25z"/>'),
  line: S('<path d="M6 34L42 14"/><path d="M33 12l9 2-3 9"/>'),
  ellipse: S('<ellipse cx="24" cy="24" rx="19" ry="12"/><ellipse cx="24" cy="24" rx="10" ry="6" opacity=".4"/>'),
  eye: S('<path d="M3 24c6-10 13-15 21-15s15 5 21 15c-6 10-13 15-21 15S9 34 3 24z"/><circle cx="24" cy="24" r="7.5"/><circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>'),
  void: S('<rect x="6" y="6" width="36" height="36" stroke-dasharray="2 4"/><circle cx="24" cy="24" r="3.5" fill="currentColor" stroke="none"/>'),
  spectrum: S('<circle cx="24" cy="24" r="17"/><path d="M24 7v34M7 24h34M12 12l24 24M36 12L12 36" opacity=".3"/>'),
  letter: S('<path d="M10 40L22 8h4l12 32M15 28h18"/>'),
  blacksq: S('<rect x="7" y="7" width="34" height="34"/><rect x="15" y="15" width="14" height="14" fill="currentColor" stroke="none" transform="rotate(12 22 22)"/><path d="M28 34h9" />'),
  kanizsa: S('<path d="M24 6a5 5 0 1 0 .01 0z" opacity="0"/><path d="M24 4.5a6 6 0 0 1 5.2 3l-5.2 3z" fill="currentColor"/><path d="M24 4.5a6 6 0 0 0-5.2 3l5.2 3z" fill="currentColor" opacity=".55"/><path d="M8 38a6 6 0 0 1 .2-6.3L13.6 35z" fill="currentColor"/><path d="M40 38a6 6 0 0 0-.2-6.3L34.4 35z" fill="currentColor"/><path d="M24 10.5L13.6 35h20.8z" stroke-dasharray="1.5 3" opacity=".6"/>'),
  monolith: S('<path d="M16 44V8l8-4 8 4v36z"/><path d="M18 15h12" stroke-width="2.6"/><path d="M16 30h16M16 37h16" opacity=".3"/>'),
  spiral: S('<path d="M26 24a2 2 0 1 0-4 0 4 4 0 0 0 8 0 6 6 0 0 0-12 0 10 10 0 0 0 20 0 14 14 0 0 0-28 0"/>'),
  flame: S('<path d="M24 44c-8 0-13-5-13-12 0-8 6-11 7-18 5 3 7 8 6 11 2-1 4-4 4-7 5 4 9 9 9 14 0 7-5 12-13 12z"/>'),
  bolt: S('<path d="M27 4L10 27h12l-3 17 19-24H26z"/>'),
  crown: S('<path d="M7 36l4-22 9 10 4-14 4 14 9-10 4 22z"/><path d="M7 42h34"/>'),
  target: S('<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="2.5" fill="currentColor" stroke="none"/>'),
  moon: S('<path d="M33 6a19 19 0 1 0 9 26A15 15 0 0 1 33 6z"/>'),
  infinity: S('<path d="M24 24c-4-6-8-9-12-9a9 9 0 0 0 0 18c4 0 8-3 12-9s8-9 12-9a9 9 0 0 1 0 18c-4 0-8-3-12-9z"/>')
};
export const glyph = (k, cls = '') => `<span class="glyph ${cls}">${GLYPH[k] || GLYPH.circle}</span>`;
/** the sigils a player can pick */
export const SIGILS = [
  { k: 'circle', ar: 'دايرة', d: 'وحدة، أمان، احتواء' },
  { k: 'square', ar: 'مربّع', d: 'ثبات، نظام، ثقة' },
  { k: 'triangle', ar: 'مثلّث', d: 'اتجاه، حركة، قوة' },
  { k: 'star', ar: 'نجمة', d: 'إنجاز، تميّز، طموح' },
  { k: 'polygon', ar: 'مضلّع', d: 'مودرن، حاد، تقني' },
  { k: 'organic', ar: 'شكل حر', d: 'طبيعة، إبداع، تلقائية' }
];
/** district emblems */
export const ZONE_GLYPH = { mind: 'eye', shape: 'trio', space: 'void', color: 'spectrum', type: 'letter', express: 'blacksq', gestalt: 'kanizsa', boss: 'monolith', old: 'spiral' };
