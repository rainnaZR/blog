React的核心机制之一就是可以在内存中创建虚拟的DOM元素。React利用虚拟DOM来减少对实际DOM的操作从而提升性能。 

### JSX简介

JSX就是Javascript和XML结合的一种格式。React发明了JSX，利用HTML语法来创建虚拟DOM。当遇到<，JSX就当HTML解析，遇到{就当JavaScript解析。

如下(JS写法)

```javascript
var child1 = React.createElement('li', null, 'First Text Content');
var child2 = React.createElement('li', null, 'Second Text Content');
var root = React.createElement('ul', { className: 'my-list' }, child1, child2);
```

等价于(JSX写法)

```javascript
var root =(
  <ul className="my-list">
    <li>First Text Content</li>
    <li>Second Text Content</li>
  </ul>
);
```

后者将XML语法直接加入JS中,通过代码而非模板来高效的定义界面。之后JSX通过翻译器转换为纯JS再由浏览器执行。在实际开发中，JSX在产品打包阶段都已经编译成纯JavaScript，JSX的语法不会带来任何性能影响。另外，由于JSX只是一种语法，因此JavaScript的关键字class, for等也不能出现在XML中，而要如例子中所示，使用className, htmlFor代替，这和原生DOM在JavaScript中的创建也是一致的。JSX只是创建虚拟DOM的一种语法格式而已,除了用JSX,我们也可以用JS代码来创建虚拟DOM.

 

### JSX语法介绍

大括号里是JavaScript，不要加引号，加引号就会被当成字符串。

#### 三元表达式

JSX本身就和XML语法类似，可以定义属性以及子元素。唯一特殊的是可以用大括号来加入JavaScript表达式.例如:

var person = <Person name={window.isLoggedIn ? window.name : ''} />;
上述代码经过JSX编译后会得到：

var person = React.createElement(
  Person,
  {name: window.isLoggedIn ? window.name : ''}
);

#### 数组递归

数组循环,数组的每个元素都返回一个React组件。

```javascript
var lis = this.todoList.todos.map(function (todo) {
  return  (
    <li>
      <input type="checkbox" checked={todo.done}>
      <span className={'done-' + todo.done}>{todo.text}</span>
    </li>
  );
});

var ul = (
  <ul className="unstyled">
    {lis}
  </ul>
);
```
 

#### JSX中绑定事件

JSX让事件直接绑定在元素上。

```javascript
<button onClick={this.checkAndSubmit.bind(this)}>Submit</button>
```
和原生HTML定义事件的唯一区别就是JSX采用驼峰写法来描述事件名称，大括号中仍然是标准的JavaScript表达式，返回一个事件处理函数。

React并不会真正的绑定事件到每一个具体的元素上，而是采用事件代理的模式：在根节点document上为每种事件添加唯一的Listener，然后通过事件的target找到真实的触发元素。这样从触发元素到顶层节点之间的所有节点如果有绑定这个事件，React都会触发对应的事件处理函数。这就是所谓的React模拟事件系统。尽管整个事件系统由React管理，但是其API和使用方法与原生事件一致。

 

#### JSX中使用样式

在JSX中使用样式和真实的样式也很类似，通过style属性来定义，但和真实DOM不同的是，属性值不能是字符串而必须为对象。

例如:
```javascript
<div style={{color: '#ff0000', fontSize: '14px'}}>Hello World.</div>
```
或者

```javascript
var style = {
  color: '#ff0000',
  fontSize: '14px'
};

var node = <div style={style}>HelloWorld.</div>;
```

要明确记住,{}里面是JS代码,这里传进去的是标准的JS对象。在JSX中可以使用所有的的样式，基本上属性名的转换规范就是将其写成驼峰写法，例如“background-color”变为“backgroundColor”, “font-size”变为“fontSize”，这和标准的JavaScript操作DOM样式的API是一致的。

 

#### HTML转义

在组件内部添加html代码,并将html代码渲染到页面上。React默认会进行HTML的转义，避免XSS攻击，如果要不转义，可以这么写：

```javascript
var content='<strong>content</strong>';    

React.render(
    <div dangerouslySetInnerHTML={{__html: content}}></div>,
    document.body
);
```


#### 自定义组件

组件定义之后，可以利用XML语法去声明，而能够使用的XML Tag就是在当前JavaScript上下文的变量名,该变量名就是组件名称。

 

文章来源:
http://www.infoq.com/cn/articles/react-jsx-and-component