# Node学习二-koa

## koa使用

koa是个微小的web框架。

#### 第一步：安装koa包

```js
npm i koa
```



#### 第二步：测试代码

```js
const Koa = require('koa');
const app = new Koa();

app.use((ctx, next) => {
	const start = new Date().getTime();
	console.log(`start: ${ctx.url}`);
	
	// next()执行下一个中间件
	await next();
	const end = new Date().getTime();
	console.log(`请求${ctx.url}，耗时 ${end-start}ms`);
})

app.use((ctx, next) => {
	ctx.body = [{
		name: 'abc'
	}]

	await next();
})

app.listen(3000)
```



koa使用中间件的概念来实现切面编程AOP。中间件的执行类似于剥洋葱的操作，层层深入。



## 手写koa

#### 第一步：简单手写koa框架源码

文件名为koa.js，代码如下：

```js
// koa.js
const http = require('http');
const request = require('./request.js');  // 见第二步request.js代码
const response = require('./response.js');  // 见第二步response.js代码
const context = require('./context.js');  // 见第二步context.js代码

class KOA {
  // 初始化中间件数组
  constructor(){
    this.middlewares = [];
  }
  
	// 启动服务，端口监听
	listen(...args){
		const server = http.createServer((req, res) => {
      // 创建上下文
      const ctx = this.createContext(req, res);
      // 中间件组合
      const fn = this.compose(this.middlewares);  // compose函数定义见第三步-中间件代码
      // 执行中间件
      await fn(ctx);
      
      // 响应
      ctx.end(ctx.body);
		});
    
		server.listen(...args);
	}

	// 中间件执行方法
	use(middleware){
		this.middlewares.push(middleware);
	}
  
  // 构建上下文
  createContext(req, res){
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);
    
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    
    return ctx;
  }
}

module.exports = KOA;
```



#### 第二步：Context上下文的封装

定义context上下文对象，将request, response对象封装起来，内部使用get() 和 set()简化字段的调用。

request.js 代码如下：

```
// request.js
module.exports = {
	get url(){
		return this.req.url;
	},
	
	get method(){
		return this.req.method.toLowerCase();
	}
}
```



response.js 代码如下：

```
// response.js
module.exports = {
	get body(){
		return this._body;
	},
	
	set body(val){
		this._body = val;
	}
}
```



context.js 代码如下：

```
// context.js
module.exports = {
	get url(){
		return this.request.url
	},
	
	get body(){
		return this.response.body;
	},
	
	set body(val){
		this.response.body = val;
	},
	
	get method(){
		return this.request.method;
	}
}
```



#### 第三步：中间件代码

##### 简易版

简易版compose同步函数组合实现原理：

```js
// 同步函数组合
function compose(...[first, ...other]){
	return (...args) => {
		let res = first(...args);
		other.forEach(fn => {
			res = fn(res);
		})
		
		return res;
	}
}
```



##### 洋葱圈版

middleware实现原理，组合函数代码如下： 

```js
// 中间件组合函数
function compose(middlewares){
	return function(ctx){
		return dispatch(0);
		
		function dispatch(i){
			let fn = middlewares[i];
			// 函数不存在代表执行完毕，返回空的承诺
			if(!fn){
				return Promise.resolve()
			}
			return Promise.resolve(
				fn(ctx, function next(){
					// promise完成后，再执行下一个
					return dispatch(i+1);
				})
			)
		}
	}
}

async function a(next){
	console.log('aa');
	await next();
	console.log('aa end');
}
async function b(next){
	console.log('bb');
	await next();
	console.log('bb end');
}
async function c(next){
	console.log('cc')
	await next()
	console.log('cc end')
}
let funcs = compose([a, b, c])
funcs();

// 打印结果如下：
aa
bb
cc
cc end
bb end
aa end
```



#### 第四步：调用框架代码

文件名为test.js，代码如下：

```js
// test.js
const KOA = require('./koa.js');
const app = new KOA();

app.use(ctx => {
	ctx.body('hello world');
})

app.listen(3000);
```



## koa优点

相比原生http的优点：

- 解决response, request的api不优雅的问题。koa 包装了context 上下文机制。
- 解决复杂问题的逻辑描述问题。koa使用了洋葱圈的中间件机制，既可以做切面编程，也可以顺序流转。