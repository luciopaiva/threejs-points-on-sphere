import {Pane} from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import * as THREE from "three";
import ParticlesGeometry from "./particles-geometry.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

export default class Demo {

    #settings;

    #particlesMaterial;
    #particlesGeometry;

    #controls;
    #renderer;
    #scene;
    #camera;
    #fpsGraph;

    #updateBind = this.update.bind(this);

    start() {
        this.#settings = {
            particleSize: 0.001,
            numParticles: 10000,
            color: '#d97e3f',
            singlePatchMode: true,
            numMeridians: 20,
            numParallels: 10,
            lng: 5,
            lat: 4,
        };

        this.createPane();
        const canvas = document.querySelector('canvas.webgl');

        this.#scene = new THREE.Scene();

        this.createParticles();

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

        this.update();
    }

    createParticles() {
        this.#particlesGeometry = new ParticlesGeometry(this.#settings.numParticles);
        this.#particlesGeometry.setNumParallels(this.#settings.numParallels);
        this.#particlesGeometry.setNumMeridians(this.#settings.numMeridians);
        this.#particlesGeometry.setLatLng(this.#settings.lat, this.#settings.lng);
        this.#particlesGeometry.setSinglePatchMode(this.#settings.singlePatchMode);
        this.#particlesGeometry.recreate();

        this.#particlesMaterial = new THREE.PointsMaterial({
            size: this.#settings.particleSize,
            sizeAttenuation: true,
            color: this.#settings.color,
        });

        const particles = new THREE.Points(this.#particlesGeometry, this.#particlesMaterial);
        this.#scene.add(particles);
    }

    createPane() {
        const pane = new Pane({
            title: "Settings",
            expanded: true,
        });
        pane.registerPlugin(EssentialsPlugin);

        this.#fpsGraph = pane.addBlade({ view: "fpsgraph", label: "FPS", rows: 2 });

        pane.addBinding(this.#settings, 'particleSize', { min: 0, max: 0.1, step: 0.01 })
            .on("change", (event) => { this.#particlesMaterial.size = event.value; });

        pane.addBinding(this.#settings, 'numParticles', { min: 0, max: 50000, step: 10 })
            .on("change", (event) => {
                this.#particlesGeometry.setCount(event.value);
                this.#particlesGeometry.recreate();
            });

        pane.addBinding(this.#settings, 'color').on("change", (event) => { this.#particlesMaterial.color.set(event.value); });

        const sphereSector = pane.addFolder({
            title: "Sphere sector",
        });

        sphereSector.addBinding(this.#settings, 'singlePatchMode')
            .on("change", (event) => {
                this.#particlesGeometry.setSinglePatchMode(event.value);
                this.#particlesGeometry.recreate();
            });

        sphereSector.addBinding(this.#settings, 'lng', { min: 0, max: this.#settings.numMeridians - 1, step: 1 })
            .on("change", (event) => {
                this.#particlesGeometry.setLatLng(this.#settings.lat, event.value);
                this.#particlesGeometry.recreate();
            });

        sphereSector.addBinding(this.#settings, 'lat', { min: 0, max: this.#settings.numParallels - 1, step: 1 })
            .on("change", (event) => {
                this.#particlesGeometry.setLatLng(event.value, this.#settings.lng);
                this.#particlesGeometry.recreate();
            });
    }

    update() {
        this.#fpsGraph.begin();

        this.#controls.update()
        this.#renderer.render(this.#scene, this.#camera)

        this.#fpsGraph.end();
        window.requestAnimationFrame(this.#updateBind);
    }
}
