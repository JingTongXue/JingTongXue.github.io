const express = require('express');

const server = express();

const port = 9090;


server.use((req,res,next) => {
     
})


server.listen(port,()=>{
    console.log('Server:',port);
})