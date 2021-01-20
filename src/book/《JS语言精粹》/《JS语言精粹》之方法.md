《JS语言精粹》阅读总结

# 第八章 方法


### 1. Array

1）array.concat()

合并数组。

2）array.join(separator)

将数组构造成字符串，然后用分隔符连接在一起。

3）array.pop()

移除数组的最后一个元素并返回该元素。

4）array.push(item...)

push方法将一个或多个参数附加到数组的尾部。

5）array.reverse()

反转数组里的元素，并返回数组本身。

6）array.shift()

移除数组的第一个元素并返回该元素。shift比pop慢。

7）array.unshift(item)

将item插入数组的头部，并返回新数组的长度。

8）array.slice(start, end)

slice方法对数组做浅复制。

9）array.splice(index, length, item...)

splice方法对数组做新增，删除，替换操作。从array中移除一个或多个元素，并用新的item替换它们。index为数组移除元素的起始位置，length为移除元素的长度，item为插入的内容。返回包含移除元素的数组。该方法会直接修改源数组。

10）array.sort()

sort方法对数组进行排序。

### 2. Function

1）function.apply(this, argArray)

apply方法调用function。

### 3. Number

1）number.toFixed(num)

toFixed将number转换成一个十进制数形式的字符串。num控制小数点后几位。

2）number.toPrecision(precision)

将number转换成十进制字符串，参考控制精度。

3）number.toString(radix)

参数为基数。

### 4. Object

1）object.hasOwnProperty(name)

如果object有name的属性，返回true，不会检查原型链。

### 5. RegExp

1）regexp.exec(string)

exec方法如果成功匹配regexp和string，会返回一个数组。数组下标为0返回匹配的字符串，下标为1是分组1捕获的文本，以此类推。如果匹配失败，返回null。

```
var reg = /([A-Za-z]+)(\d{0,5})?(\$)/g;
var str = 'werwe980$';
var res = reg.exec(str);

console.log(res);

//输出：["werwe980$", "werwe", "980", "$", index: 0, input: "werwe980$", groups: undefined]
```

2）regexp.test(string)

该方法是使用正则表达式最简单和最快的方法。如果匹配返回true，否则返回false。正则表达式不要使用g标识。

### 6. String

1）string.charAt(pos)

返回在string中pos位置处的字符。

2）string.concat(string..)

concat方法把其他字符串连接在一起构造一个新的字符串。

3）string.indexOf(searchString, position)

在string内查找searchString字符串。该方法返回第一个匹配字符的索引位置。

4）string.lastIndexOf(searchString, position)

与indexOf方法类似，只不过从字符串的末尾查找。

5）string.match(regexp)

match方法让一个字符串和正则表达式进行匹配。与regexp.exec(string)返回的结果相同。

6）string.replace(searchValue, replaceValue)

对string进行查找和替换操作，并返回一个新字符串。参数searchValue可以是一个正则表达式或字符串。

```
var reg = /\((\d{3})\)/g;  //g标识符匹配所有项，否则只匹配一次
var str = '(123)(345)(456)(678)';
var newStr = str.replace(reg, 'aa-');
var newStr2 = str.replace(reg, '$1-');  //替换分组捕获的文本

console.log(newStr); //aa-aa-aa-aa-
console.log(newStr2); //123-345-456-678-
```

7）string.search(regexp)

与indexOf()方法类似，区别是search方法只接受正则表达式作为参数。

8）string.slice(start, end)

slice方法复制string的一部分来构造新字符串。

9）string.split(separator, limit)

把string分隔成片段来创建新数组。

```
var string = '1wrer-2werwe-3werw-4rere';
var arr = string.split('-');

console.log(arr);  //["1wrer", "2werwe", "3werw", "4rere"]
```

10）string.substring(start, end)

11）string.toLowerCase()

返回小写的字符串。

12）string.toUpperCase()

返回大写的字符串。


