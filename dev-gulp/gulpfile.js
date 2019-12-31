var themename = 'devwp';
var gulp = require( 'gulp' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    browserSync  = require( 'browser-sync' ).create(),
    reload  = browserSync.reload,
    sass  = require( 'gulp-sass' ),
    cleanCSS  = require( 'gulp-clean-css' ),
    sourcemaps  = require( 'gulp-sourcemaps' ),
    concat  = require( 'gulp-concat' ),
    imagemin  = require( 'gulp-imagemin' ),
    changed = require( 'gulp-changed' ),
    uglify  = require( 'gulp-uglify' ),
    lineec  = require( 'gulp-line-ending-corrector' );

var root  = '../' + themename + '/',
    scss  = root + 'sass/',
    js  = root + 'src/js/',
    jsdist  = root + 'dist/js/';

// Watch Files

var styleWatchFiles  = root + '**/*.scss';

// Used to concat the files in a specific order.
var jsSRC = [
    js + 'main.js',
   
];

// Used to concat the files in a specific order.
var cssSRC =  [
  root + 'src/css/all.css',
  root + 'style.css',
];

var imgSRC = root + 'src/images/*',
    imgDEST = root + 'dist/images/';

function css() {
  return gulp.src([scss + 'style.scss'])
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(autoprefixer('last 2 versions'))
  .pipe(sourcemaps.write())
  .pipe(lineec())
  .pipe(gulp.dest(root));
}

function concatCSS() {
  return gulp.src(cssSRC)
  .pipe(sourcemaps.init({loadMaps: true, largeFile: true}))
  .pipe(concat('style.min.css'))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write('./maps/'))
  .pipe(lineec())
  .pipe(gulp.dest(scss));
}

function javascript() {
  return gulp.src(jsSRC)
  .pipe(concat('devwp.js'))
  .pipe(uglify())
  .pipe(lineec())
  .pipe(gulp.dest(jsdist));
}

function imgmin() {
  return gulp.src(imgSRC)
  .pipe(changed(imgDEST))
      .pipe( imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5})
      ]))
      .pipe( gulp.dest(imgDEST));
}

function watch() {
  browserSync.init({
    open: 'external',
    proxy: 'http://127.0.0.1:5500',//this is live server from vscode
    
  });
  gulp.watch(styleWatchFiles, gulp.series([css, concatCSS]));
  gulp.watch(jsSRC, javascript);
  gulp.watch(imgSRC, imgmin);
  gulp.watch([jsdist + 'devwp.js', scss + 'style.min.css']).on('change', browserSync.reload);
}

exports.css = css;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;

var build = gulp.parallel(watch);
gulp.task('default', build);