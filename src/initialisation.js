import {
  config,
}
from './config';
import {
  initHeartcodeLoader,
}
from './loaders/loadingManager';
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

const checkStatsLoaded = () => {
  if (typeof Stats === 'undefined') {
    let msg = `${moduleName} Error: Stats not loaded.\n`;
    msg += `If you do not wish to show Stats set ${moduleName}.config.showStats = false\n`;
    msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
    msg += 'and add <script src="path-to-script/stats.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
    config.showStats = false;
  }
};

export const init = () => {
  if (config.showHeartcodeLoader) {
    if (checkHeartcodeLoaded()) {
      initHeartcodeLoader();
    }
  }

  if (config.showStats) checkStatsLoaded();

  config.initCalled = true;
};
