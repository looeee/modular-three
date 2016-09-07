import modularTHREE from './index';
import { config } from './config';
// *****************************************************************************
// Perform various initialisation checks and setup
// *****************************************************************************
const moduleName = 'ModularTHREE';

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
  if (config.useLoadingManager) modularTHREE.loadingManager = new THREE.LoadingManager();
  config.initCalled = true;
};
