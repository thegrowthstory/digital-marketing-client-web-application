// TheGrowthStory — Light Professional 3D Background
// Abstract cinematic 3D scene: no forced props, no monitor/camera.
// The visual language is built from soft glass frames, film-strip geometry and light.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

let scene, camera, renderer;
let particles, visualGroup, orbitGroup, light;
let mouseX = 0, mouseY = 0, scrollY = 0;
let targetX = 0, targetY = 0;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const palette = {
  bg: 0xf6f8fa,
  white: 0xffffff,
  ink: 0x18232d,
  blue: 0x7896b1,
  blueSoft: 0xb8cad9,
  silver: 0xdfe6ec
};

function standard(color, roughness = 0.48, metalness = 0.12, transparent = false, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color, roughness, metalness, transparent, opacity,
    side: THREE.DoubleSide
  });
}

function createParticles() {
  const count = 180;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1450;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 850;
    positions[i * 3 + 2] = -250 - Math.random() * 850;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: palette.blueSoft,
    size: 1.8,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    sizeAttenuation: true
  });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function frame(width, height, depth, material) {
  const g = new THREE.Group();
  const thickness = Math.max(1.4, Math.min(width, height) * 0.025);
  const top = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, depth), material);
  const bottom = top.clone();
  const left = new THREE.Mesh(new THREE.BoxGeometry(thickness, height, depth), material);
  const right = left.clone();
  top.position.y = height / 2;
  bottom.position.y = -height / 2;
  left.position.x = -width / 2;
  right.position.x = width / 2;
  g.add(top, bottom, left, right);
  return g;
}

function filmStrip(width = 150, height = 24) {
  const group = new THREE.Group();
  const stripMat = standard(palette.ink, 0.4, 0.28);
  const accentMat = standard(palette.blue, 0.38, 0.2);
  const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, 1.8), stripMat);
  group.add(base);

  const holeW = 5, holeH = 3.2;
  const count = 14;
  for (let i = 0; i < count; i++) {
    const x = -width / 2 + 9 + i * ((width - 18) / (count - 1));
    [-1, 1].forEach(row => {
      const hole = new THREE.Mesh(new THREE.BoxGeometry(holeW, holeH, 0.7), accentMat);
      hole.position.set(x, row * (height / 2 - 4.2), 1.1);
      group.add(hole);
    });
  }
  return group;
}

