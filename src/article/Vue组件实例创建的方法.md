Vue组件实例的创建可以通过Vue.extend()或render函数来实现，下面简单介绍下：

## 1. Vue.extend()

**大致步骤如下：**

- **通过配置项获取组件的构造函数**
- **实例化构造函数，生成虚拟dom**
- **组件挂载，虚拟dom转成真实dom，并追加到dom节点中**

代码如下：

```
// 参数Component为组件配置项，返回组件实例
function create(Component, props){
    // 通过Component配置项获取组件的构造函数
    // 使用 Vue.extend(Component) 实现
    const Constructor = Vue.extend(Component);
    // 创建组件实例，生成的是虚拟dom
    // 为避免props属性重名，使用propsData属性
    const comp = new Constructor({
        propsData: props
    })
    // 组件挂载到id为app的节点中，虚拟dom挂载后才能生成真实dom
    comp.$mount('#app');
    
    return comp;
}
```


## 2. render()

大致实现步骤如下：

- 通过Component配置项获取组件的构造函数
- 实例化组件构造函数
- 组件挂载，虚拟dom转成真实dom，追加到页面节点中

代码如下：

```
function create(Component, props){
    // 通过Component配置项获取组件的构造函数
    // 通过render函数实现
    // vm就是组件实例
    const vm = new Vue({
        // h是createElement，返回VNode, VNode是虚拟dom
        // 需要挂载才能变成真实Dom
        render: h => h(Component, {props})
    })
    // $mount(elem)指定宿主元素，则会创建真实dom，并追加到指定节点
    vm.$mount('#app');
    
    const comp = vm.$children[0]
    return comp;
}
```