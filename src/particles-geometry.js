import * as THREE from "three";
import PRNG from "./prng.js";

export default class ParticlesGeometry extends THREE.BufferGeometry {

    #rand;
    #numPoints = -1;

    constructor(count) {
        super();

        this.recreate(count);
    }

    recreate(count) {
        // recreate the PRNG every time so we get deterministic results
        this.#rand = new PRNG(42);

        if (count !== this.#numPoints) {
            this.#numPoints = count;
            const positions = new Float32Array(this.#numPoints * 3);
            this.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        }

        for (let i = 0; i < count * 3; i++) {
            this.attributes.position.array[i] = (this.#rand.next() - 0.5) * 10;
        }

        this.attributes.position.needsUpdate = true;
    }
}
