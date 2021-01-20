**通过案例说明ES6模块的加载逻辑**

先看下面案例：

```
//a.js
console.log(1);

import b from './b.js';

console.log(2);

function test(){
    console.log(3);
}
test();

export default function(){
    console.log(4);
}

b();
```

```
//b.js
console.log(5);

import a from './a.js';

console.log(6);

function test(){
    console.log(7);
}
test();

a();

export default function(){
    console.log(8);
}
```

执行a.js，结果输出如下：

```
babel-node a.js

5
6
7
4
1
2
3
8
```



**ES6模块的设计思想是尽量静态化，在代码编译阶段就确定好模块的依赖关系，以及输入和输出的变量。** 
所以在运行a.js时，模块编译阶段确定了a.js与b.js的依赖关系，加载b.js里内部的方法。然后执行a.js，调用a.js内部的方法。

1）编译阶段模块加载时调用b.js内部的方法输出值是：

```
5
6
7
4
```


2）执行阶段调用a.js内部的方法，输出值是：

```
1
2
3
8
```

