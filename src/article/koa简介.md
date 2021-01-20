资料来源: 
http://javascript.ruanyifeng.com/nodejs/koa.html
http://book.apebook.org/minghe/koa-action/start/router.html

使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率。Koa 应用是一个包含一系列中间件 generator 函数的对象。 这些中间件函数基于 request 请求以一个类似于栈的结构组成并依次执行。
Koa 包含了像 content-negotiation（内容协商）、cache freshness（缓存刷新）、proxy support（代理支持）和 redirection（重定向）等常用任务方法。 与提供庞大的函数支持不同，Koa只包含很小的一部分，因为Koa并不绑定任何中间件。

#### app.listen(...)
Koa 应用并非是一个 1-to-1 表征关系的 HTTP 服务器。 一个或多个Koa应用可以被挂载到一起组成一个包含单一 HTTP 服务器的大型应用群。

如下为一个绑定3000端口的简单 Koa 应用，其创建并返回了一个 HTTP 服务器。

```
var koa = require('koa');
var app = koa();
app.listen(3000);
```


#### app.callback()
返回一个适合 http.createServer() 方法的回调函数用来处理请求。 您也可以使用这个回调函数将您的app挂载在 Connect/Express 应用上。


#### app.use(function)
为应用添加指定的中间件,https://github.com/koajs/koa/wiki#middleware


#### app.keys

设置签名Cookie密钥，该密钥会被传递给 KeyGrip。

自己生成秘钥实例:
```
app.keys = ['im a newer secret', 'i like turtle'];
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
```


#### 错误处理

默认情况下Koa会将所有错误信息输出到 stderr，除非 NODE_ENV 是 "test"。为了实现自定义错误处理逻辑（比如 centralized logging），您可以添加 "error" 事件监听器。

```
app.on('error', function(err, ctx){
  log.error('server error', err, ctx);
});
```


#### Context(上下文)

Koa Context 将 node 的 request 和 response 对象封装在一个单独的对象里面，其为编写 web 应用和 API 提供了很多有用的方法。

context 在每个 request 请求中被创建，在中间件中作为接收器(receiver)来引用，或者通过 this 标识符来引用：

```
app.use(function *(){
  this; // is the Context
  this.request; // is a koa Request
  this.response; // is a koa Response
});
```


#### API

- ctx.req
  Node 的 request 对象。

- ctx.res
  Node 的 response 对象。

- ctx.request
  Koa 的 Request 对象。
  
- ctx.response
  Koa 的 Response 对象。
  
- ctx.app
  应用实例引用。
  
- ctx.cookies.get(name, [options])
  获得 cookie 中名为 name 的值,options 为可选参数：
    - 'signed': 如果为 true，表示请求时 cookie 需要进行签名。

- ctx.cookies.set(name, value, [options])
  设置 cookie 中名为 name 的值，options 为可选参数：
    - signed: 是否要做签名
    - expires: cookie 有效期时间
    - path: cookie 的路径，默认为 /'
    - domain: cookie 的域
    - secure: false 表示 cookie 通过 HTTP 协议发送，true 表示 cookie 通过 HTTPS 发送。
    - httpOnly: true 表示 cookie 只能通过 HTTP 协议发送
    
- ctx.throw(msg, [status])
  抛出包含 .status 属性的错误，默认为 500。该方法可以让 Koa 准确的响应处理状态。
  
  
#### 请求(Request)API

Koa Request 对象是对 node 的 request 进一步抽象和封装，提供了日常 HTTP 服务器开发中一些有用的功能。

- req.header
  请求头对象
  
- req.method
  请求方法
  
- req.method=
  设置请求方法，在实现中间件时非常有用，比如 methodOverride()。
  
- req.length
  以数字的形式返回 request 的内容长度(Content-Length)，或者返回 undefined。
  
- req.url
  获得请求url地址。
  
- req.url=
  设置请求地址，用于重写url地址时。
  
- req.originalUrl
  获取请求原始地址。
    
- req.path
  获取请求路径名。

- req.path=
  设置请求路径名，并保留请求参数(就是url中?后面的部分)。

- req.querystring
  获取查询参数字符串(url中?后面的部分)，不包含 ?。

- req.querystring=
  设置查询参数。

- req.search
  获取查询参数字符串，包含 ?。

- req.search=
  设置查询参数字符串。
  
- req.host

- req.hostname

- req.charset

- req.query
  将查询参数字符串进行解析并以对象的形式返回，如果没有查询参数字字符串则返回一个空对象。
  
- req.query=
  根据给定的对象设置查询参数字符串。
  
