/**
 * Created by hzzourong on 2016/5/24.
 */
(function(){
    /*
     * 定义参数信息
     * */
    var canvasElement = document.getElementById('canvas');   //canvas节点
    var ctx = canvasElement.getContext('2d');    //定义绘图环境
    var mousePos = [0,0];         //鼠标的初始坐标

    var easingFactor = 5.0;      //缓动因子
    var backgroundColor = '#000';    //画布的背景色，为黑色
    var nodeColor = '#fff';      //节点的颜色，为白色
    var edgeColor = '#fff';      //线条的颜色，为白色

    var nodes = [];
    var edges = [];

    /*
    * 构建Nodes数组--粒子节点
    *
    * 画布上构建100个粒子，利用随机数散步在画布的各个位置,并存在nodes数组里
    * 双重遍历nodes，将粒子与粒子之前用线条连接起来
    * */
    function constructNodes(){
        for(var i=0;i<100;i++){
            var node = {
                drivenByMouse: i==0,
                x: Math.random()*canvasElement.width,
                y: Math.random()*canvasElement.height,
                vx: Math.random()*1 - 0.5,      //??
                vy: Math.random()*1 - 0.5,      //??
                radius: Math.random() > 0.9 ? 3 + Math.random() * 3 : 1 + Math.random() * 3    //概率控制点的半径取值，不断调整这个概率阈值就能获取期待的半径随机分布。
            };
            nodes.push(node);      //定义100个粒子的位置和移动速度等参数信息
        }

        //将每个粒子与其他的粒子连接起来，用数组存储连接线的两个粒子
        nodes.forEach(function(node){
            nodes.forEach(function(otherNode){
                if(node == otherNode){   //自己跟自己不能相连，所以return
                    return;
                }
                var edge = {
                    from: node,
                    to: otherNode
                }
                addEdge(edge);
            })
        })
    }

    /**
     * 构建Edges数组--粒子之间的连接线
     *
     * 用数组存储连接线的两个粒子，去掉重复的连接线
     * */
    function addEdge(edge){
        var ignore = false;
        edges.forEach(function(e){
            if(e.from == edge.from && e.to == edge.to){
                ignore = true;
            }
            if(e.from == edge.to && e.to == edge.from){
                ignore = true;
            }
        });
        if(!ignore) edges.push(edge);
    }

    /**
     * 开始动画
     *
     * 遍历粒子节点，获得粒子节点移动后新的坐标位置
     * 如果节点已经到屏幕边缘了，则改变方向，确保在画布的范围内移动
     * */
    function step(){
        nodes.forEach(function(node){
            if(node.drivenByMouse){
                return;
            }
            node.x += node.vx;
            node.y += node.vy;

            function clamp(min,max,value){
                if(value > max){
                    return max;
                }else if(value < min){
                    return min;
                }else{
                    return value;
                }
            }

            if(node.x <=0 || node.x >= canvasElement.width){
                node.vx *= -1;
                node.x = clamp(0,canvasElement.width,node.x);
            }
            if(node.y <=0 || node.y > canvasElement.height){
                node.vy *= -1;
                node.y = clamp(0,canvasElement.height,node.y);
            }
        });
        adjustNodeDrivenByMouse();
        render();
        window.requestAnimationFrame(step);
    }

    function adjustNodeDrivenByMouse(){
        nodes[0].x += (mousePos[0] - nodes[0].x) / easingFactor;
        nodes[0].y += (mousePos[1] - nodes[0].y) / easingFactor;
    }

    /**
     * 计算两点之间的直线距离
     * 获得初始节点和结束节点的横坐标和纵坐标的位置，求点之间的距离，运用直角三角形求边长
     * */
    function lengthOfEdge(edge){
        return Math.sqrt(Math.pow((edge.from.x - edge.to.x), 2) + Math.pow((edge.from.y - edge.to.y), 2));
    }

    /**
     * 开始绘制，包括粒子和线
     *
     * 遍历edges数组，绘制线条
     * 遍历nodes数组，绘制粒子
     * */
    function render(){
        ctx.fillStyle = backgroundColor;    //填充背景色
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);    //绘制矩形

        edges.forEach(function(e){
            var l = lengthOfEdge(e);
            var threshold = canvasElement.width / 8;
            if (l > threshold) {   //如果连接线太长，也就是两个粒子之间的直线距离太远，则忽略
                return;
            }
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = (1.0 - l / threshold) * 2.5;
            ctx.globalAlpha = 1.0 - l / threshold;
            ctx.beginPath();
            ctx.moveTo(e.from.x, e.from.y);
            ctx.lineTo(e.to.x, e.to.y);
            ctx.stroke();
        });
        ctx.globalAlpha = 1.0;

        nodes.forEach(function (e) {
            if (e.drivenByMouse) {
                return;
            }

            ctx.fillStyle = nodeColor;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    window.onresize = function () {
        canvasElement.width = document.body.clientWidth;
        canvasElement.height = canvasElement.clientHeight;

        if (nodes.length == 0) {
            constructNodes();
        }

        render();
    };

    window.onmousemove = function (e) {
        mousePos[0] = e.clientX;
        mousePos[1] = e.clientY;
    }

    window.onresize();
    window.requestAnimationFrame(step);
}).call(this);
