# 《js设计模式》之面向对象编程-灵活的语言

## 1.1 用对象收编变量

减少创建全局变量，通过创建一个检测对象，将方法挂载在对象上。


## 1.2 函数的祖先

prototype.js 就是对源生对象，比如Function, Array, Object等的扩展。

```
Function.prototype.checkEmail = function(){}
```

函数式的写法如下：

```
var f = function(){};
f.checkEmail();
```

类的写法如下：

```
var f = new Function();
f.checkEmail();
```

## 1.3 链式添加

如果想要链式添加，就将this返回。

```
var methods = function(){};
methods.addMethod('checkName', function(){
  return this;
})
```