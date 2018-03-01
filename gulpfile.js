'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var gulpSequence = require('gulp-sequence');

var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');

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
        "arrowFunctions": true,
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
        "globalReturn": true,
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

gulp.task('es6', function() {
	browserify({ debug: true })
		.transform(babelify.configure({
			presets : ["es2015"]
		}))
		.require("./src/Application.js", { entry: true })
		.bundle()
		.on('error',gutil.log)
		.pipe(source('main.js'))
		.pipe(gulp.dest('./build/js/'));
});

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

gulp.task('build_js', (cb) => {
    gulpSequence('eslint', 'es6', cb);
});

gulp.task('build', ['compile_css', 'build_js']);

gulp.task('watch', () => {
    gulp.watch(sassFiles, gulpSequence('compile_css'));
    gulp.watch('src/*.js', ['build_js']);
});