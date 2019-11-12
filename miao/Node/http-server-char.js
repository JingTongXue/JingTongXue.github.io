const http = require('http');
const querystring = require('querystring');

const server = http.createServer();
const port = 8899;

const msgs =[{
    content:'hello',
    name:'zhangsan',
}]

server.on('request',(request,response) => {
    if(request.method == 'GET'){
        response.writeHead(200,{
            'Content-Type':'text/html;charset=UTF-8'
        })
        response.write(`
            <form action="/" method="post">
                <input name="name"/>
                <textarea name="content"></textarea>
                <button>提交</button>
            </form>
            <ul>
                ${
                    msgs.map(msg => {
                        return `
                            <li>
                                <h3>${msg.name}</h3>
                                <pre>${msg.content}</pre>
                            </li>
                        `
                    })
                }
            </ul>

        `)
    }

    if(request.method == 'POST'){
        request.on('data',data => {
            var msg =  querystring.parse(data.toString());
            msgs.push(msg);
            response.writeHead(301,{
                'Location':'/'
            })
            response.end();  
        })
    }
})


server.listen(port,() => {
    console.log('server listening on port',port);
    
})