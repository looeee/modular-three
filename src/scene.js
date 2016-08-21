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
//  The scene will automatically clear all meshes and reset camera on
//  window resize - the drawing is responsible for repopulating the scene
//  with it's own reset() function
//
// *****************************************************************************
export class Scene {
  constructor(cameraSpec, rendererSpec) {
    this.cameraSpec = cameraSpec;
    this.rendererSpec = rendererSpec;
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.cameraSpec);
    this.scene.add(this.camera.cam);

    //used to add Orbit Controls to the camera
    //this.camera.cam.userData.domElement = this.rendererSpec.containerElem;

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

  render(showStats) {
    this.renderer.render(this.scene, this.camera.cam, showStats);
  }
}
