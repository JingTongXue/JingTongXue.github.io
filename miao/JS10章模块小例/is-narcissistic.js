
var digitWidth = require('digit-width.js');
var power = require('power.js');

module.exports = function isNarcissistic(n){
    var m = n;  

    var width = digitWidth(n);//判断该数是几位数
    var sum = 0;

    while(n > 0){
        var digit = n % 10;
        sum  += power(digit,width);//求各个位的次方
        n = (n - digit) / 10;
    }

    return sum == m;


}































