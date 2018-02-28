'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var gulpSequence = require('gulp-sequence');

const notify = require('gulp-notify');
const eslint = require('gulp-eslint');

var sassFiles = 'css/styles.scss';

const eslintConfig = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "ecmaFeatures": {
        /*"arrowFunctions": true,
        "binaryLiterals": true,
        "blockBindings": true,
        "classes": true,
        "defaultParams": true,
        "destructuring": true,
        "forOf": true,
        "generators": true,
        "objectLiteralComputedProperties": true,
        "objectLiteralDuplicateProperties": true,
        "objectLiteralShorthandMethods": true,
        "objectLiteralShorthandProperties": true,
        "octalLiterals": true,
        "regexUFlag": true,
        "regexYFlag": true,
        "spread": true,
        "superInFunctions": true,
        "templateStrings": true,
        "unicodeCodePointEscapes": true,
        "globalReturn": true,*/
        "modules": true
    }
};

const onError = function(err) {
    notify.onError({
        title:    "Error",
        message:  "<%= error %>",
    })(err);
    this.emit('end');
};

// Lint JS/JSX files
gulp.task('eslint', () => {
    return gulp.src('src/**')
        .pipe(eslint({
            baseConfig: eslintConfig
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('compile_css', () => {
    gulp.src('css/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css/'));
});

gulp.task('concat_scripts', () => {
    return gulp.src('src/**')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('js/'));
});

gulp.task('lint', () => {
    return gulp.src(['src/**'])
        .pipe(jshint({
            esnext: true
        }))
        .pipe(jshint.reporter('default'))
});

gulp.task('move_js', () => {
    gulp.src('js/main.js').pipe(gulp.dest('build/js/'));
});

gulp.task('move_files', ['move_js']);

gulp.task('build_js', (cb) => {
    gulpSequence('eslint', 'concat_scripts', 'move_js', cb);
});

gulp.task('build', ['compile_css', 'build_js']);

gulp.task('watch', () => {
    gulp.watch(sassFiles, gulpSequence('compile_css'));
    gulp.watch('src/*.js', ['build_js']);
});