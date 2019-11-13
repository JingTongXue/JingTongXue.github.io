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
    return array.filter(x => !arrays.flat().includes(x))
  },
  includes: function (coll, value, from) {
    if (typeof coll == "string") {//字符串
      var re = new RegExp(value);
      if (re.test(coll)) {
        return true;
      }
    }
    if (Object.prototype.toString.call(coll) == "[object Array]") {//數組
      if (from > 0) {
        return coll[from] === value;
      }
      for (var co of coll) {
        if (co === value) {
          return true;
        }
      }
    }
    if (Object.prototype.toString.call(coll) == "[object Object]") {//對象
      for (var key in coll) {
        if (coll[key] === value) {
          return true;
        }
      }
    }
    return false;
  },

  differenceBy: function (array, ...values) {//特
    if (Array.isArray(values[values.length - 1])) {
      return array.filter(x => !values.flat().includes(x))
    }
    var iterator = values.pop()
    if (typeof iterator == "function") {
      return array.filter(x => !values.flat().map(it => iterator(it)).includes(iterator(x)))
    }
    if (typeof iterator == "string") {
      return array.filter(it => !values.flat().map(x => x[iterator]).includes(it[iterator]))
    }
    // if (typeof last == "function") {//函数
    //   var ar = values[0].map(it => last(it));
    //   return array.filter(it => ar.indexOf(last(it)) === -1);
    // }
  },

  differenceWith: function (array, other, compert) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
      var temps = false;
      for (var j = 0; j < other.length; j++) {
        if (compert(array[i], other[j])) {
          temps = true;
          break;
        }
        if (!temps) {
          result.push(array[i]);
        }
      }
    }
    return result;
  },

  every: function (ary, predicate) {
    predicate = jingtongxue.iterate(predicate);
    for (var val of ary) {
      if (!(predicate(val))) {
        return false;
      }
    }
    return true;
  },

  matches: function (source) {
    //1.
    return function (obj) {
      return jingtongxue.isMatch(obj, source);
    }
    //2.
    // return jingtongxue.bind(isMatch,null,window,source);//_表示占位符,并不绑定
  },

  bind: function (func, tihsArg, ...fixedargs) {
    return function (...args) {
      var act = [...fixedargs];
      for (var i = 0; i < act, length; i++) {
        if (act[i] = window) {
          act[i] = args.shift();
        }
      }
      act.push(...args);
      return func(tihsArg, act);
    }
  },


  matchesProperty: function (path, value) {
    return function (obj) {
      // return get(obj,path) == value;
      return jingtongxue.isEqual(jingtongxue.get(obj, path), value);
    }
  },
  get: function (object, path, defaultVal) {//循环法
    if (jingtongxue.toString(path)) {
      var path = jingtongxue.toPath(path);
    }
    for (var i = 0; i < path.length; i++) {
      if (object === undefined) {
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
  isString: function (value) {
    if (typeof value == "string") {
      return true
    } else {
      return false;
    }
  },
  toPath: function (value) {//转化 value 为属性路径的数组   'a[0].b.c'
    return value.split(/\.|\[|\]./g);
  },

  property: function (path) {
    return function (obj) {
      return jingtongxue.get(obj, path);
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
    if (n == undefined) {
      return array.slice(0, len - 1);
    } else if (n > len) {
      return [];
    }
    return array.slice(0, len - n);
  },
  iterate: function (value) {
    if (typeof value == 'string') {
      return jingtongxue.property(value);
    }
    if (typeof value == 'object') {
      return jingtongxue.matches(value);
    }
    if (Array.isArray(value)) {
      return jingtongxue.matchesProperty(value);
    }
  },
  dropRightWhile: function (array, predicate = jingtongxue.identity) {
    var res = array.slice();
    if (!jingtongxue.isFunction(predicate)) {
      predicate = jingtongxue.iterate(predicate);
    }
    for (let i = 0; i < array.length; i--) {
      if (predicate(array[i])) {
        return res.slice(0, i - 1);
      }
    }
  },
  isFunction: function (value) {
    return Object.prototype.toString.call(value) == "[object Function]";
  },
  identity: function (...value) {
    return value[0];
  },
  dropWhile: function (array, predicate) {
    predicate = jingtongxue.iterate(predicate);
    for (let i = 0; i < array.length; i++) {
      if (!predicate(array[i], i, array)) {
        return array.slice(i);
      }
    }
  },

  map: function (array, predicate) {
    predicate = jingtongxue.iterate(predicate);
    var result = [];
    for (var i = 0; i < array.length; i++) {
      result.push(predicate(array[i], i, array));
    }
    return result;
  },
  fill: function (array, value, start, end) {
    if (start >= 0 && end >= 0) {
      for (var i = start; i < end; i++) {
        array[i] = value;
      }
    } else {
      for (var i = 0; i < array.length; i++) {
        array[i] = value;
      }
    }
    return array;
  },
  findIndex: function (array, predicate = jingtongxue.identity, fromIndex = 0) {
    predicate = jingtongxue.iterate(predicate);
    for (let i = fromIndex; i < array.length; i++) {
      if (predicate(array[i])) {
        return i;
      }
    }
    return -1;
  },
  findLastIndex: function (array, predicate = jingtongxue.identity, fromIndex = array.length - 1) {
    predicate = jingtongxue.iterate(predicate);
    for (let i = fromIndex; i >= 0; i--) {
      if (predicate(array[i])) {
        return i;
      }
    }
    return -1;
  },
  flatten: function (array) {
    var result = [];
    for (var ary of array) {
      if (Object.prototype.toString.call(ary) == "[object Array]") {
        for (var ar of ary) {
          result.push(ar);
        }
      } else {
        result.push(ary);
      }
    }
    return result;
  },
  flattenDeep: function (array, result = []) {
    for (var ary of array) {
      if (Object.prototype.toString.call(ary) == "[object Array]") {
        jingtongxue.flattenDeep(ary, result);
      } else {
        result.push(ary);
      }
    }
    return result;
  },
  flattenDepth: function (array, depth, result = []) {
    for (var ary of array) {
      if (Object.prototype.toString.call(ary) == "[object Array]" && depth != 0) {
        jingtongxue.flattenDepth(ary, depth - 1, result);
      } else {
        result.push(ary);
      }
    }
    return result;
  },
  fromPairs: function (pairs) {
    var result = {};
    for (var pari of pairs) {
      result[pari[0]] = pari[1];
    }
    return result;
  },
  head: function (array) {
    var len = array.length;
    return len == 0 ? undefined : array[0];
  },
  indexOf: function (array, value, fromIndex = 0) {
    if (jingtongxue.isNaN(value)) {
      for (var i = 0; i < array.length; i++) {
        if (isNaN(array[i])) {
          return i;
        }
      }
      return -1;
    }
    for (let i = fromIndex; i < array.length; i++) {
      if (array[i] == value) {
        return i;
      }
    }
    return -1
  },
  initial: function (array) {
    // array.pop();
    // return array;
    return array.slice(0, array.length - 1);
  },
  isNaN: function (value) {
    return jingtongxue.isNumber(value) && +value !== value;
  },
  isNative: function (value) {

  },
  isNil: function (value) {
    return value == null || value == undefined;
  },
  isNull: function (value) {
    return value === null;
  },
  isNumber: function (value) {
    return Object.prototype.toString.call(value) === "[object Number]" || Object.prototype.toString.call(value) === "[object Null]";
  },
  isObject: function (value) {
    return value instanceof Object;
  },
  isObjectLike: function (value) {
    return value != null && typeof value == "object";
  },
  isRegExp: function (value) {
    return Object.prototype.toString.call(value) == "[object RegExp]";
  },
  isSafeInteger: function (value) {//~V~
    return Number.isSafeInteger(value);
  },
  isSet: function (value) {
    return Object.prototype.toString.call(value) == "[object Set]";
  },
  isString: function (value) {
    return Object.prototype.toString.call(value) == "[object String]";
  },
  isSymbol: function (value) {
    return Object.prototype.toString.call(value) == "[object Symbol]";
  },
  isUndefined: function (value) {
    return Object.prototype.toString.call(value) == "[object Undefined]";
  },

  reverse: function (array) {
    var ary = [];
    for (var i = array.length - 1; i >= 0; i--) {
      ary.push(array[i]);
    }
    return ary;
  },
  intersection: function (...arrays) {
    var ary = arrays[0];
    var result = [];
    var de = false;
    for (var i = 0; i < ary.length; i++) {
      for (var j = 1; j < arrays.length; j++) {
        if (arrays[j].indexOf(ary[i]) == -1) {
          break;
        }
        de = true;
        if (de && result.length == 0) {
          result.push(ary[i]);
        }
      }
    }
    return result;
  },
  join: function (array, separator) {
    var str = "";
    for (var i = 0; i < array.length; i++) {
      if (i == array.length - 1) {
        str += "" + array[i];
      } else {
        str += "" + array[i] + separator
      }
    }
    return str;
  },
  last: function (array) {
    return array[array.length - 1];
  },
  lastIndexOf: function (array, value, ) {
    if (jingtongxue.isNaN(value)) {
      for (var i = 0; i < array.length; i++) {
        if (isNaN(array[i])) {
          return i;
        }
      }
      return -1;
    }
    for (let i = fromIndex; i < array.length; i--) {
      if (array[i] == value) {
        return i;
      }
    }
    return -1
  },
  sortedIndex: function (array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] < value) {
        return i + 1;
      }
    }
  },
  union: function (...arrays) {
    let result = [];
    for (let i = 0; i < arrays.length; i++) {
      let array = arrays[i];
      for (let j = 0; j < array.length; j++) {
        if (!jingtongxue.includes(result, array[j])) {//如果该数不存在新建数组result中,则push进去
          result.push(array[j]);
        }
      }
    }
    return result;
  },
  unionBy: function (...arrays) {
    let iteratee = arrays.pop();//迭代函数
    let array = arrays.reduce((pre, cur) => pre.concat(cur));//将所有数组合并
    let map = [];
    let ary = [];
    if (Object.prototype.toString.call(iteratee) === "[object Function]") {
      for (let a of array) {
        let newItem = iteratee(a);
        if (!jingtongxue.includes(map, newItem)) {
          map.push(newItem);
          ary.push(a);
        }
      }
      return ary;
    }
    if (Object.prototype.toString.call(iteratee) === "[object String]") {
      for (let a of array) {
        if (!jingtongxue.includes(map, a.iteratee)) {
          map.push(a.iteratee);
          ary.push(a);
        }
      }
      return ary;
    }
  },
  uniq: function (array) {
    let ary = [];
    for (let a of array) {
      if (ary.indexOf(a) == -1) {
        ary.push(a);
      }
    }
    return ary;
  },
  uniqBy:function(array,iteratee) {
    // let iteratee = array.pop();
    let map = [];
    let ary = [];
    if (Object.prototype.toString.call(iteratee) === "[object Function]") {
      for(let a of array) {
        let newItem = iteratee(a);
        if (!jingtongxue.includes(map, newItem)) {
          map.push(newItem);
          ary.push(a);
        }
      }
      return ary;
    }
    if (Object.prototype.toString.call(iteratee) === "[object String]") {
      for(let a of array) {
        if (!jingtongxue.includes(map, a[iteratee])) {
          map.push(a[iteratee]);
          ary.push(a);
        }
      }
      return ary;
    }
  },
  unzip: function(arrays){
    let len = arrays[0].length;//新建二维数组的长度就是数组的子数组的长度
    let newAry = new Array(len).fill(0).map(it => it = new Array(arrays.length));
    for(let i = 0;i < newAry.length;i++){
      for(let j = 0;j < arrays.length;j++){
        newAry[i][j] = arrays[j][i];
      }
    }
    return newAry;
  },
  without:function(array,...values){
    var result = [];
    for(var a of array){
      if(!jingtongxue.includes(values,a)){
        result.push(a);
      }
    }
    return result;
  },
  zip: function(...arrays){
    //输入的子数组长度可能不一,取最大长度的子数组
    let maxLen = arrays.reduce((prev,curArr) => Math.max(prev,curArr.length),0);
    //新建一个二维数组,数组长度为子数组最大长度,子数组长度为输入数组的长度
    let newAry = new Array(maxLen).fill(0).map(it => it = new Array(arrays,length));
    for(let i = 0;i < newAry.length;i++){
      for(let j = 0;j < arrays.length;j++){
        newAry[i][j] = arrays[j][i];
      }
    }
    return newAry; 
  },


}