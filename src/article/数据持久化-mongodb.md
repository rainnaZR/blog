mongodb 文档型数据库。

## 1. node调用mongodb

### 安装依赖包

包文件地址：https://www.npmjs.com/package/mongodb


```
cnpm install mongodb --save
```

### 连接mongodb，实现增删改查

mongodb可以方便的将json插入到数据库中。调用方法可参考官方文档，下面简单示例：


```
(async () => {
	const { MongoClient } = require('mongodb')
	
	// 创建客户端
	const url = 'mongodb://localhost:27017'
	const client = new MongoClient(url)
	
	// 创建连接
	let ret = await client.connect()
	
	// 建库
	const db = client.db('test')
  	// 建集合-建表
	const user = db.collection('user')
	
	// 添加文档/记录
	ret = await user.insertOne({
		name: '张三',
		age: 20
	})
	
	// 查询文档
	ret = await user.findOne()  //查询第一条记录
	
	// 更新文档
	ret = await user.updateOne({
		name: '张三'
	},{
		$set: {
			name: '李四'
		}
	})
	
	// 删除文档
	ret = await user.deleteOne({
		name: '李四'
	})
	ret = await user.deleteMany()
	
	client.close()
})()
```


## 2. mongodb使用案例

### 数据库配置文件


```
// conf.js

module.exports = {
	url: 'mongodb://localhost:27017',
	dbName: 'test'
}
```


### mongodb连接的封装


```
// db.js

const conf = require('./conf')
const { EventEmitter } = require('events')
//客户端
const { MongoClient } = require('mongodb')

class Mongodb{
	constructor(conf){
		// 保存配置
		this.conf = conf
		this.emitter = new EventEmitter()
		// 连接
		this.client = new MongoClient(conf)
		this.client.connect(err => {
			if(err) throw err
			// 触发事件，事件订阅发布模式
			this.emitter.emit('connect')
		})
	}
	
	// 生成集合
	collection(colName, dbName = conf.dbName){
		return this.client.db(dbName).collection(colName)
	}
	
	// 订阅事件，事件订阅发布模式
	once(event, callback){
		this.emitter.once(event, callback)
	}
}

module.exports = new Mongodb(conf)
```


### 初始化测试数据


```
// initData.js

const mongodb = require('./db')

// 订阅事件
mongodb.once('connect', async () => {
	// 生成集合
	const collection = mongodb.collection('user')
	// 清空数据
	await collection.deleteMany()
	// 造假数据
	const data = new Array(100).fill().map((i, index) => ({
		name: `aa${index}`,
		age: 20
	}))
	// 插入假数据
	await collection.insertMany(data)
})
```


### 定义接口文件


```
// api.js
// 接口编写文件

const express = require("express")
const app = express()
const path = require("path")
const mongo = require("./models/db")

app.get("/api/list", async (req, res) => {
	// 分⻚查询
 	const { page} = req.query
 	try {
 		const col = mongo.collection("user")
 		const total = await col.find().count()
 		const user = await col
 			.find()
 			.skip((page - 1) * 5)
 			.limit(5)
 			.toArray()
 		res.json({ 
			code: 200, 
			data: { 
				users, 
				pagination: { 
					total, 
					page 
				}
			}
    	})
	} catch (error) {
		console.log(error)
	}
})

app.listen(3000)
```


## 3. ODM-Mongoose

优雅的NodeJS对象⽂档模型object document model。Mongoose有两个特点： 

- 通过关系型数据库的思想来设计⾮关系型数据库。
- 基于mongodb驱动简化操作。


Mongoose提供数据模型的概念，使用mongoose.Schema，mongoose.model来定义数据模型，基于数据模型来操作。

### mongoose与关系型数据库对应关系

|Oracle|MongoDB|Mongoose|
|---|---|---|
|数据库实例（database instance）|MongoDB实例|Mongoose|
|模式（schema）|数据库（database）|mongoose|
|表（table）|集合（collection）|模板（Schema）+模型（Model）|
|行（row）|	文档（document）|	实例（instance）|
|rowid	|_id	|_id|
|Join	|DBRef|	DBRef|


### 安装依赖包


```
cnpm i mongoose
```


