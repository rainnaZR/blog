《ES6标准入门》阅读总结

# 第二章 变量的解构赋值

### 1. 数组的解构赋值

如果解构不成功，变量的值为undefined，如果等号右边不是数组，则会报错。

```
let [foo] = 1;  //报错
```

```
function* fibs() {
	var a=0;
	var b = 1;
	while(true){
		yield a;
		[a, b] = [b, a+b];
	}
}

var [a, b, c, d, e, f, g] = fibs();
[a, b, c, d, e, f, g] 
//输出[0, 1, 1, 2, 3, 5, 8]
```

只要某种数据结构具有Iterator接口，都可以采用数组形式的解构赋值。

**默认值**

ES6内部使用===来判断一个位置是否有值。如果一个数据成员不严格等于undefined，则默认值不会生效。

```
var [x = 1] = [null];
x;   //null

var [x = 1] = [undefined];
x;  //1

let [x=1, y=x] = [];  //x=1, y=1
let [x=1, y=x] = [2];  //x=2, y=2
let [x=1, y=x] = [1, 2] //x=1, y=2
let [x=y, y=1] = [];  //参数错误，x=y时，y还没有声明
```

### 2. 对象的解构赋值

对象结构赋值的内部机制是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

```
let {foo: baz} = {foo: 'aaa'};
baz  //输出'aaa'，正在被赋值的是baz，而不是模式foo
```

```
var node = {
	loc: {
		start: {
			line: 1,
			column: 5
		}
	}
}

var {loc: {start: {line, column}}} = node;

loc   //ReferenceError: loc is not defined
start   //ReferenceError: loc is not defined
line   //1
column    //5
```

loc, start是前者，属于模式，不能被赋值。被赋值的只有line，column两个变量。

默认值生效的条件是，对象的属性值严格等于undefined.

### 3. 字符串的解构赋值

```
var [a, b, c, d, e] = 'hello';
[a, b, c, d, e]  //["h", "e", "l", "l", "o"]
```

### 4. 数值和布尔值的解构赋值

解构赋值的规则是：只要等号右边的值不是对象，就会先将其转化为对象。由于undefined和null无法转化为对象，所以赋值都会报错。

```
let {a: x} = null;

x  //Cannot destructure property `a` of 'undefined' or 'null'.
```

### 5. 函数参数的解构赋值

```
function move({x, y} = {x:0, y:0}){
    return [x, y];
}

move({x:1, y:2});  //[1, 2]
move();   //[0, 0
move({});   //[undefined, undefined]
```

### 6. 圆括号

以下三种情况不能使用圆括号。

1）变量声明语句中，模式不能带有圆括号。

2）函数参数中，模式不能带有圆括号。

```
//报错
function f([(z)]){
    return z;
}  
```

3）不能将整个模式或嵌套模式中的一层放入圆括号中。

```
//报错Unexpected token (
([a]) = [5];
```

**只有赋值语句的非模式部分才可以使用圆括号。**

### 7. 总结

变量的解构赋值: 数组, 对象, 字符串的解构赋值。


**解构特点**

 - 允许指定的默认值。(等号左边的值)
 - 只有赋值(等号右边的值)严格等于 undefined 时, 默认值(等号左边的值)才会生效。
 - 数组结构完全按照数组的顺序来执行。
 - 对象解构的变量名必须与对象的属性名同名,才能取到值。

