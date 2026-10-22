// Builds the island: terrain, districts, Mokho, decoration. Returns handles the world loop animates.
import * as THREE from 'three';
import { part, toon, rng, starShape, letterAShape, extrude, blobShape, outlineMat, INK } from './kit.js';
import { ZONES } from '../content/zones.js';

const R_ZONE = 6.7;
export function zonePos(z) {
  if (z.center) return new THREE.Vector3(0, 0, 0);
  if (z.satellite) return new THREE.Vector3(14.5, -1.2, -7.5);
  const a = THREE.MathUtils.degToRad(z.angle);
  return new THREE.Vector3(Math.sin(a) * R_ZONE, 0, Math.cos(a) * R_ZONE);
}

/* ---------------- terrain ---------------- */
function island(scene, anim) {
  const g = new THREE.Group();
  const top = blobShape(11.2);
  const grassGeo = new THREE.ExtrudeGeometry(top, { depth: 0.55, bevelEnabled: true, bevelSize: 0.35, bevelThickness: 0.25, bevelSegments: 3, curveSegments: 4, steps: 1 });
  grassGeo.rotateX(-Math.PI / 2); grassGeo.translate(0, -0.55, 0);
  g.add(part(grassGeo, '#7BDB72', { th: 0.07 }));
  const soilGeo = new THREE.ExtrudeGeometry(blobShape(10.9, [[3, .55, 0], [5, .35, 1], [7, .22, 2], [11, .12, 3]]), { depth: 1.5, bevelEnabled: false, curveSegments: 4 });
  soilGeo.rotateX(-Math.PI / 2); soilGeo.translate(0, -2.25, 0);
  g.add(part(soilGeo, '#B9824F', { th: 0.07 }));
  // the rocky underside: a lathe with jagged noise, flat shaded
  const pts = []; const r = rng(7);
  for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push(new THREE.Vector2(Math.max(0.05, 10.6 * Math.pow(1 - t, 1.35) + (r() - .5) * .6), -2.2 - t * 9.5)); }
  const rock = new THREE.LatheGeometry(pts, 22);
  const pos = rock.attributes.position; const rr = rng(11);
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); if (y < -2.4) { pos.setX(i, pos.getX(i) * (0.88 + rr() * 0.24)); pos.setZ(i, pos.getZ(i) * (0.88 + rr() * 0.24)); pos.setY(i, y + (rr() - .5) * .5); } }
  rock.computeVertexNormals();
  g.add(part(rock, '#9C6B45', { flat: true, th: 0.08 }));
  // a lighter rock band
  const band = new THREE.TorusGeometry(10.3, 0.35, 6, 40); band.rotateX(Math.PI / 2); band.translate(0, -2.35, 0);
  g.add(part(band, '#C99A6B', { flat: true, th: 0.05 }));
  // hanging vines
  const vr = rng(5);
  for (let i = 0; i < 16; i++) {
    const a = vr() * Math.PI * 2, len = 1.4 + vr() * 2.6;
    const v = new THREE.CylinderGeometry(0.07, 0.04, len, 5); v.translate(0, -len / 2, 0);
    const m = part(v, '#3FAE5A', { th: 0.03, cast: false });
    const rad = 10.6 + vr() * .3; m.position.set(Math.cos(a) * rad, -0.6, Math.sin(a) * rad); m.rotation.z = (vr() - .5) * .3;
    g.add(m);
    const leaf = part(new THREE.SphereGeometry(0.22, 6, 5), '#5ACB6B', { th: 0.03, cast: false }); leaf.position.set(0, -len, 0); m.add(leaf);
  }
  scene.add(g);
  // floating pebbles
  const pr = rng(19);
  for (let i = 0; i < 9; i++) {
    const a = pr() * Math.PI * 2, d = 12.5 + pr() * 5;
    const m = part(new THREE.IcosahedronGeometry(0.4 + pr() * .7, 0), pr() > .5 ? '#9C6B45' : '#B9824F', { flat: true, th: 0.05 });
    const grass = part(new THREE.CylinderGeometry(0.36, 0.4, 0.18, 7), '#7BDB72', { th: 0.04 }); grass.position.y = 0.35; m.add(grass);
    m.position.set(Math.cos(a) * d, -3 - pr() * 6, Math.sin(a) * d);
    scene.add(m); anim.push({ o: m, bob: 0.25 + pr() * .3, ph: pr() * 6, y: m.position.y, spin: (pr() - .5) * .3 });
  }
  return g;
}

