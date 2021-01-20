CommonJS模块规范使用require语句导入模块，module.exports导出模块，输出的是值的拷贝，模块导入的也是输出值的拷贝，也就是说，一旦输出这个值，这个值在模块内部的变化是监听不到的。

ES6模块的规范是使用import语句导入模块，export语句导出模块，输出的是对值的引用。ES6模块的运行机制和CommonJS不一样，遇到模块加载命令import时不去执行这个模块，只会生成一个动态的只读引用，等真的需要用到这个值时，再到模块中取值，也就是说原始值变了，那输入值也会发生变化。

### 那CommonJS和ES6模块规范针对模块的循环加载处理机制有什么不同呢？

循环加载指的是a脚本的执行依赖b脚本，b脚本的执行依赖a脚本。

### 1. CommonJS模块的加载原理

CommonJS模块就是一个脚本文件，require命令第一次加载该脚本时就会执行整个脚本，然后在内存中生成该模块的一个说明对象。


```
{
    id: '',  //模块名，唯一
    exports: {  //模块输出的各个接口
        ...
    },
    loaded: true,  //模块的脚本是否执行完毕
    ...
}
```

以后用到这个模块时，就会到对象的exports属性中取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存中取值。

CommonJS模块是加载时执行，即脚本代码在require时就全部执行。一旦出现某个模块被“循环加载”，就只输出已经执行的部分，没有执行的部分不会输出。

**案例说明：**

案例来源于Node官方说明：https://nodejs.org/api/modules.html#modules_cycles

```
//a.js
exports.done = false;

var b = require('./b.js');
console.log('在a.js中，b.done = %j', b.done);

exports.done = true;
console.log('a.js执行完毕！')
```


```
//b.js
exports.done = false;

var a = require('./a.js');
console.log('在b.js中，a.done = %j', a.done);

exports.done = true;
console.log('b.js执行完毕！')
```

```
//main.js
var a = require('./a.js');
var b = require('./b.js');

console.log('在main.js中，a.done = %j, b.done = %j', a.done, b.done);
```

**输出结果如下：**

```
//node环境下运行main.js
node main.js

在b.js中，a.done = false
b.js执行完毕！
在a.js中，b.done = true
a.js执行完毕！
在main.js中，a.done = true, b.done = true
```

**JS代码执行顺序如下：**

1）main.js中先加载a.js，a脚本先输出done变量，值为false，然后加载b脚本，a的代码停止执行，等待b脚本执行完成后，才会继续往下执行。

2）b.js执行到第二行会去加载a.js，这时发生循环加载，系统会去a.js模块对应对象的exports属性取值，因为a.js没执行完，从exports属性只能取回已经执行的部分，未执行的部分不返回，所以取回的值并不是最后的值。

3）a.js已执行的代码只有一行，exports.done = false;所以对于b.js来说，require a.js只输出了一个变量done，值为false。往下执行console.log('在b.js中，a.done = %j', a.done);控制台打印出：

```
在b.js中，a.done = false
```

4）b.js继续往下执行，done变量设置为true，console.log('b.js执行完毕！')，等到全部执行完毕，将执行权交还给a.js。此时控制台输出：

```
b.js执行完毕！
```

5）执行权交给a.js后，a.js接着往下执行，执行console.log('在a.js中，b.done = %j', b.done);控制台打印出：

```
在a.js中，b.done = true
```

6）a.js继续执行，变量done设置为true，直到a.js执行完毕。

```
a.js执行完毕！
```

7）main.js中第二行不会再次执行b.js，直接输出缓存结果。最后控制台输出：


```
在main.js中，a.done = true, b.done = true
```

**总结：**

1）在b.js中，a.js没有执行完毕，只执行了第一行，所以循环加载中，只输出已执行的部分。

2）main.js第二行不会再次执行，而是输出缓存b.js的执行结果。exports.done = true;

### 2. ES6模块的循环加载

ES6模块与CommonJS有本质区别，ES6模块对导出变量，方法，对象是动态引用，遇到模块加载命令import时不会去执行模块，只是生成一个指向被加载模块的引用，需要开发者保证真正取值时能够取到值，只要引用是存在的，代码就能执行。

**案例说明：**


```
//even.js
import {odd} from './odd';

var counter = 0;
export function even(n){
    counter ++;
    console.log(counter);
    
    return n == 0 || odd(n-1);
}
```

```
//odd.js
import {even} from './even.js';

export function odd(n){
    return n != 0 && even(n-1);
}
```

```
//index.js
import * as m from './even.js';

var x = m.even(5);
console.log(x);

var y = m.even(4);
console.log(y);
```

**执行index.js，输出结果如下：**

```
babel-node index.js

1
2
3
false
4
5
6
true
```

可以看出counter的值是累加的，ES6是动态引用。如果上面的引用改为CommonJS代码，会报错，因为在odd.js里，even.js代码并没有执行。改成CommonJS规范加载的代码为：

```
//even.js
var odd = require('./odd.js');

var counter = 0;
module.exports = function even(n){
    counter ++;
    console.log(counter);

    return n == 0 || odd(n-1);
}
```

```
//odd.js
var even = require('./even.js');

module.exports = function odd(n){
    return n != 0 && even(n-1);
}
```

```
//index.js
var even = require('./even.js');

var x = even(5);
console.log(x);

var y = even(5);
console.log(y);
```

**执行index.js，输出结果如下：**

```
$ babel-node index.js
1
/Users/name/Projects/node/ES6/odd.1.js:6
    return n != 0 && even(n - 1);
                     ^

TypeError: even is not a function
    at odd (/Users/name/Projects/node/ES6/odd.1.js:4:22)
```


### 3. 总结

1）CommonJS模块是加载时执行。一旦出现某个模块被“循环加载”，就只输出已经执行的部分，没有执行的部分不会输出。

2）ES6模块对导出模块，变量，对象是动态引用，遇到模块加载命令import时不会去执行模块，只是生成一个指向被加载模块的引用。

CommonJS模块规范主要适用于后端Node.js，后端Node.js是同步模块加载，所以在模块循环引入时模块已经执行完毕。推荐前端工程中使用ES6的模块规范，通过安装Babel转码插件支持ES6模块引入的语法。

**页面内容主要来源于《ES6标准入门》Module 这一章的介绍。如果有描述不清楚或错误的地方，欢迎留言指证。**


**参考资料：**

[《ES6标准入门》之Module](https://github.com/rainnaZR/blog/blob/master/src/%E3%80%8AES6%E6%A0%87%E5%87%86%E5%85%A5%E9%97%A8%E3%80%8B%E4%B9%8BModule.md)

[Node.js Cycle](https://nodejs.org/api/modules.html#modules_cycles)

[ES-Module-Loader](https://github.com/ModuleLoader/es-module-loader)


