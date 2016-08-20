(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

// import {
//   textureLoader,
// }
// from './loaders/textureLoader';
// *****************************************************************************
// OBJECTS SUPERCLASS
// Objects are used by drawings and each return a THREE.Object3D
// (Mesh, Sprite etc.)
// This can then be added within a drawing with this.scene.add(object)
// *****************************************************************************
//TODO: rename this class
var Object$1 = function () {
  function Object(spec) {
    classCallCheck(this, Object);

    this.spec = spec || {};

    this.spec.color = this.spec.color || 0xffffff;

    this.init();
    if (this.spec.layer) {
      this.mesh.layers.set(this.spec.layer);
    }

    return this.mesh;
  }

  Object.prototype.createMesh = function createMesh(geometry, material) {
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // loadTexture(url) {
  //   return textureLoader(url);
  // }


  return Object;
}();

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
// The spec object can be omitted for the following defaults
// const spec = {
//   containerElem: canvasElem, // omit for THREE js default
//   antialias: true, ,
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
    var rendererOptions = {
      antialias: this.spec.antialias,
      //required for multiple scenes and various other effects
      alpha: this.spec.alpha
    };
    if (this.spec.containerElem) {
      rendererOptions.canvas = this.spec.containerElem;
      this.renderer = new THREE.WebGLRenderer(rendererOptions);
    } else {
      this.renderer = new THREE.WebGLRenderer(rendererOptions);
      document.body.appendChild(this.renderer.domElement);
    }

    this.setRenderer();
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

  Renderer.prototype.showStats = function showStats() {
    if (typeof Stats === 'function') {
      if (this.stats) return; //don't create stats more than once
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    } else {
      console.warn('https://github.com/mrdoob/stats.js must be included for stats to work');
    }
  };

  Renderer.prototype.render = function render(scene, camera) {
    var showStats = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (showStats) this.showStats();
    this.renderer.setClearColor(this.spec.clearColor, this.spec.clearAlpha);
    //if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, scene, camera);
    this.animate(scene, camera);
  };

  Renderer.prototype.cancelRender = function cancelRender() {
    TweenLite.ticker.removeEventListener('tick', this.renderHandler);
    this.renderer.clear();
  };

  Renderer.prototype.animate = function animate(scene, camera) {
    var _this = this;

    this.renderHandler = function () {
      if (_this.stats) _this.stats.update();
      //if (this.spec.postprocessing) this.postRenderer.composer.render();
      else _this.renderer.render(scene, camera);
    };

    TweenLite.ticker.addEventListener('tick', this.renderHandler);
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
//    position: new THREE.Vector3(0, 0, 0),
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

    this.spec = spec;
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
      this.cam.left = -this.spec.width / 2;
      this.cam.right = this.spec.width / 2;
      this.cam.top = this.spec.height / 2;
      this.cam.bottom = -this.spec.height / 2;
    }
    this.cam.position.copy(this.spec.position());
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

var Scene = function () {
  function Scene(cameraSpec, rendererSpec) {
    classCallCheck(this, Scene);

    this.cameraSpec = cameraSpec;
    this.rendererSpec = rendererSpec;
    this.init();
  }

  Scene.prototype.init = function init() {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.cameraSpec);
    this.scene.add(this.camera.cam);

    //used to add Orbit Controls to the camera
    this.camera.cam.userData.domElement = this.rendererSpec.containerElem;

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

  Scene.prototype.render = function render(showStats) {
    this.renderer.render(this.scene, this.camera.cam, showStats);
  };

  return Scene;
}();

var Drawing = function () {
  function Drawing(cameraSpec, rendererSpec) {
    classCallCheck(this, Drawing);

    this.scene = new Scene(cameraSpec, rendererSpec);
    this.camera = this.scene.camera;
    this.uuid = THREE.Math.generateUUID();
    this.init();
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions


  Drawing.prototype.reset = function reset() {
    this.scene.reset();
    this.init();
  };

  Drawing.prototype.render = function render(showStats) {
    this.scene.render(showStats);
  };

  Drawing.prototype.cancelRender = function cancelRender() {
    this.scene.renderer.cancelRender();
  };

  return Drawing;
}();

var config = {
  useGSAP: true,
  useHeartcodeLoader: true,
  showStats: true
};

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

var checkGSAPLoaded = function () {
  if (typeof TweenLite === 'undefined') {
    var msg = moduleName + ' Error: GSAP not loaded.\n';
    msg += 'If you do not wish to use GSAP set ' + moduleName + '.config.useGSAP = false\n';
    msg += 'Otherwise try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

var checkHeartcodeLoaded = function () {
  if (typeof CanvasLoader === 'undefined') {
    var msg = moduleName + ' Error: HeartcodeLoader not loaded.\n';
    msg += 'If you do not wish to use HeartcodeLoader set ' + moduleName + '.config.useHeartcodeLoader = false\n';
    msg += 'Otherwise get https://raw.githubusercontent.com/heartcode/';
    msg += 'CanvasLoader/master/js/heartcode-canvasloader-min.js\n';
    msg += 'and add <script src="path-to-script/heartcode-canvasloader-min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

var checkStatsLoaded = function () {
  if (typeof Stats === 'undefined') {
    var msg = moduleName + ' Error: Stats not loaded.\n';
    msg += 'If you do not wish to show Stats set ' + moduleName + '.config.showStats = false\n';
    msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
    msg += 'and add <script src="path-to-script/stats.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

var init = function () {
  if (config.useGSAP) checkGSAPLoaded();
  if (config.useHeartcodeLoader) {
    //TODO: automatically add elem for loader
    checkHeartcodeLoaded();
  }
  if (config.showStats) checkStatsLoaded();
};

module.exports = {
  init: init,
  config: config,
  Object: Object$1,
  Drawing: Drawing
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbi8vIGltcG9ydCB7XG4vLyAgIHRleHR1cmVMb2FkZXIsXG4vLyB9XG4vLyBmcm9tICcuL2xvYWRlcnMvdGV4dHVyZUxvYWRlcic7XG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gT0JKRUNUUyBTVVBFUkNMQVNTXG4vLyBPYmplY3RzIGFyZSB1c2VkIGJ5IGRyYXdpbmdzIGFuZCBlYWNoIHJldHVybiBhIFRIUkVFLk9iamVjdDNEXG4vLyAoTWVzaCwgU3ByaXRlIGV0Yy4pXG4vLyBUaGlzIGNhbiB0aGVuIGJlIGFkZGVkIHdpdGhpbiBhIGRyYXdpbmcgd2l0aCB0aGlzLnNjZW5lLmFkZChvYmplY3QpXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy9UT0RPOiByZW5hbWUgdGhpcyBjbGFzc1xudmFyIE9iamVjdCQxID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBPYmplY3Qoc3BlYykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIE9iamVjdCk7XG5cbiAgICB0aGlzLnNwZWMgPSBzcGVjIHx8IHt9O1xuXG4gICAgdGhpcy5zcGVjLmNvbG9yID0gdGhpcy5zcGVjLmNvbG9yIHx8IDB4ZmZmZmZmO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gICAgaWYgKHRoaXMuc3BlYy5sYXllcikge1xuICAgICAgdGhpcy5tZXNoLmxheWVycy5zZXQodGhpcy5zcGVjLmxheWVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tZXNoO1xuICB9XG5cbiAgT2JqZWN0LnByb3RvdHlwZS5jcmVhdGVNZXNoID0gZnVuY3Rpb24gY3JlYXRlTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgcmV0dXJuIG1lc2g7XG4gIH07XG5cbiAgLy8gbG9hZFRleHR1cmUodXJsKSB7XG4gIC8vICAgcmV0dXJuIHRleHR1cmVMb2FkZXIodXJsKTtcbiAgLy8gfVxuXG5cbiAgcmV0dXJuIE9iamVjdDtcbn0oKTtcblxuLy8gaW1wb3J0IHtcbi8vICAgUG9zdHByb2Nlc3NpbmcsXG4vLyB9XG4vLyBmcm9tICcuL3Bvc3Rwcm9jZXNzaW5nJztcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBSRU5ERVJFUiBDTEFTU1xuLy9cbi8vIENyZWF0ZSBhIFRIUkVFLmpzIHJlbmRlcmVyIGFuZCBhZGQgcG9zdHByb2Nlc3NpbmcgaWYgcmVxdWlyZWRcbi8vIEVhY2ggc2NlbmUgY3VycmVudGx5IG5lZWRzIGEgdW5pcXVlIHJlbmRlcmVyIGFuZCBhc3NvY2lhdGVkIEhUTUwgQ2FudmFzXG4vLyBlbGVtIGZvciB0aGUgY2FuY2VsUmVuZGVyIGZ1bmN0aW9uIHRvIHdvcmtcbi8vIFRoZSBjb250YWluZXIgZWxlbSBjYW4gYmUgb21pdHRlZCBpZiB1c2luZyBvbmx5IG9uZSBzY2VuZSBhcyB0aGUgZGVmYXVsdFxuLy8gd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGFkZGVkXG4vLyBOT1RFOiBDdXJyZW50bHkgdXNpbmcgVHdlZW5NYXggdGlja2VyIGZvciBhbmltYXRpb24gc28gdGhlIGdzYXAgZmlsZXMgbXVzdFxuLy8gYmUgaW5jbHVkZWRcbi8vXG4vLyBUaGUgc3BlYyBvYmplY3QgY2FuIGJlIG9taXR0ZWQgZm9yIHRoZSBmb2xsb3dpbmcgZGVmYXVsdHNcbi8vIGNvbnN0IHNwZWMgPSB7XG4vLyAgIGNvbnRhaW5lckVsZW06IGNhbnZhc0VsZW0sIC8vIG9taXQgZm9yIFRIUkVFIGpzIGRlZmF1bHRcbi8vICAgYW50aWFsaWFzOiB0cnVlLCAsXG4vLyAgIGFscGhhOiBmYWxzZSwgLy90cnVlIHJlcXVpcmVkIGZvciBtdWx0aXBsZSBzY2VuZXNcbi8vICAgYXV0b0NsZWFyOiB0cnVlLCAvL2ZhbHNlIHJlcXVpcmVkIGZvciBtdWx0aXBsZSBzY2VuZXNcbi8vICAgY2xlYXJDb2xvcjogMHgwMDAwMDAsXG4vLyAgIGNsZWFyQWxwaGE6IDAsXG4vLyAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbi8vICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4vLyAgIHBpeGVsUmF0aW86IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLFxuLy8gfTtcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG52YXIgUmVuZGVyZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlbmRlcmVyKHNwZWMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBSZW5kZXJlcik7XG5cbiAgICB0aGlzLnNwZWMgPSBzcGVjIHx8IHt9O1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHRoaXMuaW5pdFBhcmFtcygpO1xuICAgIHZhciByZW5kZXJlck9wdGlvbnMgPSB7XG4gICAgICBhbnRpYWxpYXM6IHRoaXMuc3BlYy5hbnRpYWxpYXMsXG4gICAgICAvL3JlcXVpcmVkIGZvciBtdWx0aXBsZSBzY2VuZXMgYW5kIHZhcmlvdXMgb3RoZXIgZWZmZWN0c1xuICAgICAgYWxwaGE6IHRoaXMuc3BlYy5hbHBoYVxuICAgIH07XG4gICAgaWYgKHRoaXMuc3BlYy5jb250YWluZXJFbGVtKSB7XG4gICAgICByZW5kZXJlck9wdGlvbnMuY2FudmFzID0gdGhpcy5zcGVjLmNvbnRhaW5lckVsZW07XG4gICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIocmVuZGVyZXJPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRSZW5kZXJlcigpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5pbml0UGFyYW1zID0gZnVuY3Rpb24gaW5pdFBhcmFtcygpIHtcbiAgICBpZiAoIXRoaXMuc3BlYy5wb3N0cHJvY2Vzc2luZykgdGhpcy5zcGVjLnBvc3Rwcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgaWYgKCF0aGlzLnNwZWMuYW50aWFsaWFzKSB0aGlzLnNwZWMuYW50aWFsaWFzID0gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuc3BlYy5hbHBoYSkgdGhpcy5zcGVjLmFscGhhID0gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuc3BlYy5hdXRvQ2xlYXIpIHRoaXMuc3BlYy5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICB0aGlzLnNwZWMuY2xlYXJDb2xvciA9IHRoaXMuc3BlYy5jbGVhckNvbG9yIHx8IDB4MDAwMDAwO1xuICAgIHRoaXMuc3BlYy5jbGVhckFscGhhID0gdGhpcy5zcGVjLmNsZWFyQWxwaGEgfHwgMS4wO1xuICAgIHZhciB3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIH07XG4gICAgdGhpcy5zcGVjLndpZHRoID0gdGhpcy5zcGVjLndpZHRoIHx8IHc7XG4gICAgdmFyIGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH07XG4gICAgdGhpcy5zcGVjLmhlaWdodCA9IHRoaXMuc3BlYy5oZWlnaHQgfHwgaDtcbiAgICB0aGlzLnNwZWMucGl4ZWxSYXRpbyA9IHRoaXMuc3BlYy5waXhlbFJhdGlvIHx8IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gc2V0U2l6ZSgpIHtcbiAgICB2YXIgdyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHRoaXMuc3BlYy53aWR0aCgpIDogYXJndW1lbnRzWzBdO1xuICAgIHZhciBoID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gdGhpcy5zcGVjLmhlaWdodCgpIDogYXJndW1lbnRzWzFdO1xuXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHcsIGgpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5zZXRSZW5kZXJlciA9IGZ1bmN0aW9uIHNldFJlbmRlcmVyKCkge1xuICAgIHRoaXMucmVuZGVyZXIuYXV0b0NsZWFyID0gdGhpcy5zcGVjLmF1dG9DbGVhcjtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IodGhpcy5zcGVjLmNsZWFyQ29sb3IsIHRoaXMuc3BlYy5jbGVhckFscGhhKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUodGhpcy5zcGVjLndpZHRoLCB0aGlzLnNwZWMuaGVpZ2h0KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8odGhpcy5zcGVjLnBpeGVsUmF0aW8pO1xuICAgIHRoaXMuc2V0U2l6ZSh0aGlzLnNwZWMud2lkdGgoKSwgdGhpcy5zcGVjLmhlaWdodCgpKTtcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuc2hvd1N0YXRzID0gZnVuY3Rpb24gc2hvd1N0YXRzKCkge1xuICAgIGlmICh0eXBlb2YgU3RhdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRzKSByZXR1cm47IC8vZG9uJ3QgY3JlYXRlIHN0YXRzIG1vcmUgdGhhbiBvbmNlXG4gICAgICB0aGlzLnN0YXRzID0gbmV3IFN0YXRzKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuc3RhdHMuZG9tKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzIG11c3QgYmUgaW5jbHVkZWQgZm9yIHN0YXRzIHRvIHdvcmsnKTtcbiAgICB9XG4gIH07XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihzY2VuZSwgY2FtZXJhKSB7XG4gICAgdmFyIHNob3dTdGF0cyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzJdO1xuXG4gICAgaWYgKHNob3dTdGF0cykgdGhpcy5zaG93U3RhdHMoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IodGhpcy5zcGVjLmNsZWFyQ29sb3IsIHRoaXMuc3BlYy5jbGVhckFscGhhKTtcbiAgICAvL2lmICh0aGlzLnNwZWMucG9zdHByb2Nlc3NpbmcpIHRoaXMucG9zdFJlbmRlcmVyID0gbmV3IFBvc3Rwcm9jZXNzaW5nKHRoaXMucmVuZGVyZXIsIHNjZW5lLCBjYW1lcmEpO1xuICAgIHRoaXMuYW5pbWF0ZShzY2VuZSwgY2FtZXJhKTtcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuY2FuY2VsUmVuZGVyID0gZnVuY3Rpb24gY2FuY2VsUmVuZGVyKCkge1xuICAgIFR3ZWVuTGl0ZS50aWNrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndGljaycsIHRoaXMucmVuZGVySGFuZGxlcik7XG4gICAgdGhpcy5yZW5kZXJlci5jbGVhcigpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24gYW5pbWF0ZShzY2VuZSwgY2FtZXJhKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMucmVuZGVySGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChfdGhpcy5zdGF0cykgX3RoaXMuc3RhdHMudXBkYXRlKCk7XG4gICAgICAvL2lmICh0aGlzLnNwZWMucG9zdHByb2Nlc3NpbmcpIHRoaXMucG9zdFJlbmRlcmVyLmNvbXBvc2VyLnJlbmRlcigpO1xuICAgICAgZWxzZSBfdGhpcy5yZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgfTtcblxuICAgIFR3ZWVuTGl0ZS50aWNrZXIuYWRkRXZlbnRMaXN0ZW5lcigndGljaycsIHRoaXMucmVuZGVySGFuZGxlcik7XG4gIH07XG5cbiAgcmV0dXJuIFJlbmRlcmVyO1xufSgpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gIENBTUVSQSBDTEFTU1xuLy9cbi8vICBVc2VkIGJ5IFNjZW5lIGNsYXNzIC0gZWFjaCBzY2VuZSB3aWxsIGhhdmUgYW4gYXNzb2NpYXRlZCBjYW1lcmEgY2xhc3Ncbi8vXG4vLyAgVGhlIGZvbGxvd2luZyBzcGVjIGlzIG9wdGlvbmFsIGFuZCBjYW4gYmUgb21pdHRlZCBmb3IgdGhlIGRlZmF1bHRzIHNob3duXG4vLyAgY29uc3QgY2FtZXJhU3BlYyA9IHtcbi8vICAgIHR5cGU6ICdQZXJzcGVjdGl2ZUNhbWVyYScsIC8vT3IgJ09ydGhvZ3JhcGhpY0NhbWVyYSdcbi8vICAgIG5lYXI6IDEwLFxuLy8gICAgZmFyOiAtMTAsXG4vLyAgICBwb3NpdGlvbjogbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCksXG4vLyAgICAvL1BlcnNwZWN0aXZlQ2FtZXJhIG9ubHlcbi8vICAgIGZvdjogNDUsIC8vUGVyc3BlY3RpdmVDYW1lcmEgb25seVxuLy8gICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbi8vICAgIC8vIE9ydGhvZ3JhcGhpY0NhbWVyYSBvbmx5XG4vLyAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4vLyAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbi8vICB9O1xudmFyIENhbWVyYSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ2FtZXJhKHNwZWMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDYW1lcmEpO1xuXG4gICAgdGhpcy5zcGVjID0gc3BlYztcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIENhbWVyYS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdGhpcy5pbml0UGFyYW1zKCk7XG5cbiAgICBpZiAodGhpcy5zcGVjLnR5cGUgPT09ICdQZXJzcGVjdGl2ZUNhbWVyYScpIHtcbiAgICAgIHRoaXMuY2FtID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FtID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgpO1xuICAgIH1cbiAgICB0aGlzLnNldCgpO1xuICB9O1xuXG4gIENhbWVyYS5wcm90b3R5cGUuaW5pdFBhcmFtcyA9IGZ1bmN0aW9uIGluaXRQYXJhbXMoKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgfTtcbiAgICB0aGlzLnNwZWMucG9zaXRpb24gPSB0aGlzLnNwZWMucG9zaXRpb24gfHwgcG9zaXRpb247XG4gICAgdGhpcy5zcGVjLm5lYXIgPSB0aGlzLnNwZWMubmVhciB8fCAxMDtcbiAgICB0aGlzLnNwZWMuZmFyID0gdGhpcy5zcGVjLmZhciB8fCAtMTA7XG4gICAgdGhpcy5zcGVjLnR5cGUgPSB0aGlzLnNwZWMudHlwZSB8fCAnUGVyc3BlY3RpdmVDYW1lcmEnO1xuICAgIGlmICh0aGlzLnNwZWMudHlwZSA9PT0gJ1BlcnNwZWN0aXZlQ2FtZXJhJykge1xuICAgICAgdGhpcy5zcGVjLmZvdiA9IHRoaXMuc3BlYy5mb3YgfHwgNDU7XG4gICAgICB2YXIgYXNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICB9O1xuICAgICAgdGhpcy5zcGVjLmFzcGVjdCA9IHRoaXMuc3BlYy5hc3BlY3QgfHwgYXNwZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgfTtcbiAgICAgIHRoaXMuc3BlYy53aWR0aCA9IHRoaXMuc3BlYy53aWR0aCB8fCB3O1xuICAgICAgdmFyIGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICB9O1xuICAgICAgdGhpcy5zcGVjLmhlaWdodCA9IHRoaXMuc3BlYy5oZWlnaHQgfHwgaDtcbiAgICB9XG4gIH07XG5cbiAgQ2FtZXJhLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoKSB7XG4gICAgaWYgKHRoaXMuc3BlYy50eXBlID09PSAnUGVyc3BlY3RpdmVDYW1lcmEnKSB7XG4gICAgICB0aGlzLmNhbS5mb3YgPSB0aGlzLnNwZWMuZm92O1xuICAgICAgdGhpcy5jYW0uYXNwZWN0ID0gdGhpcy5zcGVjLmFzcGVjdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhbS5sZWZ0ID0gLXRoaXMuc3BlYy53aWR0aCAvIDI7XG4gICAgICB0aGlzLmNhbS5yaWdodCA9IHRoaXMuc3BlYy53aWR0aCAvIDI7XG4gICAgICB0aGlzLmNhbS50b3AgPSB0aGlzLnNwZWMuaGVpZ2h0IC8gMjtcbiAgICAgIHRoaXMuY2FtLmJvdHRvbSA9IC10aGlzLnNwZWMuaGVpZ2h0IC8gMjtcbiAgICB9XG4gICAgdGhpcy5jYW0ucG9zaXRpb24uY29weSh0aGlzLnNwZWMucG9zaXRpb24oKSk7XG4gICAgdGhpcy5jYW0ubmVhciA9IHRoaXMuc3BlYy5uZWFyO1xuICAgIHRoaXMuY2FtLmZhciA9IHRoaXMuc3BlYy5mYXI7XG4gICAgdGhpcy5jYW0udXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB9O1xuXG4gIENhbWVyYS5wcm90b3R5cGUuZW5hYmxlTGF5ZXIgPSBmdW5jdGlvbiBlbmFibGVMYXllcihuKSB7XG4gICAgdGhpcy5jYW0ubGF5ZXJzLmVuYWJsZShuKTtcbiAgfTtcblxuICBDYW1lcmEucHJvdG90eXBlLmRpc2FibGVMYXllciA9IGZ1bmN0aW9uIGRpc2FibGVMYXllcihuKSB7XG4gICAgdGhpcy5jYW0ubGF5ZXJzLmRpc2FibGUobik7XG4gIH07XG5cbiAgQ2FtZXJhLnByb3RvdHlwZS50b2dnbGVMYXllciA9IGZ1bmN0aW9uIHRvZ2dsZUxheWVyKG4pIHtcbiAgICB0aGlzLmNhbS5sYXllcnMudG9nZ2xlKG4pO1xuICB9O1xuXG4gIHJldHVybiBDYW1lcmE7XG59KCk7XG5cbnZhciBTY2VuZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2NlbmUoY2FtZXJhU3BlYywgcmVuZGVyZXJTcGVjKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgU2NlbmUpO1xuXG4gICAgdGhpcy5jYW1lcmFTcGVjID0gY2FtZXJhU3BlYztcbiAgICB0aGlzLnJlbmRlcmVyU3BlYyA9IHJlbmRlcmVyU3BlYztcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIFNjZW5lLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgQ2FtZXJhKHRoaXMuY2FtZXJhU3BlYyk7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jYW1lcmEuY2FtKTtcblxuICAgIC8vdXNlZCB0byBhZGQgT3JiaXQgQ29udHJvbHMgdG8gdGhlIGNhbWVyYVxuICAgIHRoaXMuY2FtZXJhLmNhbS51c2VyRGF0YS5kb21FbGVtZW50ID0gdGhpcy5yZW5kZXJlclNwZWMuY29udGFpbmVyRWxlbTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIodGhpcy5yZW5kZXJlclNwZWMpO1xuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG9iamVjdHMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIG9iamVjdHNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gb2JqZWN0cywgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvciksIF9pID0gMCwgX2l0ZXJhdG9yID0gX2lzQXJyYXkgPyBfaXRlcmF0b3IgOiBfaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgIHZhciBfcmVmO1xuXG4gICAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgICAgaWYgKF9pID49IF9pdGVyYXRvci5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2kgPSBfaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoX2kuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWYgPSBfaS52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9iamVjdCA9IF9yZWY7XG5cbiAgICAgIHRoaXMuc2NlbmUuYWRkKG9iamVjdCk7XG4gICAgfVxuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIHRoaXMuY2xlYXJTY2VuZSgpO1xuICAgIHRoaXMuY2FtZXJhLnNldCgpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSgpO1xuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5jbGVhclNjZW5lID0gZnVuY3Rpb24gY2xlYXJTY2VuZSgpIHtcbiAgICBmb3IgKHZhciBpID0gdGhpcy5zY2VuZS5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5zY2VuZS5jaGlsZHJlbltpXSk7XG4gICAgfVxuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5jYW5jZWxSZW5kZXIgPSBmdW5jdGlvbiBjYW5jZWxSZW5kZXIoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5jYW5jZWxSZW5kZXIoKTtcbiAgfTtcblxuICBTY2VuZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKHNob3dTdGF0cykge1xuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhLmNhbSwgc2hvd1N0YXRzKTtcbiAgfTtcblxuICByZXR1cm4gU2NlbmU7XG59KCk7XG5cbnZhciBEcmF3aW5nID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEcmF3aW5nKGNhbWVyYVNwZWMsIHJlbmRlcmVyU3BlYykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIERyYXdpbmcpO1xuXG4gICAgdGhpcy5zY2VuZSA9IG5ldyBTY2VuZShjYW1lcmFTcGVjLCByZW5kZXJlclNwZWMpO1xuICAgIHRoaXMuY2FtZXJhID0gdGhpcy5zY2VuZS5jYW1lcmE7XG4gICAgdGhpcy51dWlkID0gVEhSRUUuTWF0aC5nZW5lcmF0ZVVVSUQoKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIC8vZ2V0cyBjYWxsZWQgb24gd2luZG93IHJlc2l6ZSBvciBvdGhlciBldmVudHMgdGhhdCByZXF1aXJlIHJlY2FsY3VsYXRpb24gb2ZcbiAgLy9vYmplY3QgZGltZW5zaW9uc1xuXG5cbiAgRHJhd2luZy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lLnJlc2V0KCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG5cbiAgRHJhd2luZy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKHNob3dTdGF0cykge1xuICAgIHRoaXMuc2NlbmUucmVuZGVyKHNob3dTdGF0cyk7XG4gIH07XG5cbiAgRHJhd2luZy5wcm90b3R5cGUuY2FuY2VsUmVuZGVyID0gZnVuY3Rpb24gY2FuY2VsUmVuZGVyKCkge1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2FuY2VsUmVuZGVyKCk7XG4gIH07XG5cbiAgcmV0dXJuIERyYXdpbmc7XG59KCk7XG5cbnZhciBjb25maWcgPSB7XG4gIHVzZUdTQVA6IHRydWUsXG4gIHVzZUhlYXJ0Y29kZUxvYWRlcjogdHJ1ZSxcbiAgc2hvd1N0YXRzOiB0cnVlXG59O1xuXG52YXIgbW9kdWxlTmFtZSA9ICd1bm5hbWVkVEhSRUVTZXR1cE1vZHVsZSc7XG4vL1RPRE86IHR1cm4gY2hlY2sgZnVuY3Rpb25zIGludG8gcHJvcGVyIGNoZWNrc1xudmFyIGNoZWNrVEhSRUVMb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVEhSRUUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBUSFJFRSBub3QgbG9hZGVkLiBUSFJFRS5qcyBtdXN0IGJlIGxvYWRlZCBiZWZvcmUgdGhpcyBtb2R1bGVcXG4nO1xuICAgIG1zZyArPSAnVHJ5IGFkZGluZyA8c2NyaXB0IHNyYz1cImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL3RocmVlLmpzL3I3OS90aHJlZS5taW4uanNcIj4nO1xuICAgIG1zZyArPSAnPC9zY3JpcHQ+IHRvIHlvdXIgPGhlYWQ+JztcbiAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gIH1cbn07XG5cbmNoZWNrVEhSRUVMb2FkZWQoKTtcblxudmFyIGNoZWNrR1NBUExvYWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBUd2VlbkxpdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBHU0FQIG5vdCBsb2FkZWQuXFxuJztcbiAgICBtc2cgKz0gJ0lmIHlvdSBkbyBub3Qgd2lzaCB0byB1c2UgR1NBUCBzZXQgJyArIG1vZHVsZU5hbWUgKyAnLmNvbmZpZy51c2VHU0FQID0gZmFsc2VcXG4nO1xuICAgIG1zZyArPSAnT3RoZXJ3aXNlIHRyeSBhZGRpbmcgPHNjcmlwdCBzcmM9XCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9nc2FwLzEuMTkuMC9Ud2Vlbk1heC5taW4uanNcIj4nO1xuICAgIG1zZyArPSAnPC9zY3JpcHQ+IHRvIHlvdXIgPGhlYWQ+JztcbiAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gIH1cbn07XG5cbnZhciBjaGVja0hlYXJ0Y29kZUxvYWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBDYW52YXNMb2FkZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBIZWFydGNvZGVMb2FkZXIgbm90IGxvYWRlZC5cXG4nO1xuICAgIG1zZyArPSAnSWYgeW91IGRvIG5vdCB3aXNoIHRvIHVzZSBIZWFydGNvZGVMb2FkZXIgc2V0ICcgKyBtb2R1bGVOYW1lICsgJy5jb25maWcudXNlSGVhcnRjb2RlTG9hZGVyID0gZmFsc2VcXG4nO1xuICAgIG1zZyArPSAnT3RoZXJ3aXNlIGdldCBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vaGVhcnRjb2RlLyc7XG4gICAgbXNnICs9ICdDYW52YXNMb2FkZXIvbWFzdGVyL2pzL2hlYXJ0Y29kZS1jYW52YXNsb2FkZXItbWluLmpzXFxuJztcbiAgICBtc2cgKz0gJ2FuZCBhZGQgPHNjcmlwdCBzcmM9XCJwYXRoLXRvLXNjcmlwdC9oZWFydGNvZGUtY2FudmFzbG9hZGVyLW1pbi5qc1wiPic7XG4gICAgbXNnICs9ICc8L3NjcmlwdD4gdG8geW91ciA8aGVhZD4nO1xuICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgfVxufTtcblxudmFyIGNoZWNrU3RhdHNMb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgU3RhdHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBTdGF0cyBub3QgbG9hZGVkLlxcbic7XG4gICAgbXNnICs9ICdJZiB5b3UgZG8gbm90IHdpc2ggdG8gc2hvdyBTdGF0cyBzZXQgJyArIG1vZHVsZU5hbWUgKyAnLmNvbmZpZy5zaG93U3RhdHMgPSBmYWxzZVxcbic7XG4gICAgbXNnICs9ICdPdGhlcndpc2UgZ2V0IGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tcmRvb2Ivc3RhdHMuanMvbWFzdGVyL2J1aWxkL3N0YXRzLm1pbi5qc1xcbic7XG4gICAgbXNnICs9ICdhbmQgYWRkIDxzY3JpcHQgc3JjPVwicGF0aC10by1zY3JpcHQvc3RhdHMubWluLmpzXCI+JztcbiAgICBtc2cgKz0gJzwvc2NyaXB0PiB0byB5b3VyIDxoZWFkPic7XG4gICAgY29uc29sZS5lcnJvcihtc2cpO1xuICB9XG59O1xuXG52YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKGNvbmZpZy51c2VHU0FQKSBjaGVja0dTQVBMb2FkZWQoKTtcbiAgaWYgKGNvbmZpZy51c2VIZWFydGNvZGVMb2FkZXIpIHtcbiAgICAvL1RPRE86IGF1dG9tYXRpY2FsbHkgYWRkIGVsZW0gZm9yIGxvYWRlclxuICAgIGNoZWNrSGVhcnRjb2RlTG9hZGVkKCk7XG4gIH1cbiAgaWYgKGNvbmZpZy5zaG93U3RhdHMpIGNoZWNrU3RhdHNMb2FkZWQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0OiBpbml0LFxuICBjb25maWc6IGNvbmZpZyxcbiAgT2JqZWN0OiBPYmplY3QkMSxcbiAgRHJhd2luZzogRHJhd2luZ1xufTsiXX0=
