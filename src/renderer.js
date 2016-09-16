import { config } from './config';
import { Postprocessing } from './postprocessing';

const checkStatsLoaded = () => {
  if (typeof Stats === 'undefined') {
    let msg = `modularTHREE Error: Stats not loaded.\n`;
    msg += `If you do not wish to show Stats set rendererSpec.showStats = false\n`;
    msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
    msg += 'and add it to your build.';
    console.error(msg);
    return false;
  }
  return true;
};

const checkGSAPLoaded = () => {
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
};

const checkIfCanvasExists = (id) => {
  if (document.querySelector(`#${id}`)) {
    let msg = `Warning: an element with id ${id} already exists.\n`;
    msg += 'Either it was created manually or you have two Drawings with the same id. \n';
    msg += 'Rendering multiple Drawings to the same <canvas> element will cause problems.';
    console.warn(msg);
    return true;
  }
  return false;
};

// *****************************************************************************
// RENDERER CLASS
//
// Create a THREE.js renderer and add postprocessing if required
// Each scene currently needs a unique renderer and associated HTML Canvas
// elem for the cancelRender function to work
// The container elem can be omitted if using only one scene as the default
// will be automatically added
//
// *****************************************************************************
export class Renderer {
  constructor(spec, scene, camera) {
    this.spec = spec;
    this.scene = scene;
    this.camera = camera;
    this.init();

  }

  init() {
    this.initRenderer();
    this.setRenderer();

    this.initProperties();

    if (this.spec.showStats) this.initStats();
    if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, this.scene, this.camera);
  }

  initRenderer() {
    const rendererOptions = {
      antialias: this.spec.antialias,
      alpha: this.spec.alpha,
    };

    if (this.spec.canvasID) {
      if (checkIfCanvasExists(this.spec.canvasID)) {
        rendererOptions.canvas = document.querySelector(`#${this.spec.canvasID}`);
      }
      else {
        rendererOptions.canvas = document.createElement('canvas');
        rendererOptions.canvas.id = this.spec.canvasID;
      }
    }

    this.renderer = new THREE.WebGLRenderer(rendererOptions);

    if (!this.spec.canvasID || !document.querySelector(`#${this.renderer.domElement.id}`)) {
      document.body.appendChild(this.renderer.domElement);
    }
  }

  //Copy over the properties from the renderer so that we can access them directly
  initProperties() {
    Object.keys(this.renderer).forEach((key) => {
      //"render()" and "setSize()" are being handled here so don't copy them
      if (key !== 'render' && key !== 'setSize') {
        this[key] = this.renderer[key];
      }
    });
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
    if (!checkStatsLoaded()) {
      this.spec.showStats = false;
    }
    else {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  render(perFrameFunctions) {
    if (this.spec.useGSAP && checkGSAPLoaded()) {
      this.animateWithGSAP(perFrameFunctions);
    }
    else {
      this.animateWithTHREE(perFrameFunctions);
    }
  }

  animateWithGSAP(perFrameFunctions) {
    const renderHandler = () => {
      for (let i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (this.stats) this.stats.update();
      if (this.postRenderer) this.postRenderer.render();
      else this.renderer.render(this.scene, this.camera);
    };

    TweenLite.ticker.addEventListener('tick', renderHandler);
    this.usingGSAP = true;
  }

  animateWithTHREE(perFrameFunctions) {
    const renderHandler = () => {
      this.animationFrame = requestAnimationFrame(renderHandler);

      for (let i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (this.stats) this.stats.update();
      if (this.postRenderer) this.postRenderer.render();
      else this.renderer.render(this.scene, this.camera);
    };

    renderHandler();
  }

  cancelRender() {
    if (this.usingGSAP) TweenLite.ticker.removeEventListener('tick', this.renderHandler);
    else cancelAnimationFrame(this.animationFrame);
    this.renderer.clear();
    this.usingGSAP = false;
  }

}
