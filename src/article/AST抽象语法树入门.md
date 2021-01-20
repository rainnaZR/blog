JS在执行时会被转化成抽象语法树（AST），AST对象文档(https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API#Node_objects)

### 1. 使用recast包拆分成AST树

地址：https://www.npmjs.com/package/recast

**1.1安装recast依赖包**

```
cnpm i recast 
```
In less poetic terms, Recast exposes two essential interfaces, one for parsing JavaScript code (require("recast").parse) and the other for reprinting modified syntax trees (require("recast").print).

**1.2编写demo.js脚本**

```
// 给你一把"螺丝刀"——recast
const recast = require("recast");

// 你的"机器"——一段代码
const code = `function add(a, b){return a+b}`;

// 用螺丝刀解析机器
const ast = recast.parse(code);

// ast可以处理很巨大的代码文件
// 但我们现在只需要代码块的第一个body，即add函数
const add = ast.program.body[0]

console.log(add)
```

会打印出一下内容：

```
FunctionDeclaration {
  type: 'FunctionDeclaration',
  id: 
    Identifier {
        type: 'Identifier',
        name: 'add',
        loc: { start: [Object], end: [Object], lines: [Lines], indent: 0 } 
    },
  params: [ 
    Identifier { type: 'Identifier', name: 'a', loc: [Object] },
    Identifier { type: 'Identifier', name: 'b', loc: [Object] } 
  ],
  body:
    BlockStatement {
     type: 'BlockStatement',
     body: [ [ReturnStatement] ],
     loc: { start: [Object], end: [Object], lines: [Lines], indent: 0 } 
    },
    generator: false,
    expression: false,
    async: false,
    loc: { start: { line: 1, column: 0 },
    end: { line: 1, column: 30 },
    lines: Lines { length: 1, name: null, [Symbol(recastLinesSecret)]: [Object] },
     indent: 0 } 
     }
```





参考链接：https://mp.weixin.qq.com/s/GOD7NL6gK1Fg8QNDw6IGtw




