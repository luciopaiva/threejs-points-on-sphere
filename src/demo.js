import {Pane} from "tweakpane";
import * as THREE from "three";
import ParticlesGeometry from "./particles-geometry.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

export default class Demo {

    #updateBind = this.update.bind(this);
    #clock;
    #controls;
    #renderer;
    #scene;
    #camera;

    start() {
        const pane = new Pane();

        const settings = {
            particleSize: 0.02,
            numParticles: 500,
            color: '#ebff34',
        };

        const particleSizeBinding = pane.addBinding(settings, 'particleSize', { min: 0, max: 0.1, step: 0.01 });
        particleSizeBinding.on("change", (event) => { particlesMaterial.size = event.value; });
        const numParticlesBinding = pane.addBinding(settings, 'numParticles', { min: 0, max: 5000, step: 1 });
        pane.addBinding(settings, 'color').on("change", (event) => { particlesMaterial.color.set(event.value); });

        const canvas = document.querySelector('canvas.webgl');

        this.#scene = new THREE.Scene();

        const particlesGeometry = new ParticlesGeometry(settings.numParticles);

        numParticlesBinding.on("change", (event) => { if (event.last) { particlesGeometry.recreate(event.value); } });

        const particlesMaterial = new THREE.PointsMaterial({
            size: settings.particleSize,
            sizeAttenuation: true,
            color: settings.color,
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.#scene.add(particles);

        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            // Update camera
            this.#camera.aspect = sizes.width / sizes.height
            this.#camera.updateProjectionMatrix()

            // Update renderer
            this.#renderer.setSize(sizes.width, sizes.height)
            this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        });

        this.#camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        this.#camera.position.z = 3;
        this.#scene.add(this.#camera);

        this.#controls = new OrbitControls(this.#camera, canvas);
        this.#controls.enableDamping = true;

        this.#renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        this.#renderer.setSize(sizes.width, sizes.height);
        this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.#clock = new THREE.Clock();

        this.update();
    }

    update() {
        const elapsedTime = this.#clock.getElapsedTime()

        // Update controls
        this.#controls.update()

        // Render
        this.#renderer.render(this.#scene, this.#camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(this.#updateBind);
    }
}
