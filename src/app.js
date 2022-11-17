import * as THREE from 'three';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import BaseSketch from './base-sketch';

export default class Sketch extends BaseSketch {
    constructor(selector) {
        super(selector, true);

        this.addObjects();
        this.animate();
    }

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                u_time: { value: 0 },
                u_resolution: { value: new THREE.Vector4() },
            },
            /* wireframe: true, */
            vertexShader: vertex,
            fragmentShader: fragment,
        });
        const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        const plane = new THREE.Mesh(geometry, this.material);
        this.scene.add(plane);
    }

    animate() {
        this.time += 0.05;

        this.material.uniforms.u_time.value = this.time;

        this.render();
        this.rafId = requestAnimationFrame(this.animate.bind(this));
    }
}

new Sketch('container');
