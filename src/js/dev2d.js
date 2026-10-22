// Dev sheet for illustrated scenes (node build.mjs --dev --scenes2d → dist/dev-scenes2d.html)
//   #/            contact sheet of every scene name in world/scenes.js (missing ones show the fallback, labelled MISSING)
//   #/s/<name>    one scene on the real 2D stage (←/→ step through, R replays)
import gsap from 'gsap';
import kit, { installDefs } from './world/scenes2d/kit.js';
import { SCENES2D, sceneFor } from './world/scenes2d/index.js';
import { SCENE_INFO } from './world/scenes.js';
import { createStage2D } from './world/stage2d.js';
gsap.ticker.lagSmoothing(0);
document.documentElement.dataset.mode = 'illustrated';
document.body.style.cssText = 'background:#F4F5F9;color:#121535;margin:0;overflow:auto;font-family:system-ui';
installDefs();
const names = [...new Set([...Object.keys(SCENE_INFO), 'sq:Order', 'sq:Chaos#1', ...Object.keys(SCENES2D)])];
const app = document.getElementById('app'); app.innerHTML = '';
let stage = null;
function sheet() {
  app.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;padding:14px">${names.map(n => `<figure data-n="${n}" style="margin:0;background:#fff;border:1px solid #DCE0EF;border-radius:10px;overflow:hidden"><div class="cell" style="position:relative;aspect-ratio:1"></div><figcaption style="font:600 12px/1.2 system-ui;padding:6px 8px;display:flex;justify-content:space-between"><span>${n}</span><span style="color:${SCENES2D[n] || (n.startsWith('sq:') && sceneFor(n) !== sceneFor('zzz')) ? '#16A05D' : '#EE3440'}">${SCENES2D[n] || (n.startsWith('sq:') && sceneFor(n) !== sceneFor('zzz')) ? 'ok' : 'MISSING'}</span></figcaption></figure>`).join('')}</div>`;
  app.querySelectorAll('figure').forEach(f => {
    const n = f.dataset.n, sc = sceneFor(n), cell = f.querySelector('.cell');
    try { cell.innerHTML = `<svg viewBox="${sc.view || '0 0 600 600'}" style="position:absolute;inset:0;width:100%;height:100%">${sc.draw(kit, n)}</svg>`; gsap.context(() => sc.play?.(cell.firstElementChild, kit, n), cell); }
    catch (e) { cell.innerHTML = `<pre style="color:#EE3440;font-size:11px;white-space:pre-wrap;padding:8px">${e.message}</pre>`; console.error(n, e); }
  });
}
function single(name) {
  app.innerHTML = `<div id="stage2d" class="stage2d"></div><div style="position:fixed;left:14px;bottom:12px;font:600 14px system-ui">${name} · ${(SCENE_INFO[name] || []).join(' · ')} ${SCENES2D[name] ? '' : '<b style="color:#EE3440">MISSING</b>'}</div>`;
  stage = createStage2D(document.getElementById('stage2d'));
  stage.setStage({ cx: .5, cy: .48, z: 13.5 }, 0);
  stage.morph(name, { dur: 1 });
}
function go() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  if (h[0] === 's' && h[1]) single(decodeURIComponent(h.slice(1).join('/'))); else sheet();
}
addEventListener('keydown', e => {
  const h = location.hash.replace(/^#\/?/, '').split('/'); if (h[0] !== 's') return;
  const i = names.indexOf(decodeURIComponent(h.slice(1).join('/')));
  if (e.key === 'ArrowRight') location.hash = '#/s/' + encodeURIComponent(names[(i + 1) % names.length]);
  if (e.key === 'ArrowLeft') location.hash = '#/s/' + encodeURIComponent(names[(i - 1 + names.length) % names.length]);
  if (e.key === 'r') single(names[i]);
});
addEventListener('hashchange', go);
document.fonts.ready.then(go);
