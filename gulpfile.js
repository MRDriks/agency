const browsersync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const include = require('gulp-file-include');
const inject = require('gulp-inject');
const autoprefix = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const jsmin = require('gulp-jsmin');

sass.compiler = require('node-sass');

// Browser-sync init 
function browserSyncInit(done) {
  browsersync.init({
    server: {
      baseDir: 'dist'
    },
    port: 8000
  });
  done();
}

// Browser-sync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean dist directory
function clean() {
  return del('dist')
}

function fonts() {
  return gulp
    .src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
}

function js() {
  return gulp
    .src('src/js/*.js')
    .pipe(gulp.dest('dist/js'));
}

function jsminify() {
  return gulp
    .src('src/js/*')
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'));
}

function images() {
  return gulp
    .src('src/img/*.{jpg,png}')
    .pipe(gulp.dest('dist/img'));
}

function favicon() {
  return gulp
    .src('src/favicon.png')
    .pipe(gulp.dest('dist'));
}

function css() {
  return gulp
    .src('src/sass/style.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefix({
      cascade: false
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'));
}

function html() {
  return gulp
    .src('src/index.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(inject(gulp.src(['dist/css/*', 'dist/js/*'], {read: false}), {ignorePath: 'dist', addRootSlash: false}))
    .pipe(gulp.dest('dist'));
}

function htmlminify() {
  return gulp
    .src('dist/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
}

function watchFiles() {
  gulp.watch('src/sass/*', gulp.series(css, browserSyncReload));
  gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload));
  gulp.watch('src/img', gulp.series(images, browserSyncReload));
  gulp.watch('src/js/*', gulp.series(js, browserSyncReload));
}

const serve = gulp.parallel(watchFiles, browserSyncInit);
const build = gulp.series(clean, images, favicon, fonts, jsminify, css, html, htmlminify);

module.exports = {
  favicon,
  fonts,
  jsminify,
  js,
  css,
  htmlminify,
  html,
  images,
  watchFiles,
  clean,
  serve,
  build
}


