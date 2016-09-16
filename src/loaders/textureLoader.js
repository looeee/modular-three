import modularTHREE from '../index';
// *****************************************************************************
//  Texture Loader
//  includes simple memoization to ensure
//  THREE.TextureLoader() and textures are only loaded once
// *****************************************************************************
let loader = null;

const textures = {};

const initLoader = () => {
  if (!loader) {
    if (modularTHREE.config.useLoadingManager) {
      loader = new THREE.TextureLoader(modularTHREE.loadingManager);
    }
    else loader = new THREE.TextureLoader();
  }
};

const promiseLoader = (url) => new Promise((resolve, reject) => {
  if (!textures[url]) loader.load(url, resolve);
  else resolve(textures[url]);
});

export function textureLoader(url) {
  initLoader();

  return promiseLoader(url)
  .then((texture) => {
    if (!textures[url]) textures[url] = texture;
    return texture;
  });
}
