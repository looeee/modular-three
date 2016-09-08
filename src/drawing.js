import throttle from 'lodash-es/throttle';
import { Scene } from './scene';

//hold a reference to all drawings so that they can be reset easily
const drawings = {};

const resetDrawings = () => {
  Object.keys(drawings).forEach((key) => drawings[key].reset());
};

window.addEventListener('resize',
  throttle(() => resetDrawings(), 500),
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
    if (this.rendererSpec.showStats === undefined) this.rendererSpec.showStats = false;
    if (this.rendererSpec.useGSAP === undefined) this.rendererSpec.useGSAP = false;
    if (this.rendererSpec.postprocessing === undefined) this.rendererSpec.postprocessing = false;
    if (this.rendererSpec.antialias === undefined) this.rendererSpec.antialias = true;
    if (this.rendererSpec.alpha === undefined) this.rendererSpec.alpha = true;
    if (this.rendererSpec.autoClear === undefined) this.rendererSpec.autoClear = true;
    if (this.rendererSpec.clearColor === undefined) this.rendererSpec.clearColor = 0x000000;
    if (this.rendererSpec.clearAlph === undefined) this.rendererSpec.clearAlpha = 1.0;
    if (this.rendererSpec.width === undefined) this.rendererSpec.width = () => window.innerWidth;
    if (this.rendererSpec.height === undefined) this.rendererSpec.height = () => window.innerHeight;
    if (this.rendererSpec.pixelRatio === undefined) this.rendererSpec.pixelRatio = window.devicePixelRatio;
  }

  initCameraSpec() {
    if (this.cameraSpec.type === undefined) this.cameraSpec.type = 'PerspectiveCamera';
    if (this.cameraSpec.near === undefined) this.cameraSpec.near = 10;
    if (this.cameraSpec.far === undefined) this.cameraSpec.far = -10;
    if (this.cameraSpec.position === undefined) this.cameraSpec.position = new THREE.Vector3(0, 0, 100);

    if (this.cameraSpec.type === 'PerspectiveCamera') {
      if (this.cameraSpec.fov === undefined) this.cameraSpec.fov = 45;
      if (this.cameraSpec.aspect === undefined) this.cameraSpec.aspect = () => window.innerWidth / window.innerHeight;
    }
    else {
      if (this.cameraSpec.width === undefined) this.cameraSpec.width = () => window.innerWidth;
      if (this.cameraSpec.height === undefined) this.cameraSpec.height = () => window.innerHeight;
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

  addPostShader(shader, uniforms, renderToScreen) {
    this.scene.renderer.postRenderer.addShader(shader, uniforms, renderToScreen);
  }

  addPostEffect(effect, renderToScreen) {
    this.scene.renderer.postRenderer.addEffect(effect, renderToScreen);
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