function paths(scene) {
  const mat = toon('#F7DFA6');
  for (const z of ZONES) {
    if (z.center || z.satellite) continue;
    const p = zonePos(z); const len = p.length() - 1.4;
    const geo = new THREE.PlaneGeometry(1.25, len, 1, 1); geo.rotateX(-Math.PI / 2); geo.translate(0, 0.012, -len / 2 - 1.6);
    const m = new THREE.Mesh(geo, mat); m.receiveShadow = true;
    m.rotation.y = Math.atan2(p.x, p.z) + Math.PI;
    scene.add(m);
  }
  // a ring path around Mokho
  const ring = new THREE.RingGeometry(2.55, 3.25, 48); ring.rotateX(-Math.PI / 2); ring.translate(0, 0.014, 0);
  const rm = new THREE.Mesh(ring, mat); rm.receiveShadow = true; scene.add(rm);
}

/* ---------------- decoration ---------------- */
function tree(kind, r) {
  const g = new THREE.Group();
  const trunk = part(new THREE.CylinderGeometry(0.12, 0.16, 0.7, 6), '#8A5A3B', { th: 0.04 }); trunk.position.y = 0.35; g.add(trunk);
  if (kind === 'pine') {
    for (let k = 0; k < 3; k++) { const c = part(new THREE.ConeGeometry(0.75 - k * .18, 0.9, 7), k % 2 ? '#3FB868' : '#2FA45A', { th: 0.05 }); c.position.y = 0.95 + k * 0.45; g.add(c); }
  } else if (kind === 'round') {
    const c = part(new THREE.IcosahedronGeometry(0.7, 1), r() > .5 ? '#5FD36A' : '#4CC765', { th: 0.05, flat: true }); c.position.y = 1.25; g.add(c);
  } else { // candy tree
    const c = part(new THREE.SphereGeometry(0.62, 12, 10), ['#FF8FC0', '#FFC23C', '#9A5BFF'][Math.floor(r() * 3)], { th: 0.05 }); c.position.y = 1.2; g.add(c);
  }
  g.rotation.y = r() * 6.28; g.scale.setScalar(0.85 + r() * .45);
  return g;
}
function decor(scene, anim) {
  const r = rng(23);
  const spots = [];
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2, d = 3.6 + r() * 6.8;
    const p = new THREE.Vector3(Math.cos(a) * d, 0, Math.sin(a) * d);
    // keep clear of districts and of the paths
    const near = ZONES.some(z => !z.satellite && zonePos(z).distanceTo(p) < (z.center ? 3.3 : 2.6));
    const onPath = ZONES.some(z => { if (z.center || z.satellite) return false; const zp = zonePos(z).clone().setY(0).normalize(); const along = p.dot(zp); if (along < 0) return false; const perp = p.clone().sub(zp.multiplyScalar(along)).length(); return perp < 1.1; });
    if (near || onPath || spots.some(s => s.distanceTo(p) < 1.3)) continue;
    spots.push(p);
    const t = tree(r() < .45 ? 'pine' : r() < .75 ? 'round' : 'candy', r); t.position.copy(p); scene.add(t);
  }
  // flowers & mushrooms
  for (let i = 0; i < 40; i++) {
    const a = r() * Math.PI * 2, d = 3.4 + r() * 7.2; const p = new THREE.Vector3(Math.cos(a) * d, 0, Math.sin(a) * d);
    if (ZONES.some(z => !z.satellite && zonePos(z).distanceTo(p) < 2.2)) continue;
    const f = part(new THREE.SphereGeometry(0.12, 8, 6), ['#FFFFFF', '#FFD23F', '#FF8FC0', '#8FD3FF'][i % 4], { th: 0.025, cast: false }); f.position.set(p.x, 0.14, p.z); scene.add(f);
  }
}

