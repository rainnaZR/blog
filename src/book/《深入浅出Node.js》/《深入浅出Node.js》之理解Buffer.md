《深入浅出Node.js》读书总结

## 理解Buffer

JS对于字符串的操作很友好，无论是宽字节字符串还是单字节字符串，都被认为是一个字符串。

在Node中，应用需要处理网络协议，操作数据库，处理图片，接收上传文件等，在网络流和文件的操作中，还要处理大量的二进制数据，Buffer就是处理二进制数据的。

### 1. Buffer结构

Buffer是一个像Array的对象，主要用于操作字节。Buffer性能相关的部分用C++实现，非性能相关的部分用JS实现。Node在进程启动时就已加载了Buffer，并将其挂在全局对象上，无须通过require()就可以直接引用。

Buffer跟Array类似，对象的元素为16进制的两位数，即0到255的数值。

```
var str = '深入浅出Node.js';
var buf = new Buffer(str,'utf-8');
console.log(buf)

<Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 4e 6f 64 65 2e 6a 73>
```

给Buffer元素赋值，如果值小于0，就将该值逐次加256，直到得到一个在0到255区间的整数。如果值大于255，就逐次减去256，直到得到一个在0~255区间的整数。如果值是小数，则舍弃小数部分，保留整数。

Buffer对象的内存是在C++层面申请的，不是通过V8堆内存分配的。是在C++层面申请内存，JS中分配内存的策略。

**那如何高效的使用内存呢?**

Node采用slab分配机制。slab就是一块申请好的固定大小的内存区域。slab有以下三种状态：
full: 完全分配状态。
partial: 部分分配状态。
empty: 没有被分配状态。

```
new Buffer(size)  //分配指定大小的Buffer对象
```

真正的内存是在Node的C++层面提供的，JS层面只是使用它。当进行小而频繁的Buffer操作时，采用slab的机制进行预先申请和事后分配，对于大块的Buffer而言，直接使用C++层面提供的内存，无需内存的分配操作。

### 2. Buffer的转换

Buffer对象可以与字符串之间相互转换，支持的字符串编码类型有：ASCII，UTI-8,UTI-16LE/USC-2, Base64, Binary, Hex

1）字符串转Buffer

```
new Buffer(str, [encoding||UTF-8])
```

2）Buffer转字符串

使用Buffer对象的toString()方法。

```
buf.toString([encoding], [start], [end]);
```

```
Buffer.isEncoding(encoding);  //判断是否支持该编码
```


### 3. Buffer的拼接

以UTF-8为编码，中文字占3个字节。如果对Buffer的长度设了限制，则可能出现宽字节字符串被截断的情况，被截断的字节会用乱码显示。使用setEncoding()和string_decoder()方法可以解决此问题。

```
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

var buf1 = new Buffer([oxE5, oxBA, ox8A...]);
console.log(decoder.write(buf1));
```

**如何正确拼接Buffer?**

正确的拼接方式是用一个数组来存储接收到的所有Buffer片段并记录下所有片段的总长度，然后调用Buffer.concat()方法生成一个合并的Buffer对象。

### 4. Buffer与性能

在应用中，我们一般操作字符串，但是在网络传输中，需要将字符串转换为Buffer，以进行二进制数据传输。提高字符串到Buffer的转换效率，可以提高网络吞吐率。

通过预先转换静态内容为Buffer对象，可以有效的减少CPU的重复利用，节省服务器资源。

文件流读取基于Buffer分配，Buffer基于SlowBuffer分配。如果文件较小（小于8kb）,有可能造成slab未完成使用。

### 5. 总结

Buffer是二进制数据，字符串与Buffer之间存在编码关系。


    

