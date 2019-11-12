const { createReadStream, createWriteStream } = require('./file-read-stream')
const { Transform } = require('stream')


function split(){
  var lastHalfLine = '';

  return new Transform({
    objectMode:true,//阻止push进的数据被强制转换成字节
    transform(chunk,encoding,callback){
      var lines = chunk.toString.split('/r/n');//将所传的数据根据空格分割并放入数组中
      if(lines.length > 1){//如果数组的长达大于1,则说明数据为多个字段
        var lastLine = lines.pop();//去数组的最后一项
        if(lastLine != ''){//如果最后一项为空,则说明正好取到的字符断都是整行字符
          lastHalfLine = lastLine;
        }
        lines.push(lastLine);//再将取到的最后一项push进数组中
        this.push(lines[0] + lastHalfLine)
        lastHalfLine = '';
        for(var i = 1; i < lines.length; i++){
          this.push(lines[i]);
        }
        callback();
      }else{
        lastHalfLine = lines[0];
      }
    }
  })

}


var myTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
})

createReadStream('./static-file-server.js')
.pipe(myTransform)
.pipe(createWriteStream('./static-file-server22223.js'))