function clouds(scene, anim) {
  const r = rng(31);
  const mat = toon('#FFFFFF');
  for (let i = 0; i < 11; i++) {
    const g = new THREE.Group(); const n = 3 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) { const s = part(new THREE.SphereGeometry(0.9 + r() * .7, 14, 10), '#FFFFFF', { mat, th: 0.06, cast: false, receive: false }); s.position.set((k - n / 2) * 1.1, r() * .4, (r() - .5) * .8); s.scale.y = 0.7; g.add(s); }
    const a = r() * Math.PI * 2, d = 15 + r() * 10, y = i % 3 === 0 ? -7 - r() * 4 : 3 + r() * 6;
    g.position.set(Math.cos(a) * d, y, Math.sin(a) * d); g.scale.setScalar(0.8 + r() * 0.9);
    scene.add(g); anim.push({ o: g, orbit: { a, d, y, speed: 0.012 + r() * 0.02 } });
  }
}

function birds(scene, anim) { // common fate: they fly as one group
  const flock = new THREE.Group();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-0.35, 0, 0.1, 0, 0, -0.1, 0.35, 0, 0.1, 0, 0.05, -0.1], 3));
  geo.setIndex([0, 1, 3, 3, 1, 2]); geo.computeVertexNormals();
  const m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.DoubleSide });
  const offs = [[0, 0, 0], [-0.8, 0.1, 0.7], [0.8, -0.1, 0.7], [-1.6, 0.2, 1.4], [1.6, 0, 1.4], [0, 0.25, 1.5], [-2.3, 0.1, 2.1]];
  offs.forEach(([x, y, z]) => { const b = new THREE.Mesh(geo, m); b.position.set(x, y, z); flock.add(b); });
  scene.add(flock); anim.push({ o: flock, flock: true });
}

