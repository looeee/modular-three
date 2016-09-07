import throttle from 'lodash-es/throttle';
import { Scene } from './scene';

//hold a reference to all drawings so that they can be reset easily
const drawings = {};

const resetDrawings = () => {
  Object.keys(drawings)
    .forEach((key) => {
      drawings[key].reset();
    });
};

window.addEventListener('resize',
  throttle(() => {
    resetDrawings();
  }, 500),
false);

// *****************************************************************************
//
//  DRAWING CLASS
//
// *****************************************************************************
export class Drawing {
  constructor(rendererSpec, cameraSpec) {
    this.rendererSpec = rendererSpec || {};
    this.cameraSpec = cameraSpec || {};
    console.log(this.rendererSpec, this.cameraSpec);
    this.initRendererSpec();
    this.initCameraSpec();

    this.scene = new Scene(this.rendererSpec, this.cameraSpec);
    this.camera = this.scene.camera;

    this.uuid = THREE.Math.generateUUID();
    drawings[this.uuid] = this;

    this.perFrameFunctions = [];

    this.init();
  }

  initRendererSpec() {
    if (!this.rendererSpec.showStats) this.rendererSpec.showStats = false;
    if (!this.rendererSpec.postprocessing) this.rendererSpec.postprocessing = false;
    if (!this.rendererSpec.antialias) this.rendererSpec.antialias = true;
    if (!this.rendererSpec.alpha) this.rendererSpec.alpha = true;
    if (!this.rendererSpec.autoClear) this.rendererSpec.autoClear = false;
    if (!this.rendererSpec.clearColor) this.rendererSpec.clearColor = 0x000000;
    this.rendererSpec.clearAlpha = this.rendererSpec.clearAlpha || 1.0;
    const w = () => window.innerWidth;
    this.rendererSpec.width = this.rendererSpec.width || w;
    const h = () => window.innerHeight;
    this.rendererSpec.height = this.rendererSpec.height || h;
    this.rendererSpec.pixelRatio = this.rendererSpec.pixelRatio || window.devicePixelRatio;
  }

  initCameraSpec() {
    this.cameraSpec.type = this.cameraSpec.type || 'PerspectiveCamera';
    this.cameraSpec.near = this.cameraSpec.near || 10;
    this.cameraSpec.far = this.cameraSpec.far || -10;
    const p = () => new THREE.Vector3(0, 0, 100);
    this.cameraSpec.position = this.cameraSpec.position || p;
    if (this.cameraSpec.type === 'PerspectiveCamera') {
      this.cameraSpec.fov = this.cameraSpec.fov || 45;
      const a = () => window.innerWidth / window.innerHeight;
      this.cameraSpec.aspect = this.cameraSpec.aspect || a;
    }
    else {
      const w = () => window.innerWidth;
      this.cameraSpec.width = this.cameraSpec.width || w;
      const h = () => window.innerHeight;
      this.cameraSpec.height = this.cameraSpec.height || h;
    }
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions
  reset() {
    this.scene.reset();
    this.init();
  }

  render() {
    this.scene.render(this.perFrameFunctions);
  }

  cancelRender() {
    this.scene.renderer.cancelRender();
  }

  addPostEffect(pass, uniforms) {
    this.scene.renderer.postRenderer.addPass(pass, uniforms);
  }

  addPerFrameFunction(func) {
    if (typeof func === 'function') this.perFrameFunctions.push(func);
    else {
      let msg = 'modularTHREE.Drawing.perFrameFunctions() typeError:';
      msg += 'Attempting to add something that is not a function!';
      console.error(msg);
    }
  }
}
