/**
 * @description
 * @author cq
 * @Date 2021-03-04 16:16:24
 * @LastEditTime 2021-03-08 19:15:48
 * @LastEditors cq
 */
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
      console.log(this.state, 'resolve');
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
    console.log(this.state);
    if (this.state == 'fulfilled') {
      onFulfilled(this.value);
    }
    if (this.state == 'rejected') {
      onRejected(this.reason);
    }

    // 什么时候会是pedding呢
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

export default MyPromise;
