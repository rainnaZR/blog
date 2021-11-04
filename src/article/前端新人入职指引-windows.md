新员工入职第一天，拿到公司新电脑（自带电脑除外），各种软件装装装。那作为前端开发者，如何快速进入工作状态呢？下面大致简单介绍下，个人工作习惯不同，仅作参考。

## 1. git项目拉取

### 1.1 安装git

[官网](https://git-scm.com/)下载git。使用默认配置和推荐配置安装git即可，选项勾选“使用 OpenSSL 库”。

### 1.2 git配置

项目文件夹下空白位置右键，选择git bash here。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2df0031cc7ee4588a7c3cd754b822541~tplv-k3u1fbpfcp-watermark.image?)

配置git提交时的用户名和邮件信息。

> git config 

> git config --global user.name “name”     #定义全局的用户名   

> git config --global user.email “xxx@qq.com”  #定义全局的邮件地址    

> git config --list   #查看所有配置信息


### 1.3 生成SSH Key

生成公钥和私钥，实现本地和服务器的认证。C:\Users\xxx\\.ssh 是存放证书的目录。cmd中执行下面的命令：

> $ ssh-keygen -t rsa -C “xxx@qq.com”      

执行完后，C:\Users\xxx\\.ssh证书目录中生成id_rsa、id_rsa.pub两个文件。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7f153089ac44d5c9edd0751f50fc2d8~tplv-k3u1fbpfcp-watermark.image?)

### 1.4 git上添加SSH Key公钥

浏览器打开git的配置页面。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b107d68c994b41548492e93243124785~tplv-k3u1fbpfcp-watermark.image?)

新增ssh key公钥配置。key里内容填 C:\Users\xxx\\.ssh\id_rsa.pub 复制过来的内容。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/017de1f13eda4ef2a1183e1e532d56f6~tplv-k3u1fbpfcp-watermark.image?)

点击添加，公钥配置成功。

![企业微信截图_16359938119844.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90e0e2e683cc4f0fa0c60cbb9a5b25fc~tplv-k3u1fbpfcp-watermark.image?)

### 1.5 git拉取项目

进入到项目目录里，右键git bash here, 执行 clone 命令将项目代码拉到本地：

> git init    // 第一次进执行

> git clone https://git.xxxx.git


### 1.6 报错解决

拉取代码中报错提示 **“The authenticity of host ‘github.com (13.123.234.59)‘ can‘t be established.”**

解决办法：**证书认证没有通过，重新生成SSH Key公钥私钥，并在git上添加公钥。生成公钥过程中一定要注意邮箱地址和git上的邮箱地址一致。**


## 2. 安装nodejs, cnpm

参考页面：https://cloud.tencent.com/developer/article/1649048

### 2.1 安装nodejs

[官网](http://nodejs.cn/download/)安装。一定要注意安装的版本。也可以安装nvm来实现nodejs多版本控制。

```
npm -v  
```

安装成功后可以查看版本号。

### 2.2 修改环境变量

1. 配置npm的全局模块的存放路径以及cache的路径，例如在NodeJs主目录下建立”node_global”及”node_cache”两个文件夹，输入以下命令改变npm配置。

```
npm config set prefix "D:\Software\nodejs\node_global"
npm config set cache "D:\Software\nodejs\node_cache"
```

2. 在系统环境变量添加系统变量NODE_PATH，输入路径D:\Software\nodejs\node_global\node_modules，此后所安装的模块都会安装到该路径下。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09681437040d41e0b5f485fa76291173~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b70ea767828948dbb0536df4758fc55f~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15c5bbec6b8742ac98e3a9277bfb1a23~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbd13efb25a9455aa28d6f2f2de31aee~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/815c39d0e993472891dc2651768dfcff~tplv-k3u1fbpfcp-watermark.image?)

### 2.3 安装cnpm

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

### 2.4 报错解决

**Node Sass does not yet support your current environment: Windows 64-bit问题解决办法
Node Sass version 6.0.0 is incompatible with^4.0.0**

解决办法：**node的版本兼容问题。比如从16的版本降级到14的版本。或者使用nvm切换到低版本。**


## 3. vscode安装

### 3.1 安装vscode

### 3.2 vscode teminal支持git, npm, yarn, cnpm 等命名行操作

个人习惯在vscode terminal中操作所有的命令行。vscode需要配置下才能支持，有以下两种方法，常用第二种：

#### 3.2.1 vscode安装目录中修改：D:\Software\Microsoft VS Code\resources\app\extensions\emmet\test-workspace\.vscode\settings.json，添加下面代码：

```
"#termSinal.integrated.shell.windows#": "C:\\Program Files\\Git\\bin\\bash.exe"
```

#### 3.2.2 命令行修改ExecutionPolicy值。

- 右击VSCode图标，选择以**管理员身份**运行
- 在终端中执行get-ExecutionPolicy，显示Restricted，表示状态是禁止的
- 执行set-ExecutionPolicy RemoteSigned
- 再执行get-ExecutionPolicy，显示RemoteSigned，则表示状态解禁


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/276598a66f304d2e8ebaea160e8f56e2~tplv-k3u1fbpfcp-watermark.image?)


### 3.3 安装插件

参考这篇文章：[VScode中常用插件集合](https://juejin.cn/post/6844904068427546638)


### 3.4 报错解决

#### 3.4.1 vs终端执行命令时报 operation not permitted

将vscode以管理员身份打开。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/282b40f9c1e6479abbe7b7db72d389ac~tplv-k3u1fbpfcp-watermark.image?)


#### 3.4.2 vs终端执行cnpm命令，打开cnpm文件

解决办法：**环境变量中删除cnpm_path相关的配置项。**


## 4. 配置数据库

### 4.1 安装navicate, mysql软件

### 4.2 启动mysql服务

### 4.3 连接数据库


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6610ec503fc0449aa8311b999e39bd78~tplv-k3u1fbpfcp-watermark.image?)

### 4.4 报错解决

#### 4.4.1 2003报错

重新启动mysql服务。

#### 4.4.2 mysql非内部命令

设置环境变量。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ddb22be9d8c49cd82f0c0aa526c1a5f~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aacacd3519ff4ba180ee840735676a5f~tplv-k3u1fbpfcp-watermark.image?)

#### 4.4.3 2059报错

出现2059这个错误的原因是在mysql8之前的版本中加密规则为mysql_native_password，而在mysql8以后的加密规则为caching_sha2_password。可以将mysql用户登录的加密规则修改为mysql_native_password。

执行下面的命令：

```
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

password填数据库连接的密码。