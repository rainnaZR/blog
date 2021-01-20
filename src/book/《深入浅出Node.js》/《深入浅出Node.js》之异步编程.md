《深入浅出Node.js》阅读总结

## 异步编程



### 1. 函数式编程

**1）高阶函数**

高阶函数的特点可以把函数作为参数，或是将函数作为返回值的函数。

```
function foo(x){
    return function(){
        return x;
    }
}
```

高阶函数在JS中的有forEach(), map(), reduce(), filter()等。


**2）偏函数**

偏函数是指创建一个调用另外一个部分--参数或变量已经预置的函数--的函数的用法。


```
//通过isType()函数预先指定type值，然后返回一个新函数。
var isType = function(type){
    return function(obj){
	   return toString.call(obj) == '[object ' + type + ']';
    }
}

var isString = isType('String');
var isFunction = isType('Function'); 

isString('aa')   //true
```

通过指定部分参数来产生一个新的定制函数就叫偏函数。

### 2. 异步编程的难点

Node实现异步I/O的原理：利用事件循环的方式，JS线程像一个分配任务和处理结果的大管家，I/O线程池里各个I/O线程都是小二，负责处理分配过来的任务，小二和大管家互不依赖，保持整体的高效率。

事件循环模型需要应对海量请求，海量请求都作用在单线程上，需要防止任何一个计算耗费较多的CPU时间片。

建议对CPU的耗用不超过10ms，或者将大量的计算分解为诸多的小量计算，通过setImmediate()进行调度。

1）难点1：异常处理

我们自己编写的异步方法遵循两个原则：
一是必须执行调用者传入的**回调函数**；
二是正确传递回**异常** 给调用者，无须过多处理。

示例如下：

```
var async = function(callback){
    process.nextTick(function(){
        var results = 'OK';
        if(error){
            return callback(error);
        }
        
        callback(null, results);
    });
}

```

2）难点2：函数嵌套过深

相互依赖的函数放在层层的回调里，结构嵌套。

3）难点3：阻塞代码

使用setTimeout() 和 setInterval()函数进行延时判断。

4）难点4：多线程编程

JS是在单一线程上执行的代码，浏览器端JS执行线程和UI渲染公用同一个线程。

对于服务端而言，如果服务器是多核CPU,单个Node进程实质上是没有充分利用多核CPU的。利用Web Workers的模式，实现多线程编程。child_process是其基础API，cluster模块是更深层次的运用。

5）难点5：异步转同步


### 3. 异步编程解决方案

有以下三种：

**1）事件发布/订阅模式**

Node自身提供的events模块，是发布/订阅模式的简单实现。具有addListener/on(), once(), removeListener(), removeAllListeners(), emit()等基本的事件监听方法。

```
//事件订阅
emitter.on('event1', function(msg){
    console.log(msg);
})

//事件发布
emitter.emit('event1', 'message!')
```

事件发布/订阅模式 解耦业务逻辑，事件发布者无须关心订阅的侦听器如何实现业务逻辑，甚至不用关心有多少个侦听器存在，数据通过消息的方式灵活的传递。

Node对事件发布/订阅机制做了额外的处理，比如：

1.如果对一个事件添加了超过10个侦听器，会得到一条警告。可以调用emitter.setMaxListeners(0)去掉这条限制。

2.EventEmitter对象对error事件做了特殊处理，如果有error事件的侦听器，则交由侦听器处理，如果没有则将错误抛出，外部如果没有捕获这个异常，则会导致线程退出。

once()方法添加的侦听器只能执行一次，在执行之后就会将与之关联的事情移除。

**2）Promise/Deferred模式**

Promise/A, Promise/B, Promise/D典型的异步Promise/Deferred模型。

Promise/A的API定义较简单，一个Promise对象只要具备then()方法即可。then()方法有以下特点：

1.接受完成态，错误态的回调方法。

2.可选地支持progress作为第三个回调方法。

