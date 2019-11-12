const fs = require('fs')
const fsp = fs.promises

//原版
async function listAllFiles(path) {
  var result = []
  var stat = await fsp.stat(path);//通过path路径读取该文件信息
  if (stat.isFile()) {//如果当前文件是一个文件
    return [path];//则直接将当前文件放入数组中return
  } else {//如果当前文件是一个文件夹
    var entries = await fsp.readdir(path, {withFileTypes: true});//读取当前文件夹下的文件,返回一个数组

    for (let entry of entries) {//遍历每个文件
      var fullPath = path + '/' + entry.name;//获取文件的路径
      if (entry.isFile()) {//如果当前文件是一个文件
        result.push(fullPath);//则push进新建数组中
      } else {//如果为文件夹
        var files = await listAllFiles(fullPath);//则进行递归--返回一个数组
        result.push(...files);//最后将将所有的文件路径push进新建数组中
      }
    }

    return result
  }
}
//改进版
async function listAllFilesBetter(path) {
  var result = [];
  var stat = await fsp.stat(path)
  if (stat.isFile()) {
    return [path]
  } else {
    var entries = await fsp.readdir(path, {withFileTypes: true})

    var entryPromises = entries.map((entry, i) => {//启动所有子文件（夹）的读取
      var fullPath = path + '/' + entry.name
      return listAllFilesBetter(fullPath).then(files => {
        result[i] = files
      })
    })

    var entryValues = await Promise.all(entryPromises)

    // for (let entryPromise of entryPromises) {
    //   var files = await entryPromise
    //   result.push(...files)
    // }
    return [].concat(...result)
    return result.push(...[].concat(...entryValues))
  }
}

async function listAllFiles串行(path) {
  var result = []
  var stat = await fsp.stat(path)
  if (stat.isFile()) {
    return [path]
  } else {
    var entries = await fsp.readdir(path, {withFileTypes: true})

    for (let entry of entries) {
      var fullPath = path + '/' + entry.name
      var files = await listAllFiles串行(path)
      result.push(...files)
    }
    return [].concat(...result)
  }
}

async function listAllFiles并行等所有(path) {
  var result = []
  var stat = await fsp.stat(path)
  if (stat.isFile()) {
    return [path]
  } else {
    var entries = await fsp.readdir(path, {withFileTypes: true})

    //所有任务同时开发
    var entryPromises = entries.map(entry => {
      var fullPath = path + '/' + entry.name
      return listAllFiles并行等所有(path)
    })

    //串行等待每个任务，即便第二个完成了第一个没完成，也不能处理第二个
    for (let entryPromise of entryPromises) {
      var files = await entryPromise
      result.push(...files)
    }
    return [].concat(...result)
  }
}

function listAllFilesSync(path) {
  var result = []
  var stat = fs.statSync(path)
  if (stat.isFile()) {
    return [path]
  } else {
    var entries = fs.readdirSync(path, {withFileTypes: true})
    entries.forEach(entry => {
      var fullPath = path + '/' + entry.name
      if (entry.isFile()) {
        result.push(fullPath)
      } else {
        var files = listAllFilesSync(fullPath)
        result.push(...files)
      }
    })
    return result
  }
}

function listAllFilesPromise(path) {
  return fsp.stat(path).then(stat => {
    if (stat.isFile()) {
      return [path]
    } else {
      return fsp.readdir(path, {withFileTypes: true}).then(entries => {
        return Promise.all(entries.map(entry => {
          var fullPath = path + '/' + entry.name
          return listAllFilesPromise(fullPath)
        }))
      })
    }
  }).then(arrays => {
    return [].concat(...arrays)
  })
}

function listAllFilesCallback(path, callback) {
  fs.stat(path, (err, stat) => {
    if (stat.isFile()) {
      callback([path])
    } else {
      fs.readdir(path, {withFileTypes: true}, (err, entries) => {
        var result = []
        var count = 0

        entries.forEach((entry, i) => {
          var fullPath = path + '/' + entry.name

          listAllFilesCallback(fullPath, (files) => {
            result[i] = files
            count++
            if (count == entries.length) {
              callback([].concat(...result))
            }
          })
        })
      })
    }
  })
}



console.log(listAllFilesSync('./aaa'))

listAllFilesPromise('./aaa').then(console.log)

listAllFilesCallback('./aaa', console.log)

listAllFiles('./aaa').then(r => console.log('===', r))
