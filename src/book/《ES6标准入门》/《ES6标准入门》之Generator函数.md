《ES6标准入门》阅读总结

# 第十四章 Generator函数

### 1. 简介

Generator函数是为异步编程解决方案。执行Generator函数会返回一个遍历器对象，可以依次遍历Generator函数内部的每一个状态。

**Generator函数的两个特征：**

1）function命令与函数名之间有个星号。

2）函数体内部使用yield语句定义不同的状态。

```
function* f(){	
	yield 'hello';
	yield 'world';
	yield 'rainna';
	return 'done';
}

var g = f();
g.next();  //{value: "hello", done: false}
g.next();  //{value: "world", done: false}
g.next();  //{value: "rainna", done: false}
g.next();  //{value: "done", done: true}
```

调用Generator函数后，函数并不执行，而是返回一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）。每次调用next方法，内部指针就从函数头或者上次停止的地方开始执行，直到遇到下一条yield语句为止。

Generator函数是分段执行的，yield语句暂停执行，next方法恢复执行。next方法返回有value和done属性的对象，value表示当前内部状态的值，也就是yield语句后表达式的值，done表示遍历是否结束。

**yield语句**

Generator函数返回的遍历器对象只有调用next方法才会遍历下一个内部状态。yield语句是暂停执行的标志。

next方法的运行逻辑如下：

1）遇到yield语句就暂停执行，并将yield后面的表达式的值作为返回对象的value值。

2）下一次调用next方法时继续往下执行，直到遇到下一条yield语句。

3）如果没有遇到yield语句，就运行到函数结束，或者return语句，并将return后面表达式的值作为返回对象的value值。

4）如果函数没有return语句，返回对象的value值为undefined。

一个Generator函数只能执行一次return语句，但是可以执行多条yield语句，生成一系列的值。yield语句不能用于普通函数中。

**与Iterator的关系**

Generator函数执行后返回的是遍历器对象。

```
function* f(){	
	yield 'hello';
}

var g = f();
g[Symbol.iterator]() === g;  //true
```



### 2. next方法的参数

yield语句本身没有返回值，返回的是undefined。next方法带参数时，该参数会被当作上一条yield语句的返回值。

Generator函数从暂停状态到恢复执行，上下文状态是不变的，通过next方法的参数就有办法在Generator函数运行后继续向函数体内注入值。通过修改上一条语句yield的返回值来调整函数行为。

```
function* foo(x){
	var y = yield (x+1);
	var z = yield (y+2);
	return x + y + z;
}

var g = foo(5);
g.next()  //{value: 6, done: false}

//因为yield语句返回undefined，所以y值undefined
g.next()  //{value: NaN, done: false}

g.next()  //{value: NaN, done: true}


var f = foo(5);
f.next()  //{value: 6, done: false}

//next方法传入了参数值4，当做上一条yield语句的返回值，所以y=4，yield后表达式 y+2 = 6
f.next(4)   //{value: 6, done: false}

//next方法传入参数值8，当做上一条yield语句的返回值，所以z=8,x=5,y=4,x+y+z=17
f.next(8)   //{value: 17, done: true}
```

### 3. for...of循环

for...of循环自动遍历Generator函数，不需要再调用next方法。for...of循环，扩展运算符（...），解构赋值，Array.from方法内部调用的都是遍历器接口。都不需要调用next方法就可以获取yield后面表达式的值。

```
function* num(){
	yield 1;
	yield 2;
	return 3;
	yield 4;
	yield 5;
}

for(let a of num()){
	console.log(a);
}  //1, 2

[...num()];  //[1, 2]

let [x, y] = num();  //x=1, y=2

Array.from(num());  //[1, 2]
```

### 4. Generator.prototype.throw()

throw方法可以在函数体外抛出错误，在Generator函数体内捕获。一旦Generator执行过程中抛出错误，就不会再执行下去了。

### 5. Generator.prototype.return()

return方法可以返回给定的值，并终结Generator函数的遍历。返回值为return方法的参数，如果没有参数值，则为undefined。

```
function* num(){
	yield 1;
	yield 2;
}

var g = num();
g.next();  //{value:1, done: false}
g.return('foo');  //{value: "foo", done: true}
```

