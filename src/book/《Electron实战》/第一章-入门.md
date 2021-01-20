## electron应用启动

### 1. 项目安装

- yarn init 
- yarn config set ELECTRON_MIRROR https://cdn.npm.taobao.org/dist/electron/
- yarn add electron --dev --platform=win64
- package.json增加启动命令

```
"scripts":{
    "start": "electron ./index.js"
}
```
- 根目录下新建index.html，(vscode下使用!快速生成html模板)
- 根目录下新建index.js，源代码参考根目录index.js
- yarn start


### 2. 扩展阅读

Node.js有三种模块：
- 核心模块：存在于Node.js环境内，比如fs,net等。
- 项目模块：项目开发者手动提供，使用项目相对路径引用。
- 第三方模块：使用yarn和npm工具来安装到项目里的。
