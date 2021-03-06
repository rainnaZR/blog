url:  http://www.cnblogs.com/zourong/p/5630683.html

CSS3中新增一种弹性布局模型：flexbox。网上关于flex的介绍很多，这里介绍下常用的几个属性。弹性布局的特点是非常灵活。可根据剩余的宽高，灵活布局。

先用图片说明flex具有哪些属性。（网上盗的图）


上图中flex容器即是父元素，flex项目为子元素。


属性说明

1.首先在父元素中定义display:flex;

2.flex-direction:属性用来控制伸缩容器中主轴的方向，同时也决定了伸缩项目子元素的方向。

flex-direction：row | row-reverse | column | column-reverse

row 横向从左到右排列（左对齐）
row-reverse  横向从右到左排列（右对齐）
column 纵向从上到下排列（顶对齐）
column-reverse 纵向从下到上排列（底对齐）


3. justify-content: 设置子元素在横轴上的对齐方式。

justify-content：flex-start | flex-end | center | space-between | space-around

flex-start  弹性盒子元素将向行起始位置对齐。
flex-end  弹性盒子子元素向行结束位置对齐。
center  弹性盒子子元素水平居中对齐。
space-between 弹性盒子元素会平均地分布在行里。如果最左边的剩余空间是负数，或该行只有一个子元素，则该值等效于'flex-start'。在其它情况下，第一个元素的边界与行的主起始位置的边界对齐，同时最后一个元素的边界与行的主结束位置的边距对齐，而剩余的伸缩盒项目则平均分布，并确保两两之间的空白空间相等。
space-around 弹性盒子元素会平均地分布在行里，两端保留子元素与子元素之间间距大小的一半。如果最左边的剩余空间是负数，或该行只有一个伸缩盒项目，则该值等效于'center'。在其它情况下，伸缩盒项目则平均分布，并确保两两之间的空白空间相等，同时第一个元素前的空间以及最后一个元素后的空间为其他空白空间的一半。


4. align-items：定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式。

 align-items：flex-start | flex-end | center | baseline | stretch

flex-start  弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的纵轴起始边界。
flex-end   弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴结束边界。
center     弹性盒子子元素垂直对齐。
baseline  如弹性盒子元素的行内轴与侧轴为同一条，则该值与'flex-start'等效。其它情况下，该值将参与基线对齐。
stretch  如果指定侧轴大小的属性值为'auto'，则其值会使项目的边距盒的尺寸尽可能接近所在行的尺寸，但同时会遵照'min/max-width/height'属性的限制。


5. align-content：当伸缩容器的侧轴还有多余空间时，本属性可以用来调准「伸缩行」在伸缩容器里的对齐方式，这与调准伸缩项目在主轴上对齐方式的 <' justify-content '> 属性类似。

align-content：flex-start | flex-end | center | space-between | space-around | stretch

效果同justify-content属性。


6.flex-wrap：该属性控制flex容器是单行或者多行，同时横轴的方向决定了新行堆叠的方向。

flex-wrap：nowrap | wrap | wrap-reverse

nowrap 强制不换行
wrap  正常排列，换行
wrap-reverse 正常反向排列，换行


参考：

http://web.jobbole.com/86488/

https://bocoup.com/weblog/dive-into-flexbox

http://www.css88.com/book/css/properties/flex/flex-wrap.htm