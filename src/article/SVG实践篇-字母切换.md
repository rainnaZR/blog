git: https://github.com/rainnaZR/svg-animations/tree/master/src/pages/step2/letter.change

## 说明

这个页面实现了两个动画。


### 字母切换

字母切换的方式通过修改 stroke-dasharray 的值来实现动画。是从无到有的动画。

css 代码如下:

```
.txt{
    stroke:#FFEB3B;
    stroke-width:2px;
    -webkit-animation:animate1 3s ease-in-out forwards;
}
        
@keyframes animate1{
    0%{
        stroke-dasharray:0% 30%;
    }
    80%{
        stroke-dasharray:50% 0%;
        fill:#E91E63;
    }
    100%{
        stroke-dasharray:50% 0%;
        fill:#FFEB3B;
    }
}
```

html 代码如下:
```
<svg version="1.2" xml:space="default">
    <symbol id="letter">
        <text x="38%" y="50%">A</text>
    </symbol>

    <g>
        <use xlink:href="#letter" class="txt"></use>
    </g>
</svg>
```


### 数字切换

数字切换的方式是通过修改 path 路径来实现动画。是直接修改 path 的路径。

css 代码如下:
```
.path{
    -webkit-animation:animation2 10s ease-in-out infinite;
}
        
@keyframes animation2 {
    0%,
    7% {
        d: path('M0,100 L50,100 L50,50 L50,0 L0,0 L0,50 L50,50')
    }
    11%,
    17% {
        d: path('M0,0 L50,0 L50,100 L0,100 L0,0 L0,50 L50,50')
    }
    21%,
    27% {
        d: path('M0,0 L50,0 L50,20 L50,40 L50,60 L50,80 L50,100')
    }
    31%,
    37% {
        d: path('M50,0 L0,0 L0,50 L0,100 L50,100, L50,50 L0,50')
    }
    41%,
    47% {
        d: path('M50,0 L0,0 L0,50 L25,50 L50,50 L50,100 L0,100')
    }
    51%,
    57% {
        d: path('M0,0 L0,50 L50,50 L50,0 L50,35 L50,70 L50,100')
    }
    61%,
    67% {
        d: path('M0,0 L50,0 L50,100 L0,100 L50,100 L50,50 L0,50')
    }
    71%,
    77% {
        d: path('M0,0 L50,0 L50,50 L25,50 L0,50 L0,100 L50,100')
    }
    81%,
    87% {
        d: path('M50,0 L50,15 L50,30 L50,45 L50,60 L50,75 L50,100')
    }
    91%,
    96% {
        d: path('M0,0 L50,0 L50,50 L50,100 L0,100 L0,25 L0,0')
    }
}
```

html 代码如下:

```
<svg version="1.2" xml:space="default">
    <path class="path" fill="none" stroke="#FFEB3B" stroke-width="2px" d="M0,0 L50,0 L50,50 L50,100 L0,100 L0,25 L0,0"></path>
</svg>
```