我们都知道vue单页应用需要借助vue-router插件来实现页面的跳转，但实现原理如何呢？下面简单的分析下。单页的跳转一般有两种方式：hash变化和history控制。下面以hash变化为例说明：

## 1. 实现思路

- **第一步，实现插件的install方法**
- **第二步：定义全局组件router-link和router-view，router-link用于路由跳转，router-view用于匹配组件内容**
- **第三步：监控url的变化，比如监听hashchange或popstate事件**
- **第四步：响应最新的url，借助响应式属性current来实现，current为路由变化的值，当current改变时组件内容更新**


## 2. 代码实现


```
// rvue-router.js

let Vue;

class Router {
    constructor(options){
        this.$options = options;
        // this.current保存当前页面的hash值
        // this.current需要是响应式的属性
        Vue.util.defineReactive(this, 'current', '/');

        // 3. 监控url的变化：监听hashchange或popstate事件
        window.addEventListener('hashchange', this.onHashChange.bind(this));
        // 页面刷新时获取hash值
        window.addEventListener('load', this.onHashChange.bind(this));

        // 创建一个路由映射表
        this.routeMap = {};
        options.routes.forEach(route => {
            this.routeMap[route.path] = route;
        });
    }

    onHashChange(){
        this.current = window.location.hash.slice(1);
    }
}

// 1. 作为一个插件：实现VueRouter的install方法
Router.install = function(_Vue){
    // 保存_Vue构造函数，在Router内部使用
    // 避免import Vue时导致打包文件过大，所以通过变量Vue来保存_Vue引用
    Vue = _Vue;
 
    // 挂载$router
    // （入口文件实例化Vue时的根组件）在组件根实例中挂载$router Vue.prototype.$router = router
    // 通过混入的方式，在每个组件生命周期中实现挂载$router
    Vue.mixin({
        beforeCreate() {
            // 确保是根实例的时候才执行，只有根实例组件才有router选项
            if(this.$options.router){
                Vue.prototype.$router = this.$options.router;
            }
        },
    });

    // 2. 实现两个全局组件：router-view用于匹配组件内容，router-link用于跳转
    Vue.component('router-link', {
        props:{
            to: {
                type: String,
                required: true
            }
        },
        render(h) {
            // <a href="#/form">链接</a>
            // <router-link to="/slot" /> 调用方式
            // h(tag, data, children)
            return h('a', {attrs: {href: `#${this.to}`}}, this.$slots.default);
        }
    });
    Vue.component('router-view', {
        render(h){
            // 4. 响应最新的url：创建一个响应式的属性current，当它改变时获取对应组件的显示内容
            // current指当前页面的hash值
            // this.$router指当前VueRouter的实例
            const {current, routeMap} = this.$router;
            let component = routeMap[current] && routeMap[current].component;
            
            return h(component);
        }
    });
}

export default Router
```

## 3. 使用方法

引入rvue-router插件后，先使用Vue.use(Router)注册插件，调用rvue-router的install方法，然后创建router实例，将路由配置项作为参数传入。

```
//router.js

import Vue from 'vue'
import Router from 'rvue-router'  // 引入上面的rvue-router.js

import Form from 'components_path/form'

const routes = [{
    path: '/form',
    name: 'form',
    component: Form
}]

// 第一步 应用注册插件
Vue.use(Router);

// 第二步 创建实例
const router = new Router({
    mode: 'history',
    routes  //将路由配置项传入
})

export default router

```

在入口文件main.js中引入路由配置router.js

```
// main.js

import Vue from 'vue'
import App from './app'
import router from './router'

new Vue({
    render: h => h(App),
    router  // Vue.prototype.$router = router
}).$mount('#app')
```

npm地址：https://www.npmjs.com/package/rvue-router

以上内容为网上学习课程的复习总结。