import {
  Scene,
}
from './scene';
// *****************************************************************************
//
//  DRAWING CLASS
//
// *****************************************************************************
export class Drawing {
  constructor(cameraSpec, rendererSpec) {
    this.scene = new Scene(cameraSpec, rendererSpec);
    this.camera = this.scene.camera;
    this.uuid = THREE.Math.generateUUID();
    this.init();
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions
  reset() {
    this.scene.reset();
    this.init();
  }

  render(showStats) {
    this.scene.render(showStats);
  }

  cancelRender() {
    this.scene.renderer.cancelRender();
  }
}
