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

To see it in action clone [**Modular THREE Boilerplate**](https://github.com/looeee/modular-three-boilerplate)
and have a look through the code there, especially:
* ```src/entry.js```
* ```src/drawing/testDrawing.js```
* ```src/meshObjects/cube.js```

Include Modular THREE at the start of any files that use it like so:
```js
const modularTHREE = require('modular-three');
```

#### License MIT © Lewy Blue 2016 ####


[npm-image]: https://badge.fury.io/js/modular-three.svg
[npm-url]: https://npmjs.org/package/modular-three
