// Scene registry for the illustrated stage. Each group file exports { sceneName: { view?, draw(k, name), play?(svg, k, name) } }.
// Scene names match world/scenes.js (SCENE_INFO), so a chapter's `scene` works in both modes.
// 'sq:<Word>[#trial]' (Black Square pages) is answered by express.js's `sq()` export.
import mind from './mind.js';
import shape from './shape.js';
import space from './space.js';
import other from './other.js';
import color from './color.js';
import type from './type.js';
import express, { sq } from './express.js';
import gestalt from './gestalt.js';
import { INK, dots, mul } from './kit.js';

export const SCENES2D = { ...other, ...mind, ...shape, ...space, ...color, ...type, ...express, ...gestalt };

/** shown for a name nobody has drawn yet: a loose riso dot field (reads as "raw stimuli") */
export const FALLBACK = {
  draw: () => {
    let s = ''; let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const inks = [INK.blue, INK.pink, INK.navy, INK.teal];
    for (let i = 0; i < 160; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 230; s += `<circle class="fb-dot" cx="${(300 + Math.cos(a) * d).toFixed(1)}" cy="${(300 + Math.sin(a) * d).toFixed(1)}" r="${(2 + r() * 7).toFixed(1)}" fill="${inks[i % 4]}" opacity=".85"/>`; }
    return s;
  },
  play: (svg, k) => { k.gsap.from(svg.querySelectorAll('.fb-dot'), { scale: 0, transformOrigin: '50% 50%', duration: .8, stagger: .004, ease: 'back.out(2)' }); k.loop(svg.querySelectorAll('.fb-dot'), { y: '+=6', duration: 2.2, stagger: { each: .02, from: 'random' } }); }
};
export function sceneFor(name = '') {
  if (name.startsWith('sq:') && typeof sq === 'function') return sq(name) || SCENES2D.squares || FALLBACK;
  return SCENES2D[name] || FALLBACK;
}
export const SCENE_NAMES = () => Object.keys(SCENES2D);
