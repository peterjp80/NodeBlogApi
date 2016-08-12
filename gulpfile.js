var path = require('path');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var runSequence = require('run-sequence');
var env = require('gulp-env');
var fileExists = require('file-exists');

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

// gulp.task('prep-env', function() {
//   if (fileExists('.env.json')) {
//     console.log('Setting environment variables');
//     env({
//       file: '.env.json',
//       vars: {"DB_NAME": "nbadbtest"}
//     });
//     console.log("DB_NAME=%s", process.env.DB_NAME); // This has a value
//   } else {
//     console.log('.env.json file not found. Not setting environment variables.')
//   }
// })

gulp.task('test', function() {
  runSequence('build', 'jasmine');
})