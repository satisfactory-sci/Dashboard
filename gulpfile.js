var gulp = require("gulp")
var browserify = require("browserify")
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var babelify = require("babelify")

gulp.task("build", function() {
  var b = browserify({
    entries: './src/index.js',
    debug: true,
    transform: ['babelify']
  })
  return b.bundle()
    .pipe(source('build.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest('./public'));
})

gulp.task("watch", function() {
  gulp.watch('src/*', ['build'])
})

gulp.task("default", function() {
  gulp.start('build', 'watch')
})
