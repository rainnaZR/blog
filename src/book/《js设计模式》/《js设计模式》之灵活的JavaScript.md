《JavaScript设计模式》阅读总结：

# 第一章 灵活的语言-JavaScript

### 1. 用对象收编变量

多个方法可以收编到一个对象里，这样可以减少全局变量的定义。


### 2. 使用类的方式定义

```
var Func = function(){
	this.add = function(){
		return 1;
	};
	this.dele = function(){
		return 2;
	}
};

var f = new Func();
f.add();   //1

var f1 = new Func();
f.add === f1.add; //false
```

此种方法实例化时，新创建的对象都会对类的this上的属性进行复制，所以实例化后的对象都有自己的一套方法。也就是说每个实例化的对象都有自己的一套add方法和dele方法。实例化较多时消耗较多。

**可以改进为：**

```
var Func = function(){};

Func.prototype = {
	add: function(){
		return 1;
	},
	dele: function(){
		return 2;
	}

};

var s1 = new Func();
var s2 = new Func();

s1.add === s2.add   //true
```

可以将重复的方法定义在对象的原型上。

### 3. 方法的链式调用

```
var Func = function(){};

Func.prototype = {
	add: function(){
		console.log(1);
		return this;
	},
	dele: function(){
		console.log(2);
		return this;
	}

};

var s = new Func();
s.add().dele();
```

想要对方法实现链式调用，则在方法声明的末尾处将当前对象返回，也就是返回this。






