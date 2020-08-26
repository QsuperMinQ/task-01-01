const fp = require('lodash/fp');

/*
 * 数据
 * horsepower 马力，dollar_value 价格，in_stock 库存
*/

const cars = [
    { name: 'Ferrari FF', horsepowe: 660, dollar_value: 700000, in_stock: true },
    { name: 'Spyker C12 zagato', horsepowe: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepowe: 550, dollar_value: 132648000, in_stock: false },
    { name: 'Audi R8', horsepowe: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Mattin One-77', horsepowe: 750, dollar_value: 1850000, in_stock: true },
    { name: 'Pagani Huayra', horsepowe: 700, dollar_value: 1300000, in_stock: false },
]

/*
 * 练习1: 使用函数组合fp.flowRight()实现下面的这个函数
*/

let _last = function(arr){
    return fp.last(arr)
}

let _propStock = function(data){
    return fp.prop('in_stock', data);
}

let isLastInStockNew = fp.flowRight(_propStock, _last);

console.log('最后一条数据的in_stock:', isLastInStockNew(cars))

/*
 * 练习2: 使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的属性name
*/

let _first = function(arr){
    return fp.first(arr);
}

let _propName = function(data) {
    return fp.prop('name', data)
}

let fisrCarName = fp.flowRight(_propName, _first);

console.log('第一条数据car的name:', fisrCarName(cars))

/*
 * 练习3: 使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现
*/

let _average = function(xs) {
    return fp.reduce(fp.add, 0, xs)/xs.length
}

let _getArr = function(cars) {
    return fp.map(car => car.dollar_value, cars)
}

let averageDollarValue = fp.flowRight(_average, _getArr)

console.log(averageDollarValue(cars))

/*
 * 练习4: 使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，
         把数组中的name转换为这种形式：例如，sanitizeNames(['Hello World']) => ['hello_world']
*/

let _underscore = fp.replace(/\W+/g, '_');

let _lowerCase = fp.lowerCase;

let _lowerArr = arr => fp.map(_lowerCase,arr);

let _underArr = arr => fp.map(_underscore, arr);

let sanitizeNames = fp.flowRight(_underArr, _lowerArr);

console.log(sanitizeNames(['Hello World', 'Happy Birthday', 'Happy New Year']))

