# 《js设计模式》之工厂方法模式

## 1. 概念

通过对产品类的抽象使其用于创建多类产品对实例。

## 2. 安全模式类

判断类的this是否指向当前类，不是的化则实例化，规避忘记写new时产生的错误。

```
var Demo = function(){
  if(!(this instanceof Demo)) {
    return new Demo();
  }
  ....
}

var d = Demo();  //调用d的方法时也不会出错了
```

## 3. 安全的工厂方法

将方法都集中在一个类里。然后实例化。

```
var Factory = function(type, content){
    
}

Factory.prototye = {
  java(){
    ....
  },
  js(){
    ...
  }
}
```

## 4. 总结

通过工厂模式创建多个类的实例对象。用户不必关心创建该对象的具体类，只需调用工厂方法即可（对象上的方法）。