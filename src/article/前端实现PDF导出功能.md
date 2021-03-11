基于Vue框架开发，前端实现PDF文件导出功能，有多种实现方案，现大概介绍下如何使用html2canvas + jspdf来实现。

## 需求简介

点击“导出按钮”，导出并下载指定内容的PDF文件。

## 需求分析

调研了下，决定采用html2canvas + jspdf插件来实现，大致原理是使用html2canvas将dom内容截图生成为图片格式，然后使用jspdf插件将图片转换成pdf格式。

## 代码实现

### 1. 定义需要生成PDF文件的模板内容

因为项目是基于Vue开发，所以生成PDF文件的模板内容基于vue语法就行，只要最终能拿到节点就可以。例如 export.vue：


```
<template>
  <div class="m-export">
    <div class="logo">
      <img crossOrigin="Anonymous" :src="getPath(logoPath)" />
    </div>
    <div class="f-tac f-fw0">{{ customerName }}</div>
    <div class="date s-fc3">{{ currDate }}</div>
  </div>
</template>

<script>
export default {
  props: ['logoPath', 'customerName', 'currDate']
  methods: {
    getPath(url) {
      let str = Date.now();
      return url.indexOf('?') > -1 ? `${url}&v=${str}` : `${url}?v=${str}`;
    }
  }
};
</script>

<style lang="less" scoped>
.m-export {
  position: fixed;
  left: 99999px;
  top: 99999px;
  width: 1000px;
  min-height: 1000px;
}
</style>
```

### 2. 调用生成PDF文件的方法

模板定义好后，此时点击导出按钮，执行导出逻辑。此处用了定时器，是因为调用pdf生成方法前需要保证模板内容渲染完成，节点内容如果没渲染好会导致生成的pdf内容缺失。

```
import { getPdf } from '@/config/htmlToPdf';

setTimeout(() => {
  getPdf({
    element: this.$refs.export.$el,  // pdf模板节点：上面第一步中的模板内容节点
    title: '文件导出',  // pdf文件名
    isFullPage: true,   // pdf尺寸：true为不分页的长文件，false为A4分页的文件
    canvasOptions: {
      width: 1000   // 画布尺寸
    }
  })
}, 500);
```

### 3. 核心getPdf() 方法定义

首先安装html2canvas插件和jspdf插件。如果包拉不下来，可使用脚本外链的方式引用。此处jspdf最新5.1.3的包通过yarn下载失败，先通过脚本的方式加载，注意外链脚本最好放在本地cdn上，避免因为网络问题或其他原因导致脚本加载失败。

html2Canvas参数选项中allowTaint: true和useCORS: true选项，二者互斥。当定义了allowTaint: true后，跨域的不安全的图会被加载，但是出于安全性的考虑，html2Canvas内部很多方法会被禁用，比如toDataURL()；当定义了useCORS: true选项后，图片响应头里需要加上允许跨域的参数，客户端图片img标签里也需要加上crossOrigin="Anonymous"，允许被跨域加载。

大致代码如下：
```
import html2Canvas from 'html2canvas';

const appendJs = () => {
  let script = document.createElement('script');
  script.src = 'https://unpkg.com/jspdf@1.5.3/dist/jspdf.min.js';
  let node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(script, node);
};
appendJs();

const getPdf = ({ element, title, isFullPage, canvasOptions = {} }) => {
  return new Promise((resolve, reject) => {
    // 定义canvas画布的属性，避免生成的pdf文件尺寸不统一
    let { scale = 2, width, height } = canvasOptions;
    width = width || element.clientWidth;
    height = height || element.clientHeight;
    element.ownerDocument.defaultView.devicePixelRatio = scale;
    element.ownerDocument.defaultView.innerWidth = width;
    element.ownerDocument.defaultView.innerHeigth = height;
    
    html2Canvas(element, {
      // allowTaint: true,
      useCORS: true,
      scale,
      width,
      height
    })
      .then(function(canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let PDF;
        let imgWidth;
        let imgHeight;

        if (isFullPage) {
          // 全屏长图
          imgWidth = (contentWidth / scale) * 0.75;
          imgHeight = (contentHeight / scale) * 0.75;
          PDF = new jsPDF('', 'pt', [imgWidth, imgHeight]);  // [imgWidth, imgHeight] 为PDF宽高
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else { 
          // A4纸截图
          imgWidth = 595;
          imgHeight = (imgWidth / contentWidth) * contentHeight;
          let position = 0;
          let pageHeight = (contentWidth / imgWidth) * 842; // A4一页的高度
          PDF = new jsPDF('', 'pt', 'a4');
          if (contentHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
          } else {
            while (contentHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
              contentHeight -= pageHeight;
              position -= 842;
              if (contentHeight > 0) {
                PDF.addPage();
              }
            }
          }
        }
        PDF.save(title + '.pdf');  // 保存pdf文件
        resolve();
      })
      .catch(err => reject(err));
  });
};

export { getPdf };
```

## 踩坑总结

### 1. pdf文件中，内容较少时宽度会被截断

解决办法：在模板样式中定义最小高度，把容器撑开。

```
.m-export {
  width: 1000px;
  min-height: 1000px;
}
```

### 2. pdf中图片不显示，报跨域问题

测试时发现图片会报跨域问题，如果使用跨域的资源画到canvas中，并且资源没有使用CORS去请求，canvas会被认为是被污染了, canvas可以正常展示，但是没办法使用toDataURL()或者toBlob()导出数据。

图片已经通过img标签加载过，浏览器默认会缓存下来，下次再请求会直接返回缓存的图片，如果缓存中的图片不是通过CORS请求或者响应头中不存在Access-Control-Allow-Origin，都会导致报错。

解决办法：
- 生成PDF文件时，可在图片链接后加时间戳加载，避免使用本地缓存。
- 通过在img标签设置crossOrigin="Anonymous"，在CORS请求时不会发送认证信息。
- 在启用CORS请求跨域资源时，服务端资源必须允许跨域，才能正常返回，所以还需要在服务端设置允许跨域的响应头Access-Control-Allow-Origin等。

### 3. pdf尺寸不统一

设置pdf的尺寸。

```
element.ownerDocument.defaultView.devicePixelRatio = scale;
element.ownerDocument.defaultView.innerWidth = width;
element.ownerDocument.defaultView.innerHeigth = height;
```

### 4. 不可见元素的导出

意思是pdf文件的内容在页面是不可见的，静默导出。这种情况下，可以使用固定或绝对定位显示页面元素，注意不能使用display:none。

```
.m-export {
  position: fixed;
  left: 99999px;
  top: 99999px;
}
```
