《ES6标准入门》阅读总结

# 第十二章 Set和Map数据结构

### 1. 基本用法

ES6提供了新的数据结构-Set，类似于数组，但是成员的值都是唯一的，没有重复值。Set函数可以接受一个数组或类数组做为参数，用于初始化。Set实例的方法分为两大类：操作方法和遍历方法。

**操作方法：**

1）add(value): 添加某个值。

2）delete(value): 删除某个值。

3）has(value): 返回布尔值，value是否为Set的成员。

4）clear(): 清除所有成员。

```
var s = new Set();
s.add(1).add(2).add(2).add(3);

s   //Set(3) {1, 2, 3}
s = Array.from(s);  //Array.from方法可以将Set结构转换为数组
s   //[1, 2, 3]
```

**遍历操作：**

1）key(): 返回健名的遍历器。

2）values(): 返回键值的遍历器。

3）entries(): 返回键值对的遍历器。

4）forEach(): 使用回调函数遍历每个成员。

```
var set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));

set //{2, 4, 6}
```

```
var set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));

set   //{2, 4, 6}
```

### 2. WeakSet

1）WeakSet的成员只能是对象，不能是其他类型的值。

2）WeakSet中的对象都是弱引用。垃圾回收机制不考虑WeakSet对该对象的引用。WeakSet不能遍历。


**WeakSet的三个方法：**

1）WeakSet.prototype.add(value)

2）WeakSet.prototype.delete(value)

3）WeakSet.prototype.has(value)

### 3. Map

Map结构类似于对象，也是键值对的组合，但是键的范围不限于字符串，可以是任意类型。Object--"字符串-值"，Map结构--"值-值"。

**Map实例属性和操作方法**

1）size属性返回Map结构的成员总数。

```
let map = new Map();
map.set('foo', true);
map.set('age', 100);

map.size  //2
```

2）set(key, value)

设置key对应的键值，返回整个Map结构。

3）get(key)

读取key对应的键值，如果没有key值，返回undefined。

4）has(key)

has方法返回一个布尔值，表示某个值是否在Map数据结构中。

5）delete(key)

删除某个键值，返回true/false。

**遍历方法：**


1）keys()

2）values()

3）entries()

4）forEach()

Map结构转换为数组结构比较快速的方法是结合使用扩展运算符（...）。

```
var map = new Map([[1, 'one'],[2, 'two'],[3, 'three']]);

[...map.keys()]  //[1, 2, 3]
[...map.values()] //["one", "two", "three"]
```


### 4. WeakMap

WeakMap与Map结构的唯一区别是只接受对象作为键名，不接受其他类型的值作为键名，键名所指的对象不计入垃圾回收机制。WeakMap专用的场合是：它的键所对应的对象将来可能会消失。WeakMap有四个方法：get(), set(), has(), delete()。

WeakMap与Map在API上有两个区别：

1）没有遍历操作，没有keys()，values()，entries()方法，没有size属性。

2）WeakSet没有clear方法，无法被清空。





