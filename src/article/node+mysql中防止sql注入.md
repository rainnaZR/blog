在node环境中操作数据库时，我们需要对用户输入的内容做编码处理，在客户端我们可以使用encode对内容进行编码；在服务端我们也要做一些编码处理，介绍以下常用几种方法，如果有新方法，欢迎大家留言补充：

## 第一种：使用connection.query(sql, values)的查询参数占位符

sql语句中使用?作为查询参数占位符，值以数组的形式作为values传入。代码使用如下：

```
const connection = mysql.createConnection({
    host     : 'xxxxxx'
    user     : 'xxxxxx',
    password : 'xxxxxx',
    database : 'xxxxxx'
});

connection.query('update tbl_module set module_status = ? where id = ?', [moduleStatus, id], ( err, rows) => {});
```

那为什么这样调用会预防sql注入呢？先查看mysql源码：

1. mysql建立连接


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14f7e9abc8b74b11a8e0031d434f7fa3~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/719825421e744bae87e7f9ccdaab3db4~tplv-k3u1fbpfcp-watermark.image?)

2. 查看Connection.js


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a286b6ed70f84b84b0cfc0124ad2aa4c~tplv-k3u1fbpfcp-watermark.image?)

如果返回sql值，则执行format()方法。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0e98f06e476420f88671ebd05987105~tplv-k3u1fbpfcp-watermark.image?)

3. 查看SqlString.format()方法

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d2e4e1e486d46afa6a13114d2b1ad1c~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a56db40eaad4dba91449cfa6bb25d98~tplv-k3u1fbpfcp-watermark.image?)

4. 查看SqlString.escapeId()和SqlString.escape()


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fdc0776e0f34e8a9ce2e053633e769e~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa04fb5e8c7846f8b83fe96d1b516df9~tplv-k3u1fbpfcp-watermark.image?)


5. 使用参数占位符，并将values传入，其内部会调用SqlString.escape()来转换。

## 方法2: 对传入的参数调用mysql.escape()来过滤

代码演示如下：

```
const connection = mysql.createConnection({
    host     : 'xxxxxx'
    user     : 'xxxxxx',
    password : 'xxxxxx',
    database : 'xxxxxx'
});

connection.query(`update tbl_module set module_status = ${mysql.escape(status)} where id = ${mysql.escape(id)}`);
```

参数编码的方法有如下三个：

- mysql.escape(param) 
- connection.escape(param) 
- pool.escape(param)

这种方式可以对输入参数做精确控制。

#### 参考资料

- https://www.cnblogs.com/rysinal/p/8350783.html
- https://www.npmjs.com/package/sqlstring