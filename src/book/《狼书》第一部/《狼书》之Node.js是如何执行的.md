《狼书》阅读总结

# 第五章 Node.js是如何执行的

## 1. 准备

## 2. 编译

#### node_js2c

Node.js使用了chrome V8自带的js2c.py工具把所有内置的js代码都转换成了c语言里的数组，最终生成可供核心代码引用的node_javascript.cc文件，直接包含到Node.js程序中，这样能提高内置js的编译效率。

### 2.1 核心流程

Node.js有两大核心库：chrome V8，libuv，内联的start方法主要是针对libuv的，包括如下四个内容：

1. 准备工作。
2. 执行LoadEnvironment.
3. 开启Event Loop，无限循环。
4. 收尾，内存回收，断开debug连接。


### 2.2 构造process对象

process是Node.js内置的全局对象，node.js是单线程，单进程的，所有的进程信息都存放到process对象中。process的用法如下：

#### 统计信息：CPU,内存等。

```
console.log(process.cpuUsage())

输出： { user: 66218, system: 12888 }
```

#### 事件循环机制：process.nextTick

nextTick的作用是把laterCallback放到下一个循环中去执行。node.js为事件循环维持了一个队列，nextTick入队列，_tickCallback出队列。


#### uncaughtException事件

node.js发现一个未捕获的异常时，就会触发这个事件。

#### 其他

比如进程管理：exit, kill;I/O相关：stdout,stderr,stdin;路径处理：cwd,chdir等。

### 2.3 LoadEnvironment

所有的JS文件都处在LoadEnvironment阶段，由chrome v8引擎负责加载并执行。

#### process继承EventEmitter

## 3. 事件循环机制

事件循环是libuv的核心，也成为I/O loop,建立在所有i/o操作的基础上。chrome V8并不具有I/O操作等能力，而libuv可以补齐这个能力，node.js在Chrome v8引擎发起有关文件，网络等I/o操作，并在事件循环中加入事件以及对应的回调，当libuv的任务执行完成之后，会调用注册的回调函数并注入处理结果。

node.js是单进程，单线程的，但是libuv不是单线程的，依赖一个伴随node.js启动而初始化的线程池来实现。

通常当事件循环运行到某个阶段时，node.js会执行该阶段的操作，然后再去执行该阶段队列里的回调，直到队列里的内容耗尽，或者执行的回调数量达到最大数量。当队列耗尽或者对应的回调函数达到最大时，事件循环就会进入到下一个阶段，如此循环往复，直至进程结束。

### 3.1 microtasks和macrotasks


当调用栈执行完毕时，会优先处理microtask微任务队列里的任务，微任务全部处理完成后，才从macrotask宏任务队列里取出一个事件执行。在同一个事件循环中，微任务会优先宏任务执行。

微任务如下：microtask

1. process.nextTick
2. promise

宏任务如下：macrotask

1. setTimeout
2. setInterval
3. setImmediate
4. I/O

### 3.2 process.nextTick(callback)

process.nextTick(callback)是在事件循环的下一次循环中调用回调函数的，与setTimeout(fn, 0)类似。process.nextTick将一个函数推迟到代码执行的下一个同步方法执行完毕，或异步事件回调函数开始执行时再执行。






