const koa = require('koa')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')
const bodyParser = require('koa-bodyparser')
const secret = 'secret' // 鉴权的密钥

const app = new koa()
app.keys = ['secret']

app.use(bodyParser())

// 登录
router.post('/user/login', async ctx => {
	const { body: { username, password, role } } = ctx.request
    // body中读取用户名和密码信息
    // 用户名和密码与数据库值做比对
    // ...
    // ...
    // 比对成功后生成token令牌
	const userinfo = {
        username,
        password,
        role
    }
    const token = jwt.sign({
        data: userinfo,
        exp: Math.floor(Date.now()/1000) + 60 *60
    }, secret)

    // 返回响应
	ctx.body = {
		message: '登录成功',
		userinfo,
		token
	}
})

// 获取token
router.get('/user/token', jwtAuth({
        secret
    }), async ctx => {
        ctx.body = {
            message: '获取成功',
            userinfo: ctx.state.user.data
        }
    }
)

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)