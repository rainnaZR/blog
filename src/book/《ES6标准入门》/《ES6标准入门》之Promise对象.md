《ES6标准入门》阅读总结

# 第十五章 Promise对象

### 1. Promise的含义

Promise就是一个异步对象，传递异步操作的消息。代表某个未来才会知道结果的事件（通常是异步操作），并对这个事件提供统一的API。Promise对象有两个特点：

1）对象的状态不受外界影响。Pending，Resolved，Rejected。

2）Promise的状态改变后，就不会再发生变化。

Promise新建后，无法中途取消。如果事件频繁发生，用stream模式比Promise会更好。

### 2. 基本用法

ES6规定，Promise是一个构造函数，用来生成Promise的实例。

```
var promise = new Promise(function(resolve, reject){
    if(/* 异步操作 */){
        resolve(value);
    }else{
        reject(error);
    }
})
```

resolve函数的作用是，将Promise对象的状态从"未完成"到"成功"，在异步操作成功时调用，并将异步操作的结果作为参数传递进去；reject函数的作用是，将Promise对象的状态从"未完成"到”失败“，在异步操作失败时调用，并将异步操作报出的错误作为参数传递进去。

```
promise.then(function(value){
    //success
}, function(value){
    //failure
})
```

### 3. Promise.prototype.then()

then()作用是为Promise实例添加状态改变时的回调函数，then()的第一个参数是Resolved状态的回调函数，第二个参数是Rejected状态的回调函数。then()返回一个新的Promise实例，可以继续调用then()实现链式调用。采用链式的then可以指定一组按照次序调用的回调函数。


### 4. Promise.prototype.catch()

Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。Promise如果在resolve语句后面再抛出错误，并不会被捕获。后面的catch方法会捕获前面的catch方法抛出的错误。

### 5. Promise.all()

Promise.all用于将多个Promise实例包装成一个新的Promise实例。

```
var p = Promise.all([p1, p2, p3]);
```

p1,p1,p3都是Promise对象的实例，如果不是，会调用Promise.resolve方法，将参数转换为Promise实例。

1）只有p1, p2, p3的状态都是Fulfilled，p的状态才是Fulfilled，此时p1, p2, p3的返回值组成一个数组，传递给p的回调函数。

2）只要p1, p2, p3有一个Rejected，此时第一个被Rejected的实例的返回值传递给p的回调函数。

### 6. Promise.race()

Promise.race同样用于将多个Promise实例包装成一个新的Promise实例。区别是只要p1, p2, p3中有一个实例率先改变状态，p的状态就跟着改变，率先改变的promise实例的返回值就做为p的回调函数的值。

```
//接口的超时设置，如果指定时间没有返回结果，Promise的状态就是Rejected
var p = Promise.race([
    fetch('/get-resouce'),
    new Promise(function(resolve, reject){
        setTimeout(() => reject(new Error('request timeout')), 5000)
    })
]);

p.then(response => console.log(response));
p.catch(error => console.log(error));
```

### 7. Promise.resolve()

Promise.resolve将一个对象转换为Promise对象。

```
Promise.resolve('foo');

//等价于
new Promise((resolve, reject) => resolve('foo'));
```

Promise.resolve允许调用的时候不带参数。所以如果想得到一个Promise对象，则直接调用Promise.resolve方法就行。如果该方法的参数是一个Promise实例，则会原封不动的返回。

### 8. Promise.reject()

Promise.reject()返回一个新的Promise实例，状态是Rejected。

```
Promise.reject('error');

//等价于
new Promise((resolve, reject) => reject('error'));
```

### 9. 两个有用的附加方法

**done()**


Promise对象的回调链，使用done方法，可以捕捉到最后一个方法抛出的错误。其实现代码如下：

```
Promise.prototype.done = function(onFullfilled, onRejected){
    this.then(onFullfilled, onRejected).catch(function(err){
        //抛出一个全局错误
        setTimeout(() => {throw err}, 0);
    })
}
```

### finally()

finally方法指定不管Promise对象最后状态如何都会执行的操作，与done方法的最大区别是，它可以接受一个普通函数作为回调函数，该回调函数不管怎样都必须执行。实现原理如下：

```
//不管Promise是Fulfilled还是Rejected，都会执行回调函数callback
Promise.prototype.finally = function(callback){
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        err => P.resolve(callback()).then(() => {throw err})
    );
}
```

### 10. 应用

**加载图片**

图片的加载写成一个Promise，一旦加载完成，Promise的状态就会发生变化。

```
var preloadImage = function(path){
    return new Promise(function(resolve, reject){
        var image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = path;
    });
}

preloadImage('https://www.a.com/b.png').then(function(){alert('ok')},function(){alert('err')});
```







