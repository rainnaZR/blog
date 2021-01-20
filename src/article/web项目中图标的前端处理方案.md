# web项目中图标的前端处理方案

工程中用到图标是常事，那这些图标我们前端一般是怎么解决的呢？这几种方案有什么优缺点呢？

## 第一种： SVG Sprite

SVG sprite其实就是svg的集合。SVG即可缩放矢量图形 (Scalable Vector Graphics)的简称，是一种用来描述二维矢量图形的XML标记语言。SVG图形不依赖于分辨率, 因此图形不会因为放大而显示出明显的锯齿边缘.使用svg格式我们可以直接用代码来描绘图像，可以用任何文字处理工具打开svg图像，通过改变部分代码来使图像具有交互功能，并可以随时插入到HTML中通过浏览器来浏览。

#### 单个SVG图的使用

```
<svg width="16" height="16" viewBox="0 0 16 16">
    <path fill="#000000" d="M16 9.226l-8-6.21-8 6.21v-2.532l8-6.21 8 6.21zM14 9v6h-4v-4h-4v4h-4v-6l6-4.5z"></path>
</svg>
```

#### 多个SVG图的使用

SVG属性中，可以利用 **symbol** 来定义一个图形模板对象，并利用 **use** 将其实例化。use 使用时加入 symbol 的id名就可以显示该图标。

~~~
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
~~~

如果 SVG symbol 不是内嵌在 html 中，而是独立的SVG文件，则use 使用路径名来引用。

```
<svg><use xlink:href="images/aa.svg#001-home"/></svg>
```

多个SVG文件的合并可以使用gulp构建工具来完成，这里不详细叙述。可以在SVG标签上增加样式名，控制图标的显示。

#### 优点:
1. 缩放无损还原。
2. 可设置样式，控制图标的颜色，大小，渐变等效果。
3. 可利用CSS实现动画。
4. 减少HTTP请求。


#### 缺点
1. SVG在绘制的性能上比PNG要差。
2. 复杂的图形或渐变可能显示不全。
3. 兼容性稍差,支持 ie9+,及现代浏览器。


## 第二种：iconfont

使用字体图标，这种方式也正在被大家接受和认可。将多个矢量图合并生成字体文件，然后在CSS中引用对应的字体编码即可显示图标。字体图标适用于各个浏览器屏幕。通过控制font-size的大小调整图标大小。常用的字体图标网站是http://www.iconfont.cn/ 和 https://icomoon.io/

-------

#### 方式一：font class引用

将字体的编码加在样式的伪类上来实现。

css代码如下：

```
@font-face {
  font-family: "iconfont";
  src: url('iconfont.eot?t=1502445479693'); /* IE9*/
  src: url('iconfont.eot?t=1502445479693#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('iconfont.woff?t=1502445479693') format('woff'), /* chrome, firefox */
  url('iconfont.ttf?t=1502445479693') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('iconfont.svg?t=1502445479693#iconfont') format('svg'); /* iOS 4.1- */
}

.icon {
  font-family:"iconfont" !important;
  font-size:16px;
}

.icon-close:before { content: "\e736"; }

.icon-down:before { content: "\e971"; }
```

html代码如下：

```
<i class="icon icon-close"></i>
```

**特点：**
1. 兼容性良好，支持ie8+，及所有现代浏览器。
2. 相比于直接在html代码里写unicode，这种写法语意明确，书写更直观，直接看样式名就知道是什么icon了。
3. 因为使用class来定义图标，所以当要替换图标时，只需更换样式名就可以了。
4. 不支持多色图标。

-------

#### 方式二：unicode引用
跟方式一类似，只是unicode代码引用位置不同而已。

css代码如下：

```
@font-face {
    font-family: "iconfont";
    src: url('iconfont.eot'); /* IE9*/
    src: url('iconfont.eot#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('iconfont.woff') format('woff'), /* chrome, firefox */
    url('iconfont.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    url('iconfont.svg#iconfont') format('svg'); /* iOS 4.1- */
}

.icon {
    font-family:"iconfont" !important;
    font-size:16px;
}
```

html代码如下：

```
<i class="icon">&#xe736;</i>
<i class="icon">&#xe971;</i>
```

**特点：**
1. 兼容性最好，支持ie6+，及所有现代浏览器。
2. 支持按字体的方式去动态调整图标大小，颜色等等。
3. 只支持单色图标。
4. 可读性不好，需要在html代码里写上unicode字符。

此种方式已经不常用了。

## 第三种：DataURI

DataURI是利用规范将图片转换成Base64编码的文本字符，不仅是图片，还可以编码JS、CSS、HTML等文件。通过将图标文件编码成文本字符，从而可以直接写在HTML/CSS文件里面，不会增加任何多余的请求。

但是DataURI的劣势也是很明显的，每次都需要解码从而阻塞了CSS渲染，而且CSS的体积也会增加不少。这种方法一般不建议使用。常用解码网站http://tool.css-js.com/base64.html


## 第四种：image sprite
将多个小图标合成雪碧图，这是比较古老的图片处理方式了。将多个图标合成一个图片文件，然后利用css的background-position定位显示不同的icon图标。

**优点：**
1. PC端兼容性好。不同浏览器公用一个图片文件，不用考虑兼容性问题。
2. 减少图标的请求数。多个图标合成一个文件后，只需请求一次就可以。且该文件可以被浏览器缓存。
3. 减少图片字节。合并后的图片字节比单个图标相加的字节少得多。

**缺点：**
1. 维护困难。每新增一个图标，都需要改动原来的合并图片源文件。
2. 定位不够灵活。图标的位置要有一定的规范，图标与图标之间需要留有一定间距，避免相互干扰影响定位。
3. 操作繁琐。需要维护图片，修改样式。
4. 对高dpr的屏幕图标还得额外维护一份。

鉴于前面几种更好的方法，此种图片合并的方式已经过时。
