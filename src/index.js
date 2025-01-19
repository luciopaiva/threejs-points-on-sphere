
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane';
import ParticlesGeometry from "./particles-geometry.js";

const pane = new Pane();

const params = {
    particleSize: 0.02,
    numParticles: 500,
    color: '#ebff34',
};

const particleSizeBinding = pane.addBinding(params, 'particleSize', { min: 0, max: 0.1, step: 0.01 });
particleSizeBinding.on("change", (event) => { particlesMaterial.size = event.value; });
const numParticlesBinding = pane.addBinding(params, 'numParticles', { min: 0, max: 5000, step: 1 });
pane.addBinding(params, 'color').on("change", (event) => { particlesMaterial.color.set(event.value); });

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

const particlesGeometry = new ParticlesGeometry(params.numParticles);

numParticlesBinding.on("change", (event) => { if (event.last) { particlesGeometry.recreate(event.value); } });

const particlesMaterial = new THREE.PointsMaterial({
    size: params.particleSize,
    sizeAttenuation: true,
    color: params.color,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

(function tick() {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
})();
