import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

export default class BaseSketch {
  constructor(selector, withOrbitControls = true) {
    this.container = document.getElementById(selector);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);

    this.container.appendChild(this.renderer.domElement);

    this.addCamera();
    this.camera.position.set(0, 0, 2);
    this.camera.lookAt(0, 0, 0);

    if (withOrbitControls) {
      new OrbitControls(this.camera, this.renderer.domElement);
    }

    this.time = 0;

    this.setupResize();
    this.resize();
  }

  addCamera(isOrthographic = false) {
    this.isOrthographic = isOrthographic;
    const aspect = this.width / this.height;
    if (!isOrthographic) {
      this.camera = new THREE.PerspectiveCamera(
        70, //
        aspect,
        0.001,
        1000,
      );
      return;
    }
    this.frustumSize = 3;
    this.camera = new THREE.OrthographicCamera(
      (this.frustumSize * aspect) / -2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      0.3,
      2000,
    );
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  addGui() {
    this.gui = new dat.GUI();
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.gui) {
      this.gui.destroy();
    }
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    const aspect = this.width / this.height;
    this.camera.aspect = this.width / this.height;

    if (this.isOrthographic) {
      this.camera.left = (-aspect * this.frustumSize) / 2;
      this.camera.right = (aspect * this.frustumSize) / 2;
      this.camera.top = this.frustumSize / 2;
      this.camera.bottom = this.frustumSize / -2;
    }

    if (this.material && this.material.uniforms.uResolution) {
      this.material.uniforms.uResolution.value.x = this.width;
      this.material.uniforms.uResolution.value.y = this.height;
      this.material.uniforms.uResolution.value.z = this.width;
      this.material.uniforms.uResolution.value.w = this.height;
    }
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  drawText({ text, fontFamily = 'Roboto', horizontalPadding = 0.75 } = {}) {
    const texCanvas = document.createElement('canvas');
    const texCtx = texCanvas.getContext('2d');
    const idealCanvasSize = 2048;
    const maxTextureSize = Math.min(this.renderer.capabilities.maxTextureSize, idealCanvasSize);
    texCanvas.width = maxTextureSize;
    texCanvas.height = maxTextureSize;

    texCtx.fillStyle = '#bbb';
    texCtx.fillRect(0, 0, texCanvas.width, texCanvas.height);
    texCtx.fillStyle = '#000';
    texCtx.strokeStyle = '#fff';
    texCtx.lineWidth = 1;
    texCtx.textAlign = 'center';
    texCtx.textBaseline = 'middle';
    const referenceFontSize = 250;
    texCtx.font = `${referenceFontSize}px ${fontFamily}`;
    const textWidth = texCtx.measureText(text).width;
    const deltaWidth = (texCanvas.width * horizontalPadding) / textWidth;
    const fontSise = referenceFontSize * deltaWidth;
    texCtx.font = `${fontSise}px ${fontFamily}`;
    texCtx.fillText(text, texCanvas.width / 2, texCanvas.height / 2);

    return new THREE.CanvasTexture(texCanvas);
  }
}
