
import * as THREE from 'three';

export default class ParticlesMaterial extends THREE.PointsMaterial {

    constructor (particleSize, color) {
        super({
            size: particleSize,
            sizeAttenuation: true,
            color: color,
        });
    }

    onBeforeCompile(shader) {
        shader.vertexShader = `
                varying float vVisible;
            ` + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            `gl_PointSize = size;`,
            `
                    vec3 vNormal = normalMatrix * normal;
                    vVisible = step( 0., dot( -normalize(mvPosition.xyz), normalize(vNormal) ) );
                   
                    gl_PointSize = size;
            `);
        shader.fragmentShader = `
                varying float vVisible;
            ` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <clipping_planes_fragment>`,
            `
                if ( floor(vVisible + 0.1) == 0.0 ) discard;
                #include <clipping_planes_fragment>
            `);

    }
}
