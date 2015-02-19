var gulp = require('gulp'),
	rename = require('gulp-rename'),
	argv = require('yargs').argv,
	less = require('gulp-less'),
	watch = (argv.watch !== undefined),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('watch', function () {
	gulp.watch('./src/style/**/*.less', ['less']);
});
gulp.task('less', function () {
	gulp.src('./src/style/core.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename('style.css'))
		.pipe(gulp.dest('./'));
});
var run = ['less'];
if (watch) {
	run.push('watch');
}
gulp.task('default', run);