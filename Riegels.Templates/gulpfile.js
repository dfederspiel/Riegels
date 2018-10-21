/// <binding BeforeBuild='default' ProjectOpened='default' />
const gulp = require('gulp'),
    pug = require('gulp-pug'),
    minify = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    entities = require('html-entities').XmlEntities,
    replace = require('gulp-replace'),
    data = require('gulp-data'),
    fs = require("fs"),
    colors = require('colors'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    express = require('express'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    exec = require("child_process").exec;

const config = {
    vendors: ['jquery', 'popper.js', 'bootstrap', 'moment', 'handlebars'],
    browser_sync: {
        port: 8000,
        ui: 8080
    },
    quicktype: {
        distributionPath: '../Riegels/Models/',
        rootUrl: 'http://localhost:8000',
        modelServicePaths: [
            {
                fileName: "Events",
                url: "/api/events"
            },
            {
                fileName: "Author",
                url: "/api/authors"
            }
        ]
    }

}

let router = express.Router();
let jsonServer = require("json-server");
let server = null;

const templateDistributionLocation = "./dist";
const webDistributionLocation = "../Riegels";

const createModels = (cb) => {
    console.log(colors.cyan('Generating C# Models'.big));

    exec('quicktype ./src/data/db.json -l schema -o ./src/data/schema.json')

    config.quicktype.modelServicePaths.forEach(path => {
        console.log("Item" + path.url, path.fileName);
        exec(`quicktype ${config.quicktype.rootUrl}${path.url} -l csharp -o ${config.quicktype.distributionPath}${path.fileName}.cs`, function (err, stdout, stderr) {
            if (stdout)
                console.log(colors.green(stdout));
            if (stderr) {
                console.log(colors.red(stderr));
            if (err)
                console.log(colors.red(err));
            }
        });
    });
    if (cb)
        cb();
}

const json = (callback) => {
    console.log(colors.cyan('Generating a new DB'));

    delete require.cache[require.resolve('./src/data/generate.js')];

    try {
        var jsonData = require('./src/data/generate.js');
        fs.writeFile("./src/data/db.json", JSON.stringify(jsonData()), 'utf8', (err) => {
            if (err)
                console.log(err);
            else
                console.log(colors.green('DB.json Saved'.bold));

            if (callback)
                callback();
        });
    } catch (err) {
        console.log(colors.red(err.toString()));
        if (callback)
            callback();
    }
};

const html = (callback) => {
    console.log(colors.cyan('transpiling PUG'));
    return gulp.src(['./src/markup/**/*.pug', '!src/markup/content/**/*.pug', '!src/markup/grids/**/*.pug', '!src/markup/mixins/**/*.pug'])
        .pipe(data(function (file) {
            console.log(colors.bold('injecting db.json into pug hyperspace'));
            return JSON.parse(fs.readFileSync('./src/data/db.json'));
        }))
        .pipe(pug({
            pretty: true,
            debug: false,
            compileDebug: false
        }).on('error', function (err) {
            console.log(colors.red(err.message));
            console.log(colors.grey(err.stack));
            callback();
        }))
        .pipe(replace(entities.decode("&#65279;"), ''))
        .pipe(gulp.dest(templateDistributionLocation + '/'))
        .pipe(gulp.dest(webDistributionLocation + '/'))
        .on('end', function () {
            console.log(colors.green('transpilation complete'));
            callback();
        });
};
const img = (callback) => {
    console.log(colors.cyan('Copying Images'));
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/img'))
        .pipe(gulp.dest(webDistributionLocation + '/img'))
        .on('error', function (err) {
            console.log(colors.red(err.toString()));
            callback();
        }).on('end', function () {
            callback();
        });
};
const font = () => {
    console.log(colors.cyan('Copying Fonts'));
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/fonts'))
        .pipe(gulp.dest(webDistributionLocation + '/fonts'));
};
const js = (callback) => {
    console.log(colors.cyan('Bundling and Babeling JS'));
    var b = browserify({
            entries: './src/js/app.js',
            debug: true
        })
        .external(config.vendors)
        .transform('babelify', {
            presets: ['@babel/preset-env']
        });

    return b
        .bundle((err) => {
            if (err)
                console.log(colors.red(err.toString()));

            if (callback)
                callback();
        })
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', function (err) {
            console.log(colors.red(err.toString()));
            callback();
        })
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(templateDistributionLocation + '/js'))
        .pipe(gulp.dest(webDistributionLocation + '/js'))
        .on('end', function () {
            callback();
        });
};
const jsv = (callback) => {
    console.log(colors.cyan('Bundling and Babeling Vendor JS'));
    var b = browserify({
        debug: true
    }).transform('babelify', {
        presets: ['@babel/preset-env']
    });

    config.vendors.forEach(lib => {
        b.require(lib);
    });

    return b
        .bundle((err) => {
            if (err)
                console.log(colors.red(err.toString()));

            if (callback)
                callback();
        })
        .pipe(source('vendors.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', function (err) {
            console.log(colors.red(err.toString()));
            callback();
        })
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(templateDistributionLocation + '/js'))
        .pipe(gulp.dest(webDistributionLocation + '/js'));
};
const scss = (callback) => {
    console.log(colors.cyan('Transpiling Sass to Css'));
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
            .on('error', function (err) {
                console.log(colors.red(err.toString()));
                callback();
            })
            .pipe(gulp.dest(templateDistributionLocation + '/css'))
            .pipe(gulp.dest(webDistributionLocation + '/css'))
            .on('end', function () {
                callback();
            });

    }
};
const serve = (callback) => {
    console.log(colors.cyan('Standing up your server'));
    build_routes();
    browserSync.init({
        notify: true,
        logPrefix: 'Server Says:',
        port: config.browser_sync.port,
        server: {
            baseDir: "./dist/",
            index: "index.html"
        },
        ui: {
            port: config.browser_sync.ui
        },
        middleware: [function (req, res, next) {
            router(req, res, next)
        }]
    }, function (err, bs) {
        callback();
    });
};
const build_routes = () => {
    console.log(colors.cyan('Rebuilding routes'));
    router = express.Router();
    server = jsonServer.create({
        verbosity: {
            level: "info",
            urlTracing: false
        }
    });
    server.use(jsonServer.defaults());
    server.use(jsonServer.router('./src/data/db.json'));
    router.use('/api', server)
    router.use('/test', (req, res, next) => {
        res.render("Oh No")
    })
    //router.use(express.static('./dist'));
};
const watch = (callback) => {
    console.log(colors.cyan('Watching...'));
    gulp.watch(['./src/markup/**/*.pug']).on('all', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        html(reload);
    });

    gulp.watch(['./src/styles/**/*.scss']).on('all', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        scss(reload);
    });

    gulp.watch(['./src/js/**/*.js']).on('all', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        js(reload);
    });

    gulp.watch(['./src/data/generate.js']).on('change', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        json(() => {
            build_routes();
            createModels();
            reload();
        });
    });

    gulp.watch(['./src/img/**/*']).on('add', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
        img(reload);
    });

    callback();
};

gulp.task('models', gulp.series(json))
gulp.task('serve', gulp.series(json, serve, watch));
gulp.task('watch', gulp.series(watch));
gulp.task('vendor', gulp.series(jsv));
gulp.task('default', gulp.series(json, gulp.parallel(html, scss, js, img, font), gulp.parallel(serve, watch, createModels)));