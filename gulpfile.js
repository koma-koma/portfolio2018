var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var browserSync = require("browser-sync");
var notify = require("gulp-notify");
var pug = require("gulp-pug");

gulp.task('default', ['sass', 'browser-sync', 'pug', 'watch']);

//sassとpugの監視をして変換処理させる
gulp.task('watch', () => {
    gulp.watch(['./sass/**'], () => {
        gulp.start(['sass']);
    });
    gulp.watch(['./pug/**'], () => {
        gulp.start(['pug']);
    });
});

//sassをcssに変換
gulp.task("sass", () => {
    gulp.src("./sass/**/*scss")
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
    .pipe(sass({
      includePaths: require('node-reset-scss').includePath
    }))
    .pipe(gulp.dest("./public/css"))
        //reloadせずにinjectする
        .pipe(browserSync.stream())
});

//pugをhtmlに変換
gulp.task("pug", () => {
    var option = {
        pretty: true
    }
    gulp.src("./pug/**/*.pug")
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(pug(option))
        .pipe(gulp.dest("./public/"))
});

//ブラウザ表示
gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: "./public/"   //サーバとなるrootディレクトリ
        }
    });
    //ファイルの監視
    //以下のファイルが変わったらリロードする
    gulp.watch("./public/js/**/*.js",     ['reload']);
    gulp.watch("./public/*.html",         ['reload']);
});
//ブラウザリロード処理
gulp.task('reload', () => {
    browserSync.reload();
});
