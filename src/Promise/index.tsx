/**
 * @description
 * @author cq
 * @Date 2021-01-07 10:16:08
 * @LastEditTime 2021-03-04 20:15:34
 * @LastEditors cq
 */

import React from 'react';
import MyPromise from './myPromise';

const promise: any = new MyPromise((resolve: any, reject: any) => {
  resolve(100);
});

promise.then((res: any) => {
  console.log(res);
});

const Promise = () => {
  return <h1>Promise</h1>;
};

export default Promise;
