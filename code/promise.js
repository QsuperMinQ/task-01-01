/*
 * 将下面的异步代码使用Promise的方法改进
*/

setTimeout(function(){
    var a = '定时器打印：hello';
    setTimeout(function(){
        var b = ' lagou';
        setTimeout(function(){
            var c = ' I ❤️ U';
            console.log(a+b+c)
        }, 1000)
    },1000)
},1000)

new Promise((resolve, project) => {
    resolve('Promise打印：hello');
})
.then(function(value){
    return value + ' lagou'
}).then(function(value){
    console.log(value + ' I ❤️ U') 
})