/* ---------------- districts ---------------- */
const L = {};
L.shape = () => {
  const g = new THREE.Group();
  const dome = new THREE.Group();
  dome.add(part(new THREE.CylinderGeometry(0.9, 0.9, 0.9, 20), '#FFE7A8', { pos: [0, 0.45, 0] }));
  dome.add(part(new THREE.SphereGeometry(0.95, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#FFB35C', { pos: [0, 0.9, 0] }));
  dome.add(part(new THREE.BoxGeometry(0.34, 0.5, 0.1), '#8A5A3B', { pos: [0, 0.27, 0.88] }));
  dome.position.set(-1.25, 0, 0.35); g.add(dome);
  const cube = new THREE.Group();
  cube.add(part(new THREE.BoxGeometry(1.4, 1.4, 1.4), '#4F86FF', { pos: [0, 0.7, 0] }));
  cube.add(part(new THREE.BoxGeometry(0.36, 0.56, 0.1), '#FFE7A8', { pos: [0, 0.3, 0.71] }));
  cube.add(part(new THREE.BoxGeometry(0.34, 0.3, 0.06), '#BFE3FF', { pos: [0.4, 0.95, 0.71] }));
  cube.add(part(new THREE.BoxGeometry(0.34, 0.3, 0.06), '#BFE3FF', { pos: [-0.4, 0.95, 0.71] }));
  cube.position.set(1.15, 0, -0.2); g.add(cube);
  const pyr = part(new THREE.ConeGeometry(0.95, 1.7, 4), '#FF5757', { flat: true, pos: [0.15, 0.85, -1.45], rot: [0, Math.PI / 4, 0] });
  g.add(pyr);
  const star = part(extrude(starShape(0.7, 0.32), 0.22, 0.04), '#FFD23F', { pos: [0, 2.85, 0.3] });
  const pole = part(new THREE.CylinderGeometry(0.07, 0.07, 2.1, 6), '#FFFFFF', { pos: [0, 1.05, 0.3] });
  g.add(pole, star);
  return { g, spin: star };
};
L.space = () => {
  const g = new THREE.Group();
  g.add(part(new THREE.CylinderGeometry(1.3, 1.45, 0.3, 24), '#C9CEE6', { pos: [0, 0.15, 0] }));
  const rocket = new THREE.Group();
  rocket.add(part(new THREE.CylinderGeometry(0.48, 0.55, 2.0, 20), '#FFFFFF', { pos: [0, 1.0, 0] }));
  rocket.add(part(new THREE.ConeGeometry(0.48, 0.9, 20), '#4D5BFF', { pos: [0, 2.45, 0] }));
  rocket.add(part(new THREE.SphereGeometry(0.2, 14, 10), '#7FD3FF', { pos: [0, 1.45, 0.47], scale: [1, 1, 0.5] }));
  for (let k = 0; k < 3; k++) { const f = part(new THREE.BoxGeometry(0.08, 0.6, 0.5), '#FF5757', { pos: [Math.sin(k * 2.094) * 0.55, 0.35, Math.cos(k * 2.094) * 0.55] }); f.rotation.y = k * 2.094; rocket.add(f); }
  rocket.position.y = 0.3; g.add(rocket);
  const dish = new THREE.Group();
  dish.add(part(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 6), '#FFFFFF', { pos: [0, 0.45, 0] }));
  dish.add(part(new THREE.SphereGeometry(0.42, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.4), '#FFFFFF', { pos: [0, 1.0, 0], rot: [-0.9, 0, 0] }));
  dish.position.set(1.55, 0, 0.6); g.add(dish);
  return { g, rocket, dish };
};
L.color = () => {
  const g = new THREE.Group();
  const can = new THREE.Group();
  can.add(part(new THREE.CylinderGeometry(1.0, 0.9, 1.6, 24), '#FFFFFF', { pos: [0, 0.8, 0] }));
  can.add(part(new THREE.CylinderGeometry(0.98, 0.98, 0.12, 24), '#9A5BFF', { pos: [0, 1.62, 0] }));
  const drips = ['#FF5757', '#FFC23C', '#3ED6A0', '#2FA8FF'];
  drips.forEach((c, i) => { const a = i * 1.57 + .4; can.add(part(new THREE.CapsuleGeometry(0.14, 0.5, 4, 8), c, { pos: [Math.sin(a) * 0.98, 1.25, Math.cos(a) * 0.98], th: 0.035 })); });
  const handle = part(new THREE.TorusGeometry(0.95, 0.06, 6, 24, Math.PI), '#C9CEE6', { pos: [0, 1.65, 0], rot: [0, 0, 0] }); can.add(handle);
  g.add(can);
  // rainbow
  const cols = ['#FF5757', '#FF8A3D', '#FFD23F', '#3ED6A0', '#2FA8FF', '#9A5BFF'];
  const rb = new THREE.Group();
  cols.forEach((c, i) => rb.add(part(new THREE.TorusGeometry(2.2 - i * 0.18, 0.09, 6, 30, Math.PI), c, { th: 0.03, cast: false })));
  rb.position.set(0, 0.2, -0.6); g.add(rb);
  // a flask
  const flask = new THREE.Group();
  flask.add(part(new THREE.SphereGeometry(0.42, 16, 12), '#3ED6A0', { pos: [0, 0.42, 0] }));
  flask.add(part(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 10), '#E9F5FF', { pos: [0, 0.95, 0] }));
  flask.position.set(1.55, 0, 0.7); g.add(flask);
  return { g, rainbow: rb };
};
L.type = () => {
  const g = new THREE.Group();
  g.add(part(new THREE.BoxGeometry(2.6, 1.5, 1.6), '#E7F4FF', { pos: [0, 0.75, 0] }));
  g.add(part(new THREE.BoxGeometry(2.8, 0.18, 1.8), '#2FA8FF', { pos: [0, 1.58, 0] }));
  for (let k = 0; k < 3; k++) g.add(part(new THREE.BoxGeometry(0.55, 0.6, 0.06), '#BFE3FF', { pos: [-0.85 + k * 0.85, 0.85, 0.81] }));
  g.add(part(new THREE.BoxGeometry(0.5, 0.7, 0.06), '#0F6CB8', { pos: [0, 0.35, 0.82] }));
  const A = part(extrude(letterAShape(), 0.35, 0.04), '#FFD23F', { pos: [-0.45, 2.35, 0], scale: 1.4 });
  const a2 = part(new THREE.TorusGeometry(0.3, 0.12, 8, 18), '#FF5FA2', { pos: [0.65, 2.1, 0] });
  const stem = part(new THREE.BoxGeometry(0.14, 0.62, 0.24), '#FF5FA2', { pos: [0.95, 2.12, 0] });
  g.add(A, a2, stem);
  return { g, sign: A };
};
L.express = () => {
  const g = new THREE.Group();
  g.add(part(new THREE.BoxGeometry(2.2, 2.2, 2.2), '#1E1E2A', { pos: [0, 1.1, 0] }));
  // white frame on the front
  const fr = '#FFFFFF';
  g.add(part(new THREE.BoxGeometry(1.6, 0.12, 0.08), fr, { pos: [0, 1.85, 1.12] }), part(new THREE.BoxGeometry(1.6, 0.12, 0.08), fr, { pos: [0, 0.45, 1.12] }));
  g.add(part(new THREE.BoxGeometry(0.12, 1.5, 0.08), fr, { pos: [-0.74, 1.15, 1.12] }), part(new THREE.BoxGeometry(0.12, 1.5, 0.08), fr, { pos: [0.74, 1.15, 1.12] }));
  g.add(part(new THREE.BoxGeometry(0.42, 0.42, 0.06), '#FF4D9A', { pos: [0.1, 1.2, 1.16], rot: [0, 0, 0.4] }));
  const cubes = [];
  [[1.6, 0.3, 1.1, '#FFFFFF', .5], [1.75, 0.25, -0.4, '#1E1E2A', .4], [-1.55, 0.35, 0.8, '#FFFFFF', .6]].forEach(([x, y, z, c, s]) => { const m = part(new THREE.BoxGeometry(s, s, s), c, { pos: [x, y + s / 2, z] }); m.rotation.y = x; cubes.push(m); g.add(m); });
  return { g, cubes };
};
L.gestalt = () => {
  const g = new THREE.Group();
  const cab = (x, z, c, ry) => {
    const k = new THREE.Group();
    k.add(part(new THREE.BoxGeometry(0.9, 1.7, 0.8), c, { pos: [0, 0.85, 0] }));
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.45), new THREE.MeshBasicMaterial({ color: '#23E5DB' }));
    scr.position.set(0, 1.25, 0.41); k.add(scr);
    k.add(part(new THREE.BoxGeometry(0.9, 0.18, 0.5), '#1D1336', { pos: [0, 0.82, 0.55] }));
    k.position.set(x, 0, z); k.rotation.y = ry; return { k, scr };
  };
  const a = cab(-1.0, 0, '#FF3E8A', 0.3), b = cab(0.2, -0.6, '#7C5CFF', 0), c = cab(1.3, 0.1, '#FF3E8A', -0.3);
  g.add(a.k, b.k, c.k);
  // a closure ring of floating dots
  const ring = new THREE.Group(); const dm = toon('#FFFFFF');
  for (let i = 0; i < 16; i++) { if (i % 4 === 3) continue; const t = i / 16 * Math.PI * 2; const d = part(new THREE.SphereGeometry(0.13, 10, 8), '#FFFFFF', { mat: dm, th: 0.03, cast: false }); d.position.set(Math.cos(t) * 1.2, Math.sin(t) * 1.2, 0); ring.add(d); }
  ring.position.set(0.2, 3.0, -0.4); g.add(ring);
  return { g, screens: [a.scr, b.scr, c.scr], ring };
};
L.boss = () => {
  const g = new THREE.Group();
  g.add(part(new THREE.CylinderGeometry(1.15, 1.35, 4.2, 10), '#7E6E9E', { flat: true, pos: [0, 2.1, 0] }));
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; g.add(part(new THREE.BoxGeometry(0.42, 0.45, 0.42), '#7E6E9E', { flat: true, pos: [Math.cos(a) * 1.1, 4.4, Math.sin(a) * 1.1] })); }
  g.add(part(new THREE.ConeGeometry(1.0, 1.6, 10), '#FF4D4D', { flat: true, pos: [0, 5.45, 0] }));
  g.add(part(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 5), '#FFFFFF', { pos: [0, 6.6, 0] }));
  const flag = part(new THREE.PlaneGeometry(0.75, 0.42), '#FFD23F', { outline: false, pos: [0.38, 6.95, 0] }); flag.material = new THREE.MeshToonMaterial({ color: '#FFD23F', side: THREE.DoubleSide, gradientMap: flag.material.gradientMap }); g.add(flag);
  const eyes = [];
  [-0.32, 0.32].forEach(x => { const e = new THREE.Mesh(new THREE.CircleGeometry(0.17, 3), new THREE.MeshBasicMaterial({ color: '#FFE14A' })); e.position.set(x, 3.0, 1.31); e.rotation.z = x > 0 ? Math.PI : 0; g.add(e); eyes.push(e); });
  g.add(part(new THREE.BoxGeometry(0.7, 0.95, 0.1), '#3A2E52', { pos: [0, 0.48, 1.3] }));
  return { g, flag, eyes };
};
L.old = () => {
  const g = new THREE.Group();
  const top = new THREE.ExtrudeGeometry(blobShape(3.2, [[3, .3, 0], [5, .2, 1]]), { depth: 0.45, bevelEnabled: true, bevelSize: 0.2, bevelThickness: 0.15, bevelSegments: 2 });
  top.rotateX(-Math.PI / 2); top.translate(0, -0.45, 0); g.add(part(top, '#9AD67F', { th: 0.06 }));
  const under = new THREE.ConeGeometry(3.1, 4.5, 9, 2); under.rotateX(Math.PI); under.translate(0, -2.9, 0); g.add(part(under, '#9C6B45', { flat: true, th: 0.07 }));
  // a little temple: Lecture 01's "principles"
  g.add(part(new THREE.BoxGeometry(2.3, 0.22, 1.5), '#F2E6CF', { pos: [0, 0.11, 0] }));
  for (let k = 0; k < 4; k++) g.add(part(new THREE.CylinderGeometry(0.13, 0.15, 1.2, 10), '#FFFFFF', { pos: [-0.8 + k * 0.53, 0.82, 0.45] }));
  for (let k = 0; k < 4; k++) g.add(part(new THREE.CylinderGeometry(0.13, 0.15, 1.2, 10), '#FFFFFF', { pos: [-0.8 + k * 0.53, 0.82, -0.45] }));
  g.add(part(new THREE.BoxGeometry(2.3, 0.2, 1.5), '#F2E6CF', { pos: [0, 1.5, 0] }));
  const roofS = new THREE.Shape(); roofS.moveTo(-1.25, 0); roofS.lineTo(1.25, 0); roofS.lineTo(0, 0.6); roofS.closePath();
  const roof = extrude(roofS, 1.5, 0.03); roof.translate(0, 0, 0); g.add(part(roof, '#C99A6B', { pos: [0, 1.88, 0] }));
  return { g };
};

