

### vue3特点

- Vue.createApp() 代替new Vue()
- Mount() 代替 $Mount()
- 新增Composition API，基于函数的逻辑复用机制，代替混入。原因是混入会引起命名冲突，重名现象，来源不清晰。



### 响应式

##### Vue2的响应式缺点：defineProperty

- Vue2 需要递归遍历数据，性能开销较大。
- 数组相关的10个方法需要重写。
- 删除和增加需要单独做响应式，监测不到。



##### Vue3的响应式优点：new Proxy

- 数组不需要重写
- 删除监听的到
- 不用的数据不会做响应式
- 使用new weakmap() 做响应式的缓存



### 依赖收集

##### Vue3依赖收集特点：

- effect(cb) 定义响应回调函数，并执行cb触发getter。

- track() 依赖收集，在对象key getter时触发，建立target/key与cb之间的映射关系。targetMap为保存依赖收集的对象表，为WeakMap()类型。

- trigger() 依赖触发，执行key对应的多个effect()。

  

### Vue3比Vue2好吗？

##### 1. Composition API，语法类似于hooks 

```js
import { ref } from 'vue'

export default{
	setup(){
		const count = ref(0);
		function add(){
			count.value ++
		}
		
		return { count, add}
	}
}
```

优点：按需引入，没有用到的reactive或onMounted不会被引入；函数式编程，数据来源和数据相关的操作都放到函数内部里。



##### 2. 响应式重写，使用proxy, effect，time-slicing

```js
const { ref, effect } = require('@vue/reactiviy');

const count = ref(2);
effect(() => {
  console.log(count.value ++)
})

setInterval(() => {
  count.value ++
}, 1000)
```



##### 3. 虚拟dom重写，加入block的概念

##### 3.1 精确标记

```
// Vue2
// 一个组件一个watcher, 组件级别的vdom
// 自上而下，深度优先，同级比较
div id="app"
	p
		span
	h1
	
1. diff div (props)
2. diff p (props)
```



```
// vue3
// 精确标记
标记动态节点和静态节点，静态节点全部略过 diff；动态的节点里静态的属性也会被略过。

以上所有的分析标记，是在编译层webpack层面来做的。
```

加入block的概念，可以将动态节点里的静态节点标记出来，这个vue2做不到。在编译时标记。



##### 3.2 精确更新

```
// vue2
// 属性，内容，子节点都比较
```



```
// vue3
// diff类型是位运算

const action1 = 1;
const action2 = 1<<1;
const action3 = 1<<2;
const action4 = action2|action3;

console.log(action4|action1); //false
console.log(action4|action2); //true
```



增加block类型，标记dynamic children类型。



##### 4. Customer renderer api 定制不同平台的渲染行为，比如weex



##### 5. 更好的类型推断支持



### react hooks与composition的区别

- hooks没有响应式的概念，每次组件重新渲染，useXXX会重新执行，为了拿到正确的状态，用数组实现，根据调用顺序返回相应的hooks。
- Composition, setup就执行一次，后面都是响应式。















