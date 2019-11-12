const stream = require('stream')
const { Readable, Writable, Duplex, Transform } = stream


class Compress extends Transform {//转换流
  _transform(chunk, encoding, callback) {
    this.push(process(chunk));
  }
}


class TCPConnect extends Duplex {//双工流
  constructor() {

  }
  _read(size) {//流的使用者需要数据时
    this.push();
  }
  _write(chunk, encoding, done) {//此流被其它人定入数据时，我们要处理写进来的数据

  }
}

class WritableFile extends Writable {
  _write() {

  }
}

var myws = new Writable({//可写流
  highWaterMark: 20,
  write(chunk, encoding, done) {
    setTimeout(() => {
      console.log(chunk.toString());
      done()
    }, 500)
  }
})

var myrs = new Readable({//可读流
  highWaterMark: 20,
  read(size) {
    setTimeout(() => {
      var char = Math.random().toString().slice(2,3);
      this.push(char);
    }, 100);
  }
})

myrs.on('pause', () => {
  console.log('rs paused');
})

myrs.on('resume', () => {
  console.log('rs resumed');
})

myws.on('drain', () => {
  console.log('ws drained');
})

myrs.pipe(myws)


