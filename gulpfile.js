// gulpfile.js

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var clean = require('gulp-clean');

var paths = {
    src: "./src",
    tmp: "./tmp",
    scripts: './tmp/*.js',
    typescripts: 'src/**/*.ts',
    styles: ['./src/**/*.css', './src/**/*.scss'],
    index: './src/index.html',
    partials: ['src/**/*.html', '!src/index.html'],
    dist: './dist*',
    distDev: './dist.dev',
    distProd: './dist.prod',
    distScriptsProd: './dist.prod/scripts',
    scriptsDevServer: 'devServer/**/*.js'
}; 

gulp.task('default', ['serve']);

gulp.task('clean', ['clean-tmp', 'clean-dist']);

gulp.task('clean-tmp', function() {
    return gulp.src(paths.tmp, {read: false})
        .pipe(clean())
        ;
});

gulp.task('clean-dist', function() {
    return gulp.src(paths.dist, {read: false})
        .pipe(clean())
        ;
});

function checkDependencies() {
    var fs = require('fs');
    var json = JSON.parse(fs.readFileSync('./package.json'));
    var dep = json['dependencies'];
    var ret = {};
    console.info(dep);
    if (dep) {
        ret = Object.keys(dep);
        console.info('Dependencias: ' + ret);
    } else {
        console.error('Nenhuma dependencia encontrada.');
    }
    return ret;
}

gulp.task('check');

gulp.task('styles');

var ts = require('gulp-typescript');
var merge = require('merge2');  // Requires separate installation
var tsProject = ts.createProject("tsconfig.json"); 

gulp.task('compile-ts', function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(paths.tmp));
});

gulp.task('build', ['styles', 'compile-ts', 'inject']);

gulp.task('serve', ['build', 'browser-sync']);

function browserSyncInit(baseDir, files) {  
  return browserSync.instance = browserSync.init(files, {
    startPath: paths.tmp, server: { baseDir: baseDir }
  });
}

// starts a development server
// runs preprocessor tasks before, 
// and serves the src and .tmp folders
gulp.task('browser-sync', ['watch'], function () {
return browserSync.init({
        server: {
            baseDir: [paths.tmp, paths.src]
        }
    });
});

// starts a production server
// runs the build task before, 
// and serves the dist folder
gulp.task('serve:dist', ['build'], function () {  
  return browserSync.init({
        server: {
            baseDir: paths.distProd
        }
    });
});

gulp.task('inject', function () {

  var injectStyles = gulp.src([
      // selects all css files from the .tmp dir
      paths.src + '/**/*.css'
    ], { read: false }
  );

  var injectScripts = gulp.src([
    // selects all js files from .tmp dir
    paths.scripts,
    // but ignores test files
    '!' + '/**/*.test.js' 
    // then uses the gulp-angular-filesort plugin
    // to order the file injection
  ]);


  return gulp.src(paths.src + '/*.html')
    .pipe(inject(injectStyles))
    .pipe(inject(injectScripts))
    // write the injections to the .tmp/index.html file
    .pipe(gulp.dest(paths.tmp)); 
    // so that src/index.html file isn't modified  
    // with every commit by automatic injects

});

gulp.task('watch', ['build'], function() {
    return gulp.watch(paths.typescripts, ['build', browserSync.reload]);
})
