const babel = require('gulp-babel')
const gulp = require('gulp')
const del = require('del')

const srcGlob = 'src/**/*.js'
const destDir = 'dist'

gulp.task('clean', () => {
  return del(destDir)
})

gulp.task('build', [ 'clean' ], () => {
  return gulp.src(srcGlob)
    .pipe(babel())
    .pipe(gulp.dest(destDir))
})

gulp.task('watch', [ 'build' ], () => {
  return gulp.watch(srcGlob, [ 'build' ])
})
