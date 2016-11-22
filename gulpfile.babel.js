import gulp from 'gulp';
import jshint from 'gulp-jshint';
import nodemon from 'gulp-nodemon';
import jsonlint from 'gulp-jsonlint';
import watch from 'gulp-watch';
import nodeunit from 'gulp-nodeunit';

/**********************

    JAVASCRIPT TASKS

***********************/

gulp.task('jsonlint', () => {
  return gulp.src([
    'config.json',
    'config.sample.json',
  ])
  .pipe(jsonlint())
  .pipe(jsonlint.reporter());
});

gulp.task('lint', () => {
  return gulp.src([
    'gulpfile.babel.js',
    '**/*.js',
    '!node_modules/**'
  ])
  .pipe(jshint({
    esversion: 6
  }))
  .pipe(jshint.reporter('default'));
});

gulp.task('nodeunit', () => {

  return gulp.src([
    '**/*.test.js',
    '!node_modules/**'
  ])
  .pipe(nodeunit({
    reporter: 'default'
  }));
});

/*****************************

          DEV TASKS

******************************/

// Monitor and restart node server
gulp.task('monitor', () => {
	nodemon({
		script: 'index.js',
		ext: 'js html',
		tasks: ['lint', 'nodeunit'],
		watch: ['**/*.test.js', '**/*.js', 'index.js', '!node_modules/**'],
		env: {
			'NODE_ENV': 'development'
		},
		"ignore": [
			".git",
			"node_modules/**/node_modules",
		],
		legacyWatch: true
	}).on('restart', () => {
		console.log('Restarting....');
	});
});

// Watch Files For Changes
gulp.task('watch', () => {
	gulp.watch([
    'tests/**/*.test.js',
    'modules/**/*.js'
  ], ['nodeunit', 'lint']);
});

gulp.task('default', [
  'lint',
  'jsonlint',
  'monitor',
  'nodeunit',
]);
