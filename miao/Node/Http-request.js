// 导入模块:
const http = require('http');
const url = require('url');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');



const port  = 8090;
const baseDir = __dirname;

// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:
    console.log(request.method + ': ' + request.url);
    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    response.writeHead(200, {'Content-Type': 'text/html'});

    var targetPath = path.join(baseDir,req.url);

    fs.readFile(targetPath,(err,data) => {
        if(err){
            response.writeHead(404,{
                'Content-Type':'text/html;charset=UTF-8'
            });
            res.end('您请求的文件不存在')
        }else{
            res.end(data);
        }
    });


   

    // 将HTTP响应的HTML内容写入response:
    response.end('<h1>Hello world!</h1>');


});

// 让服务器监听8080端口:
server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');


