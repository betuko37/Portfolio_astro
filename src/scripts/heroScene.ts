import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

function readAccent() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  return new THREE.Color(value || '#7c3aed');
}

function metal(color: number, extras: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.72,
    roughness: 0.28,
    ...extras,
  });
}

function buildRocket(accent: THREE.Color) {
  const rocket = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];

  const bodyMat = metal(0xe8e4f5, { metalness: 0.55, roughness: 0.32 });
  const accentMat = metal(accent.getHex(), {
    emissive: accent.clone().multiplyScalar(0.25),
    emissiveIntensity: 0.45,
  });
  const darkMat = metal(0x1a1626, { metalness: 0.8, roughness: 0.22 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x312e81,
    metalness: 0.2,
    roughness: 0.08,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.55,
  });

  const noseGeo = new THREE.ConeGeometry(0.42, 0.78, 28);
  geometries.push(noseGeo);
  const nose = new THREE.Mesh(noseGeo, accentMat);
  nose.position.y = 1.42;
  rocket.add(nose);

  const bodyGeo = new THREE.CylinderGeometry(0.42, 0.46, 1.55, 28);
  geometries.push(bodyGeo);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.28;
  rocket.add(body);

  const bandGeo = new THREE.CylinderGeometry(0.455, 0.455, 0.14, 28);
  geometries.push(bandGeo);
  const band = new THREE.Mesh(bandGeo, accentMat);
  band.position.y = 0.42;
  rocket.add(band);

  const windowRimGeo = new THREE.TorusGeometry(0.16, 0.03, 10, 24);
  geometries.push(windowRimGeo);
  const windowRim = new THREE.Mesh(windowRimGeo, darkMat);
  windowRim.position.set(0, 0.78, 0.4);
  windowRim.rotation.y = Math.PI / 2;
  rocket.add(windowRim);

  const windowGeo = new THREE.SphereGeometry(0.14, 16, 16);
  geometries.push(windowGeo);
  const window = new THREE.Mesh(windowGeo, glassMat);
  window.position.set(0, 0.78, 0.38);
  rocket.add(window);

  const finGeo = new THREE.BoxGeometry(0.08, 0.55, 0.42);
  geometries.push(finGeo);
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(finGeo, accentMat);
    const angle = (i / 3) * Math.PI * 2;
    fin.position.set(Math.sin(angle) * 0.48, -0.38, Math.cos(angle) * 0.48);
    fin.rotation.y = angle;
    fin.rotation.x = 0.18;
    rocket.add(fin);
  }

  const collarGeo = new THREE.CylinderGeometry(0.36, 0.3, 0.16, 20);
  geometries.push(collarGeo);
  const collar = new THREE.Mesh(collarGeo, darkMat);
  collar.position.y = -0.58;
  rocket.add(collar);

  const nozzleGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.28, 20);
  geometries.push(nozzleGeo);
  const nozzle = new THREE.Mesh(nozzleGeo, darkMat);
  nozzle.position.y = -0.78;
  rocket.add(nozzle);

  const flameOuter = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.9, 16, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  flameOuter.position.y = -1.28;
  flameOuter.rotation.x = Math.PI;
  rocket.add(flameOuter);
  geometries.push(flameOuter.geometry);

  const flameInner = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.62, 12, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xfde68a,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  flameInner.position.y = -1.16;
  flameInner.rotation.x = Math.PI;
  rocket.add(flameInner);
  geometries.push(flameInner.geometry);

  rocket.rotation.z = -0.38;
  rocket.rotation.x = 0.18;

  return { rocket, bodyMat, accentMat, flameOuter, flameInner, geometries };
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
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.set(0.15, 0.1, 5.6);

  const group = new THREE.Group();
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffffff, 0.32));
  const key = new THREE.PointLight(0x8b5cf6, 36, 16);
  key.position.set(2.2, 1.6, 3);
  scene.add(key);
  const rim = new THREE.PointLight(0xfde68a, 10, 10);
  rim.position.set(-0.4, -2.2, 1.4);
  scene.add(rim);

  const accent = readAccent();
  const { rocket, accentMat, flameOuter, flameInner, geometries } = buildRocket(accent);
  group.add(rocket);

  const pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const applyTheme = () => {
    const next = readAccent();
    accentMat.color.copy(next);
    accentMat.emissive.copy(next).multiplyScalar(0.25);
    key.color.copy(next);
    (flameOuter.material as THREE.MeshBasicMaterial).color.copy(next);
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
      group.rotation.y += (pointer.x * 0.35 - group.rotation.y) * 0.045;
      group.rotation.x += (pointer.y * 0.18 - group.rotation.x) * 0.045;
      rocket.position.y = Math.sin(t * 1.4) * 0.08;
      rocket.rotation.z = -0.38 + pointer.x * 0.08;
      const flicker = 1 + Math.sin(t * 18) * 0.12 + Math.sin(t * 31) * 0.06;
      flameOuter.scale.set(0.95 + Math.sin(t * 11) * 0.08, flicker, 0.95);
      flameInner.scale.set(0.9, 0.85 + Math.sin(t * 22) * 0.18, 0.9);
      key.position.x = 2 + pointer.x * 0.8;
      key.position.y = 1.4 + pointer.y * 0.5;
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
      geometries.forEach((geo) => geo.dispose());
      pmrem.dispose();
      renderer.dispose();
      canvas.dataset.ready = '0';
    },
    { once: true },
  );
}
