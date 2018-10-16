/// <binding BeforeBuild='default' ProjectOpened='watch' />
const gulp = require('gulp'),
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
    babel = require('gulp-babel'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    log = require('gulplog'),
    jsonServer = require("gulp-json-srv");

const vendors = ['jquery', 'popper.js', 'bootstrap', 'moment', 'handlebars'];
const server = jsonServer.create({
    port: 8001,
    verbosity: {
        level: "info",
        urlTracing: true
    },
    baseUrl: '/api'
});
const templateDistributionLocation = "./dist";
const webDistributionLocation = "../Riegels";

const json = (callback) => {
    console.log(colors.green('Running JSON data generator task'));

    delete require.cache[require.resolve('./src/data/generate.js')];

    try {
        var jsonData = require('./src/data/generate.js');
        fs.writeFile("./src/data/db.json", JSON.stringify(jsonData()), 'utf8', (err) => {
            if (err)
                console.log(err);

            if (callback)
                callback();
        });
    } catch {
        console.log('there was a problem');
        if (callback)
            callback();
    }
};

const jsonsrv = () => {
    return gulp.src("./src/data/db.json")
        .pipe(server.pipe());
};

const html = () => {
    try {
        return gulp.src(['./src/markup/**/*.pug', '!src/markup/content/**/*.pug', '!src/markup/grids/**/*.pug', '!src/markup/mixins/**/*.pug'])
            .pipe(data(function (file) {
                return JSON.parse(fs.readFileSync('./src/data/db.json'));
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
    } catch(err) {
        console.log(err);
    }
};

const img = () => {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/img'))
        .pipe(gulp.dest(webDistributionLocation + '/img'));
};

const font = () => {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/fonts'))
        .pipe(gulp.dest(webDistributionLocation + '/fonts'));
};

const js = () => {
    console.log(colors.green('Running JavaScript Client task'));
    var b = browserify({
        entries: './src/js/app.js',
        debug: true
    })
        .external(vendors)
        .transform('babelify', {
            presets: ['@babel/preset-env']
        });

    return b.bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on('error', log.error)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
};

const jsv = () => {
    console.log(colors.green('Running JavaScript Vendor task'));
    var b = browserify({
        debug: true
    }).transform('babelify', {
        presets: ['@babel/preset-env']
    });

    vendors.forEach(lib => {
        b.require(lib);
    });

    return b.bundle()
        .pipe(source('vendors.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on('error', log.error)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
};

const scss = () => {
    console.log(colors.green('Running SCSS task'));
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');

    return bundle([
        './src/styles/global.scss'
    ], 'bundle.min.css');

    function bundle(source, dest) {
        return gulp.src(source)
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
        console.log(colors.yellow('File ' + path + ' ' + event));
        html();
        reload();
    });

    var sassWatcher = gulp.watch(['./src/styles/**/*.scss']);
    sassWatcher.on('all', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        scss();
        reload();
    });

    var jsWatcher = gulp.watch(['./src/js/**/*.js']);
    jsWatcher.on('all', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        js();
        reload();
    });

    var jsonWatcher = gulp.watch(['./src/data/generate.js']);
    jsonWatcher.on('change', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        server.kill(() => {
            json();
        });
        
    });

    var jsonDbWatcher = gulp.watch(['./src/data/*.json']);
    jsonDbWatcher.on('change', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        jsonsrv();
        reload();
    });

    //gulp.watch(["./src/data/db.json"], jsonsrv);

    callback();
};

gulp.task('serve', gulp.parallel(serve, watch));
gulp.task('watch', gulp.series(watch));
gulp.task('vendor', gulp.series(jsv));
gulp.task('default', gulp.series(json, jsonsrv, gulp.parallel(html, scss, js, jsv, img, font), serve, watch));
