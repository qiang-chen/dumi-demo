/**
 * @description
 * @author cq
 * @Date 2021-01-07 10:16:08
 * @LastEditTime 2021-03-08 18:43:41
 * @LastEditors cq
 */

import React from 'react';
import MyPromise from './myPromise';

const promise: any = new MyPromise((resolve: any, reject: any) => {
  setTimeout(() => {
    resolve(100);
  }, 1000);
});

promise.then((res: any) => {
  console.log(res);
});

const Promise = () => {
  return <h1>look</h1>;
};

export default Promise;
