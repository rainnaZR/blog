《ES6标准入门》阅读总结

# 第四章 正则的扩展

### 1. RegExp构造函数

RegExp构造函数可接受字符串，正则表达式作为参数。

```
var regex = new RegExp(/xyz/i);
```

### 2. 字符串的正则方法

```
String.prototype.match(regex);
String.prototype.replace(regex, newStr);
String.prototype.search(regex);
String.prototype.split(regex);
```

### 3. u修饰符

ES6对正则表达式新增u修饰符，含义为“Unicode模式”，用来处理大于\uFFFF的Unicode字符。

```
//获取一个字符串的长度
function getLen(text){
	var res = text.match(/[\s\S]/gu);

	return res ? res.length : 0;
}

getLen(' aawerwer');  //输出9
```

### 4. y修饰符

### 5. flags属性

ES6为正则表达式新增了flags属性，返回正则表达式的修饰符。

```
/abc/ig.flags

//暑促gi
```


