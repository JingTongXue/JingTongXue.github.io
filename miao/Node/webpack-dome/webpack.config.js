// module.exports = {
//     /**
//      * 单入口文件打包
//      */
//     entry:__dirname+"/js/index.js",//入口文件,即webpack开始打包的入口
//     output:{
//         path:__dirname+"/build",//打包出口文件路径
//         filename:"bundle.js"   //打包文件名,这里我们将打包后的文件名设置成bundle,即index.html中引用的文件名
//     }
// }

module.exports = {
    /**
     * 多入口文件打包
     */
    entry:{//入口文件,即webpack开始打包的入口
        bundle:__dirname+"/js/index.js",
        greeter:__dirname+"/js/greeter.js"
    },
    output:{
        path:__dirname+"/build",//打包出口文件路径
        filename:"[name].js",   //打包文件名,这里我们将打包后的文件名设置成bundle,即index.html中引用的文件名
        publicPath:"./"
    },
    module:{
        rules:[
            {
                test:/\.(png|jpg)?$/,
                use:[
                    {
                        loader:"url-loader",
                    }
                ]
            },
        ]
    }
}