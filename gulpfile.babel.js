const path = require('path');
const gulp = require('gulp');

const gutil = require('gulp-util');

// Test for known node vulnerabilities
const nsp = require('gulp-nsp');

const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const filesize = require('rollup-plugin-filesize');

//Compile glsl code
const glsl = () => {
  return {
    transform(code, id) {
      if (!/\.glsl$/.test(id)) return;

      return 'export default ' + JSON.stringify(
        code
        .replace(/[ \t]*\/\/.*\n/g, '')
        .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '')
        .replace(/\n{2,}/g, '\n')
      ) + ';';
    },
  };
};

gulp.task('rollup', () => {
  return rollup({
    entry: './src/index.js',
    plugins: [
      nodeResolve({
        jsnext: false,
        module: false,
      }),
      glsl(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: ['es2015-loose-rollup'],
      }),
      filesize(),
    ],
  })
    .then((bundle) => {
      return bundle.write({
        format: 'es',
        moduleName: 'modularTHREE',
        dest: 'dist/index.js',
      });
    });
});

gulp.task('nsp', (cb) => {
  nsp({
    package: path.resolve('package.json'),
  }, cb);
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.js'], ['rollup']);
});

gulp.task('default', ['rollup', 'watch']);
