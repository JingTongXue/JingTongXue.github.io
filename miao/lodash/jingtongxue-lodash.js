var jingtongxue = {
    compact:function(arry){
        return arry.filter(it => it)
      },

      chunk :function(ary, size = 1) {
        /**
         * argument:
         * array (Array): The array to process.
         * [size=1] (number): The length of each chunk
         * return: 
         * (Array): Returns the new array of chunks.
         */
        // let times = Math.ceil(ary.length / size)
        let res = []
        for (let i = 0, len = ary.length; i < len; i += size) {
          res.push(ary.slice(i, i + size))
        }
        return res
      },

      difference :function(array , ...arrays){
        var ary = [];
        var as = array.slice();
        for(var arrys of arrays){
          if(typeof arrys !== "number"){
              for(var arry of arrys){
                if(ary.indexOf(arry) == -1){
                  ary.push(arry);
                }
              }
          }else{
            if(ary.indexOf(arrys) == -1){
              ary.push(arrys);
            }
          }
        }

        for(var a of array){
          if(ary.indexOf(a) !== -1){
            as.splice(as.indexOf(a),1);
          }
        }
        return as;
      },
      
      //没成功
      differenceBy :function(array , ...arrays){
        var last = arrays.pop();
        //迭代器多情况考虑 可能情况数组,字符串,函数
        if(Array.isArray(last)){//数组时
            arrays.push(last);
            return difference(array,...arrays);
        }
        if(typeof last == 'string'){//字符串
          last = last.split('.');
          arrays.push(last);
          return difference(array,...arrays);
        }
        if(typeof last == "function"){//函数
          var ar = arrays[0].map(it => last(it));
          return ary.filter(it => ar.indexOf(last(it)) === -1);
        }
      },

      isMatch :function(obj,src){
        for(var key in src){
          if(typeof src[key] == 'object' && src[key] !== null){
            if(!this.isMatch(obj[key],src[key])) {
              return false
            }
          }else{
            if(obj[key] !== src[key]){
              return false;
            }
          }
        }
        return true;
      },

      pull:function(ary,...values){
        var va = [...values];
        for(var i = 0;i < va.length;i++){
          for(var j = 0;j < ary.length;j++){
            if(va[i] == ary[j]){
              ary.splice(j,1);
              j--;
            }
          }
        }
        return ary;
      },
      pullAll:function(ary,values){
        for(var i = 0;i < values.length;i++){
          for(var j = 0;j < ary.length;j++){
            if(values[i] == ary[j]){
              ary.splice(j,1);
              j--;
            }
          }
        }
        return ary;
      }


}