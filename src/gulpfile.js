var gulp = require('gulp'),
	rename = require('gulp-rename'),
	path = require('path'),
	streamify = require('gulp-streamify'),
	argv = require('yargs').argv,
	less = require('gulp-less'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	spawn = require('child_process').spawn,
	autoprefixer = require('gulp-autoprefixer'),
	webServerNode, http = require('http'),
	buildFolder = path.normalize(__dirname + '/../'),
	sourceFolder = __dirname + '/code';

gulp.task('watch', function () {
	gulp.watch(sourceFolder + '/less/**/*.less', ['less']);
	gulp.watch(sourceFolder + '/js/**/*.js', ['js']);
	gulp.watch('./webserver.js', ['webserver']);
});

gulp.task('js', function () {
	gulp.src(sourceFolder + '/js/**/*.js')
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(buildFolder + '/static/'))
		.pipe(rename('scripts.min.js'))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest(buildFolder + '/static/'));
});
gulp.task('less', function () {
	gulp.src(sourceFolder + '/less/core.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename('style.css'))
		.pipe(gulp.dest(buildFolder + '/static/'))
		.pipe(minifyCSS({
			keepSpecialComments: 1
		}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest(buildFolder + '/static/'));
});
gulp.task('webserver', function () {
	if (webServerNode) webServerNode.kill();
	webServerNode = spawn('node', ['./webserver.js'], {
		stdio: 'inherit'
	});
});

var run = ['less', 'js', 'watch', 'webserver'];
process.on('exit', function () {
	if (webServerNode) webServerNode.kill();
});
process.on('SIGINT', function () {
	if (webServerNode) webServerNode.kill();
	process.exit();
});

gulp.task('default', run);