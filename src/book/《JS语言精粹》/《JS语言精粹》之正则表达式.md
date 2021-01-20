《JS语言精粹》阅读总结

# 第七章 正则表达式


正则表达式的方法有regexp.exec, regexp.test, string.match, string.replace, string.search, string.split等方法。

1）^ 表示字符串的开始。

2）$ 表示字符串的结束。

3）() 表示一个捕获型分组。一个捕获型分组会复制所匹配的文本，将其放到result数组里。每个捕获数组会指定一个编号，第一个捕获分组的编号是1。

4）(?:  )表示非捕获型分组。

5）()? 表示该分组重复0-1次。

6）[] 表示字符类，A-Za-z包括26个大写字母和26个小写字母。

7）后缀 + 表示这个字符会匹配1次及以上。

```
//()括号表示分组
var reg = /^(?:([A-Za-z]+):)?/;
var string = 'https://www.baidu.com';
var res = reg.exec(string);

console.log(res);
//输出：["https:", "https", index: 0, input: "https://www.baidu.com", groups: undefined]
```

8）\ 转义符。

9）{0,4} 后缀大括号表示前面的字符匹配的次数。

```
//新增捕获分组2   (\/{0,3})
var reg = /^(?:([A-Za-z]+):)?(\/{0,3})/;
var str = 'https://www.baidu.com';
var res = reg.exec(str);

console.log(res);
//输出：["https://", "https", "//", index: 0, input: "https://www.baidu.com", groups: undefined]
```

10）[] 分类符。

```
//新增捕获分组3   ([0-9.\-A-Za-z]+)
var reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)/;
var str = 'https://www.baidu.com';
var res = reg.exec(str);

console.log(res);
//输出：["https://www.baidu.com", "https", "//", "www.baidu.com", index: 0, input: "https://www.baidu.com", groups: undefined]
```

11）\d表示数字字符，如果加上后缀+表示1个或以上的数字。

```
//新增非捕获分组和捕获分组4  (?::(\d+))?
var reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?/;
var str = 'https://www.baidu.com:1768';
var res = reg.exec(str);

console.log(res);
//输出  ["https://www.baidu.com:1768", "https", "//", "www.baidu.com", "1768", index: 0, input: "https://www.baidu.com:1768", groups: undefined]
```

12）* 表示该字符匹配0次或多次。

13）[^]  ^表示除去方括号内字符的其他所有字符。

14）[.] .匹配除行结束符以外的所有字符。

```
//新增捕获分组5   ([^#]*)
var reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:([^#]*))?/;
var str = 'https://www.baidu.com:1768??##a=we';
var res = reg.exec(str);

console.log(res);
//输出["https://www.baidu.com:1768??", "https", "//", "www.baidu.com", "1768", "??", index: 0, input: "https://www.baidu.com:1768??##a=we", groups: undefined]
```

15）/i 添加在末尾，表示匹配字母时忽略大小写。

**结构**

RegExp能设置3个标识，g（全局）, i（忽略大小写）, m（多行）。

**元素**

一个正则表达式包含一个或多个正则表达式序列，这些序列用|分隔。如果这些序列中的任何一项符合条件，这个选择就会被匹配。

```
'info'.match(/in|inf|info/)
```

以下字符进行匹配时需要加上转义字符\

```
\ / [ ] { } ( ) ? + * | . ^ $
```

**正则表达式转义**

1）\d 表示数字，\D表示非数字。

2）\s 表示空白，\S表示非空白。

3）\w 等同于[A-Za-z_0-9]

4）\1, \2, \3 ....指向分组所捕获到的文本的引用。

**分组类型**

1）捕获型

()圆括号表示一个捕获分组，匹配到这个分组的字符都会被捕获。第一个分组是分组1。

2）非捕获型

(?:)表示非捕获型分组，只做简单的匹配，并不捕获匹配的文本，所以非捕获型分组不会干扰捕获型分组的编号。

3）向前正向匹配

(?=)类似于非捕获型分组。

4）向前负向匹配

(?!)类型向前正向匹配。

**正则表达式量词**

1）{a, b}表示字符匹配的次数。a为最小次，b为最大次。{a, }表示匹配大于等于a次。

2）?表示0-1次。等同于{0,1}.

3）+表示大于等于1次。等同于{1,}。

4）*表示大于等于0次。等同于{0,}。


