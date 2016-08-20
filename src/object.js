// import {
//   textureLoader,
// }
// from './loaders/textureLoader';
// *****************************************************************************
// OBJECTS SUPERCLASS
// Objects are used by drawings and each return a THREE.Object3D
// (Mesh, Sprite etc.)
// This can then be added within a drawing with this.scene.add(object)
// *****************************************************************************
export class Object {
  constructor(spec) {
    this.spec = spec || {};

    this.spec.color = this.spec.color || 0xffffff;

    this.init();
    if (this.spec.layer) {
      this.mesh.layers.set(this.spec.layer);
    }

    return this.mesh;
  }

  createMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  // loadTexture(url) {
  //   return textureLoader(url);
  // }
}
