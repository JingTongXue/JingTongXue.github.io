const http = require('http');
const io = require('socket-io');
const server = http.createServer(app);
const ioServer = io(server);

global.ioServer = ioServer;
const app = require('./app');
// httpServer.on('request',app )
server.on('request',app);



const port = 5000

server.listen(port,()=>{
    console.log('server listening on port',port);
})