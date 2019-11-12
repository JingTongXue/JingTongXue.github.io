const http = require('http');
//fs模块  文件读取即写入
const fs = require('fs');
//path模块 用于处理文件路径和目录路径的工具
const path = require('path');

const port = 8090;
const baseDir = __dirname

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);
    //path.join方法使用特定的分隔符作为定界符将给定的path片段连接在一起,用以规范话路径
    var targetPath = path.join(baseDir, req.url);//规范后的路径
    //fs.data 用以读取文件状态
    fs.stat(targetPath, (err, stat) => {
        if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/html;charset=UTF-8'
            });
            res.end('您请求的文件不存在')
        } else {
            //如果该路径文件为一个常规文件
            if (stat.isFile()) {
                //那么就继续读取该路径文件
                fs.readFile(targetPath, (err, data) => {
                    res.end(data);
                })
            } else if (stat.isDirectory()) {//如果该路径文件为一个系统目录
                //如果该系统目录中有index.html文件
                var indexPath = path.join(targetPath, '/index.html');
                //判断该目录./index.html的状态
                fs.stat(indexPath, (err, stat) => {
                    if (err) {//如果出错了,说明该目录下没有index.html文件
                        //如果地址栏里不是以/结尾,跳转到以/结尾的相同地址
                        if (!req.url.endsWith('/')) {
                            res.writeHead(301, {
                                'Location': req.url + '/'
                            })
                            res.end();
                            return
                        }
                        //index.html not found
                        //然后直接读取该目录中的文件
                        fs.readdir(targetPath, { withFileTypes: true }, (err, entires) => {
                            res.writeHead(200, {
                                'Content-Type': 'text/html;charset=UTF-8'
                            });
                            //遍历文件中的子文件
                            res.end(`
                                ${
                                entires.map(entry => {
                                    var slash = entry.isDirectory() ? '/' : '';
                                    return `
                                            <div>
                                                <a href="${entry.name}${slash}">${entry.name}${slash}</a>
                                            </div>
                                        `
                                }).join('')
                                }
                             `);
                        })
                    } else {//如果该目录存在index.html时
                        //直接读取该文件
                        fs.readFile(indexPath, (err, data) => {
                            res.end(data);
                        })
                    }
                })
            }
        }
    })
    //fs.readFile方法用来异步读取文件的全部内容
    //  fs.readFile(targetPath,(err,data) => {
    //      if(err){
    //          res.writeHead(404,{
    //              'Content-Type':'text/html;charset=UTF-8'
    //          });
    //          res.end('您请求的文件不存在')
    //      }else{
    //          res.end(data);
    //      }
    //  })
})


server.listen(port, () => {
    console.log('静态文件服务器地址:', port);
})