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

      differenceBy:function(array , ...arrays){
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
      }

}