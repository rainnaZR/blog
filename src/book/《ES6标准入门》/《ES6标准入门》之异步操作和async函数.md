《ES6标准入门》阅读总结

# 第十六章 异步操作和async函数

ES6之前的异步编程方法：

1）回调函数

2）事件监听

3）发布/订阅

4）Promise对象

### 1. 基本概念

**异步**：一个任务分成两段，先执行一段，然后执行其他任务，等做好准备后执行第二段，这就叫异步任务。

**同步**：连续的执行就是同步任务。同步任务中间不能插入其他任务。

**回调函数**：JS异步编程方案之一，把任务的第二段单独写在一个函数中，等到重新执行该任务时再调用这个函数。

**Promise**：将回调函数的横向加载改为纵向加载，使用then方法实现链式调用。


### 2. Generator函数

**协程**：多个线程互相协作，完成异步任务。运行大致流程如下：

1）协程A开始执行。

2）协程A执行到一半，暂停，将执行线程转移到协程B。

3）一段时间后协程B交还执行权。

4）协程A恢复执行。

**Generator函数**

整个Generator函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，就用yield语句标明。它有两个特性：

1）函数体内外的数据交换。

```
function* gen(x){
	var y = yield x+2;
	return y;
}

var g = gen(1);

//Generator函数向外输出数据
g.next();   //{value: 3, done: false}

//next方法传入参数2，向Generator函数内部输入数据
g.next(2);   //{value: 2, done: true}
```

2）错误处理机制。

使用try...catch将错误抛出。

### 3. Thunk函数

当一个函数的参数值比较复杂，需要计算时，有两种处理方式：

1）传值调用

在进入函数体之前就计算参数的值，再将这个值传入函数内执行。

2）传名调用

直接将参数表达式传入函数体，等函数执行需要这个参数时再计算参数值。


两者区别是参数表达式计算的时机不同，传值调用是优先计算好参数值；传名调用在函数内部执行需要时才计算参数值。

传名调用时先将一个参数放到一个临时函数中，再将这个临时函数传入函数体，这个临时函数就叫Thunk函数。

**Generator函数的流程管理**

Thunk函数可以用于Generator函数的自动流程管理。下面是基于Thunk函数的Generator执行器：

```
function run(fn){
	var gen = fn();
	
	//Thunk函数的回调函数
	function next(err, data){
	   //next函数将指针移动到Generator函数的下一步，调用gen.next方法
		var result = gen.next(data);
		//判断Generator函数是否结束
		if(result.done) return;
		//将next函数再传入Thunk函数中
		result.value(next);
	}

	next();
}

//gen方法封装了多个异步操作，允许run方法，这些异步操作自动完成
function* gen(){
	var data = yield genstep(1);
	data = yield genstep(data);
	data = yield genstep(data);
	data = yield genstep(data);
	data = yield genstep(data);
	data = yield genstep(data);
	data = yield genstep(data);
}
function genstep(num){
	return function(callback){
		console.log(num);
		num ++;
		callback(null, num);
	}
}
run(gen);
```


### 4. co模块

co模块用于Generator函数的自动执行。

```
function* gen(){
	var data = yield genstep(1);
	data = yield genstep(data);
	data = yield genstep(data);
}

var co = require('co');
co(gen);
```

co函数返回一个Promise对象，使用then方法添加回调函数。

**co模块的原理**

Generator函数的自动执行的机制，有两种方法可以实现：

1）回调函数。将异步操作包装成Thunk函数，在回调函数中交回执行权。

2）Promise对象。将异步操作包装成Promise对象，用then方法交回执行权。

co模块是将两种自动执行器包装成了一个模块。

**基于Promise对象的自动执行**

```
//自动执行器代码如下：
function run(gen){
    var g = gen();
    
    function next(data){
        var result = g.next(data);
        //Generator函数操作结束
        if(result.done) return result.value;
        result.value.then(function(data){
            next(data);
        })
    }
    
    next();
}

run(gen);
```

**co模块的源码**

```
function co(gen){
    var ctx = this;
    
    //返回Promise对象
    return new Promise(function(resolve, reject){
        //检查gen是否为Generator函数，如果是，执行该Generator函数，得到一个内部指针对象
        if(typeof gen === 'function'){
            gen = gen.call(ctx);
        }
        
        //如果不是Generator函数，则返回，并将Promise状态改为Resolved
        if(!gen || typeof gen.next !== 'function'){
            return resolve(gen);
        }
        
        //Generator函数内部指针对象的next方法包装成onFulfilled函数，增加捕获抛出错误的功能
        onFulfilled();
        function onFulfilled(res){
            var ret;
            try{
                ret = gen.next(res);
            }catch(e){
                return reject(e);
            }
            
            next(ret);  //反复调用自身
        }
        
        //反复调用自身
        function next(ret){
            //检查Generator函数是否为最后一步
            if(ret.done){
                return resolve(ret.value);
            }
            
            //保证每一步的返回值是Promise对象
            var value = toPromise.call(ctx, ret.value);
            
            //使用then方法为返回值加上回调函数，然后通过onFulfilled函数再次调用next方法
            if(value && isPromise(value)) {
                return value.then(onFulfilled, onRejected);
            }
            
            //参数不合法，不为Promise和Thunk函数时，将Promise状态变更为Rejected，终止执行
            return onRejected('arg is inValid!')
        }
    })
}
```


**处理并发的异步操作**

co支持并发的异步操作，允许某些操作同时进行，等到它们全部完成后才进行下一步。

```
//数组的写法
co(function* (){
    var res = yield [
        Promise.resolve(1),
        Promise.resolve(2)
    ]
}).catch(onerror);

//对象的写法
co(function* (){
    var res = yield {
        1: Promise.resolve(1),
        2: Promise.resolve(2)
    }
}).catch(onerror);
```

### 5. async函数

asyn函数是Generator函数的语法糖，可以看作由多个异步操作包装成的一个Promise对象，而await命令就是内部then命令的语法糖。async函数就是将Generator函数的星号（*）替换成async，将yield替换成await。async函数对Generator函数改进体现在以下四点：

1）内置执行器。

2）async函数可以自动执行并返回结果，不需要像Generator函数需要调用next方法。

3）更好的语义，async和await的语义更清楚些。

4）更广的适用性。co模块约定，yield命令后面只能是Thunk函数和Promise对象，而async函数的await命令可以是Promise对象和原始类型值。

5）返回值是promise。

**与Promise, Generator的比较**

比如在DOM元素上部署一系列的动画，前一个动画结束才触发后一个，如果当中有动画出错就不执行，并返回上一个成功执行的动画的返回值。

1）Promise

```
function f(elem, anims){
    //变量ret用来保存上一个动画的返回值
	var ret = null;
	
	//新建一个空的Promise
	var p = Promise.resolve();

    //使用then方法添加所有动画
	for(var anim in anims){
		p = p.then(function(val){
			ret = val;
			return anim(elem);
		})
	}

    //返回一个错误机制的Promise
	return p.catch(function(e){
	   //...
	}).then(function(){
		return ret;
	})
}
```

**Generator**：需要用户自己提供自动执行器。

```
function f(elem, anims){
    return spawn(function* (){
        var ret = null;
        try{
            for(var anim of anims){
                ret = yield anim(elem);
            }
        }catch(e){
            //忽略错误，继续执行
        }
        
        return ret;
    })
}
```


**async**

```
async function f(elem, anims){
    var ret = null;
    try{
        for(var anim of anims){
            ret = await anim(elem);
        }
    }catch(e){
        //忽略错误，继续执行
    }
    
    return ret;
}
```


