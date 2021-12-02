
项目使用vue3+vite打包，在开发过程中会遇到一些问题，现做个总结，内容会持续更新。如果有更好的解决办法，欢迎留言。


### 1. 针对部分浏览器不支持原生esModule语法的降级处理


使用插件 plugin-legancy 做兼容处理。


```
// 安装插件
yarn add @vitejs/plugin-legancy -D
```


**插件地址**：https://www.npmjs.com/package/@vitejs/plugin-legacy

**插件作用**：（引用自插件介绍）


> 1. Generate a corresponding legacy chunk for every chunk in the final bundle, transformed with @babel/preset-env and emitted as SystemJS modules (code splitting is still supported!).
> 2. Generate a polyfill chunk including SystemJS runtime, and any necessary polyfills determined by specified browser targets and actual usage in the bundle.
> 3. Inject \<script nomodule\> tags into generated HTML to conditionally load the polyfills and legacy bundle only in browsers without native ESM support.
> 4. Inject the import.meta.env.LEGACY env variable, which will only be true in the legacy production build, and false in all other cases.


**插件使用**：（引用自插件使用）

```
// vite.config.js
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}
```

如果需要支持IE11，设置如下：

```
// vite.config.js
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ]
}
```

**插件副作用**：

插件使用后对样式有影响，且会增加打包时长和文件体积。是否需要使用应根据项目实际情况决定。


### 2. vite项目在微信小程序里样式rgba转成十六进制#RGBA值

在vite.config.js里设置build.cssTarget值。官方文档已有介绍：https://vitejs.dev/config/#build-csstarget


> build.cssTarget#
> 
> Type: string | string[]
> 
> Default: the same as build.target
> 
> This options allows users to set a different browser target for CSS minification from the one used for JavaScript transpilation.
> 
> It should only be used when you are targeting a non-mainstream browser. One example is Android WeChat WebView, which supports most modern JavaScript features but not the #RGBA hexadecimal color notation in CSS. In this case, you need to set build.cssTarget to chrome61 to prevent vite from transform rgba() colors into #RGBA hexadecimal notations.


```
// vite.config.js
{
    build: {
        cssTarget: chrome61  // 值为chromeN...
    }
}
```

### 3. element-plus的语言设置

vue3项目引入element-plus包就可以使用element组件库。element-plus组件库语言默认是英文，需要进行语言设置转成中文。

```
// main.ts
import { createApp } from 'vue';
import ElementPlus from 'element-plus'   
import locale from 'element-plus/lib/locale/lang/zh-cn'  

createApp(App)
    .use(ElementPlus, { locale })    
    .mount('#app');
```

如果项目中的element-plus使用过程中出现如下错误，则vite.config.js需要设置下：

> [vite] Avoid deep import "element-plus/lib/locale/lang/zh-cn" (imported by /@/main.ts) because "element-plus" has been pre-optimized by vite into a single file. Prefer importing directly from the module entry:
>
>  import { ... } from "element-plus" 
> 
> If the dependency requires deep import to function properly, add the deep path to optimizeDeps.include in vite.config.js.


根据提示修改vite.config.js 里 optimizeDeps.include设置：

```
// vite.config.js
{
    optimizeDeps: {
        include: ['element-plus/lib/locale/lang/zh-cn']
    }
}
```


### 参考链接：

https://www.npmjs.com/package/@vitejs/plugin-legacy

https://vitejs.dev/config/#build-csstarget