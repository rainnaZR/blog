此文章来源：
http://ju.outofmemory.cn/entry/300329
https://github.com/Unitech/pm2/issues/2057

## 问题场景

公司运维清理机器磁盘，将项目部署的代码暴力的全删了。这个时候每个前端项目都需要重新部署，当部署node服务时，发现启动失败。

## 解决思路

### 1. 使用pm2查看日志

```
pm2 list

pm2 logs
```

发现node服务重启失败，报错日志如下：

```
path.js:1144
          cwd = process.cwd();
                        ^

Error: ENOENT: no such file or directory, uv_cwd
    at Error (native)
    at Object.resolve (path.js:1144:25)
    at Function.Module._resolveLookupPaths (module.js:361:17)
    at Function.Module._resolveFilename (module.js:431:31)
    at Function.Module._load (module.js:388:25)
    at Module.require (module.js:468:17)
    at require (internal/module.js:20:19)
    at Object. (/usr/lib/node_modules/pm2/lib/ProcessContainer.js:12:15)
    at Module._compile (module.js:541:32)
```

### 2. 根据报错信息查资料

网上查资料，发现这个报错的原因是pm2的启动目录被删除了（删除后重建同名目录也是无效的）。

> 什么叫最早启动的目录呢？就是在命令行下第一次执行pm2时所在的目录，比如新装系统，在 /home/deploy 下第一次执行 pm2命令，那么 /home/deploy 就是最早启动的目录。

> 再比如杀掉 pm2 进程后，再次在某个目录下执行了 pm2 命令，那这个目录也是最早启动的目录。

### 3. 验证 pm2 的启动目录是否被删除

> pm2 issues-2057中也有人指出了验证方法，如下：

#### 第一步：先找到pm2的进程pid:

```
ps ax | grep PM2
```

#### 第二步：查询该进程执行时所在的目录(用上一步得到的pid替换下面命令的PM2_PID)

```
ls -l /proc/PM2_PID/cwd
```

#### 比如：

```
$ ls -l /proc/24016/cwd
lrwxrwxrwx 1 root root 0 Feb 4 17:04 /proc/24016/cwd -> /home/nodejs/deploy(deleted)

```

上面显示的目录已经被删除过。


### 4. 新建 pm2 的启动目录

#### 第一步：用pm2 kill命令杀掉pm2进程

```
pm2 kill
```

#### 第二步：重启pm2

cd ~ 到home目录，执行 pm2 -v 命令

```
cd ~
pm2 -v
```

#### 第三步：重新部署node服务







