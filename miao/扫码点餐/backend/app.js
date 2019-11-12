const path = require('path');
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sqlite = require('sqlite')
const userAccountMiddleware = require('./user-account')

const http = require('http'); //加载http模块

const app = express()
const server = http.createServer(app);//创建一个服务器实例

const io = require('socket.io');
const session = require('express-session')
const ioServer = io(server);
global.ioServer = ioServer;

const restaurantMiddleware = require('./restaurant')






app.use((req,res,next) =>{
    console.log(req.method,req.url);
    next()
})


//跨域资源共享  
app.use(cors({
    origin:true,
    maxAge:86400,
    credentials:true,
}))

app.use(session({secret:'secret'}))
app.use(cookieParser('secret'))

app.use(express.static(__dirname + '/build/'))
app.use(express.static(__dirname + '/static/'))//处理静态文件请求的中间件

app.use('/upload',express.static(__dirname + '/upload/'))//处理静态文件请求的中间件

app.use(express.urlencoded({extended:true}))//用来解析扩展url编码的请求体

app.use(express.json())//用来解析json请求体

app.use('/api',userAccountMiddleware)

app.use('/api',restaurantMiddleware)


// app.listen(port,() => {
//     console.log('server listening on port',port)
// })

// module.exports = app;

server.listen(5000,() => console.log(5000));
