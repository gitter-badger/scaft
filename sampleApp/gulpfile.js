var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var processhtml = require('gulp-processhtml');
var watch = require('gulp-watch');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

gulp.task('watch', function(){

	var files_to_watch = ['./app/js/**/*.js', './app/css/**/*.css'];

	browserSync.init({
		port:5050
	});
	gulp.src(files_to_watch).pipe(watch(files_to_watch, function() {
	    gulp.start('inject');
	    browserSync.reload();
	}));
});

gulp.task('server', function () {
	nodemon({
		script: 'index.js',
		watch: ['index.js']
	}).on('start', function () {
		
	});
})

gulp.task('inject',function(){
	var target = gulp.src('index.html',{cwd: './app/'});
	var sources = gulp.src(['./js/**/*.js','./css/**/*.css'],{cwd: './app/'});

	return target.pipe(inject(sources,{read: false, addRootSlash: false}), {relative: true}).pipe(gulp.dest('./app'));
});

gulp.task('html:build',function(){
	gulp.src('./app/index.html')
               .pipe(processhtml())
               .pipe(gulp.dest('./dist'));
});

gulp.task('js:build', function() {
	gulp.src('./app/js/**/*.js')
		.pipe(concat('app.min.js'))
    	.pipe(uglify())
    	.pipe(gulp.dest('./dist/js'))

});

gulp.task('css:build', function(){
	return gulp.src('./app/css/**/*.css')
	    .pipe(minifyCSS())
	    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
	    .pipe(concat('style.min.css'))
	    .pipe(gulp.dest('dist/css'))	
});



gulp.task('build',['js:build','css:build','html:build']);

gulp.task('default',['inject','watch','server']);
