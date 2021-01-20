《ES6标准入门》阅读总结

# 第十八章 修饰器

### 1. 类的修饰

修饰器是一个表达式，用于修改类的行为，是ES7的一个提案。修饰器对类的行为的改变，发生在代码编译时，而不是运行时。修饰器能在编译阶段运行代码。修饰器接受3个参数：目标对象，属性名，描述对象；后两个可省略。

```
//装饰器函数定义
function decorator(){
    ...
}

@decorator
class A {
    ...
}

//等同于
class A {
    ...
}
A = decorator(A) || A;
```

### 2. 方法的修饰

修饰器可以修饰类的属性。除了注释，修饰器还能用于类型检查，是JS代码静态分析的重要工具。

```
class Person{
    @readonly  //添加修饰器
    name(){
        return `${this.name}`;
    }
}
```

修饰器只能用于类和类的方法，不能用于函数，因为函数会存在函数提升。

### 3. core-decorator.js

core-decorator.js是一个第三方模块，提供了几种常见的修饰器。

1）@autobind 使得方法中的this绑定到原始对象。

2）@readonly 使得属性或方法不可写。

3）@override 检查子类的方法是否正确覆盖了父类的同名方法。

4）@deprecate 在控制台线上一条警告，表示该方法将要废除，警告信息通过参数传入。

### 4. Mixin

在一个对象中混入另一个对象的方法。通过Object.assign方法简单实现混入效果。

```
var foo = {
	getFoo(){
		console.log('foo');
	}
}

class Foo{}

Object.assign(Foo.prototype, foo);

var f = new Foo();
f.getFoo();  //foo
```

可以部署一个通用的脚本mixin.js，将mixin写成一个修饰器。

```
export function mixins(...list){
    return function(target){
        Object.assign(target.prototype, ...list);
    }
}
```

```
import {mixins} from './mixins';

const Foo = {
    foo(){
        console.log('foo');
    }
}

@mixins(Foo)
class MyClass{}  //在MyClass类中混入foo方法
```

### 6. Trait

Trait为第三方模块，是一种修饰器。


