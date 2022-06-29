## 框架设计的核心要素
### 1. 提升用户的开发体验

框架设计和开发过程中，应提供友好的警告信息。


### 2. 控制框架代码的体积

vue.js使用全局常量__DEV__来控制开发环境和生产环境打不同的包。通过判断常量__DEV__的布尔值，在开发环境给用户提供友好的警告信息；在生产环境不显示警告信息，从而控制生产环境的包最小化。


### 3. 框架做到良好的Tree-Shaking

Tree-Shaking指的是消除那些永远不会被执行的代码，也就是排除Dead code。

打包工具会提供一个机制，告诉打包工具可以移除该代码，就是使用注释代码\/\*#\_\_PURE\_\_\*\/

在vue.js 3的源码中，基本都是在一些顶级调用的函数上使用\/\*#\_\_PURE\_\_\*\/注释。

### 4. 框架输出的构建产物

无论是rollup.js还是webpack，在寻找资源时，如果package.json中存在module字段，那么会优先使用module字段指向的资源来代替main字段指向的资源。Tree-shaking基于ESM资源。

**EMS资源：**
- 带有-bundler后缀的EMS资源是给rollup.js或webpack等打包工具使用的。
- 带有-browser后缀的ESM资源是直接给<script type="module">使用的。

**两者区别：**
- 当构建用于<script>标签的ESM资源时，如果是开发环境，__DEV__为true；如果是生产环境，__DEV__为false，从而被tree-shaking移除。
- 当构建提供给打包工具的ESM资源时，使用process.env.NODE_ENV !== 'production'来替换__DEV__常量。

### 5. 特性开关

__VUE_OPTIONS_API__是一个特性开关值，通过开关决定显示哪些特性。webpack.DefinePlugin插件可以定义开关值。

vue3.js使用组合式API，如果确定不使用选项API，可以使用__VUE_OPTIONS_API__来关闭该特性，这样打包的时候这部分代码就不会包含进去，从而减少资源体积。

### 6. 错误处理

将错误处理的方法定义在外部，可由用户自定义传入。错误方法的执行在组件内部。

```
let handlerError = null

export default {
	foo(fn){
		callWithErrorHandling(fn)
	}
	// 用户可以调用该方法注册统一的错误处理函数
	registerErrorHandler(fn){
		handlerError = fn
	}
}

function callWithErrorHandling(fn){
	try{
		fn && fn()
	}catch(e){
		// 将捕获到的错误传递给用户的错误处理程序
		handlerError(e)
	}
}
```


vue.js的统一错误处理函数：

```
import App from 'App.vue'
const app = createApp(App)

app.config.errorHandler = (e) => {
	console.error(e)
}
```



### 7. 良好的TS支持


### 8. 总结

- 框架要提供良好的警告信息。
- 使用构建工具定义常量的能力，利用tree-shaking功能，控制生产环境打包大小。
- 使用\/\*#\_\_PURE\_\_\*\/注释来辅助构建工具进行tree-shaking。
- ESM资源有两种：esm-browser.js和esm-bundler.js。
- 利用开关特性。
- 统一的错误处理接口。

