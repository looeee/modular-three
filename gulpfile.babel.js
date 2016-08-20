const path = require('path');
const gulp = require('gulp');

// Test for known node vulnerabilities
const nsp = require('gulp-nsp');

// ES2015 build related objects
const babel = require('rollup-plugin-babel');
const browserify = require('browserify');
const rollupify = require('rollupify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const gutil = require('gulp-util');

// add custom browserify options here
const customOpts = {
  entries: ['src/index.js'],
  debug: true,
};
const opts = Object.assign({}, watchify.args, customOpts);
const b = watchify(browserify(opts)
  .transform('rollupify', {
    config: {
      plugins: [
        babel({
          exclude: 'node_modules/**',
          babelrc: false,
          presets: ['es2015-loose-rollup'],
        }),
      ],
    },
  }));

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', (err) => {
      // print the error
      gutil.log(
        gutil.colors.red('Browserify compile error:'),
        err.message
      );
      // end this stream
      this.emit('end');
    })
    .pipe(source('index.js'))
    .pipe(gulp.dest('dist/'));
}

// b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

gulp.task('babel', bundle);

gulp.task('nsp', (cb) => {
  nsp({
    package: path.resolve('package.json'),
  }, cb);
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.js'], ['babel']);
});

gulp.task('default', ['watch']);
