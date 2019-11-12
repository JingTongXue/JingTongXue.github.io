var fs = require('fs')
// var fsp = fs.promises


/**
 * 接收一个文件夹路径，返回这个文件夹里面的所有文件名
 * 需要递归的得到所有的文件名 并放在一个一维数组里返回
 * 需要写三个版本：
 * 同步版
 * 回调版
 * Promise版本
 */

/**
 * 所用到的方法
 * 
 * *path.resolve(path):一个路径或路径片段解析成一个绝对路径,返回解析后的路径字符串
 * 
 * *fa.readdir(path,[option],callback):读取目录下面的文件,返回目录下的文件列表对象,如果传入的是个文件,返回这个文件
 * 
 * *fs.stat(apth,callback):读取文件信息对象stats,包括文件大小,gid等信息
 * 
 * *stats.isFile():文件信息对象stats的一个方法,判断当前文件是不是一个文件
 * 
 * *stats.isDirectory():文件信息对象stats的一个文件,判断当前文件是不是一个文件夹
 * 
 */

 //同步版
function listAllFilesSync(dirPath) {
    let result = [];
    var fs = require('fs');
    var path = require('path');
    //根据文件路径读取文件
    fs.readdirSync(dirPath, (err, files) => {
        if(err){
            console.log("读取失败:" + err);
        }else{
            //遍历读取文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(dirPath,filename);
                //根据文件路径获取文件信息,返回一个fs.Stats对象
                fs.stat(filedir,function(err,stats){
                    if(err){
                        console.log("获取文件stats失败:" + err);
                    }else{
                        var isFile = stars.isFile();//判断是不是文件
                        var isDir = stats.isDirectory();//判断是不是文件夹
                        if(isFile){
                            result.push(filedir);//如果是文件,就push进数组中
                        }
                        if(isDir){
                            listAllFilesSync(filedir);//如果是文件夹,就继续遍历该文件夹下的文件
                        }
                    }
                    return result;
                })
            })
        }
    })
}
listAllFilesSync('G:/qianduan/respo/miao');

//回调版
// function listAllFilesCallback(dirPath, cb) {

// }

// listAllFilesCallback('c:/', (err, files) => {

// })



//Promise版
// function listAllFilesPromise(dirPath) {

// }




// listAllFilesPromise('c:/').then(files => {

// }, err => {

// })
