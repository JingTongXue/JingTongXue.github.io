var num = parseInt(process.argv[2]);

console.log(num + ':');


for(var i = 2; ; i++){
    while(num % i == 0){
        console.log(i);
        num = num / i ;
        if(num == 1){
            process.exit(0);//跳出.即停止 return
        }
    }
}