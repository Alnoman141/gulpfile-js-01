var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass')(require('sass'));
var autoPrefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');

var styleSRC = 'src/scss/style.scss';
var styleDIST = './dist/css/';
var styleWatch = 'src/scss/**/*.scss';

var jsSRC = 'script.js';
var jsFOLDER = 'src/js/';
var jsDIST = './dist/js/';
var jsWatch = 'src/js/**/*.js';
var jsFILES = [jsSRC];

gulp.task('style', async function(){
    gulp.src(styleSRC)
        .pipe(sourcemaps.init())
        .pipe(sass({ 
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoPrefixer({
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(styleDIST));
})

gulp.task('js', async function(){
    jsFILES.map(function(entry){
        return browserify({
            entries: [jsFOLDER + entry]
        })
        .transform( babelify, { presets: [ '@babel/preset-env' ]})
        .bundle()
        .pipe(source(entry))
        .pipe(rename({ extname: '.min.js'}))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDIST))
    });
})

gulp.task('default', gulp.series('style', 'js'));

gulp.task('watch', gulp.series('default'));
gulp.watch(styleWatch, gulp.series('style'));
gulp.watch(jsWatch, gulp.series('js'));

