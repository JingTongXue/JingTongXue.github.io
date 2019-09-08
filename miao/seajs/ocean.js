(function(){
    var seajs = {
        use : function(entryPath){//加载所有的文件依赖
            loadAll(entryPath,()=>{
                require(entryPath);
            })
        }
    }

    function require(path){
        if(moduleCache[path]){
            return moduleCache[path];
        }
        var code = sourcecache[path];
        var modFunc = new Function('module,exports,require',code);
        var module = {exports:{}};
        modFunc(module,module.exports,require);
        return module.exports;
    }

    var moduleCache = {};//模块导出对象的缓存
    var sourcecache = {};//模块源代码的缓存

    /**
     * 
     * 给定文件路径,加载其内容及其依赖的所有文件的内容并缓存
     * 完成后再调用callback
     * @param {*} path 
     * @param {*} callback 
     */
    function loadAll(path,callback){
        readFile(path,(sourceCode) => {
            sourcecache[path] = sourceCode;//加载入口文件,并将入口文件存入cache中
            var deps = getDeps(sourceCode);//取得该入口文件的所有依赖
            if(deps.length === 0){
                callback();
                return;
            }
            var loadedCount = 0;
            deps.forEach(dep => {
                loadAll(dep,()=>{
                    loadedCount++;
                    if(loadedCount == deps.length){
                        callback();
                    }
                })
            });
        })
    }


    /**
     * 给定一份原函数,返回其所有的依赖
     * 即每个require调用的参数组成的数组
     */
    //reqire    (    'fooobar.js'   )   
    function getDeps(sourceCode){//取得该入口文件的所有依赖
        //取得该文件中的 reqire    (    'fooobar.js'   ), 即所依赖的文件(需考虑空格);
        var requireCalls = sourceCode.match(/require\s*\(\s*(['"])[^'"]*\1\)/g);
        if(requireCalls){//如果存在依赖
            return  requireCalls.map(call => {
              return call.match(/require\s*\(\s*(['"])[^'"]*\1\)/)[2]; 
            })
        }else{
            return [];
        }
    }
    /**
     *  给定文件路径,加载完成后调用done
     * 并传日文件内容
     * 
     * @param {*} path 
     * @param {*} done 
     */
    function readFile(path,done){
        var xhr = new XMLHttpRequest();
        xhr.open('get',path);
        xhr.addEventListener('load',()=>{
            done(xhr.responseText);
        })
        xhr.send();
    }

    function readFile2(path,done){
        var script
    }




}())