3.then()方法只接收function对象。

4.then()方法继续返回Promise对象，以实现链式调用。

```
then(fulfilledHandler, errorHandler, progressHandler)


//then()方法定义
var Promise = function(){
    EventEmitter.call(this);
}

Promise.prototype.then = function(fulfilledHandler, errorHandler, progressHandler){
    if(typeof fulfilledHander == 'function'){
        //利用once()方法，保证成功回调只执行一次
        this.once('success', fulfilledHander)
    }
    
    if(typeof errorHandler == 'function'){
        //利用once()方法，保证异常回调只执行一次
        this.once('error', errorHandler);
    }
    
    if(typeof progressHandler == 'function'){
        this.on('progress', progressHandler);
    }
    
    return this;
}
```

then()方法所做的事情只是将回调函数存起来，通过Defferred延迟对象触发这些回调函数。

```
var Deferred = function(){
    this.state = 'unfulfilled';
    this.promise = new Promise();
}

Deffered.prototype.resolve = function(obj){
    this.state = 'fulfilled';
    this.promise.emit('success', obj);
}

Deferred.prototype.reject = function(err){
    this.state = 'failed';
    this.promise.emit('error', err);
}

Deffered.prototype.progress = function(data){
    this.promise.emit('progress', data);
}

//处理多个promise的情况
Deffered.prototype.all = function(promises){
    var count = promises.length;
    var that = this;
    var results = [];
    promises.forEach(function(promise, i){
        promise.then(function(data){
            count --;
            results[i] = data;
            if(count == 0){
                that.resolve(results);
            }
        }, function(err){
            that.reject(err);
        })
    })
    
    return this.promise;
}
```

all()方法抽象多个异步操作，如果其中一个异步操作失败，整个异步操作就失败。

要让Promise支持链式执行，需要以下两个步骤：

1.将所有的回调存到队列中。

2.Promise完成时，逐个执行回调，一旦检测到返回了新的Promise对象，停止执行，然后将当前Deferred对象的Promise引用改变为新的Promise对象，并将队列中余下的回调转交给它。


**3）流程控制库**

**1. 尾触发**

需要手动调用才能执行后续调用的，此类方法叫尾调用。常见的关键词是next。尾触发应用最多的地方是Connect中间件。

```
var app = connect();

//Middleware
app.use(connect.staticCache());
app.use(connect.static(__dirname + '/public'));
app.use(connect.cookieParser());

app.listen(3000);
```

每个中间件传递请求对象，响应对象，尾触发函数，通过队列形成一个处理流。

通过调用use()方法将中间件放入队列中。使用next()方法取出队列中的中间件并执行，同时传入当前方法以实现递归调用，持续触发。


**2. async**

通过特殊的回调函数来隐藏返回值的处理。

**3. Step**

Step的parallel()方法的原理是每次执行时将内部的计数器加1， 然后返回一个回调函数，这个回调函数在异步调用结束时才执行。当回调函数执行时，计数器减1。当计数器为0的时候，告知Step所有的异步调用都结束了，Step会执行下一个方法。

**4）结论**

1.事件发布/订阅较为原始。

2.Promise/Deffered重点在于封装异步的调用部分。

3.流程控制库处理重点在于回调函数的注入上。

### 4. 异步并发控制

异步I/O与同步I/O的主要区别：

1.同步I/O的每个I/O都是彼此阻塞的，在事件循环体中，一个接着一个调用，不会出现耗用文件描述符的情况，性能底下。

2.异步I/O，容易实现并发，需要控制并发数量，需要一定的过载保护。

**1）bagpipe**

bagpipe实现过载保护，实现思路：

1.通过一个队列控制并发量。

2.如果当前活跃的异步调用量小于限定值，从队列中取出执行。

3.如果活跃调用达到限定值，调用暂时存放在队列中。

4.每个异步调用结束时，从队列中取出新的异步调用执行。


