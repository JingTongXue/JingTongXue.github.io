





function require(name) {
    if(require.cache.hasOwnProperty(name)){//缓存对象中是否存在该模块-------缓存
        return require.cache[name];//存在,直接返回即可
    }

    var code = new Function("module,exports", readFile(name));//利用new Function构造函数将模块代码包裹起来---加载文件

    var module = {exports:{}};//再新建包裹的模块对象
    
    require.cache[name] = module.exprots;//将模块存进缓存对象中
    
    code(module.exprots,exprots);//                                                                                                                            
    
    require.cache[name] = module.exprots;//将模块存进缓存对象中
    return module.exprots;//
}
require.cache = Object.create(null)

//该函数---通过一个路径,读到一个文件内容,再把这个文件内容返回
function readFile(path){//该函数为浏览器提供,可以让我们从特定的地址下载东西
    var xhr = new XMLHttpRequest();//创建请求的对象
    xhr.open('GET',path,false);//让它请求这个地址   
    xhr.send();//请求
    return xhr.responseText;//最后返回
}























