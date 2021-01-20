《你不知道的JS》上卷 第一部分 作用域和闭包

# 第五章 作用域闭包

## 1. 闭包定义

当函数可以记住并访问所在的词法作用域时，就产生闭包了。

```
function wait(msg){
    setTimeout(function(){
        console.log(msg)
    }, 1000)
}

wait('closure')
```

## 2. 循环和闭包

```
for(var i=0;i<5;i++){
    setTimeout(function(){
        console.log(i)
    },i*1000)
}

// 5 5 5 5 5
```

使用闭包改造后：

```
for(var i=0;i<5;i++){
  (function(j){
    setTimeout(function(){
      console.log(j)
    },j*1000)
  })(i)
}

// 输出 0 1 2 3 4 
```

或者：

```
for(let i=0;i<5;i++){
    setTimeout(function(){
        console.log(i)
    },i*1000)
}

// 输出 0 1 2 3 4
```

使用块级作用域来保存变量的值。

## 3. 模块

模块模式需要具备两个条件：

- 必须有外部的封闭函数，该函数至少要被调用一次。
- 封闭函数必须返回至少一个内部函数。

```
function a(){
    var name = 11;
    function setName(){
        console.log(name)
    }
    
    return {
        name, 
        setName
    }
}

var foo = a();
foo.setName();

// 输出11
```

模块模式的另一个简单用法是命名将要作为公共API返回的对象。

## 4. 小结

当函数可以记住并访问所在的词法作用域，即使函数在当前词法作用域之外执行，这时就产生了闭包。





