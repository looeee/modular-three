import * as THREE from 'three/src/Three.js';

// *****************************************************************************
//  CAMERA CLASS
//
//  Used by Scene class - each scene will have an associated camera class
//
//  The following spec is optional and can be omitted for the defaults shown
//  const cameraSpec = {
//    type: 'PerspectiveCamera', //Or 'OrthographicCamera'
//    near: 10,
//    far: -10,
//    position: new THREE.Vector3(0, 0, 100),
//    //PerspectiveCamera only
//    fov: 45, //PerspectiveCamera only
//    aspect: window.innerWidth / window.innerHeight,
//    // OrthographicCamera only
//    width: window.innerWidth,
//    height: window.innerHeight,
//  };
export class Camera {
  constructor(spec) {
    this.spec = spec || {};
    this.init();
  }

  init() {
    this.initParams();

    if (this.spec.type === 'PerspectiveCamera') {
      this.cam = new THREE.PerspectiveCamera();
    }
    else {
      this.cam = new THREE.OrthographicCamera();
    }
    this.set();
  }

  initParams() {
    const position = () => new THREE.Vector3();
    this.spec.position = this.spec.position || position;
    this.spec.near = this.spec.near || 10;
    this.spec.far = this.spec.far || -10;
    this.spec.type = this.spec.type || 'PerspectiveCamera';
    if (this.spec.type === 'PerspectiveCamera') {
      this.spec.fov = this.spec.fov || 45;
      const aspect = () => window.innerWidth / window.innerHeight;
      this.spec.aspect = this.spec.aspect || aspect;
    }
    else {
      const w = () => window.innerWidth;
      this.spec.width = this.spec.width || w;
      const h = () => window.innerHeight;
      this.spec.height = this.spec.height || h;
    }
  }

  set() {
    if (this.spec.type === 'PerspectiveCamera') {
      this.cam.fov = this.spec.fov;
      this.cam.aspect = this.spec.aspect();
    }
    else {
      this.cam.left = -this.spec.width() / 2;
      this.cam.right = this.spec.width() / 2;
      this.cam.top = this.spec.height() / 2;
      this.cam.bottom = -this.spec.height() / 2;
    }
    this.cam.position.copy(this.spec.position);
    this.cam.near = this.spec.near;
    this.cam.far = this.spec.far;
    this.cam.updateProjectionMatrix();
  }

  enableLayer(n) {
    this.cam.layers.enable(n);
  }

  disableLayer(n) {
    this.cam.layers.disable(n);
  }

  toggleLayer(n) {
    this.cam.layers.toggle(n);
  }
}
