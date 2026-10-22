// The particle world: one GPU point cloud that morphs between formations, reacts to the cursor,
// can be an eye that watches you, explodes on command, and slides aside when a lesson opens.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';
import * as FM from './formations.js';
import { sceneBuilders, sqScene } from './scenes.js';

export function canWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

const VERT = /* glsl */`
uniform float uTime, uMix, uSize, uDPR, uScatter, uSwirl, uEyeA, uEyeB, uBlink, uRepel, uRepelR, uOpacity, uDim;
uniform vec2 uLook;
uniform vec3 uMouse;
attribute vec3 aA, aB, aCA, aCB;
attribute vec4 aR, aPA, aPB;
attribute vec2 aG;
varying vec3 vC;
varying float vA;
mat3 rotY(float a){ float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
float lidH(float x, float up){ float t = max(0., 1. - (x / 3.25) * (x / 3.25)); return up > .5 ? 1.55 * pow(t, .8) : 1.22 * pow(t, .9); }
vec3 flow(vec3 p, float t){
  return vec3(sin(p.y * 1.7 + t * .9) + sin(p.z * 1.3 - t * .7), sin(p.z * 1.5 + t * .8) + sin(p.x * 1.1 + t * .6), sin(p.x * 1.9 - t * .5) + sin(p.y * 1.2 + t * .7)) * .5;
}
vec3 eyeOp(vec3 p, float g, float w, inout float vis){
  if (w <= 0.) return p;
  if (g == 1.) p.xy += uLook * w;
  if (g == 3.) p.xy += uLook * .85 * w;
  if (g > .5 && g < 3.5) {
    p.y *= mix(1., .04, uBlink * w);
    if (g == 1. || g == 3.) {
      float lim = lidH(p.x, step(0., p.y)) * (1. - uBlink * .96);
      vis *= mix(1., smoothstep(lim + .02, lim - .06, abs(p.y)), w);
    }
  }
  return p;
}
void main(){
  float m = clamp((uMix - aR.z * .45) / .55, 0., 1.);
  m = m * m * (3. - 2. * m);
  vec3 pa = aA; if (aPA.w != 0.) pa = aPA.xyz + rotY(uTime * aPA.w) * (aA - aPA.xyz);
  vec3 pb = aB; if (aPB.w != 0.) pb = aPB.xyz + rotY(uTime * aPB.w) * (aB - aPB.xyz);
  float visA = 1., visB = 1.;
  pa = eyeOp(pa, aG.x, uEyeA, visA);
  pb = eyeOp(pb, aG.y, uEyeB, visB);
  float fate = sin(uTime * 1.6) * .55;
  if (aG.x == 5.) pa.y += fate;
  if (aG.y == 5.) pb.y += fate;
  vec3 p = mix(pa, pb, m);
  float vis = mix(visA, visB, m);
  float g = m < .5 ? aG.x : aG.y;
  float t = sin(m * 3.14159);
  p += flow(p * .55, uTime * .5 + aR.y * 6.) * (uSwirl * t + .035 + (g == 4. ? .25 : 0.));
  vec3 dir = normalize(vec3(fract(aR.y * 13.7) - .5, fract(aR.x * 7.3) - .5, fract(aR.w * 5.1) - .5) + 1e-4);
  p += dir * uScatter * (1.2 + aR.w * 5.5);
  vec4 wp = modelMatrix * vec4(p, 1.);
  vec2 d2 = wp.xy - uMouse.xy; float dl = length(d2);
  wp.xy += d2 / max(dl, 1e-3) * uRepel * smoothstep(uRepelR, 0., dl) * (g == 4. ? .2 : 1.);
  vec4 mv = viewMatrix * wp;
  gl_Position = projectionMatrix * mv;
  float size = uSize * (.5 + aR.x * .95);
  if (g == 3.) size *= 1.25;
  if (g == 4.) size *= .8;
  gl_PointSize = min(size * uDPR * (11. / max(.5, -mv.z)), 22. * uDPR);
  vC = mix(aCA, aCB, m);
  vA = vis * uOpacity * (g == 4. ? uDim : 1.) * (.78 + .22 * sin(uTime * 1.3 + aR.y * 40.));
}`;
const FRAG = /* glsl */`
varying vec3 vC;
varying float vA;
void main(){
  vec2 c = gl_PointCoord - .5; float r = length(c);
  float a = smoothstep(.5, .08, r);
  if (a * vA < .004) discard;
  gl_FragColor = vec4(vC * (.85 + .7 * smoothstep(.22, 0., r)), a * vA);
}`;
const FINAL = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: .032 }, uVig: { value: 1.05 }, uCA: { value: .0016 }, uFlash: { value: 0 }, uFlashC: { value: new THREE.Color().setRGB(1, .23, .19, THREE.LinearSRGBColorSpace) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform float uTime, uGrain, uVig, uCA, uFlash; uniform vec3 uFlashC; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime * 7.) * 43758.5453); }
    void main(){
      vec2 d = vUv - .5; float l = length(d);
      vec3 col; col.r = texture2D(tDiffuse, vUv + d * uCA * l * 6.).r; col.g = texture2D(tDiffuse, vUv).g; col.b = texture2D(tDiffuse, vUv - d * uCA * l * 6.).b;
      col *= 1. - smoothstep(.35, 1.05, l) * uVig;
      col += (h(vUv * 900.) - .5) * uGrain;
      col = mix(col, uFlashC, uFlash * (.25 + .75 * smoothstep(.2, .9, l)));
      gl_FragColor = vec4(col, 1.);
    }`
};


export function createParticles(host, opts = {}) {
  const mobile = matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  const N = opts.N || (mobile ? FM.N_MOBILE : FM.N_DESKTOP);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(DPR);
  // everything here works in display values: no colour-space conversion anywhere, so #07070B stays #07070B
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(new THREE.Color().setRGB(7 / 255, 7 / 255, 11 / 255, THREE.LinearSRGBColorSpace), 1);
  renderer.domElement.className = 'world__canvas';
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 200);
  const CAM = { z: 12.5, x: 0, y: 0 };
  camera.position.set(0, 0, CAM.z);

  /* geometry */
  const geo = new THREE.BufferGeometry();
  const A = new Float32Array(N * 3), B = new Float32Array(N * 3), CA = new Float32Array(N * 3), CB = new Float32Array(N * 3);
  const PA = new Float32Array(N * 4), PB = new Float32Array(N * 4), G = new Float32Array(N * 2), R = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) { R[i * 4] = Math.random(); R[i * 4 + 1] = Math.random(); R[i * 4 + 2] = Math.random(); R[i * 4 + 3] = Math.random(); }
  const attr = (name, arr, size) => { const a = new THREE.BufferAttribute(arr, size); a.setUsage(THREE.DynamicDrawUsage); geo.setAttribute(name, a); return a; };
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const at = { aA: attr('aA', A, 3), aB: attr('aB', B, 3), aCA: attr('aCA', CA, 3), aCB: attr('aCB', CB, 3), aPA: attr('aPA', PA, 4), aPB: attr('aPB', PB, 4), aG: attr('aG', G, 2), aR: attr('aR', R, 4) };
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60);
  const U = {
    uTime: { value: 0 }, uMix: { value: 1 }, uSize: { value: mobile ? 2.3 : 2.0 }, uDPR: { value: DPR }, uScatter: { value: 0 }, uSwirl: { value: 1.3 },
    uEyeA: { value: 0 }, uEyeB: { value: 0 }, uBlink: { value: 0 }, uRepel: { value: 0 }, uRepelR: { value: 1.4 }, uOpacity: { value: 1 }, uDim: { value: 1 },
    uLook: { value: new THREE.Vector2() }, uMouse: { value: new THREE.Vector3(99, 99, 0) }
  };
  const mat = new THREE.ShaderMaterial({ uniforms: U, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false;
  const rig = new THREE.Group(); rig.add(points); scene.add(rig);
  /* the orbit the districts ride on (hub only) */
  const ringGeo = new THREE.BufferGeometry(); const RN = mobile ? 1400 : 2600; const rp = new Float32Array(RN * 3), rr = new Float32Array(RN);
  for (let i = 0; i < RN; i++) { const a = Math.random() * Math.PI * 2; const [x, y, z] = FM.ringPoint(a); rp[i * 3] = x + (Math.random() - .5) * .03; rp[i * 3 + 1] = y + (Math.random() - .5) * .03; rp[i * 3 + 2] = z; rr[i] = Math.random(); }
  ringGeo.setAttribute('position', new THREE.BufferAttribute(rp, 3)); ringGeo.setAttribute('aR', new THREE.BufferAttribute(rr, 1));
  const ringMat = new THREE.ShaderMaterial({
    uniforms: { uO: { value: 0 }, uDPR: { value: DPR }, uTime: U.uTime },
    vertexShader: 'uniform float uDPR, uTime; attribute float aR; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mv; gl_PointSize = (1.2 + aR) * uDPR * (11. / -mv.z); vA = (.35 + .65 * smoothstep(-5., 5., position.z)) * (.6 + .4 * sin(uTime * .8 + aR * 30.)); }',
    fragmentShader: 'uniform float uO; varying float vA; void main(){ float r = length(gl_PointCoord - .5); float a = smoothstep(.5, .1, r) * vA * uO; if (a < .004) discard; gl_FragColor = vec4(vec3(.36, .35, .44), a); }',
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Points(ringGeo, ringMat); ring.frustumCulled = false; rig.add(ring);
  const showRing = (on, dur = 1.2) => gsap.to(ringMat.uniforms.uO, { value: on ? 1 : 0, duration: dur, ease: 'power2.out' });

  /* post */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), mobile ? .5 : .7, .42, .3);
  composer.addPass(bloom);
  const fin = new ShaderPass(FINAL); composer.addPass(fin);

  /* formations */
  const cache = {};
  const builders = {
    eye: () => FM.eye(N), eyeBare: () => FM.eye(N, { seed: 4 }), solids: () => FM.solids(N), clearing: () => FM.clearing(N),
    colorSphere: () => FM.colorSphere(N), squares: () => FM.squares(N, 'Tension', 0), kanizsa: () => FM.kanizsa(N), monolith: () => FM.monolith(N), spiral: () => FM.spiral(N), nebula: () => FM.nebula(N),
    type: () => FM.text(N, 'Aa', { font: '600 300px "EB Garamond", Georgia, serif', width: 6.2, color: '#FFC21A', color2: '#FFF1C7', rtl: false, seed: 51 }),
    ...sceneBuilders(N),
    ...(opts.builders || {})
  };
  const get = name => typeof name === 'object' ? name : (cache[name] ||= (name.startsWith('sq:') ? sqScene(N, name) : builders[name] ? builders[name]() : (console.warn('unknown scene', name), FM.nebula(N))));
  let cur = null, curName = '';
  const isEye = f => f && f.isEye;
  function upload(F, slot) { // slot 'A' or 'B'
    const P = slot === 'A' ? A : B, C = slot === 'A' ? CA : CB, PV = slot === 'A' ? PA : PB;
    P.set(F.pos); C.set(F.col); PV.set(F.piv);
    for (let i = 0; i < N; i++) G[i * 2 + (slot === 'A' ? 0 : 1)] = F.grp[i];
    at['a' + slot].needsUpdate = at['aC' + slot].needsUpdate = at['aP' + slot].needsUpdate = at.aG.needsUpdate = true;
  }
  /** freeze the current on-screen mix into slot A so a new morph can start from here */
  function bake() {
    const mx = U.uMix.value; if (mx >= 1) { A.set(B); CA.set(CB); PA.set(PB); for (let i = 0; i < N; i++) G[i * 2] = G[i * 2 + 1]; U.uEyeA.value = U.uEyeB.value; }
    else if (mx > 0) {
      for (let i = 0; i < N; i++) {
        let m = Math.min(1, Math.max(0, (mx - R[i * 4 + 2] * .45) / .55)); m = m * m * (3 - 2 * m);
        for (let k = 0; k < 3; k++) { A[i * 3 + k] += (B[i * 3 + k] - A[i * 3 + k]) * m; CA[i * 3 + k] += (CB[i * 3 + k] - CA[i * 3 + k]) * m; }
        if (m > .5) { G[i * 2] = G[i * 2 + 1]; PA.set(PB.subarray(i * 4, i * 4 + 4), i * 4); }
      }
      U.uEyeA.value = mx > .5 ? U.uEyeB.value : U.uEyeA.value;
    }
    at.aA.needsUpdate = at.aCA.needsUpdate = at.aPA.needsUpdate = at.aG.needsUpdate = true;
  }
  let morphTween = null;
  function morph(name, o = {}) {
    const F = get(name); if (F === cur && !o.force) return Promise.resolve();
    morphTween?.kill(); bake(); upload(F, 'B'); cur = F; curName = typeof name === 'string' ? name : (o.name || 'custom');
    U.uEyeB.value = (curName === 'eye' || curName === 'eyeBare') ? 1 : 0;
    U.uSwirl.value = o.swirl ?? 1.3;
    U.uMix.value = 0;
    return new Promise(res => { morphTween = gsap.to(U.uMix, { value: 1, duration: reduced ? .01 : (o.dur ?? 2.4), ease: o.ease || 'power2.inOut', onComplete: res }); });
  }
  function set(name) { const F = get(name); upload(F, 'A'); upload(F, 'B'); cur = F; curName = name; U.uEyeA.value = U.uEyeB.value = (name === 'eye' || name === 'eyeBare') ? 1 : 0; U.uMix.value = 1; }
  function scatter(amount = 1, o = {}) {
    return new Promise(res => gsap.timeline({ onComplete: res }).to(U.uScatter, { value: amount, duration: o.out ?? .35, ease: 'power3.out' }).to(U.uScatter, { value: 0, duration: o.back ?? 1.4, ease: 'power3.inOut' }, o.hold ?? '+=0.05'));
  }
  function flash(color = '#FF3B30', amt = .35) { const n = parseInt(color.slice(1), 16); fin.uniforms.uFlashC.value.setRGB(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, THREE.LinearSRGBColorSpace); gsap.fromTo(fin.uniforms.uFlash, { value: amt }, { value: 0, duration: .7, ease: 'power2.out' }); }

  /* stage: where the formation sits on screen (x: 0..1 of the width), and its zoom */
  const stage = { cx: .5, cy: .5, z: CAM.z };
  function applyStage() {
    const w = host.clientWidth, h = host.clientHeight;
    camera.setViewOffset(w, h, (.5 - stage.cx) * w, (.5 - stage.cy) * h, w, h);
  }
  function setStage(s = {}, dur = 1.4) {
    gsap.to(stage, { cx: s.cx ?? .5, cy: s.cy ?? .5, z: s.z ?? CAM.z, duration: reduced ? 0 : dur, ease: 'power3.inOut', overwrite: true, onUpdate: applyStage });
  }

  /* pointer */
  const ndc = new THREE.Vector2(9, 9), mouse = new THREE.Vector3(99, 99, 0), mouseT = new THREE.Vector3(99, 99, 0), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let hasPointer = false, lastMove = 0;
  const onMove = e => { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); hasPointer = true; lastMove = performance.now(); };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onMove, { passive: true });
  document.addEventListener('pointerleave', () => { hasPointer = false; });

  /* loop */
  const clock = { last: performance.now(), t: 0, getDelta() { const n = performance.now(); const d = (n - this.last) / 1000; this.last = n; this.t += Math.min(d, .05); return d; }, get elapsedTime() { return this.t; } }; let raf = 0, running = false, blinkT = 2.5, wander = new THREE.Vector2(), wanderT = 0;
  const look = new THREE.Vector2(), tilt = { x: 0, y: 0 }; const perf = { n: 0, sum: 0 }; const HQ = location.search.includes('hq');
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(.05, clock.getDelta()); const t = clock.elapsedTime;
    U.uTime.value = t; fin.uniforms.uTime.value = t;
    // pointer → world on z=0
    const idle = performance.now() - lastMove > 2500;
    if (hasPointer && !idle) {
      ray.setFromCamera(ndc, camera); ray.ray.intersectPlane(plane, mouseT);
      tilt.x += ((-ndc.y * .1) - tilt.x) * .04; tilt.y += ((ndc.x * .22) - tilt.y) * .04;
    } else { mouseT.set(99, 99, 0); tilt.x *= .98; tilt.y *= .98; }
    mouse.lerp(mouseT, .14); U.uMouse.value.copy(mouse);
    U.uRepel.value += ((hasPointer && !idle ? .55 : 0) - U.uRepel.value) * .06;
    rig.rotation.x = tilt.x; rig.rotation.y = tilt.y;
    // the eye looks at you (or wanders)
    wanderT -= dt; if (wanderT < 0) { wanderT = 1.2 + Math.random() * 2.2; wander.set((Math.random() * 2 - 1) * .4, (Math.random() * 2 - 1) * .22); }
    const target = hasPointer && !idle ? new THREE.Vector2(THREE.MathUtils.clamp(mouseT.x * .14, -.46, .46), THREE.MathUtils.clamp(mouseT.y * .16, -.26, .26)) : wander;
    look.lerp(target, .08); U.uLook.value.copy(look);
    blinkT -= dt; if (blinkT < 0 && !reduced) { blinkT = 2.6 + Math.random() * 4; gsap.timeline().to(U.uBlink, { value: 1, duration: .09, ease: 'power2.in' }).to(U.uBlink, { value: 0, duration: .16, ease: 'power2.out' }); }
    camera.position.set(CAM.x + tilt.y * .6, CAM.y - tilt.x * .6, stage.z);
    camera.lookAt(0, 0, 0);
    opts.onFrame?.(t, dt);
    // adaptive quality: if the first ~2s run slow, drop bloom, then resolution
    if (perf.n < 150 && !HQ) { perf.n++; perf.sum += dt; if (perf.n === 150) { const fps = 150 / perf.sum; if (fps < 42 && bloom.enabled) { bloom.enabled = false; perf.n = 0; perf.sum = 0; } else if (fps < 34) { const d = Math.max(1, renderer.getPixelRatio() * .75); renderer.setPixelRatio(d); U.uDPR.value = d; resize(); } } }
    composer.render(dt);
  }
  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); composer.setSize(w, h); bloom.resolution.set(w / 2, h / 2);
    camera.aspect = w / h; const portrait = w / h < .9;
    camera.fov = portrait ? 52 : 35; camera.updateProjectionMatrix(); applyStage();
    rig.scale.setScalar(portrait ? Math.max(.5, Math.min(1, (w / h) * 1.32)) : 1);
    U.uSize.value = (mobile ? 2.3 : 2.0) * (portrait ? 1.1 : 1);
  }
  new ResizeObserver(resize).observe(host); resize();
  const start = () => { if (running) return; running = true; clock.getDelta(); frame(); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (opts.shouldRun?.() !== false) start(); });

  /* helpers for HTML overlays */
  const v = new THREE.Vector3();
  function project(p) { v.copy(p).applyMatrix4(rig.matrixWorld).project(camera); const w = host.clientWidth, h = host.clientHeight; return { x: (v.x * .5 + .5) * w, y: (-v.y * .5 + .5) * h, z: v.z, behind: v.z > 1 }; }

  return {
    N, mobile, reduced, renderer, scene, camera, rig, points, uniforms: U, bloom, composer, fin, ring,
    start, stop, resize, morph, set, scatter, flash, setStage, project, get, builders, showRing,
    get current() { return curName; }
  };
}
