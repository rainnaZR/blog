《深入浅出Node.js》阅读总结

## 模块机制

### 1. Node的特点

浏览器除了V8作为JS引擎外，还有一个webkit布局引擎。Node和浏览器十分相似，都是基于事件驱动的异步架构。Node不处理UI，运行机制和浏览器相同。

Node的特点如下：

1）异步I/O

在Node中，绝大多数的操作都以异步的方式进行调用，从而进行并行I/O操作。

2）事件和回调函数

Node接受异步调用返回数据的方式。

3）单线程

Node保持了JS在浏览器中单线程的特点。

优点： 是不用像多线程编程那样处处在意状态的同步问题，不会出现死锁，没有线程上下文交换所带来的开销。

缺点：无法利用多核CPU，错误会引起整个应用退出，大量计算占用CPU导致无法继续调用异步I/O。

为解决上述问题，Node利用子进程来计算，从而将大量计算分解掉，再通过进程之间的事件消息来传递结果。

### 2. Node的应用场景

1）I/O密集型

优势在于Node利用事件循环的处理能力。

2）处理CPU密集型任务

因为Node单线程处理的特点，处理CPU密集型任务时，可能会阻塞I/O的调用，可以通过子进程的方式将计算的任务分解掉，将计算与I/O分离，充分利用多CPU。

### 3. CommonJs模块规范

CommonJS模块规范主要分为：

1）模块引用

```
var math = require('math');
```

2）模块定义

使用module.exports对象导出当前模块的变量或者方法。在Node中，一个文件就是一个模块。通过require()引入模块后，就可以调用该模块的方法了。

```
module.exports = {
    install(app, options) {
        const middlewares = createMiddlewares(options);
        middlewares.forEach((middleware) => {
            middleware.paths.forEach((path) => {
                app.use(path, middleware.middleware);
            });
        });
    }
}
```

3）模块标识

模块标识就是传递给require()的参数。


**CommonJs模块的定义：将类聚的方法和变量等限定在私有的作用域中，并同时支持引入和导出功能以顺畅的连接上下游依赖。每个模块有独立的空间，互不干扰。**

### 4. Node的模块实现

**4.1 Node中模块分为两类：**

1）核心模块-Node提供的模块

核心模块分为纯C/C++编写的内建模块，内建模块是最底层的；C/C++和JS一起编写的，或是在内建模块基础上封装的核心模块。

在Node进程启动时，部分核心模块就已经编译成了二进制执行文件，加载到了内存中，加载速度最快。

2）文件模块-用户编写的模块

文件模块分为用户自己编写的模块，以及第三方包等。文件模块在运行时动态加载，需要经历路径分析，文件定位，编译执行过程，速度较慢。

不论是何种模块，require()方法对相同模块的二次加载时，会优先从缓存里加载。



**4.2 在Node中引入模块，需要经历下面三个步骤：**

1）路径分析

2）文件定位

3）编译执行

**4.3 路径分析和文件定位**

模块引入时，require()方法接收一个标识符作为参数，CommonJS模块规范允许标识符不带文件扩展名，Node会按.js, .json, .node次序补充扩展名。模块标识符分为以下几类：

1）核心模块，如http, fs, path等。优先级仅次于缓存模块。

2）.或..开始的相对路径文件模块。

3）以/开始的绝对路径文件模块。

4）非路径形式的模块，比如npm包，查找最费时。

为提高搜索性能，如果是.node和.json文件，在传递给require()的标识符中带上文件后缀名，会加快查找速度；或者同步配合缓存。

查找npm包时，Node在当前目录下查找package.json，然后通过JSON.parse()解析包描述对象，取出main属性指定的文件名进行定位。

**4.4 编译执行**

定位到具体的文件后，Node会新建一个模块对象，然后根据路径载入并编译。

1）.js文件。通过fs模块同步读取文件后编译执行。

2）.node文件。是用C/C++编写的扩展文件，通过process.dlopen()方法加载最后编译生成的文件。不需要编译，只需要加载和执行，将返回结果赋值给模块的exports对象。优势是执行效率比较高。

3）.json文件。通过fs模块同步读取文件，然后JSON.parse()解析并返回结果给模块的exports对象。一般作为配置文件使用，直接调用require()引入即可。

