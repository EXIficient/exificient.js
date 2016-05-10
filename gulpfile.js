// Include gulp
var gulp = require('gulp');

// Include plugins
//var jshint = require('gulp-jshint'); //TBD hint it so it stinks less
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var del = require("del");
//var bower = require("gulp-bower"); //TBD automate bower versioning 

gulp.task('default', function () {
	return gulp.src(['exificient.js','exificient-for-json.js'])
        .pipe(sourcemaps.init())
		//.pipe(concat('exificient-for-json-bundle.js'))
        //.pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write("./"))
		.pipe(gulp.dest('.'));
});

gulp.task('clean', function(cb) {
  del("*.min.js*",cb);  
});