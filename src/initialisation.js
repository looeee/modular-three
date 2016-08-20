import {
  config,
}
from './config';
// *****************************************************************************
// Performs various initialisation checks and setup
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
    //TODO: automatically add elem for loader
    checkHeartcodeLoaded();
  }
  if (config.showStats) checkStatsLoaded();
};
