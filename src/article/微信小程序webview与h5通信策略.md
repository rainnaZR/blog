官方介绍：https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html

最近跟小程序对接，遇到一些通信问题，现总结如下：

### 1. 小程序webview传递数据到h5页面

根据官方文档介绍，如果h5页面想要获取小程序内的信息，比如地理位置等信息。需要通过在webview里给h5链接添加参数实现。

h5页面在链接上截取小程序添加的参数，获得值。但是也要注意url的长度，不能无节制的在h5链接上添加参数。

```
/**
 * 获取URL参数
 */
function getQueryString() {
    const search = window.location.search.substring(1);
    const param = {};
    const arr = search.split('&');

    for (let i = 0; i < arr.length; i++) {
        const item = arr[i].split('=');
        param[item[0]] = decodeURIComponent(item[1]);
    }

    return param;
}
```


### 2. h5页面传递数据到小程序接收

查了下，小程序内在webview上监听bindmessage事件，h5页面触发postMessage方法来传递参数。页面脚本如下：

```
<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>


wx.miniProgram.postMessage({
    data
});
```

>网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }，data是多次 postMessage 的参数组成的数组。

