var fs = require('fs')
var fsp = fs.promises

try {
  data = fooSync(a,b,c)
}

/**
 * 接收一个文件夹路径，返回这个文件夹里面的所有文件名
 * 需要递归的得到所有的文件名 并放在一个一维数组里返回
 * 需要写三个版本：
 * 同步版
 * 回调版
 * Promise版本
 */
function listAllFilesSync(dirPath) {

}

function listAllFilesCallback(dirPath, cb) {

}

function listAllFilesPromise(dirPath) {

}


var files = listAllFiles('c:/')

listAllFilesCallback('c:/', (err, files) => {

})

listAllFilesPromise('c:/').then(files => {

}, err => {

})



var utils = require('utils')
var readFilePromise = utils.promisify(fs.readFile)

function readFilePromise(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function promisify(f) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      f(...args, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}


/**
 * 将一个基于回调的函数转换为一个返回 promise 的函数
 */
function promisify(callbackBasedFunction) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      callbackBasedFunction(...args, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}

function callbackify(promiseBased) {
  return function(...args) {
    var cb = args.pop()
    promiseBased(...args).then(val => {
      cb(null, val)
    }, reason => {
      cb(reason)
    })
  }
}




readFilePromise = promisify(fs.readFile)
writeFilePromise = promisify(fs.writeFile)
statPromise = promisify(fs.stat)
unlinkPromise = promisify(fs.unlink)


readFilePromise('a.js').then(data => {

}).catch(err => {

})