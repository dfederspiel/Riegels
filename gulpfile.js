/// <binding BeforeBuild='default' ProjectOpened='watch' />
var gulp = require('gulp'),
    pug = require('gulp-pug'),
    gutil = require('gulp-util'),
    minify = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    entities = require('html-entities').XmlEntities,
    replace = require('gulp-replace'),
    pump = require('pump'),
    rename = require('gulp-rename');
    browserSync = require('browser-sync'),
    data = require('gulp-data'),
    fs = require("fs"),
    watch = require('gulp-watch'),
    reload = browserSync.reload;

require('es6-promise').polyfill();

const templateDistributionLocation = "./dist";

gulp.task('json', function(){
    var json = require('./src/data/generate.js');
    fs.writeFile("./src/data/db.json", JSON.stringify(json()), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
})

gulp.task('html', function () {
    gulp.src('./src/markup/**/*.pug')
        .pipe(data( function(file) {
            return JSON.parse(fs.readFileSync('./src/data/db.json'))
        }))
        .pipe(pug({
            pretty: true,
            debug: false,
            compileDebug: false
        }))
        .on('error', gutil.log)
        .pipe(replace(entities.decode("&#65279;"), ''))
        .pipe(gulp.dest(templateDistributionLocation + '/'));
});

gulp.task('img', function () {
    gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/img'))
});

gulp.task('font', function () {
    gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/fonts'))
});

gulp.task('js', function (callback) {
    pump([
        gulp.src('./src/js/*.js'),
        sourcemaps.init(),
        babel({
            presets: ['env']
        }),
        uglify(),
        rename({ suffix: '.min' }),
        concat('all.min.js'),
        sourcemaps.write('.'),
        gulp.dest(templateDistributionLocation + '/js'),

        gulp.src('./src/js/vendor/*.js'),
        sourcemaps.init(),
        babel({
            presets: ['env']
        }),
        uglify(),
        rename({ suffix: '.min' }),
        concat('vendor.min.js'),
        sourcemaps.write('.'),
        gulp.dest(templateDistributionLocation + '/js'),

    ],
        callback
    );
});

gulp.task('autoprefixer', function () {
    var postcss = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('./src/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dest'));
});

gulp.task('sass', function () {

    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');

    bundle([
        './src/styles/global.scss'
    ], 'bundle.min.css');

    function bundle(source, dest) {
        gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(concat(dest))
            .pipe(minify())
            .pipe(postcss([autoprefixer()]))
            .pipe(sourcemaps.write('.'))
            .on('error', gutil.log)
            .pipe(gulp.dest(templateDistributionLocation + '/css'));
    }
})

gulp.task('serve', ['html', 'sass', 'js'], function () {
    browserSync({
        notify: true,
        logPrefix: 'DAF',
        reloadDelay: 1000,
        server: {
            baseDir: "./dist/",
            index: "index.html"
        }
    });

    watch(['./src/markup/**/*.html', './src/markup/**/*.pug'], function(){ gulp.start('html'); reload(); });
    watch(['./src/styles/**/*.scss'], function(){ gulp.start('sass'); reload(); });
    watch(['./src/js/**/*.js'], function(){ gulp.start('js'); reload(); });
});

gulp.task('watch', ['sass', 'js', 'img', 'font'], function () {
    watch(['./src/styles/**/*.scss'], function(){ gulp.start('sass') });
    watch(['./src/js/**/*.js'], function(){ gulp.start('js') });
    watch(['./src/img/**/*.*'], function(){ gulp.start('img') });
    watch(['./src/fonts/**/*.*'], function(){ gulp.start('fonts') });
});

gulp.task('default', ['html', 'sass', 'js', 'img', 'font']);
