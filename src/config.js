const warnIfConfigUpdatedAfterInit = () => {
  console.warn('Config setting should be set before calling ModularTHREE.init()');
};

export const config = {
  initCalled: false,
  
  GSAP: true,
  get useGSAP() {
    return this.GSAP;
  },
  set useGSAP(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.GSAP = value;
  },

  heartcodeLoader: true,
  get useHeartcodeLoader() {
    return this.heartcodeLoader;
  },
  set useHeartcodeLoader(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.heartcodeLoader = value;
  },

  stats: true,
  get showStats() {
    return this.stats;
  },
  set showStats(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.stats = value;
  },
};
