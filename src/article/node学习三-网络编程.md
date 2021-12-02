# Node学习三-网络编程

## 网络七层协议

网络七层协议如下：

- 应用层

- 表示层

- 会话层

- 传输层

- 网络层

- 数据链路层

- 物理层

  

传输层协议：TCP(三次握手，不丢包), UDP（反应快，不稳定）, UDP-Lite, SCTP, DCCP....

应用层协议：TELNET, SSH, HTTP, SMTP, POP, SSL/TLS, FTP, MIME.....



# TCP协议-实现即时通信

Socket实现聊天室功能，案例代码如下：

```
// socket.js

const net = require('net');
const chatServer = net.createServer(); // 新建服务器
const clientList = [];  // 客户端列表

// 服务器连接后触发事件
chatServer.on('connection', client => {
	// 连接上服务器后，客户端窗口接收内容'hi'
	client.write('hi');
	// 将当前客户端窗口保存到数组中
	clientList.push(client);
	// 客户端窗口输入数据后触发事件
	client.on('data', data => {
		console.log('receive', data.toString());
		// 数组中的每个客户端窗口接收相同的内容
		clientList.forEach(i => {
			i.write(data);
		})
	})
});

chatServer.listen(9000);
```



控制台启动服务器。

```
nodemon socket.js
```

新建客户端窗口连接服务器。

```
telnet localhost 9000
```



## HTTP协议

#### request

1. 请求行
   - Method
   - Request url
   - Http version

2. 请求报文
   - Host
   - User-Agent
   - Accept（接收资源类型，image/gif; tet/html）
   - Accept-charset
   - Accept-Encoding
   - Accept-Language
   - Authorization
   - Content-type

3. 请求正文
   - Application/x-www-form-urlencoded
   - Application/json
   - text/xml
   - text/plain
   - Multipart/form-data（多种类型的文件）



#### response

1. 状态行（状态码）
   - 1xx 提示信息
   - 2xx 成功
   - 3xx 重定向
   - 4xx 客户端错误
   - 5xx 服务器端错误

2. 消息报文
3. 响应正文

#### 跨域

相同协议，相同域名，相同端口叫同源，否则是跨域。通过请求头添加‘Access-Control-Allow-Origin’来设置域名。

https://juejin.cn/post/6940934132113342478

#### 预检请求

非简单请求外的请求会发预检请求。

#### 携带cookie

```
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

#### 反向代理

在客户端侧的代理服务器叫正向代理。靠近服务器端的代理服务器叫反向代理，比如服务器端的负载均衡等。可使用proxy将请求转发。

#### Bodyparser

当post请求携带数据量较大时，服务端使用流的方式来接收二进制数据。常见于表单提交，bodyParser原理大概如下：

```
app.use(async(ctx, next) => {
	const req = ctx.request.req;
	let reqData = [];
	let size = 0;
	await new Promise((resolve, reject) => {
		req.on('data', data => {
			reqData.push(data);
			size += data.length;
		})
		req.on('end', () => {
			const data = Buffer.concat(reqData, size);
			ctx.request.body = data.toString();
			resolve();
		})
	})
	await next();
})
```



