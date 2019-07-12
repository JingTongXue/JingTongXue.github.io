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
      } 
}