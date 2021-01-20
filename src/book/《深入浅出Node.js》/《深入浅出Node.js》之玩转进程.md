《深入浅出Node.js》读书总结

# 玩转进程

### 1. 服务模型的变迁

同步->复制进程->多线程->事件驱动


### 2. 多进程架构

启动多进程，每个进程各自利用一个CPU，以实现多核CPU的利用。Node提供了child_process模块，并提供了child_process.fork()函数实现进程的复制。

HTML5提供WebWorker创建工作线程并在后台运行，使得阻塞较为严重的计算不影响主线程UI的渲染。在浏览器端，JS主线程与UI渲染共用同一个线程。长时间执行JS会造成UI停顿不响应。

```
var worker = new Worker('worker.js');
worker.onmessage = function(event){
    document.getElementById('result').textContent = event.data;
};
```

主线程与工作线程通过onmessage()和postMessage()进行通信。

创建子进程，进程间通过IPC通道实现通信，利用句柄在进程间发送和还原，端口共用。

### 3. 集群稳定之路

除了message事件外，Node还有如下事件：error, exit, close, disconnect等。

**如何实现进程的平滑重启：**

一旦有异常出现，主进程就会创建新的工作线程来为用户服务，旧的进程一旦处理完已有链接就会自动断开。创建新工作进程在前，退出异常在后。

**如何实现负载均衡：**

保证多个处理单元工作量公平的策略叫负载均衡。Node默认的机制是采用操作系统的抢占式策略，在一堆工作进程中，闲着的进程对到来的请求进行争抢，谁抢到谁服务。Node采用轮叫调度的策略来使负载均衡更合理，轮叫调度的工作方式是由主进程接受连接，将其依次分发给工作进程。

**如何实现状态共享：**

通过第三方来进行数据存储。使用定时轮询和主动通知两种方式实现数据更新时通知子进程的策略。进程在启动时从通知服务处获取数据，并且将进程信息注册到通知服务处。一旦通过轮询发现有数据更新，根据注册信息将更新后的数据发送给对应的工作进程。


### 4. Cluster模块

Node引入Cluster模块解决多核CPU利用率问题。在进程中判断是主进程还是工作进程，取决于环境变量中是否有NODE_UNIQUE_ID。

```
cluster.isWorker = ('NODE_UNIQUE_ID' in process.env);
cluster.isMaster = (cluster.isWorker === false);
```

cluster启动时，会在内部启动TCP服务器，在cluster.fork()子进程时，将这个TCP服务器端socket的文件描述符发送给工作进程。如果进程是cluster.fork()复制出来的，那么它的环境变量里就有NODE_UNIQUE_ID，如果工作进程中存在listen()侦听网络端口的调用，它将拿到该文件描述符，通过SO_REUSEADDR端口重用，从而实现多个子进程共享端口。



