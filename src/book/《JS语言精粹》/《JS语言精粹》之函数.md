《JS语言精粹》阅读总结

# 第四章 函数

**函数对象**

JS中的函数就是对象。对象字面量产生的对象链接到Object.prototype，函数对象链接到Function.prototype。每个函数在创建时会附加两个隐藏属性：函数的上下文和实现函数行为的代码。


**函数字面量**

```
var add = function(a, b){
    return a + b;
}
```

一个内部函数除了可以访问自己的参数和变量，也可以访问嵌套在其中的父函数的参数和变量。通过函数字面量创建的函数对象包含一个连到外部上下文的连接，这种成为闭包。

**调用**

除了形参，函数调用时还接收两个附加的参数：this, arguments。函数在JS中调用有四种形式：方法调用模式，函数调用模式，构造函数调用模式，apply调用模式。

**方法调用模式**

函数保存为对象的一个属性时，称为方法。当方法被调用时，this指向该方法所在的对象。

```
let obj = {
    getName(){
        return this.name;
    }
}

//方法调用,this指向obj
obj.getName();  
```

**函数调用模式**

当一个函数并非一个对象的属性时，它就是被当做函数来调用的，this指向window，是绑定到全局对象的。

```
let getName = function(){
    ...
}

//函数调用，this指向全局变量
getName();
```

**构造函数调用模式**

如果在一个函数前面加上new来调用，那么会在该函数的prototype原型链上继承一个新函数，同时this会绑定到这个新函数上。

```
let Func = function(name){
    this.name = name;
};

Func.prototype.getName = function(){
    return this.name;
}

//构造函数继承
let newFunc = new Func('newFuncOKOKOK');
newFunc.getName();
```

**apply调用模式**

apply方法提供两个参数，第一个是this值，第二个是参数数组。apply方法可以改变this指向。

```
var aa = {
	status: 'okokokok'
};

var bb = function(){};

bb.prototype.getStatus = function(){
	return this.status;
}

var cc = bb.prototype.getStatus.apply(aa);

console.log(cc)   //输出okokokok
```

**参数**

函数被调用时，arguments表示传入的参数列表，arguments是个伪数组，不具备数组的方法。

**返回**

使用return可以提前返回。没有指定返回值则会返回undefined。


**异常**

使用try...cathc来捕获异常。

**递归**

递归就是直接或间接的调用自身的一种函数。

**作用域**

在编程语言中，作用域控制着变量和参数的可见性和生命周期。在函数内定义的参数和变量在函数外部是不可见的。作用域的好处是内部函数可以访问定义它们的外部函数的参数和变量。

**闭包**

```
//案例一  
//函数里定义了value变量，value对getValue方法是可用的，但是函数的作用域使得value这个变量对其他的程序来说是不可见的
var myObject = (function(){
    var value = 1;
    
    return {
        getValue(){
            return value;
        }
    }
}());

//案例二
var fade = function(node){
	var lever = 1;
	var step = function(){
		var hex = lever.toString(16);
		node.style.backgroundColor = "#ff00" + hex + hex;
        if(lever < 15){
            lever += 1;
            setTimeout(step, 100);
        }
	}
	setTimeout(step, 100)
}

fade(document.body)
```

**回调**

发起异步请求时，定义一个回调函数。

**模块**

模块模式利用函数作用域和闭包来创建被绑定对象与私有成员的关联。模块模式的一般形式是：一个定义了私有变量和函数的函数；利用闭包创建可以访问私有变量和函数的特权函数；最后返回这个特权函数，或者把它们保存到一个可访问到的地方。

使用模块模式可以摈弃全局变量的使用，对应用程序的封装，或者构造其他单例对象，非常有效。

```
//info为私有属性，使用闭包可以访问私有属性
var func = (function(){
    var info = {
        name: 'aa',
        age: 19,
        sex: 'female'
    };
    
    return function(){
        return info;
    }
}())
```

**级联**

一个接口只做一件简单的事，接口调用返回this。

**柯里化**

柯里化允许把函数和参数结合在一起，返回一个新的函数。

