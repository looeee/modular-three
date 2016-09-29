import modularTHREE from '../index';
// *****************************************************************************
//  THREE JSON object format loader
//  includes simple memoization to ensure
//  THREE.ObjectLoader() and models are only loaded once
//  NOTE: currently does not return a reference to the loaded model
// *****************************************************************************
let loader = null;

const models = {};

const setupLoader = () => {
  if (!loader) {
    if (modularTHREE.config.useLoadingManager) {
      loader = new THREE.ObjectLoader(modularTHREE.loadingManager);
    }
    else loader = new THREE.ObjectLoader();
  }
  loader.setTexturePath(modularTHREE.config.texturePath);
};

const promiseLoader = (url) => new Promise((resolve, reject) => {
  if (!models[url]) loader.load(url, resolve);
  else resolve(models[url]);
});

export function objectLoader(url) {
  setupLoader();
  return promiseLoader(url)
  .then((object) => {
    if (!models[url]) models[url] = object;

    return object;
  });
}

// The exporter currently exports a scene object rather than just a single
// mesh; traverse the loadedObject and find this mesh
// const getMesh = (loadedObject) => {
//   let mesh;
//   loadedObject.traverse((object) => {
//     if (object instanceof THREE.Mesh) {
//       mesh = object;
//       mesh.animations = loadedObject.animations;
//     }
//   });
//
//   if (mesh === undefined) {
//     console.warn(`${url} does not contain a THREE.Mesh.`);
//   }
//   return mesh;
// };
