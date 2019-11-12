const fs = require('fs')
const zlib = require('zlib')

var compressStream = zlib.createGzip()

var file = './3.rmvb'

var rs = fs.createReadStream(file)
var ws = fs.createWriteStream('./3.gz', {
  highWaterMark: 1024 * 1024 * 100
})

// rs.on('data', data => {
//   var canistillwrite = ws.write(data)
//   console.log(canistillwrite)
// })

// rs.on('end', () => {
//   ws.end()
// })


// rs.on('data', data => {
//   if (compressStream.write(data) === false) {
//     rs.pause()
//   }
// })

// compressStream.on('drain', () => {
//   console.log('compressStream drain')
//   rs.resume()
// })

// rs.on('end', () => {
//   compressStream.end()
// })




// compressStream.on('data', data => {
//   if (ws.write(data) === false) {
//     compressStream.pause()
//   }
// })

// compressStream.on('end', () => {
//   ws.end()
// })

// ws.on('drain', data => {
//   console.log('ws drain')
//   compressStream.resume()
// })


rs.pipe(compressStream).pipe(ws)


// ReadableStream.prototype.pipe = function(writable) {
//   var rs = this

//   rs.on('data', data => {
//     if (writable.write(data) === false) {
//       rs.pause()
//     }
//   })

//   rs.on('end', () => {
//     writable.end()
//   })

//   writable.on('drain', () => {
//     rs.resume()
//   })

//   return writable
// }

// f(g(h(x)))

