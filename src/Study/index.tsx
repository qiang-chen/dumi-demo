/**
 * @description
 * @author cq
 * @Date 2021-01-07 10:16:08
 * @LastEditTime 2021-03-19 17:42:24
 * @LastEditors cq
 */

import React from 'react';
import MyPromise from './myPromise';
import generator from './generator';

generator();

// const promise: any = new MyPromise((resolve: any, reject: any) => {
// setTimeout(() => {
//   resolve(100);
// }, 1000);
//  setTimeout(() => {
//    resolve(1000);
//    resolve(300);
//  }, 3000);
// });

// function p() {
//   return new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       reject(2);
//     }, 2000);
//   });
// }

// p().then(res=>{
//   console.log(res);
// }).catch(c=>{
//   console.log(222);
//   console.error(c,"c");

// })

function test(value: any) {
  return new MyPromise((resolve: any, reject: any) => {
    resolve(value);
  });
}

function test1(value: any) {
  return new Promise((resolve: any, reject: any) => {
    reject(value);
  });
}

function test2(value: any) {
  return new MyPromise((resolve: any, reject: any) => {
    setTimeout(() => {
      reject(value);
    }, 2000);
  });
}

function test3(value: any) {
  return new MyPromise((resolve: any, reject: any) => {
    setTimeout(() => {
      reject(value);
    }, 1000);
  });
}

function test4(value: any) {
  return new MyPromise((resolve: any, reject: any) => {
    setTimeout(() => {
      reject(value);
    }, 4000);
  });
}

// promise.all([
//   test2(2),
//   test3(3),
//   test(1),
// ]).then((res: any)=>{
//   console.log(res);
// },(err: any)=>{
//   console.error(err)
// })

// promise
//   .then((res: any) => {
//     console.log(res);
//     return res;
//   },
//     err => {
//       return err
//     })
//   .then(
//     res => {
//       console.log(res, '链式');
//     },
//     err => {
//       console.log(err, '链式报错');
//     },
//   );

// promise.race([test2(2), test3(3), test4(1)]).then(
//   (res: any) => {
//     console.log(res);
//   },
//   (err: any) => {
//     console.error(err);
//   },
// );

const PromiseMy = () => {
  return <h1>look</h1>;
};

export default PromiseMy;