如果Generator函数内部有try...finally代码块，则return方法推迟到finally代码块执行完后再执行return方法。

### yield* 语句

yield* 用来在一个Generator函数里执行另一个Generator函数。yield* 语句等同于在Generator函数内部部署一个for...of循环。

```
function* num(){
	yield 2;
	yield 3;
}

function* g(){
	yield 1;
	yield* num();  //使用yield*语句调用另一个Generator函数
	yield 4;
}

var f = g();
f.next();  //{value: 1, done: false}
f.next();   //{value: 2, done: false}
f.next();   //{value: 3, done: false}
f.next();   //{value: 4, done: false}
```

任何数据结构只要有Iterator接口，就可以用yield* 遍历，等同于使用for...of循环。yield语句返回整个字符串，yield* 返回单个字符。

```
var f = function* (){
	yield 'hello';
	yield* 'hello';
}

var g = f();
g.next();  //{value: "hello", done: false}
g.next();  //{value: "h", done: false}
g.next();  //{value: "e", done: false}
g.next();  //{value: "l", done: false}
```

使用yield* 命令取出嵌套数组的所有成员。

```
function* f(arr){
	if(Array.isArray(arr)){
		for(let i=0; i< arr.length; i++){
			yield* f(arr[i]);
		}
	}else{
		yield arr;
	}	
}

const tree = ['a',['b','c',['d','e']]];

for(let item of f(tree)){
	console.log(item);
}

//a
//b
//c
//d
//e
//f
```


### 7. 作为对象属性的Generator函数

```
let obj = {
    * f(){
        //code
    }
}
```


### 8. Generator函数的this

Generator函数返回的是一个遍历器，这个遍历器是Generator函数的实例，继承Generator函数原型上的所有方法。Generator函数不能当做普通的构造函数使用。

```
function* F(){
	yield this.x = 2;
	yield this.y = 3;
}

var obj = {};
var f = F.bind(obj)();

f.next();  //{value: 2, done: false}
f.next();  //{value: 3, done: false}
obj  //{x: 2, y: 3}
```


### 9. 含义

**Generator与状态机**

Generator实现状态的切换：

```
function* g(_){
	while(true){
		console.log('open');
		yield _;
		console.log('close');
		yield _; 
	}
}

var f = g();
f.next();  //open {value: undefined, done: false}
f.next();  //close {value: undefined, done: false}
f.next();  //open {value: undefined, done: false}
```


**Generator与协程**

协程可以理解为协作的线程，或协作的函数。传统的子例程采用堆栈式“后进先出”的执行方式，子函数完全执行完毕后才结束父函数。

协程是多个线程并行执行，但是只有一个线程或函数处于运行的状态，其他线程或函数处于暂停态，线程之间可以交换执行权。

在内存中子例程只使用一个栈，协程同时存在多个栈，但是只有一个栈是运行态。协程是以占用内存为代价实现多任务的并行运行。如果将Generator函数当做协程，可以将多个需要协助的任务写成Generator函数，通过yield语句来交换控制权。

### 10. 应用

1）异步操作同步化表达

通过Generator函数改写Ajax操作：

```
function* main(url){
	let response = yield request(url);  //变量response的值为g.next(res)里的参数值res
	let result = JSON.parse(result);

	console.log(result.value);
}

function* request(url){
	makeAjaxFunc(url, function(res){
		g.next(res);  //一定要传入参数，参数值为上一个yield语句的返回值
	})
}

var g = main('http://request.url');
g.next();
```

2）控制流管理

````
function* tasks(){
    try{
        var value1 = yield step1();
        var value2 = yield step2(value1);
        var value3 = yield step3(value2);
    }catch(e){
        //抛出错误
    }
}

//添加函数调用，按次序执行所有步骤
scheduler(tasks());

function scheduler(g){
    setTimeout(function(){
        var taskObj = g.next(g.value);
        //Generator函数还未结束，继续调用,taskObj有value和done两个属性
        if(!taskObj.done){
            //使用g.value来保存这一次yield的返回值，然后将这个值当做参数传递给next方法
            g.value = taskObj.value;
            scheduler(g);
        };
    }, 0)
}
```

3）在对象上部署Iterator接口

4）作为数据结构

