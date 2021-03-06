url:  http://www.cnblogs.com/zourong/p/5513079.html

writing-mode是CSS3的新特性之一，使用场景不是很多。这个属性主要是改变文档流的显示方式。具体的介绍参考这篇文章：http://www.zhangxinxu.com/wordpress/2016/04/css-writing-mode/
这里大致提炼下可以使用的部分。使用时需要加上浏览器的前缀。下面的例子介绍不考虑兼容性，都是在weibkit浏览器下测试。


语法

writing-mode可用的值有:horizontal-tb | vertical-rl | vertical-lr  针对IE有另外的属性值，这里不考虑IE，故不做介绍。

horizontal-tb

文档流的方向是水平的，从上到下排列，tb是top-bottom的简写。也就是我们常用的从上到下正常的文本书写。

vertical-lr

文档流的方向是垂直的，从左到右排列，lr是left-right的缩写。

vertical-rl

文档流的方向是垂直的，从右向左排列，rl是right-left的缩写。



使用场景

元素的垂直居中

元素垂直居中有很多种方法可以实现：比如说：

1.对子元素设置定位，left:50%,top:50%，然后使用translate(-50%,-50%)对子元素平移。实现垂直居中。具体实现可参考demo。
.box-1{position:relative;}
.box-1 .item{position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);}
<div class="box box-1">
    <div class="item">使用translate平移实现垂直居中</div>
</div>


2.使用display:table布局实现元素的垂直居中

.box-2{display:table-cell;text-align:center;vertical-align:middle;}
.box-2 .item{display:inline-block;}
<div class="box box-2">
    <div class="item">使用table实现垂直居中</div>
</div>


 3.使用writing-mode结合margin:auto 0实现垂直居中

我们知道块状元素的水平居中可用margin:0 auto来实现，即margin-left:auto;margin-right:auto; writing-mode是改变文档流的显示方向的，所以水平居中也可以变为垂直居中。writing-mode结合margin-top:auto,margin-bottom:auto就可以实现。

.box-3{-webkit-writing-mode:vertical-lr;}
.box-3 .item{margin:auto 0;}
<div class="box box-3">
    <div class="item">使用writing-mode实现垂直居中</div>
</div>


4. 使用writing-mode结合text-align:center实现垂直居中

 原理同第三点，text-align:center水平居中适用于inline的元素，结合writing-mode使用，就可以非常简单的让内联元素在水平方向上实现垂直居中。

.box-4{-webkit-writing-mode:vertical-lr;text-align:center;}
<div class="box box-4">
    <img width="100%" src="http://img12.360buyimg.com/da/jfs/t2623/13/1559560386/101307/db2d4319/5742af4cNcc412e8a.jpg">
</div>


文字的排列

改变文字的排版顺序，实现一些特殊的效果。比如（唐诗等等）。

当父元素添加-webkit-writing-mode之后，其所有的子元素都会继承该属性。经过实例验证，子元素也可以重复应用该属性。对应的脚本特性为writingMode。