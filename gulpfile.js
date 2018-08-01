var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    haml = require('gulp-haml'),

    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    // sourcemaps = require('gulp-sourcemaps'),
    package = require('./package.json');


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() +
  ' */',
  '\n'
].join('');



// 1
gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});
// 2
gulp.task('js',function(){
  gulp.src('src/js/scripts.js')
    // .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});
// 3
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        notify: false,
        server: {
            baseDir: "app"
        }
    });
});
// 4
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Get one .HAML file and render
gulp.task('oneHaml', function () {
    gulp.src('src/haml/index.haml')
      .pipe(haml())
      .pipe(gulp.dest('app'));
});


//DEFAULT
gulp.task('default', ['css', 'js', 'browser-sync', 'oneHaml'], function () {
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/haml/*.haml", ['oneHaml']);
    gulp.watch("app/*.html", ['bs-reload']);
});
