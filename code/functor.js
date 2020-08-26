const fp = require('lodash/fp');
const {Maybe, Container} = require('./support');

/*
 * 练习1: 使用fp.add(x,y)和fp.map(f,x)创建一个能让functor里的值增加的函数ex1
*/

let maybe = Maybe.of([5,6,1]);

// increment 增量
// let ex1 = increment => {
//     return(
//         maybe.map(value => {
//             let r = fp.map(function(item){ 
//                 return fp.add(item, increment)
//             }, value)
//             console.log(r)
//             return r
//         })
//     )
// }

// increment 增量
let ex1 = increment => {
    let _add = fp.add(increment);
    let _addMap = value => fp.map(item => _add(item), value);
    return (
        maybe.map(_addMap)
    )
}

console.log(ex1(2));

/*
 * 练习2: 实现一个函数ex2，能够使用fp.first获取列表的第一个元素
*/

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);

let ex2 = () => {
    return (
        xs.map(value => {
            return fp.first(value)
        })
    )
}

console.log(ex2());

/*
 *  练习3: 实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母
*/

let safeProp = fp.curry(function(x, o){
    return Maybe.of(o[x])
})

let user = {id: 2, name: 'Albert'};
let ex3 = user => {
    let name = safeProp('name', user)
    return (
        name.map(value => {
            let arr = fp.split('', value);
            return fp.first(arr)
        })
    )
}
console.log(ex3(user));

/*
 * 练习4: 使用Maybe重写ex4，不要使用if语句
*/


let ex4 = n => {
    let maybe = Maybe.of(n);
    return maybe.map(v => parseInt(v))
}

console.log(ex4('88'), ex4(null), ex4());
