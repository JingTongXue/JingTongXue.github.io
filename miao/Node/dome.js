import { rejects } from "assert";

async function forAwait(asyncIterator, body) {
    var generated = asyncIterator.next();
    if (!generated.done) {
        var val = await generated.value;
        body(val);
    }

}

forAwait(asyncIterator, val => {

})



Array.prototype.asyncForEach = async function (f) {

}




function jsonp(url, data) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script')
        var callbackName = 'JSONP_CALLBACK_' + Date.now() + Math.random().toString(16).slice(2)

        url = url + '?' + [...Object.entries(data)].map(pair => {
            return pair.join('=')
        }).join('&') + '&callback=' + callbackName


        window[callbackName] = function (data) {
            delete window[callbackName]
            document.head.removeChild(script)
            resolve(data)
        }

        script.src = url

        script.onerror = function (e) {
            delete window[callbackName]
            document.head.removeChild(script)
            reject(e)
        }

        document.head.appendChild(script)
    })
}
