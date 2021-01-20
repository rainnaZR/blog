《深入浅出Node.js》阅读总结

# 产品化

### 1. 项目工程化

项目工程化过程中，基本的几步是目录结构，构建工具，编码规范和代码审查等。

1）目录结构

例如：

```
tree
    history.md  //项目改动历史
    install.md //按照说明
    Makefile  //Makefile文件
    benchmark   //基准测试
    controllers  //控制器
    lib  //没有模块化的文件目录
    middlewares //中间件
    package.json  //包描述文件
    proxy  //数据代理目录，类似MVC中的M
    test  //测试目录
    tools  //工具目录
    views //视图目录
    routes.js  //路由注册表
    dispatch.js  //多进程管理
    README.md  //项目说明文件
    assets  //静态文件目录
    assets.json  //静态文件与CDN路径的映射文件
    bin  //可执行脚本
    config  //配置目录
    logs  //日志目录
    app.js  //工作进程
```
 
 
 2）构建工具
 
比如静态文件合并，压缩文件大小，打包应用，编译模块，这些工作可以交给构建工具来完成。主流的构建工具有Makefile和Grunt等。

3）编码规范

使用JSLint和JSHint工具制定代码提交规范。


4）代码审查

代码审查主要在请求合并的过程中完成，需要审查的点有功能是否正确完成，代码风格是否符合规范，单元测试是否同步添加等。如果不符合规范，则需要重新修改代码，然后再提交审查。

### 2. 部署流程

### 3. 性能

大致分为动静分离，多进程架构，分布式，缓存等。

1）动静分离

静态资源走CDN或Nginx，动态请求让Node处理。

2）启用缓存

使用Redis或Memcached缓存服务器几乎是Web应用的标准配置。缓存数据避免不必要的计算。

3）多进程架构

可以使用Node的cluster模块，或者pm,foever,pm2等模块进行进程管理。

4）读写分离

进行数据库的读写分离，将数据库进行主从设计，读操作不受写操作的影响。

### 4 日志

1）访问日志

用Nginx或Apache进行反向代理时，完成访问日志的记录。在Node中可以使用中间件Connect的日志中间件记录。

```
var app = connect();

//记录访问日志
connect.logger.format('home', '":user-agent" :res[content-length]');

app.use(connect.logger({
    format: 'home',
    stream: fs.creatWriteStream(__dirname + '/logs/access.log')
}))
```

2）异常日志

Node中提供的console对象来记录日志。尽量由最上层的调用者捕获记录，底层调用或中间层调用中出现的异常只要正常的传递给上层的调用方即可。底层或中间层将错误传递给上层，由上层抛出。

### 5. 监控报警

应用的监控有两类：业务逻辑型的监控，硬件型的监控。监控主要通过定时采样来进行记录。监控的指标主要有：日志监控，响应时间，进程监控，磁盘监控，内存监控，CPU占用监控，CPU load监控，I/O负载，网络监控，应用状态监控，DNS监控等。

搭配监控系统的则是报警系统，普通的有邮件报警，IM报警，短信或电话报警。

### 6. 稳定性

将Node按多进程的方式部署到多台机器中，分布式设计典型的水平扩展方式是：多进程，多机器，多机房。





