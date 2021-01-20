《ES6标准入门》阅读总结

# 第八章 对象的扩展

### 1. 属性的简洁表示法

ES6允许直接写入变量和函数作为对象的属性和方法。

```
{name, age}  //等于{name: name, age: age}

{
    getAge(){
        ...
    }
}
```

### 2. 属性名表达式

JS定义对象的属性有以下两种： 

```
obj.foo = true;  //属性名为标识符
obj['a' + 'bc'] = 123;  //属性名为表达式
```

ES6可以使用表达式来定义：

```
let foo = 'hello';
let obj = {
    [foo] : true,
    ['a' + 'bc'] : 123,
    ['fun' + foo](){}
}
obj  
//{hello: true, abc: 123, funhello: ƒ}
```

### 3. Object.is()

该方法比较两个值是否严格相等，与 === 基本一致。下面两种情况特殊：

```
Object.is(NaN, NaN)  //true
NaN === NaN  //false

Object.is(+0, -0)  //false
+0 === -0   //true
```

### 4. Object.assign()

Object.assign(target, source)将原对象source的可枚举属性复制到目标对象target中。如果是嵌套重复的对象，则直接替换掉原有同名对象。

```
var target = {a: 1, b:1};
var source1 = {b: 2, c:2};
var source2 = {c: 3};

Object.assign(target, source1, source2);

target  //{a: 1, b: 2, c: 3}
```

**用处：**

1）给对象添加属性。

2）给对象添加方法。

3）克隆对象。

```
function clone(origin){
    return Object.assign({}, origin);
}
```

4）合并对象。

```
function merge(target, ...source){
    return Object.assign(target, ...source)
}
```

5）为属性指定默认值。

### 5. 属性的遍历

ES5有3个操作会忽略对象中enumerabe为false的属性。

1）for...in循环。

2）Object.keys()。

3）JSON.stringify()。

ES6新增2个操作。

1）Object.assign()。

2）Reflect.enumerable()。返回所有for...in循环会遍历的属性。

ES6一共有6种方法遍历对象的属性。

1）for...in

2）Object.keys(obj)

3）Object.getOwnPropertyNames(obj)

4）Object.getOwnPropertySymbols(obj)

5）Reflect.ownKeys(obj)

6）Reflect.enumerable(obj)

### 6. __proto__属性，Object.setPrototypeOf(), Object.getPrototypeOf()

__proto__读取当前对象的prototype对象。Object.setPrototypeOf()设置一个对象的prototype对象。

```
//给obj设置原型链对象
Object.setPrototypeOf(obj, prototype);
```

### 7. 对象的扩展运算符

```
var {x, y, ...rest} = {x: 1, y:2, a: 3, b: 4}
rest
//输出{a: 3, b: 4}
```

rest参数的复制是浅复制，不会复制原型对象上的属性。如果复制的是复合类型的值，则复制的是其引用，不是其副本。




