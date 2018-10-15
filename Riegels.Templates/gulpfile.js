/// <binding BeforeBuild='default' ProjectOpened='watch' />
var gulp = require('gulp'),
    pug = require('gulp-pug'),
    gutil = require('gulp-util'),
    minify = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    entities = require('html-entities').XmlEntities,
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    data = require('gulp-data'),
    fs = require("fs"),
    colors = require('colors'),
    reload = browserSync.reload,
    babel = require('gulp-babel');

const templateDistributionLocation = "./dist";
const webDistributionLocation = "../Riegels";

const json = (callback) => {
    var json = require('./src/data/generate.js');
    fs.writeFile("./src/data/db.json", JSON.stringify(json()), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    callback();
}

const html = (callback) => {
    gulp.src(['./src/markup/**/*.pug', '!src/markup/content/**/*.pug', '!src/markup/grids/**/*.pug', '!src/markup/mixins/**/*.pug'])
        .pipe(data(function (file) {
            return JSON.parse(fs.readFileSync('./src/data/db.json'))
        }))
        .pipe(pug({
            pretty: true,
            debug: false,
            compileDebug: false
        }))
        .on('error', gutil.log)
        .pipe(replace(entities.decode("&#65279;"), ''))
        .pipe(gulp.dest(templateDistributionLocation + '/'))
        .pipe(gulp.dest(webDistributionLocation + '/'));

    callback();
};

const img = (callback) => {
    gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/img'))
        .pipe(gulp.dest(webDistributionLocation + '/img'));

    callback();
}

const font = (callback) => {
    gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/fonts'))
        .pipe(gulp.dest(webDistributionLocation + '/fonts'));

    callback();
}

const js = (callback) => {

    gulp.src('./src/js/client/**/*.js')
        .pipe(sourcemaps.init())
        //uglify(),
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(concat('client.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(templateDistributionLocation + '/js'))
        .pipe(gulp.dest(webDistributionLocation + '/js'));
    callback();
};

const jsv = (callback) => {
    gulp.src('./src/js/vendor/**/*.js')
        .pipe(sourcemaps.init())
        //uglify(),
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(concat('vendor.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(templateDistributionLocation + '/js'))
        .pipe(gulp.dest(webDistributionLocation + '/js'));
    callback();
};

const autoprefixer = (callback) => {
    var postcss = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');
    callback();
    return gulp.src('./src/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dest'));

}

const scss = (callback) => {

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
            .pipe(gulp.dest(templateDistributionLocation + '/css'))
            .pipe(gulp.dest(webDistributionLocation + '/css'));

    }
    callback();
};

const serve = (callback) => {
    browserSync({
        notify: true,
        logPrefix: 'DAF',
        reloadDelay: 1000,
        port: 8000,
        ui: {
            port: 8080
        },
        server: {
            baseDir: "./dist/",
            index: "index.html"
        }
    }, callback);
};

const watch = (callback) => {
    var htmlWatcher = gulp.watch(['./src/markup/**/*.html', './src/markup/**/*.pug']);
    htmlWatcher.on('all', function (event, path, stats) {
        console.log(colors.green('File ' + path + ' ' + event + ', running html task'));
        html(reload);
    });

    var sassWatcher = gulp.watch(['./src/styles/**/*.scss']);
    sassWatcher.on('all', function (event, path, stats) {
        console.log(colors.green('File ' + path + ' ' + event + ', running sass task'));
        scss(reload);
    });

    var jsWatcher = gulp.watch(['./src/js/client/**/*.js']);
    jsWatcher.on('all', function (event, path, stats) {
        console.log(colors.green('File ' + path + ' ' + event + ', running javascript task'));
        js(reload);
    });

    var jsvWatcher = gulp.watch(['./src/js/vendor/**/*.js']);
    jsvWatcher.on('all', function (event, path, stats) {
        console.log(colors.green('File ' + path + ' ' + event + ', running javascript task'));
        jsv(reload);
    });
    callback();
}

gulp.task('serve', gulp.series(json, html, scss, js, jsv, img, font, serve, watch));
gulp.task('watch', gulp.series(watch));

gulp.task('default', gulp.series(gulp.parallel(json, html, scss, js, jsv, img, font)));
