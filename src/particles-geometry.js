import * as THREE from "three";
import PRNG from "./prng.js";

export default class ParticlesGeometry extends THREE.BufferGeometry {

    #rand;
    #count = -1;
    #lat = 5;
    #lng = 0;
    #singlePatchMode = true;
    #numParallels = 10;
    #numMeridians = 20;

    constructor(count) {
        super();

        this.#rand = new PRNG(42);

        this.recreate(count);
    }

    setSinglePatchMode(singlePatchMode) {
        this.#singlePatchMode = singlePatchMode;
    }

    setLatLng(lat, lng) {
        this.#lat = lat;
        this.#lng = lng;
    }

    setNumParallels(numParallels) {
        this.#numParallels = numParallels;
    }

    setNumMeridians(numMeridians) {
        this.#numMeridians = numMeridians;
    }

    setCount(count) {
        this.#count = count;
    }

    recreate(count = this.#count) {
        this.#count = count;
        const positions = new Float32Array(this.#count * 3);
        this.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // reset every time so we get deterministic results
        this.#rand.reset();

        for (let i = 0; i < this.#count; i++) {
            this.#generatePoint(i);
        }

        this.attributes.position.needsUpdate = true;
    }

    #generatePoint(index) {
        const arrayIndex = index * 3;

        let phi, theta;
        if (this.#singlePatchMode) {
            phi = Math.acos(this.#rand.next() * 2 / this.#numParallels + 2 * this.#lat / this.#numParallels - 1);
            theta = (this.#rand.next() + this.#lng) * 2 * Math.PI / this.#numMeridians;
        } else {
            phi = Math.acos(this.#rand.next() * 2 - 1);
            theta = this.#rand.next() * Math.PI * 2;
        }

        // convert to parametric equation
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        this.attributes.position.array[arrayIndex] = x;
        this.attributes.position.array[arrayIndex + 1] = y;
        this.attributes.position.array[arrayIndex + 2] = z;
    }
}
