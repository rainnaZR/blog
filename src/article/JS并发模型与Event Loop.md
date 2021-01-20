# JS并发模型与Event Loop

我不是知识的创造者，只是知识的搬运工。这篇文章介绍JS的事件循环模型，参考网上多篇文章，现在做个总结，如果有错误或描述不清楚的地方，欢迎指正。

**参考资料**


[JavaScript并发模型与Event Loop](http://blog.kaolafed.com/2017/04/21/JavaScript%E5%B9%B6%E5%8F%91%E6%A8%A1%E5%9E%8B%E4%B8%8EEvent%20Loop/)

[并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)

[JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

### 1. JS单线程执行

JS的执行是单线程的，也就是同一段时间只能做一件事。单线程执行意味着所有的任务需要排队，只有前一个任务执行完毕，才能执行后一个任务。为了充分提高JS执行的效率，所有的任务分为同步任务和异步任务。

1）同步任务

同步任务指的是在主线程上排队执行的任务，只有前一个任务执行完，才能执行后一个任务。

2）异步任务

异步任务指的不进入主线程，而是进入“任务队列”（task queue）里的任务。只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

那么JS是如何处理这些同步任务和异步任务呢？看下面介绍JS执行的并发模型。

### 2. 事件循环

JavaScript的并发模型基于“事件循环”机制。

![](https://developer.mozilla.org/files/4617/default.svg)

1）Stack 执行栈

函数调用形成了一个栈帧。当函数被调用时，会创建一个执行帧，帧中包含该函数的参数和局部变量，如果该函数内部还有函数调用，就会接着创建另一个帧，包含内部函数的参数和局部变量。如果存在全局函数调用，则全局函数压在帧的最底部。当函数执行完毕后，函数所在的执行帧会被弹出栈外，函数所在的变量和作用域会被释放。执行栈事件先进后出。

2）Heap 堆

Heap指存放对象的内存区域，对象会被分配在一个堆中，即用以表示一大块非结构化的内存区域。在函数内使用对象，其实是指向内存中对象的一个指针。

3）Queue 队列

一个 JavaScript 运行时包含了一个待处理的任务队列，任务队列是先进先出。每一个任务都关联着一个用以处理这个任务的函数。在事件循环期间的某个时刻，JS运行时会从任务队列中取出最先进入队列中的一个任务进行处理。这个任务会被移出队列，任务关联的函数会在执行栈中创建新的栈帧，被执行。执行栈清空后，事件循环会再处理队列中的下一条任务。

当一个任务需要太长时间才能处理完毕时，可以缩短任务处理，或者将一个任务裁剪成多个任务。在浏览器里，当一个事件发生且有一个事件监听器绑定在该事件上时，任务会被随时添加进队列。

setTimeout(fn, delay)，delay参数是指任务被实际加入到队列中的最小延迟时间，如果队列中没有其他任务，在这个延迟时间之后，任务会马上被处理。但是如果有其他任务，setTimeout会等待其他任务处理完后再执行fn。

总之，队列中的这些任务会在主线程的执行栈被清空时被依次读取（任务队列先进先出，即先被压入队列中的事件会被先执行）。

**下面的图更详细的介绍JS的事件循环模型。**

![](https://cdn.int64ago.org/6p10znqn.png)

主要操作逻辑如下：

1）执行栈执行主线程任务，当有操作dom，ajax交互，定时器等操作时，这些任务会被移入到callback queue 任务队列中。

2）当主线程任务执行完毕为空时，会读取callback queue队列中的函数，进入主线程执行。

3）上述过程会不断重复，形成Event Loop。

### 4. Macrotasks 和 Microtasks

在一个事件循环中，异步事件返回结果后会被放入到任务队列中。根据异步事件的类型，会被放入到
对应的宏任务列表或者微任务列表中，当执行栈为空的时候，主线程会首先查看微任务队列中的事件，执行微任务队列中的事件后，再执行宏任务队列中的事件。


1）Macrotasks 宏任务

包括 setTimeout, setInterval, setImmediate, I/O, UI rendering

2）Microtasks 微任务

包括 process.nextTick, Promises, Object.observe(废弃), MutationObserver



```
console.log('1');
setTimeout(function() {
  console.log('2');
}, 0);
Promise.resolve().then(function() {
  console.log('3');
}).then(function() {
  console.log('4');
});
console.log('5');

//输出值
1
5
3
4
undefined
2
```

microtask会优先macrotask执行。在每一次事件循环中，macrotask 只会提取一个执行，而 microtask 会一直提取，直到 microtasks 队列清空。

