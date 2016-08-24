const warnIfConfigUpdatedAfterInit = () => {
  console.warn('Config setting should be set before calling ModularTHREE.init()');
};

export const config = {
  initCalled: false,

  heartcodeLoader: false,
  get showHeartcodeLoader() {
    return this.heartcodeLoader;
  },
  set showHeartcodeLoader(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.heartcodeLoader = value;
  },

  stats: false,
  get showStats() {
    return this.stats;
  },
  set showStats(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.stats = value;
  },
};
