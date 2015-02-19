var gulp = require('gulp'),
	rename = require('gulp-rename'),
	argv = require('yargs').argv,
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	server = (argv.server !== undefined),
	watch = (argv.watch !== undefined),
	spawn = require('child_process').spawn,
	node;

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
if (server) {
	run.push('server');
	gulp.task('server', function () {
		if (node) node.kill();
		node = spawn('node', ['./server.js'], {
			stdio: 'inherit'
		});
	});
}
gulp.task('default', run);
process.on('exit', function () {
	if (node) node.kill();
});
process.on('SIGINT', function () {
	/* http://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js */
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	if (node) node.kill();
	process.exit();
});