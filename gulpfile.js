var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var webpack = require('gulp-webpack');
var del = require('del');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject-string');
var deleteLines = require('gulp-delete-lines');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');

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
	.pipe(gulp.dest('target/libs'));
});

gulp.task('css', function() {
	return gulp.src(src.css)
	.pipe(concatCss("styles/app.css", {
		rebaseUrls: false
	}))
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
      /<script\s+src=".\/libs\/react/i
      ]
    }))
	.pipe(inject.before('</head>', '<script src="./libs/react/prod/react-15.2.1.min.js"></script>'))
	.pipe(inject.before('</head>', '<script src="./libs/react/prod/react-dom-15.2.1.min.js"></script>'))
	.pipe(inject.before('</head>', '<link rel="stylesheet" href="./assets/styles/app.css"/>'))
	.pipe(gulp.dest('target'));
});

gulp.task('set-prod-node-env', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('build', ['images', 'css', 'libs', 'app', 'index']);

gulp.task('default', function(callback) {
	runSequence('clean',
				'set-prod-node-env',
				'build',
				 callback);
});