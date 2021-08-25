
const {src,dest,watch,parallel,series}         = require('gulp');


const sass         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglifyes     = require('gulp-uglify-es').default;
const babel        = require("gulp-babel");
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const del          = require('del');

function browsersync() {
  browserSync.init({
      server: {
          baseDir: 'app/'
      }
  });
}


function styles() {
  return src([
    'app/scss/**/*.scss',
  
  ])
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
     }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
};

//  Подключения bootstrap 5

function bootstrap (){
  return src([
    'node_modules/bootstrap/scss/bootstrap.scss',
    'node_modules/bootstrap/scss/_reboot.scss'
  ])
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('bootstrap.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
     }))
    .pipe(dest('app/css'))
}

function scripts (){
  return src('app/js/script.js')
    .pipe(concat('script.min.js'))
    .pipe(uglifyes())
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream());
}

function img (){
  src('app/img/**/*')
    .pipe(imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.mozjpeg({quality: 75, progressive: true}),
          imagemin.optipng({optimizationLevel: 5}),
          imagemin.svgo({
              plugins: [
                  {removeViewBox: true},
                  {cleanupIDs: false}
              ]
          })
      ]))
    .pipe(dest('dist/img'))
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/script.js'],scripts)
  watch(['app/*.html']).on('change', browserSync.reload);
}

function cleanapp() {
  return del('dist')
}

function build() {
  return src([
      'app/css/style.min.css',
      'app/css/bootstrap.min.css',
      'app/fonts/**/*',
      'app/js/script.min.js',
      'app/*.html'
  ], { base: 'app' })
      .pipe(dest('dist'))
}


exports.styles = styles;
exports.scripts = scripts;
exports.img = img;
exports.browserSync = browsersync;
exports.watching = watching;
exports.cleanapp = cleanapp;
exports.bootstrap = bootstrap;



exports.build = series(cleanapp,build,img);
exports.default = parallel(styles,scripts,watching,browsersync,bootstrap); // bootstrap