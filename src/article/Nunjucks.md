## 前端模板Nunjucks

参考资料: 
https://mozilla.github.io/nunjucks/

https://mozilla.github.io/nunjucks/templating.html

https://mozilla.github.io/nunjucks/api.html



## 常用API

### render 

nunjucks.render(name, [context], [callback])

```
var res = nunjucks.render('foo.html');

var res = nunjucks.render('foo.html', { username: 'James' });    

nunjucks.render('async.html', function(err, res) {
});
```


### renderString

nunjucks.renderString(str, context, [callback]) 返回渲染后的原始字符串。

```
var res = nunjucks.renderString('Hello {{ username }}', { username: 'James' });     //输出 Hello James
```


### configure

nunjucks.configure([path], [opts]); path 默认当前路径,模板文件所在的路径。

```
nunjucks.configure('views', {       //views为模板文件所在的目录
    autoescape: true,
    express: app,
    watch: true
});
```


### getTemplate

env.getTemplate(name, [eagerCompile], [callback])  Retrieve the template named name

```
var tmpl = env.getTemplate('page.html', true);          //返回模板文件 page.html 的内容
```


### express

env.express(app)  用做服务端渲染

```
var app = express();
env.express(app);

app.get('/', function(req, res) {
    res.render('index.html');
});
```


### constructor

new Template(src, [env], [path], [eagerCompile])

```
var tmpl = new nunjucks.Template('Hello {{ username }}');

tmpl.render({ username: "James" }); // -> "Hello James"
```