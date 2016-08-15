var path = require('path');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function() {
  return del(['dist/**/*', 'test/**/*.js']);
})

gulp.task('compile-src', function() {  
  var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
  var tsResult = tsProject.src('src/**/*.ts').pipe(ts(tsProject));
  return tsResult.js.pipe(gulp.dest('dist'));
})

gulp.task('compile-test', function() {  
  var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
  var tsResult = tsProject.src('test/**/*.ts').pipe(ts(tsProject));
  return tsResult.js.pipe(gulp.dest('test'));
})

gulp.task('unitTests', function() {  
  gulp.src('')
    .pipe(jasmine({
      config: {
          "spec_dir": "dist",
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
          "spec_dir": "dist",
          "spec_files": [
            "**/*.[iI]ntegration.js"
          ],
          "stopSpecOnExpectationFailure": false,
          "random": false
        }
    }))
})

gulp.task('build', function() {
  runSequence('clean', 'compile-src');
})

gulp.task('test', function() {
  runSequence('clean', 'compile-src', 'compile-test', 'unitTests', 'integrationTests');
})