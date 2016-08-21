import {
  config,
}
from './config';
// *****************************************************************************
// Perform various initialisation checks and setup
// *****************************************************************************
const moduleName = 'unnamedTHREESetupModule';
//TODO: turn check functions into proper checks
const checkTHREELoaded = () => {
  if (typeof THREE === 'undefined') {
    let msg = `${moduleName} Error: THREE not loaded. THREE.js must be loaded before this module\n`;
    msg += 'Try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

checkTHREELoaded();

const checkGSAPLoaded = () => {
  if (typeof TweenLite === 'undefined') {
    let msg = `${moduleName} Error: GSAP not loaded.\n`;
    msg += `If you do not wish to use GSAP set ${moduleName}.config.useGSAP = false\n`;
    msg += 'Otherwise try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

const checkHeartcodeLoaded = () => {
  if (typeof CanvasLoader === 'undefined') {
    let msg = `${moduleName} Error: HeartcodeLoader not loaded.\n`;
    msg += `If you do not wish to use HeartcodeLoader set ${moduleName}.config.useHeartcodeLoader = false\n`;
    msg += 'Otherwise get https://raw.githubusercontent.com/heartcode/';
    msg += 'CanvasLoader/master/js/heartcode-canvasloader-min.js\n';
    msg += 'and add <script src="path-to-script/heartcode-canvasloader-min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
    return false;
  }
  return true;
};

const addLoaderElem = () => {
  const elem = document.querySelector('#loadingOverlay');
  if (elem === null) {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;z-index: 999; background-color: black;';
    const loadingIcon = document.createElement('div');
    loadingIcon.id = 'loadingIcon';
    loadingIcon.style = 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); }';

    loadingOverlay.appendChild(loadingIcon);
    document.body.appendChild(loadingOverlay);
  }
};

const checkStatsLoaded = () => {
  if (typeof Stats === 'undefined') {
    let msg = `${moduleName} Error: Stats not loaded.\n`;
    msg += `If you do not wish to show Stats set ${moduleName}.config.showStats = false\n`;
    msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
    msg += 'and add <script src="path-to-script/stats.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

export const init = () => {
  if (config.useGSAP) checkGSAPLoaded();

  if (config.useHeartcodeLoader) {
    if (checkHeartcodeLoaded()) {
      addLoaderElem();
    }
  }

  if (config.showStats) checkStatsLoaded();
};
