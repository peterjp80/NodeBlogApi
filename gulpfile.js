var path = require('path');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var jasmine = require('gulp-jasmine');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function() {
  return del(['build/**/*']);
})

gulp.task('compile', function() {  
  var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
  var tsResult = tsProject.src(['src/**/*.ts', 'test/**/*.ts']).pipe(ts(tsProject));

  // var srcFilter = filter('src/**/*.js', {restore: true});
  // var testFilter = filter('test/**/*.js', {restore: true});
  return tsResult.js
    .pipe(gulp.dest('build'));
})

gulp.task('unitTests', function() {  
  gulp.src('')
    .pipe(jasmine({
      config: {
          "spec_dir": "build/test",
          "spec_files": [
            "**/*.[sS]pec.js"
          ],
          "stopSpecOnExpectationFailure": false,
          "random": false
        }
    }));    
})

gulp.task('integrationTests', function() {  
  gulp.src('')
    .pipe(jasmine({
      config: {
          "spec_dir": "build/test",
          "spec_files": [
            "**/*.[fF]unctional.js"
          ],
          "stopSpecOnExpectationFailure": false,
          "random": false
        }
    }))
})

gulp.task('build', function() {
  runSequence('clean', 'compile');
})

gulp.task('test', function() {
  runSequence('clean', 'compile', 'unitTests', 'integrationTests');
})