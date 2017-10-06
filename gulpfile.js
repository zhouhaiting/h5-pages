//引入gulp
var gulp = require('gulp');
//引入常用插件
var jshint = require('gulp-jshint');//检查js代码风格，错误
var uglify = require('gulp-uglify');//压缩js文件
var concat = require('gulp-concat');
var less = require('gulp-less'); //编译less文件
var minifyCSS = require('gulp-minify-css'); //压缩css文件
var imagemin = require('gulp-imagemin'); //图片压缩
var prefix = require('gulp-autoprefixer');
var del = require('del');
var bSync = require('browser-sync');

var paths = {
    vendor: 'app/js/util/**/*.js',//js下的第三方文件
    scripts: {
        src: 'app/js/**/*.js',
        vendor: '!app/js/util/**/*.js',
        dist: 'dist/js' //打包到dist下的js文件夹下
    },
    styles: {
        entry: 'app/css/index.css',
        src: 'app/css/*.css',
        dist: 'dist/css' //打包到dist下的css下的文件夹下
    }
};
//这个任务测试js代码风格,检查脚本是否有错误
gulp.task('test', function () { 
    return gulp.src([paths.scripts.src, paths.scripts.vendor])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

//这个任务是压缩合并js,依赖'test'
gulp.task('scripts',            
    gulp.series('test', function scriptsInternal() {
        return gulp.src([paths.scripts.src, paths.scripts.vendor]) //处理源代码,app/scripts下所有子目录,所有js文件,排除app/scripts/vendor下所有子目录的所有js文件,不做任何处理
            .pipe(concat('main.min.js'))          //合并app/scripts下所有子目录,所有js文件为main.min.js
            .pipe(uglify())                      //压缩混淆js代码,
            .pipe(gulp.dest(paths.scripts.dist))    //把上变main.min.js输出到dist/scripts目录,没有目录的话自动新建目录,目录可改为自己想要的
            .pipe(bSync.stream());              //后面监听js改变输出到浏览器端的数据流.
    })
);

//复制第三方文件到dist下的script下
gulp.task('clone',function() {
    return gulp.src(paths.vendor)
        .pipe(gulp.dest(paths.scripts.dist))
});

//复制html文件到dist
gulp.task('html',function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
});
//复制audio到dist
gulp.task('audio',function() {
    return gulp.src('app/audio/*')
        .pipe(gulp.dest('dist/audio'))
});
//压缩css文件
gulp.task('styles', function () {                //处理css样式
    return gulp.src(paths.styles.src)         //要处理样式的目录,这个用的less预处理器,如果用原生css,改一下后缀名
        // .pipe(less())                           //把less编译成css,如果用的原生css,这一步可以注释
        .pipe(minifyCSS())                      //压缩混淆css,如果不需要压缩,可以注释
        .pipe(prefix())                         //自动给css属性添加浏览器前缀,如 -webkit
        .pipe(gulp.dest(paths.styles.dist))         //输出到dist/styles目录,可更改目录
        .pipe(bSync.stream());                  //同上js
});

//压缩图片
gulp.task('pic', () =>
    gulp.src('app/images/*')
        .pipe(imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [{removeViewBox: true}]
    }))
        .pipe(gulp.dest('dist/images'))
);

//先清除dist文件夹，再自己创建一个dist
gulp.task('clean', function (done) {
    return del(['dist']);
});

gulp.task('server', function (done) {
    bSync({
        server: {
            baseDir: ['dist']
        }
    });
    done();
});

//直接运行default，默认执行括号里的4个任务
gulp.task('default', gulp.series('clean', gulp.parallel('styles', 'scripts','clone','pic','html','audio'), 'server',
    function watcher(done) {
        gulp.watch([paths.scripts.src, paths.scripts.vendor], gulp.parallel('scripts'));
        gulp.watch(paths.styles.src, gulp.parallel('styles'));
        gulp.watch('dist/**/*', bSync.reload);
        gulp.watch("app/*.html").on('change', bSync.reload);
    })
);
