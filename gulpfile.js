// noinspection JSUnresolvedFunction
let gulp = require('gulp'), // Сам gulp
    sass = require('gulp-sass'), // Модуль для компиляции sass
    jsMin = require('gulp-terser'), // Минификация js
    autoPrefix = require('gulp-autoprefixer'), // Вендорные префиксы
    bs = require('browser-sync'), // Сервер
    htmlMin = require('gulp-htmlmin'), // Минификация html
    rename = require('gulp-rename'), // Rename
    delFiles = require('del'), // Delete files
    cssMin = require('gulp-csso'), //  Минификация css
    babel = require('gulp-babel'), // babel
    imgMin = require('gulp-imagemin'); //  Минификация img

// Gulp methods
// gulp.task() - создание новой задачи
// gulp.src() - позволяет выбрать файлы
// gulp.dest() - позволяет переместить/сохранить файлы
// gulp.series() - выполняет задачи последовательно
// gulp.parallel() - выполняет задачи параллельно
// gulp.watch() - следит за изменениями файлов

gulp.task('test', () => {
    return console.log('Gulp work!!');
});

// HTML
gulp.task('html', () => {
    return gulp.src('app/*.html') // Выбираем файлы
        .pipe(htmlMin({
            collapseWhitespace: true  // Минифицируем файлы
        }))
        .pipe(gulp.dest('dist')); // Сохраняем файлы
});

//SASS
gulp.task('sass', () => {
    // return gulp.src('app/sass/**/*.+(scss|sass)')
    // return gulp.src('app/img/**/*.+(jpg|png|gif|svg)')
    // return gulp.src(['app/img/**/*.+(jpg|png|gif|svg)', 'app/content/*.jpg'])
    return gulp.src('app/style/*.sass')
        .pipe(sass())
        .pipe(autoPrefix())
        .pipe(cssMin())
        .pipe(gulp.dest('dist/style/'))
    // .pipe(bs.reload({stream: true}))
});

//Delete files
gulp.task('clean', () => {
    return delFiles(['dist/**', '!dist'])
});

// JS - es6
gulp.task('js:es6', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(jsMin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
    // .pipe(bs.reload({stream: true}))
});

// JS - babel
gulp.task('js:babel', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({
            suffix: '.es5'
        }))
        .pipe(gulp.dest('dist/js'))
});

// IMG
gulp.task('img', () => {
    return gulp.src('app/img/*')
        .pipe(imgMin([
            imgMin.gifsicle({interlaced: true}),
            imgMin.jpegtran({progressive: true}),
            imgMin.optipng({optimizationLevel: 5}),
            imgMin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('dist/img'))
});

// Server
gulp.task('server', () => {
    return bs({
        server: {
            baseDir: 'dist'
        },
        //browser: 'google chrome canary'
    })
});

// Следим за html
gulp.task('html:watch', () => {
    return gulp.watch('app/*.html', gulp.series('html', (done) => {
        bs.reload();
        done();
    }))
});

// Следим за sass
gulp.task('sass:watch', () => {
    return gulp.watch('app/style/*.sass', gulp.series('sass', (done) => {
        bs.reload();
        done();
    }))
});

// Следим за JS
gulp.task('js:watch', () => {
    return gulp.watch('app/js/**/*.js', gulp.series('js:es6', (done) => {
        bs.reload();
        done();
    }))
});

// Следим за img
gulp.task('img:watch', () => {
    return gulp.watch('app/img/*', gulp.series('img', (done) => {
        bs.reload();
        done();
    }))
});

//Components
gulp.task('bower:js', () => {
    // return gulp.task(['app/bower_components/jquery/dist/jquery.min.js', ])
    return gulp.src(['bower_components/jquery/dist/jquery.min.js', 'bower_components/jquery-ui/jquery-ui.min.js',
        'bower_components/owl.carousel/dist/owl.carousel.min.js'])
        .pipe(gulp.dest('dist/js'));
});

gulp.task('bower:css', () => {
    return gulp.src(['bower_components/jquery-ui/themes/base/slider.css',
        'bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
        'bower_components/owl.carousel/dist/assets/owl.theme.default.min.css'])
        .pipe(gulp.dest('dist/style'))
});

gulp.task('json', () => {
    return gulp.src('app/json/*.json')
        .pipe(gulp.dest('dist/json'));
});

// gulp.task('sass:watch', () => {
//     return gulp.watch('app/sass/**/*.scss', gulp.series('sass'));
// });
// gulp.task('js:watch', () => {
//     return gulp.watch('app/js/**/*.js', gulp.series('js:es6'));
// });

// Переопределяем задачу по-умолчанию
gulp.task('default', gulp.series('clean', gulp.parallel('html', 'sass', 'js:es6', 'js:babel', 'bower:js', 'bower:css',
    'json', 'img'), gulp.parallel('html:watch', 'sass:watch', 'js:watch', 'img:watch', 'server')));