# vue使用html2canvas踩坑总结


# 需求场景

运营后台上传一张图，同时页面生成小程序二维码，与运营上传的图合成一张大图，用于该页面在朋友圈的分享传播。

# 实现思路

## 1. 背景图上传

背景图上传，调用接口实现文件上传到oss平台，生成背景图链接。

## 2. 生成页面的小程序二维码

调用小程序二维码生成接口，生成该页面的二维码。详情参考小程序官方文档：[https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.createQRCode.html](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.createQRCode.html)。调用时注意参数长度有限制，如果参数过长会导致二维码生成失败。我们采用的做法是跟小程序约定一套url映射规则，通过特定的参数来匹配对应的h5页面。

## 3. 编写截图的html代码

将需要生成截图的html代码编写完整，其中包括背景图（运营上传的背景图），页面小程序二维码等其他元素。

## 4. 调用html2canvas实现截图

网上搜索了下，使用html2canvas插件可以实现截图功能，代码如下：

```
// index.js
import html2canvas from 'html2canvas';

html2canvas(this.$refs.shareImgElem, {
  useCORS: true,
  backgroundColor: null
})
.then(canvas => {
  const dataUrl = canvas.toDataURL('images/jpg');
  // 第一步：将dataUrl转换成Blob
  const blob = this.base64ToBlob(dataUrl);
  // 第二步：上传分享图
  this.uploadShareImg(blob);
})
```

```
// index.vue
// 需要截图的html代码
<div ref="shareImgElem">....</div>
// 截图图片的链接
<img :src="imgUrl" />
```


此时以为将dataUrl保存下来，就可以完美解决这个需求了。然而事实大跌眼镜，截图生成的base64位的图是白屏的。网上也查询了html2canvas的用法，确定调用方法没有写错，但是截出来的图就是空白的。后来查原因，从最简单的demo开始写起，终于发现了白屏的原因，现总结如下。

## 5. 截图白屏问题总结

### 5.1 图片跨域问题

截屏的代码里如果包含图片，图片需要设置允许跨域访问，否则js是读不到图片信息的。如果图片是放在cdn上，cdn需要设置cors相关设置，也就是图片请求的响应头里需要设置Access-Control-Allow-Origin: *

![图片]($resource/%E5%9B%BE%E7%89%87.png)
我们公司的图片是上传到阿里oss平台，oss里bucket设置跨域信息是控制图片上传时的域名来源的。而我们是需要设置图片读取时能跨域，图片是存放在cdn上，所以联系运维在cdn配置里加上跨域信息即可。

### 5.2 截图元素在屏幕可见范围内

图片请求的响应头里加上跨域信息后，截图看还是白屏，接着继续找原因，最后发现当截屏元素在首屏可见范围内就可以生成正确的截图。原来是在截图生成过程中，如果鼠标在滚动，生成出来的截图在canvas画布上会有偏移。解决这个问题有两个操作：

#### 1. 将截图元素提前，放在页面顶部，在屏幕范围之内。

#### 2. 截图生成过程中，页面禁用滚动。代码如下：

```
dom.setScrollTop(0);  // 先滚动到最顶部
document.documentElement.style.position = 'fixed';
```

#### 3. 截图生成完成后，页面恢复滚动，代码如下：

```
document.documentElement.style.position = '';
```

这时终于截图展示出来了。但是此时截图是base64编码的，这么大一串字符，存到后台不大合适，此时考虑将base64字符转换成blob二进制数据流，上传到oss。

## 6. 上传截图

### 6.1 将base64编码的字符转换成blob二进制数据对象。

转换代码如下：

```
// base64转换成blob数据
base64ToBlob(dataUrl, type) {
    var arr = dataUrl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1] || type;
    // 去掉url的头，并转化为byte
    var bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: mime
    });
}
```


### 6.2 将blob二进制数据流上传到oss平台

代码如下：

```
// 上传Blob二进制数据
uploadBlob(fileName, blob) {
    return new Promise((resolve, reject) => {
        async function putBlob() {
            try {
                let result = await ossClient.put(fileName, blob);
                result.imgUrl = `${CDN_IMAGE_DOMAIN}/${result.name}`;
                resolve(result);
            } catch (e) {
                reject(e);
            }
        }
        putBlob();
    });
}
```

```
// 上传分享大图
uploadShareImg(blob) {
    const fileName = `web/activityms/share_big_img_${Date.parse(new Date())}.jpg`;
    this
        .uploadBlob(fileName, blob)
        .then(res => {
            this.imgUrl = res.imgUrl;
            this.$message.success('朋友圈分享大图上传成功！');
        });
}
```

到此，截图生成成功，且成功上传到oss平台，并返回图片路径。