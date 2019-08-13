var jingtongxue = {
  compact: function (arry) {
    return arry.filter(it => it)
  },

  chunk: function (ary, size = 1) {
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

  difference: function (array, ...arrays) {
    var map = {};
    arrays.forEach(function(ary){//將需要排除的值添加到map中
      for(var i = 0;i < ary.length;i++){
        map[ary[i]] = true;
      }
    })
    var result = [];
    for(var i = 0;i < array.length;i++){
      if(!(array[i] in map)){//如果要檢查的數組中的數不存在于map
        result.push(array[i]);//則該數不需要被排除,添加到新建數組中即可
      }
    }
    return result;
  },


  differenceBy: function (array, ...arrays) {
    var last = arrays.pop();
    //迭代器多情况考虑 可能情况数组,字符串,函数
    if (Array.isArray(last)) {//数组时
      arrays.push(last);
      return jingtongxue.difference(array, ...arrays);
    }
    if (typeof last == 'string') {//字符串
      last = last.split('.');
      arrays.push(last);
      return jingtongxue.difference(array, ...arrays);
    }
    if (typeof last == "function") {//函数
      var ar = arrays[0].map(it => last(it));
      return array.filter(it => ar.indexOf(last(it)) === -1);
    }
  },

  differenceWith: function (array, other,compert) {//---------------------
      
  },

  every :function(ary,predicate = identity){//-----------------

  },

  matches :function(source){
    //1.
    return function(obj){
      return jingtongxue.isMatch(obj,source);
    }
    //2.
    // return jingtongxue.bind(isMatch,null,window,source);//_表示占位符,并不绑定
  },

  bind:function(func,tihsArg,...fixedargs){
    return function(...args){
      var act = [...fixedargs];
      for(var i = 0;i < act,length;i++){
        if(act[i] = window){
          act[i] = args.shift();
        }
      }
      act.push(...args);
      return func(tihsArg,act);
    }
  },

  
  matchesProperty :function(path,value){
    return function(obj){
      // return get(obj,path) == value;
      return jingtongxue.isEqual(jingtongxue.get(obj,path),value);
    }
  },
  get :function(object,path,defaultVal){//循环法
    if(jingtongxue.toString(path)){
      var path = jingtongxue.toPath(path);
    }
    for(var i = 0;i < path.length;i++){
      if(object === undefined){
        return defaultVal;
      }
      object = object[path[i]];
    }
    return object;
  },
  // get:function(object,path,defaultVal){//递归法
  //   var path = this.topath(path);
  //   if(object === undefined){
  //     return defaultVal;
  //   }
  //   return get(object[path[0]],path.slice(1),defaultVal);
  // },
  isString:function(value){
    if(typeof value == "string"){
      return true 
    }else{
      return false;
    }
  },
  toPath:function(value){//转化 value 为属性路径的数组   'a[0].b.c'
    return value.split(/\.|\[|\]./g);
  },

  property :function(path){
    return function(obj){
      return jingtongxue.get(obj,path);
    }
  },

  isEqual: function (a, b) {//深度对比 
    if (a === b) return true;//类型相同,同为null,同为undefined则返回true  指针相同 2 === 2; ---这步之后,说明二者要么类型不同,要么类型相同值不同,否则为true

    if (a == null || typeof a != "object" ||
      b == null || typeof b != "object") return false;//如果一个为null或一个不为对象则为false.这步之后,说明二者都为非空对象

    let keysA = Object.keys(a), keysB = Object.keys(b);//取二者key值

    if (keysA.length != keysB.length) return false;//key长度不同,则为false

    for (let key of keysA) {//比较value值
      if (!keysB.includes(key) || //判断该keyA的value是否存在于keyB,否则false
       !jingtongxue.isEqual(a[key], b[key])) return false;
    }

    return true;
  },

  isMatch: function (obj, src) {
    for (var key in src) {
      if (typeof src[key] == 'object' && src[key] !== null) {
        if (!this.isMatch(obj[key], src[key])) {
          return false
        }
      } else {
        if (obj[key] !== src[key]) {
          return false;
        }
      }
    }
    return true;
  },

  pull: function (ary, ...values) {
    var va = [...values];
    for (var i = 0; i < va.length; i++) {
      for (var j = 0; j < ary.length; j++) {
        if (va[i] == ary[j]) {
          ary.splice(j, 1);
          j--;
        }
      }
    }
    return ary;
  },
  pullAll: function (ary, values) {
    for (var i = 0; i < values.length; i++) {
      for (var j = 0; j < ary.length; j++) {
        if (values[i] == ary[j]) {
          ary.splice(j, 1);
          j--;
        }
      }
    }
    return ary;
  },
  drop: function (array, n) {//多情况考虑
    if (n == undefined) {//没有填写n时,n默认值为一
      array.splice(0, 1);
      return array;
    } else {//填写n时
      array.splice(0, n);
      return array;
    }
  },
  
  dropRight: function (array, n) {
    var len = array.length;
    if(n == undefined){
      return array.slice(0,len-1);
    }else if(n > len){
      return [];
    }
    return array.slice(0,len - n);
  },
  iterate:function(value){
    if(typeof value == 'string'){
      return jingtongxue.property(value);
    }
    if(typeof value == 'object'){
      return jingtongxue.matches(value);
    }
    if(Array.isArray(value)){
      return jingtongxue.matchesProperty(value);
    }
  },
  dropRightWhile: function (array,predicate) {//-----------------------
    predicate = jingtongxue.iterate(predicate);
  },
  dropWhile :function(array,predicate){
    predicate = jingtongxue.iterate(predicate);
  },

  map :function(array,predicate){
    predicate = jingtongxue.iterate(predicate);
  }

}