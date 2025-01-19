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

        for (let i = 0; i < count * 3; i++) {
            this.attributes.position.array[i] = (this.#rand.next() - 0.5) * 10;
        }

        this.attributes.position.needsUpdate = true;
    }
}
