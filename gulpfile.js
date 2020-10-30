const browsersync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const include = require('gulp-file-include');
const inject = require('gulp-inject');
const autoprefix = require('gulp-autoprefixer');

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

function images() {
  return gulp
    .src('src/img/*.{jpg,png}')
    .pipe(gulp.dest('dist/img'));
}

function icons() {
  return gulp 
    .src('src/img/icons/*')
    .pipe(gulp.dest('dist/img/icons'));
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
    .pipe(inject(gulp.src('dist/css/*', {read: false}), {ignorePath: 'dist', addRootSlash: false}))
    .pipe(gulp.dest('dist'));
}

function watchFiles() {
  gulp.watch('src/sass/*', gulp.series(css, browserSyncReload));
  gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload));
  gulp.watch('src/img', gulp.series(images, browserSyncReload));
  gulp.watch('src/img/icons', gulp.series(icons, browserSyncReload));
}

const serve = gulp.parallel(watchFiles, browserSyncInit);
const build = gulp.series(clean, images, icons, css, html);

module.exports = {
  css,
  html,
  images,
  icons,
  watchFiles,
  clean,
  serve,
  build
}