4）其余扩展文件。都被当做.js文件引入。

每一个编译成功的模块以其文件路径作为索引，缓存在Module._cache对象上，二次引入时可以直接在缓存里加载。

### 5. Node的核心模块

Node的核心模块在Node启动时，就已经编译成了二进制文件。核心模块分为两部分：

1）C/C++编写的。存在Node项目的src目录下。

2）JS编写的。存在Node项目的lib目录下。

**5.1 JS编写的核心模块的编译过程**

1）转存为C/C++代码

2）编译JS核心模块

与文件模块的区别在于：获取源代码的方式（核心模块从内存中加载）以及缓存执行结果的位置不同。

JS核心模块的定义如下： 源文件通过process.binding('natives')取出，编译成功的模块缓存在NativeModule._cache对象上。而文件模块则是缓存在Module._cache对象上。

```
function NativeModule(id){
    this.fileName = id + '.js';
    this.id = id;
    this.exports = {};
    this.loaded = false;
}

NativeModule._source = process.binding('natives');
NativeModule._cache = {};
```

**5.2 C/C++核心模块的编译过程**

纯C/C++编写的模块为内建模块，不被用户直接调用。Node的buffer,fs,os等模块是部分通过C/C++编写的。

优势：性能上优于脚本语言，在进行编译时，直接被编译为二进制文件。Node开始执行时，直接加载进内存中，直接执行。

Node中模块的依赖关系，文件模块可能依赖核心模块，核心模块可能依赖内建模块。

加载.node文件实际上经历了两步：

1）调用uv_dlopen()方法打开动态链接库。

2）调用uv_dlsym()方法找到动态链接库中通过NODE_MODULE宏定义的方法地址。

以上两步是通过libuv库进行封装的。

### 6. Node的文件模块

即是用户自定义的模块文件，或是第三方模块文件。


### 7. 模块调用栈

C/C++内建模块是最底层的模块，是核心模块，主要提供API给JS核心模块和第三方JS文件模块调用。

JS核心模块的职责有两类，一类是作为C/C++内建模块的封装层和桥接层，给文件模块调用；二类是纯粹的功能模块，不需要跟底层打交道。

### 8. NPM和包

包和NPM是将模块联系起来的一种机制。包是在模块的基础上进一步组织JS代码。

**8.1 包结构**

1）package.json：包描述文件。

2）lib：存放JS的目录。

3）bin：存放可执行二进制文件的目录。

4）doc：存放文档的目录。

5）test：存放单元测试用例的代码。

**8.2 NPM常用功能**

对于Node而言，NPM完成了第三方模块的发布，安装，下载和依赖等。

安装好依赖包后，直接在代码中调用require('pkgname')，即可引入该包。require()在做路径分析的时候 会通过模块路径 查找到 包名所在的位置。

```
//非官方源安装
npm install pkgname --registry=http://registry.url

//都从镜像源安装，则指定默认源
npm config set registry http://registry.url

//上传包
npm publish <folder>
```

### 9. 前后端公用模块

浏览器端的JS要经历从同一个服务器端分发到多个客户端执行，服务器端JS则是相同的代码需要多次执行。前者的瓶颈在于带宽，后者的瓶颈在于CPU和内存资源。前者从网络中加载资源，后者从磁盘中加载。

Node模块的引入是同步的。所以CommonJs模块规范不适用于前端JS，前端JS模块规范AMD/CMD,"异步模块定义"。

**9.1 AMD规范**

模块定义如下：

```
define(id?, dependencies?, factory) //id和dependencies可选项

define(['dep1', 'dep2'], function(dep1, dep2){
    return function(){};
})
```

AMD需要用define来明确定义一个模块，进行作用域隔离，内容通过返回的方式实现导出。


**9.2 CMD规范**

CMD与AMD的主要区别在于定义模块和依赖引入的部分。CMD更接近于CommonJs规范。

模块定义如下：

```
define(factory);
```

依赖部分：

```
define(function(require, exports, module){
    ...
});
```

### 10. 总结

1）CommonJs规范的定义

2）Node的核心模块和文件模块

3）npm和包定义






















