const babel = require('gulp-babel')
const gulp = require('gulp')
const del = require('del')

gulp.task('clean', () => {
  return del('dist')
})

gulp.task('build', [ 'clean' ], () => {
  return gulp
    .src('src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
})
