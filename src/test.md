《ES6标准入门》阅读总结

# 第十七章 Class

### 1. 基本语法

JS语言的传统方法是通过构造函数定义并生成新对象。ES6通过class类定义对象的模板，新的class写法让对象原型的写法更加清晰。

```
//ES5的写法
function F(x, y){
	this.x = x;
	this.y = y;
}

F.prototype.getX = function(){
	return this.x;
}

var b = new F(1, 2);
b.getX();  //1
```

```
//ES6 class的写法
class F{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	getX(){
		return this.x;
	}
}

var a = new F(1, 2);
a.getX();
```

class类的数据类型就是函数，类本身就指向构造函数。类的所有方法都定义在类的prototype属性上。使用Object.assign可以很方便的给类添加多个方法。

```
class Point{
    constructor(){
        ...
    }
}

Object.assign(Point.prototype, {
    getX(){},
    getY(){}
})
```

**constructor方法**

constructor方法是类的默认方法，通过new命令生成对象实例时自动调用该方法。constructor方法默认返回实例对象，也可以指定返回对象。

**实例对象**

跟ES5一样，使用new命令来实例化一个构造函数。如果不加new，调用Class会报错，实例属性除非显式定义在其本身（定义在this上），否则默认是定义在其原型上。

使用实例的__proto__属性会改写原型链，改写Class的原始定义，必须非常慎重。

**name属性**

name属性返回跟在class关键字后面的类名。

```
class F{
	constructor(){
		...
	}
}

F.name;  //F
```

**Class表达式**

使用Class表达式，可以写出立即执行的Class。

```
var f = new class{
	constructor(x){
		this.x = x;
	}
	getX(){
		return this.x;
	}
}(2);

f.getX();   //2
```

**不存在变量提升**

必须先定义class，再执行实例化操作。

**严格模式**

类和模块内部都是严格模式，不需要指定"use strict"严格模式。

### 2. Class的继承

Class通过extends关键字实现继承。子类必须在constructor中调用super方法，继承父类的this对象。子类没有自己的this对象，需要继承父类的this对象，然后对其加工。子类的constructor方法未调用super之前使用this关键字会报错。

```
class Parent{
	constructor(x){
		this.x = x;
	}

	getX(){
		return this.x;
	}
}

class Child extends Parent{
	constructor(x){
		super(x);  //必须调用super方法实现继承
	}
}

var f = new Child(1);
f.getX();   //1
```

ES5的继承实质上是先创建子类的实例对象this，然后将父类的方法添加到this上（Parent.apply(this)）。ES6的继承机制是先创建父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。


**类的prototype属性和__proto__属性**

ES5中，对象的__proto__指向其对应的构造函数的prototype属性。Class中继承链有两条：

1）子类的__proto__属性表示构造函数的继承，指向父类。

2）子类的prototype属性的__proto__属性表示方法的继承，指向父类的prototype属性。

```
class Parent{
	constructor(x){
		this.x = x;
	}

	getX(){
		return this.x;
	}
}

class Child extends Parent{
	constructor(x){
	}
}

Child.__proto__ === Parent;  //true
Child.prototype.__proto__ === Parent.prototype;   //true
```

构造函数可以通过访问prototype属性访问原型链。实例函数则是通过__proto__访问其对应构造函数的原型链。

**Object.getPrototyeOf()**

Object.getPrototyeOf()可以从子类上获取父类，可以判断一个类是否继承了另一个类。

```
Object.getPrototyeOf(Child) === Parent;  //true
```

**super关键字**

子类通过super关键字调用父类的实例实现继承。

### 3. 原生构造函数的继承

原生构造函数常用于生成数据结构。ECMAscript的原生构造函数有以下这些：

1）Boolean()

2）Number()

3）String()

4）Array()

5）Date()

6）Function()

7）RegExp()

8）Error()

9）Object()

extends关键字不仅可以继承类，也可以继承原生的构造函数。ES6可以自定义原生数据结构，ES5做不到。

```
class NewArray extends Array {
	constructor(...args){
		super(...args);
	}
}

var arr = new NewArray();
arr[0] = 'a';
arr[1] = 'b';
arr.length;  //2
```

### 4. Class的取值函数(getter)和存值函数(setter)

跟ES5一样，在Class内部可以使用get和set关键字对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```
class F{
    constructor(){
        super();
        ...
    }
    get prop(){
        ...
    }
    set prop(value){
        ...
    }
}
```

### 5. Class的Generator方法


在某个方法前加*，表明该方法是Generator函数。

```
class Foo{
	constructor(...args){
		this.args = args;
	}
	* [Symbol.iterator](){
		for(let arg of this.args){
			yield arg;
		}
	}
}

for(var x of new Foo(1, 2, 3)){
	console.log(x);
}
//1
//2
//3
```


### 6. Class的静态方法

类就是实例的原型，所有在类中定义的方法都会被实例继承。如果在一个方法前面加上static关键字，就表示该方法不会被实例继承，而是直接通过类调用，它是一个静态方法。如果在实例上调用类的静态方法，会报错提示不存在该方法。

```
class Foo{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	static getX(){
		return this.x||3;
	}
	getY(){
		return this.y;
	}
}

var f = new Foo(1, 2);
f.getX()  //Uncaught TypeError: f.getX is not a function
f.getY();  //2
Foo.getX();  //3，静态方法直接通过类来调用
```

静态方法也可以从super对象上调用，子类可以通过super方法调用父类上的静态方法。

### 7. Class的静态属性

只有下面一种方法定义，ES6规定Class内部只有静态方法，没有静态属性，所以需要在外面定义。

```
class Foo{};
Foo.prop = 1;
```

### 8. new.target属性

ES6定义new.target返回new命令所作用的构造函数。如果构造函数不是通过new命令调用的，那么new.target会返回undefined。只能在类的内部使用。

### 9. Mixin模式的实现

Mixin模式指将多个类的接口混入另一个类。


