#《你不知道的JS》 上卷 第二部分 this和对象原型

# 第一章 关于this

## 1. 定义

具名函数可以通过名字调用自身。

```
function foo(num){
	console.log(11, num);
	this.count ++
}

foo.count = 0;

for(var i = 0; i < 2; i++){
	foo(i)
}

console.log(foo.count) 

// 输出结果：
// 11 0
// 11 1
// 0
```

可以看到this.count并没有增加。通过call，apply方法可以动态修改this的指向。修改如下：

```
function foo(num){
	console.log(11, num);
	this.count ++
}

foo.count = 0;

for(var i = 0; i < 2; i++){
	foo.call(foo, i)
}

console.log(foo.count)  // 2
```



this在任何情况下都不指向函数的词法作用域，在JS内部，作用域确实和对象类型，可见的标识符都是作用域的属性。但是作用域对象无法通过JS代码访问，它存在于js引擎内部。

**this是在运行时进行绑定的，并不是在编译时绑定，它的上下文取决于函数调用时的各种条件。this的绑定和函数声明没有任何关系，只取决于函数的调用方式。当一个函数调用时，会创建一个活动记录（执行上下文）。这个记录会包括函数在哪里调用（调用栈），函数的调用方式，传参等信息。**


## 2. this绑定规则

### 2.1 默认绑定

直接调用的函数就叫独立函数，独立函数调用时，this使用默认绑定，指向全局对象。当使用严格模式时，this指向undefined。

### 2.2 隐式绑定

当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文中。比如通过obj.foo()这种方式调用。

在使用隐式绑定时，在一个对象内使用一个指向函数的属性，通过对象的属性来引用函数，这样函数的this就指向了这个对象。

```
obj.say();  // say方法中的this指向obj
```

### 2.3 显式绑定

使用call, apply方法强制绑定函数中的this到第一个参数值上。如果传了一个原始值来当做this的绑定对象，这个原始值会被转换成它的对象形式，比如new String(),new Number()，成为“装箱”。

```
foo.call(obj)  // 强制把foo中的this绑定到obj上
```

### 2.4 new绑定

构造函数只是被new操作符调用的普通函数而已。比如Number构造函数，当Number在new表达式中被调用时，它是一个构造函数，会初始化新创建的对象。**构造函数其实是函数的构造调用。**

使用new操作符来调用函数时，操作如下：

- **创建或构造一个全新的对象。**
- **这个新对象与函数直接建立原型链链接。**
- **函数中的this指向这个新对象。**
- **如果函数没有返回其他对象，则自动返回这个新对象。**

## 3. 优先级

- 显式绑定（call,apply调用）的优先级比隐式绑定（对象调用）优先级更高。
- new绑定的优先级比显式绑定（call, apply）的优先级高。

**如何判断this？按照如下优先级的顺序判断：**

1.**new绑定**：函数是否在new中调用？如果是，则this指向这个新创建的对象。否则到下一步。

```
var bar = new Foo()  // 函数中this指向bar
```

2.**显式绑定**：函数是否通过call，apply，bind来绑定调用？如果是，则this绑定的是指定的对象。否则到下一步。

```
foo.call(bar)  // foo函数中的this指向bar
```

3.**隐式绑定**：函数是否在某个上下文对象中调用，如果是，这函数的this绑定到这个上下文对象上。

```
obj.foo()  //foo函数中的this指向obj
```

4.**默认绑定**：以上情况如果都不是，就执行默认绑定，严格模式this绑定到undefined，否则绑定到全局对象。

```
foo()  //foo函数中的this指向全局对象
```

## 4. 绑定例外

当函数不关心this的话，可以把null当做占位符传入。

```
foo.call(null, 2)
```

也可以将this绑定到空对象上，不用担心污染全局环境。比如：

```
var empt = Object.create(null);
foo.call(empt, 1)
```

## 5. this词法

箭头函数是根据外层（函数或者全局）作用域来决定this。箭头函数的绑定生效后无法再次修改。

```
function foo(){
	return () => {
		console.log(this.a)
	}
}

var obj1 = {
	a: 1
}
var obj2 = {
	a: 2
}

var bar = foo.call(obj1);
bar.call(obj2)

// 1
```

箭头函数常用于回调函数中，例如事件处理器或者定时器。

## 6. 小结

可以用下面四条规则判断this的绑定对象：

1. 由new调用？this绑定到新创建的对象。
2. 由call,apply,bind调用？this绑定到指定的对象。
3. 由上下文对象调用？this绑定到上下文对象。
4. 默认：严格模式下this指向undefined，非严格模式指向全局对象。

箭头函数不根据上面的规则决定this，箭头函数的this指向外层的this绑定。




