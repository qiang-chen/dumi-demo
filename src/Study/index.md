---
nav:
  title: Study
  path: /study
  order: 4
---

# Study

## promise 封装

### 只支持 resolve 和 reject 以及异步操作

```js
class MyPromise {
  state: string;
  reason: any;
  value: any;
  onSolveCallback: any[];
  onRejectCallback: any[];
  constructor(executor: any) {
    this.state = 'pedding';
    this.value = undefined;
    this.reason = undefined;
    //需要发布订阅者来处理异步
    this.onSolveCallback = [];
    this.onRejectCallback = [];
    const resolve = (value: any) => {
      if (this.state === 'pedding') {
        this.state = 'fulfilled';
        this.value = value;
      }
      // 发布订阅调用
      this.onSolveCallback.forEach(fn => fn());
      this.onRejectCallback.forEach(fn => fn());
    };
    const reject = (reason: any) => {
      if (this.state === 'pedding') {
        this.state = 'rejected';
        this.reason = reason;
      }
    };
    executor(resolve, reject);
  }
  // 接受两个参数  成功回调和失败回调
  then(onFulfilled: any, onRejected: any) {
    // 解决同步的执行
    if (this.state == 'fulfilled') {
      onFulfilled(this.value);
    }
    if (this.state == 'rejected') {
      onRejected(this.reason);
    }

    // 什么时候会是pedding呢  异步调用的时候就会触发下述的发布订阅模式
    // 当resolve在一个异步里面触发的时候 此时.then同步执行过来了就是一个pedding
    // 那么我们不应该立马触发 将其储存起来 等待resolve或者reject执行的时候在触发
    if (this.state == 'pedding') {
      this.onSolveCallback.push(() => {
        typeof onFulfilled == 'function' && onFulfilled(this.value);
      });
      this.onRejectCallback.push(() => {
        typeof onRejected == 'function' && onRejected(this.reason);
      });
    }
  }
}
```

### then 和 all 和 reace 方法实现

