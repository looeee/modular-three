(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.modularTHREE = factory());
}(this, (function () { 'use strict';

// *****************************************************************************
//  Texture Loader
//  includes simple memoization to ensure
//  THREE.TextureLoader() and textures are only loaded once
// *****************************************************************************
var loader = null;

var textures = {};

function textureLoader(url) {
  if (!loader) {
    if (modularTHREE.config.useLoadingManager) {
      loader = new THREE.TextureLoader(modularTHREE.loadingManager);
    } else loader = new THREE.TextureLoader();
  }

  if (!textures[url]) textures[url] = loader.load(url);

  return textures[url];
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

// *****************************************************************************
// MESH OBJECT SUPERCLASS
// Superclass for any THREE.js mesh object. Returns a THREE mesh
// *****************************************************************************
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

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;
var nativeMin = Math.min;
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

var warnIfConfigUpdatedAfterInit = function () {
  console.warn('Config setting should be set before calling ModularTHREE.init()');
};

var config = {
  initCalled: false,

  loadingManager: false,
  get useLoadingManager() {
    return this.loadingManager;
  },
  set useLoadingManager(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.loadingManager = value;
  }
};

// *****************************************************************************
// POSTPROCESSING CLASS
// Post effects for THREE.js
// Set postprocessing = true in renderSpec for a drawing to render with post effects
// *****************************************************************************
var Postprocessing = function () {
  function Postprocessing(renderer, scene, camera) {
    classCallCheck(this, Postprocessing);

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.init();
  }

  Postprocessing.prototype.init = function init() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.composer.passes[0].renderToScreen = true;
  };

  Postprocessing.prototype.addShader = function addShader(shader) {
    var uniforms = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var pass = new THREE.ShaderPass(shader);

    Object.keys(uniforms).forEach(function (key) {
      pass.uniforms[key].value = uniforms[key];
    });
    this.composer.addPass(pass);
    this.setRenderToScreen();
  };

  Postprocessing.prototype.addEffect = function addEffect(effect) {
    this.composer.addPass(effect);
    this.setRenderToScreen();
  };

  //Set renderToScreen = true for the last effect added


  Postprocessing.prototype.setRenderToScreen = function setRenderToScreen() {
    var len = this.composer.passes.length;
    this.composer.passes[len - 2].renderToScreen = false;
    this.composer.passes[len - 1].renderToScreen = true;
  };

  Postprocessing.prototype.reset = function reset() {
    this.composer.reset();
  };

  Postprocessing.prototype.render = function render() {
    this.composer.render();
  };

  return Postprocessing;
}();

var checkStatsLoaded = function () {
  if (typeof Stats === 'undefined') {
    var msg = 'modularTHREE Error: Stats not loaded.\n';
    msg += 'If you do not wish to show Stats set rendererSpec.showStats = false\n';
    msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
    msg += 'and add it to your build.';
    console.error(msg);
    return false;
  }
  return true;
};

var checkGSAPLoaded = function () {
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

var checkIfCanvasExists = function (id) {
  if (document.querySelector('#' + id)) {
    var msg = 'Warning: an element with id ' + id + ' already exists.\n';
    msg += 'Either it was created manually or you have two Drawings with the same id. \n';
    msg += 'Rendering multiple Drawings to the same <canvas> element will cause problems.';
    console.warn(msg);
    return true;
  }
  return false;
};

// *****************************************************************************
// RENDERER CLASS
//
// Create a THREE.js renderer and add postprocessing if required
// Each scene currently needs a unique renderer and associated HTML Canvas
// elem for the cancelRender function to work
// The container elem can be omitted if using only one scene as the default
// will be automatically added
//
// *****************************************************************************
var Renderer = function () {
  function Renderer(spec, scene, camera) {
    classCallCheck(this, Renderer);

    this.spec = spec;
    this.scene = scene;
    this.camera = camera;
    this.init();
  }

  Renderer.prototype.init = function init() {
    this.initRenderer();
    this.setRenderer();

    if (this.spec.showStats) this.initStats();
    if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, this.scene, this.camera);
  };

  Renderer.prototype.initRenderer = function initRenderer() {
    var rendererOptions = {
      antialias: this.spec.antialias,
      alpha: this.spec.alpha
    };

    if (this.spec.canvasID) {
      if (checkIfCanvasExists(this.spec.canvasID)) {
        rendererOptions.canvas = document.querySelector('#' + this.spec.canvasID);
      } else {
        rendererOptions.canvas = document.createElement('canvas');
        rendererOptions.canvas.id = this.spec.canvasID;
      }
    }

    this.renderer = new THREE.WebGLRenderer(rendererOptions);

    if (!this.spec.canvasID || !document.querySelector('#' + this.renderer.domElement.id)) {
      document.body.appendChild(this.renderer.domElement);
    }
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
    if (!checkStatsLoaded()) {
      this.spec.showStats = false;
    } else {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  };

  Renderer.prototype.render = function render(perFrameFunctions) {
    if (this.spec.useGSAP && checkGSAPLoaded()) {
      this.animateWithGSAP(perFrameFunctions);
    } else {
      this.animateWithTHREE(perFrameFunctions);
    }
  };

  Renderer.prototype.animateWithGSAP = function animateWithGSAP(perFrameFunctions) {
    var _this = this;

    var renderHandler = function () {
      for (var i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (_this.stats) _this.stats.update();
      if (_this.postRenderer) _this.postRenderer.render();else _this.renderer.render(_this.scene, _this.camera);
    };

    TweenLite.ticker.addEventListener('tick', renderHandler);
    this.usingGSAP = true;
  };

  Renderer.prototype.animateWithTHREE = function animateWithTHREE(perFrameFunctions) {
    var _this2 = this;

    var renderHandler = function () {
      _this2.animationFrame = requestAnimationFrame(renderHandler);

      for (var i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (_this2.stats) _this2.stats.update();
      if (_this2.postRenderer) _this2.postRenderer.render();else _this2.renderer.render(_this2.scene, _this2.camera);
    };

    renderHandler();
  };

  Renderer.prototype.cancelRender = function cancelRender() {
    if (this.usingGSAP) TweenLite.ticker.removeEventListener('tick', this.renderHandler);else cancelAnimationFrame(this.animationFrame);
    this.renderer.clear();
    this.usingGSAP = false;
  };

  return Renderer;
}();

// *****************************************************************************
//  THREE JSON object format loader
//  includes simple memoization to ensure
//  THREE.ObjectLoader() and models are only loaded once
//  NOTE: currently does not return a reference to the loaded model
// *****************************************************************************
var loader$1 = null;

var models = {};

var setupLoader = function () {
  if (!loader$1) {
    if (modularTHREE.config.useLoadingManager) {
      loader$1 = new THREE.ObjectLoader(modularTHREE.loadingManager);
    } else loader$1 = new THREE.ObjectLoader();
  }
};

var promiseLoader = function (url) {
  return new Promise(function (resolve, reject) {
    if (!models[url]) loader$1.load(url, resolve);else resolve(models[url]);
  });
};

function objectLoader(url) {
  setupLoader();

  return promiseLoader(url).then(function (object) {
    if (!models[url]) models[url] = object;
    return object;
  });
}

// The exporter currently exports a scene object rather than just a single
// mesh; traverse the loadedObject and find this mesh
// const getMesh = (loadedObject) => {
//   let mesh;
//   loadedObject.traverse((object) => {
//     if (object instanceof THREE.Mesh) {
//       mesh = object;
//       mesh.animations = loadedObject.animations;
//     }
//   });
//
//   if (mesh === undefined) {
//     console.warn(`${url} does not contain a THREE.Mesh.`);
//   }
//   return mesh;
// };

//hold a reference to all drawings so that they can be reset easily
var drawings = {};

var resetDrawings = function () {
  Object.keys(drawings).forEach(function (key) {
    return drawings[key].reset();
  });
};

window.addEventListener('resize', throttle(function () {
  return resetDrawings();
}, 500), false);

// *****************************************************************************
//
//  DRAWING CLASS
//
// *****************************************************************************
var Drawing = function () {
  function Drawing(rendererSpec, cameraSpec) {
    classCallCheck(this, Drawing);

    this.rendererSpec = rendererSpec || {};
    this.cameraSpec = cameraSpec || {};
    this.initRendererSpec();
    this.initCameraSpec();

    this.uuid = THREE.Math.generateUUID();
    drawings[this.uuid] = this;

    this.perFrameFunctions = [];

    this.initCamera();
    this.initScene();
    this.initRenderer();

    this.init();
  }

  Drawing.prototype.initRendererSpec = function initRendererSpec() {
    if (this.rendererSpec.showStats === undefined) this.rendererSpec.showStats = false;
    if (this.rendererSpec.useGSAP === undefined) this.rendererSpec.useGSAP = false;
    if (this.rendererSpec.postprocessing === undefined) this.rendererSpec.postprocessing = false;
    if (this.rendererSpec.antialias === undefined) this.rendererSpec.antialias = true;
    if (this.rendererSpec.alpha === undefined) this.rendererSpec.alpha = true;
    if (this.rendererSpec.autoClear === undefined) this.rendererSpec.autoClear = true;
    if (this.rendererSpec.clearColor === undefined) this.rendererSpec.clearColor = 0x000000;
    if (this.rendererSpec.clearAlph === undefined) this.rendererSpec.clearAlpha = 1.0;
    if (this.rendererSpec.width === undefined) this.rendererSpec.width = function () {
      return window.innerWidth;
    };
    if (this.rendererSpec.height === undefined) this.rendererSpec.height = function () {
      return window.innerHeight;
    };
    if (this.rendererSpec.pixelRatio === undefined) this.rendererSpec.pixelRatio = window.devicePixelRatio;
  };

  Drawing.prototype.initCameraSpec = function initCameraSpec() {
    if (this.cameraSpec.type === undefined) this.cameraSpec.type = 'PerspectiveCamera';
    if (this.cameraSpec.near === undefined) this.cameraSpec.near = 10;
    if (this.cameraSpec.far === undefined) this.cameraSpec.far = -10;
    if (this.cameraSpec.position === undefined) this.cameraSpec.position = new THREE.Vector3(0, 0, 100);

    if (this.cameraSpec.type === 'PerspectiveCamera') {
      if (this.cameraSpec.fov === undefined) this.cameraSpec.fov = 45;
      if (this.cameraSpec.aspect === undefined) this.cameraSpec.aspect = function () {
        return window.innerWidth / window.innerHeight;
      };
    } else {
      if (this.cameraSpec.width === undefined) this.cameraSpec.width = function () {
        return window.innerWidth;
      };
      if (this.cameraSpec.height === undefined) this.cameraSpec.height = function () {
        return window.innerHeight;
      };
    }
  };

  Drawing.prototype.initScene = function initScene() {
    this.scene = new THREE.Scene();

    this.scene.add(this.camera);
  };

  Drawing.prototype.initRenderer = function initRenderer() {
    this.renderer = new Renderer(this.rendererSpec, this.scene, this.camera);
    this.domElement = this.renderer.renderer.domElement;
  };

  Drawing.prototype.initCamera = function initCamera() {
    if (!this.camera) {
      if (this.cameraSpec.type === 'PerspectiveCamera') {
        this.camera = new THREE.PerspectiveCamera();
      } else {
        this.camera = new THREE.OrthographicCamera();
      }
    }

    if (this.cameraSpec.type === 'PerspectiveCamera') {
      this.camera.fov = this.cameraSpec.fov;
      this.camera.aspect = this.cameraSpec.aspect();
    } else {
      this.camera.left = -this.cameraSpec.width() / 2;
      this.camera.right = this.cameraSpec.width() / 2;
      this.camera.top = this.cameraSpec.height() / 2;
      this.camera.bottom = -this.cameraSpec.height() / 2;
    }
    this.camera.position.copy(this.cameraSpec.position);
    this.camera.near = this.cameraSpec.near;
    this.camera.far = this.cameraSpec.far;
    this.camera.updateProjectionMatrix();
  };

  Drawing.prototype.add = function add() {
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

  //gets called on window resize or other events that require recalculation of
  //object dimensions


  Drawing.prototype.reset = function reset() {
    this.clearScene();
    this.initCamera();
    this.renderer.setSize();
    this.init();
  };

  Drawing.prototype.clearScene = function clearScene() {
    for (var i = this.scene.children.length - 1; i >= 0; i--) {
      this.scene.remove(this.scene.children[i]);
    }
  };

  Drawing.prototype.cancelRender = function cancelRender() {
    this.renderer.cancelRender();
  };

  Drawing.prototype.render = function render() {
    this.renderer.render(this.perFrameFunctions);
  };

  Drawing.prototype.addPostShader = function addPostShader(shader, uniforms, renderToScreen) {
    if (!this.rendererSpec.postprocessing) return;
    this.scene.renderer.postRenderer.addShader(shader, uniforms, renderToScreen);
  };

  Drawing.prototype.addPostEffect = function addPostEffect(effect, renderToScreen) {
    if (!this.rendererSpec.postprocessing) return;
    this.scene.renderer.postRenderer.addEffect(effect, renderToScreen);
  };

  Drawing.prototype.addPerFrameFunction = function addPerFrameFunction(func) {
    if (typeof func === 'function') this.perFrameFunctions.push(func);else {
      var msg = 'modularTHREE.Drawing.perFrameFunctions() typeError:';
      msg += 'Attempting to add something that is not a function!';
      console.error(msg);
    }
  };

  Drawing.prototype.loadObject = function loadObject(url, callback) {
    var _this = this;

    if (callback === undefined) {
      callback = function (object) {
        return _this.add(object);
      };
    }
    return objectLoader(url, callback);
  };

  Drawing.prototype.initClock = function initClock() {
    if (!this.clock) this.clock = new THREE.Clock();
  };

  Drawing.prototype.initMixer = function initMixer() {
    var _this2 = this;

    this.mixer = new THREE.AnimationMixer(this.scene);

    this.initClock();

    if (this.rendererSpec.useGSAP === false) {
      this.addPerFrameFunction(function () {
        return _this2.mixer.update(_this2.clock.getDelta());
      });
    } else {
      TweenLite.ticker.addEventListener('tick', function () {
        return _this2.mixer.update(_this2.clock.getDelta());
      });
    }
  };

  createClass(Drawing, [{
    key: 'animationMixer',
    get: function () {
      if (!this.mixer) {
        this.initMixer();
      }

      return this.mixer;
    }
  }]);
  return Drawing;
}();

var init = function () {
  if (config.useLoadingManager) modularTHREE.loadingManager = new THREE.LoadingManager();
  config.initCalled = true;
};

var modularTHREE = {
  MeshObject: MeshObject,
  Drawing: Drawing,
  init: init,
  config: config,
  loadingManager: null
};

return modularTHREE;

})));