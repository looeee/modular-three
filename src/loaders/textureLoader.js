import modularTHREE from '../index';
// *****************************************************************************
//  Texture Loader
//  includes simple memoization to ensure
//  THREE.TextureLoader() and textures are only loaded once
// *****************************************************************************
let loader = null;

const textures = {};

export function textureLoader(url) {
  if (!loader) {
    if (modularTHREE.config.useLoadingManager) {
      loader = new THREE.TextureLoader(modularTHREE.loadingManager);
    }
    else loader = new THREE.TextureLoader();
  }

  if (!textures[url]) textures[url] = loader.load(url);

  return textures[url];
}
