《ES6标准入门》阅读总结

# 第六章 数组的扩展

### 1. Array.from()

Array.from()将两类对象转换成真正的数组：类似数组的对象和可遍历的对象。

```
//ES5的写法
[].slice.apply(newArray);

//ES6的写法
Array.from(newArray);

//计算字符串的长度
Array.from(string).length;
```

伪数组比如NodeList节点列表，或者参数数组。Array.from可以将它们转换成真正的数组。


### 2. Array.of()

Array.of()将一组数值转换成数组。

```
Array.of(1, 2, 3); //[1, 2, 3]
Array.of(3);  //[,,,]参数只有一个时，指定数组的长度
```

### 3. 数组实例的find()和findIndex()

数组实例的find(func)，用于找出第一个符合条件的数组成员。参数是一个回调函数。

```
[1,2,3,4].find((x) => x > 1)

//输出2
```

### 4. 数组实例的fill()

```
[1, 2, 3, 4].fill('a');

//[a, a, a, a]
```

### 5. 数组实例的entries(), keys(), values()

entries()对键值对的遍历，keys()对健名的遍历，values()对键值的遍历。

### 6. 数组实例的includes()

该方法返回一个布尔值，表示某个数组是否包含给定的值。


