---
nav:
  title: ReactStudy
  path: /ReactStudy
  order: 5
---

# react-study

## context 使用

- 注意 在 Provider 的 value 中不能直接引用类型，否则会因为 diff 算法在不停的刷新
- 从而导致重复渲染，应该使用 state 的值来控制

```tsx
import React from 'react';
import { Context } from 'dumi-demo';

export default () => <Context />;
```

## 手写 rc-form

```tsx
import React from 'react';
import { MyForm } from 'dumi-demo';

export default () => <MyForm />;
```

## redux 源码刨析

### 聚合模式 compose 函数

```js
function f1(params) {
  console.log(params, 'f1');
  return params;
}
function f2(params) {
  console.log(params, 'f2');
  return params;
}
function f3(params) {
  console.log(params, 'f3');
  return params;
}

// f1(f2(f3("omg")))

function compose(...funcs) {
  console.log(funcs);
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((pre, cur) => {
    return (...arg) => pre(cur(...arg));
  });
}

console.log(compose(f1, f2, f3)('omg'));
```

### 什么是 reducer

- reducer 就是一个纯函数，接受旧的 state 和 action 返回新的 state （可以联想 reduce 方法）
- 纯函数的目的是为了结果好预测
