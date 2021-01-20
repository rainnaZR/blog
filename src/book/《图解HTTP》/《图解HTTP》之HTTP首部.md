《图解HTTP》阅读总结：

# 第六章 HTTP首部

### 1. HTTP报文首部

**HTTP请求报文**

在请求中，HTTP报文由方法，URI，HTTP版本，HTTP首部字段等部分构成。

**HTTP响应报文**

在响应中，HTTP报文由HTTP版本，状态码，HTTP首部字段等构成。

### 2. HTTP首部字段

1）通用首部字段，请求和响应报文都会使用的首部字段。

2）请求首部字段。

3）响应首部字段。

4）实体首部字段。

### 3. HTTP通用首部字段

**3.1 Cache-Control**

该属性设置缓存相关的操作。Cache-Control值如下：

**缓存请求指令** 

1）no-cache 强制向源服务器再次验证。目的是为了防止从缓存中返回过期的资源。

2）no-store 不缓存请求或响应的任何内容。暗示请求或响应中包含机密信息。

3）max-age 响应的最大Age值。客户端请求时，判断缓存资源的缓存时间数值是否比指定时间的数值更小，那么客户端直接接收缓存资源。当指定 max-age为0时，缓存服务器需要将请求转发给源服务器。如果同时存在Expires和max-age，优先判断max-age。忽略Expires首部字段。


**缓存响应指令**

1）public 可向任意方提供响应的缓存。

2）private 仅向特定用户返回响应。

3）no-cache 缓存前先确认有效性。

4）no-store 不缓存请求或响应的任何内容。

**3.2 Connection**

1）控制不再转发给代理的首部字段。

2）管理持久连接。

```
Connection: close  //关闭持久连接
Connection: Keep-Alive
```

**3.3 Date**

指创建HTTP报文的日期和时间。

**3.4 Trailer**

首部字段Trailer事先说明在报文主体后记录了哪些首部字段。

**3.5 Transfer-Encoding**

首部字段Transfer-Encoding规定了传输报文主体时采用的编码方式，仅对分块传输编码有效。

**3.6 Upgrade**

用于检测HTTP协议及其他协议是否可使用更高的版本进行通信，其参数值可以指定完全不同的通信协议。

```
Upgrade: websocket
```

**3.7 Via**

用于追踪客户端与服务器之间的请求和响应报文的传输路径。

**3.8 Warning**

告知用户一些与缓存相关的问题的警告。

### 4. 请求首部字段

**4.1 Accept**

该字段用于通知服务器，客户端能够处理的媒体类型，以及媒体类型的相对优先级。使用type/subtype形式，一次指定多种媒体形式。q指权重值。

**4.2 Accept-Charset**

通知服务器用户代理支持的字符集，以及字符集的相对优先顺序。q值表示权重。

**4.3 Accept-Encoding**

用户代理支持的内容编码以及编码的优先级。比如gzip，compress，deflate，identity(不压缩)。

**4.4 Accept-Language**

用户代理能够处理的语言集。

**4.5 Authorization**

要来告知服务器，用户代理的认证信息。

**4.6 Host**

Host字段告知服务器，请求的资源所处的互联网主机名和端口号。

**4.7 If-Modified-Since**

告知服务器，若资源的更新时间在If-Modified-Since值之后，请求资源没有更新，则服务器返回状态码304 Not Modified。

**4.8 If-None-Match**

客户端返回的If-None-Match字段值的实体标记Etag与请求资源的Etag是否一致，如果一致，则返回304的响应。

**4.9 If-Range**

If-Range字段值若是跟Etag值或更新的日期时间匹配一致，那么作为范围请求处理，否则忽略范围请求，返回全部资源。

**4.10 Referer**

该字段告知服务器请求的原始资源的URI。

**4.11 User-Agent**

该字段会将创建请求的浏览器和用户代理名称等信息发送给服务器。


### 5. 响应首部字段

**5.1 Age**

响应中该字段Age告知客户端，源服务器在多久前创建了响应。

**5.2 Etag**

将资源以字符串形式做唯一性标识的方式。服务器会为每一份资源分配对应的Etag值。

**5.3 Server**

```
Server: Apache/2.2.17
```

### 6. 实体首部字段

实体首部指在请求和响应两方的HTTP报文中含有与实体相关的首部字段。

**6.1 Allow 支持的HTTP方法**

```
Allow: GET, HEAD
```

**6.2 Content-Encoding**

```
content-encoding: gzip
```

**6.3 Content-Language**

```
Content-Language: zh-CN
```

**6.4 Content-Length 实体主体部分的大小**

```
Content-Length: 15000
```

**6.5 Content-Range**

```
Content-Range: bytes 5001-10000
```

**6.6 Content-Type 实体主体内对象的媒体类型。**

```
Content-Type: text/html; charset=UTF-8
```


**6.7 Expires**

**6.8 Last-Modified 指明资源最终修改的时间**

### 7. Cookie服务的首部字段

Set-Cookie 响应首部字段。
Cookie 请求首部字段。

**7.1 Set-Cookie 服务端响应头**

1）expires属性，指定浏览器可发送Cookie的有效期。

2）path属性，指定Cookie发送范围的文件目录。

3）domain

4）secure，仅在HTTPS的安全链接下才可以发送cookie。

```
Set-Cookie: name=value; secure
```

5）HttpOnly

cookie仅能通过htp请求发送，前端脚本不能读取或修改cookie。防止跨站脚本攻击XSS对Cookie的信息获取。

```
Set-Cookie: name=value; HttpOnly
```

**7.2 Cookie 请求头**

```
Cookie: name=value
```

### 8. 其他首部字段

**8.1 X-Frame-Options**

控制网站内容在其他web网站的Frame标签内的显示问题。可以防止点击劫持攻击。

**8.2 X-XSS-Protection**

针对跨栈脚本攻击的一种对策。

```
X-XSS-Protection: 1
```


