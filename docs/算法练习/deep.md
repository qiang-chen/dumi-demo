---
order: 2
title: '递归算法'
nav:
  title: 算法练习
  order: 2
---
# 递归集合

## 1、求前一百的和

```js
  const add=(num)=>{
    if(num==1){
      return 1
    }
    return add(num - 1) + num
  }

  console.log(add(100));

```

## 2、求两个数最大公约数

例：48, 57

57 % 48=9，大数对小数求余

48 % 9=3，小数对上次的余数求余，重复这个过程直到余数为0

9 % 3=0，余数为0时，此次求余的小数就是最大公约数 

求两个数的最大公约数 //参数：两个数： //返回值：最大公约数

```js
  // max 是大数 min 是小数
  const commonDivisor = (min, max) => {

    if (max % min) {
      return commonDivisor(max % min, min)
    } else {
      return min
    }
  }

  console.log(commonDivisor(9, 12))
  console.log(commonDivisor(4, 2))
  console.log(commonDivisor(49, 7))
  console.log(commonDivisor(16, 12))

```

## 3、求n的阶乘

假设 写好了一个函数 factorial

  1:1

  2:1*2  ->fn(1)*2

  3:1*2*3 ->fn(2)*3

  4:1*2*3*4 ->fn(3)*4

  ...

  n:1*2*3...*n ->factorial(n-1)*n

```js
  const factorial=(n)=>{
    // 条件是
    if (n == 1) {
      return 1;
    }
    return factorial(n - 1) * n;
  }

  console.log(factorial(2));
  console.log(factorial(3));
  console.log(factorial(4));
  console.log(factorial(100));

```

## 4、青蛙跳

 一只青蛙一次可以跳上1级台阶，也可以跳上2级。
 求该青蛙跳上一个n级的台阶总共有多少种跳法（先后次序不同算不同的结果）。

 ```js
  let reccord = {};
  function jumpFloor(number) {
    // 开局要么先跳1要么2
    if (number === 1) {
      return 1
    }
    if (number === 2) {
      return 2
    }
    console.log(reccord, "reccord");
    if (reccord[number]) {   //最小肯定是3开始计数
      return reccord[number]
    }
    let res = jumpFloor(number - 1) + jumpFloor(number - 2);
    console.log(res, "res", reccord);
    reccord[number] = res
    console.log(reccord, "--");
    return res
  }

  console.log(jumpFloor(5));
 ```
