const express = require('express');//引入express框架
const app = express();//实例化一个express,为app
const cookieParser = require('cookie-parser');//用以解析cookie

app.use(express.static(__dirname + '/static'));//指定静态文件地址

app.use(express.urlencoded({ extended: true }));//检测URL

const port = 3005;

// const app = express.Router();

const users = [{
    name: 'a',
    email: 'a@qq.com',
    password: 'a',
}, {
    name: 'b',
    email: 'b@qq.com',
    password: 'b',
}]

const changePasswordTokenMap = {}

app.use((req, res, next) => {
    res.set('Content-Type', 'text/html;charset=UTF-8');
    next();
})
app.use(cookieParser('my secret'));//解析cookie

app.get('/', (req, res, next) => {
    console.log(req.cookies);;
    console.log(req.signedCookies);
    if (req.signedCookies.user) {
        res.send(`
        <div>
            <span>Welcome,${req.signedCookies.user}</span>
            <a href="/create">创建投票</a>
            <a href="/loginout">登出</a>
        </div>
        `)
    } else {
        res.send(`
            <div>
                <a href="/register">注册</a>
                <a href="/login">登陆</a>
            </div>
        `)

    }
})

app.get('/create', (req, res, next) => {

})


app.get('/vote/:id', (req, res, next) => {

})

//注册
app.route('/register')
    .get((req, res, next) => {
        res.send(`
            <form action="/register" method="post">
                用户名:<input type="text" name="name"/>
                邮箱:<input type="text" name="email"/>
                密码:<input type="password" name="password"/>
                <button>注册</button>
            </form>
        `)
    })
    .post((req, res, next) => {
        var userInfo = req.body;
        if (users.findIndex(it => it.name == userInfo.name) >= 0) {
            res.end('用户名已被占用!!!')
        } else {
            users.push(userInfo);
            res.end('注册成功!!');
        }
        console.log(userInfo);
    })

//登陆
app.route('/login').get((req, res, next) => {
    res.send(`
        <form action="/login" method="post">
            用户名:<input type="text" name="name"/>
            密码:<input type="password" name="password"/>
            <a href="/forgot">忘记密码</a>
            <button>登陆</button>
        </form>
    `)
})
    .post((req, res, next) => {
        var tryLoginUser = req.body;
        console.log(tryLoginUser);

        if (users.findIndex(it => {
            return it.name == tryLoginUser.name && it.password == tryLoginUser.password
        }) >= 0) {
            res.cookie('user', tryLoginUser.name, {
                signed: true
            });  //signed:true;是否对cookie签名
            res.redirect('/');//跳转到首页
        } else {
            res.end('用户名或密码错误!!')
        }
    })

//登出
app.get('/loginout', (req, res, next) => {
    res.clearCookie('user');//清除cookie;
    res.redirect('/');//跳转到首页
})
//忘记密码
app.route('/forgot')
    .get((req, res, next) => {
        res.send(`
            <form action="/forgot" method="post">
                请输入您的邮箱:<input type="text" name="email"/>
                <button>确定</button>
            </form>
        `)
    })
    .post((req,res,next) =>{
        var email = req.body.email;
        var token = Math.random().toString().slice(2);

        changePasswordTokenMap[token] = email;

        setTimeout(() => {
            delete changePasswordTokenMap[token]
        },60 * 1000 * 20);//20分钟后删除token

        var link = `http://localhost:3005/change-password/${token}`;
        // EmailSystem.send(email,link);
        console.log(link);
        
        res.end('已向您的邮箱发送密码重置连接');

    })

app.route('/change-password/:token')
    .get((req,res,next) => {
        var token = req.params.token;
        console.log(changePasswordTokenMap[token]);
        
        var user = users.find(it => it.email == changePasswordTokenMap[token]);
        res.end(`
            此页面可以重置${user.name}的密码
            <form action="" method="post">
                <input type="password" name="password" />
                <button>提交</button>
            </form>
        `)
    })
    .post((req,res,next) => {
        var token = req.params.token;
        var user = users.find(it => it.email == changePasswordTokenMap[token]);
        var password = req.body.password;
        if(user){
            user.password = password;
            delete changePasswordTokenMap[token];
            res.end('密码修改成功!!');
        }else{
            res.end('此链接已经失效啦!!!!!');
        }
    })


app.listen(port, () => {
    console.log("server listening on port", port);
})



