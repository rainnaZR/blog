《JS语言精粹》阅读总结

# 第九章 语言特性


### 1. 特性介绍

1）函数是顶级对象，是有词法作用域的闭包。

2）基于原型继承的动态对象。一个对象可以从另一个对象继承。

3）对象字面量和数组字面量。

### 2. JS设计的糟糕之处

1）全局变量

没有声明的变量会造成隐式的全局变量。

2）作用域

只有函数提供块级作用域。在每个函数的开头部分声明所有的变量。

3）自动插入分号

4）保留字

5）typeof

typeof不能分辨出null与对象。区分的办法是：

```
if(value && typeof value === 'object'){
    //value是个对象或数组
}
```

6）parseInt

7）+运算符

如果是字符串类型，则会进行字符串的拼接。

8）浮点数

二进制的浮点数不能正确的处理十进制的小数。

```
var res = 0.1 + 0.2 == 0.3;

console.log(res);  //false
```

9）NaN

```
typeof NaN === "number"   //true
NaN === NaN  //false

var isNumber = function(value){
    return typeof value === 'number' && isFinite(value);
}
```

10）伪数组

11）hasOwnProperty

12）对象

13）== 和 ===

```
false == 'false';  //false
false == '0';  //true
```

14）++ --

15）function语句和function表达式

```
//function语句，变量提升
function foo(){
    ...
}

//function表达式
var foo = function(){
    ...
}
```

16）new运算符

new运算符创建一个继承于其运算数原型的新对象，且this指向新创建的对象。如果不使用new，则this会绑定到全局作用域上。

### 3. JSON

JSON是一种文本格式，轻量级的数据交换格式。JSON的6种类型值：对象，数组，字符串，数字，布尔值，特殊值null。

JSON.parse(value)解析JSON文本为JS对象。
JSON.stringify(value)解析JS对象为JSON文本格式。



