var gulp        = require('gulp'),
	less        = require('gulp-less'),
	uglify      = require('gulp-uglify'),
	minifycss   = require('gulp-minify-css'),
	sprite      = require('gulp.spritesmith'),
	// imagemin    = require('gulp-imagemin'),
	clean       = require('gulp-clean'),
	plumber     = require('gulp-plumber'),
	concat      = require('gulp-concat'),
	cache       = require('gulp-cache'),
	path       	= {
					dev: 'dev/',
					dest: 'dest/'
				};
var browserSync     =   require("browser-sync").create();
var reload          =   browserSync.reload;

//less
gulp.task('less', function () {
    gulp
		.src(path.dev+'less/styles.less')
		.pipe(plumber(function(error){
			console.log(error);
			console.log('--------------------------  less Syntax Error! --------------------------');
		}))
		.pipe(less())
		.pipe(minifycss())
        .pipe(gulp.dest(path.dest+'css'))
        .pipe(reload({stream: true}));
});
// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', ['less'], function() {

    browserSync.init({
         proxy: "oneDay/demo/line/",
         port: 8080
    });
    gulp.watch("path.dest+'css'", ['less']);
    gulp.watch("../demo/**/*.html").on('change', reload);
   
});

gulp.task('r', function(){
	gulp
		.src(path.dev+'js/**.js')
		.pipe(plumber(function(error){
			console.log(error);
			console.log('--------------------------  js Syntax Error! --------------------------');
		}))
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.dest+'js/'));
});

//清理图片
gulp.task('clean', [/*'clean:css', 'clean:js', */'clean:imagesDefault', 'clean:imagesSprite']);

gulp.task('clean:css', function() {
	gulp
		.src([
			path.dest+'css/**'
		], {read: false})
		.pipe(clean({force: true}));
});

gulp.task('clean:js', function() {
	gulp
		.src([
			path.dest+'js/**/*'
		], {read: false})
		.pipe(clean({force: true}));
});

gulp.task('clean:imagesDefault', function() {
	gulp
		.src([
			path.dest+'img/default/*.{png,jpg,jpeg,gif}'
		], {read: false})
		.pipe(clean({force: true}));
});

gulp.task('clean:imagesSprite', function() {
	gulp
		.src([
			path.dest+'img/sprite/*.{png,jpg}'
		], {read: false})
		.pipe(clean({force: true}));
});



//复制文件
gulp.task('copy', ['clean', 'copy:js', 'copy:images']);

gulp.task('copy:js', function(){
	gulp
		.src(path.dev+'js/lib/*')
		.pipe(gulp.dest(path.dest+'js/lib/'));
});

gulp.task('copy:images', function(){
	gulp
		.src(path.dev+'img/default/**/*.{png,jpg,jpeg,gif}')

		.pipe(gulp.dest(path.dest+'img/'));
});


//sprite
gulp.task('sprite', ['sprite:png', 'sprite:jpg']);

//合并png
gulp.task('sprite:png', ['clean:imagesSprite'], function () {	
	var spriteData = gulp
						.src(path.dev+'img/sprite/**.png')
						.pipe(sprite({
							imgName: 'sprite.png',
							cssName: 'sprite-png.css',
							cssTemplate: path.dev+'less/core/handlebarsStr.css.handlebars',
							imgPath: '../img/sprite.png',
							padding: 10
						}));
		spriteData
			.img

			.pipe(gulp.dest(path.dest+'img/'));
		
		spriteData
			.css
			.pipe(gulp.dest(path.dev+'less/core/'));
});

//合并jpg
gulp.task('sprite:jpg', ['clean:imagesSprite'], function () {
	var spriteData = gulp
						.src(path.dev+'sprite/*.jpg')
						.pipe(sprite({
							imgName: 'sprite.jpg',
							cssName: 'sprite-jpg.css',
							cssTemplate: path.dev+'less/core/handlebarsStr.css.handlebars',
							imgPath: '../img/sprite.jpg'
						}));
		spriteData
			.img

			.pipe(gulp.dest(path.dest+'img/'));
		
		spriteData
			.css
			.pipe(gulp.dest(path.dev+'less/core/'));
});


gulp.task('default', ['clean', 'copy', 'sprite', 'r' , 'serve'], function(){
	
	//监听不合并图片
	gulp.watch(path.dev+'img/default/**/*.*', ['copy:images']);

	gulp.watch(path.dev+'js/lib/*', ['copy:js']);
	
	//监听sprite png
	gulp.watch(path.dev+'img/sprite/*.png', ['sprite:png']);
	
	//监听js
	gulp.watch(path.dev+'js/**.js', ['r']);

    //监听less
    gulp.watch(path.dev+'less/**/*.*', ['less']);
	
});