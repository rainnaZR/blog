#《你不知道的JS》 上卷 第二部分 this和对象原型

# 第二章 对象

## 1. 语法

两种定义形式：

```
var obj = {
    key: value
}
```

```
var obj = new Object();
obj.key = value;
```

## 2. 类型

**数据类型：**

- string
- number
- boolean
- null
- undefined
- object

**内置对象：**

- String
- Number
- Boolean
- Function
- Object
- Array
- Date
- RegExp
- Error

## 3. 内容

对象的属性值不会直接存在对象容器内部，对象内部只存属性名称，以及内容位置的指针。对象的属性名只能是字符串，如果是非字符串，会被转换成字符串。


### 3.1 数组

用对象存储键/值对，用数组存储下标/值对。


### 3.2 对象复制

简单数据类型可直接在内存中复制；复杂类型，比如对象，数组等则保存的是引用。

有哪些对象复制的方法？

**1.使用JSON复制**

```
var copy = JSON.parse(JSON.stringify(obj));
```

**2.Object.assign(target, source)**

使用Object.assign(target, source)实现对象的浅复制。

### 3.3 属性描述符

```
var obj = {
	a: 1
}

Object.getOwnPropertyDescriptor(obj, 'a')

// 打印结果如下：
{
    value: 1, 
    writable: true, 
    enumerable: true, 
    configurable: true
}
```

对对象属性进行设置：

```
Object.defineProperty(obj, 'a', {
    value: 1,
    writable: true, 
    enumerable: true, 
    configurable: true
})
```

**writable：属性值是否可写**
**enumerable：属性是否可被枚举**
**configurable：是否可配置，是否可以允许修改属性描述符**

### 3.4 不变性

**对象常量**

结合writable: false, configurable: false 可以实现对象常量。


```
var obj = {}

Object.defineProperty(obj, 'a', {
	value: 1,
	writable: false,
	configurable: false
})
```



**禁止扩展**

Object.preventExtensions(obj)阻止向对象添加属性。

```
var obj = {
	a: 1
}

Object.preventExtensions(obj);
```

**密封冻结**

Object.freeze(), Object.seal()

### 3.5 Getter和Setter

getter和setter可以操作对象上的单个属性。getter是一个隐藏函数，会在获取属性值的时候调用。setter也是一个隐藏函数，会在设置属性值时调用。

```
var obj = {
	get a(){
		return this.b*2
	},
	set a(val){
		this.b = val - 1
	}
}
obj.a = 3;

console.log(obj)

// 输出结果如下：
//{ a: 4, b: 2 }
```

### 3.6 存在性

```
obj.hasOwnProperty('a')
```

## 4. 遍历

### 4.1 for...of 遍历对象属性名

Object.keys()会返回一个数组，包括对象所有可枚举的属性，只包括对象自己的属性，不包括原型链上的。

for...in 可以遍历对象上所有可枚举的属性名，包括原型链上的。

```
var obj = {
	a: 1, 
	b: 2
}

// for...in遍历对象的属性名
for(var i in obj){
	console.log(i)
}

// 执行结果如下： 
// a
// b
```


### 4.2 for...of 遍历对象或数组的属性值


for...of 遍历对象或数组的值。for...of循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的next()方法来遍历所有返回值。当调用next()方法时，内部的指针都会向前移动并返回对象属性列表的下一个值。

```
var arr = [1,3,4,9]

for(var i of arr){
	console.log(i)
}

// 执行结果如下：
// 1
// 3
// 4
// 9
```

数组有内置的@@iterator，因此for...of可以直接应用在数组上。但是普通的对象没有内置的@@iterator，所以无法直接使用for...of遍历。不过可以给对象定义@@iterator。

```
var obj = {
	a: 'ab',
	b: 'cd'
}

Object.defineProperty(obj, Symbol.iterator, {
	enumerable: false,
	writable: false,
	configurable: true,
	value: function(){
		var obj = this;
		var index = 0;
		var keys = Object.keys(obj);
		return {
			next: function(){
				return {
					value: obj[keys[index++]],
					done: index > keys.length
				}
			}
		}
	}
})

for(var i of obj){
	console.log(i)
}

// 执行结果如下：
// ab
// cd
```

总结：for...of会遍历数据结构中的值，会寻找内置或者自定义的@@iterator对象并调用它的next()方法来遍历数据值。





