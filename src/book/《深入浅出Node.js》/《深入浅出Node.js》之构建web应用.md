《深入浅出Node.js》阅读总结

## 构建web应用

### 1. 基础功能

在WEB应用中，请求方法有GET, POST, DELETE, PUT, CONNECT, HEAD等方法。PUT为修改资源，GET为查看一个资源，POST更新新增资源，DELETE删除资源。

查询字符串位于请求路径之后，Node提供queryString模块处理这些参数。

**Cookie记录服务器与客户端之间的状态，处理分为如下几步：**

1）服务端向客户端发送Cookie。

2）浏览器将Cookie保存。

3）之后每次浏览器请求时都会将Cookie发送给服务器端。


**Cookie设置的几个选项：**

1）path表示这个Cookie影响到的路径。路径不匹配时，不发送该Cookie。

2）Expires和Max-age告诉浏览器Cookie何时过期。

3）HttpOnly告知浏览器不允许通过脚本document.cookie来更改cookie的值。

3）Secure。当Secure值为true时，在HTTP中无效，HTTPS请求中才会被发送到服务器端进行会话验证。


**性能优化时需要注意的点：**

1）减少Cookie的大小。客户端的每个请求都会带上Cookie，Cookie较大时，报头较大，影响传输，浪费带宽。

2）静态文件使用单独的域名。

3）减少DNS查询。



广告和在线统计领域依赖Cookie，通过嵌入第三方的广告或者统计脚本，将Cookie与当前页面绑定，就可以标识用户，得到用户的 浏览行为，广告商就可以定向投放广告。

Session中保存的数据安全性比Cookie高，数据在传输过程中不可被篡改。一般采用外部专用的缓存服务器（Redis, MemCached等）来缓存数据对象。将SessionId通过Cookie来传送。

**Session的安全性：**

1）将Session的口令通过私钥加密并签名。

2）预防XSS跨站脚本攻击(Cross Site Scripting)，对用户的输入进行转义。

**利用缓存提高性能的几个规则：**

1）添加Expires或Cache-Control到报文头中。

2）配置Etags。

3）让Ajax可缓存。

强制缓存：Expires和Cache-Control
协商缓存：Last-Modified/If-Modified-Since，Etag/If-None-Match

**更新缓存的方法：**

1）每次发布，路径中加上web应用的版本号。比如a.js?v=001

2）每次发布，路径中加上该文件内容的hash值。比如a.js?hash=12334

根据文件内容生成参数值会更高效。


### 2. 数据上传

Node中通过报头的Transfer-Encoding或Content-Length来判断请求中是否带内容。

在HTTP_Parser解析报头结束后，报文内容通过data事件触发，以流的方式进行处理。将接收到的Buffer列表流转化为一个Buffer对象后，再转换成字符串，挂载到req.rawBody上。

```
function(req, res){
    if(hasBody(req)){
        var buffers = [];
        
        req.on('data', function(chunk){
            buffers.push(chunk);
        })
        
        req.on('end', function(){
            req.rawBody = Buffer.concat(buffers).toString();
            handle(req, res);
        });
    }else{
        handle(req, res);
    }
}
```


**请求头中的Content-type值的类型：**

1）application/x-www-form-urlencoded为表单数据提交，值为name=aa&age=12&gentle=female格式。

2）application/json，报文体中内容格式为Json。

3）application/xml，报文体中内容格式为xml。

4）multipart/form-data; boundary=14wesr，文件上传。代表本次提交的内容由多部分构成，boundary是每个片段的分隔符。

**数据上传的安全策略：**

数据上传时，先保存用户提交的数据，然后解析，当上传数据量大时，内存会被吃光。

1）限制上传内容的大小。

2）通过流式解析，将数据流导向磁盘中，Node只保留文件路径等小数据。

预防CSRF跨站请求伪造，B页面模拟A页面的接口请求。


### 3. 路由解析

静态文件中，URL的路径与网站目录一致，无须转换。动态文件的处理原理是web服务器根据URL路径找到对应的文件，比如index.asp/index.php，Web服务器根据文件名的后缀去寻找脚本的解析器，并传入HTTP请求的上下文。解析器执行脚本，输出响应报文，完成服务。

**MVC**

MVC模型的主要思想是将业务内容按职责分离。分为控制器，模型，视图。工作模式如下：

1）路由解析，根据URL寻找到对应的控制器和行为。 

2）行为调用相关的模型，进行数据操作。

3）数据操作结束后，调用视图和相关数据进行页面渲染，输出到客户端。


URL路径映射两种：手工关联映射，自然关联映射。

**RESTful**

RESTful的设计哲学是：通过URL设计资源，通过请求方法（Post,Delete,Put,Get）定义资源的操作，通过Accept(application/json, application/xml)决定资源的表现形式。

### 4. 中间件

中间件处于操作系统和应用软件之间，http请求处理的中间件。对于web应用的基础功能，通过中间件来完成。中间件的上下文是请求对象和响应对象。

由于Node异步的原因，在当前中间件处理完成后，通知下一个中间件执行。通过调用next()方法触发下一个中间件。

```
var handle = function(req, res, stack){
    var next = function(err){
        if(err){
            return handle500(err, req, res, stack);
        }
        
        //从stack数组中取出中间件并执行
        var middleware = stack.shift();
        if(middleware){
            //传入next()函数自身，使中间件能够执行结束后递归
            try{
                middleware(req, res, next);
            } catch(err) {
                next(err);
            }
        }
    }
    
    //启动执行
    next();
}
```

**中间件提升性能的点**

1）编写高效的中间件。使用高效的方法，缓存需要重复计算的结果，避免不必要的计算，比如HTTP报文体在GET方法时不需要解析等。

2）合理利用路由，避免不必要的中间件执行。

### 5. 页面渲染

响应报文中Content-Type的值决定采用不同的渲染方式，这个叫MIME值。不同文件有不同的MIME值，比如JSON文件为application/json,XML文件的值为application/xml等。比如响应JSON代码如下：

```
res.json = function(json){
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(json));
}
```

**视图渲染**

模式是带有特殊标签的HTML片段，通过与数据的渲染，将数据填充到这些特殊的标签中，最后生成普通的带数据的HTML片段。

**Bigpipe**

Bigpipe是FaceBook的前端加载技术，解决思路是将页面分隔成多个部分，先向用户输出没有数据的布局（框架），将每个部分逐步输出到前端，再最终渲染填充框架，完成整个网页的渲染。










