《ES6标准入门》阅读总结

# 第九章 Symbol

### 1. 概述

ES6引进的新的数据类型：Symbol，表示独一无二的值。Symbol值由Symbol()函数生成。是一种类似于字符串的数据类型。

```
var mySymbol = Symbol();

//第一种写法
var a = {};
a[mySymbol] = 'a';

//第二种写法
var a = {
    [mySymbol]: 'a'
}

//第三种写法
var a = {};
a.defineProperty(a, mySymbol, {value: 'a'})

a[mySymbol]  //输出'a'
```

### 2. 属性名的遍历

Symbol属性不会出现在for...of，for...in循环中，可以通过Object.getOwnPropertySymbols()获取到。

```
var obj = {
	[Symbol('a')] : 'hello',
	[Symbol('b')]: 'world'
}
Object.getOwnPropertySymbols(obj);

//输出[Symbol(a), Symbol(b)]
```

### 3. Symbol.for(), Symbol.keyFor()

Symbol.for()可以使用同一个Symbol()值。Symbol.for(key)会先检查对应key的值是否存在，如果存在直接取值，如果不存在则新建值。比如Symbol.for('key')调用30次，每次会返回同一个值，如果调用Symbol('key')30次，会返回30个不同的Symbol值。

```
var a = Symbol.for('a'), b = Symbol.for('a');

a === b //true
```

```
var a = Symbol('a'), b = Symbol('a');

a === b //false
```

### 4. 内置的Symbol的值

1）Symbol.hasInstance

2）Symbol.isConcatSpreadable

3）Symbol.species

4）Symbol.match

5）Symbol.replace

6）Symbol.search

7）Symbol.split

8）Symbol.iterator

9）Symbol.toPrimitive

...


 


