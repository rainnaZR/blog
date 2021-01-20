《现代前端技术解析》阅读总结

# 第一章 web前端技术基础

### 1. 前端技术概述

1）使用前端开发框架来提高效率。

2）采用代码管理分治，将复杂的代码结构拆分成多个独立，简单，使用模块化和组件化的代码来管理和维护。

3）通过异步的方式加载页面数据。

4）使用文件缓存减少请求数。

5）响应式站点开发。

### 2. 浏览器应用基础

用户输入URL到页面展示发生了什么？

1）接收到用户输入的网址后，浏览器开启一个线程来处理，对用户输入的URL进行分析判断。

2）调用浏览器引擎中的对应方法，比如webview中的loadUrl方法。

3）通过DNS解析并获取到该网址的IP地址，查询完成后将浏览器的cookie,UA等信息向网站目的地IP发出GET请求。

4）HTTP三次握手，客户端向服务器发送报文。

5）web服务器处理请求，服务器如Apache, Tomcat, Node.js等。

6）对应的后端应用处理后端逻辑，可能会读取服务器缓存或查询数据库等。

7）服务器返回响应报文，返回304或者200.

8）浏览器下载HTML文档，或者本地读取文件。

9）浏览器解析HTML文档并生成DOM树，下载HTML文件中引用的文件，比如CSS，JS等。

10）UI引擎开始渲染解析DOM,结合CSS生成渲染树，对页面进行重排重绘，JS根据API操作DOM，页面展示完成。

**浏览器组成结构**

主要有七部分：用户界面，网络，JS引擎，渲染引擎，UI后端，JS解释器和持久化数据存储。


**浏览器渲染引擎简介**

渲染引擎在浏览器中主要用于解析HTML文档和CSS文档，然后将CSS规则应用到HTML标签元素上，并将HTML渲染到浏览器窗口中显示具体的DOM内容。流程包括：解析HTML构建DOM树，构建渲染树（样式描述的DOM树），渲染树布局，渲染树绘制。

**浏览器缓存**

现代浏览器的8种缓存机制：HTTP文件缓存, LocalStorage, SessionStorage, IndexDB, Web SQL, Cookie, CacheStorage, Application Cache, flash缓存等。常用的有HTTP缓存, LocalStorage, Cookie。

缓存优先级：Cache-Control, Etag(If-None-Match), Last-Modified(If-Modified-Since)。HTML中可以在<meta>中添加Expires和Cache-Control设置，Cache-Control中max-age的单位是秒。

```
<meta http-equiv="Expires" content="Mon, 20 Jul 2017 08:00:00 GMT" />
<meta http-equiv="Cache-Control" content="max-age=7200" />
```

```
localStorage.setItem(key, value);
localStorage.getItem(key);
localStorage.removeItem(key);
localStorage.clear();
```

Cookie分为两种：Session Cookie和持久性Cookie。Session Coookie是存在内存里，持久性Cookie保存在硬盘上。Cookie设置httpOnly参数后，前端不能通过document.cookie读取到，只能通过HTTP请求头发送到服务器进行读写操作。

Application Cache用于做离线存储，配合manifest配置文件，在本地有选择性的缓存JS，CSS，图片等静态文件。

### 3. 前端高效开发技术

```
chrome://version   //查看系统信息
chrome://inspect   //查看连接设备调试信息
chrome://downloads  //浏览器下载管理
```

除了使用chrome的调试工具，也可以辅助Fiddler或charles代理工具来进行调试。


前端远程调试工具： Vorlon.js, Weinre等，启动一个调试代理服务将远程设备上的代码发送到开发机器的模拟浏览器上逐行执行，同时开发机模拟浏览器上的操作也要反馈给远程设备。




