import {
  loadingManager,
}
from './loadingManager';
// *****************************************************************************
//  THREE JSON object format loader
//  includes simple memoization to ensure
//  THREE.ObjectLoader() and models are only loaded once
//  NOTE: currently does not return a reference to the loaded model
// *****************************************************************************
let loader = null;

const models = {};

export function objectLoader(spec) {
  if (!loader) loader = new THREE.ObjectLoader(loadingManager);

  if (!models[spec.url]) {
    loader.load(spec.url, (mesh) => {
      if (spec.normalize) {
        mesh.geometry.normalize();
      }
      mesh.position.copy(spec.position);
      mesh.scale.copy(spec.scale);
      spec.scene.add(mesh);
      models[spec.url] = mesh;
    });
  }
  else {
    spec.scene.add(models[spec.url]);
  }
}