/* ---------------- Mokho ---------------- */
function mokho() {
  const g = new THREE.Group();
  const pink = '#FF8FC0';
  const lobes = [[0, 1.55, 0, 1.15], [-0.75, 1.35, 0.15, 0.85], [0.75, 1.35, 0.15, 0.85], [-0.5, 2.05, -0.2, 0.8], [0.5, 2.05, -0.2, 0.8], [0, 1.15, -0.55, 0.95], [-0.95, 1.85, -0.45, 0.62], [0.95, 1.85, -0.45, 0.62], [0, 2.35, 0.1, 0.62]];
  const body = new THREE.Group();
  lobes.forEach(([x, y, z, r]) => body.add(part(new THREE.SphereGeometry(r, 22, 16), pink, { pos: [x, y, z], th: 0.06 })));
  g.add(body);
  // pedestal
  g.add(part(new THREE.CylinderGeometry(1.75, 1.95, 0.45, 28), '#FFFFFF', { pos: [0, 0.22, 0] }));
  g.add(part(new THREE.CylinderGeometry(1.8, 1.8, 0.1, 28), '#FF7AB6', { pos: [0, 0.47, 0] }));
  // face
  const face = new THREE.Group(); face.position.set(0, 1.55, 1.08);
  const eyeW = new THREE.SphereGeometry(0.27, 18, 14), pup = new THREE.SphereGeometry(0.16, 14, 10), glint = new THREE.SphereGeometry(0.055, 8, 6);
  const eyes = [];
  [-0.36, 0.36].forEach(x => {
    const e = new THREE.Group(); e.position.set(x, 0.12, 0);
    e.add(part(eyeW, '#FFFFFF', { th: 0.035, cast: false }));
    const p = new THREE.Mesh(pup, new THREE.MeshBasicMaterial({ color: INK })); p.position.z = 0.17; e.add(p);
    const gl = new THREE.Mesh(glint, new THREE.MeshBasicMaterial({ color: '#FFFFFF' })); gl.position.set(0.06, 0.07, 0.31); e.add(gl);
    face.add(e); eyes.push({ e, p, gl });
  });
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 6, 16, Math.PI), new THREE.MeshBasicMaterial({ color: INK }));
  smile.rotation.z = Math.PI; smile.position.set(0, -0.2, 0.06); face.add(smile);
  [-0.62, 0.62].forEach(x => { const b = new THREE.Mesh(new THREE.CircleGeometry(0.13, 14), new THREE.MeshBasicMaterial({ color: '#FF5C9E', transparent: true, opacity: 0.55 })); b.position.set(x, -0.1, 0.02); face.add(b); });
  g.add(face);
  // little feet
  [-0.45, 0.45].forEach(x => g.add(part(new THREE.SphereGeometry(0.26, 12, 8), '#1D1336', { pos: [x, 0.55, 0.65], scale: [1, 0.6, 1.3], th: 0.02 })));
  return { g, body, face, eyes };
}

