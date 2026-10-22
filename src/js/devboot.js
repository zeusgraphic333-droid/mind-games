// Dev harness for one zone (node build.mjs --dev --zone <zone>). Routes: #/dev/learn · #/dev/game/<n> · #/dev/quiz
// Builds the particle stage too, so chapter scenes can be checked. Add ?noworld to the URL to skip it.
import { openZone } from './ui/zone.js';
import { touchStreak, on } from './core/state.js';
import { createParticles, canWebGL } from './world/particles.js';
import { ZONE_FORMATION } from './world/formations.js';
import gsap from 'gsap';
// headless QA renders slowly; keep tweens on wall-clock time
gsap.ticker.lagSmoothing(0);
export function devBoot(zone, lesson, games) {
  document.documentElement.classList.add('is-dev');
  touchStreak();
  let world = null;
  if (canWebGL() && !location.search.includes('noworld')) {
    try { world = createParticles(document.getElementById('world')); world.set(ZONE_FORMATION[zone] || 'nebula'); world.start(); world.setStage(innerWidth > 980 ? { cx: .225, cy: .5, z: 20.5 } : { cx: .5, cy: .2, z: 19 }, 0); window.__mg = { world }; } catch (e) { console.warn(e); }
  }
  on('scene', ({ name }) => { if (world && name) world.morph(name, { dur: .9 }); });
  const go = () => {
    const [, kind = 'learn', n = '0'] = location.hash.replace(/^#\/?/, '').split('/');
    const tab = kind === 'game' ? 'play' : kind;
    const scr = openZone(zone, tab, null, { lesson, games });
    if (kind === 'game') setTimeout(() => scr?.panes.play.querySelectorAll('.gamecard')[+n]?.click(), 30);
  };
  window.addEventListener('hashchange', go);
  go();
}
