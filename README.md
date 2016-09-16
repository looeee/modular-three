ModularTHREE [![NPM version][npm-image]][npm-url]
========

**ModularTHREE** simplifies the creation of [Three.js] based [WebGL] scenes written in [ES2015]. In particular it handles:

* Basic scene setup with intelligent defaults
* Resizing your scene on window resize
* [Memoization](https://en.wikipedia.org/wiki/Memoization) of scene assets such as models and textures

**ModularTHREE** is designed to be used with build tools such as [Rollup], [Babel] etc, however it should work fine if you use the old method of including ```<script>``` files in your ```<head>```.

To see it in action check out [Modular THREE Boilerplate],
which includes a [Gulp] setup for compiling ES2015 with
[Rollup] and [Babel](https://babeljs.io/),
as well as compiling and [autoprefixing](https://github.com/postcss/autoprefixer)
[SCSS](http://sass-lang.com/) and piping through [Livereload](http://livereload.com/)
to be used with [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/livereload/) livereload
plugins.

### NOTE: This is an early build. Features may change rapidly. ###

### Table of Contents ###

  - [Installation](#installation)
  - [Requirements](#requirements)
  - [Optional Addons](#optional-addons)
      - [**GSAP** for animation / tweening.](#gsap-for-animation--tweening)
      - [**Stats**](#stats)
  - [Usage](#usage)
    - [Preliminary Setup](#preliminary-setup)
      - [Creating a drawing](#creating-a-drawing)
    - [```rendererSpec``` and ```cameraSpec```](#rendererspec-and-cameraspec)
    - [Adding Objects to the Drawing](#adding-objects-to-the-drawing)
    - [Adding Animation](#adding-animation)
    - [Using **GSAP** for Animation](#using-gsap-for-animation)
    - [Loading JSON objects with THREE.ObjectLoader](#loading-json-objects-with-threeobjectloader)
    - [Playing keyframe animations from loaded JSON objects](#playing-keyframe-animations-from-loaded-json-objects)
    - [Playing morph animations from loaded JSON objects](#playing-morph-animations-from-loaded-json-objects)
    - [Playing skinned animations from loaded JSON objects](#playing-skinned-animations-from-loaded-json-objects)
    - [Using other loaders](#using-other-loaders)
    - [Using pre-built controls](#using-pre-built-controls)
    - [Postprocessing](#postprocessing)

Installation
------

```sh
$ npm install --save modular-three
```
from your project root folder.

Requirements
------
####[**THREE.js**](http://threejs.org/)
```sh
$ npm install --save three
```
and include THREE in your build, or add ```<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js"></script>``` to your ```<head>```.

Optional Addons
------

#### [**GSAP**](http://greensock.com/gsap) for animation / tweening. ####

```sh
$ npm install --save gsap
```
and include GSAP in your build, or add ```<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js">``` to your ```<head>```.

[**GSAP**](http://greensock.com/gsap) is a powerful animation library which allows
for the creation of much more complex animation than is possible using THREE alone.

See the animation section below for detailed instructions.

#### [**Stats**](https://github.com/mrdoob/stats.js/) ####
Show FPS and other stats on screen. If you haved installed THREE as an npm module you can include  ```three/examples/js/libs/stats.min``` in your build, otherwise add
```https://github.com/mrdoob/stats.js/blob/master/src/Stats.js``` to your ```<head>```.

Usage
------

### Preliminary Setup ###

**NOTE:** The following instructions largely assume you are working with [ModularTHREE Boilerplate]. You may have to make minor adjustments if you are using yor own setup.

Otherwise clone [modularTHREE Boilerplate] into an empty folder:

```bash
  git clone https://github.com/looeee/modular-three-boilerplate
```

and let's get started!

If you do choose to use your own setup, you can use [Three.js] like so:
```js
import THREE from 'three';
```

Then include **modularTHREE** at the start of any files:
```js
import modularTHREE from 'modular-three';
```

Alternately if you want to just do these imports once, expose these variables globally:

```js
import THREE from 'three';
window.THREE = THREE;

import modularTHREE from 'modular-three';
window.modularTHREE = modularTHREE;
```

With that out of the way, let's get started on building our first scene.
First, set config settings and call ```init()```:

```js
modularTHREE.config.useLoadingManager = true;

//Run init() AFTER setting config options
modularTHREE.init();
```

#### Important Note ####

THREE.js has recently (as of r80) switched to a modular build. This allows you to include it with an import statement as above. However most of the plugins (stats being an exception) are not built as modules. This means you will need to include THREE first, then load any THREE plugins (e.g. postprocessing effects, controls etc.) as scripts, then finally load the script containing your code. It's not ideal, but hopefully this will change in the near future.

#### Creating a drawing ####

The basic element in **modularTHREE** is a ```Drawing```, which has a
```THREE.Scene```, ```THREE.Camera``` and ```THREE.Renderer``` associated with a unique ```<canvas>``` element.

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
 ```rendererSpec``` and ```cameraSpec``` are optional. If you just want to create a standard fullscreen drawing with a black background and [```THREE.PerspectiveCamera```](http://threejs.org/docs/?q=camera#Reference/Cameras/PerspectiveCamera), you can leave them out entirely.

Next instantiate your ```Drawing``` and call it's ```render()``` function.
```js
const exampleDrawing = new ExampleDrawing();

exampleDrawing.render();
}
```

That's it! With just a couple of lines of code you should now have a (blank)
scene.

To stop rendering, call ```exampleDrawing.cancelRender()```.

### ```rendererSpec``` and ```cameraSpec``` ###
For more control you can create ```rendererSpec``` and ```cameraSpec``` objects,
which have following options. If they are omitted the defaults shown will be used:

```js
const rendererSpec = {
  canvasID: 'testDrawing',
  antialias: true,
  alpha: true, //true required for multiple scenes
  autoClear: true, //false required for multiple scenes
  clearColor: 0x6858bb, //nice light purple background
  clearAlpha: 1.0,
  width: () => window.innerWidth,
  height: () => window.innerHeight,
  pixelRatio: window.devicePixelRatio,
  postprocessing: false,
  useGSAP: true,
  showStats: true,
};
```

Note that ```alpha``` and ```autoClear``` **are** required if you are using multiple scenes.

```js
const cameraSpec = {
  type: 'PerspectiveCamera', //Or 'OrthographicCamera'
  near: 10,
  far: -10,
  position: new THREE.Vector3(0, 0, 100),
  //PerspectiveCamera only
  fov: 45,
  aspect: () => window.innerWidth / window.innerHeight,
  // OrthographicCamera only
  width: () => window.innerWidth,
  height: () => window.innerHeight,
};
```

Note also that ```width```, ```height``` and ```aspect``` **must** be passed in as functions.
This is because they are generally based on window dimensions, and this approach allows
them to be recalculated on window resize.

```rendererSpec``` and ```cameraSpec``` cover the minimal amount of options that need to be set for every THREE scene. The ability to set all scene/camera/renderer options will be added in a future update.

### Adding Objects to the Drawing ###

We'll create a standard ```MeshObjects``` next:

```js
class Cube extends modularTHREE.MeshObject {
  constructor(spec) {
    super(spec);
  }

  init() {
    const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}
```

Again the **spec** object is optional, but can be used to pass in variables such as layers (a recent and largely undocumented THREE feature), or your own parameters.

Next, update the ```init()``` function of your ```Drawing``` class to instantiate the cube.

```js
class ExampleDrawing extends modularTHREE.Drawing {
  constructor(rendererSpec, cameraSpec) {
    super(rendererSpec, cameraSpec);
  }

  init() {
    this.cube = new Cube();
    this.scene.add(this.cube);
  }
}
```

And that's it! You should now have a small red cube in the middle of a purple screen.

Let's make it a bit more interesting. We'll copy this example of a [**spinning wooden cube**]((http://threejs.org/examples/#webgl_geometry_cube)).

First, copy the texture file [**crate.jpg**](https://github.com/looeee/modular-three-boilerplate/blob/master/images/textures/crate.jpg) into your project root - say into ```<project-root>/images/textures/crate.jpg```.

Next update the ```Cube.init()``` function to use this texture:

```js
init() {
  const texture = this.loadTexture('images/textures/crate.jpg');
  const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  this.mesh = new THREE.Mesh(geometry, material);
}
```

### Adding Animation ###

Let's make the cube spin.

The standard method of adding animation with THREE is to use [```window.requestAnimationFrame()```](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), and update the objects we want to animate each frame. See the [**source code for the spinning cube**](http://threejs.org/examples/webgl_geometry_cube.html) for an example.

To add a function which will be called every animationFrame to your drawing, call ```Drawing.addPerFrameFunction(yourFunction)```. Here is our testDrawing extended to make the cube rotate:


```js
class TestDrawing extends modularTHREE.Drawing {
  constructor() {
    super(rendererSpec, cameraSpec);
  }

  init() {
    this.initObjects();
    this.initCubeAnimation();
  }

  initObjects() {
    this.cube = new Cube();
    this.scene.add(this.cube);
  }

  initCubeAnimation() {
    const rotateCube = () => {
      this.cube.rotation.x += 0.005;
      this.cube.rotation.y += 0.01;
    };

    this.addPerFrameFunction(rotateCube);
  }
}
```

Your ```Drawing``` should now look pretty similar to the spinning cube example.

### Using [**GSAP**](http://greensock.com/gsap) for Animation ###

The above is fine for simple animations, however things will get messy quickly if you are trying to do anything complex. To switch to using [**GSAP**](http://greensock.com/gsap) to handle animations, set ```rendererSpec.useGSAP = true```. If you have correctly included the GSAP script,
everything should be the same - the code will spin exactly as before, however you can now create GSAP timelines and tweens in your ```Drawing```.

A deep exploration of GSAP is beyond the scope of this Readme, however the GSAP [**documentation**](https://greensock.com/docs) is thorough and [**this is a good place to start**](https://greensock.com/get-started-js). But let's create a simple falling animation for our cube using ```Timeline``` and ```TweenMax```. Extend your ```TestDrawing``` function like so:

```js
initObjects() {
    this.cube = new Cube();

    //set the cube's initial position and rotation
    this.cube.rotation.set(-2, 2, 0);
    this.cube.position.set(0, 30, 0);

    this.scene.add(this.cube);
  }

  initCubeAnimation() {
    this.cubeTimeline = new TimelineMax();

    const cubeFallTween = TweenMax.to(this.cube.position, 3.5, {
      y: -20,
      ease: Bounce.easeOut,
    });

    const cubeRotateTween = TweenMax.to(this.cube.rotation, 3.5, {
      x: 0,
      y: 0,
      ease: Sine.easeInOut,
    });

    this.cubeTimeline.add(cubeFallTween);

    //add the rotation tween at time 0 so that falling and rotating
    //happen simultaneously
    this.cubeTimeline.add(cubeRotateTween, 0);
  }
```

### Adding Dat.GUI Controls ###
[Dat.GUI](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage) is a usefull tool for adding controls to your models / animations during testing. You'll see it in use in many ```Three.js``` examples.

To set it up, either include the script [```dat.gui.min.js```](https://raw.githubusercontent.com/dataarts/dat.gui/master/build/dat.gui.min.js) in your page, or ```npm install --save dat-gui``` and include it in your build.

Next we'll add a simple play / pause functionality to our animation.

Change the line ```this.cubeTimeline = new TimelineMax();``` to ```this.cubeTimeline = new TimelineMax({paused: true});``` so that the animations doesn't play automatically.

Then add the following function to your ```TestDrawing``` class:

```js
initCubeGUI() {
      //Prevent multiple copies of the gui being created (e.g. on window resize)
    if (this.gui) return;

    this.gui = new dat.GUI();

    const opts = {
      'play': () => {
        this.cubeTimeline.play();
      },
      'stop': () => {
        this.cubeTimeline.stop();
      },
    };

    this.gui.add(opts, 'play');
    this.gui.add(opts, 'stop');
  }
```

And call the function **after** ```initCubeAnimation()```.

For detailed instructions on using ```dat.GUI``` see the documentation [**here**](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage).

### Loading JSON objects with THREE.ObjectLoader ###
In general you should try to convert any models to [THREE JSON](https://github.com/mrdoob/three.js/wiki/JSON-Object-Scene-format-4) format, as this works best with Three. There are loaders for other 3d file formats (see below), but they are more difficuly to work with. ModularTHREE uses the [THREE.ObjectLoader](http://threejs.org/docs/index.html?q=load#Reference/Loaders/ObjectLoader), converted to a [**Promise**](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise). In simple terms this means whatever you would have put in a callback function you now chain with ```.then(callback());```

At present many of the converters that THREE ships with (see [**here**](https://github.com/mrdoob/three.js/tree/dev/utils/converters)) are poorly documented, out of date or just plain difficult to use, the best method currently seems to be to save your model in a format that [**Clara.io**](https://clara.io) supports (ideally [**.FBX**](https://en.wikipedia.org/wiki/FBX) as you can embed textures in this format).  Upload your file there, perform any final tweaks and then export as Three.js (json). Both ```export all``` and ```export selected``` export an entire scene (for a single model the exported files will be identical).  This is generally not an issue when loading the model, but you should be aware of it, and if you do need the bare model you will need to extact it - something like ```const mesh = loadedObject.children[0];``` should work.


We'll load a precreated version of the crate object. This model was created in 3ds Max, saved as ```.FBX``` with embedded textures, then converted with [**Clara.io**](https://clara.io).

Copy these two files into the same directory in your project:
[**crate.jpg**](https://raw.githubusercontent.com/looeee/modular-three-boilerplate/master/models/crate/crate.jpg) and [**crate.json**](https://raw.githubusercontent.com/looeee/modular-three-boilerplate/master/models/crate/crate.json).

Next delete the ```initObjects()``` method from your ```TestDrawing``` class and create an ```initModels()``` method:

```js
initModels() {
  this.loadObject('models/crate/crate.json')
  .then((object) => {
    this.cube = object.children[0];

    //scale the geometry to fit inside the unit sphere (sphere of radius 1)
    this.cube.geometry.normalize();
    this.cube.scale.set(20, 20, 20);
    this.cube.rotation.set(-2, 2, 0);
    this.cube.position.set(0, 30, 0);

    this.scene.add(this.cube);

    //Note that we must now call initCubeAnimation() inside .then()
    //i.e. after the object has loaded
    this.initCubeAnimation();
  });
}
```

### Playing keyframe animations from loaded JSON objects ###

The ```crate.json``` file includes keyframe animations. We can play these using the ```THREE.AnimationMixer()```. To use these we'll have to use the whole loaded scene object (rather than extract the mesh object as above). Replace the ```initModels()``` and ```initCubeAnimation()``` methods with the following:

```js

initModels() {
  this.loadObject('models/crate/crate.json')
  .then((object) => {
    this.cube = object;
    //These values are rather arbitrary, and just ensure the whole
    //animation shows on screen
    this.cube.scale.set(15, 15, 15);
    this.cube.position.set(30, -5, 0);

    this.scene.add(this.cube);
    this.cubeAnimation();
  });
}

initCubeAnimation() {
  const cubeAnimationClip = this.cube.animations[0];
  this.animationMixer.clipAction(cubeAnimationClip).play();
}
```

Now the cube animation will play on a loop. Unfortunately ```THREE.AnimationMixer()``` is yet another undocumented part of ```THREE```, so exploration of the [**source files**](https://github.com/mrdoob/three.js/tree/dev/src/animation) is required to see how it works. ```ModularTHREE``` handles initialisation of the ```THREE.Clock()``` and the ```THREE.AnimationMixer()``` when you first use it.

If you have set up ```dat.GUI``` to play / pause the animation change your ```initCubeGUI()```:

```js
initCubeGUI() {
    //Prevent multiple copies of the gui being created (e.g. on window resize)
    if (this.gui) return;
    this.gui = new dat.GUI();

    const opts = {
      'play': () => {
        this.animationMixer.clipAction(this.cubeAnimationClip).play();
      },
      'stop': () => {
        this.animationMixer.clipAction(this.cubeAnimationClip).stop();
      },
    };

    this.gui.add(opts, 'play');
    this.gui.add(opts, 'stop');
  }
```

### Playing morph animations from loaded JSON objects ###

...forthcoming

### Playing skinned animations from loaded JSON objects ###

...forthcoming

### Using other loaders ###

There are loaders for [**many 3d file formats**](http://threejs.org/docs/index.html?q=loader) available for THREE.js. However you will probably need to include additional script files to use them.

In general if possible it's recommended to convert your model to the THREE JSON format (see above).
If you do use another loading manager, be aware that it may not be written to interface with the ```THREE.loadingManager```. For example, the [BabylonLoader](http://threejs.org/docs/index.html?q=loader#Reference/Loaders/BabylonLoader) does, but the [ColladaLoader](http://threejs.org/docs/index.html?q=loader#Reference/Loaders/ColladaLoader) does not.

If it does support the loadingManager, make sure you set ```modularTHREE.config.useLoadingManager = true;``` and run ```modularTHREE.init();``` before initialising the loader (as described above), which for the BabylonLoader you would do like so:

```js
  const babylonLoader = new THREE.BabylonLoader(modularTHREE.loadingManager);
```

After this use the loader as described in its documentation.

### Using pre-built controls ###

```THREE``` ships with several [control systems](https://github.com/mrdoob/three.js/tree/dev/examples/js/controls), although you must include additional their scripts to use them, and they are not (currently, as of THREE r80) written as modules, nor do they have any documentation. However they are fairly simple to set up.

For previewing your work, the ```OrbitControls``` are often the most useful, so let's go over how you would initialise these. Include the following script file *after* you have loaded ```THREE```:

```html
<script src="node_modules\three\examples\js\controls\OrbitControls.js"></script>
```

Add an ```initControl()``` method to your ```TestDrawing``` class:

```js
  initControls() {
  this.orbitControls = new THREE.OrbitControls(this.camera, this.domElement);

  //OrbitControls has several user setting. To see these, as with the //other control systems you'll have to explore the source code.

  //If you enable damping you will have to update the controls every frame
  this.orbitControls.enableDamping = true;
  this.addPerFrameFunction(() => {
    this.orbitControls.update();
  });
}
```

Make sure to call ```initControls()``` in your ```init()``` method, and you should be good to go!

### Postprocessing ###

```THREE``` ships with several postprocessing examples. As with controls, they are not included as part of the main build, and they are not written as modules, so they must be added to your page **after** THREE has loaded. The simplest way to add them is to include them in ```<script>``` tags.

**Note:** These effects are not well documented and are written by various people, so use them at your own risk and be prepared to read through the code to see how they work!

To start we'll need to include the following (assuming you are using THREE as an npm module and loading them from there):

```html
<script src="node_modules\three\examples\js\shaders\CopyShader.js"></script>
<script src="node_modules\three\examples\js\postprocessing\EffectComposer.js"></script>
<script src="node_modules\three\examples\js\postprocessing\ShaderPass.js"></script>
<script src="node_modules\three\examples\js\postprocessing\RenderPass.js"></script>
```

Lets add the DigitalGlitch effect and the Kaleidoscope and Vignette shaders. Add the following ```<scripts>```:

```html
<script src="node_modules\three\examples\js\shaders\KaleidoShader.js"></script>
<script src="node_modules\three\examples\js\shaders\VignetteShader.js"></script>
<script src="node_modules\three\examples\js\shaders\DigitalGlitch.js"></script>
<script src="node_modules\three\examples\js\postprocessing\GlitchPass.js"></script>
```

Inspecting the ```VignetteShader.js``` file we see the following ```uniforms```:

```js
uniforms: {

  "tDiffuse": { value: null },
  "offset":   { value: 1.0 },
  "darkness": { value: 1.0 }

},
```

If you are not familiar with GLSL shader language, just think of these as options. The default darkness will not be very visible so we'll set this below.

Update your ```Drawing``` class to include these:

```js
class TestDrawing extends modularTHREE.Drawing {
  constructor() {
    super(rendererSpec, cameraSpec);
  }

  init() {
    //other init calls
    this.initPostprocessing();
  }

  //Other Methods

  initPostprocessing() {
    if (!this.rendererSpec.postprocessing) return;
    this.addPostShader(THREE.KaleidoShader);
    this.addPostShader(THREE.VignetteShader, {
      darkness: 10.0,
    });

    this.addPostEffect(new THREE.GlitchPass());
  }
}
```

As you can see ```addPostShader()``` has an optional second argument in which you can set the uniforms for that shader.

Nothing will have happened yet, as we haven't set ```rendererSpec.postprocessing = true;```. Do this now, and while you're at it set ```rendererSpec.clearColor = 0x6858bb;``` so that you can see the postprocessing effects more clearly.

#### License MIT © Lewy Blue 2016 ####

[Three.js]: http://threejs.org/
[WebGL]: https://en.wikipedia.org/wiki/WebGL
[ES2015]: https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015
[ModularTHREE Boilerplate]: https://github.com/looeee/modular-three-boilerplate
[Gulp]: http://gulpjs.com/
[Rollup]: http://rollupjs.org/
[Babel]: https://babeljs.io/
[npm-image]: https://badge.fury.io/js/modular-three.svg
[npm-url]: https://npmjs.org/package/modular-three
