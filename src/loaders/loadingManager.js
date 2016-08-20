// *****************************************************************************
//  LOADING MANAGER
//  To be used by all other loaders
// *****************************************************************************
// const loadingOverlay = document.querySelector('#loadingOverlay');
// const loadingIcon = new CanvasLoader('loadingIcon');
// loadingIcon.setColor('#5a6f70');
// loadingIcon.setShape('spiral'); // default is 'oval'
// loadingIcon.setDiameter(150); // default is 40
// loadingIcon.setDensity(50); // default is 40
// loadingIcon.setRange(0.7); // default is 1.3
// loadingIcon.setSpeed(1); // default is 2
// loadingIcon.setFPS(30); // default is 24
// loadingIcon.show(); // Hidden by default

export const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = () => {
  loadingIcon.hide();
  TweenLite.to(loadingOverlay, 2, {
    opacity: 0,
    onComplete: () => loadingOverlay.classList.add('hide'),
  });
};
