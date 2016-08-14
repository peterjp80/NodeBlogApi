var path = require('path');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var runSequence = require('run-sequence');

gulp.task('build', function() {  
  var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
  var tsResult = tsProject.src().pipe(ts(tsProject));
  return tsResult.js.pipe(gulp.dest('dist'));
})

gulp.task('jasmine', function() { 
  
  gulp.src('')
    .pipe(jasmine({
      config: {
          "spec_dir": "dist",
          "spec_files": [
            "**/*.[sS]pec.js"
          ],
          "helpers": [
            "jasmine-helpers.js"
          ],
          "stopSpecOnExpectationFailure": false,
          "random": false
        }
    }))
})

gulp.task('test', function() {
  runSequence('build', 'jasmine');
})