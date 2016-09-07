const warnIfConfigUpdatedAfterInit = () => {
  console.warn('Config setting should be set before calling ModularTHREE.init()');
};

export const config = {
  initCalled: false,

  loadingManager: false,
  get useLoadingManager() {
    return this.loadingManager;
  },
  set useLoadingManager(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.loadingManager = value;
  },
};
