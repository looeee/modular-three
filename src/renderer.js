import { config } from './config';
import { Postprocessing } from './postprocessing';

// *****************************************************************************
// RENDERER CLASS
//
// Create a THREE.js renderer and add postprocessing if required
// Each scene currently needs a unique renderer and associated HTML Canvas
// elem for the cancelRender function to work
// The container elem can be omitted if using only one scene as the default
// will be automatically added
//
// The following spec object can be omitted for the following defaults
// const rendererSpec = {
//   containerElem: '',
//   antialias: true,
//   alpha: false, //true required for multiple scenes
//   autoClear: true, //false required for multiple scenes
//   clearColor: 0x000000,
//   clearAlpha: 0,
//   width: window.innerWidth,
//   height: window.innerHeight,
//   pixelRatio: window.devicePixelRatio,
// };
// *****************************************************************************
export class Renderer {
  constructor(spec) {
    this.spec = spec || {};
    this.init();
  }

  init() {
    this.initParams();
    this.initRenderer();

    this.setRenderer();
  }

  initRenderer() {
    const rendererOptions = {
      antialias: this.spec.antialias,
      //required for multiple scenes and various other effects
      alpha: this.spec.alpha,
    };

    if (this.spec.canvasID) {
      if (document.querySelector(`#${this.spec.canvasID}`)) {
        let msg = `Warning: an element with id ${this.spec.canvasID} already exists \n`;
        msg += 'Perhaps it was created manually? This will cause problems if you are';
        msg += 'trying to render multiple Drawings to the same <canvas> element.';
        console.warn(msg);
        rendererOptions.canvas = document.querySelector(`#${this.spec.canvasID}`);
      }
      else if (this.spec.canvasID) {
        rendererOptions.canvas = document.createElement('canvas');
        rendererOptions.canvas.id = this.spec.canvasID;
      }
    }

    this.renderer = new THREE.WebGLRenderer(rendererOptions);

    if (!this.spec.canvasID || !document.querySelector(`#${this.renderer.domElement.id}`)) {
      document.body.appendChild(this.renderer.domElement);
    }
  }

  initParams() {
    if (!this.spec.showStats) this.spec.showStats = false;
    if (!this.spec.postprocessing) this.spec.postprocessing = false;
    if (!this.spec.antialias) this.spec.antialias = true;
    if (!this.spec.alpha) this.spec.alpha = true;
    if (!this.spec.autoClear) this.spec.autoClear = false;
    this.spec.clearColor = this.spec.clearColor || 0x000000;
    this.spec.clearAlpha = this.spec.clearAlpha || 1.0;
    const w = () => window.innerWidth;
    this.spec.width = this.spec.width || w;
    const h = () => window.innerHeight;
    this.spec.height = this.spec.height || h;
    this.spec.pixelRatio = this.spec.pixelRatio || window.devicePixelRatio;
  }

  setSize(w = this.spec.width(), h = this.spec.height()) {
    this.renderer.setSize(w, h);
  }

  setRenderer() {
    this.renderer.autoClear = this.spec.autoClear;
    this.renderer.setClearColor(this.spec.clearColor, this.spec.clearAlpha);
    this.renderer.setSize(this.spec.width, this.spec.height);
    this.renderer.setPixelRatio(this.spec.pixelRatio);
    this.setSize(this.spec.width(), this.spec.height());
  }

  initStats() {
    if (this.stats) return; //don't create stats more than once
    if (typeof Stats === 'undefined') {
      let msg = `modularTHREE Error: Stats not loaded.\n`;
      msg += `If you do not wish to show Stats set rendererSpec.showStats = false\n`;
      msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
      msg += 'and add it to your build.';
      console.error(msg);
      this.spec.showStats = false;
    }
    else {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  render(scene, camera, perFrameFunctions) {
    if (this.spec.showStats) this.initStats();
    if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, scene, camera);

    if (this.spec.useGSAP && this.checkGSAPLoaded()) {
      this.animateWithGSAP(scene, camera, perFrameFunctions);
    }
    else {
      this.animateWithTHREE(scene, camera, perFrameFunctions);
    }
  }

  animateWithGSAP(scene, camera, perFrameFunctions) {
    const renderHandler = () => {
      for (let i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (this.spec.showStats) this.stats.update();
      if (this.spec.postprocessing) this.postRenderer.composer.render();
      else this.renderer.render(scene, camera);
    };

    TweenLite.ticker.addEventListener('tick', renderHandler);
    this.usingGSAP = true;
  }

  animateWithTHREE(scene, camera, perFrameFunctions) {
    const renderHandler = () => {
      this.animationFrame = requestAnimationFrame(renderHandler);

      for (let i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (this.spec.showStats) this.stats.update();
      if (this.spec.postprocessing) this.postRenderer.composer.render();
      else this.renderer.render(scene, camera);
    };

    renderHandler();
  }

  cancelRender() {
    if (this.usingGSAP) TweenLite.ticker.removeEventListener('tick', this.renderHandler);
    else cancelAnimationFrame(this.animationFrame);
    this.renderer.clear();
    this.usingGSAP = false;
  }

  checkGSAPLoaded() {
    if (typeof TweenLite === 'undefined') {
      let msg = 'ModularTHREE Error: GSAP not loaded.\n';
      msg += 'Attempting to use THREE for animation.\n';
      msg += 'If you do not wish to use GSAP set rendererSpec.useGSAP = false\n';
      msg += 'Otherwise try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js">';
      msg += '</script> to your <head>';
      console.error(msg);
      return false;
    }
    return true;
  }
}
