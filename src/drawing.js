const throttle = require('lodash.throttle');

import {
  Scene,
}
from './scene';

//hold a reference to all drawings so that they can be reset easily
export const drawings = {};

const resetDrawings = () => {
  Object.keys(drawings)
    .forEach((key) => {
      drawings[key].reset();
    });
};

window.addEventListener('resize',
  throttle(() => {
    resetDrawings();
  }, 500),
false);

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
    drawings[this.uuid] = this;

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
