/**
 * @description
 * @author cq
 * @Date 2021-01-07 10:16:08
 * @LastEditTime 2021-03-18 21:02:17
 * @LastEditors cq
 */

import React from 'react';
import MyPromise from './myPromise';

const promise: any = new MyPromise((resolve: any, reject: any) => {
  // setTimeout(() => {
  //   resolve(100);
  // }, 1000);
  //  setTimeout(() => {
  //    resolve(1000);
  //    resolve(300);
  //  }, 3000);
});

function p() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject(2);
    }, 1000);
  });
}

MyPromise.reject(p()).then(
  (data: any) => {
    console.log(data);
  },
  err => {
    console.error(err);
  },
);

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
