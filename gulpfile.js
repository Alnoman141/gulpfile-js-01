var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass')(require('sass'));

var styleSRC = './src/scss/style.scss';
var styleDIST = './dist/css/';

gulp.task('style', async function(){
    gulp.src(styleSRC)
        .pipe(sass({ 
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(styleDIST));
})