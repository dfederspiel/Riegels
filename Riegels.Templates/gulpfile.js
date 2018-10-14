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
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    data = require('gulp-data'),
    fs = require("fs"),
    watch = require('gulp-watch'),
    colors = require('colors'),
    jsonServer = require('json-server'),
    reload = browserSync.reload;

require('es6-promise').polyfill();

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
    pump([
        gulp.src('./src/js/*.js'),
        //sourcemaps.init(),
        //babel({
        //    presets: ['env']
        //}),
        uglify(),
        rename({ suffix: '.min' }),
        concat('all.min.js'),
        //sourcemaps.write('.'),
        gulp.dest(templateDistributionLocation + '/js'),
        gulp.dest(webDistributionLocation + '/js'),


        gulp.src('./src/js/vendor/*.js'),
        //sourcemaps.init(),
        //babel({
        //    presets: ['env']
        //}),
        uglify(),
        rename({ suffix: '.min' }),
        concat('vendor.min.js'),
        //sourcemaps.write('.'),
        gulp.dest(templateDistributionLocation + '/js'),
        gulp.dest(webDistributionLocation + '/js'),


    ],
        callback
    );
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
}

gulp.task('serve', gulp.series(gulp.parallel(html, scss, js), function (callback) {
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
            index: "index.html",
        }
    });

    var htmlWatcher = gulp.watch(['./src/markup/**/*.html', './src/markup/**/*.pug']);
    htmlWatcher.on('all', function (event, path, stats) {
        console.log('File ' + path + ' ' + event + ', running html task');
        html(() => reload());
    });

    var sassWatcher = gulp.watch(['./src/styles/**/*.scss']);
    sassWatcher.on('all', function (event, path, stats) {
        console.log('File ' + path + ' ' + event + ', running sass task');
        scss(() => reload());
    });

    var jsWatcher = gulp.watch(['./src/js/**/*.js']);
    jsWatcher.on('all', function (event, path, stats) {
        console.log(colors.green('File ' + path + ' ' + event + ', running javascript task'));
        js(() => reload());
    });
    callback();
}));

gulp.task('watch', gulp.series(gulp.parallel(scss, js, img, font), function () {
    watch(['./src/styles/**/*.scss'], function () { gulp.series('sass') });
    watch(['./src/js/**/*.js'], function () { gulp.series('js') });
    watch(['./src/img/**/*.*'], function () { gulp.series('img') });
    watch(['./src/fonts/**/*.*'], function () { gulp.series('fonts') });
}));

gulp.task('default', gulp.series(gulp.parallel(json, html, scss, js, img, font)));