### 使用方法


```
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:21017')

const conn = mongoose.connection
conn.on('error', () => console.error('连接异常'))
conn.once('open', async () => {
	const Schema = mongoose.Schema({
		name: String,
		age: Number
	})
	const model = mongoose.model('user', Schema)
	
	// 增
	let res = await model.create({
		name: '张三',
		age: 20
	})
	// 删
	ret = await model.deleteOne({
		name: '张三'
	})
	// 改
	ret = await model.updateOne({
		name: '张三'
	},{
		$set: {
			name: '李四'
		}
	})
	// 查
	ret = await model.find({
		name: '张三'
	})  
})
```

## 4. mongoose零编码实现restful接口

**需求：** 添加一个model模型会自动添加一套crud接口。


**思路：**

- 在model目录下定义模型文件，比如 ./model/user.js
- 编写loader.js，遍历模型文件目录model下的所有模型文件，读取其内容并注册到mongoose，完成初始化数据库操作 ./loader.js
- 定义中间件处理路由，注册通用路由 ./router.js
- 定义通用路由处理路逻辑 ./app.js
- 入口主文件调用loader和引入路由中间件 ./index.js

代码查看地址：https://github.com/rainnaZR/blog/tree/main/src/demo/mongoose-restful

### 模型文件定义

model目录存放所有模型定义文件，以user.js为例：


```
// ./model/user.js
module.exports = {
    schema: {
        mobile: { type: String, required: true },
        realName: { type: String, required: true },
    }
}
```


### 数据库处理文件 loader.js

node读取model模型文件目录，自动注册到mongoose，完成初始化数据库操作。

```
// loader.js

const fs = require('fs')
const path = require('path')
const mongoose = require("mongoose")
const config = require('./config')

function load(dir, cb) {
    // 获取绝对路径
    const url = path.resolve(__dirname, dir)
    const files = fs.readdirSync(url)
    files.forEach(filename => {
        // 去掉后缀名
        filename = filename.replace('.js', '')
        // 导入文件
        const file = require(`${url}/${filename}`)
        // 处理逻辑
        cb(filename, file)
    })
}

function loadModel(app) {
    mongoose.connect(config.db.url, config.db.options)
    const conn = mongoose.connection
    conn.on("error", () => console.error("连接数据库失败"))
    
    app.$model = {}
    load('./model', (filename, { schema }) => {
        app.$model[filename] = mongoose.model(filename, schema)
    })
}

module.exports = {
    loadModel
}
```


### 数据库配置文件config.js

```
// config.js

module.exports = {
	url: 'mongodb://localhost:27017',
	dbName: 'test'
}

路由处理中间件 ./router.js

const router = require('koa-router')()
const {
    init, get, create, update, del,
} = require('./api')

router.get('/api/:list', init, get)
router.post('/api/:list', init, create)
router.put('/api/:list/:id', init, update)
router.delete('/api/:list/:id', init, del)

module.exports = router.routes()
```

```
// api.js

module.exports = {
    async init(ctx, next) {
        const model = ctx.app.$model[ctx.params.list]
        if (model) {
            ctx.list = model
            await next()
        } else {
            ctx.body = 'no this model'
        }
    },

    async get(ctx) {
        ctx.body = await ctx.list.find({})
    },
    
    async create(ctx) {
        const res = await ctx.list.create(ctx.request.body)
        ctx.body = res
    },
    
    async update(ctx) {
        const res = await ctx.list.updateOne({ _id: ctx.params.id }, ctx.request.body)
        ctx.body = res
    },
    
    async del(ctx) {
        const res = await ctx.list.deleteOne({ _id: ctx.params.id })
        ctx.body = res
    },
    
    async page(ctx) {
        ctx.body = await ctx.list.find({})/*  */
    }
}
```

### 入口主文件

调用loader和引入路由中间件。


```
const Koa = require('koa')
const app = new Koa()
const { loadModel } = require('./loader')
const bodyParser = require('koa-bodyparser')
const restful = require('./router')

// 初始化数据库
loadModel(app)

app.use(bodyParser())
app.use(restful)

app.listen(3000,() => {
    console.log(`app started at port ${port}...`)
})
```