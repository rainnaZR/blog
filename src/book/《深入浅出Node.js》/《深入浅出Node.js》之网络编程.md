《深入浅出Node.js》阅读总结

## 网络编程

Node具有事件驱动，无阻塞，单线程等特性，具备良好的伸缩性。利用Node可以方便的搭建网络服务器。Node提供了net, dgram, http, https四个模块，分别处理TCP, UDP, HTTP, HTTPS, 适用于客户端和服务器端。

### 1. 构建TCP服务

OSI模型：物理层，数据链路层，网络层，传输层，会话层，表示层，应用层。TCP属于传输层协议。在传输之前需要三次握手。

创建会话的过程中，服务器端和客户端分别提供一个套接字，两个套接字共同形成一个连接。

```
var net = require('net');
var server = net.createServer(function(connection) { 
   //流对象可用于服务器端与客户端之间的通信，可以通过data事件从一端读取另一端的数据，也可以通过write()方法从一端向另一端发送数据
   console.log('client connected');
   connection.on('end', function() {
      console.log('客户端关闭连接');
   });

   connection.write('Hello World!\r\n');

   connection.pipe(connection);
});


server.listen(8080, function() { 
  console.log('server is listening');
});


输出：
server is listening
client connected
客户端关闭连接
```

通过net.createServer(listener)创建一个TCP服务器，listener是连接事件connection的侦听器。

通过net模块构造客户端进行会话。代码如下：

```
var net = require('net');
var client = net.connect({port: 8080}, function() {
   console.log('连接到服务器！');  
});
client.on('data', function(data) {
   console.log(data.toString());
   client.end();
});
client.on('end', function() { 
   console.log('断开与服务器的连接');
});


输出：
连接到服务器！
Hello World!

断开与服务器的连接
```

TCP针对网络中的小数据包有一定的优化：Nagle算法。小数据包将会被Nagle算法合并，以此优化网络。需要注意的一点：不是每次write()事件都会触发一次data事件，在关闭掉Nagle算法后，另一端可能会接收到多个小数据包合并，然后只触发一次data事件。

### 2. 构建UDP服务

UDP：用户数据包协议，跟TCP同属于网络传输层。区别是TCP面向连接，UDP不是。TCP连接一旦建立，所有会话将基于连接完成。在UDP中，一个套接字可以与多个UDP服务通信，网络差的时候会存在丢包严重的问题。但是UDP无须连接，资源消耗低，处理快速且灵活，应用于视频音频等场景中。DNS服务基于UDP实现的。

### 3. 构建HTTP服务

**3.1 HTTP服务端**

Node提供了基本的http, https模块用于HTTP和HTTPS的封装。在Node中构建HTTP服务很简单，例子如下：

```
var http = require('http');
http.createServer(function(req, res){
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('hello world\n');
}).listen(1768, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1768/');
```

HTTP是应用层协议。使用curl -v可以查看请求的报文头信息。

```
curl -v http://127.0.0.1:1768

//三次握手
* Rebuilt URL to: http://127.0.0.1:1768/
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 1768 (#0)  

//客户端向服务器端发送报文
> GET / HTTP/1.1
> Host: 127.0.0.1:1768
> User-Agent: curl/7.43.0
> Accept: */*
>

//服务端完成处理后，向客户端发送响应内容，包括响应头和响应体
< HTTP/1.1 200 OK
< Content-Type: text/plain
< Date: Thu, 27 Sep 2018 06:19:51 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
hello world lalalal

//结束会话
* Connection #0 to host 127.0.0.1 left intact
```

HTTP服务只做两件事：处理HTTP请求和发送HTTP响应。报文内容中包含报文头和报文体。

TCP服务以connection为单位服务，HTTP以request为单位服务。http模块即是将connection到request的过程进行了封装。http模块将所有套接字的读写抽象为ServerRequst和ServerResponse对象。在请求产生的过程中，http模块拿到tcp套接字连接中传过来的数据，调用二进制模块http_parse进行解析，解析完请求报文的报头后，触发request事件，调用用户的业务逻辑。

