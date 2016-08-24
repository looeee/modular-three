import {
  loadingManager,
}
from './loadingManager';
// *****************************************************************************
//  Texture Loader
//  includes simple memoization to ensure
//  THREE.TextureLoader() and textures are only loaded once
// *****************************************************************************
let loader = null;

const textures = {};

export function textureLoader(url) {
  if (!loader) loader = new THREE.TextureLoader(loadingManager);

  if (!textures[url]) textures[url] = loader.load(url);

  return textures[url];
}
