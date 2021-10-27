# Node学习一-cli工具

## Buffer



获取buffer二进制流数据

```
const buf1 = Buffer.alloc(10)
```



```
const buf2 = Buffer.from('a')
const buf3 = Buffer.from('中文')
```



```
const buf4 = Buffer.concat([buf2, buf3])
console.log(buf4.toString())
```



## http

http中的 request 和 response 都继承stream，是流的模式。

```
// 简易版1
const http = require('http');

http.createServer((request, response) => {
	response.end('hello node') //请求输出的内容
}).listen(3000)
```



```
// 简易版2
const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
	const {url, method, headers} = request;
	
	// 返回页面内容
	if(url == '/' && method == 'GET'){
		fs.readFile('index.html', (err, data) => {
			if(err){
				response.writeHead(500, {
					'Content-Type': 'text/plain;charset=utf-8'
				});
				response.end('500服务器错误');
				return;
			}
			response.statusCode = 200;
			response.setHeader('Content-Type', 'text/html');
			response.end(data);
		})
	}
	
	// 返回接口数据
	if(url == '/users' && method == 'GET'){
		reponse.writeHead(200, {
			'Content-type': 'application/json'
		});
		response.end(JSON.stringify({
			name: 'aaa',
			age: 10
		}))
	}
	
	// 返回图片资源
	if(method == 'GET' && headers.accept.indexOf('image/*') > -1){
		// 流	
		fs.createReadStream(`./${url}`).pipe(response);
	}
}).listen(3000)
```



## 流

createReadStream读取文件流，createWriteStream写入文件流。

案例说明如何复制图片资源：

```
const fs = require('fs');
const rs = fs.createReadStream('./01.jpg');  
const ws = fs.createWriteStream('./02.jpg');

rs.pipe(ws);
```



## cli工具

#### 第一步：创建工程

```
mkdir vue-test-cli
cd vue-test-cli
npm init -y
npm i commander download-git-repo ora handlebars figlet clear chalk open -s
```



#### 第二步：创建bin文件

1. package.json 添加 bin 属性

```
// package.json

"bin": {
	'test': "./bin/test.js"
}
```

2. 运行 npm link，在全局环境下生成一个符号链接文件，文件名就是package.json 中定义的模块名test。

3. 编写 bin 目录下的 test.js 文件 (shell文件)

```
// /bin/test.js

#!/usr/bin/env node

const program = require('commander');
program.version(require('../package').version);

program
	.command('init <name>')
	.description('init project')
	.action(require('../lib/init'));  // 初始化文件init.js，具体代码见第三步
program.parse(process.argv);
```



#### 第三步：创建命令

1. 初始化文件逻辑编写。

```
// /lib/init.js

const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const clear = require('clear');
const chalk = require('chalk');
const log = content => console.log(chalk.green(content));
const { clone } = require('./download');  // 见下面download.js
const { spawn } = require('./spawn'); // 见下面spawn.js;
const open = require('open');

module.exports = async name => {
	// 打印欢迎界面
	clear();
	const data = await figlet('Test welcome');
	log(data);
	
	// 克隆项目
	await clone('github://xxxxxxx', name);
	
	// 安装依赖
	log('安装依赖');
	await spawn('cnpm', ['install'], {
		cwd: `./${name}`
	})
	log('依赖安装完成')
	
	// 打开浏览器
	open('http://localhost:8080');
	await spawn('npm', ['run', 'serve'], {
		cwd: `./${name}`
	})
}
```



```
// /lib/download.js
// 克隆git项目

const {promisify} = require('util');

module.exports.clone = async function(repo, desc) => {
	const ora = require('ora');
	const downlod = promisify(require('download-git-repo'));
	const process = ora(`下载...${repo}`);
	
	process.start();
	await download(repo, desc);
	process.succeed();
}
```



```
// /lib/spawn.js

module.eports.spawn = function(...args){
	const { spawn } = require('child_process');
	return new Promise(resolve => {
		const proc = spawn(...args); //子进程
		proc.stdout.pipe(process.stdout);  // 将子进程的流导入到主进程
		proc.stderr.pipe(process.stderr); // 将子进程的错误流导入到主进程
		proc.on('close', () => {
			resolve();
		})
	})
}
```



#### 









