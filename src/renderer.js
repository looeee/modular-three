import {
  config,
}
from './config';

const showStats = config.showStats;
// import {
//   Postprocessing,
// }
// from './postprocessing';
// *****************************************************************************
// RENDERER CLASS
//
// Create a THREE.js renderer and add postprocessing if required
// Each scene currently needs a unique renderer and associated HTML Canvas
// elem for the cancelRender function to work
// The container elem can be omitted if using only one scene as the default
// will be automatically added
// NOTE: Currently using TweenMax ticker for animation so the gsap files must
// be included
//
// The following spec object can be omitted for the following defaults
// const rendererSpec = {
//   containerElem: canvasElem, // omit for THREE js default
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
      rendererOptions.canvas = document.createElement('canvas');
      rendererOptions.canvas.id = this.spec.canvasID;
    }

    this.renderer = new THREE.WebGLRenderer(rendererOptions);
    document.body.appendChild(this.renderer.domElement);
  }

  initParams() {
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
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  render(scene, camera, perFrameFunctions) {
    if (showStats) this.initStats();
    if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, scene, camera);

    if (this.spec.useGSAP && this.checkGSAPScriptLoaded()) {
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

      if (showStats) this.stats.update();
      if (this.spec.postprocessing) this.postRenderer.composer.render();
      else this.renderer.render(scene, camera);
    };

    TweenLite.ticker.addEventListener('tick', renderHandler);
    this.usingGSAP = true;
  }

  animateWithTHREE(scene, camera, perFrameFunctions) {
    const renderHandler = () => {
      for (let i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (showStats) this.stats.update();
      if (this.spec.postprocessing) this.postRenderer.composer.render();
      else this.renderer.render(scene, camera);

      this.animationFrame = requestAnimationFrame(renderHandler);
    };

    renderHandler();
  }

  cancelRender() {
    if (this.usingGSAP) TweenLite.ticker.removeEventListener('tick', this.renderHandler);
    else cancelAnimationFrame(this.animationFrame);
    this.renderer.clear();
    this.usingGSAP = false;
  }

  checkGSAPScriptLoaded() {
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
