const path = require('path');
const gulp = require('gulp');

// Javascript testing suite: https://mochajs.org/
const mocha = require('gulp-mocha');

// Code coverage tool
const istanbul = require('gulp-istanbul');

// Test for known node vulnerabilities
const nsp = require('gulp-nsp');

// Better error handling
const plumber = require('gulp-plumber');

// Code coverage (test coverage) with https://coveralls.io
const coveralls = require('gulp-coveralls');

const babel = require('gulp-babel');
const del = require('del');

// ES6 coverage  with istanbul
const isparta = require('isparta');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-register');

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
  return gulp.src('src/**/*.js')
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  let mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', 'test/**'], ['test']);
  gulp.watch(['src/**/*.js'], ['babel']);
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('babel', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

// Remove built files
gulp.task('clean', function () {
  return del('dist');
});

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['test', 'coveralls']);
