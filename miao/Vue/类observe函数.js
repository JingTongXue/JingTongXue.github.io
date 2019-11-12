function observe(obj) {
    for (let prop in obj) {
        let val = obj[prop];
        if (typeof val == "object") {
            observe(val);
        }
        Object.defineProperty(obj, prop, {
            get: function () {
                return val;
            },
            set: function (value) {
                if (typeof value == 'object') {
                    value = observe(value);
                }
                val = value;
            }
        })
    }
    return obj;
}

var obj = {
    a: 1,
    b: 2,
    c: {
        x: 1,
        y: 2,
    }
}


obj.b = { post: 1, get: 2 };
obj.a = 1;
obj.a     