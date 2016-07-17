var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var webpack = require('gulp-webpack');
var del = require('del');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject-string');
var deleteLines = require('gulp-delete-lines');
var concat = require('gulp-concat');

var src = {
  images: ['./assets/images/*.png', '.assets/images/*.ico'],
  css:    './assets/css/*.css',
  libs:	  './libs/**/**'
};

gulp.task('clean', function() {
  return del(['target']);
});

gulp.task('images', function() {
	return gulp.src(src.images)
	.pipe(gulp.dest('target/assets/images'));
});

gulp.task('libs', function() {
	return gulp.src(src.libs)
	.pipe(concat('libs.js'))
	.pipe(uglify())
	.pipe(gulp.dest('target/assets/libs'));
});

gulp.task('css', function() {
	return gulp.src(src.css)
	.pipe(concatCss("styles/app.css"))
	.pipe(gulp.dest('target/assets'));
});

gulp.task('app', function() {
  return gulp.src('./src/App.js')
    .pipe(webpack( require('./webpack.config.js') ))
	.pipe(uglify())
    .pipe(gulp.dest('target'));
});

gulp.task('index', function () {
  return gulp.src('index.html') 
    .pipe(deleteLines({
      'filters': [
      /<link\s+rel=["']/i
      ]
    }))
	.pipe(deleteLines({
      'filters': [
	  /<script\s+src=".\/libs/i
      ]
    }))
	.pipe(inject.before('</head>', '    <link rel="stylesheet" href="./assets/styles/app.css"/>'))
	.pipe(inject.after('<body>', '     <script src="./assets/libs/libs.js"></script>'))
	.pipe(gulp.dest('target'));
});

gulp.task('default', ['images', 'css', 'libs', 'app', 'index']);