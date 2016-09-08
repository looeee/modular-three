// *****************************************************************************
//  CAMERA CLASS
//
//  Used by Scene class - each scene will have an associated camera class
// *****************************************************************************
export class Camera {
  constructor(spec) {
    this.spec = spec;
    this.init();
  }

  init() {
    if (this.spec.type === 'PerspectiveCamera') {
      this.cam = new THREE.PerspectiveCamera();
    }
    else {
      this.cam = new THREE.OrthographicCamera();
    }
    this.set();
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
