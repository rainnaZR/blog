《狼书》阅读总结

# 第二章 Node.js安装与入门

## 1. 安装node

### 1.1 nvm

nvm用于开发阶段，解决多版本共存，切换，测试等问题。

node.js版本里一般奇数版本（v5.x,v7.x,v9.x等）都是尝试性的，包含最新的特性。偶数版本（v4.x,v6.x,v8.x等）是LTS版本，非常稳定，适合生产环境使用。

#### 6个nvm中常用的命令：

1. 安装： nvm install
2. 设置系统默认的node.js版本： nvm alias default
3. 切换版本：nvm use
4. 列出当前的本地版本：nvm ls
5. 列出远端可安装版本：nvm ls-remote
6. 一键安装全局模块： nvm reinstall-packages

根目录下创建.nvmrc文件来指定特定的node.js版本。

### 1.2 npm

npm包管理器，管理node.js包，包括安装，卸载，更新，查看，搜索，发布等。

### 1.3 nrm

nrm帮助我们简单，快速的在不同的npm之间进行切换，默认内置了很多源，包括npm,cnpm,taobao,nj等。

常用命令：
1. 查看源：nrm ls
2. 切换源：nrm use cnpm
3. 增加源：nrm add name http://xxx.com

## 2. Hello Node.js

使用commonJs规范，通过module.exports定义模块，通过require关键字引用模块。

## 3. 编辑器与调试

编程有三等境界：第三等是打日志；第二等是断点调试；第一等是测试驱动开发，写测试用例。

1. 打日志：可用console.log,debug模块，Node.js SDK内置util.log等方式。
2. 断点调试：可用node debugger和vscode编辑器。
3. 测试驱动开发：TDD和BDD测试框架使用，比如mocha,jest等。




