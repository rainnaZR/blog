《JS语言精粹》阅读总结

# 第五章 继承

**对象说明符**

使用对象的形式无须关心顺序。比如实现如下：

```
var func = maker({
    name: 'rainna',
    age: 29
})
```

**原型**
 
原型继承：一个新对象继承一个旧对象的属性。

**函数化**

```
var func = function(obj){
    var that = {};
    
    that.getName = function(){
        return obj.name;
    }
    that.says = function(){
        return obj.saying;
    }
    
    return that;
}

var newFunc = func({
    name: 'rainna',
    saying: 'Hello'
})
```

