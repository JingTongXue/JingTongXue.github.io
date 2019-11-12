const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server).sockets;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

let connectedUser = [];
//Socket.io connect
io.on("connection", socket => {
    console.log('a user connected');
    updateUserName();
    let userName = "";
    
    //登陆
    socket.on('login',(name,callback) => {
        if(name.trim().length === 0){
            return;
        }
        
        callback(true);
        userName = name;
        connectedUser.push(userName);
        console.log(connectedUser);
        updateUserName();
    })

    //监听chat message事件
    socket.on('chat message',msg => {
        console.log(msg);
        // io.emit('chat message');
        io.emit('output',{
            name:userName,
            msg:msg
        })
    });
     
    
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
        connectedUser.splice(connectedUser.indexOf(userName),1);
        console.log(connectedUser)
        updateUserName();
    });

    function updateUserName(){
        io.emit("loadUser",connectedUser);
    }


});






const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server renning on port ${port}`));