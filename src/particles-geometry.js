import * as THREE from "three";
import PRNG from "./prng.js";

export default class ParticlesGeometry extends THREE.BufferGeometry {

    #rand;
    capacity = -1;

    constructor(count) {
        super();

        this.#rand = new PRNG(42);

        this.recreate(count);
    }

    recreate(count) {
        if (count === this.capacity) {
            return;
        }

        this.capacity = count;
        const positions = new Float32Array(this.capacity * 3);
        this.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // reset every time so we get deterministic results
        this.#rand.reset();

        for (let i = 0; i < count * 3; i += 3) {
            this.#spawnPoint(i);
        }

        this.attributes.position.needsUpdate = true;
    }

    #spawnPoint(index) {
        const phi = Math.acos(this.#rand.next() * 2 - 1);
        const theta = this.#rand.next() * Math.PI * 2;

        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        this.attributes.position.array[index] = x;
        this.attributes.position.array[index + 1] = y;
        this.attributes.position.array[index + 2] = z;
    }
}
