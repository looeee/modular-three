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
};

// The exporter currently exports a scene object rather than just a single
// mesh; traverse the loadedObject and find this mesh
const getMesh = (loadedObject) => {
  let mesh;
  loadedObject.traverse( function( object ) {
    if (object instanceof THREE.Mesh){
      mesh = object;
      mesh.animations = loadedObject.animations;
    }
  });

  if (mesh == undefined) {
    console.warn(`${url} does not contain a THREE.Mesh.`);
  }
  return mesh;
}

export function objectLoader(url, callback) {
  setupLoader();

  if (!models[url]) {
    loader.load(url, (loadedObject) => {
      //models[url] = getMesh(loadedObject);
      models[url] = loadedObject;
      callback(models[url]);
    });
  }

  else {
    callback(models[url]);
  }
}
