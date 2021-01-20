原文链接: http://www.cnblogs.com/zourong/p/5949627.html

#### 问题描述

近期做任务时，跟后端联调时遇到一个问题，前端发送get请求，当参数值有中文时，请求失败，请求参数变为乱码。（ps:一般当参数有中文时，很少使用get请求，而是使用post请求来传输数据，请求数据放在消息主体里，服务端根据请求头里的content-type里定义的编码格式解码数据）

后端起本地环境，接口可以跑通，数据可以获取到。但是在我自己电脑上，同样的接口全部返回为空。在debug模式下调试代码发现，发现后端拿到的参数值全部是乱码，那肯定就没有返回值了。这个时候就纳闷了，同样的代码为啥在不同的环境下会出现这个问题？这时很容易想到就是编码问题。

 

#### 原因

我们知道get请求，参数经过编码后会加到请求的url后，get请求经过tomcat处理。这时能想到可能是tomcat编码的问题，查看我们两个人本地的tomcat配置文件，果然不一样，后端的tomcat配置文件加上了URIEncoding="UTF-8" ，可让Tomcat（默认ISO-8859-1编码）以UTF-8的编码处理get请求，此时能正常解析参数中的中文。

 

#### 解决办法

第一种:修改tomcat下的conf/server.xml文件，找到如下代码：    
```
<Connector port="8080" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" /> 
```
加上URIEncoding="UTF-8"

第二种:get请求修改为post请求。