《ES6标准入门》阅读总结

# 第一章 let和const命令

### 1. let命令

#### 基本用法

let的声明只在其所在的代码块中生效。

```
var a = [];
for(var i = 0; i< 5; i++){
	a[i] = function(){
		console.log(i);
	}
}

a[2]()  //输出5，使用var声明的变量在全局范围内都有效，每一次循环，新的i值覆盖旧值，输出最后一个i的值

var a = [];
for(let i = 0; i< 5; i++){
	a[i] = function(){
		console.log(i);
	}
}

a[2]()  //输出2，变量i是let声明的，只在本轮循环中有效。所以每一次循环i都是一个新的变量
```

#### let声明的变量不存在变量提升

必须先声明，后使用。

#### 暂时性死区

ES规定，如果区块中存在let和const命令，那这个区块对这些命令声明的变量形成一个封闭作用域。在未声明前就使用这些变量会报错。

```
var a = 1;
if(true){
    console.log(a);  //ReferenceError: a is not defined，a变量的死区
	let a = 2;
	console.log(a);  //2
}
```

暂时性死区的本质是，只要已进入当前的作用域，所要使用的变量就已存在，但是不可获取，只有等到声明变量的代码出现时，才可以获取和使用变量。

### 2. let和const命令

**不允许重复声明**

**块级作用域**

```
//ES5中的变量提升
var tmp = new Date();

function f(){
    console.log(tmp);  //var tmp; 此时tmp还没有赋值，所以值为undefined
    if(false){
        var tmp = '132a';
    }
}

f()  //输出undefined
```

ES5只有全局作用域和函数作用域，ES6中let新增了块级作用域。外层作用域无法读取内层作用域的变量。

```
function f(){
	let a = 1;
	if(true){
		let a = 2;
		console.log(a);
	}
	console.log(a);
}

f()
//输出2
//输出1
```

块级作用域外部不能调用块级作用域内部的函数。如果需要调用，需要在外部声明。

```
{
	let a = 1;
	let f = function(){
		return a;
	}
}

f();  //TypeError: f is not a function

//修改为：

let f;
{
	let a = 1;
	f = function(){
		return a;
	}
}

f();  //1
```

**const命令**

const命令声明常量，一旦定义，值就不能改变。声明时就需要赋值。只在声明所在的块级作用域内有效。const声明的变量只能在声明后使用。

使用const声明对象和数组时，不指向数据，而是指向数据所在的地址。如果想将对象冻结，可以使用Object.freeze方法。

```
const foo = Object.freeze({name: 1});

foo.name = 2;//属性赋值无效
```

ES5两种声明变量的方法：var, function。

ES6六种声明变量的方法：var, function, let, const, import, class。

**跨模块的常量**

将常量保存在一个JS文件里，在调用时通过import引入。

```
//constants.js
export const A = 1;
export const B = 2;
export const C = 3;

//index.js
import * as constants from  './constants';
console.log(constants.A);  //1
console.log(constants.B);  //2

//index.js
import {A, B} from './constants';
console.log(A);   //1
console.log(B);   //2
```

ES6规定，var和function命令声明的变量依然是全局变量的属性，let，const，class命令声明的变量不属于全局对象的属性。


### 3. 总结

1）es6的变量声明方面包括: let, const, var, function, import, class。

2）let变量声明

- 不存在变量提升,变量一定要在声明后才能使用,也就是变量声明前,变量都是不可用的。
- 不允许重复声明。
- 拥有块级作用域,一个大括号就是一个块级作用域。

3）const变量声明

- 不存在变量提升,变量一定要在声明后才能使用,也就是变量声明前,变量都是不可用的。
- 不允许重复声明。
- 拥有块级作用域,一个大括号就是一个块级作用域。
- const变量声明常量,声明之后值不能更改。
- 指向引用类型的变量时,只指向数据存放的地址,不指向实际的数据。
- 全局变量的属性使用 var 来声明。





