const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const ftp = require('vinyl-ftp');
const del = require('del');

// Очистка папки dist
gulp.task('clean', () => {
    return del(['dist/**/*']);
  });

// Компиляция и минимизация CSS
gulp.task('styles', () => {
  return gulp
    .src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// Объединение и минимизация JS
gulp.task('scripts', () => {
  return gulp
    .src('src/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});
// Перенос JSON-файла в папку dist/js
gulp.task('json', () => {
    return gulp
        .src('src/js/**.json')
        .pipe(gulp.dest('dist/js'));
});

// Минимизация HTML
gulp.task('html', () => {
  return gulp
    .src('src/pages/**.html')
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});
// Перенос изображений в папку dist
gulp.task('images', () => {
    return gulp
      .src('src/img/**/*.{jpg,jpeg,png,gif,svg}')
      .pipe(gulp.dest('dist/img'));
  });
  
  // Перенос иконок в папку dist
  gulp.task('icons', () => {
    return gulp
      .src('src/icons/**/*.{jpg,jpeg,png,gif,svg}')
      .pipe(gulp.dest('dist/icons'));
  });

// Копирование остальных файлов и папок в dist
gulp.task('copy', () => {
    return gulp
      .src(['src/**/*', '!src/scss/**', '!src/js/**', '!src/pages/**', '!src/images/**', '!src/icons/**'])
      .pipe(gulp.dest('dist'));
  });
// Запуск локального сервера и отслеживание изменений
gulp.task('serve', () => {
  browserSync.init({
    server: './dist',
  });

  gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('src/js/**/*.js', gulp.series('scripts'));
  gulp.watch(['src/pages/**/*.html', 'src/parts/**/*.html'], gulp.series('html')).on('change', browserSync.reload);
});

// Задача по умолчанию
gulp.task('default', gulp.series('clean', 'styles', 'scripts', 'json', 'html', 'images', 'icons', 'copy', 'serve'));
    
// Задача для отправки на FTP-сервер
gulp.task('deploy', () => {
  const conn = ftp.create({
    host: 'corsa.cityhost.com.ua', // Замените на адрес вашего FTP-сервера
    user: 'chf6b5ab60', // Замените на ваше имя пользователя FTP
    password: 'b7a1ea740b', // Замените на ваш пароль FTP
    parallel: 10,
  });

  const globs = ['dist/**'];

  return gulp
    .src(globs, { base: './dist', buffer: false })
    .pipe(conn.dest('/www/tesa.org.ua')); // Замените на путь на FTP-сервере, куда нужно загрузить файлы
});
