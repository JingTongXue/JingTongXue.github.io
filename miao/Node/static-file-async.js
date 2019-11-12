const http = require('http');
//fs模块  文件读取即写入
const fs = require('fs');
const fsp = fs.promises
//path模块 用于处理文件路径和目录路径的工具
const path = require('path');
//用以获取文件扩展名index.html ----->  .html
const mime = require('mime');

const port = 8090;
const baseDir = path.resolve('./');

//映射
// var mimeMap = {
//     '.jpg': 'image/jpeg',
//     '.html': 'text/html',
//     '.css': 'text/stylesheet',
//     '.js': 'application/javascript',
//     '.json': 'application/json',
//     '.png': 'image/png',
//     '.txt': 'text/plain',
//     'xxx': 'application/octet-stream',
// }

const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);
    //path.join方法使用特定的分隔符作为定界符将给定的path片段连接在一起,用以规范话路径
    //decodeURIComponent中文乱码问题
    var targetPath = decodeURIComponent(path.join(baseDir, req.url));//规范后的路径

    //阻止将baseDir以外文件发送出去
    if(!targetPath.startsWith(baseDir)){//如果不以所给路径开头
        //立即返回
        res.end();
        return 
    }
    //阻止发送以点开头的文件夹(隐藏文件)里面
    if(targetPath.split(path.sep).some(seg => seg.startsWith('.'))){
        console.log('点');
        
        //立即返回
        res.end();
        return 
    }

    try {

        //判断该目录文件的状态
        var stat = await fsp.stat(targetPath);

        //如果该目录问价为一个常规文件
        if (stat.isFile()) {
            //则读取该文件
            var data = await fsp.readFile(targetPath);
            //mime.getType方法用来获取文件扩展名
            var type = mime.getType(targetPath);
            if(type === 'text/plain'){
                res.writeHead(200, { 'Content-Type': `${type}; Content-Encoding= UTF-8` });
            }else if(type){
                res.writeHead(200, { 'Content-Type': `${type}; charset= UTF-8` });
            }else{
                res.writeHead(200, {'Content-Type': `application/octet-stream`});
            }
            res.end(data);
        } else if (stat.isDirectory()) {//如果该目录文件为一个目录
            //如果该系统目录中有index.html文件

            var indexPath = path.join(targetPath, 'index.html');
            try {
                //判断是否可以读到该目录下的index.html文件
                await fsp.stat(indexPath);
                var indexContent = await fsp.readFile(indexPath);
                var type = mime.getType(indexPath);
                if(type){
                    res.writeHead(200, { 'Content-Type': `${type}; charset=UTF-8` });
                }else{
                    res.writeHead(200, {'Content-Type': `application/octet-stream`});
                }
                res.end(indexContent);
            } catch (e) {//index.html不存在
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
                var entries = await fsp.readdir(targetPath, { withFileTypes: true });
                //遍历文件中的子文件
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=UTF-8'
                });
                res.end(`
                ${
                    entries.map(entry => {
                        var slash = entry.isDirectory() ? '/' : '';
                        return `
                            <div>
                                <a href="${entry.name}${slash}">${entry.name}${slash}</a>
                            </div>
                        `
                    }).join('')
                    }
             `);
            }
        }
    } catch (e) {
        res.writeHead(404, {
            'Content-Type': 'text/html;charset=UTF-8'
        });
        res.end('您请求的文件不存在')
    }


})




server.listen(port, () => {
    console.log('静态文件服务器地址:', port);
})