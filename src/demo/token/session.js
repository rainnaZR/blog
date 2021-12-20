const Koa = require('koa')
const router = require('koa-router')()
const session = require('koa-session')
const redisStore = require('koa-redis')({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    password: "123456",
});
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const app = new Koa();
app.keys = ['secret']; // 密钥

app.use(cors({
    credentials: true
}))

app.use(static(__dirname + '/'));

app.use(bodyParser())

app.use(session({
    key: 'sessionId',
    store: redisStore
}, app));

app.use((ctx, next) => {
    if (ctx.url.indexOf('users') > -1) {
        // 如果是用户信息相关接口
        next()
    } else if (ctx.session.userinfo){
        // 如果已经有了用户信息
        next()
    } else {
        ctx.body = {
            message: "暂无登录信息"
        }
    }
})

// 登录
router.post('/users/login', async ctx => {
    const { body } = ctx.request
    // body中读取用户名和密码信息
    // 用户名和密码与数据库值做比对
    // ...
    // ...
    // 比对成功后设置session
    ctx.session.userinfo = body.username;

    ctx.body = {
        message: "账号登录成功"
    }
})

// 登出
router.post('/users/logout', async ctx => {
    // 删除session
    delete ctx.session.userinfo

    ctx.body = {
        message: "账号登出成功"
    }
})

// 获取用户信息
router.get('/users/getUser', async ctx => {
    if(ctx.session.userinfo){
        ctx.body = {
            message: "用户信息获取成功",
            userinfo: ctx.session.userinfo
        }
    }else{
        ctx.body = {
            message: "用户信息获取失败"
        }
    }
})

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);