- req.fresh
  检查请求缓存是否 "fresh"(内容没有发生变化)。该方法用于在 If-None-Match / ETag, If-Modified-Since 和 Last-Modified 中进行缓存协调。当在 response headers 中设置一个或多个上述参数后，该方法应该被使用。
  
```
this.set('ETag', '123');

// cache is ok
if (this.fresh) {
  this.status = 304;
  return;
}

// cache is stale
// fetch new data
this.body = yield db.find('something');  
```

- req.stale
  与 req.fresh 相反。

- req.protocol
  返回请求协议，"https" 或者 "http"。 当 app.proxy 设置为 true 时，支持 X-Forwarded-Host。

- req.secure
  简化版 this.protocol == "https"，用来检查请求是否通过 TLS 发送。

- req.ip
  请求远程地址。 当 app.proxy 设置为 true 时，支持 X-Forwarded-Host。
  
- req.is(type)
  检查请求所包含的 "Content-Type" 是否为给定的 type 值。 如果没有 request body，返回 undefined。 如果没有 content type，或者匹配失败，返回 false。 否则返回匹配的 content-type。
  
  ```
  // With Content-Type: text/html; charset=utf-8
  this.is('html'); // => 'html'
  this.is('text/html'); // => 'text/html'
  this.is('text/*', 'text/html'); // => 'text/html'
  
  // When Content-Type is application/json
  this.is('json', 'urlencoded'); // => 'json'
  this.is('application/json'); // => 'application/json'
  this.is('html', 'application/*'); // => 'application/json'
  
  this.is('html'); // => false
  ```
  
- req.accepts(types)
  检查给定的类型 types(s) 是否可被接受，当为 true 时返回最佳匹配，否则返回 false。type 的值可以是一个或者多个 mime 类型字符串。
  
- req.acceptsEncodings(encodings)
  检查 encodings 是否可以被接受，当为 true 时返回最佳匹配，否则返回 false。 注意：您应该在 encodings 中包含 identity。
  
  ```
  // Accept-Encoding: gzip
  this.acceptsEncodings('gzip', 'deflate', 'identity');
  // => "gzip"
  
  this.acceptsEncodings(['gzip', 'deflate', 'identity']);
  // => "gzip"
  ```
  
- req.acceptsCharsets(charsets)
  检查 charsets 是否可以被接受，如果为 true 则返回最佳匹配， 否则返回 false。
  
  ```
  // Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
  this.acceptsCharsets('utf-8', 'utf-7');
  // => "utf-8"
  
  this.acceptsCharsets(['utf-7', 'utf-8']);
  // => "utf-8"
  ```
  
- req.socket
  返回请求的socket。
  
- req.get(field)  
  返回请求 header 中对应 field 的值。


#### 响应(Response)API

Koa Response 对象是对 node 的 response 进一步抽象和封装，提供了日常 HTTP 服务器开发中一些有用的功能。

- res.header
  Response header 对象。

- res.socket
  Response socket。

- res.status
  获取 response status。不同于 node 在默认情况下 res.statusCode 为200，res.status 并没有赋值。

- res.statusString
  Response status 字符串。

- res.status=
  通过数字状态码或者不区分大小写的字符串来设置response status.
  
- res.length=
  通过给定值设置 response Content-Length。
  
- res.length
  如果 Content-Length 作为数值存在，或者可以通过 res.body 来进行计算，则返回相应数值，否则返回 undefined。
  
- res.body
  获得 response body。
  
- res.body=

- res.get(field)
  获取 response header 中字段值，field 不区分大小写。
  
  ```
  var etag = this.get('ETag');
  ```
  
- res.set(field, value)
  设置 response header 字段 field 的值为 value。

```
this.set('Cache-Control', 'no-cache');
```

- res.set(fields)
  使用对象同时设置 response header 中多个字段的值。
```
this.set({
  'Etag': '1234',
  'Last-Modified': date
});
```

- res.remove(field)  
  移除 response header 中字段 filed。
  
- res.type
  获取 response Content-Type，不包含像 "charset" 这样的参数。
  
- res.type= 
  通过 mime 类型的字符串或者文件扩展名设置 response Content-Type.
  
- res.redirect(url, [alt])
  执行 [302] 重定向到对应 url。
  
- res.lastModified
  如果存在 Last-Modified，则以 Date 的形式返回。
  
- res.lastModified=  
  以 UTC 格式设置 Last-Modified。您可以使用 Date 或 date 字符串来进行设置。
  
- res.append(field, val)
  在 header 的 field 后面 追加 val。
  
- res.vary(field)
  相当于执行res.append('Vary', field)。
  
