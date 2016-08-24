Modular THREE.js [![NPM version][npm-image]][npm-url]
========

Modular setup for THREE.js designed to be used with ES2015 and Browserify
(or some other tool that allow you to import modules in the browser).
To see it in action check out [**Modular THREE Boilerplate**](https://github.com/looeee/modular-three-boilerplate),
which includes a Gulp setup for compiling ES2015 with
[Browserify](http://browserify.org/),
[Rollup](http://rollupjs.org/) and [Babel](https://babeljs.io/),
as well as compiling and [autoprefixing](https://github.com/postcss/autoprefixer)
[SCSS](http://sass-lang.com/) and piping through [Livereload](http://livereload.com/)
to be used with [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/livereload/) livereload
plugins.


### NOTE: This is a very early build. More functionality will be added soon. ###

Installation
------

Run
```sh
$ npm install --save npm-module-test
```
from your project root folder.

Requirements
------

Load [THREE.js](http://threejs.org/).
The simplest way is to include ```<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js">```
in your ```<head>```.

Optional Addons
------

#####[**GSAP**](http://greensock.com/gsap) for animation / tweening. #####
Include ```<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js">```
in your ```<head>```. This is a more powerful animation library than the THREE.js default
which you may find useful.
You can add calls to custom per tick (frame) functions with

```js
TweenLite.ticker.addEventListener('tick', yourCustomAnimationFunction);
```

To enable set ```modularTHREE.config.useHeartcodeLoader = true``` before calling ```modularTHREE.init();```

##### [**HeartcodeLoader**](https://github.com/heartcode/CanvasLoader) #####
Show a customizeable loading spinner while models / textures are loading.
To enable it set ```modularTHREE.config.useHeartcodeLoader = true``` before calling ```modularTHREE.init();```
and include
```https://github.com/heartcode/CanvasLoader/blob/master/js/heartcode-canvasloader-min.js``` in your ```<head>```.

##### [**Stats**](https://github.com/mrdoob/stats.js/) #####
Show FPS and other stats on screen. To enable it set ```modularTHREE.config.showStats = true```
before calling ```modularTHREE.init();``` and include
```https://github.com/mrdoob/stats.js/blob/master/src/Stats.js``` in your ```<head>```.

Usage
------

First include Modular THREE at the start of any files that use it like so:
```js
const modularTHREE = require('modular-three');
```

#### Optional
Set any config options and call ```modularTHREE.init()```. Note: ```init()``` only needs to be
called if you have changed any config defaults:
```js
//The following are the config defaults, only call init if you have changed these
modularTHREE.config.showStats = false;
modularTHREE.config.useGSAP = false;
modularTHREE.config.showHeartcodeLoader = false;

modularTHREE.init();
```

#### Creating a drawing ####

The first step in using modularTHREE is to create a Drawing, which has a
```THREE.Scene```, ```THREE.Camera``` and ```THREE.Renderer``` associated with
a unique ```<canvas>``` element.

Create a class that extends ```modularTHREE.Drawing```:

```js
class ExampleDrawing extends modularTHREE.Drawing {
  constructor(rendererSpec, cameraSpec) {
    super(rendererSpec, cameraSpec);
  }

  init() {
    //Code for creating objects and adding them to the scene goes here
    //The drawing is reset (all objects removed) and init() is called again
    //on screen resize (throttled using lodash.throttle to once per 500ms),
    //or you can call ExampleDrawing.reset() to do this manually.
  }
}
```

Then instantiate your ```Drawing``` and call it's ```render()``` function.
```js
const exampleDrawing = new ExampleDrawing();
//If you are passing in a rendererSpec, cameraSpec do this instead:
//const exampleDrawing = new ExampleDrawing(rendererSpec, cameraSpec);

exampleDrawing.render();
}
```

That's it! In just a couple of lines of code you should now have a (blank)
scene, which is fullscreen with a black background.

#### ```rendererSpec``` and ```cameraSpec```
For more control you can create ```rendererSpec``` and ```cameraSpec``` objects,
which have following options. If they are omitted the defaults shown will be used:

```js
const rendererSpec = {
  //unique canvasID required for multiple scenes
  canvasID: '', //TODO: add this functionality, including check that ID is unique
  antialias: true,
  alpha: true, //true required for multiple scenes
  autoClear: true, //false required for multiple scenes
  clearColor: 0x000000,
  clearAlpha: 0,
  width: () => window.innerWidth,
  height: () => window.innerHeight,
  pixelRatio: window.devicePixelRatio,
  postprocessing: false,
};
```

Note that ```canvasID```, ```alpha``` and ```autoClear``` **are** required if you are
using multiple scenes. If ```canvasID``` is omitted a default ```<canvas>``` element
will be created, and while it is possible to render more than one WebGL scene to a
single ```<canvas>``` element, this does not appear to have any performance benefits
and results in more complicated code so that approach is not used here.

```js
const cameraSpec = {
  type: 'PerspectiveCamera', //Or 'OrthographicCamera'
  near: 10,
  far: -10,
  position: new THREE.Vector3(0, 0, 100),
  //PerspectiveCamera only
  fov: 45, //PerspectiveCamera only
  aspect: () => window.innerWidth / window.innerHeight,
  // OrthographicCamera only
  width: () => window.innerWidth,
  height: () => window.innerHeight,
};
```

Note also that ```width```, ```height``` and ```aspect``` are passed in as functions.
This is because they are generally based on window dimensions, and this approach allows
them to be recalculated on window resize.

#### Adding Objects to the Drawing ####
ModularTHREE currently provides the MeshObject class, which memoizes texture loading
(so that textures are not reloaded when the scene is reset, for example on window resize)
and interfaces with the [THREE.LoadingManager](http://threejs.org/docs/?q=loading#Reference/Loaders/LoadingManager),
which can be used to provide a loading overlay, using for example  [**HeartcodeLoader**](https://github.com/heartcode/CanvasLoader),
or you own custom loader.

MeshObjects can be created like so:

```js
class Cube extends modularTHREE.MeshObject {
  constructor(spec) {
    super(spec);
  }

  init() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}
```

Again the spec here is optional, but can be used to pass in variables such as material,
dimension etc.

Next, update the ```init()``` function of your ```Drawing``` class to instantiate the cube.

```js
class ExampleDrawing extends modularTHREE.Drawing {
  constructor(rendererSpec, cameraSpec) {
    super(rendererSpec, cameraSpec);
  }

  init() {
    const cube = new Cube();
    this.scene.add(cube);
  }
}
```

And that's it! You should now have a small red cube in the middle of a black screen.


#### License MIT © Lewy Blue 2016 ####


[npm-image]: https://badge.fury.io/js/modular-three.svg
[npm-url]: https://npmjs.org/package/modular-three
