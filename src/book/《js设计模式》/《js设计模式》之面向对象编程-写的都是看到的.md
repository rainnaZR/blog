
# 《js设计模式》之面向对象编程-写的都是看到的


## 1. 面向过程和面向对象

面向对象编程就是将需求抽象成对象，然后针对这个对象分析其特征（属性）和动作（方法）。这个对象就叫类。面向对象编程有个特点就是封装，将需要的功能放在一个对象里。

## 2. 封装

将代表类的变量名首字母大写， 在这个类的内部通过this变量添加属性和方法来进行扩展。通过this定义的属性和方法是该对象自身拥有的，通过prototype继承的属性和方法是每个对象通过prototype访问到，创建一次就可以了。

```
var Book = function(id, bookname, price){
  this.id = id;
  this.bookname = bookname,
  this.price = price;
}
```

由于js的函数级作用域，声明在函数内部的变量以及方法在外部是访问不到的，这样就创建了类的私有变量及私有方法。
在函数内部通过this创建的属性和方法，在类创建对象时，每个对象自身拥有这些数据且能在外部通过this访问到，这种称为对象共有属性和共有方法。

```
var Book = function(id, name, price){
  //私有属性
  var num = 1;
  //私有方法
  function checkId(){};
  //特权方法
  this.getName = function(){};
  this.getPrice = function(){};
  this.setName = function(){};
  //对象公有属性
  this.id = id;
  //对象公有方法
  this.copy = function(){};
  //构造器
  this.setName(name);
  this.setPrice(price);
}
```

通过new关键字创建的对象实质是对新对象this的不断赋值，并将新对象的prototype指向类的prototype对象，新对象的prototye和类的prototype指向同一个对象。new的关键字是给this赋值的，如果少了new，则赋值会到全局window上。

闭包是有权访问另外一个函数作用域中变量的函数，即在一个函数内部创建另一个函数。 

## 3. 继承

每个类有三个部分：
- 构造函数内的，供实例化对象复制用的。
- 构造函数外的，通过点语法添加的，供类使用的。
- 类的原型中的，可以通过原型链来间接访问。

### 3.1 类式继承

#### 原理：
实例化一个父类时，新创建的对象不仅可以访问父类原型上的属性和方法，还可以访问父类构造函数中复制的属性和方法。instanceof通过判断对象的prototype链来确定这个对象是否是某个类的实例。

#### 缺陷：

1. 子类通过原型prototype对父类实例化，所有的子类都会继承父类的方法和属性，如果父类中的属性是引用类型时，则一个子类的更改会影响所有的其他子类。
2. 子类的继承是靠其prototype对父类的实例化来实现的，因此不能向父类传递参数。

### 3.2 构造函数继承

使用call, apply方法来实现构造函数的继承。

### 3.3 组合继承

类式继承是通过子类的原型prototype等于实例化的父类来实现的。构造函数继承是通过在子类的构造函数中通过apply/call方法来执行一次父类的构造函数。

```
// 声明父类
function SuperClass(name){
  this.name = name;
}
// 父类原型共有方法
SuperClass.prototype.getName = function(){};

// 声明子类
funciton SubClass(name){
  // 构造函数继承
  SuperClass.call(this, name);
}
// 类式继承
SubClass.prototype = new SuperClass();
```

继承是对原有对象对封装，从中创建私有属性，私有方法，特权方法，共有属性，共有方法。等。原型链继承等方式叫类式继承，通过构造函数继承的方式叫构造函数继承。