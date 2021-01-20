《ES6标准入门》阅读总结

# 第五章 数值的扩展

### 1. Number.isFinite(), Number.isNaN()

Number.isFinite()检查一个数字是否非无穷。

Number.isNaN()检查一个值是否为NaN。

### 2. Number.parseInt(), Number.parseFloat()

```
Number.parseInt('12.34');   //12

Number.parseInt === parseInt;  //true
```

### 3. Number.isInteger() 判断是否为整数


### 4. Math对象的扩展

1）Math.trunc() 去除一个数的小数部分。

2）Math.sign()判断一个数是否为正数，负数，零。

### 5. 指数运算符

```
var a = 2;
a **= 4;  //a = a * a * a * a

//16
```


