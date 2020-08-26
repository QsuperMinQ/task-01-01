/*
 * 手写实现MyPromise源码
 * 要求：尽可能的还原Promise中的每一个API，并通过注视的方式描述思路和原理
*/

const { reject } = require("lodash");
const { add } = require("lodash/fp");

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(excutor) {
    try {
      excutor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  };
  // promise 状态
  status = PENDING;
  // 成功后的结果值
  value = undefined;
  //失败后的原因
  reason = undefined;
  // 成功回调的数组
  successCallback = [];
  // 失败回调的数组
  failCallback = [];

  // resolve,reject使用箭头函数的原因是，保证this指向当前promise
  resolve = value => {
    // 判断promise当前状态，只有在不是pending的状态下，才能向后执行
    if (this.status !== PENDING) return;
    // 更改状态为成功
    this.status = FULFILLED;
    // 把成功之后的结果保存
    this.value = value;
    // 判断成功回调是否存在，存在的话就调用
    while(this.successCallback.length) this.successCallback.shift()()
  }

  reject = reason => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    while(this.failCallback.length) this.failCallback.shift()()
  }

  then (successCallback, failCallback) {
    // then方法的参数是可选的，可选参数处理
    successCallback = successCallback ? successCallback : value => value;
    failCallback = failCallback ? failCallback : reason => { throw reason };

    let promise2 = new MyPromise((resolve, reject)=> {
      // 判断promise状态，执行相应的回调函数，并把相应的结果传递给函数
      if (this.status === FULFILLED) {
        // 此处的定时器是为了在实例化完成之后获取到promise2
        setTimeout(() => {
          try {
            let x = successCallback(this.value);
            resolvePromise(promise2, x,resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0)

      } else if (this.status === REJECTED){   
        // 此处的定时器是为了在实例化完成之后获取到promise2
        setTimeout(() => {
          try {
            let x = failCallback(this.reason);;
            resolvePromise(promise2, x,resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0)
      } else {
        // 在push成功或失败回调的时候，进行一系列处理，捕获异常、解析promise
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value);
              resolvePromise(promise2, x,resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0)
        });
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason);;
              resolvePromise(promise2, x,resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0)
        });
      }
    })
    return promise2;
  }

  finally (callback) {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      return MyPromise.resolve(callback()).then(() => {throw reason}) 
    })
  } 
 
  catch(failCallback) {
    return this.then(undefined, failCallback)
  }

  static all (array ) {
    let result = [];
    let index = 0;

    return new MyPromise((resolve, reject) => {
      function addData(k, v) {
        result[k] = v;
        index++;
        if(index === array.length){
          resolve(result)
        }
      }
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if(element instanceof MyPromise){
          element.then(v => addData(i, v), r => reject(r))
        } else {
          // 普通值
          addData(i, element)
        }
      }
    })

  }

  static resolve (value){
    // 静态方法，判断传入的值的类型，如果是实例对象，直接返回，
    // 否则，返回实例化对象，用resolve方法处理value
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value))
  }

}

function resolvePromise(promise2, x, resolve, reject){
  if(promise2 === x){
    return reject(new Error('Chaining cycle detected for promise #<Promise>'))
  }

  // 判断x是promise对象还是普通值，promise对象直接调用then处理，普通值调用resolve
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}

module.exports = MyPromise;

let p1 = new MyPromise(function(resolve, reject){
  setTimeout(function(){
    resolve('p1成功的结果')
    // reject('p1失败的原因')
  }, 1000)
})

let p2 = new MyPromise(function(resolve, reject) {
  resolve('p2成功的结果');
  // reject('p2失败的原因')
})
let p3 = new MyPromise(function(resolve, reject) {
  // resolve('p3成功的结果');
  reject('p3失败的原因')
})

p1.then(function(v){
  console.log('第一个then中的成功回调', v)
  // return promise;
},function(r){
  console.log('第一个then中的失败回调',r)
})

p1.then(function(v){
  console.log('第二个then中的成功回调',v)
},function(r){
  console.log('第二个then中的失败回调',r)
})

p3.catch(r => {console.log(r)})

MyPromise.all(['1','2',p1, p2,'3']).then(v => {console.log(v)})