```ts
let flag = false; // 加个开关  防止成功或者失败一起调用

const resolvePromise = (
  promise2: any,
  x: any,
  resolve: any,
  reject: (arg0: string) => void,
) => {
  // 在这个函数里面需要做的事情就是 调用resolve或者reject
  // 将x的值传出去
  // 但是 x不能等于promise2本身  否则报错

  if (promise2 == x) {
    return reject('不能等于自己本身');
  }

  // 当x是一个promise怎么办  我们需要执行这个promise然后在他的then里面去执行resolve
  if (typeof x == 'object' && typeof x !== null && typeof x == 'function') {
    try {
      // 防止x身上没有then方法从而报错
      let then = x.then;
      if (flag) {
        return;
      }
      flag = true;
      then.call(
        x,
        (res: any) => {
          resolvePromise(promise2, res, resolve, reject);
        },
        (err: any) => {
          let then = x.then;
          if (flag) {
            return;
          }
          flag = true;
          reject(err);
        },
      );
    } catch (error) {
      let then = x.then;
      if (flag) {
        return;
      }
      flag = true;
      reject(error);
    }
  } else {
    // 当 x是普通值也好办  直接resolve出去就OK了

    // 可能大家会问 为什么这里不是reject
    // 原声的promise就是不管在then的第一个函数还是第二个函数return出去的值
    // 都将在外层的then第一个函数返回
    if (flag) {
      return;
    }
    flag = true;
    resolve(x);
  }
};

class MyPromise {
  state: string;
  reason: any;
  value: any;
  onSolveCallback: any[];
  onRejectCallback: any[];
  constructor(executor: any) {
    this.state = 'pedding';
    this.value = undefined;
    this.reason = undefined;
    //需要发布订阅者来处理异步
    this.onSolveCallback = [];
    this.onRejectCallback = [];
    const resolve = (value: any) => {
      if (this.state === 'pedding') {
        this.state = 'fulfilled';
        this.value = value;
      }
      // 发布订阅调用
      this.onSolveCallback.forEach(fn => fn());
    };
    const reject = (reason: any) => {
      if (this.state === 'pedding') {
        this.state = 'rejected';
        this.reason = reason;
      }
      this.onRejectCallback.forEach(fn => fn());
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  // 接受两个参数  成功回调和失败回调
  then(onFulfilled: any, onRejected: any) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (data: any) => data;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err: any) => {
            throw err;
          };
    // then函数 都支持链式调用的  所以我们应该return 出去我们的promise
    let promise2 = new MyPromise((resolve: any, reject: any) => {
      // 解决同步的执行
      if (this.state == 'fulfilled') {
        // 我们then函数的return 值会在下一次的then执行

        // 失败就进入失败的函数 成功就进入成功的函数

        //不管then的第一个成功还是第二个失败函数 都是相同逻辑
        // 需要将其返回值执行并抛出去
        // 所以我们将其封装出去

        setTimeout(() => {
          // 定时器的目的是为了拿到promise2
          try {
            // 外层 try catch 是捕获不到异步队列里面的报错的
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            // 报错情况直接返回对应报错原因就ok了
            reject(error);
          }
        }, 0);
      }
      if (this.state == 'rejected') {
        setTimeout(() => {
          // 定时器的目的是为了拿到promise2
          try {
            // 外层 try catch 是捕获不到异步队列里面的报错的
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            // 报错情况直接返回对应报错原因就ok了
            reject(error);
          }
        }, 0);
      }

      // 什么时候会是pedding呢  异步调用的时候就会触发下述的发布订阅模式
      // 当resolve在一个异步里面触发的时候 此时.then同步执行过来了就是一个pedding
      // 那么我们不应该立马触发 将其储存起来 等待resolve或者reject执行的时候在触发
      if (this.state == 'pedding') {
        this.onSolveCallback.push(() => {
          setTimeout(() => {
            // 定时器的目的是为了拿到promise2
            try {
              // 外层 try catch 是捕获不到异步队列里面的报错的
              let x =
                typeof onFulfilled == 'function' && onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              // 报错情况直接返回对应报错原因就ok了
              reject(error);
            }
          }, 0);
        });
        this.onRejectCallback.push(() => {
          setTimeout(() => {
            // 定时器的目的是为了拿到promise2
            try {
              // 外层 try catch 是捕获不到异步队列里面的报错的
              let x =
                typeof onRejected == 'function' && onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              // 报错情况直接返回对应报错原因就ok了
              reject(error);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  // values就是一个promise的数组
  all(values: any[]) {
    // 创造一个存放结果的promise数组
    const allAll = new Array(values.length);
    let resolvedCount = 0; //计状态为resolved的promise的数量
    return new MyPromise((resolve: any, reject: any) => {
      values.forEach((element, index) => {
        // element 为每一个promise的对象或者是同步代码数字  将其执行
        if (element instanceof MyPromise) {
          element.then(
            (res: any) => {
              allAll[index] = res;
              resolvedCount++;
              if (resolvedCount == values.length) {
                resolve(allAll);
              }
            },
            (err: any) => {
              reject(err);
            },
          );
        } else {
          resolvedCount++;
          allAll[index] = element;
        }
      });
    });
  }
  race(values: any[]) {
    // 接受的也是一个promise对象  谁执行快返回谁就OK了
    let flag = false;
    return new MyPromise((resolve: any, reject: any) => {
      values.forEach((element, index) => {
        // element 为每一个promise的对象或者是同步代码数字  将其执行
        if (element instanceof MyPromise) {
          element.then(
            (res: any) => {
              if (flag) return;
              flag = true;
              resolve(res);
            },
            (err: any) => {
              if (flag) return;
              flag = true;
              reject(err);
            },
          );
        } else {
          if (flag) return;
          flag = true;
          resolve(element);
        }
      });
    });
  }
}
```

## generator 使用

### 下述代码打印什么

```js
function* read() {
  let a = yield 'hellow';
  console.log(a);
  let b = yield 'word';
  console.log(b);
}

const it = read(); //屁都不会打印  到了yield "hellow"就会停止
// console.log(it.next())
it.next(); // 执行到了yield "word";
it.next(); // 声明a 然后 打印 undefined
it.next(); //声明b 然后打印 undefined

// 加入 第二个it.next(1) 传入值会把这个值传给a
//第三个同理传给b
```

```tsx
import React from 'react';
import { Study } from 'dumi-demo';

export default () => <Study />;
```

More skills for writing demo: https://d.umijs.org/guide/demo-principle
