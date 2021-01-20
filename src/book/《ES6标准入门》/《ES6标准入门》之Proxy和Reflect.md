《ES6标准入门》阅读总结

# 第十章 Proxy和Reflect

### 1. Proxy概述

用于修改某些操作的默认行为。在目标对象前架设一拦截层，外界对该对象的访问都需要经过这层拦截层，所以Proxy可以对外界的访问进行过滤和改写。

```
var obj = new Proxy({},{
	get(target, key, receiver){
		console.log(`get ${key}`);
		return Reflect.get(target, key, receiver);
	},

	set(target, key, value, receiver){
		console.log(`set ${key}: ${value}`);
		return Reflect.set(target, key, value, receiver);
	}
})

obj.count = 1;

//输出:
//set count: 1
//1
```

数据的双向绑定可以通过给对象做拦截，重新定义get和set方法实现Model到View的更新。

要使Proxy起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作。

### 2. Proxy实例的方法

#### get(target, propKey, receiver)

拦截对象的属性值。

#### set(target, propKey, value, receiver)

拦截对象属性的赋值操作。

```
var handler = {
	set(obj, prop, value, receiver){
		if(prop === 'age'){
			if(!Number.isInteger(value)){
				throw new TypeError('The age is not an Integer');
			}
			if(value > 200){
				throw new RangeError('The age is invalid');
			}
			obj[prop] = value;
		}
	}
}

var person = new Proxy({}, handler);

person.age = 300;  //Uncaught RangeError: The age is invalid
person.age = 'a';  //Uncaught TypeError: The age is not an Integer
```

利用set()，可以实现数据绑定，即每当对象属性值发生变化时，就自动更新DOM。

#### apply()

apply方法拦截函数的调用，call，apply操作。apply方法有三个参数，分别是目标对象，目标对象的上下文(this)，目标对象的参数数组。

```
var target = function(){return 'hello'};
var handler = {
	apply(target, ctx, args){
		return 'world';
	}
}

var f = new Proxy(target, handler);

f();  //输出'world'
//变量f是Proxy的实例，f作为函数调用时，会被apply方法拦截。
```

#### has(target, propKey)

has方法隐藏某些属性，不被in操作符发现。返回布尔值。如果返回false，在调用in操作符时会报错。

#### construct()

construct()拦截new命令。

#### deleteProperty(target, propKey)

拦截delete proxy[propKey]的操作。该方法返回布尔值，如果该方法返回false或者抛出错误，则delete方法调用失败，当前属性无法被delete命令删除。

```
var target = {_name: 'rainna', age: 20};
var handler = {
	deleteProperty(target, key){
		if(key[0] === '_'){
			throw new Error('invalid key')
		}
		return true;
	}
}

var f = new Proxy(target, handler);

delete f._name;   //Uncaught Error: invalid key
delete f.age;    //true
```

#### defineProperty()

defineProperty()方法拦截了Object.defineProperty操作。

#### enumerable(target)

...

### 3. Reflect概述

Reflect方法与Proxy方法一一对应。使用Reflect方法可以获取默认行为。

```
var loggerObj = new Proxy(obj, {
    get(target, prop){
        console.log('get');
        return Reflect.get(target, prop);  //默认行为
    },
    
    has(target, prop){
        console.log('has');
        return Reflect.has(target, prop);
    }
});
```

### 4. Reflect对象的方法

基本上与Proxy方法类似。

#### Reflect.get(target, name, receiver)

#### Reflect.set(target, name, value, receiver)

#### Reflect.has(obj, name)

#### Reflect.deleteProperty(obj, name)

...


