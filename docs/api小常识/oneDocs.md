---
order: 1
title: 'js小方法'
nav:
  title: api小常识
  order: 1
---

# API 集中训练营

## 1、实现一串长数字的划分

### method 1

```js
function formatPrice(price) {
  return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
```

### method 2

```js
function formatPrice(price) {
  return String(price)
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev;
    });
}
```

### method 3

```js
(999999999).toLocaleString();
const options = {
  style: 'currency',
  currency: 'CNY',
};
(123456).toLocaleString('zh-CN', options); // ¥123,456.00
```

## 2、手机号脱敏处理

```js
const encryptReg = (before = 3, after = 4) => {
  return new RegExp('(\\d{' + before + '})\\d*(\\d{' + after + '})');
};

'13456789876'.replace(encryptReg(), '$1****$2'); //"134****9876"
```

## 3、js 丢失精度问题解决方案

```js
var calc = {
  /*
      函数，加法函数，用来得到精确的加法结果  
      说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
      参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
      调用：Calc.Add(arg1,arg2,d)  
      返回值：两数相加的结果
      */
  Add: function(arg1, arg2) {
    (arg1 = arg1.toString()), (arg2 = arg2.toString());
    var arg1Arr = arg1.split('.'),
      arg2Arr = arg2.split('.'),
      d1 = arg1Arr.length == 2 ? arg1Arr[1] : '',
      d2 = arg2Arr.length == 2 ? arg2Arr[1] : '';
    var maxLen = Math.max(d1.length, d2.length);
    var m = Math.pow(10, maxLen);
    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
    var d = arguments[2];
    return typeof d === 'number' ? Number(result.toFixed(d)) : result;
  },
  /*
      函数：减法函数，用来得到精确的减法结果  
      说明：函数返回较为精确的减法结果。 
      参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
      调用：Calc.Sub(arg1,arg2)  
      返回值：两数相减的结果
      */
  Sub: function(arg1, arg2) {
    return Calc.Add(arg1, -Number(arg2), arguments[2]);
  },
  /*
      函数：乘法函数，用来得到精确的乘法结果  
      说明：函数返回较为精确的乘法结果。 
      参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
      调用：Calc.Mul(arg1,arg2)  
      返回值：两数相乘的结果
      */
  Mul: function(arg1, arg2) {
    var r1 = arg1.toString(),
      r2 = arg2.toString(),
      m,
      resultVal,
      d = arguments[2];
    m =
      (r1.split('.')[1] ? r1.split('.')[1].length : 0) +
      (r2.split('.')[1] ? r2.split('.')[1].length : 0);
    resultVal =
      (Number(r1.replace('.', '')) * Number(r2.replace('.', ''))) /
      Math.pow(10, m);
    return typeof d !== 'number'
      ? Number(resultVal)
      : Number(resultVal.toFixed(parseInt(d)));
  },
  /*
      函数：除法函数，用来得到精确的除法结果  
      说明：函数返回较为精确的除法结果。 
      参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
      调用：Calc.Div(arg1,arg2)  
      返回值：arg1除于arg2的结果
      */
  Div: function(arg1, arg2) {
    var r1 = arg1.toString(),
      r2 = arg2.toString(),
      m,
      resultVal,
      d = arguments[2];
    m =
      (r2.split('.')[1] ? r2.split('.')[1].length : 0) -
      (r1.split('.')[1] ? r1.split('.')[1].length : 0);
    resultVal =
      (Number(r1.replace('.', '')) / Number(r2.replace('.', ''))) *
      Math.pow(10, m);
    return typeof d !== 'number'
      ? Number(resultVal)
      : Number(resultVal.toFixed(parseInt(d)));
  },
};
```

## 4、setInterval 的缺陷

首先，先模拟一段堵塞场景

```js
let startTime = new Date().getTime();
console.log('初试时间', new Date());
let count = 0;
// 耗时任务
setInterval(function() {
  let i = 0;
  while (i++ < 1000000000);
}, 0);

setInterval(function() {
  count++;
  console.log(
    '与原设定的间隔时差了：',
    new Date().getTime() - (startTime + count * 1000),
    '毫秒',
  );
  // console.log("当前时间", new Date());
}, 1000);

// 与原设定的间隔时差了： 1157 毫秒
// 与原设定的间隔时差了： 2344 毫秒
// 与原设定的间隔时差了： 3506 毫秒
// 与原设定的间隔时差了： 4613 毫秒
// 与原设定的间隔时差了： 5715 毫秒
```

    由打印结果可得  第二个定时任务并不是一秒执行一次的，并且时间差越来越大了。
    实际场景并不会有人这么去做，但是定时器中去发布请求以及操作dom同样会造成这种误差出现的
    当然上述代码是通过一个一个异步任务的阻塞演示的，
    在这一篇简短的文件并不能模拟这种场景 但是完全可以把上面的阻塞当成请求或者dom操作来模拟

```js
let startTime = new Date().getTime();
let count = 0;

setInterval(() => {
  let i = 0;
  while (i++ < 10000000); // 假设的网络延迟或者操作大量的dom
  count++;
  console.log(
    '与原设定的间隔时差了：',
    new Date().getTime() - (startTime + count * 1000),
    '毫秒',
  );
}, 1000);
```

为什么会造成这种问题呢？？？

> > 定时器指定的时间间隔，表示的是何时将定时器的代码添加到消息队列，而不是何时执行代码。
> > 所以真正何时执行代码的时间是不能保证的，取决于何时被主线程的事件循环取到，并执行。
> > 换取话说就是上面的代码每隔一秒钟把定时器的函数放在了异步任务去执行了
> > 但是由于函数里面的内容不同 什么时候执行完毕呢 这个并不能保证
> > 这也说明我们通过 setInterval 去做一些精准的请求不能往往会出现误差的

那么无解了嘛,当前不是喽 可以用 setTimeout 替换 setInterval。

    每个 setTimeout 产生的任务会直接 push 到任务队列中；
    而 setInterval 在每次把任务 push 到任务队列前，
    都要进行一下判断(看上次的任务是否仍在队列中，如果有则不添加，没有则添加)。

下面就是实现过程

```js
let timer = null;
function interval(func, wait) {
  let interv = function() {
    func.call(null);
    timer = setTimeout(interv, wait);
  };
  timer = setTimeout(interv, wait);
}

interval(function() {
  let i = 0;
  while (i++ < 10000000);
  console.log('当前时间', new Date());
}, 1000);

// 终止
if (timer) {
  window.clearSetTimeout(timer);
  timer = null;
}
```

## 5、react 错误捕获

React 的生命周期函数 ComponentDidCatch 可以捕获子组件的异常。因此，可以在根组件外包裹一个组件来处理错误。如:

```js
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    // 处理异常
  }
}

//使用

<ErrorBoundary>
  <App />
</ErrorBoundary>;
```

## Vue 错误捕获

```js
app.config.errorHandler = (err, vm, info) => {
  // 处理异常
};
```
