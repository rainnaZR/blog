《ES6标准入门》阅读总结

# 第十三章 Iterator和for...of循环

### 1. Iterator概念

JS表示集合的数据结构：Array, Object, Set, Map。Iterator遍历器的作用有3个：

1）给数据结构提供统一的访问接口。

2）使得数据结构的成员能够按某种次序排列。

3）Ieterator接口供for...of消费。


### 2. 数据结构的默认Iterator接口

调用Symbol.iterator方法，就会得到当前数据结构默认的遍历器生成函数。

### 3. 调用Iterator接口的场合

1）解构赋值，默认调用Symbol.iterator方法。

```
var set = new Set().add(1).add(2).add(3);

var [x, y] = set;
x  //1
y  //2
```

2）扩展运算符

调用默认的Iterator接口。

3）yield*

yield*后面跟的是一个可遍历的结构，调用该结构的遍历器接口。

```
var generator = function* (){
	yield 1;
	yield* [2, 3];
	yield 4;
};
var iterator = generator();

iterator.next();  //{value: 1, done: false}
iterator.next();  //{value: 2, done: false}
iterator.next();  //{value: 3, done: false}
iterator.next();  //{value: 4, done: false}
iterator.next();  //{value: undefined, done: true}
```

4）其他场合

for...of，Array.from()，Map()，Set()，WeakMap()，WeakSet()，Promise.all()

### 4. 字符串的Iterator接口

```
var str = 'hello';
var iterator = str[Symbol.iterator]();

iterator.next() //{value: "h", done: false}
iterator.next() //{value: "i", done: false}
iterator.next() //{value: undefined, done: true}
```

字符串调用Symbol.iterator方法返回一个遍历器对象，然后在其上调用next方法实现对字符串的遍历。

### 5. 遍历器对象的return(), throw()

遍历器方法：next(), return(), throw()。

### 6. for...of循环

一个数据结构部署了Symbol.iterator属性，就被视为具有Iterator接口，就可以使用for...of循环遍历它的成员。for...of循环内部调用的是数据结构的Symbol.iterator方法。for...of循环可使用的范围有：数组，类数组，Set， Map，Generator对象，字符串。

1）数组

for...in读取键名，for...of读取键值。

2）Set和Map结构

遍历的顺序是成员添加的顺序，Set结构遍历返回的是一个值，Map返回的是一个数组，该数组的两个成员分别是当前Map成员的键名和键值。

3）类数组

先使用Array.from将其转换为真正的数组。

4）对象

对于普通的对象，for...in可以遍历键名，for...of循环会报错。for...in适用于遍历对象，不适用遍历数组。

for...of的循环可以配合使用break, continue, return等。 


