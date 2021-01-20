《JS语言精粹》阅读总结

# 第六章 数组

**数组字面量**

```
[1, 2, 4]
```

**长度**

length属性的值是这个数组的最大整数属性名加1。给数组设置更大的length不会给数组分配更多的空间，但是length设小会导致所有所有小标超过length的属性被删除。

**删除**

JS数组有一个splice方法。删除元素并将它们替换为其它的元素。第一个参数是索引，第二个参数是删除元素的个数，剩余的参数是插入的值。

```
var aa = [1,2,3,4,5];
aa.splice(2,1,99,98,97);

//aa = [1, 2, 99, 98, 97, 4, 5]
```

**枚举**

使用for循环实现数组的枚举。typeof数组的类型是object。

```
var arr = [1,2,3,4];

console.log(typeof arr);   //object
console.log(arr.constructor);  //Array
```

**方法**

可以在Array.prototype上新增方法，每个数组都会继承这个方法。




