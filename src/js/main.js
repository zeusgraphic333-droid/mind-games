// MIND GAMES — boot, the particle world, and the router.
import gsap from 'gsap';
import { state, on, touchStreak, addXP, award } from './core/state.js';
import { sleep } from './core/util.js';
import { sfx, ambient } from './core/sfx.js';
import { openZone } from './ui/zone.js';
import { closeScreen, currentScreen } from './ui/screen.js';
import { ZONE } from './content/zones.js';
import { LESSONS } from './content/lessons/index.js';
import { GAMES } from './games/index.js';
import { createParticles, canWebGL } from './world/particles.js';
import * as FM from './world/formations.js';
import { ZONE_FORMATION } from './world/formations.js';
import { createHub } from './ui/hub.js';
import { mountIntro, onboarding } from './ui/intro.js';
import { mountEvents } from './ui/events.js';
import { mountCursor } from './ui/cursor.js';

const content = id => ({ lesson: LESSONS[id], games: GAMES[id] });
// QA renders at a few frames a second; don't let GSAP's lag smoothing stretch every tween
if (location.search.includes('hq')) gsap.ticker.lagSmoothing(0);
let world = null, hub = null;
const wide = () => innerWidth > 980;

async function boot() {
  touchStreak();
  mountCursor();
  if (state().settings.motion === 'reduce') document.documentElement.dataset.motion = 'reduce';
  mountEvents();
  const intro = mountIntro();
  intro.progress(8);
  const fonts = Promise.all([
    document.fonts.load('900 120px Alexandria'), document.fonts.load('700 120px Alexandria'), document.fonts.load('600 120px "EB Garamond"'),
    document.fonts.load('400 20px "IBM Plex Sans Arabic"'), document.fonts.load('500 20px Handjet'), document.fonts.load('400 60px Lobster'), document.fonts.load('400 60px "Bebas Neue"'), document.fonts.load('400 60px "Courier Prime"')
  ]).catch(() => { });
  await Promise.race([fonts, sleep(3500)]);
  intro.progress(38);
  if (canWebGL()) {
    try {
      world = createParticles(document.getElementById('world'), { onFrame: () => hub?.frame(), shouldRun: () => !currentScreen() || wide() || (currentScreen()?.body.scrollTop || 0) < innerHeight * .45 });
      world.real = true;
      world.set('nebula'); world.uniforms.uOpacity.value = 0; world.start();
      gsap.to(world.uniforms.uOpacity, { value: .7, duration: 2.5, ease: 'power2.out' });
      intro.progress(60);
      await sleep(30);
      const title = FM.text(world.N, 'عقلك بيشتغلك', { font: '900 230px Alexandria', width: world.mobile ? 5.0 : 9.6, color: '#EDEBE6', color2: '#8B7BFF', seed: 61 });
      world.builders.title = () => title;
      world.get('title'); intro.progress(75); await sleep(20);
      world.get('eye'); intro.progress(92);
    } catch (e) { console.warn('world failed, using the flat map', e); world = null; }
  }
  if (!world) world = flatWorld();
  window.__mg = { get world() { return world; }, get hub() { return hub; }, ...(location.search.includes('qa') ? { addXP, award } : {}) };
  hub = createHub(world, { lessons: LESSONS, onEnter: id => { location.hash = id === 'boss' ? '#/boss' : `#/z/${id}/learn`; }, onOpen: what => { location.hash = '#/' + what; } });
  hub.hide();
  intro.progress(100);
  await intro.gate();
  if (world.real) {
    gsap.to(world.uniforms.uOpacity, { value: 1, duration: .8 });
    await world.morph('title', { dur: 2.1, swirl: 1.6 });
    await sleep(900);
  }
  intro.close();
  ambient(true);
  on('settings', st => ambient(!!st.sound));
  if (!state().name) { world.morph('nebula', { dur: 2.2 }); await onboarding(); }
  route();
  window.addEventListener('hashchange', route);
}

const TITLE = 'Mind Games · عقلك بيشتغلك';
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [a, b, c] = h.split('/');
  document.title = a === 'z' && ZONE[b] ? `${ZONE[b].ar} · ${TITLE}` : a === 'boss' ? `الامتحان · ${TITLE}` : a === 'archive' || a === 'profile' ? `الأرشيف · ${TITLE}` : TITLE;
  if (a === 'z' && ZONE[b]) return toZone(b, c || 'learn');
  if (a === 'boss') return import('./ui/boss.js').then(m => { hub.hide(); m.openBoss(b, world); stageFor('boss'); }).catch(e => { console.error(e); location.hash = '#/'; });
  if (a === 'archive' || a === 'profile') return import('./ui/archive.js').then(m => { hub.hide(); m.openArchive(a === 'profile' ? 'me' : b, world); stageFor(null); }).catch(e => { console.error(e); location.hash = '#/'; });
  toHub();
}
function toHub() {
  const was = currentScreen();
  closeScreen();
  world.start();
  hub.show(was?.el?.dataset.screen?.replace('zone-', ''));
}
function stageFor() {
  if (!world.real) return;
  world.start();
  if (wide()) world.setStage({ cx: .225, cy: .5, z: 20.5 }, 1.6);
  else world.setStage({ cx: .5, cy: .2, z: 19 }, 1.4);
}
/* phones: rest the world while the content covers its band */
on('band', visible => { if (!world?.real || wide() || !currentScreen()) return; visible ? world.start() : world.stop(); });
function toZone(id, tab) {
  const scr = currentScreen();
  if (scr?.el.dataset.screen === 'zone-' + id) { scr.setTab(tab); return; }
  hub.hide();
  openZone(id, tab, null, content(id));
  if (world.real && world.current !== ZONE_FORMATION[id]) world.morph(ZONE_FORMATION[id], { dur: 1.8 });
  stageFor(id);
  sfx('swoosh');
}

/* big wins make the cloud breathe out */
on('celebrate', o => { if (world?.real) { world.scatter(o?.big ? .9 : .45, { out: .4, back: 1.8 }); } });
/* lesson chapters ask for scenes */
on('scene', ({ name }) => { if (world?.real && name) world.morph(name, { dur: wide() ? 2 : 1.4 }); });

/** when WebGL is missing: same API, no particles (the hub still works) */
function flatWorld() {
  document.getElementById('world').classList.add('world--flat');
  const noop = () => Promise.resolve();
  return { real: false, mobile: innerWidth < 760, renderer: { domElement: document.getElementById('world') }, uniforms: {}, start() { }, stop() { }, morph: noop, set() { }, scatter: noop, flash() { }, setStage() { }, get() { }, builders: {}, current: '', project: () => ({ x: -999, y: -999, z: 0 }) };
}

boot();
