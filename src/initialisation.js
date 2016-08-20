import {
  config,
}
from './config';
// *****************************************************************************
// Performs various initialisation checks and setup
// *****************************************************************************
//TODO: turn check functions into proper checks
const checkTHREELoaded = () => {
  console.log(typeof THREE);
};

const checkGSAPLoaded = () => {
  console.log(typeof TweenLite);
};

const checkHeartcodeLoaded = () => {
  console.log(typeof CanvasLoader);
};

const checkStatsLoaded = () => {
  console.log(typeof Stats);
};

export const init = () => {
  checkTHREELoaded();
  if (config.useGSAP) checkGSAPLoaded();
  if (config.useHeartcodeLoader) {
    //TODO: automatically add elem for loader
    checkHeartcodeLoaded();
  }
  if (config.showStats) checkStatsLoaded();
};
