import {
  textureLoader,
}
from './loaders/textureLoader';
// *****************************************************************************
// MESH OBJECT SUPERCLASS
// Superclass for any THREE.js mesh object. Returns a THREE mesh
// *****************************************************************************
export class MeshObject {
  constructor(spec) {
    this.spec = spec || {};

    this.init();
    if (this.spec.layer) {
      this.mesh.layers.set(this.spec.layer);
    }

    return this.mesh;
  }

  loadTexture(url) {
    return textureLoader(url);
  }

  updateTexture(url) {
    //TODO: implement this
  }
}
