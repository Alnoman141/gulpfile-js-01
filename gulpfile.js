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
var browserSync = require('browser-sync').create();
var reload = browserSync.reload; // for auto reload

var styleSRC = 'src/scss/style.scss';
var styleDIST = './dist/css/';
var styleWatch = 'src/scss/**/*.scss';
var htmlWatch = '**/*.html';

var jsSRC = 'script.js';
var jsFOLDER = 'src/js/';
var jsDIST = './dist/js/';
var jsWatch = 'src/js/**/*.js';
var jsFILES = [jsSRC];

gulp.task('browser-sync', function(){
    browserSync.init({
        // for local environment
        server: {
            baseDir: './'
        }

        // for https
        // open: false,
        // injectChanges: true,
        // proxy: 'https://gulp.dev',
        // https: {
        //     key: '',
        //     cert: ''
        // }
        // we have to add <script async="" src="https://domain-name:port/browser-sync/browser-sync-client.js"></script>
        // in index page as the last script
    })
})


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
        .pipe(gulp.dest(styleDIST))
        .pipe(browserSync.stream()); // for auto reload
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
        .pause(browserSync.stream()); // for auto reload
    });
})

gulp.task('default', gulp.series('style', 'js'));

gulp.task('watch', gulp.series('default','browser-sync'));
gulp.watch(styleWatch, gulp.series('style', reload));
gulp.watch(jsWatch, gulp.series('js', reload));
gulp.watch(htmlWatch, reload);

