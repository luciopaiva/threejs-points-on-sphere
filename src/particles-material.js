
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
                    vec3 vNormal = normalize( normalMatrix * normal );
                    vec3 vDir = vec3(0, 0, 1);
                    vVisible = step( 0., dot( vDir, vNormal ) );
                    
                    gl_PointSize = size;
            `);
        console.info("-".repeat(80));
        console.log(shader.fragmentShader);
        shader.fragmentShader = `
                varying float vVisible;
            ` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <clipping_planes_fragment>`,
            `
                if ( floor(vVisible + 0.1) == 0.0 ) discard;
                #include <clipping_planes_fragment>
            `);
        console.log(shader.fragmentShader);
    }
}
