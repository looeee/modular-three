const path = require('path');
const gulp = require('gulp');

// Test for known node vulnerabilities
const nsp = require('gulp-nsp');

// ES2015 build related plugins
const rollup = require('rollup-stream');
const babel = require('rollup-plugin-babel');
const source = require('vinyl-source-stream');

function bundle() {
  rollup({
    entry: 'src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: ['es2015-loose-rollup'],
      }),
    ],
  })
  .pipe(source('index.js'))
  .pipe(gulp.dest('dist/'));
}

gulp.task('nsp', (cb) => {
  nsp({
    package: path.resolve('package.json'),
  }, cb);
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.js'], bundle);
});

gulp.task('default', ['watch']);
