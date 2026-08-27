import * as THREE from 'three';

function readAccent() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  return new THREE.Color(value || '#7c3aed');
}

function scatter(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.72 + Math.random() * 0.28);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function makeLayer(count: number, radius: number, size: number, color: THREE.Color, opacity: number) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(scatter(count, radius), 3));
  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return { points: new THREE.Points(geometry, material), geometry, material };
}

export function initStarfield() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-starfield]');
  if (!canvas || canvas.dataset.ready === '1' || !window.WebGLRenderingContext) return;
  canvas.dataset.ready = '1';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  camera.position.z = 16;

  const group = new THREE.Group();
  scene.add(group);

  const accent = readAccent();
  const far = makeLayer(320, 52, 0.016, new THREE.Color(0xe9e4ff), 0.32);
  const mid = makeLayer(140, 40, 0.02, accent.clone().lerp(new THREE.Color(0xffffff), 0.35), 0.38);
  group.add(far.points, mid.points);

  const pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const applyTheme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    mid.material.color.copy(readAccent().lerp(new THREE.Color(0xffffff), 0.35));
    far.material.opacity = dark ? 0.32 : 0;
    mid.material.opacity = dark ? 0.38 : 0;
  };
  applyTheme();
  const themeObs = new MutationObserver(applyTheme);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const clock = new THREE.Clock();
  let raf = 0;

  const tick = () => {
    const t = clock.getElapsedTime();

    if (!reduce) {
      group.rotation.y += (pointer.x * 0.12 + t * 0.006 - group.rotation.y) * 0.02;
      group.rotation.x += (pointer.y * 0.07 - group.rotation.x) * 0.02;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  tick();

  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      far.geometry.dispose();
      mid.geometry.dispose();
      far.material.dispose();
      mid.material.dispose();
      renderer.dispose();
      canvas.dataset.ready = '0';
    },
    { once: true },
  );
}
