《你不知道的JS》中卷 第一部分 类型和语法

# 第二章 值

## 1. 数组

使用对象来存放键值/属性值；使用数组存放数字索引的值。

Array.prototype.slice.apply(args)，[].slice.apply(args)返回类数组的副本，具有真正数组的特性。Array.from(...)也可以实现同样的功能。

```
var div = document.getElementsByTagName('div')

var divs = Array.prototype.slice.call(div);
```

```
var div = document.getElementsByTagName('div')

var divs = Array.from(div)

divs.forEach((item) => {
    console.log(item)
})
```

## 2. 字符串

字符串不可变指字符串成员函数不会改变原始值，而是创建并返回一个新的字符串。而数组的成员函数都是在其原始值上进行操作。

## 3. 数字

JS只有一种数值类型：number, 包括整数和带小数的十进制数。基于IEEE 754标准实现，该标准也称为”浮点数“，JS使用双精度格式。

数字常量可以用二进制，八进制，十进制，十六进制表示。默认十进制。

要检测一个数是否为整数，可以使用ES6中的Number.isInteger()方法。

## 4. 特殊数值

undefined, null名称既是类型又是值。null指空值，undefined值没有值。想要将表达式的返回值设为undefined，可以使用void。可以使用内建的全局工具函数isNaN()来判断一个值是否是NaN。NaN是JS中唯一一个不等于自身的值。

ES6中新加了方法Object.is()方法来判断两个值是否绝对相等。

## 5. 值和引用

简单值也就是基本类型值总是通过值复制的方式来赋值/传递，包括null, undefined, 字符串，数字，布尔，symbol。

复合值包括对象和函数，数组等总是通过引用复制的方式来传递/赋值。

```
function foo(obj){
   obj.a = 2; 
}
var obj1 = {
    a: 1
}
foo(obj1)
obj1  // {a: 2}
```

使用对象浅复制新增一个引用。

```
function foo(obj){
   obj.a = 2; 
}
var obj1 = {
    a: 1
}
var obj2 = Object.assign({}, obj1)
foo(obj2)
console.log(obj1)  //{a: 1}
console.log(obj2) //{a: 2}
```


