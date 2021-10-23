# 浏览器options请求


关于自定义请求头，这个还是需要服务端修改的。在响应头中加上Access-Control-Request-Headers: 字段名。允许前端设置自定义请求头字段。

在浏览器里，如果设置自定义请求头字段，浏览器会先发送options预检请求检验下，现在服务端没有设置上面提供的这个字段，导致 options 请求不成功，返回403，这个是浏览器的自发行为。只有这个options请求成功，才会继续发送post的请求。

但是在小程序里，是没有options预检这个机制的，所以小程序里用没问题。

还有当请求头里有Content-Type:Application/json时，也会触发options预检请求。