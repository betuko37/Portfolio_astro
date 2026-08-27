import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const PHI = Math.PI * (3 - Math.sqrt(5));

function fibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = PHI * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return points;
}

function readAccent() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  return new THREE.Color(value || '#7c3aed');
}

export function initHeroScene() {
  const root = document.querySelector<HTMLElement>('[data-hero-stage]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!root || !canvas || canvas.dataset.ready === '1') return;
  if (!window.WebGLRenderingContext) return;

  canvas.dataset.ready = '1';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.z = 6.4;

  const group = new THREE.Group();
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffffff, 0.28));
  const key = new THREE.PointLight(0x7c3aed, 48, 18);
  key.position.set(2.4, 1.8, 3.2);
  scene.add(key);
  const rim = new THREE.PointLight(0xc4b5fd, 18, 14);
  rim.position.set(-2.8, -1.4, 2.4);
  scene.add(rim);

  const coreGeo = new THREE.IcosahedronGeometry(1.18, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    roughness: 0.18,
    metalness: 0.62,
    emissive: 0x3b0764,
    emissiveIntensity: 0.55,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(coreGeo),
    new THREE.LineBasicMaterial({ color: 0xddd6fe, transparent: true, opacity: 0.42 }),
  );
  wire.scale.setScalar(1.015);
  group.add(wire);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(1.42, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  group.add(glow);

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xede9fe, transparent: true, opacity: 0.85 }),
  );
  group.add(nucleus);

  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xa78bfa,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0x5b21b6,
    emissiveIntensity: 0.35,
  });
  const rings = [
    { mesh: new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.016, 12, 140), ringMat), spin: [0.004, 0, 0.002] },
    { mesh: new THREE.Mesh(new THREE.TorusGeometry(2.22, 0.014, 12, 140), ringMat), spin: [0.002, 0.003, 0] },
    { mesh: new THREE.Mesh(new THREE.TorusGeometry(2.58, 0.012, 12, 140), ringMat), spin: [0, 0.0024, 0.003] },
  ];
  rings[0].mesh.rotation.set(1.2, 0.15, 0.2);
  rings[1].mesh.rotation.set(0.55, 1.1, 0.4);
  rings[2].mesh.rotation.set(2.1, 0.4, 1.15);
  rings.forEach(({ mesh }) => group.add(mesh));

  const satGeo = new THREE.IcosahedronGeometry(0.14, 0);
  const satMat = new THREE.MeshStandardMaterial({
    color: 0xc4b5fd,
    metalness: 0.7,
    roughness: 0.25,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.7,
  });
  const satellites = [0, 1, 2, 3].map((i) => {
    const mesh = new THREE.Mesh(satGeo, satMat);
    group.add(mesh);
    return { mesh, angle: (Math.PI * 2 * i) / 4, radius: 2.05 + i * 0.16, speed: 0.35 + i * 0.08 };
  });

  const starPoints = fibonacciSphere(56, 2.85);
  const linePos: number[] = [];
  for (let i = 0; i < starPoints.length; i++) {
    for (let j = i + 1; j < starPoints.length; j++) {
      if (starPoints[i].distanceTo(starPoints[j]) < 1.15) {
        linePos.push(starPoints[i].x, starPoints[i].y, starPoints[i].z, starPoints[j].x, starPoints[j].y, starPoints[j].z);
      }
    }
  }
  const constellation = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3)),
    new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.22 }),
  );
  group.add(constellation);

  const nodes = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(starPoints),
    new THREE.PointsMaterial({
      color: 0xede9fe,
      size: 0.045,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
    }),
  );
  group.add(nodes);

  const dustCount = 720;
  const dustPos = new Float32Array(dustCount * 3);
  const dustBase = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 2.9 + Math.random() * 1.6;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    dustPos[i * 3] = x;
    dustPos[i * 3 + 1] = y;
    dustPos[i * 3 + 2] = z;
    dustBase[i * 3] = x;
    dustBase[i * 3 + 1] = y;
    dustBase[i * 3 + 2] = z;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: 0.028,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
    }),
  );
  group.add(dust);

  const pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const applyTheme = () => {
    const accent = readAccent();
    coreMat.color.copy(accent);
    key.color.copy(accent);
    (glow.material as THREE.MeshBasicMaterial).color.copy(accent);
    (dust.material as THREE.PointsMaterial).color.copy(accent);
  };
  applyTheme();
  const themeObs = new MutationObserver(applyTheme);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const resize = () => {
    const w = root.clientWidth;
    const h = root.clientHeight;
    if (w < 2 || h < 2) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(root);
  resize();

  let visible = true;
  let running = false;
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    },
    { threshold: 0.05 },
  );
  io.observe(root);

  const clock = new THREE.Clock();
  let raf = 0;
  const mouse3 = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const push = new THREE.Vector3();

  const start = () => {
    if (!running) tick();
  };

  const tick = () => {
    if (!visible) {
      running = false;
      return;
    }
    running = true;
    const t = clock.getElapsedTime();

    if (!reduce) {
      group.rotation.y += (pointer.x * 0.7 + t * 0.08 - group.rotation.y) * 0.045;
      group.rotation.x += (pointer.y * 0.38 - group.rotation.x) * 0.045;
      core.rotation.y = t * 0.32;
      core.rotation.x = t * 0.14;
      wire.rotation.copy(core.rotation);
      nucleus.scale.setScalar(1 + Math.sin(t * 2.4) * 0.08);
      glow.scale.setScalar(1 + Math.sin(t * 1.6) * 0.04);

      rings.forEach(({ mesh, spin }) => {
        mesh.rotation.x += spin[0];
        mesh.rotation.y += spin[1];
        mesh.rotation.z += spin[2];
      });

      satellites.forEach((sat) => {
        const a = sat.angle + t * sat.speed;
        sat.mesh.position.set(Math.cos(a) * sat.radius, Math.sin(a * 1.15) * 0.55, Math.sin(a) * sat.radius);
        sat.mesh.rotation.y = a;
      });

      key.position.x = 2.2 + pointer.x * 1.8;
      key.position.y = 1.6 + pointer.y * 1.4;

      mouse3.set(pointer.x * 3.2, pointer.y * 2.4, 1.1);
      const pos = dustGeo.getAttribute('position');
      for (let i = 0; i < dustCount; i++) {
        tmp.set(dustBase[i * 3], dustBase[i * 3 + 1], dustBase[i * 3 + 2]);
        const dist = tmp.distanceTo(mouse3);
        if (dist < 1.35 && dist > 0.001) {
          push.copy(tmp).sub(mouse3).normalize();
          tmp.addScaledVector(push, (1.35 - dist) * 0.55);
        }
        pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
      }
      pos.needsUpdate = true;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  start();

  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObs.disconnect();
      window.removeEventListener('pointermove', onPointer);
      coreGeo.dispose();
      satGeo.dispose();
      dustGeo.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.dataset.ready = '0';
    },
    { once: true },
  );
}
