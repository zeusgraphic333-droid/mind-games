// Cel-shaded toy kit: toon materials, ink outlines, and little geometry helpers.
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const INK = 0x1d1336;
let _ramp = null;
export function ramp() {
  if (_ramp) return _ramp;
  const t = new THREE.DataTexture(new Uint8Array([110, 110, 110, 255, 185, 185, 185, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true;
  return (_ramp = t);
}
const matCache = new Map();
export function toon(color, o = {}) {
  const key = color + JSON.stringify(o);
  if (matCache.has(key)) return matCache.get(key);
  const m = new THREE.MeshToonMaterial({ color, gradientMap: ramp(), ...o });
  matCache.set(key, m);
  return m;
}
const outlineMats = new Map();
export function outlineMat(th = 0.05, color = INK) {
  const key = th + ':' + color;
  if (outlineMats.has(key)) return outlineMats.get(key);
  const m = new THREE.ShaderMaterial({
    uniforms: { th: { value: th }, col: { value: new THREE.Color(color).convertSRGBToLinear() } },
    vertexShader: 'uniform float th;\nvoid main(){\n  vec3 p = position + normalize(normal) * th;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);\n}',
    fragmentShader: 'uniform vec3 col;\nvoid main(){\n  gl_FragColor = vec4(col, 1.0);\n  #include <colorspace_fragment>\n}',
    side: THREE.BackSide
  });
  outlineMats.set(key, m);
  return m;
}
const smoothCache = new WeakMap();
function smoothNormals(geo) {
  if (smoothCache.has(geo)) return smoothCache.get(geo);
  let g = geo.clone();
  for (const k of Object.keys(g.attributes)) if (k !== 'position') g.deleteAttribute(k);
  g = mergeVertices(g, 1e-3);
  g.computeVertexNormals();
  smoothCache.set(geo, g);
  return g;
}
/** a toon mesh with an ink outline child */
export function part(geo, color, o = {}) {
  const mesh = new THREE.Mesh(geo, o.mat || toon(color, o.flat ? { flatShading: true } : {}));
  mesh.castShadow = o.cast !== false; mesh.receiveShadow = o.receive !== false;
  if (o.outline !== false) {
    const ol = new THREE.Mesh(smoothNormals(geo), outlineMat(o.th ?? 0.05));
    ol.raycast = () => {};
    mesh.add(ol);
  }
  if (o.pos) mesh.position.set(...o.pos);
  if (o.rot) mesh.rotation.set(...o.rot);
  if (o.scale) typeof o.scale === 'number' ? mesh.scale.setScalar(o.scale) : mesh.scale.set(...o.scale);
  return mesh;
}
export function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }

/* geometry helpers */
export function starShape(R = 1, r = 0.45, n = 5) {
  const s = new THREE.Shape();
  for (let i = 0; i < n * 2; i++) { const a = Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R; const x = Math.cos(a) * rr, y = Math.sin(a) * rr; i ? s.lineTo(x, y) : s.moveTo(x, y); }
  s.closePath(); return s;
}
export function letterAShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.5, 0); s.lineTo(-0.14, 1); s.lineTo(0.14, 1); s.lineTo(0.5, 0); s.lineTo(0.26, 0); s.lineTo(0.18, 0.25); s.lineTo(-0.18, 0.25); s.lineTo(-0.26, 0); s.closePath();
  const h = new THREE.Path(); h.moveTo(-0.1, 0.43); h.lineTo(0, 0.74); h.lineTo(0.1, 0.43); h.closePath(); s.holes.push(h);
  return s;
}
export function extrude(shape, depth = 0.3, bevel = 0.04) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 10 });
  g.center(); return g;
}
/** an organic flat outline, returned as a THREE.Shape in the XY plane */
export function blobShape(R, wob = [[3, .55, 0], [5, .35, 1], [7, .22, 2]], n = 96) {
  const s = new THREE.Shape();
  for (let i = 0; i <= n; i++) {
    const t = i / n * Math.PI * 2; let r = R;
    for (const [k, a, ph] of wob) r += a * Math.sin(k * t + ph);
    const x = Math.cos(t) * r, y = Math.sin(t) * r; i ? s.lineTo(x, y) : s.moveTo(x, y);
  }
  return s;
}
/** SVG string → CanvasTexture (async) */
export function svgTexture(svg, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const img = new Image();
  img.onload = () => { const x = c.getContext('2d'); x.clearRect(0, 0, size, size); x.drawImage(img, 0, 0, size, size); tex.needsUpdate = true; };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" `));
  return tex;
}
