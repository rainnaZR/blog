《ES6标准入门》阅读总结

# 第十九章 Module

ES6模块的设计思想是尽量静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS和AMD模块都只能在运行时确定这些东西，称为“运行时加载”。 ES6是“编译时加载”，在编译时完成模块编译，效率较高。

### 1. 严格模式

ES6的模块自动采用严格模式。严格模式有以下限制：

1）变量必须先声明后使用。

2）函数的参数不能有同名属性，否则报错。

3）不能使用with语句。

4）不能对只读属性赋值，否则报错。

5）不能使用前缀0表示八进制数，否则报错。

6）不能删除不可删除的属性，否则报错。

7）不能删除变量，只能删除属性。

8）arguments不会自动反应参数的变化。

....

### 2. export命令

模块功能主要由两个命令组成：export和import。export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。一个模块就是一个独立的文件，如果希望外部能够获取模块内部的某个变量，就使用export关键字输出该变量。export命令可以输出变量，函数，类。export命令在模块的顶层位置。

```
//输出变量
export {name, age};

//输出函数
export function add(x, y){
    return x + y;
}

//使用as关键字重命名函数
export {
    v1 as name,
    v2 as age
}
```


### 3. import命令

使用export命令定义模块的对外接口后，其他JS文件就可以通过import命令加载这个模块。import语句会执行所加载的模块。

```
import {name, age} from './profile';

//使用as关键字为输入的变量重命名
import {v1 as name} from './profile';
```

### 4. 模块的整体加载

用*指定一个对象，整体加载，所有输出的值都加载在这个对象上。也就是把一个模块的所有可输出的值都加载在这个对象上。

```
import * as profile from './profile';

console.log(`${profile.name}`);
console.log(`${profile.age}`);
```

### 5. module命令

module命令可以取代import语句，达到整体输入模块的作用。

```
module profile from './profile';

console.log(`${profile.name}`);
console.log(`${profile.age}`);
```

### 6. export default命令

export default命令指定模块默认输出，使用import时不需要使用大括号，因为默认输出只能有一个。export default也可以输出类。

```
//输出
export default function add(x, y){
    return x + y;
}

//输入，没有大括号
import add from './add';
```

```
//输出
export function add(x, y){
    return x + y;
}

//输入
import {add} from './add';
```


### 7. ES6模块加载的本质

CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用。CommonJS模块输入的是被输出值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

ES6模块的运行机制不一样，它遇到模块加载命令import时不会去执行模块，只会生成一个动态的只读引用。等到真的需要用到时，再到模块中取值；也就是说，原始值变了，输入值也会跟着变。

ES6模块是动态引用，且不会缓存值，动态的去加载的模块中取值，变量总是绑定其所在的模块。

### 8. 循环加载

循环加载指的是a脚本的执行依赖b脚本，b脚本的执行依赖a脚本。


**CommonJS模块的加载原理**

CommonJS模块就是一个脚本文件，require命令第一次加载该脚本就会执行整个脚本，然后在内存中生成一个对象。

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

**CommonJS模块的循环加载**

CommonJS模块是加载时执行，即脚本代码在require时就全部执行。一旦出现某个模块被“循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。

```
//a.js
exports.done = false;

var b = require('./b.js');
console.log('在a.js中，b.done = %j', b.done);

exports.done = true;
console.log('aaaa.js执行完毕！')
```

```
//b.js
exports.done = false;

var a = require('./a.js');
console.log('在b.js中，a.done = %j', a.done);

exports.done = true;
console.log('bbb.js执行完毕！')
```

```
//main.js
var a = require('./a.js');
var b = require('./b.js');

console.log('在main.js中，a.done = %j, b.done = %j', a.done, b.done);
```

```
//node环境下运行main.js
node main.js

在b.js中，a.done = false
bbb.js执行完毕！
在a.js中，b.done = true
aaaa.js执行完毕！
在main.js中，a.done = true, b.done = true
```

JS代码执行顺序如下：

1）main.js中先加载a.js，a脚本先输出done变量，为false，然后加载b脚本，a的代码停止执行，等待b脚本执行完成，才会继续往下执行。

2）b.js执行到第二行会取加载a.js，这时发生循环加载，系统会去a.js模块对应对象的exports属性取值，因为a.js没执行完，从exports属性只能取回已经执行的部分，未执行的部分不返回。

3）a.js已执行的代码只有一行，exports.done = false;所以对于b.js来说，require a.js只输出了一个变量done，值为false。往下执行console.log('在b.js中，a.done = %j', a.done);控制台打印出：

```
在b.js中，a.done = false
```

4）b.js继续往下执行，done变量设置为true，console.log('bbb.js执行完毕！')，等到全部执行完毕，将执行权交还给a.js。此时控制台输出：

```
bbb.js执行完毕！
```

5）执行权交给a.js后，a.js接着往下执行，执行console.log('在a.js中，b.done = %j', b.done);控制台打印出：

```
在a.js中，b.done = true
```

继续执行，变量done设置为true，直到a.js执行完毕。

```
aaaa.js执行完毕！
```

6）main.js中第二行不会再次执行b.js，直接输出缓存结果。最后控制台输出：


```
在main.js中，a.done = true, b.done = true
```

总结：

1）在b.js中，a.js没有执行完毕，只执行了第一行，所以循环加载中，只输出已执行的部分。

2）main.js第二行不会再次执行，而是输出缓存b.js的执行结果。exports.done = true;

CommonJS输入的是输出值的拷贝，不是引用。

**ES6模块的循环加载**

ES6模块与CommonJS有本质区别，ES6模块是动态引用，遇到模块加载命令import时不会去执行模块，只是生成一个指向被加载模块的引用，需要开发者保证真正取值时能够取到值，只要引用是存在的，代码就能执行。

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

var y = m.even(5);
console.log(y);
```

执行index.js，输出结果如下：

```
babel-node index.js
1
2
3
false
4
5
6
false
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



### 9. ES6模块的转码

**Babel**

1）安装插件

```
cnpm install --save-dev babel-preset-es2015
```

2）添加配置文件 .babelrc

```
{
  "presets": ["es2015"]
}
```

**ES6 module transpiler**

1）安装插件

```
cnpm i -g es6-module-transpiler
```

2）使用方法

```
compile-modules convert file1.js file2.js 
```


**SystemJS**

SytemsJS是一个垫片库(polyfill)，可以在浏览器内加载ES6模块，AMD模块，和CommonJS模块，并将其转换为ES5格式。它在后台调用的是Google的Traceur转码器。

1）使用方法

```
<script src="system.js"></script>

<script>
    System.import('./app'); //指的是app目录下的所有文件
</script>
```

**es-checker**

es-checker插件可以检查当前环境支持哪些ES6的语法。
