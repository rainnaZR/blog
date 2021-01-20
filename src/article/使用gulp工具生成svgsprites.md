### 简介

SVG即可缩放矢量图形 (Scalable Vector Graphics)的简称, 是一种用来描述二维矢量图形的XML标记语言. SVG图形不依赖于分辨率, 因此图形不会因为放大而显示出明显的锯齿边缘.使用svg格式我们可以直接用代码来描绘图像，可以用任何文字处理工具打开svg图像，通过改变部分代码来使图像具有交互功能，并可以随时插入到HTML中通过浏览器来浏览。

 

#### 优点：

缩放无损还原
可设置颜色,大小,使用较灵活
可利用CSS实现动画
减少HTTP请求

#### 缺点：

SVG在绘制的性能上比PNG要差
复杂的图形或渐变可能显示不全
兼容性稍差
 

### svg sprites

CSS sprites我们都很熟悉,将多个图标合在一个图片文件上,然后通过CSS设置背景图片的坐标来显示对应的部分.CSS sprites技术较成熟,兼容性好。但是缺点就是不够灵活,图标都是切死的,而且放大缩小会显示锯齿。所以如果需求里有图标是可变化的,可以尝试使用SVG图。如果有多个SVG图,可使用gulp-svg-symbols工具自动生成svg sprites图。

#### 1.直接将SVG的代码添加在html中:

```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
    <path fill="#000000" d="M16 9.226l-8-6.21-8 6.21v-2.532l8-6.21 8 6.21zM14 9v6h-4v-4h-4v4h-4v-6l6-4.5z"></path>
</svg>
```
此时SVG图像会直接在页面上显示。

#### 2.SVG Sprites

SVG属性中, 可以利用(symbol)来定义一个图形模板对象, 并利用(use)将其实例化.只有symbol元素的实例（亦即，一个引用了symbol的 元素）才能呈现。

```html
<svg>
    <symbol id="001-home" viewBox="0 0 16 16">
        <path fill="#000000" d="M16 9.226l-8-6.21-8 6.21v-2.532l8-6.21 8 6.21zM14 9v6h-4v-4h-4v4h-4v-6l6-4.5z"/>
    </symbol>
    <symbol id="002-home2" viewBox="0 0 16 16">
        <path fill="#000000" d="M8 0.5l-8 8 1.5 1.5 1.5-1.5v6.5h4v-3h2v3h4v-6.5l1.5 1.5 1.5-1.5-8-8zM8 7c-0.552 0-1-0.448-1-1s0.448-1 1-1c0.552 0 1 0.448 1 1s-0.448 1-1 1z"/>
    </symbol>
    <symbol id="003-home3" viewBox="0 0 16 16">
        <path fill="#000000" d="M16 9.5l-3-3v-4.5h-2v2.5l-3-3-8 8v0.5h2v5h5v-3h2v3h5v-5h2z"/>
    </symbol>
</svg>


<svg><use xlink:href="#001-home"/></svg>
<svg><use xlink:href="#002-home2"/></svg>
```
 

### 自动化合并

#### 1.全局,本地安装gulp

npm install -g gulp
npm install gulp gulp-cli --save

#### 2.本地安装gulp-svg-symbols

npm install gulp-svg-symbols --save

#### 3.在目录下新建gulpfile.js,定义构建任务

```javascript
var gulp = require('gulp');
var svgSymbols = require('gulp-svg-symbols');

gulp.task('svgsprites',function () {
   return gulp.src('./src/svg/*.svg')
       .pipe(svgSymbols())
       .pipe(gulp.dest('./src/svgsprites'))
});
```

#### 4.开始构建

gulp svgsprites
 

git地址：

https://github.com/rainnaZR/svgsprites.git