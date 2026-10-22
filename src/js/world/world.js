// The living island: renderer, camera, controls, picking, labels and the idle animation loop.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { buildWorld } from './build.js';
import { ZONES, ZONE } from '../content/zones.js';

export function canWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

export function createWorld(host, opts = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.className = 'world__canvas';

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#FFD9EE', 46, 95);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 300);
  const HOME = { pos: new THREE.Vector3(0, 17.5, 27), target: new THREE.Vector3(0, 0.6, 0) };
  camera.position.copy(HOME.pos);

  scene.add(new THREE.HemisphereLight('#FFFFFF', '#B9A2E8', 1.35));
  const sun = new THREE.DirectionalLight('#FFF1D9', 2.1);
  sun.position.set(9, 18, 10); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 }); sun.shadow.bias = -0.0015; sun.shadow.normalBias = 0.03;
  scene.add(sun);

  const { anim, zones } = buildWorld(scene);
  const hits = Object.values(zones).map(z => z.hit);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(HOME.target);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, enablePan: false, minDistance: 15, maxDistance: 46, minPolarAngle: 0.45, maxPolarAngle: 1.22, rotateSpeed: 0.55, zoomSpeed: 0.8, autoRotate: !reduced, autoRotateSpeed: 0.35 });
  controls.update();

  /* ---------- labels (HTML, projected) ---------- */
  const layer = document.createElement('div'); layer.className = 'world__labels'; host.appendChild(layer);
  const labels = {};
  for (const z of ZONES) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'zlabel' + (z.id === 'boss' ? ' zlabel--boss' : '') + (z.center ? ' zlabel--hq' : '');
    b.style.setProperty('--zc', z.color);
    b.innerHTML = `<span class="zlabel__ar">${z.ar}</span><span class="zlabel__en">${z.en}</span><span class="zlabel__stars" data-stars="${z.id}"></span>`;
    b.addEventListener('click', e => { e.stopPropagation(); enter(z.id); });
    b.addEventListener('pointerenter', () => setHover(z.id)); b.addEventListener('pointerleave', () => setHover(null));
    layer.appendChild(b); labels[z.id] = b;
  }
  const anchor = id => { const z = zones[id]; const y = { boss: 7.6, mind: 3.4, old: 3.0, shape: 3.6, space: 3.4, gestalt: 4.2, type: 3.2, color: 3.0, express: 2.8 }[id] || 3; return z.pos.clone().add(new THREE.Vector3(0, y, 0)); };

  /* ---------- picking ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hover = null, down = null;
  function pick(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(hits, false)[0];
    return h ? h.object.userData.zone : null;
  }
  function setHover(id) {
    if (hover === id) return;
    if (hover && labels[hover]) labels[hover].classList.remove('is-hover');
    hover = id;
    renderer.domElement.style.cursor = id ? 'pointer' : 'grab';
    if (id && labels[id]) labels[id].classList.add('is-hover');
    for (const k in zones) { const g = zones[k].g; const s = k === id ? 1.07 : 1; gsap.to(g.scale, { x: s, y: s, z: s, duration: 0.35, ease: 'back.out(3)' }); }
    opts.onHover?.(id);
  }
  renderer.domElement.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') setHover(pick(e)); });
  renderer.domElement.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; controls.autoRotate = false; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null;
    if (moved < 8) { const id = pick(e); if (id) enter(id); }
  });

  /* ---------- camera moves ---------- */
  let busy = false;
  function flyTo(pos, target, dur = 1.1, ease = 'power3.inOut') {
    return new Promise(res => {
      gsap.to(camera.position, { x: pos.x, y: pos.y, z: pos.z, duration: reduced ? 0 : dur, ease });
      gsap.to(controls.target, { x: target.x, y: target.y, z: target.z, duration: reduced ? 0 : dur, ease, onComplete: res });
    });
  }
  async function enter(id) {
    if (busy || !zones[id]) return; busy = true; controls.autoRotate = false;
    opts.sfx?.('whoosh');
    const z = zones[id], p = z.pos.clone();
    const dir = p.clone().setY(0); if (dir.lengthSq() < 0.01) dir.set(0, 0, 1); dir.normalize();
    const camPos = p.clone().add(dir.multiplyScalar(id === 'boss' ? 9 : 7.5)).add(new THREE.Vector3(0, id === 'boss' ? 6.5 : 5, 0));
    const look = p.clone().add(new THREE.Vector3(0, id === 'boss' ? 3 : 1.4, 0));
    const lab = labels[id]?.getBoundingClientRect();
    await flyTo(camPos, look, 0.95);
    busy = false;
    opts.onEnter?.(id, lab ? { x: lab.left + lab.width / 2, y: lab.top + lab.height / 2 } : null);
  }
  function home(dur = 1.2) { controls.autoRotate = !reduced; return flyTo(HOME.pos, HOME.target, dur); }
  async function intro() {
    camera.position.set(0, 58, 70); controls.target.set(0, -6, 0); controls.update();
    await flyTo(HOME.pos, HOME.target, reduced ? 0 : 3.2, 'power2.out');
  }

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  let running = false, raf = 0, last = 0;
  const v = new THREE.Vector3();
  const pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', e => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
  let blinkT = 2;
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
    controls.update();
    // ambient life
    for (const a of anim) {
      if (a.bob) { a.o.position.y = a.y + Math.sin(t * 0.8 + a.ph) * a.bob; a.o.rotation.y += a.spin * dt; }
      if (a.orbit) { const o = a.orbit; o.a += o.speed * dt; a.o.position.set(Math.cos(o.a) * o.d, o.y + Math.sin(t * .5 + o.d) * .3, Math.sin(o.a) * o.d); }
      if (a.flock) { const ang = t * 0.18; a.o.position.set(Math.cos(ang) * 13, 6 + Math.sin(t * 0.7) * 0.8, Math.sin(ang) * 13); a.o.rotation.y = -ang; a.o.children.forEach((b, i) => { b.scale.y = 1 + Math.sin(t * 9 + i) * 0.6; }); }
    }
    const Z = zones;
    if (Z.shape?.spin) Z.shape.spin.rotation.y = t * 1.2;
    if (Z.space?.rocket) Z.space.rocket.position.y = 0.3 + Math.max(0, Math.sin(t * 0.6)) * 0.15;
    if (Z.space?.dish) Z.space.dish.rotation.y = Math.sin(t * 0.5) * 0.8;
    if (Z.color?.rainbow) Z.color.rainbow.rotation.y = Math.sin(t * 0.4) * 0.25;
    if (Z.type?.sign) { Z.type.sign.rotation.y = Math.sin(t * 0.9) * 0.35; Z.type.sign.position.y = 2.35 + Math.sin(t * 1.6) * 0.06; }
    if (Z.express?.cubes) Z.express.cubes.forEach((c, i) => { c.rotation.y = t * (0.4 + i * 0.2); });
    if (Z.gestalt?.ring) { Z.gestalt.ring.rotation.z = t * 0.5; Z.gestalt.ring.position.y = 3.0 + Math.sin(t * 1.3) * 0.12; }
    if (Z.gestalt?.screens) Z.gestalt.screens.forEach((s, i) => s.material.color.setHSL(((t * 0.08 + i * 0.3) % 1), 0.85, 0.6));
    if (Z.boss?.flag) Z.boss.flag.rotation.y = Math.sin(t * 3) * 0.35;
    if (Z.boss?.eyes) Z.boss.eyes.forEach(e => { e.scale.setScalar(1 + Math.sin(t * 4) * 0.12); });
    // Mokho: breathe, blink, follow the pointer
    const M = Z.mind?.mokho;
    if (M) {
      M.body.scale.set(1 + Math.sin(t * 2) * 0.015, 1 - Math.sin(t * 2) * 0.02, 1 + Math.sin(t * 2) * 0.015);
      const camDir = Math.atan2(camera.position.x, camera.position.z);
      M.g.rotation.y += (camDir * 0.85 - M.g.rotation.y) * 0.06;
      M.eyes.forEach(({ p, gl }) => { p.position.x += (pointer.x * 0.09 - p.position.x) * 0.15; p.position.y += (-pointer.y * 0.08 - p.position.y) * 0.15; });
      blinkT -= dt; const bl = blinkT < 0.12 && blinkT > 0 ? 0.12 : 1; if (blinkT < 0) blinkT = 2 + Math.random() * 3;
      M.eyes.forEach(({ e }) => { e.scale.y = bl; });
    }
    renderer.render(scene, camera);
    // labels
    const w = host.clientWidth, h = host.clientHeight;
    for (const id in labels) {
      v.copy(anchor(id)).project(camera);
      const el = labels[id]; const vis = v.z < 1 && Math.abs(v.x) < 1.15 && Math.abs(v.y) < 1.15;
      el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -100%)`;
      el.style.opacity = vis ? '' : '0';
      // depth: nearer labels on top
      el.style.zIndex = String(1000 - Math.round(v.z * 1000));
    }
  }
  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w < 700 ? 44 : 34; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host); resize();
  function start() { if (running) return; running = true; clock.getDelta(); frame(); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (host.isConnected && !host.hidden && host.dataset.paused !== '1') start(); });
  function setStars(map) { for (const id in map) { const el = layer.querySelector(`[data-stars="${id}"]`); if (el) el.textContent = map[id] ? '★'.repeat(map[id]) + '☆'.repeat(3 - map[id]) : ''; } }
  return { start, stop, enter, home, intro, setStars, renderer, camera, zones, labels };
}
