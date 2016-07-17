var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var webpack = require('gulp-webpack');
var del = require('del');

var src = {
  images: './assets/images/*.png',
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
	.pipe(concatCss("styles/app.css"))
	.pipe(gulp.dest('target/assets'));
});

gulp.task('app', function() {
  return gulp.src('./src/App.js')
    .pipe(webpack({
		output: {
			filename: 'app.js'
		},
		module: {
			loaders: [{
				test: /\.jsx?$/,
				exclude: /node_modules/, 
				loader: 'babel',
				query: {
					presets: ['es2015', 'react']
				}
			}]
		}
	}))
    .pipe(gulp.dest('target'));
});

gulp.task('default', ['images', 'css', 'libs', 'app']);