const path = require('path');
const gulp = require('gulp');

// Javascript testing suite: https://mochajs.org/
const mocha = require('gulp-mocha');

// Code coverage tool
const istanbul = require('gulp-istanbul');

// ES6 coverage  with istanbul
const isparta = require('isparta');

// Code coverage (test coverage) with https://coveralls.io
const coveralls = require('gulp-coveralls');

// Test for known node vulnerabilities
const nsp = require('gulp-nsp');

// Better error handling
const plumber = require('gulp-plumber');

// Babel build related objects
//const rollup = require('gulp-rollup');
const babel = require('rollup-plugin-babel');
const browserify = require('browserify');
const rollupify = require('rollupify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const gutil = require('gulp-util');

// allow deleting files / folders
const del = require('del');

gulp.task('nsp', (cb) => {
  nsp({
    package: path.resolve('package.json'),
  }, cb);
});

gulp.task('pre-test', () => {
  return gulp.src('src/**/*.js')
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter,
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], (cb) => {
  let mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec',
    }))
    .on('error', (err) => {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', () => {
      cb(mochaErr);
    });
});

gulp.task('watch', () => {
  //gulp.watch(['src/**/*.js', 'test/**'], ['test']);
  gulp.watch(['src/**/*.js'], ['babel']);
});

gulp.task('coveralls', ['test'], () => {
  if (!process.env.CI) {
    return false;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

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

// Remove built files
gulp.task('clean', () => {
  return del('dist');
});

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['watch']);
