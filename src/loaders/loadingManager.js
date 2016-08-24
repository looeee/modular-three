import {
  config,
}
from '../config';
// *****************************************************************************
//  LOADING MANAGER
//  To be used by all other loaders
// *****************************************************************************
let loadingOverlay;
let loadingIcon;

const addLoaderElem = () => {
  loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'loadingOverlay';
  loadingOverlay.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;z-index: 999; background-color: black;';
  loadingIcon = document.createElement('div');
  loadingIcon.id = 'loadingIcon';
  loadingIcon.style = 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); }';

  loadingOverlay.appendChild(loadingIcon);
  document.body.appendChild(loadingOverlay);
};

export const initHeartcodeLoader = () => {
  addLoaderElem();
  loadingIcon = new CanvasLoader('loadingIcon');
  loadingIcon.setColor('#5a6f70');
  loadingIcon.setShape('spiral'); // default is 'oval'
  loadingIcon.setDiameter(150); // default is 40
  loadingIcon.setDensity(50); // default is 40
  loadingIcon.setRange(0.7); // default is 1.3
  loadingIcon.setSpeed(1); // default is 2
  loadingIcon.setFPS(30); // default is 24
  loadingIcon.show(); // Hidden by default
};

export const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = () => {
  if (loadingIcon) {
    loadingIcon.hide();
    TweenLite.to(loadingOverlay, 2, {
      opacity: 0,
      onComplete: () => loadingOverlay.classList.add('hide'),
    });
  }
};
