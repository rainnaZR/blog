CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。当两个地址scheme+host+port不同的时候，就是不同域的地址。

## 1. 为什么有CORS

cors是浏览器的策略，目的是为了保证网络上资源调用的安全性。如果浏览器仅仅是访问资源，不会存在跨域问题，比如访问图片，JS等文件；但是如果是读取元数据，就会受到浏览器CORS的限制，比如AJAX请求。

## 2. CORS请求类型

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

> - 请求方法是以下三种方法之一：HEAD，GET，POST
> - HTTP的头信息不超出以下几种字段：Accept，Accept-Language，Content-Language，Last-Event-ID，Content-Type: 只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

满足以上条件的为简单请求，否则为非简单请求（比如常见的自定义header字段，或是Content-Type:application/json等）。

### 2.1 简单请求

对于简单请求，浏览器发送请求时会在request header里添加Origin字段，标记请求源。服务器处理请求后，返回响应信息，浏览器检查响应信息，发现响应头里没有设置Access-Control-Allow-Origin等跨域信息，会拦截请求，并抛出错误。

### 2.2 非简单请求

非简单跨域请求在发送时，浏览器会增加一个options预检请求。大概流程如下：

- 浏览器发送一个post请求，请求头里添加过自定义字段
- 浏览器发现是个非简单请求，会先发一个options的预检请求(prefight request)
- 预检请求里浏览器会检查服务器端返回的response，如果response里添加过跨域字段，则预检请求通过
- 浏览器再发送真实的post请求

#### 请求头设置自定义字段

当非简单请求里添加过自定义请求头字段，则 response 里需要同步设置 Access-Control-Allow-Headers: '自定义header字段名'，此时预检请求才会校验通过。

```
// Request
headers: {
  'Content-Type': 'application/json'，
  'system': 'web',
  'version': 'v1.0'
}
```

```
// Response
'Access-Control-Allow-Headers': 'Content-Type, system, version'
```

#### 跨域获取cookie

跨域读取cookie, 需要满足如下三个条件：

- 客户端设置 withCredentials: true(credentials:'include')，表示同意发送cookie
- 服务端设置 Access-Control-Allow-Credentials: true，表示同意接收cookie
- Access-Control-Allow-Origin 指定固定域名


#### 前端读取响应头header字段

一般前端只能读取resopnse body，如果想要读取自定义的response header信息，就需要设置Access-Control-Expose-Headers字段，指定需要暴露出去的header字段，这样前端就可以通过JS来读取响应头里的header信息了。

```
// js
let system = response.headers.get('system');
```

```
// response
Access-Control-Expose-Headers: 'system'
```

#### 支持GET、HEAD，POST之外的请求类型

如果某个请求类型是delete，则响应头里需要设置Access-Control-Allow-Methods字段。

```
// response
Access-Control-Allow-Methods: 'delete'
```

#### 缓存预检请求

可以使用 Access-Control-Max-Age 设置预检请求的有效期。在这段时间内，同个请求的预检请求只会请求一次。

```
// response
Access-Control-Max-Age: 100  // 100秒内使用缓存过的预检请求
```


## 3. 跨域头设置

### 3.1 Access-Control-Allow-Origin

值为 * 或是固定的域名，表示允许跨域请求的域名。

### 3.2 Access-Control-Allow-Credentials

值为 true/false，表示服务器是否接收Cookie。想要跨域传递cookie，除了服务端Access-Control-Allow-Credentials: true接收cookie外；客户端请求也需要设置withCredentials: true，表示浏览器同意发送cookie。另外 Access-Control-Allow-Origin 必须是个指定的域名。

### 3.3 Access-Control-Allow-Headers

值为请求头里设置的自定义header字段。

### 3.4 Access-Control-Expose-Headers

值为需要暴露出去的header字段。

### 3.5 Access-Control-Allow-Methods

跨来源的请求只接受三种类型GET、HEAD，POST。除此之外，如果是其它请求类型，则响应头里需要设置Access-Control-Allow-Methods: 'xxx'。

### 3.6 Access-Control-Max-Age

Access-Control-Max-Age 指定本次预检请求的有效期，单位是秒。

#### 参考资料

http://www.ruanyifeng.com/blog/2016/04/cors.html

https://mp.weixin.qq.com/s/y8e1HLNzbLLYWSeMnT-xSA