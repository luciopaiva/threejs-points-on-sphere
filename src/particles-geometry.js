import * as THREE from "three";

export default class ParticlesGeometry extends THREE.BufferGeometry {

    #numPoints = -1;

    constructor(count) {
        super();

        this.recreate(count);
    }

    recreate(count) {
        if (count !== this.#numPoints) {
            this.#numPoints = count;
            const positions = new Float32Array(this.#numPoints * 3);
            this.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        }

        for (let i = 0; i < count * 3; i++) {
            this.attributes.position.array[i] = (Math.random() - 0.5) * 10;
        }

        this.attributes.position.needsUpdate = true;
    }

    setColor(color) {
        
    }
}
