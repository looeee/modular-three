const path = require('path');
const gulp = require('gulp');

// Test for known node vulnerabilities
const nsp = require('gulp-nsp');

const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const filesize = require('rollup-plugin-filesize');

gulp.task('bundle', () => {
  return rollup({
    entry: './src/index.js',
    plugins: [
      nodeResolve({
        jsnext: false,
        module: false,
      }),
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
  gulp.watch(['src/**/*.js'], ['bundle']);
});

gulp.task('default', ['bundle', 'watch']);
