//call第一版(不传参的情况下可以)
Function.prototype.call1 = function (context) {
    //首先就是要获取调用call的函数,用this可以获取
    context.fn = this;//将函数作为调用对象的属性;
    context.fn();//执行函数;
    delete context.fn;//再删除函数
}

//call第二版(传参的情况下)

//首先解决不定长的参数问题

var args = [];
for (var i = 0; i < arguments.length; i++) {
    args.push('arguments[' + i + ']');
}
// 执行后 args为 ["arguments[1]", "arguments[2]", "arguments[3]"]

//再就是要讲这个参数数组里的参数放到要执行的函数的参数里去
//使用eval方法:该方法会把传入的字符串当作js代码执行


Function.prototype.call2 = function (context) {
    context.fn = this;
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args + ')');
    delete context.fn;
}

//call第三版
Function.prototype.call2 = function (context) {
    var context = context || window;//如果this传入的为null,则this指向window
    context.fn = this;
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result;
}

//实现apply
Function.prototype.apply1 = function (context, arr) {
    var context = context || window;
    context.fn = this;
    var result;
    if (!arr) {//如果没有传入数组
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0; i < arr.length; i++) {
            args.push('arr[' + i + ']');
        }
        var result = eval('context.fn(' + args + ')');

    }
    delete context.fn;
    return result;
}



//new实现

function objectFactory() {
    var obj = new Object();
    var Constructor = [].shift.call(arguments);//获取第一个参数(即需要new的实例)
    obj.__proto__ = Constructor.prototype;//
    Constructor.apply(obj, arguments);//
    return obj;
}


//红绿灯策略

function log() {

}



//拷贝

//浅拷贝

function qian(source) {
    var result = {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            result[key] = source[key];
        }
    }
    return result;
}
//深拷贝
function shen(source, hash = new WeakMap()) {
    if (!isObject(source)) {//非对象返回自身
        return source;
    }
    if (hash.has(source)) {//如果存在于哈希表中
        return hash.get(source);//就返回该值
    }
    var result = Array.isArray(source) ? [] : {};//判断是否为数组
    hash.set(source, result);//哈希表设值;

    let symKeys = Object.getOwnPropertySymbols(source);//查找Symbol;
    if (symKeys.length) {//如果存在Symbol属性
        symKeys.forEach(symKey => {
            if (isObject(source[symKey])) {
                result[symKey] = shen(source[symKey], hash);
            } else {
                result[symKey] = source[symKey];
            }
        })
    }


    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typeof source[key] === 'object') {
                result[key] = shen(source[key], hash);
            } else {
                result[key] = source[key];
            }
        }
    }
    return result;
}

//判断是否为对象
function isObject(obj) {
    return typeof obj === 'object' && obj != null;
}


//实现一个数组
class Ary {
    constructor(len = 0) {
        Object.defineProperty(this, "_length", {
            enumerable: false,
            writable: true,
            value: 0
        })
        for (let i = 0; i < len; i++) {
            this[i] = undefined;
            this._length++;
        }
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this[i];
        }
    }
    set length(len) {
        len = len > 0 ? len : 0;
        while (len > this._length) {
            this.push(undefined);
        }
        while (len < this._length) {
            this.pop();
        }
    }
    get length() {
        return this._length;
    }
    push(...items) {
        for (let i = 0; i < items.length; i++) {
            this[this._length] = items[i];
            this._length++;
        }
        return this;
    }
    pop() {
        let res;
        if (this._length > 0) {
            res = [this._length - 1];
            delete this[this._length - 1];
            this._length--;
        }
        return res;
    }
    slice(start = 0, end = this.length) {
        let res = new Ary();
        start = start > 0 ? start : this.length + start;
        end = end > 0 ? end : this.length + end;
        for (let i = start; i < end; i++) {
            res.push(this[i]);
        }
        return res;
    }
    splice(start, delNums, ...insertItems) {
    }
    forEach(action) {
        for (let i = 0; i < this.length; i++) {
            if (action(this[i]) == false) {
                break;
            }
        }
    }
    includes(item) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] == item) {
                return true;
            }
        }
        return false;
    }
    reduce(fn, initialValue) {
        let start = 0;
        if (initialValue == undefined) {
            initialValue = this[0];
            start++;
        }
        for (let i = start; i < this.length; i++) {
            initialValue = fn(this[i], initialValue, i);
        }
        return initialValue;
    }
    reduceRight(fn, initialValue) {
        let start = this.length - 1;
        if (initialValue == undefined) {
            initialValue = this[start];
            start--;
        }
        for (let i = start; i >= 0; i--) {
            initialValue = fn(this[i], initialValue, i);
        }
        return initialValue;
    }
    every(fn) {
        return this.reduce((cur, pre) => {
            return pre && fn(cur);
        }, true)
    }
    some(fn) {
        return this.reduce((cur, pre) => {
            return pre || fn(cur);
        }, false)
    }
    filter(fn) {
        let res = new Ary();
        this.forEach(it => {
            if (fn(it)) {
                res.push(it);
            }
        })
        return res;
    }
    map(fn) {
        let res = new Ary();
        this.forEach(it => {
            res.push(fn(it));
        })
        return res;
    }
    reverse() {
        let left = 0;
        let right = this.leng;
    }
}

//部分求和的例子  柯里化
function currying(func) { 
    const args = []; 
    return function result(...rest) { 
        if (rest.length === 0) {
            return func(...args);
        } 
        args.push(...rest); 
        return result; 
    } 
} 
const add = (...args) => args.reduce((a, b) => a + b); 
const sum = currying(add); 
sum(1, 2)(3); 
sum(4); 
sum(); // 10
