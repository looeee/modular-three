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
    this.composer.passes[0].renderToScreen = true;
  }

  addShader(shader, uniforms = {}) {
    const pass = new THREE.ShaderPass(shader);

    Object.keys(uniforms).forEach((key) => {
      pass.uniforms[key].value = uniforms[key];
    });
    this.composer.addPass(pass);
    this.setRenderToScreen();
  }

  addEffect(effect) {
    this.composer.addPass(effect);
    this.setRenderToScreen();
  }

  //Set renderToScreen = true for the last effect added
  setRenderToScreen() {
    const len = this.composer.passes.length;
    this.composer.passes[len - 2].renderToScreen = false;
    this.composer.passes[len - 1].renderToScreen = true;
  }

  reset() {
    this.composer.reset();
  }

  render() {
    this.composer.render();
  }
}
