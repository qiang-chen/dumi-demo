/**
 * @description
 * @author cq
 * @Date 2021-03-04 16:16:24
 * @LastEditTime 2021-03-04 20:21:01
 * @LastEditors cq
 */
class MyPromise {
  state: string;
  reason: any;
  value: any;
  constructor(executor: any) {
    this.state = 'pedding';
    this.value = undefined;
    this.reason = undefined;
    const resolve = (value: any) => {
      if (this.state === 'pedding') {
        this.state = 'fulfilled';
        this.value = value;
      }
    };
    const reject = (reason: any) => {
      if (this.state === 'pedding') {
        this.state = 'rejected';
        this.reason = reason;
      }
    };
    executor(resolve, reject);
  }
  then(onFulfilled: any, onRejected: any) {
    if (this.state == 'fulfilled') {
      onFulfilled(this.value);
    }
    if (this.state == 'rejected') {
      onRejected(this.reason);
    }
  }
}

export default MyPromise;
