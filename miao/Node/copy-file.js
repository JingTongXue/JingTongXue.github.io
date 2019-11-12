const fs = require('fs');

var file = './3.mp4';

//常规法
// fs.readFile(file,(err,data)=>{
//     if(err){
//         console.log(err);
//     }else{
//         fs.writeFile('4.mp4',data,()=>{
//             console.log('done');
//         })
//     }
// })

// setInterval(() => {//查看内存占用量(不一定准确)
//     console.log(process.memoryUsage());
// })

//流
var rs = fs.createReadStream(file);
var ws = fs.createWriteStream('/.4.mp4',{
    highWaterMark:1024 * 1024 * 100
});

//1
// rs.on('data',data=>{
//     var canistillwrite = ws.write(data);
//     console.log(canistillwrite);
// })

// rs.on('end',() => {
//     ws.end();
// })




//2
rs.on('data',data => {
    if(ws.write(data) === false){//ws.write(xxx); 向ws中写入数据,如果内部缓冲区的大小大于创建流时设定的 highWaterMark 阈值，函数将返回 false
        rs.pause();//暂停
    }
})

rs.on('drain',() => {
    rs.resume();
})

//3
rs.pipe(ws);