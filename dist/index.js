var warnIfConfigUpdatedAfterInit = function () {
  console.warn('Config setting should be set before calling ModularTHREE.init()');
};

var config = {
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
  }
};

// *****************************************************************************
//  LOADING MANAGER
//  To be used by all other loaders
// *****************************************************************************
var loadingOverlay = void 0;
var loadingIcon = void 0;

var addLoaderElem = function () {
  loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'loadingOverlay';
  loadingOverlay.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;z-index: 999; background-color: black;';
  loadingIcon = document.createElement('div');
  loadingIcon.id = 'loadingIcon';
  loadingIcon.style = 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); }';

  loadingOverlay.appendChild(loadingIcon);
  document.body.appendChild(loadingOverlay);
};

var initHeartcodeLoader = function () {
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

var loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = function () {
  if (loadingIcon) {
    loadingIcon.hide();
    TweenLite.to(loadingOverlay, 2, {
      opacity: 0,
      onComplete: function () {
        return loadingOverlay.classList.add('hide');
      }
    });
  }
};

// *****************************************************************************
//  Texture Loader
//  includes simple memoization to ensure
//  THREE.TextureLoader() and textures are only loaded once
// *****************************************************************************
var loader = null;

var textures = {};

function textureLoader(url) {
  if (!loader) loader = new THREE.TextureLoader(loadingManager);

  if (!textures[url]) textures[url] = loader.load(url);

  return textures[url];
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

// *****************************************************************************
// MESH OBJECT SUPERCLASS
// Superclass for any THREE.js mesh object. Returns a THREE mesh
// *****************************************************************************
//TODO: rename this class
var MeshObject = function () {
  function MeshObject(spec) {
    classCallCheck(this, MeshObject);

    this.spec = spec || {};

    this.init();
    if (this.spec.layer) {
      this.mesh.layers.set(this.spec.layer);
    }

    return this.mesh;
  }

  MeshObject.prototype.loadTexture = function loadTexture(url) {
    return textureLoader(url);
  };

  MeshObject.prototype.updateTexture = function updateTexture(url) {
    //TODO: implement this
  };

  return MeshObject;
}();

var showStats = config.showStats;
// import {
//   Postprocessing,
// }
// from './postprocessing';
// *****************************************************************************
// RENDERER CLASS
//
// Create a THREE.js renderer and add postprocessing if required
// Each scene currently needs a unique renderer and associated HTML Canvas
// elem for the cancelRender function to work
// The container elem can be omitted if using only one scene as the default
// will be automatically added
// NOTE: Currently using TweenMax ticker for animation so the gsap files must
// be included
//
// The following spec object can be omitted for the following defaults
// const rendererSpec = {
//   containerElem: canvasElem, // omit for THREE js default
//   antialias: true,
//   alpha: false, //true required for multiple scenes
//   autoClear: true, //false required for multiple scenes
//   clearColor: 0x000000,
//   clearAlpha: 0,
//   width: window.innerWidth,
//   height: window.innerHeight,
//   pixelRatio: window.devicePixelRatio,
// };
// *****************************************************************************
var Renderer = function () {
  function Renderer(spec) {
    classCallCheck(this, Renderer);

    this.spec = spec || {};
    this.init();
  }

  Renderer.prototype.init = function init() {
    this.initParams();
    this.initRenderer();

    this.setRenderer();
  };

  Renderer.prototype.initRenderer = function initRenderer() {
    var rendererOptions = {
      antialias: this.spec.antialias,
      //required for multiple scenes and various other effects
      alpha: this.spec.alpha
    };

    if (this.spec.canvasID) {
      rendererOptions.canvas = document.createElement('canvas');
      rendererOptions.canvas.id = this.spec.canvasID;
    }

    this.renderer = new THREE.WebGLRenderer(rendererOptions);
    document.body.appendChild(this.renderer.domElement);
  };

  Renderer.prototype.initParams = function initParams() {
    if (!this.spec.postprocessing) this.spec.postprocessing = false;
    if (!this.spec.antialias) this.spec.antialias = true;
    if (!this.spec.alpha) this.spec.alpha = true;
    if (!this.spec.autoClear) this.spec.autoClear = false;
    this.spec.clearColor = this.spec.clearColor || 0x000000;
    this.spec.clearAlpha = this.spec.clearAlpha || 1.0;
    var w = function () {
      return window.innerWidth;
    };
    this.spec.width = this.spec.width || w;
    var h = function () {
      return window.innerHeight;
    };
    this.spec.height = this.spec.height || h;
    this.spec.pixelRatio = this.spec.pixelRatio || window.devicePixelRatio;
  };

  Renderer.prototype.setSize = function setSize() {
    var w = arguments.length <= 0 || arguments[0] === undefined ? this.spec.width() : arguments[0];
    var h = arguments.length <= 1 || arguments[1] === undefined ? this.spec.height() : arguments[1];

    this.renderer.setSize(w, h);
  };

  Renderer.prototype.setRenderer = function setRenderer() {
    this.renderer.autoClear = this.spec.autoClear;
    this.renderer.setClearColor(this.spec.clearColor, this.spec.clearAlpha);
    this.renderer.setSize(this.spec.width, this.spec.height);
    this.renderer.setPixelRatio(this.spec.pixelRatio);
    this.setSize(this.spec.width(), this.spec.height());
  };

  Renderer.prototype.initStats = function initStats() {
    if (this.stats) return; //don't create stats more than once
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  };

  Renderer.prototype.render = function render(scene, camera, perFrameFunctions) {
    if (showStats) this.initStats();
    if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, scene, camera);

    if (this.spec.useGSAP && this.checkGSAPScriptLoaded()) {
      this.animateWithGSAP(scene, camera, perFrameFunctions);
    } else {
      this.animateWithTHREE(scene, camera, perFrameFunctions);
    }
  };

  Renderer.prototype.animateWithGSAP = function animateWithGSAP(scene, camera, perFrameFunctions) {
    var _this = this;

    var renderHandler = function () {
      for (var i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (showStats) _this.stats.update();
      if (_this.spec.postprocessing) _this.postRenderer.composer.render();else _this.renderer.render(scene, camera);
    };

    TweenLite.ticker.addEventListener('tick', renderHandler);
    this.usingGSAP = true;
  };

  Renderer.prototype.animateWithTHREE = function animateWithTHREE(scene, camera, perFrameFunctions) {
    var _this2 = this;

    var renderHandler = function () {
      for (var i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (showStats) _this2.stats.update();
      if (_this2.spec.postprocessing) _this2.postRenderer.composer.render();else _this2.renderer.render(scene, camera);

      _this2.animationFrame = requestAnimationFrame(renderHandler);
    };

    renderHandler();
  };

  Renderer.prototype.cancelRender = function cancelRender() {
    if (this.usingGSAP) TweenLite.ticker.removeEventListener('tick', this.renderHandler);else cancelAnimationFrame(this.animationFrame);
    this.renderer.clear();
    this.usingGSAP = false;
  };

  Renderer.prototype.checkGSAPScriptLoaded = function checkGSAPScriptLoaded() {
    if (typeof TweenLite === 'undefined') {
      var msg = 'ModularTHREE Error: GSAP not loaded.\n';
      msg += 'Attempting to use THREE for animation.\n';
      msg += 'If you do not wish to use GSAP set rendererSpec.useGSAP = false\n';
      msg += 'Otherwise try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js">';
      msg += '</script> to your <head>';
      console.error(msg);
      return false;
    }
    return true;
  };

  return Renderer;
}();

// *****************************************************************************
//  CAMERA CLASS
//
//  Used by Scene class - each scene will have an associated camera class
//
//  The following spec is optional and can be omitted for the defaults shown
//  const cameraSpec = {
//    type: 'PerspectiveCamera', //Or 'OrthographicCamera'
//    near: 10,
//    far: -10,
//    position: new THREE.Vector3(0, 0, 100),
//    //PerspectiveCamera only
//    fov: 45, //PerspectiveCamera only
//    aspect: window.innerWidth / window.innerHeight,
//    // OrthographicCamera only
//    width: window.innerWidth,
//    height: window.innerHeight,
//  };
var Camera = function () {
  function Camera(spec) {
    classCallCheck(this, Camera);

    this.spec = spec || {};
    this.init();
  }

  Camera.prototype.init = function init() {
    this.initParams();

    if (this.spec.type === 'PerspectiveCamera') {
      this.cam = new THREE.PerspectiveCamera();
    } else {
      this.cam = new THREE.OrthographicCamera();
    }
    this.set();
  };

  Camera.prototype.initParams = function initParams() {
    var position = function () {
      return new THREE.Vector3();
    };
    this.spec.position = this.spec.position || position;
    this.spec.near = this.spec.near || 10;
    this.spec.far = this.spec.far || -10;
    this.spec.type = this.spec.type || 'PerspectiveCamera';
    if (this.spec.type === 'PerspectiveCamera') {
      this.spec.fov = this.spec.fov || 45;
      var aspect = function () {
        return window.innerWidth / window.innerHeight;
      };
      this.spec.aspect = this.spec.aspect || aspect;
    } else {
      var w = function () {
        return window.innerWidth;
      };
      this.spec.width = this.spec.width || w;
      var h = function () {
        return window.innerHeight;
      };
      this.spec.height = this.spec.height || h;
    }
  };

  Camera.prototype.set = function set() {
    if (this.spec.type === 'PerspectiveCamera') {
      this.cam.fov = this.spec.fov;
      this.cam.aspect = this.spec.aspect();
    } else {
      this.cam.left = -this.spec.width() / 2;
      this.cam.right = this.spec.width() / 2;
      this.cam.top = this.spec.height() / 2;
      this.cam.bottom = -this.spec.height() / 2;
    }
    this.cam.position.copy(this.spec.position);
    this.cam.near = this.spec.near;
    this.cam.far = this.spec.far;
    this.cam.updateProjectionMatrix();
  };

  Camera.prototype.enableLayer = function enableLayer(n) {
    this.cam.layers.enable(n);
  };

  Camera.prototype.disableLayer = function disableLayer(n) {
    this.cam.layers.disable(n);
  };

  Camera.prototype.toggleLayer = function toggleLayer(n) {
    this.cam.layers.toggle(n);
  };

  return Camera;
}();

// *****************************************************************************
//  SCENE CLASS
//
//  THREE.js scene is used by DRAWING classes
//
// *****************************************************************************
var Scene = function () {
  function Scene(rendererSpec, cameraSpec) {
    classCallCheck(this, Scene);

    this.rendererSpec = rendererSpec;
    this.cameraSpec = cameraSpec;
    this.init();
  }

  Scene.prototype.init = function init() {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.cameraSpec);
    this.scene.add(this.camera.cam);
    this.renderer = new Renderer(this.rendererSpec);
  };

  Scene.prototype.add = function add() {
    for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
      objects[_key] = arguments[_key];
    }

    for (var _iterator = objects, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var object = _ref;

      this.scene.add(object);
    }
  };

  Scene.prototype.reset = function reset() {
    this.clearScene();
    this.camera.set();
    this.renderer.setSize();
  };

  Scene.prototype.clearScene = function clearScene() {
    for (var i = this.scene.children.length - 1; i >= 0; i--) {
      this.scene.remove(this.scene.children[i]);
    }
  };

  Scene.prototype.cancelRender = function cancelRender() {
    this.renderer.cancelRender();
  };

  Scene.prototype.render = function render(perFrameFunctions) {
    this.renderer.render(this.scene, this.camera.cam, perFrameFunctions);
  };

  return Scene;
}();

var throttle = require('lodash.throttle');

//hold a reference to all drawings so that they can be reset easily
var drawings = {};

var resetDrawings = function () {
  Object.keys(drawings).forEach(function (key) {
    drawings[key].reset();
  });
};

window.addEventListener('resize', throttle(function () {
  resetDrawings();
}, 500), false);

// *****************************************************************************
//
//  DRAWING CLASS
//
// *****************************************************************************
var Drawing = function () {
  function Drawing(rendererSpec, cameraSpec) {
    classCallCheck(this, Drawing);

    this.scene = new Scene(rendererSpec, cameraSpec);
    this.camera = this.scene.camera;

    this.uuid = THREE.Math.generateUUID();
    drawings[this.uuid] = this;

    this.perFrameFunctions = [];

    this.init();
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions


  Drawing.prototype.reset = function reset() {
    this.scene.reset();
    this.init();
  };

  Drawing.prototype.render = function render() {
    this.scene.render(this.perFrameFunctions);
  };

  Drawing.prototype.cancelRender = function cancelRender() {
    this.scene.renderer.cancelRender();
  };

  return Drawing;
}();

// *****************************************************************************
// Perform various initialisation checks and setup
// *****************************************************************************
var moduleName = 'unnamedTHREESetupModule';
//TODO: turn check functions into proper checks
var checkTHREELoaded = function () {
  if (typeof THREE === 'undefined') {
    var msg = moduleName + ' Error: THREE not loaded. THREE.js must be loaded before this module\n';
    msg += 'Try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

checkTHREELoaded();

var checkHeartcodeLoaded = function () {
  if (typeof CanvasLoader === 'undefined') {
    var msg = moduleName + ' Error: HeartcodeLoader not loaded.\n';
    msg += 'If you do not wish to use HeartcodeLoader set ' + moduleName + '.config.useHeartcodeLoader = false\n';
    msg += 'Otherwise get https://raw.githubusercontent.com/heartcode/';
    msg += 'CanvasLoader/master/js/heartcode-canvasloader-min.js\n';
    msg += 'and add <script src="path-to-script/heartcode-canvasloader-min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
    return false;
  }
  return true;
};

var checkStatsLoaded = function () {
  if (typeof Stats === 'undefined') {
    var msg = moduleName + ' Error: Stats not loaded.\n';
    msg += 'If you do not wish to show Stats set ' + moduleName + '.config.showStats = false\n';
    msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
    msg += 'and add <script src="path-to-script/stats.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
    config.showStats = false;
  }
};

var init = function () {
  if (config.showHeartcodeLoader) {
    if (checkHeartcodeLoaded()) {
      initHeartcodeLoader();
    }
  }

  if (config.showStats) checkStatsLoaded();

  config.initCalled = true;
};

module.exports = {
  init: init,
  config: config,
  MeshObject: MeshObject,
  Drawing: Drawing
};