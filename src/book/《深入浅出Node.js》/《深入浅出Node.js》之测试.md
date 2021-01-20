《深入浅出Node.js》读书总结

# 测试

### 1. 单元测试

**编写可测试代码的原则：**

 1）单一职责。
 
 2）接口抽象。
 
 3）层次分离。分层后，逐层测试，逐层保证。
 
 **单元测试具体包括：**

单元测试主要包括断言，测试框架，测试用例，测试覆盖率，mock，持续集成，异步代码测试，私有方法测试等几个方面。

1）断言

断言就是单元测试中用来保证最小单元是否正常的检测方法。node中的assert模块实现断言部分。

2）测试框架

断言检测失败后，记录下抛出的异常并继续执行，最后生成测试报告。这个任务的承担者就是测试框架。测试框架用于管理测试用例和生成测试报告。比如测试框架mocha。

TDD风格：（测试驱动开发，使用decribe和it组织）

```
describe('Array', function(){
    before(function(){
        ...
    });
    
    describe('#indexOf()', function(){
        it('should return -1 when not present', function(){
            [1,2,3].indexOf(4).should.equal(-1);
        });
    });
});
```

BDD风格：（行为驱动开发，使用suite和test完成）

```
suite('Array', function(){
    setup(function(){
        ...
    });
    
    suite('#indexof()', function(){
        test('should return -1 when not present', function(){
            assert.equal(-1, [1,2,3].indexof(4));
        });
    });
})
```

3）测试用例

分为异步测试和超时设置。使用mocha --reporters可以查看所有的报告形式。mocha给所有涉及异步的测试用例添加超时限制，如果一个用例的执行时间炒过了预期时间，则会记录一个超时错误，然后执行下一个测试用例。

```
it('should take less than 500 ms', function(done){
    this.timeout(500);   //对单个用例设置超时时间
    
    setTimeout(done, 300);
})
```

4）测试覆盖率

查看单元测试覆盖率可以使用blanket模块实现。node将.js文件的编译逻辑封装在require.extensions['.js']中，blanket在这个环节实现文件的编译，将单元测试覆盖率的追踪代码插入到原始代码中，然后由原始模块处理逻辑。对原模块的代码没有额外侵入。

5）mock

使用before()和after()钩子函数。

6）私有方法的测试

使用rewire模块实现对私有方法的访问。原理是利用闭包的诀窍，在eval()执行时，实现对模块内部局部变量的访问，从而可以将局部变量导出给测试用例调用执行。

### 2. 性能测试

性能测试包括负载测试，压力测试，基准测试等。

1）基准测试

基准测试要统计的是在多少时间内执行了多少次某个方法。一般以次数为参照物，然后比较时间来判断性能的差距。对基本的方法进行测试。

2）压力测试

对网络接口进行压力测试以判断网络接口的性能。指标有吞吐率，响应时间和并发数。最常用的工具有ab, siege, http_load等。


