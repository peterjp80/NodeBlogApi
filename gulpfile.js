var path = require('path');
var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('build', function() {
  var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
  var tsResult = tsProject.src().pipe(ts(tsProject));
  return tsResult.js.pipe(gulp.dest('dist'));
})