/* ---------------- assemble ---------------- */
export function buildWorld(scene) {
  const anim = [];
  island(scene, anim); paths(scene); decor(scene, anim); clouds(scene, anim); birds(scene, anim);
  const zones = {};
  for (const z of ZONES) {
    let built;
    if (z.center) { const m = mokho(); built = { g: m.g, mokho: m }; }
    else built = L[z.id]();
    const p = zonePos(z);
    built.g.position.copy(p);
    if (!z.center && !z.satellite) built.g.rotation.y = Math.atan2(p.x, p.z) + Math.PI; // face the centre… then turn to the camera side
    if (!z.center && !z.satellite) built.g.rotation.y += Math.PI;
    scene.add(built.g);
    // invisible hit volume
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(z.center ? 2.2 : 2.1, z.center ? 2.2 : 2.1, z.id === 'boss' ? 7 : 4, 12), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.copy(p).add(new THREE.Vector3(0, z.id === 'boss' ? 3.5 : 2, 0)); hit.userData.zone = z.id; scene.add(hit);
    // a soft round "plot" under each district
    if (!z.center && !z.satellite) { const plot = new THREE.Mesh(new THREE.CircleGeometry(2.3, 32), toon(z.id === 'express' ? '#E9E6F2' : '#A5E89A')); plot.rotation.x = -Math.PI / 2; plot.position.copy(p).setY(0.008); plot.receiveShadow = true; scene.add(plot); }
    zones[z.id] = { ...built, z, hit, pos: p };
  }
  // a rope bridge to Old Town
  const from = new THREE.Vector3(10.4, -0.2, -5.4), to = zones.old.pos.clone().add(new THREE.Vector3(-2.7, 0.15, 1.3));
  const planks = 12;
  for (let i = 0; i <= planks; i++) {
    const t = i / planks; const p = from.clone().lerp(to, t); p.y -= Math.sin(t * Math.PI) * 0.7;
    const pl = part(new THREE.BoxGeometry(0.5, 0.08, 1.0), '#B9824F', { th: 0.025 }); pl.position.copy(p); pl.lookAt(to.x, p.y, to.z); scene.add(pl);
  }
  return { anim, zones };
}
