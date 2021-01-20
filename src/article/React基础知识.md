学习文档(按优先级排列)
http://reactjs.cn/react/docs/tutorial-zh-CN.html
http://www.cnblogs.com/Mrs-cc/p/4969755.html (es5与es6的兼容性写法)

 

#### React.createClass()

我们在一个 JavaScript 对象中传递一些方法到 React.createClass() 来创建一个新的React组件。这些方法中最重要的是 render，该方法返回一颗 React 组件树，并不是实际的HTML,这棵组件树最终将会渲染成 HTML。

 

#### ReactDOM.render()

ReactDOM.render() 实例化根组件，启动框架，注入标记到原始的 DOM 元素中，作为第二个参数提供。
ReactDOM 模块暴露了 DOM 相关的方法， 而 React 保有被不同平台的 React 共享的核心工具 （例如 React Native）。

 

#### this.props

在 JSX 中,通过将 JavaScript 表达式放在大括号中（作为属性或者子节点）,你可以把文本或者 React 组件放置到树中。我们以 this.props 的 keys 访问传递给组件的命名属性，以 this.props.children 访问任何嵌套的元素。
props 是不可变的：它们从父级传来并被父级“拥有”。

 

#### this.props.data.map()

var names = ['Alice', 'Emily', 'Kate'];
names.map(function (name) {
    return <div>Hello, {name}!</div>
})

#### this.state

为了实现交互，我们给组件引进了可变的 state。state 仅仅是为互动性，也就是随时间变化的数据所预留的。this.state 是组件私有的，可以通过调用 this.setState() 改变它。每当state更新，组件就重新渲染自己。

 

#### getInitialState()

getInitialState() 在生命周期里只执行一次，并设置组件的初始状态。

//es5
getInitialState: function(){
    return {liked: false};
}
//es6
constructor(props){
    super(props);
    this.state = {liked: false};
}

#### this.setState()

设置组件内部state的值。动态更新的关键是对this.setState()的调用。

 

#### componentDidMount()

componentDidMount()是一个当组件被渲染时被React自动调用的方法。