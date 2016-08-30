// import * as THREE from 'three/src/Three.js';

import throttle from 'lodash-es/throttle';

import {
  Scene,
}
from './scene';

//hold a reference to all drawings so that they can be reset easily
const drawings = {};

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
  constructor(rendererSpec, cameraSpec) {
    this.scene = new Scene(rendererSpec, cameraSpec);
    this.camera = this.scene.camera;

    this.uuid = THREE.Math.generateUUID();

    drawings[this.uuid] = this;

    this.perFrameFunctions = [];

    this.init();
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions
  reset() {
    this.scene.reset();
    this.init();
  }

  render() {
    this.scene.render(this.perFrameFunctions);
  }

  cancelRender() {
    this.scene.renderer.cancelRender();
  }

  addPerFrameFunction(func) {
    if (typeof func === 'function') this.perFrameFunctions.push(func);
    else {
      let msg = 'modularTHREE.Drawing.perFrameFunctions() typeError:';
      msg += 'Attempting to add something that is not a function!';
      console.error(msg);
    }
  }
}
