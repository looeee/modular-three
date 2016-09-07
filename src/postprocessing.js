// *****************************************************************************
// POSTPROCESSING CLASS
// Post effects for THREE.js
// Set postprocessing = true in renderSpec for a drawing to render with post effects
// *****************************************************************************
export class Postprocessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.init();
  }

  init() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
  }

  addPass(pass, uniforms) {
    const effect = new THREE.ShaderPass(pass);
    //add uniforms here
    effect.renderToScreen = true;
    this.composer.addPass(effect);
  }
}
