《ES6标准入门》阅读总结

# 第十一章 二进制数组

### 1. 概述

WebGL，就是浏览器与显卡之间的通信接口，为了满足JS与显卡之间大量，实时的数据交换，它们之间的数据通信必须是二进制，而不能是文本形式。

二进制数组大大增强JS处理二进制数据的能力，使开发者可能通过JS与操作系统的原生接口进行二进制通信。**二进制数组包括3类对象：**

1）ArrayBuffer对象：内存中的一段二进制数据。

2）TypedArray视图。

3）DataView视图：自定义复合格式的视图。


ArrayBuffer代表原始的二进制数据，TypedArray视图用于读/写简单类型的二进制数据，DataView视图用于读/写复杂类型的二进制数据。

**浏览器操作的API用到了二进制数组操作二进制数据：**

1）File API

2）XMLHttpRequest

3）Fetch API

4）Canvas

5）WebSocket


### 2. ArrayBuffer对象

ArrayBuffer对象代表存储二进制数据的一段内存。不能直接读写，只能通过视图（TypedArray视图和DataView视图）读写。原始内存的ArrayBuffer对象默认所有位都是0。ArrayBuffer构造函数的参数是指所需内存的大小，单位是字节。

```
//生成32字节的内存，为了读取内存，给内存指定DataView视图，然后以不带符号的8位整数格式读取第一个元素，输出结果0
var buf = new ArrayBuffer(32);
var dataView = new DataView(buf);

dataView.getUint8(0);
//输出0
```

1）ArrayBuffer.prototype.byteLength

返回所分配的内存区域的字节长度。

2）ArrayBuffer.prototype.slice()

该方法将内存区域的一部分复制生成一个新的ArrayBuffer对象。除了slice方法，ArrayBuffer对象不提供任何直接读取内存的写法，只能通过建立视图来读写。

```
var buffer = new ArrayBuffer(8);
var newBuffer = buffer.slice(0, 3);
```

3）ArrayBuffer.isView(arg)

静态方法isView用来判断arg参数是否是ArrayBuffer的视图实例，也就是TypedArray实例和DataView实例。

### 3. TypedArray 视图

同一段内存，不同数据有不同的解读方式，就叫“视图”。TypedArray数组只是视图，本身不存储数据，数据都存储在底层的ArrayBuffer中。TypedArray里的数组成员都是同一组数据类型。

**TypedArray提供的9种类型：**

1）Int8Array: 8位有符号整数，1个字节。

2）Uint8Array: 8位无符号整数，1个字节。

3）Uint8ClampedArray: 8位无符号整数。溢出处理不同，1个字节。

4）Int16Array: 16位有符号整数，2个字节。

5）Uint16Array: 16位无符号整数，2个字节。

6）Int32Array: 32位有符号整数，4个字节。

7）Uint32Array: 32位无符号整数，4个字节。

8）Float32Array: 32位浮点数，4个字节。

9）Float64Array: 64位浮点数，8个字节。


**TypedArray(length)**

视图可以直接通过分配内存生成，length指数组成员的个数。

```
var b = new Float64Array(8);  //生成一个包含8个成员的Float64Array数组。参数8指个数，总共生成64个字节的内存。
```

```
var buffer = new ArrayBuffer(32);  //分配32字节的内存
var newBuf = new Float64Array(buffer);  //建立64位浮点数的视图，每个64位占8个字节，所以总共可以写入32/8 = 4个字符

newBuf  //[0, 0, 0, 0]
```

**TypedArray.prototype.byteLength，TypedArray.prototye.byteOffset，TypedArray.prototye.length**


TypedArray.prototype.byteLength返回TypedArray数组占据的内存长度，单位为字节。
TypedArray.prototye.length表示TypedArray数组有多少个成员，指数组的长度。


```
var b = new ArrayBuffer(32);
var v1 = new Int8Array(b);
var v2 = new Float32Array(b, 8);
var v3 = new Int16Array(b, 2, 2);

v1.byteLength;  //32，依然是32个字节
v1.length;  //32，Int8Array占1个字节，总字节数是32，所以共有32个成员

v2.byteLength;    //24，从第8个字节开始算，32-8=24，返回24个字节
v2.length;  //6，Float32Array每个成员占4个字节，总字节数24，所以成员总数是24/4=6

v3.byteLength;   //4，从第2个字节开始算，长度为2个字节，所以总字节是2+2=4
v3.length;  //2，Int16Array每个成员是2个字节，所以数组成员总数是4/2=2
```

### 4. 复合视图

视图的构造函数可以指定起始位置和长度，所以在同一段内存中存放不同类型的数据，叫复合视图。

```
var buffer = new ArrayBuffer(32);

var idView = new Uint32Array(buffer, 0, 3);  //最后一个参数3表示数组的长度
//idView.byteLength  12
//idView.length   3
var nameView = new Float32Array(buffer, 12, 4);
//nameView.byteLength  4
//nameView.length   16
```

### 5. DataView视图

DataView视图可以用于处理网络设备传来的数据，所以大端字节序和小端字节序可以自行设定。

**DataView实例提供8个方法读取内存：**

1）getInt8: 读取1个字节，返回一个8位整数。

2）getUint8: 读取1个字节，返回一个无符号的8位整数。

3）getInt16: 读取2个字节，返回一个16位整数。

4）getUint16: 读取2个字节，返回一个无符号的16位整数。

5）getInt32: 读取4个字节，返回一个32位整数。

6）getUint32: 读取4个字节，返回一个无符号的32位整数。

7）getFloat32: 读取4个字节，返回一个32位浮点数。

8）getFloat64: 读取8个字节，返回一个64位浮点数。


```
var buffer = new BufferArray(32);
var dv = new DataView(buffer);

//从第一个字节读取一个8位无符号整数
var v1 = dv.getUint8(0)
```

除了get方法外，还有set方法用于设值：第一个参数是索引值，表示从第几个字节开始写入；第二个参数表示写入的数据；第三个参数表示是否用小端字节序写入。

### 6. 二进制数组的运用

**Ajax**

如果明确知道接口返回的是二进制数据，可以把返回类型responseType设置为arraybuffer，如果不知道，设置为blob。

```
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'arraybuffer';  //定义响应的数据类型

xhr.onload = function(){
	let buffer = xhr.response;
	....
};
xhr.send();
```

**Canvas**

网页Canvas元素输出的二进制像素数据就是TypedArray数据。

**WebSocket**

WebSocket可以通过ArrayBuffer发送或接收二进制数据。

```
var socket = new WebSocket('ws://127.0.0.1:3333');
socket.binaryType = 'arraybuffer';

//Wait until socket is open
socket.addEventListener('open', function(){
    var typedArray = new Unit8Array(4);
    socket.send(typedArray.buffer);
});

//Receive Data
socket.addEventListener('message', function(event){
    var arrayBuffer = event.data;
    ...
})
```

**Fetch API**

Fetch API取回的数据就是ArrayBuffer对象。

**File API**

如果知道一个文件的二进制数据类型，可以将这个文件读取为ArrayBuffer对象。





