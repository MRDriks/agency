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
      baseDir: 'docs'
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

// Clean docs directory
function clean() {
  return del('docs')
}

function fonts() {
  return gulp
    .src('src/fonts/*')
    .pipe(gulp.dest('docs/fonts'));
}

function js() {
  return gulp
    .src('src/js/*.js')
    .pipe(gulp.dest('docs/js'));
}

function jsminify() {
  return gulp
    .src('src/js/*')
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('docs/js'));
}

function images() {
  return gulp
    .src('src/img/*.{jpg,png}')
    .pipe(gulp.dest('docs/img'));
}

function favicon() {
  return gulp
    .src('src/favicon.png')
    .pipe(gulp.dest('docs'));
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
    .pipe(gulp.dest('docs/css'));
}

function html() {
  return gulp
    .src('src/index.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(inject(gulp.src(['docs/css/*', 'docs/js/*'], {read: false}), {ignorePath: 'docs', addRootSlash: false}))
    .pipe(gulp.dest('docs'));
}

function htmlminify() {
  return gulp
    .src('docs/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('docs'));
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


