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
// The spec object can be omitted for the following defaults
// const spec = {
//   containerElem: canvasElem, // omit for THREE js default
//   antialias: true, ,
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
    const rendererOptions = {
      antialias: this.spec.antialias,
      //required for multiple scenes and various other effects
      alpha: this.spec.alpha,
    };
    if (this.spec.containerElem) {
      rendererOptions.canvas = this.spec.containerElem;
      this.renderer = new THREE.WebGLRenderer(rendererOptions);
    }
    else {
      this.renderer = new THREE.WebGLRenderer(rendererOptions);
      document.body.appendChild(this.renderer.domElement);
    }

    this.setRenderer();
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

  showStats() {
    if (typeof Stats === 'function') {
      if (this.stats) return; //don't create stats more than once
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
    else {
      console.warn('https://github.com/mrdoob/stats.js must be included for stats to work');
    }
  }

  render(scene, camera, showStats = false) {
    if (showStats) this.showStats();
    this.renderer.setClearColor(this.spec.clearColor, this.spec.clearAlpha);
    //if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, scene, camera);
    this.animate(scene, camera);
  }

  cancelRender() {
    TweenLite.ticker.removeEventListener('tick', this.renderHandler);
    this.renderer.clear();
  }

  animate(scene, camera) {
    this.renderHandler = () => {
      if (this.stats) this.stats.update();
      //if (this.spec.postprocessing) this.postRenderer.composer.render();
      else this.renderer.render(scene, camera);
    };

    TweenLite.ticker.addEventListener('tick', this.renderHandler);
  }
}
