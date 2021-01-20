《ES6标准入门》阅读总结

# 第三章 字符串的扩展

### 1. 字符的Unicode表示法

JS采用\uxxx形式表示一个字符，xxxx表示字符的码点。

```
'\u{1f680}' === '\uD83D\uDE80'
//true
```

大括号表示法和四字节的UTF-16编码是等价的。

```
//JS共有6种表示法表示字符
'\z' === 'z'
'\172' === 'z'
'\x7A' === 'z'
'\u007A' === 'z'
'\u{7A}' === 'z'
'z' === 'z'
```

### 2. 字符串的遍历器接口

ES6为字符串添加了遍历器接口，使字符串可以由for...of循环遍历。

```
for(let str of 'hello'){
	console.log(str)
}

//输出h e l l o
```


### 3. includes(), startsWith(), endsWith()

ES6新增了3种方法查询字符串：

1）includes(str)

返回布尔值，是否包含参数str字符串。

2）startsWith(str, index)

返回布尔值，参数str字符串是否在源字符串的头部，index为源字符串查询的起始索引值。

3）endsWith(str, n)

返回布尔值，参数str字符串是否在源字符串的尾部。n为源字符串的前n个字符。

```
var s = 'hello world';

s.startsWith('world', 6);  //true
s.endsWith('hello', 5);  //true
s.includes('he');  //true
```

### 4. repeat()

repeat(n)返回一个新字符串，表示将原字符串重复n次。n会进行取整运算。

```
'hello'.repeat(3);  //"hellohellohello"
```

### 5. padStart(length, str), padEnd(length, str)

用于字符串的头部补全和尾部补全。参数length字符串最小长度，str为补全的字符串。

### 6. 模板字符串

```
var a = 12,b = 3;

var str = `total is ${a+b}`;

str  //total is 15
```

大括号内可以是变量，可以是进行运算的表达式，也可以是函数调用。

可以使用标签模板调用标签函数。