请求结束时一定要调用res.end()方法结束请求，关闭连接。

HTTP服务的相关事件：

1） connection事件：在开始HTTP请求和响应前，客户端和服务器需要建立底层的TCP连接。

2） request事件：建立TCP连接后，http模块底层将在数据流中抽象出HTTP请求和HTTP响应，请求数据发送到服务器端，解析HTTP请求头后触发该事件。

3）close事件：停止接收新连接，当所有连接都断开时，触发该事件。

4）checkContinue事件

5）connect事件

6）upgrade事件

7）clientError事件

**3.2 HTTP客户端**

http模块提供了一个底层API：http.request(options, connect),用于构造HTTP客户端。代码如下：

```
var http = require('http');
var options = {
    hostname: '127.0.0.1',
    port: 1768,
    path: '/',
    method: 'GET'
};

var req = http.request(options, function(res){
    console.log('STATUS:' + res.statusCode);
    console.log('HEADERS:' + JSON.stringify(res.headers));
    
    res.setEncoding('utf8');
    res.on('data', function(chunk){
        console.log(chunk);
    })
});

req.end();


输出：
STATUS:200
HEADERS:{"content-type":"text/plain","date":"Thu, 27 Sep 2018 07:22:51 GMT","connection":"close","transfer-encoding":"chunked"}
hello world lalalal
```

### 4. 构建WebSocket服务

WebSocket与传统HTTP比有如下好处：

1）客户端与服务器端只建立一个TCP连接，可以使用更少的连接。

2）WebSocket服务器端可以推送数据到客户端，比HTTP请求响应模式更灵活高效。

3）有更轻量级的协议头，减少数据传输量。


客户端实现代码如下：

```
var socket = new WebSocket('ws://127.0.0.1:1768/updates');
socket.onopen = function(){
    //每隔50毫秒向服务器端发送数据
    setInterval(function(){
        if(socket.bufferedAmount == 0){
            socket.send(getUpdateDate());    
        }
    }, 50)
}

//接收服务端返回的数据
socket.onmessage = function(event){
    //服务端返回的数据 event.data
}
```

WebSocket协议包括两部分：握手和数据传输。

**4.1 WebSocket握手**

HTTP请求报文里设置：

```
Upgrade: websocket
Connection: websocket
```

握手成功后，服务器与客户端会呈现对等的效果，都能接收和发送消息。

**4.2 WebSocket数据传输**

握手完成后，当前连接不在进行HTTP的交互，而是开始WebSocket的数据帧协议。

客户端调用send()发送数据时，服务器端触发onmessage()；服务器端调用send()发送数据，客户端的onmessage()被触发。客户端发送的数据需要进行掩码处理，服务端返回给客户端的数据不用做掩码处理。

**4.3 小结**

WebSocket与Node完美结合，都是基于事件驱动，长连接可以处理大量并发请求。


### 5. 网络服务与安全

TLS/SSL是一个公钥/私钥的结构，非对称结构，每个服务器端与客户端都有自己的公私钥。公钥用来加密数据，私钥用于解密。在建立安全传输前，客户端与服务端要交换公钥。

Node底层采用openssl实现TLS/SSL的。

```
//生成服务器端私钥
$ openssl genrsa -out server.key 1024

//生成客户端私钥
$ openssl genrsa -out client.key 1024
```

```
//生成服务端公钥
$ openssl rsa -in server.key -pubout -out server.pem

//生成客户端公钥
$ openssl rsa -in client.key -pubout -out client.pem
```

TLS/SSL进入证书来进行认证。服务器端通过自己的私钥生成CSR文件。CA机构通过这个文件颁发属于该服务器的签名证书，只要通过CA机构就能验证该证书是否合法。证书在请求过程中发送给客户端，客户端通过CA的证书验证真伪。






