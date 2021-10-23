《你不知道的JS》中卷 第一部分 类型和语法

# 第四章 强制类型转换

## 1. 值类型转换

```
var b = a + '';  // 隐式强制类型转换
var b = String(a);   // 显式强制类型转换
```

## 2. 抽象值操作

### 2.1 ToString

可以向JSON.Stringify()传递一个可选参数replacer，它可以是数组或者函数，用来指定对象序列化过程中哪些属性应该处理，哪些应该被排除，类似toJSON()。

如果传递给JSON.stringify()的对象中定义了toJSON方法，那么该方法会在字符串化前调用，以便将对象转换成安全的JSON值。

### 2.2 ToNumber

true转换为1，false转换为0，null转换为0，undefined转换为NaN.

### 2.3 ToBoolean

```
Boolean(new Boolean(false))  // true
Boolean('false') // true
Boolean('0')  // true
Boolean('""')  // true
```

## 3. 显示强制类型转换

数字和字符串直接是通过内建函数 String() 和 Number()来实现的。

```
var a = '0'
var b = []
var c = {}

var d = ''
var e = null
var f = 0
var g

Boolean(a) // true 
Boolean(b)  // true
Boolean(c) // true 

Boolean(d) // false 
Boolean(e)  // false
Boolean(f)  // false
Boolean(g)  // false
```

建议使用Boolean 和 !! 来进行代码的显式转换让代码更加清晰。

## 4. 隐式强制类型转换

&& 和 || 返回的值不是布尔型，而是两个操作数中的其中一个值。

```
a && foo()    // 守护运算符
```

## 5. 宽松相等和严格相等

== 允许在相等比较中进行值的类型转换。
=== 则不允许值的类型转换。

**字符串和数字之间的比较**

当遇到字符串和数字之间进行比较时，将字符串转换成数字后再比较。

**其他类型和布尔型的比较**

```
var a = '123'
var b = true
a == b  // false
```

当其他类型的值和布尔值进行比较时，将布尔值转换成数字型后再比较。

## 6. 抽象关系比较

比较双方首先调用toPrimitive，如果结果出现非字符串，就根据ToNumber规则，将双方的值转换成数字后再比较。





