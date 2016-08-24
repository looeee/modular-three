import {
  Renderer,
}
from './renderer';
import {
  Camera,
}
from './camera';
// *****************************************************************************
//  SCENE CLASS
//
//  THREE.js scene is used by DRAWING classes
//
// *****************************************************************************
export class Scene {
  constructor(rendererSpec, cameraSpec) {
    this.rendererSpec = rendererSpec;
    this.cameraSpec = cameraSpec;
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.cameraSpec);
    this.scene.add(this.camera.cam);
    this.renderer = new Renderer(this.rendererSpec);
  }

  add(...objects) {
    for (const object of objects) {
      this.scene.add(object);
    }
  }

  reset() {
    this.clearScene();
    this.camera.set();
    this.renderer.setSize();
  }

  clearScene() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      this.scene.remove(this.scene.children[i]);
    }
  }

  cancelRender() {
    this.renderer.cancelRender();
  }

  render(perFrameFunctions) {
    this.renderer.render(this.scene, this.camera.cam, perFrameFunctions);
  }
}
