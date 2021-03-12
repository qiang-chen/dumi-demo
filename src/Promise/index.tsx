/**
 * @description
 * @author cq
 * @Date 2021-01-07 10:16:08
 * @LastEditTime 2021-03-12 20:06:31
 * @LastEditors cq
 */

import React from 'react';
import MyPromise from './myPromise';

const promise: any = new MyPromise((resolve: any, _reject: any) => {
  // setTimeout(() => {
  //   resolve(100);
  // }, 1000);
  resolve(100);
});

promise
  .then((res: any) => {
    return res;
  })
  .then(
    res => {
      console.log(res, '链式');
    },
    err => {
      console.log(err, '链式报错');
    },
  );

const PromiseMy = () => {
  return <h1>look</h1>;
};

export default PromiseMy;