function createVisualSystem() {
  visualGroup = new THREE.Group();
  orbitGroup = new THREE.Group();
  visualGroup.add(orbitGroup);

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xdce7ef,
    roughness: 0.16,
    metalness: 0.12,
    transparent: true,
    opacity: 0.34,
    depthWrite: false
  });
  const dark = standard(palette.ink, 0.36, 0.3);
  const blue = standard(palette.blue, 0.4, 0.22);
  const soft = standard(palette.blueSoft, 0.42, 0.1);

  // A quiet stack of cinematic frames. They read as content, not as random 3D props.
  const main = frame(190, 116, 3, dark);
  main.position.set(92, 38, -205);
  main.rotation.set(-0.12, -0.24, 0.05);
  orbitGroup.add(main);

  const inner = frame(148, 88, 2.4, blue);
  inner.position.set(92, 38, -201);
  inner.rotation.set(-0.12, -0.24, 0.05);
  orbitGroup.add(inner);

  const glassPanel = new THREE.Mesh(new THREE.PlaneGeometry(142, 82), glass);
  glassPanel.position.set(92, 38, -199);
  glassPanel.rotation.set(-0.12, -0.24, 0.05);
  orbitGroup.add(glassPanel);

  // Film strip crosses the frame diagonally, giving the scene a production-studio identity.
  const strip = filmStrip(175, 22);
  strip.position.set(25, -68, -165);
  strip.rotation.set(0.08, -0.16, -0.34);
  orbitGroup.add(strip);

  const smallA = frame(72, 48, 2, soft);
  smallA.position.set(-160, 92, -250);
  smallA.rotation.set(0.18, 0.32, -0.18);
  orbitGroup.add(smallA);

  const smallB = frame(58, 38, 2, blue);
  smallB.position.set(-185, -70, -215);
  smallB.rotation.set(-0.2, 0.22, 0.22);
  orbitGroup.add(smallB);

  // A minimal aperture made from thin blades: abstract, elegant and recognisably cinematic.
  const aperture = new THREE.Group();
  const bladeMat = standard(palette.ink, 0.3, 0.35);
  for (let i = 0; i < 8; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(48, 4, 1.5), bladeMat);
    const a = (Math.PI * 2 * i) / 8;
    blade.rotation.z = a;
    blade.position.set(Math.cos(a) * 18, Math.sin(a) * 18, 0);
    aperture.add(blade);
  }
  const apertureCore = new THREE.Mesh(
    new THREE.CircleGeometry(17, 32),
    standard(palette.blue, 0.28, 0.25)
  );
  apertureCore.position.z = 1;
  aperture.add(apertureCore);
  aperture.position.set(-8, 8, -310);
  aperture.scale.setScalar(0.72);
  orbitGroup.add(aperture);

  // Subtle concentric rings behind the system create depth without stealing attention.
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(170 + i * 48, 0.65, 8, 100),
      new THREE.MeshBasicMaterial({
        color: palette.blueSoft,
        transparent: true,
        opacity: 0.075 - i * 0.015,
        depthWrite: false
      })
    );
    ring.position.set(20, -25, -500 - i * 25);
    ring.rotation.x = Math.PI * 0.48;
    visualGroup.add(ring);
  }

  scene.add(visualGroup);
}

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onScroll() {
  scrollY = window.scrollY || window.pageYOffset || 0;
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();

  // Mouse parallax is deliberately restrained.
  targetX += (mouseX * 16 - targetX) * 0.035;
  targetY += (mouseY * 10 - targetY) * 0.035;

  const scrollProgress = Math.min(scrollY / Math.max(window.innerHeight * 4.8, 1), 1);
  const scrollEase = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);

  camera.position.x += (targetX + scrollEase * 22 - camera.position.x) * 0.018;
  camera.position.y += (targetY - scrollEase * 8 - camera.position.y) * 0.018;
  camera.position.z += ((420 - scrollEase * 115) - camera.position.z) * 0.018;
  camera.lookAt(0, 0, -190 - scrollEase * 95);

  if (!reduceMotion) {
    // The entire composition subtly changes perspective as the visitor explores the page.
    orbitGroup.rotation.y += (0.00035 + scrollEase * 0.0009);
    orbitGroup.rotation.z = Math.sin(now * 0.00018) * 0.012 + scrollEase * 0.12;
    orbitGroup.position.x = Math.sin(now * 0.00022) * 5 + scrollEase * -55;
    orbitGroup.position.y = Math.cos(now * 0.0002) * 4 + scrollEase * 28;

    // The frame stack gently opens as the page moves downward.
    orbitGroup.scale.setScalar(1 + scrollEase * 0.14);

    if (particles) {
      particles.rotation.y += 0.00005;
      particles.rotation.x += 0.00002;
      particles.position.y = -scrollEase * 55;
    }

    if (light) {
      light.position.x = -240 + scrollEase * 360;
      light.position.y = 260 - scrollEase * 80;
    }
  }

  renderer.render(scene, camera);
}

function init3DScene() {
  try {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(palette.bg);
    scene.fog = new THREE.Fog(palette.bg, 520, 1500);

    camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 2200);
    camera.position.set(0, 0, 420);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = false;

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8e1e8, 1.8));

    light = new THREE.DirectionalLight(0xffffff, 1.9);
    light.position.set(-240, 260, 260);
    scene.add(light);

    const fill = new THREE.DirectionalLight(0xb7cde0, 1.15);
    fill.position.set(300, 80, 180);
    scene.add(fill);

    createParticles();
    createVisualSystem();

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    animate();
  } catch (error) {
    console.error('3D scene initialization failed:', error);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init3DScene);
else init3DScene();
