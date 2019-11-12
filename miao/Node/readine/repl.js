const repl = require('repl');
const axios = require('axios');

async function getDrf(word){
    var data = (await axios.get(`http://4.cddm.me:5001/word/${word}`)).data;//请求地址查询出参数的意思
    try{
        return data[0].senses[0].defs[0].defCn;
    }catch(e){
        return '查无此词';
    }
}


// node repl.js cat
var arg = process.argv[2];//用户传的参数(即cat)
   
if(arg){//如果用户传了参数,就直接查出其意显示即可
    getDrf(arg).then(def => {
        console.log(def);
    })
}else{//如果没有传参,就直接进入启动交互式控制台
    //prompt:表示node页面里提示符,光标闪烁前的部分
    //eval:输入的信息会调用eval里的函数
        repl.start({
            prompt: '> ',
            eval: async function(word,context,filename,callback){
                if(word.trim() == ''){//如果用户没填就不显示
                    callback(null);
                    return;
                }
                if(word.trim() == '.exit'){//如果控制台输入.exit,直接退出程序
                    process.exit();
                }
                //请求该地址用户输入的信息(word),将其意查出显示出来
                var data = await getDrf(word);
                callback(null,data);
            }
        });
}
