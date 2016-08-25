import * as THREE from 'three/src/Three.js';

// *****************************************************************************
// POSTPROCESSING CLASS
// Post effects for THREE.js
// Set postprocessing = true in renderSpec for a drawing to render with post effects
//
//  NOTE: This currently allows only one postprocessing effect for all scenes.
//  It will need to be subclassed to allow per scene effects
//
//  NOTE: the relevant postprocessing scripts will need to be included
//  depending on what effects are used
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
    this.vignette();
  }

  vignette() {
    const effectVignette = new THREE.ShaderPass(THREE.VignetteShader);
    effectVignette.uniforms.offset.value = 0.95;
    effectVignette.uniforms.darkness.value = 1.6;
    effectVignette.renderToScreen = true;
    this.composer.addPass(effectVignette);
  }
}
