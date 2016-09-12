import throttle from 'lodash-es/throttle';
import { Renderer } from './renderer';
import { objectLoader } from './loaders/objectLoader';

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

    this.uuid = THREE.Math.generateUUID();
    drawings[this.uuid] = this;

    this.perFrameFunctions = [];

    this.initCamera();
    this.initScene();
    this.initRenderer();

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

  initScene() {
    this.scene = new THREE.Scene();

    this.scene.add(this.camera);
  }

  initRenderer() {
    this.renderer = new Renderer(this.rendererSpec, this.scene, this.camera);
    this.domElement = this.renderer.renderer.domElement;
  }

  initCamera() {
    if (!this.camera) {
      if (this.cameraSpec.type === 'PerspectiveCamera') {
        this.camera = new THREE.PerspectiveCamera();
      }
      else {
        this.camera = new THREE.OrthographicCamera();
      }
    }

    if (this.cameraSpec.type === 'PerspectiveCamera') {
      this.camera.fov = this.cameraSpec.fov;
      this.camera.aspect = this.cameraSpec.aspect();
    }
    else {
      this.camera.left = -this.cameraSpec.width() / 2;
      this.camera.right = this.cameraSpec.width() / 2;
      this.camera.top = this.cameraSpec.height() / 2;
      this.camera.bottom = -this.cameraSpec.height() / 2;
    }
    this.camera.position.copy(this.cameraSpec.position);
    this.camera.near = this.cameraSpec.near;
    this.camera.far = this.cameraSpec.far;
    this.camera.updateProjectionMatrix();
  }

  add(...objects) {
    for (const object of objects) {
      this.scene.add(object);
    }
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions
  reset() {
    this.clearScene();
    this.initCamera();
    this.renderer.setSize();
    this.init();
  }

  clearScene() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      this.scene.remove(this.scene.children[i]);
    }
  }

  cancelRender() {
    this.renderer.cancelRender();
  }

  render() {
    this.renderer.render(this.perFrameFunctions);
  }

  addPostShader(shader, uniforms, renderToScreen) {
    if (!this.rendererSpec.postprocessing) return;
    this.scene.renderer.postRenderer.addShader(shader, uniforms, renderToScreen);
  }

  addPostEffect(effect, renderToScreen) {
    if (!this.rendererSpec.postprocessing) return;
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


  loadObject(url, callback) {
    if (callback === undefined) {
      callback = (object) => this.add(object);
    }
    return objectLoader(url, callback);
  }

  initClock() {
    if (!this.clock) this.clock = new THREE.Clock();
  }

  get animationMixer() {
    if (!this.mixer) {
      this.initMixer();
    }

    return this.mixer;
  }

  initMixer() {
    this.mixer = new THREE.AnimationMixer(this.scene);

    this.initClock();

    if (this.rendererSpec.useGSAP === false) {
      this.addPerFrameFunction(() => this.mixer.update(this.clock.getDelta()));
    }

    else {
      TweenLite.ticker.addEventListener('tick', () => this.mixer.update(this.clock.getDelta()));
    }
  }
}
